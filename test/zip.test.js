import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ZipWriter, collectBytes, crc32, dosDateTime, entryName, zipStream } from '../src/zip.js';
import { readZip, textOf } from './zip-read.js';

const enc = (s) => new TextEncoder().encode(s);
const NOW = Date.parse('2026-11-01T10:20:30Z');

// Python's zipfile is the outside judge: it reads the central directory, checks every CRC and inflates nothing (store only).
const PY = `import json, sys, zipfile
z = zipfile.ZipFile(sys.argv[1])
print(json.dumps({'bad': z.testzip(), 'entries': [{'name': i.filename, 'size': i.file_size, 'crc': i.CRC, 'method': i.compress_type, 'flags': i.flag_bits,
  'when': list(i.date_time), 'text': z.read(i).decode('utf-8') if i.file_size < 200 else None} for i in z.infolist()]}))`;
function pythonCheck(bytes) {
  const path = join(mkdtempSync(join(tmpdir(), 'tll-zip-')), 'out.zip');
  writeFileSync(path, bytes);
  const report = JSON.parse(execFileSync('python3', ['-I', '-c', PY, path], { encoding: 'utf8' }));
  let unzip = 'skipped';
  try { unzip = execFileSync('unzip', ['-t', path], { encoding: 'utf8' }); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  return { report, unzip };
}

describe('crc32', () => {
  it('matches the known value for the fox sentence, and continues across chunks', () => {
    const fox = enc('The quick brown fox jumps over the lazy dog');
    expect(crc32(fox)).toBe(0x414fa339);
    expect(crc32(enc(''))).toBe(0);
    expect(crc32(fox.subarray(9), crc32(fox.subarray(0, 9)))).toBe(0x414fa339);
  });
});

describe('store-only streaming zip', () => {
  it('writes a zip that Python zipfile and unzip accept, with the right names, sizes, CRCs and bytes', async () => {
    const big = new Uint8Array(300000);
    for (let i = 0; i < big.length; i += 1) big[i] = (i * 7) & 0xff;
    const stream = new ReadableStream({ start(c) { c.enqueue(big.slice(0, 100000)); c.enqueue(big.slice(100000, 250000)); c.enqueue(big.slice(250000)); c.close(); } });
    async function* parts() { yield enc('one,'); yield enc('two'); }
    const bytes = await collectBytes(zipStream(async (zip) => {
      await zip.file('that-layover-life/README.txt', 'hello world\n');
      await zip.file('that-layover-life/photos/a/b.bin', stream);
      await zip.file('that-layover-life/empty.txt', '');
      await zip.file('that-layover-life/parts.csv', parts());
      await zip.file('that-layover-life/ünïcode.txt', 'ok');
    }, { now: NOW }));

    const { report, unzip } = pythonCheck(bytes);
    expect(report.bad).toBeNull();
    expect(report.entries.map((e) => [e.name, e.size, e.method])).toEqual([
      ['that-layover-life/README.txt', 12, 0], ['that-layover-life/photos/a/b.bin', 300000, 0], ['that-layover-life/empty.txt', 0, 0],
      ['that-layover-life/parts.csv', 7, 0], ['that-layover-life/ünïcode.txt', 2, 0],
    ]);
    expect(report.entries[0]).toMatchObject({ text: 'hello world\n', crc: crc32(enc('hello world\n')), flags: 0x0800, when: [2026, 11, 1, 10, 20, 30] });
    expect(report.entries[1].flags).toBe(0x0808);
    expect(report.entries[3].text).toBe('one,two');
    if (unzip !== 'skipped') expect(unzip).toMatch(/No errors detected/);

    // Our own reader sees the same. A string or empty entry has its real CRC and size in the local header and no descriptor;
    // a stream or async iterable entry has zeros there and the data descriptor after the bytes carries the real values.
    const entries = readZip(bytes);
    expect(entries.every((e) => e.crcOk)).toBe(true);
    expect(entries.map((e) => e.flags)).toEqual([0x0800, 0x0808, 0x0800, 0x0808, 0x0800]);
    for (const e of entries) {
      if (e.flags & 8) expect([e.localCrc, e.localSize, e.descriptor]).toEqual([0, 0, { crc: e.crc, size: e.size }]);
      else expect([e.localCrc, e.localSize, e.descriptor]).toEqual([e.crc, e.size, null]);
    }
    const photo = entries.find((e) => e.name === 'that-layover-life/photos/a/b.bin');
    expect(photo.data.length).toBe(300000);
    expect(photo.data.every((b, i) => b === ((i * 7) & 0xff))).toBe(true);
    expect(textOf(entries[4])).toBe('ok');
  });

  it('streams: bytes come out before the producer is done, and a producer error ends the stream with an error, not a truncated file', async () => {
    let release;
    const gate = new Promise((r) => { release = r; });
    const readable = zipStream(async (zip) => { await zip.file('first.txt', 'first'); await gate; await zip.file('second.txt', 'second'); }, { now: NOW });
    const reader = readable.getReader();
    const first = await reader.read();
    expect(first.done).toBe(false);
    expect(first.value.length).toBeGreaterThan(0);
    release();
    reader.releaseLock();
    const rest = await collectBytes(readable);
    expect(rest.length).toBeGreaterThan(0);

    const broken = zipStream(async (zip) => { await zip.file('a.txt', 'a'); throw new Error('photo source died'); }, { now: NOW });
    await expect(collectBytes(broken)).rejects.toThrow('photo source died');
  });

  it('cleans entry names and refuses what a zip cannot hold', async () => {
    expect(entryName('\\photos\\a\\\\b.jpg')).toBe('photos/a/b.jpg');
    expect(entryName('/x\u0000y.txt')).toBe('xy.txt');
    const zip = new ZipWriter(() => {}, { now: NOW });
    await expect(zip.file('', 'x')).rejects.toThrow(/file name/);
    await expect(zip.file('folder/', 'x')).rejects.toThrow(/file name/);
    await zip.finish();
    await expect(zip.file('late.txt', 'x')).rejects.toThrow(/finished/);
    expect(dosDateTime(NOW)).toEqual({ time: (10 << 11) | (20 << 5) | 15, date: ((2026 - 1980) << 9) | (11 << 5) | 1 });
  });
});
