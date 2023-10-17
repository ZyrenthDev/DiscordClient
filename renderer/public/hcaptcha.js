/* https://hcaptcha.com/license */
!(function () {
  "use strict";
  function t(t) {
    var e = this.constructor;
    return this.then(
      function (i) {
        return e.resolve(t()).then(function () {
          return i;
        });
      },
      function (i) {
        return e.resolve(t()).then(function () {
          return e.reject(i);
        });
      }
    );
  }
  function e(t) {
    return new this(function (e, i) {
      if (!t || "undefined" == typeof t.length)
        return i(
          new TypeError(
            typeof t +
              " " +
              t +
              " is not iterable(cannot read property Symbol(Symbol.iterator))"
          )
        );
      var n = Array.prototype.slice.call(t);
      if (0 === n.length) return e([]);
      var o = n.length;
      function s(t, i) {
        if (i && ("object" == typeof i || "function" == typeof i)) {
          var r = i.then;
          if ("function" == typeof r)
            return void r.call(
              i,
              function (e) {
                s(t, e);
              },
              function (i) {
                (n[t] = { status: "rejected", reason: i }), 0 == --o && e(n);
              }
            );
        }
        (n[t] = { status: "fulfilled", value: i }), 0 == --o && e(n);
      }
      for (var r = 0; r < n.length; r++) s(r, n[r]);
    });
  }
  var i = setTimeout,
    n = "undefined" != typeof setImmediate ? setImmediate : null;
  function o(t) {
    return Boolean(t && "undefined" != typeof t.length);
  }
  function s() {}
  function r(t) {
    if (!(this instanceof r))
      throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof t) throw new TypeError("not a function");
    (this._state = 0),
      (this._handled = !1),
      (this._value = undefined),
      (this._deferreds = []),
      d(t, this);
  }
  function a(t, e) {
    for (; 3 === t._state; ) t = t._value;
    0 !== t._state
      ? ((t._handled = !0),
        r._immediateFn(function () {
          var i = 1 === t._state ? e.onFulfilled : e.onRejected;
          if (null !== i) {
            var n;
            try {
              n = i(t._value);
            } catch (o) {
              return void c(e.promise, o);
            }
            l(e.promise, n);
          } else (1 === t._state ? l : c)(e.promise, t._value);
        }))
      : t._deferreds.push(e);
  }
  function l(t, e) {
    try {
      if (e === t)
        throw new TypeError("A promise cannot be resolved with itself.");
      if (e && ("object" == typeof e || "function" == typeof e)) {
        var i = e.then;
        if (e instanceof r) return (t._state = 3), (t._value = e), void h(t);
        if ("function" == typeof i)
          return void d(
            ((n = i),
            (o = e),
            function () {
              n.apply(o, arguments);
            }),
            t
          );
      }
      (t._state = 1), (t._value = e), h(t);
    } catch (s) {
      c(t, s);
    }
    var n, o;
  }
  function c(t, e) {
    (t._state = 2), (t._value = e), h(t);
  }
  function h(t) {
    2 === t._state &&
      0 === t._deferreds.length &&
      r._immediateFn(function () {
        t._handled || r._unhandledRejectionFn(t._value);
      });
    for (var e = 0, i = t._deferreds.length; e < i; e++) a(t, t._deferreds[e]);
    t._deferreds = null;
  }
  function u(t, e, i) {
    (this.onFulfilled = "function" == typeof t ? t : null),
      (this.onRejected = "function" == typeof e ? e : null),
      (this.promise = i);
  }
  function d(t, e) {
    var i = !1;
    try {
      t(
        function (t) {
          i || ((i = !0), l(e, t));
        },
        function (t) {
          i || ((i = !0), c(e, t));
        }
      );
    } catch (n) {
      if (i) return;
      (i = !0), c(e, n);
    }
  }
  (r.prototype["catch"] = function (t) {
    return this.then(null, t);
  }),
    (r.prototype.then = function (t, e) {
      var i = new this.constructor(s);
      return a(this, new u(t, e, i)), i;
    }),
    (r.prototype["finally"] = t),
    (r.all = function (t) {
      return new r(function (e, i) {
        if (!o(t)) return i(new TypeError("Promise.all accepts an array"));
        var n = Array.prototype.slice.call(t);
        if (0 === n.length) return e([]);
        var s = n.length;
        function r(t, o) {
          try {
            if (o && ("object" == typeof o || "function" == typeof o)) {
              var a = o.then;
              if ("function" == typeof a)
                return void a.call(
                  o,
                  function (e) {
                    r(t, e);
                  },
                  i
                );
            }
            (n[t] = o), 0 == --s && e(n);
          } catch (l) {
            i(l);
          }
        }
        for (var a = 0; a < n.length; a++) r(a, n[a]);
      });
    }),
    (r.allSettled = e),
    (r.resolve = function (t) {
      return t && "object" == typeof t && t.constructor === r
        ? t
        : new r(function (e) {
            e(t);
          });
    }),
    (r.reject = function (t) {
      return new r(function (e, i) {
        i(t);
      });
    }),
    (r.race = function (t) {
      return new r(function (e, i) {
        if (!o(t)) return i(new TypeError("Promise.race accepts an array"));
        for (var n = 0, s = t.length; n < s; n++) r.resolve(t[n]).then(e, i);
      });
    }),
    (r._immediateFn =
      ("function" == typeof n &&
        function (t) {
          n(t);
        }) ||
      function (t) {
        i(t, 0);
      }),
    (r._unhandledRejectionFn = function (t) {
      "undefined" != typeof console &&
        console &&
        console.warn("Possible Unhandled Promise Rejection:", t);
    });
  var p = (function () {
    if ("undefined" != typeof self) return self;
    if ("undefined" != typeof window) return window;
    if ("undefined" != typeof global) return global;
    throw new Error("unable to locate global object");
  })();
  function f(t, e, i) {
    return e <= t && t <= i;
  }
  function m(t) {
    if (t === undefined) return {};
    if (t === Object(t)) return t;
    throw TypeError("Could not convert argument to dictionary");
  }
  "function" != typeof p.Promise
    ? (p.Promise = r)
    : (p.Promise.prototype["finally"] || (p.Promise.prototype["finally"] = t),
      p.Promise.allSettled || (p.Promise.allSettled = e));
  var y = function (t) {
      return t >= 0 && t <= 127;
    },
    g = -1;
  function v(t) {
    (this.tokens = [].slice.call(t)), this.tokens.reverse();
  }
  v.prototype = {
    endOfStream: function () {
      return !this.tokens.length;
    },
    read: function () {
      return this.tokens.length ? this.tokens.pop() : g;
    },
    prepend: function (t) {
      if (Array.isArray(t))
        for (var e = t; e.length; ) this.tokens.push(e.pop());
      else this.tokens.push(t);
    },
    push: function (t) {
      if (Array.isArray(t))
        for (var e = t; e.length; ) this.tokens.unshift(e.shift());
      else this.tokens.unshift(t);
    },
  };
  var b = -1;
  function w(t, e) {
    if (t) throw TypeError("Decoder error");
    return e || 65533;
  }
  function x(t) {
    return (
      (t = String(t).trim().toLowerCase()),
      Object.prototype.hasOwnProperty.call(C, t) ? C[t] : null
    );
  }
  var C = {};
  [
    {
      encodings: [
        { labels: ["unicode-1-1-utf-8", "utf-8", "utf8"], name: "UTF-8" },
      ],
      heading: "The Encoding",
    },
  ].forEach(function (t) {
    t.encodings.forEach(function (t) {
      t.labels.forEach(function (e) {
        C[e] = t;
      });
    });
  });
  var k,
    _ = {
      "UTF-8": function (t) {
        return new H(t);
      },
    },
    E = {
      "UTF-8": function (t) {
        return new B(t);
      },
    },
    S = "utf-8";
  function A(t, e) {
    if (!(this instanceof A))
      throw TypeError("Called as a function. Did you forget 'new'?");
    (t = t !== undefined ? String(t) : S),
      (e = m(e)),
      (this._encoding = null),
      (this._decoder = null),
      (this._ignoreBOM = !1),
      (this._BOMseen = !1),
      (this._error_mode = "replacement"),
      (this._do_not_flush = !1);
    var i = x(t);
    if (null === i || "replacement" === i.name)
      throw RangeError("Unknown encoding: " + t);
    if (!E[i.name])
      throw Error(
        "Decoder not present. Did you forget to include encoding-indexes.js first?"
      );
    var n = this;
    return (
      (n._encoding = i),
      e.fatal && (n._error_mode = "fatal"),
      e.ignoreBOM && (n._ignoreBOM = !0),
      Object.defineProperty ||
        ((this.encoding = n._encoding.name.toLowerCase()),
        (this.fatal = "fatal" === n._error_mode),
        (this.ignoreBOM = n._ignoreBOM)),
      n
    );
  }
  function L(t, e) {
    if (!(this instanceof L))
      throw TypeError("Called as a function. Did you forget 'new'?");
    (e = m(e)),
      (this._encoding = null),
      (this._encoder = null),
      (this._do_not_flush = !1),
      (this._fatal = e.fatal ? "fatal" : "replacement");
    var i = this;
    if (e.NONSTANDARD_allowLegacyEncoding) {
      var n = x((t = t !== undefined ? String(t) : S));
      if (null === n || "replacement" === n.name)
        throw RangeError("Unknown encoding: " + t);
      if (!_[n.name])
        throw Error(
          "Encoder not present. Did you forget to include encoding-indexes.js first?"
        );
      i._encoding = n;
    } else i._encoding = x("utf-8");
    return (
      Object.defineProperty || (this.encoding = i._encoding.name.toLowerCase()),
      i
    );
  }
  function B(t) {
    var e = t.fatal,
      i = 0,
      n = 0,
      o = 0,
      s = 128,
      r = 191;
    this.handler = function (t, a) {
      if (a === g && 0 !== o) return (o = 0), w(e);
      if (a === g) return b;
      if (0 === o) {
        if (f(a, 0, 127)) return a;
        if (f(a, 194, 223)) (o = 1), (i = 31 & a);
        else if (f(a, 224, 239))
          224 === a && (s = 160), 237 === a && (r = 159), (o = 2), (i = 15 & a);
        else {
          if (!f(a, 240, 244)) return w(e);
          240 === a && (s = 144), 244 === a && (r = 143), (o = 3), (i = 7 & a);
        }
        return null;
      }
      if (!f(a, s, r))
        return (i = o = n = 0), (s = 128), (r = 191), t.prepend(a), w(e);
      if (((s = 128), (r = 191), (i = (i << 6) | (63 & a)), (n += 1) !== o))
        return null;
      var l = i;
      return (i = o = n = 0), l;
    };
  }
  function H(t) {
    t.fatal;
    this.handler = function (t, e) {
      if (e === g) return b;
      if (y(e)) return e;
      var i, n;
      f(e, 128, 2047)
        ? ((i = 1), (n = 192))
        : f(e, 2048, 65535)
        ? ((i = 2), (n = 224))
        : f(e, 65536, 1114111) && ((i = 3), (n = 240));
      for (var o = [(e >> (6 * i)) + n]; i > 0; ) {
        var s = e >> (6 * (i - 1));
        o.push(128 | (63 & s)), (i -= 1);
      }
      return o;
    };
  }
  Object.defineProperty &&
    (Object.defineProperty(A.prototype, "encoding", {
      get: function () {
        return this._encoding.name.toLowerCase();
      },
    }),
    Object.defineProperty(A.prototype, "fatal", {
      get: function () {
        return "fatal" === this._error_mode;
      },
    }),
    Object.defineProperty(A.prototype, "ignoreBOM", {
      get: function () {
        return this._ignoreBOM;
      },
    })),
    (A.prototype.decode = function (t, e) {
      var i;
      (i =
        "object" == typeof t && t instanceof ArrayBuffer
          ? new Uint8Array(t)
          : "object" == typeof t &&
            "buffer" in t &&
            t.buffer instanceof ArrayBuffer
          ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength)
          : new Uint8Array(0)),
        (e = m(e)),
        this._do_not_flush ||
          ((this._decoder = E[this._encoding.name]({
            fatal: "fatal" === this._error_mode,
          })),
          (this._BOMseen = !1)),
        (this._do_not_flush = Boolean(e.stream));
      for (var n, o = new v(i), s = []; ; ) {
        var r = o.read();
        if (r === g) break;
        if ((n = this._decoder.handler(o, r)) === b) break;
        null !== n && (Array.isArray(n) ? s.push.apply(s, n) : s.push(n));
      }
      if (!this._do_not_flush) {
        do {
          if ((n = this._decoder.handler(o, o.read())) === b) break;
          null !== n && (Array.isArray(n) ? s.push.apply(s, n) : s.push(n));
        } while (!o.endOfStream());
        this._decoder = null;
      }
      return function (t) {
        var e, i;
        return (
          (e = ["UTF-8", "UTF-16LE", "UTF-16BE"]),
          (i = this._encoding.name),
          -1 === e.indexOf(i) ||
            this._ignoreBOM ||
            this._BOMseen ||
            (t.length > 0 && 65279 === t[0]
              ? ((this._BOMseen = !0), t.shift())
              : t.length > 0 && (this._BOMseen = !0)),
          (function (t) {
            for (var e = "", i = 0; i < t.length; ++i) {
              var n = t[i];
              n <= 65535
                ? (e += String.fromCharCode(n))
                : ((n -= 65536),
                  (e += String.fromCharCode(
                    55296 + (n >> 10),
                    56320 + (1023 & n)
                  )));
            }
            return e;
          })(t)
        );
      }.call(this, s);
    }),
    Object.defineProperty &&
      Object.defineProperty(L.prototype, "encoding", {
        get: function () {
          return this._encoding.name.toLowerCase();
        },
      }),
    (L.prototype.encode = function (t, e) {
      (t = t === undefined ? "" : String(t)),
        (e = m(e)),
        this._do_not_flush ||
          (this._encoder = _[this._encoding.name]({
            fatal: "fatal" === this._fatal,
          })),
        (this._do_not_flush = Boolean(e.stream));
      for (
        var i,
          n = new v(
            (function (t) {
              for (var e = String(t), i = e.length, n = 0, o = []; n < i; ) {
                var s = e.charCodeAt(n);
                if (s < 55296 || s > 57343) o.push(s);
                else if (s >= 56320 && s <= 57343) o.push(65533);
                else if (s >= 55296 && s <= 56319)
                  if (n === i - 1) o.push(65533);
                  else {
                    var r = e.charCodeAt(n + 1);
                    if (r >= 56320 && r <= 57343) {
                      var a = 1023 & s,
                        l = 1023 & r;
                      o.push(65536 + (a << 10) + l), (n += 1);
                    } else o.push(65533);
                  }
                n += 1;
              }
              return o;
            })(t)
          ),
          o = [];
        ;

      ) {
        var s = n.read();
        if (s === g) break;
        if ((i = this._encoder.handler(n, s)) === b) break;
        Array.isArray(i) ? o.push.apply(o, i) : o.push(i);
      }
      if (!this._do_not_flush) {
        for (; (i = this._encoder.handler(n, n.read())) !== b; )
          Array.isArray(i) ? o.push.apply(o, i) : o.push(i);
        this._encoder = null;
      }
      return new Uint8Array(o);
    }),
    window.TextDecoder || (window.TextDecoder = A),
    window.TextEncoder || (window.TextEncoder = L),
    (function (t) {
      if ("function" != typeof Promise) throw "Promise support required";
      var e = t.crypto || t.msCrypto;
      if (e) {
        var i = e.subtle || e.webkitSubtle;
        if (i) {
          var n = t.Crypto || e.constructor || Object,
            o = t.SubtleCrypto || i.constructor || Object,
            s =
              (t.CryptoKey || t.Key,
              t.navigator.userAgent.indexOf("Edge/") > -1),
            r = !!t.msCrypto && !s,
            a = !e.subtle && !!e.webkitSubtle;
          if (r || a) {
            var l = { KoZIhvcNAQEB: "1.2.840.113549.1.1.1" },
              c = { "1.2.840.113549.1.1.1": "KoZIhvcNAQEB" };
            if (
              (["generateKey", "importKey", "unwrapKey"].forEach(function (t) {
                var n = i[t];
                i[t] = function (o, s, l) {
                  var c,
                    h,
                    u,
                    f,
                    w = [].slice.call(arguments);
                  switch (t) {
                    case "generateKey":
                      (c = m(o)), (h = s), (u = l);
                      break;
                    case "importKey":
                      (c = m(l)),
                        (h = w[3]),
                        (u = w[4]),
                        "jwk" === o &&
                          ((s = g(s)).alg || (s.alg = y(c)),
                          s.key_ops ||
                            (s.key_ops =
                              "oct" !== s.kty
                                ? "d" in s
                                  ? u.filter(E)
                                  : u.filter(_)
                                : u.slice()),
                          (w[1] = v(s)));
                      break;
                    case "unwrapKey":
                      (c = w[4]), (h = w[5]), (u = w[6]), (w[2] = l._key);
                  }
                  if ("generateKey" === t && "HMAC" === c.name && c.hash)
                    return (
                      (c.length =
                        c.length ||
                        {
                          "SHA-1": 512,
                          "SHA-256": 512,
                          "SHA-384": 1024,
                          "SHA-512": 1024,
                        }[c.hash.name]),
                      i.importKey(
                        "raw",
                        e.getRandomValues(new Uint8Array((c.length + 7) >> 3)),
                        c,
                        h,
                        u
                      )
                    );
                  if (
                    a &&
                    "generateKey" === t &&
                    "RSASSA-PKCS1-v1_5" === c.name &&
                    (!c.modulusLength || c.modulusLength >= 2048)
                  )
                    return (
                      ((o = m(o)).name = "RSAES-PKCS1-v1_5"),
                      delete o.hash,
                      i
                        .generateKey(o, !0, ["encrypt", "decrypt"])
                        .then(function (t) {
                          return Promise.all([
                            i.exportKey("jwk", t.publicKey),
                            i.exportKey("jwk", t.privateKey),
                          ]);
                        })
                        .then(function (t) {
                          return (
                            (t[0].alg = t[1].alg = y(c)),
                            (t[0].key_ops = u.filter(_)),
                            (t[1].key_ops = u.filter(E)),
                            Promise.all([
                              i.importKey("jwk", t[0], c, !0, t[0].key_ops),
                              i.importKey("jwk", t[1], c, h, t[1].key_ops),
                            ])
                          );
                        })
                        .then(function (t) {
                          return { publicKey: t[0], privateKey: t[1] };
                        })
                    );
                  if (
                    (a || (r && "SHA-1" === (c.hash || {}).name)) &&
                    "importKey" === t &&
                    "jwk" === o &&
                    "HMAC" === c.name &&
                    "oct" === s.kty
                  )
                    return i.importKey("raw", p(d(s.k)), l, w[3], w[4]);
                  if (a && "importKey" === t && ("spki" === o || "pkcs8" === o))
                    return i.importKey("jwk", b(s), l, w[3], w[4]);
                  if (r && "unwrapKey" === t)
                    return i.decrypt(w[3], l, s).then(function (t) {
                      return i.importKey(o, t, w[4], w[5], w[6]);
                    });
                  try {
                    f = n.apply(i, w);
                  } catch (x) {
                    return Promise.reject(x);
                  }
                  return (
                    r &&
                      (f = new Promise(function (t, e) {
                        (f.onabort = f.onerror =
                          function (t) {
                            e(t);
                          }),
                          (f.oncomplete = function (e) {
                            t(e.target.result);
                          });
                      })),
                    (f = f.then(function (t) {
                      return (
                        "HMAC" === c.name &&
                          (c.length || (c.length = 8 * t.algorithm.length)),
                        0 == c.name.search("RSA") &&
                          (c.modulusLength ||
                            (c.modulusLength = (
                              t.publicKey || t
                            ).algorithm.modulusLength),
                          c.publicExponent ||
                            (c.publicExponent = (
                              t.publicKey || t
                            ).algorithm.publicExponent)),
                        (t =
                          t.publicKey && t.privateKey
                            ? {
                                publicKey: new k(
                                  t.publicKey,
                                  c,
                                  h,
                                  u.filter(_)
                                ),
                                privateKey: new k(
                                  t.privateKey,
                                  c,
                                  h,
                                  u.filter(E)
                                ),
                              }
                            : new k(t, c, h, u))
                      );
                    }))
                  );
                };
              }),
              ["exportKey", "wrapKey"].forEach(function (t) {
                var e = i[t];
                i[t] = function (n, o, s) {
                  var l,
                    c = [].slice.call(arguments);
                  switch (t) {
                    case "exportKey":
                      c[1] = o._key;
                      break;
                    case "wrapKey":
                      (c[1] = o._key), (c[2] = s._key);
                  }
                  if (
                    ((a || (r && "SHA-1" === (o.algorithm.hash || {}).name)) &&
                      "exportKey" === t &&
                      "jwk" === n &&
                      "HMAC" === o.algorithm.name &&
                      (c[0] = "raw"),
                    !a ||
                      "exportKey" !== t ||
                      ("spki" !== n && "pkcs8" !== n) ||
                      (c[0] = "jwk"),
                    r && "wrapKey" === t)
                  )
                    return i.exportKey(n, o).then(function (t) {
                      return (
                        "jwk" === n &&
                          (t = p(
                            unescape(encodeURIComponent(JSON.stringify(g(t))))
                          )),
                        i.encrypt(c[3], s, t)
                      );
                    });
                  try {
                    l = e.apply(i, c);
                  } catch (h) {
                    return Promise.reject(h);
                  }
                  return (
                    r &&
                      (l = new Promise(function (t, e) {
                        (l.onabort = l.onerror =
                          function (t) {
                            e(t);
                          }),
                          (l.oncomplete = function (e) {
                            t(e.target.result);
                          });
                      })),
                    "exportKey" === t &&
                      "jwk" === n &&
                      (l = l.then(function (t) {
                        return (a ||
                          (r && "SHA-1" === (o.algorithm.hash || {}).name)) &&
                          "HMAC" === o.algorithm.name
                          ? {
                              kty: "oct",
                              alg: y(o.algorithm),
                              key_ops: o.usages.slice(),
                              ext: !0,
                              k: u(f(t)),
                            }
                          : ((t = g(t)).alg || (t.alg = y(o.algorithm)),
                            t.key_ops ||
                              (t.key_ops =
                                "public" === o.type
                                  ? o.usages.filter(_)
                                  : "private" === o.type
                                  ? o.usages.filter(E)
                                  : o.usages.slice()),
                            t);
                      })),
                    !a ||
                      "exportKey" !== t ||
                      ("spki" !== n && "pkcs8" !== n) ||
                      (l = l.then(function (t) {
                        return (t = w(g(t)));
                      })),
                    l
                  );
                };
              }),
              ["encrypt", "decrypt", "sign", "verify"].forEach(function (t) {
                var e = i[t];
                i[t] = function (n, o, s, a) {
                  if (r && (!s.byteLength || (a && !a.byteLength)))
                    throw new Error("Empty input is not allowed");
                  var l,
                    c = [].slice.call(arguments),
                    h = m(n);
                  if (
                    (!r ||
                      ("sign" !== t && "verify" !== t) ||
                      ("RSASSA-PKCS1-v1_5" !== n && "HMAC" !== n) ||
                      (c[0] = { name: n }),
                    r &&
                      o.algorithm.hash &&
                      (c[0].hash = c[0].hash || o.algorithm.hash),
                    r && "decrypt" === t && "AES-GCM" === h.name)
                  ) {
                    var u = n.tagLength >> 3;
                    (c[2] = (s.buffer || s).slice(0, s.byteLength - u)),
                      (n.tag = (s.buffer || s).slice(s.byteLength - u));
                  }
                  r &&
                    "AES-GCM" === h.name &&
                    c[0].tagLength === undefined &&
                    (c[0].tagLength = 128),
                    (c[1] = o._key);
                  try {
                    l = e.apply(i, c);
                  } catch (d) {
                    return Promise.reject(d);
                  }
                  return (
                    r &&
                      (l = new Promise(function (e, i) {
                        (l.onabort = l.onerror =
                          function (t) {
                            i(t);
                          }),
                          (l.oncomplete = function (i) {
                            i = i.target.result;
                            if (
                              "encrypt" === t &&
                              i instanceof AesGcmEncryptResult
                            ) {
                              var n = i.ciphertext,
                                o = i.tag;
                              (i = new Uint8Array(
                                n.byteLength + o.byteLength
                              )).set(new Uint8Array(n), 0),
                                i.set(new Uint8Array(o), n.byteLength),
                                (i = i.buffer);
                            }
                            e(i);
                          });
                      })),
                    l
                  );
                };
              }),
              r)
            ) {
              var h = i.digest;
              (i.digest = function (t, e) {
                if (!e.byteLength)
                  throw new Error("Empty input is not allowed");
                var n;
                try {
                  n = h.call(i, t, e);
                } catch (o) {
                  return Promise.reject(o);
                }
                return (
                  (n = new Promise(function (t, e) {
                    (n.onabort = n.onerror =
                      function (t) {
                        e(t);
                      }),
                      (n.oncomplete = function (e) {
                        t(e.target.result);
                      });
                  })),
                  n
                );
              }),
                (t.crypto = Object.create(e, {
                  getRandomValues: {
                    value: function (t) {
                      return e.getRandomValues(t);
                    },
                  },
                  subtle: { value: i },
                })),
                (t.CryptoKey = k);
            }
            a &&
              ((e.subtle = i),
              (t.Crypto = n),
              (t.SubtleCrypto = o),
              (t.CryptoKey = k));
          }
        }
      }
      function u(t) {
        return btoa(t)
          .replace(/\=+$/, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");
      }
      function d(t) {
        return (
          (t = (t += "===").slice(0, -t.length % 4)),
          atob(t.replace(/-/g, "+").replace(/_/g, "/"))
        );
      }
      function p(t) {
        for (var e = new Uint8Array(t.length), i = 0; i < t.length; i++)
          e[i] = t.charCodeAt(i);
        return e;
      }
      function f(t) {
        return (
          t instanceof ArrayBuffer && (t = new Uint8Array(t)),
          String.fromCharCode.apply(String, t)
        );
      }
      function m(t) {
        var e = { name: (t.name || t || "").toUpperCase().replace("V", "v") };
        switch (e.name) {
          case "SHA-1":
          case "SHA-256":
          case "SHA-384":
          case "SHA-512":
            break;
          case "AES-CBC":
          case "AES-GCM":
          case "AES-KW":
            t.length && (e.length = t.length);
            break;
          case "HMAC":
            t.hash && (e.hash = m(t.hash)), t.length && (e.length = t.length);
            break;
          case "RSAES-PKCS1-v1_5":
            t.publicExponent &&
              (e.publicExponent = new Uint8Array(t.publicExponent)),
              t.modulusLength && (e.modulusLength = t.modulusLength);
            break;
          case "RSASSA-PKCS1-v1_5":
          case "RSA-OAEP":
            t.hash && (e.hash = m(t.hash)),
              t.publicExponent &&
                (e.publicExponent = new Uint8Array(t.publicExponent)),
              t.modulusLength && (e.modulusLength = t.modulusLength);
            break;
          default:
            throw new SyntaxError("Bad algorithm name");
        }
        return e;
      }
      function y(t) {
        return {
          HMAC: {
            "SHA-1": "HS1",
            "SHA-256": "HS256",
            "SHA-384": "HS384",
            "SHA-512": "HS512",
          },
          "RSASSA-PKCS1-v1_5": {
            "SHA-1": "RS1",
            "SHA-256": "RS256",
            "SHA-384": "RS384",
            "SHA-512": "RS512",
          },
          "RSAES-PKCS1-v1_5": { "": "RSA1_5" },
          "RSA-OAEP": { "SHA-1": "RSA-OAEP", "SHA-256": "RSA-OAEP-256" },
          "AES-KW": { 128: "A128KW", 192: "A192KW", 256: "A256KW" },
          "AES-GCM": { 128: "A128GCM", 192: "A192GCM", 256: "A256GCM" },
          "AES-CBC": { 128: "A128CBC", 192: "A192CBC", 256: "A256CBC" },
        }[t.name][(t.hash || {}).name || t.length || ""];
      }
      function g(t) {
        (t instanceof ArrayBuffer || t instanceof Uint8Array) &&
          (t = JSON.parse(decodeURIComponent(escape(f(t)))));
        var e = { kty: t.kty, alg: t.alg, ext: t.ext || t.extractable };
        switch (e.kty) {
          case "oct":
            e.k = t.k;
          case "RSA":
            ["n", "e", "d", "p", "q", "dp", "dq", "qi", "oth"].forEach(
              function (i) {
                i in t && (e[i] = t[i]);
              }
            );
            break;
          default:
            throw new TypeError("Unsupported key type");
        }
        return e;
      }
      function v(t) {
        var e = g(t);
        return (
          r && ((e.extractable = e.ext), delete e.ext),
          p(unescape(encodeURIComponent(JSON.stringify(e)))).buffer
        );
      }
      function b(t) {
        var e = x(t),
          i = !1;
        e.length > 2 && ((i = !0), e.shift());
        var n = { ext: !0 };
        if ("1.2.840.113549.1.1.1" !== e[0][0])
          throw new TypeError("Unsupported key type");
        var o = ["n", "e", "d", "p", "q", "dp", "dq", "qi"],
          s = x(e[1]);
        i && s.shift();
        for (var r = 0; r < s.length; r++)
          s[r][0] || (s[r] = s[r].subarray(1)), (n[o[r]] = u(f(s[r])));
        return (n.kty = "RSA"), n;
      }
      function w(t) {
        var e,
          i = [["", null]],
          n = !1;
        if ("RSA" !== t.kty) throw new TypeError("Unsupported key type");
        for (
          var o = ["n", "e", "d", "p", "q", "dp", "dq", "qi"], s = [], r = 0;
          r < o.length && o[r] in t;
          r++
        ) {
          var a = (s[r] = p(d(t[o[r]])));
          128 & a[0] && ((s[r] = new Uint8Array(a.length + 1)), s[r].set(a, 1));
        }
        return (
          s.length > 2 && ((n = !0), s.unshift(new Uint8Array([0]))),
          (i[0][0] = "1.2.840.113549.1.1.1"),
          (e = s),
          i.push(new Uint8Array(C(e)).buffer),
          n ? i.unshift(new Uint8Array([0])) : (i[1] = { tag: 3, value: i[1] }),
          new Uint8Array(C(i)).buffer
        );
      }
      function x(t, e) {
        if (
          (t instanceof ArrayBuffer && (t = new Uint8Array(t)),
          e || (e = { pos: 0, end: t.length }),
          e.end - e.pos < 2 || e.end > t.length)
        )
          throw new RangeError("Malformed DER");
        var i,
          n = t[e.pos++],
          o = t[e.pos++];
        if (o >= 128) {
          if (((o &= 127), e.end - e.pos < o))
            throw new RangeError("Malformed DER");
          for (var s = 0; o--; ) (s <<= 8), (s |= t[e.pos++]);
          o = s;
        }
        if (e.end - e.pos < o) throw new RangeError("Malformed DER");
        switch (n) {
          case 2:
            i = t.subarray(e.pos, (e.pos += o));
            break;
          case 3:
            if (t[e.pos++]) throw new Error("Unsupported bit string");
            o--;
          case 4:
            i = new Uint8Array(t.subarray(e.pos, (e.pos += o))).buffer;
            break;
          case 5:
            i = null;
            break;
          case 6:
            var r = btoa(f(t.subarray(e.pos, (e.pos += o))));
            if (!(r in l)) throw new Error("Unsupported OBJECT ID " + r);
            i = l[r];
            break;
          case 48:
            i = [];
            for (var a = e.pos + o; e.pos < a; ) i.push(x(t, e));
            break;
          default:
            throw new Error("Unsupported DER tag 0x" + n.toString(16));
        }
        return i;
      }
      function C(t, e) {
        e || (e = []);
        var i = 0,
          n = 0,
          o = e.length + 2;
        if ((e.push(0, 0), t instanceof Uint8Array)) {
          (i = 2), (n = t.length);
          for (var s = 0; s < n; s++) e.push(t[s]);
        } else if (t instanceof ArrayBuffer) {
          (i = 4), (n = t.byteLength), (t = new Uint8Array(t));
          for (s = 0; s < n; s++) e.push(t[s]);
        } else if (null === t) (i = 5), (n = 0);
        else if ("string" == typeof t && t in c) {
          var r = p(atob(c[t]));
          (i = 6), (n = r.length);
          for (s = 0; s < n; s++) e.push(r[s]);
        } else if (t instanceof Array) {
          for (s = 0; s < t.length; s++) C(t[s], e);
          (i = 48), (n = e.length - o);
        } else {
          if (
            !(
              "object" == typeof t &&
              3 === t.tag &&
              t.value instanceof ArrayBuffer
            )
          )
            throw new Error("Unsupported DER value " + t);
          (i = 3), (n = (t = new Uint8Array(t.value)).byteLength), e.push(0);
          for (s = 0; s < n; s++) e.push(t[s]);
          n++;
        }
        if (n >= 128) {
          var a = n;
          n = 4;
          for (
            e.splice(
              o,
              0,
              (a >> 24) & 255,
              (a >> 16) & 255,
              (a >> 8) & 255,
              255 & a
            );
            n > 1 && !(a >> 24);

          )
            (a <<= 8), n--;
          n < 4 && e.splice(o, 4 - n), (n |= 128);
        }
        return e.splice(o - 2, 2, i, n), e;
      }
      function k(t, e, i, n) {
        Object.defineProperties(this, {
          _key: { value: t },
          type: { value: t.type, enumerable: !0 },
          extractable: {
            value: i === undefined ? t.extractable : i,
            enumerable: !0,
          },
          algorithm: {
            value: e === undefined ? t.algorithm : e,
            enumerable: !0,
          },
          usages: { value: n === undefined ? t.usages : n, enumerable: !0 },
        });
      }
      function _(t) {
        return "verify" === t || "encrypt" === t || "wrapKey" === t;
      }
      function E(t) {
        return "sign" === t || "decrypt" === t || "unwrapKey" === t;
      }
    })(window),
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = (function (t) {
        return function (e, i) {
          if (null === this || this === undefined)
            throw TypeError(
              "Array.prototype.indexOf called on null or undefined"
            );
          var n = t(this),
            o = n.length >>> 0,
            s = Math.min(0 | i, o);
          if (s < 0) s = Math.max(0, o + s);
          else if (s >= o) return -1;
          if (void 0 === e) {
            for (; s !== o; ++s) if (void 0 === n[s] && s in n) return s;
          } else if (e != e) {
            for (; s !== o; ++s) if (n[s] != n[s]) return s;
          } else for (; s !== o; ++s) if (n[s] === e) return s;
          return -1;
        };
      })(Object)),
    Array.isArray ||
      (Array.isArray = function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      }),
    document.getElementsByClassName ||
      (window.Element.prototype.getElementsByClassName =
        document.constructor.prototype.getElementsByClassName =
          function (t) {
            if (document.querySelectorAll)
              return document.querySelectorAll("." + t);
            for (
              var e = document.getElementsByTagName("*"),
                i = new RegExp("(^|\\s)" + t + "(\\s|$)"),
                n = [],
                o = 0;
              o < e.length;
              o++
            )
              i.test(e[o].className) && n.push(e[o]);
            return n;
          }),
    String.prototype.startsWith ||
      (String.prototype.startsWith = function (t, e) {
        return this.substr(!e || e < 0 ? 0 : +e, t.length) === t;
      }),
    String.prototype.endsWith ||
      (String.prototype.endsWith = function (t, e) {
        return (
          (e === undefined || e > this.length) && (e = this.length),
          this.substring(e - t.length, e) === t
        );
      });
  try {
    if (
      Object.defineProperty &&
      Object.getOwnPropertyDescriptor &&
      Object.getOwnPropertyDescriptor(Element.prototype, "textContent") &&
      !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get
    ) {
      var M = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
      Object.defineProperty(Element.prototype, "textContent", {
        get: function () {
          return M.get.call(this);
        },
        set: function (t) {
          M.set.call(this, t);
        },
      });
    }
  } catch ($s) {}
  Function.prototype.bind ||
    (Function.prototype.bind = function (t) {
      if ("function" != typeof this)
        throw new TypeError("Function.prototype.bind: Item Can Not Be Bound.");
      var e = Array.prototype.slice.call(arguments, 1),
        i = this,
        n = function () {},
        o = function () {
          return i.apply(
            this instanceof n ? this : t,
            e.concat(Array.prototype.slice.call(arguments))
          );
        };
      return (
        this.prototype && (n.prototype = this.prototype),
        (o.prototype = new n()),
        o
      );
    }),
    "function" != typeof Object.create &&
      (Object.create = function (t, e) {
        function i() {}
        if (((i.prototype = t), "object" == typeof e))
          for (var n in e) e.hasOwnProperty(n) && (i[n] = e[n]);
        return new i();
      }),
    Date.now ||
      (Date.now = function () {
        return new Date().getTime();
      }),
    window.console || (window.console = {});
  for (
    var O,
      T,
      V,
      R,
      P = ["error", "info", "log", "show", "table", "trace", "warn"],
      D = function (t) {},
      F = P.length;
    --F > -1;

  )
    (k = P[F]), window.console[k] || (window.console[k] = D);
  if (window.atob)
    try {
      window.atob(" ");
    } catch (Is) {
      window.atob = (function (t) {
        var e = function (e) {
          return t(String(e).replace(/[\t\n\f\r ]+/g, ""));
        };
        return (e.original = t), e;
      })(window.atob);
    }
  else {
    var $ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      I =
        /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    window.atob = function (t) {
      if (((t = String(t).replace(/[\t\n\f\r ]+/g, "")), !I.test(t)))
        throw new TypeError(
          "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
        );
      var e, i, n;
      t += "==".slice(2 - (3 & t.length));
      for (var o = "", s = 0; s < t.length; )
        (e =
          ($.indexOf(t.charAt(s++)) << 18) |
          ($.indexOf(t.charAt(s++)) << 12) |
          ((i = $.indexOf(t.charAt(s++))) << 6) |
          (n = $.indexOf(t.charAt(s++)))),
          (o +=
            64 === i
              ? String.fromCharCode((e >> 16) & 255)
              : 64 === n
              ? String.fromCharCode((e >> 16) & 255, (e >> 8) & 255)
              : String.fromCharCode((e >> 16) & 255, (e >> 8) & 255, 255 & e));
      return o;
    };
  }
  if (
    (Event.prototype.preventDefault ||
      (Event.prototype.preventDefault = function () {
        this.returnValue = !1;
      }),
    Event.prototype.stopPropagation ||
      (Event.prototype.stopPropagation = function () {
        this.cancelBubble = !0;
      }),
    window.Prototype && Array.prototype.toJSON)
  ) {
    console.error(
      "[hCaptcha] Custom JSON polyfill detected, please remove to ensure hCaptcha works properly"
    );
    var j = Array.prototype.toJSON,
      N = JSON.stringify;
    JSON.stringify = function (t) {
      try {
        return delete Array.prototype.toJSON, N(t);
      } finally {
        Array.prototype.toJSON = j;
      }
    };
  }
  Object.keys ||
    (Object.keys =
      ((O = Object.prototype.hasOwnProperty),
      (T = !Object.prototype.propertyIsEnumerable.call(
        { toString: null },
        "toString"
      )),
      (R = (V = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor",
      ]).length),
      function (t) {
        if ("function" != typeof t && ("object" != typeof t || null === t))
          throw new TypeError("Object.keys called on non-object");
        var e,
          i,
          n = [];
        for (e in t) O.call(t, e) && n.push(e);
        if (T) for (i = 0; i < R; i++) O.call(t, V[i]) && n.push(V[i]);
        return n;
      })),
    /*! Raven.js 3.27.2 (6d91db933) | github.com/getsentry/raven-js */ (function (
      t
    ) {
      if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = t();
      else if ("function" == typeof define && define.amd) define("raven-js", t);
      else {
        ("undefined" != typeof window
          ? window
          : "undefined" != typeof global
          ? global
          : "undefined" != typeof self
          ? self
          : this
        ).Raven = t();
      }
    })(function () {
      return (function t(e, i, n) {
        function o(r, a) {
          if (!i[r]) {
            if (!e[r]) {
              var l = "function" == typeof require && require;
              if (!a && l) return l(r, !0);
              if (s) return s(r, !0);
              var c = new Error("Cannot find module '" + r + "'");
              throw ((c.code = "MODULE_NOT_FOUND"), c);
            }
            var h = (i[r] = { exports: {} });
            e[r][0].call(
              h.exports,
              function (t) {
                var i = e[r][1][t];
                return o(i || t);
              },
              h,
              h.exports,
              t,
              e,
              i,
              n
            );
          }
          return i[r].exports;
        }
        for (
          var s = "function" == typeof require && require, r = 0;
          r < n.length;
          r++
        )
          o(n[r]);
        return o;
      })(
        {
          1: [
            function (t, e, i) {
              function n(t) {
                (this.name = "RavenConfigError"), (this.message = t);
              }
              (n.prototype = new Error()),
                (n.prototype.constructor = n),
                (e.exports = n);
            },
            {},
          ],
          2: [
            function (t, e, i) {
              var n = t(5);
              e.exports = {
                wrapMethod: function (t, e, i) {
                  var o = t[e],
                    s = t;
                  if (e in t) {
                    var r = "warn" === e ? "warning" : e;
                    t[e] = function () {
                      var t = [].slice.call(arguments),
                        a = n.safeJoin(t, " "),
                        l = {
                          level: r,
                          logger: "console",
                          extra: { arguments: t },
                        };
                      "assert" === e
                        ? !1 === t[0] &&
                          ((a =
                            "Assertion failed: " +
                            (n.safeJoin(t.slice(1), " ") || "console.assert")),
                          (l.extra.arguments = t.slice(1)),
                          i && i(a, l))
                        : i && i(a, l),
                        o && Function.prototype.apply.call(o, s, t);
                    };
                  }
                },
              };
            },
            { 5: 5 },
          ],
          3: [
            function (t, e, i) {
              (function (i) {
                function n() {
                  return +new Date();
                }
                function o(t, e) {
                  return v(e)
                    ? function (i) {
                        return e(i, t);
                      }
                    : e;
                }
                function s() {
                  for (var t in ((this.a = !(
                    "object" != typeof JSON || !JSON.stringify
                  )),
                  (this.b = !g(Z)),
                  (this.c = !g(U)),
                  (this.d = null),
                  (this.e = null),
                  (this.f = null),
                  (this.g = null),
                  (this.h = null),
                  (this.i = null),
                  (this.j = {}),
                  (this.k = {
                    release: z.SENTRY_RELEASE && z.SENTRY_RELEASE.id,
                    logger: "javascript",
                    ignoreErrors: [],
                    ignoreUrls: [],
                    whitelistUrls: [],
                    includePaths: [],
                    headers: null,
                    collectWindowErrors: !0,
                    captureUnhandledRejections: !0,
                    maxMessageLength: 0,
                    maxUrlLength: 250,
                    stackTraceLimit: 50,
                    autoBreadcrumbs: !0,
                    instrument: !0,
                    sampleRate: 1,
                    sanitizeKeys: [],
                  }),
                  (this.l = {
                    method: "POST",
                    referrerPolicy: P() ? "origin" : "",
                  }),
                  (this.m = 0),
                  (this.n = !1),
                  (this.o = Error.stackTraceLimit),
                  (this.p = z.console || {}),
                  (this.q = {}),
                  (this.r = []),
                  (this.s = n()),
                  (this.t = []),
                  (this.u = []),
                  (this.v = null),
                  (this.w = z.location),
                  (this.x = this.w && this.w.href),
                  this.y(),
                  this.p))
                    this.q[t] = this.p[t];
                }
                var r = t(6),
                  a = t(7),
                  l = t(8),
                  c = t(1),
                  h = t(5),
                  u = h.isErrorEvent,
                  d = h.isDOMError,
                  p = h.isDOMException,
                  f = h.isError,
                  m = h.isObject,
                  y = h.isPlainObject,
                  g = h.isUndefined,
                  v = h.isFunction,
                  b = h.isString,
                  w = h.isArray,
                  x = h.isEmptyObject,
                  C = h.each,
                  k = h.objectMerge,
                  _ = h.truncate,
                  E = h.objectFrozen,
                  S = h.hasKey,
                  A = h.joinRegExp,
                  L = h.urlencode,
                  B = h.uuid4,
                  H = h.htmlTreeAsString,
                  M = h.isSameException,
                  O = h.isSameStacktrace,
                  T = h.parseUrl,
                  V = h.fill,
                  R = h.supportsFetch,
                  P = h.supportsReferrerPolicy,
                  D = h.serializeKeysForMessage,
                  F = h.serializeException,
                  $ = h.sanitize,
                  I = t(2).wrapMethod,
                  j = "source protocol user pass host port path".split(" "),
                  N =
                    /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/,
                  z =
                    "undefined" != typeof window
                      ? window
                      : void 0 !== i
                      ? i
                      : "undefined" != typeof self
                      ? self
                      : {},
                  Z = z.document,
                  U = z.navigator;
                (s.prototype = {
                  VERSION: "3.27.2",
                  debug: !1,
                  TraceKit: r,
                  config: function (t, e) {
                    var i = this;
                    if (i.g)
                      return (
                        this.z(
                          "error",
                          "Error: Raven has already been configured"
                        ),
                        i
                      );
                    if (!t) return i;
                    var n = i.k;
                    e &&
                      C(e, function (t, e) {
                        "tags" === t || "extra" === t || "user" === t
                          ? (i.j[t] = e)
                          : (n[t] = e);
                      }),
                      i.setDSN(t),
                      n.ignoreErrors.push(/^Script error\.?$/),
                      n.ignoreErrors.push(
                        /^Javascript error: Script error\.? on line 0$/
                      ),
                      (n.ignoreErrors = A(n.ignoreErrors)),
                      (n.ignoreUrls = !!n.ignoreUrls.length && A(n.ignoreUrls)),
                      (n.whitelistUrls =
                        !!n.whitelistUrls.length && A(n.whitelistUrls)),
                      (n.includePaths = A(n.includePaths)),
                      (n.maxBreadcrumbs = Math.max(
                        0,
                        Math.min(n.maxBreadcrumbs || 100, 100)
                      ));
                    var o = {
                        xhr: !0,
                        console: !0,
                        dom: !0,
                        location: !0,
                        sentry: !0,
                      },
                      s = n.autoBreadcrumbs;
                    "[object Object]" === {}.toString.call(s)
                      ? (s = k(o, s))
                      : !1 !== s && (s = o),
                      (n.autoBreadcrumbs = s);
                    var a = { tryCatch: !0 },
                      l = n.instrument;
                    return (
                      "[object Object]" === {}.toString.call(l)
                        ? (l = k(a, l))
                        : !1 !== l && (l = a),
                      (n.instrument = l),
                      (r.collectWindowErrors = !!n.collectWindowErrors),
                      i
                    );
                  },
                  install: function () {
                    var t = this;
                    return (
                      t.isSetup() &&
                        !t.n &&
                        (r.report.subscribe(function () {
                          t.A.apply(t, arguments);
                        }),
                        t.k.captureUnhandledRejections && t.B(),
                        t.C(),
                        t.k.instrument && t.k.instrument.tryCatch && t.D(),
                        t.k.autoBreadcrumbs && t.E(),
                        t.F(),
                        (t.n = !0)),
                      (Error.stackTraceLimit = t.k.stackTraceLimit),
                      this
                    );
                  },
                  setDSN: function (t) {
                    var e = this,
                      i = e.G(t),
                      n = i.path.lastIndexOf("/"),
                      o = i.path.substr(1, n);
                    (e.H = t),
                      (e.h = i.user),
                      (e.I = i.pass && i.pass.substr(1)),
                      (e.i = i.path.substr(n + 1)),
                      (e.g = e.J(i)),
                      (e.K = e.g + "/" + o + "api/" + e.i + "/store/"),
                      this.y();
                  },
                  context: function (t, e, i) {
                    return (
                      v(t) && ((i = e || []), (e = t), (t = {})),
                      this.wrap(t, e).apply(this, i)
                    );
                  },
                  wrap: function (t, e, i) {
                    function n() {
                      var n = [],
                        s = arguments.length,
                        r = !t || (t && !1 !== t.deep);
                      for (i && v(i) && i.apply(this, arguments); s--; )
                        n[s] = r ? o.wrap(t, arguments[s]) : arguments[s];
                      try {
                        return e.apply(this, n);
                      } catch (a) {
                        throw (o.L(), o.captureException(a, t), a);
                      }
                    }
                    var o = this;
                    if (g(e) && !v(t)) return t;
                    if ((v(t) && ((e = t), (t = void 0)), !v(e))) return e;
                    try {
                      if (e.M) return e;
                      if (e.N) return e.N;
                    } catch (s) {
                      return e;
                    }
                    for (var r in e) S(e, r) && (n[r] = e[r]);
                    return (
                      (n.prototype = e.prototype),
                      (e.N = n),
                      (n.M = !0),
                      (n.O = e),
                      n
                    );
                  },
                  uninstall: function () {
                    return (
                      r.report.uninstall(),
                      this.P(),
                      this.Q(),
                      this.R(),
                      this.S(),
                      (Error.stackTraceLimit = this.o),
                      (this.n = !1),
                      this
                    );
                  },
                  T: function (t) {
                    this.z(
                      "debug",
                      "Raven caught unhandled promise rejection:",
                      t
                    ),
                      this.captureException(t.reason, {
                        mechanism: {
                          type: "onunhandledrejection",
                          handled: !1,
                        },
                      });
                  },
                  B: function () {
                    return (
                      (this.T = this.T.bind(this)),
                      z.addEventListener &&
                        z.addEventListener("unhandledrejection", this.T),
                      this
                    );
                  },
                  P: function () {
                    return (
                      z.removeEventListener &&
                        z.removeEventListener("unhandledrejection", this.T),
                      this
                    );
                  },
                  captureException: function (t, e) {
                    if (
                      ((e = k({ trimHeadFrames: 0 }, e || {})), u(t) && t.error)
                    )
                      t = t.error;
                    else {
                      if (d(t) || p(t)) {
                        var i = t.name || (d(t) ? "DOMError" : "DOMException"),
                          n = t.message ? i + ": " + t.message : i;
                        return this.captureMessage(
                          n,
                          k(e, {
                            stacktrace: !0,
                            trimHeadFrames: e.trimHeadFrames + 1,
                          })
                        );
                      }
                      if (f(t));
                      else {
                        if (!y(t))
                          return this.captureMessage(
                            t,
                            k(e, {
                              stacktrace: !0,
                              trimHeadFrames: e.trimHeadFrames + 1,
                            })
                          );
                        (e = this.U(e, t)), (t = new Error(e.message));
                      }
                    }
                    this.d = t;
                    try {
                      var o = r.computeStackTrace(t);
                      this.V(o, e);
                    } catch (s) {
                      if (t !== s) throw s;
                    }
                    return this;
                  },
                  U: function (t, e) {
                    var i = Object.keys(e).sort(),
                      n = k(t, {
                        message:
                          "Non-Error exception captured with keys: " + D(i),
                        fingerprint: [l(i)],
                        extra: t.extra || {},
                      });
                    return (n.extra.W = F(e)), n;
                  },
                  captureMessage: function (t, e) {
                    if (
                      !this.k.ignoreErrors.test ||
                      !this.k.ignoreErrors.test(t)
                    ) {
                      var i,
                        n = k({ message: (t += "") }, (e = e || {}));
                      try {
                        throw new Error(t);
                      } catch (o) {
                        i = o;
                      }
                      i.name = null;
                      var s = r.computeStackTrace(i),
                        a = w(s.stack) && s.stack[1];
                      a &&
                        "Raven.captureException" === a.func &&
                        (a = s.stack[2]);
                      var l = (a && a.url) || "";
                      if (
                        (!this.k.ignoreUrls.test ||
                          !this.k.ignoreUrls.test(l)) &&
                        (!this.k.whitelistUrls.test ||
                          this.k.whitelistUrls.test(l))
                      ) {
                        if (
                          this.k.stacktrace ||
                          e.stacktrace ||
                          "" === n.message
                        ) {
                          (n.fingerprint =
                            null == n.fingerprint ? t : n.fingerprint),
                            ((e = k(
                              { trimHeadFrames: 0 },
                              e
                            )).trimHeadFrames += 1);
                          var c = this.X(s, e);
                          n.stacktrace = { frames: c.reverse() };
                        }
                        return (
                          n.fingerprint &&
                            (n.fingerprint = w(n.fingerprint)
                              ? n.fingerprint
                              : [n.fingerprint]),
                          this.Y(n),
                          this
                        );
                      }
                    }
                  },
                  captureBreadcrumb: function (t) {
                    var e = k({ timestamp: n() / 1e3 }, t);
                    if (v(this.k.breadcrumbCallback)) {
                      var i = this.k.breadcrumbCallback(e);
                      if (m(i) && !x(i)) e = i;
                      else if (!1 === i) return this;
                    }
                    return (
                      this.u.push(e),
                      this.u.length > this.k.maxBreadcrumbs && this.u.shift(),
                      this
                    );
                  },
                  addPlugin: function (t) {
                    var e = [].slice.call(arguments, 1);
                    return this.r.push([t, e]), this.n && this.F(), this;
                  },
                  setUserContext: function (t) {
                    return (this.j.user = t), this;
                  },
                  setExtraContext: function (t) {
                    return this.Z("extra", t), this;
                  },
                  setTagsContext: function (t) {
                    return this.Z("tags", t), this;
                  },
                  clearContext: function () {
                    return (this.j = {}), this;
                  },
                  getContext: function () {
                    return JSON.parse(a(this.j));
                  },
                  setEnvironment: function (t) {
                    return (this.k.environment = t), this;
                  },
                  setRelease: function (t) {
                    return (this.k.release = t), this;
                  },
                  setDataCallback: function (t) {
                    var e = this.k.dataCallback;
                    return (this.k.dataCallback = o(e, t)), this;
                  },
                  setBreadcrumbCallback: function (t) {
                    var e = this.k.breadcrumbCallback;
                    return (this.k.breadcrumbCallback = o(e, t)), this;
                  },
                  setShouldSendCallback: function (t) {
                    var e = this.k.shouldSendCallback;
                    return (this.k.shouldSendCallback = o(e, t)), this;
                  },
                  setTransport: function (t) {
                    return (this.k.transport = t), this;
                  },
                  lastException: function () {
                    return this.d;
                  },
                  lastEventId: function () {
                    return this.f;
                  },
                  isSetup: function () {
                    return !(
                      !this.a ||
                      (!this.g &&
                        (this.ravenNotConfiguredError ||
                          ((this.ravenNotConfiguredError = !0),
                          this.z(
                            "error",
                            "Error: Raven has not been configured."
                          )),
                        1))
                    );
                  },
                  afterLoad: function () {
                    var t = z.RavenConfig;
                    t && this.config(t.dsn, t.config).install();
                  },
                  showReportDialog: function (t) {
                    if (Z) {
                      if (
                        !(t = k(
                          {
                            eventId: this.lastEventId(),
                            dsn: this.H,
                            user: this.j.user || {},
                          },
                          t
                        )).eventId
                      )
                        throw new c("Missing eventId");
                      if (!t.dsn) throw new c("Missing DSN");
                      var e = encodeURIComponent,
                        i = [];
                      for (var n in t)
                        if ("user" === n) {
                          var o = t.user;
                          o.name && i.push("name=" + e(o.name)),
                            o.email && i.push("email=" + e(o.email));
                        } else i.push(e(n) + "=" + e(t[n]));
                      var s = this.J(this.G(t.dsn)),
                        r = Z.createElement("script");
                      (r.async = !0),
                        (r.src = s + "/api/embed/error-page/?" + i.join("&")),
                        (Z.head || Z.body).appendChild(r);
                    }
                  },
                  L: function () {
                    var t = this;
                    (this.m += 1),
                      setTimeout(function () {
                        t.m -= 1;
                      });
                  },
                  $: function (t, e) {
                    var i, n;
                    if (this.b) {
                      for (n in ((e = e || {}),
                      (t =
                        "raven" + t.substr(0, 1).toUpperCase() + t.substr(1)),
                      Z.createEvent
                        ? (i = Z.createEvent("HTMLEvents")).initEvent(t, !0, !0)
                        : ((i = Z.createEventObject()).eventType = t),
                      e))
                        S(e, n) && (i[n] = e[n]);
                      if (Z.createEvent) Z.dispatchEvent(i);
                      else
                        try {
                          Z.fireEvent("on" + i.eventType.toLowerCase(), i);
                        } catch (o) {}
                    }
                  },
                  _: function (t) {
                    var e = this;
                    return function (i) {
                      if (((e.aa = null), e.v !== i)) {
                        var n;
                        e.v = i;
                        try {
                          n = H(i.target);
                        } catch (o) {
                          n = "<unknown>";
                        }
                        e.captureBreadcrumb({
                          category: "ui." + t,
                          message: n,
                        });
                      }
                    };
                  },
                  ba: function () {
                    var t = this;
                    return function (e) {
                      var i;
                      try {
                        i = e.target;
                      } catch (o) {
                        return;
                      }
                      var n = i && i.tagName;
                      if (
                        n &&
                        ("INPUT" === n ||
                          "TEXTAREA" === n ||
                          i.isContentEditable)
                      ) {
                        var s = t.aa;
                        s || t._("input")(e),
                          clearTimeout(s),
                          (t.aa = setTimeout(function () {
                            t.aa = null;
                          }, 1e3));
                      }
                    };
                  },
                  ca: function (t, e) {
                    var i = T(this.w.href),
                      n = T(e),
                      o = T(t);
                    (this.x = e),
                      i.protocol === n.protocol &&
                        i.host === n.host &&
                        (e = n.relative),
                      i.protocol === o.protocol &&
                        i.host === o.host &&
                        (t = o.relative),
                      this.captureBreadcrumb({
                        category: "navigation",
                        data: { to: e, from: t },
                      });
                  },
                  C: function () {
                    var t = this;
                    (t.da = Function.prototype.toString),
                      (Function.prototype.toString = function () {
                        return "function" == typeof this && this.M
                          ? t.da.apply(this.O, arguments)
                          : t.da.apply(this, arguments);
                      });
                  },
                  Q: function () {
                    this.da && (Function.prototype.toString = this.da);
                  },
                  D: function () {
                    function t(t) {
                      return function (e, n) {
                        for (
                          var o = new Array(arguments.length), s = 0;
                          s < o.length;
                          ++s
                        )
                          o[s] = arguments[s];
                        var r = o[0];
                        return (
                          v(r) &&
                            (o[0] = i.wrap(
                              {
                                mechanism: {
                                  type: "instrument",
                                  data: { function: t.name || "<anonymous>" },
                                },
                              },
                              r
                            )),
                          t.apply ? t.apply(this, o) : t(o[0], o[1])
                        );
                      };
                    }
                    function e(t) {
                      var e = z[t] && z[t].prototype;
                      e &&
                        e.hasOwnProperty &&
                        e.hasOwnProperty("addEventListener") &&
                        (V(
                          e,
                          "addEventListener",
                          function (e) {
                            return function (n, s, r, a) {
                              try {
                                s &&
                                  s.handleEvent &&
                                  (s.handleEvent = i.wrap(
                                    {
                                      mechanism: {
                                        type: "instrument",
                                        data: {
                                          target: t,
                                          function: "handleEvent",
                                          handler:
                                            (s && s.name) || "<anonymous>",
                                        },
                                      },
                                    },
                                    s.handleEvent
                                  ));
                              } catch (l) {}
                              var c, h, u;
                              return (
                                o &&
                                  o.dom &&
                                  ("EventTarget" === t || "Node" === t) &&
                                  ((h = i._("click")),
                                  (u = i.ba()),
                                  (c = function (t) {
                                    if (t) {
                                      var e;
                                      try {
                                        e = t.type;
                                      } catch (i) {
                                        return;
                                      }
                                      return "click" === e
                                        ? h(t)
                                        : "keypress" === e
                                        ? u(t)
                                        : void 0;
                                    }
                                  })),
                                e.call(
                                  this,
                                  n,
                                  i.wrap(
                                    {
                                      mechanism: {
                                        type: "instrument",
                                        data: {
                                          target: t,
                                          function: "addEventListener",
                                          handler:
                                            (s && s.name) || "<anonymous>",
                                        },
                                      },
                                    },
                                    s,
                                    c
                                  ),
                                  r,
                                  a
                                )
                              );
                            };
                          },
                          n
                        ),
                        V(
                          e,
                          "removeEventListener",
                          function (t) {
                            return function (e, i, n, o) {
                              try {
                                i = i && (i.N ? i.N : i);
                              } catch (s) {}
                              return t.call(this, e, i, n, o);
                            };
                          },
                          n
                        ));
                    }
                    var i = this,
                      n = i.t,
                      o = this.k.autoBreadcrumbs;
                    V(z, "setTimeout", t, n),
                      V(z, "setInterval", t, n),
                      z.requestAnimationFrame &&
                        V(
                          z,
                          "requestAnimationFrame",
                          function (t) {
                            return function (e) {
                              return t(
                                i.wrap(
                                  {
                                    mechanism: {
                                      type: "instrument",
                                      data: {
                                        function: "requestAnimationFrame",
                                        handler: (t && t.name) || "<anonymous>",
                                      },
                                    },
                                  },
                                  e
                                )
                              );
                            };
                          },
                          n
                        );
                    for (
                      var s = [
                          "EventTarget",
                          "Window",
                          "Node",
                          "ApplicationCache",
                          "AudioTrackList",
                          "ChannelMergerNode",
                          "CryptoOperation",
                          "EventSource",
                          "FileReader",
                          "HTMLUnknownElement",
                          "IDBDatabase",
                          "IDBRequest",
                          "IDBTransaction",
                          "KeyOperation",
                          "MediaController",
                          "MessagePort",
                          "ModalWindow",
                          "Notification",
                          "SVGElementInstance",
                          "Screen",
                          "TextTrack",
                          "TextTrackCue",
                          "TextTrackList",
                          "WebSocket",
                          "WebSocketWorker",
                          "Worker",
                          "XMLHttpRequest",
                          "XMLHttpRequestEventTarget",
                          "XMLHttpRequestUpload",
                        ],
                        r = 0;
                      r < s.length;
                      r++
                    )
                      e(s[r]);
                  },
                  E: function () {
                    function t(t, i) {
                      t in i &&
                        v(i[t]) &&
                        V(i, t, function (i) {
                          return e.wrap(
                            {
                              mechanism: {
                                type: "instrument",
                                data: {
                                  function: t,
                                  handler: (i && i.name) || "<anonymous>",
                                },
                              },
                            },
                            i
                          );
                        });
                    }
                    var e = this,
                      i = this.k.autoBreadcrumbs,
                      n = e.t;
                    if (i.xhr && "XMLHttpRequest" in z) {
                      var o = z.XMLHttpRequest && z.XMLHttpRequest.prototype;
                      V(
                        o,
                        "open",
                        function (t) {
                          return function (i, n) {
                            return (
                              b(n) &&
                                -1 === n.indexOf(e.h) &&
                                (this.ea = {
                                  method: i,
                                  url: n,
                                  status_code: null,
                                }),
                              t.apply(this, arguments)
                            );
                          };
                        },
                        n
                      ),
                        V(
                          o,
                          "send",
                          function (i) {
                            return function () {
                              function n() {
                                if (o.ea && 4 === o.readyState) {
                                  try {
                                    o.ea.status_code = o.status;
                                  } catch (t) {}
                                  e.captureBreadcrumb({
                                    type: "http",
                                    category: "xhr",
                                    data: o.ea,
                                  });
                                }
                              }
                              for (
                                var o = this,
                                  s = ["onload", "onerror", "onprogress"],
                                  r = 0;
                                r < s.length;
                                r++
                              )
                                t(s[r], o);
                              return (
                                "onreadystatechange" in o &&
                                v(o.onreadystatechange)
                                  ? V(o, "onreadystatechange", function (t) {
                                      return e.wrap(
                                        {
                                          mechanism: {
                                            type: "instrument",
                                            data: {
                                              function: "onreadystatechange",
                                              handler:
                                                (t && t.name) || "<anonymous>",
                                            },
                                          },
                                        },
                                        t,
                                        n
                                      );
                                    })
                                  : (o.onreadystatechange = n),
                                i.apply(this, arguments)
                              );
                            };
                          },
                          n
                        );
                    }
                    i.xhr &&
                      R() &&
                      V(
                        z,
                        "fetch",
                        function (t) {
                          return function () {
                            for (
                              var i = new Array(arguments.length), n = 0;
                              n < i.length;
                              ++n
                            )
                              i[n] = arguments[n];
                            var o,
                              s = i[0],
                              r = "GET";
                            if (
                              ("string" == typeof s
                                ? (o = s)
                                : "Request" in z && s instanceof z.Request
                                ? ((o = s.url), s.method && (r = s.method))
                                : (o = "" + s),
                              -1 !== o.indexOf(e.h))
                            )
                              return t.apply(this, i);
                            i[1] && i[1].method && (r = i[1].method);
                            var a = { method: r, url: o, status_code: null };
                            return t
                              .apply(this, i)
                              .then(function (t) {
                                return (
                                  (a.status_code = t.status),
                                  e.captureBreadcrumb({
                                    type: "http",
                                    category: "fetch",
                                    data: a,
                                  }),
                                  t
                                );
                              })
                              ["catch"](function (t) {
                                throw (
                                  (e.captureBreadcrumb({
                                    type: "http",
                                    category: "fetch",
                                    data: a,
                                    level: "error",
                                  }),
                                  t)
                                );
                              });
                          };
                        },
                        n
                      ),
                      i.dom &&
                        this.b &&
                        (Z.addEventListener
                          ? (Z.addEventListener("click", e._("click"), !1),
                            Z.addEventListener("keypress", e.ba(), !1))
                          : Z.attachEvent &&
                            (Z.attachEvent("onclick", e._("click")),
                            Z.attachEvent("onkeypress", e.ba())));
                    var s = z.chrome,
                      r =
                        !(s && s.app && s.app.runtime) &&
                        z.history &&
                        z.history.pushState &&
                        z.history.replaceState;
                    if (i.location && r) {
                      var a = z.onpopstate;
                      z.onpopstate = function () {
                        var t = e.w.href;
                        if ((e.ca(e.x, t), a)) return a.apply(this, arguments);
                      };
                      var l = function (t) {
                        return function () {
                          var i = arguments.length > 2 ? arguments[2] : void 0;
                          return (
                            i && e.ca(e.x, i + ""), t.apply(this, arguments)
                          );
                        };
                      };
                      V(z.history, "pushState", l, n),
                        V(z.history, "replaceState", l, n);
                    }
                    if (i.console && "console" in z && console.log) {
                      var c = function (t, i) {
                        e.captureBreadcrumb({
                          message: t,
                          level: i.level,
                          category: "console",
                        });
                      };
                      C(
                        ["debug", "info", "warn", "error", "log"],
                        function (t, e) {
                          I(console, e, c);
                        }
                      );
                    }
                  },
                  R: function () {
                    for (var t; this.t.length; ) {
                      var e = (t = this.t.shift())[0],
                        i = t[1],
                        n = t[2];
                      e[i] = n;
                    }
                  },
                  S: function () {
                    for (var t in this.q) this.p[t] = this.q[t];
                  },
                  F: function () {
                    var t = this;
                    C(this.r, function (e, i) {
                      var n = i[0],
                        o = i[1];
                      n.apply(t, [t].concat(o));
                    });
                  },
                  G: function (t) {
                    var e = N.exec(t),
                      i = {},
                      n = 7;
                    try {
                      for (; n--; ) i[j[n]] = e[n] || "";
                    } catch (o) {
                      throw new c("Invalid DSN: " + t);
                    }
                    if (i.pass && !this.k.allowSecretKey)
                      throw new c(
                        "Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key"
                      );
                    return i;
                  },
                  J: function (t) {
                    var e = "//" + t.host + (t.port ? ":" + t.port : "");
                    return t.protocol && (e = t.protocol + ":" + e), e;
                  },
                  A: function (t, e) {
                    ((e = e || {}).mechanism = e.mechanism || {
                      type: "onerror",
                      handled: !1,
                    }),
                      this.m || this.V(t, e);
                  },
                  V: function (t, e) {
                    var i = this.X(t, e);
                    this.$("handle", { stackInfo: t, options: e }),
                      this.fa(t.name, t.message, t.url, t.lineno, i, e);
                  },
                  X: function (t, e) {
                    var i = this,
                      n = [];
                    if (
                      t.stack &&
                      t.stack.length &&
                      (C(t.stack, function (e, o) {
                        var s = i.ga(o, t.url);
                        s && n.push(s);
                      }),
                      e && e.trimHeadFrames)
                    )
                      for (var o = 0; o < e.trimHeadFrames && o < n.length; o++)
                        n[o].in_app = !1;
                    return (n = n.slice(0, this.k.stackTraceLimit));
                  },
                  ga: function (t, e) {
                    var i = {
                      filename: t.url,
                      lineno: t.line,
                      colno: t.column,
                      function: t.func || "?",
                    };
                    return (
                      t.url || (i.filename = e),
                      (i.in_app = !(
                        (this.k.includePaths.test &&
                          !this.k.includePaths.test(i.filename)) ||
                        /(Raven|TraceKit)\./.test(i["function"]) ||
                        /raven\.(min\.)?js$/.test(i.filename)
                      )),
                      i
                    );
                  },
                  fa: function (t, e, i, n, o, s) {
                    var r,
                      a = (t ? t + ": " : "") + (e || "");
                    if (
                      (!this.k.ignoreErrors.test ||
                        (!this.k.ignoreErrors.test(e) &&
                          !this.k.ignoreErrors.test(a))) &&
                      (o && o.length
                        ? ((i = o[0].filename || i),
                          o.reverse(),
                          (r = { frames: o }))
                        : i &&
                          (r = {
                            frames: [{ filename: i, lineno: n, in_app: !0 }],
                          }),
                      (!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(i)) &&
                        (!this.k.whitelistUrls.test ||
                          this.k.whitelistUrls.test(i)))
                    ) {
                      var l = k(
                          {
                            exception: {
                              values: [{ type: t, value: e, stacktrace: r }],
                            },
                            transaction: i,
                          },
                          s
                        ),
                        c = l.exception.values[0];
                      null == c.type &&
                        "" === c.value &&
                        (c.value = "Unrecoverable error caught"),
                        !l.exception.mechanism &&
                          l.mechanism &&
                          ((l.exception.mechanism = l.mechanism),
                          delete l.mechanism),
                        (l.exception.mechanism = k(
                          { type: "generic", handled: !0 },
                          l.exception.mechanism || {}
                        )),
                        this.Y(l);
                    }
                  },
                  ha: function (t) {
                    var e = this.k.maxMessageLength;
                    if (
                      (t.message && (t.message = _(t.message, e)), t.exception)
                    ) {
                      var i = t.exception.values[0];
                      i.value = _(i.value, e);
                    }
                    var n = t.request;
                    return (
                      n &&
                        (n.url && (n.url = _(n.url, this.k.maxUrlLength)),
                        n.Referer &&
                          (n.Referer = _(n.Referer, this.k.maxUrlLength))),
                      t.breadcrumbs &&
                        t.breadcrumbs.values &&
                        this.ia(t.breadcrumbs),
                      t
                    );
                  },
                  ia: function (t) {
                    for (
                      var e, i, n, o = ["to", "from", "url"], s = 0;
                      s < t.values.length;
                      ++s
                    )
                      if (
                        (i = t.values[s]).hasOwnProperty("data") &&
                        m(i.data) &&
                        !E(i.data)
                      ) {
                        n = k({}, i.data);
                        for (var r = 0; r < o.length; ++r)
                          (e = o[r]),
                            n.hasOwnProperty(e) &&
                              n[e] &&
                              (n[e] = _(n[e], this.k.maxUrlLength));
                        t.values[s].data = n;
                      }
                  },
                  ja: function () {
                    if (this.c || this.b) {
                      var t = {};
                      return (
                        this.c &&
                          U.userAgent &&
                          (t.headers = { "User-Agent": U.userAgent }),
                        z.location &&
                          z.location.href &&
                          (t.url = z.location.href),
                        this.b &&
                          Z.referrer &&
                          (t.headers || (t.headers = {}),
                          (t.headers.Referer = Z.referrer)),
                        t
                      );
                    }
                  },
                  y: function () {
                    (this.ka = 0), (this.la = null);
                  },
                  ma: function () {
                    return this.ka && n() - this.la < this.ka;
                  },
                  na: function (t) {
                    var e = this.e;
                    return (
                      !(
                        !e ||
                        t.message !== e.message ||
                        t.transaction !== e.transaction
                      ) &&
                      (t.stacktrace || e.stacktrace
                        ? O(t.stacktrace, e.stacktrace)
                        : t.exception || e.exception
                        ? M(t.exception, e.exception)
                        : (!t.fingerprint && !e.fingerprint) ||
                          (Boolean(t.fingerprint && e.fingerprint) &&
                            JSON.stringify(t.fingerprint) ===
                              JSON.stringify(e.fingerprint)))
                    );
                  },
                  oa: function (t) {
                    if (!this.ma()) {
                      var e = t.status;
                      if (400 === e || 401 === e || 429 === e) {
                        var i;
                        try {
                          (i = R()
                            ? t.headers.get("Retry-After")
                            : t.getResponseHeader("Retry-After")),
                            (i = 1e3 * parseInt(i, 10));
                        } catch (o) {}
                        (this.ka = i || 2 * this.ka || 1e3), (this.la = n());
                      }
                    }
                  },
                  Y: function (t) {
                    var e = this.k,
                      i = {
                        project: this.i,
                        logger: e.logger,
                        platform: "javascript",
                      },
                      o = this.ja();
                    if (
                      (o && (i.request = o),
                      t.trimHeadFrames && delete t.trimHeadFrames,
                      ((t = k(i, t)).tags = k(k({}, this.j.tags), t.tags)),
                      (t.extra = k(k({}, this.j.extra), t.extra)),
                      (t.extra["session:duration"] = n() - this.s),
                      this.u &&
                        this.u.length > 0 &&
                        (t.breadcrumbs = { values: [].slice.call(this.u, 0) }),
                      this.j.user && (t.user = this.j.user),
                      e.environment && (t.environment = e.environment),
                      e.release && (t.release = e.release),
                      e.serverName && (t.server_name = e.serverName),
                      (t = this.pa(t)),
                      Object.keys(t).forEach(function (e) {
                        (null == t[e] || "" === t[e] || x(t[e])) && delete t[e];
                      }),
                      v(e.dataCallback) && (t = e.dataCallback(t) || t),
                      t &&
                        !x(t) &&
                        (!v(e.shouldSendCallback) || e.shouldSendCallback(t)))
                    )
                      return this.ma()
                        ? void this.z(
                            "warn",
                            "Raven dropped error due to backoff: ",
                            t
                          )
                        : void ("number" == typeof e.sampleRate
                            ? Math.random() < e.sampleRate && this.qa(t)
                            : this.qa(t));
                  },
                  pa: function (t) {
                    return $(t, this.k.sanitizeKeys);
                  },
                  ra: function () {
                    return B();
                  },
                  qa: function (t, e) {
                    var i = this,
                      n = this.k;
                    if (this.isSetup()) {
                      if (
                        ((t = this.ha(t)),
                        !this.k.allowDuplicates && this.na(t))
                      )
                        return void this.z(
                          "warn",
                          "Raven dropped repeat event: ",
                          t
                        );
                      (this.f = t.event_id || (t.event_id = this.ra())),
                        (this.e = t),
                        this.z("debug", "Raven about to send:", t);
                      var o = {
                        sentry_version: "7",
                        sentry_client: "raven-js/" + this.VERSION,
                        sentry_key: this.h,
                      };
                      this.I && (o.sentry_secret = this.I);
                      var s = t.exception && t.exception.values[0];
                      this.k.autoBreadcrumbs &&
                        this.k.autoBreadcrumbs.sentry &&
                        this.captureBreadcrumb({
                          category: "sentry",
                          message: s
                            ? (s.type ? s.type + ": " : "") + s.value
                            : t.message,
                          event_id: t.event_id,
                          level: t.level || "error",
                        });
                      var r = this.K;
                      (n.transport || this._makeRequest).call(this, {
                        url: r,
                        auth: o,
                        data: t,
                        options: n,
                        onSuccess: function () {
                          i.y(), i.$("success", { data: t, src: r }), e && e();
                        },
                        onError: function (n) {
                          i.z("error", "Raven transport failed to send: ", n),
                            n.request && i.oa(n.request),
                            i.$("failure", { data: t, src: r }),
                            (n =
                              n ||
                              new Error(
                                "Raven send failed (no additional details provided)"
                              )),
                            e && e(n);
                        },
                      });
                    }
                  },
                  _makeRequest: function (t) {
                    var e = t.url + "?" + L(t.auth),
                      i = null,
                      n = {};
                    if (
                      (t.options.headers && (i = this.sa(t.options.headers)),
                      t.options.fetchParameters &&
                        (n = this.sa(t.options.fetchParameters)),
                      R())
                    ) {
                      n.body = a(t.data);
                      var o = k({}, this.l),
                        s = k(o, n);
                      return (
                        i && (s.headers = i),
                        z
                          .fetch(e, s)
                          .then(function (e) {
                            if (e.ok) t.onSuccess && t.onSuccess();
                            else {
                              var i = new Error(
                                "Sentry error code: " + e.status
                              );
                              (i.request = e), t.onError && t.onError(i);
                            }
                          })
                          ["catch"](function () {
                            t.onError &&
                              t.onError(
                                new Error(
                                  "Sentry error code: network unavailable"
                                )
                              );
                          })
                      );
                    }
                    var r = z.XMLHttpRequest && new z.XMLHttpRequest();
                    r &&
                      ("withCredentials" in r ||
                        "undefined" != typeof XDomainRequest) &&
                      ("withCredentials" in r
                        ? (r.onreadystatechange = function () {
                            if (4 === r.readyState)
                              if (200 === r.status)
                                t.onSuccess && t.onSuccess();
                              else if (t.onError) {
                                var e = new Error(
                                  "Sentry error code: " + r.status
                                );
                                (e.request = r), t.onError(e);
                              }
                          })
                        : ((r = new XDomainRequest()),
                          (e = e.replace(/^https?:/, "")),
                          t.onSuccess && (r.onload = t.onSuccess),
                          t.onError &&
                            (r.onerror = function () {
                              var e = new Error(
                                "Sentry error code: XDomainRequest"
                              );
                              (e.request = r), t.onError(e);
                            })),
                      r.open("POST", e),
                      i &&
                        C(i, function (t, e) {
                          r.setRequestHeader(t, e);
                        }),
                      r.send(a(t.data)));
                  },
                  sa: function (t) {
                    var e = {};
                    for (var i in t)
                      if (t.hasOwnProperty(i)) {
                        var n = t[i];
                        e[i] = "function" == typeof n ? n() : n;
                      }
                    return e;
                  },
                  z: function (t) {
                    this.q[t] &&
                      (this.debug || this.k.debug) &&
                      Function.prototype.apply.call(
                        this.q[t],
                        this.p,
                        [].slice.call(arguments, 1)
                      );
                  },
                  Z: function (t, e) {
                    g(e)
                      ? delete this.j[t]
                      : (this.j[t] = k(this.j[t] || {}, e));
                  },
                }),
                  (s.prototype.setUser = s.prototype.setUserContext),
                  (s.prototype.setReleaseContext = s.prototype.setRelease),
                  (e.exports = s);
              }).call(
                this,
                "undefined" != typeof global
                  ? global
                  : "undefined" != typeof self
                  ? self
                  : "undefined" != typeof window
                  ? window
                  : {}
              );
            },
            { 1: 1, 2: 2, 5: 5, 6: 6, 7: 7, 8: 8 },
          ],
          4: [
            function (t, e, i) {
              (function (i) {
                var n = t(3),
                  o =
                    "undefined" != typeof window
                      ? window
                      : void 0 !== i
                      ? i
                      : "undefined" != typeof self
                      ? self
                      : {},
                  s = o.Raven,
                  r = new n();
                (r.noConflict = function () {
                  return (o.Raven = s), r;
                }),
                  r.afterLoad(),
                  (e.exports = r),
                  (e.exports.Client = n);
              }).call(
                this,
                "undefined" != typeof global
                  ? global
                  : "undefined" != typeof self
                  ? self
                  : "undefined" != typeof window
                  ? window
                  : {}
              );
            },
            { 3: 3 },
          ],
          5: [
            function (t, e, i) {
              (function (i) {
                function n(t) {
                  switch (Object.prototype.toString.call(t)) {
                    case "[object Error]":
                    case "[object Exception]":
                    case "[object DOMException]":
                      return !0;
                    default:
                      return t instanceof Error;
                  }
                }
                function o(t) {
                  return (
                    "[object DOMError]" === Object.prototype.toString.call(t)
                  );
                }
                function s(t) {
                  return void 0 === t;
                }
                function r(t) {
                  return (
                    "[object Object]" === Object.prototype.toString.call(t)
                  );
                }
                function a(t) {
                  return (
                    "[object String]" === Object.prototype.toString.call(t)
                  );
                }
                function l(t) {
                  return "[object Array]" === Object.prototype.toString.call(t);
                }
                function c() {
                  if (!("fetch" in x)) return !1;
                  try {
                    return new Headers(), new Request(""), new Response(), !0;
                  } catch (t) {
                    return !1;
                  }
                }
                function h(t, e) {
                  var i, n;
                  if (s(t.length))
                    for (i in t) d(t, i) && e.call(null, i, t[i]);
                  else if ((n = t.length))
                    for (i = 0; i < n; i++) e.call(null, i, t[i]);
                }
                function u(t, e) {
                  if ("number" != typeof e)
                    throw new Error(
                      "2nd argument to `truncate` function should be a number"
                    );
                  return "string" != typeof t || 0 === e || t.length <= e
                    ? t
                    : t.substr(0, e) + "â€¦";
                }
                function d(t, e) {
                  return Object.prototype.hasOwnProperty.call(t, e);
                }
                function p(t) {
                  for (var e, i = [], n = 0, o = t.length; n < o; n++)
                    a((e = t[n]))
                      ? i.push(e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"))
                      : e && e.source && i.push(e.source);
                  return new RegExp(i.join("|"), "i");
                }
                function f(t) {
                  var e,
                    i,
                    n,
                    o,
                    s,
                    r = [];
                  if (!t || !t.tagName) return "";
                  if (
                    (r.push(t.tagName.toLowerCase()),
                    t.id && r.push("#" + t.id),
                    (e = t.className) && a(e))
                  )
                    for (i = e.split(/\s+/), s = 0; s < i.length; s++)
                      r.push("." + i[s]);
                  var l = ["type", "name", "title", "alt"];
                  for (s = 0; s < l.length; s++)
                    (n = l[s]),
                      (o = t.getAttribute(n)) &&
                        r.push("[" + n + '="' + o + '"]');
                  return r.join("");
                }
                function m(t, e) {
                  return !!(!!t ^ !!e);
                }
                function y(t, e) {
                  if (m(t, e)) return !1;
                  var i = t.frames,
                    n = e.frames;
                  if (void 0 === i || void 0 === n) return !1;
                  if (i.length !== n.length) return !1;
                  for (var o, s, r = 0; r < i.length; r++)
                    if (
                      ((o = i[r]),
                      (s = n[r]),
                      o.filename !== s.filename ||
                        o.lineno !== s.lineno ||
                        o.colno !== s.colno ||
                        o["function"] !== s["function"])
                    )
                      return !1;
                  return !0;
                }
                function g(t) {
                  return (function (t) {
                    return ~-encodeURI(t).split(/%..|./).length;
                  })(JSON.stringify(t));
                }
                function v(t) {
                  if ("string" == typeof t) {
                    return u(t, 40);
                  }
                  if (
                    "number" == typeof t ||
                    "boolean" == typeof t ||
                    void 0 === t
                  )
                    return t;
                  var e = Object.prototype.toString.call(t);
                  return "[object Object]" === e
                    ? "[Object]"
                    : "[object Array]" === e
                    ? "[Array]"
                    : "[object Function]" === e
                    ? t.name
                      ? "[Function: " + t.name + "]"
                      : "[Function]"
                    : t;
                }
                function b(t, e) {
                  return 0 === e
                    ? v(t)
                    : r(t)
                    ? Object.keys(t).reduce(function (i, n) {
                        return (i[n] = b(t[n], e - 1)), i;
                      }, {})
                    : Array.isArray(t)
                    ? t.map(function (t) {
                        return b(t, e - 1);
                      })
                    : v(t);
                }
                var w = t(7),
                  x =
                    "undefined" != typeof window
                      ? window
                      : void 0 !== i
                      ? i
                      : "undefined" != typeof self
                      ? self
                      : {},
                  C = 3,
                  k = 51200,
                  _ = 40;
                e.exports = {
                  isObject: function (t) {
                    return "object" == typeof t && null !== t;
                  },
                  isError: n,
                  isErrorEvent: function (t) {
                    return (
                      "[object ErrorEvent]" ===
                      Object.prototype.toString.call(t)
                    );
                  },
                  isDOMError: o,
                  isDOMException: function (t) {
                    return (
                      "[object DOMException]" ===
                      Object.prototype.toString.call(t)
                    );
                  },
                  isUndefined: s,
                  isFunction: function (t) {
                    return "function" == typeof t;
                  },
                  isPlainObject: r,
                  isString: a,
                  isArray: l,
                  isEmptyObject: function (t) {
                    if (!r(t)) return !1;
                    for (var e in t) if (t.hasOwnProperty(e)) return !1;
                    return !0;
                  },
                  supportsErrorEvent: function () {
                    try {
                      return new ErrorEvent(""), !0;
                    } catch (t) {
                      return !1;
                    }
                  },
                  supportsDOMError: function () {
                    try {
                      return new DOMError(""), !0;
                    } catch (t) {
                      return !1;
                    }
                  },
                  supportsDOMException: function () {
                    try {
                      return new DOMException(""), !0;
                    } catch (t) {
                      return !1;
                    }
                  },
                  supportsFetch: c,
                  supportsReferrerPolicy: function () {
                    if (!c()) return !1;
                    try {
                      return (
                        new Request("pickleRick", { referrerPolicy: "origin" }),
                        !0
                      );
                    } catch (t) {
                      return !1;
                    }
                  },
                  supportsPromiseRejectionEvent: function () {
                    return "function" == typeof PromiseRejectionEvent;
                  },
                  wrappedCallback: function (t) {
                    return function (e, i) {
                      var n = t(e) || e;
                      return (i && i(n)) || n;
                    };
                  },
                  each: h,
                  objectMerge: function (t, e) {
                    return e
                      ? (h(e, function (e, i) {
                          t[e] = i;
                        }),
                        t)
                      : t;
                  },
                  truncate: u,
                  objectFrozen: function (t) {
                    return !!Object.isFrozen && Object.isFrozen(t);
                  },
                  hasKey: d,
                  joinRegExp: p,
                  urlencode: function (t) {
                    var e = [];
                    return (
                      h(t, function (t, i) {
                        e.push(
                          encodeURIComponent(t) + "=" + encodeURIComponent(i)
                        );
                      }),
                      e.join("&")
                    );
                  },
                  uuid4: function () {
                    var t = x.crypto || x.msCrypto;
                    if (!s(t) && t.getRandomValues) {
                      var e = new Uint16Array(8);
                      t.getRandomValues(e),
                        (e[3] = (4095 & e[3]) | 16384),
                        (e[4] = (16383 & e[4]) | 32768);
                      var i = function (t) {
                        for (var e = t.toString(16); e.length < 4; )
                          e = "0" + e;
                        return e;
                      };
                      return (
                        i(e[0]) +
                        i(e[1]) +
                        i(e[2]) +
                        i(e[3]) +
                        i(e[4]) +
                        i(e[5]) +
                        i(e[6]) +
                        i(e[7])
                      );
                    }
                    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
                      /[xy]/g,
                      function (t) {
                        var e = (16 * Math.random()) | 0;
                        return ("x" === t ? e : (3 & e) | 8).toString(16);
                      }
                    );
                  },
                  htmlTreeAsString: function (t) {
                    for (
                      var e, i = [], n = 0, o = 0, s = " > ".length;
                      t &&
                      n++ < 5 &&
                      !(
                        "html" === (e = f(t)) ||
                        (n > 1 && o + i.length * s + e.length >= 80)
                      );

                    )
                      i.push(e), (o += e.length), (t = t.parentNode);
                    return i.reverse().join(" > ");
                  },
                  htmlElementAsString: f,
                  isSameException: function (t, e) {
                    return (
                      !m(t, e) &&
                      ((t = t.values[0]),
                      (e = e.values[0]),
                      t.type === e.type &&
                        t.value === e.value &&
                        !(function (t, e) {
                          return s(t) && s(e);
                        })(t.stacktrace, e.stacktrace) &&
                        y(t.stacktrace, e.stacktrace))
                    );
                  },
                  isSameStacktrace: y,
                  parseUrl: function (t) {
                    if ("string" != typeof t) return {};
                    var e = t.match(
                        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
                      ),
                      i = e[6] || "",
                      n = e[8] || "";
                    return {
                      protocol: e[2],
                      host: e[4],
                      path: e[5],
                      relative: e[5] + i + n,
                    };
                  },
                  fill: function (t, e, i, n) {
                    if (null != t) {
                      var o = t[e];
                      (t[e] = i(o)),
                        (t[e].M = !0),
                        (t[e].O = o),
                        n && n.push([t, e, o]);
                    }
                  },
                  safeJoin: function (t, e) {
                    if (!l(t)) return "";
                    for (var i = [], o = 0; o < t.length; o++)
                      try {
                        i.push(String(t[o]));
                      } catch (n) {
                        i.push("[value cannot be serialized]");
                      }
                    return i.join(e);
                  },
                  serializeException: function E(t, e, i) {
                    if (!r(t)) return t;
                    i =
                      "number" != typeof (e = "number" != typeof e ? C : e)
                        ? k
                        : i;
                    var n = b(t, e);
                    return g(w(n)) > i ? E(t, e - 1) : n;
                  },
                  serializeKeysForMessage: function (t, e) {
                    if ("number" == typeof t || "string" == typeof t)
                      return t.toString();
                    if (!Array.isArray(t)) return "";
                    if (
                      0 ===
                      (t = t.filter(function (t) {
                        return "string" == typeof t;
                      })).length
                    )
                      return "[object has no keys]";
                    if (((e = "number" != typeof e ? _ : e), t[0].length >= e))
                      return t[0];
                    for (var i = t.length; i > 0; i--) {
                      var n = t.slice(0, i).join(", ");
                      if (!(n.length > e))
                        return i === t.length ? n : n + "â€¦";
                    }
                    return "";
                  },
                  sanitize: function (t, e) {
                    if (!l(e) || (l(e) && 0 === e.length)) return t;
                    var i,
                      n = p(e),
                      s = "********";
                    try {
                      i = JSON.parse(w(t));
                    } catch (o) {
                      return t;
                    }
                    return (function a(t) {
                      return l(t)
                        ? t.map(function (t) {
                            return a(t);
                          })
                        : r(t)
                        ? Object.keys(t).reduce(function (e, i) {
                            return (e[i] = n.test(i) ? s : a(t[i])), e;
                          }, {})
                        : t;
                    })(i);
                  },
                };
              }).call(
                this,
                "undefined" != typeof global
                  ? global
                  : "undefined" != typeof self
                  ? self
                  : "undefined" != typeof window
                  ? window
                  : {}
              );
            },
            { 7: 7 },
          ],
          6: [
            function (t, e, i) {
              (function (i) {
                function n() {
                  return "undefined" == typeof document ||
                    null == document.location
                    ? ""
                    : document.location.href;
                }
                var o = t(5),
                  s = { collectWindowErrors: !0, debug: !1 },
                  r =
                    "undefined" != typeof window
                      ? window
                      : void 0 !== i
                      ? i
                      : "undefined" != typeof self
                      ? self
                      : {},
                  a = [].slice,
                  l = "?",
                  c =
                    /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
                (s.report = (function () {
                  function t(e, i) {
                    var n = null;
                    if (!i || s.collectWindowErrors) {
                      for (var o in p)
                        if (p.hasOwnProperty(o))
                          try {
                            p[o].apply(null, [e].concat(a.call(arguments, 2)));
                          } catch (t) {
                            n = t;
                          }
                      if (n) throw n;
                    }
                  }
                  function e(e, r, a, h, d) {
                    var p = o.isErrorEvent(d) ? d.error : d,
                      f = o.isErrorEvent(e) ? e.message : e;
                    if (y)
                      s.computeStackTrace.augmentStackTraceWithInitialElement(
                        y,
                        r,
                        a,
                        f
                      ),
                        i();
                    else if (p && o.isError(p)) t(s.computeStackTrace(p), !0);
                    else {
                      var m,
                        g = { url: r, line: a, column: h },
                        v = void 0;
                      if ("[object String]" === {}.toString.call(f))
                        (m = f.match(c)) && ((v = m[1]), (f = m[2]));
                      (g.func = l),
                        t({ name: v, message: f, url: n(), stack: [g] }, !0);
                    }
                    return !!u && u.apply(this, arguments);
                  }
                  function i() {
                    var e = y,
                      i = f;
                    (f = null),
                      (y = null),
                      (m = null),
                      t.apply(null, [e, !1].concat(i));
                  }
                  function h(t, e) {
                    var n = a.call(arguments, 1);
                    if (y) {
                      if (m === t) return;
                      i();
                    }
                    var o = s.computeStackTrace(t);
                    if (
                      ((y = o),
                      (m = t),
                      (f = n),
                      setTimeout(
                        function () {
                          m === t && i();
                        },
                        o.incomplete ? 2e3 : 0
                      ),
                      !1 !== e)
                    )
                      throw t;
                  }
                  var u,
                    d,
                    p = [],
                    f = null,
                    m = null,
                    y = null;
                  return (
                    (h.subscribe = function (t) {
                      d || ((u = r.onerror), (r.onerror = e), (d = !0)),
                        p.push(t);
                    }),
                    (h.unsubscribe = function (t) {
                      for (var e = p.length - 1; e >= 0; --e)
                        p[e] === t && p.splice(e, 1);
                    }),
                    (h.uninstall = function () {
                      d && ((r.onerror = u), (d = !1), (u = void 0)), (p = []);
                    }),
                    h
                  );
                })()),
                  (s.computeStackTrace = (function () {
                    function t(t) {
                      if ("undefined" != typeof t.stack && t.stack) {
                        for (
                          var e,
                            i,
                            o,
                            s =
                              /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                            r =
                              /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                            a =
                              /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i,
                            c = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
                            h = /\((\S*)(?::(\d+))(?::(\d+))\)/,
                            u = t.stack.split("\n"),
                            d = [],
                            p = (/^(.*) is undefined$/.exec(t.message), 0),
                            f = u.length;
                          p < f;
                          ++p
                        ) {
                          if ((i = s.exec(u[p]))) {
                            var m = i[2] && 0 === i[2].indexOf("native");
                            i[2] &&
                              0 === i[2].indexOf("eval") &&
                              (e = h.exec(i[2])) &&
                              ((i[2] = e[1]), (i[3] = e[2]), (i[4] = e[3])),
                              (o = {
                                url: m ? null : i[2],
                                func: i[1] || l,
                                args: m ? [i[2]] : [],
                                line: i[3] ? +i[3] : null,
                                column: i[4] ? +i[4] : null,
                              });
                          } else if ((i = r.exec(u[p])))
                            o = {
                              url: i[2],
                              func: i[1] || l,
                              args: [],
                              line: +i[3],
                              column: i[4] ? +i[4] : null,
                            };
                          else {
                            if (!(i = a.exec(u[p]))) continue;
                            i[3] &&
                            i[3].indexOf(" > eval") > -1 &&
                            (e = c.exec(i[3]))
                              ? ((i[3] = e[1]), (i[4] = e[2]), (i[5] = null))
                              : 0 !== p ||
                                i[5] ||
                                "undefined" == typeof t.columnNumber ||
                                (d[0].column = t.columnNumber + 1),
                              (o = {
                                url: i[3],
                                func: i[1] || l,
                                args: i[2] ? i[2].split(",") : [],
                                line: i[4] ? +i[4] : null,
                                column: i[5] ? +i[5] : null,
                              });
                          }
                          if (
                            (!o.func && o.line && (o.func = l),
                            o.url && "blob:" === o.url.substr(0, 5))
                          ) {
                            var y = new XMLHttpRequest();
                            if (
                              (y.open("GET", o.url, !1),
                              y.send(null),
                              200 === y.status)
                            ) {
                              var g = y.responseText || "",
                                v = (g = g.slice(-300)).match(
                                  /\/\/# sourceMappingURL=(.*)$/
                                );
                              if (v) {
                                var b = v[1];
                                "~" === b.charAt(0) &&
                                  (b =
                                    ("undefined" == typeof document ||
                                    null == document.location
                                      ? ""
                                      : document.location.origin
                                      ? document.location.origin
                                      : document.location.protocol +
                                        "//" +
                                        document.location.hostname +
                                        (document.location.port
                                          ? ":" + document.location.port
                                          : "")) + b.slice(1)),
                                  (o.url = b.slice(0, -4));
                              }
                            }
                          }
                          d.push(o);
                        }
                        return d.length
                          ? {
                              name: t.name,
                              message: t.message,
                              url: n(),
                              stack: d,
                            }
                          : null;
                      }
                    }
                    function e(t, e, i, n) {
                      var o = { url: e, line: i };
                      if (o.url && o.line) {
                        if (
                          ((t.incomplete = !1),
                          o.func || (o.func = l),
                          t.stack.length > 0 && t.stack[0].url === o.url)
                        ) {
                          if (t.stack[0].line === o.line) return !1;
                          if (!t.stack[0].line && t.stack[0].func === o.func)
                            return (t.stack[0].line = o.line), !1;
                        }
                        return t.stack.unshift(o), (t.partial = !0), !0;
                      }
                      return (t.incomplete = !0), !1;
                    }
                    function i(t, r) {
                      for (
                        var a,
                          c,
                          h =
                            /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                          u = [],
                          d = {},
                          p = !1,
                          f = i.caller;
                        f && !p;
                        f = f.caller
                      )
                        if (f !== o && f !== s.report) {
                          if (
                            ((c = {
                              url: null,
                              func: l,
                              line: null,
                              column: null,
                            }),
                            f.name
                              ? (c.func = f.name)
                              : (a = h.exec(f.toString())) && (c.func = a[1]),
                            "undefined" == typeof c.func)
                          )
                            try {
                              c.func = a.input.substring(
                                0,
                                a.input.indexOf("{")
                              );
                            } catch (y) {}
                          d["" + f] ? (p = !0) : (d["" + f] = !0), u.push(c);
                        }
                      r && u.splice(0, r);
                      var m = {
                        name: t.name,
                        message: t.message,
                        url: n(),
                        stack: u,
                      };
                      return (
                        e(
                          m,
                          t.sourceURL || t.fileName,
                          t.line || t.lineNumber,
                          t.message || t.description
                        ),
                        m
                      );
                    }
                    function o(e, o) {
                      var a = null;
                      o = null == o ? 0 : +o;
                      try {
                        if ((a = t(e))) return a;
                      } catch (r) {
                        if (s.debug) throw r;
                      }
                      try {
                        if ((a = i(e, o + 1))) return a;
                      } catch (r) {
                        if (s.debug) throw r;
                      }
                      return { name: e.name, message: e.message, url: n() };
                    }
                    return (
                      (o.augmentStackTraceWithInitialElement = e),
                      (o.computeStackTraceFromStackProp = t),
                      o
                    );
                  })()),
                  (e.exports = s);
              }).call(
                this,
                "undefined" != typeof global
                  ? global
                  : "undefined" != typeof self
                  ? self
                  : "undefined" != typeof window
                  ? window
                  : {}
              );
            },
            { 5: 5 },
          ],
          7: [
            function (t, e, i) {
              function n(t, e) {
                for (var i = 0; i < t.length; ++i) if (t[i] === e) return i;
                return -1;
              }
              function o(t, e) {
                var i = [],
                  o = [];
                return (
                  null == e &&
                    (e = function (t, e) {
                      return i[0] === e
                        ? "[Circular ~]"
                        : "[Circular ~." + o.slice(0, n(i, e)).join(".") + "]";
                    }),
                  function (s, r) {
                    if (i.length > 0) {
                      var a = n(i, this);
                      ~a ? i.splice(a + 1) : i.push(this),
                        ~a ? o.splice(a, 1 / 0, s) : o.push(s),
                        ~n(i, r) && (r = e.call(this, s, r));
                    } else i.push(r);
                    return null == t
                      ? r instanceof Error
                        ? (function (t) {
                            var e = {
                              stack: t.stack,
                              message: t.message,
                              name: t.name,
                            };
                            for (var i in t)
                              Object.prototype.hasOwnProperty.call(t, i) &&
                                (e[i] = t[i]);
                            return e;
                          })(r)
                        : r
                      : t.call(this, s, r);
                  }
                );
              }
              (i = e.exports =
                function (t, e, i, n) {
                  return JSON.stringify(t, o(e, n), i);
                }),
                (i.getSerialize = o);
            },
            {},
          ],
          8: [
            function (t, e, i) {
              function n(t, e) {
                var i = (65535 & t) + (65535 & e);
                return (
                  (((t >> 16) + (e >> 16) + (i >> 16)) << 16) | (65535 & i)
                );
              }
              function o(t, e, i, o, s, r) {
                return n(
                  (function (t, e) {
                    return (t << e) | (t >>> (32 - e));
                  })(n(n(e, t), n(o, r)), s),
                  i
                );
              }
              function s(t, e, i, n, s, r, a) {
                return o((e & i) | (~e & n), t, e, s, r, a);
              }
              function r(t, e, i, n, s, r, a) {
                return o((e & n) | (i & ~n), t, e, s, r, a);
              }
              function a(t, e, i, n, s, r, a) {
                return o(e ^ i ^ n, t, e, s, r, a);
              }
              function l(t, e, i, n, s, r, a) {
                return o(i ^ (e | ~n), t, e, s, r, a);
              }
              function c(t, e) {
                (t[e >> 5] |= 128 << e % 32),
                  (t[14 + (((e + 64) >>> 9) << 4)] = e);
                var i,
                  o,
                  c,
                  h,
                  u,
                  d = 1732584193,
                  p = -271733879,
                  f = -1732584194,
                  m = 271733878;
                for (i = 0; i < t.length; i += 16)
                  (o = d),
                    (c = p),
                    (h = f),
                    (u = m),
                    (d = s(d, p, f, m, t[i], 7, -680876936)),
                    (m = s(m, d, p, f, t[i + 1], 12, -389564586)),
                    (f = s(f, m, d, p, t[i + 2], 17, 606105819)),
                    (p = s(p, f, m, d, t[i + 3], 22, -1044525330)),
                    (d = s(d, p, f, m, t[i + 4], 7, -176418897)),
                    (m = s(m, d, p, f, t[i + 5], 12, 1200080426)),
                    (f = s(f, m, d, p, t[i + 6], 17, -1473231341)),
                    (p = s(p, f, m, d, t[i + 7], 22, -45705983)),
                    (d = s(d, p, f, m, t[i + 8], 7, 1770035416)),
                    (m = s(m, d, p, f, t[i + 9], 12, -1958414417)),
                    (f = s(f, m, d, p, t[i + 10], 17, -42063)),
                    (p = s(p, f, m, d, t[i + 11], 22, -1990404162)),
                    (d = s(d, p, f, m, t[i + 12], 7, 1804603682)),
                    (m = s(m, d, p, f, t[i + 13], 12, -40341101)),
                    (f = s(f, m, d, p, t[i + 14], 17, -1502002290)),
                    (d = r(
                      d,
                      (p = s(p, f, m, d, t[i + 15], 22, 1236535329)),
                      f,
                      m,
                      t[i + 1],
                      5,
                      -165796510
                    )),
                    (m = r(m, d, p, f, t[i + 6], 9, -1069501632)),
                    (f = r(f, m, d, p, t[i + 11], 14, 643717713)),
                    (p = r(p, f, m, d, t[i], 20, -373897302)),
                    (d = r(d, p, f, m, t[i + 5], 5, -701558691)),
                    (m = r(m, d, p, f, t[i + 10], 9, 38016083)),
                    (f = r(f, m, d, p, t[i + 15], 14, -660478335)),
                    (p = r(p, f, m, d, t[i + 4], 20, -405537848)),
                    (d = r(d, p, f, m, t[i + 9], 5, 568446438)),
                    (m = r(m, d, p, f, t[i + 14], 9, -1019803690)),
                    (f = r(f, m, d, p, t[i + 3], 14, -187363961)),
                    (p = r(p, f, m, d, t[i + 8], 20, 1163531501)),
                    (d = r(d, p, f, m, t[i + 13], 5, -1444681467)),
                    (m = r(m, d, p, f, t[i + 2], 9, -51403784)),
                    (f = r(f, m, d, p, t[i + 7], 14, 1735328473)),
                    (d = a(
                      d,
                      (p = r(p, f, m, d, t[i + 12], 20, -1926607734)),
                      f,
                      m,
                      t[i + 5],
                      4,
                      -378558
                    )),
                    (m = a(m, d, p, f, t[i + 8], 11, -2022574463)),
                    (f = a(f, m, d, p, t[i + 11], 16, 1839030562)),
                    (p = a(p, f, m, d, t[i + 14], 23, -35309556)),
                    (d = a(d, p, f, m, t[i + 1], 4, -1530992060)),
                    (m = a(m, d, p, f, t[i + 4], 11, 1272893353)),
                    (f = a(f, m, d, p, t[i + 7], 16, -155497632)),
                    (p = a(p, f, m, d, t[i + 10], 23, -1094730640)),
                    (d = a(d, p, f, m, t[i + 13], 4, 681279174)),
                    (m = a(m, d, p, f, t[i], 11, -358537222)),
                    (f = a(f, m, d, p, t[i + 3], 16, -722521979)),
                    (p = a(p, f, m, d, t[i + 6], 23, 76029189)),
                    (d = a(d, p, f, m, t[i + 9], 4, -640364487)),
                    (m = a(m, d, p, f, t[i + 12], 11, -421815835)),
                    (f = a(f, m, d, p, t[i + 15], 16, 530742520)),
                    (d = l(
                      d,
                      (p = a(p, f, m, d, t[i + 2], 23, -995338651)),
                      f,
                      m,
                      t[i],
                      6,
                      -198630844
                    )),
                    (m = l(m, d, p, f, t[i + 7], 10, 1126891415)),
                    (f = l(f, m, d, p, t[i + 14], 15, -1416354905)),
                    (p = l(p, f, m, d, t[i + 5], 21, -57434055)),
                    (d = l(d, p, f, m, t[i + 12], 6, 1700485571)),
                    (m = l(m, d, p, f, t[i + 3], 10, -1894986606)),
                    (f = l(f, m, d, p, t[i + 10], 15, -1051523)),
                    (p = l(p, f, m, d, t[i + 1], 21, -2054922799)),
                    (d = l(d, p, f, m, t[i + 8], 6, 1873313359)),
                    (m = l(m, d, p, f, t[i + 15], 10, -30611744)),
                    (f = l(f, m, d, p, t[i + 6], 15, -1560198380)),
                    (p = l(p, f, m, d, t[i + 13], 21, 1309151649)),
                    (d = l(d, p, f, m, t[i + 4], 6, -145523070)),
                    (m = l(m, d, p, f, t[i + 11], 10, -1120210379)),
                    (f = l(f, m, d, p, t[i + 2], 15, 718787259)),
                    (p = l(p, f, m, d, t[i + 9], 21, -343485551)),
                    (d = n(d, o)),
                    (p = n(p, c)),
                    (f = n(f, h)),
                    (m = n(m, u));
                return [d, p, f, m];
              }
              function h(t) {
                var e,
                  i = "",
                  n = 32 * t.length;
                for (e = 0; e < n; e += 8)
                  i += String.fromCharCode((t[e >> 5] >>> e % 32) & 255);
                return i;
              }
              function u(t) {
                var e,
                  i = [];
                for (
                  i[(t.length >> 2) - 1] = void 0, e = 0;
                  e < i.length;
                  e += 1
                )
                  i[e] = 0;
                var n = 8 * t.length;
                for (e = 0; e < n; e += 8)
                  i[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
                return i;
              }
              function d(t) {
                var e,
                  i,
                  n = "0123456789abcdef",
                  o = "";
                for (i = 0; i < t.length; i += 1)
                  (e = t.charCodeAt(i)),
                    (o += n.charAt((e >>> 4) & 15) + n.charAt(15 & e));
                return o;
              }
              function p(t) {
                return unescape(encodeURIComponent(t));
              }
              function f(t) {
                return (function (t) {
                  return h(c(u(t), 8 * t.length));
                })(p(t));
              }
              function m(t, e) {
                return (function (t, e) {
                  var i,
                    n,
                    o = u(t),
                    s = [],
                    r = [];
                  for (
                    s[15] = r[15] = void 0,
                      o.length > 16 && (o = c(o, 8 * t.length)),
                      i = 0;
                    i < 16;
                    i += 1
                  )
                    (s[i] = 909522486 ^ o[i]), (r[i] = 1549556828 ^ o[i]);
                  return (
                    (n = c(s.concat(u(e)), 512 + 8 * e.length)),
                    h(c(r.concat(n), 640))
                  );
                })(p(t), p(e));
              }
              e.exports = function (t, e, i) {
                return e
                  ? i
                    ? m(e, t)
                    : (function (t, e) {
                        return d(m(t, e));
                      })(e, t)
                  : i
                  ? f(t)
                  : (function (t) {
                      return d(f(t));
                    })(t);
              };
            },
            {},
          ],
        },
        {},
        [4]
      )(4);
    });
  var z = [
      {
        family: "UC Browser",
        patterns: ["(UC? ?Browser|UCWEB|U3)[ /]?(\\d+)\\.(\\d+)\\.(\\d+)"],
      },
      {
        family: "Opera",
        name_replace: "Opera Mobile",
        patterns: [
          "(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)",
          "(Opera)/(\\d+)\\.(\\d+).+Opera Mobi",
          "Opera Mobi.+(Opera)(?:/|\\s+)(\\d+)\\.(\\d+)",
          "Opera Mobi",
          "(?:Mobile Safari).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Opera",
        name_replace: "Opera Mini",
        patterns: [
          "(Opera Mini)(?:/att|)/?(\\d+|)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
          "(OPiOS)/(\\d+).(\\d+).(\\d+)",
        ],
      },
      {
        family: "Opera",
        name_replace: "Opera Neon",
        patterns: ["Chrome/.+( MMS)/(\\d+).(\\d+).(\\d+)"],
      },
      {
        name_replace: "Opera",
        patterns: [
          "(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(?:Chrome).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Firefox",
        name_replace: "Firefox Mobile",
        patterns: [
          "(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
          "(Fennec)/(\\d+)\\.(\\d+)(pre)",
          "(Fennec)/(\\d+)\\.(\\d+)",
          "(?:Mobile|Tablet);.*(Firefox)/(\\d+)\\.(\\d+)",
          "(FxiOS)/(\\d+)\\.(\\d+)(\\.(\\d+)|)(\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Coc Coc",
        patterns: ["(coc_coc_browser)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"],
      },
      {
        family: "QQ",
        name_replace: "QQ Mini",
        patterns: ["(MQQBrowser/Mini)(?:(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"],
      },
      {
        family: "QQ",
        name_replace: "QQ Mobile",
        patterns: ["(MQQBrowser)(?:/(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"],
      },
      {
        name_replace: "QQ",
        patterns: [
          "(QQBrowser)(?:/(\\d+)(?:\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)|)",
        ],
      },
      {
        family: "Edge",
        name: "Edge Mobile",
        patterns: [
          "Windows Phone .*(Edge)/(\\d+)\\.(\\d+)",
          "(EdgiOS|EdgA)/(\\d+)\\.(\\d+).(\\d+).(\\d+)",
        ],
      },
      { name_replace: "Edge", patterns: ["(Edge|Edg)/(\\d+)(?:\\.(\\d+)|)"] },
      { patterns: ["(Puffin)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"] },
      {
        family: "Chrome",
        name_replace: "Chrome Mobile",
        patterns: [
          "Version/.+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "; wv\\).+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile(?:[ /]|$)",
          " Mobile .*(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Yandex",
        name_replace: "Yandex Mobile",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+).*Mobile"],
      },
      {
        name_replace: "Yandex",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)"],
      },
      {
        patterns: [
          "(Vivaldi)/(\\d+)\\.(\\d+)",
          "(Vivaldi)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        name_replace: "Brave",
        patterns: ["(brave)/(\\d+)\\.(\\d+)\\.(\\d+) Chrome"],
      },
      {
        family: "Chrome",
        patterns: [
          "(Chromium|Chrome)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Internet Explorer Mobile",
        patterns: ["(IEMobile)[ /](\\d+)\\.(\\d+)"],
      },
      {
        family: "Safari",
        name_replace: "Safari Mobile",
        patterns: [
          "(iPod|iPhone|iPad).+Version/(d+).(d+)(?:.(d+)|).*[ +]Safari",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).* AppleNews\\/\\d+\\.\\d+\\.\\d+?",
          "(iPod|iPhone|iPad).+Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile.*[ +]Safari",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile",
          "(iPod|iPod touch|iPhone|iPad).* Safari",
          "(iPod|iPod touch|iPhone|iPad)",
        ],
      },
      {
        name_replace: "Safari",
        patterns: ["(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|).*Safari/"],
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(7|8).(0)"],
        major_replace: "11",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(6)\\.(0)"],
        major_replace: "10",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(5)\\.(0)"],
        major_replace: "9",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(4)\\.(0)"],
        major_replace: "8",
      },
      {
        family: "Firefox",
        patterns: [
          "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*|)",
        ],
      },
    ],
    Z = [
      {
        family: "Windows",
        name_replace: "Windows Phone",
        patterns: [
          "(Windows Phone) (?:OS[ /])?(\\d+)\\.(\\d+)",
          "^UCWEB.*; (wds) (\\d+)\\.(d+)(?:\\.(\\d+)|);",
          "^UCWEB.*; (wds) (\\d+)\\.(\\d+)(?:\\.(\\d+)|);",
        ],
      },
      {
        family: "Windows",
        name_replace: "Windows Mobile",
        patterns: ["(Windows ?Mobile)"],
      },
      {
        name_replace: "Android",
        patterns: [
          "(Android)[ \\-/](\\d+)(?:\\.(\\d+)|)(?:[.\\-]([a-z0-9]+)|)",
          "(Android) (d+);",
          "^UCWEB.*; (Adr) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+)|);",
          "^(JUC).*; ?U; ?(?:Android|)(\\d+)\\.(\\d+)(?:[\\.\\-]([a-z0-9]+)|)",
          "(android)\\s(?:mobile\\/)(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(Silk-Accelerated=[a-z]{4,5})",
          "Puffin/[\\d\\.]+AT",
          "Puffin/[\\d\\.]+AP",
        ],
      },
      {
        name_replace: "Chrome OS",
        patterns: [
          "(x86_64|aarch64)\\ (\\d+)\\.(\\d+)\\.(\\d+).*Chrome.*(?:CitrixChromeApp)$",
          "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows 10)", "(Windows NT 6\\.4)", "(Windows NT 10\\.0)"],
        major_replace: "10",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.3; ARM;)", "(Windows NT 6.3)"],
        major_replace: "8",
        minor_replace: "1",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.2)"],
        major_replace: "8",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.1)"],
        major_replace: "7",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.0)"],
        major_replace: "Vista",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows (?:NT 5\\.2|NT 5\\.1))"],
        major_replace: "XP",
      },
      {
        name_replace: "Mac OS X",
        patterns: [
          "((?:Mac[ +]?|; )OS[ +]X)[\\s+/](?:(\\d+)[_.](\\d+)(?:[_.](\\d+)|)|Mach-O)",
          "\\w+\\s+Mac OS X\\s+\\w+\\s+(\\d+).(\\d+).(\\d+).*",
          "(?:PPC|Intel) (Mac OS X)",
        ],
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(10).(d+).*((?:i386|x86_64))"],
        major_replace: "10",
        minor_replace: "6",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(11).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "7",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(12).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "8",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(13).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "9",
      },
      {
        name_replace: "iOS",
        patterns: [
          "^UCWEB.*; (iPad|iPh|iPd) OS (\\d+)_(\\d+)(?:_(\\d+)|);",
          "(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\\d+)[_\\.](\\d+)(?:[_\\.](\\d+)|)",
          "(iPhone|iPad|iPod); Opera",
          "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)",
          "\\b(iOS[ /]|iOS; |iPhone(?:/| v|[ _]OS[/,]|; | OS : |\\d,\\d/|\\d,\\d; )|iPad/)(\\d{1,2})[_\\.](\\d{1,2})(?:[_\\.](\\d+)|)",
          "\\((iOS);",
          "(iPod|iPhone|iPad)",
          "Puffin/[\\d\\.]+IT",
          "Puffin/[\\d\\.]+IP",
        ],
      },
      {
        family: "Chrome",
        name_replace: "Chromecast",
        patterns: [
          "(CrKey -)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(CrKey[ +]armv7l)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(CrKey)(?:[/](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
        ],
      },
      { name_replace: "Debian", patterns: ["([Dd]ebian)"] },
      {
        family: "Linux",
        name_replace: "Linux",
        patterns: ["(Linux Mint)(?:/(\\d+)|)"],
      },
      {
        family: "Linux",
        patterns: [
          "(Ubuntu|Kubuntu|Arch Linux|CentOS|Slackware|Gentoo|openSUSE|SUSE|Red Hat|Fedora|PCLinuxOS|Mageia|(?:Free|Open|Net|\\b)BSD)",
          "(Mandriva)(?: Linux|)/(?:[\\d.-]+m[a-z]{2}(\\d+).(\\d)|)",
          "(Linux)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "\\(linux-gnu\\)",
        ],
      },
      {
        family: "BlackBerry",
        name_replace: "BlackBerry OS",
        patterns: [
          "(BB10);.+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(Black[Bb]erry)",
        ],
      },
      {
        patterns: [
          "(Fedora|Red Hat|PCLinuxOS|Puppy|Ubuntu|Kindle|Bada|Sailfish|Lubuntu|BackTrack|Slackware|(?:Free|Open|Net|\\b)BSD)[/ ](\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
        ],
      },
    ],
    U = navigator.userAgent,
    W = function () {
      return U;
    },
    K = function (t) {
      return J(t || U, z);
    },
    q = function (t) {
      return J(t || U, Z);
    };
  function G(t, e) {
    try {
      var i = new RegExp(e).exec(t);
      return i
        ? {
            name: i[1] || "Other",
            major: i[2] || "0",
            minor: i[3] || "0",
            patch: i[4] || "0",
          }
        : null;
    } catch (Is) {
      return null;
    }
  }
  function J(t, e) {
    for (var i = null, n = null, o = -1, s = !1; ++o < e.length && !s; ) {
      i = e[o];
      for (var r = -1; ++r < i.patterns.length && !s; )
        s = null !== (n = G(t, i.patterns[r]));
    }
    return s
      ? ((n.family = i.family || i.name_replace || n.name),
        i.name_replace && (n.name = i.name_replace),
        i.major_replace && (n.major = i.major_replace),
        i.minor_replace && (n.minor = i.minor_replace),
        i.patch_replace && (n.minor = i.patch_replace),
        n)
      : { family: "Other", name: "Other", major: "0", minor: "0", patch: "0" };
  }
  function Y() {
    var t = this,
      e = K(),
      i = W();
    (this.agent = i.toLowerCase()),
      (this.language =
        window.navigator.userLanguage || window.navigator.language),
      (this.isCSS1 = "CSS1Compat" === (document.compatMode || "")),
      (this.width = function () {
        return window.innerWidth && window.document.documentElement.clientWidth
          ? Math.min(window.innerWidth, document.documentElement.clientWidth)
          : window.innerWidth ||
              window.document.documentElement.clientWidth ||
              document.body.clientWidth;
      }),
      (this.height = function () {
        return (
          window.innerHeight ||
          window.document.documentElement.clientHeight ||
          document.body.clientHeight
        );
      }),
      (this.scrollX = function () {
        return window.pageXOffset !== undefined
          ? window.pageXOffset
          : t.isCSS1
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft;
      }),
      (this.scrollY = function () {
        return window.pageYOffset !== undefined
          ? window.pageYOffset
          : t.isCSS1
          ? document.documentElement.scrollTop
          : document.body.scrollTop;
      }),
      (this.type =
        "Edge" === e.family
          ? "edge"
          : "Internet Explorer" === e.family
          ? "ie"
          : "Chrome" === e.family
          ? "chrome"
          : "Safari" === e.family
          ? "safari"
          : "Firefox" === e.family
          ? "firefox"
          : e.family.toLowerCase()),
      (this.version = 1 * (e.major + "." + e.minor) || 0),
      (this.hasPostMessage = !!window.postMessage);
  }
  (Y.prototype.hasEvent = function (t, e) {
    return "on" + t in (e || document.createElement("div"));
  }),
    (Y.prototype.getScreenDimensions = function () {
      var t = {};
      for (var e in window.screen) t[e] = window.screen[e];
      return delete t.orientation, t;
    }),
    (Y.prototype.interrogateNavigator = function () {
      var t = {};
      for (var e in window.navigator)
        if ("webkitPersistentStorage" !== e)
          try {
            t[e] = window.navigator[e];
          } catch ($s) {}
      if (
        (delete t.plugins,
        delete t.mimeTypes,
        (t.plugins = []),
        window.navigator.plugins)
      )
        for (var i = 0; i < window.navigator.plugins.length; i++)
          t.plugins[i] = window.navigator.plugins[i].filename;
      return t;
    }),
    (Y.prototype.supportsPST = function () {
      return document.hasPrivateToken !== undefined;
    }),
    (Y.prototype.supportsCanvas = function () {
      var t = document.createElement("canvas");
      return !(!t.getContext || !t.getContext("2d"));
    }),
    (Y.prototype.supportsWebAssembly = function () {
      try {
        if (
          "object" == typeof WebAssembly &&
          "function" == typeof WebAssembly.instantiate
        ) {
          var t = new WebAssembly.Module(
            Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0)
          );
          if (t instanceof WebAssembly.Module)
            return new WebAssembly.Instance(t) instanceof WebAssembly.Instance;
        }
      } catch (Is) {
        return !1;
      }
    });
  var Q = new Y(),
    X = new (function () {
      var t,
        e,
        i = q(),
        n = W();
      (this.mobile =
        ((t = !!(
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        )),
        (e = !1),
        i &&
          (e =
            [
              "iOS",
              "Windows Phone",
              "Windows Mobile",
              "Android",
              "BlackBerry OS",
            ].indexOf(i.name) >= 0),
        t && e)),
        (this.dpr = function () {
          return window.devicePixelRatio || 1;
        }),
        this.mobile &&
          i &&
          "Windows" === i.family &&
          n.indexOf("touch") < 0 &&
          (this.mobile = !1),
        (this.os =
          "iOS" === i.family
            ? "ios"
            : "Android" === i.family
            ? "android"
            : "Mac OS X" === i.family
            ? "mac"
            : "Windows" === i.family
            ? "windows"
            : "Linux" === i.family
            ? "linux"
            : i.family.toLowerCase()),
        (this.version = (function () {
          if (!i) return "unknown";
          var t = i.major;
          return (
            i.minor && (t += "." + i.minor), i.patch && (t += "." + i.patch), t
          );
        })());
    })(),
    tt = {
      Browser: Q,
      System: X,
      supportsPAT: function () {
        return (
          ("mac" === X.os || "ios" === X.os) &&
          "safari" === Q.type &&
          Q.version >= 16.2
        );
      },
    },
    et = {
      CHALLENGE_PASSED: "challenge-passed",
      CHALLENGE_ESCAPED: "challenge-escaped",
      CHALLENGE_CLOSED: "challenge-closed",
      CHALLENGE_EXPIRED: "challenge-expired",
      CHALLENGE_ALREADY_CLOSED: "challenge-already-closed",
      AUTHENTICATION_DONE: "authentication-done",
      AUTHENTICATION_PASSED: "authentication-passed",
    },
    it = {
      INVALID_DATA: "invalid-data",
      BUNDLE_ERROR: "bundle-error",
      NETWORK_ERROR: "network-error",
      RATE_LIMITED: "rate-limited",
      CHALLENGE_ERROR: "challenge-error",
      INCOMPLETE_ANSWER: "incomplete-answer",
      MISSING_CAPTCHA: "missing-captcha",
      MISSING_SITEKEY: "missing-sitekey",
      INVALID_CAPTCHA_ID: "invalid-captcha-id",
      AUTHENTICATION_ERROR: "authentication-error",
    },
    nt = "https://hcaptcha.com",
    ot = "https://api.hcaptcha.com",
    st = "https://api2.hcaptcha.com",
    rt = "https://cloudflare.hcaptcha.com",
    at = [nt, st, rt],
    lt = {
      __proto__: null,
      CaptchaEvent: et,
      CaptchaError: it,
      DEFAULT_ENDPOINT: nt,
      FALLBACK_ENDPOINT: ot,
      API2_ENDPOINT: st,
      CF_ENDPOINT: rt,
      MAIN_ENDPOINTS: at,
    },
    ct = {
      host: null,
      file: null,
      sitekey: null,
      a11y_tfe: null,
      pingdom:
        "safari" === tt.Browser.type &&
        "windows" !== tt.System.os &&
        "mac" !== tt.System.os &&
        "ios" !== tt.System.os &&
        "android" !== tt.System.os,
      assetDomain: "https://newassets.hcaptcha.com",
      assetUrl: "https://newassets.hcaptcha.com/captcha/v1/01e0b54/static",
      width: null,
      height: null,
      mobile: null,
      orientation: "portrait",
      challenge_type: null,
    },
    ht = {
      theme: {
        contrast: { hcolor: "#FFF", hfcolor: "#000" },
        light: { hcolor: "#00838F", hfcolor: "#FFF" },
      },
      text: "#555555",
      accent: "#926FC1",
      warn: { base: "#EB5757", hover: "#DE3F3F" },
      link: { base: "#00838f", hover: "#00838f" },
      white: "#fff",
      grey: { base: "#333", placeholder: "#f0eff0", selected: "#5C6F8A" },
      purple: "#65549b",
      hoverOff: "#00838f",
      skipHoverOff: "#737373",
      hoverOn: "#00838f",
      error: "#fc481e",
      outline: "#262D38",
    },
    ut = {
      se: null,
      custom: !1,
      tplinks: "on",
      language: null,
      reportapi: "https://accounts.hcaptcha.com",
      endpoint: nt,
      pstIssuer: "https://pst-issuer.hcaptcha.com",
      size: "normal",
      theme: "light",
      assethost: null,
      imghost: null,
      recaptchacompat: "true",
      pat: "on",
      confirmNav: !1,
    },
    dt = "https://30910f52569b4c17b1081ead2dae43b4@sentry.hcaptcha.com/6",
    pt = "01e0b54",
    ft = "prod";
  function mt(t, e) {
    (t.style.width = "304px"),
      (t.style.height = "78px"),
      (t.style.backgroundColor = "#f9e5e5"),
      (t.style.position = "relative"),
      (t.innerHTML = "");
    var i = document.createElement("div");
    (i.style.width = "284px"),
      (i.style.position = "absolute"),
      (i.style.top = "12px"),
      (i.style.left = "10px"),
      (i.style.color = "#7c0a06"),
      (i.style.fontSize = "14px"),
      (i.style.fontWeight = "normal"),
      (i.style.lineHeight = "18px"),
      (i.innerHTML =
        e ||
        "Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha."),
      t.appendChild(i);
  }
  var yt = [];
  function gt(t) {
    for (
      var e = [],
        i = /(https?|wasm):\/\//,
        n = /^at /,
        o = /:\d+:\d+/g,
        s = 0,
        r = t.length;
      s < r;
      s++
    ) {
      var a = t[s];
      if (!i.test(a)) {
        var l = a.trim().replace(n, "").replace(o, "");
        e.push(l);
      }
    }
    return e.join("\n").trim();
  }
  function vt(t) {
    var e = { message: t.name + ": " + t.message };
    t.stack && (e.stack_trace = { trace: t.stack }),
      Ct("report error", "internal", "debug", e),
      wt(t.message || "internal error", "error", ct.file, t);
  }
  function bt(t) {
    if (ut.sentry) {
      var e = !1;
      try {
        e = -1 !== window.location.href.indexOf("chargebee.com");
      } catch (Is) {}
      window.Raven &&
        Raven.config(dt, {
          release: pt,
          environment: ft,
          autoBreadcrumbs: { xhr: !0, dom: !0, sentry: !0 },
          tags: {
            "site-host": ct.host,
            "site-key": ct.sitekey,
            "endpoint-url": ut.endpoint,
            "asset-url": ct.assetUrl,
          },
          sampleRate: e ? 1 : 0.01,
          ignoreErrors: [
            "canvas.contentDocument",
            "Can't find variable: ZiteReader",
            "Cannot redefine property: hcaptcha",
            "Cannot redefine property: BetterJsPop",
            "grecaptcha is not defined",
            "jQuery is not defined",
            "$ is not defined",
            "Script is not a function",
          ],
        }),
        window.Raven &&
          Raven.setUserContext({
            "Browser-Agent": tt.Browser.agent,
            "Browser-Type": tt.Browser.type,
            "Browser-Version": tt.Browser.version,
            "System-OS": tt.System.os,
            "System-Version": tt.System.version,
            "Is-Mobile": tt.System.mobile,
          }),
        Ct(ct.file + "_internal", "setup", "info"),
        t &&
          (window.onerror = function (t, e, i, n, o) {
            var s = o.name || "Error",
              r = o.stack || "";
            !(function (t) {
              if (
                t &&
                "string" == typeof t &&
                -1 === yt.indexOf(t) &&
                !(yt.length >= 10)
              ) {
                var e = gt(t.trim().split("\n").slice(0, 2));
                yt.push(e);
              }
            })(r),
              -1 === r.indexOf("at chrome-extension://") &&
                (Ct(t, "global", "debug", {
                  name: s,
                  url: e,
                  line: i,
                  column: n,
                  stack: r,
                }),
                xt("global", o, { message: t }));
          });
    }
  }
  function wt(t, e, i, n) {
    if (((e = e || "error"), ut.sentry)) {
      var o = "warn" === e ? "warning" : e;
      window.Raven &&
        Raven.captureMessage(t, { level: o, logger: i, extra: n });
    }
  }
  function xt(t, e, i) {
    return (
      ((i = i || {}).error = e),
      wt(e.message || "Missing error message", "error", t, i)
    );
  }
  function Ct(t, e, i, n) {
    ut.sentry &&
      window.Raven &&
      Raven.captureBreadcrumb({ message: t, category: e, level: i, data: n });
  }
  var kt = {
      getCookie: function (t) {
        var e = document.cookie.replace(/ /g, "").split(";");
        try {
          for (var i = "", n = e.length; n-- && !i; )
            e[n].indexOf(t) >= 0 && (i = e[n]);
          return i;
        } catch (Is) {
          return "";
        }
      },
      hasCookie: function (t) {
        return !!kt.getCookie(t);
      },
      supportsAPI: function () {
        try {
          return (
            "hasStorageAccess" in document && "requestStorageAccess" in document
          );
        } catch (Is) {
          return !1;
        }
      },
      hasAccess: function () {
        return new Promise(function (t) {
          document
            .hasStorageAccess()
            .then(function () {
              t(!0);
            })
            ["catch"](function () {
              t(!1);
            });
        });
      },
      requestAccess: function () {
        try {
          return document.requestStorageAccess();
        } catch (Is) {
          return Promise.resolve();
        }
      },
    },
    _t = {
      array: function (t) {
        if (0 === t.length) return t;
        for (var e, i, n = t.length; --n > -1; )
          (i = Math.floor(Math.random() * (n + 1))),
            (e = t[n]),
            (t[n] = t[i]),
            (t[i] = e);
        return t;
      },
    };
  function Et(t) {
    (this.r = 255),
      (this.g = 255),
      (this.b = 255),
      (this.a = 1),
      (this.h = 1),
      (this.s = 1),
      (this.l = 1),
      this.parseString(t);
  }
  function St(t, e, i) {
    return (
      i < 0 && (i += 1),
      i > 1 && (i -= 1),
      i < 1 / 6
        ? t + 6 * (e - t) * i
        : i < 0.5
        ? e
        : i < 2 / 3
        ? t + (e - t) * (2 / 3 - i) * 6
        : t
    );
  }
  function At(t) {
    for (
      var e, i = window.atob(t), n = i.length, o = new Uint8Array(n), s = 0;
      s < n;
      s++
    )
      (e = i.charCodeAt(s)), (o[s] = e);
    return o;
  }
  function Lt(t) {
    return crypto.subtle.importKey(
      "spki",
      At(t),
      { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
      !1,
      ["verify"]
    );
  }
  (Et.hasAlpha = function (t) {
    return (
      "string" == typeof t &&
      (-1 !== t.indexOf("rgba") || (9 === t.length && "#" === t[0]))
    );
  }),
    (Et.prototype.parseString = function (t) {
      t &&
        (0 === t.indexOf("#")
          ? this.fromHex(t)
          : 0 === t.indexOf("rgb") && this.fromRGBA(t));
    }),
    (Et.prototype.fromHex = function (t) {
      var e = 1;
      9 === t.length && (e = parseInt(t.substr(7, 2), 16) / 255);
      var i = (t = t.substr(1, 6)).replace(
          /^([a-f\d])([a-f\d])([a-f\d])?$/i,
          function (t, e, i, n) {
            return e + e + i + i + n + n;
          }
        ),
        n = parseInt(i, 16),
        o = n >> 16,
        s = (n >> 8) & 255,
        r = 255 & n;
      this.setRGBA(o, s, r, e);
    }),
    (Et.prototype.fromRGBA = function (t) {
      var e = t.indexOf("rgba"),
        i = t
          .substr(e)
          .replace(/rgba?\(/, "")
          .replace(/\)/, "")
          .replace(/[\s+]/g, "")
          .split(","),
        n = Math.floor(parseInt(i[0])),
        o = Math.floor(parseInt(i[1])),
        s = Math.floor(parseInt(i[2])),
        r = parseFloat(i[3]);
      this.setRGBA(n, o, s, r);
    }),
    (Et.prototype.setRGB = function (t, e, i) {
      this.setRGBA(t, e, i, 1);
    }),
    (Et.prototype.setRGBA = function (t, e, i, n) {
      (this.r = t),
        (this.g = e),
        (this.b = i),
        (this.a = isNaN(n) ? this.a : n),
        this.updateHSL();
    }),
    (Et.prototype.hsl2rgb = function (t, e, i) {
      if (0 === e) {
        var n = Math.round(255 * i);
        return this.setRGB(n, n, n), this;
      }
      var o = i <= 0.5 ? i * (1 + e) : i + e - i * e,
        s = 2 * i - o;
      return (
        (this.r = Math.round(255 * St(s, o, t + 1 / 3))),
        (this.g = Math.round(255 * St(s, o, t))),
        (this.b = Math.round(255 * St(s, o, t - 1 / 3))),
        (this.h = t),
        (this.s = e),
        (this.l = i),
        this
      );
    }),
    (Et.prototype.updateHSL = function () {
      var t,
        e = this.r / 255,
        i = this.g / 255,
        n = this.b / 255,
        o = Math.max(e, i, n),
        s = Math.min(e, i, n),
        r = null,
        a = (o + s) / 2;
      if (o === s) r = t = 0;
      else {
        var l = o - s;
        switch (((t = a > 0.5 ? l / (2 - o - s) : l / (o + s)), o)) {
          case e:
            r = (i - n) / l + (i < n ? 6 : 0);
            break;
          case i:
            r = (n - e) / l + 2;
            break;
          case n:
            r = (e - i) / l + 4;
        }
        r /= 6;
      }
      return (this.h = r), (this.s = t), (this.l = a), this;
    }),
    (Et.prototype.getHex = function () {
      return (
        "#" +
        ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
          .toString(16)
          .slice(1)
      );
    }),
    (Et.prototype.getRGBA = function () {
      return (
        "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")"
      );
    }),
    (Et.prototype.clone = function () {
      var t = new Et();
      return t.setRGBA(this.r, this.g, this.b, this.a), t;
    }),
    (Et.prototype.mix = function (t, e) {
      t instanceof Et || (t = new Et(t));
      var i = new Et(),
        n = Math.round(this.r + e * (t.r - this.r)),
        o = Math.round(this.g + e * (t.g - this.g)),
        s = Math.round(this.b + e * (t.b - this.b));
      return i.setRGB(n, o, s), i;
    }),
    (Et.prototype.blend = function (t, e) {
      var i;
      t instanceof Et || (t = new Et(t));
      for (var n = [], o = 0; o < e; o++)
        (i = this.mix.call(this, t, o / e)), n.push(i);
      return n;
    }),
    (Et.prototype.lightness = function (t) {
      return t > 1 && (t /= 100), this.hsl2rgb(this.h, this.s, t), this;
    }),
    (Et.prototype.saturation = function (t) {
      return t > 1 && (t /= 100), this.hsl2rgb(this.h, t, this.l), this;
    }),
    (Et.prototype.hue = function (t) {
      return this.hsl2rgb(t / 360, this.s, this.l), this;
    });
  var Bt = {
      decode: function (t) {
        try {
          var e = t.split(".");
          return {
            header: JSON.parse(atob(e[0])),
            payload: JSON.parse(atob(e[1])),
            signature: atob(e[2].replace(/_/g, "/").replace(/-/g, "+")),
            raw: { header: e[0], payload: e[1], signature: e[2] },
          };
        } catch (Is) {
          throw new Error("Token is invalid.");
        }
      },
      verify: function (t, e) {
        return ((i = t.raw.header + "." + t.raw.payload),
        (n = t.raw.signature.replace(/_/g, "/").replace(/-/g, "+")),
        (o = e),
        crypto.subtle.verify(
          { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
          o,
          At(n),
          new TextEncoder().encode(i)
        )).then(function (t) {
          if (!t) throw new Error("Token is invalid.");
        });
        var i, n, o;
      },
      checkExpiration: function (t) {
        if (new Date(1e3 * t) <= new Date(Date.now()))
          throw new Error("Token is expired.");
        return !0;
      },
    },
    Ht = {
      _setup: !1,
      _af: null,
      _fps: 60,
      _singleFrame: 1 / 60,
      _lagThreshold: 500,
      _adjustedLag: (1 / 60) * 2,
      _startTime: 0,
      _lastTime: 0,
      _nextTime: 1 / 60,
      _elapsed: 0,
      _difference: 0,
      _renders: [],
      _paused: !1,
      _running: !1,
      _tick: !1,
      frame: 0,
      time: 0,
      requestFrame: null,
      cancelFrame: null,
      _init: function () {
        for (
          var t,
            e = window.requestAnimationFrame,
            i = window.cancelAnimationFrame,
            n = ["ms", "moz", "webkit", "o"],
            o = n.length;
          --o > -1 && !e;

        )
          (e = window[n[o] + "RequestAnimationFrame"]),
            (i =
              window[n[o] + "CancelAnimationFrame"] ||
              window[n[o] + "CancelRequestAnimationFrame"]);
        e
          ? ((Ht.requestFrame = e.bind(window)),
            (Ht.cancelFrame = i.bind(window)))
          : ((Ht.requestFrame =
              ((t = Date.now()),
              function (e) {
                window.setTimeout(function () {
                  e(Date.now() - t);
                }, 1e3 * Ht._singleFrame);
              })),
            (Ht.cancelFrame = function (t) {
              return clearTimeout(t), null;
            })),
          (Ht._setup = !0),
          (Ht._startTime = Ht._lastTime = Date.now());
      },
      add: function (t, e) {
        Ht._renders.push({ callback: t, paused: !1 == !e || !1 }),
          !1 == !e && Ht.start();
      },
      remove: function (t) {
        for (var e = Ht._renders.length; --e > -1; )
          Ht._renders[e].callback === t &&
            ((Ht._renders[e].paused = !0), Ht._renders.splice(e, 1));
      },
      start: function (t) {
        if ((!1 === Ht._setup && Ht._init(), t))
          for (var e = Ht._renders.length; --e > -1; )
            Ht._renders[e].callback === t && (Ht._renders[e].paused = !1);
        !0 !== Ht._running &&
          ((Ht._paused = !1),
          (Ht._running = !0),
          (Ht._af = Ht.requestFrame(Ht._update)));
      },
      stop: function (t) {
        if (t)
          for (var e = Ht._renders.length; --e > -1; )
            Ht._renders[e].callback === t && (Ht._renders[e].paused = !0);
        else
          !1 !== Ht._running &&
            ((Ht._af = Ht.cancelFrame(Ht._af)),
            (Ht._paused = !0),
            (Ht._running = !1));
      },
      elapsed: function () {
        return Date.now() - Ht._startTime;
      },
      fps: function (t) {
        return arguments.length
          ? ((Ht._fps = t),
            (Ht._singleFrame = 1 / (Ht._fps || 60)),
            (Ht._adjustedLag = 2 * Ht._singleFrame),
            (Ht._nextTime = Ht.time + Ht._singleFrame),
            Ht._fps)
          : Ht._fps;
      },
      isRunning: function () {
        return Ht._running;
      },
      _update: function () {
        if (
          !Ht._paused &&
          ((Ht._elapsed = Date.now() - Ht._lastTime),
          (Ht._tick = !1),
          Ht._elapsed > Ht._lagThreshold &&
            (Ht._startTime += Ht._elapsed - Ht._adjustedLag),
          (Ht._lastTime += Ht._elapsed),
          (Ht.time = (Ht._lastTime - Ht._startTime) / 1e3),
          (Ht._difference = Ht.time - Ht._nextTime),
          Ht._difference > 0 &&
            (Ht.frame++,
            (Ht._nextTime +=
              Ht._difference +
              (Ht._difference >= Ht._singleFrame
                ? Ht._singleFrame / 4
                : Ht._singleFrame - Ht._difference)),
            (Ht._tick = !0)),
          (Ht._af = Ht.requestFrame(Ht._update)),
          !0 === Ht._tick && Ht._renders.length > 0)
        )
          for (var t = Ht._renders.length; --t > -1; )
            Ht._renders[t] &&
              !1 === Ht._renders[t].paused &&
              Ht._renders[t].callback(Ht.time);
      },
    },
    Mt = function (t) {
      for (
        var e,
          i,
          n,
          o = {},
          s = t ? (t.indexOf("&") >= 0 ? t.split("&") : [t]) : [],
          r = 0;
        r < s.length;
        r++
      )
        if (s[r].indexOf("=") >= 0) {
          if (
            ((e = s[r].split("=")),
            (i = decodeURIComponent(e[0])),
            ("false" !== (n = decodeURIComponent(e[1])) && "true" !== n) ||
              (n = "true" === n),
            "theme" === i || "themeConfig" === i)
          )
            try {
              n = JSON.parse(n);
            } catch (Is) {}
          o[i] = n;
        }
      return o;
    },
    Ot = function (t) {
      var e = [];
      for (var i in t) {
        var n = t[i];
        (n = "object" == typeof n ? JSON.stringify(n) : n),
          e.push([encodeURIComponent(i), encodeURIComponent(n)].join("="));
      }
      return e.join("&");
    },
    Tt = { __proto__: null, Decode: Mt, Encode: Ot };
  function Vt(t, e, i) {
    return Math.min(Math.max(t, e), i);
  }
  function Rt(t, e, i, n, o, s) {
    var r = ((t - e) * (o - n)) / (i - e) + n;
    return !1 === s ? r : Vt(r, Math.min(n, o), Math.max(n, o));
  }
  function Pt(t) {
    return t * (Math.PI / 180);
  }
  function Dt(t) {
    return (180 * t) / Math.PI;
  }
  var Ft = {
    __proto__: null,
    clamp: Vt,
    range: Rt,
    toRadians: Pt,
    toDegrees: Dt,
  };
  function $t(t) {
    var e = [].slice.call(arguments, 1);
    "string" == typeof t
      ? window[t]
        ? "function" == typeof window[t]
          ? window[t].apply(null, e)
          : console.log("[hCaptcha] Callback '" + t + "' is not a function.")
        : console.log("[hCaptcha] Callback '" + t + "' is not defined.")
      : "function" == typeof t
      ? t.apply(null, e)
      : console.log("[hcaptcha] Invalid callback '" + t + "'.");
  }
  function It() {
    try {
      $t.apply(null, arguments);
    } catch ($s) {
      console.error("[hCaptcha] There was an error in your callback."),
        console.error($s);
    }
  }
  var jt = {
    UUID: function (t) {
      return (
        /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(
          t
        ) || !1
      );
    },
    UUIDv4: function (t) {
      return (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          t
        ) || !1
      );
    },
    URL: function (t) {
      var e = new RegExp("^(http|https)://"),
        i = new RegExp("^((?!(data|javascript):).)*$");
      return e.test(t) && i.test(t);
    },
  };
  function Nt(t, e) {
    var i,
      n = "attempts" in (e = e || {}) ? e.attempts : 1,
      o = e.delay || 0,
      s = e.onFail;
    return (
      (i = function (e, i, r) {
        t().then(e, function (t) {
          var e = n-- > 0;
          s && (e = !1 !== s(t) && e), e ? setTimeout(r, o) : i(t);
        });
      }),
      new Promise(function (t, e) {
        i(t, e, function n() {
          i(t, e, n);
        });
      })
    );
  }
  function zt() {
    var t = this;
    (this._bottom = 0),
      (this._top = 0),
      (this.storage = {}),
      (this.add = function (e) {
        return (t.storage[t._top] = e), t._top++, e;
      }),
      (this.remove = function () {
        if (!t.empty()) {
          var e = t._bottom,
            i = t.storage[e];
          return (t.storage[e] = null), t._bottom++, i;
        }
      }),
      (this.empty = function () {
        return t._top === t._bottom;
      }),
      (this.size = function () {
        return t._top - t._bottom;
      });
  }
  var Zt = {
    queue: zt,
    depth: function js(t, e, i) {
      if ("object" == typeof t && t[e] && t[e].length > 0)
        for (var n = t[e].length; --n > -1; ) js(t[e][n], e, i);
      t !== undefined && i(t);
    },
    breathe: function (t, e, i) {
      var n = new zt(),
        o = null;
      for (n.add(t), o = n.remove(); o; ) {
        for (var s = 0; s < o[e].length; s++) n.add(o[e][s]);
        i(o), (o = n.remove());
      }
    },
  };
  function Ut() {
    (this.children = []), (this._events = []);
  }
  (Ut.prototype.initComponent = function (t, e) {
    var i = new t(e);
    return (i._parent = this), this.children.push(i), i;
  }),
    (Ut.prototype.destroy = function () {
      var t = this;
      try {
        Zt.depth(this, "children", function (e) {
          if (t !== e)
            for (var i = t.children.length; --i > -1; )
              t.children[i] === e && t.children.splice(i, 1);
          e._destroy && e._destroy(), (e = null);
        });
      } catch (Is) {
        throw new Error("Trouble destroying nodes: " + Is);
      }
      return null;
    }),
    (Ut.prototype._destroy = function () {
      this.onDestroy && this.onDestroy();
      for (var t = this._events.length || 0; --t > -1; )
        this._events.splice(t, 1);
      (this.children = null),
        (this._destroy = null),
        (this._events = null),
        (this.destroy = null),
        (this.emit = null),
        (this.on = null),
        (this.off = null),
        (this.initComponent = null);
    }),
    (Ut.prototype.on = function (t, e) {
      for (var i = this._events.length, n = !1; --i > -1 && !1 === n; )
        this._events[i].event === t && (n = this._events[i]);
      !1 === n && ((n = { event: t, listeners: [] }), this._events.push(n)),
        n.listeners.push(e);
    }),
    (Ut.prototype.off = function (t, e) {
      for (var i = this._events.length; --i > -1; )
        if (this._events[i].event === t) {
          for (var n = this._events[i].listeners.length; --n > -1; )
            this._events[i].listeners[n] === e &&
              this._events[i].listeners[n].splice(n, 1);
          0 === this._events[i].listeners.length &&
            this._events[i].splice(i, 1);
        }
    }),
    (Ut.prototype.emit = function (t) {
      for (
        var e = Array.prototype.slice.call(arguments, 1),
          i = this._events.length;
        --i > -1;

      )
        if (this._events[i].event === t)
          for (var n = this._events[i].listeners.length; --n > -1; )
            this._events[i].listeners[n].apply(this, e);
    });
  var Wt = {
      eventName: function (t) {
        var e = t;
        return (
          "down" === t ||
          "up" === t ||
          "move" === t ||
          "over" === t ||
          "out" === t
            ? (e =
                !tt.System.mobile ||
                ("down" !== t && "up" !== t && "move" !== t)
                  ? "mouse" + t
                  : "down" === t
                  ? "touchstart"
                  : "up" === t
                  ? "touchend"
                  : "touchmove")
            : "enter" === t && (e = "keydown"),
          e
        );
      },
      actionName: function (t) {
        var e = t;
        return (
          "touchstart" === e || "mousedown" === e
            ? (e = "down")
            : "touchmove" === e || "mousemove" === e
            ? (e = "move")
            : "touchend" === e || "mouseup" === e
            ? (e = "up")
            : "mouseover" === e
            ? (e = "over")
            : "mouseout" === e && (e = "out"),
          e
        );
      },
      eventCallback: function (t, e, i) {
        var n = Wt.actionName(t);
        return function (o) {
          if (
            ((o = o || window.event),
            "down" === n ||
              "move" === n ||
              "up" === n ||
              "over" === n ||
              "out" === n ||
              "click" === n)
          ) {
            var s = Wt.eventCoords(o);
            if (!s) return;
            var r = i.getBoundingClientRect();
            (o.windowX = s.x),
              (o.windowY = s.y),
              (o.elementX = o.windowX - (r.x || r.left)),
              (o.elementY = o.windowY - (r.y || r.top));
          }
          (o.keyNum = o.which || o.keyCode || 0),
            ("enter" === t && 13 !== o.keyNum && 32 !== o.keyNum) ||
              ((o.action = n), (o.targetElement = i), e(o));
        };
      },
      eventCoords: function (t) {
        if (!t) return null;
        var e = t;
        if (t.touches || t.changedTouches) {
          var i =
            t.touches && t.touches.length >= 1 ? t.touches : t.changedTouches;
          i && i[0] && (e = i[0]);
        }
        return "number" == typeof e.pageX && "number" == typeof e.pageY
          ? { x: e.pageX, y: e.pageY }
          : "number" == typeof e.clientX && "number" == typeof e.clientY
          ? { x: e.clientX, y: e.clientY }
          : null;
      },
    },
    Kt = ["Webkit", "Moz", "ms"],
    qt = document.createElement("div").style,
    Gt = {};
  function Jt(t) {
    var e = Gt[t];
    return (
      e ||
      (t in qt
        ? t
        : (Gt[t] =
            (function (t) {
              for (
                var e = t[0].toUpperCase() + t.slice(1), i = Kt.length;
                i--;

              )
                if ((t = Kt[i] + e) in qt) return t;
            })(t) || t))
    );
  }
  function Yt(t, e, i) {
    if (
      ((this.dom = null),
      (this._clss = []),
      (this._nodes = []),
      (this._listeners = []),
      (this._frag = null),
      t && "object" == typeof t)
    ) {
      this.dom = t;
      var n = [],
        o = [];
      "string" == typeof t.className && (o = t.className.split(" "));
      for (var s = 0; s < o.length; s++)
        "" !== o[s] && " " !== o[s] && n.push(o[s]);
      this._clss = n;
    } else
      (i !== undefined && null !== i) || (i = !0),
        (!t ||
          ("string" == typeof t &&
            (t.indexOf("#") >= 0 || t.indexOf(".") >= 0))) &&
          (t && (e = t), (t = "div")),
        (this.dom = document.createElement(t)),
        e &&
          (e.indexOf("#") >= 0
            ? (this.dom.id = e.split("#")[1])
            : (e.indexOf(".") >= 0 && (e = e.split(".")[1]),
              this.addClass.call(this, e)));
    !0 === i &&
      ((this._frag = document.createDocumentFragment()),
      this._frag.appendChild(this.dom));
  }
  (Yt.prototype.createElement = function (t, e) {
    try {
      var i = new Yt(t, e, !1);
      return this.appendElement.call(this, i), this._nodes.push(i), i;
    } catch (Is) {
      return xt("element", Is), null;
    }
  }),
    (Yt.prototype.appendElement = function (t) {
      if (t === undefined)
        return vt({
          name: "DomElement Add Child",
          message: "Child Element is undefined",
        });
      var e;
      e =
        t._frag !== undefined && null !== t._frag
          ? t._frag
          : t.dom !== undefined
          ? t.dom
          : t;
      try {
        t instanceof Yt && (t._parent = this), this.dom.appendChild(e);
      } catch (Is) {
        vt({
          name: "DomElement Add Child",
          message: "Failed to append child.",
        });
      }
      return this;
    }),
    (Yt.prototype.removeElement = function (t) {
      try {
        var e;
        if (t._nodes)
          for (e = t._nodes.length; e--; ) t.removeElement(t._nodes[e]);
        for (e = this._nodes.length; --e > -1; )
          this._nodes[e] === t && this._nodes.splice(e, 1);
        var i = t instanceof Yt ? t.dom : t,
          n = i.parentNode === this.dom ? this.dom : i.parentNode;
        if ((n.removeChild && n.removeChild(i), !n))
          throw new Error("Child component does not have correct setup");
        t.__destroy && t.__destroy();
      } catch (Is) {
        vt({
          name: "DomElement Remove Child",
          message: Is.message || "Failed to remove child.",
        });
      }
    }),
    (Yt.prototype.addClass = function (t) {
      return (
        !1 === this.hasClass.call(this, t) &&
          (this._clss.push(t), (this.dom.className = this._clss.join(" "))),
        this
      );
    }),
    (Yt.prototype.hasClass = function (t) {
      for (
        var e = -1 !== this.dom.className.split(" ").indexOf(t),
          i = this._clss.length;
        i-- && !e;

      )
        e = this._clss[i] === t;
      return e;
    }),
    (Yt.prototype.removeClass = function (t) {
      for (var e = this._clss.length; --e > -1; )
        this._clss[e] === t && this._clss.splice(e, 1);
      return (this.dom.className = this._clss.join(" ")), this;
    }),
    (Yt.prototype.text = function (t) {
      if (this && this.dom) {
        if (!t) return this.dom.textContent;
        for (
          var e, i, n, o, s = /&(.*?);/g, r = /<[a-z][\s\S]*>/i;
          null !== (e = s.exec(t));

        ) {
          !1 === r.test(e[0])
            ? ((n = e[0]),
              (o = void 0),
              ((o = document.createElement("div")).innerHTML = n),
              (i = o.textContent),
              (t = t.replace(new RegExp(e[0], "g"), i)))
            : (t = t.replace(e[0], ""));
        }
        return (this.dom.textContent = t), this;
      }
    }),
    (Yt.prototype.content = Yt.prototype.text),
    (Yt.prototype.css = function (t) {
      var e,
        i = "ie" === tt.Browser.type && 8 === tt.Browser.version;
      for (var n in t) {
        e = t[n];
        try {
          "opacity" !== n &&
            "zIndex" !== n &&
            "fontWeight" !== n &&
            isFinite(e) &&
            parseFloat(e) === e &&
            (e += "px");
          var o = Jt(n);
          i && "opacity" === n
            ? (this.dom.style.filter = "alpha(opacity=" + 100 * e + ")")
            : i && Et.hasAlpha(e)
            ? (this.dom.style[o] = new Et(e).getHex())
            : (this.dom.style[o] = e);
        } catch ($s) {}
      }
      return this;
    }),
    (Yt.prototype.backgroundImage = function (t, e, i, n) {
      var o = e !== undefined && i !== undefined,
        s = { "-ms-high-contrast-adjust": "none" };
      if (("object" == typeof e && (n = e), n === undefined && (n = {}), o)) {
        var r = t.width / t.height,
          a = e,
          l = a / r;
        n.cover && l < i && (a = (l = i) * r),
          n.contain && l > i && (a = (l = i) * r),
          (s.width = a),
          (s.height = l),
          n.center &&
            ((s.marginLeft = -a / 2),
            (s.marginTop = -l / 2),
            (s.position = "absolute"),
            (s.left = "50%"),
            (s.top = "50%")),
          (n.left || n.right) && ((s.left = n.left || 0), (s.top = n.top || 0));
      }
      "ie" === tt.Browser.type && 8 === tt.Browser.version
        ? (s.filter =
            "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
            t.src +
            "',sizingMethod='scale')")
        : ((s.background = "url(" + t.src + ")"),
          (s.backgroundPosition = "50% 50%"),
          (s.backgroundRepeat = "no-repeat"),
          (s.backgroundSize = o
            ? a + "px " + l + "px"
            : n.cover
            ? "cover"
            : n.contain
            ? "contain"
            : "100%")),
        this.css.call(this, s);
    }),
    (Yt.prototype.setAttribute = function (t, e) {
      var i;
      if ("object" == typeof t)
        for (var n in t) (i = t[n]), this.dom.setAttribute(n, i);
      else this.dom.setAttribute(t, e);
    }),
    (Yt.prototype.removeAttribute = function (t, e) {
      var i;
      if ("object" == typeof t)
        for (var n in t) (i = t[n]), this.dom.removeAttribute(n, i);
      else this.dom.removeAttribute(t, e);
    }),
    (Yt.prototype.addEventListener = function (t, e, i) {
      var n = {
        event: Wt.eventName(t),
        handler: Wt.eventCallback(t, e, this.dom),
        callback: e,
      };
      this._listeners.push(n),
        this.dom.addEventListener
          ? this.dom.addEventListener(n.event, n.handler, i)
          : this.dom.attachEvent("on" + n.event, n.handler);
    }),
    (Yt.prototype.removeEventListener = function (t, e, i) {
      for (var n, o = this._listeners.length; --o > -1; )
        (n = this._listeners[o]).event === t &&
          n.callback === e &&
          (this._listeners.splice(o, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(n.event, n.handler, i)
            : this.dom.detachEvent("on" + n.event, n.handler));
    }),
    (Yt.prototype.focus = function () {
      this.dom.focus();
    }),
    (Yt.prototype.blur = function () {
      this.dom.blur();
    }),
    (Yt.prototype.html = function (t) {
      return t && (this.dom.innerHTML = t), this.dom.innerHTML;
    }),
    (Yt.prototype.__destroy = function () {
      for (var t, e = this._listeners.length; --e > -1; )
        (t = this._listeners[e]),
          this._listeners.splice(e, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(t.event, t.handler)
            : this.dom.detachEvent("on" + t.event, t.handler);
      return (
        (this.dom = null),
        (this._clss = []),
        (this._nodes = []),
        (this._listeners = []),
        (this._frag = null),
        (t = null),
        null
      );
    });
  var Qt = {
    self: function (t, e) {
      var i = {},
        n = Array.prototype.slice.call(arguments, 2);
      for (var o in (e.apply(t, n), t)) i[o] = t[o];
    },
    proto: function (t, e) {
      (t.prototype = Object.create(e.prototype)), (t.prototype.constructor = t);
    },
  };
  function Xt(t, e) {
    Qt.self(this, Yt, e || "div", t), (this.children = []), (this._events = []);
  }
  function te(t) {
    if (null === t) return "";
    var e = [];
    return ee(t, e), e.join("&");
  }
  function ee(t, e) {
    var i, n;
    if ("object" == typeof t)
      for (n in t) !0 === ie((i = t[n])) ? ee(i, e) : (e[e.length] = ne(n, i));
    else if (!0 === Array.isArray(t))
      for (var o = 0; o < t.length; o++)
        !0 === ie((i = t[o])) ? ee(t, e) : (e[e.length] = ne(n, i));
    else e[e.length] = ne(t);
  }
  function ie(t) {
    return !0 === Array.isArray(t) || "object" == typeof t;
  }
  function ne(t, e) {
    return (
      encodeURIComponent(t) + "=" + encodeURIComponent(null === e ? "" : e)
    );
  }
  Qt.proto(Xt, Yt),
    (Xt.prototype.initComponent = function (t, e, i) {
      try {
        var n = new t(e);
        return (
          (n._parent = this),
          this.children.push(n),
          n.dom &&
            (i !== undefined
              ? i.appendElement && i.appendElement(n)
              : this.appendElement(n)),
          n
        );
      } catch (Is) {
        return xt("component", Is), null;
      }
    }),
    (Xt.prototype.removeComponent = function (t) {
      for (var e = this.children.length; --e > -1; )
        if (this.children[e] === t) {
          this.children.splice(e, 1);
          break;
        }
      t._destroy && t._destroy(), (t = null);
    }),
    (Xt.prototype.removeAllComponents = function () {
      for (var t = this.children.length; --t > -1; )
        this.children[t]._destroy && this.children[t]._destroy();
      this.children = [];
    }),
    (Xt.prototype.destroy = function () {
      var t = this;
      try {
        Zt.depth(this, "children", function (e) {
          if (t !== e)
            for (var i = t.children.length; --i > -1; )
              t.children[i] === e && t.children.splice(i, 1);
          e._destroy && e._destroy(), (e = null);
        });
      } catch (Is) {
        throw new Error("Trouble destroying nodes: " + Is);
      }
      return null;
    }),
    (Xt.prototype._destroy = function () {
      try {
        this.onDestroy && this.onDestroy(),
          this._parent.removeElement && this._parent.removeElement(this);
        for (var t = this._events.length; --t > -1; ) this._events.splice(t, 1);
        (this.children = null),
          (this._destroy = null),
          (this._events = null),
          (this.destroy = null),
          (this.emit = null),
          (this.on = null),
          (this.off = null),
          (this.initComponent = null);
      } catch (Is) {
        vt({ name: "DomComponent", message: "Failed to destroy." });
      }
    }),
    (Xt.prototype.on = function (t, e) {
      for (var i = this._events.length, n = !1; --i > -1 && !1 === n; )
        this._events[i].event === t && (n = this._events[i]);
      !1 === n && ((n = { event: t, listeners: [] }), this._events.push(n)),
        n.listeners.push(e);
    }),
    (Xt.prototype.off = function (t, e) {
      for (var i = this._events.length; --i > -1; )
        if (this._events[i].event === t) {
          for (var n = this._events[i].listeners.length; --n > -1; )
            this._events[i].listeners[n] === e &&
              this._events[i].listeners.splice(n, 1);
          0 === this._events[i].listeners.length && this._events.splice(i, 1);
        }
    }),
    (Xt.prototype.emit = function (t) {
      for (
        var e = Array.prototype.slice.call(arguments, 1),
          i = this._events.length;
        --i > -1 && this._events;

      )
        if (this._events[i].event === t)
          for (var n = this._events[i].listeners.length; --n > -1; )
            this._events[i].listeners[n].apply(this, e);
    });
  var oe = {
      af: "Afrikaans",
      sq: "Albanian",
      am: "Amharic",
      ar: "Arabic",
      hy: "Armenian",
      az: "Azerbaijani",
      eu: "Basque",
      be: "Belarusian",
      bn: "Bengali",
      bg: "Bulgarian",
      bs: "Bosnian",
      my: "Burmese",
      ca: "Catalan",
      ceb: "Cebuano",
      zh: "Chinese",
      "zh-CN": "Chinese Simplified",
      "zh-TW": "Chinese Traditional",
      co: "Corsican",
      hr: "Croatian",
      cs: "Czech",
      da: "Danish",
      nl: "Dutch",
      en: "English",
      eo: "Esperanto",
      et: "Estonian",
      fi: "Finnish",
      fr: "French",
      fy: "Frisian",
      gd: "Gaelic",
      gl: "Galacian",
      ka: "Georgian",
      de: "German",
      el: "Greek",
      gu: "Gujurati",
      ht: "Haitian",
      ha: "Hausa",
      haw: "Hawaiian",
      he: "Hebrew",
      hi: "Hindi",
      hmn: "Hmong",
      hu: "Hungarian",
      is: "Icelandic",
      ig: "Igbo",
      id: "Indonesian",
      ga: "Irish",
      it: "Italian",
      ja: "Japanese",
      jw: "Javanese",
      kn: "Kannada",
      kk: "Kazakh",
      km: "Khmer",
      rw: "Kinyarwanda",
      ky: "Kirghiz",
      ko: "Korean",
      ku: "Kurdish",
      lo: "Lao",
      la: "Latin",
      lv: "Latvian",
      lt: "Lithuanian",
      lb: "Luxembourgish",
      mk: "Macedonian",
      mg: "Malagasy",
      ms: "Malay",
      ml: "Malayalam",
      mt: "Maltese",
      mi: "Maori",
      mr: "Marathi",
      mn: "Mongolian",
      ne: "Nepali",
      no: "Norwegian",
      ny: "Nyanja",
      or: "Oriya",
      fa: "Persian",
      pl: "Polish",
      "pt-BR": "Portuguese (Brazil)",
      pt: "Portuguese (Portugal)",
      ps: "Pashto",
      pa: "Punjabi",
      ro: "Romanian",
      ru: "Russian",
      sm: "Samoan",
      sn: "Shona",
      sd: "Sindhi",
      si: "Singhalese",
      sr: "Serbian",
      sk: "Slovak",
      sl: "Slovenian",
      so: "Somani",
      st: "Southern Sotho",
      es: "Spanish",
      su: "Sundanese",
      sw: "Swahili",
      sv: "Swedish",
      tl: "Tagalog",
      tg: "Tajik",
      ta: "Tamil",
      tt: "Tatar",
      te: "Teluga",
      th: "Thai",
      tr: "Turkish",
      tk: "Turkmen",
      ug: "Uyghur",
      uk: "Ukrainian",
      ur: "Urdu",
      uz: "Uzbek",
      vi: "Vietnamese",
      cy: "Welsh",
      xh: "Xhosa",
      yi: "Yiddish",
      yo: "Yoruba",
      zu: "Zulu",
    },
    se = {
      zh: { "I am human": "æˆ‘æ˜¯äºº" },
      ar: { "I am human": "Ø£Ù†Ø§ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†" },
      af: { "I am human": "Ek is menslike" },
      am: { "I am human": "áŠ¥áŠ” áˆ°á‹ áŠáŠ" },
      hy: { "I am human": "ÔµÕ½ Õ´Õ¡Ö€Õ¤ Õ¥Õ´" },
      az: { "I am human": "MÉ™n insanam" },
      eu: { "I am human": "Gizakia naiz" },
      bn: { "I am human": "à¦†à¦®à¦¿ à¦®à¦¾à¦¨à¦¬ à¦¨à¦‡" },
      bg: { "I am human": "ÐÐ· ÑÑŠÐ¼ Ñ‡Ð¾Ð²ÐµÐº" },
      ca: { "I am human": "SÃ³c humÃ " },
      hr: { "I am human": "Ja sam Äovjek" },
      cs: { "I am human": "Jsem ÄlovÄ›k" },
      da: { "I am human": "Jeg er et menneske" },
      nl: { "I am human": "Ik ben een mens" },
      et: { "I am human": "Ma olen inimeste" },
      fi: { "I am human": "Olen ihminen" },
      fr: { "I am human": "Je suis humain" },
      gl: { "I am human": "Eu son humano" },
      ka: { "I am human": "áƒ›áƒ” áƒ•áƒáƒ  áƒáƒ“áƒáƒ›áƒ˜áƒáƒœáƒ˜" },
      de: { "I am human": "Ich bin ein Mensch" },
      el: { "I am human": "Î•Î¯Î¼Î±Î¹ Î¬Î½Î¸ÏÏ‰Ï€Î¿Ï‚" },
      gu: { "I am human": "àª¹à«àª‚ àª®àª¾àª¨àªµ àª›à«àª‚" },
      iw: { "I am human": ". ×× ×™ ×× ×•×©×™" },
      hi: { "I am human": "à¤®à¥ˆà¤‚ à¤®à¤¾à¤¨à¤µ à¤¹à¥‚à¤‚" },
      hu: { "I am human": "Nem vagyok robot" },
      is: { "I am human": "Ã‰g er manneskja" },
      id: { "I am human": "Aku manusia" },
      it: { "I am human": "Sono un essere umano" },
      ja: { "I am human": "ç§ã¯äººé–“ã§ã™" },
      kn: { "I am human": "à²¨à²¾à²¨à³ à²®à²¾à²¨à²µà²¨à³" },
      ko: { "I am human": "ì‚¬ëžŒìž…ë‹ˆë‹¤" },
      lo: { "I am human": "àº‚à»‰àº­àºà»€àº›àº±àº™àº¡àº°àº™àº¸àº”" },
      lv: { "I am human": "Es esmu cilvÄ“ks" },
      lt: { "I am human": "AÅ¡ esu Å¾mogaus" },
      ms: { "I am human": "Saya manusia" },
      ml: { "I am human": "à´žà´¾àµ» à´®à´¨àµà´·àµà´¯à´¨à´¾à´£àµ" },
      mr: { "I am human": "à¤®à¥€ à¤®à¤¾à¤¨à¤µà¥€ à¤†à¤¹à¥‡" },
      mn: { "I am human": "Ð‘Ð¸ Ð±Ð¾Ð» Ñ…Ò¯Ð½" },
      no: { "I am human": "Jeg er menneskelig" },
      fa: { "I am human": "Ù…Ù† Ø§Ù†Ø³Ø§Ù†ÛŒ Ù‡Ø³ØªÙ…" },
      pl: { "I am human": "Jestem czÅ‚owiekiem" },
      pt: { "I am human": "Sou humano" },
      ro: { "I am human": "Eu sunt om" },
      ru: { "I am human": "Ð¯ Ñ‡ÐµÐ»Ð¾Ð²ÐµÐº" },
      sr: { "I am human": "Ja sam ljudski" },
      si: { "I am human": "à¶¸à¶¸ à¶¸à·’à¶±à·’à·ƒà·Šà·ƒà·”" },
      sk: { "I am human": "Ja som Älovek" },
      sl: { "I am human": "Jaz sem ÄloveÅ¡ki" },
      es: { "I am human": "Soy humano" },
      sw: { "I am human": "Mimi ni binadamu" },
      sv: { "I am human": "Jag Ã¤r mÃ¤nniska" },
      ta: { "I am human": "à®¨à®¾à®©à¯ à®®à®©à®¿à®¤" },
      te: { "I am human": "à°¨à±‡à°¨à± à°®à°¨à°¿à°·à°¿à°¨à°¿" },
      th: { "I am human": "à¸œà¸¡à¸¡à¸™à¸¸à¸©à¸¢à¹Œ" },
      tr: { "I am human": "Ben bir insanÄ±m" },
      uk: { "I am human": "Ð¯ Ð»ÑŽÐ´Ð¸Ð½Ð¸" },
      ur: { "I am human": "Ù…ÛŒÚº Ø§Ù†Ø³Ø§Ù† ÛÙˆÚº" },
      vi: { "I am human": "TÃ´i lÃ  con ngÆ°á»i" },
      zu: { "I am human": "Ngingumuntu" },
    },
    re = null,
    ae = {
      translate: function (t, e) {
        var i = ae.getBestTrans(se),
          n = i && i[t];
        if (((n = n || t), e))
          for (var o = Object.keys(e), s = o.length; s--; )
            n = n.replace(new RegExp("{{" + o[s] + "}}", "g"), e[o[s]]);
        return n;
      },
      getBestTrans: function (t) {
        var e = ae.getLocale();
        return e in t
          ? t[e]
          : ae.getShortLocale(e) in t
          ? t[ae.getShortLocale(e)]
          : "en" in t
          ? t.en
          : null;
      },
      resolveLocale: function (t) {
        var e = ae.getShortLocale(t);
        return (
          "in" === e && (t = "id"),
          "iw" === e && (t = "he"),
          "nb" === e && (t = "no"),
          "ji" === e && (t = "yi"),
          "zh-CN" === t && (t = "zh"),
          "jv" === e && (t = "jw"),
          oe[t] ? t : oe[e] ? e : "en"
        );
      },
      getLocale: function () {
        return ae.resolveLocale(
          re || window.navigator.userLanguage || window.navigator.language
        );
      },
      setLocale: function (t) {
        "zh-Hans" === t ? (t = "zh-CN") : "zh-Hant" === t && (t = "zh-TW"),
          (re = t);
      },
      getShortLocale: function (t) {
        return t.indexOf("-") >= 0 ? t.substring(0, t.indexOf("-")) : t;
      },
      isShortLocale: function (t) {
        return 2 === t.length || 3 === t.length;
      },
      addTable: function (t, e) {
        if ((e || (e = Object.create(null)), se[t])) {
          var i = se[t];
          for (var n in e) i[n] = e[n];
        } else se[t] = e;
        return se[t];
      },
      getTable: function (t) {
        return se[t];
      },
      addTables: function (t) {
        for (var e in t) ae.addTable(e, t[e]);
        return se;
      },
      getTables: function () {
        return se;
      },
    },
    le = {
      400: "Rate limited or network error. Please retry.",
      429: "Your computer or network has sent too many requests.",
      500: "Cannot contact hCaptcha. Check your connection and try again.",
    },
    ce = function (t) {
      try {
        return ae.translate(le[t]);
      } catch (Is) {
        return !1;
      }
    },
    he =
      "undefined" != typeof XDomainRequest &&
      !("withCredentials" in XMLHttpRequest.prototype);
  function ue(t, e, i) {
    i = i || {};
    var n = {
      url: e,
      method: t.toUpperCase(),
      responseType: i.responseType || "string",
      dataType: i.dataType || null,
      withCredentials: i.withCredentials || !1,
      headers: i.headers || null,
      data: i.data || null,
      timeout: i.timeout || null,
      pst: i.pst || null,
    };
    (n.legacy = n.withCredentials && he),
      n.data &&
        ("json" === n.dataType &&
          "object" == typeof n.data &&
          (n.data = JSON.stringify(n.data)),
        "query" === n.dataType && (n.data = te(n.data)));
    var o = "fetch" in window && n.pst ? pe : de;
    return i.retry
      ? Nt(function () {
          return o(n);
        }, i.retry)
      : o(n);
  }
  function de(t) {
    var e = t.legacy ? new XDomainRequest() : new XMLHttpRequest(),
      i = "function" == typeof t.url ? t.url() : t.url;
    return new Promise(function (n, o) {
      var s,
        r = function (s) {
          return function () {
            var r = e.response || e.responseText,
              a = e.statusText || "",
              l = e.status,
              c = e.readyState;
            if (4 === c || t.legacy) {
              if ("json" === t.responseType && r)
                try {
                  r = JSON.parse(r);
                } catch (h) {}
              if ("error" === s || (l >= 400 && l <= 511))
                return void o({
                  event: it.NETWORK_ERROR,
                  endpoint: i,
                  response: r,
                  state: c,
                  status: l,
                  message: ce(l || 400) || a,
                });
              n({ state: c, status: l, body: r, message: a });
            }
          };
        };
      if (
        ((e.onload = r("complete")),
        (e.onerror = e.ontimeout = r("error")),
        e.open(t.method, i),
        "arraybuffer" === t.responseType && (e.responseType = "arraybuffer"),
        t.timeout && (e.timeout = t.timeout),
        !t.legacy) &&
        ((e.withCredentials = t.withCredentials), t.headers)
      )
        for (var a in t.headers) (s = t.headers[a]), e.setRequestHeader(a, s);
      setTimeout(function () {
        e.send(t.data);
      }, 0);
    });
  }
  function pe(t) {
    var e,
      i = "function" == typeof t.url ? t.url() : t.url,
      n = new Headers();
    if (
      ("json" === t.responseType && n.set("content-type", "application/json"),
      t.headers)
    )
      for (var o in t.headers) (e = t.headers[o]), n.set(o, e);
    var s = {
      method: t.method,
      credentials: "include",
      body: t.data,
      headers: n,
    };
    if (t.pst) {
      var r = {};
      "token-request" === t.pst
        ? (r = { version: 1, operation: "token-request" })
        : "token-redemption" === t.pst
        ? (r = {
            version: 1,
            operation: "token-redemption",
            refreshPolicy: "refresh",
          })
        : "send-redemption-record" === t.pst &&
          (r = {
            version: 1,
            operation: "send-redemption-record",
            issuers: [ut.pstIssuer],
          }),
        (s.privateToken = r);
    }
    return new Promise(function (e, n) {
      fetch(i, s)
        .then(function (o) {
          return 200 !== o.status
            ? n({
                event: it.NETWORK_ERROR,
                endpoint: i,
                response: o,
                state: 4,
                status: o.status,
                message: ce(o.status || 400),
              })
            : ("json" === t.responseType ? o.json() : o.text()).then(function (
                t
              ) {
                e({
                  state: 4,
                  status: o.status,
                  body: t,
                  message: ce(o.status || 400),
                });
              });
        })
        ["catch"](function (t) {
          n({
            event: it.NETWORK_ERROR,
            endpoint: i,
            response: t.error,
            state: 4,
            status: 400,
            message: ce(400),
          });
        });
    });
  }
  var fe = function (t, e) {
      if (
        ("object" == typeof t && e === undefined && (t = (e = t).url),
        null === t)
      )
        throw new Error("Url missing");
      return ue("GET", t, e);
    },
    me = function (t, e) {
      if (
        ("object" == typeof t && e === undefined && (t = (e = t).url),
        null === t)
      )
        throw new Error("Url missing");
      return ue("POST", t, e);
    },
    ye = function (t) {
      return t.toLowerCase().match(/\.(?:jpg|gif|png|jpeg|svg)$/g)
        ? "image"
        : t.toLowerCase().match(/\.(?:js)$/g)
        ? "script"
        : "file";
    },
    ge = function (t) {
      if (ut.assethost && t.indexOf(ct.assetDomain) >= 0)
        return ut.assethost + t.replace(ct.assetDomain, "");
      if (ut.imghost && t.indexOf("imgs") >= 0) {
        var e =
          t.indexOf(".ai") >= 0 ? t.indexOf(".ai") + 3 : t.indexOf(".com") + 4;
        return ut.imghost + t.substr(e, t.length);
      }
      return t;
    },
    ve = ["svg", "gif", "png"];
  function be(t, e) {
    e = e || {};
    var i,
      n = t;
    if (0 === n.indexOf("data:image"))
      for (var o = !1, s = ve.length, r = -1; r++ < s && !o; )
        (o = n.indexOf(ve[r]) >= 0) && (i = ve[r]);
    else i = n.substr(n.lastIndexOf(".") + 1, n.length);
    !!(
      !document.createElementNS ||
      !document.createElementNS("http://www.w3.org/2000/svg", "svg")
        .createSVGRect
    ) &&
      e.fallback &&
      (e.fallback.indexOf(".") >= 0
        ? (i = (n = e.fallback).substr(n.lastIndexOf(".") + 1, n.length))
        : ((n = t.substr(0, t.indexOf(i)) + e.fallback), (i = e.fallback))),
      e.prefix && (n = e.prefix + "/" + n),
      (this.attribs = { crossOrigin: e.crossOrigin || null }),
      (this.id = n),
      (this.src = ge(n)),
      (this.ext = i),
      (this.width = 0),
      (this.height = 0),
      (this.aspect = 0),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] });
  }
  function we(t, e, i) {
    for (var n = t[e], o = n.length, s = null; --o > -1; )
      (s = n[o]), n.splice(o, 1), s(i);
    "error" === e ? (t.load = []) : (t.error = []);
  }
  function xe(t, e) {
    var i = t;
    e || (e = {}),
      e.prefix && (i = e.prefix + "/" + t),
      (this.attribs = {
        defer: e.defer || null,
        async: e.async || null,
        crossOrigin: e.crossOrigin || null,
        integrity: e.integrity || null,
      }),
      (this.id = i),
      (this.src = ge(i)),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] });
  }
  function Ce(t, e, i) {
    for (var n = t[e], o = n.length, s = null; --o > -1; )
      (s = n[o]), n.splice(o, 1), s(i);
    "error" === e ? (t.load = []) : (t.error = []);
  }
  function ke(t, e) {
    var i = t;
    e || (e = {}),
      e.prefix && (i = e.prefix + "/" + t),
      (this.responseType = e.responseType),
      (this.id = i),
      (this.src = ge(i)),
      (this.loaded = !1),
      (this.error = !1),
      (this.cb = { load: [], error: [] }),
      (this.data = null);
  }
  function _e(t, e, i) {
    for (var n = t[e], o = n.length, s = null; --o > -1; )
      (s = n[o]), n.splice(o, 1), s(i);
    "error" === e ? (t.load = []) : (t.error = []);
  }
  (be.prototype.load = function () {
    return ("svg" === this.ext ? this._loadSvg() : this._loadImg())["catch"](
      function (t) {
        throw (wt("Asset failed", "error", "assets", { error: t }), t);
      }
    );
  }),
    (be.prototype._loadSvg = function () {
      var t,
        e = this,
        i = this.src,
        n = this.id;
      if (0 === i.indexOf("data:image/svg+xml")) {
        var o = i.slice("data:image/svg+xml,".length);
        t = Promise.resolve(decodeURIComponent(o));
      } else
        t = fe(i).then(function (t) {
          return t.body;
        });
      return t
        .then(function (t) {
          var i = new DOMParser().parseFromString(
              t,
              "image/svg+xml"
            ).documentElement,
            n = parseInt(i.getAttribute("width")),
            o = parseInt(i.getAttribute("height"));
          return e._imgLoaded(i, n, o), e;
        })
        ["catch"](function (t) {
          e.error = !0;
          var i =
            (t && t.message ? t.message : t || "Loading Error") + ": " + n;
          throw (we(e.cb, "error", i), i);
        });
    }),
    (be.prototype._loadImg = function () {
      var t = this,
        e = this.attribs,
        i = this.src,
        n = this.id;
      return new Promise(function (o, s) {
        var r = new Image();
        e.crossOrigin && (r.crossOrigin = e.crossOrigin),
          (r.onerror = function () {
            (t.error = !0), (r.onload = r.onerror = null);
            var e = "Loading Error: " + n;
            we(t.cb, "error", e), s(e);
          }),
          (r.onload = function () {
            t.loaded ||
              (t._imgLoaded(r, r.width, r.height),
              (r.onload = r.onerror = null),
              o(t));
          }),
          (r.src = i),
          r.complete && r.onload();
      });
    }),
    (be.prototype._imgLoaded = function (t, e, i) {
      (this.element = new Yt(t)),
        (this.width = e),
        (this.height = i),
        (this.aspect = e / i),
        (this.loaded = !0),
        we(this.cb, "load", this);
    }),
    (be.prototype.onload = function (t) {
      this.error || (this.loaded ? t(this) : this.cb.load.push(t));
    }),
    (be.prototype.onerror = function (t) {
      (this.loaded && !this.error) ||
        (this.error ? t(this) : this.cb.error.push(t));
    }),
    (xe.prototype.load = function () {
      var t = this,
        e = this.attribs,
        i = this.src,
        n = this.id;
      return new Promise(function (o, s) {
        var r = document.createElement("script");
        (t.element = r),
          (r.onerror = function () {
            (t.error = !0),
              (r.onload = r.onreadystatechange = r.onerror = null);
            var e = "Loading Error: " + n;
            Ce(t.cb, "error", e), s(e);
          }),
          (r.onload = r.onreadystatechange =
            function () {
              this.loaded ||
                (r.readyState &&
                  "loaded" !== r.readyState &&
                  "complete" !== r.readyState) ||
                ((t.loaded = !0),
                (r.onload = r.onreadystatechange = r.onerror = null),
                document.body.removeChild(r),
                Ce(t.cb, "load", t),
                o(t));
            }),
          (r.type = "text/javascript"),
          (r.src = i),
          e.crossOrigin && (r.crossorigin = e.crossOrigin),
          e.async && (r.async = !0),
          e.defer && (r.defer = !0),
          e.integrity && (r.integrity = e.integrity),
          document.body.appendChild(r),
          r.complete && r.onload();
      });
    }),
    (xe.prototype.onload = function (t) {
      this.error || (this.loaded ? t(this) : this.cb.load.push(t));
    }),
    (xe.prototype.onerror = function (t) {
      (this.loaded && !this.error) ||
        (this.error ? t(this) : this.cb.error.push(t));
    }),
    (ke.prototype.load = function () {
      var t = this,
        e = this.src,
        i = this.id;
      return new Promise(function (n, o) {
        var s = {};
        "arraybuffer" === t.responseType
          ? (s.responseType = "arraybuffer")
          : e.indexOf("json") >= 0 && (s.responseType = "json"),
          fe(e, s)
            .then(function (e) {
              (t.loaded = !0), (t.data = e.body), _e(t.cb, "load", t), n(t);
            })
            ["catch"](function (e) {
              t.error = !0;
              var n = (e && e.message ? e.message : "Loading Error") + ": " + i;
              _e(t.cb, "error", n), o(n);
            });
      });
    }),
    (ke.prototype.onload = function (t) {
      this.error || (this.loaded ? t(this) : this.cb.load.push(t));
    }),
    (ke.prototype.onerror = function (t) {
      (this.loaded && !this.error) ||
        (this.error ? t(this) : this.cb.error.push(t));
    });
  var Ee = [],
    Se = {
      add: function (t, e) {
        var i = ye(t);
        return Se[i] ? Se[i](t, e) : Promise.resolve(null);
      },
      batch: function (t, e) {
        for (var i = [], n = -1; ++n < t.length; ) {
          var o = t[n];
          i.push(Se.add(o, e));
        }
        return Promise.all(i)["finally"](function () {
          i = [];
        });
      },
      image: function (t, e) {
        var i = new be(t, e);
        return Ee.push(i), i.load();
      },
      script: function (t, e) {
        var i = new xe(t, e);
        return Ee.push(i), i.load();
      },
      file: function (t, e) {
        var i = new ke(t, e);
        return Ee.push(i), i.load();
      },
      retrieve: function (t) {
        return new Promise(function (e, i) {
          for (var n = Ee.length, o = !1, s = null; --n > -1 && !o; )
            o =
              (s = Ee[n]).id === t ||
              -1 !== s.id.indexOf("/" === t[0] ? "" : "/" + t);
          if (!o) return e(null);
          s.onload(e), s.onerror(i);
        });
      },
    },
    Ae = [],
    Le = !1,
    Be = !1;
  function He(t) {
    var e = Array.prototype.slice.call(arguments, 1);
    !0 !== Be &&
    "interactive" !== document.readyState &&
    "loaded" !== document.readyState &&
    "complete" !== document.readyState
      ? (Ae.push({ fn: t, args: e }), !1 === Le && Me())
      : setTimeout(function () {
          t(e);
        }, 1);
  }
  function Me() {
    document.addEventListener
      ? (document.addEventListener("DOMContentLoaded", Te),
        window.addEventListener("load", Te))
      : (document.attachEvent("onreadystatechange", Oe),
        window.attachEvent("onload", Te)),
      (Le = !0);
  }
  function Oe() {
    ("interactive" !== document.readyState &&
      "loaded" !== document.readyState &&
      "complete" !== document.readyState) ||
      Te();
  }
  function Te() {
    if (!1 === Be) {
      for (var t = 0; t < Ae.length; t++) Ae[t].fn.apply(null, Ae[t].args);
      Ae = [];
    }
    (Be = !0),
      document.removeEventListener
        ? (document.removeEventListener("DOMContentLoaded", Te),
          window.removeEventListener("load", Te))
        : (document.detachEvent("onreadystatechange", Oe),
          window.detachEvent("onload", Te));
  }
  var Ve = new Yt(document),
    Re = new Yt(window),
    Pe = {
      __proto__: null,
      Loader: Se,
      BaseComponent: Ut,
      DomComponent: Xt,
      DomElement: Yt,
      Extend: Qt,
      Normalize: Wt,
      Dom: {
        __proto__: null,
        Window: Re,
        Document: Ve,
        Element: Yt,
        Ready: He,
        Find: function (t) {
          for (
            var e, i, n = null, o = !1, s = t.split(" "), r = 0;
            r < s.length;
            r++
          )
            if (
              ((e = s[r]).indexOf("#") >= 0 &&
                (n = document.getElementById(e.replace("#", ""))),
              e.indexOf(".") >= 0)
            )
              if ((null === n && (n = document), o)) {
                for (var a = [], l = 0; l < n.length; l++) {
                  i = n[l].getElementsByClassName(e.replace(".", ""));
                  for (var c = 0; c < i.length; c++) a.push(i[c]);
                }
                (n = a), (a = []);
              } else
                (n = n.getElementsByClassName(e.replace(".", ""))), (o = !0);
          if (!0 === o) {
            if (1 === n.length) return n[0];
            for (var h = [], u = 0; u < n.length; u++) h.push(n[u]);
            return h;
          }
          return n;
        },
      },
    };
  function De(t, e) {
    (this._period = t),
      (this._interval = e),
      (this._date = []),
      (this._data = []),
      (this._prevTimestamp = 0),
      (this._meanPeriod = 0),
      (this._meanCounter = 0);
  }
  (De.prototype.getMeanPeriod = function () {
    return this._meanPeriod;
  }),
    (De.prototype.getData = function () {
      return this._cleanStaleData(), this._data;
    }),
    (De.prototype.getSize = function () {
      return this._cleanStaleData(), this._data.length;
    }),
    (De.prototype.getCapacity = function () {
      return 0 === this._period
        ? this._interval
        : Math.ceil(this._interval / this._period);
    }),
    (De.prototype.push = function (t, e) {
      this._cleanStaleData();
      var i = 0 === this._date.length;
      if (
        (t - (this._date[this._date.length - 1] || 0) >= this._period &&
          (this._date.push(t), this._data.push(e)),
        !i)
      ) {
        var n = t - this._prevTimestamp;
        (this._meanPeriod =
          (this._meanPeriod * this._meanCounter + n) / (this._meanCounter + 1)),
          this._meanCounter++;
      }
      this._prevTimestamp = t;
    }),
    (De.prototype._cleanStaleData = function () {
      for (var t = Date.now(), e = this._date.length - 1; e >= 0; e--) {
        if (t - this._date[e] >= this._interval) {
          this._date.splice(0, e + 1), this._data.splice(0, e + 1);
          break;
        }
      }
    });
  var Fe = {
      touchstart: "ts",
      touchend: "te",
      touchmove: "tm",
      touchcancel: "tc",
    },
    $e = { mousedown: "md", mouseup: "mu", mousemove: "mm" },
    Ie = { keydown: "kd", keyup: "ku" },
    je = { devicemotion: "dm" },
    Ne = function (t, e) {
      var i = $e[t],
        n = null;
      return function (t) {
        (n = (function (t) {
          return [t.windowX, t.windowY, Date.now()];
        })(t)),
          e(i, n);
      };
    },
    ze = function (t, e) {
      var i = Fe[t],
        n = null;
      return function (t) {
        (n = (function (t) {
          var e = [];
          try {
            var i, n;
            if (
              (t.touches && t.touches.length >= 1
                ? (i = t.touches)
                : t.changedTouches &&
                  t.changedTouches.length >= 1 &&
                  (i = t.changedTouches),
              i)
            ) {
              for (var o = 0; o < i.length; o++)
                (n = Wt.eventCoords(i[o])) &&
                  e.push([i[o].identifier, n.x, n.y]);
              e.push(Date.now());
            }
            return e;
          } catch (Is) {
            return e;
          }
        })(t)),
          e(i, n);
      };
    },
    Ze = function (t, e) {
      var i = Ie[t],
        n = null;
      return function (t) {
        (n = (function (t) {
          return [t.keyNum, Date.now()];
        })(t)),
          e(i, n);
      };
    },
    Ue = function (t, e) {
      var i = je[t],
        n = null,
        o = [];
      return function (t) {
        (n = (function (t, e) {
          (t.acceleration === undefined ||
            (t.acceleration && t.acceleration.x === undefined)) &&
            (t.acceleration = { x: 0, y: 0, z: 0 });
          (t.rotationRate === undefined ||
            (t.rotationRate && t.rotationRate.alpha === undefined)) &&
            (t.rotationRate = { alpha: 0, beta: 0, gamma: 0 });
          var i = [
              t.acceleration.x,
              t.acceleration.y,
              t.acceleration.z,
              t.rotationRate.alpha,
              t.rotationRate.beta,
              t.rotationRate.gamma,
              Date.now(),
            ],
            n = [];
          if (0 === e.length) (e = i), (n = i);
          else {
            for (var o, s = 0, r = 0; r < 6; r++)
              (o = e[r] - i[r]), n.push(i[r]), (s += Math.abs(o));
            if ((n.push(Date.now()), (e = i), s <= 0)) return null;
          }
          return { motion: n, prevmotion: e };
        })(t, o)),
          null !== n && ((o = n.prevmotion), (n = n.motion), e(i, n));
      };
    };
  function We() {
    (this._manifest = {}),
      (this.state = {
        timeBuffers: {},
        loadTime: Date.now(),
        recording: !1,
        initRecord: !1,
        record: { mouse: !0, touch: !0, keys: !1, motion: !1 },
      }),
      (this._recordEvent = this._recordEvent.bind(this));
  }
  (We.prototype.record = function (t, e, i, n) {
    if (
      ((this._manifest.st = Date.now()),
      (this.state.record.mouse = t === undefined ? this.state.record.mouse : t),
      (this.state.record.touch = i === undefined ? this.state.record.touch : i),
      (this.state.record.keys = e === undefined ? this.state.record.keys : e),
      (this.state.record.motion =
        n === undefined ? this.state.record.motion : n),
      !1 === this.state.initRecord)
    ) {
      var o = new Yt(document.body);
      this.state.record.mouse &&
        (o.addEventListener(
          "mousedown",
          Ne("mousedown", this._recordEvent),
          !0
        ),
        o.addEventListener("mousemove", Ne("mousemove", this._recordEvent), !0),
        o.addEventListener("mouseup", Ne("mouseup", this._recordEvent), !0)),
        !0 === this.state.record.keys &&
          (o.addEventListener("keyup", Ze("keyup", this._recordEvent), !0),
          o.addEventListener("keydown", Ze("keydown", this._recordEvent), !0)),
        this.state.record.touch &&
          !0 === tt.Browser.hasEvent("touchstart", document.body) &&
          (o.addEventListener(
            "touchstart",
            ze("touchstart", this._recordEvent),
            !0
          ),
          o.addEventListener(
            "touchmove",
            ze("touchmove", this._recordEvent),
            !0
          ),
          o.addEventListener(
            "touchend",
            ze("touchend", this._recordEvent),
            !0
          )),
        this.state.record.motion &&
          !0 === tt.Browser.hasEvent("devicemotion", window) &&
          o.addEventListener(
            "devicemotion",
            Ue("devicemotion", this._recordEvent),
            !0
          ),
        (this.state.initRecord = !0);
    }
    this.state.recording = !0;
  }),
    (We.prototype.stop = function () {
      this.state.recording = !1;
    }),
    (We.prototype.time = function () {
      return this.state.loadTime;
    }),
    (We.prototype.getData = function () {
      for (var t in this.state.timeBuffers)
        (this._manifest[t] = this.state.timeBuffers[t].getData()),
          (this._manifest[t + "-mp"] =
            this.state.timeBuffers[t].getMeanPeriod());
      return this._manifest;
    }),
    (We.prototype.setData = function (t, e) {
      this._manifest[t] = e;
    }),
    (We.prototype.resetData = function () {
      (this._manifest = {}), (this.state.timeBuffers = {});
    }),
    (We.prototype.circBuffPush = function (t, e) {
      this._recordEvent(t, e);
    }),
    (We.prototype._recordEvent = function (t, e) {
      if (!1 !== this.state.recording)
        try {
          var i = e[e.length - 1];
          this.state.timeBuffers[t] ||
            (this.state.timeBuffers[t] = new De(16, 15e3)),
            this.state.timeBuffers[t].push(i, e);
        } catch ($s) {
          xt("motion", $s);
        }
    });
  var Ke = new We();
  function qe(t) {
    (t = t || {}),
      (this.x = t.x || 0),
      (this.y = t.y || 0),
      (this.rotate = this.rotate.bind(this)),
      (this.getDistance = this.getDistance.bind(this)),
      (this.radius = 0),
      (this.tolerance = 0),
      (this.fill = !1),
      (this.stroke = !1),
      (this.fillColor = "#fff"),
      (this.strokeColor = "#fff"),
      (this.strokeWidth = 1);
  }
  function Ge(t, e, i) {
    Qt.self(this, qe, t),
      (this.handleIn = new qe(e)),
      (this.handleOut = new qe(i)),
      (this.prev = null),
      (this.next = null),
      (this.index = 0);
  }
  function Je(t) {
    (this._closed = !1),
      (this.stroke = !1),
      (this.fill = !1),
      (this.fillColor = "#fff"),
      (this.strokeColor = "#fff"),
      (this.strokeWidth = 1),
      (this.showPoints = !1),
      (this.pointRadius = 0),
      (this._head = null),
      (this._tail = null),
      (this.segments = []),
      (this.addPoint = this.addPoint.bind(this)),
      (this.removePoint = this.removePoint.bind(this)),
      (this.forEachPoint = this.forEachPoint.bind(this)),
      (this.getBounding = this.getBounding.bind(this)),
      (this.getCenter = this.getCenter.bind(this)),
      (this.destroy = this.destroy.bind(this)),
      t && t.length && this.addPoints(t);
  }
  function Ye(t, e) {
    if (e.y <= t.y) {
      if (e.next.y > t.y && Qe(e, e.next, t) > 0) return 1;
    } else if (e.next.y <= t.y && Qe(e, e.next, t) < 0) return -1;
    return 0;
  }
  function Qe(t, e, i) {
    return (e.x - t.x) * (i.y - t.y) - (i.x - t.x) * (e.y - t.y);
  }
  function Xe(t) {
    Qt.self(this, Je),
      (this.bounding = { left: 0, top: 0, width: 0, height: 0 }),
      (this.svgData = (function (t) {
        if ("string" != typeof t) return null;
        var e = decodeURIComponent(t),
          i = e.indexOf('d="') + 3,
          n = e.indexOf('"', i),
          o = t.slice(i, n),
          s = (function (t) {
            var e = 0,
              i = 0,
              n = 0,
              o = 0,
              s = t.match(/<svg[^>]*width=['"]([^'"]+)['"]/),
              r = t.match(/<svg[^>]*height=['"]([^'"]+)['"]/);
            if (
              s &&
              r &&
              ((n = parseFloat(s[1])),
              (o = parseFloat(r[1])),
              !isNaN(n) && !isNaN(o))
            )
              return { left: e, top: i, width: n, height: o };
            var a = t.match(/<svg[^>]*viewBox=['"]([^'"]+)['"]/);
            if (a) {
              var l = a[1].split(" ");
              if (
                ((e = parseFloat(l[0])),
                (i = parseFloat(l[1])),
                (n = parseFloat(l[2])),
                (o = parseFloat(l[3])),
                !(isNaN(e) || isNaN(i) || isNaN(n) || isNaN(o)))
              )
                return { left: e, top: i, width: n, height: o };
            }
            return { left: 0, top: 0, width: 0, height: 0 };
          })(e);
        return { pathCommands: ti(o), viewport: s };
      })(t)),
      this.svgData &&
        ((this.bounding.width = this.svgData.viewport.width),
        (this.bounding.height = this.svgData.viewport.height));
  }
  function ti(t) {
    for (
      var e = t.match(/[a-df-zA-DF-Z][^a-df-zA-DF-Z]*/g) || [], i = [], n = 0;
      n < e.length;

    ) {
      for (
        var o = e[n],
          s = o[0],
          r = o
            .slice(1)
            .trim()
            .split(/[\s,]+/),
          a = [],
          l = 0;
        l < r.length;

      )
        a.push(parseFloat(r[l])), l++;
      i.push({ type: s, params: a }), n++;
    }
    return i;
  }
  (qe.prototype.rotate = function (t, e) {
    var i = Pt(e),
      n = Math.sin(i),
      o = Math.cos(i),
      s = this.x - t.x,
      r = this.y - t.y;
    (this.x = s * o - r * n + t.x), (this.y = s * n + r * o + t.y);
  }),
    (qe.prototype.getDistance = function (t) {
      return Math.sqrt(Math.pow(this.x - t.x, 2) + Math.pow(this.y - t.y, 2));
    }),
    (qe.prototype.getAngle = function (t) {
      var e = t.x - this.x,
        i = t.y - this.y,
        n = Dt(Math.atan2(i, e));
      return n < 0 && (n += 360), n;
    }),
    (qe.prototype.hitTest = function (t) {
      return this.radius + this.tolerance >= this.getDistance(t);
    }),
    (qe.prototype.restrict = function (t, e, i, n) {
      if ("x" !== t && "y" !== t)
        throw new Error("Point.restrict requires a value: x or y");
      return (
        e + this[t] < i
          ? (e = this[t] - i)
          : e + this[t] > n && (e = n - this[t]),
        this[t] + e
      );
    }),
    (qe.prototype.draw = function (t) {
      t.ctx.beginPath(),
        t.ctx.arc(this.x, this.y, this.radius / t.scale, 0, 2 * Math.PI, !1),
        this.fill && ((t.ctx.fillStyle = this.fillColor), t.ctx.fill()),
        this.stroke &&
          ((t.ctx.strokeStyle = this.strokeColor),
          (t.ctx.lineWidth = this.strokeWidth / t.scale),
          t.ctx.stroke());
    }),
    Qt.proto(Ge, qe),
    (Ge.prototype.set = function (t, e, i) {
      (this.x = t.x || this.x),
        (this.y = t.y || this.y),
        e === undefined
          ? ((this.handleIn.x = this.x), (this.handleIn.y = this.y))
          : ((this.handleIn.x = e.x), (this.handleIn.y = e.y)),
        i === undefined
          ? ((this.handleOut.x = this.x), (this.handleOut.y = this.y))
          : ((this.handleOut.x = i.x), (this.handleOut.y = i.y));
    }),
    (Ge.prototype.clone = function () {
      var t = { x: this.x, y: this.y },
        e = { x: this.handleIn.x, y: this.handleIn.y },
        i = { x: this.handleOut.x, y: this.handleOut.y },
        n = new Ge();
      return (
        e.x === i.x && e.y === i.y ? n.set(t) : n.set(t, e, i),
        (n.index = this.index),
        (n.prev = this.prev),
        (n.next = this.next),
        (n.radius = this.radius),
        (n.tolerance = this.tolerance),
        (n.fill = this.fill),
        (n.stroke = this.stroke),
        (n.fillColor = this.fillColor),
        (n.strokeColor = this.strokeColor),
        (n.strokeWidth = this.strokeWidth),
        n
      );
    }),
    (Ge.prototype.move = function (t, e) {
      (this.x += t),
        (this.y += e),
        (this.handleIn.x += t),
        (this.handleIn.y += e),
        (this.handleOut.x += t),
        (this.handleOut.y += e);
    }),
    (Ge.prototype.render = function (t) {
      this.handleIn.x !== this.x &&
        this.handleIn.y !== this.y &&
        this.handleIn.draw(t),
        this.handleOut.x !== this.x &&
          this.handleOut.y !== this.y &&
          this.handleOut.draw(t),
        this.draw(t);
    }),
    (Je.prototype.addPoint = function (t) {
      var e;
      return (
        t instanceof Ge
          ? (e = t.clone())
          : ((e = new Ge()).set(t), (e.radius = this.pointRadius)),
        (e.index = this.segments.length),
        null === this._head
          ? ((this._head = e), (this._tail = e))
          : ((e.prev = this._tail), (this._tail.next = e), (this._tail = e)),
        (this._head.prev = this._tail),
        (this._tail.next = this._head),
        this.segments.push(e),
        e
      );
    }),
    (Je.prototype.addPoints = function (t) {
      for (var e = 0; e < t.length; e++) this.addPoint(t[e]);
      t = null;
    }),
    (Je.prototype.setPoints = function (t, e) {
      e === undefined && (e = 0);
      for (var i = e; i < t.length; i++)
        this.segments[i] === undefined
          ? this.addPoint(t[i])
          : this.segments[i].set(t[i]);
      (t = null), (e = null);
    }),
    (Je.prototype.setPointRadius = function (t) {
      for (var e = -1; ++e < this.segments.length; ) undefined.radius = t;
    }),
    (Je.prototype.removePoint = function (t) {
      for (var e = this.segments.length, i = null; --e > -1 && null === i; )
        (i = this.segments[e]),
          t.x === i.x &&
            t.y === i.y &&
            (this.segments.splice(e, 1),
            i === this._head && i === this._tail
              ? ((this._head = null), (this._tail = null))
              : i === this.head
              ? ((this._head = this._head.next), (this._head.prev = null))
              : i === this._tail
              ? ((this._tail = this._tail.prev), (this._tail.next = null))
              : ((i.prev.next = i.next), (i.next.prev = i.prev)));
      return i;
    }),
    (Je.prototype.forEachPoint = function (t, e) {
      if (0 !== this.segments.length && this.segments)
        for (var i, n = !1, o = this.segments.length; --o > -1 && !n; )
          (i = this.segments[e ? this.segments.length - 1 - o : o]),
            t && (n = t(i));
    }),
    (Je.prototype.close = function (t) {
      this._closed = t;
    }),
    (Je.prototype.isClosed = function () {
      return this._closed;
    }),
    (Je.prototype.start = function () {
      return this._head;
    }),
    (Je.prototype.end = function () {
      return this._tail;
    }),
    (Je.prototype.rotate = function (t, e) {
      e === undefined && (e = this.getCenter());
      for (var i, n = -1; ++n < this.segments.length; )
        (i = this.segments[n]).handleIn.rotate(e, t),
          i.rotate(e, t),
          i.handleOut.rotate(e, t);
    }),
    (Je.prototype.move = function (t, e) {
      for (var i = -1; ++i < this.segments.length; )
        this.segments[i].move(t, e);
    }),
    (Je.prototype.getPoint = function (t) {
      return this.segments[t];
    }),
    (Je.prototype.getLength = function () {
      return this.segments.length;
    }),
    (Je.prototype.getCenter = function () {
      var t = this.getBounding();
      return {
        x: (t.right - t.left) / 2 + t.left,
        y: (t.bottom - t.top) / 2 + t.top,
      };
    }),
    (Je.prototype.getDimensions = function () {
      var t = this.getBounding();
      return { width: t.right - t.left, height: t.bottom - t.top };
    }),
    (Je.prototype.getBounding = function () {
      for (
        var t, e = null, i = null, n = null, o = null, s = -1;
        ++s < this.segments.length;

      )
        (t = this.segments[s]),
          (null === e || t.x < e) && (e = t.x),
          (null === i || t.x > i) && (i = t.x),
          (null === n || t.y < n) && (n = t.y),
          (null === o || t.y > o) && (o = t.y);
      return { left: e, top: n, bottom: o, right: i };
    }),
    (Je.prototype.draw = function (t) {
      t.ctx.beginPath();
      for (var e = -1, i = this.segments.length; ++e < i; ) {
        var n = this.segments[e],
          o =
            n.x !== n.handleIn.x ||
            n.y !== n.handleIn.y ||
            n.prev.x !== n.prev.handleOut.x ||
            n.prev.y !== n.prev.handleOut.y;
        if (0 === n.index) t.ctx.moveTo(n.x, n.y);
        else if (o) {
          t.ctx.bezierCurveTo(
            n.prev.handleOut.x,
            n.prev.handleOut.y,
            n.handleIn.x,
            n.handleIn.y,
            n.x,
            n.y
          ),
            (n.next.x !== n.next.handleIn.x ||
              n.next.y !== n.next.handleIn.y) &&
              this._closed &&
              this._tail === n &&
              t.ctx.bezierCurveTo(
                n.handleOut.x,
                n.handleOut.y,
                n.next.handleIn.x,
                n.next.handleIn.y,
                n.next.x,
                n.next.y
              );
        } else t.ctx.lineTo(n.x, n.y);
      }
      this._closed && t.ctx.closePath(),
        this.fill && ((t.ctx.fillStyle = this.fillColor), t.ctx.fill()),
        this.stroke &&
          ((t.ctx.strokeStyle = this.strokeColor),
          (t.ctx.lineWidth = this.strokeWidth / t.scale),
          t.ctx.stroke()),
        !0 === this.showPoints &&
          this.forEachPoint(function (e) {
            (e.fill = !0), e.render(t);
          });
    }),
    (Je.prototype.hitTest = function (t, e) {
      e === undefined && (e = {});
      var i,
        n = !1,
        o = 0,
        s = !1;
      (e.segment = e.segment === undefined || e.segment),
        (e.path = e.path === undefined || e.path);
      for (var r = -1; ++r < this.segments.length; )
        (i = this.segments[r]),
          e.path && this._closed && (o += Ye(t, i)),
          e.segment && i.hitTest(t) && (s = i);
      return (
        e.path && 0 !== o && !1 === s
          ? (n = { type: "path", geometry: this })
          : s && (n = { type: "segment", geometry: s }),
        n
      );
    }),
    (Je.prototype.destroy = function () {
      for (var t = this.segments.length; --t > -1; ) this.segments.splice(t, 1);
      return (
        (this._head = null), (this._tail = null), (this.segments = []), null
      );
    }),
    Qt.proto(Xe, Je),
    (Xe.prototype.size = function (t, e) {
      t
        ? (e || (e = t), (this.bounding.width = t), (this.bounding.height = e))
        : ((this.bounding.width = this.svgData.viewport.width),
          (this.bounding.height = this.svgData.viewport.height));
    }),
    (Xe.prototype.move = function (t, e) {
      t && (e || (e = t), (this.bounding.left = t), (this.bounding.top = e));
    }),
    (Xe.prototype.destroy = function () {
      (this.bounding = { left: 0, top: 0, width: 0, height: 0 }),
        (this.svgData = null);
    }),
    (Xe.prototype.getBounding = function () {
      return this.bounding;
    }),
    (Xe.prototype.drawSVG = function (t) {
      ei(t, this.svgData, this.bounding);
    });
  var ei = function (t, e, i) {
    if (t && e && i) {
      var n = t.ctx,
        o = 0,
        s = 0,
        r = e.pathCommands,
        a = e.viewport,
        l = i.width / a.width,
        c = i.height / a.height,
        h = Math.min(l, c);
      n.translate(i.left + a.left, i.top + a.top), n.beginPath();
      for (var u = 0; u < r.length; ) {
        var d = r[u].params;
        switch (r[u].type) {
          case "M":
            n.moveTo(d[0] * h, d[1] * h), (o = d[0] * h), (s = d[1] * h);
            break;
          case "m":
            n.moveTo(o + d[0] * h, s + d[1] * h),
              (o += d[0] * h),
              (s += d[1] * h);
            break;
          case "L":
            n.lineTo(d[0] * h, d[1] * h), (o = d[0] * h), (s = d[1] * h);
            break;
          case "l":
            n.lineTo(o + d[0] * h, s + d[1] * h),
              (o += d[0] * h),
              (s += d[1] * h);
            break;
          case "H":
            n.lineTo(d[0] * h, s), (o = d[0] * h);
            break;
          case "h":
            n.lineTo(o + d[0] * h, s), (o += d[0] * h);
            break;
          case "V":
            n.lineTo(o, d[0] * h), (s = d[0] * h);
            break;
          case "v":
            n.lineTo(o, s + d[0] * h), (s += d[0] * h);
            break;
          case "C":
            n.bezierCurveTo(
              d[0] * h,
              d[1] * h,
              d[2] * h,
              d[3] * h,
              d[4] * h,
              d[5] * h
            ),
              (o = d[4] * h),
              (s = d[5] * h);
            break;
          case "c":
            n.bezierCurveTo(
              o + d[0] * h,
              s + d[1] * h,
              o + d[2] * h,
              s + d[3] * h,
              o + d[4] * h,
              s + d[5] * h
            ),
              (o += d[4] * h),
              (s += d[5] * h);
            break;
          case "Z":
          case "z":
            n.closePath();
        }
        u++;
      }
      n.stroke();
    }
  };
  function ii() {
    Qt.self(this, qe),
      (this.radius = 0),
      (this.tolerance = 0),
      (this.fill = !1),
      (this.stroke = !1),
      (this.fillColor = "#fff"),
      (this.strokeWidth = 1),
      (this.hovered = !1),
      (this.complete = !1);
  }
  function ni() {
    Qt.self(this, Yt, "canvas");
    var t = this;
    (this.element = this.dom),
      (this.ctx = this.element.getContext("2d")),
      (this.scale = 1),
      (this.dpr = window.devicePixelRatio || 1),
      (this.clearColor = "#fff"),
      (this.ctx.roundedRect = function (e, i, n, o, s) {
        var r = n > 0 ? s : -s,
          a = o > 0 ? s : -s;
        t.ctx.beginPath(),
          t.ctx.moveTo(e + r, i),
          t.ctx.lineTo(e + n - r, i),
          t.ctx.quadraticCurveTo(e + n, i, e + n, i + a),
          t.ctx.lineTo(e + n, i + o - a),
          t.ctx.quadraticCurveTo(e + n, i + o, e + n - r, i + o),
          t.ctx.lineTo(e + r, i + o),
          t.ctx.quadraticCurveTo(e, i + o, e, i + o - a),
          t.ctx.lineTo(e, i + a),
          t.ctx.quadraticCurveTo(e, i, e + r, i),
          t.ctx.closePath();
      });
  }
  function oi() {
    this._events = Object.create(null);
  }
  function si(t, e, i, n) {
    this._events[t] || (this._events[t] = []),
      this._events[t].unshift({ fn: e, once: n, context: i });
  }
  function ri(t, e, i) {
    (this.target = t),
      this.setTargetOrigin(i),
      (this.id = e),
      (this.messages = []),
      (this.incoming = []),
      (this.waiting = []),
      (this.isReady = !0),
      (this.queue = []);
  }
  Qt.proto(ii, qe),
    (ii.prototype.draw = function (t) {
      var e = this.radius / t.scale;
      if (this.complete)
        t.ctx.save(),
          t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, e + 2, 0, 2 * Math.PI),
          (t.ctx.strokeStyle = ht.white),
          (t.ctx.fillStyle = ht.white),
          (t.ctx.lineWidth = 2),
          t.ctx.stroke(),
          t.ctx.fill(),
          t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, e + 3, 0, 2 * Math.PI),
          (t.ctx.strokeStyle = ht.outline),
          (t.ctx.lineWidth = 1),
          t.ctx.stroke(),
          t.ctx.restore(),
          this.hovered &&
            (t.ctx.beginPath(),
            t.ctx.arc(this.x, this.y, e + 9, 0, 2 * Math.PI),
            (t.ctx.strokeStyle = ht.white),
            (t.ctx.lineWidth = 2),
            t.ctx.stroke(),
            t.ctx.beginPath(),
            t.ctx.arc(this.x, this.y, e + 10, 0, 2 * Math.PI),
            (t.ctx.strokeStyle = ht.outline),
            (t.ctx.lineWidth = 1),
            t.ctx.stroke());
      else {
        var i = 2.5,
          n = [2.5, 4];
        t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1),
          (t.ctx.strokeStyle = ht.white),
          (t.ctx.lineWidth = 0.5),
          (t.ctx.fillStyle = this.fillColor),
          t.ctx.fill(),
          (t.ctx.strokeStyle = ht.outline),
          (t.ctx.lineWidth = 0.5),
          t.ctx.stroke(),
          t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, e + 2, 0, 2 * Math.PI),
          (t.ctx.strokeStyle = ht.white),
          (t.ctx.lineWidth = 2),
          t.ctx.stroke(),
          t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, e + 3, 0, 2 * Math.PI),
          (t.ctx.strokeStyle = ht.outline),
          (t.ctx.lineWidth = 1),
          t.ctx.stroke(),
          (t.ctx.fillStyle = ht.outline),
          t.ctx.roundedRect(this.x - (e + 5), this.y - 2, n[0], n[1], 2),
          t.ctx.fill(),
          (t.ctx.fillStyle = ht.white),
          t.ctx.roundedRect(
            this.x - (e + 5 - 1),
            this.y - 1,
            n[0],
            n[1] / 2,
            1
          ),
          t.ctx.fill(),
          (t.ctx.fillStyle = ht.outline),
          t.ctx.roundedRect(this.x + e + i, this.y - 2, n[0], n[1], 2),
          t.ctx.fill(),
          (t.ctx.fillStyle = ht.white),
          t.ctx.roundedRect(this.x + e + i - 1, this.y - 1, n[0], n[1] / 2, 1),
          t.ctx.fill(),
          (t.ctx.fillStyle = ht.outline),
          t.ctx.roundedRect(this.x - 2, this.y - e - 5, n[1], n[0], 2),
          t.ctx.fill(),
          (t.ctx.fillStyle = ht.white),
          t.ctx.roundedRect(this.x - 1, this.y - e - 5 + 1, n[1] / 2, n[0], 1),
          t.ctx.fill(),
          (t.ctx.fillStyle = ht.outline),
          t.ctx.roundedRect(this.x - 2, this.y + e + i, n[1], n[0], 2),
          t.ctx.fill(),
          (t.ctx.fillStyle = ht.white),
          t.ctx.roundedRect(this.x - 1, this.y + e + i - 1, n[1] / 2, n[0], 1),
          t.ctx.fill();
      }
    }),
    Qt.proto(ni, Yt),
    (ni.prototype.dimensions = function (t, e) {
      this.css({ width: t, height: e }),
        (this.element.width = Math.round(t / this.scale) * this.dpr),
        (this.element.height = Math.round(e / this.scale) * this.dpr),
        this.ctx.scale(this.dpr, this.dpr),
        (this.width = Math.round(t / this.scale)),
        (this.height = Math.round(e / this.scale));
    }),
    (ni.prototype.clear = function () {
      this.ctx &&
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }),
    (ni.prototype.draw = function () {
      this.ctx &&
        ((this.ctx.fillStyle = this.clearColor),
        this.ctx.fillRect(0, 0, this.element.width, this.element.height));
    }),
    (ni.prototype._destroy = function () {
      this.__destroy(),
        (this.element = null),
        (this.ctx = null),
        (this.width = null),
        (this.height = null);
    }),
    (oi.prototype.on = function (t, e, i) {
      si.call(this, t, e, i, !1);
    }),
    (oi.prototype.once = function (t, e, i) {
      si.call(this, t, e, i, !0);
    }),
    (oi.prototype.off = function (t, e) {
      var i = this._events[t];
      if (i) {
        for (var n = i.length; --n > -1; ) i[n].fn === e && i.splice(n, 1);
        0 === i.length && delete this._events[t];
      }
    }),
    (oi.prototype.emit = function (t) {
      var e = this._events[t];
      if (e) {
        for (
          var i, n = Array.prototype.slice.call(arguments, 1), o = e.length;
          --o > -1;

        )
          (i = e[o]).fn.apply(i.context, n), i.once && e.splice(o, 1);
        0 === e.length && delete this._events[t];
      }
    }),
    (oi.prototype.removeAllListeners = function () {
      this._events = Object.create(null);
    }),
    (ri.prototype._sendMessage = function (t, e) {
      var i = t instanceof HTMLIFrameElement;
      try {
        i
          ? t.contentWindow.postMessage(JSON.stringify(e), this.targetOrigin)
          : t.postMessage(JSON.stringify(e), this.targetOrigin);
      } catch ($s) {
        xt("messaging", $s),
          "*" !== this.targetOrigin &&
            (this.setTargetOrigin("*"), this._sendMessage(t, e));
      }
    }),
    (ri.prototype.setReady = function (t) {
      var e = this;
      (e.isReady = t),
        e.isReady &&
          e.queue.length &&
          (e.queue.forEach(function (t) {
            e._sendMessage.apply(e, t);
          }),
          e.clearQueue());
    }),
    (ri.prototype.clearQueue = function () {
      this.queue = [];
    }),
    (ri.prototype.setID = function (t) {
      this.id = t;
    }),
    (ri.prototype.setTargetOrigin = function (t) {
      this.targetOrigin = "*";
    }),
    (ri.prototype.contact = function (t, e) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      var i = this,
        n = Math.random().toString(36).substr(2),
        o = {
          source: "hcaptcha",
          label: t,
          id: this.id,
          promise: "create",
          lookup: n,
        };
      if (e) {
        if ("object" != typeof e) throw new Error("Message must be an object.");
        o.contents = e;
      }
      return new Promise(function (e, s) {
        i.waiting.push({ label: t, reject: s, resolve: e, lookup: n }),
          i._addToQueue(i.target, o);
      });
    }),
    (ri.prototype.listen = function (t, e) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      for (var i = this.messages.length, n = !1; --i > -1 && !1 === n; )
        this.messages[i].label === t && (n = this.messages[i]);
      !1 === n && ((n = { label: t, listeners: [] }), this.messages.push(n)),
        n.listeners.push(e);
    }),
    (ri.prototype.answer = function (t, e) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      for (var i = this.incoming.length, n = !1; --i > -1 && !1 === n; )
        this.incoming[i].label === t && (n = this.incoming[i]);
      !1 === n && ((n = { label: t, listeners: [] }), this.incoming.push(n)),
        n.listeners.push(e);
    }),
    (ri.prototype.send = function (t, e) {
      var i = this;
      if (!i.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      var n = { source: "hcaptcha", label: t, id: i.id };
      if (e) {
        if ("object" != typeof e) throw new Error("Message must be an object.");
        n.contents = e;
      }
      i._addToQueue(i.target, n);
    }),
    (ri.prototype.check = function (t, e) {
      for (
        var i = [].concat.apply(
            [],
            [this.messages, this.incoming, this.waiting]
          ),
          n = [],
          o = -1;
        ++o < i.length;

      )
        if (i[o].label === t) {
          if (e && i[o].lookup && e !== i[o].lookup) continue;
          n.push(i[o]);
        }
      return n;
    }),
    (ri.prototype.respond = function (t) {
      for (
        var e,
          i,
          n = -1,
          o = 0,
          s = [].concat.apply([], [this.messages, this.incoming, this.waiting]);
        ++n < s.length;

      )
        if (s[n].label === t.label) {
          if (t.lookup && s[n].lookup && t.lookup !== s[n].lookup) continue;
          var r = [];
          if (
            ((e = s[n]),
            t.error && r.push(t.error),
            t.contents && r.push(t.contents),
            t.promise && "create" !== t.promise)
          ) {
            e[t.promise].apply(e[t.promise], r);
            for (var a = this.waiting.length, l = !1; --a > -1 && !1 === l; )
              this.waiting[a].label === e.label &&
                this.waiting[a].lookup === e.lookup &&
                ((l = !0), this.waiting.splice(a, 1));
            continue;
          }
          for (o = 0; o < e.listeners.length; o++) {
            if (((i = e.listeners[o]), "create" === t.promise)) {
              var c = this._contactPromise(e.label, t.lookup);
              r.push(c);
            }
            i.apply(i, r);
          }
        }
      s = null;
    }),
    (ri.prototype.destroy = function () {
      return (
        this.clearQueue(),
        (this.messages = null),
        (this.incoming = null),
        (this.waiting = null),
        (this.isReady = !1),
        null
      );
    }),
    (ri.prototype._contactPromise = function (t, e) {
      var i = this,
        n = {},
        o = new Promise(function (t, e) {
          (n.resolve = t), (n.reject = e);
        }),
        s = {
          source: "hcaptcha",
          label: t,
          id: i.id,
          promise: null,
          lookup: e,
        };
      return (
        o
          .then(function (t) {
            (s.promise = "resolve"),
              null !== t && (s.contents = t),
              i._addToQueue(i.target, s);
          })
          ["catch"](function (t) {
            (s.promise = "reject"),
              null !== t && (s.error = t),
              i._addToQueue(i.target, s);
          }),
        n
      );
    }),
    (ri.prototype._addToQueue = function (t, e) {
      this.isReady ? this._sendMessage(t, e) : this.queue.push([t, e]);
    });
  var ai = {
    chats: [],
    messages: [],
    globalEnabled: !1,
    isSupported: function () {
      return !!window.postMessage;
    },
    createChat: function (t, e, i) {
      var n = new ri(t, e, i);
      return ai.chats.push(n), n;
    },
    addChat: function (t) {
      ai.chats.push(t);
    },
    removeChat: function (t) {
      for (var e = !1, i = ai.chats.length; --i > -1 && !1 === e; )
        t.id === ai.chats[i].id &&
          t.target === ai.chats[i].target &&
          ((e = ai.chats[i]), ai.chats.splice(i, 1));
      return e;
    },
    handleGlobal: function (t) {
      if (ai.globalEnabled) {
        var e = ai.messages;
        if (e.length >= 10) ai.globalEnabled = !1;
        else {
          var i = e.some(function (e) {
            return JSON.stringify(e.data) === JSON.stringify(t.data);
          });
          i || e.push(t);
        }
      }
    },
    handle: function (t) {
      var e = t.data,
        i = "string" == typeof e && e.indexOf("hcaptcha") >= 0;
      try {
        if (!i) return void ai.handleGlobal(t);
        e = JSON.parse(e);
        for (var n, o = ai.chats, s = -1; ++s < o.length; ) {
          var r =
            "*" === (n = o[s]).targetOrigin || t.origin === n.targetOrigin;
          n.id === e.id && r && n.respond(e);
        }
      } catch ($s) {
        Ct("postMessage handler error", "postMessage", "debug", {
          event: t,
          error: $s,
        });
      }
    },
  };
  window.addEventListener
    ? window.addEventListener("message", ai.handle)
    : window.attachEvent("onmessage", ai.handle);
  var li = new ri(window.parent);
  li.init = function (t, e) {
    li.setID(t), li.setTargetOrigin(e), (ai.globalEnabled = !0), ai.addChat(li);
  };
  var ci = null;
  function hi(t) {
    ci && ut.confirmNav
      ? ci.display("link", { url: t })
      : window.open(t, "_blank");
  }
  function ui(t, e) {
    for (var i in e) {
      var n = e[i];
      switch (typeof n) {
        case "string":
          t[i] = n;
          break;
        case "object":
          (t[i] = t[i] || {}), ui(t[i], n);
          break;
        default:
          throw new Error(
            "Source theme contains invalid data types. Only string and object types are supported."
          );
      }
    }
  }
  function di(t, e) {
    try {
      return t in e;
    } catch (i) {
      return !1;
    }
  }
  function pi(t) {
    return !!t && "object" == typeof t;
  }
  function fi(t) {
    return pi(t) ? mi({}, t) : t;
  }
  function mi(t, e) {
    var i,
      n = {},
      o = Object.keys(t);
    for (i = 0; i < o.length; i++) n[o[i]] = fi(t[o[i]]);
    var s,
      r,
      a = Object.keys(e);
    for (i = 0; i < a.length; i++) {
      var l = a[i];
      if (
        !(
          !di((s = l), (r = t)) ||
          (Object.hasOwnProperty.call(r, s) &&
            Object.propertyIsEnumerable.call(r, s))
        )
      )
        return;
      di(l, t) && pi(t[l]) ? (n[l] = mi(t[l], e[l])) : (n[l] = fi(e[l]));
    }
    return n;
  }
  var yi = { transparent: "transparent", white: "#ffffff", black: "#000000" },
    gi = {
      100: "#fafafa",
      200: "#f5f5f5",
      300: "#E0E0E0",
      400: "#D7D7D7",
      500: "#BFBFBF",
      600: "#919191",
      700: "#555555",
      800: "#333333",
      900: "#222222",
      1e3: "#14191F",
    },
    vi = { 300: "#4DE1D2", 500: "#00838F" },
    bi = { 300: "#EB5757", 500: "#EB5757", 700: "#DE3F3F" },
    wi = { __proto__: null, common: yi, grey: gi, teal: vi, red: bi },
    xi = {
      mode: "light",
      grey: gi,
      primary: { main: vi[500] },
      secondary: { main: vi[300] },
      warn: { light: bi[300], main: bi[500], dark: bi[700] },
      text: { heading: gi[700], body: gi[700] },
    },
    Ci = {
      mode: "dark",
      grey: gi,
      primary: { main: vi[500] },
      secondary: { main: vi[300] },
      text: { heading: gi[200], body: gi[200] },
    };
  function ki(t, e) {
    return "dark" === e && t in Ci ? Ci[t] : xi[t];
  }
  function _i() {
    (this._themes = Object.create(null)),
      (this._active = "light"),
      this.add("light", {}),
      this.add("dark", { palette: { mode: "dark" } });
  }
  (_i.prototype.get = function (t) {
    if (!t) return this._themes[this._active];
    var e = this._themes[t];
    if (!e) throw new Error("Cannot find theme with name: " + t);
    return e;
  }),
    (_i.prototype.use = function (t) {
      this._themes[t]
        ? (this._active = t)
        : console.error("Cannot find theme with name: " + t);
    }),
    (_i.prototype.active = function () {
      return this._active;
    }),
    (_i.prototype.add = function (t, e) {
      e || (e = {}),
        (e.palette = (function (t) {
          t || (t = {});
          var e = t.mode || "light",
            i = t.primary || ki("primary", e),
            n = t.secondary || ki("secondary", e),
            o = t.warn || ki("warn", e),
            s = t.grey || ki("grey", e),
            r = t.text || ki("text", e);
          return mi(
            {
              common: yi,
              mode: e,
              primary: i,
              secondary: n,
              grey: s,
              warn: o,
              text: r,
            },
            t
          );
        })(e.palette)),
        (e.component = e.component || Object.create(null)),
        (this._themes[t] = e);
    }),
    (_i.prototype.extend = function (t, e) {
      "string" == typeof e && (e = JSON.parse(e));
      var i = JSON.parse(JSON.stringify(this.get(t)));
      return ui(i, e), i;
    }),
    (_i.merge = function (t, e) {
      return mi(t, e || {});
    });
  var Ei = { __proto__: null, Colors: wi, Theme: _i },
    Si = new _i();
  function Ai(t) {
    var e = t.palette,
      i = t.component;
    return _i.merge({ focus: { outline: e.primary.main } }, i.link);
  }
  function Li(t) {
    Qt.self(this, Xt, "link", "a"),
      (this.config = {
        url: t.url,
        text: t.text,
        underline: t.underline || !1,
        theme: t.theme,
        onDarkBg: t.onDarkBg,
      }),
      this.setAttribute("tabindex", 0),
      this.config.url &&
        (this.setAttribute("href", this.config.url),
        this.setAttribute("target", "_blank")),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onHover = this.onHover.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener("click", this.onSelect),
      this.addEventListener("enter", this.onSelect),
      this.addEventListener("over", this.onHover),
      this.addEventListener("out", this.onHover),
      this.addEventListener("focus", this.onFocus),
      this.addEventListener("blur", this.onBlur),
      this.translate();
  }
  function Bi(t) {
    Qt.self(this, Xt, null, "span"),
      (this.config = { text: t.text, bold: t.bold }),
      this.text(this.config.text);
  }
  function Hi(t) {
    Qt.self(this, Xt, t.selector || null, t.element || "div"),
      (this.state = { theme: t.theme });
  }
  function Mi(t) {
    if ("string" != typeof t.src && !(t.src instanceof HTMLElement))
      throw new TypeError(
        "Graphic src must be string or HTMLElement. Passed src: " + t.src
      );
    Qt.self(this, Xt, t.selector || ".graphic"),
      (this.state = { loaded: !1 }),
      (this.config = {
        src: t.src,
        fallback: t.fallback || !1,
        width: t.width || 0,
        height: t.height || t.width || 0,
        fill: t.fill,
        stroke: t.stroke,
      }),
      (this.image = null),
      (t.autoLoad || t.autoLoad === undefined) && this.load();
  }
  function Oi(t, e) {
    var i = t.nodeName;
    if ("svg" === i || "g" === i || "clipPath" === i) {
      var n = t && (t.children || t.childNodes);
      if (!n) return;
      for (var o = 0; o < n.length; o++) Oi(n[o], e);
    } else if (
      t &&
      t.style &&
      ("path" === i || "rect" === i || "circle" === i || "polygon" === i)
    ) {
      var s = !!t.getAttribute("stroke"),
        r = !!t.getAttribute("fill");
      s && (t.style.stroke = e),
        r && (t.style.fill = e),
        r || s || (t.style.fill = e);
    }
  }
  function Ti(t) {
    var e = t.palette,
      i = t.component;
    return _i.merge(
      {
        main: { fill: e.common.white, icon: e.grey[700], text: e.text.main },
        hover: { fill: e.grey[200], icon: e.primary.main, text: e.text.main },
        focus: { icon: e.primary.main, outline: e.primary.main },
        active: { icon: e.grey[700] },
      },
      i.button
    );
  }
  function Vi(t) {
    Qt.self(this, Xt, t.selector),
      (this._theme = t.theme),
      (this.state = {
        selectable: !1 !== t.selectable,
        title: t.title,
        label: t.label,
        value: t.value,
        visible: !0,
        locked: !1,
        mobile: !1,
        selected: !1,
        width: t.width,
        height: t.height,
        closedAt: Date.now(),
        downAt: 0,
        style: Ti(this._theme.get()),
      }),
      this.addClass("button"),
      this.setAttribute("tabindex", 0),
      this.setAttribute("role", "button"),
      (this.onDown = this.onDown.bind(this)),
      (this.onHover = this.onHover.bind(this)),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener("down", this.onDown),
      this.addEventListener("click", this.onSelect),
      this.addEventListener("enter", this.onSelect),
      this.addEventListener("focus", this.onFocus),
      this.addEventListener("blur", this.onBlur),
      !1 === tt.System.mobile &&
        (this.addEventListener("over", this.onHover),
        this.addEventListener("out", this.onHover)),
      this.setCopy();
  }
  Si.add("contrast", {
    component: {
      prompt: { main: { fill: "#fff", text: "#000" } },
      expandButton: { main: { fill: "#000" } },
    },
  }),
    Si.add("grey-red", {
      component: {
        breadcrumb: { active: { fill: "#FF0000" } },
        prompt: { main: { fill: "#6a6a6a" } },
        task: { selected: { border: "#ff1f17" } },
        expandButton: { main: { fill: "#6a6a6a" } },
        verifyButton: { main: { fill: "#ff1f17" }, hover: { fill: "#ff1f17" } },
        skipButton: { main: { fill: "#6a6a6a" }, hover: { fill: "#6a6a6a" } },
      },
    }),
    Qt.proto(Li, Xt),
    (Li.prototype.style = function (t) {
      var e = t.fontSize || 12,
        i = t.color || "inherit",
        n = Ai(this.config.theme.get());
      this.css({
        color: i,
        fontWeight: 500,
        fontSize: e,
        cursor: "pointer",
        textDecoration: this.config.underline ? "underline" : "none",
        outlineColor: n.focus.outline,
        display: "inline-block",
        lineHeight: e,
      });
    }),
    (Li.prototype.translate = function () {
      var t = ae.translate(this.config.text);
      this.content(t);
    }),
    (Li.prototype.onHover = function (t) {
      var e = "over" === t.action;
      this.css({
        textDecoration: e || this.config.underline ? "underline" : "none",
      });
    }),
    (Li.prototype.onSelect = function (t) {
      this.emit("click", t);
    }),
    (Li.prototype.onFocus = function (t) {
      var e = Ai(this.config.theme.get()).focus.outline;
      this.css({ outline: "2px solid " + e });
    }),
    (Li.prototype.onBlur = function (t) {
      this.css({ outline: "none" });
    }),
    Qt.proto(Bi, Xt),
    (Bi.prototype.style = function (t) {
      var e = t.fontSize || 12,
        i = t.color || "#000";
      this.css({
        color: i,
        fontWeight: this.config.bold ? 700 : 500,
        fontSize: e,
        lineHeight: e,
      });
    }),
    (Bi.prototype.translate = function () {
      var t = ae.translate(this.config.text);
      this.text(t);
    }),
    Qt.proto(Hi, Xt),
    (Hi.prototype.style = function (t) {
      for (var e = this.children.length; --e > -1; ) this.children[e].style(t);
    }),
    (Hi.prototype.parseText = function (t) {
      var e,
        i,
        n = [
          { type: "BOLD", regex: /\*\*([^*]*)\*\*/g },
          { type: "LINK", regex: /\[([^[]+)]\(([^)]*)\)/g },
        ],
        o = [];
      for (e = n.length; --e > -1; )
        for (; null != (i = n[e].regex.exec(t)); )
          (i.type = n[e].type), o.push(i);
      (o = o.sort(function (t, e) {
        return t.index - e.index;
      })),
        this.removeAllComponents();
      var s = 0;
      for (e = 0; e < o.length; e++)
        switch (
          ((i = o[e]),
          this.initComponent(Bi, { text: t.substring(s, i.index) }),
          (s = i.index + i[0].length),
          i.type)
        ) {
          case "BOLD":
            this.initComponent(Bi, { text: i[1], bold: !0 });
            break;
          case "LINK":
            this.initComponent(Li, {
              text: i[1],
              url: i[2],
              underline: !0,
              onDarkBg: !0,
              theme: this.state.theme,
            });
        }
      s < t.length && this.initComponent(Bi, { text: t.substring(s) }),
        this.style({ fontSize: "inherit", color: "inherit" });
    }),
    Qt.proto(Mi, Xt),
    (Mi.prototype.load = function () {
      if (this.state.loaded) return Promise.resolve();
      this.state.loaded = !0;
      var t = this,
        e = this.config.src;
      return Se.image(e, { fallback: this.config.fallback })
        .then(function (e) {
          (t.image = e), t.appendElement(e.element), t.size(), t.fill();
        })
        ["catch"](function () {
          Ct("graphic failed to load", "image", "info", { src: e });
        });
    }),
    (Mi.prototype.size = function (t, e) {
      (this.config.width = t || this.config.width),
        (this.config.height = e || t || this.config.height),
        this.css({ width: this.config.width, height: this.config.height }),
        this.image &&
          this.image.element.css({
            width: this.config.width,
            height: this.config.height,
            display: "block",
          });
    }),
    (Mi.prototype.fill = function (t) {
      ((this.config.fill = t || this.config.fill),
      this.image && "svg" === this.image.ext && this.config.fill) &&
        Oi(this.image.element.dom, this.config.fill);
    }),
    Qt.proto(Vi, Xt),
    (Vi.prototype.style = function (t) {
      (this.state.mobile = t),
        (this.state.style = Ti(this._theme.get())),
        this.css({
          width: this.state.width,
          height: this.state.height,
          cursor: this.state.locked ? "default" : "pointer",
          display: this.state.visible ? "inline-block" : "none",
          color: this.state.style.main.text,
          backgroundColor: this.state.style.main.fill,
          outlineColor: this.state.style.focus.outline,
          border: "1px solid " + this.state.style.main.border,
          borderRadius: 4,
        }),
        this.emit("style");
    }),
    (Vi.prototype.getWidth = function () {
      return this.state.width;
    }),
    (Vi.prototype.getHeight = function () {
      return this.state.height;
    }),
    (Vi.prototype._updateStyle = function (t) {
      this.state.style = Ti(this._theme.get());
      var e = t ? "hover" : "main";
      this.css({
        backgroundColor: this.state.style[e].fill,
        borderColor: this.state.style[e].border,
        color: this.state.style[e].text,
      }),
        this.emit("style-update", t);
    }),
    (Vi.prototype.onDown = function () {
      this.state.downAt = Date.now();
    }),
    (Vi.prototype.onHover = function (t) {
      null === this.emit ||
        !0 === this.state.locked ||
        this.state.selected ||
        (this.emit("hover", t), this._updateStyle("over" === t.action));
    }),
    (Vi.prototype.onSelect = function (t) {
      this.emit &&
        !0 !== this.state.locked &&
        (Math.abs(this.state.downAt - this.state.closedAt) < 30 ||
          (this._setState(!!this.state.selectable && !this.state.selected),
          this.emit("click", {
            selected: this.state.selected,
            usingKb: "enter" === t.action,
          })));
    }),
    (Vi.prototype.onFocus = function (t) {
      var e = this.state.style.focus.outline;
      this.css({ outline: "2px solid " + e });
    }),
    (Vi.prototype.onBlur = function (t) {
      this.css({ outline: "none" });
    }),
    (Vi.prototype.setLock = function (t) {
      (this.state.locked = t), this.css({ cursor: t ? "default" : "pointer" });
    }),
    (Vi.prototype.enable = function (t) {
      (this.state.visible = t),
        this.css({ display: t ? "inline-block" : "none" }),
        this.setLock.call(this, !t);
    }),
    (Vi.prototype.reset = function () {
      this._setState(!1);
    }),
    (Vi.prototype._setState = function (t) {
      (this.state.style = Ti(this._theme.get())),
        (this.state.selected = t),
        this.css({ backgroundColor: this.state.style.main.fill }),
        t ? this._updateStyle(!0) : (this.state.closedAt = Date.now()),
        this.emit("state-changed", t);
    }),
    (Vi.prototype.setLabel = function (t) {
      t && (this.state.label = t),
        this.state.label &&
          this.setAttribute("aria-label", ae.translate(this.state.label));
    }),
    (Vi.prototype.setTitle = function (t) {
      t && (this.state.title = t),
        this.state.title &&
          this.setAttribute("title", ae.translate(this.state.title));
    }),
    (Vi.prototype.setCopy = function () {
      this.setLabel(), this.setTitle();
    }),
    (Vi.prototype.controlsMenu = function (t) {
      this.setAttribute("aria-expanded", !1),
        this.setAttribute("aria-haspopup", "menu"),
        this.setAttribute("aria-controls", t.dom.id),
        t.setAttribute("aria-labelledby", this.dom.id),
        t.setAttribute("role", "menu"),
        t.setAttribute("tabindex", -1),
        this.on("state-changed", function (t) {
          this.setAttribute("aria-expanded", t);
        });
    }),
    (Vi.prototype.ownsListBox = function (t) {
      this.setAttribute("aria-expanded", !1),
        this.setAttribute("aria-haspopup", "listbox"),
        this.setAttribute("aria-owns", t.dom.id),
        t.setAttribute("aria-labelledby", this.dom.id),
        t.setAttribute("role", "listbox"),
        this.on("state-changed", function (t) {
          this.setAttribute("aria-expanded", t);
        });
    }),
    (Vi.prototype.getValue = function () {
      return this.state.value;
    });
  var Ri = "https://newassets.hcaptcha.com/captcha/v1/01e0b54/static/images";
  function Pi(t) {
    (t.selector = t.selector || t.name),
      Qt.self(this, Vi, t),
      (this.$on = this.initComponent(Mi, {
        selector: "." + t.name + "-on",
        src: t.src,
        fallback: Ri + "/" + t.name + "-on.png",
        autoLoad: !1,
      })),
      (this.$off = this.initComponent(Mi, {
        selector: "." + t.name + "-off",
        src: t.src,
        fallback: Ri + "/" + t.name + "-off.png",
        autoLoad: !1,
      })),
      this.on("state-changed", this._onStateChange.bind(this)),
      this.on("style", this._onStyle.bind(this)),
      this.on("style-update", this._onStyleUpdate.bind(this));
  }
  function Di(t) {
    Qt.self(this, Vi, t),
      (this.state.text = t.text),
      (this.$text = this.createElement(".text")),
      this.on("style", this._onStyle.bind(this)),
      this.setText();
  }
  function Fi(t) {
    Qt.self(this, Vi, t),
      (this.state.text = t.text),
      (this.state.type = t.type || "confirm"),
      (this.$text = this.createElement(".text")),
      this.on("style", this._onStyle.bind(this)),
      this.setText();
  }
  function $i(t) {
    var e = t.palette,
      i = t.component;
    return _i.merge(
      {
        main: { fill: e.grey[200], border: e.grey[600] },
        selected: { check: e.primary.main },
        focus: { outline: e.primary.main },
      },
      i.radio
    );
  }
  function Ii(t) {
    Qt.self(this, Xt, "radio-button"),
      (this.state = {
        theme: t.theme,
        locked: !1,
        selected: !1,
        text: t.text,
        value: t.value,
      }),
      (this.$wrapper = this.createElement(".wrapper")),
      (this.$radio = this.$wrapper.createElement(".radio")),
      (this.$radio.bg = this.$radio.createElement(".radio-bg")),
      (this.$radio.check = this.$radio.createElement(".radio-indicator")),
      this.$radio.check.css({ opacity: 0 }),
      (this.$text = this.$wrapper.createElement(".radio-text")),
      (this.$text.dom.id = "RadioButton-" + this.state.value),
      this.$radio.setAttribute("tabindex", "0"),
      this.$radio.setAttribute("role", "radio"),
      this.$radio.setAttribute("aria-pressed", !1),
      this.$radio.setAttribute("aria-labelledby", this.$text.dom.id),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.$radio.addEventListener("click", this.onSelect),
      this.$radio.addEventListener("enter", this.onSelect),
      this.$radio.addEventListener("focus", this.onFocus),
      this.$radio.addEventListener("blur", this.onBlur);
  }
  function ji(t) {
    var e = t.palette,
      i = t.component,
      n = "light" === e.mode;
    return _i.merge(
      {
        main: { fill: e.grey[100], border: e.grey[n ? 600 : 200] },
        focus: { fill: e.grey[200], outline: e.grey[n ? 800 : 100] },
        disabled: { fill: e.grey[300] },
      },
      i.textarea
    );
  }
  function Ni(t) {
    Qt.self(this, Xt, "input-textarea");
    var e = this;
    (this.state = { visible: !1, placeholder: t.placeholder, theme: t.theme }),
      (this.$textarea = this.createElement("textarea", ".textarea")),
      this.setPlaceholder.call(this),
      this.$textarea.addEventListener("input", function (t) {
        e.emit("change", t.target.value);
      });
  }
  function zi(t) {
    Qt.self(this, Xt, t.selector || "list-native", "select");
    var e = this;
    (this._options = []),
      (this._selected = null),
      this.setAttribute("tabindex", -1),
      this.addEventListener("change", function () {
        e.select(e.dom.value);
      });
  }
  Qt.proto(Pi, Vi),
    (Pi.prototype.load = function () {
      return Promise.all([this.$on.load(), this.$off.load()]);
    }),
    (Pi.prototype._onStyle = function () {
      var t = this.getWidth(),
        e = t - 10,
        i = (t - e) / 2;
      this.$on.size(e),
        this.$on.fill(this.state.style.focus.icon),
        this.$on.css({
          "-ms-high-contrast-adjust": "none",
          position: "absolute",
          top: i,
          left: i,
        }),
        this.$off.size(e),
        this.$off.fill(this.state.style.main.icon),
        this.$off.css({
          "-ms-high-contrast-adjust": "none",
          position: "absolute",
          top: i,
          left: i,
        });
    }),
    (Pi.prototype._onStyleUpdate = function (t) {
      "ie" === tt.Browser.type && 8 === tt.Browser.version
        ? (this.$on.css({ display: t ? "block" : "none" }),
          this.$off.css({ display: t ? "none" : "block" }))
        : (this.$on.css({ opacity: t ? 1 : 0 }),
          this.$off.css({ opacity: t ? 0 : 1 }));
    }),
    (Pi.prototype._onStateChange = function (t) {
      "ie" === tt.Browser.type && 8 === tt.Browser.version
        ? (this.$on.css({ display: t ? "block" : "none" }),
          this.$off.css({ display: t ? "none" : "block" }))
        : (this.$on.css({ opacity: t ? 1 : 0 }),
          this.$off.css({ opacity: t ? 0 : 1 }));
    }),
    Qt.proto(Di, Vi),
    (Di.prototype.setText = function (t) {
      this.$text.text(t || this.state.text || this.state.title);
    }),
    (Di.prototype._onStyle = function () {
      this.css({ cursor: "pointer" }),
        this.$text.css({
          width: "100%",
          height: "100%",
          textAlign: "center",
          fontSize: 11,
          fontWeight: 600,
          lineHeight: this.state.height,
          position: "absolute",
        });
    }),
    Qt.proto(Fi, Vi),
    (Fi.prototype.setText = function (t) {
      t && (this.state.text = t),
        this.$text.text(ae.translate(this.state.text || this.state.title)),
        this.setCopy();
    }),
    (Fi.prototype._onStyle = function () {
      var t = this._theme.get().palette,
        e = "light" === t.mode,
        i = "warn" === this.state.type ? t.warn.main : t.primary.main;
      this.css({
        width: "auto",
        height: 15,
        cursor: this.state.locked ? "default" : "pointer",
        display: "block",
        margin: "0 auto",
        textAlign: "center",
        lineHeight: 15,
        borderRadius: 4,
        padding: "10px 15px",
      }),
        this.$text.css({
          color: this.state.locked ? (e ? t.text.body : t.grey[700]) : i,
          fontSize: 15,
          fontWeight: 500,
          display: "inline-block",
        });
    }),
    (Fi.prototype.lock = function (t) {
      var e = this._theme.get().palette,
        i = "warn" === this.state.type ? e.warn.main : e.primary.main,
        n = "light" === e.mode;
      (this.state.locked = t),
        this.css({ cursor: t ? "default" : "pointer" }),
        this.$text.css({ color: t ? (n ? e.text.body : e.grey[700]) : i }),
        t
          ? this.setAttribute("aria-disabled", t)
          : this.removeAttribute("aria-disabled");
    }),
    Qt.proto(Ii, Xt),
    (Ii.prototype.style = function (t) {
      var e = Rt(t, 125, 150, 13, 14),
        i = 15,
        n = t - 27,
        o = this.state.theme,
        s = $i(o.get()),
        r = o.get().palette,
        a = "light" === r.mode;
      this.css({
        height: "auto",
        marginTop: 5,
        marginBottom: 5,
        position: "relative",
      }),
        this.$wrapper.css({
          cursor: "pointer",
          height: "auto",
          width: "auto",
          position: "relative",
          display: "inline-block",
        }),
        this.$radio.css({
          position: "relative",
          display: "inline-block",
          width: i,
          height: i,
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid " + s.main.border,
          float: "left",
        }),
        this.$radio.check.css({
          position: "absolute",
          top: 2,
          left: 2,
          zIndex: 10,
          width: 11,
          height: 11,
          borderRadius: 1,
          backgroundColor: s.selected.check,
        }),
        this.$radio.bg.css({
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          width: i,
          height: i,
          backgroundColor: s.main.fill,
        }),
        this.$text.css({
          position: "relative",
          display: "inline-block",
          width: n,
          fontSize: e,
          fontWeight: 400,
          color: a ? r.text.body : r.grey[700],
          float: "right",
          marginLeft: 10,
          marginTop: 1,
          wordBreak: "break-word",
        });
    }),
    (Ii.prototype.toggle = function (t) {
      this.state.locked ||
        ((this.state.selected = t),
        this.$radio.check.css({ opacity: t ? 1 : 0 }),
        this.$radio.setAttribute("aria-pressed", t));
    }),
    (Ii.prototype.lock = function (t) {
      this.state.locked = t;
    }),
    (Ii.prototype.setCopy = function () {
      var t = ae.translate(this.state.text);
      this.$text.text(t);
    }),
    (Ii.prototype.onSelect = function (t) {
      this.emit("select", this);
    }),
    (Ii.prototype.onFocus = function (t) {
      var e = $i(this.state.theme.get()).focus.outline;
      this.$radio.css({ outline: "2px solid " + e });
    }),
    (Ii.prototype.onBlur = function (t) {
      this.$radio.css({ outline: "none" });
    }),
    Qt.proto(Ni, Xt),
    (Ni.prototype.style = function (t, e) {
      var i = this.state.theme,
        n = ji(i.get()),
        o = i.get().palette,
        s = "light" === o.mode;
      this.$textarea.css({
        width: t - 30,
        height: 50,
        borderRadius: 4,
        backgroundColor: n.main.fill,
        color: s ? o.text.body : o.grey[700],
        border: "1px solid " + n.main.border,
        fontSize: e ? 12 : 14,
        lineHeight: e ? 16 : 18,
        fontWeight: 500,
        boxSizing: "border-box",
        MozBoxSizing: "border-box",
        padding: "8px 12px",
        position: "absolute",
        left: "50%",
        marginLeft: -(t - 30) / 2,
      }),
        this.css({ height: 50, width: t, position: "relative" }),
        this.visible(this.state.visible);
    }),
    (Ni.prototype.visible = function (t) {
      (this.state.visible = t), this.css({ display: t ? "block" : "none" });
    }),
    (Ni.prototype.disable = function (t) {
      if (this.state.visible) {
        var e = ji(this.state.theme.get());
        (this.$textarea.dom.disabled = !t),
          this.$textarea.css({
            backgroundColor: t ? e.main.fill : e.disabled.fill,
          });
      }
    }),
    (Ni.prototype.getValue = function () {
      return this.$textarea.dom.value;
    }),
    (Ni.prototype.setValue = function (t) {
      this.$textarea.dom.value = t;
    }),
    (Ni.prototype.setPlaceholder = function () {
      this.$textarea.setAttribute(
        "placeholder",
        ae.translate(this.state.placeholder)
      );
    }),
    Qt.proto(zi, Xt),
    (zi.prototype.getSelected = function () {
      return this._selected;
    }),
    (zi.prototype.setCopy = function () {
      for (var t = this._options.length; t--; )
        this._options[t].element.text(ae.translate(this._options[t].text));
    }),
    (zi.prototype.setOptions = function (t) {
      for (var e, i = this._options.length; i--; )
        this.removeElement(this._options[i].element);
      for (this._options = t, i = 0; i < t.length; i++)
        ((e = this.createElement(
          "option",
          t[i].selector || ".option"
        )).dom.value = t[i].value),
          e.text(t[i].text),
          (this._options[i].element = e);
    }),
    (zi.prototype.select = function (t) {
      for (var e = null, i = this._options.length; i--; )
        t === this._options[i].value && (e = this._options[i]);
      if (!e) throw new Error("Cannot select a missing option value: " + t);
      this._selected && this._selected.element.removeAttribute("selected"),
        e.element.setAttribute("selected", "selected"),
        (this._selected = e),
        (this.dom.value = e.value),
        this.emit("hide"),
        this.emit("select", e);
    }),
    (zi.prototype.deselect = function () {
      this._selected && this._selected.element.removeAttribute("selected"),
        (this._selected = null),
        (this.dom.value = null);
    }),
    (zi.prototype.style = function () {
      this.css({
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0,
        zIndex: 50,
      });
    });
  var Zi = 37,
    Ui = 39,
    Wi = 38,
    Ki = 40,
    qi =
      ("onwheel" in document || document, document, "ontouchstart" in document),
    Gi = navigator.maxTouchPoints && navigator.maxTouchPoints > 1,
    Ji = !!window.navigator.msPointerEnabled,
    Yi = "onkeydown" in document;
  function Qi(t) {
    (this.state = {
      pause: !1,
      action: null,
      position: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
      created: !1,
    }),
      (this.config = {
        arrowScrolling: !1 !== t.arrowScrolling,
        keyStep: t.keyStep || 120,
        firefoxMult: t.firefoxMult || 15,
        touchMult: t.touchMult || 2,
        mouseMult: t.mouseMult || 1,
      });
    var e = t.element || document.body;
    e instanceof Yt || ((e = new Yt(e)), (this.state.created = !0)),
      (this.element = e),
      (this.msBodyTouch = null),
      (this.clamp = { enabled: !1, min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }),
      (this.onWheel = this.onWheel.bind(this)),
      (this.onKey = this.onKey.bind(this)),
      (this.onTouch = this.onTouch.bind(this)),
      (this.destroy = this.destroy.bind(this)),
      this._addListeners();
  }
  function Xi() {
    Qt.self(this, Xt, "scroll-container");
  }
  function tn(t) {
    Qt.self(this, Xt, t.selector || "list-custom"),
      (this.state = { skipAnimationOnce: !1 }),
      (this.scroll = new Qi({
        element: this,
        arrowScrolling: !1,
        mouseMult: 0.5,
        keyStep: 46,
      })),
      (this._container = this.initComponent(Xi)),
      (this._handle = this.createElement("div")),
      this.on("scroll-update", this._onScrollUpdate.bind(this));
  }
  function en(t) {
    var e = t.palette,
      i = t.component;
    return _i.merge(
      {
        main: {
          fill: e.common.transparent,
          line: e.grey[200],
          text: e.grey[700],
        },
        hover: {
          fill: e.grey[200],
          text: e.grey[900],
          border: e.primary.main + "b3",
        },
        selected: { fill: "#5C6F8A", text: e.grey[100] },
      },
      i.listItem
    );
  }
  function nn(t) {
    Qt.self(this, Xt, t.option.selector || ".option");
    var e = this;
    (this.state = {
      style: en(t.theme.get()),
      selected: !1,
      usingKb: !1,
      isLast: !1,
      size: t.size,
      option: t.option,
      theme: t.theme,
      isMenu: t.isMenu,
      height: t.height,
    }),
      (this.text = this.text.bind(this)),
      (this._text = this.createElement("span")),
      (this._separator = this.createElement("div")),
      this.addEventListener("click", this.select.bind(this)),
      this.addEventListener("enter", this.select.bind(this)),
      this.addEventListener("over", this._onHover.bind(this, !0)),
      this.addEventListener("out", this._onHover.bind(this, !1)),
      this.addEventListener("blur", function () {
        e.updateStyle(!1), e.emit("blur");
      }),
      this.addEventListener("focus", function () {
        e.updateStyle(e.state.usingKb), e.emit("focus");
      }),
      this.setAttribute("tabindex", 0),
      this.setAttribute("aria-selected", this.state.selected),
      this.setAttribute("aria-setsize", this.state.size),
      this.setAttribute("role", this.state.isMenu ? "menuitem" : "option"),
      this.setCopy();
  }
  function on(t) {
    Qt.self(this, tn, { selector: t.selector || "list-custom" }),
      (this.state = {
        theme: t.theme,
        isMenu: t.isMenu,
        usingKb: !1,
        visible: !1,
        centerOnce: !1,
        search: "",
        focusedId: -1,
        selected: null,
        optionStyle: null,
        searchTimer: null,
        optionsVisible: t.optionsVisible || 6,
        optionHeight: 46,
      }),
      (this._options = []),
      this.setAttribute("tabindex", -1),
      this.setAttribute("aria-expanded", !1),
      this.setAttribute("role", this.state.isMenu ? "presentation" : "listbox"),
      this.addEventListener("keydown", this.onKeyPress.bind(this));
  }
  function sn(t) {
    Qt.self(this, Xt, (t = t || {}).selector || ".box-container"),
      (this._theme = t.theme),
      (this.boxState = {
        ariaLabel: t.ariaLabel,
        visible: !0,
        css: {
          boxSizing: t.boxSizing,
          width: t.width,
          height: t.height,
          padding: t.padding,
          margin: t.margin,
          borderWidth: t.borderWidth,
          borderStyle: t.borderStyle,
          borderRadius: t.borderRadius,
          borderColor: t.borderColor,
          backgroundColor: t.backgroundColor,
          cursor: t.cursor,
        },
      }),
      this.setStyle(this.boxState),
      this.setAriaLabel(),
      this.setVisible(!0);
  }
  function rn(t) {
    Qt.self(this, Xt, t.selector || ".border"),
      (this.state = {
        visible: t.visible === undefined || t.visible,
        thickness: t.thickness || 1,
        color: t.color || "#000000",
        rounded: t.rounded || 0,
      }),
      (this.$top = this.createElement("div")),
      (this.$right = this.createElement("div")),
      (this.$left = this.createElement("div")),
      (this.$bottom = this.createElement("div"));
  }
  function an(t) {
    var e = t.palette,
      i = t.component;
    return _i.merge({ focus: { outline: e.primary.main } }, i.link);
  }
  function ln(t) {
    Qt.self(this, Xt, "logo", "a"),
      (this.state = {
        theme: t.theme,
        url: t.url || "",
        width: t.width || 0,
        height: t.height || 0,
      }),
      this.setAttribute("tabindex", 0),
      this.setAttribute("target", "_blank"),
      this.setAttribute("href", this.state.url);
    var e = {
      selector: ".logo-graphic",
      src: t.src,
      fallback: t.fallback,
      autoLoad: t.autoLoad,
    };
    (this.graphic = this.initComponent(Mi, e)),
      this.graphic.css({
        cursor: "pointer",
        "-ms-high-contrast-adjust": "none",
      }),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener("click", this.onSelect),
      this.addEventListener("enter", this.onSelect),
      this.addEventListener("focus", this.onFocus),
      this.addEventListener("blur", this.onBlur);
  }
  function cn(t) {
    var e = t.palette,
      i = t.component;
    return _i.merge(
      { main: { fill: e.primary.main, icon: e.common.white } },
      i.badge
    );
  }
  function hn(t) {
    if (
      (Qt.self(this, Xt, t.selector || ".badge"),
      t || (t = {}),
      (this._theme = t.theme),
      (this._style = cn(this._theme.get())),
      (this._timer = null),
      (this.state = { loaded: !1, visible: !1 }),
      (this.config = { icon: t.icon, value: t.value, size: t.size || 0 }),
      t.icon)
    ) {
      var e,
        i = t.icon;
      "object" == typeof t.icon && ((i = t.icon.src), (e = t.icon.fallback)),
        (this.$wrapper = this.createElement(".badge-icon-wrapper")),
        (this.icon = this.initComponent(
          Mi,
          { selector: ".icon", src: i, fallback: e },
          this.$wrapper
        ));
    }
    (this.$fill = this.createElement(".badge-fill")),
      (this.$radial = this.createElement(".badge-radial"));
  }
  (Qi.prototype.pause = function (t) {
    this.state.pause = t;
  }),
    (Qi.prototype.update = function (t) {
      if (!this.state.pause) {
        var e = this.state.position,
          i = this.state.delta,
          n = this.state.action;
        (e.x += i.x),
          (e.y += i.y),
          this.clamp.enabled
            ? ((e.x = Vt(e.x, this.clamp.min.x, this.clamp.max.x)),
              (e.y = Vt(e.y, this.clamp.min.y, this.clamp.max.y)))
            : console.log(e.y, this.element.dom.scrollHeight),
          this.element.emit("scroll-update", {
            x: e.x,
            y: e.y,
            delta: i,
            action: n,
            original: t,
          });
      }
    }),
    (Qi.prototype._addListeners = function () {
      var t = { passive: !1 };
      ("ie" !== tt.Browser.type ||
        ("ie" === tt.Browser.type && 8 !== tt.Browser.version)) &&
        (this.element.addEventListener("DOMMouseScroll", this.onWheel),
        this.element.addEventListener("wheel", this.onWheel, t)),
        this.element.addEventListener("mousewheel", this.onWheel, t),
        qi &&
          (this.element.addEventListener("touchstart", this.onTouch),
          this.element.addEventListener("touchmove", this.onTouch)),
        Ji &&
          Gi &&
          ((this.msBodyTouch = document.body.style.msTouchAction),
          (document.body.style.msTouchAction = "none"),
          this.element.addEventListener("MSPointerDown", this.onTouch, !0),
          this.element.addEventListener("MSPointerMove", this.onTouch, !0)),
        this.config.arrowScrolling &&
          Yi &&
          this.element.addEventListener("keydown", this.onKey);
    }),
    (Qi.prototype._removeListeners = function () {
      var t = { passive: !1 };
      ("ie" !== tt.Browser.type ||
        ("ie" === tt.Browser.type && 8 !== tt.Browser.version)) &&
        (this.element.removeEventListener("DOMMouseScroll", this.onWheel),
        this.element.removeEventListener("wheel", this.onWheel, t)),
        this.element.removeEventListener("mousewheel", this.onWheel, t),
        qi &&
          (this.element.removeEventListener("touchstart", this.onTouch),
          this.element.removeEventListener("touchmove", this.onTouch)),
        Ji &&
          Gi &&
          ((this.msBodyTouch = document.body.style.msTouchAction),
          (document.body.style.msTouchAction = "none"),
          this.element.removeEventListener("MSPointerDown", this.onTouch, !0),
          this.element.removeEventListener("MSPointerMove", this.onTouch, !0)),
        this.config.arrowScrolling &&
          Yi &&
          this.element.removeEventListener("keydown", this.onKey);
    }),
    (Qi.prototype.onWheel = function (t) {
      if (!this.state.pause) {
        (t = window.event || t).preventDefault && t.preventDefault();
        var e = this.state.delta,
          i = this.config.mouseMult,
          n = this.config.firefoxMult;
        "detail" in t && "wheel" !== t.type && 0 !== t.detail
          ? ((e.y = -1 * t.detail), (e.y *= n))
          : "wheelDelta" in t && !("wheelDeltaY" in t)
          ? (e.y = -1 * t.wheelDelta)
          : ((e.x = -1 * (t.deltaX || t.wheelDeltaX)),
            (e.y = -1 * (t.deltaY || t.wheelDeltaY)),
            "firefox" === tt.Browser.type &&
              1 === t.deltaMode &&
              n &&
              ((e.x *= n), (e.y *= n))),
          i && ((e.x *= i), (e.y *= i)),
          (this.state.action = "wheel"),
          this.update.call(this, t);
      }
    }),
    (Qi.prototype.onTouch = function (t) {
      if (!this.state.pause) {
        var e = this.state.position,
          i = this.state.delta,
          n = this.config.touchMult,
          o = t.targetTouches[0];
        "move" === t.action
          ? ((i.x = (o.pageX - e.x) * n), (i.y = (o.pageY - e.y) * n))
          : ((i.x = 0), (i.y = 0)),
          (this.state.action = "touch"),
          this.update.call(this, t);
      }
    }),
    (Qi.prototype.onKey = function (t) {
      if (!this.state.pause && !t.metaKey) {
        var e = this.state.delta,
          i = this.config.keyStep;
        switch (t.keyCode) {
          case Ki:
            t.preventDefault && t.preventDefault(), (e.x = 0), (e.y = -i);
            break;
          case Wi:
            t.preventDefault && t.preventDefault(), (e.x = 0), (e.y = i);
            break;
          case Zi:
            (e.x = -i), (e.y = 0);
            break;
          case Ui:
            (e.x = i), (e.y = 0);
            break;
          default:
            return (e.x = 0), void (e.y = 0);
        }
        (this.state.action = "keypress"), this.update.call(this, t);
      }
    }),
    (Qi.prototype.clampX = function (t, e, i) {
      (this.clamp.enabled = t),
        (this.clamp.min.x = e || 0),
        (this.clamp.max.x = i || 0);
    }),
    (Qi.prototype.clampY = function (t, e, i) {
      (this.clamp.enabled = t),
        (this.clamp.min.y = e || 0),
        (this.clamp.max.y = i || 0);
    }),
    (Qi.prototype.reset = function () {
      (this.state.position = { x: 0, y: 0 }),
        (this.state.delta = { x: 0, y: 0 });
    }),
    (Qi.prototype.setPosX = function (t) {
      this.setPos(t, this.state.position.y);
    }),
    (Qi.prototype.setPosY = function (t) {
      this.setPos(this.state.position.x, t);
    }),
    (Qi.prototype.moveYBy = function (t) {
      this.setPos(this.state.position.x, this.state.position.y + t);
    }),
    (Qi.prototype.getY = function () {
      return this.state.position.y;
    }),
    (Qi.prototype.setPos = function (t, e) {
      this.clamp.enabled &&
        ((t = Vt(t, this.clamp.min.x, this.clamp.max.x)),
        (e = Vt(e, this.clamp.min.y, this.clamp.max.y))),
        (this.state.position = { x: t, y: e }),
        (this.state.delta = { x: 0, y: 0 }),
        this.element.emit("scroll-update", {
          x: t,
          y: e,
          delta: this.state.delta,
          action: null,
        });
    }),
    (Qi.prototype.destroy = function () {
      var t = this.state.created;
      this._removeListeners(),
        (this.state = {
          pause: !1,
          action: null,
          position: { x: 0, y: 0 },
          delta: { x: 0, y: 0 },
          created: !1,
        }),
        t && (this.element = this.element.destroy());
    }),
    Qt.proto(Xi, Xt),
    Qt.proto(tn, Xt),
    (tn.prototype.getContainer = function () {
      return this._container;
    }),
    (tn.prototype.scrollInView = function (t, e, i) {
      (this.dom.scrollTop = 0), (this.state.skipAnimationOnce = i);
      var n = -t.offsetTop,
        o = t.offsetHeight,
        s = this.dom.clientHeight,
        r = this._container.dom.scrollHeight,
        a = this.scroll.getY(),
        l = a - s;
      this._handle.css({ display: r <= s ? "none" : "block" }),
        this.scroll.clampY(!0, s - r, 0),
        e
          ? this.scroll.setPosY(n + s / 2 - o / 2)
          : n > a
          ? this.scroll.setPosY(n)
          : n - o < l && this.scroll.setPosY(n + s - o);
    }),
    (tn.prototype._onScrollUpdate = function (t) {
      var e = t.y,
        i = this._handle.dom.offsetHeight,
        n = this.dom.clientHeight,
        o =
          (Rt(e, 0, n - this._container.dom.scrollHeight, 0, 1) || 0) *
          (n - i - 4);
      "ie" === tt.Browser.type && 8 === tt.Browser.version
        ? (this._container.css({ top: e }), this._handle.css({ top: o }))
        : (this._container.css({
            transform: "translateY(" + e + "px)",
            transition: this.state.skipAnimationOnce
              ? "none"
              : "transform 300ms",
          }),
          this._handle.css({
            transform: "translateY(" + o + "px)",
            transition: this.state.skipAnimationOnce
              ? "none"
              : "transform 300ms",
          }),
          (this.state.skipAnimationOnce = !1));
    }),
    (tn.prototype.baseStyle = function () {
      this._container.css({
        width: "100%",
        position: "absolute",
        overflowY: "hidden",
      }),
        this._handle.css({
          position: "absolute",
          willChange: "transform",
          width: 3,
          height: 40,
          top: 2,
          right: 5,
          borderRadius: 4,
          backgroundColor: "#6E829E",
        });
    }),
    (tn.prototype.onDestroy = function () {
      this.scroll.destroy && this.scroll.destroy();
    }),
    Qt.proto(nn, Xt),
    (nn.prototype.usingKb = function (t) {
      this.state.usingKb = t;
    }),
    (nn.prototype.select = function () {
      (this.state.selected = !0),
        this.setAttribute("aria-selected", this.state.selected),
        this.updateStyle(this.state.usingKb),
        this.emit("select", this);
    }),
    (nn.prototype.deselect = function () {
      (this.state.selected = !1),
        this.dom &&
          (this.setAttribute("aria-selected", this.state.selected),
          this.updateStyle());
    }),
    (nn.prototype.focus = function () {
      this.dom && (this.dom.focus(), this.emit("focus"));
    }),
    (nn.prototype.getOptionData = function () {
      return this.state.option;
    }),
    (nn.prototype.setCopy = function () {
      this._text.text(ae.translate(this.state.option.text));
    }),
    (nn.prototype._onHover = function (t) {
      this.emit("hover", t), this.usingKb(!1), this.updateStyle(t);
    }),
    (nn.prototype.updateStyle = function (t) {
      if (this.dom) {
        var e = this.state.theme.get().palette,
          i = this.state.style;
        this.css({
          background: this.state.selected
            ? i.selected.fill
            : t
            ? i.hover.fill
            : i.main.fill,
          color: this.state.option.warn
            ? e.warn.main
            : this.state.selected
            ? i.selected.text
            : t
            ? i.hover.text
            : i.main.text,
          borderColor: this.state.usingKb && t ? i.hover.border : "transparent",
        }),
          this._separator.css({
            display:
              this.state.isLast || this.state.selected || t ? "none" : "block",
          });
      }
    }),
    (nn.prototype.text = function () {
      return this._text.text();
    }),
    (nn.prototype.style = function (t) {
      (this.state.isLast = t), (this.state.style = en(this.state.theme.get()));
      this.css({
        position: "relative",
        cursor: "pointer",
        height: this.state.height - 6,
        fontSize: 14,
        fontWeight: 400,
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: "transparent",
      }),
        this._separator.css({
          position: "absolute",
          height: 1,
          bottom: -4,
          left: 10,
          right: 10,
          background: this.state.style.main.line,
        }),
        this.updateStyle();
    }),
    Qt.proto(on, tn),
    (on.prototype.getSelected = function () {
      return this.state.selected && this.state.selected.getOptionData();
    }),
    (on.prototype.setCopy = function () {
      for (var t = this._options.length; t--; ) this._options[t].setCopy();
    }),
    (on.prototype.setOptions = function (t) {
      for (var e, i = this._options.length; i--; )
        this.getContainer().removeElement(this._options[i]);
      for (this._options = [], i = 0; i < t.length; i++) {
        e = this.getContainer().initComponent(nn, {
          theme: this.state.theme,
          isMenu: this.state.isMenu,
          size: t.length,
          height: this.state.optionHeight,
          option: t[i],
        });
        var n = i === t.length - 1;
        e.usingKb(this.state.usingKb),
          e.style(n),
          this._options.push(e),
          e.on("select", this._onOptionSelect.bind(this, e)),
          e.on("focus", this._onOptionFocus.bind(this, i)),
          e.on("blur", this._onOptionBlur.bind(this, i)),
          e.on("hover", this._onOptionHover.bind(this));
      }
      var o =
        -1 === this.state.optionsVisible
          ? this._options.length
          : this.state.optionsVisible;
      this.css({ height: o * this.state.optionHeight });
    }),
    (on.prototype.select = function (t) {
      for (var e = null, i = this._options.length; i--; )
        t === this._options[i].getOptionData().value && (e = this._options[i]);
      if (!e) throw new Error("Cannot select a missing option value: " + t);
      e.select();
    }),
    (on.prototype.deselect = function () {
      this.state.selected && this.state.selected.deselect(),
        (this.state.selected = null);
    }),
    (on.prototype._onOptionSelect = function (t) {
      this.hide(),
        this.state.selected &&
          this.state.selected !== t &&
          this.state.selected.deselect(),
        (this.state.selected = t),
        this.emit("select", t.getOptionData());
    }),
    (on.prototype._onOptionFocus = function (t) {
      this.state.focusedId = t;
      var e = this._options[t],
        i = !this.state.centerOnce && e === this.state.selected;
      i && (this.state.centerOnce = !0), this.scrollInView(e.dom, i, i);
    }),
    (on.prototype._onOptionHover = function () {
      for (var t = this._options.length; t--; )
        this._options[t].updateStyle(!1);
    }),
    (on.prototype._onOptionBlur = function () {
      var t = this;
      (this.state.focusedId = -1),
        setTimeout(function () {
          t.dom && -1 === t.state.focusedId && t.hide();
        }, 0);
    }),
    (on.prototype.isVisible = function () {
      return this.state.visible;
    }),
    (on.prototype.hide = function () {
      this.state.visible &&
        ((this.state.visible = !1),
        this.setAttribute("aria-expanded", !1),
        this.css({ display: "none" }),
        this.emit("hide"));
    }),
    (on.prototype.open = function () {
      if (!this.state.visible) {
        (this.state.centerOnce = !1),
          (this.state.visible = !0),
          this.setAttribute("aria-expanded", !0),
          this.css({ display: "block" });
        var t = this.state.selected ? this.state.selected : this._options[0];
        t && t.focus(), this.emit("open");
      }
    }),
    (on.prototype.usingKb = function (t) {
      this.state.usingKb = t;
      for (var e = this._options.length; e--; ) this._options[e].usingKb(t);
    }),
    (on.prototype.style = function (t) {
      var e = (function (t) {
        var e = t.palette,
          i = t.component;
        return _i.merge(
          { main: { fill: e.common.white, border: "#6E829E" } },
          i.list
        );
      })(this.state.theme.get());
      this.css({
        width: t || 160,
        display: this.isVisible() ? "block" : "none",
        zIndex: 100,
        background: e.main.fill,
        boxShadow: "rgba(0, 0, 0, 0.3) 0px 0px 4px",
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: "solid",
        borderColor: e.main.border,
        position: "absolute",
        overflow: "hidden",
        left: 0,
      }),
        this.getContainer().css({
          lineHeight: this.state.optionHeight - 6,
          whiteSpace: "nowrap",
          textAlign: "center",
        }),
        this.baseStyle();
    }),
    (on.prototype.onKeyPress = function (t) {
      var e = this;
      if (27 === t.keyNum)
        return (
          t.stopPropagation && t.stopPropagation(),
          t.preventDefault && t.preventDefault(),
          void e.hide()
        );
      if (-1 === [13, 32].indexOf(t.keyNum)) {
        if ((this.usingKb(!0), -1 !== [38, 40].indexOf(t.keyNum))) {
          var i =
            (e.state.focusedId + (38 === t.keyNum ? -1 : 1)) %
            e._options.length;
          return (
            -1 === i && (i = e._options.length - 1),
            t.stopPropagation && t.stopPropagation(),
            t.preventDefault && t.preventDefault(),
            void e._options[i].focus()
          );
        }
        this.state.searchTimer && clearTimeout(this.state.searchTimer),
          (this.state.searchTimer = setTimeout(function () {
            e.state.search = "";
          }, 500)),
          (this.state.search += String.fromCharCode(t.keyCode));
        var n = this._findByValue(this.state.search);
        n && n.focus();
      }
    }),
    (on.prototype._findByValue = function (t) {
      t = t.toLowerCase();
      for (var e = null, i = this._options.length; i--; )
        0 === this._options[i].text().toLowerCase().indexOf(t) &&
          (e = this._options[i]);
      return e;
    }),
    Qt.proto(sn, Xt),
    (sn.prototype.setStyle = function (t) {
      t = t || {};
      var e = (function (t) {
        var e = t.palette,
          i = t.component,
          n = "light" === e.mode;
        return _i.merge(
          {
            main: {
              fill: e.grey[n ? 100 : 800],
              border: e.grey[n ? 300 : 200],
            },
            hover: { fill: e.grey[n ? 200 : 900] },
          },
          i.box
        );
      })(this._theme.get());
      (this.boxState.css.boxSizing =
        t.boxSizing || this.boxState.css.boxSizing || "content-box"),
        (this.boxState.css.width =
          t.width || this.boxState.css.width || "100%"),
        (this.boxState.css.height =
          t.height || this.boxState.css.height || "100%"),
        (this.boxState.css.padding =
          t.padding || this.boxState.css.padding || 0),
        (this.boxState.css.margin = t.margin || this.boxState.css.margin || 0),
        (this.boxState.css.borderWidth =
          t.borderWidth || this.boxState.css.borderWidth || 0),
        (this.boxState.css.borderRadius =
          t.borderRadius || this.boxState.css.borderRadius || 0),
        (this.boxState.css.borderStyle =
          t.borderStyle || this.boxState.css.borderStyle || "solid"),
        (this.boxState.css.borderColor =
          t.borderColor || this.boxState.css.borderColor || e.main.border),
        (this.boxState.css.backgroundColor =
          t.backgroundColor ||
          this.boxState.css.backgroundColor ||
          e.main.fill),
        (this.boxState.css.cursor =
          t.cursor || this.boxState.css.cursor || "default"),
        this.css(this.boxState.css);
    }),
    (sn.prototype.setVisible = function (t) {
      (this.boxState.visible = t),
        this.setAttribute("aria-hidden", !t),
        this.css({ display: t ? "block" : "none" });
    }),
    (sn.prototype.setAriaLabel = function (t) {
      t
        ? this.setAttribute("aria-label", t)
        : this.boxState.ariaLabel &&
          this.setAttribute(
            "aria-label",
            ae.translate(this.boxState.ariaLabel)
          );
    }),
    Qt.proto(rn, Xt),
    (rn.prototype.style = function (t, e, i) {
      e || (e = t),
        i !== undefined && (this.state.thickness = i),
        this.css({
          width: t,
          height: e,
          opacity: this.state.visible ? 1 : 0,
          position: "absolute",
          left: 0,
          top: 0,
          overflow: "hidden",
          borderRadius: this.state.rounded,
        }),
        this.$top.css({
          position: "absolute",
          left: 0,
          top: 0,
          width: t,
          height: this.state.thickness,
          backgroundColor: this.state.color,
        }),
        this.$bottom.css({
          position: "absolute",
          left: 0,
          bottom: 0,
          width: t,
          height: this.state.thickness,
          backgroundColor: this.state.color,
        }),
        this.$right.css({
          position: "absolute",
          right: 0,
          top: 0,
          width: this.state.thickness,
          height: e,
          backgroundColor: this.state.color,
        }),
        this.$left.css({
          position: "absolute",
          left: 0,
          top: 0,
          width: this.state.thickness,
          height: e,
          backgroundColor: this.state.color,
        });
    }),
    (rn.prototype.setVisibility = function (t) {
      (this.state.visible = t), this.css({ opacity: t ? 1 : 0 });
    }),
    (rn.prototype.setColor = function (t) {
      (this.state.color = t),
        this.$top.css({ backgroundColor: this.state.color }),
        this.$bottom.css({ backgroundColor: this.state.color }),
        this.$right.css({ backgroundColor: this.state.color }),
        this.$left.css({ backgroundColor: this.state.color });
    }),
    (rn.prototype.isVisible = function () {
      return this.state.visible;
    }),
    Qt.proto(ln, Xt),
    (ln.prototype.setUrl = function (t) {
      this.state.url = t;
    }),
    (ln.prototype.getUrl = function () {
      return this.state.url;
    }),
    (ln.prototype.size = function (t, e) {
      var i = an(this.state.theme.get());
      t && (this.state.width = t),
        e ? (this.state.height = e) : t && (this.state.height = t),
        this.css({
          outlineColor: i.focus.outline,
          display: "block",
          width: this.state.width,
          height: this.state.height,
        }),
        this.graphic.size(this.state.width, this.state.height);
    }),
    (ln.prototype.onSelect = function (t) {
      t.preventDefault && t.preventDefault(),
        window.open(this.state.url, "_blank");
    }),
    (ln.prototype.onFocus = function (t) {
      var e = an(this.state.theme.get()).focus.outline;
      this.css({ outline: "2px solid " + e });
    }),
    (ln.prototype.onBlur = function (t) {
      this.css({ outline: "none" });
    }),
    Qt.proto(hn, Xt),
    (hn.prototype.size = function (t, e) {
      (this.config.size = t || this.config.size),
        (this._style = cn(this._theme.get()));
      var i = e || this._style.main.fill,
        n = this.state.visible ? 1 : 1.2;
      if (
        (this.css({
          width: this.config.size,
          height: this.config.size,
          borderRadius: "50%",
          opacity: this.state.visible ? 1 : 0,
          transition: "none",
        }),
        this.$fill.css({
          backgroundColor: i,
          width: this.config.size,
          height: this.config.size,
          position: "absolute",
          transform: "scale(" + n + ")",
          top: 0,
          left: 0,
          zIndex: 5,
          transition: "none",
          borderRadius: "50%",
          border: 1,
          borderColor: "#fff",
        }),
        this.$radial.css({
          backgroundColor: i,
          width: this.config.size,
          height: this.config.size,
          transform: "scale(1)",
          position: "absolute",
          opacity: 0.5,
          top: 0,
          left: 0,
          zIndex: 0,
          transition: "none",
          borderRadius: "50%",
        }),
        this.icon)
      ) {
        var o = this._style.main.icon;
        this.$wrapper.css({
          width: this.config.size,
          height: this.config.size,
          overflow: "hidden",
        }),
          this.icon.fill(o),
          this.icon.size(this.config.size, this.config.size),
          this.icon.css({ position: "absolute", top: 0, left: 0, zIndex: 15 });
      }
    }),
    (hn.prototype.display = function (t, e) {
      this._timer && (this._timer = clearTimeout(this._timer)),
        this.resetAnimation(),
        e
          ? (this._timer = setTimeout(
              function () {
                (this.state.visible = t),
                  t ? this.animateIn() : this.animateOut();
              }.bind(this),
              16
            ))
          : this.reset(t);
    }),
    (hn.prototype.reset = function (t) {
      (this.state.visible = t),
        this.css({ transition: "none", opacity: t ? 1 : 0 }),
        this.icon.css({
          top: t ? 0 : this.config.size / 4,
          opacity: t ? 1 : 0,
          transition: "none",
        }),
        this.$radial.css({ opacity: 0, transition: "none" }),
        this.$fill.css({ transition: "none", transform: "scale(1)" });
    }),
    (hn.prototype.resetAnimation = function () {
      var t = this.state.visible ? 1 : 0.75;
      this.$fill.css({ transition: "none", transform: "scale(" + t + ")" }),
        this.$radial.css({
          opacity: 0.25,
          transition: "none",
          transform: "scale(1)",
        }),
        this.icon.css({
          top: this.state.visible ? 0 : this.config.size / 4,
          opacity: this.state.visible ? 1 : 0,
          transition: "none",
        });
    }),
    (hn.prototype.animateIn = function () {
      this.css({
        transition: "all 0.25s cubic-bezier(0.33, 1, 0.68, 1)",
        opacity: 1,
      }),
        this.$fill.css({
          transition: "all 0.25s cubic-bezier(.18,1.78,.66,.84) 0.05s",
          transform: "scale(1)",
        }),
        this.$radial.css({
          opacity: 0,
          transition: "all 0.35s cubic-bezier(0.33, 1, 0.68, 1) 0.05s",
          transform: "scale(1.5)",
        }),
        this.icon.css({
          top: 0,
          opacity: 1,
          transition: "all 0.25s cubic-bezier(0.33, 1, 0.68, 1) 0.05s",
        });
    }),
    (hn.prototype.animateOut = function () {
      this.css({
        transition: "opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1) 0.05s",
        opacity: 0,
      }),
        this.$fill.css({
          transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1) 0.05s",
          transform: "scale(0.65)",
        }),
        this.$radial.css({ opacity: 0, transition: "none" }),
        this.icon.css({
          top: -this.config.size / 4,
          opacity: 0,
          transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
        });
    }),
    (hn.prototype.fill = function (t) {
      this.$fill.css({ backgroundColor: t, transition: "none" }),
        this.$radial.css({ backgroundColor: t, transition: "none" });
    });
  var un = {
    __proto__: null,
    Graphic: Mi,
    ListNative: zi,
    ListCustom: on,
    Link: Li,
    Logo: ln,
    Span: Bi,
    Markdown: Hi,
    IconButton: Pi,
    TextButton: Di,
    ActionButton: Fi,
    RadioButton: Ii,
    TextArea: Ni,
    Box: sn,
    Border: rn,
    Badge: hn,
  };
  function dn() {
    Qt.self(this, Pi, {
      title: "Close Modal",
      name: "close",
      src: "data:image/svg+xml,%3csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M17.5669 4.17308C17.1764 3.78256 16.5432 3.78256 16.1527 4.17308L11 9.32578L5.84731 4.17309C5.45678 3.78257 4.82362 3.78257 4.43309 4.17309L4.17308 4.43311C3.78256 4.82363 3.78256 5.4568 4.17308 5.84732L9.32577 11L4.17309 16.1527C3.78257 16.5432 3.78257 17.1764 4.17309 17.5669L4.4331 17.8269C4.82363 18.2174 5.45679 18.2174 5.84732 17.8269L11 12.6742L16.1527 17.8269C16.5432 18.2174 17.1764 18.2174 17.5669 17.8269L17.8269 17.5669C18.2174 17.1764 18.2174 16.5432 17.8269 16.1527L12.6742 11L17.8269 5.84731C18.2174 5.45678 18.2174 4.82362 17.8269 4.43309L17.5669 4.17308Z'/%3e%3c/svg%3e",
      theme: Si,
      width: 30,
      height: 30,
    });
  }
  function pn() {
    Qt.self(this, Xt, "header"),
      (this.state = { visible: !0 }),
      (this.$title = this.createElement("h2", "#modal-title")),
      (this.$underline = this.createElement(".underline")),
      this.setAttribute("role", "heading");
  }
  function fn(t) {
    var e = t.palette,
      i = t.component,
      n = "light" === e.mode;
    return _i.merge(
      {
        main: { fill: e.common.white, border: e.grey[n ? 300 : 200] },
        hover: { fill: e.grey[n ? 200 : 700] },
        focus: { outline: e.primary.main },
      },
      i.modal
    );
  }
  function mn() {
    Qt.self(this, Xt, "modal");
    var t = this;
    (this.state = { visible: !1, curr: null, prev: null }),
      (this._style = fn(Si.get())),
      this.addClass("no-outline"),
      this.setAttribute("role", "dialog"),
      this.setAttribute("aria-modal", !0),
      this.setAttribute("tabindex", "0"),
      (this.header = this.initComponent(pn)),
      this.header.on("close", function () {
        t.emit("close");
      }),
      (this.$content = this.createElement("#modal-content")),
      this.$content.addClass("content"),
      this.setAttribute("aria-describedby", "modal-content"),
      (this.close = this.initComponent(dn)),
      this.close.on("click", function () {
        t.emit("close");
      }),
      this.addEventListener("keydown", function (e) {
        t.dom &&
          9 === e.keyNum &&
          (e.shiftKey
            ? document.activeElement === t.dom &&
              (t.close.focus(), e.preventDefault && e.preventDefault())
            : document.activeElement === t.close.dom &&
              (t.focus(), e.preventDefault && e.preventDefault()));
      }),
      this.addEventListener("focus", function () {
        t.css({ border: "2px solid " + t._style.focus.outline });
      }),
      this.addEventListener("blur", function () {
        t.css({ border: "none" });
      });
  }
  function yn(t) {
    Qt.self(this, Xt, "copy", "p");
    var e = this;
    t || (t = {}),
      (this.state = {
        text: t.text || "",
        linkUnderline: t.linkUnderline || !1,
        link: t.link || !1,
        linkText: t.linkText || "",
        linkTo: t.linkTo || null,
        replaceText: t.replaceText || null,
      }),
      this.state.link &&
        ((this.link = new Li({
          theme: Si,
          text: this.state.linkText,
          url: this.state.linkTo,
          underline: this.state.linkUnderline,
        })),
        this.state.linkTo &&
          this.link.on("click", function (t) {
            e.emit("click", t);
          }));
  }
  Qt.proto(dn, Pi),
    (dn.size = dn.prototype.size = 30),
    Qt.proto(pn, Xt),
    (pn.prototype.style = function (t, e) {
      var i = e ? 40 : 44,
        n = Si.get().palette,
        o = "light" === n.mode;
      return (
        this.$title.css({
          color: o ? n.text.heading : n.grey[700],
          fontWeight: 600,
          textAlign: "left",
          fontSize: e ? 15 : 16,
          display: this.state.visible ? "table-cell" : "none",
          verticalAlign: "middle",
          paddingTop: 2,
          height: i,
          width: t - dn.size,
        }),
        this.$underline.css({
          backgroundColor: n.primary.main,
          width: t,
          height: 1,
          top: i,
          position: "absolute",
        }),
        this.css({ width: t, height: i, position: "relative", top: 0 }),
        { height: i, width: t }
      );
    }),
    (pn.prototype.setCopy = function (t) {
      var e = ae.translate(t);
      this.$title.text(e);
    }),
    (pn.prototype.display = function (t) {
      (this.state.visible = t),
        this.css({ display: t ? "table-cell" : "none" });
    }),
    (pn.prototype.isVisible = function () {
      return this.state.visible;
    }),
    Qt.proto(mn, Xt),
    (mn.prototype.load = function () {
      this.close.load();
    }),
    (mn.prototype.style = function (t, e) {
      var i = t < 300;
      (this._style = fn(Si.get())),
        this.css({
          width: t,
          maxHeight: e,
          position: "relative",
          margin: "0 auto",
          backgroundColor: this._style.main.fill,
          display: this.header ? "block" : "table",
          borderRadius: 4,
          zIndex: 10,
          overflow: "hidden",
          border: "1px solid " + this._style.main.border,
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 2px",
          padding: "0px 15px 15px",
        }),
        this.header.isVisible()
          ? (this.header.style(t, i),
            this.$content.css({
              display: "block",
              height: "auto",
              marginTop: 10,
            }))
          : this.$content.css({
              display: "table-cell",
              verticalAlign: "middle",
              marginTop: 0,
              height: e,
            }),
        this.close.style(),
        this.close.css({ position: "absolute", right: 20, top: i ? 5 : 7 });
    }),
    (mn.prototype.setTitle = function (t) {
      t
        ? (this.header.display(!0),
          this.header.setCopy(t),
          this.close.setTitle())
        : this.header.display(!1);
    }),
    Qt.proto(yn, Xt),
    (yn.prototype.style = function (t, e) {
      var i = Si.get().palette,
        n = "light" === i.mode;
      e || (e = "center"),
        this.css({
          width: "100%",
          fontSize: t,
          textAlign: e,
          fontWeight: 400,
          color: n ? i.text.body : i.grey[700],
          lineHeight: t + 6,
          display: "inline",
        }),
        this.state.link &&
          (this.link.style(t), this.link.css({ display: "inline" }));
    }),
    (yn.prototype.translate = function () {
      var t = ae.translate(this.state.text);
      if (this.state.link)
        if ((this.link.translate(), this.state.replaceText)) {
          var e = t.split("{{" + this.state.replaceText + "}}"),
            i = document.createTextNode(e[0]);
          if (
            (this.appendElement(i), this.appendElement(this.link), "" !== e[1])
          ) {
            var n = document.createTextNode(e[1]);
            this.appendElement(n);
          }
        } else {
          var o = document.createTextNode(t + " ");
          this.appendElement(o), this.appendElement(this.link);
        }
      else this.content(t);
    });
  function gn() {
    Qt.self(this, Xt, "instructions");
    var t = this;
    (this.copy = this.initComponent(yn, {
      text: "hCaptcha is a service that reduces bots and spam by asking simple questions. Please follow the instructions at the top of the screen for each challenge. For more information visit {{site-url}}",
      link: !0,
      linkText: "hcaptcha.com",
      linkTo:
        "https://www.hcaptcha.com/what-is-hcaptcha-about?ref=" +
        ct.host +
        "&utm_campaign=" +
        ct.sitekey +
        "&utm_medium=embed_about",
      replaceText: "site-url",
    })),
      this.copy.on("click", function (e) {
        e.preventDefault(), hi(t.copy.state.linkTo);
      });
  }
  function vn() {
    Qt.self(this, Xt, "feedback");
    var t = this;
    (this.info = this.initComponent(Bi, { text: "Having a problem?" })),
      (this.link = this.initComponent(Li, {
        theme: Si,
        underline: !0,
        text: "Give feedback.",
      })),
      this.link.on("click", function () {
        t.emit("click");
      });
  }
  function bn() {
    Qt.self(this, Xt, "information");
    var t = this;
    (this.instructions = this.initComponent(gn, null, this.$content)),
      (this.feedback = this.initComponent(vn, null, this.$content)),
      this.feedback.on("click", function () {
        t.emit("change", "feedback");
      });
  }
  function wn() {
    Qt.self(this, Xt, "actions");
    var t = this;
    (this.cancel = this.initComponent(Fi, {
      theme: Si,
      selector: "button-cancel",
      title: "Cancel",
      type: "warn",
    })),
      (this.send = this.initComponent(Fi, {
        theme: Si,
        selector: "button-send",
        title: "Send",
        type: "confirm",
      })),
      this.cancel.on("click", function () {
        t.emit("cancel");
      }),
      this.send.on("click", function () {
        t.emit("confirm");
      });
  }
  Qt.proto(gn, Xt),
    (gn.prototype.style = function (t) {
      this.copy.style(t, "left");
    }),
    (gn.prototype.setCopy = function () {
      this.copy.translate();
    }),
    Qt.proto(vn, Xt),
    (vn.prototype.style = function (t) {
      var e = Math.floor(Rt(t, 250, 300, 11, 13)),
        i = Si.get().palette,
        n = "light" === i.mode;
      this.css({
        textAlign: "center",
        color: n ? i.text.body : i.grey[700],
        fontSize: e,
        fontWeight: 500,
        width: t,
        margin: "0 auto",
      }),
        this.link.css({ fontWeight: 500, marginLeft: 3 });
    }),
    (vn.prototype.setCopy = function () {
      var t = ae.translate("Provide feedback regarding the hCaptcha service.");
      this.info.translate(),
        this.link.translate(),
        this.link.setAttribute("aria-label", t);
    }),
    Qt.proto(bn, Xt),
    (bn.prototype.style = function (t, e, i) {
      var n = Math.floor(Rt(t, 250, 275, 12, 14));
      this.instructions.style(n),
        this.instructions.css({ marginBottom: 10 }),
        this.feedback.style(t);
    }),
    (bn.prototype.setCopy = function () {
      this.instructions.setCopy(), this.feedback.setCopy();
    }),
    Qt.proto(wn, Xt),
    (wn.prototype.style = function (t, e, i) {
      this.send.style(),
        this.cancel.style(t, i),
        this.cancel.css({ position: "absolute", left: 0 }),
        this.send.css({ position: "absolute", right: 0 });
    }),
    (wn.prototype.setCopy = function () {
      this.cancel.setText(), this.send.setText();
    }),
    (wn.prototype.lockSend = function (t) {
      this.send.lock(t),
        t
          ? this.send.setLabel("Please select an option to send response.")
          : this.send.removeAttribute("aria-label");
    }),
    (wn.prototype.visible = function (t) {
      this.cancel.enable(t), this.send.enable(t);
    });
  function xn() {
    Qt.self(this, Xt, "instructions"),
      (this.copy = this.initComponent(yn, {
        text: "Please select Confirm to follow the link, or Cancel to stay on the current screen.",
      }));
  }
  function Cn(t) {
    Qt.self(this, Xt, "navigation");
    var e = this;
    (this.confirmation = this.initComponent(xn)),
      (this.actions = this.initComponent(wn)),
      this.actions.on("confirm", function () {
        window.open(t.url, "_blank"), e.emit("close");
      }),
      this.actions.on("cancel", function () {
        e.emit("close");
      });
  }
  function kn(t) {
    Qt.self(this, Xt, "options"),
      (this.state = { visible: !0 }),
      (this.handeSelect = this.handeSelect.bind(this)),
      (this.$wrapper = this.createElement(".column-wrapper")),
      (this.$left = this.$wrapper.createElement(".column-left")),
      (this.$right = this.$wrapper.createElement(".column-right")),
      (this.options = []);
    for (var e = null, i = null, n = null, o = 0; o < t.length; o++)
      (n = t[o]),
        (i = o >= t.length / 2 ? this.$right : this.$left),
        (e = this.initComponent(
          Ii,
          { theme: Si, text: n.text, value: n.value },
          i
        )).setCopy(),
        e.on("select", this.handeSelect),
        this.options.push(e);
  }
  Qt.proto(xn, Xt),
    (xn.prototype.style = function (t) {
      this.copy.style(t, "left");
    }),
    (xn.prototype.setCopy = function () {
      this.copy.translate();
    }),
    Qt.proto(Cn, Xt),
    (Cn.prototype.style = function (t, e, i) {
      var n = Math.floor(Rt(t, 250, 275, 12, 14));
      this.confirmation.style(n),
        this.confirmation.css({ marginBottom: 10 }),
        this.actions.style(t, i),
        this.actions.css({
          width: i ? 200 : 220,
          height: 35,
          position: "relative",
          margin: "10px auto 0px",
        });
    }),
    (Cn.prototype.setCopy = function () {
      this.confirmation.setCopy(), this.actions.setCopy();
    }),
    Qt.proto(kn, Xt),
    (kn.prototype.style = function (t, e) {
      var i = Math.floor(t / 2);
      this.$left.css({ width: "50%", display: "inline-block" }),
        this.$right.css({ width: "50%", display: "inline-block" });
      for (var n = 0; n < this.options.length; n++) this.options[n].style(i);
    }),
    (kn.prototype.handeSelect = function (t) {
      if (this.state.visible) {
        for (var e = !1, i = 0; i < this.options.length; i++)
          (e = this.options[i] === t) && e === t.state.selected && (e = !e),
            this.options[i].toggle(e);
        this.emit("update", t);
      }
    }),
    (kn.prototype.visible = function (t) {
      (this.state.visible = t),
        this.css({ display: t ? "inline-block" : "none" });
      for (var e = 0; e < this.options.length; e++) this.options[e].lock(!t);
    }),
    (kn.prototype.setCopy = function () {
      for (var t = 0; t < this.options.length; t++) this.options[t].setCopy();
    });
  var _n = "Please provide details and steps to reproduce.",
    En = [
      { text: "Can't Solve", value: "captcha_solve" },
      { text: "Can't Click", value: "captcha_usability" },
      { text: "Off Screen", value: "captcha_position" },
      { text: "Other", value: "other" },
    ],
    Sn = "Please describe your issue.",
    An = [
      { text: "Inappropriate", value: "inappropriate" },
      { text: "Violent", value: "violent" },
      { text: "Too Difficult", value: "difficulty" },
      { text: "Other", value: "other" },
    ],
    Ln = "Please describe your issue.",
    Bn = [
      { text: "Inappropriate", value: "content" },
      { text: "Software Bug", value: "software" },
      { text: "Too Difficult", value: "difficulty" },
      { text: "Other", value: "other" },
    ];
  function Hn(t) {
    Qt.self(this, Xt, "report");
    var e = this;
    this.state = { selected: null, taskKey: t.key, type: t.type };
    var i,
      n,
      o,
      s =
        ((i = t.type),
        (n = Ln),
        (o = Bn),
        "bug" === i
          ? ((n = _n), (o = En))
          : "image" === i && ((n = Sn), (o = An)),
        { prompt: n, options: o });
    (this.options = this.initComponent(kn, s.options)),
      (this.comment = this.initComponent(Ni, {
        placeholder: s.prompt,
        theme: Si,
      })),
      (this.actions = this.initComponent(wn)),
      this.actions.lockSend(!0),
      this.options.on("update", this.storeAnswer.bind(this)),
      this.actions.on("confirm", this.sendMessage.bind(this)),
      this.actions.on("cancel", function () {
        e.emit("close");
      }),
      this.setAttribute("role", "radiogroup");
  }
  function Mn() {
    Qt.self(this, Xt, "thanks-feedback");
    var t = this;
    if (
      ((this.$copy = this.createElement(".feedback-thanks")),
      (this.$resolve = this.createElement(".feedback-resolve")),
      (this.$option = this.createElement(".accessibility-option")),
      (this.$option.content = this.initComponent(
        Bi,
        { theme: Si, text: "Please also try turning off your ad blocker.â€" },
        this.$option
      )),
      (this.$option.link = this.initComponent(
        Li,
        { theme: Si, text: "Our accessibility option may help." },
        this.$option
      )),
      (this.$bug = this.createElement(".feedback-bug")),
      (this.$bug.content = this.initComponent(
        Bi,
        { theme: Si, text: "Reporting a functionality issue?" },
        this.$bug
      )),
      (this.$bug.link = this.initComponent(
        Li,
        { theme: Si, text: "See how to report issues with detailed logs." },
        this.$bug
      )),
      this.$bug.link.addEventListener("click", function () {
        hi("https://www.hcaptcha.com/reporting-bugs");
      }),
      this.$option.link.on("click", function () {
        hi("https://hcaptcha.com/accessibility");
      }),
      !1 === tt.System.mobile)
    ) {
      var e = function (e) {
        var i = Si.get().palette,
          n = "light" === i.mode;
        t.$bug.link.css(
          "over" === e.action
            ? { color: i.primary.main, textDecoration: "underline" }
            : { color: n ? i.text.body : i.grey[700], textDecoration: "none" }
        );
      };
      this.$bug.link.addEventListener("over", e),
        this.$bug.link.addEventListener("out", e);
      var i = function (e) {
        var i = Si.get().palette,
          n = "light" === i.mode;
        t.$option.link.css(
          "over" === e.action
            ? { color: i.primary.main, textDecoration: "underline" }
            : { color: n ? i.text.body : i.grey[700], textDecoration: "none" }
        );
      };
      this.$option.link.addEventListener("over", i),
        this.$option.link.addEventListener("out", i);
    }
  }
  function On() {
    Qt.self(this, Xt, "thanks-accessibility");
    var t = this;
    (this.$sorry = this.createElement(".accessibility-text")),
      (this.$option = this.createElement(".accessibility-option")),
      (this.$avoid = this.createElement(".accessibility-avoid"));
    var e = function (t) {
      hi("https://hcaptcha.com/accessibility");
    };
    if (
      (this.$option.addEventListener("enter", e),
      this.$option.addEventListener("down", e),
      !1 === tt.System.mobile)
    ) {
      var i = function (e) {
        var i = Si.get().palette,
          n = "light" === i.mode;
        t.$option.css(
          "over" === e.action
            ? { color: i.primary.main, textDecoration: "underline" }
            : { color: n ? i.text.body : i.grey[700], textDecoration: "none" }
        );
      };
      this.$option.addEventListener("over", i),
        this.$option.addEventListener("out", i);
    }
  }
  function Tn() {
    Qt.self(this, Xt, "thanks-feedback"),
      (this.$copy = this.createElement(".feedback-thanks")),
      (this.$resolve = this.createElement(".feedback-resolve"));
  }
  function Vn(t) {
    Qt.self(this, Xt, "thanks"),
      "accessibility" === t.response
        ? (this.copy = this.initComponent(On, null, this.$content))
        : "image" === t.response
        ? (this.copy = this.initComponent(Tn, null, this.$content))
        : (this.copy = this.initComponent(Mn, null, this.$content));
  }
  Qt.proto(Hn, Xt),
    (Hn.prototype.style = function (t, e, i) {
      this.options.style(t, i),
        this.options.css({ marginBottom: 10 }),
        this.comment.style(t, i),
        this.comment.css({ marginTop: 10 }),
        this.actions.style(t, i),
        this.actions.css({
          width: i ? 200 : 220,
          height: 35,
          position: "relative",
          margin: "10px auto 0px",
        });
    }),
    (Hn.prototype.sendMessage = function () {
      var t = "",
        e = this.comment.getValue();
      this.state.selected && (t = this.state.selected.state.text),
        this.comment.setValue(""),
        this.comment.visible(!1),
        this.options.visible(!1),
        this.actions.visible(!1),
        this.emit("report", { reason: t, comment: e, key: this.state.taskKey }),
        this.emit("change", "thanks", { response: this.state.type });
    }),
    (Hn.prototype.storeAnswer = function (t) {
      var e = t.state.selected,
        i = "other" === t.state.value && e;
      this.comment.visible(i),
        (this.state.selected = e ? t : null),
        this.actions.lockSend(null === this.selected);
    }),
    (Hn.prototype.setCopy = function (t) {
      this.options.setCopy(),
        this.comment.setPlaceholder(),
        this.actions.setCopy();
    }),
    Qt.proto(Mn, Xt),
    (Mn.prototype.style = function (t, e) {
      var i = Rt(t, 280, 310, 260, 310),
        n = Rt(t, 280, 300, 12, 13),
        o = n + 4,
        s = Si.get().palette,
        r = "light" === s.mode;
      this.css({
        fontWeight: 500,
        textAlign: "center",
        fontSize: n + 1,
        lineHeight: n + 4,
        color: r ? s.text.body : s.grey[700],
        width: t,
      }),
        this.$copy.css({
          width: i,
          margin: "0 auto",
          fontWeight: 600,
          marginBottom: 2,
        }),
        this.$resolve.css({
          fontSize: n,
          lineHeight: o,
          width: i,
          margin: "0 auto",
          marginBottom: 10,
        }),
        this.$option.css({ fontSize: n, lineHeight: o, marginBottom: 10 }),
        this.$option.link.css({ fontSize: n, lineHeight: o }),
        this.$bug.css({
          fontSize: n - 1,
          lineHeight: o - 1,
          width: i,
          margin: "0 auto",
          marginBottom: -2,
        }),
        this.$bug.link.css({
          fontSize: n - 1,
          lineHeight: o - 1,
          width: i,
          margin: "0 auto",
          cursor: "pointer",
        });
    }),
    (Mn.prototype.setCopy = function () {
      var t = ae.translate("Thank you for your feedback."),
        e = ae.translate("We'll resolve your issue as quickly as we can.");
      this.$copy.text(t),
        this.$resolve.text(e),
        this.$bug.content.translate(),
        this.$bug.link.translate(),
        this.$option.content.translate(),
        this.$option.link.translate();
      var i = ae.translate("View our accessibility option."),
        n = ae.translate("Give a detailed report of a bug you've encountered.");
      this.$option.link.setAttribute("aria-label", i),
        this.$bug.link.setAttribute("aria-label", n);
    }),
    Qt.proto(On, Xt),
    (On.prototype.style = function (t, e) {
      var i = Rt(t, 280, 310, 260, 310),
        n = Rt(t, 280, 300, 12, 13),
        o = n + 4,
        s = Si.get().palette,
        r = "light" === s.mode;
      this.css({
        fontWeight: 500,
        fontSize: n + 1,
        lineHeight: o,
        textAlign: "center",
        color: r ? s.text.body : s.grey[700],
        width: t,
      }),
        this.$sorry.css({
          fontWeight: 600,
          width: i,
          margin: "0 auto",
          marginBottom: 2,
        }),
        this.$option.css({
          fontSize: n,
          lineHeight: o,
          color: r ? s.text.body : s.grey[700],
          cursor: "pointer",
          marginBottom: 10,
        }),
        this.$avoid.css({
          width: i,
          textAlign: "center",
          fontSize: n,
          lineHeight: o,
          margin: "0 auto",
        });
    }),
    (On.prototype.setCopy = function () {
      var t = ae.translate("Sorry to hear that!"),
        e = ae.translate("Our accessibility option may help."),
        i = ae.translate(
          "This lets you avoid future questions by registering and setting a cookie."
        ),
        n = ae.translate("Please also try turning off your ad blocker.â€");
      this.$sorry.text(t + " "),
        this.$option.text(e),
        this.$avoid.text(i + " " + n);
    }),
    Qt.proto(Tn, Xt),
    (Tn.prototype.style = function (t, e) {
      var i = Rt(t, 280, 310, 260, 310),
        n = Rt(t, 280, 300, 12, 13),
        o = n + 4;
      this.css({
        fontWeight: 500,
        textAlign: "center",
        fontSize: n + 1,
        lineHeight: n + 4,
        color: "#707070",
        width: t,
      }),
        this.$copy.css({
          width: i,
          margin: "0 auto",
          fontWeight: 600,
          marginBottom: 2,
        }),
        this.$resolve.css({
          fontSize: n,
          lineHeight: o,
          width: i,
          margin: "0 auto",
          marginBottom: 10,
        });
    }),
    (Tn.prototype.setCopy = function () {
      var t = {
        thanks: ae.translate("Thank you for your feedback."),
        resolve: ae.translate("We will look into the issue immediately."),
      };
      this.$copy.text(t.thanks), this.$resolve.text(t.resolve);
    }),
    Qt.proto(Vn, mn),
    (Vn.prototype.style = function (t, e, i) {
      this.copy.style(t, i);
    }),
    (Vn.prototype.setCopy = function () {
      this.copy.setCopy();
    }),
    (Vn.prototype.setFocus = function () {
      this.copy.focus();
    });
  var Rn = "https://newassets.hcaptcha.com/captcha/v1/01e0b54/static/images";
  function Pn() {
    Qt.self(this, Xt, "cookie-icon"),
      (this.$none = this.initComponent(Mi, {
        selector: ".icon-none",
        src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath d='M153 78C153 119.421 119.421 153 78 153C36.5786 153 3 119.421 3 78C3 42.6044 27.5196 12.9356 60.5 5.0526C66.1145 3.71061 68 4 69.5 5.0526C71.6884 6.5883 62.5 20 69.5 31.5C76.5 43 89.5 39.5 101.5 53C107.488 59.7371 105.376 73.2409 117.5 79C137.5 88.5 151 71 153 78Z' fill='%23555555'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%23555555'/%3e%3c/g%3e%3c/svg%3e",
        fallback: Rn + "/cookie-none.png",
        width: 18,
      })),
      (this.$blocked = this.initComponent(Mi, {
        selector: ".icon-blocked",
        src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C152.203 75.2117 149.582 76.3107 145.452 78.0421C139.214 80.6575 129.534 84.7159 117.5 79C115.427 78.0152 113.77 76.804 112.418 75.4389L43.3324 144.524C53.7009 149.939 65.4929 153 78 153ZM26.783 132.789L103.528 56.0443C102.962 54.931 102.304 53.9045 101.5 53C95.5 46.25 89.25 43.75 83.625 41.5C78 39.25 73 37.25 69.5 31.5C64.8464 23.8548 67.3474 15.3646 68.904 10.0807C69.6888 7.41648 70.2336 5.56736 69.5 5.05259C68 3.99999 66.1145 3.7106 60.5 5.05259C27.5196 12.9356 3 42.6044 3 78C3 99.6193 12.1474 119.102 26.783 132.789Z' fill='%23EB4040'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%23E25C5C'/%3e%3c/g%3e%3crect x='140.572' y='19' width='13' height='179' transform='rotate(45 140.572 19)' fill='%23555555'/%3e%3c/svg%3e",
        fallback: Rn + "/cookie-blocked.png",
        width: 18,
      })),
      (this.$found = this.initComponent(Mi, {
        selector: ".icon-found",
        src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath d='M153 78C153 119.421 119.421 153 78 153C36.5786 153 3 119.421 3 78C3 42.6044 27.5196 12.9356 60.5 5.05259C66.1145 3.7106 68 3.99999 69.5 5.05259C71.6884 6.58829 62.5 20 69.5 31.5C76.5 43 89.5 39.5 101.5 53C107.488 59.737 105.376 73.2409 117.5 79C137.5 88.5 151 71 153 78Z' fill='%23555555'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%2300838f'/%3e%3c/g%3e%3c/svg%3e",
        fallback: Rn + "/cookie-found.png",
        width: 18,
      })),
      "ie" === tt.Browser.type && 8 === tt.Browser.version
        ? (this.$none.css({ display: "none" }),
          this.$blocked.css({ display: "none" }),
          this.$found.css({ display: "none" }))
        : (this.$none.css({ opacity: 0 }),
          this.$blocked.css({ opacity: 0 }),
          this.$found.css({ opacity: 0 }));
  }
  Qt.proto(Pn, Xt),
    (Pn.prototype.style = function () {
      this.css({
        width: 18,
        height: 18,
        display: "inline",
        position: "relative",
        background: "rgba(0,0,0,0)",
      });
      var t = {
        "-ms-high-contrast-adjust": "none",
        position: "absolute",
        left: 0,
        top: 0,
      };
      this.$none.css(t), this.$blocked.css(t), this.$found.css(t);
    }),
    (Pn.prototype.display = function (t) {
      "ie" === tt.Browser.type && 8 === tt.Browser.version
        ? (this.$none.css({ display: "none" === t ? "block" : "none" }),
          this.$blocked.css({ display: "blocked" === t ? "block" : "none" }),
          this.$found.css({ display: "found" === t ? "block" : "none" }))
        : (this.$none.css({ opacity: "none" === t ? 1 : 0 }),
          this.$blocked.css({ opacity: "blocked" === t ? 1 : 0 }),
          this.$found.css({ opacity: "found" === t ? 1 : 0 }));
    });
  var Dn = {
      noAccess: "Accessibility cookie is not set. {{retrieve-cookie}}",
      hasAccess:
        "Cookies are disabled or the accessibility cookie is not set. {{enable-cookies}}",
    },
    Fn = "Accessibility cookie is set. For help, please email {{support}}",
    $n = "support@hcaptcha.com";
  function In() {
    Qt.self(this, Xt, "status");
    var t = this;
    (this.state = { hasCookie: !1, hasAccess: !1, allowedAccess: !1 }),
      (this.$header = this.createElement(".header")),
      (this.$header.copy = this.$header.createElement(".text")),
      this.$header.setAttribute("aria-hidden", !0),
      (this.icon = this.initComponent(Pn, null, this.$header)),
      (this.retrieve = this.initComponent(yn, {
        text: Dn.noAccess,
        link: !0,
        linkText: "Retrieve accessibility cookie.",
        linkUnderline: !0,
        linkTo: "https://dashboard.hcaptcha.com/signup?type=accessibility",
        replaceText: "retrieve-cookie",
      })),
      (this.disabled = this.initComponent(yn, {
        text: Dn.hasAccess,
        link: !0,
        linkText: "Enable cross-site cookies.",
        linkUnderline: !0,
        replaceText: "enable-cookies",
      })),
      (this.help = this.initComponent(yn, {
        text: Fn,
        link: !0,
        linkText: $n,
        linkUnderline: !0,
        linkTo: "mailto:" + $n,
        replaceText: "support",
      })),
      (this.retrieve.dom.id = "status-retrieve"),
      (this.disabled.dom.id = "status-disabled"),
      (this.help.dom.id = "status-help"),
      this.disabled.on("click", function () {
        kt.requestAccess().then(function () {
          t.setType();
        });
      });
  }
  Qt.proto(In, Xt),
    (In.prototype.style = function (t) {
      this.css({ fontSize: t, color: "#555555" }),
        this.$header.css({ fontWeight: 600, marginBottom: 5 }),
        this.$header.copy.css({ display: "inline", position: "relative" }),
        this.icon.style(),
        this.icon.css({ top: -2, marginLeft: 5 }),
        this.retrieve.style(t, "left"),
        this.disabled.style(t, "left"),
        this.help.style(t, "left");
      var e = this.state.hasCookie;
      this.help.css({ display: e ? "block" : "none" });
      var i =
        !this.state.hasCookie &&
        (!this.hasAccess ||
          (this.state.hasAccess && !this.state.allowedAccess));
      this.retrieve.css({ display: i ? "block" : "none" });
      var n =
        !this.state.hasCookie &&
        this.state.hasAccess &&
        !this.state.allowedAccess;
      this.disabled.css({ display: n ? "block" : "none" });
    }),
    (In.prototype.checkAccess = function () {
      var t = this;
      li.contact("get-ac").then(function (e) {
        (t.state.hasCookie = !!e),
          kt.supportsAPI()
            ? ((t.state.hasAccess = !0),
              kt.hasAccess().then(function (e) {
                (t.state.allowedAccess = e), t.setType();
              }))
            : ((t.state.hasAccess = !1), t.setType());
      });
    }),
    (In.prototype.setType = function () {
      this.$header.copy.text(ae.translate("Status:"));
      var t = this.state.hasCookie;
      this.help.css({ display: t ? "block" : "none" });
      var e =
        !this.state.hasCookie &&
        (!this.hasAccess ||
          (this.state.hasAccess && !this.state.allowedAccess));
      this.retrieve.css({ display: e ? "block" : "none" });
      var i =
        !this.state.hasCookie &&
        this.state.hasAccess &&
        !this.state.allowedAccess;
      this.disabled.css({ display: i ? "block" : "none" });
      var n = this.state.hasCookie
        ? "found"
        : this.state.hasAccess
        ? "blocked"
        : "none";
      this.icon.display(n);
    }),
    (In.prototype.translate = function () {
      this.$header.copy.text(ae.translate("Status:")),
        this.retrieve.translate(),
        this.disabled.translate(),
        this.help.translate();
    });
  function jn() {
    Qt.self(this, Xt, "accessibility");
    var t = this;
    (this.copy = this.initComponent(yn, {
      text: "To bypass our visual challenge, we offer an accessibility cookie.",
      link: !0,
      linkText: "Learn more about hCaptcha Accessibility.",
      linkUnderline: !0,
      linkTo:
        "https://hcaptcha.com/accessibility?ref=" +
        ct.host +
        "&utm_campaign=" +
        ct.sitekey +
        "&utm_medium=challenge",
    })),
      this.copy.on("click", function (e) {
        e.preventDefault(), hi(t.copy.state.linkTo);
      }),
      (this.status = this.initComponent(In)),
      this.status.checkAccess();
  }
  function Nn() {
    Qt.self(this, Xt, "challenge-modal"),
      (this.modalContent = null),
      (this.state = { visible: !1, curr: null, prev: null }),
      (this.config = { width: 0, height: 0, mobile: !1 }),
      (this.display = this.display.bind(this)),
      (this.close = this.close.bind(this)),
      (this.$container = this.createElement(".container")),
      (this.modal = this.initComponent(mn, null, this.$container)),
      this.modal.on("close", this.close),
      (this.$bg = this.createElement(".modal-bg")),
      this.$bg.addEventListener("click", this.close);
    var t = "ie" === tt.Browser.type && 8 === tt.Browser.version;
    this.css({
      visibility: "hidden",
      display: t ? "none" : "table",
      zIndex: -1,
    });
  }
  function zn() {
    Qt.self(this, Xt, null, ".challenge-container"),
      (this.handleResize = null),
      (this.handleCheck = null),
      (this.handleFocus = null),
      (this.handleSubmit = null);
  }
  function Zn() {
    Qt.self(this, Xt, "display-error"),
      (this.visible = !1),
      this.setAttribute("aria-hidden", !0),
      this.setAttribute("role", "alert"),
      (this.copy = this.createElement(".error-text")),
      this.appendElement(this.copy),
      this.setCopy.call(this),
      this.css({ opacity: 0 });
  }
  function Un() {
    Qt.self(this, Xt, "Crumb"), (this.$bg = this.createElement(".crumb-bg"));
  }
  function Wn() {
    Qt.self(this, Xt, "challenge-breadcrumbs"),
      (this.width = 0),
      (this.size = 0),
      (this.crumbs = []),
      (this.$wrapper = this.createElement(".crumbs-wrapper"));
  }
  Qt.proto(jn, Xt),
    (jn.prototype.style = function (t) {
      var e = Math.floor(Rt(t, 250, 275, 12, 14));
      this.copy.style(e, "left"),
        this.copy.css({ position: "relative", display: "inline" }),
        this.status.style(e),
        this.status.css({ marginTop: 10 });
    }),
    (jn.prototype.setCopy = function () {
      this.copy.translate(), this.status.translate();
    }),
    Qt.proto(Nn, Xt),
    (Nn.prototype.load = function () {
      this.modal.load();
    }),
    (Nn.prototype.style = function (t, e, i) {
      var n = Rt(t, 300, 450, 290, 375),
        o = Rt(e, 275, 300, 260, 275),
        s = n - 2 * Rt(t, 300, 450, 20, 25),
        r = "ie" === tt.Browser.type && 8 === tt.Browser.version;
      this.css({
        position: "absolute",
        width: "100%",
        height: "100%",
        display: r && !this.state.visible ? "none" : "table",
        top: 0,
        left: 0,
      }),
        this.$container.css({ display: "table-cell", verticalAlign: "middle" }),
        this.$bg.css({
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backgroundColor: "#000",
          opacity: 0,
          zindex: 0,
          cursor: "pointer",
        }),
        (this.config.width = s),
        (this.config.height = o),
        (this.config.mobile = i),
        this._styleContent();
    }),
    (Nn.prototype._styleContent = function () {
      this.modal.style(this.config.width, this.config.height),
        this.modalContent &&
          this.modalContent.style(
            this.config.width,
            this.config.height,
            this.config.mobile
          );
    }),
    (Nn.prototype.close = function () {
      if (this.state.visible) {
        (this.state.visible = !1),
          this.modalContent &&
            (this.modalContent.off("close", this.close),
            (this.modalContent = this.modalContent.destroy()));
        var t = "ie" === tt.Browser.type && 8 === tt.Browser.version;
        this.css({
          visibility: "hidden",
          display: t ? "none" : "table",
          zIndex: -1,
        }),
          "report_image" === this.state.prev &&
            "thanks" === this.state.curr &&
            this.emit("refresh"),
          this.emit("close");
      }
    }),
    (Nn.prototype.display = function (t, e) {
      var i = this,
        n = null;
      e || (e = {}),
        this.modalContent && (this.modalContent = this.modalContent.destroy()),
        (this.state.prev = this.state.curr),
        (this.state.curr = t);
      var o = null;
      "info" === t
        ? ((n = bn), (o = "Information"))
        : "link" === t
        ? ((n = Cn), (o = "Confirm Navigation"))
        : "feedback" === t
        ? ((n = Hn), (o = "Feedback"), (e.type = "feedback"))
        : "report_bug" === t
        ? ((n = Hn), (o = "Software Bug"), (e.type = "bug"))
        : "report_image" === t
        ? ((n = Hn), (o = "Tell Us Why"), (e.type = "image"))
        : t.indexOf("thanks") >= 0
        ? (n = Vn)
        : t.indexOf("accessibility") >= 0 && ((n = jn), (o = "Accessibility")),
        this.state.visible &&
          (this.modal.destroy(),
          (this.modal = this.initComponent(mn, null, this.$container)),
          this.modal.load(),
          this.modal.on("close", this.close)),
        (this.modalContent = this.initComponent(n, e, this.modal.$content)),
        this.modal.setTitle(o),
        this.modalContent.setCopy(),
        this.modalContent.on("close", this.close),
        this.modalContent.on("change", this.display),
        this.modalContent.on("report", function (t) {
          i.emit("report", t);
        }),
        this._styleContent(),
        this.css({ visibility: "visible", display: "table", zIndex: 200 }),
        this.modal.focus(),
        (this.state.visible = !0),
        this.emit("open");
    }),
    (Nn.prototype.isOpen = function () {
      return this.state.visible;
    }),
    Qt.proto(zn, Xt),
    (zn.prototype.style = function (t, e) {
      this.css({ width: t, height: e, position: "relative", zIndex: 0 });
    }),
    (zn.prototype.mount = function (t) {
      var e = this;
      this.appendElement(t),
        (this.handleResize = function () {
          e.emit("resize");
        }),
        (this.handleCheck = function (i) {
          var n = "skip";
          i
            ? (n = t.breadcrumbs && t.served < t.breadcrumbs ? "next" : "check")
            : "landscape" === ct.orientation &&
              t.breadcrumbs &&
              t.served === t.breadcrumbs &&
              (n = "check"),
            e.emit("action-changed", n);
        }),
        (this.handleFocus = function () {
          e.emit("focus-check");
        }),
        (this.handleSubmit = function () {
          e.emit("submit");
        }),
        t.on && t.on("display-check", this.handleCheck),
        t.on && t.on("challenge-resize", this.handleResize),
        t.on && t.on("focus-check", this.handleFocus),
        t.on && t.on("submit", this.handleSubmit),
        (this.isMounted = !0);
    }),
    (zn.prototype.unmount = function (t) {
      if (t.destroy)
        try {
          t.off && t.off("display-check", this.handleCheck),
            t.off && t.off("challenge-resize", this.handleResize),
            t.off && t.off("focus-check", this.handleFocus),
            t.off && t.off("submit", this.handleSubmit),
            t.destroy();
        } catch ($s) {}
      else this.removeElement(t);
      return (this.isMounted = !1), null;
    }),
    Qt.proto(Zn, Xt),
    (Zn.prototype.style = function (t) {
      var e = Si.get().palette,
        i =
          "landscape" === ct.orientation &&
          "image_label_binary" === ct.challenge_type;
      this.copy.css({ display: "table-cell", verticalAlign: "middle" }),
        this.css({
          display: "table",
          fontSize: t,
          color: e.warn.main,
          width: "100%",
          textAlign: i ? "left" : "right",
        });
    }),
    (Zn.prototype.display = function (t) {
      this.css({ opacity: t ? 1 : 0 }),
        (this.visible = t),
        this.setAttribute("aria-hidden", !t);
    }),
    (Zn.prototype.setCopy = function () {
      var t = ae.translate("Please try again.");
      this.copy.text(t);
    }),
    Qt.proto(Un, Xt),
    (Un.prototype.style = function (t) {
      this.css({
        width: t,
        height: t,
        overflow: "hidden",
        borderRadius: "50%",
      }),
        this.$bg.css({ width: t, height: t });
    }),
    (Un.prototype.active = function (t) {
      var e = (function (t) {
        var e = t.palette,
          i = t.component;
        return _i.merge(
          { main: { fill: e.grey[200] }, active: { fill: e.primary.main } },
          i.breadcrumb
        );
      })(Si.get());
      this.$bg.css({ backgroundColor: t ? e.active.fill : e.main.fill });
    }),
    (Un.prototype.hide = function () {
      this.css({ opacity: 0 });
    }),
    Qt.proto(Wn, Xt),
    (Wn.prototype.createCrumbs = function (t) {
      this.display = !0;
      for (var e = null, i = 0; i < t; i++)
        (e = this.initComponent(Un, null, this.$wrapper)), this.crumbs.push(e);
    }),
    (Wn.prototype.removeCrumbs = function () {
      if (((this.display = !1), 0 !== this.crumbs.length)) {
        for (var t = -1; ++t < this.crumbs.length; ) this.crumbs[t].destroy();
        this.crumbs = [];
      }
    }),
    (Wn.prototype.style = function (t, e) {
      for (var i = e ? 6 : 7, n = e ? 4 : 5, o = -1; ++o < this.crumbs.length; )
        this.crumbs[o].style(i),
          this.crumbs[o].css({
            left: o * i + o * n,
            top: 0,
            position: "absolute",
          });
      this.css({ width: t, height: i });
      var s = this.crumbs.length * i + n * (this.crumbs.length - 1);
      this.$wrapper.css({
        width: s,
        height: i,
        position: "absolute",
        left: (t - s) / 2,
      }),
        (this.size = i),
        (this.width = t),
        (this.mobile = e);
    }),
    (Wn.prototype.setIndex = function (t) {
      for (var e = -1; ++e < this.crumbs.length; )
        this.crumbs[e].active(t === e);
    }),
    (Wn.prototype.hide = function () {
      for (var t = -1; ++t < this.crumbs.length; ) this.crumbs[t].hide();
    });
  function Kn() {
    Qt.self(this, Pi, {
      selector: "#menu-info",
      title: "Get information about hCaptcha and accessibility options.",
      label: "Get information about hCaptcha and accessibility options.",
      name: "info",
      src: "data:image/svg+xml,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='12.5' cy='21.6' r='2' fill='%23787878'/%3e%3ccircle cx='12.5' cy='12.5' r='2' fill='%23787878'/%3e%3ccircle cx='12.5' cy='3.40002' r='2' fill='%23787878'/%3e%3c/svg%3e",
      theme: Si,
      width: 35,
      height: 35,
    }),
      (this._ignoreHighlight = !1);
  }
  Qt.proto(Kn, Pi),
    (Kn.prototype.focus = function (t) {
      (this._ignoreHighlight = t), this.dom.focus();
    }),
    (Kn.prototype.onFocus = function (t) {
      if (this._ignoreHighlight) this._ignoreHighlight = !1;
      else {
        var e = this.state.style.focus.outline;
        this.css({ outline: "2px solid " + e });
      }
    });
  function qn() {
    Qt.self(this, Pi, {
      title: "Refresh Challenge.",
      label: "Refresh Challenge.",
      name: "refresh",
      src: "data:image/svg+xml,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M20.9148 19.6529C20.9994 19.7239 21.0106 19.8501 20.9381 19.9335C19.5234 21.5598 17.6702 22.7467 15.5981 23.3506C13.4619 23.9733 11.1891 23.9485 9.06708 23.2794C6.94502 22.6103 5.06902 21.327 3.67632 19.5917C2.28361 17.8564 1.43675 15.7471 1.24283 13.5306C1.0489 11.314 1.51662 9.08969 2.58684 7.13894C3.65706 5.18818 5.28171 3.5986 7.25535 2.57119C9.22898 1.54378 11.463 1.12469 13.6748 1.36692C15.8203 1.6019 17.8514 2.44889 19.527 3.80487C19.6129 3.87435 19.6238 4.00065 19.5528 4.08527L18.3637 5.50245C18.2927 5.58707 18.1666 5.5979 18.0805 5.5288C16.746 4.45867 15.1329 3.79007 13.4298 3.60355C11.6604 3.40977 9.87319 3.74503 8.29428 4.56696C6.71537 5.38889 5.41565 6.66056 4.55948 8.22116C3.7033 9.78176 3.32913 11.5612 3.48427 13.3345C3.63941 15.1077 4.3169 16.7952 5.43106 18.1834C6.54522 19.5716 8.04602 20.5982 9.74367 21.1335C11.4413 21.6688 13.2596 21.6886 14.9685 21.1905C16.6133 20.7111 18.0858 19.7725 19.2142 18.4869C19.287 18.4039 19.413 18.3927 19.4976 18.4637L20.9148 19.6529Z' fill='%23787878'/%3e%3cpath d='M22.7248 7.93974C22.7557 8.07007 22.6522 8.19336 22.5185 8.18555L14.9712 7.74462C14.807 7.73502 14.7239 7.54239 14.8297 7.4164L20.6321 0.501257C20.7379 0.375269 20.942 0.423631 20.98 0.583657L22.7248 7.93974Z' fill='%23787878'/%3e%3c/svg%3e",
      theme: Si,
      width: 35,
      height: 35,
      selectable: !1,
    });
  }
  function Gn(t) {
    var e = t.palette,
      i = t.component;
    return _i.merge(
      {
        main: {
          fill: e.primary.main,
          text: e.common.white,
          border: e.primary.main,
        },
        hover: {
          fill: e.primary.main,
          text: e.common.white,
          border: e.primary.main,
        },
        focus: { outline: e.primary.main },
      },
      i.verifyButton
    );
  }
  function Jn(t) {
    var e = t.palette,
      i = t.component;
    return _i.merge(
      {
        main: { fill: e.grey[700], text: e.common.white, border: e.grey[700] },
        hover: { fill: e.grey[800], text: e.common.white, border: e.grey[800] },
        focus: { outline: e.primary.main },
      },
      i.skipButton
    );
  }
  function Yn() {
    Qt.self(this, Xt, "button-submit"),
      (this.state = {
        text: "Check",
        type: "check",
        label: "Verify Answers",
        locked: !1,
      }),
      (this._verifyStyle = Gn(Si.get())),
      (this._skipStyle = Jn(Si.get())),
      (this.copy = this.createElement(".text")),
      this.addClass("button"),
      this.setAttribute("tabindex", 0),
      this.setAttribute("role", "button"),
      this.setLabel.call(this),
      (this.onHover = this.onHover.bind(this)),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener("click", this.onSelect),
      this.addEventListener("enter", this.onSelect),
      this.addEventListener("focus", this.onFocus),
      this.addEventListener("blur", this.onBlur),
      !1 === tt.System.mobile &&
        (this.addEventListener("over", this.onHover),
        this.addEventListener("out", this.onHover));
  }
  function Qn() {
    Qt.self(this, Xt, "interface-challenge");
    var t = this;
    (this.state = {
      loaded: !1,
      action: null,
      locked: !1,
      visible: !1,
      whiteLabel: !1,
    }),
      (this.text = this.initComponent(Zn)),
      (this.breadcrumbs = this.initComponent(Wn)),
      (this.submit = this.initComponent(Yn)),
      this.submit.on("click", function () {
        t.emit("submit");
      });
  }
  function Xn(t) {
    Qt.self(this, Di, {
      selector: "display-language",
      theme: Si,
      width: 26,
      height: 16,
    });
    var e = this;
    (this._theme = t.theme),
      this.on("style", function () {
        e.css({ display: "block" });
      });
  }
  function to() {
    Qt.self(this, Xt, "language-selector");
    var t = this;
    (this.state = { locked: !1 }),
      (this.list = this.initComponent(tt.System.mobile ? zi : on, {
        theme: Si,
        selector: "#language-list",
        optionsVisible: 5,
      })),
      (this.display = this.initComponent(Xn, { theme: Si })),
      this.display.ownsListBox(this.list);
    var e = [];
    for (var i in oe) e.push({ value: i, text: oe[i] });
    this.list.setOptions(e),
      this.list.on("select", function (e) {
        t.display.setLocale(e.value),
          e.value !== ae.getLocale() &&
            (ae.setLocale(e.value),
            li.send("challenge-language", { locale: e.value }));
      }),
      this.display.on("click", function (e) {
        e.selected
          ? (t.list.usingKb && t.list.usingKb(e.usingKb), t.list.open())
          : t.list.hide();
      }),
      this.list.on("hide", function () {
        t.display.reset();
      }),
      this.style(),
      this.updateLocale();
  }
  Qt.proto(qn, Pi),
    Qt.proto(Yn, Xt),
    (Yn.prototype.style = function (t) {
      var e = t ? 30 : 35,
        i = "check" === this.state.type || "next" === this.state.type;
      (this._verifyStyle = Gn(Si.get())), (this._skipStyle = Jn(Si.get()));
      var n = Si.get().palette;
      this.css({
        height: e,
        cursor: "pointer",
        minWidth: t ? 50 : 70,
        padding: "0px 5px",
        outlineColor: "none",
        borderRadius: 4,
        border: "2px solid " + n.common.white,
      });
      var o = i ? this._verifyStyle.main.text : this._skipStyle.main.text;
      this.copy.css({
        color: o,
        width: "100%",
        height: "100%",
        textAlign: "center",
        position: "relative",
        pointerEvents: "none",
        lineHeight: e,
        fontSize: 14,
        fontWeight: 600,
        zIndex: 5,
      }),
        (this.height = e);
    }),
    (Yn.prototype.action = function (t) {
      var e,
        i = t.charAt(0).toUpperCase() + t.slice(1),
        n =
          "check" === t || "next" === t || "report" === t
            ? this._verifyStyle.main.fill
            : this._skipStyle.main.fill;
      "check" === t
        ? (e = "Verify Answers")
        : "next" === t
        ? (e = "Next Challenge")
        : "report" === t
        ? (e = "Report Images")
        : ((e = "Skip Challenge"), (t = "skip")),
        (this.state.type = t),
        (this.state.text = i),
        (this.state.label = e),
        this.css({ backgroundColor: n }),
        this.setLabel.call(this);
    }),
    (Yn.prototype.onHover = function (t) {
      if (null !== this.emit && !0 !== this.state.locked) {
        var e = "over" === t.action,
          i =
            "check" === this.state.type || "next" === this.state.type
              ? this._verifyStyle
              : this._skipStyle,
          n = e ? "hover" : "main";
        this.css({ backgroundColor: i[n].fill });
      }
    }),
    (Yn.prototype.onSelect = function (t) {
      null !== this.emit && !0 !== this.state.locked && this.emit("click", t);
    }),
    (Yn.prototype.onFocus = function (t) {
      var e = "check" === this.state.type ? "_verifyStyle" : "_skipStyle",
        i = this[e].focus.border || this[e].focus.outline;
      this.css({ outline: "2px solid " + i });
    }),
    (Yn.prototype.onBlur = function (t) {
      this.css({ outline: "none" });
    }),
    (Yn.prototype.setLock = function (t) {
      this.state.locked = t;
      var e =
        "check" === this.state.type || "next" === this.state.type
          ? this._verifyStyle
          : this._skipStyle;
      this.css({
        cursor: t ? "default" : "pointer",
        backgroundColor: e.main.fill,
      });
    }),
    (Yn.prototype.setLabel = function () {
      var t = ae.translate(this.state.text),
        e = ae.translate(this.state.label);
      ae.getLocale().indexOf("en") >= 0 &&
        "check" === this.state.type &&
        (t = "Verify"),
        this.copy.text(t),
        this.setAttribute("title", e),
        this.setAttribute("aria-label", e);
    }),
    (Yn.prototype.getElement = function () {
      return (this && this.dom) || null;
    }),
    Qt.proto(Qn, Xt),
    (Qn.prototype.removeCrumbs = function () {
      this.breadcrumbs.removeCrumbs();
    }),
    (Qn.prototype.style = function (t, e, i) {
      var n =
          "landscape" === ct.orientation &&
          "image_label_binary" === ct.challenge_type,
        o = n ? e : 16;
      this.breadcrumbs.display &&
        (this.breadcrumbs.style(t, i),
        this.breadcrumbs.css({
          position: "absolute",
          top: (o - this.breadcrumbs.size) / 2,
        }));
      var s = i ? 11 : 12;
      return (
        this.text.style(s),
        this.text.css({
          position: "absolute",
          height: o,
          top: 0,
          right: n ? "auto" : 0,
          left: n ? 0 : "auto",
          width: n ? 140 : "100%",
        }),
        this.submit.style(i),
        this.submit.css({
          position: "absolute",
          right: 0,
          bottom: 0,
          zIndex: 100,
        }),
        this.css({ width: t, height: e }),
        { width: t, height: e }
      );
    }),
    (Qn.prototype.setAction = function (t) {
      (this.state.action = t), this.submit.action(t);
    }),
    (Qn.prototype.getAction = function () {
      return this.state.action;
    }),
    (Qn.prototype.displayTryAgain = function (t) {
      this.text.display(t);
    }),
    (Qn.prototype.setWhiteLabelEnabled = function (t) {
      this.state.whiteLabel = t;
    }),
    (Qn.prototype.translate = function () {
      this.text.setCopy(), this.submit.setLabel();
    }),
    (Qn.prototype.setLock = function (t) {
      (this.state.locked = t), this.submit.setLock(t);
    }),
    (Qn.prototype.isLocked = function () {
      return this.state.locked;
    }),
    Qt.proto(Xn, Di),
    (Xn.prototype.setLocale = function (t) {
      this.setText(ae.getShortLocale(t).toUpperCase());
    }),
    (Xn.prototype.style = function () {
      var t = (function (t) {
          var e = t.palette,
            i = t.component;
          return _i.merge({ focus: { outline: e.primary.main } }, i.button);
        })(this._theme.get()),
        e =
          "landscape" === ct.orientation &&
          "image_label_binary" === ct.challenge_type,
        i = e ? 14 : 11,
        n = e ? 35 : 26,
        o = e ? 35 : 16;
      (this.state.width = n),
        (this.state.height = o),
        this.css({
          display: "table",
          cursor: "pointer",
          textAlign: "center",
          fontWeight: 600,
          width: n,
          height: o,
          fontSize: i,
          outlineColor: t.focus.outline,
          borderRadius: 4,
        }),
        this.$text.css({ display: "table-cell", verticalAlign: "middle" });
    }),
    Qt.proto(to, Xt),
    (to.prototype.style = function (t) {
      var e =
        "landscape" === ct.orientation &&
        "image_label_binary" === ct.challenge_type;
      this.display.style(),
        this.css({
          position: "relative",
          display: "inline-block",
          top: t ? 5 : 10,
          left: 0,
          zIndex: 100,
        }),
        this.list.style(),
        this.list.css({ bottom: e ? -128 : 30, left: e ? 45 : "auto" });
    }),
    (to.prototype.getDimensions = function () {
      return {
        width: this.display.getWidth(),
        height: this.display.getHeight(),
      };
    }),
    (to.prototype.setLabel = function () {
      var t = this.list.getSelected().text,
        e = ae.translate("Select a language {{language}}", { language: t });
      this.display.setLabel(e), this.display.setTitle(ae.translate("Language"));
    }),
    (to.prototype.updateLocale = function () {
      this.list.select(ae.getLocale());
    }),
    (to.prototype.setVisible = function (t) {
      this.css({ display: t ? "block" : "none " });
    }),
    (to.prototype.setLock = function (t) {
      (this.state.locked = t),
        t
          ? this.list.setAttribute("disabled", t)
          : this.list.removeAttribute("disabled");
    });
  function eo(t) {
    Qt.self(this, Xt, "hcaptcha-logo"), (this.mobile = !1), (this.charity = t);
    var e = this.charity
        ? "data:image/svg+xml,%3csvg id='logo_charity' role='img' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3e%3crect x='306.25' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='250' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='193.75' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='137.5' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='250' y='362.5' width='56.25' height='56.25' style='fill:%230082bf'/%3e%3crect x='193.75' y='362.5' width='56.25' height='56.25' style='fill:%230082bf'/%3e%3crect x='137.5' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='81.25' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='306.25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='250' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='193.75' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='137.5' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='81.25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='418.75' y='250' width='56.25' height='56.25' style='fill:%23009dbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='362.5' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='306.25' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='250' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='193.75' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='137.5' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='81.25' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='25' y='250' width='56.25' height='56.25' style='fill:%23009dbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='362.5' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='306.25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='250' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='193.75' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='137.5' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='81.25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='306.25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='250' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='193.75' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='137.5' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='81.25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='250' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf'/%3e%3crect x='193.75' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf'/%3e%3crect x='137.5' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='81.25' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='250' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='193.75' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='137.5' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.5%3bisolation:isolate'/%3e%3cpath d='M190.87%2c158.6c36.33%2c0%2c46.52%2c26.05%2c59.6%2c34.41%2c12.11-8.36%2c22.29-34.41%2c59.59-34.41%2c36.34%2c0%2c65.18%2c29.8%2c66%2c67%2c2.78%2c54-90.26%2c135.93-125.63%2c159.19-36.34-23.26-128.42-105.16-126.6-159.19C125.69%2c188.4%2c153.56%2c158.6%2c190.87%2c158.6Z' style='fill:white'/%3e%3c/svg%3e"
        : "data:image/svg+xml,%3csvg width='32' height='32' viewBox='0 0 32 32' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M24 28H20V32H24V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M20 28H16V32H20V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M16 28H12V32H16V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M12 28H8V32H12V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M28 24H24V28H28V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M24 24H20V28H24V24Z' fill='%230082BF'/%3e%3cpath d='M20 24H16V28H20V24Z' fill='%230082BF'/%3e%3cpath d='M16 24H12V28H16V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M12 24H8V28H12V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M8 24H4V28H8V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M32 20H28V24H32V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M28 20H24V24H28V20Z' fill='%23008FBF'/%3e%3cpath d='M24 20H20V24H24V20Z' fill='%23008FBF'/%3e%3cpath d='M20 20H16V24H20V20Z' fill='%23008FBF'/%3e%3cpath d='M16 20H12V24H16V20Z' fill='%23008FBF'/%3e%3cpath d='M12 20H8V24H12V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M8 20H4V24H8V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M4 20H0V24H4V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M32 16H28V20H32V16Z' fill='%23009DBF'/%3e%3cpath d='M28 16H24V20H28V16Z' fill='%23009DBF'/%3e%3cpath d='M24 16H20V20H24V16Z' fill='%23009DBF'/%3e%3cpath d='M20 16H16V20H20V16Z' fill='%23009DBF'/%3e%3cpath d='M16 16H12V20H16V16Z' fill='%23009DBF'/%3e%3cpath d='M12 16H8V20H12V16Z' fill='%23009DBF'/%3e%3cpath d='M8 16H4V20H8V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M4 16H0V20H4V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M32 12H28V16H32V12Z' fill='%2300ABBF'/%3e%3cpath d='M28 12H24V16H28V12Z' fill='%2300ABBF'/%3e%3cpath d='M24 12H20V16H24V12Z' fill='%2300ABBF'/%3e%3cpath d='M20 12H16V16H20V12Z' fill='%2300ABBF'/%3e%3cpath d='M16 12H12V16H16V12Z' fill='%2300ABBF'/%3e%3cpath d='M12 12H8V16H12V12Z' fill='%2300ABBF'/%3e%3cpath d='M8 12H4V16H8V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M4 12H0V16H4V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M32 8H28V12H32V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M28 8H24V12H28V8Z' fill='%2300B9BF'/%3e%3cpath d='M24 8H20V12H24V8Z' fill='%2300B9BF'/%3e%3cpath d='M20 8H16V12H20V8Z' fill='%2300B9BF'/%3e%3cpath d='M16 8H12V12H16V8Z' fill='%2300B9BF'/%3e%3cpath d='M12 8H8V12H12V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M8 8H4V12H8V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M4 8H0V12H4V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M28 4H24V8H28V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M24 4H20V8H24V4Z' fill='%2300C6BF'/%3e%3cpath d='M20 4H16V8H20V4Z' fill='%2300C6BF'/%3e%3cpath d='M16 4H12V8H16V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M12 4H8V8H12V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M8 4H4V8H8V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M24 0H20V4H24V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M20 0H16V4H20V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M16 0H12V4H16V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M12 0H8V4H12V0Z' fill='%2300D4BF'/%3e%3cpath d='M10.5141 14.9697L11.6379 12.4572C12.0459 11.8129 11.9958 11.0255 11.5449 10.5745C11.4876 10.5173 11.416 10.46 11.3444 10.4171C11.0366 10.2238 10.6572 10.1808 10.3065 10.2954C9.91993 10.4171 9.58349 10.6748 9.36875 11.0184C9.36875 11.0184 7.82972 14.6046 7.26421 16.2153C6.69871 17.8259 6.92062 20.7822 9.12536 22.987C11.4661 25.3277 14.8448 25.8575 17.0066 24.2397C17.0997 24.1967 17.1784 24.1395 17.2572 24.0751L23.9072 18.5202C24.2293 18.2554 24.7089 17.7042 24.2794 17.0743C23.8642 16.4586 23.0697 16.881 22.7404 17.0886L18.9107 19.8731C18.8391 19.9304 18.7318 19.9232 18.6673 19.8517C18.6673 19.8517 18.6673 19.8445 18.6602 19.8445C18.56 19.7228 18.5456 19.4079 18.696 19.2862L24.5657 14.304C25.074 13.8459 25.1456 13.1802 24.7304 12.7292C24.3295 12.2854 23.6924 12.2997 23.1842 12.7578L17.9157 16.881C17.8155 16.9597 17.6652 16.9454 17.5864 16.8452L17.5793 16.838C17.4719 16.7235 17.4361 16.5231 17.5506 16.4014L23.535 10.596C24.0074 10.1522 24.036 9.4149 23.5922 8.94245C23.3775 8.72054 23.084 8.59169 22.7762 8.59169C22.4612 8.59169 22.1606 8.70623 21.9387 8.92813L15.8255 14.6691C15.6823 14.8122 15.396 14.6691 15.3602 14.4973C15.3459 14.4328 15.3674 14.3684 15.4103 14.3255L20.0918 8.99972C20.5571 8.56306 20.5858 7.83292 20.1491 7.36763C19.7124 6.90234 18.9823 6.87371 18.517 7.31036C18.4955 7.32468 18.4812 7.34615 18.4597 7.36763L11.3659 15.2203C11.1082 15.478 10.736 15.4851 10.557 15.342C10.4425 15.2489 10.4282 15.0843 10.5141 14.9697Z' fill='white'/%3e%3c/svg%3e",
      i =
        "https://newassets.hcaptcha.com/captcha/v1/01e0b54/static/images" +
        (this.charity ? "/icon-charity" : "/icon") +
        ".png";
    this.color = this.initComponent(Mi, {
      selector: ".logo",
      src: e,
      width: 32,
      fallback: i,
      autoLoad: !1,
    });
  }
  function io(t) {
    Qt.self(this, Xt, "hcaptcha-logo"),
      t || (t = {}),
      (this.state = { label: "hCaptcha" }),
      (this.mobile = !1),
      (this.link =
        "https://www.hcaptcha.com/what-is-hcaptcha-about?ref=" +
        ct.host +
        "&utm_campaign=" +
        ct.sitekey +
        "&utm_medium=challenge"),
      (this.icon = this.initComponent(eo, !!t.charity)),
      (this.onClick = this.onClick.bind(this)),
      this.addEventListener("click", this.onClick);
  }
  Qt.proto(eo, Xt),
    (eo.prototype.load = function () {
      this.color.load();
    }),
    (eo.prototype.style = function (t) {
      this.mobile = t;
      var e = 32;
      return (
        this.css({
          width: e,
          height: e,
          position: "absolute",
          top: 0,
          left: 0,
        }),
        this.color.css({
          "-ms-high-contrast-adjust": "none",
          width: e,
          height: e,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 5,
        }),
        { width: e, height: e }
      );
    }),
    Qt.proto(io, Xt),
    (io.prototype.load = function () {
      this.icon.load();
    }),
    (io.prototype.style = function (t, e) {
      t !== undefined && (this.mobile = t);
      var i = this.icon.style(this.mobile);
      this.css({
        display: e ? "block" : "none",
        width: i.width,
        height: i.height,
        left: "50%",
        marginLeft: -i.width / 2,
        cursor: "pointer",
        position: "absolute",
      }),
        (this.height = i.height);
    }),
    (io.prototype.onClick = function () {
      null !== this.fireEvent && hi(this.link);
    }),
    (io.prototype.setLabel = function () {
      var t = this.state.label;
      this.setAttribute("title", t), this.setAttribute("aria-label", t);
    });
  var no = [
    {
      text: "Accessibility",
      value: "accessibility",
      selector: "#accessibility",
      type: "modal",
    },
    {
      text: "Report Image",
      value: "report_image",
      selector: "#report_image",
      type: "custom",
      warn: !0,
    },
    {
      text: "Report Bug",
      value: "report_bug",
      selector: "#report_bug",
      type: "modal",
    },
    { text: "Information", value: "info", selector: "#info", type: "modal" },
  ];
  function oo() {
    Qt.self(this, on, {
      isMenu: !0,
      theme: Si,
      selector: "#menu",
      optionsVisible: -1,
    }),
      (this.state.a11yChallenge = !1),
      (this.options = []),
      this.on("select", function (t) {
        t &&
          ("link" === t.type
            ? hi(t.value)
            : "modal" === t.type
            ? this.emit("display", t.value)
            : "challenge" === t.type &&
              ("text_challenge" === t.value &&
                ((ct.a11y_tfe = !0), this.emit("refresh")),
              "visual_challenge" === t.value &&
                ((ct.a11y_tfe = !1), this.emit("refresh"))));
      });
  }
  function so() {
    Qt.self(this, Xt, "interface-user");
    var t = this;
    (this.state = {
      isRq: !1,
      loaded: !1,
      locked: !1,
      visible: !1,
      whiteLabel: !1,
    }),
      (this.language = this.initComponent(to)),
      (this.menu = this.initComponent(Kn)),
      (this.menuList = this.initComponent(oo)),
      (this.refresh = this.initComponent(qn)),
      (this.logo = this.initComponent(io)),
      this.menu.controlsMenu(this.menuList),
      this.menu.on("click", function (e) {
        t.menuList.usingKb(e.usingKb),
          t.menuList.visible(e.selected, t.state.isRq);
      }),
      this.menuList.on("hide", function () {
        t.menu.reset();
      }),
      this.refresh.on("click", function () {
        t.emit("refresh");
      }),
      this.menuList.on("select", function (e) {
        e && "report_image" === e.value && t.emit("report");
      }),
      this.menuList.on("refresh", function () {
        t.refresh.dom.click();
      }),
      this.menuList.on("display", function (e) {
        t.emit("display", e);
      });
  }
  Qt.proto(oo, on),
    (oo.prototype.setA11yChallenge = function (t) {
      this.state.a11yChallenge = t;
    }),
    (oo.prototype._setOptions = function (t) {
      var e;
      for (this.options = [], e = 0; e < no.length; e++)
        ("report_image" === no[e].value && t) || this.options.push(no[e]);
      this.state.a11yChallenge &&
        this.options.splice(
          1,
          0,
          ct.a11y_tfe
            ? {
                text: "Visual Challenge",
                value: "visual_challenge",
                selector: "#visual_challenge",
                type: "challenge",
              }
            : {
                text: "Text Challenge",
                value: "text_challenge",
                selector: "#text_challenge",
                type: "challenge",
              }
        ),
        this.setOptions(this.options);
    }),
    (oo.prototype.visible = function (t, e) {
      t ? (this._setOptions(e), this.deselect(), this.open()) : this.hide();
    }),
    Qt.proto(so, Xt),
    (so.prototype.refresh = function () {
      this.refresh.dom.click();
    }),
    (so.prototype.load = function (t) {
      (this.state.isRq = t),
        this.state.loaded ||
          (this.menu.load(), this.refresh.load(), this.logo.load());
    }),
    (so.prototype.setupLogo = function (t, e) {
      t &&
        (this.logo.destroy(),
        (this.logo = this.initComponent(io, { charity: t })),
        this.logo.load()),
        (this.logo.link = e || this.logo.link);
    }),
    (so.prototype.style = function (t, e, i) {
      var n =
          "landscape" === ct.orientation &&
          "image_label_binary" === ct.challenge_type,
        o = !this.state.whiteLabel,
        s = !this.state.whiteLabel;
      if (
        (this.language.style(i),
        this.refresh.style(i),
        this.menu.style(i, o),
        this.menuList.style(190),
        this.logo.style(t < 400, s),
        n)
      ) {
        var r = this.language.getDimensions(),
          a = (e - (this.refresh.getHeight() + 16 + r.height)) / 2;
        this.language.css({
          top: a,
          left: (t - r.width) / 2,
          position: "absolute",
        }),
          this.refresh.css({
            position: "absolute",
            top: a + 16 + r.height,
            bottom: "auto",
            left: o ? (t - this.refresh.getWidth()) / 2 : 0,
            zIndex: 100,
          }),
          this.menu.css({
            position: "absolute",
            left: (t - this.menu.getWidth()) / 2,
            bottom: 0,
            zIndex: 100,
          }),
          this.menuList.css({
            position: "absolute",
            zIndex: 1e3,
            left: this.menu.getWidth() + 10,
            bottom: 0,
          }),
          this.logo.css({ top: 0, bottom: "auto" });
      } else
        this.language.css({ top: 0, left: 0, position: "absolute" }),
          this.refresh.css({
            position: "absolute",
            top: "auto",
            bottom: (40 - this.menu.getHeight()) / 2,
            left: o ? this.menu.getWidth() + 10 : 0,
            zIndex: 100,
          }),
          this.menu.css({
            position: "absolute",
            left: 0,
            bottom: (40 - this.menu.getHeight()) / 2,
            zIndex: 100,
          }),
          this.menuList.css({
            position: "absolute",
            zIndex: 1e3,
            left: 0,
            bottom: this.menu.getHeight() + 10,
          }),
          this.logo.css({ top: "auto", bottom: (40 - this.logo.height) / 2 });
      return this.css({ width: t, height: e }), { width: t, height: e };
    }),
    (so.prototype.focus = function (t) {
      "menu" === t && this.menu.focus();
    }),
    (so.prototype.displayLanguage = function (t) {
      this.language.setVisible(t);
    }),
    (so.prototype.setWhiteLabel = function (t) {
      this.state.whiteLabel = t;
    }),
    (so.prototype.enableRefresh = function (t) {
      this.refresh.enable(t);
    }),
    (so.prototype.translate = function () {
      this.language.updateLocale(),
        this.language.setLabel(),
        this.menu.setCopy(),
        this.refresh.setCopy(),
        this.logo.setLabel();
    }),
    (so.prototype.setLock = function (t) {
      (this.state.locked = t),
        this.language.setLock(t),
        this.menu.setLock(t),
        this.refresh.setLock(t);
    }),
    (so.prototype.isLocked = function () {
      return this.state.locked;
    });
  var ro = null;
  function ao(t, e) {
    var i = this;
    e || (e = {}),
      (ct.host = e.host ? e.host : ""),
      (ct.sitekey = e.sitekey ? e.sitekey : ""),
      (ct.charity = !!e.charity),
      (ct.orientation = e.orientation);
    var n = new oi(),
      o = {
        visible: !1,
        create: !1,
        locked: !1,
        timer: null,
        timerExpired: !1,
        preventClose: !1,
        focus: "challenge",
        interaction: "mouse",
      };
    t instanceof Yt || (t = new Yt(t));
    var s = new Yt(".interface-wrapper"),
      r = new zn(),
      a = new Qn(),
      l = new so(),
      c = new Nn();
    return (
      t.appendElement(s),
      s.appendElement(r),
      s.appendElement(l),
      s.appendElement(a),
      s.appendElement(c),
      l.on("display", c.display),
      t.setAttribute("aria-hidden", !0),
      (ci = c),
      c.on("open", function () {
        o.preventClose = !0;
      }),
      c.on("close", function () {
        o.visible && l.menu.focus(),
          i.hideReport(!1),
          o.preventClose &&
            ((o.preventClose = !1),
            o.timerExpired && ((o.timerExpired = !1), n.emit("refresh")));
      }),
      r.on("action-changed", function (t) {
        a.setAction(t);
      }),
      r.on("submit", function () {
        n.emit("submit");
      }),
      r.on("focus-check", function () {
        n.emit("focus-check");
      }),
      r.on("resize", function () {
        n.emit("resize");
      }),
      a.on("submit", function () {
        n.emit("submit");
      }),
      l.on("refresh", function () {
        n.emit("refresh");
      }),
      l.on("report", function () {
        n.emit("report");
      }),
      c.on("report", function (t) {
        n.emit("report-submission", t);
      }),
      s.addEventListener("keydown", function (t) {
        o.interaction = "keyboard";
      }),
      s.addEventListener("click", function (t) {
        o.interaction = "mouse";
      }),
      (i.events = n),
      (i.addTheme = function (t, e) {
        Si.add(t, e);
      }),
      (i.useTheme = function (t) {
        Si.use(t);
      }),
      (i.size = function (t, e) {
        return i.style(t, e);
      }),
      (i.create = function (t) {
        (o.create = !0),
          l.load(!!t.rq),
          l.displayLanguage(!t.rq),
          l.enableRefresh(!t.rq);
      }),
      (i.isMounted = function () {
        return !!ro;
      }),
      (i.init = function (t) {
        var e = t.charity && !0 === t.charity;
        l.setupLogo(e, t.link),
          t.a11yChallenge && l.menuList.setA11yChallenge(t.a11yChallenge);
      }),
      (i.setWhiteLabel = function (t) {
        l.setWhiteLabel(t);
      }),
      (i.setup = function (t, e) {
        return new Promise(function (i, n) {
          try {
            ro && ro.type !== e.request_type && (r.unmount(ro), (ro = null)),
              ro ||
                ((ct.challenge_type = e.request_type),
                (ro = new t({
                  theme: { name: Si.active(), config: Si.get() },
                })),
                r.mount(ro)),
              a.removeCrumbs(),
              ro
                .setup(e, ct.orientation)
                .then(i)
                ["catch"](function (t) {
                  var e = t;
                  t instanceof Error &&
                    (e = {
                      event: it.CHALLENGE_ERROR,
                      message: "Challenge encountered an error during setup.",
                      reason: t.toString(),
                    }),
                    n(e);
                }),
              ro.breadcrumbs &&
                "number" == typeof ro.breadcrumbs &&
                ro.breadcrumbs > 1 &&
                (a.breadcrumbs.createCrumbs(ro.breadcrumbs),
                a.breadcrumbs.setIndex(ro.served));
          } catch ($s) {
            r.isMounted || (ro = null),
              n({
                event: it.CHALLENGE_ERROR,
                message: "Creating challenge failed.",
                reason: $s.toString(),
              });
          }
        });
      }),
      (i.show = function (e) {
        if (!o.create)
          return Promise.reject(new Error(et.CHALLENGE_ALREADY_CLOSED));
        (o.visible = !0),
          t.removeAttribute("aria-hidden"),
          Ke.resetData(),
          Ke.record(!0, !0, !0, !1),
          Ke.setData("dct", Date.now());
        var n = i.setup(e.bundle, e.bundleData),
          s = i.style(e.width, e.height).then(function (n) {
            o.visible &&
              (a.setLock(!1),
              l.setLock(!1),
              li.contact("challenge-ready", n).then(function () {
                var n = "info" === o.focus,
                  s = e.challengeType.indexOf("text") >= 0,
                  r = t.hasClass("using-kb");
                ct.a11y_tfe || !n || (!r && s)
                  ? i.focus()
                  : (l.menu.focus(!r), (o.focus = "challenge"));
              }));
          });
        return new Promise(function (t, i) {
          s["catch"](i),
            n.then(t, i),
            o.timer && clearTimeout(o.timer),
            (o.timer = setTimeout(function () {
              (o.timerExpired = !0),
                o.preventClose || i({ event: et.CHALLENGE_EXPIRED });
            }, e.expiration));
        });
      }),
      (i.style = function (e, i) {
        return ro
          ? new Promise(function (n, o) {
              try {
                ro.style(e, i)
                  .then(function (e) {
                    var i = 10,
                      o = e.mobile ? 60 : 70,
                      h = e.width,
                      u = e.height + i + o;
                    r.style(e.width, e.height, i),
                      "landscape" === ct.orientation &&
                      "image_label_binary" === ct.challenge_type
                        ? ((o = 35),
                          (h = e.width + o + i),
                          (u = e.height + o + i),
                          a.style(e.width, o),
                          a.css({ position: "absolute", right: 0, bottom: 0 }),
                          l.style(o, u),
                          l.css({ position: "absolute", left: 0, bottom: 0 }),
                          r.css({ position: "absolute", top: 0, left: o + i }))
                        : (a.style(e.width, o),
                          a.css({ position: "absolute", left: 0, bottom: 0 }),
                          l.style(e.width, o),
                          l.css({ position: "absolute", left: 0, bottom: 0 }),
                          r.css({
                            position: "relative",
                            marginBottom: i,
                            right: "auto",
                          })),
                      s.css({
                        width: h,
                        height: u,
                        margin: i,
                        position: "relative",
                      }),
                      t.css({ width: h + 20, height: u + 20 }),
                      c.style(h, u, e.mobile),
                      c.load(),
                      n({ width: h + 20, height: u + 20, mobile: e.mobile });
                  })
                  ["catch"](function (t) {
                    o({
                      event: it.CHALLENGE_ERROR,
                      message: "Error occurred in promise of .style()",
                      reason: t.toString(),
                    });
                  });
              } catch ($s) {
                o({
                  event: it.CHALLENGE_ERROR,
                  message: "Error when calling .style()",
                  reason: $s.toString(),
                });
              }
            })
          : Promise.resolve({ width: 0, height: 0, mobile: !1 });
      }),
      (i.submit = function () {
        return (i.hasBreadcrumbs() &&
          i.getTotalServed() !== i.getTotalBreadcrumbs()) ||
          "skip" !== a.getAction()
          ? new Promise(function (t, e) {
              try {
                if ((ro && ro.submit(), i.hasBreadcrumbs())) {
                  var n = i.getTotalServed();
                  a.breadcrumbs.setIndex(n);
                }
                t("challenge-complete"),
                  null !== o._timer &&
                    "check" === a.getAction() &&
                    (clearTimeout(o._timer), (o._timer = null));
              } catch ($s) {
                e($s);
              }
            })
          : Promise.resolve("challenge-skip");
      }),
      (i.displayReport = function (t) {
        return new Promise(function (e, n) {
          try {
            if (!i.isMounted()) return e();
            if (!i.canReport()) {
              var o;
              if ("fallback" === t.request_type) o = t.key;
              else {
                var s = i.hasBreadcrumbs() ? i.getTotalServed() - 1 : 0;
                o = t.tasklist[s].task_key;
              }
              return e(o);
            }
            i.report().then(e), a.breadcrumbs && a.breadcrumbs.hide();
          } catch (Is) {
            n(Is);
          }
        });
      }),
      (i.hideReport = function () {
        ro && ro.report && ro.report(!1);
      }),
      (i.close = function () {
        ro && (ro = r.unmount(ro)),
          o.timer && clearTimeout(o.timer),
          (o.timer = null),
          t.setAttribute("aria-hidden", !0),
          a.displayTryAgain(!1),
          a.removeCrumbs(),
          c.close(),
          (o.visible = !1),
          (o.create = !1);
      }),
      (i.translateInterface = function (t) {
        if (t && t.locale && t.table)
          try {
            t.table && (ae.setLocale(t.locale), ae.addTable(t.locale, t.table)),
              ro && ro.translate && ro.translate(),
              a.translate(),
              l.translate(),
              document.documentElement.setAttribute("lang", ae.getLocale());
          } catch ($s) {
            xt("translation", $s);
          }
      }),
      (i.translateBundle = function () {
        ro && ro.translate && ro.translate();
      }),
      (i.isVisible = function () {
        return o.visible;
      }),
      (i.setFocus = function (t) {
        o.focus = t;
      }),
      (i.triggerFocus = function (t, e) {
        "submit" === t ? a.submit.focus() : i.focus(e);
      }),
      (i.isInterfaceLocked = function () {
        return o.locked;
      }),
      (i.lockInterface = function (t) {
        (o.locked = t), a.setLock(t), l.setLock(t);
      }),
      (i.hasActiveElement = function () {
        return (
          document.activeElement === a.submit.dom ||
          document.activeElement === l.refresh.dom ||
          document.activeElement === l.menu.dom
        );
      }),
      (i.getActiveElement = function () {
        return document.activeElement === a.submit.dom
          ? "submit"
          : document.activeElement === l.refresh.dom
          ? "refresh"
          : document.activeElement === l.menu.dom
          ? "menu"
          : null;
      }),
      (i.getModal = function () {
        return c;
      }),
      (i.getTotalServed = function () {
        return ro.served;
      }),
      (i.getTotalBreadcrumbs = function () {
        return ro ? ro.breadcrumbs : 0;
      }),
      (i.hasBreadcrumbs = function () {
        return !(!ro || !ro.breadcrumbs);
      }),
      (i.canReport = function () {
        return ro.report && "function" == typeof ro.report;
      }),
      (i.report = function () {
        return new Promise(function (t) {
          var e = function (i) {
            ro.off("report-image", e), t(i);
          };
          ro.report(!0), ro.on("report-image", e);
        });
      }),
      (i.focus = function (t) {
        ro && ro.setFocus && ro.setFocus(t || 0, o.interaction);
      }),
      (i.displayTryAgain = function (t) {
        a.displayTryAgain(t);
      }),
      (i.enableA11yChallenge = function (t) {
        l.menuList.setA11yChallenge(t);
      }),
      i
    );
  }
  var lo = Object.create(null),
    co = null,
    ho = null,
    uo = [],
    po = null;
  function fo(t) {
    if (Array.isArray(t) && 0 !== t.length) {
      t.forEach(function (t) {
        -1 === uo.indexOf(t) && uo.push(t);
      });
    }
  }
  var mo = null;
  var yo = null;
  var go = function (t) {
      if ((Ct("Set spec", "proof", "info", t), t)) {
        (co = t), (ho = null);
        try {
          wo((ho = Bt.decode(t.req)))["catch"](function () {});
        } catch ($s) {
          xt("proof", $s);
        }
      }
    },
    vo = function (t) {
      t && (po = t);
    },
    bo = function () {
      return new Promise(function (t) {
        var e = co,
          i = ho;
        if (e)
          try {
            if (
              (Ct("Solve Proof", "proof", "info", e),
              !(
                -1 !== ["hsw", "hsj", "hsl"].indexOf(e.type) &&
                (!("n" in i.payload) || i.payload.n === e.type)
              ))
            )
              return (
                wt("Asset script invalid file", "error", "proof", {
                  seen: e.type,
                  wanted: i.n,
                }),
                void t({ solved: null, spec: e })
              );
            Promise.resolve()
              .then(function () {
                var t = window.crypto && window.crypto.subtle,
                  e = window.TextEncoder;
                if (t && e)
                  return (function (t) {
                    return (mo ||
                      (mo = new Promise(function (t, e) {
                        return Lt(
                          "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJEDGoSIwHTHfNtWy5e2MNv831yb7OqyAtvKn6bWr7plxlzs1+WxSQ+ZFgCaC+Am5Ujt4Ofm/lHcOfq7nvMdTokrgClQ16Fz0I5GSJGYQRKMXqMDng+gewZEMUivoJ+RlB3VF+1kBuiRUKoarP1go9q2/A11n+/xKmB2fnKPZrfQIDAQAB"
                        ).then(t, e);
                      })),
                    mo)
                      .then(function (e) {
                        return Bt.verify(t, e)["catch"](function () {
                          return (yo ||
                            (yo = new Promise(function (t, e) {
                              return Lt(
                                "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0GSPIW2DzUAQBwynPvt6n4R5MnhqIiHcD6ggM8vE3dDXuAe1rSm60kPG5pdhKvStYWmVb6a8DmGOJCnfR3vr2NmHJBUfso2rnYtYxT3WomZxJUyrKfk8Hiv0XMzlvhP9ViMh5uPnDyimisHwYhDlf4d7LfsUwV9Wyx5GnhTQuafUfmH1daaK4Dcs61Pw2dZfj2by77guM2xdphC7jiWnfwQN9HbNRtukQOHsah2uPW4nN4AvGUYsnazWNpxgXqs/DnJv3zODfT3yQ8mRkJ+vOwiY796th873TNjKD1cCsIf+nGwP/NebrqXsU7YjC5xYmFGy6zCrKyWS+40qumlAVwIDAQAB"
                              ).then(t, e);
                            })),
                          yo).then(function (e) {
                            return Bt.verify(t, e);
                          });
                        });
                      })
                      ["catch"](function (t) {
                        xt("proof", t);
                      });
                  })(i);
              })
              .then(function () {
                return wo(i);
              })
              .then(function (t) {
                if ("function" != typeof t)
                  return Promise.reject(new Error("Script is not a function"));
                var i = {
                  assethost: ut.assethost,
                  fetchAsset: function (t) {
                    return Se.retrieve(t)
                      .then(function (e) {
                        return e || Se.file(t, { responseType: "arraybuffer" });
                      })
                      .then(function (t) {
                        return t.data;
                      });
                  },
                  href: po,
                };
                return (
                  uo.length && (i.errors = uo),
                  ai.messages.length && (i.messages = ai.messages),
                  t(e.req, i)
                );
              })
              .then(function (i) {
                t({ solved: i, spec: e });
              })
              ["catch"](function (i) {
                "string" == typeof i && -1 !== i.indexOf("http")
                  ? wt("Asset Script Failed", "error", "proof", { error: i })
                  : xt("proof", i),
                  t({ solved: "fail", spec: e });
              });
          } catch ($s) {
            xt("proof", $s), t({ solved: null, spec: e });
          }
        else t({ solved: null, spec: null });
      });
    };
  function wo(t) {
    var e = t.payload.l,
      i = t.payload.i,
      n = t.payload.n,
      o = lo[n];
    if (o && o.location === e) return o.promise;
    var s = e + "/" + n + ".js",
      r = Se.script(s, { integrity: i }).then(function () {
        var t = window[n];
        try {
          t("IiI=.eyJzIjowLCJmIjowLCJjIjowfQ==.")["catch"](function () {});
        } catch (Is) {}
        return t;
      });
    return (lo[n] = { location: e, promise: r }), r;
  }
  var xo = null,
    Co = null;
  function ko(t) {
    Co && ((Co.e = Date.now() - Co.s), (Co.r = t), (xo = Co));
  }
  function _o() {
    try {
      return Object.keys(window).sort().join(",");
    } catch (Is) {
      return null;
    }
  }
  var Eo,
    So,
    Ao,
    Lo,
    Bo,
    Ho,
    Mo,
    Oo = null,
    To = null,
    Vo = null,
    Ro = null,
    Po = {},
    Do = null,
    Fo = null,
    $o = !1,
    Io = {
      logAction: function (t) {
        Do = t;
      },
      getTaskData: function (t, e, i, n) {
        t === undefined && (t = {});
        var o = e.proof,
          s = {
            v: "01e0b54",
            sitekey: ct.sitekey,
            host: ct.host,
            hl: ae.getLocale(),
          };
        return (
          ut.se && (s.se = ut.se),
          !0 === ct.a11y_tfe && (s.a11y_tfe = !0),
          null !== Do && ((s.action = Do), (Do = null)),
          null !== Ro && ((s.extraData = JSON.stringify(Ro)), (Ro = null)),
          t && (s.motionData = JSON.stringify(t)),
          i && (s.pd = JSON.stringify(i)),
          n && (s.pdc = JSON.stringify(n)),
          null !== Oo && ((To = Oo), (s.old_ekey = Oo)),
          null !== Fo && (s.rqdata = Fo),
          o &&
            ((s.n = o.solved || null),
            (s.c = o.spec ? JSON.stringify(o.spec) : null)),
          e.authToken && (s.auth_token = e.authToken),
          e.hasPst !== undefined && (s.pst = e.hasPst),
          new Promise(function (t, i) {
            try {
              me({
                url: ut.endpoint + "/getcaptcha/" + s.sitekey,
                data: s,
                dataType: "query",
                responseType: "json",
                withCredentials: !0,
                pst: e.hasPst ? "send-redemption-record" : null,
                headers: {
                  Accept: "application/json",
                  "Content-type": "application/x-www-form-urlencoded",
                },
              })
                .then(function (e) {
                  var i = e.body || null;
                  if (!i) throw new Error("Missing response body.");
                  if (!1 === i.success)
                    return (
                      -1 !== (i["error-codes"] || []).indexOf("invalid-data") &&
                        wt("invalid-data", "error", "api", {
                          motionData: s.motionData,
                        }),
                      void t(i)
                    );
                  Io.setData(i), t(i);
                })
                ["catch"](i);
            } catch (Is) {
              i(Is);
            }
          })
        );
      },
      loadBundle: function (t) {
        return new Promise(function (e, i) {
          if (Po[t]) e(Po[t]);
          else {
            var n = Io.createBundleUrl(t);
            Se.script(n)
              .then(function () {
                (Po[t] = window[t]), e(Po[t]);
              })
              ["catch"](function (t) {
                i({
                  event: it.BUNDLE_ERROR,
                  message: "Failed to get challenge bundle.",
                  reason: t,
                });
              });
          }
        });
      },
      createBundleUrl: function (t) {
        return (
          (ut.assethost || ct.assetDomain) +
          "/captcha/challenge/" +
          t +
          "/01e0b54/challenge.js"
        );
      },
      checkAnswers: function (t, e, i) {
        var n = {
          v: "01e0b54",
          job_mode: Ro.request_type,
          answers: t,
          serverdomain: ct.host,
          sitekey: ct.sitekey,
          motionData: JSON.stringify(e),
        };
        return (
          ut.se && (n.se = ut.se),
          i && ((n.n = i.solved), (n.c = JSON.stringify(i.spec))),
          new Promise(function (t, e) {
            try {
              me({
                url: ut.endpoint + "/checkcaptcha/" + n.sitekey + "/" + Ro.key,
                data: n,
                dataType: "json",
                responseType: "json",
                withCredentials: !0,
                headers: { "Content-type": "application/json;charset=UTF-8" },
              })
                .then(function (e) {
                  var i = e.body || null;
                  if (!i) throw new Error("Missing response body.");
                  if (!1 === i.success) {
                    var o = i["error-codes"] || [""];
                    -1 !== o.indexOf("invalid-data") &&
                      wt("invalid-data", "error", "api", {
                        motionData: n.motionData,
                      });
                    var s = o.join(", ");
                    throw new Error(s);
                  }
                  t(i);
                })
                ["catch"](e);
            } catch (Is) {
              e(Is);
            }
          })
        );
      },
      reportIssue: function (t, e, i) {
        var n = { taskdata: Ro, on_url: ct.url, report_category: t, sid: Vo };
        if (
          (e && (n.user_comments = e),
          To && (n.last_ekey = To),
          i && Ro && "fallback" !== Ro.request_type)
        ) {
          for (var o = Ro.tasklist, s = null, r = -1; ++r < o.length && !s; )
            o[r].task_key === i && (s = o[r]);
          n.taskdata.tasklist = [s];
        }
        return me({
          url: ut.reportapi + "/bug-report",
          data: n,
          dataType: "json",
          responseType: "json",
          withCredentials: !0,
          headers: { "Content-type": "application/json;charset=UTF-8" },
        });
      },
      getEKey: function () {
        return Oo;
      },
      setData: function (t) {
        (Ro = t), (Oo = t.key), ($o = !!t.rq), Vo || (Vo = Oo);
      },
      setRqData: function (t) {
        Fo = t;
      },
      getRqData: function () {
        return Fo;
      },
      hasPrivateStateToken: function () {
        return document.hasPrivateToken
          ? new Promise(function (t) {
              document
                .hasRedemptionRecord(ut.pstIssuer)
                .then(function (e) {
                  e
                    ? t(!0)
                    : document
                        .hasPrivateToken(ut.pstIssuer, "private-state-token")
                        .then(function (e) {
                          if (e) {
                            var i = {
                              v: "01e0b54",
                              sitekey: ct.sitekey,
                              host: ct.host,
                            };
                            me({
                              url: ut.pstIssuer + "/pst/redemption",
                              data: i,
                              dataType: "json",
                              responseType: "json",
                              timeout: 1500,
                              pst: "token-redemption",
                              headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                              },
                            })
                              .then(function () {
                                t(!0);
                              })
                              ["catch"](function (e) {
                                vt(e), t(undefined);
                              });
                          } else t(!1);
                        })
                        ["catch"](function (e) {
                          vt(e), t(undefined);
                        });
                })
                ["catch"](function (e) {
                  vt(e), t(undefined);
                });
            })
          : Promise.resolve(undefined);
      },
      isRqChl: function () {
        return $o;
      },
      getData: function () {
        return Ro;
      },
      authenticate: function (t) {
        var e = { v: "01e0b54", sitekey: ct.sitekey, host: ct.host };
        return (
          ut.se && (e.se = ut.se),
          t &&
            ((e.n = t.solved || null),
            (e.c = t.spec ? JSON.stringify(t.spec) : null)),
          me({
            url: ut.endpoint + "/authenticate",
            data: e,
            dataType: "json",
            responseType: "json",
            withCredentials: !0,
            timeout: 1500,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then(function (t) {
              return t.body;
            })
            ["catch"](function (t) {
              if (401 === t.status) return t.response;
              throw t;
            })
        );
      },
    },
    jo =
      ((Eo = []),
      (So = null),
      (Ao = !1),
      (Lo = []),
      (Bo = function (t) {
        try {
          if (Eo.length >= 10) return;
          var e = t.stack;
          if ("string" != typeof e) return;
          var i = e.trim().split("\n");
          "Error" === i[0] && (i = i.slice(1));
          var n = gt((i = i.slice(-2)));
          n && -1 === Eo.indexOf(n) && Eo.push(n);
        } catch (t) {
          return;
        }
      }),
      (Ho = function () {
        if (Ao)
          try {
            for (var t = 0; t < Lo.length; t++) Lo[t]();
            null !== So && clearTimeout(So);
          } catch (e) {
            Bo(e);
          } finally {
            (Lo = []), (So = null), (Ao = !1);
          }
      }),
      (Mo = function (t, e) {
        var i = Object.getOwnPropertyDescriptor(t, e);
        if (!i || !1 !== i.writable) {
          var n = Object.prototype.hasOwnProperty.call(t, e),
            o = t[e];
          (t[e] = function () {
            return (
              Ao && (Eo.length >= 10 && Ho(), Bo(new Error())),
              o.apply(t, arguments)
            );
          }),
            Lo.push(function () {
              n ? (t[e] = o) : delete t[e];
            });
        }
      }),
      {
        run: function (t) {
          if (!Ao) {
            (Ao = !0),
              isFinite(t) &&
                (So = setTimeout(function () {
                  Ho();
                }, t));
            try {
              Mo(document, "getElementsByClassName"),
                Mo(document, "getElementById"),
                Mo(document, "querySelector"),
                Mo(document, "querySelectorAll");
            } catch (e) {
              Ho(), Bo(e);
            }
          }
        },
        collect: function () {
          return Eo.concat(yt);
        },
      });
  function No(t) {
    if ("en" === t) return Promise.resolve();
    var e = t + ".json";
    return new Promise(function (i, n) {
      Se.retrieve(e)
        .then(function (i) {
          return (
            i ||
            Se.file(e, {
              prefix:
                "https://newassets.hcaptcha.com/captcha/v1/01e0b54/static/i18n",
            }).then(function (e) {
              return ae.addTable(t, e.data), e;
            })
          );
        })
        .then(function (t) {
          i(t.data);
        })
        ["catch"](function (t) {
          n(t);
        });
    });
  }
  var zo = [
      "10000000-ffff-ffff-ffff-000000000001",
      "20000000-ffff-ffff-ffff-000000000002",
      "30000000-ffff-ffff-ffff-000000000003",
    ],
    Zo = {
      sitekey: function (t) {
        return (
          jt.UUIDv4(t) ||
          "00000000-0000-0000-0000-000000000000" === t ||
          -1 !== zo.indexOf(t)
        );
      },
      dummykey: function (t) {
        return -1 !== zo.indexOf(t);
      },
    };
  function Uo() {
    var t,
      e,
      i,
      n,
      o,
      s,
      r = Zo.dummykey(ct.sitekey);
    if ("localhost" === ct.host && !r) {
      var a = "Warning: localhost detected. Please use a valid host.";
      return console.error(a), Promise.reject(new Error(a));
    }
    return ((t = ct.sitekey),
    (e = ct.host),
    (i = {
      attempts: 3,
      delay: 5e3,
      onFail: function (t) {
        return (
          Ct("challenge", "api", "debug", t),
          t && 0 === t.status && -1 !== at.indexOf(ut.endpoint)
            ? ((ut.endpoint = ot), !0)
            : (wt("api:checksiteconfig failed", "error", "challenge", {
                error: t,
              }),
              t instanceof Error || 400 === t.status)
        );
      },
    }),
    (n = tt.Browser.supportsCanvas() >>> 0),
    (o = tt.Browser.supportsWebAssembly() >>> 0),
    (s = tt.Browser.supportsPST() >>> 0),
    new Promise(function (r, a) {
      var l = { v: "01e0b54", host: e, sitekey: t, sc: n, swa: o, spst: s };
      ut.se && (l.se = ut.se),
        me({
          url: function () {
            var e = ut.endpoint;
            return (
              e === nt &&
                ("78c843a4-f80d-4a14-b3e5-74b492762487" === t ||
                  Math.random() < 0.2) &&
                (e = st),
              e + "/checksiteconfig?" + Ot(l)
            );
          },
          responseType: "json",
          withCredentials: !0,
          timeout: 5e3,
          headers: { Accept: "application/json", "Content-Type": "text/plain" },
          retry: i,
        })
          .then(function (t) {
            var e = t.body || null;
            if (e)
              if (!1 === e.success) {
                var i = (e["error-codes"] || []).join(", ");
                a(new Error(i));
              } else !e.pass && e.error ? a(new Error(e.error)) : r(e);
            else a(new Error("Missing response body."));
          })
          ["catch"](a);
    })).then(function (t) {
      return (
        Ct("/checksiteconfig success", "request", "info", t),
        ut.endpoint === nt && t.endpoint
          ? ((ut.endpoint = t.endpoint), Uo())
          : (t.endpoint &&
              -1 !== at.indexOf(ut.endpoint) &&
              (ut.endpoint = t.endpoint),
            delete t.endpoint,
            t)
      );
    });
  }
  var Wo = new _i();
  Wo.add("contrast", {}),
    Wo.add("grey-red", {
      component: { checkbox: { main: { border: "#6a6a6a" } } },
    });
  function Ko() {
    Qt.self(this, Xt, "#a11y-label"),
      (this.state = { ticked: !1 }),
      this.setAttribute("aria-hidden", !0),
      this.css({ display: "none" }),
      this.translate();
  }
  function qo(t) {
    var e = t.get(),
      i = e.palette,
      n = e.component,
      o = "light" === i.mode;
    return _i.merge(
      {
        main: { fill: i.grey[100], border: i.grey[o ? 600 : 200] },
        focus: {
          fill: i.grey[200],
          border: i.grey[o ? 800 : 100],
          outline: "dark" === t.active() ? i.secondary.main : i.primary.main,
        },
      },
      n.input
    );
  }
  function Go() {
    Qt.self(this, Xt, "#checkbox"),
      (this.state = { focused: !1, visible: !0, passed: !1 }),
      (this._style = qo(Wo)),
      this.setAttribute("aria-haspopup", !0),
      this.setAttribute("aria-checked", !1),
      this.setAttribute("role", "checkbox"),
      this.setAttribute("tabindex", "0"),
      this.setAttribute("aria-live", "assertive"),
      this.setAttribute("aria-labelledby", "a11y-label"),
      (this.onOver = this.onOver.bind(this)),
      (this.onOut = this.onOut.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener("over", this.onOver),
      this.addEventListener("out", this.onOut),
      this.addEventListener("focus", this.onFocus),
      this.addEventListener("blur", this.onBlur);
  }
  Qt.proto(Ko, Xt),
    (Ko.prototype.setState = function (t) {
      (this.state.ticked = "passed" === t), this.translate();
    }),
    (Ko.prototype.translate = function () {
      var t = this.state.ticked
        ? "hCaptcha checkbox. You are verified"
        : "hCaptcha checkbox. Select in order to trigger the challenge, or to bypass it if you have an accessibility cookie.";
      this.content(ae.translate(t));
    }),
    Qt.proto(Go, Xt),
    (Go.prototype.style = function () {
      this._style = qo(Wo);
      var t = this.state.visible ? this._style.main.fill : "transparent",
        e = this.state.focused
          ? this._style.focus.border
          : this._style.main.border,
        i = this.state.visible ? e : "transparent";
      this.css({
        position: "absolute",
        width: 28,
        height: 28,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: i,
        borderRadius: 4,
        backgroundColor: t,
        outlineColor: this._style.focus.outline,
        top: 0,
        left: 0,
      });
    }),
    (Go.prototype.onOver = function (t) {
      this.state.focused ||
        ((this.state.focused = "focus" === t.action),
        this.css({ borderColor: this._style.focus.border }));
    }),
    (Go.prototype.onOut = function (t) {
      if ("blur" === t.action) this.state.focused = !1;
      else if (this.state.focused) return;
      this.css({ borderColor: this._style.main.border });
    }),
    (Go.prototype.onFocus = function (t) {
      var e = this._style.focus.outline;
      this.css({ outline: "2px solid " + e });
    }),
    (Go.prototype.onBlur = function (t) {
      this.css({ outline: "none" });
    }),
    (Go.prototype.display = function (t) {
      (this.state.visible = t),
        this.setAttribute("tabindex", t ? 0 : -1),
        this.style();
    }),
    (Go.prototype.setState = function (t) {
      (this.state.passed = "passed" === t),
        (this.state.visible = "loading" !== t && "passed" !== t),
        this.setAttribute(
          "tabindex",
          "loading" === t || "solving" === t ? -1 : 0
        ),
        this.setAttribute("aria-checked", this.state.passed),
        this.style();
    });
  function Jo() {
    Qt.self(this, Mi, {
      selector: ".pulse",
      src: "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3c!-- Generator: Adobe Illustrator 21.0.2%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e%3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 44 44' style='enable-background:new 0 0 44 44%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .st0%7bfill:none%3bstroke:%23FF7B00%3bstroke-width:2%3b%7d%3c/style%3e%3cg%3e %3ccircle class='st0' cx='22' cy='22' r='1'%3e %3canimate accumulate='none' additive='replace' attributeName='r' begin='0s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.165%2c 0.84%2c 0.44%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 20'%3e %3c/animate%3e %3canimate accumulate='none' additive='replace' attributeName='stroke-opacity' begin='0s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.3%2c 0.61%2c 0.355%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 0'%3e %3c/animate%3e %3c/circle%3e %3ccircle class='st0' cx='22' cy='22' r='1'%3e %3canimate accumulate='none' additive='replace' attributeName='r' begin='-0.9s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.165%2c 0.84%2c 0.44%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 20'%3e %3c/animate%3e %3canimate accumulate='none' additive='replace' attributeName='stroke-opacity' begin='-0.9s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.3%2c 0.61%2c 0.355%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 0'%3e %3c/animate%3e %3c/circle%3e%3c/g%3e%3c/svg%3e",
      width: 30,
      fallback:
        "https://newassets.hcaptcha.com/captcha/v1/01e0b54/static/images/pulse.png",
    }),
      (this.state = { visible: !1 });
  }
  Qt.proto(Jo, Mi),
    (Jo.prototype.style = function () {
      this.size(),
        this.css({
          display: this.state.visible ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
        });
    }),
    (Jo.prototype.display = function (t) {
      (this.state.visible = t), this.style();
    });
  function Yo() {
    Qt.self(this, Mi, {
      selector: ".check",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAC00lEQVR4nO2aTU8TQRyHn39bIdXEm3jwLQhefPkAJorYLYslIF64ohwM8eQH0A/gzYSLIRooxBORKJr4Ultq4smz8YgQb3ow4YAmUHY8IEpgd7vQ3e0smee4+5/uPL+daXdmCwaDwWAwGAwGg8FgMBgM+wBr0u7JFe17QWrTUXcmbqxJuwdhTpDejsHO7Ne5hbJf/b4KYFMeJAuAcKleCPsmgB3ymwiX2m901BZfLHx0a5eKpXcR4ykPgPqdEvnk1Vai7Fgc1JMXkevlm+88p0CiA2hUHhIcQBjykNAAwpKHBAYQpjwkLICw5SFBAUQhDwkJICp5SEAAUcqD5gFELQ8aBxCHPGgaQFzyoGEAccpDwNXgxZmhLCr6sPJTvXk/eRSDYcpDgAAGxgcOZleW31hF+1GUIViTdo9S6qXfna+MlN6HfV3fAApjhdZfrauzInIFkdGoQoh72G/FM4ChmaGW1cPOM+Dav4MRhNBMefAJ4OfK8hjQv+OEyKhV7H0YRgjNmPPb8QxgndQDYMn1pHC30ZHQrDm/Hc8APoy8XVK1dDew6FrQwHTIFe0uRJ43a9hvpW7nc0/6TklmvQq0uxYoNV65VbqDoIJcMFe0uwR5DRxy+bBY5SHgg1B+On9SOZkqqNOuBQFD0E0edvEkuBFCeh7ocC2oE4KO8rCL9wLl4fK3tKOuAguuBT7fCbrKwx7WAvaEfcJJybyCTteCbSNBZ3nY42Ko+2nheKbmVOuFkJuyL+ssDw2sBnNT/cdErVWBMx4ls6D6/B5y4vidr0dDT3PWY+soBzLzwNngrfS485s09HK0crvynbVaDvgSrIVe8hDShsjfkVABznlX6ScPIe4I2dN2W82RisD5nWf1lIeQt8Tsabtt3aEMcuH/UX3lIeQ/SJSGSz9anLQF6vPGEb3lIaJN0cJE4ciaOK9IcV9n+WiJYRPVYDAYDAaDoRH+ALzfixyrasnFAAAAAElFTkSuQmCC",
      width: 30,
    }),
      (this.state = { visible: !1 });
  }
  function Qo() {
    Qt.self(this, Xt, "#anchor-wr"),
      (this.state = { loading: !1, checked: !1 });
    var t = this.createElement("#anchor-td"),
      e = t.createElement("#anchor-tc"),
      i = e.createElement("#anchor-state");
    (this.a11y = this.initComponent(Ko)),
      (this.input = this.initComponent(Go, null, i)),
      (this.loading = this.initComponent(Jo, null, i)),
      (this.checked = this.initComponent(Yo, null, i)),
      (this.table = t),
      (this.cell = e),
      (this.wrapper = i);
  }
  Qt.proto(Yo, Mi),
    (Yo.prototype.style = function () {
      this.size(),
        this.css({
          display: this.state.visible ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
          animation: this.state.visible ? "pop 0.4s linear" : "auto",
        });
    }),
    (Yo.prototype.display = function (t) {
      (this.state.visible = t), this.style();
    }),
    Qt.proto(Qo, Xt),
    (Qo.prototype.style = function (t) {
      var e = t ? 60 : "100%",
        i = t ? "0px 12px" : "0px 15px";
      this.css({
        position: "relative",
        display: "inline-block",
        height: e,
        "-ms-high-contrast-adjust": "none",
      }),
        this.table.css({
          position: "relative",
          display: "table",
          top: 0,
          height: "100%",
        }),
        this.cell.css({ display: "table-cell", verticalAlign: "middle" });
      this.wrapper.css({
        position: "relative",
        width: 30,
        height: 30,
        margin: i,
      }),
        this.input.style(),
        this.loading.style(),
        this.checked.style();
    }),
    (Qo.prototype.describeBy = function (t) {
      t && t.dom && t.dom.id
        ? this.input.setAttribute("aria-describedby", t.dom.id)
        : this.input.removeAttribute("aria-describedby");
    }),
    (Qo.prototype.setState = function (t) {
      var e = "loading" === t,
        i = "passed" === t;
      this.checked.display(i),
        this.loading.display(e),
        this.a11y.setState(t),
        this.input.setState(t),
        (this.state.loading = e),
        (this.state.checked = i);
    }),
    (Qo.prototype.focus = function () {
      this.input.focus();
    }),
    (Qo.prototype.getLocation = function () {
      var t = this.input.dom.getBoundingClientRect(),
        e = t.bottom - t.top,
        i = t.right - t.left;
      return {
        left: t.left,
        right: t.right,
        top: t.top,
        bottom: t.bottom,
        width: i,
        height: e,
        x: t.left + i / 2,
        y: t.top + e / 2,
      };
    }),
    (Qo.prototype.translate = function () {
      this.a11y.translate();
    });
  function Xo() {
    Qt.self(this, Xt, "label-container"),
      (this.table = this.createElement("label-td")),
      (this.cell = this.table.createElement("label-tc")),
      (this.text = this.cell.createElement("#label")),
      this.translate();
  }
  Qt.proto(Xo, Xt),
    (Xo.prototype.style = function (t) {
      var e = t ? 60 : "100%",
        i = t ? 100 : 170,
        n = Wo.get().palette;
      this.css({
        position: "relative",
        display: "inline-block",
        height: e,
        width: i,
      }),
        this.table.css({
          position: "relative",
          display: "table",
          top: 0,
          height: "100%",
        }),
        this.cell.css({ display: "table-cell", verticalAlign: "middle" }),
        this.text.css({ color: n.text.body, fontSize: 14 });
    }),
    (Xo.prototype.translate = function () {
      var t = ae.translate("I am human");
      this.text.content(t);
    });
  var ts = "Privacy",
    es = "https://hcaptcha.com/privacy",
    is = "hCaptcha Privacy Policy",
    ns = "Terms",
    os = "https://hcaptcha.com/terms",
    ss = "hCaptcha Terms of Service";
  function rs(t) {
    Qt.self(this, Xt, "anchor-links"),
      (this.state = { theme: t.theme, size: t.size }),
      (this.privacy = this.initComponent(Li, {
        theme: Wo,
        text: ts,
        url:
          (t.privacyUrl || es) +
          "?ref=" +
          ct.host +
          "&utm_campaign=" +
          ct.sitekey +
          "&utm_medium=checkbox",
      })),
      (this.hyphen = this.initComponent(Bi, { text: " - " })),
      (this.terms = this.initComponent(Li, {
        theme: Wo,
        text: ns,
        url:
          (t.termsUrl || os) +
          "?ref=" +
          ct.host +
          "&utm_campaign=" +
          ct.sitekey +
          "&utm_medium=checkbox",
      })),
      this.translate();
  }
  Qt.proto(rs, Xt),
    (rs.prototype.style = function () {
      var t = (function (t) {
          var e = t.palette,
            i = t.component,
            n = "light" === e.mode;
          return _i.merge({ main: e.grey[n ? 700 : 200] }, i.link);
        })(Wo.get()),
        e = { fontSize: 8, color: t.main };
      this.privacy.style(e), this.hyphen.style(e), this.terms.style(e);
    }),
    (rs.prototype.translate = function () {
      this.privacy.translate(),
        this.terms.translate(),
        this.privacy.setAttribute("aria-label", ae.translate(is)),
        this.terms.setAttribute("aria-label", ae.translate(ss));
    });
  var as = "https://www.hcaptcha.com/what-is-hcaptcha-about",
    ls =
      "Visit hcaptcha.com to learn more about the service and its accessibility options.";
  function cs(t) {
    Qt.self(this, Xt, "anchor-brand"),
      (this.state = {
        url:
          t.logoUrl ||
          as +
            "?ref=" +
            ct.host +
            "&utm_campaign=" +
            ct.sitekey +
            "&utm_medium=checkbox",
        theme: "dark" === t.theme ? "dark" : "light",
        display: t.displayLogo,
        label: "hCaptcha",
      });
    var e =
        "light" === this.state.theme
          ? "data:image/svg+xml,%3csvg width='44' height='46' viewBox='0 0 44 46' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M30 28H26V32H30V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M26 28H22V32H26V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M22 28H18V32H22V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M18 28H14V32H18V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M34 24H30V28H34V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M30 24H26V28H30V24Z' fill='%230082BF'/%3e%3cpath d='M26 24H22V28H26V24Z' fill='%230082BF'/%3e%3cpath d='M22 24H18V28H22V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M18 24H14V28H18V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M14 24H10V28H14V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M38 20H34V24H38V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M34 20H30V24H34V20Z' fill='%23008FBF'/%3e%3cpath d='M30 20H26V24H30V20Z' fill='%23008FBF'/%3e%3cpath d='M26 20H22V24H26V20Z' fill='%23008FBF'/%3e%3cpath d='M22 20H18V24H22V20Z' fill='%23008FBF'/%3e%3cpath d='M18 20H14V24H18V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M14 20H10V24H14V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M10 20H6V24H10V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M38 16H34V20H38V16Z' fill='%23009DBF'/%3e%3cpath d='M34 16H30V20H34V16Z' fill='%23009DBF'/%3e%3cpath d='M30 16H26V20H30V16Z' fill='%23009DBF'/%3e%3cpath d='M26 16H22V20H26V16Z' fill='%23009DBF'/%3e%3cpath d='M22 16H18V20H22V16Z' fill='%23009DBF'/%3e%3cpath d='M18 16H14V20H18V16Z' fill='%23009DBF'/%3e%3cpath d='M14 16H10V20H14V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M10 16H6V20H10V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M38 12H34V16H38V12Z' fill='%2300ABBF'/%3e%3cpath d='M34 12H30V16H34V12Z' fill='%2300ABBF'/%3e%3cpath d='M30 12H26V16H30V12Z' fill='%2300ABBF'/%3e%3cpath d='M26 12H22V16H26V12Z' fill='%2300ABBF'/%3e%3cpath d='M22 12H18V16H22V12Z' fill='%2300ABBF'/%3e%3cpath d='M18 12H14V16H18V12Z' fill='%2300ABBF'/%3e%3cpath d='M14 12H10V16H14V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M10 12H6V16H10V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M38 8H34V12H38V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M34 8H30V12H34V8Z' fill='%2300B9BF'/%3e%3cpath d='M30 8H26V12H30V8Z' fill='%2300B9BF'/%3e%3cpath d='M26 8H22V12H26V8Z' fill='%2300B9BF'/%3e%3cpath d='M22 8H18V12H22V8Z' fill='%2300B9BF'/%3e%3cpath d='M18 8H14V12H18V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M14 8H10V12H14V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M10 8H6V12H10V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M34 4H30V8H34V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M30 4H26V8H30V4Z' fill='%2300C6BF'/%3e%3cpath d='M26 4H22V8H26V4Z' fill='%2300C6BF'/%3e%3cpath d='M22 4H18V8H22V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M18 4H14V8H18V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M14 4H10V8H14V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M30 0H26V4H30V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M26 0H22V4H26V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M22 0H18V4H22V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M18 0H14V4H18V0Z' fill='%2300D4BF'/%3e%3cpath d='M16.5141 14.9697L17.6379 12.4572C18.0459 11.8129 17.9958 11.0255 17.5449 10.5745C17.4876 10.5173 17.416 10.46 17.3444 10.4171C17.0366 10.2238 16.6572 10.1808 16.3065 10.2954C15.9199 10.4171 15.5835 10.6748 15.3687 11.0184C15.3687 11.0184 13.8297 14.6046 13.2642 16.2153C12.6987 17.8259 12.9206 20.7822 15.1254 22.987C17.4661 25.3277 20.8448 25.8575 23.0066 24.2397C23.0997 24.1967 23.1784 24.1395 23.2572 24.0751L29.9072 18.5202C30.2293 18.2554 30.7089 17.7042 30.2794 17.0743C29.8642 16.4586 29.0697 16.881 28.7404 17.0886L24.9107 19.8731C24.8391 19.9304 24.7318 19.9232 24.6673 19.8517C24.6673 19.8517 24.6673 19.8445 24.6602 19.8445C24.56 19.7228 24.5456 19.4079 24.696 19.2862L30.5657 14.304C31.074 13.8459 31.1456 13.1802 30.7304 12.7292C30.3295 12.2854 29.6924 12.2997 29.1842 12.7578L23.9157 16.881C23.8155 16.9597 23.6652 16.9454 23.5864 16.8452L23.5793 16.838C23.4719 16.7235 23.4361 16.5231 23.5506 16.4014L29.535 10.596C30.0074 10.1522 30.036 9.4149 29.5922 8.94245C29.3775 8.72054 29.084 8.59169 28.7762 8.59169C28.4612 8.59169 28.1606 8.70623 27.9387 8.92813L21.8255 14.6691C21.6823 14.8122 21.396 14.6691 21.3602 14.4973C21.3459 14.4328 21.3674 14.3684 21.4103 14.3255L26.0918 8.99972C26.5571 8.56306 26.5858 7.83292 26.1491 7.36763C25.7124 6.90234 24.9823 6.87371 24.517 7.31036C24.4955 7.32468 24.4812 7.34615 24.4597 7.36763L17.3659 15.2203C17.1082 15.478 16.736 15.4851 16.557 15.342C16.4425 15.2489 16.4282 15.0843 16.5141 14.9697Z' fill='white'/%3e%3cpath d='M4.99195 43.6627H3.32946V40.8306C3.32946 40.1764 3.2488 39.6073 2.55423 39.6073C1.85966 39.6073 1.64905 40.2167 1.64905 41.0144V43.6627H0V36.112H1.64905V37.9045C1.64905 38.4512 1.64008 39.0427 1.64008 39.0427C1.89999 38.5632 2.38395 38.1689 3.13677 38.1689C4.61106 38.1689 4.99195 39.1637 4.99195 40.4766V43.6627Z' fill='%23555555'/%3e%3cpath d='M12.081 42.762C11.7181 43.1563 10.9652 43.7882 9.51337 43.7882C7.42069 43.7882 5.77612 42.3228 5.77612 39.8941C5.77612 37.4564 7.43861 36 9.50889 36C10.9742 36 11.7674 36.6453 11.9556 36.8514L11.4402 38.3167C11.3058 38.1285 10.544 37.5281 9.60299 37.5281C8.39757 37.5281 7.4655 38.3795 7.4655 39.8582C7.4655 41.337 8.43342 42.175 9.60299 42.175C10.4902 42.175 11.131 41.803 11.5209 41.3773L12.081 42.762Z' fill='%23555555'/%3e%3cpath d='M17.3016 43.6627H15.7242L15.6928 43.0936C15.4777 43.3221 15.0655 43.7837 14.2365 43.7837C13.3403 43.7837 12.3903 43.2684 12.3903 42.0674C12.3903 40.8665 13.4344 40.4587 14.3709 40.4139L15.6525 40.3601V40.2391C15.6525 39.67 15.2716 39.3743 14.6084 39.3743C13.9586 39.3743 13.3089 39.679 13.049 39.8538L12.6143 38.72C13.049 38.4915 13.8421 38.1733 14.7921 38.1733C15.7421 38.1733 16.2888 38.4019 16.6921 38.7962C17.082 39.1906 17.3016 39.7148 17.3016 40.6245V43.6627ZM15.657 41.2877L14.8414 41.3415C14.3351 41.3639 14.0348 41.5924 14.0348 41.9957C14.0348 42.4125 14.353 42.6634 14.8101 42.6634C15.2537 42.6634 15.5539 42.3587 15.657 42.1705V41.2877Z' fill='%23555555'/%3e%3cpath d='M21.6034 43.7792C20.8506 43.7792 20.3129 43.4835 19.9947 42.9816V45.6389H18.3456V38.2674H19.914L19.9051 38.9575H19.9275C20.2994 38.487 20.8461 38.1689 21.6213 38.1689C23.0867 38.1689 24.0142 39.3832 24.0142 40.9696C24.0142 42.5559 23.0777 43.7792 21.6034 43.7792ZM21.1284 39.549C20.4249 39.549 19.9409 40.1181 19.9409 40.9471C19.9409 41.7762 20.4249 42.3453 21.1284 42.3453C21.8409 42.3453 22.3249 41.7762 22.3249 40.9471C22.3249 40.1181 21.8409 39.549 21.1284 39.549Z' fill='%23555555'/%3e%3cpath d='M27.8321 39.6028H26.7074V41.5386C26.7074 42.0002 26.7701 42.1077 26.8508 42.2063C26.9225 42.296 27.0255 42.3363 27.2406 42.3363C27.4109 42.3318 27.5767 42.3004 27.738 42.2377L27.8187 43.6044C27.4378 43.7165 27.039 43.7747 26.6446 43.7792C26.0576 43.7792 25.6633 43.591 25.4079 43.2773C25.1524 42.9636 25.0449 42.511 25.0449 41.691V39.6028H24.3234V38.2809H25.0449V36.8156H26.7074V38.2809H27.8321V39.6028Z' fill='%23555555'/%3e%3cpath d='M32.7121 43.1339C32.6583 43.1787 32.1251 43.7792 30.7718 43.7792C29.3781 43.7792 28.0876 42.771 28.0876 40.9785C28.0876 39.1726 29.3961 38.1689 30.7897 38.1689C32.0892 38.1689 32.6762 38.738 32.6762 38.738L32.3133 40.0599C31.9458 39.7507 31.4843 39.5804 31.0048 39.5804C30.3013 39.5804 29.7456 40.0957 29.7456 40.9471C29.7456 41.7986 30.252 42.3363 31.0272 42.3363C31.8024 42.3363 32.3178 41.812 32.3178 41.812L32.7121 43.1339Z' fill='%23555555'/%3e%3cpath d='M38.3986 43.6627H36.7361V40.8306C36.7361 40.1764 36.6555 39.6073 35.9609 39.6073C35.2663 39.6073 35.0512 40.2212 35.0512 41.0188V43.6672H33.4067V36.112H35.0557V37.9045C35.0557 38.4512 35.0468 39.0427 35.0468 39.0427C35.3067 38.5632 35.7906 38.1689 36.5435 38.1689C38.0177 38.1689 38.3986 39.1637 38.3986 40.4766V43.6627Z' fill='%23555555'/%3e%3cpath d='M44 43.6627H42.4226L42.3913 43.0936C42.1762 43.3221 41.7639 43.7837 40.9349 43.7837C40.0387 43.7837 39.0887 43.2684 39.0887 42.0674C39.0887 40.8665 40.1328 40.4587 41.0693 40.4139L42.3509 40.3601V40.2391C42.3509 39.67 41.97 39.3743 41.3068 39.3743C40.6571 39.3743 40.0073 39.679 39.7474 39.8538L39.3127 38.7156C39.7474 38.487 40.5406 38.1689 41.4906 38.1689C42.4405 38.1689 42.9872 38.3974 43.3905 38.7917C43.7804 39.1861 44 39.7104 44 40.62V43.6627ZM42.3599 41.2877L41.5443 41.3415C41.038 41.3639 40.7377 41.5924 40.7377 41.9957C40.7377 42.4125 41.0559 42.6634 41.513 42.6634C41.9566 42.6634 42.2568 42.3587 42.3599 42.1705V41.2877V41.2877Z' fill='%23555555'/%3e%3c/svg%3e"
          : "data:image/svg+xml,%3csvg width='44' height='46' viewBox='0 0 44 46' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M30 28H26V32H30V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M26 28H22V32H26V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M22 28H18V32H22V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M18 28H14V32H18V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M34 24H30V28H34V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M30 24H26V28H30V24Z' fill='%230082BF'/%3e%3cpath d='M26 24H22V28H26V24Z' fill='%230082BF'/%3e%3cpath d='M22 24H18V28H22V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M18 24H14V28H18V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M14 24H10V28H14V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M38 20H34V24H38V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M34 20H30V24H34V20Z' fill='%23008FBF'/%3e%3cpath d='M30 20H26V24H30V20Z' fill='%23008FBF'/%3e%3cpath d='M26 20H22V24H26V20Z' fill='%23008FBF'/%3e%3cpath d='M22 20H18V24H22V20Z' fill='%23008FBF'/%3e%3cpath d='M18 20H14V24H18V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M14 20H10V24H14V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M10 20H6V24H10V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M38 16H34V20H38V16Z' fill='%23009DBF'/%3e%3cpath d='M34 16H30V20H34V16Z' fill='%23009DBF'/%3e%3cpath d='M30 16H26V20H30V16Z' fill='%23009DBF'/%3e%3cpath d='M26 16H22V20H26V16Z' fill='%23009DBF'/%3e%3cpath d='M22 16H18V20H22V16Z' fill='%23009DBF'/%3e%3cpath d='M18 16H14V20H18V16Z' fill='%23009DBF'/%3e%3cpath d='M14 16H10V20H14V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M10 16H6V20H10V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M38 12H34V16H38V12Z' fill='%2300ABBF'/%3e%3cpath d='M34 12H30V16H34V12Z' fill='%2300ABBF'/%3e%3cpath d='M30 12H26V16H30V12Z' fill='%2300ABBF'/%3e%3cpath d='M26 12H22V16H26V12Z' fill='%2300ABBF'/%3e%3cpath d='M22 12H18V16H22V12Z' fill='%2300ABBF'/%3e%3cpath d='M18 12H14V16H18V12Z' fill='%2300ABBF'/%3e%3cpath d='M14 12H10V16H14V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M10 12H6V16H10V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M38 8H34V12H38V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M34 8H30V12H34V8Z' fill='%2300B9BF'/%3e%3cpath d='M30 8H26V12H30V8Z' fill='%2300B9BF'/%3e%3cpath d='M26 8H22V12H26V8Z' fill='%2300B9BF'/%3e%3cpath d='M22 8H18V12H22V8Z' fill='%2300B9BF'/%3e%3cpath d='M18 8H14V12H18V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M14 8H10V12H14V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M10 8H6V12H10V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M34 4H30V8H34V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M30 4H26V8H30V4Z' fill='%2300C6BF'/%3e%3cpath d='M26 4H22V8H26V4Z' fill='%2300C6BF'/%3e%3cpath d='M22 4H18V8H22V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M18 4H14V8H18V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M14 4H10V8H14V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M30 0H26V4H30V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M26 0H22V4H26V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M22 0H18V4H22V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M18 0H14V4H18V0Z' fill='%2300D4BF'/%3e%3cpath d='M16.5141 14.9697L17.6379 12.4572C18.0459 11.8129 17.9958 11.0255 17.5449 10.5745C17.4876 10.5173 17.416 10.46 17.3444 10.4171C17.0366 10.2238 16.6572 10.1808 16.3065 10.2954C15.9199 10.4171 15.5835 10.6748 15.3687 11.0184C15.3687 11.0184 13.8297 14.6046 13.2642 16.2153C12.6987 17.8259 12.9206 20.7822 15.1254 22.987C17.4661 25.3277 20.8448 25.8575 23.0066 24.2397C23.0997 24.1967 23.1784 24.1395 23.2572 24.0751L29.9072 18.5202C30.2293 18.2554 30.7089 17.7042 30.2794 17.0743C29.8642 16.4586 29.0697 16.881 28.7404 17.0886L24.9107 19.8731C24.8391 19.9304 24.7318 19.9232 24.6673 19.8517C24.6673 19.8517 24.6673 19.8445 24.6602 19.8445C24.56 19.7228 24.5456 19.4079 24.696 19.2862L30.5657 14.304C31.074 13.8459 31.1456 13.1802 30.7304 12.7292C30.3295 12.2854 29.6924 12.2997 29.1842 12.7578L23.9157 16.881C23.8155 16.9597 23.6652 16.9454 23.5864 16.8452L23.5793 16.838C23.4719 16.7235 23.4361 16.5231 23.5506 16.4014L29.535 10.596C30.0074 10.1522 30.036 9.4149 29.5922 8.94245C29.3775 8.72054 29.084 8.59169 28.7762 8.59169C28.4612 8.59169 28.1606 8.70623 27.9387 8.92813L21.8255 14.6691C21.6823 14.8122 21.396 14.6691 21.3602 14.4973C21.3459 14.4328 21.3674 14.3684 21.4103 14.3255L26.0918 8.99972C26.5571 8.56306 26.5858 7.83292 26.1491 7.36763C25.7124 6.90234 24.9823 6.87371 24.517 7.31036C24.4955 7.32468 24.4812 7.34615 24.4597 7.36763L17.3659 15.2203C17.1082 15.478 16.736 15.4851 16.557 15.342C16.4425 15.2489 16.4282 15.0843 16.5141 14.9697Z' fill='white'/%3e%3cpath d='M4.99195 43.6627H3.32946V40.8306C3.32946 40.1764 3.2488 39.6073 2.55423 39.6073C1.85966 39.6073 1.64905 40.2167 1.64905 41.0144V43.6627H0V36.112H1.64905V37.9045C1.64905 38.4512 1.64008 39.0427 1.64008 39.0427C1.89999 38.5632 2.38395 38.1689 3.13677 38.1689C4.61106 38.1689 4.99195 39.1637 4.99195 40.4766V43.6627Z' fill='white'/%3e%3cpath d='M12.081 42.762C11.7181 43.1563 10.9652 43.7882 9.51337 43.7882C7.42069 43.7882 5.77612 42.3228 5.77612 39.8941C5.77612 37.4564 7.43861 36 9.50889 36C10.9742 36 11.7674 36.6453 11.9556 36.8514L11.4402 38.3167C11.3058 38.1285 10.544 37.5281 9.60299 37.5281C8.39757 37.5281 7.4655 38.3795 7.4655 39.8582C7.4655 41.337 8.43342 42.175 9.60299 42.175C10.4902 42.175 11.131 41.803 11.5209 41.3773L12.081 42.762Z' fill='white'/%3e%3cpath d='M17.3016 43.6627H15.7242L15.6928 43.0936C15.4777 43.3221 15.0655 43.7837 14.2365 43.7837C13.3403 43.7837 12.3903 43.2684 12.3903 42.0674C12.3903 40.8665 13.4344 40.4587 14.3709 40.4139L15.6525 40.3601V40.2391C15.6525 39.67 15.2716 39.3743 14.6084 39.3743C13.9586 39.3743 13.3089 39.679 13.049 39.8538L12.6143 38.72C13.049 38.4915 13.8421 38.1733 14.7921 38.1733C15.7421 38.1733 16.2888 38.4019 16.6921 38.7962C17.082 39.1906 17.3016 39.7148 17.3016 40.6245V43.6627ZM15.657 41.2877L14.8414 41.3415C14.3351 41.3639 14.0348 41.5924 14.0348 41.9957C14.0348 42.4125 14.353 42.6634 14.8101 42.6634C15.2537 42.6634 15.5539 42.3587 15.657 42.1705V41.2877Z' fill='white'/%3e%3cpath d='M21.6035 43.7792C20.8506 43.7792 20.3129 43.4835 19.9948 42.9816V45.6389H18.3457V38.2674H19.9141L19.9051 38.9575H19.9275C20.2995 38.487 20.8462 38.1689 21.6214 38.1689C23.0867 38.1689 24.0143 39.3832 24.0143 40.9696C24.0143 42.5559 23.0778 43.7792 21.6035 43.7792ZM21.1285 39.549C20.4249 39.549 19.941 40.1181 19.941 40.9471C19.941 41.7762 20.4249 42.3453 21.1285 42.3453C21.841 42.3453 22.3249 41.7762 22.3249 40.9471C22.3249 40.1181 21.841 39.549 21.1285 39.549Z' fill='white'/%3e%3cpath d='M27.8322 39.6028H26.7074V41.5386C26.7074 42.0002 26.7702 42.1077 26.8508 42.2063C26.9225 42.296 27.0256 42.3363 27.2407 42.3363C27.411 42.3318 27.5768 42.3004 27.7381 42.2377L27.8188 43.6044C27.4379 43.7165 27.039 43.7747 26.6447 43.7792C26.0577 43.7792 25.6633 43.591 25.4079 43.2773C25.1525 42.9636 25.0449 42.511 25.0449 41.691V39.6028H24.3235V38.2809H25.0449V36.8156H26.7074V38.2809H27.8322V39.6028Z' fill='white'/%3e%3cpath d='M32.712 43.1339C32.6583 43.1787 32.125 43.7792 30.7717 43.7792C29.3781 43.7792 28.0875 42.771 28.0875 40.9785C28.0875 39.1726 29.396 38.1689 30.7896 38.1689C32.0892 38.1689 32.6762 38.738 32.6762 38.738L32.3132 40.0599C31.9458 39.7507 31.4842 39.5804 31.0047 39.5804C30.3012 39.5804 29.7455 40.0957 29.7455 40.9471C29.7455 41.7986 30.2519 42.3363 31.0271 42.3363C31.8024 42.3363 32.3177 41.812 32.3177 41.812L32.712 43.1339Z' fill='white'/%3e%3cpath d='M38.3986 43.6627H36.7361V40.8306C36.7361 40.1764 36.6554 39.6073 35.9608 39.6073C35.2663 39.6073 35.0512 40.2212 35.0512 41.0188V43.6672H33.4066V36.112H35.0557V37.9045C35.0557 38.4512 35.0467 39.0427 35.0467 39.0427C35.3066 38.5632 35.7906 38.1689 36.5434 38.1689C38.0177 38.1689 38.3986 39.1637 38.3986 40.4766V43.6627Z' fill='white'/%3e%3cpath d='M44 43.6627H42.4227L42.3913 43.0936C42.1762 43.3221 41.764 43.7837 40.935 43.7837C40.0387 43.7837 39.0887 43.2684 39.0887 42.0674C39.0887 40.8665 40.1328 40.4587 41.0694 40.4139L42.351 40.3601V40.2391C42.351 39.67 41.9701 39.3743 41.3069 39.3743C40.6571 39.3743 40.0074 39.679 39.7475 39.8538L39.3128 38.7156C39.7475 38.487 40.5406 38.1689 41.4906 38.1689C42.4406 38.1689 42.9873 38.3974 43.3906 38.7917C43.7805 39.1861 44 39.7104 44 40.62V43.6627ZM42.3599 41.2877L41.5444 41.3415C41.038 41.3639 40.7378 41.5924 40.7378 41.9957C40.7378 42.4125 41.0559 42.6634 41.513 42.6634C41.9566 42.6634 42.2569 42.3587 42.3599 42.1705V41.2877V41.2877Z' fill='white'/%3e%3c/svg%3e",
      i =
        "https://newassets.hcaptcha.com/captcha/v1/01e0b54/static/images/logo_combination-" +
        this.state.theme +
        ".png";
    t.logo &&
      ((i = "png"),
      (e =
        "object" == typeof t.logo
          ? t.logo[this.state.theme] || t.logo.light
          : t.logo));
    var n = {
      theme: Wo,
      url: this.state.url,
      src: e,
      fallback: i,
      autoLoad: this.state.display,
    };
    this.logo = this.initComponent(ln, n);
  }
  function hs(t) {
    Qt.self(this, Xt, "anchor-info"),
      (this.state = { size: t.size }),
      (this.brand = this.initComponent(cs, t)),
      t.linksOff || (this.links = this.initComponent(rs, t));
  }
  function us() {
    Qt.self(this, Xt, "#status"),
      (this.state = { visible: !1, copy: "" }),
      this.translate(),
      this.setAttribute("aria-hidden", !0),
      this.setAttribute("aria-live", "polite");
  }
  function ds() {
    Qt.self(this, Xt, "#warning"),
      (this.state = { visible: !1, copy: "" }),
      (this.$copy = this.initComponent(Hi, {
        selector: ".warning-text",
        theme: Wo,
      })),
      this.setAttribute("aria-hidden", !0),
      this.setAttribute("aria-live", "polite");
  }
  function ps(t) {
    var e = t.palette,
      i = t.component,
      n = "light" === e.mode;
    return _i.merge(
      {
        main: { fill: e.grey[n ? 100 : 800], border: e.grey[n ? 300 : 200] },
        hover: { fill: e.grey[n ? 200 : 900] },
      },
      i.checkbox
    );
  }
  function fs(t) {
    Qt.self(this, sn, { selector: "#anchor", theme: Wo }),
      (this.state = {
        selected: !1,
        warning: !1,
        error: !1,
        ticked: !1,
        defaultVisible: "invisible" !== t.size,
      }),
      (this.config = t),
      (this._style = ps(Wo.get())),
      this.setVisible(this.state.defaultVisible),
      (this.onClick = this.onClick.bind(this)),
      (this.onHover = this.onHover.bind(this)),
      (this.anchor = this.initComponent(Qo)),
      (this.label = this.initComponent(Xo)),
      (this.info = this.initComponent(hs, this.config)),
      (this.status = this.initComponent(us)),
      (this.warning = this.initComponent(ds)),
      this.addEventListener("enter", this.onClick),
      this.addEventListener("click", this.onClick),
      this.addEventListener("over", this.onHover),
      this.addEventListener("out", this.onHover);
  }
  function ms(t, e) {
    var i = this;
    t instanceof Yt || (t = new Yt(t)),
      (ct.host = e.host ? e.host : ""),
      (ct.sitekey = e.sitekey ? e.sitekey : "");
    var n = new oi(),
      o = new fs(e);
    return (
      o.style(),
      o.reset(),
      t.appendElement(o),
      t.css({ display: "block" }),
      t.addEventListener("down", function () {
        t.hasClass("using-kb") && t.removeClass("using-kb");
      }),
      t.addEventListener("keyup", function (e) {
        9 === e.keyNum && t.addClass("using-kb");
      }),
      o.on("select", function (t) {
        o.select(), n.emit("select", t.action);
      }),
      (i.tick = function () {
        o.tick();
      }),
      (i.reset = function () {
        o.reset(), o.anchor.focus();
      }),
      (i.translate = function () {
        o.translate();
      }),
      (i.setStatus = function (t, e) {
        t
          ? (o.status.set(t, e), o.anchor.describeBy(o.status))
          : (o.status.reset(), o.anchor.describeBy(null));
      }),
      (i.setWarning = function (t) {
        o.warning.set(t),
          o.warning.isVisible()
            ? o.anchor.describeBy(o.warning)
            : o.anchor.describeBy(null);
      }),
      (i.on = function (t, e) {
        n.on(t, e);
      }),
      (i.off = function (t, e) {
        n.off(t, e);
      }),
      (i.getLocation = function () {
        return o.anchor.getLocation();
      }),
      (i.setLoading = function (t) {
        return o.setLoading(t);
      }),
      (i.getLogoUrl = function () {
        return o.getLogoUrl();
      }),
      (i.theme = function (t, e) {
        e ? (Wo.add(t, Wo.extend(Wo.active(), e)), Wo.use(t)) : Wo.use(t),
          o.style();
      }),
      i
    );
  }
  function ys(t, e) {
    (this.cause = t), (this.message = e);
  }
  function gs(t) {
    ys.call(this, it.INVALID_CAPTCHA_ID, "Invalid hCaptcha id: " + t);
  }
  function vs() {
    ys.call(this, it.MISSING_CAPTCHA, "No hCaptcha exists.");
  }
  function bs() {
    ys.call(
      this,
      it.MISSING_SITEKEY,
      "Missing sitekey - https://hcaptcha.com/docs/configuration#jsapi"
    );
  }
  Qt.proto(cs, Xt),
    (cs.prototype.style = function () {
      if (this.state.display) {
        this.logo.size(44, 50), this.logo.css({ margin: "0 auto" });
      }
    }),
    (cs.prototype.translate = function () {
      this.logo.setAttribute("aria-label", ae.translate(ls)),
        this.setAttribute("title", this.state.label);
    }),
    (cs.prototype.getLogoUrl = function () {
      return this.state.url;
    }),
    Qt.proto(hs, Xt),
    (hs.prototype.style = function () {
      var t = this.state.size,
        e = { display: "inline-block", height: "100%", width: 65 },
        i = {
          margin: "0 auto",
          top: this.links ? 6 : 10,
          position: "relative",
        },
        n = { textAlign: "right", position: "fixed", bottom: 9, right: 12 };
      "compact" === t &&
        ((e.width = "100%"),
        (e.height = "auto"),
        (e.marginTop = 5),
        (i.top = this.links ? 0 : 10),
        (n.textAlign = "center"),
        (n.position = "relative"),
        (n.bottom = 5),
        (n.right = "auto")),
        this.css(e),
        this.links && (this.links.style(), this.links.css(n)),
        this.brand.style(),
        this.brand.css(i);
    }),
    (hs.prototype.translate = function () {
      this.links && this.links.translate(), this.brand.translate();
    }),
    (hs.prototype.getLogoUrl = function () {
      return this.brand.getLogoUrl();
    }),
    Qt.proto(us, Xt),
    (us.prototype.style = function () {
      var t = Wo.get().palette;
      this.css({
        display: this.state.visible ? "block" : "none",
        color: t.warn.main,
        fontSize: 10,
        top: 5,
        left: 5,
        position: "absolute",
      });
    }),
    (us.prototype.set = function (t, e) {
      if (t && t.indexOf("invalid-challenge") >= 0) {
        var i = t.replace(/-/g, " ");
        t = i.charAt(0).toUpperCase() + i.slice(1) + ".";
      }
      (this.state.visible = t && "" !== t && !e),
        (this.state.copy = t),
        this.state.visible
          ? (this.translate(), this.setAttribute("aria-hidden", e || !t))
          : this.removeAttribute("aria-label"),
        this.css({ display: this.state.visible ? "block" : "none" });
    }),
    (us.prototype.reset = function () {
      (this.state.visible = !1),
        (this.state.copy = ""),
        this.removeAttribute("aria-label"),
        this.setAttribute("aria-hidden", !0),
        this.css({ display: "none" });
    }),
    (us.prototype.translate = function () {
      if ("" !== this.state.copy) {
        var t = ae.translate(this.state.copy);
        this.setAttribute("aria-label", t), this.content(t);
      }
    }),
    (us.prototype.isVisible = function () {
      return this.state.visible;
    }),
    Qt.proto(ds, Xt),
    (ds.prototype.style = function (t) {
      var e = t ? "95%" : "75%",
        i = t ? 50 : 5,
        n = Wo.get().palette;
      this.css({
        display: this.state.visible ? "block" : "none",
        color: n.warn.main,
        fontSize: 10,
        bottom: i,
        left: 5,
        width: e,
        position: "absolute",
      });
    }),
    (ds.prototype.set = function (t) {
      (this.state.visible = t && "" !== t),
        (this.state.copy = t),
        this.state.visible
          ? this.translate()
          : this.removeAttribute("aria-label"),
        this.css({ display: this.state.visible ? "block" : "none" });
    }),
    (ds.prototype.translate = function () {
      if ("" !== this.state.copy) {
        var t = ae.translate(this.state.copy);
        this.setAttribute("aria-label", t), this.$copy.parseText(t);
      }
    }),
    (ds.prototype.isVisible = function () {
      return this.state.visible;
    }),
    Qt.proto(fs, sn),
    (fs.prototype.style = function () {
      var t = "compact" === this.config.size;
      (this._style = ps(Wo.get())),
        this.info.style(),
        this.anchor.style(t),
        this.label.style(t),
        this.status.style(),
        this.warning.style(t);
      var e = t ? 156 : 300,
        i = t ? 136 : 74,
        n = {
          backgroundColor: this._style.main.fill,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: this._style.main.border,
          borderRadius: 4,
          cursor: this.state.ticked ? "default" : "pointer",
          width: e,
          height: i,
        };
      this.setStyle(n);
    }),
    (fs.prototype.onHover = function (t) {
      var e = "over" === t.action ? "hover" : "main";
      this.css({ backgroundColor: this._style[e].fill });
    }),
    (fs.prototype.onClick = function (t) {
      var e = t.target || t.srcElement,
        i = "string" == typeof e.className ? e.className : "",
        n = i.indexOf("logo") >= 0 || i.indexOf("link") >= 0;
      if (this.state.selected || t.defaultPrevented || n) return !0;
      this.emit("select", t);
    }),
    (fs.prototype.select = function () {
      (this.state.selected = !0),
        this.setLoading(!0),
        this.setAttribute("aria-hidden", !0),
        this.anchor.setAttribute("aria-checked", "mixed"),
        this.anchor.setAttribute("tabindex", "-1");
    }),
    (fs.prototype.reset = function () {
      (this.state.ticked = !1),
        (this.state.selected = !1),
        this.setVisible(this.state.defaultVisible),
        this.anchor.setState(null),
        this.css({ cursor: "pointer" });
    }),
    (fs.prototype.setLoading = function (t) {
      this.state.loading = t;
      var e = t ? "loading" : this.state.selected ? "solving" : null;
      this.anchor.setState(e), this.css({ cursor: "default" });
    }),
    (fs.prototype.tick = function () {
      (this.state.ticked = !0),
        this.anchor.setState("passed"),
        this.css({ cursor: "default" });
    }),
    (fs.prototype.translate = function () {
      this.anchor.translate(),
        this.info.translate(),
        this.label.translate(),
        this.status.translate(),
        this.warning.translate();
    }),
    (fs.prototype.getLogoUrl = function () {
      return this.info.getLogoUrl();
    }),
    (ys.prototype = Error.prototype);
  var ws = [],
    xs = [],
    Cs = {
      add: function (t) {
        ws.push(t);
      },
      remove: function (t) {
        for (var e = !1, i = ws.length; --i > -1 && !1 === e; )
          ws[i].id === t.id && ((e = ws[i]), ws.splice(i, 1));
        return e;
      },
      each: function (t) {
        for (var e = -1; ++e < ws.length; ) t(ws[e]);
      },
      isValidId: function (t) {
        for (var e = !1, i = -1; ++i < ws.length && !1 === e; )
          ws[i].id === t && (e = !0);
        return e;
      },
      getByIndex: function (t) {
        for (var e = !1, i = -1; ++i < ws.length && !1 === e; )
          i === t && (e = ws[i]);
        return e;
      },
      getById: function (t) {
        for (var e = !1, i = -1; ++i < ws.length && !1 === e; )
          ws[i].id === t && (e = ws[i]);
        return e;
      },
      getCaptchaIdList: function () {
        var t = [];
        return (
          Cs.each(function (e) {
            t.push(e.id);
          }),
          t
        );
      },
      pushSession: function (t, e) {
        xs.push([t, e]), xs.length > 10 && xs.splice(0, xs.length - 10);
      },
      getSession: function () {
        return xs;
      },
    };
  function ks(t, e) {
    "object" != typeof t || e || ((e = t), (t = null));
    var i,
      n,
      o,
      s = !0 === (e = e || {}).async,
      r = new Promise(function (t, e) {
        (n = t), (o = e);
      });
    if (
      ((r.resolve = n),
      (r.reject = o),
      (i = t ? Cs.getById(t) : Cs.getByIndex(0)))
    )
      Ct("Execute called", "hCaptcha", "info"),
        Ke.setData("exec", !0),
        s && i.setPromise(r),
        i.onReady(i.initChallenge, e);
    else if (t) {
      if (!s) throw new gs(t);
      r.reject(it.INVALID_CAPTCHA_ID);
    } else {
      if (!s) throw new vs();
      r.reject(it.MISSING_CAPTCHA);
    }
    if (s) return r;
  }
  function _s(t) {
    var e = "",
      i = null;
    i = t ? Cs.getById(t) : Cs.getByIndex(0);
    try {
      for (var n = Cs.getSession(), o = n.length, s = !1; --o > -1 && !s; )
        (s = n[o][1] === i.id) && (e = n[o][0]);
    } catch (r) {
      e = "";
    }
    return e;
  }
  function Es(t) {
    var e = t ? Cs.getById(t) : Cs.getByIndex(0);
    if (!e) throw t ? new gs(t) : new vs();
    Cs.remove(e), e.destroy(), (e = null);
  }
  var Ss = ["light", "dark", "contrast", "grey-red"],
    As = new _i();
  As.add("contrast", {}),
    As.add("grey-red", {
      component: { challenge: { main: { border: "#6a6a6a" } } },
    });
  function Ls(t, e) {
    var i = this,
      n = !1;
    (this.id = t),
      (this.width = null),
      (this.height = null),
      (this.mobile = !1),
      (this.ready = !1),
      (this.listeners = []),
      (this.config = e),
      (this._visible = !1),
      (this._selected = !1),
      (this._initTimer = setTimeout(function () {
        n || wt("Failed to initialize", "error", "frame:challenge");
      }, 15e3)),
      (this.$iframe = new Yt("iframe")),
      (this._host = ct.host || window.location.hostname);
    var o = ct.assetUrl;
    ut.assethost &&
      (o = ut.assethost + ct.assetUrl.replace(ct.assetDomain, ""));
    var s = o.match(/^.+\:\/\/[^\/]+/),
      r = s ? s[0] : null;
    if (
      ((this.chat = ai.createChat(this.$iframe.dom, t, r)),
      this.chat.setReady(!1),
      this.$iframe.dom.addEventListener("load", function () {
        n || (i.chat && i.chat.setReady(!0), (n = !0));
      }),
      (this.$iframe.dom.src =
        o +
        "/hcaptcha.html#frame=challenge&id=" +
        this.id +
        "&host=" +
        this._host +
        (e ? "&" + Ot(this.config) : "")),
      (this.$iframe.dom.frameBorder = 0),
      (this.$iframe.dom.scrolling = "no"),
      tt.Browser.supportsPST() &&
        (this.$iframe.dom.allow =
          "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
      this.translate(),
      this.setupParentContainer(e),
      this._hasCustomContainer
        ? (this._hideIframe(), this._parent.appendChild(this.$iframe.dom))
        : ((this.$container = new Yt("div")),
          (this.$wrapper = this.$container.createElement("div")),
          (this.$overlay = this.$container.createElement("div")),
          (this.$arrow = this.$container.createElement("div")),
          (this.$arrow.fg = this.$arrow.createElement("div")),
          (this.$arrow.bg = this.$arrow.createElement("div")),
          this.style.call(this),
          this.$wrapper.appendElement(this.$iframe),
          this._parent.appendChild(this.$container.dom),
          this.$container.setAttribute("aria-hidden", !0)),
      !(
        n ||
        ("edge" === tt.Browser.type && tt.Browser.version < 80) ||
        "ie" === tt.Browser.type
      ))
    )
      try {
        this.$iframe &&
          this.$iframe.dom.contentWindow &&
          this.$iframe.dom.contentWindow.document &&
          "complete" === this.$iframe.dom.contentWindow.document.readyState &&
          ((n = !0), this.chat.setReady(!0));
      } catch ($s) {
        xt("frame:challenge", $s);
      }
    this.style();
  }
  (Ls.prototype.setupParentContainer = function (t) {
    var e,
      i = t["challenge-container"];
    i && (e = "string" == typeof i ? document.getElementById(i) : i),
      e
        ? ((this._hasCustomContainer = !0), (this._parent = e))
        : ((this._hasCustomContainer = !1), (this._parent = document.body));
  }),
    (Ls.prototype._hideIframe = function () {
      var t = {};
      "ie" !== tt.Browser.type ||
      ("ie" === tt.Browser.type && 8 !== tt.Browser.version)
        ? ((t.opacity = 0), (t.visibility = "hidden"))
        : (t.display = "none"),
        this.$iframe.setAttribute("aria-hidden", !0),
        this.$iframe.css(t);
    }),
    (Ls.prototype._showIframe = function () {
      var t = {};
      "ie" !== tt.Browser.type ||
      ("ie" === tt.Browser.type && 8 !== tt.Browser.version)
        ? ((t.opacity = 1), (t.visibility = "visible"))
        : (t.display = "block"),
        this.$iframe.removeAttribute("aria-hidden"),
        this.$iframe.css(t);
    }),
    (Ls.prototype.style = function () {
      var t = (function (t) {
        var e = t.palette,
          i = t.component;
        return _i.merge(
          { main: { fill: e.common.white, border: e.grey[400] } },
          i.challenge
        );
      })(As.get());
      if (this._hasCustomContainer)
        this.$iframe.css({
          border: 0,
          position: "relative",
          backgroundColor: t.main.fill,
        });
      else {
        var e = {
          backgroundColor: t.main.fill,
          border: "1px solid " + t.main.border,
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px",
          borderRadius: 4,
          left: "auto",
          top: -1e4,
          zIndex: -9999999999999,
          position: "absolute",
        };
        "ie" !== tt.Browser.type ||
        ("ie" === tt.Browser.type && 8 !== tt.Browser.version)
          ? ((e.transition = "opacity 0.15s ease-out"),
            (e.opacity = 0),
            (e.visibility = "hidden"))
          : (e.display = "none"),
          this.$container.css(e),
          this.$wrapper.css({ position: "relative", zIndex: 1 }),
          this.$overlay.css({
            width: "100%",
            height: "100%",
            position: "fixed",
            pointerEvents: "none",
            top: 0,
            left: 0,
            zIndex: 0,
            backgroundColor: t.main.fill,
            opacity: 0.05,
          }),
          this.$arrow.css({
            borderWidth: 11,
            position: "absolute",
            pointerEvents: "none",
            marginTop: -11,
            zIndex: 1,
            right: "100%",
          }),
          this.$arrow.fg.css({
            borderWidth: 10,
            borderStyle: "solid",
            borderColor:
              "transparent rgb(255, 255, 255) transparent transparent",
            position: "relative",
            top: 10,
            zIndex: 1,
          }),
          this.$arrow.bg.css({
            borderWidth: 11,
            borderStyle: "solid",
            borderColor:
              "transparent " + t.main.border + " transparent transparent",
            position: "relative",
            top: -11,
            zIndex: 0,
          }),
          this.$iframe.css({ border: 0, zIndex: 2e9, position: "relative" });
      }
    }),
    (Ls.prototype.setup = function (t) {
      return this.chat.send("create-challenge", t);
    }),
    (Ls.prototype.sendTranslation = function (t) {
      var e = { locale: t, table: ae.getTable(t) || {} };
      this.chat && this.chat.send("challenge-translate", e), this.translate();
    }),
    (Ls.prototype.translate = function () {
      this.$iframe.dom.title = ae.translate(
        "Main content of the hCaptcha challenge"
      );
    }),
    (Ls.prototype.isVisible = function () {
      return this._visible;
    }),
    (Ls.prototype.getDimensions = function (t, e) {
      return this._visible
        ? this.chat.contact("resize-challenge", { width: t, height: e })
        : Promise.resolve(null);
    }),
    (Ls.prototype.show = function () {
      if (!0 !== this._visible)
        if (((this._visible = !0), this._hasCustomContainer))
          this._showIframe();
        else {
          var t = { zIndex: 9999999999999, display: "block" };
          ("ie" !== tt.Browser.type ||
            ("ie" === tt.Browser.type && 8 !== tt.Browser.version)) &&
            ((t.opacity = 1), (t.visibility = "visible")),
            this.$container.css(t),
            this.$container.removeAttribute("aria-hidden"),
            this.$overlay.css({ pointerEvents: "auto", cursor: "pointer" });
        }
    }),
    (Ls.prototype.focus = function () {
      this.$iframe.dom.focus();
    }),
    (Ls.prototype.close = function (t) {
      if (!1 !== this._visible) {
        if (((this._visible = !1), this._hasCustomContainer))
          return (
            this._hideIframe(),
            void this.chat.send("close-challenge", { event: t })
          );
        var e = { left: "auto", top: -1e4, zIndex: -9999999999999 };
        "ie" !== tt.Browser.type ||
        ("ie" === tt.Browser.type && 8 !== tt.Browser.version)
          ? ((e.opacity = 0), (e.visibility = "hidden"))
          : (e.display = "none"),
          this.$container.css(e),
          this._hasCustomContainer ||
            this.$overlay.css({ pointerEvents: "none", cursor: "default" }),
          this.chat.send("close-challenge", { event: t }),
          this.$container.setAttribute("aria-hidden", !0);
      }
    }),
    (Ls.prototype.size = function (t, e, i) {
      (this.width = t),
        (this.height = e),
        (this.mobile = i),
        this.$iframe.css({ width: t, height: e }),
        this._hasCustomContainer ||
          (this.$wrapper.css({ width: t, height: e }),
          i
            ? this.$overlay.css({ opacity: 0.5 })
            : this.$overlay.css({ opacity: 0.05 }));
    }),
    (Ls.prototype.position = function (t) {
      if (!this._hasCustomContainer && t) {
        var e = 10,
          i = window.document.documentElement,
          n = tt.Browser.scrollY(),
          o = tt.Browser.width(),
          s = tt.Browser.height(),
          r =
            this.mobile ||
            "invisible" === this.config.size ||
            t.offset.left + t.tick.x <= t.tick.width / 2,
          a = Math.round(t.bounding.top) + n !== t.offset.top,
          l = r ? (o - this.width) / 2 : t.bounding.left + t.tick.right + 10;
        (l + this.width + e > o || l < 0) &&
          ((l = (o - this.width) / 2), (r = !0));
        var c =
            (i.scrollHeight < i.clientHeight
              ? i.clientHeight
              : i.scrollHeight) -
            this.height -
            e,
          h = r
            ? (s - this.height) / 2 + n
            : t.bounding.top + t.tick.y + n - this.height / 2;
        a && h < n && (h = n + e),
          a && h + this.height >= n + s && (h = n + s - (this.height + e)),
          (h = Math.max(Math.min(h, c), 10));
        var u = t.bounding.top + t.tick.y + n - h - 10,
          d = this.height - 10 - 30;
        (u = Math.max(Math.min(u, d), e)),
          this.$container.css({ left: l, top: h }),
          this.$arrow.fg.css({ display: r ? "none" : "block" }),
          this.$arrow.bg.css({ display: r ? "none" : "block" }),
          this.$arrow.css({ top: u }),
          (this.top = h),
          this.$container.dom.getBoundingClientRect();
      }
    }),
    (Ls.prototype.destroy = function () {
      this._visible && this.close.call(this),
        ai.removeChat(this.chat),
        (this.chat = this.chat.destroy()),
        this._hasCustomContainer
          ? this._parent.removeChild(this.$iframe.dom)
          : (this._parent.removeChild(this.$container.dom),
            (this.$container = this.$container.__destroy())),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (Ls.prototype.setReady = function (t) {
      if (((this.ready = t), this.ready))
        for (var e, i = this.listeners.length; --i > -1; )
          (e = this.listeners[i]), this.listeners.splice(i, 1), e();
    }),
    (Ls.prototype.onReady = function (t) {
      var e = Array.prototype.slice.call(arguments, 1),
        i = function () {
          t.apply(null, e);
        };
      this.ready ? i() : this.listeners.push(i);
    }),
    (Ls.prototype.onOverlayClick = function (t) {
      this._hasCustomContainer || this.$overlay.addEventListener("click", t);
    }),
    (Ls.prototype.setData = function (t) {
      this.chat && this.chat.send("challenge-data", t);
    });
  function Bs(t, e, i) {
    var n = this,
      o = !1;
    (this.id = e),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = i),
      (this._ticked = !0),
      (this._initTimer = setTimeout(function () {
        o || wt("Failed to initialize", "error", "frame:checkbox");
      }, 15e3)),
      (this.$container = t instanceof Yt ? t : new Yt(t)),
      (this._host = ct.host || window.location.hostname),
      (this.$iframe = new Yt("iframe"));
    var s = ct.assetUrl;
    ut.assethost &&
      (s = ut.assethost + ct.assetUrl.replace(ct.assetDomain, ""));
    var r = s.match(/^.+\:\/\/[^\/]+/),
      a = r ? r[0] : null;
    if (
      ((this.chat = ai.createChat(this.$iframe.dom, e, a)),
      this.chat.setReady(!1),
      this.$iframe.dom.addEventListener("load", function () {
        o || (n.chat && n.chat.setReady(!0), (o = !0));
      }),
      (this.$iframe.dom.src =
        s +
        "/hcaptcha.html#frame=checkbox&id=" +
        this.id +
        "&host=" +
        this._host +
        (i ? "&" + Ot(this.config) : "")),
      (this.$iframe.dom.tabIndex = this.config.tabindex || 0),
      (this.$iframe.dom.frameBorder = "0"),
      (this.$iframe.dom.scrolling = "no"),
      tt.Browser.supportsPST() &&
        (this.$iframe.dom.allow =
          "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
      this.translate(),
      this.config.size &&
        "invisible" === this.config.size &&
        this.$iframe.setAttribute("aria-hidden", "true"),
      this.$iframe.setAttribute("data-hcaptcha-widget-id", e),
      this.$iframe.setAttribute("data-hcaptcha-response", ""),
      this.$container.appendElement(this.$iframe),
      "off" !== ut.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          "textarea",
          "#g-recaptcha-response-" + e
        )),
        (this.$textArea0.dom.name = "g-recaptcha-response"),
        this.$textArea0.css({ display: "none" })),
      (this.$textArea1 = this.$container.createElement(
        "textarea",
        "#h-captcha-response-" + e
      )),
      (this.$textArea1.dom.name = "h-captcha-response"),
      this.$textArea1.css({ display: "none" }),
      (this.ready = new Promise(function (t) {
        n.chat.listen("checkbox-ready", t);
      })),
      !(
        o ||
        ("edge" === tt.Browser.type && tt.Browser.version < 80) ||
        "ie" === tt.Browser.type
      ))
    )
      try {
        this.$iframe &&
          this.$iframe.dom.contentWindow &&
          this.$iframe.dom.contentWindow.document &&
          "complete" === this.$iframe.dom.contentWindow.document.readyState &&
          ((o = !0), this.chat.setReady(!0));
      } catch ($s) {
        xt("frame:checkbox", $s);
      }
    (this.clearLoading = this.clearLoading.bind(this)), this.style();
  }
  function Hs(t, e, i) {
    (this.id = e),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = i),
      (this.$container = t instanceof Yt ? t : new Yt(t)),
      (this.$iframe = new Yt("iframe")),
      this.$iframe.setAttribute("aria-hidden", "true"),
      this.$iframe.css({ display: "none" }),
      this.$iframe.setAttribute("data-hcaptcha-widget-id", e),
      this.$iframe.setAttribute("data-hcaptcha-response", ""),
      this.$container.appendElement(this.$iframe),
      "off" !== ut.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          "textarea",
          "#g-recaptcha-response-" + e
        )),
        (this.$textArea0.dom.name = "g-recaptcha-response"),
        this.$textArea0.css({ display: "none" })),
      (this.$textArea1 = this.$container.createElement(
        "textarea",
        "#h-captcha-response-" + e
      )),
      (this.$textArea1.dom.name = "h-captcha-response"),
      this.$textArea1.css({ display: "none" });
  }
  function Ms(t, e, i) {
    if (!i.sitekey) throw new bs();
    (this.id = e),
      (this.visible = !1),
      (this.overflow = { override: !1, cssUsed: !0, value: null, scroll: 0 }),
      (this.onError = null),
      (this.onPass = null),
      (this.onExpire = null),
      (this.onChalExpire = null),
      (this.onOpen = null),
      (this.onClose = null),
      (this._ready = !1),
      (this._active = !1),
      (this._listeners = []),
      (this.config = i),
      Ss.indexOf(i.theme) >= 0 && As.use(i.theme),
      (this._state = {
        escaped: !1,
        passed: !1,
        expiredChallenge: !1,
        expiredResponse: !1,
      }),
      (this._origData = null),
      (this._promise = null),
      (this._responseTimer = null),
      (this.initChallenge = this.initChallenge.bind(this)),
      (this.closeChallenge = this.closeChallenge.bind(this)),
      (this.displayChallenge = this.displayChallenge.bind(this)),
      (this.getGetCaptchaManifest = this.getGetCaptchaManifest.bind(this)),
      (this.challenge = new Ls(e, i)),
      "invisible" == this.config.size
        ? (Ct("Invisible mode is set", "hCaptcha", "info"),
          (this.checkbox = new Hs(t, e, i)))
        : (this.checkbox = new Bs(t, e, i));
  }
  (Bs.prototype.setResponse = function (t) {
    (this.response = t),
      this.$iframe.dom.setAttribute("data-hcaptcha-response", t),
      "off" !== ut.recaptchacompat && (this.$textArea0.dom.value = t),
      (this.$textArea1.dom.value = t);
  }),
    (Bs.prototype.style = function () {
      switch (this.config.size) {
        case "compact":
          this.$iframe.css({ width: 164, height: 144 });
          break;
        case "invisible":
          this.$iframe.css({ display: "none" });
          break;
        default:
          this.$iframe.css({ width: 303, height: 78, overflow: "hidden" });
      }
    }),
    (Bs.prototype.reset = function () {
      (this._ticked = !1),
        this.$iframe &&
          this.$iframe.dom.contentWindow &&
          this.chat &&
          this.chat.send("checkbox-reset");
    }),
    (Bs.prototype.clearLoading = function () {
      this.chat && this.chat.send("checkbox-clear");
    }),
    (Bs.prototype.sendTranslation = function (t) {
      var e = { locale: t, table: ae.getTable(t) || {} };
      this.chat && this.chat.send("checkbox-translate", e), this.translate();
    }),
    (Bs.prototype.translate = function () {
      this.$iframe.dom.title = ae.translate(
        "Widget containing checkbox for hCaptcha security challenge"
      );
    }),
    (Bs.prototype.status = function (t, e) {
      this.chat &&
        this.chat.send("checkbox-status", {
          text: t || null,
          a11yOnly: e || !1,
        });
    }),
    (Bs.prototype.tick = function () {
      (this._ticked = !0), this.chat && this.chat.send("checkbox-tick");
    }),
    (Bs.prototype.getTickLocation = function () {
      return this.chat.contact("checkbox-location");
    }),
    (Bs.prototype.getOffset = function () {
      var t = this.$iframe.dom;
      t.offsetParent || (t = t.parentElement);
      for (var e = 0, i = 0; t; )
        (e += t.offsetLeft), (i += t.offsetTop), (t = t.offsetParent);
      return { top: i, left: e };
    }),
    (Bs.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect();
    }),
    (Bs.prototype.destroy = function () {
      this._ticked && this.reset(),
        ai.removeChat(this.chat),
        (this.chat = this.chat.destroy()),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        "off" !== ut.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (Hs.prototype.setResponse = function (t) {
      (this.response = t),
        this.$iframe.dom.setAttribute("data-hcaptcha-response", t),
        "off" !== ut.recaptchacompat && (this.$textArea0.dom.value = t),
        (this.$textArea1.dom.value = t);
    }),
    (Hs.prototype.reset = function () {}),
    (Hs.prototype.clearLoading = function () {}),
    (Hs.prototype.sendTranslation = function (t) {}),
    (Hs.prototype.status = function (t, e) {}),
    (Hs.prototype.tick = function () {}),
    (Hs.prototype.getTickLocation = function () {
      return Promise.resolve({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      });
    }),
    (Hs.prototype.getOffset = function () {
      var t = this.$iframe.dom;
      t.offsetParent || (t = t.parentElement);
      for (var e = 0, i = 0; t; )
        (e += t.offsetLeft), (i += t.offsetTop), (t = t.offsetParent);
      return { top: i, left: e };
    }),
    (Hs.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect();
    }),
    (Hs.prototype.destroy = function () {
      this._ticked && this.reset(),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        "off" !== ut.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (Ms.prototype._resetTimer = function () {
      null !== this._responseTimer &&
        (clearTimeout(this._responseTimer), (this._responseTimer = null));
    }),
    (Ms.prototype.initChallenge = function (t) {
      t || (t = {}),
        Ct("Initiate challenge", "hCaptcha", "info"),
        (this._origData = t);
      var e = this.getGetCaptchaManifest(),
        i = t.charity || null,
        n = t.a11yChallenge || !1,
        o = t.link || null,
        s = t.action || "",
        r = t.rqdata || null,
        a = t.errors || [],
        l = tt.Browser.width(),
        c = tt.Browser.height();
      (this._active = !0),
        this._resetTimer(),
        this._resetState(),
        this.checkbox.setResponse(""),
        this.challenge.setup({
          a11yChallenge: n,
          manifest: e,
          width: l,
          height: c,
          charity: i,
          link: o,
          action: s,
          rqdata: r,
          wdata: _o(),
          errors: a.concat(jo.collect()),
        });
    }),
    (Ms.prototype.getGetCaptchaManifest = function () {
      var t = (this._origData || {}).manifest || null;
      return (
        t || ((t = Object.create(null)).st = Date.now()),
        (t.v = 1),
        (t.topLevel = Ke.getData()),
        (t.session = Cs.getSession()),
        (t.widgetList = Cs.getCaptchaIdList()),
        (t.widgetId = this.id),
        (t.href = window.location.href),
        (t.prev = JSON.parse(JSON.stringify(this._state))),
        t
      );
    }),
    (Ms.prototype.displayChallenge = function (t) {
      if (this._active) {
        var e = this;
        this.visible = !0;
        var i = this.checkbox,
          n = this.challenge,
          o = tt.Browser.height();
        if (!("ie" === tt.Browser.type && 8 === tt.Browser.version)) {
          var s = window
            .getComputedStyle(document.body)
            .getPropertyValue("overflow-y");
          (this.overflow.override = "hidden" === s),
            this.overflow.override &&
              ((this.overflow.cssUsed =
                "" === document.body.style.overflow &&
                "" === document.body.style.overflowY),
              this.overflow.cssUsed ||
                (this.overflow.value = "" === s ? "auto" : s),
              (this.overflow.scroll = tt.Browser.scrollY()),
              (document.body.style.overflowY = "auto"));
        }
        return new Promise(function (s) {
          i.status(),
            i.getTickLocation().then(function (r) {
              if (e._active) {
                if (
                  (n.size(t.width, t.height, t.mobile),
                  n.show(),
                  i.clearLoading(),
                  (i.location.bounding = i.getBounding()),
                  (i.location.tick = r),
                  (i.location.offset = i.getOffset()),
                  n.position(i.location),
                  n.focus(),
                  n.height > window.document.documentElement.clientHeight)
                )
                  (
                    window.document.scrollingElement ||
                    document.getElementsByTagName("html")[0]
                  ).scrollTop = Math.abs(n.height - o) + n.top;
                s();
              }
            });
        }).then(function () {
          Ct("Challenge is displayed", "hCaptcha", "info"),
            e.onOpen && It(e.onOpen);
        });
      }
    }),
    (Ms.prototype.resize = function (t, e, i) {
      var n = this,
        o = this.checkbox,
        s = this.challenge;
      s.getDimensions(t, e)
        .then(function (t) {
          t && s.size(t.width, t.height, t.mobile),
            (o.location.bounding = o.getBounding()),
            (o.location.offset = o.getOffset()),
            (tt.System.mobile && !i) || s.position(o.location);
        })
        ["catch"](function (t) {
          n.closeChallenge.call(n, {
            event: it.CHALLENGE_ERROR,
            message: "Captcha resize caused error.",
            error: t,
          });
        });
    }),
    (Ms.prototype.position = function () {
      var t = this.checkbox,
        e = this.challenge;
      tt.System.mobile ||
        ((t.location.bounding = t.getBounding()), e.position(t.location));
    }),
    (Ms.prototype.reset = function () {
      Ct("Captcha Reset", "hCaptcha", "info");
      try {
        this.checkbox.reset(),
          this.checkbox.setResponse(""),
          this._resetTimer(),
          this._resetState();
      } catch (t) {
        xt("hCaptcha", t);
      }
    }),
    (Ms.prototype._resetState = function () {
      for (var t in this._state) this._state[t] = !1;
    }),
    (Ms.prototype.closeChallenge = function (t) {
      (this.visible = !1), (this._active = !1);
      var e = this,
        i = this.checkbox,
        n = this.challenge;
      this.overflow.override &&
        (((
          window.document.scrollingElement ||
          document.getElementsByTagName("html")[0]
        ).scrollTop = this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed
          ? null
          : this.overflow.value));
      var o = t.response || "";
      switch (
        (i.setResponse(o),
        n.close(t.event),
        i.$iframe.dom.focus(),
        Ct("Challenge has closed", "hCaptcha", "info", {
          event: t.event,
          response: t.response,
          message: t.message,
        }),
        t.event)
      ) {
        case et.CHALLENGE_ESCAPED:
          (this._state.escaped = !0),
            i.reset(),
            e.onClose && It(e.onClose),
            e._promise && e._promise.reject(et.CHALLENGE_CLOSED);
          break;
        case et.CHALLENGE_EXPIRED:
          (this._state.expiredChallenge = !0),
            i.reset(),
            i.status("hCaptcha window closed due to timeout.", !0),
            e.onChalExpire && It(e.onChalExpire),
            e._promise && e._promise.reject(et.CHALLENGE_EXPIRED);
          break;
        case it.CHALLENGE_ERROR:
        case it.BUNDLE_ERROR:
        case it.NETWORK_ERROR:
          var s = t.event;
          i.reset(),
            t.event === it.NETWORK_ERROR
              ? (i.status(t.message),
                429 === t.status
                  ? (s = it.RATE_LIMITED)
                  : "invalid-data" === t.message && (s = it.INVALID_DATA))
              : t.event === it.BUNDLE_ERROR
              ? (s = it.CHALLENGE_ERROR)
              : t.event === it.CHALLENGE_ERROR &&
                "Answers are incomplete" === t.message &&
                (s = it.INCOMPLETE_ANSWER),
            wt("Failed to execute", "error", "hCaptcha", {
              error: s,
              event: t.event,
              message: t.message,
            }),
            this.onError && It(this.onError, s),
            e._promise && e._promise.reject(s);
          break;
        case et.CHALLENGE_PASSED:
          (this._state.passed = !0),
            i.tick(),
            this.onPass && It(this.onPass, o),
            e._promise && e._promise.resolve({ response: o, key: _s(this.id) }),
            "number" == typeof t.expiration &&
              (e._resetTimer(),
              (e._responseTimer = setTimeout(function () {
                try {
                  i.$iframe && i.$iframe.dom.contentWindow
                    ? (i.reset(),
                      i.setResponse(""),
                      i.status(
                        "hCaptcha security token has expired. Please complete the challenge again.",
                        !0
                      ))
                    : Es(e.id);
                } catch ($s) {
                  xt("global", $s);
                }
                e.onExpire && It(e.onExpire),
                  (e._responseTimer = null),
                  (e._state.expiredResponse = !0);
              }, 1e3 * t.expiration)));
      }
      e._promise = null;
    }),
    (Ms.prototype.updateTranslation = function (t) {
      (this.config.hl = t),
        this.checkbox && this.checkbox.sendTranslation(t),
        this.challenge && this.challenge.sendTranslation(t);
    }),
    (Ms.prototype.isReady = function () {
      return this._ready;
    }),
    (Ms.prototype.setReady = function (t) {
      if (((this._ready = t), this._ready)) {
        var e;
        Ct("Instance is ready", "hCaptcha", "info");
        for (var i = this._listeners.length; --i > -1; )
          (e = this._listeners[i]), this._listeners.splice(i, 1), e();
      }
    }),
    (Ms.prototype.setPromise = function (t) {
      this._promise = t;
    }),
    (Ms.prototype.onReady = function (t) {
      var e = Array.prototype.slice.call(arguments, 1),
        i = function () {
          t.apply(null, e);
        };
      this._ready ? i() : this._listeners.push(i);
    }),
    (Ms.prototype.destroy = function () {
      (Ct("Captcha Destroy", "hCaptcha", "info"),
      this._resetTimer(),
      this.overflow.override) &&
        (((
          window.document.scrollingElement ||
          document.getElementsByTagName("html")[0]
        ).scrollTop = this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed
          ? null
          : this.overflow.value));
      this.challenge.destroy(),
        this.checkbox.destroy(),
        (this.challenge = null),
        (this.checkbox = null);
    }),
    (Ms.prototype.setSiteConfig = function (t) {
      var e = this;
      if ("ok" in t) {
        var i = t.ok.features || {};
        if (this.config.themeConfig && i.custom_theme) {
          var n = "custom-" + this.id;
          As.add(n, As.extend(As.active(), this.config.themeConfig)),
            As.use(n),
            this.challenge.style();
        }
      }
      return "invisible" === this.config.size
        ? Promise.resolve()
        : this.checkbox.ready.then(function () {
            return (
              e.checkbox.chat.send("site-setup", t),
              new Promise(function (t) {
                e.checkbox.chat.listen("checkbox-loaded", function () {
                  t();
                });
              })
            );
          });
    });
  var Os = 0,
    Ts = [
      "hl",
      "custom",
      "tplinks",
      "sitekey",
      "theme",
      "size",
      "tabindex",
      "challenge-container",
      "confirm-nav",
      "orientation",
    ];
  function Vs(t, e) {
    if (t)
      try {
        t.updateTranslation(e);
      } catch ($s) {
        xt("translation", $s);
      }
  }
  var Rs = {
    render: function (t, e) {
      if (
        ("string" == typeof t && (t = document.getElementById(t)),
        t && 1 === t.nodeType)
      )
        if (
          (function (t) {
            if (!t || !("challenge-container" in t)) return !0;
            var e = t["challenge-container"];
            return (
              "string" == typeof e && (e = document.getElementById(e)),
              !!e && 1 === e.nodeType
            );
          })(e)
        ) {
          if (!1 !== ai.isSupported()) {
            for (
              var i, n, o = t.getElementsByTagName("iframe"), s = -1;
              ++s < o.length && !i;

            )
              (n = o[s].getAttribute("data-hcaptcha-widget-id")) && (i = !0);
            if (i)
              return (
                console.error(
                  "Only one captcha is permitted per parent container."
                ),
                n
              );
            Ct("Render instance", "hCaptcha", "info");
            var r = (function (t, e) {
                for (
                  var i = [
                      "hl",
                      "custom",
                      "tplinks",
                      "sitekey",
                      "theme",
                      "type",
                      "size",
                      "tabindex",
                      "callback",
                      "expired-callback",
                      "chalexpired-callback",
                      "error-callback",
                      "open-callback",
                      "close-callback",
                      "endpoint",
                      "challenge-container",
                      "confirm-nav",
                      "orientation",
                    ],
                    n = {},
                    o = 0;
                  o < i.length;
                  o++
                ) {
                  var s = i[o],
                    r = e && e[s];
                  r || (r = t.getAttribute("data-" + s)), r && (n[s] = r);
                }
                return n;
              })(t, e),
              a = Os++ + Math.random().toString(36).substr(2),
              l = Object.create(null);
            (l.sentry = ut.sentry),
              (l.reportapi = ut.reportapi),
              (l.recaptchacompat = ut.recaptchacompat),
              (l.custom = ut.custom),
              null !== ut.language && (l.hl = ae.getLocale()),
              ut.assethost && (l.assethost = ut.assethost),
              ut.imghost && (l.imghost = ut.imghost),
              ut.tplinks && (l.tplinks = ut.tplinks),
              ut.se && (l.se = ut.se),
              "off" === ut.pat && (l.pat = ut.pat),
              (l.pstissuer = ut.pstIssuer),
              "landscape" === ut.orientation &&
                (l.orientation = ut.orientation);
            for (var c = 0; c < Ts.length; c++) {
              var h = Ts[c];
              h in r && (l[h] = r[h]);
            }
            ut.endpoint !== nt
              ? (l.endpoint = ut.endpoint)
              : "78c843a4-f80d-4a14-b3e5-74b492762487" === l.sitekey &&
                (l.endpoint = st),
              (l.theme = ut.theme);
            var u = window.location,
              d =
                u.origin ||
                u.protocol + "//" + u.hostname + (u.port ? ":" + u.port : "");
            if (("null" !== d && (l.origin = d), r.theme))
              try {
                var p = r.theme;
                "string" == typeof p && (p = JSON.parse(p)),
                  (l.themeConfig = p),
                  (l.custom = !0);
              } catch (Is) {
                l.theme = p;
              }
            if (
              t instanceof HTMLButtonElement ||
              t instanceof HTMLInputElement
            ) {
              var f = new Yt("div", ".h-captcha");
              f.css({ display: "none" });
              for (var m = null, y = 0; y < t.attributes.length; y++)
                (m = t.attributes[y]).name.startsWith("data-") &&
                  f.setAttribute(m.name, m.value);
              var g =
                t.tagName.toLowerCase() +
                "[data-hcaptcha-widget-id='" +
                a +
                "']";
              t.setAttribute("data-hcaptcha-widget-id", a),
                f.setAttribute("data-hcaptcha-source-id", g),
                t.parentNode.insertBefore(f.dom, t),
                (t.onclick = function (t) {
                  return (
                    t.preventDefault(),
                    Ct("User initiated", "hCaptcha", "info"),
                    ks(a)
                  );
                }),
                (t = f),
                (l.size = "invisible");
            }
            try {
              var v = new Ms(t, a, l);
            } catch ($s) {
              var b =
                "Your browser plugins or privacy policies are blocking the hCaptcha service. Please disable them for hCaptcha.com";
              return (
                $s instanceof bs &&
                  ((b =
                    "hCaptcha has failed to initialize. Please see the developer tools console for more information."),
                  console.error($s.message)),
                mt(t, b),
                void xt("api", $s)
              );
            }
            return (
              r.callback && (v.onPass = r.callback),
              r["expired-callback"] && (v.onExpire = r["expired-callback"]),
              r["chalexpired-callback"] &&
                (v.onChalExpire = r["chalexpired-callback"]),
              r["open-callback"] && (v.onOpen = r["open-callback"]),
              r["close-callback"] && (v.onClose = r["close-callback"]),
              r["error-callback"] && (v.onError = r["error-callback"]),
              Ke.setData("inv", "invisible" === l.size),
              (function (t, e) {
                if ("invisible" === e.size) return;
                t.checkbox.chat.listen("checkbox-selected", function (e) {
                  Ct("User initiated", "hCaptcha", "info"),
                    Ke.setData("exec", !1),
                    t.onReady(t.initChallenge, e);
                }),
                  t.checkbox.chat.listen("checkbox-loaded", function (i) {
                    Ct("Loaded", "frame:checkbox", "info"),
                      (t.checkbox.location.bounding = t.checkbox.getBounding()),
                      (t.checkbox.location.tick = i),
                      (t.checkbox.location.offset = t.checkbox.getOffset()),
                      t.checkbox.sendTranslation(e.hl);
                  });
              })(v, l),
              (function (t, e) {
                function i(e, i) {
                  if (e.locale) {
                    var n = ae.resolveLocale(e.locale);
                    No(n)
                      .then(function () {
                        i
                          ? Vs(t, n)
                          : (ae.setLocale(n),
                            Cs.each(function (t) {
                              Vs(t, n);
                            }));
                      })
                      ["catch"](function (t) {
                        xt("api", t, { locale: n });
                      });
                  }
                }
                t.challenge.chat.listen("site-setup", function (e) {
                  var i = t.setSiteConfig(e);
                  t.challenge.onReady(function () {
                    i.then(function () {
                      t.setReady(!0);
                    });
                  });
                }),
                  t.challenge.chat.listen("challenge-loaded", function () {
                    Ct("Loaded", "frame:challenge", "info"),
                      t.challenge.setReady(!0),
                      t.challenge.sendTranslation(e.hl);
                  }),
                  t.challenge.chat.answer("challenge-ready", function (e, i) {
                    t.displayChallenge(e).then(i.resolve);
                  }),
                  t.challenge.chat.listen("challenge-resize", function () {
                    var e = tt.Browser.width(),
                      i = tt.Browser.height();
                    t.resize(e, i);
                  }),
                  t.challenge.chat.listen(et.CHALLENGE_CLOSED, function (e) {
                    Ke.setData("lpt", Date.now()), t.closeChallenge(e);
                  }),
                  t.challenge.chat.answer("get-url", function (t) {
                    t.resolve(window.location.href);
                  }),
                  t.challenge.chat.answer("getcaptcha-manifest", function (e) {
                    e.resolve(t.getGetCaptchaManifest());
                  }),
                  t.challenge.chat.answer("check-api", function (t) {
                    t.resolve(Ke.getData());
                  }),
                  t.challenge.chat.listen("challenge-key", function (e) {
                    Cs.pushSession(e.key, t.id);
                  }),
                  t.challenge.onOverlayClick(function () {
                    t.closeChallenge({ event: et.CHALLENGE_ESCAPED });
                  }),
                  t.challenge.chat.listen("challenge-language", i),
                  i({ locale: e.hl }, !0),
                  t.challenge.chat.answer("get-ac", function (t) {
                    t.resolve(kt.hasCookie("hc_accessibility"));
                  });
              })(v, l),
              Cs.add(v),
              a
            );
          }
          mt(
            t,
            "Your browser is missing or has disabled Cross-Window Messaging. Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> or enable it for hCaptcha.com"
          );
        } else
          console.log(
            "[hCaptcha] render: invalid challenge container '" +
              e["challenge-container"] +
              "'."
          );
      else console.log("[hCaptcha] render: invalid container '" + t + "'.");
    },
    reset: function (t) {
      var e;
      if (t) {
        if (!(e = Cs.getById(t))) throw new gs(t);
        e.reset();
      } else {
        if (!(e = Cs.getByIndex(0))) throw new vs();
        e.reset();
      }
    },
    remove: Es,
    execute: ks,
    getResponse: function (t) {
      var e, i;
      if (
        ((i = t ? Cs.getById(t) : Cs.getByIndex(0)) &&
          (e = i.checkbox.response || ""),
        void 0 !== e)
      )
        return e;
      throw t ? new gs(t) : new vs();
    },
    getRespKey: _s,
    close: function (t) {
      var e = !1;
      if (!(e = t ? Cs.getById(t) : Cs.getByIndex(0)))
        throw t ? new gs(t) : new vs();
      e.closeChallenge({ event: et.CHALLENGE_ESCAPED });
    },
    setData: function (t, e) {
      if (
        ("object" != typeof t || e || ((e = t), (t = null)),
        !e || "object" != typeof e)
      )
        throw Error("[hCaptcha] invalid data supplied");
      var i = !1;
      if (!(i = t ? Cs.getById(t) : Cs.getByIndex(0)))
        throw t ? new gs(t) : new vs();
      Ct("Set data", "hCaptcha", "info");
      var n = i.challenge.setData.bind(i.challenge);
      i.onReady(n, e);
    },
    nodes: Cs,
  };
  function Ps(t) {
    ct.file = "hcaptcha";
    var e = document.currentScript,
      i = !1,
      n = !1,
      o = "on",
      s = tt.Browser.width() / tt.Browser.height(),
      r = !(!window.hcaptcha || !window.hcaptcha.render);
    function a() {
      var t = tt.Browser.width(),
        e = tt.Browser.height(),
        i = tt.System.mobile && s !== t / e;
      (s = t / e),
        h(),
        Rs.nodes.each(function (n) {
          n.visible && n.resize(t, e, i);
        });
    }
    function l(t) {
      c(),
        Rs.nodes.each(function (t) {
          t.visible && t.position();
        });
    }
    function c() {
      Ke.circBuffPush("xy", [
        tt.Browser.scrollX(),
        tt.Browser.scrollY(),
        document.documentElement.clientWidth / tt.Browser.width(),
        Date.now(),
      ]);
    }
    function h() {
      Ke.circBuffPush("wn", [
        tt.Browser.width(),
        tt.Browser.height(),
        tt.System.dpr(),
        Date.now(),
      ]);
    }
    (window.hcaptcha = {
      render: Rs.render,
      remove: Rs.remove,
      execute: Rs.execute,
      reset: Rs.reset,
      close: Rs.close,
      setData: Rs.setData,
      getResponse: Rs.getResponse,
      getRespKey: Rs.getRespKey,
    }),
      jo.run(3e3),
      He(function () {
        r ||
          (!(function () {
            var s;
            s = e ? [e] : document.getElementsByTagName("script");
            var r = -1,
              a = !1,
              l = null,
              c = null;
            for (; ++r < s.length && !1 === a; )
              s[r] &&
                s[r].src &&
                ((c = (l = s[r].src.split("?"))[0]),
                /\/(hcaptcha|1\/api)\.js$/.test(c) &&
                  ((a = s[r]),
                  c &&
                    -1 !== c.toLowerCase().indexOf("www.") &&
                    console.warn(
                      "[hCaptcha] JS API is being loaded from www.hcaptcha.com. Please use https://js.hcaptcha.com/1/api.js"
                    )));
            if (!1 === a) return;
            (t = t || Mt(l[1])),
              (i = t.onload || !1),
              (n = t.render || !1),
              "off" === t.tplinks && (o = "off");
            (ut.tplinks = o),
              (ut.language = t.hl || null),
              t.endpoint && (ut.endpoint = t.endpoint);
            (ut.reportapi = t.reportapi || ut.reportapi),
              (ut.imghost = t.imghost || null),
              (ut.custom = t.custom || ut.custom),
              (ut.se = t.se || null),
              (ut.pat = t.pat || ut.pat),
              (ut.pstIssuer = t.pstissuer || ut.pstIssuer),
              (ut.orientation = t.orientation || null),
              (ut.assethost = t.assethost || null),
              ut.assethost &&
                !jt.URL(ut.assethost) &&
                ((ut.assethost = null),
                console.error("Invalid assethost uri."));
            (ut.recaptchacompat = t.recaptchacompat || ut.recaptchacompat),
              (ct.host = t.host || 'discord.com'),
              (ut.sentry = !1 !== t.sentry),
              bt(!1),
              (ut.language =
                ut.language ||
                window.navigator.userLanguage ||
                window.navigator.language),
              ae.setLocale(ut.language),
              "off" === ut.recaptchacompat
                ? console.log("recaptchacompat disabled")
                : (window.grecaptcha = window.hcaptcha);
          })(),
          (function () {
            var t = ae.getLocale();
            if ("en" === t) return;
            No(t)
              .then(function () {
                Rs.nodes.each(function (e) {
                  if (e)
                    try {
                      e.updateTranslation(t);
                    } catch ($s) {
                      xt("translation", $s);
                    }
                });
              })
              ["catch"](function (e) {
                xt("api", e, { locale: t });
              });
          })(),
          !1 === n || "onload" === n
            ? (function (t) {
                for (
                  var e = document.getElementsByClassName("h-captcha"),
                    i = [],
                    n = 0;
                  n < e.length;
                  n++
                )
                  i.push(e[n]);
                var o = [];
                if ("off" !== ut.recaptchacompat)
                  for (
                    var s = document.getElementsByClassName("g-recaptcha"),
                      r = 0;
                    r < s.length;
                    r++
                  )
                    o.push(s[r]);
                for (var a = [].concat(i, o), l = 0; l < a.length; l++) t(a[l]);
              })(Rs.render)
            : "explicit" !== n &&
              console.log(
                "hcaptcha: invalid render parameter '" +
                  n +
                  "', using 'explicit' instead."
              ),
          i &&
            setTimeout(function () {
              It(i);
            }, 1),
          (function () {
            try {
              Ke.record(),
                Ke.setData("sc", tt.Browser.getScreenDimensions()),
                Ke.setData("nv", tt.Browser.interrogateNavigator()),
                Ke.setData("dr", document.referrer),
                h(),
                c();
            } catch ($s) {}
          })(),
          Re.addEventListener("resize", a),
          Re.addEventListener("scroll", l));
      });
  }
  var Ds = window.location.hash.slice(1),
    Fs = Mt(Ds).frame;
  window !== window.top
    ? "challenge" === Fs
      ? (function () {
          var t = 0,
            e = null,
            i = null,
            n = null,
            o = [et.CHALLENGE_ALREADY_CLOSED, et.CHALLENGE_EXPIRED];
          window._sharedLibs = {
            packages: {
              config: { Options: ut, Color: ht },
              utils: {
                MathUtil: Ft,
                Query: Tt,
                Render: Ht,
                Color: Et,
                Shuffle: _t,
                JWT: Bt,
              },
              canvas: {
                Canvas: ni,
                Path: Je,
                Segment: Ge,
                Point: qe,
                PathSVG: Xe,
                ReticlePoint: ii,
              },
              constants: lt,
              device: tt,
              language: ae,
              theme: Ei,
              core: Pe,
              ui: un,
            },
          };
          var s = window.location.hash.slice(1),
            r = Mt(s);
          !(function (t) {
            (ct.host = t.host),
              (ct.sitekey = t.sitekey),
              (ct.file = "challenge"),
              (ut.sentry = !1 !== t.sentry),
              bt(!0),
              t.endpoint !== undefined &&
                "undefined" !== t.endpoint &&
                (ut.endpoint = t.endpoint),
              t.reportapi !== undefined &&
                "undefined" !== t.reportapi &&
                (ut.reportapi = t.reportapi),
              t.assethost !== undefined &&
                "undefined" !== t.assethost &&
                (jt.URL(t.assethost)
                  ? (ut.assethost = t.assethost)
                  : console.error("Invalid assethost uri.")),
              t.imghost !== undefined &&
                "undefined" !== t.imghost &&
                (ut.imghost = t.imghost),
              t.hl !== undefined &&
                "undefined" !== t.hl &&
                ((ut.language = t.hl), ae.setLocale(ut.language)),
              t.se !== undefined && "undefined" !== t.se && (ut.se = t.se),
              t.pstissuer !== undefined &&
                "undefined" !== t.pstissuer &&
                (ut.pstIssuer = t.pstissuer),
              t.pat !== undefined && "undefined" !== t.pat && (ut.pat = t.pat),
              (ut.theme = t.theme || ut.theme),
              t.themeConfig && (ut.themeConfig = t.themeConfig),
              t["confirm-nav"] && (ut.confirmNav = !0);
          })(r);
          var a = setTimeout(function () {
            wt("Slow iframe initialization", "error", "frame:challenge");
          }, 15e3);
          function l(i, s) {
            vo(i && i.href),
              null !== e && (clearTimeout(e), (e = null)),
              n.lockInterface(!0),
              Co && (Co.p = Date.now() - Co.s),
              bo()
                .then(function (t) {
                  return (function (t, e) {
                    return e || "on" !== ut.pat || !tt.supportsPAT()
                      ? Promise.resolve({ proof: t, pass: !1 })
                      : Io.authenticate(t)
                          .then(function (t) {
                            return (
                              go(t.c),
                              bo().then(function (e) {
                                return {
                                  proof: e,
                                  pass: t.pass,
                                  authToken: t.auth_token,
                                };
                              })
                            );
                          })
                          ["catch"](function (t) {
                            vt(t), Io.logAction(it.AUTHENTICATION_ERROR);
                            var e = t && t.response,
                              i = e && e.body;
                            return (
                              go(i.c),
                              bo().then(function (t) {
                                return { proof: t, pass: i.pass || !1 };
                              })
                            );
                          });
                  })(t, s);
                })
                .then(function (t) {
                  return Io.hasPrivateStateToken().then(function (e) {
                    return (t.hasPst = e), t;
                  });
                })
                .then(function (t) {
                  return (
                    Co && (Co.gcs = Date.now() - Co.s),
                    Io.getTaskData(i, t, ((e = xo), (xo = null), e), Co)
                  );
                  var e;
                })
                .then(function (t) {
                  return (
                    Co && (Co.gce = Date.now() - Co.s),
                    t.pass || !1 === t.success
                      ? c(t)
                      : ((e = {
                          c: t.c,
                          rq: t.rq,
                          key: t.key,
                          challengeType: t.request_type,
                        }),
                        e.challengeType
                          ? (e.key && li.send("challenge-key", { key: e.key }),
                            n.create({ rq: e.rq }),
                            go(e.c),
                            (i = e.challengeType),
                            Co && ((Co.l = Date.now() - Co.s), (Co.t = i)),
                            Io.loadBundle(e.challengeType)
                              .then(function (t) {
                                var i = Io.getData();
                                return (
                                  n.lockInterface(!1),
                                  Co && (Co.o = Date.now() - Co.s),
                                  n.show({
                                    width: ct.browserWidth,
                                    height: ct.browserHeight,
                                    bundle: t,
                                    bundleData: i,
                                    expiration: 1e3 * (i.expiration || 120),
                                    challengeType: e.challengeType,
                                  })
                                );
                              })
                              .then(function (t) {
                                return new Promise(function (e) {
                                  Promise.all([
                                    bo(),
                                    li.contact("check-api"),
                                  ]).then(function (i) {
                                    e({
                                      answers: t,
                                      proof: i[0],
                                      motionData: i[1],
                                    });
                                  });
                                });
                              })
                              .then(function (t) {
                                Ke.stop();
                                var e = t.answers,
                                  i = t.proof,
                                  n = Ke.getData();
                                return (
                                  (n.topLevel = t.motionData),
                                  (n.v = 1),
                                  Co && (Co.c = Date.now() - Co.s),
                                  Io.checkAnswers(e, n, i)
                                );
                              })
                              ["catch"](function (t) {
                                if (
                                  n.isVisible() ||
                                  (t && -1 === o.indexOf(t.message))
                                )
                                  throw (n.lockInterface(!0), t);
                              }))
                          : Promise.resolve({ c: e.c, skip: !0 })).then(c)
                  );
                  var e, i;
                })
                ["catch"](function (e) {
                  var i =
                    e instanceof Error
                      ? { event: it.CHALLENGE_ERROR, message: e.message || "" }
                      : e;
                  Io.logAction(i.event);
                  var n = 429 === e.status,
                    o = e.response && e.response["error-codes"],
                    s = o && -1 !== o.indexOf("invalid-data");
                  Ct("challenge", "api", "debug", e),
                    n ||
                    s ||
                    (i.event !== it.NETWORK_ERROR &&
                      i.event !== it.CHALLENGE_ERROR &&
                      i.event !== it.BUNDLE_ERROR) ||
                    !(t <= 2)
                      ? (t > 2 &&
                          0 !== e.status &&
                          429 !== e.status &&
                          403 !== e.status &&
                          400 !== e.status &&
                          wt("api:getcaptcha failed", "error", "challenge", {
                            error: e,
                          }),
                        (t = 0),
                        s &&
                          (i = {
                            event: it.NETWORK_ERROR,
                            message: (o || [""]).join(", "),
                          }),
                        ko(i.event),
                        li.send(et.CHALLENGE_CLOSED, i))
                      : ((t += 1), h());
                });
          }
          function c(t) {
            if ((go(t.c), t.skip))
              ko(et.CHALLENGE_ESCAPED),
                li.send(et.CHALLENGE_CLOSED, { event: et.CHALLENGE_ESCAPED });
            else if (t.pass)
              ko(et.CHALLENGE_PASSED),
                li.send(et.CHALLENGE_CLOSED, {
                  event: et.CHALLENGE_PASSED,
                  response: t.generated_pass_UUID,
                  expiration: t.expiration,
                }),
                t.generated_pass_UUID ||
                  wt("no pass id", "error", "frame:challenge");
            else if (!1 === t.success) {
              var e = t["error-codes"] || [];
              if (
                -1 !== e.indexOf("expired-session") ||
                -1 !== e.indexOf("client-fail")
              )
                return void h();
              ko(it.NETWORK_ERROR),
                li.send(et.CHALLENGE_CLOSED, {
                  event: it.NETWORK_ERROR,
                  message: (t["error-codes"] || [""]).join(", "),
                });
            } else n.displayTryAgain(!0), Io.logAction("challenge-failed"), h();
          }
          function h() {
            if (
              (Co && (Co = { s: Date.now(), n: Co.n + 1 }),
              Io.isRqChl() && !ut.a11yChallenge)
            )
              return (
                n.lockInterface(!0),
                void (e = setTimeout(function () {
                  ko(it.CHALLENGE_ERROR),
                    li.send(et.CHALLENGE_CLOSED, { event: it.CHALLENGE_ERROR });
                }, 2e3))
              );
            li.contact("getcaptcha-manifest").then(function (t) {
              l(t, !0);
            });
          }
          function u(t, e) {
            (ct.browserWidth = t.width),
              (ct.browserHeight = t.height),
              n.size(t.width, t.height).then(function (t) {
                e.resolve(t), Ct("challenge resized", "challenge", "info", t);
              });
          }
          function d() {
            Ct("challenge refresh", "challenge", "info"),
              Io.logAction("challenge-refresh"),
              h();
          }
          function p() {
            fo(jo.collect()),
              n
                .submit()
                .then(function (t) {
                  Io.logAction(t), "challenge-skip" !== t || h();
                })
                ["catch"](function (t) {
                  vt(t), Io.logAction(it.CHALLENGE_ERROR), h();
                });
          }
          function f() {
            var t = Io.getData();
            n.displayReport(t)
              .then(function (t) {
                if (t) {
                  var e = function () {
                    d(), n.getModal().off("refresh", e);
                  };
                  n.getModal().display("report_image", { key: t }),
                    n.getModal().on("refresh", e);
                }
              })
              ["catch"](function (t) {
                vt(t), d();
              });
          }
          window.addEventListener("load", function () {
            clearTimeout(a), Ct("iframe:load", "challenge", "info");
          }),
            document.addEventListener("DOMContentLoaded", function () {
              Ct("iframe:DOMContentLoaded", "challenge", "info");
            }),
            document.addEventListener("readystatechange", function () {
              Ct("iframe:readystatechange", "challenge", "info", {
                readyState: document.readyState,
              });
            }),
            jo.run(),
            (n = new ao(document.body, {
              host: ct.host,
              sitekey: ct.sitekey,
              orientation: r.orientation || "portrait",
            })),
            ut.themeConfig && n.addTheme("custom", ut.themeConfig),
            li.init(r.id, r.origin),
            (i = new Yt(document.body)),
            li.answer("create-challenge", function (t) {
              Co = { s: Date.now(), n: 0 };
              var e,
                o = {};
              t &&
                (Io.setRqData(t.rqdata || Io.getRqData()),
                t.wdata && ((e = t.wdata), (window.__wdata = e)),
                fo(t.errors),
                t.width &&
                  ((ct.browserWidth = t.width), (ct.browserHeight = t.height)),
                t.manifest && (o = t.manifest),
                "enter" === t.action
                  ? i.addClass("using-kb")
                  : i.hasClass("using-kb") && i.removeClass("using-kb"),
                n.init(t)),
                n.setFocus("info"),
                l(o, !1);
            }),
            li.answer("close-challenge", function (t) {
              ko(t.event),
                null !== e && (clearTimeout(e), (e = null)),
                t &&
                  t.event === et.CHALLENGE_ESCAPED &&
                  Io.logAction("challenge-abandon-retry"),
                Io.setRqData(null),
                n.close();
            }),
            li.answer("resize-challenge", u),
            li.answer("challenge-translate", function (t) {
              n.translateInterface(t),
                n.isVisible() &&
                  ("en" !== t.locale
                    ? (Io.logAction("challenge-language-change"), h())
                    : n.translateBundle());
            }),
            li.contact("get-url").then(function (t) {
              ct.url = t;
            }),
            li.answer("challenge-data", function (t) {
              t.rqdata && Io.setRqData(t.rqdata);
            }),
            n.events.on("refresh", d),
            n.events.on("submit", p),
            n.events.on("report", f),
            n.events.on("report-submission", function (t) {
              Io.reportIssue(t.reason, t.comment, t.key)["catch"](function (
                t
              ) {});
            }),
            n.events.on("resize", function () {
              li.send("challenge-resize");
            }),
            n.events.on("focus-check", function () {
              i.addClass("using-kb"), n.triggerFocus("submit");
            }),
            i.addEventListener("down", function (t) {
              n.isInterfaceLocked() || n.displayTryAgain(!1);
            }),
            i.addEventListener("keydown", function (t) {
              27 === t.keyNum &&
                (n.getModal().isOpen()
                  ? (n.getModal().close(), n.hideReport())
                  : (ko(et.CHALLENGE_ESCAPED),
                    li.send(et.CHALLENGE_CLOSED, {
                      event: et.CHALLENGE_ESCAPED,
                    }),
                    n.close()));
            }),
            i.addEventListener(
              "down",
              function () {
                "menu" !== n.getActiveElement() &&
                  i.hasClass("using-kb") &&
                  i.removeClass("using-kb");
              },
              !0
            ),
            i.addEventListener(
              "keydown",
              function (t) {
                9 === t.keyNum &&
                  (i.addClass("using-kb"),
                  t.shiftKey ||
                    ("submit" === n.getActiveElement() &&
                      (n.triggerFocus("challenge", 0),
                      t.preventDefault && t.preventDefault())));
              },
              !0
            ),
            i.addEventListener("keydown", function (t) {
              if ("submit" === n.getActiveElement()) {
                var e = t.keyNum;
                37 === e || 38 === e
                  ? (i.addClass("using-kb"),
                    n.triggerFocus("challenge", -1),
                    t.preventDefault && t.preventDefault())
                  : (39 !== e && 40 !== e) ||
                    (i.addClass("using-kb"),
                    n.triggerFocus("challenge", 0),
                    t.preventDefault && t.preventDefault());
              }
            }),
            Uo()
              .then(
                function (t) {
                  var e = t.features;
                  return (
                    "object" != typeof e && (e = {}),
                    n.setWhiteLabel(!!t.custom),
                    go(t.c),
                    ut.themeConfig && e.custom_theme
                      ? n.useTheme("custom")
                      : n.useTheme(ut.theme),
                    e.a11y_challenge &&
                      ((ut.a11yChallenge = !0), n.enableA11yChallenge(!0)),
                    { ok: t }
                  );
                },
                function (t) {
                  return {
                    err:
                      t instanceof Error
                        ? { name: t.name, message: t.message }
                        : t,
                  };
                }
              )
              .then(function (t) {
                li.send("site-setup", t);
              }),
            li.send("challenge-loaded");
        })()
      : "checkbox" === Fs
      ? (function () {
          var t = !1,
            e = window.location.hash.slice(1),
            i = Mt(e),
            n = ai.createChat(window.parent, i.id, i.origin);
          !(function (t) {
            (ct.id = t.id),
              (ct.host = t.host),
              (ct.sitekey = t.sitekey),
              (ct.file = "checkbox"),
              (ut.sentry = !1 !== t.sentry),
              bt(!0),
              (ut.size = t.size || ut.compact),
              (ut.custom = t.custom || ut.custom),
              (ut.se = t.se || null),
              t.endpoint !== undefined &&
                "undefined" !== t.endpoint &&
                (ut.endpoint = t.endpoint),
              t.assethost !== undefined &&
                "undefined" !== t.assethost &&
                (jt.URL(t.assethost)
                  ? (ut.assethost = t.assethost)
                  : console.error("Invalid assethost uri.")),
              t.imghost !== undefined &&
                "undefined" !== t.imghost &&
                (ut.imghost = t.imghost),
              t.hl !== undefined &&
                "undefined" !== t.hl &&
                ((ut.language = t.hl), ae.setLocale(t.hl)),
              t.tplinks !== undefined &&
                "undefined" !== t.tplinks &&
                (ut.tplinks = t.tplinks),
              t.pat !== undefined && "undefined" !== t.pat && (ut.pat = t.pat),
              t.pstissuer !== undefined &&
                "undefined" !== t.pstissuer &&
                (ut.pstIssuer = t.pstissuer),
              (ut.theme = t.theme || ut.theme),
              (ut.themeConfig = t.themeConfig),
              ut.themeConfig && (t.custom = !0);
          })(i);
          var o = setTimeout(function () {
            wt("Slow iframe initialization", "error", "frame:checkbox");
          }, 15e3);
          window.addEventListener("load", function () {
            clearTimeout(o), Ct("iframe:load", "checkbox", "info");
          }),
            document.addEventListener("DOMContentLoaded", function () {
              Ct("iframe:DOMContentLoaded", "checkbox", "info");
            }),
            document.addEventListener("readystatechange", function () {
              Ct("iframe:readystatechange", "checkbox", "info", {
                readyState: document.readyState,
              });
            });
          var s = Zo.sitekey(ct.sitekey),
            r = Zo.dummykey(ct.sitekey);
          jo.run();
          var a = null,
            l = null,
            c = new Promise(function (t) {
              l = t;
            }),
            h = null;
          function u(e, i) {
            var n = {
                host: ct.host,
                sitekey: ct.sitekey,
                size: ut.size,
                theme: ut.theme,
                linksOff: "off" === ut.tplinks,
                displayLogo: "invisible" !== ut.size,
                logo: null,
                logoUrl: null,
                privacyUrl: null,
                termsUrl: null,
              },
              o = e && e.custom;
            if (o) {
              (n.logo = o.logo),
                o.links &&
                  ((n.logoUrl = o.links.logo),
                  (n.privacyUrl = o.links.privacy),
                  (n.termsUrl = o.links.terms));
              var a = o.copy;
              if (a) {
                var l = {
                  checkbox_prompt: "I am human",
                  checkbox_a11y:
                    "hCaptcha checkbox. Select in order to trigger the challenge, or to bypass it if you have an accessibility cookie.",
                };
                for (var h in l) {
                  var u = a[h];
                  for (var d in u) {
                    var p = {};
                    (p[l[h]] = u[d]), ae.addTable(d, p);
                  }
                }
                c.then(function (t) {
                  t.translate();
                });
              }
            }
            var f = new ms(document.body, n),
              m = e && e.features && e.features.custom_theme;
            return (
              ut.themeConfig && m
                ? f.theme("custom", ut.themeConfig)
                : f.theme(ut.theme),
              f.setStatus(!1),
              s || r
                ? r &&
                  f.setWarning(
                    "This hCaptcha is for testing only. Please contact the site admin if you see this."
                  )
                : f.setWarning(
                    "The sitekey for this hCaptcha is incorrect. Please contact the site admin if you see this."
                  ),
              f.on("select", function (e) {
                f.setStatus(!1),
                  setTimeout(function () {
                    i.send("checkbox-selected", {
                      manifest: Ke.getData(),
                      charity: t,
                      a11yChallenge: ut.a11yChallenge || !1,
                      link: f.getLogoUrl(),
                      action: e,
                      errors: jo.collect(),
                    });
                  }, 1);
              }),
              f
            );
          }
          new Promise(function (t) {
            h = t;
          })
            .then(function (t) {
              if ("ok" in t) return t.ok;
              throw t.err;
            })
            .then(
              function (e) {
                a || ((a = u(e, n)), l(a));
                var i = e.features || {};
                (ut.a11yChallenge = i.a11y_challenge || !1),
                  (t = e.charity || !1),
                  e.status_message && s && !r && a.setWarning(e.status_message);
              },
              function (t) {
                a || ((a = u(null, n)), l(a)),
                  t.message && a.setStatus(t.message);
              }
            )
            .then(function () {
              Ke.resetData(),
                Ke.record(!0, !0, !0, !1),
                n.send("checkbox-loaded", a.getLocation());
            }),
            (function (t, e, i) {
              i.listen("site-setup", e),
                i.listen("checkbox-tick", function () {
                  t.then(function (t) {
                    t.tick();
                  });
                }),
                i.listen("checkbox-translate", function (e) {
                  try {
                    if (!e || !e.locale || !e.table) return;
                    ae.setLocale(e.locale),
                      ae.addTable(e.locale, e.table),
                      t.then(function (t) {
                        t.translate();
                      }),
                      document.documentElement.setAttribute(
                        "lang",
                        ae.getLocale()
                      );
                  } catch ($s) {
                    xt("translation", $s);
                  }
                }),
                i.listen("checkbox-status", function (e) {
                  t.then(function (t) {
                    t.setStatus(e.text, e.a11yOnly);
                  });
                }),
                i.listen("checkbox-reset", function () {
                  t.then(function (t) {
                    t.reset(), Ke.resetData(), Ke.record();
                  });
                }),
                i.listen("checkbox-clear", function () {
                  t.then(function (t) {
                    t.setLoading(!1);
                  });
                }),
                i.listen("checkbox-location", function (e) {
                  t.then(function (t) {
                    var i = t.getLocation();
                    e.resolve(i);
                  });
                });
            })(c, h, n),
            n.send("checkbox-ready"),
            i.custom || ((a = u(null, n)), l(a));
        })()
      : Ps()
    : Ps();
})();