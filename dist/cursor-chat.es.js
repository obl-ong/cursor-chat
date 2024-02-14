var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var style = "";
const create$5 = () => /* @__PURE__ */ new Map();
const copy = (m) => {
  const r = create$5();
  m.forEach((v, k) => {
    r.set(k, v);
  });
  return r;
};
const setIfUndefined = (map2, key, createT) => {
  let set = map2.get(key);
  if (set === void 0) {
    map2.set(key, set = createT());
  }
  return set;
};
const map = (m, f) => {
  const res = [];
  for (const [key, value] of m) {
    res.push(f(value, key));
  }
  return res;
};
const any = (m, f) => {
  for (const [key, value] of m) {
    if (f(value, key)) {
      return true;
    }
  }
  return false;
};
const create$4 = () => /* @__PURE__ */ new Set();
const last = (arr) => arr[arr.length - 1];
const appendTo = (dest, src) => {
  for (let i = 0; i < src.length; i++) {
    dest.push(src[i]);
  }
};
const from = Array.from;
const isArray = Array.isArray;
class Observable {
  constructor() {
    this._observers = create$5();
  }
  on(name, f) {
    setIfUndefined(this._observers, name, create$4).add(f);
  }
  once(name, f) {
    const _f = (...args) => {
      this.off(name, _f);
      f(...args);
    };
    this.on(name, _f);
  }
  off(name, f) {
    const observers = this._observers.get(name);
    if (observers !== void 0) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }
  emit(name, args) {
    return from((this._observers.get(name) || create$5()).values()).forEach((f) => f(...args));
  }
  destroy() {
    this._observers = create$5();
  }
}
const floor = Math.floor;
const abs = Math.abs;
const min = (a, b) => a < b ? a : b;
const max = (a, b) => a > b ? a : b;
const isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;
const BIT1 = 1;
const BIT2 = 2;
const BIT3 = 4;
const BIT4 = 8;
const BIT6 = 32;
const BIT7 = 64;
const BIT8 = 128;
const BITS5 = 31;
const BITS6 = 63;
const BITS7 = 127;
const BITS31 = 2147483647;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
const fromCharCode = String.fromCharCode;
const toLowerCase = (s) => s.toLowerCase();
const trimLeftRegex = /^\s*/g;
const trimLeft = (s) => s.replace(trimLeftRegex, "");
const fromCamelCaseRegex = /([A-Z])/g;
const fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match) => `${separator}${toLowerCase(match)}`));
const _encodeUtf8Polyfill = (str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = encodedString.codePointAt(i);
  }
  return buf;
};
const utf8TextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
const _encodeUtf8Native = (str) => utf8TextEncoder.encode(str);
const encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;
let utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  utf8TextDecoder = null;
}
class Encoder {
  constructor() {
    this.cpos = 0;
    this.cbuf = new Uint8Array(100);
    this.bufs = [];
  }
}
const createEncoder = () => new Encoder();
const length$1 = (encoder) => {
  let len = encoder.cpos;
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length;
  }
  return len;
};
const toUint8Array = (encoder) => {
  const uint8arr = new Uint8Array(length$1(encoder));
  let curPos = 0;
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i];
    uint8arr.set(d, curPos);
    curPos += d.length;
  }
  uint8arr.set(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
  return uint8arr;
};
const verifyLen = (encoder, len) => {
  const bufferLen = encoder.cbuf.length;
  if (bufferLen - encoder.cpos < len) {
    encoder.bufs.push(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos));
    encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
    encoder.cpos = 0;
  }
};
const write = (encoder, num) => {
  const bufferLen = encoder.cbuf.length;
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(bufferLen * 2);
    encoder.cpos = 0;
  }
  encoder.cbuf[encoder.cpos++] = num;
};
const writeUint8 = write;
const writeVarUint = (encoder, num) => {
  while (num > BITS7) {
    write(encoder, BIT8 | BITS7 & num);
    num = floor(num / 128);
  }
  write(encoder, BITS7 & num);
};
const writeVarInt = (encoder, num) => {
  const isNegative = isNegativeZero(num);
  if (isNegative) {
    num = -num;
  }
  write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | BITS6 & num);
  num = floor(num / 64);
  while (num > 0) {
    write(encoder, (num > BITS7 ? BIT8 : 0) | BITS7 & num);
    num = floor(num / 128);
  }
};
const _strBuffer = new Uint8Array(3e4);
const _maxStrBSize = _strBuffer.length / 3;
const _writeVarStringNative = (encoder, str) => {
  if (str.length < _maxStrBSize) {
    const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
    writeVarUint(encoder, written);
    for (let i = 0; i < written; i++) {
      write(encoder, _strBuffer[i]);
    }
  } else {
    writeVarUint8Array(encoder, encodeUtf8(str));
  }
};
const _writeVarStringPolyfill = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    write(encoder, encodedString.codePointAt(i));
  }
};
const writeVarString = utf8TextEncoder && utf8TextEncoder.encodeInto ? _writeVarStringNative : _writeVarStringPolyfill;
const writeUint8Array = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length;
  const cpos = encoder.cpos;
  const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
  const rightCopyLen = uint8Array.length - leftCopyLen;
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
  encoder.cpos += leftCopyLen;
  if (rightCopyLen > 0) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
    encoder.cpos = rightCopyLen;
  }
};
const writeVarUint8Array = (encoder, uint8Array) => {
  writeVarUint(encoder, uint8Array.byteLength);
  writeUint8Array(encoder, uint8Array);
};
const writeOnDataView = (encoder, len) => {
  verifyLen(encoder, len);
  const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
  encoder.cpos += len;
  return dview;
};
const writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
const writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
const writeBigInt64 = (encoder, num) => writeOnDataView(encoder, 8).setBigInt64(0, num, false);
const floatTestBed = new DataView(new ArrayBuffer(4));
const isFloat32 = (num) => {
  floatTestBed.setFloat32(0, num);
  return floatTestBed.getFloat32(0) === num;
};
const writeAny = (encoder, data) => {
  switch (typeof data) {
    case "string":
      write(encoder, 119);
      writeVarString(encoder, data);
      break;
    case "number":
      if (isInteger(data) && abs(data) <= BITS31) {
        write(encoder, 125);
        writeVarInt(encoder, data);
      } else if (isFloat32(data)) {
        write(encoder, 124);
        writeFloat32(encoder, data);
      } else {
        write(encoder, 123);
        writeFloat64(encoder, data);
      }
      break;
    case "bigint":
      write(encoder, 122);
      writeBigInt64(encoder, data);
      break;
    case "object":
      if (data === null) {
        write(encoder, 126);
      } else if (isArray(data)) {
        write(encoder, 117);
        writeVarUint(encoder, data.length);
        for (let i = 0; i < data.length; i++) {
          writeAny(encoder, data[i]);
        }
      } else if (data instanceof Uint8Array) {
        write(encoder, 116);
        writeVarUint8Array(encoder, data);
      } else {
        write(encoder, 118);
        const keys2 = Object.keys(data);
        writeVarUint(encoder, keys2.length);
        for (let i = 0; i < keys2.length; i++) {
          const key = keys2[i];
          writeVarString(encoder, key);
          writeAny(encoder, data[key]);
        }
      }
      break;
    case "boolean":
      write(encoder, data ? 120 : 121);
      break;
    default:
      write(encoder, 127);
  }
};
class RleEncoder extends Encoder {
  constructor(writer) {
    super();
    this.w = writer;
    this.s = null;
    this.count = 0;
  }
  write(v) {
    if (this.s === v) {
      this.count++;
    } else {
      if (this.count > 0) {
        writeVarUint(this, this.count - 1);
      }
      this.count = 1;
      this.w(this, v);
      this.s = v;
    }
  }
}
const flushUintOptRleEncoder = (encoder) => {
  if (encoder.count > 0) {
    writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2);
    }
  }
};
class UintOptRleEncoder {
  constructor() {
    this.encoder = new Encoder();
    this.s = 0;
    this.count = 0;
  }
  write(v) {
    if (this.s === v) {
      this.count++;
    } else {
      flushUintOptRleEncoder(this);
      this.count = 1;
      this.s = v;
    }
  }
  toUint8Array() {
    flushUintOptRleEncoder(this);
    return toUint8Array(this.encoder);
  }
}
const flushIntDiffOptRleEncoder = (encoder) => {
  if (encoder.count > 0) {
    const encodedDiff = encoder.diff * 2 + (encoder.count === 1 ? 0 : 1);
    writeVarInt(encoder.encoder, encodedDiff);
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2);
    }
  }
};
class IntDiffOptRleEncoder {
  constructor() {
    this.encoder = new Encoder();
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }
  write(v) {
    if (this.diff === v - this.s) {
      this.s = v;
      this.count++;
    } else {
      flushIntDiffOptRleEncoder(this);
      this.count = 1;
      this.diff = v - this.s;
      this.s = v;
    }
  }
  toUint8Array() {
    flushIntDiffOptRleEncoder(this);
    return toUint8Array(this.encoder);
  }
}
class StringEncoder {
  constructor() {
    this.sarr = [];
    this.s = "";
    this.lensE = new UintOptRleEncoder();
  }
  write(string) {
    this.s += string;
    if (this.s.length > 19) {
      this.sarr.push(this.s);
      this.s = "";
    }
    this.lensE.write(string.length);
  }
  toUint8Array() {
    const encoder = new Encoder();
    this.sarr.push(this.s);
    this.s = "";
    writeVarString(encoder, this.sarr.join(""));
    writeUint8Array(encoder, this.lensE.toUint8Array());
    return toUint8Array(encoder);
  }
}
const create$3 = (s) => new Error(s);
const methodUnimplemented = () => {
  throw create$3("Method unimplemented");
};
const unexpectedCase = () => {
  throw create$3("Unexpected case");
};
const errorUnexpectedEndOfArray = create$3("Unexpected end of array");
const errorIntegerOutOfRange = create$3("Integer out of Range");
class Decoder {
  constructor(uint8Array) {
    this.arr = uint8Array;
    this.pos = 0;
  }
}
const createDecoder = (uint8Array) => new Decoder(uint8Array);
const hasContent = (decoder) => decoder.pos !== decoder.arr.length;
const readUint8Array = (decoder, len) => {
  const view = new Uint8Array(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
  decoder.pos += len;
  return view;
};
const readVarUint8Array = (decoder) => readUint8Array(decoder, readVarUint(decoder));
const readUint8 = (decoder) => decoder.arr[decoder.pos++];
const readVarUint = (decoder) => {
  let num = 0;
  let mult = 1;
  const len = decoder.arr.length;
  while (decoder.pos < len) {
    const r = decoder.arr[decoder.pos++];
    num = num + (r & BITS7) * mult;
    mult *= 128;
    if (r < BIT8) {
      return num;
    }
    if (num > MAX_SAFE_INTEGER) {
      throw errorIntegerOutOfRange;
    }
  }
  throw errorUnexpectedEndOfArray;
};
const readVarInt = (decoder) => {
  let r = decoder.arr[decoder.pos++];
  let num = r & BITS6;
  let mult = 64;
  const sign = (r & BIT7) > 0 ? -1 : 1;
  if ((r & BIT8) === 0) {
    return sign * num;
  }
  const len = decoder.arr.length;
  while (decoder.pos < len) {
    r = decoder.arr[decoder.pos++];
    num = num + (r & BITS7) * mult;
    mult *= 128;
    if (r < BIT8) {
      return sign * num;
    }
    if (num > MAX_SAFE_INTEGER) {
      throw errorIntegerOutOfRange;
    }
  }
  throw errorUnexpectedEndOfArray;
};
const _readVarStringPolyfill = (decoder) => {
  let remainingLen = readVarUint(decoder);
  if (remainingLen === 0) {
    return "";
  } else {
    let encodedString = String.fromCodePoint(readUint8(decoder));
    if (--remainingLen < 100) {
      while (remainingLen--) {
        encodedString += String.fromCodePoint(readUint8(decoder));
      }
    } else {
      while (remainingLen > 0) {
        const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
        const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
        decoder.pos += nextLen;
        encodedString += String.fromCodePoint.apply(null, bytes);
        remainingLen -= nextLen;
      }
    }
    return decodeURIComponent(escape(encodedString));
  }
};
const _readVarStringNative = (decoder) => utf8TextDecoder.decode(readVarUint8Array(decoder));
const readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;
const readFromDataView = (decoder, len) => {
  const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
  decoder.pos += len;
  return dv;
};
const readFloat32 = (decoder) => readFromDataView(decoder, 4).getFloat32(0, false);
const readFloat64 = (decoder) => readFromDataView(decoder, 8).getFloat64(0, false);
const readBigInt64 = (decoder) => readFromDataView(decoder, 8).getBigInt64(0, false);
const readAnyLookupTable = [
  (decoder) => void 0,
  (decoder) => null,
  readVarInt,
  readFloat32,
  readFloat64,
  readBigInt64,
  (decoder) => false,
  (decoder) => true,
  readVarString,
  (decoder) => {
    const len = readVarUint(decoder);
    const obj = {};
    for (let i = 0; i < len; i++) {
      const key = readVarString(decoder);
      obj[key] = readAny(decoder);
    }
    return obj;
  },
  (decoder) => {
    const len = readVarUint(decoder);
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(readAny(decoder));
    }
    return arr;
  },
  readVarUint8Array
];
const readAny = (decoder) => readAnyLookupTable[127 - readUint8(decoder)](decoder);
class RleDecoder extends Decoder {
  constructor(uint8Array, reader) {
    super(uint8Array);
    this.reader = reader;
    this.s = null;
    this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = this.reader(this);
      if (hasContent(this)) {
        this.count = readVarUint(this) + 1;
      } else {
        this.count = -1;
      }
    }
    this.count--;
    return this.s;
  }
}
class UintOptRleDecoder extends Decoder {
  constructor(uint8Array) {
    super(uint8Array);
    this.s = 0;
    this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = readVarInt(this);
      const isNegative = isNegativeZero(this.s);
      this.count = 1;
      if (isNegative) {
        this.s = -this.s;
        this.count = readVarUint(this) + 2;
      }
    }
    this.count--;
    return this.s;
  }
}
class IntDiffOptRleDecoder extends Decoder {
  constructor(uint8Array) {
    super(uint8Array);
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }
  read() {
    if (this.count === 0) {
      const diff = readVarInt(this);
      const hasCount = diff & 1;
      this.diff = floor(diff / 2);
      this.count = 1;
      if (hasCount) {
        this.count = readVarUint(this) + 2;
      }
    }
    this.s += this.diff;
    this.count--;
    return this.s;
  }
}
class StringDecoder {
  constructor(uint8Array) {
    this.decoder = new UintOptRleDecoder(uint8Array);
    this.str = readVarString(this.decoder);
    this.spos = 0;
  }
  read() {
    const end = this.spos + this.decoder.read();
    const res = this.str.slice(this.spos, end);
    this.spos = end;
    return res;
  }
}
const getRandomValues = crypto.getRandomValues.bind(crypto);
const uint32 = () => getRandomValues(new Uint32Array(1))[0];
const uuidv4Template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
const uuidv4 = () => uuidv4Template.replace(/[018]/g, (c) => (c ^ uint32() & 15 >> c / 4).toString(16));
const getUnixTime = Date.now;
const create$2 = (f) => new Promise(f);
Promise.all.bind(Promise);
const undefinedToNull = (v) => v === void 0 ? null : v;
class VarStoragePolyfill {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  setItem(key, newValue) {
    this.map.set(key, newValue);
  }
  getItem(key) {
    return this.map.get(key);
  }
}
let _localStorage = new VarStoragePolyfill();
let usePolyfill = true;
try {
  if (typeof localStorage !== "undefined" && localStorage) {
    _localStorage = localStorage;
    usePolyfill = false;
  }
} catch (e) {
}
const varStorage = _localStorage;
const onChange = (eventHandler) => usePolyfill || addEventListener("storage", eventHandler);
const offChange = (eventHandler) => usePolyfill || removeEventListener("storage", eventHandler);
const assign = Object.assign;
const keys = Object.keys;
const forEach = (obj, f) => {
  for (const key in obj) {
    f(obj[key], key);
  }
};
const length = (obj) => keys(obj).length;
const isEmpty = (obj) => {
  for (const _k in obj) {
    return false;
  }
  return true;
};
const every = (obj, f) => {
  for (const key in obj) {
    if (!f(obj[key], key)) {
      return false;
    }
  }
  return true;
};
const hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const equalFlat = (a, b) => a === b || length(a) === length(b) && every(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && b[key] === val);
const callAll = (fs, args, i = 0) => {
  try {
    for (; i < fs.length; i++) {
      fs[i](...args);
    }
  } finally {
    if (i < fs.length) {
      callAll(fs, args, i + 1);
    }
  }
};
const id = (a) => a;
const equalityStrict = (a, b) => a === b;
const equalityDeep = (a, b) => {
  if (a == null || b == null) {
    return equalityStrict(a, b);
  }
  if (a.constructor !== b.constructor) {
    return false;
  }
  if (a === b) {
    return true;
  }
  switch (a.constructor) {
    case ArrayBuffer:
      a = new Uint8Array(a);
      b = new Uint8Array(b);
    case Uint8Array: {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      break;
    }
    case Set: {
      if (a.size !== b.size) {
        return false;
      }
      for (const value of a) {
        if (!b.has(value)) {
          return false;
        }
      }
      break;
    }
    case Map: {
      if (a.size !== b.size) {
        return false;
      }
      for (const key of a.keys()) {
        if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
          return false;
        }
      }
      break;
    }
    case Object:
      if (length(a) !== length(b)) {
        return false;
      }
      for (const key in a) {
        if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) {
          return false;
        }
      }
      break;
    case Array:
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (!equalityDeep(a[i], b[i])) {
          return false;
        }
      }
      break;
    default:
      return false;
  }
  return true;
};
const isOneOf = (value, options) => options.includes(value);
const isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && !isNode;
typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
let params;
const computeParams = () => {
  if (params === void 0) {
    if (isNode) {
      params = create$5();
      const pargs = process.argv;
      let currParamName = null;
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i];
        if (parg[0] === "-") {
          if (currParamName !== null) {
            params.set(currParamName, "");
          }
          currParamName = parg;
        } else {
          if (currParamName !== null) {
            params.set(currParamName, parg);
            currParamName = null;
          }
        }
      }
      if (currParamName !== null) {
        params.set(currParamName, "");
      }
    } else if (typeof location === "object") {
      params = create$5();
      (location.search || "?").slice(1).split("&").forEach((kv) => {
        if (kv.length !== 0) {
          const [key, value] = kv.split("=");
          params.set(`--${fromCamelCase(key, "-")}`, value);
          params.set(`-${fromCamelCase(key, "-")}`, value);
        }
      });
    } else {
      params = create$5();
    }
  }
  return params;
};
const hasParam = (name) => computeParams().has(name);
const getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase()]) : undefinedToNull(varStorage.getItem(name));
const hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
hasConf("production");
const forceColor = isNode && isOneOf({}.FORCE_COLOR, ["true", "1", "2"]);
const supportsColor = !hasParam("no-colors") && (!isNode || process.stdout.isTTY || forceColor) && (!isNode || hasParam("color") || forceColor || getVariable("COLORTERM") !== null || (getVariable("TERM") || "").includes("color"));
const createUint8ArrayFromLen = (len) => new Uint8Array(len);
const createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length2) => new Uint8Array(buffer, byteOffset, length2);
const createUint8ArrayFromArrayBuffer = (buffer) => new Uint8Array(buffer);
const toBase64Browser = (bytes) => {
  let s = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    s += fromCharCode(bytes[i]);
  }
  return btoa(s);
};
const toBase64Node = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
const fromBase64Browser = (s) => {
  const a = atob(s);
  const bytes = createUint8ArrayFromLen(a.length);
  for (let i = 0; i < a.length; i++) {
    bytes[i] = a.charCodeAt(i);
  }
  return bytes;
};
const fromBase64Node = (s) => {
  const buf = Buffer.from(s, "base64");
  return createUint8ArrayViewFromArrayBuffer(buf.buffer, buf.byteOffset, buf.byteLength);
};
const toBase64 = isBrowser ? toBase64Browser : toBase64Node;
const fromBase64 = isBrowser ? fromBase64Browser : fromBase64Node;
const copyUint8Array = (uint8Array) => {
  const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
  newBuf.set(uint8Array);
  return newBuf;
};
class Pair {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
}
const create$1 = (left, right) => new Pair(left, right);
const doc = typeof document !== "undefined" ? document : {};
typeof DOMParser !== "undefined" ? new DOMParser() : null;
const mapToStyleString = (m) => map(m, (value, key) => `${key}:${value};`).join("");
doc.ELEMENT_NODE;
doc.TEXT_NODE;
doc.CDATA_SECTION_NODE;
doc.COMMENT_NODE;
doc.DOCUMENT_NODE;
doc.DOCUMENT_TYPE_NODE;
doc.DOCUMENT_FRAGMENT_NODE;
const create = Symbol;
const BOLD = create();
const UNBOLD = create();
const BLUE = create();
const GREY = create();
const GREEN = create();
const RED = create();
const PURPLE = create();
const ORANGE = create();
const UNCOLOR = create();
const computeNoColorLoggingArgs = (args) => {
  const logArgs = [];
  let i = 0;
  for (; i < args.length; i++) {
    const arg = args[i];
    if (arg.constructor === String || arg.constructor === Number)
      ;
    else if (arg.constructor === Object) {
      logArgs.push(JSON.stringify(arg));
    }
  }
  return logArgs;
};
const _browserStyleMap = {
  [BOLD]: create$1("font-weight", "bold"),
  [UNBOLD]: create$1("font-weight", "normal"),
  [BLUE]: create$1("color", "blue"),
  [GREEN]: create$1("color", "green"),
  [GREY]: create$1("color", "grey"),
  [RED]: create$1("color", "red"),
  [PURPLE]: create$1("color", "purple"),
  [ORANGE]: create$1("color", "orange"),
  [UNCOLOR]: create$1("color", "black")
};
const computeBrowserLoggingArgs = (args) => {
  const strBuilder = [];
  const styles = [];
  const currentStyle = create$5();
  let logArgs = [];
  let i = 0;
  for (; i < args.length; i++) {
    const arg = args[i];
    const style2 = _browserStyleMap[arg];
    if (style2 !== void 0) {
      currentStyle.set(style2.left, style2.right);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        const style3 = mapToStyleString(currentStyle);
        if (i > 0 || style3.length > 0) {
          strBuilder.push("%c" + arg);
          styles.push(style3);
        } else {
          strBuilder.push(arg);
        }
      } else {
        break;
      }
    }
  }
  if (i > 0) {
    logArgs = styles;
    logArgs.unshift(strBuilder.join(""));
  }
  for (; i < args.length; i++) {
    const arg = args[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs;
};
const computeLoggingArgs = supportsColor ? computeBrowserLoggingArgs : computeNoColorLoggingArgs;
const print = (...args) => {
  console.log(...computeLoggingArgs(args));
  vconsoles.forEach((vc) => vc.print(args));
};
const vconsoles = create$4();
const createIterator = (next) => ({
  [Symbol.iterator]() {
    return this;
  },
  next
});
const iteratorFilter = (iterator, filter) => createIterator(() => {
  let res;
  do {
    res = iterator.next();
  } while (!res.done && !filter(res.value));
  return res;
});
const iteratorMap = (iterator, fmap) => createIterator(() => {
  const { done, value } = iterator.next();
  return { done, value: done ? void 0 : fmap(value) };
});
class DeleteItem {
  constructor(clock, len) {
    this.clock = clock;
    this.len = len;
  }
}
class DeleteSet {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const iterateDeletedStructs = (transaction, ds, f) => ds.clients.forEach((deletes, clientid) => {
  const structs = transaction.doc.store.clients.get(clientid);
  for (let i = 0; i < deletes.length; i++) {
    const del = deletes[i];
    iterateStructs(transaction, structs, del.clock, del.len, f);
  }
});
const findIndexDS = (dis, clock) => {
  let left = 0;
  let right = dis.length - 1;
  while (left <= right) {
    const midindex = floor((left + right) / 2);
    const mid = dis[midindex];
    const midclock = mid.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.len) {
        return midindex;
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
  }
  return null;
};
const isDeleted = (ds, id2) => {
  const dis = ds.clients.get(id2.client);
  return dis !== void 0 && findIndexDS(dis, id2.clock) !== null;
};
const sortAndMergeDeleteSet = (ds) => {
  ds.clients.forEach((dels) => {
    dels.sort((a, b) => a.clock - b.clock);
    let i, j;
    for (i = 1, j = 1; i < dels.length; i++) {
      const left = dels[j - 1];
      const right = dels[i];
      if (left.clock + left.len >= right.clock) {
        left.len = max(left.len, right.clock + right.len - left.clock);
      } else {
        if (j < i) {
          dels[j] = right;
        }
        j++;
      }
    }
    dels.length = j;
  });
};
const mergeDeleteSets = (dss) => {
  const merged = new DeleteSet();
  for (let dssI = 0; dssI < dss.length; dssI++) {
    dss[dssI].clients.forEach((delsLeft, client) => {
      if (!merged.clients.has(client)) {
        const dels = delsLeft.slice();
        for (let i = dssI + 1; i < dss.length; i++) {
          appendTo(dels, dss[i].clients.get(client) || []);
        }
        merged.clients.set(client, dels);
      }
    });
  }
  sortAndMergeDeleteSet(merged);
  return merged;
};
const addToDeleteSet = (ds, client, clock, length2) => {
  setIfUndefined(ds.clients, client, () => []).push(new DeleteItem(clock, length2));
};
const createDeleteSet = () => new DeleteSet();
const createDeleteSetFromStructStore = (ss) => {
  const ds = createDeleteSet();
  ss.clients.forEach((structs, client) => {
    const dsitems = [];
    for (let i = 0; i < structs.length; i++) {
      const struct = structs[i];
      if (struct.deleted) {
        const clock = struct.id.clock;
        let len = struct.length;
        if (i + 1 < structs.length) {
          for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
            len += next.length;
          }
        }
        dsitems.push(new DeleteItem(clock, len));
      }
    }
    if (dsitems.length > 0) {
      ds.clients.set(client, dsitems);
    }
  });
  return ds;
};
const writeDeleteSet = (encoder, ds) => {
  writeVarUint(encoder.restEncoder, ds.clients.size);
  from(ds.clients.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, dsitems]) => {
    encoder.resetDsCurVal();
    writeVarUint(encoder.restEncoder, client);
    const len = dsitems.length;
    writeVarUint(encoder.restEncoder, len);
    for (let i = 0; i < len; i++) {
      const item = dsitems[i];
      encoder.writeDsClock(item.clock);
      encoder.writeDsLen(item.len);
    }
  });
};
const readDeleteSet = (decoder) => {
  const ds = new DeleteSet();
  const numClients = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = readVarUint(decoder.restDecoder);
    const numberOfDeletes = readVarUint(decoder.restDecoder);
    if (numberOfDeletes > 0) {
      const dsField = setIfUndefined(ds.clients, client, () => []);
      for (let i2 = 0; i2 < numberOfDeletes; i2++) {
        dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
      }
    }
  }
  return ds;
};
const readAndApplyDeleteSet = (decoder, transaction, store) => {
  const unappliedDS = new DeleteSet();
  const numClients = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = readVarUint(decoder.restDecoder);
    const numberOfDeletes = readVarUint(decoder.restDecoder);
    const structs = store.clients.get(client) || [];
    const state = getState(store, client);
    for (let i2 = 0; i2 < numberOfDeletes; i2++) {
      const clock = decoder.readDsClock();
      const clockEnd = clock + decoder.readDsLen();
      if (clock < state) {
        if (state < clockEnd) {
          addToDeleteSet(unappliedDS, client, state, clockEnd - state);
        }
        let index = findIndexSS(structs, clock);
        let struct = structs[index];
        if (!struct.deleted && struct.id.clock < clock) {
          structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
          index++;
        }
        while (index < structs.length) {
          struct = structs[index++];
          if (struct.id.clock < clockEnd) {
            if (!struct.deleted) {
              if (clockEnd < struct.id.clock + struct.length) {
                structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
              }
              struct.delete(transaction);
            }
          } else {
            break;
          }
        }
      } else {
        addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
      }
    }
  }
  if (unappliedDS.clients.size > 0) {
    const ds = new UpdateEncoderV2();
    writeVarUint(ds.restEncoder, 0);
    writeDeleteSet(ds, unappliedDS);
    return ds.toUint8Array();
  }
  return null;
};
const generateNewClientId = uint32;
class Doc extends Observable {
  constructor({ guid = uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
    super();
    this.gc = gc;
    this.gcFilter = gcFilter;
    this.clientID = generateNewClientId();
    this.guid = guid;
    this.collectionid = collectionid;
    this.share = /* @__PURE__ */ new Map();
    this.store = new StructStore();
    this._transaction = null;
    this._transactionCleanups = [];
    this.subdocs = /* @__PURE__ */ new Set();
    this._item = null;
    this.shouldLoad = shouldLoad;
    this.autoLoad = autoLoad;
    this.meta = meta;
    this.isLoaded = false;
    this.isSynced = false;
    this.whenLoaded = create$2((resolve) => {
      this.on("load", () => {
        this.isLoaded = true;
        resolve(this);
      });
    });
    const provideSyncedPromise = () => create$2((resolve) => {
      const eventHandler = (isSynced) => {
        if (isSynced === void 0 || isSynced === true) {
          this.off("sync", eventHandler);
          resolve();
        }
      };
      this.on("sync", eventHandler);
    });
    this.on("sync", (isSynced) => {
      if (isSynced === false && this.isSynced) {
        this.whenSynced = provideSyncedPromise();
      }
      this.isSynced = isSynced === void 0 || isSynced === true;
      if (this.isSynced && !this.isLoaded) {
        this.emit("load", []);
      }
    });
    this.whenSynced = provideSyncedPromise();
  }
  load() {
    const item = this._item;
    if (item !== null && !this.shouldLoad) {
      transact(item.parent.doc, (transaction) => {
        transaction.subdocsLoaded.add(this);
      }, null, true);
    }
    this.shouldLoad = true;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(from(this.subdocs).map((doc2) => doc2.guid));
  }
  transact(f, origin = null) {
    return transact(this, f, origin);
  }
  get(name, TypeConstructor = AbstractType) {
    const type = setIfUndefined(this.share, name, () => {
      const t = new TypeConstructor();
      t._integrate(this, null);
      return t;
    });
    const Constr = type.constructor;
    if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
      if (Constr === AbstractType) {
        const t = new TypeConstructor();
        t._map = type._map;
        type._map.forEach((n) => {
          for (; n !== null; n = n.left) {
            n.parent = t;
          }
        });
        t._start = type._start;
        for (let n = t._start; n !== null; n = n.right) {
          n.parent = t;
        }
        t._length = type._length;
        this.share.set(name, t);
        t._integrate(this, null);
        return t;
      } else {
        throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
      }
    }
    return type;
  }
  getArray(name = "") {
    return this.get(name, YArray);
  }
  getText(name = "") {
    return this.get(name, YText);
  }
  getMap(name = "") {
    return this.get(name, YMap);
  }
  getXmlElement(name = "") {
    return this.get(name, YXmlElement);
  }
  getXmlFragment(name = "") {
    return this.get(name, YXmlFragment);
  }
  toJSON() {
    const doc2 = {};
    this.share.forEach((value, key) => {
      doc2[key] = value.toJSON();
    });
    return doc2;
  }
  destroy() {
    from(this.subdocs).forEach((subdoc) => subdoc.destroy());
    const item = this._item;
    if (item !== null) {
      this._item = null;
      const content = item.content;
      content.doc = new Doc(__spreadProps(__spreadValues({ guid: this.guid }, content.opts), { shouldLoad: false }));
      content.doc._item = item;
      transact(item.parent.doc, (transaction) => {
        const doc2 = content.doc;
        if (!item.deleted) {
          transaction.subdocsAdded.add(doc2);
        }
        transaction.subdocsRemoved.add(this);
      }, null, true);
    }
    this.emit("destroyed", [true]);
    this.emit("destroy", [this]);
    super.destroy();
  }
  on(eventName, f) {
    super.on(eventName, f);
  }
  off(eventName, f) {
    super.off(eventName, f);
  }
}
class DSDecoderV1 {
  constructor(decoder) {
    this.restDecoder = decoder;
  }
  resetDsCurVal() {
  }
  readDsClock() {
    return readVarUint(this.restDecoder);
  }
  readDsLen() {
    return readVarUint(this.restDecoder);
  }
}
class UpdateDecoderV1 extends DSDecoderV1 {
  readLeftID() {
    return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
  }
  readRightID() {
    return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
  }
  readClient() {
    return readVarUint(this.restDecoder);
  }
  readInfo() {
    return readUint8(this.restDecoder);
  }
  readString() {
    return readVarString(this.restDecoder);
  }
  readParentInfo() {
    return readVarUint(this.restDecoder) === 1;
  }
  readTypeRef() {
    return readVarUint(this.restDecoder);
  }
  readLen() {
    return readVarUint(this.restDecoder);
  }
  readAny() {
    return readAny(this.restDecoder);
  }
  readBuf() {
    return copyUint8Array(readVarUint8Array(this.restDecoder));
  }
  readJSON() {
    return JSON.parse(readVarString(this.restDecoder));
  }
  readKey() {
    return readVarString(this.restDecoder);
  }
}
class DSDecoderV2 {
  constructor(decoder) {
    this.dsCurrVal = 0;
    this.restDecoder = decoder;
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  readDsClock() {
    this.dsCurrVal += readVarUint(this.restDecoder);
    return this.dsCurrVal;
  }
  readDsLen() {
    const diff = readVarUint(this.restDecoder) + 1;
    this.dsCurrVal += diff;
    return diff;
  }
}
class UpdateDecoderV2 extends DSDecoderV2 {
  constructor(decoder) {
    super(decoder);
    this.keys = [];
    readVarUint(decoder);
    this.keyClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.clientDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
    this.leftClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.rightClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.infoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
    this.stringDecoder = new StringDecoder(readVarUint8Array(decoder));
    this.parentInfoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
    this.typeRefDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
    this.lenDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
  }
  readLeftID() {
    return new ID(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  readRightID() {
    return new ID(this.clientDecoder.read(), this.rightClockDecoder.read());
  }
  readClient() {
    return this.clientDecoder.read();
  }
  readInfo() {
    return this.infoDecoder.read();
  }
  readString() {
    return this.stringDecoder.read();
  }
  readParentInfo() {
    return this.parentInfoDecoder.read() === 1;
  }
  readTypeRef() {
    return this.typeRefDecoder.read();
  }
  readLen() {
    return this.lenDecoder.read();
  }
  readAny() {
    return readAny(this.restDecoder);
  }
  readBuf() {
    return readVarUint8Array(this.restDecoder);
  }
  readJSON() {
    return readAny(this.restDecoder);
  }
  readKey() {
    const keyClock = this.keyClockDecoder.read();
    if (keyClock < this.keys.length) {
      return this.keys[keyClock];
    } else {
      const key = this.stringDecoder.read();
      this.keys.push(key);
      return key;
    }
  }
}
class DSEncoderV1 {
  constructor() {
    this.restEncoder = createEncoder();
  }
  toUint8Array() {
    return toUint8Array(this.restEncoder);
  }
  resetDsCurVal() {
  }
  writeDsClock(clock) {
    writeVarUint(this.restEncoder, clock);
  }
  writeDsLen(len) {
    writeVarUint(this.restEncoder, len);
  }
}
class UpdateEncoderV1 extends DSEncoderV1 {
  writeLeftID(id2) {
    writeVarUint(this.restEncoder, id2.client);
    writeVarUint(this.restEncoder, id2.clock);
  }
  writeRightID(id2) {
    writeVarUint(this.restEncoder, id2.client);
    writeVarUint(this.restEncoder, id2.clock);
  }
  writeClient(client) {
    writeVarUint(this.restEncoder, client);
  }
  writeInfo(info) {
    writeUint8(this.restEncoder, info);
  }
  writeString(s) {
    writeVarString(this.restEncoder, s);
  }
  writeParentInfo(isYKey) {
    writeVarUint(this.restEncoder, isYKey ? 1 : 0);
  }
  writeTypeRef(info) {
    writeVarUint(this.restEncoder, info);
  }
  writeLen(len) {
    writeVarUint(this.restEncoder, len);
  }
  writeAny(any2) {
    writeAny(this.restEncoder, any2);
  }
  writeBuf(buf) {
    writeVarUint8Array(this.restEncoder, buf);
  }
  writeJSON(embed) {
    writeVarString(this.restEncoder, JSON.stringify(embed));
  }
  writeKey(key) {
    writeVarString(this.restEncoder, key);
  }
}
class DSEncoderV2 {
  constructor() {
    this.restEncoder = createEncoder();
    this.dsCurrVal = 0;
  }
  toUint8Array() {
    return toUint8Array(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  writeDsClock(clock) {
    const diff = clock - this.dsCurrVal;
    this.dsCurrVal = clock;
    writeVarUint(this.restEncoder, diff);
  }
  writeDsLen(len) {
    if (len === 0) {
      unexpectedCase();
    }
    writeVarUint(this.restEncoder, len - 1);
    this.dsCurrVal += len;
  }
}
class UpdateEncoderV2 extends DSEncoderV2 {
  constructor() {
    super();
    this.keyMap = /* @__PURE__ */ new Map();
    this.keyClock = 0;
    this.keyClockEncoder = new IntDiffOptRleEncoder();
    this.clientEncoder = new UintOptRleEncoder();
    this.leftClockEncoder = new IntDiffOptRleEncoder();
    this.rightClockEncoder = new IntDiffOptRleEncoder();
    this.infoEncoder = new RleEncoder(writeUint8);
    this.stringEncoder = new StringEncoder();
    this.parentInfoEncoder = new RleEncoder(writeUint8);
    this.typeRefEncoder = new UintOptRleEncoder();
    this.lenEncoder = new UintOptRleEncoder();
  }
  toUint8Array() {
    const encoder = createEncoder();
    writeVarUint(encoder, 0);
    writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, toUint8Array(this.infoEncoder));
    writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
    writeVarUint8Array(encoder, toUint8Array(this.parentInfoEncoder));
    writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
    writeUint8Array(encoder, toUint8Array(this.restEncoder));
    return toUint8Array(encoder);
  }
  writeLeftID(id2) {
    this.clientEncoder.write(id2.client);
    this.leftClockEncoder.write(id2.clock);
  }
  writeRightID(id2) {
    this.clientEncoder.write(id2.client);
    this.rightClockEncoder.write(id2.clock);
  }
  writeClient(client) {
    this.clientEncoder.write(client);
  }
  writeInfo(info) {
    this.infoEncoder.write(info);
  }
  writeString(s) {
    this.stringEncoder.write(s);
  }
  writeParentInfo(isYKey) {
    this.parentInfoEncoder.write(isYKey ? 1 : 0);
  }
  writeTypeRef(info) {
    this.typeRefEncoder.write(info);
  }
  writeLen(len) {
    this.lenEncoder.write(len);
  }
  writeAny(any2) {
    writeAny(this.restEncoder, any2);
  }
  writeBuf(buf) {
    writeVarUint8Array(this.restEncoder, buf);
  }
  writeJSON(embed) {
    writeAny(this.restEncoder, embed);
  }
  writeKey(key) {
    const clock = this.keyMap.get(key);
    if (clock === void 0) {
      this.keyClockEncoder.write(this.keyClock++);
      this.stringEncoder.write(key);
    } else {
      this.keyClockEncoder.write(clock);
    }
  }
}
const writeStructs = (encoder, structs, client, clock) => {
  clock = max(clock, structs[0].id.clock);
  const startNewStructs = findIndexSS(structs, clock);
  writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
  encoder.writeClient(client);
  writeVarUint(encoder.restEncoder, clock);
  const firstStruct = structs[startNewStructs];
  firstStruct.write(encoder, clock - firstStruct.id.clock);
  for (let i = startNewStructs + 1; i < structs.length; i++) {
    structs[i].write(encoder, 0);
  }
};
const writeClientsStructs = (encoder, store, _sm) => {
  const sm = /* @__PURE__ */ new Map();
  _sm.forEach((clock, client) => {
    if (getState(store, client) > clock) {
      sm.set(client, clock);
    }
  });
  getStateVector(store).forEach((_clock, client) => {
    if (!_sm.has(client)) {
      sm.set(client, 0);
    }
  });
  writeVarUint(encoder.restEncoder, sm.size);
  from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    writeStructs(encoder, store.clients.get(client), client, clock);
  });
};
const readClientsStructRefs = (decoder, doc2) => {
  const clientRefs = create$5();
  const numOfStateUpdates = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint(decoder.restDecoder);
    const refs = new Array(numberOfStructs);
    const client = decoder.readClient();
    let clock = readVarUint(decoder.restDecoder);
    clientRefs.set(client, { i: 0, refs });
    for (let i2 = 0; i2 < numberOfStructs; i2++) {
      const info = decoder.readInfo();
      switch (BITS5 & info) {
        case 0: {
          const len = decoder.readLen();
          refs[i2] = new GC(createID(client, clock), len);
          clock += len;
          break;
        }
        case 10: {
          const len = readVarUint(decoder.restDecoder);
          refs[i2] = new Skip(createID(client, clock), len);
          clock += len;
          break;
        }
        default: {
          const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
          const struct = new Item(createID(client, clock), null, (info & BIT8) === BIT8 ? decoder.readLeftID() : null, null, (info & BIT7) === BIT7 ? decoder.readRightID() : null, cantCopyParentInfo ? decoder.readParentInfo() ? doc2.get(decoder.readString()) : decoder.readLeftID() : null, cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null, readItemContent(decoder, info));
          refs[i2] = struct;
          clock += struct.length;
        }
      }
    }
  }
  return clientRefs;
};
const integrateStructs = (transaction, store, clientsStructRefs) => {
  const stack = [];
  let clientsStructRefsIds = from(clientsStructRefs.keys()).sort((a, b) => a - b);
  if (clientsStructRefsIds.length === 0) {
    return null;
  }
  const getNextStructTarget = () => {
    if (clientsStructRefsIds.length === 0) {
      return null;
    }
    let nextStructsTarget = clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
    while (nextStructsTarget.refs.length === nextStructsTarget.i) {
      clientsStructRefsIds.pop();
      if (clientsStructRefsIds.length > 0) {
        nextStructsTarget = clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
      } else {
        return null;
      }
    }
    return nextStructsTarget;
  };
  let curStructsTarget = getNextStructTarget();
  if (curStructsTarget === null) {
    return null;
  }
  const restStructs = new StructStore();
  const missingSV = /* @__PURE__ */ new Map();
  const updateMissingSv = (client, clock) => {
    const mclock = missingSV.get(client);
    if (mclock == null || mclock > clock) {
      missingSV.set(client, clock);
    }
  };
  let stackHead = curStructsTarget.refs[curStructsTarget.i++];
  const state = /* @__PURE__ */ new Map();
  const addStackToRestSS = () => {
    for (const item of stack) {
      const client = item.id.client;
      const unapplicableItems = clientsStructRefs.get(client);
      if (unapplicableItems) {
        unapplicableItems.i--;
        restStructs.clients.set(client, unapplicableItems.refs.slice(unapplicableItems.i));
        clientsStructRefs.delete(client);
        unapplicableItems.i = 0;
        unapplicableItems.refs = [];
      } else {
        restStructs.clients.set(client, [item]);
      }
      clientsStructRefsIds = clientsStructRefsIds.filter((c) => c !== client);
    }
    stack.length = 0;
  };
  while (true) {
    if (stackHead.constructor !== Skip) {
      const localClock = setIfUndefined(state, stackHead.id.client, () => getState(store, stackHead.id.client));
      const offset = localClock - stackHead.id.clock;
      if (offset < 0) {
        stack.push(stackHead);
        updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
        addStackToRestSS();
      } else {
        const missing = stackHead.getMissing(transaction, store);
        if (missing !== null) {
          stack.push(stackHead);
          const structRefs = clientsStructRefs.get(missing) || { refs: [], i: 0 };
          if (structRefs.refs.length === structRefs.i) {
            updateMissingSv(missing, getState(store, missing));
            addStackToRestSS();
          } else {
            stackHead = structRefs.refs[structRefs.i++];
            continue;
          }
        } else if (offset === 0 || offset < stackHead.length) {
          stackHead.integrate(transaction, offset);
          state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
        }
      }
    }
    if (stack.length > 0) {
      stackHead = stack.pop();
    } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
      stackHead = curStructsTarget.refs[curStructsTarget.i++];
    } else {
      curStructsTarget = getNextStructTarget();
      if (curStructsTarget === null) {
        break;
      } else {
        stackHead = curStructsTarget.refs[curStructsTarget.i++];
      }
    }
  }
  if (restStructs.clients.size > 0) {
    const encoder = new UpdateEncoderV2();
    writeClientsStructs(encoder, restStructs, /* @__PURE__ */ new Map());
    writeVarUint(encoder.restEncoder, 0);
    return { missing: missingSV, update: encoder.toUint8Array() };
  }
  return null;
};
const writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
const readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) => transact(ydoc, (transaction) => {
  transaction.local = false;
  let retry = false;
  const doc2 = transaction.doc;
  const store = doc2.store;
  const ss = readClientsStructRefs(structDecoder, doc2);
  const restStructs = integrateStructs(transaction, store, ss);
  const pending = store.pendingStructs;
  if (pending) {
    for (const [client, clock] of pending.missing) {
      if (clock < getState(store, client)) {
        retry = true;
        break;
      }
    }
    if (restStructs) {
      for (const [client, clock] of restStructs.missing) {
        const mclock = pending.missing.get(client);
        if (mclock == null || mclock > clock) {
          pending.missing.set(client, clock);
        }
      }
      pending.update = mergeUpdatesV2([pending.update, restStructs.update]);
    }
  } else {
    store.pendingStructs = restStructs;
  }
  const dsRest = readAndApplyDeleteSet(structDecoder, transaction, store);
  if (store.pendingDs) {
    const pendingDSUpdate = new UpdateDecoderV2(createDecoder(store.pendingDs));
    readVarUint(pendingDSUpdate.restDecoder);
    const dsRest2 = readAndApplyDeleteSet(pendingDSUpdate, transaction, store);
    if (dsRest && dsRest2) {
      store.pendingDs = mergeUpdatesV2([dsRest, dsRest2]);
    } else {
      store.pendingDs = dsRest || dsRest2;
    }
  } else {
    store.pendingDs = dsRest;
  }
  if (retry) {
    const update = store.pendingStructs.update;
    store.pendingStructs = null;
    applyUpdateV2(transaction.doc, update);
  }
}, transactionOrigin, false);
const applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
  const decoder = createDecoder(update);
  readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
};
const applyUpdate = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, UpdateDecoderV1);
const writeStateAsUpdate = (encoder, doc2, targetStateVector = /* @__PURE__ */ new Map()) => {
  writeClientsStructs(encoder, doc2.store, targetStateVector);
  writeDeleteSet(encoder, createDeleteSetFromStructStore(doc2.store));
};
const encodeStateAsUpdateV2 = (doc2, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2()) => {
  const targetStateVector = decodeStateVector(encodedTargetStateVector);
  writeStateAsUpdate(encoder, doc2, targetStateVector);
  const updates = [encoder.toUint8Array()];
  if (doc2.store.pendingDs) {
    updates.push(doc2.store.pendingDs);
  }
  if (doc2.store.pendingStructs) {
    updates.push(diffUpdateV2(doc2.store.pendingStructs.update, encodedTargetStateVector));
  }
  if (updates.length > 1) {
    if (encoder.constructor === UpdateEncoderV1) {
      return mergeUpdates(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1(update)));
    } else if (encoder.constructor === UpdateEncoderV2) {
      return mergeUpdatesV2(updates);
    }
  }
  return updates[0];
};
const encodeStateAsUpdate = (doc2, encodedTargetStateVector) => encodeStateAsUpdateV2(doc2, encodedTargetStateVector, new UpdateEncoderV1());
const readStateVector = (decoder) => {
  const ss = /* @__PURE__ */ new Map();
  const ssLength = readVarUint(decoder.restDecoder);
  for (let i = 0; i < ssLength; i++) {
    const client = readVarUint(decoder.restDecoder);
    const clock = readVarUint(decoder.restDecoder);
    ss.set(client, clock);
  }
  return ss;
};
const decodeStateVector = (decodedState) => readStateVector(new DSDecoderV1(createDecoder(decodedState)));
const writeStateVector = (encoder, sv) => {
  writeVarUint(encoder.restEncoder, sv.size);
  from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    writeVarUint(encoder.restEncoder, client);
    writeVarUint(encoder.restEncoder, clock);
  });
  return encoder;
};
const writeDocumentStateVector = (encoder, doc2) => writeStateVector(encoder, getStateVector(doc2.store));
const encodeStateVectorV2 = (doc2, encoder = new DSEncoderV2()) => {
  if (doc2 instanceof Map) {
    writeStateVector(encoder, doc2);
  } else {
    writeDocumentStateVector(encoder, doc2);
  }
  return encoder.toUint8Array();
};
const encodeStateVector = (doc2) => encodeStateVectorV2(doc2, new DSEncoderV1());
class EventHandler {
  constructor() {
    this.l = [];
  }
}
const createEventHandler = () => new EventHandler();
const addEventHandlerListener = (eventHandler, f) => eventHandler.l.push(f);
const removeEventHandlerListener = (eventHandler, f) => {
  const l = eventHandler.l;
  const len = l.length;
  eventHandler.l = l.filter((g) => f !== g);
  if (len === eventHandler.l.length) {
    console.error("[yjs] Tried to remove event handler that doesn't exist.");
  }
};
const callEventHandlerListeners = (eventHandler, arg0, arg1) => callAll(eventHandler.l, [arg0, arg1]);
class ID {
  constructor(client, clock) {
    this.client = client;
    this.clock = clock;
  }
}
const compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
const createID = (client, clock) => new ID(client, clock);
const findRootTypeKey = (type) => {
  for (const [key, value] of type.doc.share.entries()) {
    if (value === type) {
      return key;
    }
  }
  throw unexpectedCase();
};
class Snapshot {
  constructor(ds, sv) {
    this.ds = ds;
    this.sv = sv;
  }
}
const createSnapshot = (ds, sm) => new Snapshot(ds, sm);
createSnapshot(createDeleteSet(), /* @__PURE__ */ new Map());
const isVisible = (item, snapshot) => snapshot === void 0 ? !item.deleted : snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id);
const splitSnapshotAffectedStructs = (transaction, snapshot) => {
  const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create$4);
  const store = transaction.doc.store;
  if (!meta.has(snapshot)) {
    snapshot.sv.forEach((clock, client) => {
      if (clock < getState(store, client)) {
        getItemCleanStart(transaction, createID(client, clock));
      }
    });
    iterateDeletedStructs(transaction, snapshot.ds, (_item) => {
    });
    meta.add(snapshot);
  }
};
class StructStore {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
    this.pendingStructs = null;
    this.pendingDs = null;
  }
}
const getStateVector = (store) => {
  const sm = /* @__PURE__ */ new Map();
  store.clients.forEach((structs, client) => {
    const struct = structs[structs.length - 1];
    sm.set(client, struct.id.clock + struct.length);
  });
  return sm;
};
const getState = (store, client) => {
  const structs = store.clients.get(client);
  if (structs === void 0) {
    return 0;
  }
  const lastStruct = structs[structs.length - 1];
  return lastStruct.id.clock + lastStruct.length;
};
const addStruct = (store, struct) => {
  let structs = store.clients.get(struct.id.client);
  if (structs === void 0) {
    structs = [];
    store.clients.set(struct.id.client, structs);
  } else {
    const lastStruct = structs[structs.length - 1];
    if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
      throw unexpectedCase();
    }
  }
  structs.push(struct);
};
const findIndexSS = (structs, clock) => {
  let left = 0;
  let right = structs.length - 1;
  let mid = structs[right];
  let midclock = mid.id.clock;
  if (midclock === clock) {
    return right;
  }
  let midindex = floor(clock / (midclock + mid.length - 1) * right);
  while (left <= right) {
    mid = structs[midindex];
    midclock = mid.id.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.length) {
        return midindex;
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
    midindex = floor((left + right) / 2);
  }
  throw unexpectedCase();
};
const find = (store, id2) => {
  const structs = store.clients.get(id2.client);
  return structs[findIndexSS(structs, id2.clock)];
};
const getItem = find;
const findIndexCleanStart = (transaction, structs, clock) => {
  const index = findIndexSS(structs, clock);
  const struct = structs[index];
  if (struct.id.clock < clock && struct instanceof Item) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
    return index + 1;
  }
  return index;
};
const getItemCleanStart = (transaction, id2) => {
  const structs = transaction.doc.store.clients.get(id2.client);
  return structs[findIndexCleanStart(transaction, structs, id2.clock)];
};
const getItemCleanEnd = (transaction, store, id2) => {
  const structs = store.clients.get(id2.client);
  const index = findIndexSS(structs, id2.clock);
  const struct = structs[index];
  if (id2.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, id2.clock - struct.id.clock + 1));
  }
  return struct;
};
const replaceStruct = (store, struct, newStruct) => {
  const structs = store.clients.get(struct.id.client);
  structs[findIndexSS(structs, struct.id.clock)] = newStruct;
};
const iterateStructs = (transaction, structs, clockStart, len, f) => {
  if (len === 0) {
    return;
  }
  const clockEnd = clockStart + len;
  let index = findIndexCleanStart(transaction, structs, clockStart);
  let struct;
  do {
    struct = structs[index++];
    if (clockEnd < struct.id.clock + struct.length) {
      findIndexCleanStart(transaction, structs, clockEnd);
    }
    f(struct);
  } while (index < structs.length && structs[index].id.clock < clockEnd);
};
class Transaction {
  constructor(doc2, origin, local) {
    this.doc = doc2;
    this.deleteSet = new DeleteSet();
    this.beforeState = getStateVector(doc2.store);
    this.afterState = /* @__PURE__ */ new Map();
    this.changed = /* @__PURE__ */ new Map();
    this.changedParentTypes = /* @__PURE__ */ new Map();
    this._mergeStructs = [];
    this.origin = origin;
    this.meta = /* @__PURE__ */ new Map();
    this.local = local;
    this.subdocsAdded = /* @__PURE__ */ new Set();
    this.subdocsRemoved = /* @__PURE__ */ new Set();
    this.subdocsLoaded = /* @__PURE__ */ new Set();
    this._needFormattingCleanup = false;
  }
}
const writeUpdateMessageFromTransaction = (encoder, transaction) => {
  if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
    return false;
  }
  sortAndMergeDeleteSet(transaction.deleteSet);
  writeStructsFromTransaction(encoder, transaction);
  writeDeleteSet(encoder, transaction.deleteSet);
  return true;
};
const addChangedTypeToTransaction = (transaction, type, parentSub) => {
  const item = type._item;
  if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
    setIfUndefined(transaction.changed, type, create$4).add(parentSub);
  }
};
const tryToMergeWithLefts = (structs, pos) => {
  let right = structs[pos];
  let left = structs[pos - 1];
  let i = pos;
  for (; i > 0; right = left, left = structs[--i - 1]) {
    if (left.deleted === right.deleted && left.constructor === right.constructor) {
      if (left.mergeWith(right)) {
        if (right instanceof Item && right.parentSub !== null && right.parent._map.get(right.parentSub) === right) {
          right.parent._map.set(right.parentSub, left);
        }
        continue;
      }
    }
    break;
  }
  const merged = pos - i;
  if (merged) {
    structs.splice(pos + 1 - merged, merged);
  }
  return merged;
};
const tryGcDeleteSet = (ds, store, gcFilter) => {
  for (const [client, deleteItems] of ds.clients.entries()) {
    const structs = store.clients.get(client);
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const endDeleteItemClock = deleteItem.clock + deleteItem.len;
      for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
        const struct2 = structs[si];
        if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
          break;
        }
        if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
          struct2.gc(store, false);
        }
      }
    }
  }
};
const tryMergeDeleteSet = (ds, store) => {
  ds.clients.forEach((deleteItems, client) => {
    const structs = store.clients.get(client);
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
      for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[si]) {
        si -= 1 + tryToMergeWithLefts(structs, si);
      }
    }
  });
};
const cleanupTransactions = (transactionCleanups, i) => {
  if (i < transactionCleanups.length) {
    const transaction = transactionCleanups[i];
    const doc2 = transaction.doc;
    const store = doc2.store;
    const ds = transaction.deleteSet;
    const mergeStructs = transaction._mergeStructs;
    try {
      sortAndMergeDeleteSet(ds);
      transaction.afterState = getStateVector(transaction.doc.store);
      doc2.emit("beforeObserverCalls", [transaction, doc2]);
      const fs = [];
      transaction.changed.forEach((subs, itemtype) => fs.push(() => {
        if (itemtype._item === null || !itemtype._item.deleted) {
          itemtype._callObserver(transaction, subs);
        }
      }));
      fs.push(() => {
        transaction.changedParentTypes.forEach((events, type) => {
          if (type._dEH.l.length > 0 && (type._item === null || !type._item.deleted)) {
            events = events.filter((event) => event.target._item === null || !event.target._item.deleted);
            events.forEach((event) => {
              event.currentTarget = type;
              event._path = null;
            });
            events.sort((event1, event2) => event1.path.length - event2.path.length);
            callEventHandlerListeners(type._dEH, events, transaction);
          }
        });
      });
      fs.push(() => doc2.emit("afterTransaction", [transaction, doc2]));
      callAll(fs, []);
      if (transaction._needFormattingCleanup) {
        cleanupYTextAfterTransaction(transaction);
      }
    } finally {
      if (doc2.gc) {
        tryGcDeleteSet(ds, store, doc2.gcFilter);
      }
      tryMergeDeleteSet(ds, store);
      transaction.afterState.forEach((clock, client) => {
        const beforeClock = transaction.beforeState.get(client) || 0;
        if (beforeClock !== clock) {
          const structs = store.clients.get(client);
          const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
          for (let i2 = structs.length - 1; i2 >= firstChangePos; ) {
            i2 -= 1 + tryToMergeWithLefts(structs, i2);
          }
        }
      });
      for (let i2 = mergeStructs.length - 1; i2 >= 0; i2--) {
        const { client, clock } = mergeStructs[i2].id;
        const structs = store.clients.get(client);
        const replacedStructPos = findIndexSS(structs, clock);
        if (replacedStructPos + 1 < structs.length) {
          if (tryToMergeWithLefts(structs, replacedStructPos + 1) > 1) {
            continue;
          }
        }
        if (replacedStructPos > 0) {
          tryToMergeWithLefts(structs, replacedStructPos);
        }
      }
      if (!transaction.local && transaction.afterState.get(doc2.clientID) !== transaction.beforeState.get(doc2.clientID)) {
        print(ORANGE, BOLD, "[yjs] ", UNBOLD, RED, "Changed the client-id because another client seems to be using it.");
        doc2.clientID = generateNewClientId();
      }
      doc2.emit("afterTransactionCleanup", [transaction, doc2]);
      if (doc2._observers.has("update")) {
        const encoder = new UpdateEncoderV1();
        const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent2) {
          doc2.emit("update", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
        }
      }
      if (doc2._observers.has("updateV2")) {
        const encoder = new UpdateEncoderV2();
        const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent2) {
          doc2.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
        }
      }
      const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
      if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
        subdocsAdded.forEach((subdoc) => {
          subdoc.clientID = doc2.clientID;
          if (subdoc.collectionid == null) {
            subdoc.collectionid = doc2.collectionid;
          }
          doc2.subdocs.add(subdoc);
        });
        subdocsRemoved.forEach((subdoc) => doc2.subdocs.delete(subdoc));
        doc2.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc2, transaction]);
        subdocsRemoved.forEach((subdoc) => subdoc.destroy());
      }
      if (transactionCleanups.length <= i + 1) {
        doc2._transactionCleanups = [];
        doc2.emit("afterAllTransactions", [doc2, transactionCleanups]);
      } else {
        cleanupTransactions(transactionCleanups, i + 1);
      }
    }
  }
};
const transact = (doc2, f, origin = null, local = true) => {
  const transactionCleanups = doc2._transactionCleanups;
  let initialCall = false;
  let result = null;
  if (doc2._transaction === null) {
    initialCall = true;
    doc2._transaction = new Transaction(doc2, origin, local);
    transactionCleanups.push(doc2._transaction);
    if (transactionCleanups.length === 1) {
      doc2.emit("beforeAllTransactions", [doc2]);
    }
    doc2.emit("beforeTransaction", [doc2._transaction, doc2]);
  }
  try {
    result = f(doc2._transaction);
  } finally {
    if (initialCall) {
      const finishCleanup = doc2._transaction === transactionCleanups[0];
      doc2._transaction = null;
      if (finishCleanup) {
        cleanupTransactions(transactionCleanups, 0);
      }
    }
  }
  return result;
};
function* lazyStructReaderGenerator(decoder) {
  const numOfStateUpdates = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint(decoder.restDecoder);
    const client = decoder.readClient();
    let clock = readVarUint(decoder.restDecoder);
    for (let i2 = 0; i2 < numberOfStructs; i2++) {
      const info = decoder.readInfo();
      if (info === 10) {
        const len = readVarUint(decoder.restDecoder);
        yield new Skip(createID(client, clock), len);
        clock += len;
      } else if ((BITS5 & info) !== 0) {
        const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
        const struct = new Item(createID(client, clock), null, (info & BIT8) === BIT8 ? decoder.readLeftID() : null, null, (info & BIT7) === BIT7 ? decoder.readRightID() : null, cantCopyParentInfo ? decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID() : null, cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null, readItemContent(decoder, info));
        yield struct;
        clock += struct.length;
      } else {
        const len = decoder.readLen();
        yield new GC(createID(client, clock), len);
        clock += len;
      }
    }
  }
}
class LazyStructReader {
  constructor(decoder, filterSkips) {
    this.gen = lazyStructReaderGenerator(decoder);
    this.curr = null;
    this.done = false;
    this.filterSkips = filterSkips;
    this.next();
  }
  next() {
    do {
      this.curr = this.gen.next().value || null;
    } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip);
    return this.curr;
  }
}
class LazyStructWriter {
  constructor(encoder) {
    this.currClient = 0;
    this.startClock = 0;
    this.written = 0;
    this.encoder = encoder;
    this.clientStructs = [];
  }
}
const mergeUpdates = (updates) => mergeUpdatesV2(updates, UpdateDecoderV1, UpdateEncoderV1);
const sliceStruct = (left, diff) => {
  if (left.constructor === GC) {
    const { client, clock } = left.id;
    return new GC(createID(client, clock + diff), left.length - diff);
  } else if (left.constructor === Skip) {
    const { client, clock } = left.id;
    return new Skip(createID(client, clock + diff), left.length - diff);
  } else {
    const leftItem = left;
    const { client, clock } = leftItem.id;
    return new Item(createID(client, clock + diff), null, createID(client, clock + diff - 1), null, leftItem.rightOrigin, leftItem.parent, leftItem.parentSub, leftItem.content.splice(diff));
  }
};
const mergeUpdatesV2 = (updates, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
  if (updates.length === 1) {
    return updates[0];
  }
  const updateDecoders = updates.map((update) => new YDecoder(createDecoder(update)));
  let lazyStructDecoders = updateDecoders.map((decoder) => new LazyStructReader(decoder, true));
  let currWrite = null;
  const updateEncoder = new YEncoder();
  const lazyStructEncoder = new LazyStructWriter(updateEncoder);
  while (true) {
    lazyStructDecoders = lazyStructDecoders.filter((dec) => dec.curr !== null);
    lazyStructDecoders.sort((dec1, dec2) => {
      if (dec1.curr.id.client === dec2.curr.id.client) {
        const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
        if (clockDiff === 0) {
          return dec1.curr.constructor === dec2.curr.constructor ? 0 : dec1.curr.constructor === Skip ? 1 : -1;
        } else {
          return clockDiff;
        }
      } else {
        return dec2.curr.id.client - dec1.curr.id.client;
      }
    });
    if (lazyStructDecoders.length === 0) {
      break;
    }
    const currDecoder = lazyStructDecoders[0];
    const firstClient = currDecoder.curr.id.client;
    if (currWrite !== null) {
      let curr = currDecoder.curr;
      let iterated = false;
      while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
        curr = currDecoder.next();
        iterated = true;
      }
      if (curr === null || curr.id.client !== firstClient || iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) {
        continue;
      }
      if (firstClient !== currWrite.struct.id.client) {
        writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = { struct: curr, offset: 0 };
        currDecoder.next();
      } else {
        if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
          if (currWrite.struct.constructor === Skip) {
            currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
          } else {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
            const struct = new Skip(createID(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
            currWrite = { struct, offset: 0 };
          }
        } else {
          const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
          if (diff > 0) {
            if (currWrite.struct.constructor === Skip) {
              currWrite.struct.length -= diff;
            } else {
              curr = sliceStruct(curr, diff);
            }
          }
          if (!currWrite.struct.mergeWith(curr)) {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            currWrite = { struct: curr, offset: 0 };
            currDecoder.next();
          }
        }
      }
    } else {
      currWrite = { struct: currDecoder.curr, offset: 0 };
      currDecoder.next();
    }
    for (let next = currDecoder.curr; next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip; next = currDecoder.next()) {
      writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
      currWrite = { struct: next, offset: 0 };
    }
  }
  if (currWrite !== null) {
    writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
    currWrite = null;
  }
  finishLazyStructWriting(lazyStructEncoder);
  const dss = updateDecoders.map((decoder) => readDeleteSet(decoder));
  const ds = mergeDeleteSets(dss);
  writeDeleteSet(updateEncoder, ds);
  return updateEncoder.toUint8Array();
};
const diffUpdateV2 = (update, sv, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
  const state = decodeStateVector(sv);
  const encoder = new YEncoder();
  const lazyStructWriter = new LazyStructWriter(encoder);
  const decoder = new YDecoder(createDecoder(update));
  const reader = new LazyStructReader(decoder, false);
  while (reader.curr) {
    const curr = reader.curr;
    const currClient = curr.id.client;
    const svClock = state.get(currClient) || 0;
    if (reader.curr.constructor === Skip) {
      reader.next();
      continue;
    }
    if (curr.id.clock + curr.length > svClock) {
      writeStructToLazyStructWriter(lazyStructWriter, curr, max(svClock - curr.id.clock, 0));
      reader.next();
      while (reader.curr && reader.curr.id.client === currClient) {
        writeStructToLazyStructWriter(lazyStructWriter, reader.curr, 0);
        reader.next();
      }
    } else {
      while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
        reader.next();
      }
    }
  }
  finishLazyStructWriting(lazyStructWriter);
  const ds = readDeleteSet(decoder);
  writeDeleteSet(encoder, ds);
  return encoder.toUint8Array();
};
const flushLazyStructWriter = (lazyWriter) => {
  if (lazyWriter.written > 0) {
    lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: toUint8Array(lazyWriter.encoder.restEncoder) });
    lazyWriter.encoder.restEncoder = createEncoder();
    lazyWriter.written = 0;
  }
};
const writeStructToLazyStructWriter = (lazyWriter, struct, offset) => {
  if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
    flushLazyStructWriter(lazyWriter);
  }
  if (lazyWriter.written === 0) {
    lazyWriter.currClient = struct.id.client;
    lazyWriter.encoder.writeClient(struct.id.client);
    writeVarUint(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
  }
  struct.write(lazyWriter.encoder, offset);
  lazyWriter.written++;
};
const finishLazyStructWriting = (lazyWriter) => {
  flushLazyStructWriter(lazyWriter);
  const restEncoder = lazyWriter.encoder.restEncoder;
  writeVarUint(restEncoder, lazyWriter.clientStructs.length);
  for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
    const partStructs = lazyWriter.clientStructs[i];
    writeVarUint(restEncoder, partStructs.written);
    writeUint8Array(restEncoder, partStructs.restEncoder);
  }
};
const convertUpdateFormat = (update, blockTransformer, YDecoder, YEncoder) => {
  const updateDecoder = new YDecoder(createDecoder(update));
  const lazyDecoder = new LazyStructReader(updateDecoder, false);
  const updateEncoder = new YEncoder();
  const lazyWriter = new LazyStructWriter(updateEncoder);
  for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
    writeStructToLazyStructWriter(lazyWriter, blockTransformer(curr), 0);
  }
  finishLazyStructWriting(lazyWriter);
  const ds = readDeleteSet(updateDecoder);
  writeDeleteSet(updateEncoder, ds);
  return updateEncoder.toUint8Array();
};
const convertUpdateFormatV2ToV1 = (update) => convertUpdateFormat(update, id, UpdateDecoderV2, UpdateEncoderV1);
const errorComputeChanges = "You must not compute changes after the event-handler fired.";
class YEvent {
  constructor(target, transaction) {
    this.target = target;
    this.currentTarget = target;
    this.transaction = transaction;
    this._changes = null;
    this._keys = null;
    this._delta = null;
    this._path = null;
  }
  get path() {
    return this._path || (this._path = getPathTo(this.currentTarget, this.target));
  }
  deletes(struct) {
    return isDeleted(this.transaction.deleteSet, struct.id);
  }
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0) {
        throw create$3(errorComputeChanges);
      }
      const keys2 = /* @__PURE__ */ new Map();
      const target = this.target;
      const changed = this.transaction.changed.get(target);
      changed.forEach((key) => {
        if (key !== null) {
          const item = target._map.get(key);
          let action;
          let oldValue;
          if (this.adds(item)) {
            let prev = item.left;
            while (prev !== null && this.adds(prev)) {
              prev = prev.left;
            }
            if (this.deletes(item)) {
              if (prev !== null && this.deletes(prev)) {
                action = "delete";
                oldValue = last(prev.content.getContent());
              } else {
                return;
              }
            } else {
              if (prev !== null && this.deletes(prev)) {
                action = "update";
                oldValue = last(prev.content.getContent());
              } else {
                action = "add";
                oldValue = void 0;
              }
            }
          } else {
            if (this.deletes(item)) {
              action = "delete";
              oldValue = last(item.content.getContent());
            } else {
              return;
            }
          }
          keys2.set(key, { action, oldValue });
        }
      });
      this._keys = keys2;
    }
    return this._keys;
  }
  get delta() {
    return this.changes.delta;
  }
  adds(struct) {
    return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
  }
  get changes() {
    let changes = this._changes;
    if (changes === null) {
      if (this.transaction.doc._transactionCleanups.length === 0) {
        throw create$3(errorComputeChanges);
      }
      const target = this.target;
      const added = create$4();
      const deleted = create$4();
      const delta = [];
      changes = {
        added,
        deleted,
        delta,
        keys: this.keys
      };
      const changed = this.transaction.changed.get(target);
      if (changed.has(null)) {
        let lastOp = null;
        const packOp = () => {
          if (lastOp) {
            delta.push(lastOp);
          }
        };
        for (let item = target._start; item !== null; item = item.right) {
          if (item.deleted) {
            if (this.deletes(item) && !this.adds(item)) {
              if (lastOp === null || lastOp.delete === void 0) {
                packOp();
                lastOp = { delete: 0 };
              }
              lastOp.delete += item.length;
              deleted.add(item);
            }
          } else {
            if (this.adds(item)) {
              if (lastOp === null || lastOp.insert === void 0) {
                packOp();
                lastOp = { insert: [] };
              }
              lastOp.insert = lastOp.insert.concat(item.content.getContent());
              added.add(item);
            } else {
              if (lastOp === null || lastOp.retain === void 0) {
                packOp();
                lastOp = { retain: 0 };
              }
              lastOp.retain += item.length;
            }
          }
        }
        if (lastOp !== null && lastOp.retain === void 0) {
          packOp();
        }
      }
      this._changes = changes;
    }
    return changes;
  }
}
const getPathTo = (parent, child) => {
  const path = [];
  while (child._item !== null && child !== parent) {
    if (child._item.parentSub !== null) {
      path.unshift(child._item.parentSub);
    } else {
      let i = 0;
      let c = child._item.parent._start;
      while (c !== child._item && c !== null) {
        if (!c.deleted) {
          i++;
        }
        c = c.right;
      }
      path.unshift(i);
    }
    child = child._item.parent;
  }
  return path;
};
const maxSearchMarker = 80;
let globalSearchMarkerTimestamp = 0;
class ArraySearchMarker {
  constructor(p, index) {
    p.marker = true;
    this.p = p;
    this.index = index;
    this.timestamp = globalSearchMarkerTimestamp++;
  }
}
const refreshMarkerTimestamp = (marker) => {
  marker.timestamp = globalSearchMarkerTimestamp++;
};
const overwriteMarker = (marker, p, index) => {
  marker.p.marker = false;
  marker.p = p;
  p.marker = true;
  marker.index = index;
  marker.timestamp = globalSearchMarkerTimestamp++;
};
const markPosition = (searchMarker, p, index) => {
  if (searchMarker.length >= maxSearchMarker) {
    const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
    overwriteMarker(marker, p, index);
    return marker;
  } else {
    const pm = new ArraySearchMarker(p, index);
    searchMarker.push(pm);
    return pm;
  }
};
const findMarker = (yarray, index) => {
  if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
    return null;
  }
  const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs(index - a.index) < abs(index - b.index) ? a : b);
  let p = yarray._start;
  let pindex = 0;
  if (marker !== null) {
    p = marker.p;
    pindex = marker.index;
    refreshMarkerTimestamp(marker);
  }
  while (p.right !== null && pindex < index) {
    if (!p.deleted && p.countable) {
      if (index < pindex + p.length) {
        break;
      }
      pindex += p.length;
    }
    p = p.right;
  }
  while (p.left !== null && pindex > index) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  if (marker !== null && abs(marker.index - pindex) < p.parent.length / maxSearchMarker) {
    overwriteMarker(marker, p, pindex);
    return marker;
  } else {
    return markPosition(yarray._searchMarker, p, pindex);
  }
};
const updateMarkerChanges = (searchMarker, index, len) => {
  for (let i = searchMarker.length - 1; i >= 0; i--) {
    const m = searchMarker[i];
    if (len > 0) {
      let p = m.p;
      p.marker = false;
      while (p && (p.deleted || !p.countable)) {
        p = p.left;
        if (p && !p.deleted && p.countable) {
          m.index -= p.length;
        }
      }
      if (p === null || p.marker === true) {
        searchMarker.splice(i, 1);
        continue;
      }
      m.p = p;
      p.marker = true;
    }
    if (index < m.index || len > 0 && index === m.index) {
      m.index = max(index, m.index + len);
    }
  }
};
const callTypeObservers = (type, transaction, event) => {
  const changedType = type;
  const changedParentTypes = transaction.changedParentTypes;
  while (true) {
    setIfUndefined(changedParentTypes, type, () => []).push(event);
    if (type._item === null) {
      break;
    }
    type = type._item.parent;
  }
  callEventHandlerListeners(changedType._eH, event, transaction);
};
class AbstractType {
  constructor() {
    this._item = null;
    this._map = /* @__PURE__ */ new Map();
    this._start = null;
    this.doc = null;
    this._length = 0;
    this._eH = createEventHandler();
    this._dEH = createEventHandler();
    this._searchMarker = null;
  }
  get parent() {
    return this._item ? this._item.parent : null;
  }
  _integrate(y, item) {
    this.doc = y;
    this._item = item;
  }
  _copy() {
    throw methodUnimplemented();
  }
  clone() {
    throw methodUnimplemented();
  }
  _write(_encoder) {
  }
  get _first() {
    let n = this._start;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n;
  }
  _callObserver(transaction, _parentSubs) {
    if (!transaction.local && this._searchMarker) {
      this._searchMarker.length = 0;
    }
  }
  observe(f) {
    addEventHandlerListener(this._eH, f);
  }
  observeDeep(f) {
    addEventHandlerListener(this._dEH, f);
  }
  unobserve(f) {
    removeEventHandlerListener(this._eH, f);
  }
  unobserveDeep(f) {
    removeEventHandlerListener(this._dEH, f);
  }
  toJSON() {
  }
}
const typeListSlice = (type, start, end) => {
  if (start < 0) {
    start = type._length + start;
  }
  if (end < 0) {
    end = type._length + end;
  }
  let len = end - start;
  const cs = [];
  let n = type._start;
  while (n !== null && len > 0) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      if (c.length <= start) {
        start -= c.length;
      } else {
        for (let i = start; i < c.length && len > 0; i++) {
          cs.push(c[i]);
          len--;
        }
        start = 0;
      }
    }
    n = n.right;
  }
  return cs;
};
const typeListToArray = (type) => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs;
};
const typeListForEach = (type, f) => {
  let index = 0;
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        f(c[i], index++, type);
      }
    }
    n = n.right;
  }
};
const typeListMap = (type, f) => {
  const result = [];
  typeListForEach(type, (c, i) => {
    result.push(f(c, i, type));
  });
  return result;
};
const typeListCreateIterator = (type) => {
  let n = type._start;
  let currentContent = null;
  let currentContentIndex = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (currentContent === null) {
        while (n !== null && n.deleted) {
          n = n.right;
        }
        if (n === null) {
          return {
            done: true,
            value: void 0
          };
        }
        currentContent = n.content.getContent();
        currentContentIndex = 0;
        n = n.right;
      }
      const value = currentContent[currentContentIndex++];
      if (currentContent.length <= currentContentIndex) {
        currentContent = null;
      }
      return {
        done: false,
        value
      };
    }
  };
};
const typeListGet = (type, index) => {
  const marker = findMarker(type, index);
  let n = type._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        return n.content.getContent()[index];
      }
      index -= n.length;
    }
  }
};
const typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
  let left = referenceItem;
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  const store = doc2.store;
  const right = referenceItem === null ? parent._start : referenceItem.right;
  let jsonContent = [];
  const packJsonContent = () => {
    if (jsonContent.length > 0) {
      left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
      left.integrate(transaction, 0);
      jsonContent = [];
    }
  };
  content.forEach((c) => {
    if (c === null) {
      jsonContent.push(c);
    } else {
      switch (c.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          jsonContent.push(c);
          break;
        default:
          packJsonContent();
          switch (c.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(c)));
              left.integrate(transaction, 0);
              break;
            case Doc:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(c));
              left.integrate(transaction, 0);
              break;
            default:
              if (c instanceof AbstractType) {
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                left.integrate(transaction, 0);
              } else {
                throw new Error("Unexpected content type in insert operation");
              }
          }
      }
    }
  });
  packJsonContent();
};
const lengthExceeded = () => create$3("Length exceeded!");
const typeListInsertGenerics = (transaction, parent, index, content) => {
  if (index > parent._length) {
    throw lengthExceeded();
  }
  if (index === 0) {
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, index, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, null, content);
  }
  const startIndex = index;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
    if (index === 0) {
      n = n.prev;
      index += n && n.countable && !n.deleted ? n.length : 0;
    }
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index <= n.length) {
        if (index < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        break;
      }
      index -= n.length;
    }
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, content.length);
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content);
};
const typeListPushGenerics = (transaction, parent, content) => {
  const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
  let n = marker.p;
  if (n) {
    while (n.right) {
      n = n.right;
    }
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content);
};
const typeListDelete = (transaction, parent, index, length2) => {
  if (length2 === 0) {
    return;
  }
  const startIndex = index;
  const startLength = length2;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null && index > 0; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
      }
      index -= n.length;
    }
  }
  while (length2 > 0 && n !== null) {
    if (!n.deleted) {
      if (length2 < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length2));
      }
      n.delete(transaction);
      length2 -= n.length;
    }
    n = n.right;
  }
  if (length2 > 0) {
    throw lengthExceeded();
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, -startLength + length2);
  }
};
const typeMapDelete = (transaction, parent, key) => {
  const c = parent._map.get(key);
  if (c !== void 0) {
    c.delete(transaction);
  }
};
const typeMapSet = (transaction, parent, key, value) => {
  const left = parent._map.get(key) || null;
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  let content;
  if (value == null) {
    content = new ContentAny([value]);
  } else {
    switch (value.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        content = new ContentAny([value]);
        break;
      case Uint8Array:
        content = new ContentBinary(value);
        break;
      case Doc:
        content = new ContentDoc(value);
        break;
      default:
        if (value instanceof AbstractType) {
          content = new ContentType(value);
        } else {
          throw new Error("Unexpected content type");
        }
    }
  }
  new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
};
const typeMapGet = (parent, key) => {
  const val = parent._map.get(key);
  return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
};
const typeMapGetAll = (parent) => {
  const res = {};
  parent._map.forEach((value, key) => {
    if (!value.deleted) {
      res[key] = value.content.getContent()[value.length - 1];
    }
  });
  return res;
};
const typeMapHas = (parent, key) => {
  const val = parent._map.get(key);
  return val !== void 0 && !val.deleted;
};
const typeMapGetAllSnapshot = (parent, snapshot) => {
  const res = {};
  parent._map.forEach((value, key) => {
    let v = value;
    while (v !== null && (!snapshot.sv.has(v.id.client) || v.id.clock >= (snapshot.sv.get(v.id.client) || 0))) {
      v = v.left;
    }
    if (v !== null && isVisible(v, snapshot)) {
      res[key] = v.content.getContent()[v.length - 1];
    }
  });
  return res;
};
const createMapIterator = (map2) => iteratorFilter(map2.entries(), (entry) => !entry[1].deleted);
class YArrayEvent extends YEvent {
  constructor(yarray, transaction) {
    super(yarray, transaction);
    this._transaction = transaction;
  }
}
class YArray extends AbstractType {
  constructor() {
    super();
    this._prelimContent = [];
    this._searchMarker = [];
  }
  static from(items) {
    const a = new YArray();
    a.push(items);
    return a;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this.insert(0, this._prelimContent);
    this._prelimContent = null;
  }
  _copy() {
    return new YArray();
  }
  clone() {
    const arr = new YArray();
    arr.insert(0, this.toArray().map((el) => el instanceof AbstractType ? el.clone() : el));
    return arr;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  _callObserver(transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
  }
  insert(index, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      this._prelimContent.splice(index, 0, ...content);
    }
  }
  push(content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListPushGenerics(transaction, this, content);
      });
    } else {
      this._prelimContent.push(...content);
    }
  }
  unshift(content) {
    this.insert(0, content);
  }
  delete(index, length2 = 1) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListDelete(transaction, this, index, length2);
      });
    } else {
      this._prelimContent.splice(index, length2);
    }
  }
  get(index) {
    return typeListGet(this, index);
  }
  toArray() {
    return typeListToArray(this);
  }
  slice(start = 0, end = this.length) {
    return typeListSlice(this, start, end);
  }
  toJSON() {
    return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
  }
  map(f) {
    return typeListMap(this, f);
  }
  forEach(f) {
    typeListForEach(this, f);
  }
  [Symbol.iterator]() {
    return typeListCreateIterator(this);
  }
  _write(encoder) {
    encoder.writeTypeRef(YArrayRefID);
  }
}
const readYArray = (_decoder) => new YArray();
class YMapEvent extends YEvent {
  constructor(ymap, transaction, subs) {
    super(ymap, transaction);
    this.keysChanged = subs;
  }
}
class YMap extends AbstractType {
  constructor(entries) {
    super();
    this._prelimContent = null;
    if (entries === void 0) {
      this._prelimContent = /* @__PURE__ */ new Map();
    } else {
      this._prelimContent = new Map(entries);
    }
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this._prelimContent.forEach((value, key) => {
      this.set(key, value);
    });
    this._prelimContent = null;
  }
  _copy() {
    return new YMap();
  }
  clone() {
    const map2 = new YMap();
    this.forEach((value, key) => {
      map2.set(key, value instanceof AbstractType ? value.clone() : value);
    });
    return map2;
  }
  _callObserver(transaction, parentSubs) {
    callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
  }
  toJSON() {
    const map2 = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        const v = item.content.getContent()[item.length - 1];
        map2[key] = v instanceof AbstractType ? v.toJSON() : v;
      }
    });
    return map2;
  }
  get size() {
    return [...createMapIterator(this._map)].length;
  }
  keys() {
    return iteratorMap(createMapIterator(this._map), (v) => v[0]);
  }
  values() {
    return iteratorMap(createMapIterator(this._map), (v) => v[1].content.getContent()[v[1].length - 1]);
  }
  entries() {
    return iteratorMap(createMapIterator(this._map), (v) => [v[0], v[1].content.getContent()[v[1].length - 1]]);
  }
  forEach(f) {
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        f(item.content.getContent()[item.length - 1], key, this);
      }
    });
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  delete(key) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, key);
      });
    } else {
      this._prelimContent.delete(key);
    }
  }
  set(key, value) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, key, value);
      });
    } else {
      this._prelimContent.set(key, value);
    }
    return value;
  }
  get(key) {
    return typeMapGet(this, key);
  }
  has(key) {
    return typeMapHas(this, key);
  }
  clear() {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        this.forEach(function(_value, key, map2) {
          typeMapDelete(transaction, map2, key);
        });
      });
    } else {
      this._prelimContent.clear();
    }
  }
  _write(encoder) {
    encoder.writeTypeRef(YMapRefID);
  }
}
const readYMap = (_decoder) => new YMap();
const equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && equalFlat(a, b);
class ItemTextListPosition {
  constructor(left, right, index, currentAttributes) {
    this.left = left;
    this.right = right;
    this.index = index;
    this.currentAttributes = currentAttributes;
  }
  forward() {
    if (this.right === null) {
      unexpectedCase();
    }
    switch (this.right.content.constructor) {
      case ContentFormat:
        if (!this.right.deleted) {
          updateCurrentAttributes(this.currentAttributes, this.right.content);
        }
        break;
      default:
        if (!this.right.deleted) {
          this.index += this.right.length;
        }
        break;
    }
    this.left = this.right;
    this.right = this.right.right;
  }
}
const findNextPosition = (transaction, pos, count) => {
  while (pos.right !== null && count > 0) {
    switch (pos.right.content.constructor) {
      case ContentFormat:
        if (!pos.right.deleted) {
          updateCurrentAttributes(pos.currentAttributes, pos.right.content);
        }
        break;
      default:
        if (!pos.right.deleted) {
          if (count < pos.right.length) {
            getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
          }
          pos.index += pos.right.length;
          count -= pos.right.length;
        }
        break;
    }
    pos.left = pos.right;
    pos.right = pos.right.right;
  }
  return pos;
};
const findPosition = (transaction, parent, index, useSearchMarker) => {
  const currentAttributes = /* @__PURE__ */ new Map();
  const marker = useSearchMarker ? findMarker(parent, index) : null;
  if (marker) {
    const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
    return findNextPosition(transaction, pos, index - marker.index);
  } else {
    const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
    return findNextPosition(transaction, pos, index);
  }
};
const insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
  while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(negatedAttributes.get(currPos.right.content.key), currPos.right.content.value))) {
    if (!currPos.right.deleted) {
      negatedAttributes.delete(currPos.right.content.key);
    }
    currPos.forward();
  }
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  negatedAttributes.forEach((val, key) => {
    const left = currPos.left;
    const right = currPos.right;
    const nextFormat = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
    nextFormat.integrate(transaction, 0);
    currPos.right = nextFormat;
    currPos.forward();
  });
};
const updateCurrentAttributes = (currentAttributes, format) => {
  const { key, value } = format;
  if (value === null) {
    currentAttributes.delete(key);
  } else {
    currentAttributes.set(key, value);
  }
};
const minimizeAttributeChanges = (currPos, attributes) => {
  while (true) {
    if (currPos.right === null) {
      break;
    } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(attributes[currPos.right.content.key] || null, currPos.right.content.value))
      ;
    else {
      break;
    }
    currPos.forward();
  }
};
const insertAttributes = (transaction, parent, currPos, attributes) => {
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  const negatedAttributes = /* @__PURE__ */ new Map();
  for (const key in attributes) {
    const val = attributes[key];
    const currentVal = currPos.currentAttributes.get(key) || null;
    if (!equalAttrs(currentVal, val)) {
      negatedAttributes.set(key, currentVal);
      const { left, right } = currPos;
      currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
  }
  return negatedAttributes;
};
const insertText = (transaction, parent, currPos, text, attributes) => {
  currPos.currentAttributes.forEach((_val, key) => {
    if (attributes[key] === void 0) {
      attributes[key] = null;
    }
  });
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  const content = text.constructor === String ? new ContentString(text) : text instanceof AbstractType ? new ContentType(text) : new ContentEmbed(text);
  let { left, right, index } = currPos;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
  }
  right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
  right.integrate(transaction, 0);
  currPos.right = right;
  currPos.index = index;
  currPos.forward();
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};
const formatText = (transaction, parent, currPos, length2, attributes) => {
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  iterationLoop:
    while (currPos.right !== null && (length2 > 0 || negatedAttributes.size > 0 && (currPos.right.deleted || currPos.right.content.constructor === ContentFormat))) {
      if (!currPos.right.deleted) {
        switch (currPos.right.content.constructor) {
          case ContentFormat: {
            const { key, value } = currPos.right.content;
            const attr = attributes[key];
            if (attr !== void 0) {
              if (equalAttrs(attr, value)) {
                negatedAttributes.delete(key);
              } else {
                if (length2 === 0) {
                  break iterationLoop;
                }
                negatedAttributes.set(key, value);
              }
              currPos.right.delete(transaction);
            } else {
              currPos.currentAttributes.set(key, value);
            }
            break;
          }
          default:
            if (length2 < currPos.right.length) {
              getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
            }
            length2 -= currPos.right.length;
            break;
        }
      }
      currPos.forward();
    }
  if (length2 > 0) {
    let newlines = "";
    for (; length2 > 0; length2--) {
      newlines += "\n";
    }
    currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
    currPos.right.integrate(transaction, 0);
    currPos.forward();
  }
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};
const cleanupFormattingGap = (transaction, start, curr, startAttributes, currAttributes) => {
  let end = start;
  const endFormats = create$5();
  while (end && (!end.countable || end.deleted)) {
    if (!end.deleted && end.content.constructor === ContentFormat) {
      const cf = end.content;
      endFormats.set(cf.key, cf);
    }
    end = end.right;
  }
  let cleanups = 0;
  let reachedCurr = false;
  while (start !== end) {
    if (curr === start) {
      reachedCurr = true;
    }
    if (!start.deleted) {
      const content = start.content;
      switch (content.constructor) {
        case ContentFormat: {
          const { key, value } = content;
          const startAttrValue = startAttributes.get(key) || null;
          if (endFormats.get(key) !== content || startAttrValue === value) {
            start.delete(transaction);
            cleanups++;
            if (!reachedCurr && (currAttributes.get(key) || null) === value && startAttrValue !== value) {
              if (startAttrValue === null) {
                currAttributes.delete(key);
              } else {
                currAttributes.set(key, startAttrValue);
              }
            }
          }
          if (!reachedCurr && !start.deleted) {
            updateCurrentAttributes(currAttributes, content);
          }
          break;
        }
      }
    }
    start = start.right;
  }
  return cleanups;
};
const cleanupContextlessFormattingGap = (transaction, item) => {
  while (item && item.right && (item.right.deleted || !item.right.countable)) {
    item = item.right;
  }
  const attrs = /* @__PURE__ */ new Set();
  while (item && (item.deleted || !item.countable)) {
    if (!item.deleted && item.content.constructor === ContentFormat) {
      const key = item.content.key;
      if (attrs.has(key)) {
        item.delete(transaction);
      } else {
        attrs.add(key);
      }
    }
    item = item.left;
  }
};
const cleanupYTextFormatting = (type) => {
  let res = 0;
  transact(type.doc, (transaction) => {
    let start = type._start;
    let end = type._start;
    let startAttributes = create$5();
    const currentAttributes = copy(startAttributes);
    while (end) {
      if (end.deleted === false) {
        switch (end.content.constructor) {
          case ContentFormat:
            updateCurrentAttributes(currentAttributes, end.content);
            break;
          default:
            res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
            startAttributes = copy(currentAttributes);
            start = end;
            break;
        }
      }
      end = end.right;
    }
  });
  return res;
};
const cleanupYTextAfterTransaction = (transaction) => {
  const needFullCleanup = /* @__PURE__ */ new Set();
  const doc2 = transaction.doc;
  for (const [client, afterClock] of transaction.afterState.entries()) {
    const clock = transaction.beforeState.get(client) || 0;
    if (afterClock === clock) {
      continue;
    }
    iterateStructs(transaction, doc2.store.clients.get(client), clock, afterClock, (item) => {
      if (!item.deleted && item.content.constructor === ContentFormat && item.constructor !== GC) {
        needFullCleanup.add(item.parent);
      }
    });
  }
  transact(doc2, (t) => {
    iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
      if (item instanceof GC || !item.parent._hasFormatting || needFullCleanup.has(item.parent)) {
        return;
      }
      const parent = item.parent;
      if (item.content.constructor === ContentFormat) {
        needFullCleanup.add(parent);
      } else {
        cleanupContextlessFormattingGap(t, item);
      }
    });
    for (const yText of needFullCleanup) {
      cleanupYTextFormatting(yText);
    }
  });
};
const deleteText = (transaction, currPos, length2) => {
  const startLength = length2;
  const startAttrs = copy(currPos.currentAttributes);
  const start = currPos.right;
  while (length2 > 0 && currPos.right !== null) {
    if (currPos.right.deleted === false) {
      switch (currPos.right.content.constructor) {
        case ContentType:
        case ContentEmbed:
        case ContentString:
          if (length2 < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
          }
          length2 -= currPos.right.length;
          currPos.right.delete(transaction);
          break;
      }
    }
    currPos.forward();
  }
  if (start) {
    cleanupFormattingGap(transaction, start, currPos.right, startAttrs, currPos.currentAttributes);
  }
  const parent = (currPos.left || currPos.right).parent;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length2);
  }
  return currPos;
};
class YTextEvent extends YEvent {
  constructor(ytext, transaction, subs) {
    super(ytext, transaction);
    this.childListChanged = false;
    this.keysChanged = /* @__PURE__ */ new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.keysChanged.add(sub);
      }
    });
  }
  get changes() {
    if (this._changes === null) {
      const changes = {
        keys: this.keys,
        delta: this.delta,
        added: /* @__PURE__ */ new Set(),
        deleted: /* @__PURE__ */ new Set()
      };
      this._changes = changes;
    }
    return this._changes;
  }
  get delta() {
    if (this._delta === null) {
      const y = this.target.doc;
      const delta = [];
      transact(y, (transaction) => {
        const currentAttributes = /* @__PURE__ */ new Map();
        const oldAttributes = /* @__PURE__ */ new Map();
        let item = this.target._start;
        let action = null;
        const attributes = {};
        let insert = "";
        let retain = 0;
        let deleteLen = 0;
        const addOp = () => {
          if (action !== null) {
            let op = null;
            switch (action) {
              case "delete":
                if (deleteLen > 0) {
                  op = { delete: deleteLen };
                }
                deleteLen = 0;
                break;
              case "insert":
                if (typeof insert === "object" || insert.length > 0) {
                  op = { insert };
                  if (currentAttributes.size > 0) {
                    op.attributes = {};
                    currentAttributes.forEach((value, key) => {
                      if (value !== null) {
                        op.attributes[key] = value;
                      }
                    });
                  }
                }
                insert = "";
                break;
              case "retain":
                if (retain > 0) {
                  op = { retain };
                  if (!isEmpty(attributes)) {
                    op.attributes = assign({}, attributes);
                  }
                }
                retain = 0;
                break;
            }
            if (op)
              delta.push(op);
            action = null;
          }
        };
        while (item !== null) {
          switch (item.content.constructor) {
            case ContentType:
            case ContentEmbed:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  addOp();
                  action = "insert";
                  insert = item.content.getContent()[0];
                  addOp();
                }
              } else if (this.deletes(item)) {
                if (action !== "delete") {
                  addOp();
                  action = "delete";
                }
                deleteLen += 1;
              } else if (!item.deleted) {
                if (action !== "retain") {
                  addOp();
                  action = "retain";
                }
                retain += 1;
              }
              break;
            case ContentString:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  if (action !== "insert") {
                    addOp();
                    action = "insert";
                  }
                  insert += item.content.str;
                }
              } else if (this.deletes(item)) {
                if (action !== "delete") {
                  addOp();
                  action = "delete";
                }
                deleteLen += item.length;
              } else if (!item.deleted) {
                if (action !== "retain") {
                  addOp();
                  action = "retain";
                }
                retain += item.length;
              }
              break;
            case ContentFormat: {
              const { key, value } = item.content;
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  const curVal = currentAttributes.get(key) || null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    if (equalAttrs(value, oldAttributes.get(key) || null)) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else if (value !== null) {
                    item.delete(transaction);
                  }
                }
              } else if (this.deletes(item)) {
                oldAttributes.set(key, value);
                const curVal = currentAttributes.get(key) || null;
                if (!equalAttrs(curVal, value)) {
                  if (action === "retain") {
                    addOp();
                  }
                  attributes[key] = curVal;
                }
              } else if (!item.deleted) {
                oldAttributes.set(key, value);
                const attr = attributes[key];
                if (attr !== void 0) {
                  if (!equalAttrs(attr, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    if (value === null) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else if (attr !== null) {
                    item.delete(transaction);
                  }
                }
              }
              if (!item.deleted) {
                if (action === "insert") {
                  addOp();
                }
                updateCurrentAttributes(currentAttributes, item.content);
              }
              break;
            }
          }
          item = item.right;
        }
        addOp();
        while (delta.length > 0) {
          const lastOp = delta[delta.length - 1];
          if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
            delta.pop();
          } else {
            break;
          }
        }
      });
      this._delta = delta;
    }
    return this._delta;
  }
}
class YText extends AbstractType {
  constructor(string) {
    super();
    this._pending = string !== void 0 ? [() => this.insert(0, string)] : [];
    this._searchMarker = [];
    this._hasFormatting = false;
  }
  get length() {
    return this._length;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    try {
      this._pending.forEach((f) => f());
    } catch (e) {
      console.error(e);
    }
    this._pending = null;
  }
  _copy() {
    return new YText();
  }
  clone() {
    const text = new YText();
    text.applyDelta(this.toDelta());
    return text;
  }
  _callObserver(transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    const event = new YTextEvent(this, transaction, parentSubs);
    callTypeObservers(this, transaction, event);
    if (!transaction.local && this._hasFormatting) {
      transaction._needFormattingCleanup = true;
    }
  }
  toString() {
    let str = "";
    let n = this._start;
    while (n !== null) {
      if (!n.deleted && n.countable && n.content.constructor === ContentString) {
        str += n.content.str;
      }
      n = n.right;
    }
    return str;
  }
  toJSON() {
    return this.toString();
  }
  applyDelta(delta, { sanitize = true } = {}) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        const currPos = new ItemTextListPosition(null, this._start, 0, /* @__PURE__ */ new Map());
        for (let i = 0; i < delta.length; i++) {
          const op = delta[i];
          if (op.insert !== void 0) {
            const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
            if (typeof ins !== "string" || ins.length > 0) {
              insertText(transaction, this, currPos, ins, op.attributes || {});
            }
          } else if (op.retain !== void 0) {
            formatText(transaction, this, currPos, op.retain, op.attributes || {});
          } else if (op.delete !== void 0) {
            deleteText(transaction, currPos, op.delete);
          }
        }
      });
    } else {
      this._pending.push(() => this.applyDelta(delta));
    }
  }
  toDelta(snapshot, prevSnapshot, computeYChange) {
    const ops = [];
    const currentAttributes = /* @__PURE__ */ new Map();
    const doc2 = this.doc;
    let str = "";
    let n = this._start;
    function packStr() {
      if (str.length > 0) {
        const attributes = {};
        let addAttributes = false;
        currentAttributes.forEach((value, key) => {
          addAttributes = true;
          attributes[key] = value;
        });
        const op = { insert: str };
        if (addAttributes) {
          op.attributes = attributes;
        }
        ops.push(op);
        str = "";
      }
    }
    const computeDelta = () => {
      while (n !== null) {
        if (isVisible(n, snapshot) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
          switch (n.content.constructor) {
            case ContentString: {
              const cur = currentAttributes.get("ychange");
              if (snapshot !== void 0 && !isVisible(n, snapshot)) {
                if (cur === void 0 || cur.user !== n.id.client || cur.type !== "removed") {
                  packStr();
                  currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                }
              } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                if (cur === void 0 || cur.user !== n.id.client || cur.type !== "added") {
                  packStr();
                  currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                }
              } else if (cur !== void 0) {
                packStr();
                currentAttributes.delete("ychange");
              }
              str += n.content.str;
              break;
            }
            case ContentType:
            case ContentEmbed: {
              packStr();
              const op = {
                insert: n.content.getContent()[0]
              };
              if (currentAttributes.size > 0) {
                const attrs = {};
                op.attributes = attrs;
                currentAttributes.forEach((value, key) => {
                  attrs[key] = value;
                });
              }
              ops.push(op);
              break;
            }
            case ContentFormat:
              if (isVisible(n, snapshot)) {
                packStr();
                updateCurrentAttributes(currentAttributes, n.content);
              }
              break;
          }
        }
        n = n.right;
      }
      packStr();
    };
    if (snapshot || prevSnapshot) {
      transact(doc2, (transaction) => {
        if (snapshot) {
          splitSnapshotAffectedStructs(transaction, snapshot);
        }
        if (prevSnapshot) {
          splitSnapshotAffectedStructs(transaction, prevSnapshot);
        }
        computeDelta();
      }, "cleanup");
    } else {
      computeDelta();
    }
    return ops;
  }
  insert(index, text, attributes) {
    if (text.length <= 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index, !attributes);
        if (!attributes) {
          attributes = {};
          pos.currentAttributes.forEach((v, k) => {
            attributes[k] = v;
          });
        }
        insertText(transaction, this, pos, text, attributes);
      });
    } else {
      this._pending.push(() => this.insert(index, text, attributes));
    }
  }
  insertEmbed(index, embed, attributes) {
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index, !attributes);
        insertText(transaction, this, pos, embed, attributes || {});
      });
    } else {
      this._pending.push(() => this.insertEmbed(index, embed, attributes || {}));
    }
  }
  delete(index, length2) {
    if (length2 === 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        deleteText(transaction, findPosition(transaction, this, index, true), length2);
      });
    } else {
      this._pending.push(() => this.delete(index, length2));
    }
  }
  format(index, length2, attributes) {
    if (length2 === 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index, false);
        if (pos.right === null) {
          return;
        }
        formatText(transaction, this, pos, length2, attributes);
      });
    } else {
      this._pending.push(() => this.format(index, length2, attributes));
    }
  }
  removeAttribute(attributeName) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      this._pending.push(() => this.removeAttribute(attributeName));
    }
  }
  setAttribute(attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      this._pending.push(() => this.setAttribute(attributeName, attributeValue));
    }
  }
  getAttribute(attributeName) {
    return typeMapGet(this, attributeName);
  }
  getAttributes() {
    return typeMapGetAll(this);
  }
  _write(encoder) {
    encoder.writeTypeRef(YTextRefID);
  }
}
const readYText = (_decoder) => new YText();
class YXmlTreeWalker {
  constructor(root, f = () => true) {
    this._filter = f;
    this._root = root;
    this._currentNode = root._start;
    this._firstCall = true;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    let n = this._currentNode;
    let type = n && n.content && n.content.type;
    if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
      do {
        type = n.content.type;
        if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
          n = type._start;
        } else {
          while (n !== null) {
            if (n.right !== null) {
              n = n.right;
              break;
            } else if (n.parent === this._root) {
              n = null;
            } else {
              n = n.parent._item;
            }
          }
        }
      } while (n !== null && (n.deleted || !this._filter(n.content.type)));
    }
    this._firstCall = false;
    if (n === null) {
      return { value: void 0, done: true };
    }
    this._currentNode = n;
    return { value: n.content.type, done: false };
  }
}
class YXmlFragment extends AbstractType {
  constructor() {
    super();
    this._prelimContent = [];
  }
  get firstChild() {
    const first = this._first;
    return first ? first.content.getContent()[0] : null;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this.insert(0, this._prelimContent);
    this._prelimContent = null;
  }
  _copy() {
    return new YXmlFragment();
  }
  clone() {
    const el = new YXmlFragment();
    el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
    return el;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  createTreeWalker(filter) {
    return new YXmlTreeWalker(this, filter);
  }
  querySelector(query) {
    query = query.toUpperCase();
    const iterator = new YXmlTreeWalker(this, (element) => element.nodeName && element.nodeName.toUpperCase() === query);
    const next = iterator.next();
    if (next.done) {
      return null;
    } else {
      return next.value;
    }
  }
  querySelectorAll(query) {
    query = query.toUpperCase();
    return from(new YXmlTreeWalker(this, (element) => element.nodeName && element.nodeName.toUpperCase() === query));
  }
  _callObserver(transaction, parentSubs) {
    callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
  }
  toString() {
    return typeListMap(this, (xml) => xml.toString()).join("");
  }
  toJSON() {
    return this.toString();
  }
  toDOM(_document = document, hooks = {}, binding) {
    const fragment = _document.createDocumentFragment();
    if (binding !== void 0) {
      binding._createAssociation(fragment, this);
    }
    typeListForEach(this, (xmlType) => {
      fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
    });
    return fragment;
  }
  insert(index, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      this._prelimContent.splice(index, 0, ...content);
    }
  }
  insertAfter(ref, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
        typeListInsertGenericsAfter(transaction, this, refItem, content);
      });
    } else {
      const pc = this._prelimContent;
      const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
      if (index === 0 && ref !== null) {
        throw create$3("Reference item not found");
      }
      pc.splice(index, 0, ...content);
    }
  }
  delete(index, length2 = 1) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListDelete(transaction, this, index, length2);
      });
    } else {
      this._prelimContent.splice(index, length2);
    }
  }
  toArray() {
    return typeListToArray(this);
  }
  push(content) {
    this.insert(this.length, content);
  }
  unshift(content) {
    this.insert(0, content);
  }
  get(index) {
    return typeListGet(this, index);
  }
  slice(start = 0, end = this.length) {
    return typeListSlice(this, start, end);
  }
  forEach(f) {
    typeListForEach(this, f);
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlFragmentRefID);
  }
}
const readYXmlFragment = (_decoder) => new YXmlFragment();
class YXmlElement extends YXmlFragment {
  constructor(nodeName = "UNDEFINED") {
    super();
    this.nodeName = nodeName;
    this._prelimAttrs = /* @__PURE__ */ new Map();
  }
  get nextSibling() {
    const n = this._item ? this._item.next : null;
    return n ? n.content.type : null;
  }
  get prevSibling() {
    const n = this._item ? this._item.prev : null;
    return n ? n.content.type : null;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this._prelimAttrs.forEach((value, key) => {
      this.setAttribute(key, value);
    });
    this._prelimAttrs = null;
  }
  _copy() {
    return new YXmlElement(this.nodeName);
  }
  clone() {
    const el = new YXmlElement(this.nodeName);
    const attrs = this.getAttributes();
    forEach(attrs, (value, key) => {
      if (typeof value === "string") {
        el.setAttribute(key, value);
      }
    });
    el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
    return el;
  }
  toString() {
    const attrs = this.getAttributes();
    const stringBuilder = [];
    const keys2 = [];
    for (const key in attrs) {
      keys2.push(key);
    }
    keys2.sort();
    const keysLen = keys2.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys2[i];
      stringBuilder.push(key + '="' + attrs[key] + '"');
    }
    const nodeName = this.nodeName.toLocaleLowerCase();
    const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
    return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
  }
  removeAttribute(attributeName) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      this._prelimAttrs.delete(attributeName);
    }
  }
  setAttribute(attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      this._prelimAttrs.set(attributeName, attributeValue);
    }
  }
  getAttribute(attributeName) {
    return typeMapGet(this, attributeName);
  }
  hasAttribute(attributeName) {
    return typeMapHas(this, attributeName);
  }
  getAttributes(snapshot) {
    return snapshot ? typeMapGetAllSnapshot(this, snapshot) : typeMapGetAll(this);
  }
  toDOM(_document = document, hooks = {}, binding) {
    const dom = _document.createElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      const value = attrs[key];
      if (typeof value === "string") {
        dom.setAttribute(key, value);
      }
    }
    typeListForEach(this, (yxml) => {
      dom.appendChild(yxml.toDOM(_document, hooks, binding));
    });
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlElementRefID);
    encoder.writeKey(this.nodeName);
  }
}
const readYXmlElement = (decoder) => new YXmlElement(decoder.readKey());
class YXmlEvent extends YEvent {
  constructor(target, subs, transaction) {
    super(target, transaction);
    this.childListChanged = false;
    this.attributesChanged = /* @__PURE__ */ new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.attributesChanged.add(sub);
      }
    });
  }
}
class YXmlHook extends YMap {
  constructor(hookName) {
    super();
    this.hookName = hookName;
  }
  _copy() {
    return new YXmlHook(this.hookName);
  }
  clone() {
    const el = new YXmlHook(this.hookName);
    this.forEach((value, key) => {
      el.set(key, value);
    });
    return el;
  }
  toDOM(_document = document, hooks = {}, binding) {
    const hook = hooks[this.hookName];
    let dom;
    if (hook !== void 0) {
      dom = hook.createDom(this);
    } else {
      dom = document.createElement(this.hookName);
    }
    dom.setAttribute("data-yjs-hook", this.hookName);
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlHookRefID);
    encoder.writeKey(this.hookName);
  }
}
const readYXmlHook = (decoder) => new YXmlHook(decoder.readKey());
class YXmlText extends YText {
  get nextSibling() {
    const n = this._item ? this._item.next : null;
    return n ? n.content.type : null;
  }
  get prevSibling() {
    const n = this._item ? this._item.prev : null;
    return n ? n.content.type : null;
  }
  _copy() {
    return new YXmlText();
  }
  clone() {
    const text = new YXmlText();
    text.applyDelta(this.toDelta());
    return text;
  }
  toDOM(_document = document, hooks, binding) {
    const dom = _document.createTextNode(this.toString());
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  toString() {
    return this.toDelta().map((delta) => {
      const nestedNodes = [];
      for (const nodeName in delta.attributes) {
        const attrs = [];
        for (const key in delta.attributes[nodeName]) {
          attrs.push({ key, value: delta.attributes[nodeName][key] });
        }
        attrs.sort((a, b) => a.key < b.key ? -1 : 1);
        nestedNodes.push({ nodeName, attrs });
      }
      nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
      let str = "";
      for (let i = 0; i < nestedNodes.length; i++) {
        const node = nestedNodes[i];
        str += `<${node.nodeName}`;
        for (let j = 0; j < node.attrs.length; j++) {
          const attr = node.attrs[j];
          str += ` ${attr.key}="${attr.value}"`;
        }
        str += ">";
      }
      str += delta.insert;
      for (let i = nestedNodes.length - 1; i >= 0; i--) {
        str += `</${nestedNodes[i].nodeName}>`;
      }
      return str;
    }).join("");
  }
  toJSON() {
    return this.toString();
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlTextRefID);
  }
}
const readYXmlText = (decoder) => new YXmlText();
class AbstractStruct {
  constructor(id2, length2) {
    this.id = id2;
    this.length = length2;
  }
  get deleted() {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  write(encoder, offset, encodingRef) {
    throw methodUnimplemented();
  }
  integrate(transaction, offset) {
    throw methodUnimplemented();
  }
}
const structGCRefNumber = 0;
class GC extends AbstractStruct {
  get deleted() {
    return true;
  }
  delete() {
  }
  mergeWith(right) {
    if (this.constructor !== right.constructor) {
      return false;
    }
    this.length += right.length;
    return true;
  }
  integrate(transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.length -= offset;
    }
    addStruct(transaction.doc.store, this);
  }
  write(encoder, offset) {
    encoder.writeInfo(structGCRefNumber);
    encoder.writeLen(this.length - offset);
  }
  getMissing(transaction, store) {
    return null;
  }
}
class ContentBinary {
  constructor(content) {
    this.content = content;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.content];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentBinary(this.content);
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeBuf(this.content);
  }
  getRef() {
    return 3;
  }
}
const readContentBinary = (decoder) => new ContentBinary(decoder.readBuf());
class ContentDeleted {
  constructor(len) {
    this.len = len;
  }
  getLength() {
    return this.len;
  }
  getContent() {
    return [];
  }
  isCountable() {
    return false;
  }
  copy() {
    return new ContentDeleted(this.len);
  }
  splice(offset) {
    const right = new ContentDeleted(this.len - offset);
    this.len = offset;
    return right;
  }
  mergeWith(right) {
    this.len += right.len;
    return true;
  }
  integrate(transaction, item) {
    addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
    item.markDeleted();
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeLen(this.len - offset);
  }
  getRef() {
    return 1;
  }
}
const readContentDeleted = (decoder) => new ContentDeleted(decoder.readLen());
const createDocFromOpts = (guid, opts) => new Doc(__spreadProps(__spreadValues({ guid }, opts), { shouldLoad: opts.shouldLoad || opts.autoLoad || false }));
class ContentDoc {
  constructor(doc2) {
    if (doc2._item) {
      console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
    }
    this.doc = doc2;
    const opts = {};
    this.opts = opts;
    if (!doc2.gc) {
      opts.gc = false;
    }
    if (doc2.autoLoad) {
      opts.autoLoad = true;
    }
    if (doc2.meta !== null) {
      opts.meta = doc2.meta;
    }
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.doc];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
    this.doc._item = item;
    transaction.subdocsAdded.add(this.doc);
    if (this.doc.shouldLoad) {
      transaction.subdocsLoaded.add(this.doc);
    }
  }
  delete(transaction) {
    if (transaction.subdocsAdded.has(this.doc)) {
      transaction.subdocsAdded.delete(this.doc);
    } else {
      transaction.subdocsRemoved.add(this.doc);
    }
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeString(this.doc.guid);
    encoder.writeAny(this.opts);
  }
  getRef() {
    return 9;
  }
}
const readContentDoc = (decoder) => new ContentDoc(createDocFromOpts(decoder.readString(), decoder.readAny()));
class ContentEmbed {
  constructor(embed) {
    this.embed = embed;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.embed];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentEmbed(this.embed);
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeJSON(this.embed);
  }
  getRef() {
    return 5;
  }
}
const readContentEmbed = (decoder) => new ContentEmbed(decoder.readJSON());
class ContentFormat {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [];
  }
  isCountable() {
    return false;
  }
  copy() {
    return new ContentFormat(this.key, this.value);
  }
  splice(_offset) {
    throw methodUnimplemented();
  }
  mergeWith(_right) {
    return false;
  }
  integrate(_transaction, item) {
    const p = item.parent;
    p._searchMarker = null;
    p._hasFormatting = true;
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeKey(this.key);
    encoder.writeJSON(this.value);
  }
  getRef() {
    return 6;
  }
}
const readContentFormat = (decoder) => new ContentFormat(decoder.readKey(), decoder.readJSON());
class ContentJSON {
  constructor(arr) {
    this.arr = arr;
  }
  getLength() {
    return this.arr.length;
  }
  getContent() {
    return this.arr;
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentJSON(this.arr);
  }
  splice(offset) {
    const right = new ContentJSON(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right;
  }
  mergeWith(right) {
    this.arr = this.arr.concat(right.arr);
    return true;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeString(c === void 0 ? "undefined" : JSON.stringify(c));
    }
  }
  getRef() {
    return 2;
  }
}
const readContentJSON = (decoder) => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    const c = decoder.readString();
    if (c === "undefined") {
      cs.push(void 0);
    } else {
      cs.push(JSON.parse(c));
    }
  }
  return new ContentJSON(cs);
};
class ContentAny {
  constructor(arr) {
    this.arr = arr;
  }
  getLength() {
    return this.arr.length;
  }
  getContent() {
    return this.arr;
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentAny(this.arr);
  }
  splice(offset) {
    const right = new ContentAny(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right;
  }
  mergeWith(right) {
    this.arr = this.arr.concat(right.arr);
    return true;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeAny(c);
    }
  }
  getRef() {
    return 8;
  }
}
const readContentAny = (decoder) => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    cs.push(decoder.readAny());
  }
  return new ContentAny(cs);
};
class ContentString {
  constructor(str) {
    this.str = str;
  }
  getLength() {
    return this.str.length;
  }
  getContent() {
    return this.str.split("");
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentString(this.str);
  }
  splice(offset) {
    const right = new ContentString(this.str.slice(offset));
    this.str = this.str.slice(0, offset);
    const firstCharCode = this.str.charCodeAt(offset - 1);
    if (firstCharCode >= 55296 && firstCharCode <= 56319) {
      this.str = this.str.slice(0, offset - 1) + "\uFFFD";
      right.str = "\uFFFD" + right.str.slice(1);
    }
    return right;
  }
  mergeWith(right) {
    this.str += right.str;
    return true;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
  }
  getRef() {
    return 4;
  }
}
const readContentString = (decoder) => new ContentString(decoder.readString());
const typeRefs = [
  readYArray,
  readYMap,
  readYText,
  readYXmlElement,
  readYXmlFragment,
  readYXmlHook,
  readYXmlText
];
const YArrayRefID = 0;
const YMapRefID = 1;
const YTextRefID = 2;
const YXmlElementRefID = 3;
const YXmlFragmentRefID = 4;
const YXmlHookRefID = 5;
const YXmlTextRefID = 6;
class ContentType {
  constructor(type) {
    this.type = type;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.type];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentType(this.type._copy());
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
    this.type._integrate(transaction.doc, item);
  }
  delete(transaction) {
    let item = this.type._start;
    while (item !== null) {
      if (!item.deleted) {
        item.delete(transaction);
      } else if (item.id.clock < (transaction.beforeState.get(item.id.client) || 0)) {
        transaction._mergeStructs.push(item);
      }
      item = item.right;
    }
    this.type._map.forEach((item2) => {
      if (!item2.deleted) {
        item2.delete(transaction);
      } else if (item2.id.clock < (transaction.beforeState.get(item2.id.client) || 0)) {
        transaction._mergeStructs.push(item2);
      }
    });
    transaction.changed.delete(this.type);
  }
  gc(store) {
    let item = this.type._start;
    while (item !== null) {
      item.gc(store, true);
      item = item.right;
    }
    this.type._start = null;
    this.type._map.forEach((item2) => {
      while (item2 !== null) {
        item2.gc(store, true);
        item2 = item2.left;
      }
    });
    this.type._map = /* @__PURE__ */ new Map();
  }
  write(encoder, offset) {
    this.type._write(encoder);
  }
  getRef() {
    return 7;
  }
}
const readContentType = (decoder) => new ContentType(typeRefs[decoder.readTypeRef()](decoder));
const splitItem = (transaction, leftItem, diff) => {
  const { client, clock } = leftItem.id;
  const rightItem = new Item(createID(client, clock + diff), leftItem, createID(client, clock + diff - 1), leftItem.right, leftItem.rightOrigin, leftItem.parent, leftItem.parentSub, leftItem.content.splice(diff));
  if (leftItem.deleted) {
    rightItem.markDeleted();
  }
  if (leftItem.keep) {
    rightItem.keep = true;
  }
  if (leftItem.redone !== null) {
    rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
  }
  leftItem.right = rightItem;
  if (rightItem.right !== null) {
    rightItem.right.left = rightItem;
  }
  transaction._mergeStructs.push(rightItem);
  if (rightItem.parentSub !== null && rightItem.right === null) {
    rightItem.parent._map.set(rightItem.parentSub, rightItem);
  }
  leftItem.length = diff;
  return rightItem;
};
class Item extends AbstractStruct {
  constructor(id2, left, origin, right, rightOrigin, parent, parentSub, content) {
    super(id2, content.getLength());
    this.origin = origin;
    this.left = left;
    this.right = right;
    this.rightOrigin = rightOrigin;
    this.parent = parent;
    this.parentSub = parentSub;
    this.redone = null;
    this.content = content;
    this.info = this.content.isCountable() ? BIT2 : 0;
  }
  set marker(isMarked) {
    if ((this.info & BIT4) > 0 !== isMarked) {
      this.info ^= BIT4;
    }
  }
  get marker() {
    return (this.info & BIT4) > 0;
  }
  get keep() {
    return (this.info & BIT1) > 0;
  }
  set keep(doKeep) {
    if (this.keep !== doKeep) {
      this.info ^= BIT1;
    }
  }
  get countable() {
    return (this.info & BIT2) > 0;
  }
  get deleted() {
    return (this.info & BIT3) > 0;
  }
  set deleted(doDelete) {
    if (this.deleted !== doDelete) {
      this.info ^= BIT3;
    }
  }
  markDeleted() {
    this.info |= BIT3;
  }
  getMissing(transaction, store) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
      return this.origin.client;
    }
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
      return this.rightOrigin.client;
    }
    if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
      return this.parent.client;
    }
    if (this.origin) {
      this.left = getItemCleanEnd(transaction, store, this.origin);
      this.origin = this.left.lastId;
    }
    if (this.rightOrigin) {
      this.right = getItemCleanStart(transaction, this.rightOrigin);
      this.rightOrigin = this.right.id;
    }
    if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
      this.parent = null;
    } else if (!this.parent) {
      if (this.left && this.left.constructor === Item) {
        this.parent = this.left.parent;
        this.parentSub = this.left.parentSub;
      }
      if (this.right && this.right.constructor === Item) {
        this.parent = this.right.parent;
        this.parentSub = this.right.parentSub;
      }
    } else if (this.parent.constructor === ID) {
      const parentItem = getItem(store, this.parent);
      if (parentItem.constructor === GC) {
        this.parent = null;
      } else {
        this.parent = parentItem.content.type;
      }
    }
    return null;
  }
  integrate(transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
      this.origin = this.left.lastId;
      this.content = this.content.splice(offset);
      this.length -= offset;
    }
    if (this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let left = this.left;
        let o;
        if (left !== null) {
          o = left.right;
        } else if (this.parentSub !== null) {
          o = this.parent._map.get(this.parentSub) || null;
          while (o !== null && o.left !== null) {
            o = o.left;
          }
        } else {
          o = this.parent._start;
        }
        const conflictingItems = /* @__PURE__ */ new Set();
        const itemsBeforeOrigin = /* @__PURE__ */ new Set();
        while (o !== null && o !== this.right) {
          itemsBeforeOrigin.add(o);
          conflictingItems.add(o);
          if (compareIDs(this.origin, o.origin)) {
            if (o.id.client < this.id.client) {
              left = o;
              conflictingItems.clear();
            } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
              break;
            }
          } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
            if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
              left = o;
              conflictingItems.clear();
            }
          } else {
            break;
          }
          o = o.right;
        }
        this.left = left;
      }
      if (this.left !== null) {
        const right = this.left.right;
        this.right = right;
        this.left.right = this;
      } else {
        let r;
        if (this.parentSub !== null) {
          r = this.parent._map.get(this.parentSub) || null;
          while (r !== null && r.left !== null) {
            r = r.left;
          }
        } else {
          r = this.parent._start;
          this.parent._start = this;
        }
        this.right = r;
      }
      if (this.right !== null) {
        this.right.left = this;
      } else if (this.parentSub !== null) {
        this.parent._map.set(this.parentSub, this);
        if (this.left !== null) {
          this.left.delete(transaction);
        }
      }
      if (this.parentSub === null && this.countable && !this.deleted) {
        this.parent._length += this.length;
      }
      addStruct(transaction.doc.store, this);
      this.content.integrate(transaction, this);
      addChangedTypeToTransaction(transaction, this.parent, this.parentSub);
      if (this.parent._item !== null && this.parent._item.deleted || this.parentSub !== null && this.right !== null) {
        this.delete(transaction);
      }
    } else {
      new GC(this.id, this.length).integrate(transaction, 0);
    }
  }
  get next() {
    let n = this.right;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n;
  }
  get prev() {
    let n = this.left;
    while (n !== null && n.deleted) {
      n = n.left;
    }
    return n;
  }
  get lastId() {
    return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
  }
  mergeWith(right) {
    if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
      const searchMarker = this.parent._searchMarker;
      if (searchMarker) {
        searchMarker.forEach((marker) => {
          if (marker.p === right) {
            marker.p = this;
            if (!this.deleted && this.countable) {
              marker.index -= this.length;
            }
          }
        });
      }
      if (right.keep) {
        this.keep = true;
      }
      this.right = right.right;
      if (this.right !== null) {
        this.right.left = this;
      }
      this.length += right.length;
      return true;
    }
    return false;
  }
  delete(transaction) {
    if (!this.deleted) {
      const parent = this.parent;
      if (this.countable && this.parentSub === null) {
        parent._length -= this.length;
      }
      this.markDeleted();
      addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
      addChangedTypeToTransaction(transaction, parent, this.parentSub);
      this.content.delete(transaction);
    }
  }
  gc(store, parentGCd) {
    if (!this.deleted) {
      throw unexpectedCase();
    }
    this.content.gc(store);
    if (parentGCd) {
      replaceStruct(store, this, new GC(this.id, this.length));
    } else {
      this.content = new ContentDeleted(this.length);
    }
  }
  write(encoder, offset) {
    const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
    const rightOrigin = this.rightOrigin;
    const parentSub = this.parentSub;
    const info = this.content.getRef() & BITS5 | (origin === null ? 0 : BIT8) | (rightOrigin === null ? 0 : BIT7) | (parentSub === null ? 0 : BIT6);
    encoder.writeInfo(info);
    if (origin !== null) {
      encoder.writeLeftID(origin);
    }
    if (rightOrigin !== null) {
      encoder.writeRightID(rightOrigin);
    }
    if (origin === null && rightOrigin === null) {
      const parent = this.parent;
      if (parent._item !== void 0) {
        const parentItem = parent._item;
        if (parentItem === null) {
          const ykey = findRootTypeKey(parent);
          encoder.writeParentInfo(true);
          encoder.writeString(ykey);
        } else {
          encoder.writeParentInfo(false);
          encoder.writeLeftID(parentItem.id);
        }
      } else if (parent.constructor === String) {
        encoder.writeParentInfo(true);
        encoder.writeString(parent);
      } else if (parent.constructor === ID) {
        encoder.writeParentInfo(false);
        encoder.writeLeftID(parent);
      } else {
        unexpectedCase();
      }
      if (parentSub !== null) {
        encoder.writeString(parentSub);
      }
    }
    this.content.write(encoder, offset);
  }
}
const readItemContent = (decoder, info) => contentRefs[info & BITS5](decoder);
const contentRefs = [
  () => {
    unexpectedCase();
  },
  readContentDeleted,
  readContentJSON,
  readContentBinary,
  readContentString,
  readContentEmbed,
  readContentFormat,
  readContentType,
  readContentAny,
  readContentDoc,
  () => {
    unexpectedCase();
  }
];
const structSkipRefNumber = 10;
class Skip extends AbstractStruct {
  get deleted() {
    return true;
  }
  delete() {
  }
  mergeWith(right) {
    if (this.constructor !== right.constructor) {
      return false;
    }
    this.length += right.length;
    return true;
  }
  integrate(transaction, offset) {
    unexpectedCase();
  }
  write(encoder, offset) {
    encoder.writeInfo(structSkipRefNumber);
    writeVarUint(encoder.restEncoder, this.length - offset);
  }
  getMissing(transaction, store) {
    return null;
  }
}
const glo = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
const importIdentifier = "__ $YJS$ __";
if (glo[importIdentifier] === true) {
  console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
}
glo[importIdentifier] = true;
const messageYjsSyncStep1 = 0;
const messageYjsSyncStep2 = 1;
const messageYjsUpdate = 2;
const writeSyncStep1 = (encoder, doc2) => {
  writeVarUint(encoder, messageYjsSyncStep1);
  const sv = encodeStateVector(doc2);
  writeVarUint8Array(encoder, sv);
};
const writeSyncStep2 = (encoder, doc2, encodedStateVector) => {
  writeVarUint(encoder, messageYjsSyncStep2);
  writeVarUint8Array(encoder, encodeStateAsUpdate(doc2, encodedStateVector));
};
const readSyncStep1 = (decoder, encoder, doc2) => writeSyncStep2(encoder, doc2, readVarUint8Array(decoder));
const readSyncStep2 = (decoder, doc2, transactionOrigin) => {
  try {
    applyUpdate(doc2, readVarUint8Array(decoder), transactionOrigin);
  } catch (error) {
    console.error("Caught error while handling a Yjs update", error);
  }
};
const writeUpdate = (encoder, update) => {
  writeVarUint(encoder, messageYjsUpdate);
  writeVarUint8Array(encoder, update);
};
const readUpdate = readSyncStep2;
const readSyncMessage = (decoder, encoder, doc2, transactionOrigin) => {
  const messageType = readVarUint(decoder);
  switch (messageType) {
    case messageYjsSyncStep1:
      readSyncStep1(decoder, encoder, doc2);
      break;
    case messageYjsSyncStep2:
      readSyncStep2(decoder, doc2, transactionOrigin);
      break;
    case messageYjsUpdate:
      readUpdate(decoder, doc2, transactionOrigin);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return messageType;
};
const outdatedTimeout = 3e4;
class Awareness extends Observable {
  constructor(doc2) {
    super();
    this.doc = doc2;
    this.clientID = doc2.clientID;
    this.states = /* @__PURE__ */ new Map();
    this.meta = /* @__PURE__ */ new Map();
    this._checkInterval = setInterval(() => {
      const now2 = getUnixTime();
      if (this.getLocalState() !== null && outdatedTimeout / 2 <= now2 - this.meta.get(this.clientID).lastUpdated) {
        this.setLocalState(this.getLocalState());
      }
      const remove = [];
      this.meta.forEach((meta, clientid) => {
        if (clientid !== this.clientID && outdatedTimeout <= now2 - meta.lastUpdated && this.states.has(clientid)) {
          remove.push(clientid);
        }
      });
      if (remove.length > 0) {
        removeAwarenessStates(this, remove, "timeout");
      }
    }, floor(outdatedTimeout / 10));
    doc2.on("destroy", () => {
      this.destroy();
    });
    this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]);
    this.setLocalState(null);
    super.destroy();
    clearInterval(this._checkInterval);
  }
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  setLocalState(state) {
    const clientID = this.clientID;
    const currLocalMeta = this.meta.get(clientID);
    const clock = currLocalMeta === void 0 ? 0 : currLocalMeta.clock + 1;
    const prevState = this.states.get(clientID);
    if (state === null) {
      this.states.delete(clientID);
    } else {
      this.states.set(clientID, state);
    }
    this.meta.set(clientID, {
      clock,
      lastUpdated: getUnixTime()
    });
    const added = [];
    const updated = [];
    const filteredUpdated = [];
    const removed = [];
    if (state === null) {
      removed.push(clientID);
    } else if (prevState == null) {
      if (state != null) {
        added.push(clientID);
      }
    } else {
      updated.push(clientID);
      if (!equalityDeep(prevState, state)) {
        filteredUpdated.push(clientID);
      }
    }
    if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
      this.emit("change", [{ added, updated: filteredUpdated, removed }, "local"]);
    }
    this.emit("update", [{ added, updated, removed }, "local"]);
  }
  setLocalStateField(field, value) {
    const state = this.getLocalState();
    if (state !== null) {
      this.setLocalState(__spreadProps(__spreadValues({}, state), {
        [field]: value
      }));
    }
  }
  getStates() {
    return this.states;
  }
}
const removeAwarenessStates = (awareness, clients, origin) => {
  const removed = [];
  for (let i = 0; i < clients.length; i++) {
    const clientID = clients[i];
    if (awareness.states.has(clientID)) {
      awareness.states.delete(clientID);
      if (clientID === awareness.clientID) {
        const curMeta = awareness.meta.get(clientID);
        awareness.meta.set(clientID, {
          clock: curMeta.clock + 1,
          lastUpdated: getUnixTime()
        });
      }
      removed.push(clientID);
    }
  }
  if (removed.length > 0) {
    awareness.emit("change", [{ added: [], updated: [], removed }, origin]);
    awareness.emit("update", [{ added: [], updated: [], removed }, origin]);
  }
};
const encodeAwarenessUpdate = (awareness, clients, states = awareness.states) => {
  const len = clients.length;
  const encoder = createEncoder();
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    const clientID = clients[i];
    const state = states.get(clientID) || null;
    const clock = awareness.meta.get(clientID).clock;
    writeVarUint(encoder, clientID);
    writeVarUint(encoder, clock);
    writeVarString(encoder, JSON.stringify(state));
  }
  return toUint8Array(encoder);
};
const applyAwarenessUpdate = (awareness, update, origin) => {
  const decoder = createDecoder(update);
  const timestamp = getUnixTime();
  const added = [];
  const updated = [];
  const filteredUpdated = [];
  const removed = [];
  const len = readVarUint(decoder);
  for (let i = 0; i < len; i++) {
    const clientID = readVarUint(decoder);
    let clock = readVarUint(decoder);
    const state = JSON.parse(readVarString(decoder));
    const clientMeta = awareness.meta.get(clientID);
    const prevState = awareness.states.get(clientID);
    const currClock = clientMeta === void 0 ? 0 : clientMeta.clock;
    if (currClock < clock || currClock === clock && state === null && awareness.states.has(clientID)) {
      if (state === null) {
        if (clientID === awareness.clientID && awareness.getLocalState() != null) {
          clock++;
        } else {
          awareness.states.delete(clientID);
        }
      } else {
        awareness.states.set(clientID, state);
      }
      awareness.meta.set(clientID, {
        clock,
        lastUpdated: timestamp
      });
      if (clientMeta === void 0 && state !== null) {
        added.push(clientID);
      } else if (clientMeta !== void 0 && state === null) {
        removed.push(clientID);
      } else if (state !== null) {
        if (!equalityDeep(state, prevState)) {
          filteredUpdated.push(clientID);
        }
        updated.push(clientID);
      }
    }
  }
  if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
    awareness.emit("change", [{
      added,
      updated: filteredUpdated,
      removed
    }, origin]);
  }
  if (added.length > 0 || updated.length > 0 || removed.length > 0) {
    awareness.emit("update", [{
      added,
      updated,
      removed
    }, origin]);
  }
};
const messagePermissionDenied = 0;
const readAuthMessage = (decoder, y, permissionDeniedHandler3) => {
  switch (readVarUint(decoder)) {
    case messagePermissionDenied:
      permissionDeniedHandler3(y, readVarString(decoder));
  }
};
const channels = /* @__PURE__ */ new Map();
class LocalStoragePolyfill {
  constructor(room) {
    this.room = room;
    this.onmessage = null;
    this._onChange = (e) => e.key === room && this.onmessage !== null && this.onmessage({ data: fromBase64(e.newValue || "") });
    onChange(this._onChange);
  }
  postMessage(buf) {
    varStorage.setItem(this.room, toBase64(createUint8ArrayFromArrayBuffer(buf)));
  }
  close() {
    offChange(this._onChange);
  }
}
const BC = typeof BroadcastChannel === "undefined" ? LocalStoragePolyfill : BroadcastChannel;
const getChannel = (room) => setIfUndefined(channels, room, () => {
  const subs = create$4();
  const bc = new BC(room);
  bc.onmessage = (e) => subs.forEach((sub) => sub(e.data, "broadcastchannel"));
  return {
    bc,
    subs
  };
});
const subscribe = (room, f) => {
  getChannel(room).subs.add(f);
  return f;
};
const unsubscribe = (room, f) => {
  const channel = getChannel(room);
  const unsubscribed = channel.subs.delete(f);
  if (unsubscribed && channel.subs.size === 0) {
    channel.bc.close();
    channels.delete(room);
  }
  return unsubscribed;
};
const publish = (room, data, origin = null) => {
  const c = getChannel(room);
  c.bc.postMessage(data);
  c.subs.forEach((sub) => sub(data, origin));
};
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
var _messageHandlers;
var MessageType;
(function(MessageType2) {
  MessageType2[MessageType2["Sync"] = 0] = "Sync";
  MessageType2[MessageType2["Awareness"] = 1] = "Awareness";
  MessageType2[MessageType2["Auth"] = 2] = "Auth";
  MessageType2[MessageType2["QueryAwareness"] = 3] = "QueryAwareness";
})(MessageType || (MessageType = {}));
var permissionDeniedHandler = function permissionDeniedHandler2(provider, reason) {
  console.warn("Permission denied to access " + provider.channelName + ".\n" + reason);
};
var messageHandlers = (_messageHandlers = {}, _messageHandlers[MessageType.Sync] = function(encoder, decoder, provider, emitSynced) {
  writeVarUint(encoder, MessageType.Sync);
  var syncMessageType = readSyncMessage(decoder, encoder, provider.doc, provider);
  if (emitSynced && syncMessageType === messageYjsSyncStep2 && !provider.synced) {
    provider.synced = true;
  }
}, _messageHandlers[MessageType.QueryAwareness] = function(encoder, _decoder, provider, _emitSynced, _messageType) {
  writeVarUint(encoder, MessageType.Awareness);
  writeVarUint8Array(encoder, encodeAwarenessUpdate(provider.awareness, Array.from(provider.awareness.getStates().keys())));
}, _messageHandlers[MessageType.Awareness] = function(_encoder, decoder, provider) {
  applyAwarenessUpdate(provider.awareness, readVarUint8Array(decoder), provider);
}, _messageHandlers[MessageType.Auth] = function(_encoder, decoder, provider) {
  readAuthMessage(decoder, provider.doc, function(_ydoc, reason) {
    return permissionDeniedHandler(provider, reason);
  });
}, _messageHandlers);
var WebsocketProvider = /* @__PURE__ */ function() {
  function WebsocketProvider2(doc2, consumer, channel, params2, _temp) {
    var _this = this;
    var _ref = _temp === void 0 ? {} : _temp, _ref$awareness = _ref.awareness, awareness = _ref$awareness === void 0 ? new Awareness(doc2) : _ref$awareness, _ref$disableBc = _ref.disableBc, disableBc = _ref$disableBc === void 0 ? false : _ref$disableBc;
    this.bcSubscriber = function(data, origin) {
      if (origin !== _this) {
        var encoder = _this.process(new Uint8Array(data), false);
        if (length$1(encoder) > 1) {
          publish(_this.bcChannelName, toUint8Array(encoder), _this);
        }
      }
    };
    this.updateHandler = function(update, origin) {
      if (origin !== _this) {
        var encoder = createEncoder();
        writeVarUint(encoder, MessageType.Sync);
        writeUpdate(encoder, update);
        _this.send(toUint8Array(encoder));
      }
    };
    this.unloadHandler = function() {
      removeAwarenessStates(_this.awareness, [_this.doc.clientID], "window unload");
    };
    this.awarenessUpdateHandler = function(_ref2, _origin) {
      var added = _ref2.added, updated = _ref2.updated, removed = _ref2.removed;
      var changedClients = added.concat(updated).concat(removed);
      var encoder = createEncoder();
      writeVarUint(encoder, MessageType.Awareness);
      writeVarUint8Array(encoder, encodeAwarenessUpdate(_this.awareness, changedClients));
      _this.send(toUint8Array(encoder));
    };
    this.consumer = consumer;
    this.channelName = channel;
    this.bcChannelName = channel + "_" + Object.entries(params2).map(function(k, v) {
      return k + "-" + v;
    }).join("_");
    this.params = params2;
    this.doc = doc2;
    this.awareness = awareness;
    this.bcconnected = false;
    this.disableBc = disableBc;
    this._synced = false;
    this.doc.on("update", this.updateHandler);
    if (typeof window !== "undefined") {
      window.addEventListener("unload", this.unloadHandler);
    } else if (typeof process !== "undefined") {
      process.on("exit", this.unloadHandler);
    }
    awareness.on("update", this.awarenessUpdateHandler);
    this.connect();
  }
  var _proto = WebsocketProvider2.prototype;
  _proto.destroy = function destroy() {
    this.disconnect();
    if (typeof window !== "undefined") {
      window.removeEventListener("unload", this.unloadHandler);
    } else if (typeof process !== "undefined") {
      process.off("exit", this.unloadHandler);
    }
    this.awareness.off("update", this.awarenessUpdateHandler);
    this.doc.off("update", this.updateHandler);
  };
  _proto.send = function send(buffer) {
    var _this$channel;
    var update = encodeBinaryToBase64(buffer);
    (_this$channel = this.channel) == null ? void 0 : _this$channel.send({
      update
    });
    if (this.bcconnected) {
      publish(this.bcChannelName, buffer, this);
    }
  };
  _proto.process = function process2(buffer, emitSynced) {
    var decoder = createDecoder(buffer);
    var encoder = createEncoder();
    var messageType = readVarUint(decoder);
    var messageHandler = messageHandlers[messageType];
    if (messageHandler) {
      messageHandler(encoder, decoder, this, emitSynced, messageType);
    } else {
      console.error("Unable to compute message");
    }
    return encoder;
  };
  _proto.subscribe = function subscribe2() {
    var provider = this;
    this.synced = false;
    this.channel = this.consumer.subscriptions.create(_extends({
      channel: this.channelName
    }, this.params), {
      received: function received(message) {
        var encodedUpdate = message.update;
        var update = decodeBase64ToBinary(encodedUpdate);
        var encoder = provider.process(update, true);
        if (length$1(encoder) > 1) {
          provider.send(toUint8Array(encoder));
        }
      },
      disconnected: function disconnected() {
        provider.synced = false;
        removeAwarenessStates(provider.awareness, Array.from(provider.awareness.getStates().keys()).filter(function(client) {
          return client !== provider.doc.clientID;
        }), provider);
      },
      connected: function connected() {
        var encoder = createEncoder();
        writeVarUint(encoder, MessageType.Sync);
        writeSyncStep1(encoder, provider.doc);
        provider.send(toUint8Array(encoder));
        if (provider.awareness.getLocalState() !== null) {
          var encoderAwarenessState = createEncoder();
          writeVarUint(encoderAwarenessState, MessageType.Awareness);
          writeVarUint8Array(encoderAwarenessState, encodeAwarenessUpdate(provider.awareness, [provider.doc.clientID]));
          provider.send(toUint8Array(encoderAwarenessState));
        }
      }
    });
  };
  _proto.connectBc = function connectBc() {
    if (this.disableBc) {
      return;
    }
    if (!this.bcconnected) {
      subscribe(this.bcChannelName, this.bcSubscriber);
      this.bcconnected = true;
    }
    var encoderSync = createEncoder();
    writeVarUint(encoderSync, MessageType.Sync);
    writeSyncStep1(encoderSync, this.doc);
    publish(this.bcChannelName, toUint8Array(encoderSync), this);
    var encoderState = createEncoder();
    writeVarUint(encoderState, MessageType.Sync);
    writeSyncStep2(encoderState, this.doc);
    publish(this.bcChannelName, toUint8Array(encoderState), this);
    var encoderAwarenessQuery = createEncoder();
    writeVarUint(encoderAwarenessQuery, MessageType.QueryAwareness);
    publish(this.bcChannelName, toUint8Array(encoderAwarenessQuery), this);
    var encoderAwarenessState = createEncoder();
    writeVarUint(encoderAwarenessState, MessageType.Awareness);
    writeVarUint8Array(encoderAwarenessState, encodeAwarenessUpdate(this.awareness, [this.doc.clientID]));
    publish(this.bcChannelName, toUint8Array(encoderAwarenessState), this);
  };
  _proto.disconnectBc = function disconnectBc() {
    var encoder = createEncoder();
    writeVarUint(encoder, MessageType.Awareness);
    writeVarUint8Array(encoder, encodeAwarenessUpdate(this.awareness, [this.doc.clientID], /* @__PURE__ */ new Map()));
    this.send(toUint8Array(encoder));
    if (this.bcconnected) {
      unsubscribe(this.bcChannelName, this.bcSubscriber);
      this.bcconnected = false;
    }
  };
  _proto.disconnect = function disconnect() {
    var _this$channel2;
    this.disconnectBc();
    (_this$channel2 = this.channel) == null ? void 0 : _this$channel2.unsubscribe();
    if (this.channel != null) {
      this.channel = void 0;
    }
  };
  _proto.connect = function connect() {
    if (this.channel == null) {
      this.subscribe();
      this.connectBc();
    }
  };
  _createClass(WebsocketProvider2, [{
    key: "synced",
    get: function get() {
      return this._synced;
    },
    set: function set(state) {
      if (this._synced !== state) {
        this._synced = state;
      }
    }
  }]);
  return WebsocketProvider2;
}();
function encodeBinaryToBase64(bin) {
  var chars = Array.from(bin, function(ch) {
    return String.fromCharCode(ch);
  }).join("");
  return btoa(chars);
}
function decodeBase64ToBinary(update) {
  return Uint8Array.from(atob(update), function(c) {
    return c.charCodeAt(0);
  });
}
var adapters = {
  logger: typeof console !== "undefined" ? console : void 0,
  WebSocket: typeof WebSocket !== "undefined" ? WebSocket : void 0
};
var logger = {
  log(...messages) {
    if (this.enabled) {
      messages.push(Date.now());
      adapters.logger.log("[ActionCable]", ...messages);
    }
  }
};
const now = () => new Date().getTime();
const secondsSince = (time) => (now() - time) / 1e3;
class ConnectionMonitor {
  constructor(connection) {
    this.visibilityDidChange = this.visibilityDidChange.bind(this);
    this.connection = connection;
    this.reconnectAttempts = 0;
  }
  start() {
    if (!this.isRunning()) {
      this.startedAt = now();
      delete this.stoppedAt;
      this.startPolling();
      addEventListener("visibilitychange", this.visibilityDidChange);
      logger.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
    }
  }
  stop() {
    if (this.isRunning()) {
      this.stoppedAt = now();
      this.stopPolling();
      removeEventListener("visibilitychange", this.visibilityDidChange);
      logger.log("ConnectionMonitor stopped");
    }
  }
  isRunning() {
    return this.startedAt && !this.stoppedAt;
  }
  recordPing() {
    this.pingedAt = now();
  }
  recordConnect() {
    this.reconnectAttempts = 0;
    this.recordPing();
    delete this.disconnectedAt;
    logger.log("ConnectionMonitor recorded connect");
  }
  recordDisconnect() {
    this.disconnectedAt = now();
    logger.log("ConnectionMonitor recorded disconnect");
  }
  startPolling() {
    this.stopPolling();
    this.poll();
  }
  stopPolling() {
    clearTimeout(this.pollTimeout);
  }
  poll() {
    this.pollTimeout = setTimeout(() => {
      this.reconnectIfStale();
      this.poll();
    }, this.getPollInterval());
  }
  getPollInterval() {
    const { staleThreshold, reconnectionBackoffRate } = this.constructor;
    const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
    const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
    const jitter = jitterMax * Math.random();
    return staleThreshold * 1e3 * backoff * (1 + jitter);
  }
  reconnectIfStale() {
    if (this.connectionIsStale()) {
      logger.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
      this.reconnectAttempts++;
      if (this.disconnectedRecently()) {
        logger.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
      } else {
        logger.log("ConnectionMonitor reopening");
        this.connection.reopen();
      }
    }
  }
  get refreshedAt() {
    return this.pingedAt ? this.pingedAt : this.startedAt;
  }
  connectionIsStale() {
    return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
  }
  disconnectedRecently() {
    return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
  }
  visibilityDidChange() {
    if (document.visibilityState === "visible") {
      setTimeout(() => {
        if (this.connectionIsStale() || !this.connection.isOpen()) {
          logger.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
          this.connection.reopen();
        }
      }, 200);
    }
  }
}
ConnectionMonitor.staleThreshold = 6;
ConnectionMonitor.reconnectionBackoffRate = 0.15;
var INTERNAL = {
  message_types: {
    welcome: "welcome",
    disconnect: "disconnect",
    ping: "ping",
    confirmation: "confirm_subscription",
    rejection: "reject_subscription"
  },
  disconnect_reasons: {
    unauthorized: "unauthorized",
    invalid_request: "invalid_request",
    server_restart: "server_restart",
    remote: "remote"
  },
  default_mount_path: "/cable",
  protocols: ["actioncable-v1-json", "actioncable-unsupported"]
};
const { message_types, protocols } = INTERNAL;
const supportedProtocols = protocols.slice(0, protocols.length - 1);
const indexOf = [].indexOf;
class Connection {
  constructor(consumer) {
    this.open = this.open.bind(this);
    this.consumer = consumer;
    this.subscriptions = this.consumer.subscriptions;
    this.monitor = new ConnectionMonitor(this);
    this.disconnected = true;
  }
  send(data) {
    if (this.isOpen()) {
      this.webSocket.send(JSON.stringify(data));
      return true;
    } else {
      return false;
    }
  }
  open() {
    if (this.isActive()) {
      logger.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
      return false;
    } else {
      const socketProtocols = [...protocols, ...this.consumer.subprotocols || []];
      logger.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${socketProtocols}`);
      if (this.webSocket) {
        this.uninstallEventHandlers();
      }
      this.webSocket = new adapters.WebSocket(this.consumer.url, socketProtocols);
      this.installEventHandlers();
      this.monitor.start();
      return true;
    }
  }
  close({ allowReconnect } = {
    allowReconnect: true
  }) {
    if (!allowReconnect) {
      this.monitor.stop();
    }
    if (this.isOpen()) {
      return this.webSocket.close();
    }
  }
  reopen() {
    logger.log(`Reopening WebSocket, current state is ${this.getState()}`);
    if (this.isActive()) {
      try {
        return this.close();
      } catch (error) {
        logger.log("Failed to reopen WebSocket", error);
      } finally {
        logger.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
        setTimeout(this.open, this.constructor.reopenDelay);
      }
    } else {
      return this.open();
    }
  }
  getProtocol() {
    if (this.webSocket) {
      return this.webSocket.protocol;
    }
  }
  isOpen() {
    return this.isState("open");
  }
  isActive() {
    return this.isState("open", "connecting");
  }
  triedToReconnect() {
    return this.monitor.reconnectAttempts > 0;
  }
  isProtocolSupported() {
    return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
  }
  isState(...states) {
    return indexOf.call(states, this.getState()) >= 0;
  }
  getState() {
    if (this.webSocket) {
      for (let state in adapters.WebSocket) {
        if (adapters.WebSocket[state] === this.webSocket.readyState) {
          return state.toLowerCase();
        }
      }
    }
    return null;
  }
  installEventHandlers() {
    for (let eventName in this.events) {
      const handler = this.events[eventName].bind(this);
      this.webSocket[`on${eventName}`] = handler;
    }
  }
  uninstallEventHandlers() {
    for (let eventName in this.events) {
      this.webSocket[`on${eventName}`] = function() {
      };
    }
  }
}
Connection.reopenDelay = 500;
Connection.prototype.events = {
  message(event) {
    if (!this.isProtocolSupported()) {
      return;
    }
    const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
    switch (type) {
      case message_types.welcome:
        if (this.triedToReconnect()) {
          this.reconnectAttempted = true;
        }
        this.monitor.recordConnect();
        return this.subscriptions.reload();
      case message_types.disconnect:
        logger.log(`Disconnecting. Reason: ${reason}`);
        return this.close({
          allowReconnect: reconnect
        });
      case message_types.ping:
        return this.monitor.recordPing();
      case message_types.confirmation:
        this.subscriptions.confirmSubscription(identifier);
        if (this.reconnectAttempted) {
          this.reconnectAttempted = false;
          return this.subscriptions.notify(identifier, "connected", {
            reconnected: true
          });
        } else {
          return this.subscriptions.notify(identifier, "connected", {
            reconnected: false
          });
        }
      case message_types.rejection:
        return this.subscriptions.reject(identifier);
      default:
        return this.subscriptions.notify(identifier, "received", message);
    }
  },
  open() {
    logger.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
    this.disconnected = false;
    if (!this.isProtocolSupported()) {
      logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
      return this.close({
        allowReconnect: false
      });
    }
  },
  close(event) {
    logger.log("WebSocket onclose event");
    if (this.disconnected) {
      return;
    }
    this.disconnected = true;
    this.monitor.recordDisconnect();
    return this.subscriptions.notifyAll("disconnected", {
      willAttemptReconnect: this.monitor.isRunning()
    });
  },
  error() {
    logger.log("WebSocket onerror event");
  }
};
const extend = function(object, properties) {
  if (properties != null) {
    for (let key in properties) {
      const value = properties[key];
      object[key] = value;
    }
  }
  return object;
};
class Subscription {
  constructor(consumer, params2 = {}, mixin) {
    this.consumer = consumer;
    this.identifier = JSON.stringify(params2);
    extend(this, mixin);
  }
  perform(action, data = {}) {
    data.action = action;
    return this.send(data);
  }
  send(data) {
    return this.consumer.send({
      command: "message",
      identifier: this.identifier,
      data: JSON.stringify(data)
    });
  }
  unsubscribe() {
    return this.consumer.subscriptions.remove(this);
  }
}
class SubscriptionGuarantor {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.pendingSubscriptions = [];
  }
  guarantee(subscription) {
    if (this.pendingSubscriptions.indexOf(subscription) == -1) {
      logger.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
      this.pendingSubscriptions.push(subscription);
    } else {
      logger.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
    }
    this.startGuaranteeing();
  }
  forget(subscription) {
    logger.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
    this.pendingSubscriptions = this.pendingSubscriptions.filter((s) => s !== subscription);
  }
  startGuaranteeing() {
    this.stopGuaranteeing();
    this.retrySubscribing();
  }
  stopGuaranteeing() {
    clearTimeout(this.retryTimeout);
  }
  retrySubscribing() {
    this.retryTimeout = setTimeout(() => {
      if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
        this.pendingSubscriptions.map((subscription) => {
          logger.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
          this.subscriptions.subscribe(subscription);
        });
      }
    }, 500);
  }
}
class Subscriptions {
  constructor(consumer) {
    this.consumer = consumer;
    this.guarantor = new SubscriptionGuarantor(this);
    this.subscriptions = [];
  }
  create(channelName, mixin) {
    const channel = channelName;
    const params2 = typeof channel === "object" ? channel : {
      channel
    };
    const subscription = new Subscription(this.consumer, params2, mixin);
    return this.add(subscription);
  }
  add(subscription) {
    this.subscriptions.push(subscription);
    this.consumer.ensureActiveConnection();
    this.notify(subscription, "initialized");
    this.subscribe(subscription);
    return subscription;
  }
  remove(subscription) {
    this.forget(subscription);
    if (!this.findAll(subscription.identifier).length) {
      this.sendCommand(subscription, "unsubscribe");
    }
    return subscription;
  }
  reject(identifier) {
    return this.findAll(identifier).map((subscription) => {
      this.forget(subscription);
      this.notify(subscription, "rejected");
      return subscription;
    });
  }
  forget(subscription) {
    this.guarantor.forget(subscription);
    this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
    return subscription;
  }
  findAll(identifier) {
    return this.subscriptions.filter((s) => s.identifier === identifier);
  }
  reload() {
    return this.subscriptions.map((subscription) => this.subscribe(subscription));
  }
  notifyAll(callbackName, ...args) {
    return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
  }
  notify(subscription, callbackName, ...args) {
    let subscriptions;
    if (typeof subscription === "string") {
      subscriptions = this.findAll(subscription);
    } else {
      subscriptions = [subscription];
    }
    return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
  }
  subscribe(subscription) {
    if (this.sendCommand(subscription, "subscribe")) {
      this.guarantor.guarantee(subscription);
    }
  }
  confirmSubscription(identifier) {
    logger.log(`Subscription confirmed ${identifier}`);
    this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
  }
  sendCommand(subscription, command) {
    const { identifier } = subscription;
    return this.consumer.send({
      command,
      identifier
    });
  }
}
class Consumer {
  constructor(url) {
    this._url = url;
    this.subscriptions = new Subscriptions(this);
    this.connection = new Connection(this);
    this.subprotocols = [];
  }
  get url() {
    return createWebSocketURL(this._url);
  }
  send(data) {
    return this.connection.send(data);
  }
  connect() {
    return this.connection.open();
  }
  disconnect() {
    return this.connection.close({
      allowReconnect: false
    });
  }
  ensureActiveConnection() {
    if (!this.connection.isActive()) {
      return this.connection.open();
    }
  }
  addSubProtocol(subprotocol) {
    this.subprotocols = [...this.subprotocols, subprotocol];
  }
}
function createWebSocketURL(url) {
  if (typeof url === "function") {
    url = url();
  }
  if (url && !/^wss?:/i.test(url)) {
    const a = document.createElement("a");
    a.href = url;
    a.href = a.href;
    a.protocol = a.protocol.replace("http", "ws");
    return a.href;
  } else {
    return url;
  }
}
function createConsumer(url = getConfig("url") || INTERNAL.default_mount_path) {
  return new Consumer(url);
}
function getConfig(name) {
  const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
  if (element) {
    return element.getAttribute("content");
  }
}
var _Vec = class {
  static clamp(n, min2, max2) {
    return Math.max(min2, typeof max2 !== "undefined" ? Math.min(n, max2) : n);
  }
  static clampV(A, min2, max2) {
    return A.map((n) => max2 ? _Vec.clamp(n, min2, max2) : _Vec.clamp(n, min2));
  }
  static cross(x, y, z) {
    return (y[0] - x[0]) * (z[1] - x[1]) - (z[0] - x[0]) * (y[1] - x[1]);
  }
  static snap(a, step = 1) {
    return [Math.round(a[0] / step) * step, Math.round(a[1] / step) * step];
  }
};
var Vec = _Vec;
Vec.neg = (A) => {
  return [-A[0], -A[1]];
};
Vec.add = (A, B) => {
  return [A[0] + B[0], A[1] + B[1]];
};
Vec.addScalar = (A, n) => {
  return [A[0] + n, A[1] + n];
};
Vec.sub = (A, B) => {
  return [A[0] - B[0], A[1] - B[1]];
};
Vec.subScalar = (A, n) => {
  return [A[0] - n, A[1] - n];
};
Vec.vec = (A, B) => {
  return [B[0] - A[0], B[1] - A[1]];
};
Vec.mul = (A, n) => {
  return [A[0] * n, A[1] * n];
};
Vec.mulV = (A, B) => {
  return [A[0] * B[0], A[1] * B[1]];
};
Vec.div = (A, n) => {
  return [A[0] / n, A[1] / n];
};
Vec.divV = (A, B) => {
  return [A[0] / B[0], A[1] / B[1]];
};
Vec.per = (A) => {
  return [A[1], -A[0]];
};
Vec.dpr = (A, B) => {
  return A[0] * B[0] + A[1] * B[1];
};
Vec.cpr = (A, B) => {
  return A[0] * B[1] - B[0] * A[1];
};
Vec.len2 = (A) => {
  return A[0] * A[0] + A[1] * A[1];
};
Vec.len = (A) => {
  return Math.hypot(A[0], A[1]);
};
Vec.pry = (A, B) => {
  return _Vec.dpr(A, B) / _Vec.len(B);
};
Vec.uni = (A) => {
  return _Vec.div(A, _Vec.len(A));
};
Vec.normalize = (A) => {
  return _Vec.uni(A);
};
Vec.tangent = (A, B) => {
  return _Vec.uni(_Vec.sub(A, B));
};
Vec.dist2 = (A, B) => {
  return _Vec.len2(_Vec.sub(A, B));
};
Vec.dist = (A, B) => {
  return Math.hypot(A[1] - B[1], A[0] - B[0]);
};
Vec.fastDist = (A, B) => {
  const V = [B[0] - A[0], B[1] - A[1]];
  const aV = [Math.abs(V[0]), Math.abs(V[1])];
  let r = 1 / Math.max(aV[0], aV[1]);
  r = r * (1.29289 - (aV[0] + aV[1]) * r * 0.29289);
  return [V[0] * r, V[1] * r];
};
Vec.ang = (A, B) => {
  return Math.atan2(_Vec.cpr(A, B), _Vec.dpr(A, B));
};
Vec.angle = (A, B) => {
  return Math.atan2(B[1] - A[1], B[0] - A[0]);
};
Vec.med = (A, B) => {
  return _Vec.mul(_Vec.add(A, B), 0.5);
};
Vec.rot = (A, r = 0) => {
  return [A[0] * Math.cos(r) - A[1] * Math.sin(r), A[0] * Math.sin(r) + A[1] * Math.cos(r)];
};
Vec.rotWith = (A, C, r = 0) => {
  if (r === 0)
    return A;
  const s = Math.sin(r);
  const c = Math.cos(r);
  const px = A[0] - C[0];
  const py = A[1] - C[1];
  const nx = px * c - py * s;
  const ny = px * s + py * c;
  return [nx + C[0], ny + C[1]];
};
Vec.isEqual = (A, B) => {
  return A[0] === B[0] && A[1] === B[1];
};
Vec.lrp = (A, B, t) => {
  return _Vec.add(A, _Vec.mul(_Vec.sub(B, A), t));
};
Vec.int = (A, B, from2, to, s = 1) => {
  const t = (_Vec.clamp(from2, to) - from2) / (to - from2);
  return _Vec.add(_Vec.mul(A, 1 - t), _Vec.mul(B, s));
};
Vec.ang3 = (p1, pc, p2) => {
  const v1 = _Vec.vec(pc, p1);
  const v2 = _Vec.vec(pc, p2);
  return _Vec.ang(v1, v2);
};
Vec.abs = (A) => {
  return [Math.abs(A[0]), Math.abs(A[1])];
};
Vec.rescale = (a, n) => {
  const l = _Vec.len(a);
  return [n * a[0] / l, n * a[1] / l];
};
Vec.isLeft = (p1, pc, p2) => {
  return (pc[0] - p1[0]) * (p2[1] - p1[1]) - (p2[0] - p1[0]) * (pc[1] - p1[1]);
};
Vec.clockwise = (p1, pc, p2) => {
  return _Vec.isLeft(p1, pc, p2) > 0;
};
Vec.toFixed = (a, d = 2) => {
  return a.map((v) => +v.toFixed(d));
};
Vec.nearestPointOnLineThroughPoint = (A, u, P) => {
  return _Vec.add(A, _Vec.mul(u, _Vec.pry(_Vec.sub(P, A), u)));
};
Vec.distanceToLineThroughPoint = (A, u, P) => {
  return _Vec.dist(P, _Vec.nearestPointOnLineThroughPoint(A, u, P));
};
Vec.nearestPointOnLineSegment = (A, B, P, clamp = true) => {
  const u = _Vec.uni(_Vec.sub(B, A));
  const C = _Vec.add(A, _Vec.mul(u, _Vec.pry(_Vec.sub(P, A), u)));
  if (clamp) {
    if (C[0] < Math.min(A[0], B[0]))
      return A[0] < B[0] ? A : B;
    if (C[0] > Math.max(A[0], B[0]))
      return A[0] > B[0] ? A : B;
    if (C[1] < Math.min(A[1], B[1]))
      return A[1] < B[1] ? A : B;
    if (C[1] > Math.max(A[1], B[1]))
      return A[1] > B[1] ? A : B;
  }
  return C;
};
Vec.distanceToLineSegment = (A, B, P, clamp = true) => {
  return _Vec.dist(P, _Vec.nearestPointOnLineSegment(A, B, P, clamp));
};
Vec.nudge = (A, B, d) => {
  if (_Vec.isEqual(A, B))
    return A;
  return _Vec.add(A, _Vec.mul(_Vec.uni(_Vec.sub(B, A)), d));
};
Vec.nudgeAtAngle = (A, a, d) => {
  return [Math.cos(a) * d + A[0], Math.sin(a) * d + A[1]];
};
Vec.toPrecision = (a, n = 4) => {
  return [+a[0].toPrecision(n), +a[1].toPrecision(n)];
};
Vec.pointsBetween = (A, B, steps = 6) => {
  return Array.from(Array(steps)).map((_, i) => {
    const t = i / (steps - 1);
    const k = Math.min(1, 0.5 + Math.abs(0.5 - t));
    return [..._Vec.lrp(A, B, t), k];
  });
};
Vec.slope = (A, B) => {
  if (A[0] === B[0])
    return NaN;
  return (A[1] - B[1]) / (A[0] - B[0]);
};
Vec.max = (...v) => {
  return [Math.max(...v.map((a) => a[0])), Math.max(...v.map((a) => a[1]))];
};
Vec.min = (...v) => {
  return [Math.max(...v.map((a) => a[0])), Math.max(...v.map((a) => a[1]))];
};
var Spline = class {
  constructor(points = []) {
    this.points = [];
    this.lengths = [];
    this.totalLength = 0;
    this.addPoint = (point) => {
      if (this.prev) {
        const length2 = Vec.dist(this.prev, point);
        this.lengths.push(length2);
        this.totalLength += length2;
        this.points.push(point);
      }
      this.prev = point;
    };
    this.clear = () => {
      this.points = this.prev ? [this.prev] : [];
      this.totalLength = 0;
    };
    this.getSplinePoint = (rt) => {
      const { points: points2 } = this;
      const l = points2.length - 1, d = Math.trunc(rt), p1 = Math.min(d + 1, l), p2 = Math.min(p1 + 1, l), p3 = Math.min(p2 + 1, l), p0 = p1 - 1, t = rt - d;
      const tt = t * t, ttt = tt * t, q1 = -ttt + 2 * tt - t, q2 = 3 * ttt - 5 * tt + 2, q3 = -3 * ttt + 4 * tt + t, q4 = ttt - tt;
      return [
        (points2[p0][0] * q1 + points2[p1][0] * q2 + points2[p2][0] * q3 + points2[p3][0] * q4) / 2,
        (points2[p0][1] * q1 + points2[p1][1] * q2 + points2[p2][1] * q3 + points2[p3][1] * q4) / 2
      ];
    };
    this.points = points;
    this.lengths = points.map((point, i, arr) => i === 0 ? 0 : Vec.dist(point, arr[i - 1]));
    this.totalLength = this.lengths.reduce((acc, cur) => acc + cur, 0);
  }
};
var _PerfectCursor = class {
  constructor(cb) {
    this.state = "idle";
    this.queue = [];
    this.timestamp = performance.now();
    this.lastRequestId = 0;
    this.timeoutId = 0;
    this.spline = new Spline();
    this.addPoint = (point) => {
      clearTimeout(this.timeoutId);
      const now2 = performance.now();
      const duration = Math.min(now2 - this.timestamp, _PerfectCursor.MAX_INTERVAL);
      if (!this.prevPoint) {
        this.spline.clear();
        this.prevPoint = point;
        this.spline.addPoint(point);
        this.cb(point);
        this.state = "stopped";
        return;
      }
      if (this.state === "stopped") {
        if (Vec.dist(this.prevPoint, point) < 4) {
          this.cb(point);
          return;
        }
        this.spline.clear();
        this.spline.addPoint(this.prevPoint);
        this.spline.addPoint(this.prevPoint);
        this.spline.addPoint(point);
        this.state = "idle";
      } else {
        this.spline.addPoint(point);
      }
      if (duration < 16) {
        this.prevPoint = point;
        this.timestamp = now2;
        this.cb(point);
        return;
      }
      const animation = {
        start: this.spline.points.length - 3,
        from: this.prevPoint,
        to: point,
        duration
      };
      this.prevPoint = point;
      this.timestamp = now2;
      switch (this.state) {
        case "idle": {
          this.state = "animating";
          this.animateNext(animation);
          break;
        }
        case "animating": {
          this.queue.push(animation);
          break;
        }
      }
    };
    this.animateNext = (animation) => {
      const start = performance.now();
      const loop = () => {
        const t = (performance.now() - start) / animation.duration;
        if (t <= 1 && this.spline.points.length > 0) {
          try {
            this.cb(this.spline.getSplinePoint(t + animation.start));
          } catch (e) {
            console.warn(e);
          }
          this.lastRequestId = requestAnimationFrame(loop);
          return;
        }
        const next = this.queue.shift();
        if (next) {
          this.state = "animating";
          this.animateNext(next);
        } else {
          this.state = "idle";
          this.timeoutId = setTimeout(() => {
            this.state = "stopped";
          }, _PerfectCursor.MAX_INTERVAL);
        }
      };
      loop();
    };
    this.dispose = () => {
      clearTimeout(this.timeoutId);
    };
    this.cb = cb;
  }
};
var PerfectCursor = _PerfectCursor;
PerfectCursor.MAX_INTERVAL = 300;
let nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id2, byte) => {
  byte &= 63;
  if (byte < 36) {
    id2 += byte.toString(36);
  } else if (byte < 62) {
    id2 += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id2 += "-";
  } else {
    id2 += "_";
  }
  return id2;
}, "");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var randomColor = { exports: {} };
(function(module, exports) {
  (function(root, factory) {
    {
      var randomColor2 = factory();
      if (module && module.exports) {
        exports = module.exports = randomColor2;
      }
      exports.randomColor = randomColor2;
    }
  })(commonjsGlobal, function() {
    var seed = null;
    var colorDictionary = {};
    loadColorBounds();
    var colorRanges = [];
    var randomColor2 = function(options) {
      options = options || {};
      if (options.seed !== void 0 && options.seed !== null && options.seed === parseInt(options.seed, 10)) {
        seed = options.seed;
      } else if (typeof options.seed === "string") {
        seed = stringToInteger(options.seed);
      } else if (options.seed !== void 0 && options.seed !== null) {
        throw new TypeError("The seed value must be an integer or string");
      } else {
        seed = null;
      }
      var H, S, B;
      if (options.count !== null && options.count !== void 0) {
        var totalColors = options.count, colors = [];
        for (var i = 0; i < options.count; i++) {
          colorRanges.push(false);
        }
        options.count = null;
        while (totalColors > colors.length) {
          var color = randomColor2(options);
          if (seed !== null) {
            options.seed = seed;
          }
          colors.push(color);
        }
        options.count = totalColors;
        return colors;
      }
      H = pickHue(options);
      S = pickSaturation(H, options);
      B = pickBrightness(H, S, options);
      return setFormat([H, S, B], options);
    };
    function pickHue(options) {
      if (colorRanges.length > 0) {
        var hueRange = getRealHueRange(options.hue);
        var hue = randomWithin(hueRange);
        var step = (hueRange[1] - hueRange[0]) / colorRanges.length;
        var j = parseInt((hue - hueRange[0]) / step);
        if (colorRanges[j] === true) {
          j = (j + 2) % colorRanges.length;
        } else {
          colorRanges[j] = true;
        }
        var min2 = (hueRange[0] + j * step) % 359, max2 = (hueRange[0] + (j + 1) * step) % 359;
        hueRange = [min2, max2];
        hue = randomWithin(hueRange);
        if (hue < 0) {
          hue = 360 + hue;
        }
        return hue;
      } else {
        var hueRange = getHueRange(options.hue);
        hue = randomWithin(hueRange);
        if (hue < 0) {
          hue = 360 + hue;
        }
        return hue;
      }
    }
    function pickSaturation(hue, options) {
      if (options.hue === "monochrome") {
        return 0;
      }
      if (options.luminosity === "random") {
        return randomWithin([0, 100]);
      }
      var saturationRange = getSaturationRange(hue);
      var sMin = saturationRange[0], sMax = saturationRange[1];
      switch (options.luminosity) {
        case "bright":
          sMin = 55;
          break;
        case "dark":
          sMin = sMax - 10;
          break;
        case "light":
          sMax = 55;
          break;
      }
      return randomWithin([sMin, sMax]);
    }
    function pickBrightness(H, S, options) {
      var bMin = getMinimumBrightness(H, S), bMax = 100;
      switch (options.luminosity) {
        case "dark":
          bMax = bMin + 20;
          break;
        case "light":
          bMin = (bMax + bMin) / 2;
          break;
        case "random":
          bMin = 0;
          bMax = 100;
          break;
      }
      return randomWithin([bMin, bMax]);
    }
    function setFormat(hsv, options) {
      switch (options.format) {
        case "hsvArray":
          return hsv;
        case "hslArray":
          return HSVtoHSL(hsv);
        case "hsl":
          var hsl = HSVtoHSL(hsv);
          return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";
        case "hsla":
          var hslColor = HSVtoHSL(hsv);
          var alpha = options.alpha || Math.random();
          return "hsla(" + hslColor[0] + ", " + hslColor[1] + "%, " + hslColor[2] + "%, " + alpha + ")";
        case "rgbArray":
          return HSVtoRGB(hsv);
        case "rgb":
          var rgb = HSVtoRGB(hsv);
          return "rgb(" + rgb.join(", ") + ")";
        case "rgba":
          var rgbColor = HSVtoRGB(hsv);
          var alpha = options.alpha || Math.random();
          return "rgba(" + rgbColor.join(", ") + ", " + alpha + ")";
        default:
          return HSVtoHex(hsv);
      }
    }
    function getMinimumBrightness(H, S) {
      var lowerBounds = getColorInfo(H).lowerBounds;
      for (var i = 0; i < lowerBounds.length - 1; i++) {
        var s1 = lowerBounds[i][0], v1 = lowerBounds[i][1];
        var s2 = lowerBounds[i + 1][0], v2 = lowerBounds[i + 1][1];
        if (S >= s1 && S <= s2) {
          var m = (v2 - v1) / (s2 - s1), b = v1 - m * s1;
          return m * S + b;
        }
      }
      return 0;
    }
    function getHueRange(colorInput) {
      if (typeof parseInt(colorInput) === "number") {
        var number = parseInt(colorInput);
        if (number < 360 && number > 0) {
          return [number, number];
        }
      }
      if (typeof colorInput === "string") {
        if (colorDictionary[colorInput]) {
          var color = colorDictionary[colorInput];
          if (color.hueRange) {
            return color.hueRange;
          }
        } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
          var hue = HexToHSB(colorInput)[0];
          return [hue, hue];
        }
      }
      return [0, 360];
    }
    function getSaturationRange(hue) {
      return getColorInfo(hue).saturationRange;
    }
    function getColorInfo(hue) {
      if (hue >= 334 && hue <= 360) {
        hue -= 360;
      }
      for (var colorName in colorDictionary) {
        var color = colorDictionary[colorName];
        if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
          return colorDictionary[colorName];
        }
      }
      return "Color not found";
    }
    function randomWithin(range) {
      if (seed === null) {
        var golden_ratio = 0.618033988749895;
        var r = Math.random();
        r += golden_ratio;
        r %= 1;
        return Math.floor(range[0] + r * (range[1] + 1 - range[0]));
      } else {
        var max2 = range[1] || 1;
        var min2 = range[0] || 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280;
        return Math.floor(min2 + rnd * (max2 - min2));
      }
    }
    function HSVtoHex(hsv) {
      var rgb = HSVtoRGB(hsv);
      function componentToHex(c) {
        var hex2 = c.toString(16);
        return hex2.length == 1 ? "0" + hex2 : hex2;
      }
      var hex = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
      return hex;
    }
    function defineColor(name, hueRange, lowerBounds) {
      var sMin = lowerBounds[0][0], sMax = lowerBounds[lowerBounds.length - 1][0], bMin = lowerBounds[lowerBounds.length - 1][1], bMax = lowerBounds[0][1];
      colorDictionary[name] = {
        hueRange,
        lowerBounds,
        saturationRange: [sMin, sMax],
        brightnessRange: [bMin, bMax]
      };
    }
    function loadColorBounds() {
      defineColor("monochrome", null, [[0, 0], [100, 0]]);
      defineColor("red", [-26, 18], [[20, 100], [30, 92], [40, 89], [50, 85], [60, 78], [70, 70], [80, 60], [90, 55], [100, 50]]);
      defineColor("orange", [18, 46], [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]]);
      defineColor("yellow", [46, 62], [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]]);
      defineColor("green", [62, 178], [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]]);
      defineColor("blue", [178, 257], [[20, 100], [30, 86], [40, 80], [50, 74], [60, 60], [70, 52], [80, 44], [90, 39], [100, 35]]);
      defineColor("purple", [257, 282], [[20, 100], [30, 87], [40, 79], [50, 70], [60, 65], [70, 59], [80, 52], [90, 45], [100, 42]]);
      defineColor("pink", [282, 334], [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]]);
    }
    function HSVtoRGB(hsv) {
      var h = hsv[0];
      if (h === 0) {
        h = 1;
      }
      if (h === 360) {
        h = 359;
      }
      h = h / 360;
      var s = hsv[1] / 100, v = hsv[2] / 100;
      var h_i = Math.floor(h * 6), f = h * 6 - h_i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), r = 256, g = 256, b = 256;
      switch (h_i) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      var result = [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
      return result;
    }
    function HexToHSB(hex) {
      hex = hex.replace(/^#/, "");
      hex = hex.length === 3 ? hex.replace(/(.)/g, "$1$1") : hex;
      var red = parseInt(hex.substr(0, 2), 16) / 255, green = parseInt(hex.substr(2, 2), 16) / 255, blue = parseInt(hex.substr(4, 2), 16) / 255;
      var cMax = Math.max(red, green, blue), delta = cMax - Math.min(red, green, blue), saturation = cMax ? delta / cMax : 0;
      switch (cMax) {
        case red:
          return [60 * ((green - blue) / delta % 6) || 0, saturation, cMax];
        case green:
          return [60 * ((blue - red) / delta + 2) || 0, saturation, cMax];
        case blue:
          return [60 * ((red - green) / delta + 4) || 0, saturation, cMax];
      }
    }
    function HSVtoHSL(hsv) {
      var h = hsv[0], s = hsv[1] / 100, v = hsv[2] / 100, k = (2 - s) * v;
      return [
        h,
        Math.round(s * v / (k < 1 ? k : 2 - k) * 1e4) / 100,
        k / 2 * 100
      ];
    }
    function stringToInteger(string) {
      var total = 0;
      for (var i = 0; i !== string.length; i++) {
        if (total >= Number.MAX_SAFE_INTEGER)
          break;
        total += string.charCodeAt(i);
      }
      return total;
    }
    function getRealHueRange(colorHue) {
      if (!isNaN(colorHue)) {
        var number = parseInt(colorHue);
        if (number < 360 && number > 0) {
          return getColorInfo(colorHue).hueRange;
        }
      } else if (typeof colorHue === "string") {
        if (colorDictionary[colorHue]) {
          var color = colorDictionary[colorHue];
          if (color.hueRange) {
            return color.hueRange;
          }
        } else if (colorHue.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
          var hue = HexToHSB(colorHue)[0];
          return getColorInfo(hue).hueRange;
        }
      }
      return [0, 360];
    }
    return randomColor2;
  });
})(randomColor, randomColor.exports);
var randomcolor = randomColor.exports;
function getSvgForCursor(color) {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="10 9 34 34"
      width="36"
      height="36"
      fill="none"
      fillRule="evenodd"
    >
      <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="white">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="${color}">
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>`;
}
function defaultCursorRenderer(cursor) {
  const htmlFragment = `<div id="cursor_${cursor.id}" class="cursor">
    ${getSvgForCursor(cursor.color)}
    <p id="chat_${cursor.id}" class="chat" style="background-color: ${cursor.color}">${cursor.chat}</p>
  </div>`;
  const template = document.createElement("template");
  template.innerHTML = htmlFragment;
  const cursorEl = template.content.firstChild;
  return cursorEl;
}
const DefaultConfig = () => ({
  triggerKey: "/",
  cursorDivId: "cursor-chat-layer",
  chatDivId: "cursor-chat-box",
  userMetaData: {},
  renderCursor: defaultCursorRenderer,
  yDoc: void 0,
  color: void 0,
  shouldChangeUserCursor: void 0,
  signallingServers: ["wss://signalling.communities.digital"]
});
const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;
function encodeSVG(svgData) {
  svgData = svgData.replace(/"/g, `'`);
  svgData = svgData.replace(/>\s{1,}</g, `><`);
  svgData = svgData.replace(/\s{2,}/g, ` `);
  return svgData.replace(symbols, encodeURIComponent);
}
const initCursorChat = (room_id = `cursor-chat-room-${window.location.host + window.location.pathname}`, config = {}) => {
  const {
    triggerKey,
    cursorDivId,
    chatDivId,
    userMetaData,
    renderCursor,
    color,
    yDoc,
    shouldChangeUserCursor
  } = __spreadValues(__spreadValues({}, DefaultConfig()), config);
  const cursorDiv = document.getElementById(cursorDivId);
  const chatDiv = document.getElementById(chatDivId);
  if (!cursorDiv || !chatDiv) {
    throw `Couldn't find cursor-chat-related divs! Make sure DOM content is fully loaded before initializing`;
  }
  const me = {
    id: nanoid(),
    x: 0,
    y: 0,
    chat: "",
    color: color != null ? color : randomcolor(),
    userMetaData
  };
  let doc2;
  let consumer;
  let provider;
  if (yDoc !== void 0) {
    doc2 = yDoc;
  } else {
    doc2 = new Doc();
    consumer = createConsumer();
    provider = new WebsocketProvider(doc2, consumer, "CursorChatChannel", { id: `${room_id}` });
  }
  const others = doc2.getMap("state");
  let sendUpdate = false;
  if (shouldChangeUserCursor) {
    const userCursorSvgEncoded = encodeSVG(getSvgForCursor(me.color));
    document.documentElement.style.cursor = `url("data:image/svg+xml,${userCursorSvgEncoded}"), auto`;
  }
  const cleanup = () => {
    others.delete(me.id);
    provider == null ? void 0 : provider.destroy();
  };
  addEventListener("beforeunload", cleanup);
  setInterval(() => {
    if (sendUpdate) {
      others.set(me.id, me);
      sendUpdate = false;
    }
  }, 50);
  document.onmousemove = (evt) => {
    if (me.x !== evt.pageX && me.y !== evt.pageY) {
      sendUpdate = true;
      me.x = evt.pageX;
      me.y = evt.pageY;
      chatDiv.style.setProperty("transform", `translate(${me.x}px, ${me.y}px)`);
    }
  };
  document.addEventListener("keydown", (event) => {
    if (event.key === triggerKey) {
      if (chatDiv.style.getPropertyValue("display") === "block" && chatDiv.value === "") {
        event.preventDefault();
        chatDiv.style.setProperty("display", "none");
      } else {
        event.preventDefault();
        chatDiv.style.setProperty("display", "block");
        chatDiv.focus();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      chatDiv.value = "";
      chatDiv.style.setProperty("display", "none");
    } else if (event.key === "Enter") {
      event.preventDefault();
    }
  });
  document.addEventListener("keyup", () => {
    me.chat = chatDiv.value;
    sendUpdate = true;
  });
  const cursor_interp = /* @__PURE__ */ new Map();
  others.observe((evt) => {
    const updated_cursors = evt.changes.keys;
    updated_cursors.forEach((change, cursor_id) => {
      if (cursor_id !== me.id) {
        switch (change.action) {
          case "add":
            const new_cursor = others.get(cursor_id);
            const new_cursor_div = renderCursor(new_cursor);
            new_cursor_div.classList.add("new");
            cursorDiv.appendChild(new_cursor_div);
            const add_point_closure = ([x, y]) => new_cursor_div.style.setProperty("transform", `translate(${x}px, ${y}px)`);
            const perfect_cursor = new PerfectCursor(add_point_closure);
            perfect_cursor.addPoint([new_cursor.x, new_cursor.y]);
            cursor_interp.set(cursor_id, perfect_cursor);
            break;
          case "update":
            const updated_cursor = others.get(cursor_id);
            const updated_cursor_div = document.getElementById(`cursor_${cursor_id}`);
            const updated_chat_div = document.getElementById(`chat_${cursor_id}`);
            if (updated_cursor.chat === "") {
              updated_chat_div.classList.remove("show");
            } else {
              updated_chat_div.classList.add("show");
            }
            updated_chat_div.innerText = updated_cursor.chat;
            updated_cursor_div.classList.remove("new");
            cursor_interp.get(cursor_id).addPoint([updated_cursor.x, updated_cursor.y]);
            break;
          case "delete":
            const old_cursor_div = document.getElementById(`cursor_${cursor_id}`);
            old_cursor_div.classList.add("expiring");
            setTimeout(() => {
              old_cursor_div.remove();
              cursor_interp.delete(cursor_id);
            }, 1e3);
            break;
        }
      }
    });
  });
  return cleanup;
};
export { DefaultConfig, defaultCursorRenderer, initCursorChat };
