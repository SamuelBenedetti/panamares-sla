const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

function createPng(width, height, r, g, b, r2, g2, b2, label) {
  const rowSize = width * 3;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  for (let y = 0; y < height; y++) {
    rawData[y * (rowSize + 1)] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const offset = y * (rowSize + 1) + 1 + x * 3;
      // gradient: blend between two colors top-to-bottom
      const t = y / height;
      rawData[offset] = Math.round(r + (r2 - r) * t);
      rawData[offset + 1] = Math.round(g + (g2 - g) * t);
      rawData[offset + 2] = Math.round(b + (b2 - b) * t);
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c;
    }
    let crc = 0xffffffff;
    for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, "ascii");
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const crcBuf = Buffer.concat([typeBytes, data]);
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(crcBuf));
    return Buffer.concat([len, typeBytes, data, crcVal]);
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // RGB
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  return Buffer.concat([
    pngHeader,
    chunk("IHDR", ihdrData),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const publicDir = path.join(__dirname, "../public");

// Property placeholder: dark navy to slate gradient (600x400)
const propertyPng = createPng(600, 400, 30, 58, 95, 71, 85, 105);
fs.writeFileSync(path.join(publicDir, "placeholder-property.jpg"), propertyPng);
console.log("Created placeholder-property.jpg");

// Agent placeholder: circular-ish neutral gradient (400x400)
const agentPng = createPng(400, 400, 100, 116, 139, 148, 163, 184);
fs.writeFileSync(path.join(publicDir, "placeholder-agent.jpg"), agentPng);
console.log("Created placeholder-agent.jpg");
