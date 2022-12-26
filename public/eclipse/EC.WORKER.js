/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./eclipse/worker.js":
/*!***************************!*\
  !*** ./eclipse/worker.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ EclipseWorker)\n/* harmony export */ });\n/* harmony import */ var _tomphttp_bare_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tomphttp/bare-client */ \"./node_modules/@tomphttp/bare-client/dist/BareClient.esm.js\");\n\n\nasync function EclipseWorker(e) {\n  console.log(e.request.url)\n  try {\n  var searchParams = new URLSearchParams(self.location.search);\n  var config = JSON.parse(decodeURIComponent(searchParams.get(\"config\")))\n  var prefix = config.prefix\n\n  if (e.request.url.startsWith(self.location.origin + prefix)) {\n  const client = new _tomphttp_bare_client__WEBPACK_IMPORTED_MODULE_0__[\"default\"](config.bare);\n\n  var options = {\n    method: e.request.method,\n    headers: e.request.headers,\n    body: undefined\n  }\n\n  const response = await client.fetch(e.request.url.split(prefix)[1], options);\n\n  var code = await response.text()\n  return new Response(code, {\n\tstatus: response.status,\n\theaders: response.rawHeaders\n  });\n  } else {\n    return fetch(e.request);\n  }\n  } catch(error) {\n  console.log(error)\n  return new Response(error, {\n\t\tstatus: 500,\n\t})\n  }\n}\n\n\n\n//# sourceURL=webpack://eclipse/./eclipse/worker.js?");

/***/ }),

/***/ "./node_modules/@tomphttp/bare-client/dist/BareClient.esm.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@tomphttp/bare-client/dist/BareClient.esm.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BareError\": () => (/* binding */ BareError),\n/* harmony export */   \"default\": () => (/* binding */ BareClient),\n/* harmony export */   \"maxRedirects\": () => (/* binding */ maxRedirects),\n/* harmony export */   \"statusEmpty\": () => (/* binding */ statusEmpty),\n/* harmony export */   \"statusRedirect\": () => (/* binding */ statusRedirect)\n/* harmony export */ });\n// The user likely has overwritten all networking functions after importing bare-client\n// It is our responsibility to make sure components of Bare-Client are using native networking functions\n// These exports are provided to plugins by @rollup/plugin-inject\nconst global = globalThis;\nconst fetch = global.fetch;\nconst WebSocket = global.WebSocket;\nconst Request = global.Request;\nconst Response = global.Response;\n\nconst statusEmpty = [101, 204, 205, 304];\nconst statusRedirect = [301, 302, 303, 307, 308];\nclass BareError extends Error {\n  status;\n  body;\n\n  constructor(status, body) {\n    super(body.message || body.code);\n    this.status = status;\n    this.body = body;\n  }\n\n}\nclass Client {\n  base;\n  /**\r\n   *\r\n   * @param version Version provided by extension\r\n   * @param server Bare Server URL provided by BareClient\r\n   */\n\n  constructor(version, server) {\n    this.base = new URL(`./v${version}/`, server);\n  }\n\n}\n\nconst validChars = \"!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~\";\nconst reserveChar = '%';\nfunction validProtocol(protocol) {\n  for (let i = 0; i < protocol.length; i++) {\n    const char = protocol[i];\n\n    if (!validChars.includes(char)) {\n      return false;\n    }\n  }\n\n  return true;\n}\nfunction encodeProtocol(protocol) {\n  let result = '';\n\n  for (let i = 0; i < protocol.length; i++) {\n    const char = protocol[i];\n\n    if (validChars.includes(char) && char !== reserveChar) {\n      result += char;\n    } else {\n      const code = char.charCodeAt(0);\n      result += reserveChar + code.toString(16).padStart(2, '0');\n    }\n  }\n\n  return result;\n}\n\nclass ClientV1 extends Client {\n  ws;\n  http;\n  newMeta;\n  getMeta;\n\n  constructor(server) {\n    super(1, server);\n    this.ws = new URL(this.base);\n    this.http = new URL(this.base);\n    this.newMeta = new URL('ws-new-meta', this.base);\n    this.getMeta = new URL('ws-meta', this.base);\n\n    if (this.ws.protocol === 'https:') {\n      this.ws.protocol = 'wss:';\n    } else {\n      this.ws.protocol = 'ws:';\n    }\n  }\n\n  async connect(requestHeaders, protocol, host, port, path) {\n    const assignMeta = await fetch(this.newMeta, {\n      method: 'GET'\n    });\n\n    if (!assignMeta.ok) {\n      throw new BareError(assignMeta.status, await assignMeta.json());\n    }\n\n    const id = await assignMeta.text();\n    const socket = new WebSocket(this.ws, ['bare', encodeProtocol(JSON.stringify({\n      remote: {\n        protocol,\n        host,\n        port,\n        path\n      },\n      headers: requestHeaders,\n      forward_headers: ['accept-encoding', 'accept-language', 'sec-websocket-extensions', 'sec-websocket-key', 'sec-websocket-version'],\n      id\n    }))]);\n    socket.meta = new Promise((resolve, reject) => {\n      socket.addEventListener('open', async () => {\n        const outgoing = await fetch(this.getMeta, {\n          headers: {\n            'x-bare-id': id\n          },\n          method: 'GET'\n        });\n\n        if (!outgoing.ok) {\n          reject(new BareError(outgoing.status, await outgoing.json()));\n        }\n\n        resolve(await outgoing.json());\n      });\n      socket.addEventListener('error', reject);\n    });\n    return socket;\n  }\n\n  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {\n    if (protocol.startsWith('blob:')) {\n      const response = await fetch(`blob:${location.origin}${path}`);\n      const result = new Response(response.body, response);\n      result.rawHeaders = Object.fromEntries(response.headers);\n      result.rawResponse = response;\n      return result;\n    }\n\n    const bareHeaders = {};\n\n    if (requestHeaders instanceof Headers) {\n      for (const [header, value] of requestHeaders) {\n        bareHeaders[header] = value;\n      }\n    } else {\n      for (const header in requestHeaders) {\n        bareHeaders[header] = requestHeaders[header];\n      }\n    }\n\n    const forwardHeaders = ['accept-encoding', 'accept-language'];\n    const options = {\n      credentials: 'omit',\n      method: method,\n      signal\n    };\n\n    if (body !== undefined) {\n      options.body = body;\n    } // bare can be an absolute path containing no origin, it becomes relative to the script\n\n\n    const request = new Request(this.http, options);\n    this.writeBareRequest(request, protocol, host, path, port, bareHeaders, forwardHeaders);\n    const response = await fetch(request);\n    const readResponse = await this.readBareResponse(response);\n    const result = new Response(statusEmpty.includes(readResponse.status) ? undefined : response.body, {\n      status: readResponse.status,\n      statusText: readResponse.statusText ?? undefined,\n      headers: readResponse.headers\n    });\n    result.rawHeaders = readResponse.rawHeaders;\n    result.rawResponse = response;\n    return result;\n  }\n\n  async readBareResponse(response) {\n    if (!response.ok) {\n      throw new BareError(response.status, await response.json());\n    }\n\n    const requiredHeaders = ['x-bare-status', 'x-bare-status-text', 'x-bare-headers'];\n\n    for (const header of requiredHeaders) {\n      if (!response.headers.has(header)) {\n        throw new BareError(500, {\n          code: 'IMPL_MISSING_BARE_HEADER',\n          id: `response.headers.${header}`\n        });\n      }\n    }\n\n    const status = parseInt(response.headers.get('x-bare-status'));\n    const statusText = response.headers.get('x-bare-status-text');\n    const rawHeaders = JSON.parse(response.headers.get('x-bare-headers'));\n    const headers = new Headers(rawHeaders);\n    return {\n      status,\n      statusText,\n      rawHeaders,\n      headers\n    };\n  }\n\n  writeBareRequest(request, protocol, host, path, port, bareHeaders, forwardHeaders) {\n    request.headers.set('x-bare-protocol', protocol);\n    request.headers.set('x-bare-host', host);\n    request.headers.set('x-bare-path', path);\n    request.headers.set('x-bare-port', port.toString());\n    request.headers.set('x-bare-headers', JSON.stringify(bareHeaders));\n    request.headers.set('x-bare-forward-headers', JSON.stringify(forwardHeaders));\n  }\n\n}\n\n/*\r\n * JavaScript MD5\r\n * Adopted from https://github.com/blueimp/JavaScript-MD5\r\n *\r\n * Copyright 2011, Sebastian Tschan\r\n * https://blueimp.net\r\n *\r\n * Licensed under the MIT license:\r\n * https://opensource.org/licenses/MIT\r\n *\r\n * Based on\r\n * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message\r\n * Digest Algorithm, as defined in RFC 1321.\r\n * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009\r\n * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet\r\n * Distributed under the BSD License\r\n * See http://pajhome.org.uk/crypt/md5 for more info.\r\n */\n\n/**\r\n * Add integers, wrapping at 2^32.\r\n * This uses 16-bit operations internally to work around bugs in interpreters.\r\n *\r\n * @param x First integer\r\n * @param y Second integer\r\n * @returns Sum\r\n */\nfunction safeAdd(x, y) {\n  const lsw = (x & 0xffff) + (y & 0xffff);\n  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);\n  return msw << 16 | lsw & 0xffff;\n}\n/**\r\n * Bitwise rotate a 32-bit number to the left.\r\n *\r\n * @param num 32-bit number\r\n * @param cnt Rotation count\r\n * @returns  Rotated number\r\n */\n\n\nfunction bitRotateLeft(num, cnt) {\n  return num << cnt | num >>> 32 - cnt;\n}\n/**\r\n * Basic operation the algorithm uses.\r\n *\r\n * @param q q\r\n * @param a a\r\n * @param b b\r\n * @param x x\r\n * @param s s\r\n * @param t t\r\n * @returns Result\r\n */\n\n\nfunction md5cmn(q, a, b, x, s, t) {\n  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);\n}\n/**\r\n * Basic operation the algorithm uses.\r\n *\r\n * @param a a\r\n * @param b b\r\n * @param c c\r\n * @param d d\r\n * @param x x\r\n * @param s s\r\n * @param t t\r\n * @returns Result\r\n */\n\n\nfunction md5ff(a, b, c, d, x, s, t) {\n  return md5cmn(b & c | ~b & d, a, b, x, s, t);\n}\n/**\r\n * Basic operation the algorithm uses.\r\n *\r\n * @param a a\r\n * @param b b\r\n * @param c c\r\n * @param d d\r\n * @param x x\r\n * @param s s\r\n * @param t t\r\n * @returns Result\r\n */\n\n\nfunction md5gg(a, b, c, d, x, s, t) {\n  return md5cmn(b & d | c & ~d, a, b, x, s, t);\n}\n/**\r\n * Basic operation the algorithm uses.\r\n *\r\n * @param a a\r\n * @param b b\r\n * @param c c\r\n * @param d d\r\n * @param x x\r\n * @param s s\r\n * @param t t\r\n * @returns Result\r\n */\n\n\nfunction md5hh(a, b, c, d, x, s, t) {\n  return md5cmn(b ^ c ^ d, a, b, x, s, t);\n}\n/**\r\n * Basic operation the algorithm uses.\r\n *\r\n * @param a a\r\n * @param b b\r\n * @param c c\r\n * @param d d\r\n * @param x x\r\n * @param s s\r\n * @param t t\r\n * @returns Result\r\n */\n\n\nfunction md5ii(a, b, c, d, x, s, t) {\n  return md5cmn(c ^ (b | ~d), a, b, x, s, t);\n}\n/**\r\n * Calculate the MD5 of an array of little-endian words, and a bit length.\r\n *\r\n * @param x Array of little-endian words\r\n * @param len Bit length\r\n * @returns MD5 Array\r\n */\n\n\nfunction binlMD5(x, len) {\n  /* append padding */\n  x[len >> 5] |= 0x80 << len % 32;\n  x[(len + 64 >>> 9 << 4) + 14] = len;\n  let a = 1732584193;\n  let b = -271733879;\n  let c = -1732584194;\n  let d = 271733878;\n\n  for (let i = 0; i < x.length; i += 16) {\n    const olda = a;\n    const oldb = b;\n    const oldc = c;\n    const oldd = d;\n    a = md5ff(a, b, c, d, x[i], 7, -680876936);\n    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);\n    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);\n    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);\n    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);\n    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);\n    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);\n    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);\n    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);\n    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);\n    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);\n    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);\n    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);\n    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);\n    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);\n    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);\n    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);\n    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);\n    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);\n    b = md5gg(b, c, d, a, x[i], 20, -373897302);\n    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);\n    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);\n    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);\n    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);\n    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);\n    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);\n    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);\n    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);\n    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);\n    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);\n    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);\n    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);\n    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);\n    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);\n    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);\n    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);\n    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);\n    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);\n    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);\n    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);\n    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);\n    d = md5hh(d, a, b, c, x[i], 11, -358537222);\n    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);\n    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);\n    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);\n    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);\n    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);\n    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);\n    a = md5ii(a, b, c, d, x[i], 6, -198630844);\n    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);\n    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);\n    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);\n    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);\n    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);\n    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);\n    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);\n    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);\n    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);\n    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);\n    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);\n    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);\n    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);\n    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);\n    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);\n    a = safeAdd(a, olda);\n    b = safeAdd(b, oldb);\n    c = safeAdd(c, oldc);\n    d = safeAdd(d, oldd);\n  }\n\n  return [a, b, c, d];\n}\n/**\r\n * Convert an array of little-endian words to a string\r\n *\r\n * @param input MD5 Array\r\n * @returns MD5 string\r\n */\n\n\nfunction binl2rstr(input) {\n  let output = '';\n  const length32 = input.length * 32;\n\n  for (let i = 0; i < length32; i += 8) {\n    output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xff);\n  }\n\n  return output;\n}\n/**\r\n * Convert a raw string to an array of little-endian words\r\n * Characters >255 have their high-byte silently ignored.\r\n *\r\n * @param input Raw input string\r\n * @returns Array of little-endian words\r\n */\n\n\nfunction rstr2binl(input) {\n  const output = [];\n  const outputLen = input.length >> 2;\n\n  for (let i = 0; i < outputLen; i += 1) {\n    output[i] = 0;\n  }\n\n  const length8 = input.length * 8;\n\n  for (let i = 0; i < length8; i += 8) {\n    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;\n  }\n\n  return output;\n}\n/**\r\n * Calculate the MD5 of a raw string\r\n *\r\n * @param s Input string\r\n * @returns Raw MD5 string\r\n */\n\n\nfunction rstrMD5(s) {\n  return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));\n}\n/**\r\n * Calculates the HMAC-MD5 of a key and some data (raw strings)\r\n *\r\n * @param key HMAC key\r\n * @param data Raw input string\r\n * @returns Raw MD5 string\r\n */\n\n\nfunction rstrHMACMD5(key, data) {\n  let bkey = rstr2binl(key);\n  const ipad = [];\n  const opad = [];\n\n  if (bkey.length > 16) {\n    bkey = binlMD5(bkey, key.length * 8);\n  }\n\n  for (let i = 0; i < 16; i += 1) {\n    ipad[i] = bkey[i] ^ 0x36363636;\n    opad[i] = bkey[i] ^ 0x5c5c5c5c;\n  }\n\n  const hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);\n  return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));\n}\n/**\r\n * Convert a raw string to a hex string\r\n *\r\n * @param input Raw input string\r\n * @returns Hex encoded string\r\n */\n\n\nfunction rstr2hex(input) {\n  const hexTab = '0123456789abcdef';\n  let output = '';\n\n  for (let i = 0; i < input.length; i += 1) {\n    const x = input.charCodeAt(i);\n    output += hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f);\n  }\n\n  return output;\n}\n/**\r\n * Encode a string as UTF-8\r\n *\r\n * @param input Input string\r\n * @returns UTF8 string\r\n */\n\n\nfunction str2rstrUTF8(input) {\n  return unescape(encodeURIComponent(input));\n}\n/**\r\n * Encodes input string as raw MD5 string\r\n *\r\n * @param s Input string\r\n * @returns Raw MD5 string\r\n */\n\n\nfunction rawMD5(s) {\n  return rstrMD5(str2rstrUTF8(s));\n}\n/**\r\n * Encodes input string as Hex encoded string\r\n *\r\n * @param s Input string\r\n * @returns Hex encoded string\r\n */\n\n\nfunction hexMD5(s) {\n  return rstr2hex(rawMD5(s));\n}\n/**\r\n * Calculates the raw HMAC-MD5 for the given key and data\r\n *\r\n * @param k HMAC key\r\n * @param d Input string\r\n * @returns Raw MD5 string\r\n */\n\n\nfunction rawHMACMD5(k, d) {\n  return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));\n}\n/**\r\n * Calculates the Hex encoded HMAC-MD5 for the given key and data\r\n *\r\n * @param k HMAC key\r\n * @param d Input string\r\n * @returns Raw MD5 string\r\n */\n\n\nfunction hexHMACMD5(k, d) {\n  return rstr2hex(rawHMACMD5(k, d));\n}\n/**\r\n * Calculates MD5 value for a given string.\r\n * If a key is provided, calculates the HMAC-MD5 value.\r\n * Returns a Hex encoded string unless the raw argument is given.\r\n *\r\n * @param string Input string\r\n * @param key HMAC key\r\n * @param raw Raw output switch\r\n * @returns MD5 output\r\n */\n\n\nfunction md5(string, key, raw) {\n  if (!key) {\n    if (!raw) {\n      return hexMD5(string);\n    }\n\n    return rawMD5(string);\n  }\n\n  if (!raw) {\n    return hexHMACMD5(key, string);\n  }\n\n  return rawHMACMD5(key, string);\n}\n\nconst MAX_HEADER_VALUE = 3072;\n/**\r\n *\r\n * Splits headers according to spec\r\n * @param headers\r\n * @returns Split headers\r\n */\n\nfunction splitHeaders(headers) {\n  const output = new Headers(headers);\n\n  if (headers.has('x-bare-headers')) {\n    const value = headers.get('x-bare-headers');\n\n    if (value.length > MAX_HEADER_VALUE) {\n      output.delete('x-bare-headers');\n      let split = 0;\n\n      for (let i = 0; i < value.length; i += MAX_HEADER_VALUE) {\n        const part = value.slice(i, i + MAX_HEADER_VALUE);\n        const id = split++;\n        output.set(`x-bare-headers-${id}`, `;${part}`);\n      }\n    }\n  }\n\n  return output;\n}\n/**\r\n * Joins headers according to spec\r\n * @param headers\r\n * @returns Joined headers\r\n */\n\nfunction joinHeaders(headers) {\n  const output = new Headers(headers);\n  const prefix = 'x-bare-headers';\n\n  if (headers.has(`${prefix}-0`)) {\n    const join = [];\n\n    for (const [header, value] of headers) {\n      if (!header.startsWith(prefix)) {\n        continue;\n      }\n\n      if (!value.startsWith(';')) {\n        throw new BareError(400, {\n          code: 'INVALID_BARE_HEADER',\n          id: `request.headers.${header}`,\n          message: `Value didn't begin with semi-colon.`\n        });\n      }\n\n      const id = parseInt(header.slice(prefix.length + 1));\n      join[id] = value.slice(1);\n      output.delete(header);\n    }\n\n    output.set(prefix, join.join(''));\n  }\n\n  return output;\n}\n\nclass ClientV2 extends Client {\n  ws;\n  http;\n  newMeta;\n  getMeta;\n\n  constructor(server) {\n    super(2, server);\n    this.ws = new URL(this.base);\n    this.http = new URL(this.base);\n    this.newMeta = new URL('./ws-new-meta', this.base);\n    this.getMeta = new URL(`./ws-meta`, this.base);\n\n    if (this.ws.protocol === 'https:') {\n      this.ws.protocol = 'wss:';\n    } else {\n      this.ws.protocol = 'ws:';\n    }\n  }\n\n  async connect(requestHeaders, protocol, host, port, path) {\n    const request = new Request(this.newMeta, {\n      headers: this.createBareHeaders(protocol, host, path, port, requestHeaders)\n    });\n    const assign_meta = await fetch(request);\n\n    if (!assign_meta.ok) {\n      throw new BareError(assign_meta.status, await assign_meta.json());\n    }\n\n    const id = await assign_meta.text();\n    const socket = new WebSocket(this.ws, [id]);\n    socket.meta = new Promise((resolve, reject) => {\n      socket.addEventListener('open', async () => {\n        const outgoing = await fetch(this.getMeta, {\n          headers: {\n            'x-bare-id': id\n          },\n          method: 'GET'\n        });\n        resolve(await await this.readBareResponse(outgoing));\n      });\n      socket.addEventListener('error', reject);\n    });\n    return socket;\n  }\n\n  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {\n    if (protocol.startsWith('blob:')) {\n      const response = await fetch(`blob:${location.origin}${path}`);\n      const result = new Response(response.body, response);\n      result.rawHeaders = Object.fromEntries(response.headers);\n      result.rawResponse = response;\n      return result;\n    }\n\n    const bareHeaders = {};\n\n    if (requestHeaders instanceof Headers) {\n      for (const [header, value] of requestHeaders) {\n        bareHeaders[header] = value;\n      }\n    } else {\n      for (const header in requestHeaders) {\n        bareHeaders[header] = requestHeaders[header];\n      }\n    }\n\n    const options = {\n      credentials: 'omit',\n      method: method,\n      signal\n    };\n\n    if (cache !== 'only-if-cached') {\n      options.cache = cache;\n    }\n\n    if (body !== undefined) {\n      options.body = body;\n    }\n\n    options.headers = this.createBareHeaders(protocol, host, path, port, bareHeaders);\n    const request = new Request(this.http + '?cache=' + md5(`${protocol}${host}${port}${path}`), options);\n    const response = await fetch(request);\n    const readResponse = await this.readBareResponse(response);\n    const result = new Response(statusEmpty.includes(readResponse.status) ? undefined : response.body, {\n      status: readResponse.status,\n      statusText: readResponse.statusText ?? undefined,\n      headers: readResponse.headers\n    });\n    result.rawHeaders = readResponse.rawHeaders;\n    result.rawResponse = response;\n    return result;\n  }\n\n  async readBareResponse(response) {\n    if (!response.ok) {\n      throw new BareError(response.status, await response.json());\n    }\n\n    const responseHeaders = joinHeaders(response.headers);\n    const result = {};\n\n    if (responseHeaders.has('x-bare-status')) {\n      result.status = parseInt(responseHeaders.get('x-bare-status'));\n    }\n\n    if (responseHeaders.has('x-bare-status-text')) {\n      result.statusText = responseHeaders.get('x-bare-status-text');\n    }\n\n    if (responseHeaders.has('x-bare-headers')) {\n      result.rawHeaders = JSON.parse(responseHeaders.get('x-bare-headers'));\n      result.headers = new Headers(result.rawHeaders);\n    }\n\n    return result;\n  }\n\n  createBareHeaders(protocol, host, path, port, bareHeaders, forwardHeaders = [], passHeaders = [], passStatus = []) {\n    const headers = new Headers();\n    headers.set('x-bare-protocol', protocol);\n    headers.set('x-bare-host', host);\n    headers.set('x-bare-path', path);\n    headers.set('x-bare-port', port.toString());\n    headers.set('x-bare-headers', JSON.stringify(bareHeaders));\n\n    for (const header of forwardHeaders) {\n      headers.append('x-bare-forward-headers', header);\n    }\n\n    for (const header of passHeaders) {\n      headers.append('x-bare-pass-headers', header);\n    }\n\n    for (const status of passStatus) {\n      headers.append('x-bare-pass-status', status.toString());\n    }\n\n    splitHeaders(headers);\n    return headers;\n  }\n\n}\n\nconst clientCtors = [['v2', ClientV2], ['v1', ClientV1]];\nconst maxRedirects = 20;\nclass BareClient {\n  data;\n  client;\n  server;\n  ready;\n  /**\r\n   *\r\n   * @param server A full URL to the bare server.\r\n   * @param data The a copy of the Bare server data found in BareClient.data. If specified, this data will be loaded. Otherwise, a request will be made to the bare server (upon fetching or creating a WebSocket).\r\n   */\n\n  constructor(server, data) {\n    this.server = new URL(server);\n    this.ready = false;\n\n    if (typeof data === 'object') {\n      this.loadData(data);\n    }\n  }\n\n  loadData(data) {\n    let found = false; // newest-oldest\n\n    for (const [version, ctor] of clientCtors) {\n      if (data.versions.includes(version)) {\n        this.client = new ctor(this.server);\n        found = true;\n        break;\n      }\n    }\n\n    if (!found) {\n      throw new Error(`Unable to find compatible client version.`);\n    }\n\n    this.data = data;\n    this.ready = true;\n  }\n\n  async work() {\n    if (this.ready === true) {\n      return;\n    }\n\n    const outgoing = await fetch(this.server);\n\n    if (!outgoing.ok) {\n      throw new Error(`Unable to fetch Bare meta: ${outgoing.status} ${await outgoing.text()}`);\n    }\n\n    this.loadData(await outgoing.json());\n  }\n\n  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {\n    await this.work();\n    return await this.client.request(method, requestHeaders, body, protocol, host, port, path, cache, signal);\n  }\n\n  async connect(requestHeaders, protocol, host, port, path) {\n    await this.work();\n    return this.client.connect(requestHeaders, protocol, host, port, path);\n  }\n  /**\r\n   *\r\n   * @param url\r\n   * @param protocols\r\n   * @param origin Location of client that created the WebSocket\r\n   * @returns\r\n   */\n\n\n  async createWebSocket(url, headers = {}, protocols = []) {\n    const requestHeaders = headers instanceof Headers ? Object.fromEntries(headers) : headers;\n    url = new URL(url); // user is expected to specify user-agent and origin\n    // both are in spec\n\n    requestHeaders['Host'] = url.host; // requestHeaders['Origin'] = origin;\n\n    requestHeaders['Pragma'] = 'no-cache';\n    requestHeaders['Cache-Control'] = 'no-cache';\n    requestHeaders['Upgrade'] = 'websocket'; // requestHeaders['User-Agent'] = navigator.userAgent;\n\n    requestHeaders['Connection'] = 'Upgrade';\n\n    if (typeof protocols === 'string') {\n      protocols = [protocols];\n    }\n\n    for (const proto of protocols) {\n      if (!validProtocol(proto)) {\n        throw new DOMException(`Failed to construct 'WebSocket': The subprotocol '${proto}' is invalid.`);\n      }\n    }\n\n    if (protocols.length) {\n      headers['Sec-Websocket-Protocol'] = protocols.join(', ');\n    }\n\n    await this.work();\n    return this.client.connect(headers, url.protocol, url.hostname, url.port, url.pathname + url.search);\n  }\n\n  async fetch(url, init = {}) {\n    if (url instanceof Request) {\n      // behave similar to the browser when fetch is called with (Request, Init)\n      if (init) {\n        url = new URL(url.url);\n      } else {\n        init = url;\n        url = new URL(url.url);\n      }\n    } else {\n      url = new URL(url);\n    }\n\n    let method;\n\n    if (typeof init.method === 'string') {\n      method = init.method;\n    } else {\n      method = 'GET';\n    }\n\n    let body;\n\n    if (init.body !== undefined && init.body !== null) {\n      body = init.body;\n    }\n\n    let headers;\n\n    if (typeof init.headers === 'object' && init.headers !== null) {\n      if (init.headers instanceof Headers) {\n        headers = Object.fromEntries(init.headers);\n      } else {\n        headers = init.headers;\n      }\n    } else {\n      headers = {};\n    }\n\n    let cache;\n\n    if (typeof init.cache === 'string') {\n      cache = init.cache;\n    } else {\n      cache = 'default';\n    }\n\n    let signal;\n\n    if (init.signal instanceof AbortSignal) {\n      signal = init.signal;\n    }\n\n    for (let i = 0;; i++) {\n      let port;\n\n      if (url.port === '') {\n        if (url.protocol === 'https:') {\n          port = '443';\n        } else {\n          port = '80';\n        }\n      } else {\n        port = url.port;\n      }\n\n      headers.host = url.host;\n      const response = await this.request(method, headers, body, url.protocol, url.hostname, port, url.pathname + url.search, cache, signal);\n      response.finalURL = url.toString();\n\n      if (statusRedirect.includes(response.status)) {\n        switch (init.redirect) {\n          default:\n          case 'follow':\n            if (maxRedirects > i && response.headers.has('location')) {\n              url = new URL(response.headers.get('location'), url);\n              continue;\n            } else {\n              throw new TypeError('Failed to fetch');\n            }\n\n          case 'error':\n            throw new TypeError('Failed to fetch');\n\n          case 'manual':\n            return response;\n        }\n      } else {\n        return response;\n      }\n    }\n  }\n\n}\n\n\n//# sourceMappingURL=BareClient.esm.js.map\n\n\n//# sourceURL=webpack://eclipse/./node_modules/@tomphttp/bare-client/dist/BareClient.esm.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./eclipse/worker.js");
/******/ 	
/******/ })()
;