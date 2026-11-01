// A small store-only zip writer that streams (1 Nov 2026, Value Playbook Phase 1B: the Worker makes the "Download everything"
// records zip, the browser only downloads a file). No compression: store-only keeps CPU time low, which matters on the Workers
// Free plan. A string or byte entry has its size known up front, so its local header carries the real size and CRC and no data
// descriptor follows (the layout every unzip tool, streaming readers included, handles). A stream or async iterable entry uses a
// data descriptor (general purpose bit 3): the local header is written before the size or CRC is known, the bytes pass straight
// through and the descriptor after them carries the values; the central directory at the end carries them for every entry.
// Plain JS, no library. Classic zip only (under 4 GB and 65,535 entries), which is far beyond any member's copy.
//
//   const readable = zipStream(async (zip) => { await zip.file('a.txt', 'hello'); await zip.file('b.jpg', response.body); });
//   new Response(readable, { headers: { 'Content-Type': 'application/zip' } });
//
// Back-pressure: zipStream writes through a TransformStream, so a slow download slows the producer instead of buffering it.

const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

/** CRC32 (IEEE) of bytes, continuing from a previous value when given. Returns an unsigned 32-bit number. */
export function crc32(bytes, previous = 0) {
  let c = (previous ^ 0xffffffff) >>> 0;
  for (let i = 0; i < bytes.length; i += 1) c = TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const MAX32 = 0xffffffff;
const encoder = new TextEncoder();

/** MS-DOS time and date words for a timestamp (UTC), the only clock a classic zip entry has. */
export function dosDateTime(now = Date.now()) {
  const d = new Date(now);
  const year = Math.min(Math.max(d.getUTCFullYear(), 1980), 2107);
  const time = (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5) | (d.getUTCSeconds() >> 1);
  const date = ((year - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate();
  return { time, date };
}

function u16(v) { return [v & 0xff, (v >>> 8) & 0xff]; }
function u32(v) { return [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff]; }

/** Turns a string, bytes, ArrayBuffer, ReadableStream, Blob or async iterable into an async iterable of Uint8Array chunks. */
async function* chunksOf(data) {
  if (data == null) return;
  if (typeof data === 'string') { yield encoder.encode(data); return; }
  if (data instanceof Uint8Array) { yield data; return; }
  if (data instanceof ArrayBuffer) { yield new Uint8Array(data); return; }
  if (typeof data.getReader === 'function') {
    const reader = data.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) return;
        if (value?.length) yield value instanceof Uint8Array ? value : new Uint8Array(value);
      }
    } finally { reader.releaseLock(); }
    return;
  }
  if (typeof data.stream === 'function') { yield* chunksOf(data.stream()); return; }
  for await (const part of data) yield part instanceof Uint8Array ? part : encoder.encode(String(part));
}

/** Zip entry names use forward slashes and never start with one; control characters are dropped. */
export function entryName(name) {
  return String(name || '').replace(/\\/g, '/').replace(/[\u0000-\u001f]/g, '').replace(/^\/+/, '').replace(/\/{2,}/g, '/');
}

export class ZipWriter {
  /** @param {(chunk: Uint8Array) => Promise<void> | void} write receives every byte of the archive, in order */
  constructor(write, { now = Date.now() } = {}) {
    this.write = write;
    this.offset = 0;
    this.entries = [];
    this.stamp = dosDateTime(now);
    this.finished = false;
  }

  async emit(bytes) {
    const chunk = bytes instanceof Uint8Array ? bytes : Uint8Array.from(bytes);
    if (!chunk.length) return;
    await this.write(chunk);
    this.offset += chunk.length;
    if (this.offset > MAX32) throw new Error('zip: archive is over 4 GB, which a classic zip cannot hold');
  }

  /**
   * Adds one stored entry. `data` may be a string, bytes, an ArrayBuffer, a ReadableStream, a Blob or an async iterable of bytes.
   * String and byte entries are written with their real size and CRC in the local header; the rest use a data descriptor.
   */
  async file(rawName, data) {
    if (this.finished) throw new Error('zip: finished');
    const name = entryName(rawName);
    if (!name || name.endsWith('/')) throw new Error('zip: entry needs a file name');
    if (this.entries.length >= 65535) throw new Error('zip: too many entries for a classic zip');
    const nameBytes = encoder.encode(name);
    const headerOffset = this.offset;
    const known = data == null ? new Uint8Array(0) : typeof data === 'string' ? encoder.encode(data) : data instanceof Uint8Array ? data : data instanceof ArrayBuffer ? new Uint8Array(data) : null;
    // Bit 11 (UTF-8 names) on every entry; bit 3 (data descriptor) only when the size is not known up front.
    const flags = known ? 0x0800 : 0x0808;
    let crc = known ? crc32(known) : 0;
    let size = known ? known.length : 0;
    if (size > MAX32) throw new Error(`zip: ${name} is over 4 GB`);
    // Local file header. With a known size the real values go here; otherwise zeros (bit 3) and a data descriptor after the bytes.
    await this.emit([
      ...u32(0x04034b50), ...u16(20), ...u16(flags), ...u16(0), ...u16(this.stamp.time), ...u16(this.stamp.date),
      ...u32(crc), ...u32(size), ...u32(size), ...u16(nameBytes.length), ...u16(0),
    ]);
    await this.emit(nameBytes);
    if (known) {
      await this.emit(known);
    } else {
      for await (const chunk of chunksOf(data)) {
        crc = crc32(chunk, crc);
        size += chunk.length;
        if (size > MAX32) throw new Error(`zip: ${name} is over 4 GB`);
        await this.emit(chunk);
      }
      await this.emit([...u32(0x08074b50), ...u32(crc), ...u32(size), ...u32(size)]);
    }
    this.entries.push({ nameBytes, crc, size, headerOffset, flags });
    return { name, size, crc };
  }

  /** Writes the central directory and the end record. Call once, after the last file. */
  async finish() {
    if (this.finished) return;
    this.finished = true;
    const start = this.offset;
    for (const e of this.entries) {
      await this.emit([
        ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(e.flags), ...u16(0), ...u16(this.stamp.time), ...u16(this.stamp.date),
        ...u32(e.crc), ...u32(e.size), ...u32(e.size), ...u16(e.nameBytes.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0),
        ...u32(e.headerOffset),
      ]);
      await this.emit(e.nameBytes);
    }
    const size = this.offset - start;
    await this.emit([
      ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(this.entries.length), ...u16(this.entries.length), ...u32(size), ...u32(start), ...u16(0),
    ]);
  }
}

/**
 * A ReadableStream of a zip built by `build(zip)`. The producer runs as the stream is read; when it throws, the stream errors,
 * so a reader never gets a silently truncated archive. `after` runs once the end record is written and before the stream closes.
 */
export function zipStream(build, { now = Date.now(), after } = {}) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const zip = new ZipWriter((chunk) => writer.write(chunk), { now });
  (async () => {
    try {
      await build(zip);
      await zip.finish();
      if (after) await after();
      await writer.close();
    } catch (error) {
      await writer.abort(error).catch(() => {});
    }
  })();
  return readable;
}

/** All bytes of a ReadableStream (or async iterable) in one Uint8Array, for tests and small archives. */
export async function collectBytes(source) {
  const parts = [];
  let total = 0;
  for await (const chunk of chunksOf(source)) { parts.push(chunk); total += chunk.length; }
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}
