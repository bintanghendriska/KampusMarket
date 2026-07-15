/**
 * Pure JavaScript/TypeScript implementation of the SHA-256 cryptographic hash function.
 * This function has zero dependencies and is fully compatible with any JavaScript engine,
 * including React Native's Hermes and JavaScriptCore (JSC) engines.
 */
export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number;

  const result = [];
  const words: number[] = [];
  const asciiLength = ascii[lengthProperty];
  
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  // Convert input string into a byte array
  const asciiChars: number[] = [];
  for (i = 0; i < asciiLength; i++) {
    asciiChars.push(ascii.charCodeAt(i));
  }
  
  // Append a single '1' bit
  asciiChars.push(0x80);
  
  // Pad with zeros until message length in bits is 448 (mod 512)
  while ((asciiChars.length * 8) % 512 !== 448) {
    asciiChars.push(0);
  }
  
  // Append original length in bits as a 64-bit big-endian integer
  const lengthInBits = asciiLength * 8;
  const lengthBuffer = new ArrayBuffer(8);
  const lengthView = new DataView(lengthBuffer);
  lengthView.setUint32(0, Math.floor(lengthInBits / maxWord));
  lengthView.setUint32(4, lengthInBits % maxWord);
  
  for (i = 0; i < 8; i++) {
    asciiChars.push(lengthView.getUint8(i));
  }
  
  // Break message into 512-bit chunks
  const totalWords = asciiChars.length / 4;
  for (i = 0; i < totalWords; i++) {
    words.push(
      (asciiChars[i * 4] << 24) |
      (asciiChars[i * 4 + 1] << 16) |
      (asciiChars[i * 4 + 2] << 8) |
      asciiChars[i * 4 + 3]
    );
  }
  
  // Process each chunk
  for (let chunkStart = 0; chunkStart < totalWords; chunkStart += 16) {
    const w = new Array(64);
    for (i = 0; i < 16; i++) {
      w[i] = words[chunkStart + i];
    }
    for (i = 16; i < 64; i++) {
      const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    
    let a = hash[0];
    let b = hash[1];
    let c = hash[2];
    let d = hash[3];
    let e = hash[4];
    let f = hash[5];
    let g = hash[6];
    let h = hash[7];
    
    for (i = 0; i < 64; i++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      
      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    
    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }
  
  for (i = 0; i < 8; i++) {
    let val = hash[i];
    if (val < 0) val += 0x100000000;
    let str = val.toString(16);
    while (str.length < 8) str = '0' + str;
    result.push(str);
  }
  
  return result.join('');
}
