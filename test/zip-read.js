// Test helper: reads a store-only zip from its central directory, the way an unzip tool does, and hands back every entry with
// its bytes, so tests can check names, sizes, CRCs and contents without a library.
import { crc32 } from '../src/zip.js';

const decoder = new TextDecoder();

export function readZip(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= 0; i -= 1) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('zip: no end of central directory record');
  const count = dv.getUint16(eocd + 10, true);
  const cdSize = dv.getUint32(eocd + 12, true);
  const cdOffset = dv.getUint32(eocd + 16, true);
  const entries = [];
  let at = cdOffset;
  for (let n = 0; n < count; n += 1) {
    if (dv.getUint32(at, true) !== 0x02014b50) throw new Error('zip: bad central directory header');
    const method = dv.getUint16(at + 10, true);
    const crc = dv.getUint32(at + 16, true);
    const size = dv.getUint32(at + 24, true);
    const nameLen = dv.getUint16(at + 28, true);
    const extraLen = dv.getUint16(at + 30, true);
    const commentLen = dv.getUint16(at + 32, true);
    const local = dv.getUint32(at + 42, true);
    const name = decoder.decode(bytes.subarray(at + 46, at + 46 + nameLen));
    if (dv.getUint32(local, true) !== 0x04034b50) throw new Error(`zip: bad local header for ${name}`);
    // The local header's own flags, CRC and size: real values for a known-size entry, zeros plus a data descriptor for a stream.
    const flags = dv.getUint16(local + 6, true);
    const localCrc = dv.getUint32(local + 14, true);
    const localSize = dv.getUint32(local + 22, true);
    const dataStart = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
    const data = bytes.subarray(dataStart, dataStart + size);
    const dd = dataStart + size;
    const descriptor = flags & 8 && dv.getUint32(dd, true) === 0x08074b50 ? { crc: dv.getUint32(dd + 4, true), size: dv.getUint32(dd + 8, true) } : null;
    entries.push({ name, method, size, crc, data, crcOk: crc32(data) === crc, flags, localCrc, localSize, descriptor });
    at += 46 + nameLen + extraLen + commentLen;
  }
  if (at - cdOffset !== cdSize) throw new Error('zip: central directory size does not match');
  return entries;
}

export const textOf = (entry) => decoder.decode(entry.data);
