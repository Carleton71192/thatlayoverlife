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
// CPU: each entry's local header and name are built as one array, and everything is gathered in a 64 KB buffer before it reaches
// the stream, so an entry's header, name and bytes go out together and a records zip of a few hundred small files costs tens of
// stream writes, not hundreds (130 to 380 before this; the src/export.js header has the timings).

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

/** How many bytes gather before one write reaches the stream; a piece this large or larger goes out on its own, uncopied. */
export const WRITE_BUFFER = 64 * 1024;

/**
 * One array from little-endian words and byte runs: an item is [2, value] or [4, value] for a word, or a Uint8Array to copy in.
 * Builds a whole zip record (a header and its name) in one allocation instead of one spread array per word.
 */
function record(items) {
  let size = 0;
  for (const it of items) size += it instanceof Uint8Array ? it.length : it[0];
  const out = new Uint8Array(size);
  const dv = new DataView(out.buffer);
  let at = 0;
  for (const it of items) {
    if (it instanceof Uint8Array) { out.set(it, at); at += it.length; continue; }
    if (it[0] === 2) dv.setUint16(at, it[1] & 0xffff, true); else dv.setUint32(at, it[1] >>> 0, true);
    at += it[0];
  }
  return out;
}

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
    this.buffer = new Uint8Array(WRITE_BUFFER);
    this.buffered = 0;
  }

  /** Hands what has gathered in the buffer to write(), as a copy: the buffer is reused, the written chunk may still be queued. */
  async flush() {
    if (!this.buffered) return;
    const chunk = this.buffer.slice(0, this.buffered);
    this.buffered = 0;
    await this.write(chunk);
  }

  /** Queues bytes at the archive position: small pieces gather in the buffer, a piece the buffer cannot hold goes out after it. */
  async emit(chunk) {
    if (!chunk.length) return;
    this.offset += chunk.length;
    if (this.offset > MAX32) throw new Error('zip: archive is over 4 GB, which a classic zip cannot hold');
    if (this.buffered + chunk.length <= WRITE_BUFFER) { this.buffer.set(chunk, this.buffered); this.buffered += chunk.length; return; }
    await this.flush();
    if (chunk.length >= WRITE_BUFFER) { await this.write(chunk); return; }
    this.buffer.set(chunk, 0);
    this.buffered = chunk.length;
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
    // Local file header and name as one record. With a known size the real values go here; otherwise zeros (bit 3) and a data
    // descriptor after the bytes. The record and the bytes meet in the write buffer, so the stream sees them together.
    await this.emit(record([
      [4, 0x04034b50], [2, 20], [2, flags], [2, 0], [2, this.stamp.time], [2, this.stamp.date],
      [4, crc], [4, size], [4, size], [2, nameBytes.length], [2, 0], nameBytes,
    ]));
    if (known) {
      await this.emit(known);
    } else {
      for await (const chunk of chunksOf(data)) {
        crc = crc32(chunk, crc);
        size += chunk.length;
        if (size > MAX32) throw new Error(`zip: ${name} is over 4 GB`);
        await this.emit(chunk);
      }
      await this.emit(record([[4, 0x08074b50], [4, crc], [4, size], [4, size]]));
    }
    this.entries.push({ nameBytes, crc, size, headerOffset, flags });
    return { name, size, crc };
  }

  /** Writes the central directory and the end record, then flushes the buffer. Call once, after the last file. */
  async finish() {
    if (this.finished) return;
    this.finished = true;
    const start = this.offset;
    for (const e of this.entries) {
      await this.emit(record([
        [4, 0x02014b50], [2, 20], [2, 20], [2, e.flags], [2, 0], [2, this.stamp.time], [2, this.stamp.date],
        [4, e.crc], [4, e.size], [4, e.size], [2, e.nameBytes.length], [2, 0], [2, 0], [2, 0], [2, 0], [4, 0],
        [4, e.headerOffset], e.nameBytes,
      ]));
    }
    const size = this.offset - start;
    await this.emit(record([
      [4, 0x06054b50], [2, 0], [2, 0], [2, this.entries.length], [2, this.entries.length], [4, size], [4, start], [2, 0],
    ]));
    await this.flush();
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
