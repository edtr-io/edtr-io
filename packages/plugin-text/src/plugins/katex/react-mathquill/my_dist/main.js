/* eslint-disable */
!(function(t, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e(require('react')))
    : 'function' == typeof define && define.amd
    ? define('MathquillComponent', ['react'], e)
    : 'object' == typeof exports
    ? (exports.MathquillComponent = e(require('react')))
    : (t.MathquillComponent = e(t.react))
})(global, function(t) {
  return (function(t) {
    var e = {}
    function n(i) {
      if (e[i]) return e[i].exports
      var r = (e[i] = { i: i, l: !1, exports: {} })
      return t[i].call(r.exports, r, r.exports, n), (r.l = !0), r.exports
    }
    return (
      (n.m = t),
      (n.c = e),
      (n.d = function(t, e, i) {
        n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: i })
      }),
      (n.r = function(t) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(t, '__esModule', { value: !0 })
      }),
      (n.t = function(t, e) {
        if ((1 & e && (t = n(t)), 8 & e)) return t
        if (4 & e && 'object' == typeof t && t && t.__esModule) return t
        var i = Object.create(null)
        if (
          (n.r(i),
          Object.defineProperty(i, 'default', { enumerable: !0, value: t }),
          2 & e && 'string' != typeof t)
        )
          for (var r in t)
            n.d(
              i,
              r,
              function(e) {
                return t[e]
              }.bind(null, r)
            )
        return i
      }),
      (n.n = function(t) {
        var e =
          t && t.__esModule
            ? function() {
                return t.default
              }
            : function() {
                return t
              }
        return n.d(e, 'a', e), e
      }),
      (n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
      }),
      (n.p = ''),
      n((n.s = 8))
    )
  })([
    function(t, e, n) {
      t.exports = n(3)()
    },
    function(e, n) {
      e.exports = t
    },
    function(t, e, n) {
      ;(t.exports = n(7)(!1)).push([
        t.i,
        "/*\n * MathQuill v0.10.1, by Han, Jeanine, and Mary\n * http://mathquill.com | maintainers@mathquill.com\n *\n * This Source Code Form is subject to the terms of the\n * Mozilla Public License, v. 2.0. If a copy of the MPL\n * was not distributed with this file, You can obtain\n * one at http://mozilla.org/MPL/2.0/.\n */\n@font-face {\n  /* Heavy fonts have been removed */\n  font-family: Symbola;\n}\n.mq-editable-field {\n  display: -moz-inline-box;\n  display: inline-block;\n}\n.mq-editable-field .mq-cursor {\n  border-left: 1px solid black;\n  margin-left: -1px;\n  position: relative;\n  z-index: 1;\n  padding: 0;\n  display: -moz-inline-box;\n  display: inline-block;\n}\n.mq-editable-field .mq-cursor.mq-blink {\n  visibility: hidden;\n}\n.mq-editable-field,\n.mq-math-mode .mq-editable-field {\n  border: 1px solid gray;\n}\n.mq-editable-field.mq-focused,\n.mq-math-mode .mq-editable-field.mq-focused {\n  -webkit-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\n  -moz-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\n  box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\n  border-color: #709AC0;\n  border-radius: 1px;\n}\n.mq-math-mode .mq-editable-field {\n  margin: 1px;\n}\n.mq-editable-field .mq-latex-command-input {\n  color: inherit;\n  font-family: \"Courier New\", monospace;\n  border: 1px solid gray;\n  padding-right: 1px;\n  margin-right: 1px;\n  margin-left: 2px;\n}\n.mq-editable-field .mq-latex-command-input.mq-empty {\n  background: transparent;\n}\n.mq-editable-field .mq-latex-command-input.mq-hasCursor {\n  border-color: ActiveBorder;\n}\n.mq-editable-field.mq-empty:after,\n.mq-editable-field.mq-text-mode:after,\n.mq-math-mode .mq-empty:after {\n  visibility: hidden;\n  content: 'c';\n}\n.mq-editable-field .mq-cursor:only-child:after,\n.mq-editable-field .mq-textarea + .mq-cursor:last-child:after {\n  visibility: hidden;\n  content: 'c';\n}\n.mq-editable-field .mq-text-mode .mq-cursor:only-child:after {\n  content: '';\n}\n.mq-editable-field.mq-text-mode {\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n.mq-root-block,\n.mq-math-mode .mq-root-block {\n  display: -moz-inline-box;\n  display: inline-block;\n  width: 100%;\n  padding: 2px;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  vertical-align: middle;\n}\n.mq-math-mode {\n  font-variant: normal;\n  font-weight: normal;\n  font-style: normal;\n  font-size: 115%;\n  line-height: 1;\n  display: -moz-inline-box;\n  display: inline-block;\n}\n.mq-math-mode .mq-non-leaf,\n.mq-math-mode .mq-scaled {\n  display: -moz-inline-box;\n  display: inline-block;\n}\n.mq-math-mode var,\n.mq-math-mode .mq-text-mode,\n.mq-math-mode .mq-nonSymbola {\n  font-family: \"Times New Roman\", Symbola, serif;\n  line-height: 0.9;\n}\n.mq-math-mode * {\n  font-size: inherit;\n  line-height: inherit;\n  margin: 0;\n  padding: 0;\n  border-color: black;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n  box-sizing: border-box;\n}\n.mq-math-mode .mq-empty {\n  background: #ccc;\n}\n.mq-math-mode .mq-empty.mq-root-block {\n  background: transparent;\n}\n.mq-math-mode.mq-empty {\n  background: transparent;\n}\n.mq-math-mode .mq-text-mode {\n  display: inline-block;\n  white-space: pre;\n}\n.mq-math-mode .mq-text-mode.mq-hasCursor {\n  box-shadow: inset darkgray 0 0.1em 0.2em;\n  padding: 0 0.1em;\n  margin: 0 -0.1em;\n  min-width: 1ex;\n}\n.mq-math-mode .mq-font {\n  font: 1em \"Times New Roman\", Symbola, serif;\n}\n.mq-math-mode .mq-font * {\n  font-family: inherit;\n  font-style: inherit;\n}\n.mq-math-mode b,\n.mq-math-mode b.mq-font {\n  font-weight: bolder;\n}\n.mq-math-mode var,\n.mq-math-mode i,\n.mq-math-mode i.mq-font {\n  font-style: italic;\n}\n.mq-math-mode var.mq-f {\n  margin-right: 0.2em;\n  margin-left: 0.1em;\n}\n.mq-math-mode .mq-roman var.mq-f {\n  margin: 0;\n}\n.mq-math-mode big {\n  font-size: 200%;\n}\n.mq-math-mode .mq-int > big {\n  display: inline-block;\n  -webkit-transform: scaleX(0.7);\n  -moz-transform: scaleX(0.7);\n  -ms-transform: scaleX(0.7);\n  -o-transform: scaleX(0.7);\n  transform: scaleX(0.7);\n  vertical-align: -0.16em;\n}\n.mq-math-mode .mq-int > .mq-supsub {\n  font-size: 80%;\n  vertical-align: -1.1em;\n  padding-right: 0.2em;\n}\n.mq-math-mode .mq-int > .mq-supsub > .mq-sup > .mq-sup-inner {\n  vertical-align: 1.3em;\n}\n.mq-math-mode .mq-int > .mq-supsub > .mq-sub {\n  margin-left: -0.35em;\n}\n.mq-math-mode .mq-roman {\n  font-style: normal;\n}\n.mq-math-mode .mq-sans-serif {\n  font-family: sans-serif, Symbola, serif;\n}\n.mq-math-mode .mq-monospace {\n  font-family: monospace, Symbola, serif;\n}\n.mq-math-mode .mq-overline {\n  border-top: 1px solid black;\n  margin-top: 1px;\n}\n.mq-math-mode .mq-underline {\n  border-bottom: 1px solid black;\n  margin-bottom: 1px;\n}\n.mq-math-mode .mq-binary-operator {\n  padding: 0 0.2em;\n  display: -moz-inline-box;\n  display: inline-block;\n}\n.mq-math-mode .mq-supsub {\n  text-align: left;\n  font-size: 90%;\n  vertical-align: -0.5em;\n}\n.mq-math-mode .mq-supsub.mq-sup-only {\n  vertical-align: 0.5em;\n}\n.mq-math-mode .mq-supsub.mq-sup-only .mq-sup {\n  display: inline-block;\n  vertical-align: text-bottom;\n}\n.mq-math-mode .mq-supsub .mq-sup {\n  display: block;\n}\n.mq-math-mode .mq-supsub .mq-sub {\n  display: block;\n  float: left;\n}\n.mq-math-mode .mq-supsub .mq-binary-operator {\n  padding: 0 0.1em;\n}\n.mq-math-mode .mq-supsub .mq-fraction {\n  font-size: 70%;\n}\n.mq-math-mode sup.mq-nthroot {\n  font-size: 80%;\n  vertical-align: 0.8em;\n  margin-right: -0.6em;\n  margin-left: 0.2em;\n  min-width: 0.5em;\n}\n.mq-math-mode .mq-paren {\n  padding: 0 0.1em;\n  vertical-align: top;\n  -webkit-transform-origin: center 0.06em;\n  -moz-transform-origin: center 0.06em;\n  -ms-transform-origin: center 0.06em;\n  -o-transform-origin: center 0.06em;\n  transform-origin: center 0.06em;\n}\n.mq-math-mode .mq-paren.mq-ghost {\n  color: silver;\n}\n.mq-math-mode .mq-paren + span {\n  margin-top: 0.1em;\n  margin-bottom: 0.1em;\n}\n.mq-math-mode .mq-array {\n  vertical-align: middle;\n  text-align: center;\n}\n.mq-math-mode .mq-array > span {\n  display: block;\n}\n.mq-math-mode .mq-operator-name {\n  font-family: Symbola, \"Times New Roman\", serif;\n  line-height: 0.9;\n  font-style: normal;\n}\n.mq-math-mode var.mq-operator-name.mq-first {\n  padding-left: 0.2em;\n}\n.mq-math-mode var.mq-operator-name.mq-last,\n.mq-math-mode .mq-supsub.mq-after-operator-name {\n  padding-right: 0.2em;\n}\n.mq-math-mode .mq-fraction {\n  font-size: 90%;\n  text-align: center;\n  vertical-align: -0.4em;\n  padding: 0 0.2em;\n}\n.mq-math-mode .mq-fraction,\n.mq-math-mode .mq-large-operator,\n.mq-math-mode x:-moz-any-link {\n  display: -moz-groupbox;\n}\n.mq-math-mode .mq-fraction,\n.mq-math-mode .mq-large-operator,\n.mq-math-mode x:-moz-any-link,\n.mq-math-mode x:default {\n  display: inline-block;\n}\n.mq-math-mode .mq-numerator,\n.mq-math-mode .mq-denominator,\n.mq-math-mode .mq-dot-recurring {\n  display: block;\n}\n.mq-math-mode .mq-numerator {\n  padding: 0 0.1em;\n}\n.mq-math-mode .mq-denominator {\n  border-top: 1px solid;\n  float: right;\n  width: 100%;\n  padding: 0.1em;\n}\n.mq-math-mode .mq-dot-recurring {\n  text-align: center;\n  height: 0.3em;\n}\n.mq-math-mode .mq-sqrt-prefix {\n  padding-top: 0;\n  position: relative;\n  top: 0.1em;\n  vertical-align: top;\n  -webkit-transform-origin: top;\n  -moz-transform-origin: top;\n  -ms-transform-origin: top;\n  -o-transform-origin: top;\n  transform-origin: top;\n}\n.mq-math-mode .mq-sqrt-stem {\n  border-top: 1px solid;\n  margin-top: 1px;\n  padding-left: 0.15em;\n  padding-right: 0.2em;\n  margin-right: 0.1em;\n  padding-top: 1px;\n}\n.mq-math-mode .mq-diacritic-above {\n  display: block;\n  text-align: center;\n  line-height: 0.4em;\n}\n.mq-math-mode .mq-diacritic-stem {\n  display: block;\n  text-align: center;\n}\n.mq-math-mode .mq-hat-prefix {\n  display: block;\n  text-align: center;\n  line-height: 0.95em;\n  margin-bottom: -0.7em;\n  transform: scaleX(1.5);\n  -moz-transform: scaleX(1.5);\n  -o-transform: scaleX(1.5);\n  -webkit-transform: scaleX(1.5);\n}\n.mq-math-mode .mq-hat-stem {\n  display: block;\n}\n.mq-math-mode .mq-large-operator {\n  vertical-align: -0.2em;\n  padding: 0.2em;\n  text-align: center;\n}\n.mq-math-mode .mq-large-operator .mq-from,\n.mq-math-mode .mq-large-operator big,\n.mq-math-mode .mq-large-operator .mq-to {\n  display: block;\n}\n.mq-math-mode .mq-large-operator .mq-from,\n.mq-math-mode .mq-large-operator .mq-to {\n  font-size: 80%;\n}\n.mq-math-mode .mq-large-operator .mq-from {\n  float: right;\n  /* take out of normal flow to manipulate baseline */\n  width: 100%;\n}\n.mq-math-mode,\n.mq-math-mode .mq-editable-field {\n  cursor: text;\n  font-family: Symbola, \"Times New Roman\", serif;\n}\n.mq-math-mode .mq-overarc {\n  border-top: 1px solid black;\n  -webkit-border-top-right-radius: 50% 0.3em;\n  -moz-border-radius-topright: 50% 0.3em;\n  border-top-right-radius: 50% 0.3em;\n  -webkit-border-top-left-radius: 50% 0.3em;\n  -moz-border-radius-topleft: 50% 0.3em;\n  border-top-left-radius: 50% 0.3em;\n  margin-top: 1px;\n  padding-top: 0.15em;\n}\n.mq-math-mode .mq-overarrow {\n  min-width: 0.5em;\n  border-top: 1px solid black;\n  margin-top: 1px;\n  padding-top: 0.2em;\n  text-align: center;\n}\n.mq-math-mode .mq-overarrow:before {\n  display: block;\n  position: relative;\n  top: -0.34em;\n  font-size: 0.5em;\n  line-height: 0em;\n  content: '\\27A4';\n  text-align: right;\n}\n.mq-math-mode .mq-overarrow.mq-arrow-left:before {\n  -moz-transform: scaleX(-1);\n  -o-transform: scaleX(-1);\n  -webkit-transform: scaleX(-1);\n  transform: scaleX(-1);\n  filter: FlipH;\n  -ms-filter: \"FlipH\";\n}\n.mq-math-mode .mq-overarrow.mq-arrow-both {\n  vertical-align: text-bottom;\n}\n.mq-math-mode .mq-overarrow.mq-arrow-both.mq-empty {\n  min-height: 1.23em;\n}\n.mq-math-mode .mq-overarrow.mq-arrow-both.mq-empty:after {\n  top: -0.34em;\n}\n.mq-math-mode .mq-overarrow.mq-arrow-both:before {\n  -moz-transform: scaleX(-1);\n  -o-transform: scaleX(-1);\n  -webkit-transform: scaleX(-1);\n  transform: scaleX(-1);\n  filter: FlipH;\n  -ms-filter: \"FlipH\";\n}\n.mq-math-mode .mq-overarrow.mq-arrow-both:after {\n  display: block;\n  position: relative;\n  top: -2.3em;\n  font-size: 0.5em;\n  line-height: 0em;\n  content: '\\27A4';\n  visibility: visible;\n  text-align: right;\n}\n.mq-math-mode .mq-selection,\n.mq-editable-field .mq-selection,\n.mq-math-mode .mq-selection .mq-non-leaf,\n.mq-editable-field .mq-selection .mq-non-leaf,\n.mq-math-mode .mq-selection .mq-scaled,\n.mq-editable-field .mq-selection .mq-scaled {\n  background: #B4D5FE !important;\n  background: Highlight !important;\n  color: HighlightText;\n  border-color: HighlightText;\n}\n.mq-math-mode .mq-selection .mq-matrixed,\n.mq-editable-field .mq-selection .mq-matrixed {\n  background: #39F !important;\n}\n.mq-math-mode .mq-selection .mq-matrixed-container,\n.mq-editable-field .mq-selection .mq-matrixed-container {\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='#3399FF') !important;\n}\n.mq-math-mode .mq-selection.mq-blur,\n.mq-editable-field .mq-selection.mq-blur,\n.mq-math-mode .mq-selection.mq-blur .mq-non-leaf,\n.mq-editable-field .mq-selection.mq-blur .mq-non-leaf,\n.mq-math-mode .mq-selection.mq-blur .mq-scaled,\n.mq-editable-field .mq-selection.mq-blur .mq-scaled,\n.mq-math-mode .mq-selection.mq-blur .mq-matrixed,\n.mq-editable-field .mq-selection.mq-blur .mq-matrixed {\n  background: #D4D4D4 !important;\n  color: black;\n  border-color: black;\n}\n.mq-math-mode .mq-selection.mq-blur .mq-matrixed-container,\n.mq-editable-field .mq-selection.mq-blur .mq-matrixed-container {\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='#D4D4D4') !important;\n}\n.mq-editable-field .mq-textarea,\n.mq-math-mode .mq-textarea {\n  position: relative;\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  user-select: text;\n}\n.mq-editable-field .mq-textarea *,\n.mq-math-mode .mq-textarea *,\n.mq-editable-field .mq-selectable,\n.mq-math-mode .mq-selectable {\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  user-select: text;\n  position: absolute;\n  clip: rect(1em 1em 1em 1em);\n  -webkit-transform: scale(0);\n  -moz-transform: scale(0);\n  -ms-transform: scale(0);\n  -o-transform: scale(0);\n  transform: scale(0);\n  resize: none;\n  width: 1px;\n  height: 1px;\n  box-sizing: content-box;\n}\n.mq-math-mode .mq-matrixed {\n  background: white;\n  display: -moz-inline-box;\n  display: inline-block;\n}\n.mq-math-mode .mq-matrixed-container {\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='white');\n  margin-top: -0.1em;\n}\n",
        ''
      ])
    },
    function(t, e, n) {
      'use strict'
      var i = n(4)
      function r() {}
      function o() {}
      ;(o.resetWarningCache = r),
        (t.exports = function() {
          function t(t, e, n, r, o, s) {
            if (s !== i) {
              var a = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types'
              )
              throw ((a.name = 'Invariant Violation'), a)
            }
          }
          function e() {
            return t
          }
          t.isRequired = t
          var n = {
            array: t,
            bool: t,
            func: t,
            number: t,
            object: t,
            string: t,
            symbol: t,
            any: t,
            arrayOf: e,
            element: t,
            elementType: t,
            instanceOf: e,
            node: t,
            objectOf: e,
            oneOf: e,
            oneOfType: e,
            shape: e,
            exact: e,
            checkPropTypes: o,
            resetWarningCache: r
          }
          return (n.PropTypes = n), n
        })
    },
    function(t, e, n) {
      'use strict'
      t.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    function(t, e, n) {
      var i = i || {}
      ;(i.jQuery = n(6)),
        (function() {
          var t,
            e = i.jQuery,
            n = 'mathquill-block-id',
            r = Math.min,
            o = Math.max
          if (!e) throw 'MathQuill requires jQuery 1.5.2+ to be loaded first'
          function s() {}
          var a = [].slice
          function l(t) {
            var e = t.length - 1
            return function() {
              var n = a.call(arguments, 0, e),
                i = a.call(arguments, e)
              return t.apply(this, n.concat([i]))
            }
          }
          var c = l(function(t, e) {
            return l(function(n, i) {
              if (t in n) return n[t].apply(n, e.concat(i))
            })
          })
          function u(t) {
            return l(function(e, n) {
              'function' != typeof e && (e = c(e))
              return t.call(this, function(t) {
                return e.apply(t, [t].concat(n))
              })
            })
          }
          function f(t) {
            var e = a.call(arguments, 1)
            return function() {
              return t.apply(this, e)
            }
          }
          function d(t, e) {
            if (!e) throw new Error('prayer failed: ' + t)
          }
          var h = (function(t, e, n) {
              function i(t) {
                return 'object' == typeof t
              }
              function r(t) {
                return 'function' == typeof t
              }
              function o() {}
              return function t(n, s) {
                function a() {
                  var t = new l()
                  return r(t.init) && t.init.apply(t, arguments), t
                }
                function l() {}
                void 0 === s && ((s = n), (n = Object)), (a.Bare = l)
                var c,
                  u = (o.prototype = n.prototype),
                  f = (l.prototype = a.prototype = a.p = new o())
                return (
                  (f.constructor = a),
                  (a.mixin = function(e) {
                    return (l.prototype = a.prototype = t(a, e).prototype), a
                  }),
                  (a.open = function(t) {
                    if (
                      ((c = {}),
                      r(t) ? (c = t.call(a, f, u, a, n)) : i(t) && (c = t),
                      i(c))
                    )
                      for (var o in c) e.call(c, o) && (f[o] = c[o])
                    return r(f.init) || (f.init = n), a
                  })(s)
                )
              }
            })(0, {}.hasOwnProperty),
            p = -1,
            m = 1
          function g(t) {
            d('a direction was passed', t === p || t === m)
          }
          var v = h(e, function(t) {
              ;(t.insDirOf = function(t, e) {
                return t === p
                  ? this.insertBefore(e.first())
                  : this.insertAfter(e.last())
              }),
                (t.insAtDirEnd = function(t, e) {
                  return t === p ? this.prependTo(e) : this.appendTo(e)
                })
            }),
            y = h(function(t) {
              ;(t.parent = 0),
                (t[p] = 0),
                (t[m] = 0),
                (t.init = function(t, e, n) {
                  ;(this.parent = t), (this[p] = e), (this[m] = n)
                }),
                (this.copy = function(t) {
                  return y(t.parent, t[p], t[m])
                })
            }),
            b = h(function(t) {
              ;(t[p] = 0), (t[m] = 0), (t.parent = 0)
              var e = 0
              ;(this.byId = {}),
                (t.init = function() {
                  ;(this.id = e += 1),
                    (b.byId[this.id] = this),
                    (this.ends = {}),
                    (this.ends[p] = 0),
                    (this.ends[m] = 0)
                }),
                (t.dispose = function() {
                  delete b.byId[this.id]
                }),
                (t.toString = function() {
                  return '{{ MathQuill Node #' + this.id + ' }}'
                }),
                (t.jQ = v()),
                (t.jQadd = function(t) {
                  return (this.jQ = this.jQ.add(t))
                }),
                (t.jQize = function(t) {
                  t = v(t || this.html())
                  function e(t) {
                    if (t.getAttribute) {
                      var n = t.getAttribute('mathquill-command-id'),
                        i = t.getAttribute('mathquill-block-id')
                      n && b.byId[n].jQadd(t), i && b.byId[i].jQadd(t)
                    }
                    for (t = t.firstChild; t; t = t.nextSibling) e(t)
                  }
                  for (var n = 0; n < t.length; n += 1) e(t[n])
                  return t
                }),
                (t.createDir = function(t, e) {
                  g(t)
                  return (
                    this.jQize(),
                    this.jQ.insDirOf(t, e.jQ),
                    (e[t] = this.adopt(e.parent, e[p], e[m])),
                    this
                  )
                }),
                (t.createLeftOf = function(t) {
                  return this.createDir(p, t)
                }),
                (t.selectChildren = function(t, e) {
                  return C(t, e)
                }),
                (t.bubble = u(function(t) {
                  for (var e = this; e; e = e.parent) {
                    if (!1 === t(e)) break
                  }
                  return this
                })),
                (t.postOrder = u(function(t) {
                  return (
                    (function e(n) {
                      n.eachChild(e), t(n)
                    })(this),
                    this
                  )
                })),
                (t.isEmpty = function() {
                  return 0 === this.ends[p] && 0 === this.ends[m]
                }),
                (t.isStyleBlock = function() {
                  return !1
                }),
                (t.children = function() {
                  return q(this.ends[p], this.ends[m])
                }),
                (t.eachChild = function() {
                  var t = this.children()
                  return t.each.apply(t, arguments), this
                }),
                (t.foldChildren = function(t, e) {
                  return this.children().fold(t, e)
                }),
                (t.withDirAdopt = function(t, e, n, i) {
                  return q(this, this).withDirAdopt(t, e, n, i), this
                }),
                (t.adopt = function(t, e, n) {
                  return q(this, this).adopt(t, e, n), this
                }),
                (t.disown = function() {
                  return q(this, this).disown(), this
                }),
                (t.remove = function() {
                  return (
                    this.jQ.remove(), this.postOrder('dispose'), this.disown()
                  )
                })
            })
          function x(t, e, n) {
            d('a parent is always present', t),
              d(
                'leftward is properly set up',
                e ? e[m] === n && e.parent === t : t.ends[p] === n
              ),
              d(
                'rightward is properly set up',
                n ? n[p] === e && n.parent === t : t.ends[m] === e
              )
          }
          var q = h(function(e) {
              ;(e.init = function(e, n, i) {
                if (
                  (i === t && (i = p),
                  g(i),
                  d('no half-empty fragments', !e == !n),
                  (this.ends = {}),
                  e)
                ) {
                  d('withDir is passed to Fragment', e instanceof b),
                    d('oppDir is passed to Fragment', n instanceof b),
                    d(
                      'withDir and oppDir have the same parent',
                      e.parent === n.parent
                    ),
                    (this.ends[i] = e),
                    (this.ends[-i] = n)
                  var r = this.fold([], function(t, e) {
                    return t.push.apply(t, e.jQ.get()), t
                  })
                  this.jQ = this.jQ.add(r)
                }
              }),
                (e.jQ = v()),
                (e.withDirAdopt = function(t, e, n, i) {
                  return t === p ? this.adopt(e, n, i) : this.adopt(e, i, n)
                }),
                (e.adopt = function(t, e, n) {
                  x(t, e, n)
                  this.disowned = !1
                  var i = this.ends[p]
                  if (!i) return this
                  var r = this.ends[m]
                  return (
                    e || (t.ends[p] = i),
                    n ? (n[p] = r) : (t.ends[m] = r),
                    (this.ends[m][m] = n),
                    this.each(function(n) {
                      ;(n[p] = e), (n.parent = t), e && (e[m] = n), (e = n)
                    }),
                    this
                  )
                }),
                (e.disown = function() {
                  var t = this.ends[p]
                  if (!t || this.disowned) return this
                  this.disowned = !0
                  var e = this.ends[m],
                    n = t.parent
                  return (
                    x(n, t[p], t),
                    x(n, e, e[m]),
                    t[p] ? (t[p][m] = e[m]) : (n.ends[p] = e[m]),
                    e[m] ? (e[m][p] = t[p]) : (n.ends[m] = t[p]),
                    this
                  )
                }),
                (e.remove = function() {
                  return (
                    this.jQ.remove(),
                    this.each('postOrder', 'dispose'),
                    this.disown()
                  )
                }),
                (e.each = u(function(t) {
                  var e = this.ends[p]
                  if (!e) return this
                  for (; e !== this.ends[m][m]; e = e[m]) {
                    if (!1 === t(e)) break
                  }
                  return this
                })),
                (e.fold = function(t, e) {
                  return (
                    this.each(function(n) {
                      t = e.call(this, t, n)
                    }),
                    t
                  )
                })
            }),
            w = {},
            T = {},
            k = h(y, function(e) {
              ;(e.init = function(t, e) {
                ;(this.parent = t), (this.options = e)
                var n = (this.jQ = this._jQ = v(
                  '<span class="mq-cursor">&#8203;</span>'
                ))
                ;(this.blink = function() {
                  n.toggleClass('mq-blink')
                }),
                  (this.upDownCache = {})
              }),
                (e.show = function() {
                  return (
                    (this.jQ = this._jQ.removeClass('mq-blink')),
                    'intervalId' in this
                      ? clearInterval(this.intervalId)
                      : (this[m]
                          ? this.selection &&
                            this.selection.ends[p][p] === this[p]
                            ? this.jQ.insertBefore(this.selection.jQ)
                            : this.jQ.insertBefore(this[m].jQ.first())
                          : this.jQ.appendTo(this.parent.jQ),
                        this.parent.focus()),
                    (this.intervalId = setInterval(this.blink, 500)),
                    this
                  )
                }),
                (e.hide = function() {
                  return (
                    'intervalId' in this && clearInterval(this.intervalId),
                    delete this.intervalId,
                    this.jQ.detach(),
                    (this.jQ = v()),
                    this
                  )
                }),
                (e.withDirInsertAt = function(t, e, n, i) {
                  var r = this.parent
                  ;(this.parent = e),
                    (this[t] = n),
                    (this[-t] = i),
                    r !== e && r.blur && r.blur(this)
                }),
                (e.insDirOf = function(t, e) {
                  return (
                    g(t),
                    this.jQ.insDirOf(t, e.jQ),
                    this.withDirInsertAt(t, e.parent, e[t], e),
                    this.parent.jQ.addClass('mq-hasCursor'),
                    this
                  )
                }),
                (e.insLeftOf = function(t) {
                  return this.insDirOf(p, t)
                }),
                (e.insRightOf = function(t) {
                  return this.insDirOf(m, t)
                }),
                (e.insAtDirEnd = function(t, e) {
                  return (
                    g(t),
                    this.jQ.insAtDirEnd(t, e.jQ),
                    this.withDirInsertAt(t, e, 0, e.ends[t]),
                    e.focus(),
                    this
                  )
                }),
                (e.insAtLeftEnd = function(t) {
                  return this.insAtDirEnd(p, t)
                }),
                (e.insAtRightEnd = function(t) {
                  return this.insAtDirEnd(m, t)
                }),
                (e.jumpUpDown = function(t, e) {
                  this.upDownCache[t.id] = y.copy(this)
                  var n = this.upDownCache[e.id]
                  if (n)
                    n[m] ? this.insLeftOf(n[m]) : this.insAtRightEnd(n.parent)
                  else {
                    var i = this.offset().left
                    e.seek(i, this)
                  }
                }),
                (e.offset = function() {
                  var t = this.jQ.removeClass('mq-cursor').offset()
                  return this.jQ.addClass('mq-cursor'), t
                }),
                (e.unwrapGramp = function() {
                  var t = this.parent.parent,
                    e = t.parent,
                    n = t[m],
                    i = t[p]
                  if (
                    (t.disown().eachChild(function(r) {
                      r.isEmpty() ||
                        (r
                          .children()
                          .adopt(e, i, n)
                          .each(function(e) {
                            e.jQ.insertBefore(t.jQ.first())
                          }),
                        (i = r.ends[m]))
                    }),
                    !this[m])
                  )
                    if (this[p]) this[m] = this[p][m]
                    else
                      for (; !this[m]; ) {
                        if (((this.parent = this.parent[m]), !this.parent)) {
                          ;(this[m] = t[m]), (this.parent = e)
                          break
                        }
                        this[m] = this.parent.ends[p]
                      }
                  this[m] ? this.insLeftOf(this[m]) : this.insAtRightEnd(e),
                    t.jQ.remove(),
                    t[p].siblingDeleted && t[p].siblingDeleted(this.options, m),
                    t[m].siblingDeleted && t[m].siblingDeleted(this.options, p)
                }),
                (e.startSelection = function() {
                  for (
                    var t = (this.anticursor = y.copy(this)),
                      e = (t.ancestors = {}),
                      n = t;
                    n.parent;
                    n = n.parent
                  )
                    e[n.parent.id] = n
                }),
                (e.endSelection = function() {
                  delete this.anticursor
                }),
                (e.select = function() {
                  var t = this.anticursor
                  if (this[p] === t[p] && this.parent === t.parent) return !1
                  for (var e = this; e.parent; e = e.parent)
                    if (e.parent.id in t.ancestors) {
                      var n = e.parent
                      break
                    }
                  d('cursor and anticursor in the same tree', n)
                  var i,
                    r,
                    o = t.ancestors[n.id],
                    s = m
                  if (e[p] !== o)
                    for (var a = e; a; a = a[m])
                      if (a[m] === o[m]) {
                        ;(s = p), (i = e), (r = o)
                        break
                      }
                  return (
                    s === m && ((i = o), (r = e)),
                    i instanceof y && (i = i[m]),
                    r instanceof y && (r = r[p]),
                    (this.hide().selection = n.selectChildren(i, r)),
                    this.insDirOf(s, this.selection.ends[s]),
                    this.selectionChanged(),
                    !0
                  )
                }),
                (e.clearSelection = function() {
                  return (
                    this.selection &&
                      (this.selection.clear(),
                      delete this.selection,
                      this.selectionChanged()),
                    this
                  )
                }),
                (e.deleteSelection = function() {
                  this.selection &&
                    ((this[p] = this.selection.ends[p][p]),
                    (this[m] = this.selection.ends[m][m]),
                    this.selection.remove(),
                    this.selectionChanged(),
                    delete this.selection)
                }),
                (e.replaceSelection = function() {
                  var t = this.selection
                  return (
                    t &&
                      ((this[p] = t.ends[p][p]),
                      (this[m] = t.ends[m][m]),
                      delete this.selection),
                    t
                  )
                }),
                (e.depth = function() {
                  for (var t = this, e = 0; (t = t.parent); )
                    e += t instanceof U ? 1 : 0
                  return e
                }),
                (e.isTooDeep = function(e) {
                  if (this.options.maxDepth !== t)
                    return this.depth() + (e || 0) > this.options.maxDepth
                })
            }),
            C = h(q, function(t, e) {
              ;(t.init = function() {
                e.init.apply(this, arguments),
                  (this.jQ = this.jQ
                    .wrapAll('<span class="mq-selection"></span>')
                    .parent())
              }),
                (t.adopt = function() {
                  return (
                    this.jQ.replaceWith((this.jQ = this.jQ.children())),
                    e.adopt.apply(this, arguments)
                  )
                }),
                (t.clear = function() {
                  return this.jQ.replaceWith(this.jQ[0].childNodes), this
                }),
                (t.join = function(t) {
                  return this.fold('', function(e, n) {
                    return e + n[t]()
                  })
                })
            }),
            S = h(function(t) {
              ;(t.init = function(t, e, n) {
                ;(this.id = t.id),
                  (this.data = {}),
                  (this.root = t),
                  (this.container = e),
                  (this.options = n),
                  (t.controller = this),
                  (this.cursor = t.cursor = k(t, n))
              }),
                (t.handle = function(t, e) {
                  var n = this.options.handlers
                  if (n && n.fns[t]) {
                    var i = n.APIClasses[this.KIND_OF_MQ](this)
                    e === p || e === m ? n.fns[t](e, i) : n.fns[t](i)
                  }
                })
              var e = []
              ;(this.onNotify = function(t) {
                e.push(t)
              }),
                (t.notify = function() {
                  for (var t = 0; t < e.length; t += 1)
                    e[t].apply(this.cursor, arguments)
                  return this
                })
            }),
            E = {},
            j = h(),
            O = {},
            D = h(),
            A = {}
          function L() {
            i.console &&
              console.warn(
                'You are using the MathQuill API without specifying an interface version, which will fail in v1.0.0. Easiest fix is to do the following before doing anything else:\n\n    MathQuill = MathQuill.getInterface(1);\n    // now MathQuill.MathField() works like it used to\n\nSee also the "`dev` branch (2014–2015) → v0.10.0 Migration Guide" at\n  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide'
              )
          }
          function _(t) {
            return L(), Qt(t)
          }
          ;(_.prototype = D.p),
            (_.VERSION = 'v0.10.1'),
            (_.interfaceVersion = function(t) {
              if (1 !== t)
                throw 'Only interface version 1 supported. You specified: ' + t
              return (
                (L = function() {
                  i.console &&
                    console.warn(
                      'You called MathQuill.interfaceVersion(1); to specify the interface version, which will fail in v1.0.0. You can fix this easily by doing this before doing anything else:\n\n    MathQuill = MathQuill.getInterface(1);\n    // now MathQuill.MathField() works like it used to\n\nSee also the "`dev` branch (2014–2015) → v0.10.0 Migration Guide" at\n  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide'
                    )
                })(),
                _
              )
            }),
            (_.getInterface = M)
          var N = (M.MIN = 1),
            Q = (M.MAX = 2)
          function M(t) {
            if (!(N <= t && t <= Q))
              throw 'Only interface versions between ' +
                N +
                ' and ' +
                Q +
                ' supported. You specified: ' +
                t
            function r(t) {
              if (!t || !t.nodeType) return null
              var e = v(t)
                  .children('.mq-root-block')
                  .attr(n),
                i = e && b.byId[e].controller
              return i ? o[i.KIND_OF_MQ](i) : null
            }
            var o = {}
            function a(t, e) {
              for (var n in (e &&
                e.handlers &&
                (e.handlers = { fns: e.handlers, APIClasses: o }),
              e))
                if (e.hasOwnProperty(n)) {
                  var i = e[n],
                    r = O[n]
                  t[n] = r ? r(i) : i
                }
            }
            ;(r.L = p),
              (r.R = m),
              (r.saneKeyboardEvents = F),
              (r.config = function(t) {
                return a(j.p, t), this
              }),
              (r.registerEmbed = function(t, e) {
                if (!/^[a-z][a-z0-9]*$/i.test(t))
                  throw 'Embed name must start with letter and be only letters and digits'
                A[t] = e
              })
            var l = (o.AbstractMathQuill = h(D, function(t) {
              ;(t.init = function(t) {
                ;(this.__controller = t),
                  (this.__options = t.options),
                  (this.id = t.id),
                  (this.data = t.data)
              }),
                (t.__mathquillify = function(t) {
                  var e = this.__controller,
                    i = e.root,
                    r = e.container
                  e.createTextarea()
                  var o = r
                    .addClass(t)
                    .contents()
                    .detach()
                  ;(i.jQ = v('<span class="mq-root-block"/>')
                    .attr(n, i.id)
                    .appendTo(r)),
                    this.latex(o.text()),
                    (this.revert = function() {
                      return r
                        .empty()
                        .unbind('.mathquill')
                        .removeClass(
                          'mq-editable-field mq-math-mode mq-text-mode'
                        )
                        .append(o)
                    })
                }),
                (t.config = function(t) {
                  return a(this.__options, t), this
                }),
                (t.el = function() {
                  return this.__controller.container[0]
                }),
                (t.text = function() {
                  return this.__controller.exportText()
                }),
                (t.latex = function(t) {
                  return arguments.length > 0
                    ? (this.__controller.renderLatexMath(t),
                      this.__controller.blurred &&
                        this.__controller.cursor.hide().parent.blur(),
                      this)
                    : this.__controller.exportLatex()
                }),
                (t.html = function() {
                  return this.__controller.root.jQ
                    .html()
                    .replace(/ mathquill-(?:command|block)-id="?\d+"?/g, '')
                    .replace(
                      /<span class="?mq-cursor( mq-blink)?"?>.?<\/span>/i,
                      ''
                    )
                    .replace(/ mq-hasCursor|mq-hasCursor ?/, '')
                    .replace(/ class=(""|(?= |>))/g, '')
                }),
                (t.reflow = function() {
                  return this.__controller.root.postOrder('reflow'), this
                })
            }))
            for (var c in ((r.prototype = l.prototype),
            (o.EditableField = h(l, function(t, n) {
              ;(t.__mathquillify = function() {
                return (
                  n.__mathquillify.apply(this, arguments),
                  (this.__controller.editable = !0),
                  this.__controller.delegateMouseEvents(),
                  this.__controller.editablesTextareaEvents(),
                  this
                )
              }),
                (t.focus = function() {
                  return this.__controller.textarea.focus(), this
                }),
                (t.blur = function() {
                  return this.__controller.textarea.blur(), this
                }),
                (t.write = function(t) {
                  return (
                    this.__controller.writeLatex(t),
                    this.__controller.scrollHoriz(),
                    this.__controller.blurred &&
                      this.__controller.cursor.hide().parent.blur(),
                    this
                  )
                }),
                (t.empty = function() {
                  var t = this.__controller.root,
                    e = this.__controller.cursor
                  return (
                    t.eachChild('postOrder', 'dispose'),
                    (t.ends[p] = t.ends[m] = 0),
                    t.jQ.empty(),
                    delete e.selection,
                    e.insAtRightEnd(t),
                    this
                  )
                }),
                (t.cmd = function(t) {
                  var e = this.__controller.notify(),
                    n = e.cursor
                  if (/^\\[a-z]+$/i.test(t) && !n.isTooDeep()) {
                    t = t.slice(1)
                    var i = w[t]
                    i &&
                      ((t = i(t)),
                      n.selection && t.replaces(n.replaceSelection()),
                      t.createLeftOf(n.show()),
                      this.__controller.scrollHoriz())
                  } else n.parent.write(n, t)
                  return e.blurred && n.hide().parent.blur(), this
                }),
                (t.select = function() {
                  var t = this.__controller
                  for (
                    t.notify('move').cursor.insAtRightEnd(t.root);
                    t.cursor[p];

                  )
                    t.selectLeft()
                  return this
                }),
                (t.clearSelection = function() {
                  return this.__controller.cursor.clearSelection(), this
                }),
                (t.moveToDirEnd = function(t) {
                  return (
                    this.__controller
                      .notify('move')
                      .cursor.insAtDirEnd(t, this.__controller.root),
                    this
                  )
                }),
                (t.moveToLeftEnd = function() {
                  return this.moveToDirEnd(p)
                }),
                (t.moveToRightEnd = function() {
                  return this.moveToDirEnd(m)
                }),
                (t.keystroke = function(t) {
                  t = t.replace(/^\s+|\s+$/g, '').split(/\s+/)
                  for (var e = 0; e < t.length; e += 1)
                    this.__controller.keystroke(t[e], { preventDefault: s })
                  return this
                }),
                (t.typedText = function(t) {
                  for (var e = 0; e < t.length; e += 1)
                    this.__controller.typedText(t.charAt(e))
                  return this
                }),
                (t.dropEmbedded = function(t, e, n) {
                  var r = t - v(i).scrollLeft(),
                    o = e - v(i).scrollTop(),
                    s = document.elementFromPoint(r, o)
                  this.__controller.seek(v(s), t, e),
                    bt()
                      .setOptions(n)
                      .createLeftOf(this.__controller.cursor)
                }),
                (t.clickAt = function(t, n, i) {
                  i = i || document.elementFromPoint(t, n)
                  var r = this.__controller,
                    o = r.root
                  return (
                    e.contains(o.jQ[0], i) || (i = o.jQ[0]),
                    r.seek(v(i), t + pageXOffset, n + pageYOffset),
                    r.blurred && this.focus(),
                    this
                  )
                }),
                (t.ignoreNextMousedown = function(t) {
                  return (
                    (this.__controller.cursor.options.ignoreNextMousedown = t),
                    this
                  )
                })
            })),
            (r.EditableField = function() {
              throw "wtf don't call me, I'm 'abstract'"
            }),
            (r.EditableField.prototype = o.EditableField.prototype),
            E))
              !(function(e, n) {
                var i = (o[e] = n(o))
                ;(r[e] = function(n, o) {
                  var s = r(n)
                  if (s instanceof i || !n || !n.nodeType) return s
                  var a = S(i.RootBlock(), v(n), j())
                  return (a.KIND_OF_MQ = e), i(a).__mathquillify(o, t)
                }),
                  (r[e].prototype = i.prototype)
              })(c, E[c])
            return r
          }
          _.noConflict = function() {
            return (i.MathQuill = R), _
          }
          var R = i.MathQuill
          function z(t) {
            for (
              var e = 'moveOutOf deleteOutOf selectOutOf upOutOf downOutOf'.split(
                  ' '
                ),
                n = 0;
              n < e.length;
              n += 1
            )
              !(function(e) {
                t[e] = function(t) {
                  this.controller.handle(e, t)
                }
              })(e[n])
            t.reflow = function() {
              this.controller.handle('reflow'),
                this.controller.handle('edited'),
                this.controller.handle('edit')
            }
          }
          i.MathQuill = _
          var F = (function() {
              var t = {
                8: 'Backspace',
                9: 'Tab',
                10: 'Enter',
                13: 'Enter',
                16: 'Shift',
                17: 'Control',
                18: 'Alt',
                20: 'CapsLock',
                27: 'Esc',
                32: 'Spacebar',
                33: 'PageUp',
                34: 'PageDown',
                35: 'End',
                36: 'Home',
                37: 'Left',
                38: 'Up',
                39: 'Right',
                40: 'Down',
                45: 'Insert',
                46: 'Del',
                144: 'NumLock'
              }
              return function(n, i) {
                var r,
                  o = null,
                  a = null,
                  l = e(n),
                  c = e(i.container || l),
                  u = s
                function f(t) {
                  ;(u = t), clearTimeout(r), (r = setTimeout(t))
                }
                function d(t) {
                  f(function(e) {
                    ;(u = s), clearTimeout(r), t(e)
                  })
                }
                c.bind('keydown keypress input keyup focusout paste', function(
                  t
                ) {
                  u(t)
                })
                var h = !1
                function p() {
                  var e, n, r, s, a
                  i.keystroke(
                    ((r = (e = o).which || e.keyCode),
                    (s = t[r]),
                    (a = []),
                    e.ctrlKey && a.push('Ctrl'),
                    e.originalEvent &&
                      e.originalEvent.metaKey &&
                      a.push('Meta'),
                    e.altKey && a.push('Alt'),
                    e.shiftKey && a.push('Shift'),
                    (n = s || String.fromCharCode(r)),
                    a.length || s ? (a.push(n), a.join('-')) : n),
                    o
                  )
                }
                function m() {
                  if (
                    !(
                      'selectionStart' in (t = l[0]) &&
                      t.selectionStart !== t.selectionEnd
                    )
                  ) {
                    var t,
                      e = l.val()
                    1 === e.length
                      ? (l.val(''), i.typedText(e))
                      : e && l[0].select && l[0].select()
                  }
                }
                function g() {
                  var t = l.val()
                  l.val(''), t && i.paste(t)
                }
                return (
                  c.bind({
                    keydown: function(t) {
                      ;(o = t),
                        (a = null),
                        h &&
                          d(function(t) {
                            ;(t && 'focusout' === t.type) ||
                              !l[0].select ||
                              l[0].select()
                          }),
                        p()
                    },
                    keypress: function(t) {
                      o && a && p(), (a = t), f(m)
                    },
                    keyup: function(t) {
                      o && !a && f(m)
                    },
                    focusout: function() {
                      o = a = null
                    },
                    cut: function() {
                      d(function() {
                        i.cut()
                      })
                    },
                    copy: function() {
                      d(function() {
                        i.copy()
                      })
                    },
                    paste: function(t) {
                      l.focus(), f(g)
                    }
                  }),
                  {
                    select: function(t) {
                      u(),
                        (u = s),
                        clearTimeout(r),
                        l.val(t),
                        t && l[0].select && l[0].select(),
                        (h = !!t)
                    }
                  }
                )
              }
            })(),
            I = h(function(t, e, n) {
              function i(t, e) {
                throw 'Parse Error: ' +
                  e +
                  ' at ' +
                  (t = t ? "'" + t + "'" : 'EOF')
              }
              ;(t.init = function(t) {
                this._ = t
              }),
                (t.parse = function(t) {
                  return this.skip(s)._(
                    '' + t,
                    function(t, e) {
                      return e
                    },
                    i
                  )
                }),
                (t.or = function(t) {
                  d('or is passed a parser', t instanceof n)
                  var e = this
                  return n(function(n, i, r) {
                    return e._(n, i, function(e) {
                      return t._(n, i, r)
                    })
                  })
                }),
                (t.then = function(t) {
                  var e = this
                  return n(function(i, r, o) {
                    return e._(
                      i,
                      function(e, i) {
                        var s = t instanceof n ? t : t(i)
                        return (
                          d('a parser is returned', s instanceof n),
                          s._(e, r, o)
                        )
                      },
                      o
                    )
                  })
                }),
                (t.many = function() {
                  var t = this
                  return n(function(e, n, i) {
                    for (var r = []; t._(e, o, s); );
                    return n(e, r)
                    function o(t, n) {
                      return (e = t), r.push(n), !0
                    }
                    function s() {
                      return !1
                    }
                  })
                }),
                (t.times = function(t, e) {
                  arguments.length < 2 && (e = t)
                  var i = this
                  return n(function(n, r, o) {
                    for (var s, a = [], l = !0, c = 0; c < t; c += 1)
                      if (!(l = i._(n, u, f))) return o(n, s)
                    for (; c < e && l; c += 1) l = i._(n, u, d)
                    return r(n, a)
                    function u(t, e) {
                      return a.push(e), (n = t), !0
                    }
                    function f(t, e) {
                      return (s = e), (n = t), !1
                    }
                    function d(t, e) {
                      return !1
                    }
                  })
                }),
                (t.result = function(t) {
                  return this.then(o(t))
                }),
                (t.atMost = function(t) {
                  return this.times(0, t)
                }),
                (t.atLeast = function(t) {
                  var e = this
                  return e.times(t).then(function(t) {
                    return e.many().map(function(e) {
                      return t.concat(e)
                    })
                  })
                }),
                (t.map = function(t) {
                  return this.then(function(e) {
                    return o(t(e))
                  })
                }),
                (t.skip = function(t) {
                  return this.then(function(e) {
                    return t.result(e)
                  })
                })
              this.string = function(t) {
                var e = t.length,
                  i = "expected '" + t + "'"
                return n(function(n, r, o) {
                  var s = n.slice(0, e)
                  return s === t ? r(n.slice(e), s) : o(n, i)
                })
              }
              var r = (this.regex = function(t) {
                  d('regexp parser is anchored', '^' === t.toString().charAt(1))
                  var e = 'expected ' + t
                  return n(function(n, i, r) {
                    var o = t.exec(n)
                    if (o) {
                      var s = o[0]
                      return i(n.slice(s.length), s)
                    }
                    return r(n, e)
                  })
                }),
                o = (n.succeed = function(t) {
                  return n(function(e, n) {
                    return n(e, t)
                  })
                }),
                s = ((n.fail = function(t) {
                  return n(function(e, n, i) {
                    return i(e, t)
                  })
                }),
                (n.letter = r(/^[a-z]/i)),
                (n.letters = r(/^[a-z]*/i)),
                (n.digit = r(/^[0-9]/)),
                (n.digits = r(/^[0-9]*/)),
                (n.whitespace = r(/^\s+/)),
                (n.optWhitespace = r(/^\s*/)),
                (n.any = n(function(t, e, n) {
                  return t
                    ? e(t.slice(1), t.charAt(0))
                    : n(t, 'expected any character')
                })),
                (n.all = n(function(t, e, n) {
                  return e('', t)
                })),
                (n.eof = n(function(t, e, n) {
                  return t ? n(t, 'expected EOF') : e(t, t)
                })))
            })
          S.open(function(t) {
            t.focusBlurEvents = function() {
              var t,
                e = this,
                n = e.root,
                r = e.cursor
              function o() {
                clearTimeout(t),
                  r.selection && r.selection.jQ.addClass('mq-blur'),
                  s()
              }
              function s() {
                r.hide().parent.blur(),
                  e.container.removeClass('mq-focused'),
                  v(i).unbind('blur', o)
              }
              e.textarea
                .focus(function() {
                  ;(e.blurred = !1),
                    clearTimeout(t),
                    e.container.addClass('mq-focused'),
                    r.parent || r.insAtRightEnd(n),
                    r.selection
                      ? (r.selection.jQ.removeClass('mq-blur'),
                        e.selectionChanged())
                      : r.show()
                })
                .blur(function() {
                  ;(e.blurred = !0),
                    (t = setTimeout(function() {
                      n.postOrder('intentionalBlur'),
                        r.clearSelection().endSelection(),
                        s()
                    })),
                    v(i).bind('blur', o)
                }),
                (e.blurred = !0),
                r.hide().parent.blur()
            }
          }),
            S.open(function(t, e) {
              t.exportText = function() {
                return this.root.foldChildren('', function(t, e) {
                  return t + e.text()
                })
              }
            }),
            S.open(function(e) {
              ;(j.p.ignoreNextMousedown = s),
                (e.delegateMouseEvents = function() {
                  var e = this.root.jQ
                  this.container.bind('mousedown.mathquill', function(i) {
                    var r,
                      o = v(i.target).closest('.mq-root-block'),
                      a = b.byId[o.attr(n) || e.attr(n)].controller,
                      l = a.cursor,
                      c = l.blink,
                      u = a.textareaSpan,
                      f = a.textarea
                    ;(i.preventDefault(),
                    (i.target.unselectable = !0),
                    l.options.ignoreNextMousedown(i)) ||
                      ((l.options.ignoreNextMousedown = s),
                      a.blurred && (a.editable || o.prepend(u), f.focus()),
                      (l.blink = s),
                      a
                        .seek(v(i.target), i.pageX, i.pageY)
                        .cursor.startSelection(),
                      o.mousemove(d),
                      v(i.target.ownerDocument)
                        .mousemove(h)
                        .mouseup(function t(e) {
                          ;(l.blink = c),
                            l.selection || (a.editable ? l.show() : u.detach()),
                            o.unbind('mousemove', d),
                            v(e.target.ownerDocument)
                              .unbind('mousemove', h)
                              .unbind('mouseup', t)
                        }))
                    function d(t) {
                      r = v(t.target)
                    }
                    function h(e) {
                      l.anticursor || l.startSelection(),
                        a.seek(r, e.pageX, e.pageY).cursor.select(),
                        (r = t)
                    }
                  })
                })
            }),
            S.open(function(t) {
              t.seek = function(t, e, i) {
                var r = this.notify('select').cursor
                if (t) {
                  var o = t.attr(n) || t.attr('mathquill-command-id')
                  if (!o) {
                    var s = t.parent()
                    o = s.attr(n) || s.attr('mathquill-command-id')
                  }
                }
                var a = o ? b.byId[o] : this.root
                return (
                  d('nodeId is the id of some Node that exists', a),
                  r.clearSelection().show(),
                  a.seek(e, r),
                  this.scrollHoriz(),
                  this
                )
              }
            }),
            S.open(function(t) {
              t.keystroke = function(t, e) {
                this.cursor.parent.keystroke(t, e, this)
              }
            }),
            b.open(function(t) {
              ;(t.keystroke = function(t, e, n) {
                var i = n.cursor
                switch (t) {
                  case 'Ctrl-Shift-Backspace':
                  case 'Ctrl-Backspace':
                    n.ctrlDeleteDir(p)
                    break
                  case 'Shift-Backspace':
                  case 'Backspace':
                    n.backspace()
                    break
                  case 'Esc':
                  case 'Tab':
                    return void n.escapeDir(m, t, e)
                  case 'Shift-Tab':
                  case 'Shift-Esc':
                    return void n.escapeDir(p, t, e)
                  case 'End':
                    n.notify('move').cursor.insAtRightEnd(i.parent)
                    break
                  case 'Ctrl-End':
                    n.notify('move').cursor.insAtRightEnd(n.root)
                    break
                  case 'Shift-End':
                    for (; i[m]; ) n.selectRight()
                    break
                  case 'Ctrl-Shift-End':
                    for (; i[m] || i.parent !== n.root; ) n.selectRight()
                    break
                  case 'Home':
                    n.notify('move').cursor.insAtLeftEnd(i.parent)
                    break
                  case 'Ctrl-Home':
                    n.notify('move').cursor.insAtLeftEnd(n.root)
                    break
                  case 'Shift-Home':
                    for (; i[p]; ) n.selectLeft()
                    break
                  case 'Ctrl-Shift-Home':
                    for (; i[p] || i.parent !== n.root; ) n.selectLeft()
                    break
                  case 'Left':
                    n.moveLeft()
                    break
                  case 'Shift-Left':
                    n.selectLeft()
                    break
                  case 'Ctrl-Left':
                    break
                  case 'Right':
                    n.moveRight()
                    break
                  case 'Shift-Right':
                    n.selectRight()
                    break
                  case 'Ctrl-Right':
                    break
                  case 'Up':
                    n.moveUp()
                    break
                  case 'Down':
                    n.moveDown()
                    break
                  case 'Shift-Up':
                    if (i[p]) for (; i[p]; ) n.selectLeft()
                    else n.selectLeft()
                  case 'Shift-Down':
                    if (i[m]) for (; i[m]; ) n.selectRight()
                    else n.selectRight()
                  case 'Ctrl-Up':
                  case 'Ctrl-Down':
                    break
                  case 'Ctrl-Shift-Del':
                  case 'Ctrl-Del':
                    n.ctrlDeleteDir(m)
                    break
                  case 'Shift-Del':
                  case 'Del':
                    n.deleteForward()
                    break
                  case 'Meta-A':
                  case 'Ctrl-A':
                    for (n.notify('move').cursor.insAtRightEnd(n.root); i[p]; )
                      n.selectLeft()
                    break
                  default:
                    return
                }
                e.preventDefault(), n.scrollHoriz()
              }),
                (t.moveOutOf = t.moveTowards = t.deleteOutOf = t.deleteTowards = t.unselectInto = t.selectOutOf = t.selectTowards = function() {
                  d('overridden or never called on this node')
                })
            }),
            S.open(function(t) {
              function e(t, e) {
                var n = t.notify('upDown').cursor,
                  i = e + 'Into',
                  r = e + 'OutOf'
                return (
                  n[m][i]
                    ? n.insAtLeftEnd(n[m][i])
                    : n[p][i]
                    ? n.insAtRightEnd(n[p][i])
                    : n.parent.bubble(function(t) {
                        var e = t[r]
                        if (
                          e &&
                          ('function' == typeof e && (e = t[r](n)),
                          e instanceof b && n.jumpUpDown(t, e),
                          !0 !== e)
                        )
                          return !1
                      }),
                  t
                )
              }
              this.onNotify(function(t) {
                ;('move' !== t && 'upDown' !== t) ||
                  this.show().clearSelection()
              }),
                (t.escapeDir = function(t, e, n) {
                  g(t)
                  var i = this.cursor
                  if (
                    (i.parent !== this.root && n.preventDefault(),
                    i.parent !== this.root)
                  )
                    return i.parent.moveOutOf(t, i), this.notify('move')
                }),
                (O.leftRightIntoCmdGoes = function(t) {
                  if (t && 'up' !== t && 'down' !== t)
                    throw '"up" or "down" required for leftRightIntoCmdGoes option, got "' +
                      t +
                      '"'
                  return t
                }),
                (t.moveDir = function(t) {
                  g(t)
                  var e = this.cursor,
                    n = e.options.leftRightIntoCmdGoes
                  return (
                    e.selection
                      ? e.insDirOf(t, e.selection.ends[t])
                      : e[t]
                      ? e[t].moveTowards(t, e, n)
                      : e.parent.moveOutOf(t, e, n),
                    this.notify('move')
                  )
                }),
                (t.moveLeft = function() {
                  return this.moveDir(p)
                }),
                (t.moveRight = function() {
                  return this.moveDir(m)
                }),
                (t.moveUp = function() {
                  return e(this, 'up')
                }),
                (t.moveDown = function() {
                  return e(this, 'down')
                }),
                this.onNotify(function(t) {
                  'upDown' !== t && (this.upDownCache = {})
                }),
                this.onNotify(function(t) {
                  'edit' === t && this.show().deleteSelection()
                }),
                (t.deleteDir = function(t) {
                  g(t)
                  var e = this.cursor,
                    n = e.selection
                  return (
                    this.notify('edit'),
                    n ||
                      (e[t]
                        ? e[t].deleteTowards(t, e)
                        : e.parent.deleteOutOf(t, e)),
                    e[p].siblingDeleted && e[p].siblingDeleted(e.options, m),
                    e[m].siblingDeleted && e[m].siblingDeleted(e.options, p),
                    e.parent.bubble('reflow'),
                    this
                  )
                }),
                (t.ctrlDeleteDir = function(t) {
                  g(t)
                  var e = this.cursor
                  return !e[t] || e.selection
                    ? this.deleteDir(t)
                    : (this.notify('edit'),
                      t === p
                        ? q(e.parent.ends[p], e[p]).remove()
                        : q(e[m], e.parent.ends[m]).remove(),
                      e.insAtDirEnd(t, e.parent),
                      e[p].siblingDeleted && e[p].siblingDeleted(e.options, m),
                      e[m].siblingDeleted && e[m].siblingDeleted(e.options, p),
                      e.parent.bubble('reflow'),
                      this)
                }),
                (t.backspace = function() {
                  return this.deleteDir(p)
                }),
                (t.deleteForward = function() {
                  return this.deleteDir(m)
                }),
                this.onNotify(function(t) {
                  'select' !== t && this.endSelection()
                }),
                (t.selectDir = function(t) {
                  var e = this.notify('select').cursor,
                    n = e.selection
                  g(t), e.anticursor || e.startSelection()
                  var i = e[t]
                  i
                    ? n && n.ends[t] === i && e.anticursor[-t] !== i
                      ? i.unselectInto(t, e)
                      : i.selectTowards(t, e)
                    : e.parent.selectOutOf(t, e),
                    e.clearSelection(),
                    e.select() || e.show()
                }),
                (t.selectLeft = function() {
                  return this.selectDir(p)
                }),
                (t.selectRight = function() {
                  return this.selectDir(m)
                })
            }),
            S.open(function(n) {
              ;(j.p.substituteTextarea = function() {
                return v(
                  '<textarea autocapitalize=off autocomplete=off autocorrect=off spellcheck=false x-palm-disable-ste-all=true />'
                )[0]
              }),
                (n.createTextarea = function() {
                  var t = (this.textareaSpan = v(
                      '<span class="mq-textarea"></span>'
                    )),
                    e = this.options.substituteTextarea()
                  if (!e.nodeType)
                    throw 'substituteTextarea() must return a DOM element, got ' +
                      e
                  e = this.textarea = v(e).appendTo(t)
                  var n = this
                  n.cursor.selectionChanged = function() {
                    n.selectionChanged()
                  }
                }),
                (n.selectionChanged = function() {
                  var e = this
                  nt(e.container[0]),
                    e.textareaSelectionTimeout === t &&
                      (e.textareaSelectionTimeout = setTimeout(function() {
                        e.setTextareaSelection()
                      }))
                }),
                (n.setTextareaSelection = function() {
                  this.textareaSelectionTimeout = t
                  var e = ''
                  this.cursor.selection &&
                    ((e = this.cursor.selection.join('latex')),
                    this.options.statelessClipboard && (e = '$' + e + '$')),
                    this.selectFn(e)
                }),
                (n.staticMathTextareaEvents = function() {
                  var t = this,
                    n = (t.root, t.cursor),
                    i = t.textarea,
                    r = t.textareaSpan
                  function o() {
                    r.detach(), (t.blurred = !0)
                  }
                  this.container.prepend(
                    e('<span class="mq-selectable">').text(
                      '$' + t.exportLatex() + '$'
                    )
                  ),
                    (t.blurred = !0),
                    i
                      .bind('cut paste', !1)
                      .bind('copy', function() {
                        t.setTextareaSelection()
                      })
                      .focus(function() {
                        t.blurred = !1
                      })
                      .blur(function() {
                        n.selection && n.selection.clear(), setTimeout(o)
                      }),
                    (t.selectFn = function(t) {
                      i.val(t), t && i.select()
                    })
                }),
                (j.p.substituteKeyboardEvents = F),
                (n.editablesTextareaEvents = function() {
                  var t = this.textarea,
                    e = this.textareaSpan,
                    n = this.options.substituteKeyboardEvents(t, this)
                  ;(this.selectFn = function(t) {
                    n.select(t)
                  }),
                    this.container.prepend(e),
                    this.focusBlurEvents()
                }),
                (n.typedText = function(t) {
                  if ('\n' === t) return this.handle('enter')
                  var e = this.notify().cursor
                  e.parent.write(e, t), this.scrollHoriz()
                }),
                (n.cut = function() {
                  var t = this,
                    e = t.cursor
                  e.selection &&
                    setTimeout(function() {
                      t.notify('edit'), e.parent.bubble('reflow')
                    })
                }),
                (n.copy = function() {
                  this.setTextareaSelection()
                }),
                (n.paste = function(t) {
                  this.options.statelessClipboard &&
                    (t =
                      '$' === t.slice(0, 1) && '$' === t.slice(-1)
                        ? t.slice(1, -1)
                        : '\\text{' + t + '}'),
                    this.writeLatex(t).cursor.show()
                })
            })
          var H = (function() {
            function t(t) {
              for (var e = t[0] || U(), n = 1; n < t.length; n += 1)
                t[n].children().adopt(e, e.ends[m], 0)
              return e
            }
            var e = I.string,
              n = I.regex,
              i = I.letter,
              r = I.any,
              o = I.optWhitespace,
              s = I.succeed,
              a = I.fail,
              l = i.map(function(t) {
                return wt(t)
              }),
              c = n(/^[^${}\\_^]/).map(function(t) {
                return W(t)
              }),
              u = n(/^[^\\a-eg-zA-Z]/)
                .or(
                  e('\\').then(
                    n(/^[a-z]+/i)
                      .or(n(/^\s+/).result(' '))
                      .or(r)
                  )
                )
                .then(function(t) {
                  var e = w[t]
                  return e ? e(t).parser() : a('unknown command: \\' + t)
                })
                .or(l)
                .or(c),
              f = e('{')
                .then(function() {
                  return h
                })
                .skip(e('}')),
              d = o.then(
                f.or(
                  u.map(function(t) {
                    var e = U()
                    return t.adopt(e, 0, 0), e
                  })
                )
              ),
              h = d
                .many()
                .map(t)
                .skip(o),
              p = e('[')
                .then(
                  d
                    .then(function(t) {
                      return ']' !== t.join('latex') ? s(t) : a()
                    })
                    .many()
                    .map(t)
                    .skip(o)
                )
                .skip(e(']')),
              g = h
            return (g.block = d), (g.optBlock = p), g
          })()
          S.open(function(e, n) {
            ;(e.exportLatex = function() {
              return this.root.latex().replace(/(\\[a-z]+) (?![a-z])/gi, '$1')
            }),
              (O.maxDepth = function(e) {
                return 'number' == typeof e ? e : t
              }),
              (e.writeLatex = function(t) {
                var e = this.notify('edit').cursor,
                  n = I.all,
                  i = I.eof,
                  r = H.skip(i)
                    .or(n.result(!1))
                    .parse(t)
                r &&
                  !r.isEmpty() &&
                  r.prepareInsertionAt(e) &&
                  (r.children().adopt(e.parent, e[p], e[m]),
                  r.jQize().insertBefore(e.jQ),
                  (e[p] = r.ends[m]),
                  r.finalizeInsert(e.options, e),
                  r.ends[m][m].siblingCreated &&
                    r.ends[m][m].siblingCreated(e.options, p),
                  r.ends[p][p].siblingCreated &&
                    r.ends[p][p].siblingCreated(e.options, m),
                  e.parent.bubble('reflow'))
                return this
              }),
              (e.renderLatexMath = function(t) {
                var e = this.root,
                  n = this.cursor,
                  i = (n.options, e.jQ),
                  r = I.all,
                  o = I.eof,
                  s = H.skip(o)
                    .or(r.result(!1))
                    .parse(t)
                if (
                  (e.eachChild('postOrder', 'dispose'),
                  (e.ends[p] = e.ends[m] = 0),
                  s && s.prepareInsertionAt(n))
                ) {
                  s.children().adopt(e, 0, 0)
                  var a = s.join('html')
                  i.html(a), e.jQize(i.children()), e.finalizeInsert(n.options)
                } else i.empty()
                delete n.selection, n.insAtRightEnd(e)
              }),
              (e.renderLatexText = function(t) {
                var e = this.root,
                  n = this.cursor
                e.jQ
                  .children()
                  .slice(1)
                  .remove(),
                  e.eachChild('postOrder', 'dispose'),
                  (e.ends[p] = e.ends[m] = 0),
                  delete n.selection,
                  n.show().insAtRightEnd(e)
                var i = I.regex,
                  r = I.string,
                  o = I.eof,
                  s = I.all,
                  a = r('$')
                    .then(H)
                    .skip(r('$').or(o))
                    .map(function(t) {
                      var e = J(n)
                      e.createBlocks()
                      var i = e.ends[p]
                      return t.children().adopt(i, 0, 0), e
                    }),
                  l = r('\\$')
                    .result('$')
                    .or(i(/^[^$]/))
                    .map(W),
                  c = a
                    .or(l)
                    .many()
                    .skip(o)
                    .or(s.result(!1))
                    .parse(t)
                if (c) {
                  for (var u = 0; u < c.length; u += 1)
                    c[u].adopt(e, e.ends[m], 0)
                  e.jQize().appendTo(e.jQ), e.finalizeInsert(n.options)
                }
              })
          }),
            S.open(function(t) {
              t.scrollHoriz = function() {
                var t = this.cursor,
                  e = t.selection,
                  n = this.root.jQ[0].getBoundingClientRect()
                if (e) {
                  var i = e.jQ[0].getBoundingClientRect(),
                    r = i.left - (n.left + 20),
                    o = i.right - (n.right - 20)
                  if (e.ends[p] === t[m])
                    if (r < 0) a = r
                    else {
                      if (!(o > 0)) return
                      if (i.left - o < n.left + 20) a = r
                      else a = o
                    }
                  else if (o > 0) a = o
                  else {
                    if (!(r < 0)) return
                    if (i.right - r > n.right - 20) a = o
                    else a = r
                  }
                } else {
                  var s = t.jQ[0].getBoundingClientRect().left
                  if (s > n.right - 20) var a = s - (n.right - 20)
                  else {
                    if (!(s < n.left + 20)) return
                    var a = s - (n.left + 20)
                  }
                }
                this.root.jQ.stop().animate({ scrollLeft: '+=' + a }, 100)
              }
            })
          var B = h(b, function(e, n) {
              ;(e.finalizeInsert = function(t, e) {
                this.postOrder('finalizeTree', t),
                  this.postOrder('contactWeld', e),
                  this.postOrder('blur'),
                  this.postOrder('reflow'),
                  this[m].siblingCreated && this[m].siblingCreated(t, p),
                  this[p].siblingCreated && this[p].siblingCreated(t, m),
                  this.bubble('reflow')
              }),
                (e.prepareInsertionAt = function(e) {
                  var n = e.options.maxDepth
                  if (n !== t) {
                    var i = e.depth()
                    if (i > n) return !1
                    this.removeNodesDeeperThan(n - i)
                  }
                  return !0
                }),
                (e.removeNodesDeeperThan = function(t) {
                  for (var e, n = 0, i = [[this, n]]; i.length; )
                    (e = i.shift())[0].children().each(function(r) {
                      var o = r instanceof U ? 1 : 0
                      ;(n = e[1] + o) <= t
                        ? i.push([r, n])
                        : (o ? r.children() : r).remove()
                    })
                })
            }),
            P = h(B, function(t, e) {
              ;(t.init = function(t, n, i) {
                e.init.call(this),
                  this.ctrlSeq || (this.ctrlSeq = t),
                  n && (this.htmlTemplate = n),
                  i && (this.textTemplate = i)
              }),
                (t.replaces = function(t) {
                  t.disown(), (this.replacedFragment = t)
                }),
                (t.isEmpty = function() {
                  return this.foldChildren(!0, function(t, e) {
                    return t && e.isEmpty()
                  })
                }),
                (t.parser = function() {
                  var t = H.block,
                    e = this
                  return t.times(e.numBlocks()).map(function(t) {
                    e.blocks = t
                    for (var n = 0; n < t.length; n += 1)
                      t[n].adopt(e, e.ends[m], 0)
                    return e
                  })
                }),
                (t.createLeftOf = function(t) {
                  var n = this.replacedFragment
                  this.createBlocks(),
                    e.createLeftOf.call(this, t),
                    n &&
                      (n.adopt(this.ends[p], 0, 0),
                      n.jQ.appendTo(this.ends[p].jQ),
                      this.placeCursor(t),
                      this.prepareInsertionAt(t)),
                    this.finalizeInsert(t.options),
                    this.placeCursor(t)
                }),
                (t.createBlocks = function() {
                  for (
                    var t = this.numBlocks(),
                      e = (this.blocks = Array(t)),
                      n = 0;
                    n < t;
                    n += 1
                  ) {
                    ;(e[n] = U()).adopt(this, this.ends[m], 0)
                  }
                }),
                (t.placeCursor = function(t) {
                  t.insAtRightEnd(
                    this.foldChildren(this.ends[p], function(t, e) {
                      return t.isEmpty() ? t : e
                    })
                  )
                }),
                (t.moveTowards = function(t, e, n) {
                  var i = n && this[n + 'Into']
                  e.insAtDirEnd(-t, i || this.ends[-t])
                }),
                (t.deleteTowards = function(t, e) {
                  this.isEmpty()
                    ? (e[t] = this.remove()[t])
                    : this.moveTowards(t, e, null)
                }),
                (t.selectTowards = function(t, e) {
                  ;(e[-t] = this), (e[t] = this[t])
                }),
                (t.selectChildren = function() {
                  return C(this, this)
                }),
                (t.unselectInto = function(t, e) {
                  e.insAtDirEnd(-t, e.anticursor.ancestors[this.id])
                }),
                (t.seek = function(t, e) {
                  function n(t) {
                    var e = {}
                    return (
                      (e[p] = t.jQ.offset().left),
                      (e[m] = e[p] + t.jQ.outerWidth()),
                      e
                    )
                  }
                  var i = this,
                    r = n(i)
                  if (t < r[p]) return e.insLeftOf(i)
                  if (t > r[m]) return e.insRightOf(i)
                  var o = r[p]
                  i.eachChild(function(s) {
                    var a = n(s)
                    return t < a[p]
                      ? (t - o < a[p] - t
                          ? s[p]
                            ? e.insAtRightEnd(s[p])
                            : e.insLeftOf(i)
                          : e.insAtLeftEnd(s),
                        !1)
                      : t > a[m]
                      ? void (s[m]
                          ? (o = a[m])
                          : r[m] - t < t - a[m]
                          ? e.insRightOf(i)
                          : e.insAtRightEnd(s))
                      : (s.seek(t, e), !1)
                  })
                }),
                (t.numBlocks = function() {
                  var t = this.htmlTemplate.match(/&\d+/g)
                  return t ? t.length : 0
                }),
                (t.html = function() {
                  var t = this.blocks,
                    e = ' mathquill-command-id=' + this.id,
                    n = this.htmlTemplate.match(/<[^<>]+>|[^<>]+/g)
                  d(
                    'no unmatched angle brackets',
                    n.join('') === this.htmlTemplate
                  )
                  for (var i = 0, r = n[0]; r; r = n[(i += 1)])
                    if ('/>' === r.slice(-2)) n[i] = r.slice(0, -2) + e + '/>'
                    else if ('<' === r.charAt(0)) {
                      d(
                        'not an unmatched top-level close tag',
                        '/' !== r.charAt(1)
                      ),
                        (n[i] = r.slice(0, -1) + e + '>')
                      var o = 1
                      do {
                        d('no missing close tags', (r = n[(i += 1)])),
                          '</' === r.slice(0, 2)
                            ? (o -= 1)
                            : '<' === r.charAt(0) &&
                              '/>' !== r.slice(-2) &&
                              (o += 1)
                      } while (o > 0)
                    }
                  return n.join('').replace(/>&(\d+)/g, function(e, n) {
                    return (
                      ' mathquill-block-id=' + t[n].id + '>' + t[n].join('html')
                    )
                  })
                }),
                (t.latex = function() {
                  return this.foldChildren(this.ctrlSeq, function(t, e) {
                    return t + '{' + (e.latex() || ' ') + '}'
                  })
                }),
                (t.textTemplate = ['']),
                (t.text = function() {
                  var t = this,
                    e = 0
                  return t.foldChildren(t.textTemplate[e], function(n, i) {
                    e += 1
                    var r = i.text()
                    return n &&
                      '(' === t.textTemplate[e] &&
                      '(' === r[0] &&
                      ')' === r.slice(-1)
                      ? n + r.slice(1, -1) + t.textTemplate[e]
                      : n + r + (t.textTemplate[e] || '')
                  })
                })
            }),
            $ = h(P, function(t, e) {
              ;(t.init = function(t, n, i) {
                i || (i = t && t.length > 1 ? t.slice(1) : t),
                  e.init.call(this, t, n, [i])
              }),
                (t.parser = function() {
                  return I.succeed(this)
                }),
                (t.numBlocks = function() {
                  return 0
                }),
                (t.replaces = function(t) {
                  t.remove()
                }),
                (t.createBlocks = s),
                (t.moveTowards = function(t, e) {
                  e.jQ.insDirOf(t, this.jQ), (e[-t] = this), (e[t] = this[t])
                }),
                (t.deleteTowards = function(t, e) {
                  e[t] = this.remove()[t]
                }),
                (t.seek = function(t, e) {
                  t - this.jQ.offset().left < this.jQ.outerWidth() / 2
                    ? e.insLeftOf(this)
                    : e.insRightOf(this)
                }),
                (t.latex = function() {
                  return this.ctrlSeq
                }),
                (t.text = function() {
                  return this.textTemplate
                }),
                (t.placeCursor = s),
                (t.isEmpty = function() {
                  return !0
                })
            }),
            W = h($, function(t, e) {
              t.init = function(t, n) {
                e.init.call(this, t, '<span>' + (n || t) + '</span>')
              }
            }),
            X = h($, function(t, e) {
              t.init = function(t, n, i) {
                e.init.call(
                  this,
                  t,
                  '<span class="mq-binary-operator">' + n + '</span>',
                  i
                )
              }
            }),
            U = h(B, function(t, e) {
              ;(t.join = function(t) {
                return this.foldChildren('', function(e, n) {
                  return e + n[t]()
                })
              }),
                (t.html = function() {
                  return this.join('html')
                }),
                (t.latex = function() {
                  return this.join('latex')
                }),
                (t.text = function() {
                  return this.ends[p] === this.ends[m] && 0 !== this.ends[p]
                    ? this.ends[p].text()
                    : this.join('text')
                }),
                (t.keystroke = function(t, n, i) {
                  return !i.options.spaceBehavesLikeTab ||
                    ('Spacebar' !== t && 'Shift-Spacebar' !== t)
                    ? e.keystroke.apply(this, arguments)
                    : (n.preventDefault(),
                      void i.escapeDir('Shift-Spacebar' === t ? p : m, t, n))
                }),
                (t.moveOutOf = function(t, e, n) {
                  !(n && this.parent[n + 'Into']) && this[t]
                    ? e.insAtDirEnd(-t, this[t])
                    : e.insDirOf(t, this.parent)
                }),
                (t.selectOutOf = function(t, e) {
                  e.insDirOf(t, this.parent)
                }),
                (t.deleteOutOf = function(t, e) {
                  e.unwrapGramp()
                }),
                (t.seek = function(t, e) {
                  var n = this.ends[m]
                  if (!n || n.jQ.offset().left + n.jQ.outerWidth() < t)
                    return e.insAtRightEnd(this)
                  if (t < this.ends[p].jQ.offset().left)
                    return e.insAtLeftEnd(this)
                  for (; t < n.jQ.offset().left; ) n = n[p]
                  return n.seek(t, e)
                }),
                (t.chToCmd = function(t, e) {
                  var n
                  return t.match(/^[a-eg-zA-Z]$/)
                    ? wt(t)
                    : /^\d$/.test(t)
                    ? xt(t)
                    : e && e.typingSlashWritesDivisionSymbol && '/' === t
                    ? w['÷'](t)
                    : e && e.typingAsteriskWritesTimesSymbol && '*' === t
                    ? w['×'](t)
                    : (n = T[t] || w[t])
                    ? n(t)
                    : W(t)
                }),
                (t.write = function(t, e) {
                  var n = this.chToCmd(e, t.options)
                  t.selection && n.replaces(t.replaceSelection()),
                    t.isTooDeep() || n.createLeftOf(t.show())
                }),
                (t.focus = function() {
                  return (
                    this.jQ.addClass('mq-hasCursor'),
                    this.jQ.removeClass('mq-empty'),
                    this
                  )
                }),
                (t.blur = function() {
                  return (
                    this.jQ.removeClass('mq-hasCursor'),
                    this.isEmpty() && this.jQ.addClass('mq-empty'),
                    this
                  )
                })
            })
          ;(j.p.mouseEvents = !0),
            (E.StaticMath = function(t) {
              return h(t.AbstractMathQuill, function(e, n) {
                ;(this.RootBlock = U),
                  (e.__mathquillify = function(t, e) {
                    return (
                      this.config(t),
                      n.__mathquillify.call(this, 'mq-math-mode'),
                      this.__options.mouseEvents &&
                        (this.__controller.delegateMouseEvents(),
                        this.__controller.staticMathTextareaEvents()),
                      this
                    )
                  }),
                  (e.init = function() {
                    n.init.apply(this, arguments),
                      this.__controller.root.postOrder(
                        'registerInnerField',
                        (this.innerFields = []),
                        t.MathField
                      )
                  }),
                  (e.latex = function() {
                    var e = n.latex.apply(this, arguments)
                    return (
                      arguments.length > 0 &&
                        this.__controller.root.postOrder(
                          'registerInnerField',
                          (this.innerFields = []),
                          t.MathField
                        ),
                      e
                    )
                  })
              })
            })
          var V = h(U, z)
          E.MathField = function(t) {
            return h(t.EditableField, function(t, e) {
              ;(this.RootBlock = V),
                (t.__mathquillify = function(t, n) {
                  return (
                    this.config(t),
                    n > 1 && (this.__controller.root.reflow = s),
                    e.__mathquillify.call(
                      this,
                      'mq-editable-field mq-math-mode'
                    ),
                    delete this.__controller.root.reflow,
                    this
                  )
                })
            })
          }
          var Y = h(b, function(t, e) {
              function n(t) {
                t.jQ[0].normalize()
                var e = t.jQ[0].firstChild
                if (e) {
                  d(
                    'only node in TextBlock span is Text node',
                    3 === e.nodeType
                  )
                  var n = G(e.data)
                  return n.jQadd(e), t.children().disown(), n.adopt(t, 0, 0)
                }
              }
              ;(t.ctrlSeq = '\\text'),
                (t.replaces = function(t) {
                  t instanceof q
                    ? (this.replacedText = t.remove().jQ.text())
                    : 'string' == typeof t && (this.replacedText = t)
                }),
                (t.jQadd = function(t) {
                  e.jQadd.call(this, t),
                    this.ends[p] && this.ends[p].jQadd(this.jQ[0].firstChild)
                }),
                (t.createLeftOf = function(t) {
                  if (
                    (e.createLeftOf.call(this, t),
                    this[m].siblingCreated &&
                      this[m].siblingCreated(t.options, p),
                    this[p].siblingCreated &&
                      this[p].siblingCreated(t.options, m),
                    this.bubble('reflow'),
                    t.insAtRightEnd(this),
                    this.replacedText)
                  )
                    for (var n = 0; n < this.replacedText.length; n += 1)
                      this.write(t, this.replacedText.charAt(n))
                }),
                (t.parser = function() {
                  var t = this,
                    e = I.string,
                    n = I.regex
                  return I.optWhitespace
                    .then(e('{'))
                    .then(n(/^[^}]*/))
                    .skip(e('}'))
                    .map(function(e) {
                      return 0 === e.length ? q() : (G(e).adopt(t, 0, 0), t)
                    })
                }),
                (t.textContents = function() {
                  return this.foldChildren('', function(t, e) {
                    return t + e.text
                  })
                }),
                (t.text = function() {
                  return '"' + this.textContents() + '"'
                }),
                (t.latex = function() {
                  var t = this.textContents()
                  return 0 === t.length
                    ? ''
                    : '\\text{' +
                        t
                          .replace(/\\/g, '\\backslash ')
                          .replace(/[{}]/g, '\\$&') +
                        '}'
                }),
                (t.html = function() {
                  return (
                    '<span class="mq-text-mode" mathquill-command-id=' +
                    this.id +
                    '>' +
                    this.textContents() +
                    '</span>'
                  )
                }),
                (t.moveTowards = function(t, e) {
                  e.insAtDirEnd(-t, this)
                }),
                (t.moveOutOf = function(t, e) {
                  e.insDirOf(t, this)
                }),
                (t.unselectInto = t.moveTowards),
                (t.selectTowards = P.prototype.selectTowards),
                (t.deleteTowards = P.prototype.deleteTowards),
                (t.selectOutOf = function(t, e) {
                  e.insDirOf(t, this)
                }),
                (t.deleteOutOf = function(t, e) {
                  this.isEmpty() && e.insRightOf(this)
                }),
                (t.write = function(t, n) {
                  if ((t.show().deleteSelection(), '$' !== n))
                    t[p] ? t[p].appendText(n) : G(n).createLeftOf(t)
                  else if (this.isEmpty())
                    t.insRightOf(this), W('\\$', '$').createLeftOf(t)
                  else if (t[m])
                    if (t[p]) {
                      var i = Y(),
                        r = this.ends[p]
                      r.disown().jQ.detach(),
                        r.adopt(i, 0, 0),
                        t.insLeftOf(this),
                        e.createLeftOf.call(i, t)
                    } else t.insLeftOf(this)
                  else t.insRightOf(this)
                }),
                (t.seek = function(t, e) {
                  e.hide()
                  var i = n(this),
                    r = this.jQ.width() / this.text.length,
                    o = Math.round((t - this.jQ.offset().left) / r)
                  o <= 0
                    ? e.insAtLeftEnd(this)
                    : o >= i.text.length
                    ? e.insAtRightEnd(this)
                    : e.insLeftOf(i.splitRight(o))
                  for (
                    var s = t - e.show().offset().left,
                      a = s && s < 0 ? p : m,
                      l = a;
                    e[a] && s * l > 0;

                  )
                    e[a].moveTowards(a, e), (l = s), (s = t - e.offset().left)
                  if (
                    (a * s < -a * l && e[-a].moveTowards(-a, e), e.anticursor)
                  ) {
                    if (e.anticursor.parent === this) {
                      var c = e[p] && e[p].text.length
                      if (this.anticursorPosition === c)
                        e.anticursor = y.copy(e)
                      else {
                        if (this.anticursorPosition < c) {
                          var u = e[p].splitRight(this.anticursorPosition)
                          e[p] = u
                        } else u = e[m].splitRight(this.anticursorPosition - c)
                        e.anticursor = y(this, u[p], u)
                      }
                    }
                  } else this.anticursorPosition = e[p] && e[p].text.length
                }),
                (t.blur = function(t) {
                  U.prototype.blur.call(this),
                    t &&
                      ('' === this.textContents()
                        ? (this.remove(),
                          t[p] === this
                            ? (t[p] = this[p])
                            : t[m] === this && (t[m] = this[m]))
                        : n(this))
                }),
                (t.focus = U.prototype.focus)
            }),
            G = h(b, function(t, e) {
              function n(t, e) {
                return e.charAt(t === p ? 0 : -1 + e.length)
              }
              ;(t.init = function(t) {
                e.init.call(this), (this.text = t)
              }),
                (t.jQadd = function(t) {
                  ;(this.dom = t), (this.jQ = v(t))
                }),
                (t.jQize = function() {
                  return this.jQadd(document.createTextNode(this.text))
                }),
                (t.appendText = function(t) {
                  ;(this.text += t), this.dom.appendData(t)
                }),
                (t.prependText = function(t) {
                  ;(this.text = t + this.text), this.dom.insertData(0, t)
                }),
                (t.insTextAtDirEnd = function(t, e) {
                  g(e), e === m ? this.appendText(t) : this.prependText(t)
                }),
                (t.splitRight = function(t) {
                  var e = G(this.text.slice(t)).adopt(
                    this.parent,
                    this,
                    this[m]
                  )
                  return (
                    e.jQadd(this.dom.splitText(t)),
                    (this.text = this.text.slice(0, t)),
                    e
                  )
                }),
                (t.moveTowards = function(t, e) {
                  g(t)
                  var i = n(-t, this.text),
                    r = this[-t]
                  return (
                    r ? r.insTextAtDirEnd(i, t) : G(i).createDir(-t, e),
                    this.deleteTowards(t, e)
                  )
                }),
                (t.latex = function() {
                  return this.text
                }),
                (t.deleteTowards = function(t, e) {
                  this.text.length > 1
                    ? t === m
                      ? (this.dom.deleteData(0, 1),
                        (this.text = this.text.slice(1)))
                      : (this.dom.deleteData(-1 + this.text.length, 1),
                        (this.text = this.text.slice(0, -1)))
                    : (this.remove(), this.jQ.remove(), (e[t] = this[t]))
                }),
                (t.selectTowards = function(t, e) {
                  g(t)
                  var i = e.anticursor,
                    r = n(-t, this.text)
                  if (i[t] === this) {
                    var o = G(r).createDir(t, e)
                    ;(i[t] = o), e.insDirOf(t, o)
                  } else {
                    var s = this[-t]
                    if (s) s.insTextAtDirEnd(r, t)
                    else
                      (o = G(r).createDir(-t, e)).jQ.insDirOf(
                        -t,
                        e.selection.jQ
                      )
                    1 === this.text.length &&
                      i[-t] === this &&
                      (i[-t] = this[-t])
                  }
                  return this.deleteTowards(t, e)
                })
            })
          function K(t, e, n) {
            return h(Y, {
              ctrlSeq: t,
              htmlTemplate: '<' + e + ' ' + n + '>&0</' + e + '>'
            })
          }
          ;(w.text = w.textnormal = w.textrm = w.textup = w.textmd = Y),
            (w.em = w.italic = w.italics = w.emph = w.textit = w.textsl = K(
              '\\textit',
              'i',
              'class="mq-text-mode"'
            )),
            (w.strong = w.bold = w.textbf = K(
              '\\textbf',
              'b',
              'class="mq-text-mode"'
            )),
            (w.sf = w.textsf = K(
              '\\textsf',
              'span',
              'class="mq-sans-serif mq-text-mode"'
            )),
            (w.tt = w.texttt = K(
              '\\texttt',
              'span',
              'class="mq-monospace mq-text-mode"'
            )),
            (w.textsc = K(
              '\\textsc',
              'span',
              'style="font-variant:small-caps" class="mq-text-mode"'
            )),
            (w.uppercase = K(
              '\\uppercase',
              'span',
              'style="text-transform:uppercase" class="mq-text-mode"'
            )),
            (w.lowercase = K(
              '\\lowercase',
              'span',
              'style="text-transform:lowercase" class="mq-text-mode"'
            ))
          var J = h(P, function(t, e) {
              ;(t.init = function(t) {
                e.init.call(this, '$'), (this.cursor = t)
              }),
                (t.htmlTemplate = '<span class="mq-math-mode">&0</span>'),
                (t.createBlocks = function() {
                  e.createBlocks.call(this),
                    (this.ends[p].cursor = this.cursor),
                    (this.ends[p].write = function(t, e) {
                      '$' !== e
                        ? U.prototype.write.call(this, t, e)
                        : this.isEmpty()
                        ? (t.insRightOf(this.parent),
                          this.parent.deleteTowards(dir, t),
                          W('\\$', '$').createLeftOf(t.show()))
                        : t[m]
                        ? t[p]
                          ? U.prototype.write.call(this, t, e)
                          : t.insLeftOf(this.parent)
                        : t.insRightOf(this.parent)
                    })
                }),
                (t.latex = function() {
                  return '$' + this.ends[p].latex() + '$'
                })
            }),
            Z = h(V, function(t, e) {
              ;(t.keystroke = function(t) {
                if ('Spacebar' !== t && 'Shift-Spacebar' !== t)
                  return e.keystroke.apply(this, arguments)
              }),
                (t.write = function(t, e) {
                  var n
                  ;(t.show().deleteSelection(), '$' === e)
                    ? J(t).createLeftOf(t)
                    : ('<' === e ? (n = '&lt;') : '>' === e && (n = '&gt;'),
                      W(e, n).createLeftOf(t))
                })
            })
          E.TextField = function(t) {
            return h(t.EditableField, function(t, e) {
              ;(this.RootBlock = Z),
                (t.__mathquillify = function() {
                  return e.__mathquillify.call(
                    this,
                    'mq-editable-field mq-text-mode'
                  )
                }),
                (t.latex = function(t) {
                  return arguments.length > 0
                    ? (this.__controller.renderLatexText(t),
                      this.__controller.blurred &&
                        this.__controller.cursor.hide().parent.blur(),
                      this)
                    : this.__controller.exportLatex()
                })
            })
          }
          T['\\'] = h(P, function(t, e) {
            ;(t.ctrlSeq = '\\'),
              (t.replaces = function(t) {
                ;(this._replacedFragment = t.disown()),
                  (this.isEmpty = function() {
                    return !1
                  })
              }),
              (t.htmlTemplate =
                '<span class="mq-latex-command-input mq-non-leaf">\\<span>&0</span></span>'),
              (t.textTemplate = ['\\']),
              (t.createBlocks = function() {
                e.createBlocks.call(this),
                  (this.ends[p].focus = function() {
                    return (
                      this.parent.jQ.addClass('mq-hasCursor'),
                      this.isEmpty() && this.parent.jQ.removeClass('mq-empty'),
                      this
                    )
                  }),
                  (this.ends[p].blur = function() {
                    return (
                      this.parent.jQ.removeClass('mq-hasCursor'),
                      this.isEmpty() && this.parent.jQ.addClass('mq-empty'),
                      this
                    )
                  }),
                  (this.ends[p].write = function(t, e) {
                    t.show().deleteSelection(),
                      e.match(/[a-z]/i)
                        ? W(e).createLeftOf(t)
                        : (this.parent.renderCommand(t),
                          ('\\' === e && this.isEmpty()) ||
                            t.parent.write(t, e))
                  }),
                  (this.ends[p].keystroke = function(t, n, i) {
                    return 'Tab' === t || 'Enter' === t || 'Spacebar' === t
                      ? (this.parent.renderCommand(i.cursor),
                        void n.preventDefault())
                      : e.keystroke.apply(this, arguments)
                  })
              }),
              (t.createLeftOf = function(t) {
                if ((e.createLeftOf.call(this, t), this._replacedFragment)) {
                  var n = this.jQ[0]
                  this.jQ = this._replacedFragment.jQ
                    .addClass('mq-blur')
                    .bind('mousedown mousemove', function(t) {
                      return v((t.target = n)).trigger(t), !1
                    })
                    .insertBefore(this.jQ)
                    .add(this.jQ)
                }
              }),
              (t.latex = function() {
                return '\\' + this.ends[p].latex() + ' '
              }),
              (t.renderCommand = function(t) {
                ;(this.jQ = this.jQ.last()),
                  this.remove(),
                  this[m] ? t.insLeftOf(this[m]) : t.insAtRightEnd(this.parent)
                var e = this.ends[p].latex()
                e || (e = ' ')
                var n = w[e]
                n
                  ? ((n = n(e)),
                    this._replacedFragment &&
                      n.replaces(this._replacedFragment),
                    n.createLeftOf(t))
                  : ((n = Y()).replaces(e),
                    n.createLeftOf(t),
                    t.insRightOf(n),
                    this._replacedFragment && this._replacedFragment.remove())
              })
          })
          var tt,
            et,
            nt = s,
            it = document.createElement('div').style
          for (var rt in {
            transform: 1,
            WebkitTransform: 1,
            MozTransform: 1,
            OTransform: 1,
            msTransform: 1
          })
            if (rt in it) {
              et = rt
              break
            }
          et
            ? (tt = function(t, e, n) {
                t.css(et, 'scale(' + e + ',' + n + ')')
              })
            : 'filter' in it
            ? ((nt = function(t) {
                t.className = t.className
              }),
              (tt = function(t, e, n) {
                ;(e /= 1 + (n - 1) / 2),
                  t.css('fontSize', n + 'em'),
                  t.hasClass('mq-matrixed-container') ||
                    t
                      .addClass('mq-matrixed-container')
                      .wrapInner('<span class="mq-matrixed"></span>')
                var r = t
                  .children()
                  .css(
                    'filter',
                    'progid:DXImageTransform.Microsoft.Matrix(M11=' +
                      e +
                      ",SizingMethod='auto expand')"
                  )
                function o() {
                  t.css('marginRight', ((r.width() - 1) * (e - 1)) / e + 'px')
                }
                o()
                var s = setInterval(o)
                v(i).load(function() {
                  clearTimeout(s), o()
                })
              }))
            : (tt = function(t, e, n) {
                t.css('fontSize', n + 'em')
              })
          var ot = h(P, function(t, e) {
            t.init = function(t, n, i) {
              e.init.call(this, t, '<' + n + ' ' + i + '>&0</' + n + '>')
            }
          })
          ;(w.mathrm = f(ot, '\\mathrm', 'span', 'class="mq-roman mq-font"')),
            (w.mathit = f(ot, '\\mathit', 'i', 'class="mq-font"')),
            (w.mathbf = f(ot, '\\mathbf', 'b', 'class="mq-font"')),
            (w.mathsf = f(
              ot,
              '\\mathsf',
              'span',
              'class="mq-sans-serif mq-font"'
            )),
            (w.mathtt = f(
              ot,
              '\\mathtt',
              'span',
              'class="mq-monospace mq-font"'
            )),
            (w.underline = f(
              ot,
              '\\underline',
              'span',
              'class="mq-non-leaf mq-underline"'
            )),
            (w.overline = w.bar = f(
              ot,
              '\\overline',
              'span',
              'class="mq-non-leaf mq-overline"'
            )),
            (w.overrightarrow = f(
              ot,
              '\\overrightarrow',
              'span',
              'class="mq-non-leaf mq-overarrow mq-arrow-right"'
            )),
            (w.overleftarrow = f(
              ot,
              '\\overleftarrow',
              'span',
              'class="mq-non-leaf mq-overarrow mq-arrow-left"'
            )),
            (w.overleftrightarrow = f(
              ot,
              '\\overleftrightarrow',
              'span',
              'class="mq-non-leaf mq-overarrow mq-arrow-both"'
            )),
            (w.overarc = f(
              ot,
              '\\overarc',
              'span',
              'class="mq-non-leaf mq-overarc"'
            )),
            (w.dot = h(P, function(t, e) {
              t.init = function() {
                e.init.call(
                  this,
                  '\\dot',
                  '<span class="mq-non-leaf"><span class="mq-dot-recurring-inner"><span class="mq-dot-recurring">&#x2d9;</span><span class="mq-empty-box">&0</span></span></span>'
                )
              }
            }))
          ;(w.textcolor = h(P, function(t, e) {
            ;(t.setColor = function(t) {
              ;(this.color = t),
                (this.htmlTemplate =
                  '<span class="mq-textcolor" style="color:' +
                  t +
                  '">&0</span>')
            }),
              (t.latex = function() {
                return (
                  '\\textcolor{' +
                  this.color +
                  '}{' +
                  this.blocks[0].latex() +
                  '}'
                )
              }),
              (t.parser = function() {
                var t = this,
                  n = I.optWhitespace,
                  i = I.string,
                  r = I.regex
                return n
                  .then(i('{'))
                  .then(r(/^[#\w\s.,()%-]*/))
                  .skip(i('}'))
                  .then(function(n) {
                    return t.setColor(n), e.parser.call(t)
                  })
              }),
              (t.isStyleBlock = function() {
                return !0
              })
          })),
            (w.class = h(P, function(t, e) {
              ;(t.parser = function() {
                var t = this,
                  n = I.string,
                  i = I.regex
                return I.optWhitespace
                  .then(n('{'))
                  .then(i(/^[-\w\s\\\xA0-\xFF]*/))
                  .skip(n('}'))
                  .then(function(n) {
                    return (
                      (t.cls = n || ''),
                      (t.htmlTemplate =
                        '<span class="mq-class ' + n + '">&0</span>'),
                      e.parser.call(t)
                    )
                  })
              }),
                (t.latex = function() {
                  return (
                    '\\class{' + this.cls + '}{' + this.blocks[0].latex() + '}'
                  )
                }),
                (t.isStyleBlock = function() {
                  return !0
                })
            }))
          var st = h(P, function(t, e) {
            ;(t.ctrlSeq = '_{...}^{...}'),
              (t.createLeftOf = function(t) {
                if (
                  this.replacedFragment ||
                  t[p] ||
                  !t.options.supSubsRequireOperand
                )
                  return e.createLeftOf.apply(this, arguments)
              }),
              (t.contactWeld = function(t) {
                for (var e = p; e; e = e === p && m)
                  if (this[e] instanceof st) {
                    for (var n = 'sub'; n; n = 'sub' === n && 'sup') {
                      var i = this[n],
                        r = this[e][n]
                      if (i) {
                        if (r)
                          if (i.isEmpty()) s = y(r, 0, r.ends[p])
                          else {
                            i.jQ.children().insAtDirEnd(-e, r.jQ)
                            var o = i.children().disown(),
                              s = y(r, o.ends[m], r.ends[p])
                            e === p
                              ? o.adopt(r, r.ends[m], 0)
                              : o.adopt(r, 0, r.ends[p])
                          }
                        else this[e].addBlock(i.disown())
                        this.placeCursor = (function(t, n) {
                          return function(i) {
                            i.insAtDirEnd(-e, t || n)
                          }
                        })(r, i)
                      }
                    }
                    this.remove(),
                      t &&
                        t[p] === this &&
                        (e === m && s
                          ? s[p]
                            ? t.insRightOf(s[p])
                            : t.insAtLeftEnd(s.parent)
                          : t.insRightOf(this[e]))
                    break
                  }
              }),
              (j.p.charsThatBreakOutOfSupSub = ''),
              (t.finalizeTree = function() {
                this.ends[p].write = function(t, e) {
                  if (
                    t.options.autoSubscriptNumerals &&
                    this === this.parent.sub
                  ) {
                    if ('_' === e) return
                    var n = this.chToCmd(e, t.options)
                    return (
                      n instanceof $
                        ? t.deleteSelection()
                        : t.clearSelection().insRightOf(this.parent),
                      n.createLeftOf(t.show())
                    )
                  }
                  t[p] &&
                    !t[m] &&
                    !t.selection &&
                    t.options.charsThatBreakOutOfSupSub.indexOf(e) > -1 &&
                    t.insRightOf(this.parent),
                    U.p.write.apply(this, arguments)
                }
              }),
              (t.moveTowards = function(t, n, i) {
                n.options.autoSubscriptNumerals && !this.sup
                  ? n.insDirOf(t, this)
                  : e.moveTowards.apply(this, arguments)
              }),
              (t.deleteTowards = function(t, n) {
                if (n.options.autoSubscriptNumerals && this.sub) {
                  var i = this.sub.ends[-t]
                  i instanceof $
                    ? i.remove()
                    : i && i.deleteTowards(t, n.insAtDirEnd(-t, this.sub)),
                    this.sub.isEmpty() &&
                      (this.sub.deleteOutOf(p, n.insAtLeftEnd(this.sub)),
                      this.sup && n.insDirOf(-t, this))
                } else e.deleteTowards.apply(this, arguments)
              }),
              (t.latex = function() {
                function t(t, e) {
                  var n = e && e.latex()
                  return e
                    ? t + (1 === n.length ? n : '{' + (n || ' ') + '}')
                    : ''
                }
                return t('_', this.sub) + t('^', this.sup)
              }),
              (t.addBlock = function(t) {
                'sub' === this.supsub
                  ? ((this.sup = this.upInto = this.sub.upOutOf = t),
                    (t.adopt(this, this.sub, 0).downOutOf = this.sub),
                    (t.jQ = v('<span class="mq-sup"/>')
                      .append(t.jQ.children())
                      .attr(n, t.id)
                      .prependTo(this.jQ)))
                  : ((this.sub = this.downInto = this.sup.downOutOf = t),
                    (t.adopt(this, 0, this.sup).upOutOf = this.sup),
                    (t.jQ = v('<span class="mq-sub"></span>')
                      .append(t.jQ.children())
                      .attr(n, t.id)
                      .appendTo(this.jQ.removeClass('mq-sup-only'))),
                    this.jQ.append(
                      '<span style="display:inline-block;width:0">&#8203;</span>'
                    ))
                for (var e = 0; e < 2; e += 1)
                  !(function(t, e, n, i) {
                    t[e].deleteOutOf = function(r, o) {
                      if (
                        (o.insDirOf(this[r] ? -r : r, this.parent),
                        !this.isEmpty())
                      ) {
                        var s = this.ends[r]
                        this.children()
                          .disown()
                          .withDirAdopt(r, o.parent, o[r], o[-r])
                          .jQ.insDirOf(-r, o.jQ),
                          (o[-r] = s)
                      }
                      ;(t.supsub = n),
                        delete t[e],
                        delete t[i + 'Into'],
                        (t[n][i + 'OutOf'] = at),
                        delete t[n].deleteOutOf,
                        'sub' === e &&
                          v(t.jQ.addClass('mq-sup-only')[0].lastChild).remove(),
                        this.remove()
                    }
                  })(
                    this,
                    'sub sup'.split(' ')[e],
                    'sup sub'.split(' ')[e],
                    'down up'.split(' ')[e]
                  )
              }),
              (t.reflow = function() {
                var t = this.jQ,
                  e = t.prev()
                if (e.length) {
                  var n = t.children('.mq-sup')
                  if (n.length) {
                    var i = parseInt(n.css('font-size')),
                      r =
                        n.offset().top + n.height() - e.offset().top - 0.7 * i,
                      o = parseInt(n.css('margin-bottom'))
                    n.css('margin-bottom', o + r)
                  }
                }
              })
          })
          function at(t) {
            var e = this.parent,
              n = t
            do {
              if (n[m]) return t.insLeftOf(e)
              n = n.parent.parent
            } while (n !== e)
            t.insRightOf(e)
          }
          ;(w.subscript = w._ = h(st, function(t, e) {
            ;(t.supsub = 'sub'),
              (t.htmlTemplate =
                '<span class="mq-supsub mq-non-leaf"><span class="mq-sub">&0</span><span style="display:inline-block;width:0">&#8203;</span></span>'),
              (t.textTemplate = ['_']),
              (t.finalizeTree = function() {
                ;(this.downInto = this.sub = this.ends[p]),
                  (this.sub.upOutOf = at),
                  e.finalizeTree.call(this)
              })
          })),
            (w.superscript = w.supscript = w['^'] = h(st, function(t, e) {
              ;(t.supsub = 'sup'),
                (t.htmlTemplate =
                  '<span class="mq-supsub mq-non-leaf mq-sup-only"><span class="mq-sup">&0</span></span>'),
                (t.textTemplate = ['^']),
                (t.finalizeTree = function() {
                  ;(this.upInto = this.sup = this.ends[m]),
                    (this.sup.downOutOf = at),
                    e.finalizeTree.call(this)
                })
            }))
          var lt = h(P, function(t, e) {
            ;(t.init = function(t, e) {
              var n =
                '<span class="mq-large-operator mq-non-leaf"><span class="mq-to"><span>&1</span></span><big>' +
                e +
                '</big><span class="mq-from"><span>&0</span></span></span>'
              $.prototype.init.call(this, t, n)
            }),
              (t.createLeftOf = function(t) {
                e.createLeftOf.apply(this, arguments),
                  t.options.sumStartsWithNEquals &&
                    (wt('n').createLeftOf(t), Nt().createLeftOf(t))
              }),
              (t.latex = function() {
                function t(t) {
                  return 1 === t.length ? t : '{' + (t || ' ') + '}'
                }
                return (
                  this.ctrlSeq +
                  '_' +
                  t(this.ends[p].latex()) +
                  '^' +
                  t(this.ends[m].latex())
                )
              }),
              (t.parser = function() {
                for (
                  var t = I.string,
                    e = I.optWhitespace,
                    n = I.succeed,
                    i = H.block,
                    r = this,
                    o = (r.blocks = [U(), U()]),
                    s = 0;
                  s < o.length;
                  s += 1
                )
                  o[s].adopt(r, r.ends[m], 0)
                return e
                  .then(t('_').or(t('^')))
                  .then(function(t) {
                    var e = o['_' === t ? 0 : 1]
                    return i.then(function(t) {
                      return t.children().adopt(e, e.ends[m], 0), n(r)
                    })
                  })
                  .many()
                  .result(r)
              }),
              (t.finalizeTree = function() {
                ;(this.downInto = this.ends[p]),
                  (this.upInto = this.ends[m]),
                  (this.ends[p].upOutOf = this.ends[m]),
                  (this.ends[m].downOutOf = this.ends[p])
              })
          })
          ;(w['∑'] = w.sum = w.summation = f(lt, '\\sum ', '&sum;')),
            (w['∏'] = w.prod = w.product = f(lt, '\\prod ', '&prod;')),
            (w.coprod = w.coproduct = f(lt, '\\coprod ', '&#8720;')),
            (w['∫'] = w.int = w.integral = h(lt, function(t, e) {
              ;(t.init = function() {
                $.prototype.init.call(
                  this,
                  '\\int ',
                  '<span class="mq-int mq-non-leaf"><big>&int;</big><span class="mq-supsub mq-non-leaf"><span class="mq-sup"><span class="mq-sup-inner">&1</span></span><span class="mq-sub">&0</span><span style="display:inline-block;width:0">&#8203</span></span></span>'
                )
              }),
                (t.createLeftOf = P.p.createLeftOf)
            }))
          var ct = (w.frac = w.dfrac = w.cfrac = w.fraction = h(P, function(
              t,
              e
            ) {
              ;(t.ctrlSeq = '\\frac'),
                (t.htmlTemplate =
                  '<span class="mq-fraction mq-non-leaf"><span class="mq-numerator">&0</span><span class="mq-denominator">&1</span><span style="display:inline-block;width:0">&#8203;</span></span>'),
                (t.textTemplate = ['(', ')/(', ')']),
                (t.finalizeTree = function() {
                  ;(this.upInto = this.ends[m].upOutOf = this.ends[p]),
                    (this.downInto = this.ends[p].downOutOf = this.ends[m])
                })
            })),
            ut = (w.over = T['/'] = h(ct, function(t, e) {
              t.createLeftOf = function(t) {
                if (!this.replacedFragment) {
                  for (
                    var n = t[p];
                    n &&
                    !(
                      n instanceof X ||
                      n instanceof (w.text || s) ||
                      n instanceof lt ||
                      '\\ ' === n.ctrlSeq ||
                      /^[,;:]$/.test(n.ctrlSeq)
                    );

                  )
                    n = n[p]
                  n instanceof lt &&
                    n[m] instanceof st &&
                    (n = n[m])[m] instanceof st &&
                    n[m].ctrlSeq != n.ctrlSeq &&
                    (n = n[m]),
                    n === t[p] ||
                      t.isTooDeep(1) ||
                      (this.replaces(q(n[m] || t.parent.ends[p], t[p])),
                      (t[p] = n))
                }
                e.createLeftOf.call(this, t)
              }
            })),
            ft = (w.sqrt = w['√'] = h(P, function(t, e) {
              ;(t.ctrlSeq = '\\sqrt'),
                (t.htmlTemplate =
                  '<span class="mq-non-leaf"><span class="mq-scaled mq-sqrt-prefix">&radic;</span><span class="mq-non-leaf mq-sqrt-stem">&0</span></span>'),
                (t.textTemplate = ['sqrt(', ')']),
                (t.parser = function() {
                  return H.optBlock
                    .then(function(t) {
                      return H.block.map(function(e) {
                        var n = dt()
                        return (
                          (n.blocks = [t, e]),
                          t.adopt(n, 0, 0),
                          e.adopt(n, t, 0),
                          n
                        )
                      })
                    })
                    .or(e.parser.call(this))
                }),
                (t.reflow = function() {
                  var t = this.ends[m].jQ
                  tt(
                    t.prev(),
                    1,
                    t.innerHeight() / +t.css('fontSize').slice(0, -2) - 0.1
                  )
                })
            })),
            dt = ((w.hat = h(P, function(t, e) {
              ;(t.ctrlSeq = '\\hat'),
                (t.htmlTemplate =
                  '<span class="mq-non-leaf"><span class="mq-hat-prefix">^</span><span class="mq-hat-stem">&0</span></span>'),
                (t.textTemplate = ['hat(', ')'])
            })),
            (w.nthroot = h(ft, function(t, e) {
              ;(t.htmlTemplate =
                '<sup class="mq-nthroot mq-non-leaf">&0</sup><span class="mq-scaled"><span class="mq-sqrt-prefix mq-scaled">&radic;</span><span class="mq-sqrt-stem mq-non-leaf">&1</span></span>'),
                (t.textTemplate = ['sqrt[', '](', ')']),
                (t.latex = function() {
                  return (
                    '\\sqrt[' +
                    this.ends[p].latex() +
                    ']{' +
                    this.ends[m].latex() +
                    '}'
                  )
                })
            }))),
            ht = h(P, function(t, e) {
              t.init = function(t, n, i) {
                var r =
                  '<span class="mq-non-leaf"><span class="mq-diacritic-above">' +
                  n +
                  '</span><span class="mq-diacritic-stem">&0</span></span>'
                e.init.call(this, t, r, i)
              }
            })
          function pt(t, e) {
            ;(t.jQadd = function() {
              e.jQadd.apply(this, arguments),
                (this.delimjQs = this.jQ
                  .children(':first')
                  .add(this.jQ.children(':last'))),
                (this.contentjQ = this.jQ.children(':eq(1)'))
            }),
              (t.reflow = function() {
                var t =
                  this.contentjQ.outerHeight() /
                  parseFloat(this.contentjQ.css('fontSize'))
                tt(this.delimjQs, r(1 + 0.2 * (t - 1), 1.2), 1.2 * t)
              })
          }
          ;(w.vec = f(ht, '\\vec', '&rarr;', ['vec(', ')'])),
            (w.tilde = f(ht, '\\tilde', '~', ['tilde(', ')']))
          var mt = h(h(P, pt), function(e, n) {
              ;(e.init = function(e, i, r, o, s) {
                n.init.call(this, '\\left' + o, t, [i, r]),
                  (this.side = e),
                  (this.sides = {}),
                  (this.sides[p] = { ch: i, ctrlSeq: o }),
                  (this.sides[m] = { ch: r, ctrlSeq: s })
              }),
                (e.numBlocks = function() {
                  return 1
                }),
                (e.html = function() {
                  return (
                    (this.htmlTemplate =
                      '<span class="mq-non-leaf"><span class="mq-scaled mq-paren' +
                      (this.side === m ? ' mq-ghost' : '') +
                      '">' +
                      this.sides[p].ch +
                      '</span><span class="mq-non-leaf">&0</span><span class="mq-scaled mq-paren' +
                      (this.side === p ? ' mq-ghost' : '') +
                      '">' +
                      this.sides[m].ch +
                      '</span></span>'),
                    n.html.call(this)
                  )
                }),
                (e.latex = function() {
                  return (
                    '\\left' +
                    this.sides[p].ctrlSeq +
                    this.ends[p].latex() +
                    '\\right' +
                    this.sides[m].ctrlSeq
                  )
                }),
                (e.matchBrack = function(t, e, n) {
                  return (
                    n instanceof mt &&
                    n.side &&
                    n.side !== -e &&
                    (!t.restrictMismatchedBrackets ||
                      gt[this.sides[this.side].ch] === n.sides[n.side].ch ||
                      { '(': ']', '[': ')' }[this.sides[p].ch] ===
                        n.sides[m].ch) &&
                    n
                  )
                }),
                (e.closeOpposing = function(t) {
                  ;(t.side = 0),
                    (t.sides[this.side] = this.sides[this.side]),
                    t.delimjQs
                      .eq(this.side === p ? 0 : 1)
                      .removeClass('mq-ghost')
                      .html(this.sides[this.side].ch)
                }),
                (e.createLeftOf = function(t) {
                  if (!this.replacedFragment) {
                    var e = t.options
                    if ('|' === this.sides[p].ch)
                      var i =
                        this.matchBrack(e, m, t[m]) ||
                        this.matchBrack(e, p, t[p]) ||
                        this.matchBrack(e, 0, t.parent.parent)
                    else
                      i =
                        this.matchBrack(e, -this.side, t[-this.side]) ||
                        this.matchBrack(e, -this.side, t.parent.parent)
                  }
                  if (i) {
                    var r = (this.side = -i.side)
                    this.closeOpposing(i),
                      i === t.parent.parent &&
                        t[r] &&
                        q(t[r], t.parent.ends[r], -r)
                          .disown()
                          .withDirAdopt(-r, i.parent, i, i[r])
                          .jQ.insDirOf(r, i.jQ),
                      i.bubble('reflow')
                  } else
                    (r = (i = this).side),
                      i.replacedFragment
                        ? (i.side = 0)
                        : t[-r] &&
                          (i.replaces(q(t[-r], t.parent.ends[-r], r)),
                          (t[-r] = 0)),
                      n.createLeftOf.call(i, t)
                  r === p ? t.insAtLeftEnd(i.ends[p]) : t.insRightOf(i)
                }),
                (e.placeCursor = s),
                (e.unwrap = function() {
                  this.ends[p]
                    .children()
                    .disown()
                    .adopt(this.parent, this, this[m])
                    .jQ.insertAfter(this.jQ),
                    this.remove()
                }),
                (e.deleteSide = function(t, e, n) {
                  var i = this.parent,
                    r = this[t],
                    o = i.ends[t]
                  if (t === this.side)
                    return (
                      this.unwrap(),
                      void (r ? n.insDirOf(-t, r) : n.insAtDirEnd(t, i))
                    )
                  var s = n.options,
                    a = !this.side
                  if (
                    ((this.side = -t),
                    this.matchBrack(s, t, this.ends[p].ends[this.side]))
                  ) {
                    this.closeOpposing(this.ends[p].ends[this.side])
                    var l = this.ends[p].ends[t]
                    this.unwrap(),
                      l.siblingCreated && l.siblingCreated(n.options, t),
                      r ? n.insDirOf(-t, r) : n.insAtDirEnd(t, i)
                  } else {
                    if (this.matchBrack(s, t, this.parent.parent))
                      this.parent.parent.closeOpposing(this),
                        this.parent.parent.unwrap()
                    else {
                      if (e && a)
                        return (
                          this.unwrap(),
                          void (r ? n.insDirOf(-t, r) : n.insAtDirEnd(t, i))
                        )
                      ;(this.sides[t] = {
                        ch: gt[this.sides[this.side].ch],
                        ctrlSeq: gt[this.sides[this.side].ctrlSeq]
                      }),
                        this.delimjQs
                          .removeClass('mq-ghost')
                          .eq(t === p ? 0 : 1)
                          .addClass('mq-ghost')
                          .html(this.sides[t].ch)
                    }
                    if (r) {
                      l = this.ends[p].ends[t]
                      q(r, o, -t)
                        .disown()
                        .withDirAdopt(-t, this.ends[p], l, 0)
                        .jQ.insAtDirEnd(
                          t,
                          this.ends[p].jQ.removeClass('mq-empty')
                        ),
                        l.siblingCreated && l.siblingCreated(n.options, t),
                        n.insDirOf(-t, r)
                    } else
                      e ? n.insDirOf(t, this) : n.insAtDirEnd(t, this.ends[p])
                  }
                }),
                (e.deleteTowards = function(t, e) {
                  this.deleteSide(-t, !1, e)
                }),
                (e.finalizeTree = function() {
                  ;(this.ends[p].deleteOutOf = function(t, e) {
                    this.parent.deleteSide(t, !0, e)
                  }),
                    (this.finalizeTree = this.intentionalBlur = function() {
                      this.delimjQs
                        .eq(this.side === p ? 1 : 0)
                        .removeClass('mq-ghost'),
                        (this.side = 0)
                    })
                }),
                (e.siblingCreated = function(t, e) {
                  e === -this.side && this.finalizeTree()
                })
            }),
            gt = {
              '(': ')',
              ')': '(',
              '[': ']',
              ']': '[',
              '{': '}',
              '}': '{',
              '\\{': '\\}',
              '\\}': '\\{',
              '&lang;': '&rang;',
              '&rang;': '&lang;',
              '\\langle ': '\\rangle ',
              '\\rangle ': '\\langle ',
              '|': '|',
              '\\lVert ': '\\rVert ',
              '\\rVert ': '\\lVert '
            }
          function vt(t, e) {
            e = e || t
            var n = gt[t],
              i = gt[e]
            ;(T[t] = f(mt, p, t, n, e, i)), (T[n] = f(mt, m, t, n, e, i))
          }
          vt('('),
            vt('['),
            vt('{', '\\{'),
            (w.langle = f(mt, p, '&lang;', '&rang;', '\\langle ', '\\rangle ')),
            (w.rangle = f(mt, m, '&lang;', '&rang;', '\\langle ', '\\rangle ')),
            (T['|'] = f(mt, p, '|', '|', '|', '|')),
            (w.lVert = f(mt, p, '&#8741;', '&#8741;', '\\lVert ', '\\rVert ')),
            (w.rVert = f(mt, m, '&#8741;', '&#8741;', '\\lVert ', '\\rVert ')),
            (w.left = h(P, function(t) {
              t.parser = function() {
                var t = I.regex,
                  e = I.string,
                  n = (I.succeed, I.optWhitespace)
                return n
                  .then(
                    t(
                      /^(?:[([|]|\\\{|\\langle(?![a-zA-Z])|\\lVert(?![a-zA-Z]))/
                    )
                  )
                  .then(function(i) {
                    var r = '\\' === i.charAt(0) ? i.slice(1) : i
                    return (
                      '\\langle' == i && ((r = '&lang;'), (i += ' ')),
                      '\\lVert' == i && ((r = '&#8741;'), (i += ' ')),
                      H.then(function(o) {
                        return e('\\right')
                          .skip(n)
                          .then(
                            t(
                              /^(?:[\])|]|\\\}|\\rangle(?![a-zA-Z])|\\rVert(?![a-zA-Z]))/
                            )
                          )
                          .map(function(t) {
                            var e = '\\' === t.charAt(0) ? t.slice(1) : t
                            '\\rangle' == t && ((e = '&rang;'), (t += ' ')),
                              '\\rVert' == t && ((e = '&#8741;'), (t += ' '))
                            var n = mt(0, r, e, i, t)
                            return (n.blocks = [o]), o.adopt(n, 0, 0), n
                          })
                      })
                    )
                  })
              }
            })),
            (w.right = h(P, function(t) {
              t.parser = function() {
                return I.fail('unmatched \\right')
              }
            }))
          var yt = (w.binom = w.binomial = h(h(P, pt), function(t, e) {
            ;(t.ctrlSeq = '\\binom'),
              (t.htmlTemplate =
                '<span class="mq-non-leaf"><span class="mq-paren mq-scaled">(</span><span class="mq-non-leaf"><span class="mq-array mq-non-leaf"><span>&0</span><span>&1</span></span></span><span class="mq-paren mq-scaled">)</span></span>'),
              (t.textTemplate = ['choose(', ',', ')'])
          }))
          w.choose = h(yt, function(t) {
            t.createLeftOf = ut.prototype.createLeftOf
          })
          w.editable = w.MathQuillMathField = h(P, function(t, e) {
            ;(t.ctrlSeq = '\\MathQuillMathField'),
              (t.htmlTemplate =
                '<span class="mq-editable-field"><span class="mq-root-block">&0</span></span>'),
              (t.parser = function() {
                var t = this,
                  n = I.string,
                  i = I.regex,
                  r = I.succeed
                return n('[')
                  .then(i(/^[a-z][a-z0-9]*/i))
                  .skip(n(']'))
                  .map(function(e) {
                    t.name = e
                  })
                  .or(r())
                  .then(e.parser.call(t))
              }),
              (t.finalizeTree = function(t) {
                var e = S(this.ends[p], this.jQ, t)
                ;(e.KIND_OF_MQ = 'MathField'),
                  (e.editable = !0),
                  e.createTextarea(),
                  e.editablesTextareaEvents(),
                  e.cursor.insAtRightEnd(e.root),
                  z(e.root)
              }),
              (t.registerInnerField = function(t, e) {
                t.push((t[this.name] = e(this.ends[p].controller)))
              }),
              (t.latex = function() {
                return this.ends[p].latex()
              }),
              (t.text = function() {
                return this.ends[p].text()
              })
          })
          var bt = (w.embed = h($, function(t, e) {
            ;(t.setOptions = function(t) {
              function e() {
                return ''
              }
              return (
                (this.text = t.text || e),
                (this.htmlTemplate = t.htmlString || ''),
                (this.latex = t.latex || e),
                this
              )
            }),
              (t.parser = function() {
                var t = this,
                  e = I.string,
                  n = I.regex,
                  i = I.succeed
                return e('{')
                  .then(n(/^[a-z][a-z0-9]*/i))
                  .skip(e('}'))
                  .then(function(r) {
                    return e('[')
                      .then(n(/^[-\w\s]*/))
                      .skip(e(']'))
                      .or(i())
                      .map(function(e) {
                        return t.setOptions(A[r](e))
                      })
                  })
              })
          }))
          ;(w.notin = w.cong = w.equiv = w.oplus = w.otimes = h(X, function(
            t,
            e
          ) {
            t.init = function(t) {
              e.init.call(this, '\\' + t + ' ', '&' + t + ';')
            }
          })),
            (w['≠'] = w.ne = w.neq = f(X, '\\ne ', '&ne;')),
            (w['∗'] = w.ast = w.star = w.loast = w.lowast = f(
              X,
              '\\ast ',
              '&lowast;'
            )),
            (w.therefor = w.therefore = f(X, '\\therefore ', '&there4;')),
            (w.cuz = w.because = f(X, '\\because ', '&#8757;')),
            (w.prop = w.propto = f(X, '\\propto ', '&prop;')),
            (w['≈'] = w.asymp = w.approx = f(X, '\\approx ', '&asymp;')),
            (w.isin = w.in = f(X, '\\in ', '&isin;')),
            (w.ni = w.contains = f(X, '\\ni ', '&ni;')),
            (w.notni = w.niton = w.notcontains = w.doesnotcontain = f(
              X,
              '\\not\\ni ',
              '&#8716;'
            )),
            (w.sub = w.subset = f(X, '\\subset ', '&sub;')),
            (w.sup = w.supset = w.superset = f(X, '\\supset ', '&sup;')),
            (w.nsub = w.notsub = w.nsubset = w.notsubset = f(
              X,
              '\\not\\subset ',
              '&#8836;'
            )),
            (w.nsup = w.notsup = w.nsupset = w.notsupset = w.nsuperset = w.notsuperset = f(
              X,
              '\\not\\supset ',
              '&#8837;'
            )),
            (w.sube = w.subeq = w.subsete = w.subseteq = f(
              X,
              '\\subseteq ',
              '&sube;'
            )),
            (w.supe = w.supeq = w.supsete = w.supseteq = w.supersete = w.superseteq = f(
              X,
              '\\supseteq ',
              '&supe;'
            )),
            (w.nsube = w.nsubeq = w.notsube = w.notsubeq = w.nsubsete = w.nsubseteq = w.notsubsete = w.notsubseteq = f(
              X,
              '\\not\\subseteq ',
              '&#8840;'
            )),
            (w.nsupe = w.nsupeq = w.notsupe = w.notsupeq = w.nsupsete = w.nsupseteq = w.notsupsete = w.notsupseteq = w.nsupersete = w.nsuperseteq = w.notsupersete = w.notsuperseteq = f(
              X,
              '\\not\\supseteq ',
              '&#8841;'
            )),
            (w.N = w.naturals = w.Naturals = f(W, '\\mathbb{N}', '&#8469;')),
            (w.P = w.primes = w.Primes = w.projective = w.Projective = w.probability = w.Probability = f(
              W,
              '\\mathbb{P}',
              '&#8473;'
            )),
            (w.Z = w.integers = w.Integers = f(W, '\\mathbb{Z}', '&#8484;')),
            (w.Q = w.rationals = w.Rationals = f(W, '\\mathbb{Q}', '&#8474;')),
            (w.R = w.reals = w.Reals = f(W, '\\mathbb{R}', '&#8477;')),
            (w.C = w.complex = w.Complex = w.complexes = w.Complexes = w.complexplane = w.Complexplane = w.ComplexPlane = f(
              W,
              '\\mathbb{C}',
              '&#8450;'
            )),
            (w.H = w.Hamiltonian = w.quaternions = w.Quaternions = f(
              W,
              '\\mathbb{H}',
              '&#8461;'
            )),
            (w.quad = w.emsp = f(W, '\\quad ', '    ')),
            (w.qquad = f(W, '\\qquad ', '        ')),
            (w.diamond = f(W, '\\diamond ', '&#9671;')),
            (w.bigtriangleup = f(W, '\\bigtriangleup ', '&#9651;')),
            (w.ominus = f(W, '\\ominus ', '&#8854;')),
            (w.uplus = f(W, '\\uplus ', '&#8846;')),
            (w.bigtriangledown = f(W, '\\bigtriangledown ', '&#9661;')),
            (w.sqcap = f(W, '\\sqcap ', '&#8851;')),
            (w.triangleleft = f(W, '\\triangleleft ', '&#8882;')),
            (w.sqcup = f(W, '\\sqcup ', '&#8852;')),
            (w.triangleright = f(W, '\\triangleright ', '&#8883;')),
            (w.odot = w.circledot = f(W, '\\odot ', '&#8857;')),
            (w.bigcirc = f(W, '\\bigcirc ', '&#9711;')),
            (w.dagger = f(W, '\\dagger ', '&#0134;')),
            (w.ddagger = f(W, '\\ddagger ', '&#135;')),
            (w.wr = f(W, '\\wr ', '&#8768;')),
            (w.amalg = f(W, '\\amalg ', '&#8720;')),
            (w.models = f(W, '\\models ', '&#8872;')),
            (w.prec = f(W, '\\prec ', '&#8826;')),
            (w.succ = f(W, '\\succ ', '&#8827;')),
            (w.preceq = f(W, '\\preceq ', '&#8828;')),
            (w.succeq = f(W, '\\succeq ', '&#8829;')),
            (w.simeq = f(W, '\\simeq ', '&#8771;')),
            (w.mid = f(W, '\\mid ', '&#8739;')),
            (w.ll = f(W, '\\ll ', '&#8810;')),
            (w.gg = f(W, '\\gg ', '&#8811;')),
            (w.parallel = f(W, '\\parallel ', '&#8741;')),
            (w.nparallel = f(W, '\\nparallel ', '&#8742;')),
            (w.bowtie = f(W, '\\bowtie ', '&#8904;')),
            (w.sqsubset = f(W, '\\sqsubset ', '&#8847;')),
            (w.sqsupset = f(W, '\\sqsupset ', '&#8848;')),
            (w.smile = f(W, '\\smile ', '&#8995;')),
            (w.sqsubseteq = f(W, '\\sqsubseteq ', '&#8849;')),
            (w.sqsupseteq = f(W, '\\sqsupseteq ', '&#8850;')),
            (w.doteq = f(W, '\\doteq ', '&#8784;')),
            (w.frown = f(W, '\\frown ', '&#8994;')),
            (w.vdash = f(W, '\\vdash ', '&#8870;')),
            (w.dashv = f(W, '\\dashv ', '&#8867;')),
            (w.nless = f(W, '\\nless ', '&#8814;')),
            (w.ngtr = f(W, '\\ngtr ', '&#8815;')),
            (w.longleftarrow = f(W, '\\longleftarrow ', '&#8592;')),
            (w.longrightarrow = f(W, '\\longrightarrow ', '&#8594;')),
            (w.Longleftarrow = f(W, '\\Longleftarrow ', '&#8656;')),
            (w.Longrightarrow = f(W, '\\Longrightarrow ', '&#8658;')),
            (w.longleftrightarrow = f(W, '\\longleftrightarrow ', '&#8596;')),
            (w.updownarrow = f(W, '\\updownarrow ', '&#8597;')),
            (w.Longleftrightarrow = f(W, '\\Longleftrightarrow ', '&#8660;')),
            (w.Updownarrow = f(W, '\\Updownarrow ', '&#8661;')),
            (w.mapsto = f(W, '\\mapsto ', '&#8614;')),
            (w.nearrow = f(W, '\\nearrow ', '&#8599;')),
            (w.hookleftarrow = f(W, '\\hookleftarrow ', '&#8617;')),
            (w.hookrightarrow = f(W, '\\hookrightarrow ', '&#8618;')),
            (w.searrow = f(W, '\\searrow ', '&#8600;')),
            (w.leftharpoonup = f(W, '\\leftharpoonup ', '&#8636;')),
            (w.rightharpoonup = f(W, '\\rightharpoonup ', '&#8640;')),
            (w.swarrow = f(W, '\\swarrow ', '&#8601;')),
            (w.leftharpoondown = f(W, '\\leftharpoondown ', '&#8637;')),
            (w.rightharpoondown = f(W, '\\rightharpoondown ', '&#8641;')),
            (w.nwarrow = f(W, '\\nwarrow ', '&#8598;')),
            (w.ldots = f(W, '\\ldots ', '&#8230;')),
            (w.cdots = f(W, '\\cdots ', '&#8943;')),
            (w.vdots = f(W, '\\vdots ', '&#8942;')),
            (w.ddots = f(W, '\\ddots ', '&#8945;')),
            (w.surd = f(W, '\\surd ', '&#8730;')),
            (w.triangle = f(W, '\\triangle ', '&#9651;')),
            (w.ell = f(W, '\\ell ', '&#8467;')),
            (w.top = f(W, '\\top ', '&#8868;')),
            (w.flat = f(W, '\\flat ', '&#9837;')),
            (w.natural = f(W, '\\natural ', '&#9838;')),
            (w.sharp = f(W, '\\sharp ', '&#9839;')),
            (w.wp = f(W, '\\wp ', '&#8472;')),
            (w.bot = f(W, '\\bot ', '&#8869;')),
            (w.clubsuit = f(W, '\\clubsuit ', '&#9827;')),
            (w.diamondsuit = f(W, '\\diamondsuit ', '&#9826;')),
            (w.heartsuit = f(W, '\\heartsuit ', '&#9825;')),
            (w.spadesuit = f(W, '\\spadesuit ', '&#9824;')),
            (w.parallelogram = f(W, '\\parallelogram ', '&#9649;')),
            (w.square = f(W, '\\square ', '&#11036;')),
            (w.oint = f(W, '\\oint ', '&#8750;')),
            (w.bigcap = f(W, '\\bigcap ', '&#8745;')),
            (w.bigcup = f(W, '\\bigcup ', '&#8746;')),
            (w.bigsqcup = f(W, '\\bigsqcup ', '&#8852;')),
            (w.bigvee = f(W, '\\bigvee ', '&#8744;')),
            (w.bigwedge = f(W, '\\bigwedge ', '&#8743;')),
            (w.bigodot = f(W, '\\bigodot ', '&#8857;')),
            (w.bigotimes = f(W, '\\bigotimes ', '&#8855;')),
            (w.bigoplus = f(W, '\\bigoplus ', '&#8853;')),
            (w.biguplus = f(W, '\\biguplus ', '&#8846;')),
            (w.lfloor = f(W, '\\lfloor ', '&#8970;')),
            (w.rfloor = f(W, '\\rfloor ', '&#8971;')),
            (w.lceil = f(W, '\\lceil ', '&#8968;')),
            (w.rceil = f(W, '\\rceil ', '&#8969;')),
            (w.opencurlybrace = w.lbrace = f(W, '\\lbrace ', '{')),
            (w.closecurlybrace = w.rbrace = f(W, '\\rbrace ', '}')),
            (w.lbrack = f(W, '[')),
            (w.rbrack = f(W, ']')),
            (w.slash = f(W, '/')),
            (w.vert = f(W, '|')),
            (w.perp = w.perpendicular = f(W, '\\perp ', '&perp;')),
            (w.nabla = w.del = f(W, '\\nabla ', '&nabla;')),
            (w.hbar = f(W, '\\hbar ', '&#8463;')),
            (w.AA = w.Angstrom = w.angstrom = f(W, '\\text\\AA ', '&#8491;')),
            (w.ring = w.circ = w.circle = f(W, '\\circ ', '&#8728;')),
            (w.bull = w.bullet = f(W, '\\bullet ', '&bull;')),
            (w.setminus = w.smallsetminus = f(W, '\\setminus ', '&#8726;')),
            (w.not = w['¬'] = w.neg = f(W, '\\neg ', '&not;')),
            (w[
              '…'
            ] = w.dots = w.ellip = w.hellip = w.ellipsis = w.hellipsis = f(
              W,
              '\\dots ',
              '&hellip;'
            )),
            (w.converges = w.darr = w.dnarr = w.dnarrow = w.downarrow = f(
              W,
              '\\downarrow ',
              '&darr;'
            )),
            (w.dArr = w.dnArr = w.dnArrow = w.Downarrow = f(
              W,
              '\\Downarrow ',
              '&dArr;'
            )),
            (w.diverges = w.uarr = w.uparrow = f(W, '\\uparrow ', '&uarr;')),
            (w.uArr = w.Uparrow = f(W, '\\Uparrow ', '&uArr;')),
            (w.to = f(X, '\\to ', '&rarr;')),
            (w.rarr = w.rightarrow = f(W, '\\rightarrow ', '&rarr;')),
            (w.implies = f(X, '\\Rightarrow ', '&rArr;')),
            (w.rArr = w.Rightarrow = f(W, '\\Rightarrow ', '&rArr;')),
            (w.gets = f(X, '\\gets ', '&larr;')),
            (w.larr = w.leftarrow = f(W, '\\leftarrow ', '&larr;')),
            (w.impliedby = f(X, '\\Leftarrow ', '&lArr;')),
            (w.lArr = w.Leftarrow = f(W, '\\Leftarrow ', '&lArr;')),
            (w.harr = w.lrarr = w.leftrightarrow = f(
              W,
              '\\leftrightarrow ',
              '&harr;'
            )),
            (w.iff = f(X, '\\Leftrightarrow ', '&hArr;')),
            (w.hArr = w.lrArr = w.Leftrightarrow = f(
              W,
              '\\Leftrightarrow ',
              '&hArr;'
            )),
            (w.Re = w.Real = w.real = f(W, '\\Re ', '&real;')),
            (w.Im = w.imag = w.image = w.imagin = w.imaginary = w.Imaginary = f(
              W,
              '\\Im ',
              '&image;'
            )),
            (w.part = w.partial = f(W, '\\partial ', '&part;')),
            (w.infty = w.infin = w.infinity = f(W, '\\infty ', '&infin;')),
            (w.pounds = f(W, '\\pounds ', '&pound;')),
            (w.alef = w.alefsym = w.aleph = w.alephsym = f(
              W,
              '\\aleph ',
              '&alefsym;'
            )),
            (w.xist = w.xists = w.exist = w.exists = f(
              W,
              '\\exists ',
              '&exist;'
            )),
            (w.nexists = w.nexist = f(W, '\\nexists ', '&#8708;')),
            (w.and = w.land = w.wedge = f(X, '\\wedge ', '&and;')),
            (w.or = w.lor = w.vee = f(X, '\\vee ', '&or;')),
            (w.o = w.O = w.empty = w.emptyset = w.oslash = w.Oslash = w.nothing = w.varnothing = f(
              X,
              '\\varnothing ',
              '&empty;'
            )),
            (w.cup = w.union = f(X, '\\cup ', '&cup;')),
            (w.cap = w.intersect = w.intersection = f(X, '\\cap ', '&cap;')),
            (w.deg = w.degree = f(W, '\\degree ', '&deg;')),
            (w.ang = w.angle = f(W, '\\angle ', '&ang;')),
            (w.measuredangle = f(W, '\\measuredangle ', '&#8737;'))
          var xt = h(W, function(t, e) {
              t.createLeftOf = function(t) {
                t.options.autoSubscriptNumerals &&
                t.parent !== t.parent.parent.sub &&
                ((t[p] instanceof qt && !1 !== t[p].isItalic) ||
                  (t[p] instanceof st &&
                    t[p][p] instanceof qt &&
                    !1 !== t[p][p].isItalic))
                  ? (w._().createLeftOf(t),
                    e.createLeftOf.call(this, t),
                    t.insRightOf(t.parent.parent))
                  : e.createLeftOf.call(this, t)
              }
            }),
            qt = h($, function(t, e) {
              ;(t.init = function(t, n) {
                e.init.call(this, t, '<var>' + (n || t) + '</var>')
              }),
                (t.text = function() {
                  var t = this.ctrlSeq
                  return (
                    this.isPartOfOperator
                      ? '\\' == t[0]
                        ? (t = t.slice(1, t.length))
                        : ' ' == t[t.length - 1] && (t = t.slice(0, -1))
                      : (!this[p] ||
                          this[p] instanceof qt ||
                          this[p] instanceof X ||
                          '\\ ' === this[p].ctrlSeq ||
                          (t = '*' + t),
                        !this[m] ||
                          this[m] instanceof X ||
                          this[m] instanceof st ||
                          (t += '*')),
                    t
                  )
                })
            })
          ;(j.p.autoCommands = { _maxLength: 0 }),
            (O.autoCommands = function(t) {
              if (!/^[a-z]+(?: [a-z]+)*$/i.test(t))
                throw '"' + t + '" not a space-delimited list of only letters'
              for (
                var e = t.split(' '), n = {}, i = 0, r = 0;
                r < e.length;
                r += 1
              ) {
                var s = e[r]
                if (s.length < 2)
                  throw 'autocommand "' + s + '" not minimum length of 2'
                if (w[s] === St) throw '"' + s + '" is a built-in operator name'
                ;(n[s] = 1), (i = o(i, s.length))
              }
              return (n._maxLength = i), n
            })
          var wt = h(qt, function(t, e) {
              function n(t) {
                return !t || t instanceof X || t instanceof lt
              }
              ;(t.init = function(t) {
                return e.init.call(this, (this.letter = t))
              }),
                (t.createLeftOf = function(t) {
                  e.createLeftOf.apply(this, arguments)
                  var n = t.options.autoCommands,
                    i = n._maxLength
                  if (i > 0) {
                    for (
                      var r = '', o = this, s = 0;
                      o instanceof wt && o.ctrlSeq === o.letter && s < i;

                    )
                      (r = o.letter + r), (o = o[p]), (s += 1)
                    for (; r.length; ) {
                      if (n.hasOwnProperty(r)) {
                        for (s = 1, o = this; s < r.length; s += 1, o = o[p]);
                        return (
                          q(o, this).remove(),
                          (t[p] = o[p]),
                          w[r](r).createLeftOf(t)
                        )
                      }
                      r = r.slice(1)
                    }
                  }
                }),
                (t.italicize = function(t) {
                  return (
                    (this.isItalic = t),
                    (this.isPartOfOperator = !t),
                    this.jQ.toggleClass('mq-operator-name', !t),
                    this
                  )
                }),
                (t.finalizeTree = t.siblingDeleted = t.siblingCreated = function(
                  t,
                  e
                ) {
                  ;(e !== p && this[m] instanceof wt) || this.autoUnItalicize(t)
                }),
                (t.autoUnItalicize = function(t) {
                  var e = t.autoOperatorNames
                  if (0 !== e._maxLength) {
                    for (
                      var i = this.letter, o = this[p];
                      o instanceof wt;
                      o = o[p]
                    )
                      i = o.letter + i
                    for (var s = this[m]; s instanceof wt; s = s[m])
                      i += s.letter
                    q(
                      o[m] || this.parent.ends[p],
                      s[p] || this.parent.ends[m]
                    ).each(function(t) {
                      t
                        .italicize(!0)
                        .jQ.removeClass(
                          'mq-first mq-last mq-followed-by-supsub'
                        ),
                        (t.ctrlSeq = t.letter)
                    })
                    t: for (
                      var a = 0, l = o[m] || this.parent.ends[p];
                      a < i.length;
                      a += 1, l = l[m]
                    )
                      for (
                        var c = r(e._maxLength, i.length - a);
                        c > 0;
                        c -= 1
                      ) {
                        var u = i.slice(a, a + c)
                        if (e.hasOwnProperty(u)) {
                          for (var f = 0, d = l; f < c; f += 1, d = d[m]) {
                            d.italicize(!1)
                            var h = d
                          }
                          var g = Tt.hasOwnProperty(u)
                          if (
                            ((l.ctrlSeq =
                              (g ? '\\' : '\\operatorname{') + l.ctrlSeq),
                            (h.ctrlSeq += g ? ' ' : '}'),
                            Ct.hasOwnProperty(u) &&
                              h[p][p][p].jQ.addClass('mq-last'),
                            n(l[p]) || l.jQ.addClass('mq-first'),
                            !n(h[m]))
                          )
                            if (h[m] instanceof st) {
                              var v = h[m]
                              ;(v.siblingCreated = v.siblingDeleted = function() {
                                v.jQ.toggleClass(
                                  'mq-after-operator-name',
                                  !(v[m] instanceof mt)
                                )
                              })()
                            } else
                              h.jQ.toggleClass('mq-last', !(h[m] instanceof mt))
                          ;(a += c - 1), (l = h)
                          continue t
                        }
                      }
                  }
                })
            }),
            Tt = {},
            kt = (j.p.autoOperatorNames = { _maxLength: 9 }),
            Ct = { limsup: 1, liminf: 1, projlim: 1, injlim: 1 }
          !(function() {
            for (
              var t = 'arg deg det dim exp gcd hom inf ker lg lim ln log max min sup limsup liminf injlim projlim Pr'.split(
                  ' '
                ),
                e = 0;
              e < t.length;
              e += 1
            )
              Tt[t[e]] = kt[t[e]] = 1
            var n = 'sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth'.split(
              ' '
            )
            for (e = 0; e < n.length; e += 1) Tt[n[e]] = 1
            var i = 'sin cos tan sec cosec csc cotan cot ctg'.split(' ')
            for (e = 0; e < i.length; e += 1)
              kt[i[e]] = kt['arc' + i[e]] = kt[i[e] + 'h'] = kt[
                'ar' + i[e] + 'h'
              ] = kt['arc' + i[e] + 'h'] = 1
            var r = 'gcf hcf lcm proj span'.split(' ')
            for (e = 0; e < r.length; e += 1) kt[r[e]] = 1
          })(),
            (O.autoOperatorNames = function(t) {
              if (!/^[a-z]+(?: [a-z]+)*$/i.test(t))
                throw '"' + t + '" not a space-delimited list of only letters'
              for (
                var e = t.split(' '), n = {}, i = 0, r = 0;
                r < e.length;
                r += 1
              ) {
                var s = e[r]
                if (s.length < 2) throw '"' + s + '" not minimum length of 2'
                ;(n[s] = 1), (i = o(i, s.length))
              }
              return (n._maxLength = i), n
            })
          var St = h($, function(t, e) {
            ;(t.init = function(t) {
              this.ctrlSeq = t
            }),
              (t.createLeftOf = function(t) {
                for (var e = this.ctrlSeq, n = 0; n < e.length; n += 1)
                  wt(e.charAt(n)).createLeftOf(t)
              }),
              (t.parser = function() {
                for (var t = this.ctrlSeq, e = U(), n = 0; n < t.length; n += 1)
                  wt(t.charAt(n)).adopt(e, e.ends[m], 0)
                return I.succeed(e.children())
              })
          })
          for (var Et in kt) kt.hasOwnProperty(Et) && (w[Et] = St)
          ;(w.operatorname = h(P, function(t) {
            ;(t.createLeftOf = s),
              (t.numBlocks = function() {
                return 1
              }),
              (t.parser = function() {
                return H.block.map(function(t) {
                  return t.children()
                })
              })
          })),
            (w.f = h(wt, function(t, e) {
              ;(t.init = function() {
                $.p.init.call(
                  this,
                  (this.letter = 'f'),
                  '<var class="mq-f">f</var>'
                )
              }),
                (t.italicize = function(t) {
                  return (
                    this.jQ.html('f').toggleClass('mq-f', t),
                    e.italicize.apply(this, arguments)
                  )
                })
            })),
            (w[' '] = w.space = f(W, '\\ ', '&nbsp;')),
            (w["'"] = w.prime = f(W, "'", '&prime;')),
            (w['″'] = w.dprime = f(W, '″', '&Prime;')),
            (w.backslash = f(W, '\\backslash ', '\\')),
            T['\\'] || (T['\\'] = w.backslash),
            (w.$ = f(W, '\\$', '$'))
          var jt = h($, function(t, e) {
            t.init = function(t, n) {
              e.init.call(
                this,
                t,
                '<span class="mq-nonSymbola">' + (n || t) + '</span>'
              )
            }
          })
          ;(w['@'] = jt),
            (w['&'] = f(jt, '\\&', '&amp;')),
            (w['%'] = f(jt, '\\%', '%')),
            (w.alpha = w.beta = w.gamma = w.delta = w.zeta = w.eta = w.theta = w.iota = w.kappa = w.mu = w.nu = w.xi = w.rho = w.sigma = w.tau = w.chi = w.psi = w.omega = h(
              qt,
              function(t, e) {
                t.init = function(t) {
                  e.init.call(this, '\\' + t + ' ', '&' + t + ';')
                }
              }
            )),
            (w.phi = f(qt, '\\phi ', '&#981;')),
            (w.phiv = w.varphi = f(qt, '\\varphi ', '&phi;')),
            (w.epsilon = f(qt, '\\epsilon ', '&#1013;')),
            (w.epsiv = w.varepsilon = f(qt, '\\varepsilon ', '&epsilon;')),
            (w.piv = w.varpi = f(qt, '\\varpi ', '&piv;')),
            (w.sigmaf = w.sigmav = w.varsigma = f(
              qt,
              '\\varsigma ',
              '&sigmaf;'
            )),
            (w.thetav = w.vartheta = w.thetasym = f(
              qt,
              '\\vartheta ',
              '&thetasym;'
            )),
            (w.upsilon = w.upsi = f(qt, '\\upsilon ', '&upsilon;')),
            (w.gammad = w.Gammad = w.digamma = f(qt, '\\digamma ', '&#989;')),
            (w.kappav = w.varkappa = f(qt, '\\varkappa ', '&#1008;')),
            (w.rhov = w.varrho = f(qt, '\\varrho ', '&#1009;')),
            (w.pi = w['π'] = f(jt, '\\pi ', '&pi;')),
            (w.lambda = f(jt, '\\lambda ', '&lambda;')),
            (w.Upsilon = w.Upsi = w.upsih = w.Upsih = f(
              $,
              '\\Upsilon ',
              '<var style="font-family: serif">&upsih;</var>'
            )),
            (w.Gamma = w.Delta = w.Theta = w.Lambda = w.Xi = w.Pi = w.Sigma = w.Phi = w.Psi = w.Omega = w.forall = h(
              W,
              function(t, e) {
                t.init = function(t) {
                  e.init.call(this, '\\' + t + ' ', '&' + t + ';')
                }
              }
            ))
          var Ot = h(P, function(t) {
            ;(t.init = function(t) {
              this.latex = t
            }),
              (t.createLeftOf = function(t) {
                var e = H.parse(this.latex)
                e.children().adopt(t.parent, t[p], t[m]),
                  (t[p] = e.ends[m]),
                  e.jQize().insertBefore(t.jQ),
                  e.finalizeInsert(t.options, t),
                  e.ends[m][m].siblingCreated &&
                    e.ends[m][m].siblingCreated(t.options, p),
                  e.ends[p][p].siblingCreated &&
                    e.ends[p][p].siblingCreated(t.options, m),
                  t.parent.bubble('reflow')
              }),
              (t.parser = function() {
                var t = H.parse(this.latex).children()
                return I.succeed(t)
              })
          })
          ;(w['¹'] = f(Ot, '^1')),
            (w['²'] = f(Ot, '^2')),
            (w['³'] = f(Ot, '^3')),
            (w['¼'] = f(Ot, '\\frac14')),
            (w['½'] = f(Ot, '\\frac12')),
            (w['¾'] = f(Ot, '\\frac34'))
          var Dt = h(X, function(t) {
            ;(t.init = W.prototype.init),
              (t.contactWeld = t.siblingCreated = t.siblingDeleted = function(
                t,
                e
              ) {
                if (e !== m)
                  return (
                    (this.jQ[0].className = (function t(e) {
                      return e[p]
                        ? e[p] instanceof X || /^[,;:\(\[]$/.test(e[p].ctrlSeq)
                          ? ''
                          : 'mq-binary-operator'
                        : e.parent &&
                          e.parent.parent &&
                          e.parent.parent.isStyleBlock()
                        ? t(e.parent.parent)
                        : ''
                    })(this)),
                    this
                  )
              })
          })
          ;(w['+'] = f(Dt, '+', '+')),
            (w['–'] = w['-'] = f(Dt, '-', '&minus;')),
            (w['±'] = w.pm = w.plusmn = w.plusminus = f(
              Dt,
              '\\pm ',
              '&plusmn;'
            )),
            (w.mp = w.mnplus = w.minusplus = f(Dt, '\\mp ', '&#8723;')),
            (T['*'] = w.sdot = w.cdot = f(X, '\\cdot ', '&middot;', '*'))
          var At = h(X, function(t, e) {
              ;(t.init = function(t, n) {
                ;(this.data = t), (this.strict = n)
                var i = n ? 'Strict' : ''
                e.init.call(
                  this,
                  t['ctrlSeq' + i],
                  t['html' + i],
                  t['text' + i]
                )
              }),
                (t.swap = function(t) {
                  this.strict = t
                  var e = t ? 'Strict' : ''
                  ;(this.ctrlSeq = this.data['ctrlSeq' + e]),
                    this.jQ.html(this.data['html' + e]),
                    (this.textTemplate = [this.data['text' + e]])
                }),
                (t.deleteTowards = function(t, n) {
                  if (t === p && !this.strict)
                    return this.swap(!0), void this.bubble('reflow')
                  e.deleteTowards.apply(this, arguments)
                })
            }),
            Lt = {
              ctrlSeq: '\\le ',
              html: '&le;',
              text: '≤',
              ctrlSeqStrict: '<',
              htmlStrict: '&lt;',
              textStrict: '<'
            },
            _t = {
              ctrlSeq: '\\ge ',
              html: '&ge;',
              text: '≥',
              ctrlSeqStrict: '>',
              htmlStrict: '&gt;',
              textStrict: '>'
            }
          ;(w['<'] = w.lt = f(At, Lt, !0)),
            (w['>'] = w.gt = f(At, _t, !0)),
            (w['≤'] = w.le = w.leq = f(At, Lt, !1)),
            (w['≥'] = w.ge = w.geq = f(At, _t, !1))
          var Nt = h(X, function(t, e) {
            ;(t.init = function() {
              e.init.call(this, '=', '=')
            }),
              (t.createLeftOf = function(t) {
                if (t[p] instanceof At && t[p].strict)
                  return t[p].swap(!1), void t[p].bubble('reflow')
                e.createLeftOf.apply(this, arguments)
              })
          })
          ;(w['='] = Nt),
            (w['×'] = w.times = f(X, '\\times ', '&times;', '[x]')),
            (w['÷'] = w.div = w.divide = w.divides = f(
              X,
              '\\div ',
              '&divide;',
              '[/]'
            )),
            (T['~'] = w.sim = f(X, '\\sim ', '~', '~'))
          var Qt = M(1)
          for (var Mt in Qt)
            !(function(t, e) {
              'function' == typeof e
                ? ((_[t] = function() {
                    return L(), e.apply(this, arguments)
                  }),
                  (_[t].prototype = e.prototype))
                : (_[t] = e)
            })(Mt, Qt[Mt])
        })(),
        (t.exports = i.MathQuill)
    },
    function(t, e, n) {
      var i, r, o
      /*!
       * jQuery JavaScript Library v1.12.4
       * http://jquery.com/
       *
       * Includes Sizzle.js
       * http://sizzlejs.com/
       *
       * Copyright jQuery Foundation and other contributors
       * Released under the MIT license
       * http://jquery.org/license
       *
       * Date: 2016-05-20T17:17Z
       */
      /*!
       * jQuery JavaScript Library v1.12.4
       * http://jquery.com/
       *
       * Includes Sizzle.js
       * http://sizzlejs.com/
       *
       * Copyright jQuery Foundation and other contributors
       * Released under the MIT license
       * http://jquery.org/license
       *
       * Date: 2016-05-20T17:17Z
       */
      ;(r = 'undefined' != typeof window ? window : this),
        (o = function(n, r) {
          var o = [],
            s = n.document,
            a = o.slice,
            l = o.concat,
            c = o.push,
            u = o.indexOf,
            f = {},
            d = f.toString,
            h = f.hasOwnProperty,
            p = {},
            m = function(t, e) {
              return new m.fn.init(t, e)
            },
            g = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            v = /^-ms-/,
            y = /-([\da-z])/gi,
            b = function(t, e) {
              return e.toUpperCase()
            }
          function x(t) {
            var e = !!t && 'length' in t && t.length,
              n = m.type(t)
            return (
              'function' !== n &&
              !m.isWindow(t) &&
              ('array' === n ||
                0 === e ||
                ('number' == typeof e && e > 0 && e - 1 in t))
            )
          }
          ;(m.fn = m.prototype = {
            jquery: '1.12.4',
            constructor: m,
            selector: '',
            length: 0,
            toArray: function() {
              return a.call(this)
            },
            get: function(t) {
              return null != t
                ? t < 0
                  ? this[t + this.length]
                  : this[t]
                : a.call(this)
            },
            pushStack: function(t) {
              var e = m.merge(this.constructor(), t)
              return (e.prevObject = this), (e.context = this.context), e
            },
            each: function(t) {
              return m.each(this, t)
            },
            map: function(t) {
              return this.pushStack(
                m.map(this, function(e, n) {
                  return t.call(e, n, e)
                })
              )
            },
            slice: function() {
              return this.pushStack(a.apply(this, arguments))
            },
            first: function() {
              return this.eq(0)
            },
            last: function() {
              return this.eq(-1)
            },
            eq: function(t) {
              var e = this.length,
                n = +t + (t < 0 ? e : 0)
              return this.pushStack(n >= 0 && n < e ? [this[n]] : [])
            },
            end: function() {
              return this.prevObject || this.constructor()
            },
            push: c,
            sort: o.sort,
            splice: o.splice
          }),
            (m.extend = m.fn.extend = function() {
              var t,
                e,
                n,
                i,
                r,
                o,
                s = arguments[0] || {},
                a = 1,
                l = arguments.length,
                c = !1
              for (
                'boolean' == typeof s &&
                  ((c = s), (s = arguments[a] || {}), a++),
                  'object' == typeof s || m.isFunction(s) || (s = {}),
                  a === l && ((s = this), a--);
                a < l;
                a++
              )
                if (null != (r = arguments[a]))
                  for (i in r)
                    (t = s[i]),
                      s !== (n = r[i]) &&
                        (c && n && (m.isPlainObject(n) || (e = m.isArray(n)))
                          ? (e
                              ? ((e = !1), (o = t && m.isArray(t) ? t : []))
                              : (o = t && m.isPlainObject(t) ? t : {}),
                            (s[i] = m.extend(c, o, n)))
                          : void 0 !== n && (s[i] = n))
              return s
            }),
            m.extend({
              expando: 'jQuery' + ('1.12.4' + Math.random()).replace(/\D/g, ''),
              isReady: !0,
              error: function(t) {
                throw new Error(t)
              },
              noop: function() {},
              isFunction: function(t) {
                return 'function' === m.type(t)
              },
              isArray:
                Array.isArray ||
                function(t) {
                  return 'array' === m.type(t)
                },
              isWindow: function(t) {
                return null != t && t == t.window
              },
              isNumeric: function(t) {
                var e = t && t.toString()
                return !m.isArray(t) && e - parseFloat(e) + 1 >= 0
              },
              isEmptyObject: function(t) {
                var e
                for (e in t) return !1
                return !0
              },
              isPlainObject: function(t) {
                var e
                if (!t || 'object' !== m.type(t) || t.nodeType || m.isWindow(t))
                  return !1
                try {
                  if (
                    t.constructor &&
                    !h.call(t, 'constructor') &&
                    !h.call(t.constructor.prototype, 'isPrototypeOf')
                  )
                    return !1
                } catch (t) {
                  return !1
                }
                if (!p.ownFirst) for (e in t) return h.call(t, e)
                for (e in t);
                return void 0 === e || h.call(t, e)
              },
              type: function(t) {
                return null == t
                  ? t + ''
                  : 'object' == typeof t || 'function' == typeof t
                  ? f[d.call(t)] || 'object'
                  : typeof t
              },
              globalEval: function(t) {
                t &&
                  m.trim(t) &&
                  (n.execScript ||
                    function(t) {
                      n.eval.call(n, t)
                    })(t)
              },
              camelCase: function(t) {
                return t.replace(v, 'ms-').replace(y, b)
              },
              nodeName: function(t, e) {
                return (
                  t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
                )
              },
              each: function(t, e) {
                var n,
                  i = 0
                if (x(t))
                  for (
                    n = t.length;
                    i < n && !1 !== e.call(t[i], i, t[i]);
                    i++
                  );
                else for (i in t) if (!1 === e.call(t[i], i, t[i])) break
                return t
              },
              trim: function(t) {
                return null == t ? '' : (t + '').replace(g, '')
              },
              makeArray: function(t, e) {
                var n = e || []
                return (
                  null != t &&
                    (x(Object(t))
                      ? m.merge(n, 'string' == typeof t ? [t] : t)
                      : c.call(n, t)),
                  n
                )
              },
              inArray: function(t, e, n) {
                var i
                if (e) {
                  if (u) return u.call(e, t, n)
                  for (
                    i = e.length, n = n ? (n < 0 ? Math.max(0, i + n) : n) : 0;
                    n < i;
                    n++
                  )
                    if (n in e && e[n] === t) return n
                }
                return -1
              },
              merge: function(t, e) {
                for (var n = +e.length, i = 0, r = t.length; i < n; )
                  t[r++] = e[i++]
                if (n != n) for (; void 0 !== e[i]; ) t[r++] = e[i++]
                return (t.length = r), t
              },
              grep: function(t, e, n) {
                for (var i = [], r = 0, o = t.length, s = !n; r < o; r++)
                  !e(t[r], r) !== s && i.push(t[r])
                return i
              },
              map: function(t, e, n) {
                var i,
                  r,
                  o = 0,
                  s = []
                if (x(t))
                  for (i = t.length; o < i; o++)
                    null != (r = e(t[o], o, n)) && s.push(r)
                else for (o in t) null != (r = e(t[o], o, n)) && s.push(r)
                return l.apply([], s)
              },
              guid: 1,
              proxy: function(t, e) {
                var n, i, r
                if (
                  ('string' == typeof e && ((r = t[e]), (e = t), (t = r)),
                  m.isFunction(t))
                )
                  return (
                    (n = a.call(arguments, 2)),
                    ((i = function() {
                      return t.apply(e || this, n.concat(a.call(arguments)))
                    }).guid = t.guid = t.guid || m.guid++),
                    i
                  )
              },
              now: function() {
                return +new Date()
              },
              support: p
            }),
            'function' == typeof Symbol &&
              (m.fn[Symbol.iterator] = o[Symbol.iterator]),
            m.each(
              'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(
                ' '
              ),
              function(t, e) {
                f['[object ' + e + ']'] = e.toLowerCase()
              }
            )
          var q =
            /*!
             * Sizzle CSS Selector Engine v2.2.1
             * http://sizzlejs.com/
             *
             * Copyright jQuery Foundation and other contributors
             * Released under the MIT license
             * http://jquery.org/license
             *
             * Date: 2015-10-17
             */
            (function(t) {
              var e,
                n,
                i,
                r,
                o,
                s,
                a,
                l,
                c,
                u,
                f,
                d,
                h,
                p,
                m,
                g,
                v,
                y,
                b,
                x = 'sizzle' + 1 * new Date(),
                q = t.document,
                w = 0,
                T = 0,
                k = ot(),
                C = ot(),
                S = ot(),
                E = function(t, e) {
                  return t === e && (f = !0), 0
                },
                j = 1 << 31,
                O = {}.hasOwnProperty,
                D = [],
                A = D.pop,
                L = D.push,
                _ = D.push,
                N = D.slice,
                Q = function(t, e) {
                  for (var n = 0, i = t.length; n < i; n++)
                    if (t[n] === e) return n
                  return -1
                },
                M =
                  'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
                R = '[\\x20\\t\\r\\n\\f]',
                z = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+',
                F =
                  '\\[' +
                  R +
                  '*(' +
                  z +
                  ')(?:' +
                  R +
                  '*([*^$|!~]?=)' +
                  R +
                  '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' +
                  z +
                  '))|)' +
                  R +
                  '*\\]',
                I =
                  ':(' +
                  z +
                  ')(?:\\(((\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|' +
                  F +
                  ')*)|.*)\\)|)',
                H = new RegExp(R + '+', 'g'),
                B = new RegExp(
                  '^' + R + '+|((?:^|[^\\\\])(?:\\\\.)*)' + R + '+$',
                  'g'
                ),
                P = new RegExp('^' + R + '*,' + R + '*'),
                $ = new RegExp('^' + R + '*([>+~]|' + R + ')' + R + '*'),
                W = new RegExp('=' + R + '*([^\\]\'"]*?)' + R + '*\\]', 'g'),
                X = new RegExp(I),
                U = new RegExp('^' + z + '$'),
                V = {
                  ID: new RegExp('^#(' + z + ')'),
                  CLASS: new RegExp('^\\.(' + z + ')'),
                  TAG: new RegExp('^(' + z + '|[*])'),
                  ATTR: new RegExp('^' + F),
                  PSEUDO: new RegExp('^' + I),
                  CHILD: new RegExp(
                    '^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' +
                      R +
                      '*(even|odd|(([+-]|)(\\d*)n|)' +
                      R +
                      '*(?:([+-]|)' +
                      R +
                      '*(\\d+)|))' +
                      R +
                      '*\\)|)',
                    'i'
                  ),
                  bool: new RegExp('^(?:' + M + ')$', 'i'),
                  needsContext: new RegExp(
                    '^' +
                      R +
                      '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' +
                      R +
                      '*((?:-\\d)?\\d*)' +
                      R +
                      '*\\)|)(?=[^-]|$)',
                    'i'
                  )
                },
                Y = /^(?:input|select|textarea|button)$/i,
                G = /^h\d$/i,
                K = /^[^{]+\{\s*\[native \w/,
                J = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                Z = /[+~]/,
                tt = /'|\\/g,
                et = new RegExp(
                  '\\\\([\\da-f]{1,6}' + R + '?|(' + R + ')|.)',
                  'ig'
                ),
                nt = function(t, e, n) {
                  var i = '0x' + e - 65536
                  return i != i || n
                    ? e
                    : i < 0
                    ? String.fromCharCode(i + 65536)
                    : String.fromCharCode((i >> 10) | 55296, (1023 & i) | 56320)
                },
                it = function() {
                  d()
                }
              try {
                _.apply((D = N.call(q.childNodes)), q.childNodes),
                  D[q.childNodes.length].nodeType
              } catch (t) {
                _ = {
                  apply: D.length
                    ? function(t, e) {
                        L.apply(t, N.call(e))
                      }
                    : function(t, e) {
                        for (var n = t.length, i = 0; (t[n++] = e[i++]); );
                        t.length = n - 1
                      }
                }
              }
              function rt(t, e, i, r) {
                var o,
                  a,
                  c,
                  u,
                  f,
                  p,
                  v,
                  y,
                  w = e && e.ownerDocument,
                  T = e ? e.nodeType : 9
                if (
                  ((i = i || []),
                  'string' != typeof t ||
                    !t ||
                    (1 !== T && 9 !== T && 11 !== T))
                )
                  return i
                if (
                  !r &&
                  ((e ? e.ownerDocument || e : q) !== h && d(e),
                  (e = e || h),
                  m)
                ) {
                  if (11 !== T && (p = J.exec(t)))
                    if ((o = p[1])) {
                      if (9 === T) {
                        if (!(c = e.getElementById(o))) return i
                        if (c.id === o) return i.push(c), i
                      } else if (
                        w &&
                        (c = w.getElementById(o)) &&
                        b(e, c) &&
                        c.id === o
                      )
                        return i.push(c), i
                    } else {
                      if (p[2]) return _.apply(i, e.getElementsByTagName(t)), i
                      if (
                        (o = p[3]) &&
                        n.getElementsByClassName &&
                        e.getElementsByClassName
                      )
                        return _.apply(i, e.getElementsByClassName(o)), i
                    }
                  if (n.qsa && !S[t + ' '] && (!g || !g.test(t))) {
                    if (1 !== T) (w = e), (y = t)
                    else if ('object' !== e.nodeName.toLowerCase()) {
                      for (
                        (u = e.getAttribute('id'))
                          ? (u = u.replace(tt, '\\$&'))
                          : e.setAttribute('id', (u = x)),
                          a = (v = s(t)).length,
                          f = U.test(u) ? '#' + u : "[id='" + u + "']";
                        a--;

                      )
                        v[a] = f + ' ' + mt(v[a])
                      ;(y = v.join(',')),
                        (w = (Z.test(t) && ht(e.parentNode)) || e)
                    }
                    if (y)
                      try {
                        return _.apply(i, w.querySelectorAll(y)), i
                      } catch (t) {
                      } finally {
                        u === x && e.removeAttribute('id')
                      }
                  }
                }
                return l(t.replace(B, '$1'), e, i, r)
              }
              function ot() {
                var t = []
                return function e(n, r) {
                  return (
                    t.push(n + ' ') > i.cacheLength && delete e[t.shift()],
                    (e[n + ' '] = r)
                  )
                }
              }
              function st(t) {
                return (t[x] = !0), t
              }
              function at(t) {
                var e = h.createElement('div')
                try {
                  return !!t(e)
                } catch (t) {
                  return !1
                } finally {
                  e.parentNode && e.parentNode.removeChild(e), (e = null)
                }
              }
              function lt(t, e) {
                for (var n = t.split('|'), r = n.length; r--; )
                  i.attrHandle[n[r]] = e
              }
              function ct(t, e) {
                var n = e && t,
                  i =
                    n &&
                    1 === t.nodeType &&
                    1 === e.nodeType &&
                    (~e.sourceIndex || j) - (~t.sourceIndex || j)
                if (i) return i
                if (n) for (; (n = n.nextSibling); ) if (n === e) return -1
                return t ? 1 : -1
              }
              function ut(t) {
                return function(e) {
                  return 'input' === e.nodeName.toLowerCase() && e.type === t
                }
              }
              function ft(t) {
                return function(e) {
                  var n = e.nodeName.toLowerCase()
                  return ('input' === n || 'button' === n) && e.type === t
                }
              }
              function dt(t) {
                return st(function(e) {
                  return (
                    (e = +e),
                    st(function(n, i) {
                      for (var r, o = t([], n.length, e), s = o.length; s--; )
                        n[(r = o[s])] && (n[r] = !(i[r] = n[r]))
                    })
                  )
                })
              }
              function ht(t) {
                return t && void 0 !== t.getElementsByTagName && t
              }
              for (e in ((n = rt.support = {}),
              (o = rt.isXML = function(t) {
                var e = t && (t.ownerDocument || t).documentElement
                return !!e && 'HTML' !== e.nodeName
              }),
              (d = rt.setDocument = function(t) {
                var e,
                  r,
                  s = t ? t.ownerDocument || t : q
                return s !== h && 9 === s.nodeType && s.documentElement
                  ? ((p = (h = s).documentElement),
                    (m = !o(h)),
                    (r = h.defaultView) &&
                      r.top !== r &&
                      (r.addEventListener
                        ? r.addEventListener('unload', it, !1)
                        : r.attachEvent && r.attachEvent('onunload', it)),
                    (n.attributes = at(function(t) {
                      return (t.className = 'i'), !t.getAttribute('className')
                    })),
                    (n.getElementsByTagName = at(function(t) {
                      return (
                        t.appendChild(h.createComment('')),
                        !t.getElementsByTagName('*').length
                      )
                    })),
                    (n.getElementsByClassName = K.test(
                      h.getElementsByClassName
                    )),
                    (n.getById = at(function(t) {
                      return (
                        (p.appendChild(t).id = x),
                        !h.getElementsByName || !h.getElementsByName(x).length
                      )
                    })),
                    n.getById
                      ? ((i.find.ID = function(t, e) {
                          if (void 0 !== e.getElementById && m) {
                            var n = e.getElementById(t)
                            return n ? [n] : []
                          }
                        }),
                        (i.filter.ID = function(t) {
                          var e = t.replace(et, nt)
                          return function(t) {
                            return t.getAttribute('id') === e
                          }
                        }))
                      : (delete i.find.ID,
                        (i.filter.ID = function(t) {
                          var e = t.replace(et, nt)
                          return function(t) {
                            var n =
                              void 0 !== t.getAttributeNode &&
                              t.getAttributeNode('id')
                            return n && n.value === e
                          }
                        })),
                    (i.find.TAG = n.getElementsByTagName
                      ? function(t, e) {
                          return void 0 !== e.getElementsByTagName
                            ? e.getElementsByTagName(t)
                            : n.qsa
                            ? e.querySelectorAll(t)
                            : void 0
                        }
                      : function(t, e) {
                          var n,
                            i = [],
                            r = 0,
                            o = e.getElementsByTagName(t)
                          if ('*' === t) {
                            for (; (n = o[r++]); ) 1 === n.nodeType && i.push(n)
                            return i
                          }
                          return o
                        }),
                    (i.find.CLASS =
                      n.getElementsByClassName &&
                      function(t, e) {
                        if (void 0 !== e.getElementsByClassName && m)
                          return e.getElementsByClassName(t)
                      }),
                    (v = []),
                    (g = []),
                    (n.qsa = K.test(h.querySelectorAll)) &&
                      (at(function(t) {
                        ;(p.appendChild(t).innerHTML =
                          "<a id='" +
                          x +
                          "'></a><select id='" +
                          x +
                          "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                          t.querySelectorAll("[msallowcapture^='']").length &&
                            g.push('[*^$]=' + R + '*(?:\'\'|"")'),
                          t.querySelectorAll('[selected]').length ||
                            g.push('\\[' + R + '*(?:value|' + M + ')'),
                          t.querySelectorAll('[id~=' + x + '-]').length ||
                            g.push('~='),
                          t.querySelectorAll(':checked').length ||
                            g.push(':checked'),
                          t.querySelectorAll('a#' + x + '+*').length ||
                            g.push('.#.+[+~]')
                      }),
                      at(function(t) {
                        var e = h.createElement('input')
                        e.setAttribute('type', 'hidden'),
                          t.appendChild(e).setAttribute('name', 'D'),
                          t.querySelectorAll('[name=d]').length &&
                            g.push('name' + R + '*[*^$|!~]?='),
                          t.querySelectorAll(':enabled').length ||
                            g.push(':enabled', ':disabled'),
                          t.querySelectorAll('*,:x'),
                          g.push(',.*:')
                      })),
                    (n.matchesSelector = K.test(
                      (y =
                        p.matches ||
                        p.webkitMatchesSelector ||
                        p.mozMatchesSelector ||
                        p.oMatchesSelector ||
                        p.msMatchesSelector)
                    )) &&
                      at(function(t) {
                        ;(n.disconnectedMatch = y.call(t, 'div')),
                          y.call(t, "[s!='']:x"),
                          v.push('!=', I)
                      }),
                    (g = g.length && new RegExp(g.join('|'))),
                    (v = v.length && new RegExp(v.join('|'))),
                    (e = K.test(p.compareDocumentPosition)),
                    (b =
                      e || K.test(p.contains)
                        ? function(t, e) {
                            var n = 9 === t.nodeType ? t.documentElement : t,
                              i = e && e.parentNode
                            return (
                              t === i ||
                              !(
                                !i ||
                                1 !== i.nodeType ||
                                !(n.contains
                                  ? n.contains(i)
                                  : t.compareDocumentPosition &&
                                    16 & t.compareDocumentPosition(i))
                              )
                            )
                          }
                        : function(t, e) {
                            if (e)
                              for (; (e = e.parentNode); )
                                if (e === t) return !0
                            return !1
                          }),
                    (E = e
                      ? function(t, e) {
                          if (t === e) return (f = !0), 0
                          var i =
                            !t.compareDocumentPosition -
                            !e.compareDocumentPosition
                          return (
                            i ||
                            (1 &
                              (i =
                                (t.ownerDocument || t) ===
                                (e.ownerDocument || e)
                                  ? t.compareDocumentPosition(e)
                                  : 1) ||
                            (!n.sortDetached &&
                              e.compareDocumentPosition(t) === i)
                              ? t === h || (t.ownerDocument === q && b(q, t))
                                ? -1
                                : e === h || (e.ownerDocument === q && b(q, e))
                                ? 1
                                : u
                                ? Q(u, t) - Q(u, e)
                                : 0
                              : 4 & i
                              ? -1
                              : 1)
                          )
                        }
                      : function(t, e) {
                          if (t === e) return (f = !0), 0
                          var n,
                            i = 0,
                            r = t.parentNode,
                            o = e.parentNode,
                            s = [t],
                            a = [e]
                          if (!r || !o)
                            return t === h
                              ? -1
                              : e === h
                              ? 1
                              : r
                              ? -1
                              : o
                              ? 1
                              : u
                              ? Q(u, t) - Q(u, e)
                              : 0
                          if (r === o) return ct(t, e)
                          for (n = t; (n = n.parentNode); ) s.unshift(n)
                          for (n = e; (n = n.parentNode); ) a.unshift(n)
                          for (; s[i] === a[i]; ) i++
                          return i
                            ? ct(s[i], a[i])
                            : s[i] === q
                            ? -1
                            : a[i] === q
                            ? 1
                            : 0
                        }),
                    h)
                  : h
              }),
              (rt.matches = function(t, e) {
                return rt(t, null, null, e)
              }),
              (rt.matchesSelector = function(t, e) {
                if (
                  ((t.ownerDocument || t) !== h && d(t),
                  (e = e.replace(W, "='$1']")),
                  n.matchesSelector &&
                    m &&
                    !S[e + ' '] &&
                    (!v || !v.test(e)) &&
                    (!g || !g.test(e)))
                )
                  try {
                    var i = y.call(t, e)
                    if (
                      i ||
                      n.disconnectedMatch ||
                      (t.document && 11 !== t.document.nodeType)
                    )
                      return i
                  } catch (t) {}
                return rt(e, h, null, [t]).length > 0
              }),
              (rt.contains = function(t, e) {
                return (t.ownerDocument || t) !== h && d(t), b(t, e)
              }),
              (rt.attr = function(t, e) {
                ;(t.ownerDocument || t) !== h && d(t)
                var r = i.attrHandle[e.toLowerCase()],
                  o =
                    r && O.call(i.attrHandle, e.toLowerCase())
                      ? r(t, e, !m)
                      : void 0
                return void 0 !== o
                  ? o
                  : n.attributes || !m
                  ? t.getAttribute(e)
                  : (o = t.getAttributeNode(e)) && o.specified
                  ? o.value
                  : null
              }),
              (rt.error = function(t) {
                throw new Error('Syntax error, unrecognized expression: ' + t)
              }),
              (rt.uniqueSort = function(t) {
                var e,
                  i = [],
                  r = 0,
                  o = 0
                if (
                  ((f = !n.detectDuplicates),
                  (u = !n.sortStable && t.slice(0)),
                  t.sort(E),
                  f)
                ) {
                  for (; (e = t[o++]); ) e === t[o] && (r = i.push(o))
                  for (; r--; ) t.splice(i[r], 1)
                }
                return (u = null), t
              }),
              (r = rt.getText = function(t) {
                var e,
                  n = '',
                  i = 0,
                  o = t.nodeType
                if (o) {
                  if (1 === o || 9 === o || 11 === o) {
                    if ('string' == typeof t.textContent) return t.textContent
                    for (t = t.firstChild; t; t = t.nextSibling) n += r(t)
                  } else if (3 === o || 4 === o) return t.nodeValue
                } else for (; (e = t[i++]); ) n += r(e)
                return n
              }),
              ((i = rt.selectors = {
                cacheLength: 50,
                createPseudo: st,
                match: V,
                attrHandle: {},
                find: {},
                relative: {
                  '>': { dir: 'parentNode', first: !0 },
                  ' ': { dir: 'parentNode' },
                  '+': { dir: 'previousSibling', first: !0 },
                  '~': { dir: 'previousSibling' }
                },
                preFilter: {
                  ATTR: function(t) {
                    return (
                      (t[1] = t[1].replace(et, nt)),
                      (t[3] = (t[3] || t[4] || t[5] || '').replace(et, nt)),
                      '~=' === t[2] && (t[3] = ' ' + t[3] + ' '),
                      t.slice(0, 4)
                    )
                  },
                  CHILD: function(t) {
                    return (
                      (t[1] = t[1].toLowerCase()),
                      'nth' === t[1].slice(0, 3)
                        ? (t[3] || rt.error(t[0]),
                          (t[4] = +(t[4]
                            ? t[5] + (t[6] || 1)
                            : 2 * ('even' === t[3] || 'odd' === t[3]))),
                          (t[5] = +(t[7] + t[8] || 'odd' === t[3])))
                        : t[3] && rt.error(t[0]),
                      t
                    )
                  },
                  PSEUDO: function(t) {
                    var e,
                      n = !t[6] && t[2]
                    return V.CHILD.test(t[0])
                      ? null
                      : (t[3]
                          ? (t[2] = t[4] || t[5] || '')
                          : n &&
                            X.test(n) &&
                            (e = s(n, !0)) &&
                            (e = n.indexOf(')', n.length - e) - n.length) &&
                            ((t[0] = t[0].slice(0, e)), (t[2] = n.slice(0, e))),
                        t.slice(0, 3))
                  }
                },
                filter: {
                  TAG: function(t) {
                    var e = t.replace(et, nt).toLowerCase()
                    return '*' === t
                      ? function() {
                          return !0
                        }
                      : function(t) {
                          return t.nodeName && t.nodeName.toLowerCase() === e
                        }
                  },
                  CLASS: function(t) {
                    var e = k[t + ' ']
                    return (
                      e ||
                      ((e = new RegExp(
                        '(^|' + R + ')' + t + '(' + R + '|$)'
                      )) &&
                        k(t, function(t) {
                          return e.test(
                            ('string' == typeof t.className && t.className) ||
                              (void 0 !== t.getAttribute &&
                                t.getAttribute('class')) ||
                              ''
                          )
                        }))
                    )
                  },
                  ATTR: function(t, e, n) {
                    return function(i) {
                      var r = rt.attr(i, t)
                      return null == r
                        ? '!=' === e
                        : !e ||
                            ((r += ''),
                            '=' === e
                              ? r === n
                              : '!=' === e
                              ? r !== n
                              : '^=' === e
                              ? n && 0 === r.indexOf(n)
                              : '*=' === e
                              ? n && r.indexOf(n) > -1
                              : '$=' === e
                              ? n && r.slice(-n.length) === n
                              : '~=' === e
                              ? (' ' + r.replace(H, ' ') + ' ').indexOf(n) > -1
                              : '|=' === e &&
                                (r === n ||
                                  r.slice(0, n.length + 1) === n + '-'))
                    }
                  },
                  CHILD: function(t, e, n, i, r) {
                    var o = 'nth' !== t.slice(0, 3),
                      s = 'last' !== t.slice(-4),
                      a = 'of-type' === e
                    return 1 === i && 0 === r
                      ? function(t) {
                          return !!t.parentNode
                        }
                      : function(e, n, l) {
                          var c,
                            u,
                            f,
                            d,
                            h,
                            p,
                            m = o !== s ? 'nextSibling' : 'previousSibling',
                            g = e.parentNode,
                            v = a && e.nodeName.toLowerCase(),
                            y = !l && !a,
                            b = !1
                          if (g) {
                            if (o) {
                              for (; m; ) {
                                for (d = e; (d = d[m]); )
                                  if (
                                    a
                                      ? d.nodeName.toLowerCase() === v
                                      : 1 === d.nodeType
                                  )
                                    return !1
                                p = m = 'only' === t && !p && 'nextSibling'
                              }
                              return !0
                            }
                            if (
                              ((p = [s ? g.firstChild : g.lastChild]), s && y)
                            ) {
                              for (
                                b =
                                  (h =
                                    (c =
                                      (u =
                                        (f = (d = g)[x] || (d[x] = {}))[
                                          d.uniqueID
                                        ] || (f[d.uniqueID] = {}))[t] ||
                                      [])[0] === w && c[1]) && c[2],
                                  d = h && g.childNodes[h];
                                (d =
                                  (++h && d && d[m]) || (b = h = 0) || p.pop());

                              )
                                if (1 === d.nodeType && ++b && d === e) {
                                  u[t] = [w, h, b]
                                  break
                                }
                            } else if (
                              (y &&
                                (b = h =
                                  (c =
                                    (u =
                                      (f = (d = e)[x] || (d[x] = {}))[
                                        d.uniqueID
                                      ] || (f[d.uniqueID] = {}))[t] ||
                                    [])[0] === w && c[1]),
                              !1 === b)
                            )
                              for (
                                ;
                                (d =
                                  (++h && d && d[m]) ||
                                  (b = h = 0) ||
                                  p.pop()) &&
                                ((a
                                  ? d.nodeName.toLowerCase() !== v
                                  : 1 !== d.nodeType) ||
                                  !++b ||
                                  (y &&
                                    ((u =
                                      (f = d[x] || (d[x] = {}))[d.uniqueID] ||
                                      (f[d.uniqueID] = {}))[t] = [w, b]),
                                  d !== e));

                              );
                            return (b -= r) === i || (b % i == 0 && b / i >= 0)
                          }
                        }
                  },
                  PSEUDO: function(t, e) {
                    var n,
                      r =
                        i.pseudos[t] ||
                        i.setFilters[t.toLowerCase()] ||
                        rt.error('unsupported pseudo: ' + t)
                    return r[x]
                      ? r(e)
                      : r.length > 1
                      ? ((n = [t, t, '', e]),
                        i.setFilters.hasOwnProperty(t.toLowerCase())
                          ? st(function(t, n) {
                              for (var i, o = r(t, e), s = o.length; s--; )
                                t[(i = Q(t, o[s]))] = !(n[i] = o[s])
                            })
                          : function(t) {
                              return r(t, 0, n)
                            })
                      : r
                  }
                },
                pseudos: {
                  not: st(function(t) {
                    var e = [],
                      n = [],
                      i = a(t.replace(B, '$1'))
                    return i[x]
                      ? st(function(t, e, n, r) {
                          for (
                            var o, s = i(t, null, r, []), a = t.length;
                            a--;

                          )
                            (o = s[a]) && (t[a] = !(e[a] = o))
                        })
                      : function(t, r, o) {
                          return (
                            (e[0] = t),
                            i(e, null, o, n),
                            (e[0] = null),
                            !n.pop()
                          )
                        }
                  }),
                  has: st(function(t) {
                    return function(e) {
                      return rt(t, e).length > 0
                    }
                  }),
                  contains: st(function(t) {
                    return (
                      (t = t.replace(et, nt)),
                      function(e) {
                        return (
                          (e.textContent || e.innerText || r(e)).indexOf(t) > -1
                        )
                      }
                    )
                  }),
                  lang: st(function(t) {
                    return (
                      U.test(t || '') || rt.error('unsupported lang: ' + t),
                      (t = t.replace(et, nt).toLowerCase()),
                      function(e) {
                        var n
                        do {
                          if (
                            (n = m
                              ? e.lang
                              : e.getAttribute('xml:lang') ||
                                e.getAttribute('lang'))
                          )
                            return (
                              (n = n.toLowerCase()) === t ||
                              0 === n.indexOf(t + '-')
                            )
                        } while ((e = e.parentNode) && 1 === e.nodeType)
                        return !1
                      }
                    )
                  }),
                  target: function(e) {
                    var n = t.location && t.location.hash
                    return n && n.slice(1) === e.id
                  },
                  root: function(t) {
                    return t === p
                  },
                  focus: function(t) {
                    return (
                      t === h.activeElement &&
                      (!h.hasFocus || h.hasFocus()) &&
                      !!(t.type || t.href || ~t.tabIndex)
                    )
                  },
                  enabled: function(t) {
                    return !1 === t.disabled
                  },
                  disabled: function(t) {
                    return !0 === t.disabled
                  },
                  checked: function(t) {
                    var e = t.nodeName.toLowerCase()
                    return (
                      ('input' === e && !!t.checked) ||
                      ('option' === e && !!t.selected)
                    )
                  },
                  selected: function(t) {
                    return (
                      t.parentNode && t.parentNode.selectedIndex,
                      !0 === t.selected
                    )
                  },
                  empty: function(t) {
                    for (t = t.firstChild; t; t = t.nextSibling)
                      if (t.nodeType < 6) return !1
                    return !0
                  },
                  parent: function(t) {
                    return !i.pseudos.empty(t)
                  },
                  header: function(t) {
                    return G.test(t.nodeName)
                  },
                  input: function(t) {
                    return Y.test(t.nodeName)
                  },
                  button: function(t) {
                    var e = t.nodeName.toLowerCase()
                    return (
                      ('input' === e && 'button' === t.type) || 'button' === e
                    )
                  },
                  text: function(t) {
                    var e
                    return (
                      'input' === t.nodeName.toLowerCase() &&
                      'text' === t.type &&
                      (null == (e = t.getAttribute('type')) ||
                        'text' === e.toLowerCase())
                    )
                  },
                  first: dt(function() {
                    return [0]
                  }),
                  last: dt(function(t, e) {
                    return [e - 1]
                  }),
                  eq: dt(function(t, e, n) {
                    return [n < 0 ? n + e : n]
                  }),
                  even: dt(function(t, e) {
                    for (var n = 0; n < e; n += 2) t.push(n)
                    return t
                  }),
                  odd: dt(function(t, e) {
                    for (var n = 1; n < e; n += 2) t.push(n)
                    return t
                  }),
                  lt: dt(function(t, e, n) {
                    for (var i = n < 0 ? n + e : n; --i >= 0; ) t.push(i)
                    return t
                  }),
                  gt: dt(function(t, e, n) {
                    for (var i = n < 0 ? n + e : n; ++i < e; ) t.push(i)
                    return t
                  })
                }
              }).pseudos.nth = i.pseudos.eq),
              { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
                i.pseudos[e] = ut(e)
              for (e in { submit: !0, reset: !0 }) i.pseudos[e] = ft(e)
              function pt() {}
              function mt(t) {
                for (var e = 0, n = t.length, i = ''; e < n; e++)
                  i += t[e].value
                return i
              }
              function gt(t, e, n) {
                var i = e.dir,
                  r = n && 'parentNode' === i,
                  o = T++
                return e.first
                  ? function(e, n, o) {
                      for (; (e = e[i]); )
                        if (1 === e.nodeType || r) return t(e, n, o)
                    }
                  : function(e, n, s) {
                      var a,
                        l,
                        c,
                        u = [w, o]
                      if (s) {
                        for (; (e = e[i]); )
                          if ((1 === e.nodeType || r) && t(e, n, s)) return !0
                      } else
                        for (; (e = e[i]); )
                          if (1 === e.nodeType || r) {
                            if (
                              (a = (l =
                                (c = e[x] || (e[x] = {}))[e.uniqueID] ||
                                (c[e.uniqueID] = {}))[i]) &&
                              a[0] === w &&
                              a[1] === o
                            )
                              return (u[2] = a[2])
                            if (((l[i] = u), (u[2] = t(e, n, s)))) return !0
                          }
                    }
              }
              function vt(t) {
                return t.length > 1
                  ? function(e, n, i) {
                      for (var r = t.length; r--; )
                        if (!t[r](e, n, i)) return !1
                      return !0
                    }
                  : t[0]
              }
              function yt(t, e, n, i, r) {
                for (
                  var o, s = [], a = 0, l = t.length, c = null != e;
                  a < l;
                  a++
                )
                  (o = t[a]) &&
                    ((n && !n(o, i, r)) || (s.push(o), c && e.push(a)))
                return s
              }
              function bt(t, e, n, i, r, o) {
                return (
                  i && !i[x] && (i = bt(i)),
                  r && !r[x] && (r = bt(r, o)),
                  st(function(o, s, a, l) {
                    var c,
                      u,
                      f,
                      d = [],
                      h = [],
                      p = s.length,
                      m =
                        o ||
                        (function(t, e, n) {
                          for (var i = 0, r = e.length; i < r; i++)
                            rt(t, e[i], n)
                          return n
                        })(e || '*', a.nodeType ? [a] : a, []),
                      g = !t || (!o && e) ? m : yt(m, d, t, a, l),
                      v = n ? (r || (o ? t : p || i) ? [] : s) : g
                    if ((n && n(g, v, a, l), i))
                      for (c = yt(v, h), i(c, [], a, l), u = c.length; u--; )
                        (f = c[u]) && (v[h[u]] = !(g[h[u]] = f))
                    if (o) {
                      if (r || t) {
                        if (r) {
                          for (c = [], u = v.length; u--; )
                            (f = v[u]) && c.push((g[u] = f))
                          r(null, (v = []), c, l)
                        }
                        for (u = v.length; u--; )
                          (f = v[u]) &&
                            (c = r ? Q(o, f) : d[u]) > -1 &&
                            (o[c] = !(s[c] = f))
                      }
                    } else (v = yt(v === s ? v.splice(p, v.length) : v)), r ? r(null, s, v, l) : _.apply(s, v)
                  })
                )
              }
              function xt(t) {
                for (
                  var e,
                    n,
                    r,
                    o = t.length,
                    s = i.relative[t[0].type],
                    a = s || i.relative[' '],
                    l = s ? 1 : 0,
                    u = gt(
                      function(t) {
                        return t === e
                      },
                      a,
                      !0
                    ),
                    f = gt(
                      function(t) {
                        return Q(e, t) > -1
                      },
                      a,
                      !0
                    ),
                    d = [
                      function(t, n, i) {
                        var r =
                          (!s && (i || n !== c)) ||
                          ((e = n).nodeType ? u(t, n, i) : f(t, n, i))
                        return (e = null), r
                      }
                    ];
                  l < o;
                  l++
                )
                  if ((n = i.relative[t[l].type])) d = [gt(vt(d), n)]
                  else {
                    if (
                      (n = i.filter[t[l].type].apply(null, t[l].matches))[x]
                    ) {
                      for (r = ++l; r < o && !i.relative[t[r].type]; r++);
                      return bt(
                        l > 1 && vt(d),
                        l > 1 &&
                          mt(
                            t
                              .slice(0, l - 1)
                              .concat({
                                value: ' ' === t[l - 2].type ? '*' : ''
                              })
                          ).replace(B, '$1'),
                        n,
                        l < r && xt(t.slice(l, r)),
                        r < o && xt((t = t.slice(r))),
                        r < o && mt(t)
                      )
                    }
                    d.push(n)
                  }
                return vt(d)
              }
              return (
                (pt.prototype = i.filters = i.pseudos),
                (i.setFilters = new pt()),
                (s = rt.tokenize = function(t, e) {
                  var n,
                    r,
                    o,
                    s,
                    a,
                    l,
                    c,
                    u = C[t + ' ']
                  if (u) return e ? 0 : u.slice(0)
                  for (a = t, l = [], c = i.preFilter; a; ) {
                    for (s in ((n && !(r = P.exec(a))) ||
                      (r && (a = a.slice(r[0].length) || a), l.push((o = []))),
                    (n = !1),
                    (r = $.exec(a)) &&
                      ((n = r.shift()),
                      o.push({ value: n, type: r[0].replace(B, ' ') }),
                      (a = a.slice(n.length))),
                    i.filter))
                      !(r = V[s].exec(a)) ||
                        (c[s] && !(r = c[s](r))) ||
                        ((n = r.shift()),
                        o.push({ value: n, type: s, matches: r }),
                        (a = a.slice(n.length)))
                    if (!n) break
                  }
                  return e ? a.length : a ? rt.error(t) : C(t, l).slice(0)
                }),
                (a = rt.compile = function(t, e) {
                  var n,
                    r = [],
                    o = [],
                    a = S[t + ' ']
                  if (!a) {
                    for (e || (e = s(t)), n = e.length; n--; )
                      (a = xt(e[n]))[x] ? r.push(a) : o.push(a)
                    ;(a = S(
                      t,
                      (function(t, e) {
                        var n = e.length > 0,
                          r = t.length > 0,
                          o = function(o, s, a, l, u) {
                            var f,
                              p,
                              g,
                              v = 0,
                              y = '0',
                              b = o && [],
                              x = [],
                              q = c,
                              T = o || (r && i.find.TAG('*', u)),
                              k = (w += null == q ? 1 : Math.random() || 0.1),
                              C = T.length
                            for (
                              u && (c = s === h || s || u);
                              y !== C && null != (f = T[y]);
                              y++
                            ) {
                              if (r && f) {
                                for (
                                  p = 0,
                                    s ||
                                      f.ownerDocument === h ||
                                      (d(f), (a = !m));
                                  (g = t[p++]);

                                )
                                  if (g(f, s || h, a)) {
                                    l.push(f)
                                    break
                                  }
                                u && (w = k)
                              }
                              n && ((f = !g && f) && v--, o && b.push(f))
                            }
                            if (((v += y), n && y !== v)) {
                              for (p = 0; (g = e[p++]); ) g(b, x, s, a)
                              if (o) {
                                if (v > 0)
                                  for (; y--; )
                                    b[y] || x[y] || (x[y] = A.call(l))
                                x = yt(x)
                              }
                              _.apply(l, x),
                                u &&
                                  !o &&
                                  x.length > 0 &&
                                  v + e.length > 1 &&
                                  rt.uniqueSort(l)
                            }
                            return u && ((w = k), (c = q)), b
                          }
                        return n ? st(o) : o
                      })(o, r)
                    )).selector = t
                  }
                  return a
                }),
                (l = rt.select = function(t, e, r, o) {
                  var l,
                    c,
                    u,
                    f,
                    d,
                    h = 'function' == typeof t && t,
                    p = !o && s((t = h.selector || t))
                  if (((r = r || []), 1 === p.length)) {
                    if (
                      (c = p[0] = p[0].slice(0)).length > 2 &&
                      'ID' === (u = c[0]).type &&
                      n.getById &&
                      9 === e.nodeType &&
                      m &&
                      i.relative[c[1].type]
                    ) {
                      if (
                        !(e = (i.find.ID(u.matches[0].replace(et, nt), e) ||
                          [])[0])
                      )
                        return r
                      h && (e = e.parentNode),
                        (t = t.slice(c.shift().value.length))
                    }
                    for (
                      l = V.needsContext.test(t) ? 0 : c.length;
                      l-- && ((u = c[l]), !i.relative[(f = u.type)]);

                    )
                      if (
                        (d = i.find[f]) &&
                        (o = d(
                          u.matches[0].replace(et, nt),
                          (Z.test(c[0].type) && ht(e.parentNode)) || e
                        ))
                      ) {
                        if ((c.splice(l, 1), !(t = o.length && mt(c))))
                          return _.apply(r, o), r
                        break
                      }
                  }
                  return (
                    (h || a(t, p))(
                      o,
                      e,
                      !m,
                      r,
                      !e || (Z.test(t) && ht(e.parentNode)) || e
                    ),
                    r
                  )
                }),
                (n.sortStable =
                  x
                    .split('')
                    .sort(E)
                    .join('') === x),
                (n.detectDuplicates = !!f),
                d(),
                (n.sortDetached = at(function(t) {
                  return 1 & t.compareDocumentPosition(h.createElement('div'))
                })),
                at(function(t) {
                  return (
                    (t.innerHTML = "<a href='#'></a>"),
                    '#' === t.firstChild.getAttribute('href')
                  )
                }) ||
                  lt('type|href|height|width', function(t, e, n) {
                    if (!n)
                      return t.getAttribute(
                        e,
                        'type' === e.toLowerCase() ? 1 : 2
                      )
                  }),
                (n.attributes &&
                  at(function(t) {
                    return (
                      (t.innerHTML = '<input/>'),
                      t.firstChild.setAttribute('value', ''),
                      '' === t.firstChild.getAttribute('value')
                    )
                  })) ||
                  lt('value', function(t, e, n) {
                    if (!n && 'input' === t.nodeName.toLowerCase())
                      return t.defaultValue
                  }),
                at(function(t) {
                  return null == t.getAttribute('disabled')
                }) ||
                  lt(M, function(t, e, n) {
                    var i
                    if (!n)
                      return !0 === t[e]
                        ? e.toLowerCase()
                        : (i = t.getAttributeNode(e)) && i.specified
                        ? i.value
                        : null
                  }),
                rt
              )
            })(n)
          ;(m.find = q),
            (m.expr = q.selectors),
            (m.expr[':'] = m.expr.pseudos),
            (m.uniqueSort = m.unique = q.uniqueSort),
            (m.text = q.getText),
            (m.isXMLDoc = q.isXML),
            (m.contains = q.contains)
          var w = function(t, e, n) {
              for (
                var i = [], r = void 0 !== n;
                (t = t[e]) && 9 !== t.nodeType;

              )
                if (1 === t.nodeType) {
                  if (r && m(t).is(n)) break
                  i.push(t)
                }
              return i
            },
            T = function(t, e) {
              for (var n = []; t; t = t.nextSibling)
                1 === t.nodeType && t !== e && n.push(t)
              return n
            },
            k = m.expr.match.needsContext,
            C = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
            S = /^.[^:#\[\.,]*$/
          function E(t, e, n) {
            if (m.isFunction(e))
              return m.grep(t, function(t, i) {
                return !!e.call(t, i, t) !== n
              })
            if (e.nodeType)
              return m.grep(t, function(t) {
                return (t === e) !== n
              })
            if ('string' == typeof e) {
              if (S.test(e)) return m.filter(e, t, n)
              e = m.filter(e, t)
            }
            return m.grep(t, function(t) {
              return m.inArray(t, e) > -1 !== n
            })
          }
          ;(m.filter = function(t, e, n) {
            var i = e[0]
            return (
              n && (t = ':not(' + t + ')'),
              1 === e.length && 1 === i.nodeType
                ? m.find.matchesSelector(i, t)
                  ? [i]
                  : []
                : m.find.matches(
                    t,
                    m.grep(e, function(t) {
                      return 1 === t.nodeType
                    })
                  )
            )
          }),
            m.fn.extend({
              find: function(t) {
                var e,
                  n = [],
                  i = this,
                  r = i.length
                if ('string' != typeof t)
                  return this.pushStack(
                    m(t).filter(function() {
                      for (e = 0; e < r; e++)
                        if (m.contains(i[e], this)) return !0
                    })
                  )
                for (e = 0; e < r; e++) m.find(t, i[e], n)
                return (
                  ((n = this.pushStack(r > 1 ? m.unique(n) : n)).selector = this
                    .selector
                    ? this.selector + ' ' + t
                    : t),
                  n
                )
              },
              filter: function(t) {
                return this.pushStack(E(this, t || [], !1))
              },
              not: function(t) {
                return this.pushStack(E(this, t || [], !0))
              },
              is: function(t) {
                return !!E(
                  this,
                  'string' == typeof t && k.test(t) ? m(t) : t || [],
                  !1
                ).length
              }
            })
          var j,
            O = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/
          ;((m.fn.init = function(t, e, n) {
            var i, r
            if (!t) return this
            if (((n = n || j), 'string' == typeof t)) {
              if (
                !(i =
                  '<' === t.charAt(0) &&
                  '>' === t.charAt(t.length - 1) &&
                  t.length >= 3
                    ? [null, t, null]
                    : O.exec(t)) ||
                (!i[1] && e)
              )
                return !e || e.jquery
                  ? (e || n).find(t)
                  : this.constructor(e).find(t)
              if (i[1]) {
                if (
                  ((e = e instanceof m ? e[0] : e),
                  m.merge(
                    this,
                    m.parseHTML(
                      i[1],
                      e && e.nodeType ? e.ownerDocument || e : s,
                      !0
                    )
                  ),
                  C.test(i[1]) && m.isPlainObject(e))
                )
                  for (i in e)
                    m.isFunction(this[i]) ? this[i](e[i]) : this.attr(i, e[i])
                return this
              }
              if ((r = s.getElementById(i[2])) && r.parentNode) {
                if (r.id !== i[2]) return j.find(t)
                ;(this.length = 1), (this[0] = r)
              }
              return (this.context = s), (this.selector = t), this
            }
            return t.nodeType
              ? ((this.context = this[0] = t), (this.length = 1), this)
              : m.isFunction(t)
              ? void 0 !== n.ready
                ? n.ready(t)
                : t(m)
              : (void 0 !== t.selector &&
                  ((this.selector = t.selector), (this.context = t.context)),
                m.makeArray(t, this))
          }).prototype = m.fn),
            (j = m(s))
          var D = /^(?:parents|prev(?:Until|All))/,
            A = { children: !0, contents: !0, next: !0, prev: !0 }
          function L(t, e) {
            do {
              t = t[e]
            } while (t && 1 !== t.nodeType)
            return t
          }
          m.fn.extend({
            has: function(t) {
              var e,
                n = m(t, this),
                i = n.length
              return this.filter(function() {
                for (e = 0; e < i; e++) if (m.contains(this, n[e])) return !0
              })
            },
            closest: function(t, e) {
              for (
                var n,
                  i = 0,
                  r = this.length,
                  o = [],
                  s =
                    k.test(t) || 'string' != typeof t
                      ? m(t, e || this.context)
                      : 0;
                i < r;
                i++
              )
                for (n = this[i]; n && n !== e; n = n.parentNode)
                  if (
                    n.nodeType < 11 &&
                    (s
                      ? s.index(n) > -1
                      : 1 === n.nodeType && m.find.matchesSelector(n, t))
                  ) {
                    o.push(n)
                    break
                  }
              return this.pushStack(o.length > 1 ? m.uniqueSort(o) : o)
            },
            index: function(t) {
              return t
                ? 'string' == typeof t
                  ? m.inArray(this[0], m(t))
                  : m.inArray(t.jquery ? t[0] : t, this)
                : this[0] && this[0].parentNode
                ? this.first().prevAll().length
                : -1
            },
            add: function(t, e) {
              return this.pushStack(m.uniqueSort(m.merge(this.get(), m(t, e))))
            },
            addBack: function(t) {
              return this.add(
                null == t ? this.prevObject : this.prevObject.filter(t)
              )
            }
          }),
            m.each(
              {
                parent: function(t) {
                  var e = t.parentNode
                  return e && 11 !== e.nodeType ? e : null
                },
                parents: function(t) {
                  return w(t, 'parentNode')
                },
                parentsUntil: function(t, e, n) {
                  return w(t, 'parentNode', n)
                },
                next: function(t) {
                  return L(t, 'nextSibling')
                },
                prev: function(t) {
                  return L(t, 'previousSibling')
                },
                nextAll: function(t) {
                  return w(t, 'nextSibling')
                },
                prevAll: function(t) {
                  return w(t, 'previousSibling')
                },
                nextUntil: function(t, e, n) {
                  return w(t, 'nextSibling', n)
                },
                prevUntil: function(t, e, n) {
                  return w(t, 'previousSibling', n)
                },
                siblings: function(t) {
                  return T((t.parentNode || {}).firstChild, t)
                },
                children: function(t) {
                  return T(t.firstChild)
                },
                contents: function(t) {
                  return m.nodeName(t, 'iframe')
                    ? t.contentDocument || t.contentWindow.document
                    : m.merge([], t.childNodes)
                }
              },
              function(t, e) {
                m.fn[t] = function(n, i) {
                  var r = m.map(this, e, n)
                  return (
                    'Until' !== t.slice(-5) && (i = n),
                    i && 'string' == typeof i && (r = m.filter(i, r)),
                    this.length > 1 &&
                      (A[t] || (r = m.uniqueSort(r)),
                      D.test(t) && (r = r.reverse())),
                    this.pushStack(r)
                  )
                }
              }
            )
          var _,
            N,
            Q = /\S+/g
          function M() {
            s.addEventListener
              ? (s.removeEventListener('DOMContentLoaded', R),
                n.removeEventListener('load', R))
              : (s.detachEvent('onreadystatechange', R),
                n.detachEvent('onload', R))
          }
          function R() {
            ;(s.addEventListener ||
              'load' === n.event.type ||
              'complete' === s.readyState) &&
              (M(), m.ready())
          }
          for (N in ((m.Callbacks = function(t) {
            t =
              'string' == typeof t
                ? (function(t) {
                    var e = {}
                    return (
                      m.each(t.match(Q) || [], function(t, n) {
                        e[n] = !0
                      }),
                      e
                    )
                  })(t)
                : m.extend({}, t)
            var e,
              n,
              i,
              r,
              o = [],
              s = [],
              a = -1,
              l = function() {
                for (r = t.once, i = e = !0; s.length; a = -1)
                  for (n = s.shift(); ++a < o.length; )
                    !1 === o[a].apply(n[0], n[1]) &&
                      t.stopOnFalse &&
                      ((a = o.length), (n = !1))
                t.memory || (n = !1), (e = !1), r && (o = n ? [] : '')
              },
              c = {
                add: function() {
                  return (
                    o &&
                      (n && !e && ((a = o.length - 1), s.push(n)),
                      (function e(n) {
                        m.each(n, function(n, i) {
                          m.isFunction(i)
                            ? (t.unique && c.has(i)) || o.push(i)
                            : i && i.length && 'string' !== m.type(i) && e(i)
                        })
                      })(arguments),
                      n && !e && l()),
                    this
                  )
                },
                remove: function() {
                  return (
                    m.each(arguments, function(t, e) {
                      for (var n; (n = m.inArray(e, o, n)) > -1; )
                        o.splice(n, 1), n <= a && a--
                    }),
                    this
                  )
                },
                has: function(t) {
                  return t ? m.inArray(t, o) > -1 : o.length > 0
                },
                empty: function() {
                  return o && (o = []), this
                },
                disable: function() {
                  return (r = s = []), (o = n = ''), this
                },
                disabled: function() {
                  return !o
                },
                lock: function() {
                  return (r = !0), n || c.disable(), this
                },
                locked: function() {
                  return !!r
                },
                fireWith: function(t, n) {
                  return (
                    r ||
                      ((n = [t, (n = n || []).slice ? n.slice() : n]),
                      s.push(n),
                      e || l()),
                    this
                  )
                },
                fire: function() {
                  return c.fireWith(this, arguments), this
                },
                fired: function() {
                  return !!i
                }
              }
            return c
          }),
          m.extend({
            Deferred: function(t) {
              var e = [
                  ['resolve', 'done', m.Callbacks('once memory'), 'resolved'],
                  ['reject', 'fail', m.Callbacks('once memory'), 'rejected'],
                  ['notify', 'progress', m.Callbacks('memory')]
                ],
                n = 'pending',
                i = {
                  state: function() {
                    return n
                  },
                  always: function() {
                    return r.done(arguments).fail(arguments), this
                  },
                  then: function() {
                    var t = arguments
                    return m
                      .Deferred(function(n) {
                        m.each(e, function(e, o) {
                          var s = m.isFunction(t[e]) && t[e]
                          r[o[1]](function() {
                            var t = s && s.apply(this, arguments)
                            t && m.isFunction(t.promise)
                              ? t
                                  .promise()
                                  .progress(n.notify)
                                  .done(n.resolve)
                                  .fail(n.reject)
                              : n[o[0] + 'With'](
                                  this === i ? n.promise() : this,
                                  s ? [t] : arguments
                                )
                          })
                        }),
                          (t = null)
                      })
                      .promise()
                  },
                  promise: function(t) {
                    return null != t ? m.extend(t, i) : i
                  }
                },
                r = {}
              return (
                (i.pipe = i.then),
                m.each(e, function(t, o) {
                  var s = o[2],
                    a = o[3]
                  ;(i[o[1]] = s.add),
                    a &&
                      s.add(
                        function() {
                          n = a
                        },
                        e[1 ^ t][2].disable,
                        e[2][2].lock
                      ),
                    (r[o[0]] = function() {
                      return (
                        r[o[0] + 'With'](this === r ? i : this, arguments), this
                      )
                    }),
                    (r[o[0] + 'With'] = s.fireWith)
                }),
                i.promise(r),
                t && t.call(r, r),
                r
              )
            },
            when: function(t) {
              var e,
                n,
                i,
                r = 0,
                o = a.call(arguments),
                s = o.length,
                l = 1 !== s || (t && m.isFunction(t.promise)) ? s : 0,
                c = 1 === l ? t : m.Deferred(),
                u = function(t, n, i) {
                  return function(r) {
                    ;(n[t] = this),
                      (i[t] = arguments.length > 1 ? a.call(arguments) : r),
                      i === e ? c.notifyWith(n, i) : --l || c.resolveWith(n, i)
                  }
                }
              if (s > 1)
                for (
                  e = new Array(s), n = new Array(s), i = new Array(s);
                  r < s;
                  r++
                )
                  o[r] && m.isFunction(o[r].promise)
                    ? o[r]
                        .promise()
                        .progress(u(r, n, e))
                        .done(u(r, i, o))
                        .fail(c.reject)
                    : --l
              return l || c.resolveWith(i, o), c.promise()
            }
          }),
          (m.fn.ready = function(t) {
            return m.ready.promise().done(t), this
          }),
          m.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(t) {
              t ? m.readyWait++ : m.ready(!0)
            },
            ready: function(t) {
              ;(!0 === t ? --m.readyWait : m.isReady) ||
                ((m.isReady = !0),
                (!0 !== t && --m.readyWait > 0) ||
                  (_.resolveWith(s, [m]),
                  m.fn.triggerHandler &&
                    (m(s).triggerHandler('ready'), m(s).off('ready'))))
            }
          }),
          (m.ready.promise = function(t) {
            if (!_)
              if (
                ((_ = m.Deferred()),
                'complete' === s.readyState ||
                  ('loading' !== s.readyState && !s.documentElement.doScroll))
              )
                n.setTimeout(m.ready)
              else if (s.addEventListener)
                s.addEventListener('DOMContentLoaded', R),
                  n.addEventListener('load', R)
              else {
                s.attachEvent('onreadystatechange', R),
                  n.attachEvent('onload', R)
                var e = !1
                try {
                  e = null == n.frameElement && s.documentElement
                } catch (t) {}
                e &&
                  e.doScroll &&
                  (function t() {
                    if (!m.isReady) {
                      try {
                        e.doScroll('left')
                      } catch (e) {
                        return n.setTimeout(t, 50)
                      }
                      M(), m.ready()
                    }
                  })()
              }
            return _.promise(t)
          }),
          m.ready.promise(),
          m(p)))
            break
          ;(p.ownFirst = '0' === N),
            (p.inlineBlockNeedsLayout = !1),
            m(function() {
              var t, e, n, i
              ;(n = s.getElementsByTagName('body')[0]) &&
                n.style &&
                ((e = s.createElement('div')),
                ((i = s.createElement('div')).style.cssText =
                  'position:absolute;border:0;width:0;height:0;top:0;left:-9999px'),
                n.appendChild(i).appendChild(e),
                void 0 !== e.style.zoom &&
                  ((e.style.cssText =
                    'display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1'),
                  (p.inlineBlockNeedsLayout = t = 3 === e.offsetWidth),
                  t && (n.style.zoom = 1)),
                n.removeChild(i))
            }),
            (function() {
              var t = s.createElement('div')
              p.deleteExpando = !0
              try {
                delete t.test
              } catch (t) {
                p.deleteExpando = !1
              }
              t = null
            })()
          var z,
            F = function(t) {
              var e = m.noData[(t.nodeName + ' ').toLowerCase()],
                n = +t.nodeType || 1
              return (
                (1 === n || 9 === n) &&
                (!e || (!0 !== e && t.getAttribute('classid') === e))
              )
            },
            I = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            H = /([A-Z])/g
          function B(t, e, n) {
            if (void 0 === n && 1 === t.nodeType) {
              var i = 'data-' + e.replace(H, '-$1').toLowerCase()
              if ('string' == typeof (n = t.getAttribute(i))) {
                try {
                  n =
                    'true' === n ||
                    ('false' !== n &&
                      ('null' === n
                        ? null
                        : +n + '' === n
                        ? +n
                        : I.test(n)
                        ? m.parseJSON(n)
                        : n))
                } catch (t) {}
                m.data(t, e, n)
              } else n = void 0
            }
            return n
          }
          function P(t) {
            var e
            for (e in t)
              if (('data' !== e || !m.isEmptyObject(t[e])) && 'toJSON' !== e)
                return !1
            return !0
          }
          function $(t, e, n, i) {
            if (F(t)) {
              var r,
                s,
                a = m.expando,
                l = t.nodeType,
                c = l ? m.cache : t,
                u = l ? t[a] : t[a] && a
              if (
                (u && c[u] && (i || c[u].data)) ||
                void 0 !== n ||
                'string' != typeof e
              )
                return (
                  u || (u = l ? (t[a] = o.pop() || m.guid++) : a),
                  c[u] || (c[u] = l ? {} : { toJSON: m.noop }),
                  ('object' != typeof e && 'function' != typeof e) ||
                    (i
                      ? (c[u] = m.extend(c[u], e))
                      : (c[u].data = m.extend(c[u].data, e))),
                  (s = c[u]),
                  i || (s.data || (s.data = {}), (s = s.data)),
                  void 0 !== n && (s[m.camelCase(e)] = n),
                  'string' == typeof e
                    ? null == (r = s[e]) && (r = s[m.camelCase(e)])
                    : (r = s),
                  r
                )
            }
          }
          function W(t, e, n) {
            if (F(t)) {
              var i,
                r,
                o = t.nodeType,
                s = o ? m.cache : t,
                a = o ? t[m.expando] : m.expando
              if (s[a]) {
                if (e && (i = n ? s[a] : s[a].data)) {
                  r = (e = m.isArray(e)
                    ? e.concat(m.map(e, m.camelCase))
                    : e in i
                    ? [e]
                    : (e = m.camelCase(e)) in i
                    ? [e]
                    : e.split(' ')).length
                  for (; r--; ) delete i[e[r]]
                  if (n ? !P(i) : !m.isEmptyObject(i)) return
                }
                ;(n || (delete s[a].data, P(s[a]))) &&
                  (o
                    ? m.cleanData([t], !0)
                    : p.deleteExpando || s != s.window
                    ? delete s[a]
                    : (s[a] = void 0))
              }
            }
          }
          m.extend({
            cache: {},
            noData: {
              'applet ': !0,
              'embed ': !0,
              'object ': 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'
            },
            hasData: function(t) {
              return (
                !!(t = t.nodeType ? m.cache[t[m.expando]] : t[m.expando]) &&
                !P(t)
              )
            },
            data: function(t, e, n) {
              return $(t, e, n)
            },
            removeData: function(t, e) {
              return W(t, e)
            },
            _data: function(t, e, n) {
              return $(t, e, n, !0)
            },
            _removeData: function(t, e) {
              return W(t, e, !0)
            }
          }),
            m.fn.extend({
              data: function(t, e) {
                var n,
                  i,
                  r,
                  o = this[0],
                  s = o && o.attributes
                if (void 0 === t) {
                  if (
                    this.length &&
                    ((r = m.data(o)),
                    1 === o.nodeType && !m._data(o, 'parsedAttrs'))
                  ) {
                    for (n = s.length; n--; )
                      s[n] &&
                        0 === (i = s[n].name).indexOf('data-') &&
                        B(o, (i = m.camelCase(i.slice(5))), r[i])
                    m._data(o, 'parsedAttrs', !0)
                  }
                  return r
                }
                return 'object' == typeof t
                  ? this.each(function() {
                      m.data(this, t)
                    })
                  : arguments.length > 1
                  ? this.each(function() {
                      m.data(this, t, e)
                    })
                  : o
                  ? B(o, t, m.data(o, t))
                  : void 0
              },
              removeData: function(t) {
                return this.each(function() {
                  m.removeData(this, t)
                })
              }
            }),
            m.extend({
              queue: function(t, e, n) {
                var i
                if (t)
                  return (
                    (e = (e || 'fx') + 'queue'),
                    (i = m._data(t, e)),
                    n &&
                      (!i || m.isArray(n)
                        ? (i = m._data(t, e, m.makeArray(n)))
                        : i.push(n)),
                    i || []
                  )
              },
              dequeue: function(t, e) {
                e = e || 'fx'
                var n = m.queue(t, e),
                  i = n.length,
                  r = n.shift(),
                  o = m._queueHooks(t, e)
                'inprogress' === r && ((r = n.shift()), i--),
                  r &&
                    ('fx' === e && n.unshift('inprogress'),
                    delete o.stop,
                    r.call(
                      t,
                      function() {
                        m.dequeue(t, e)
                      },
                      o
                    )),
                  !i && o && o.empty.fire()
              },
              _queueHooks: function(t, e) {
                var n = e + 'queueHooks'
                return (
                  m._data(t, n) ||
                  m._data(t, n, {
                    empty: m.Callbacks('once memory').add(function() {
                      m._removeData(t, e + 'queue'), m._removeData(t, n)
                    })
                  })
                )
              }
            }),
            m.fn.extend({
              queue: function(t, e) {
                var n = 2
                return (
                  'string' != typeof t && ((e = t), (t = 'fx'), n--),
                  arguments.length < n
                    ? m.queue(this[0], t)
                    : void 0 === e
                    ? this
                    : this.each(function() {
                        var n = m.queue(this, t, e)
                        m._queueHooks(this, t),
                          'fx' === t &&
                            'inprogress' !== n[0] &&
                            m.dequeue(this, t)
                      })
                )
              },
              dequeue: function(t) {
                return this.each(function() {
                  m.dequeue(this, t)
                })
              },
              clearQueue: function(t) {
                return this.queue(t || 'fx', [])
              },
              promise: function(t, e) {
                var n,
                  i = 1,
                  r = m.Deferred(),
                  o = this,
                  s = this.length,
                  a = function() {
                    --i || r.resolveWith(o, [o])
                  }
                for (
                  'string' != typeof t && ((e = t), (t = void 0)),
                    t = t || 'fx';
                  s--;

                )
                  (n = m._data(o[s], t + 'queueHooks')) &&
                    n.empty &&
                    (i++, n.empty.add(a))
                return a(), r.promise(e)
              }
            }),
            (p.shrinkWrapBlocks = function() {
              return null != z
                ? z
                : ((z = !1),
                  (e = s.getElementsByTagName('body')[0]) && e.style
                    ? ((t = s.createElement('div')),
                      ((n = s.createElement('div')).style.cssText =
                        'position:absolute;border:0;width:0;height:0;top:0;left:-9999px'),
                      e.appendChild(n).appendChild(t),
                      void 0 !== t.style.zoom &&
                        ((t.style.cssText =
                          '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1'),
                        (t.appendChild(s.createElement('div')).style.width =
                          '5px'),
                        (z = 3 !== t.offsetWidth)),
                      e.removeChild(n),
                      z)
                    : void 0)
              var t, e, n
            })
          var X = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            U = new RegExp('^(?:([+-])=|)(' + X + ')([a-z%]*)$', 'i'),
            V = ['Top', 'Right', 'Bottom', 'Left'],
            Y = function(t, e) {
              return (
                (t = e || t),
                'none' === m.css(t, 'display') ||
                  !m.contains(t.ownerDocument, t)
              )
            }
          function G(t, e, n, i) {
            var r,
              o = 1,
              s = 20,
              a = i
                ? function() {
                    return i.cur()
                  }
                : function() {
                    return m.css(t, e, '')
                  },
              l = a(),
              c = (n && n[3]) || (m.cssNumber[e] ? '' : 'px'),
              u = (m.cssNumber[e] || ('px' !== c && +l)) && U.exec(m.css(t, e))
            if (u && u[3] !== c) {
              ;(c = c || u[3]), (n = n || []), (u = +l || 1)
              do {
                ;(u /= o = o || '.5'), m.style(t, e, u + c)
              } while (o !== (o = a() / l) && 1 !== o && --s)
            }
            return (
              n &&
                ((u = +u || +l || 0),
                (r = n[1] ? u + (n[1] + 1) * n[2] : +n[2]),
                i && ((i.unit = c), (i.start = u), (i.end = r))),
              r
            )
          }
          var K,
            J,
            Z,
            tt = function(t, e, n, i, r, o, s) {
              var a = 0,
                l = t.length,
                c = null == n
              if ('object' === m.type(n))
                for (a in ((r = !0), n)) tt(t, e, a, n[a], !0, o, s)
              else if (
                void 0 !== i &&
                ((r = !0),
                m.isFunction(i) || (s = !0),
                c &&
                  (s
                    ? (e.call(t, i), (e = null))
                    : ((c = e),
                      (e = function(t, e, n) {
                        return c.call(m(t), n)
                      }))),
                e)
              )
                for (; a < l; a++)
                  e(t[a], n, s ? i : i.call(t[a], a, e(t[a], n)))
              return r ? t : c ? e.call(t) : l ? e(t[0], n) : o
            },
            et = /^(?:checkbox|radio)$/i,
            nt = /<([\w:-]+)/,
            it = /^$|\/(?:java|ecma)script/i,
            rt = /^\s+/,
            ot =
              'abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video'
          function st(t) {
            var e = ot.split('|'),
              n = t.createDocumentFragment()
            if (n.createElement) for (; e.length; ) n.createElement(e.pop())
            return n
          }
          ;(K = s.createElement('div')),
            (J = s.createDocumentFragment()),
            (Z = s.createElement('input')),
            (K.innerHTML =
              "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
            (p.leadingWhitespace = 3 === K.firstChild.nodeType),
            (p.tbody = !K.getElementsByTagName('tbody').length),
            (p.htmlSerialize = !!K.getElementsByTagName('link').length),
            (p.html5Clone =
              '<:nav></:nav>' !==
              s.createElement('nav').cloneNode(!0).outerHTML),
            (Z.type = 'checkbox'),
            (Z.checked = !0),
            J.appendChild(Z),
            (p.appendChecked = Z.checked),
            (K.innerHTML = '<textarea>x</textarea>'),
            (p.noCloneChecked = !!K.cloneNode(!0).lastChild.defaultValue),
            J.appendChild(K),
            (Z = s.createElement('input')).setAttribute('type', 'radio'),
            Z.setAttribute('checked', 'checked'),
            Z.setAttribute('name', 't'),
            K.appendChild(Z),
            (p.checkClone = K.cloneNode(!0).cloneNode(!0).lastChild.checked),
            (p.noCloneEvent = !!K.addEventListener),
            (K[m.expando] = 1),
            (p.attributes = !K.getAttribute(m.expando))
          var at = {
            option: [1, "<select multiple='multiple'>", '</select>'],
            legend: [1, '<fieldset>', '</fieldset>'],
            area: [1, '<map>', '</map>'],
            param: [1, '<object>', '</object>'],
            thead: [1, '<table>', '</table>'],
            tr: [2, '<table><tbody>', '</tbody></table>'],
            col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
            td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            _default: p.htmlSerialize ? [0, '', ''] : [1, 'X<div>', '</div>']
          }
          function lt(t, e) {
            var n,
              i,
              r = 0,
              o =
                void 0 !== t.getElementsByTagName
                  ? t.getElementsByTagName(e || '*')
                  : void 0 !== t.querySelectorAll
                  ? t.querySelectorAll(e || '*')
                  : void 0
            if (!o)
              for (o = [], n = t.childNodes || t; null != (i = n[r]); r++)
                !e || m.nodeName(i, e) ? o.push(i) : m.merge(o, lt(i, e))
            return void 0 === e || (e && m.nodeName(t, e)) ? m.merge([t], o) : o
          }
          function ct(t, e) {
            for (var n, i = 0; null != (n = t[i]); i++)
              m._data(n, 'globalEval', !e || m._data(e[i], 'globalEval'))
          }
          ;(at.optgroup = at.option),
            (at.tbody = at.tfoot = at.colgroup = at.caption = at.thead),
            (at.th = at.td)
          var ut = /<|&#?\w+;/,
            ft = /<tbody/i
          function dt(t) {
            et.test(t.type) && (t.defaultChecked = t.checked)
          }
          function ht(t, e, n, i, r) {
            for (
              var o, s, a, l, c, u, f, d = t.length, h = st(e), g = [], v = 0;
              v < d;
              v++
            )
              if ((s = t[v]) || 0 === s)
                if ('object' === m.type(s)) m.merge(g, s.nodeType ? [s] : s)
                else if (ut.test(s)) {
                  for (
                    l = l || h.appendChild(e.createElement('div')),
                      c = (nt.exec(s) || ['', ''])[1].toLowerCase(),
                      f = at[c] || at._default,
                      l.innerHTML = f[1] + m.htmlPrefilter(s) + f[2],
                      o = f[0];
                    o--;

                  )
                    l = l.lastChild
                  if (
                    (!p.leadingWhitespace &&
                      rt.test(s) &&
                      g.push(e.createTextNode(rt.exec(s)[0])),
                    !p.tbody)
                  )
                    for (
                      o =
                        (s =
                          'table' !== c || ft.test(s)
                            ? '<table>' !== f[1] || ft.test(s)
                              ? 0
                              : l
                            : l.firstChild) && s.childNodes.length;
                      o--;

                    )
                      m.nodeName((u = s.childNodes[o]), 'tbody') &&
                        !u.childNodes.length &&
                        s.removeChild(u)
                  for (
                    m.merge(g, l.childNodes), l.textContent = '';
                    l.firstChild;

                  )
                    l.removeChild(l.firstChild)
                  l = h.lastChild
                } else g.push(e.createTextNode(s))
            for (
              l && h.removeChild(l),
                p.appendChecked || m.grep(lt(g, 'input'), dt),
                v = 0;
              (s = g[v++]);

            )
              if (i && m.inArray(s, i) > -1) r && r.push(s)
              else if (
                ((a = m.contains(s.ownerDocument, s)),
                (l = lt(h.appendChild(s), 'script')),
                a && ct(l),
                n)
              )
                for (o = 0; (s = l[o++]); ) it.test(s.type || '') && n.push(s)
            return (l = null), h
          }
          !(function() {
            var t,
              e,
              i = s.createElement('div')
            for (t in { submit: !0, change: !0, focusin: !0 })
              (e = 'on' + t),
                (p[t] = e in n) ||
                  (i.setAttribute(e, 't'),
                  (p[t] = !1 === i.attributes[e].expando))
            i = null
          })()
          var pt = /^(?:input|select|textarea)$/i,
            mt = /^key/,
            gt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            vt = /^(?:focusinfocus|focusoutblur)$/,
            yt = /^([^.]*)(?:\.(.+)|)/
          function bt() {
            return !0
          }
          function xt() {
            return !1
          }
          function qt() {
            try {
              return s.activeElement
            } catch (t) {}
          }
          function wt(t, e, n, i, r, o) {
            var s, a
            if ('object' == typeof e) {
              for (a in ('string' != typeof n && ((i = i || n), (n = void 0)),
              e))
                wt(t, a, n, i, e[a], o)
              return t
            }
            if (
              (null == i && null == r
                ? ((r = n), (i = n = void 0))
                : null == r &&
                  ('string' == typeof n
                    ? ((r = i), (i = void 0))
                    : ((r = i), (i = n), (n = void 0))),
              !1 === r)
            )
              r = xt
            else if (!r) return t
            return (
              1 === o &&
                ((s = r),
                ((r = function(t) {
                  return m().off(t), s.apply(this, arguments)
                }).guid = s.guid || (s.guid = m.guid++))),
              t.each(function() {
                m.event.add(this, e, r, i, n)
              })
            )
          }
          ;(m.event = {
            global: {},
            add: function(t, e, n, i, r) {
              var o,
                s,
                a,
                l,
                c,
                u,
                f,
                d,
                h,
                p,
                g,
                v = m._data(t)
              if (v) {
                for (
                  n.handler && ((n = (l = n).handler), (r = l.selector)),
                    n.guid || (n.guid = m.guid++),
                    (s = v.events) || (s = v.events = {}),
                    (u = v.handle) ||
                      ((u = v.handle = function(t) {
                        return void 0 === m ||
                          (t && m.event.triggered === t.type)
                          ? void 0
                          : m.event.dispatch.apply(u.elem, arguments)
                      }).elem = t),
                    a = (e = (e || '').match(Q) || ['']).length;
                  a--;

                )
                  (h = g = (o = yt.exec(e[a]) || [])[1]),
                    (p = (o[2] || '').split('.').sort()),
                    h &&
                      ((c = m.event.special[h] || {}),
                      (h = (r ? c.delegateType : c.bindType) || h),
                      (c = m.event.special[h] || {}),
                      (f = m.extend(
                        {
                          type: h,
                          origType: g,
                          data: i,
                          handler: n,
                          guid: n.guid,
                          selector: r,
                          needsContext: r && m.expr.match.needsContext.test(r),
                          namespace: p.join('.')
                        },
                        l
                      )),
                      (d = s[h]) ||
                        (((d = s[h] = []).delegateCount = 0),
                        (c.setup && !1 !== c.setup.call(t, i, p, u)) ||
                          (t.addEventListener
                            ? t.addEventListener(h, u, !1)
                            : t.attachEvent && t.attachEvent('on' + h, u))),
                      c.add &&
                        (c.add.call(t, f),
                        f.handler.guid || (f.handler.guid = n.guid)),
                      r ? d.splice(d.delegateCount++, 0, f) : d.push(f),
                      (m.event.global[h] = !0))
                t = null
              }
            },
            remove: function(t, e, n, i, r) {
              var o,
                s,
                a,
                l,
                c,
                u,
                f,
                d,
                h,
                p,
                g,
                v = m.hasData(t) && m._data(t)
              if (v && (u = v.events)) {
                for (c = (e = (e || '').match(Q) || ['']).length; c--; )
                  if (
                    ((h = g = (a = yt.exec(e[c]) || [])[1]),
                    (p = (a[2] || '').split('.').sort()),
                    h)
                  ) {
                    for (
                      f = m.event.special[h] || {},
                        d =
                          u[(h = (i ? f.delegateType : f.bindType) || h)] || [],
                        a =
                          a[2] &&
                          new RegExp(
                            '(^|\\.)' + p.join('\\.(?:.*\\.|)') + '(\\.|$)'
                          ),
                        l = o = d.length;
                      o--;

                    )
                      (s = d[o]),
                        (!r && g !== s.origType) ||
                          (n && n.guid !== s.guid) ||
                          (a && !a.test(s.namespace)) ||
                          (i &&
                            i !== s.selector &&
                            ('**' !== i || !s.selector)) ||
                          (d.splice(o, 1),
                          s.selector && d.delegateCount--,
                          f.remove && f.remove.call(t, s))
                    l &&
                      !d.length &&
                      ((f.teardown && !1 !== f.teardown.call(t, p, v.handle)) ||
                        m.removeEvent(t, h, v.handle),
                      delete u[h])
                  } else for (h in u) m.event.remove(t, h + e[c], n, i, !0)
                m.isEmptyObject(u) &&
                  (delete v.handle, m._removeData(t, 'events'))
              }
            },
            trigger: function(t, e, i, r) {
              var o,
                a,
                l,
                c,
                u,
                f,
                d,
                p = [i || s],
                g = h.call(t, 'type') ? t.type : t,
                v = h.call(t, 'namespace') ? t.namespace.split('.') : []
              if (
                ((l = f = i = i || s),
                3 !== i.nodeType &&
                  8 !== i.nodeType &&
                  !vt.test(g + m.event.triggered) &&
                  (g.indexOf('.') > -1 &&
                    ((v = g.split('.')), (g = v.shift()), v.sort()),
                  (a = g.indexOf(':') < 0 && 'on' + g),
                  ((t = t[m.expando]
                    ? t
                    : new m.Event(g, 'object' == typeof t && t)).isTrigger = r
                    ? 2
                    : 3),
                  (t.namespace = v.join('.')),
                  (t.rnamespace = t.namespace
                    ? new RegExp(
                        '(^|\\.)' + v.join('\\.(?:.*\\.|)') + '(\\.|$)'
                      )
                    : null),
                  (t.result = void 0),
                  t.target || (t.target = i),
                  (e = null == e ? [t] : m.makeArray(e, [t])),
                  (u = m.event.special[g] || {}),
                  r || !u.trigger || !1 !== u.trigger.apply(i, e)))
              ) {
                if (!r && !u.noBubble && !m.isWindow(i)) {
                  for (
                    c = u.delegateType || g,
                      vt.test(c + g) || (l = l.parentNode);
                    l;
                    l = l.parentNode
                  )
                    p.push(l), (f = l)
                  f === (i.ownerDocument || s) &&
                    p.push(f.defaultView || f.parentWindow || n)
                }
                for (d = 0; (l = p[d++]) && !t.isPropagationStopped(); )
                  (t.type = d > 1 ? c : u.bindType || g),
                    (o =
                      (m._data(l, 'events') || {})[t.type] &&
                      m._data(l, 'handle')) && o.apply(l, e),
                    (o = a && l[a]) &&
                      o.apply &&
                      F(l) &&
                      ((t.result = o.apply(l, e)),
                      !1 === t.result && t.preventDefault())
                if (
                  ((t.type = g),
                  !r &&
                    !t.isDefaultPrevented() &&
                    (!u._default || !1 === u._default.apply(p.pop(), e)) &&
                    F(i) &&
                    a &&
                    i[g] &&
                    !m.isWindow(i))
                ) {
                  ;(f = i[a]) && (i[a] = null), (m.event.triggered = g)
                  try {
                    i[g]()
                  } catch (t) {}
                  ;(m.event.triggered = void 0), f && (i[a] = f)
                }
                return t.result
              }
            },
            dispatch: function(t) {
              t = m.event.fix(t)
              var e,
                n,
                i,
                r,
                o,
                s,
                l = a.call(arguments),
                c = (m._data(this, 'events') || {})[t.type] || [],
                u = m.event.special[t.type] || {}
              if (
                ((l[0] = t),
                (t.delegateTarget = this),
                !u.preDispatch || !1 !== u.preDispatch.call(this, t))
              ) {
                for (
                  s = m.event.handlers.call(this, t, c), e = 0;
                  (r = s[e++]) && !t.isPropagationStopped();

                )
                  for (
                    t.currentTarget = r.elem, n = 0;
                    (o = r.handlers[n++]) && !t.isImmediatePropagationStopped();

                  )
                    (t.rnamespace && !t.rnamespace.test(o.namespace)) ||
                      ((t.handleObj = o),
                      (t.data = o.data),
                      void 0 !==
                        (i = (
                          (m.event.special[o.origType] || {}).handle ||
                          o.handler
                        ).apply(r.elem, l)) &&
                        !1 === (t.result = i) &&
                        (t.preventDefault(), t.stopPropagation()))
                return u.postDispatch && u.postDispatch.call(this, t), t.result
              }
            },
            handlers: function(t, e) {
              var n,
                i,
                r,
                o,
                s = [],
                a = e.delegateCount,
                l = t.target
              if (
                a &&
                l.nodeType &&
                ('click' !== t.type || isNaN(t.button) || t.button < 1)
              )
                for (; l != this; l = l.parentNode || this)
                  if (
                    1 === l.nodeType &&
                    (!0 !== l.disabled || 'click' !== t.type)
                  ) {
                    for (i = [], n = 0; n < a; n++)
                      void 0 === i[(r = (o = e[n]).selector + ' ')] &&
                        (i[r] = o.needsContext
                          ? m(r, this).index(l) > -1
                          : m.find(r, this, null, [l]).length),
                        i[r] && i.push(o)
                    i.length && s.push({ elem: l, handlers: i })
                  }
              return (
                a < e.length && s.push({ elem: this, handlers: e.slice(a) }), s
              )
            },
            fix: function(t) {
              if (t[m.expando]) return t
              var e,
                n,
                i,
                r = t.type,
                o = t,
                a = this.fixHooks[r]
              for (
                a ||
                  (this.fixHooks[r] = a = gt.test(r)
                    ? this.mouseHooks
                    : mt.test(r)
                    ? this.keyHooks
                    : {}),
                  i = a.props ? this.props.concat(a.props) : this.props,
                  t = new m.Event(o),
                  e = i.length;
                e--;

              )
                t[(n = i[e])] = o[n]
              return (
                t.target || (t.target = o.srcElement || s),
                3 === t.target.nodeType && (t.target = t.target.parentNode),
                (t.metaKey = !!t.metaKey),
                a.filter ? a.filter(t, o) : t
              )
            },
            props: 'altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(
              ' '
            ),
            fixHooks: {},
            keyHooks: {
              props: 'char charCode key keyCode'.split(' '),
              filter: function(t, e) {
                return (
                  null == t.which &&
                    (t.which = null != e.charCode ? e.charCode : e.keyCode),
                  t
                )
              }
            },
            mouseHooks: {
              props: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(
                ' '
              ),
              filter: function(t, e) {
                var n,
                  i,
                  r,
                  o = e.button,
                  a = e.fromElement
                return (
                  null == t.pageX &&
                    null != e.clientX &&
                    ((r = (i = t.target.ownerDocument || s).documentElement),
                    (n = i.body),
                    (t.pageX =
                      e.clientX +
                      ((r && r.scrollLeft) || (n && n.scrollLeft) || 0) -
                      ((r && r.clientLeft) || (n && n.clientLeft) || 0)),
                    (t.pageY =
                      e.clientY +
                      ((r && r.scrollTop) || (n && n.scrollTop) || 0) -
                      ((r && r.clientTop) || (n && n.clientTop) || 0))),
                  !t.relatedTarget &&
                    a &&
                    (t.relatedTarget = a === t.target ? e.toElement : a),
                  t.which ||
                    void 0 === o ||
                    (t.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
                  t
                )
              }
            },
            special: {
              load: { noBubble: !0 },
              focus: {
                trigger: function() {
                  if (this !== qt() && this.focus)
                    try {
                      return this.focus(), !1
                    } catch (t) {}
                },
                delegateType: 'focusin'
              },
              blur: {
                trigger: function() {
                  if (this === qt() && this.blur) return this.blur(), !1
                },
                delegateType: 'focusout'
              },
              click: {
                trigger: function() {
                  if (
                    m.nodeName(this, 'input') &&
                    'checkbox' === this.type &&
                    this.click
                  )
                    return this.click(), !1
                },
                _default: function(t) {
                  return m.nodeName(t.target, 'a')
                }
              },
              beforeunload: {
                postDispatch: function(t) {
                  void 0 !== t.result &&
                    t.originalEvent &&
                    (t.originalEvent.returnValue = t.result)
                }
              }
            },
            simulate: function(t, e, n) {
              var i = m.extend(new m.Event(), n, { type: t, isSimulated: !0 })
              m.event.trigger(i, null, e),
                i.isDefaultPrevented() && n.preventDefault()
            }
          }),
            (m.removeEvent = s.removeEventListener
              ? function(t, e, n) {
                  t.removeEventListener && t.removeEventListener(e, n)
                }
              : function(t, e, n) {
                  var i = 'on' + e
                  t.detachEvent &&
                    (void 0 === t[i] && (t[i] = null), t.detachEvent(i, n))
                }),
            (m.Event = function(t, e) {
              if (!(this instanceof m.Event)) return new m.Event(t, e)
              t && t.type
                ? ((this.originalEvent = t),
                  (this.type = t.type),
                  (this.isDefaultPrevented =
                    t.defaultPrevented ||
                    (void 0 === t.defaultPrevented && !1 === t.returnValue)
                      ? bt
                      : xt))
                : (this.type = t),
                e && m.extend(this, e),
                (this.timeStamp = (t && t.timeStamp) || m.now()),
                (this[m.expando] = !0)
            }),
            (m.Event.prototype = {
              constructor: m.Event,
              isDefaultPrevented: xt,
              isPropagationStopped: xt,
              isImmediatePropagationStopped: xt,
              preventDefault: function() {
                var t = this.originalEvent
                ;(this.isDefaultPrevented = bt),
                  t &&
                    (t.preventDefault
                      ? t.preventDefault()
                      : (t.returnValue = !1))
              },
              stopPropagation: function() {
                var t = this.originalEvent
                ;(this.isPropagationStopped = bt),
                  t &&
                    !this.isSimulated &&
                    (t.stopPropagation && t.stopPropagation(),
                    (t.cancelBubble = !0))
              },
              stopImmediatePropagation: function() {
                var t = this.originalEvent
                ;(this.isImmediatePropagationStopped = bt),
                  t &&
                    t.stopImmediatePropagation &&
                    t.stopImmediatePropagation(),
                  this.stopPropagation()
              }
            }),
            m.each(
              {
                mouseenter: 'mouseover',
                mouseleave: 'mouseout',
                pointerenter: 'pointerover',
                pointerleave: 'pointerout'
              },
              function(t, e) {
                m.event.special[t] = {
                  delegateType: e,
                  bindType: e,
                  handle: function(t) {
                    var n,
                      i = t.relatedTarget,
                      r = t.handleObj
                    return (
                      (i && (i === this || m.contains(this, i))) ||
                        ((t.type = r.origType),
                        (n = r.handler.apply(this, arguments)),
                        (t.type = e)),
                      n
                    )
                  }
                }
              }
            ),
            p.submit ||
              (m.event.special.submit = {
                setup: function() {
                  if (m.nodeName(this, 'form')) return !1
                  m.event.add(this, 'click._submit keypress._submit', function(
                    t
                  ) {
                    var e = t.target,
                      n =
                        m.nodeName(e, 'input') || m.nodeName(e, 'button')
                          ? m.prop(e, 'form')
                          : void 0
                    n &&
                      !m._data(n, 'submit') &&
                      (m.event.add(n, 'submit._submit', function(t) {
                        t._submitBubble = !0
                      }),
                      m._data(n, 'submit', !0))
                  })
                },
                postDispatch: function(t) {
                  t._submitBubble &&
                    (delete t._submitBubble,
                    this.parentNode &&
                      !t.isTrigger &&
                      m.event.simulate('submit', this.parentNode, t))
                },
                teardown: function() {
                  if (m.nodeName(this, 'form')) return !1
                  m.event.remove(this, '._submit')
                }
              }),
            p.change ||
              (m.event.special.change = {
                setup: function() {
                  if (pt.test(this.nodeName))
                    return (
                      ('checkbox' !== this.type && 'radio' !== this.type) ||
                        (m.event.add(this, 'propertychange._change', function(
                          t
                        ) {
                          'checked' === t.originalEvent.propertyName &&
                            (this._justChanged = !0)
                        }),
                        m.event.add(this, 'click._change', function(t) {
                          this._justChanged &&
                            !t.isTrigger &&
                            (this._justChanged = !1),
                            m.event.simulate('change', this, t)
                        })),
                      !1
                    )
                  m.event.add(this, 'beforeactivate._change', function(t) {
                    var e = t.target
                    pt.test(e.nodeName) &&
                      !m._data(e, 'change') &&
                      (m.event.add(e, 'change._change', function(t) {
                        !this.parentNode ||
                          t.isSimulated ||
                          t.isTrigger ||
                          m.event.simulate('change', this.parentNode, t)
                      }),
                      m._data(e, 'change', !0))
                  })
                },
                handle: function(t) {
                  var e = t.target
                  if (
                    this !== e ||
                    t.isSimulated ||
                    t.isTrigger ||
                    ('radio' !== e.type && 'checkbox' !== e.type)
                  )
                    return t.handleObj.handler.apply(this, arguments)
                },
                teardown: function() {
                  return (
                    m.event.remove(this, '._change'), !pt.test(this.nodeName)
                  )
                }
              }),
            p.focusin ||
              m.each({ focus: 'focusin', blur: 'focusout' }, function(t, e) {
                var n = function(t) {
                  m.event.simulate(e, t.target, m.event.fix(t))
                }
                m.event.special[e] = {
                  setup: function() {
                    var i = this.ownerDocument || this,
                      r = m._data(i, e)
                    r || i.addEventListener(t, n, !0),
                      m._data(i, e, (r || 0) + 1)
                  },
                  teardown: function() {
                    var i = this.ownerDocument || this,
                      r = m._data(i, e) - 1
                    r
                      ? m._data(i, e, r)
                      : (i.removeEventListener(t, n, !0), m._removeData(i, e))
                  }
                }
              }),
            m.fn.extend({
              on: function(t, e, n, i) {
                return wt(this, t, e, n, i)
              },
              one: function(t, e, n, i) {
                return wt(this, t, e, n, i, 1)
              },
              off: function(t, e, n) {
                var i, r
                if (t && t.preventDefault && t.handleObj)
                  return (
                    (i = t.handleObj),
                    m(t.delegateTarget).off(
                      i.namespace ? i.origType + '.' + i.namespace : i.origType,
                      i.selector,
                      i.handler
                    ),
                    this
                  )
                if ('object' == typeof t) {
                  for (r in t) this.off(r, e, t[r])
                  return this
                }
                return (
                  (!1 !== e && 'function' != typeof e) ||
                    ((n = e), (e = void 0)),
                  !1 === n && (n = xt),
                  this.each(function() {
                    m.event.remove(this, t, n, e)
                  })
                )
              },
              trigger: function(t, e) {
                return this.each(function() {
                  m.event.trigger(t, e, this)
                })
              },
              triggerHandler: function(t, e) {
                var n = this[0]
                if (n) return m.event.trigger(t, e, n, !0)
              }
            })
          var Tt = / jQuery\d+="(?:null|\d+)"/g,
            kt = new RegExp('<(?:' + ot + ')[\\s/>]', 'i'),
            Ct = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
            St = /<script|<style|<link/i,
            Et = /checked\s*(?:[^=]|=\s*.checked.)/i,
            jt = /^true\/(.*)/,
            Ot = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            Dt = st(s).appendChild(s.createElement('div'))
          function At(t, e) {
            return m.nodeName(t, 'table') &&
              m.nodeName(11 !== e.nodeType ? e : e.firstChild, 'tr')
              ? t.getElementsByTagName('tbody')[0] ||
                  t.appendChild(t.ownerDocument.createElement('tbody'))
              : t
          }
          function Lt(t) {
            return (
              (t.type = (null !== m.find.attr(t, 'type')) + '/' + t.type), t
            )
          }
          function _t(t) {
            var e = jt.exec(t.type)
            return e ? (t.type = e[1]) : t.removeAttribute('type'), t
          }
          function Nt(t, e) {
            if (1 === e.nodeType && m.hasData(t)) {
              var n,
                i,
                r,
                o = m._data(t),
                s = m._data(e, o),
                a = o.events
              if (a)
                for (n in (delete s.handle, (s.events = {}), a))
                  for (i = 0, r = a[n].length; i < r; i++)
                    m.event.add(e, n, a[n][i])
              s.data && (s.data = m.extend({}, s.data))
            }
          }
          function Qt(t, e) {
            var n, i, r
            if (1 === e.nodeType) {
              if (
                ((n = e.nodeName.toLowerCase()),
                !p.noCloneEvent && e[m.expando])
              ) {
                for (i in (r = m._data(e)).events) m.removeEvent(e, i, r.handle)
                e.removeAttribute(m.expando)
              }
              'script' === n && e.text !== t.text
                ? ((Lt(e).text = t.text), _t(e))
                : 'object' === n
                ? (e.parentNode && (e.outerHTML = t.outerHTML),
                  p.html5Clone &&
                    t.innerHTML &&
                    !m.trim(e.innerHTML) &&
                    (e.innerHTML = t.innerHTML))
                : 'input' === n && et.test(t.type)
                ? ((e.defaultChecked = e.checked = t.checked),
                  e.value !== t.value && (e.value = t.value))
                : 'option' === n
                ? (e.defaultSelected = e.selected = t.defaultSelected)
                : ('input' !== n && 'textarea' !== n) ||
                  (e.defaultValue = t.defaultValue)
            }
          }
          function Mt(t, e, n, i) {
            e = l.apply([], e)
            var r,
              o,
              s,
              a,
              c,
              u,
              f = 0,
              d = t.length,
              h = d - 1,
              g = e[0],
              v = m.isFunction(g)
            if (
              v ||
              (d > 1 && 'string' == typeof g && !p.checkClone && Et.test(g))
            )
              return t.each(function(r) {
                var o = t.eq(r)
                v && (e[0] = g.call(this, r, o.html())), Mt(o, e, n, i)
              })
            if (
              d &&
              ((r = (u = ht(e, t[0].ownerDocument, !1, t, i)).firstChild),
              1 === u.childNodes.length && (u = r),
              r || i)
            ) {
              for (s = (a = m.map(lt(u, 'script'), Lt)).length; f < d; f++)
                (o = u),
                  f !== h &&
                    ((o = m.clone(o, !0, !0)),
                    s && m.merge(a, lt(o, 'script'))),
                  n.call(t[f], o, f)
              if (s)
                for (
                  c = a[a.length - 1].ownerDocument, m.map(a, _t), f = 0;
                  f < s;
                  f++
                )
                  (o = a[f]),
                    it.test(o.type || '') &&
                      !m._data(o, 'globalEval') &&
                      m.contains(c, o) &&
                      (o.src
                        ? m._evalUrl && m._evalUrl(o.src)
                        : m.globalEval(
                            (
                              o.text ||
                              o.textContent ||
                              o.innerHTML ||
                              ''
                            ).replace(Ot, '')
                          ))
              u = r = null
            }
            return t
          }
          function Rt(t, e, n) {
            for (
              var i, r = e ? m.filter(e, t) : t, o = 0;
              null != (i = r[o]);
              o++
            )
              n || 1 !== i.nodeType || m.cleanData(lt(i)),
                i.parentNode &&
                  (n && m.contains(i.ownerDocument, i) && ct(lt(i, 'script')),
                  i.parentNode.removeChild(i))
            return t
          }
          m.extend({
            htmlPrefilter: function(t) {
              return t.replace(Ct, '<$1></$2>')
            },
            clone: function(t, e, n) {
              var i,
                r,
                o,
                s,
                a,
                l = m.contains(t.ownerDocument, t)
              if (
                (p.html5Clone ||
                m.isXMLDoc(t) ||
                !kt.test('<' + t.nodeName + '>')
                  ? (o = t.cloneNode(!0))
                  : ((Dt.innerHTML = t.outerHTML),
                    Dt.removeChild((o = Dt.firstChild))),
                !(
                  (p.noCloneEvent && p.noCloneChecked) ||
                  (1 !== t.nodeType && 11 !== t.nodeType) ||
                  m.isXMLDoc(t)
                ))
              )
                for (i = lt(o), a = lt(t), s = 0; null != (r = a[s]); ++s)
                  i[s] && Qt(r, i[s])
              if (e)
                if (n)
                  for (
                    a = a || lt(t), i = i || lt(o), s = 0;
                    null != (r = a[s]);
                    s++
                  )
                    Nt(r, i[s])
                else Nt(t, o)
              return (
                (i = lt(o, 'script')).length > 0 &&
                  ct(i, !l && lt(t, 'script')),
                (i = a = r = null),
                o
              )
            },
            cleanData: function(t, e) {
              for (
                var n,
                  i,
                  r,
                  s,
                  a = 0,
                  l = m.expando,
                  c = m.cache,
                  u = p.attributes,
                  f = m.event.special;
                null != (n = t[a]);
                a++
              )
                if ((e || F(n)) && (s = (r = n[l]) && c[r])) {
                  if (s.events)
                    for (i in s.events)
                      f[i]
                        ? m.event.remove(n, i)
                        : m.removeEvent(n, i, s.handle)
                  c[r] &&
                    (delete c[r],
                    u || void 0 === n.removeAttribute
                      ? (n[l] = void 0)
                      : n.removeAttribute(l),
                    o.push(r))
                }
            }
          }),
            m.fn.extend({
              domManip: Mt,
              detach: function(t) {
                return Rt(this, t, !0)
              },
              remove: function(t) {
                return Rt(this, t)
              },
              text: function(t) {
                return tt(
                  this,
                  function(t) {
                    return void 0 === t
                      ? m.text(this)
                      : this.empty().append(
                          (
                            (this[0] && this[0].ownerDocument) ||
                            s
                          ).createTextNode(t)
                        )
                  },
                  null,
                  t,
                  arguments.length
                )
              },
              append: function() {
                return Mt(this, arguments, function(t) {
                  ;(1 !== this.nodeType &&
                    11 !== this.nodeType &&
                    9 !== this.nodeType) ||
                    At(this, t).appendChild(t)
                })
              },
              prepend: function() {
                return Mt(this, arguments, function(t) {
                  if (
                    1 === this.nodeType ||
                    11 === this.nodeType ||
                    9 === this.nodeType
                  ) {
                    var e = At(this, t)
                    e.insertBefore(t, e.firstChild)
                  }
                })
              },
              before: function() {
                return Mt(this, arguments, function(t) {
                  this.parentNode && this.parentNode.insertBefore(t, this)
                })
              },
              after: function() {
                return Mt(this, arguments, function(t) {
                  this.parentNode &&
                    this.parentNode.insertBefore(t, this.nextSibling)
                })
              },
              empty: function() {
                for (var t, e = 0; null != (t = this[e]); e++) {
                  for (
                    1 === t.nodeType && m.cleanData(lt(t, !1));
                    t.firstChild;

                  )
                    t.removeChild(t.firstChild)
                  t.options && m.nodeName(t, 'select') && (t.options.length = 0)
                }
                return this
              },
              clone: function(t, e) {
                return (
                  (t = null != t && t),
                  (e = null == e ? t : e),
                  this.map(function() {
                    return m.clone(this, t, e)
                  })
                )
              },
              html: function(t) {
                return tt(
                  this,
                  function(t) {
                    var e = this[0] || {},
                      n = 0,
                      i = this.length
                    if (void 0 === t)
                      return 1 === e.nodeType
                        ? e.innerHTML.replace(Tt, '')
                        : void 0
                    if (
                      'string' == typeof t &&
                      !St.test(t) &&
                      (p.htmlSerialize || !kt.test(t)) &&
                      (p.leadingWhitespace || !rt.test(t)) &&
                      !at[(nt.exec(t) || ['', ''])[1].toLowerCase()]
                    ) {
                      t = m.htmlPrefilter(t)
                      try {
                        for (; n < i; n++)
                          1 === (e = this[n] || {}).nodeType &&
                            (m.cleanData(lt(e, !1)), (e.innerHTML = t))
                        e = 0
                      } catch (t) {}
                    }
                    e && this.empty().append(t)
                  },
                  null,
                  t,
                  arguments.length
                )
              },
              replaceWith: function() {
                var t = []
                return Mt(
                  this,
                  arguments,
                  function(e) {
                    var n = this.parentNode
                    m.inArray(this, t) < 0 &&
                      (m.cleanData(lt(this)), n && n.replaceChild(e, this))
                  },
                  t
                )
              }
            }),
            m.each(
              {
                appendTo: 'append',
                prependTo: 'prepend',
                insertBefore: 'before',
                insertAfter: 'after',
                replaceAll: 'replaceWith'
              },
              function(t, e) {
                m.fn[t] = function(t) {
                  for (
                    var n, i = 0, r = [], o = m(t), s = o.length - 1;
                    i <= s;
                    i++
                  )
                    (n = i === s ? this : this.clone(!0)),
                      m(o[i])[e](n),
                      c.apply(r, n.get())
                  return this.pushStack(r)
                }
              }
            )
          var zt,
            Ft = { HTML: 'block', BODY: 'block' }
          function It(t, e) {
            var n = m(e.createElement(t)).appendTo(e.body),
              i = m.css(n[0], 'display')
            return n.detach(), i
          }
          function Ht(t) {
            var e = s,
              n = Ft[t]
            return (
              n ||
                (('none' !== (n = It(t, e)) && n) ||
                  ((e = (
                    (zt = (
                      zt || m("<iframe frameborder='0' width='0' height='0'/>")
                    ).appendTo(e.documentElement))[0].contentWindow ||
                    zt[0].contentDocument
                  ).document).write(),
                  e.close(),
                  (n = It(t, e)),
                  zt.detach()),
                (Ft[t] = n)),
              n
            )
          }
          var Bt = /^margin/,
            Pt = new RegExp('^(' + X + ')(?!px)[a-z%]+$', 'i'),
            $t = function(t, e, n, i) {
              var r,
                o,
                s = {}
              for (o in e) (s[o] = t.style[o]), (t.style[o] = e[o])
              for (o in ((r = n.apply(t, i || [])), e)) t.style[o] = s[o]
              return r
            },
            Wt = s.documentElement
          !(function() {
            var t,
              e,
              i,
              r,
              o,
              a,
              l = s.createElement('div'),
              c = s.createElement('div')
            function u() {
              var u,
                f,
                d = s.documentElement
              d.appendChild(l),
                (c.style.cssText =
                  '-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%'),
                (t = i = a = !1),
                (e = o = !0),
                n.getComputedStyle &&
                  ((f = n.getComputedStyle(c)),
                  (t = '1%' !== (f || {}).top),
                  (a = '2px' === (f || {}).marginLeft),
                  (i = '4px' === (f || { width: '4px' }).width),
                  (c.style.marginRight = '50%'),
                  (e = '4px' === (f || { marginRight: '4px' }).marginRight),
                  ((u = c.appendChild(
                    s.createElement('div')
                  )).style.cssText = c.style.cssText =
                    '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0'),
                  (u.style.marginRight = u.style.width = '0'),
                  (c.style.width = '1px'),
                  (o = !parseFloat((n.getComputedStyle(u) || {}).marginRight)),
                  c.removeChild(u)),
                (c.style.display = 'none'),
                (r = 0 === c.getClientRects().length) &&
                  ((c.style.display = ''),
                  (c.innerHTML = '<table><tr><td></td><td>t</td></tr></table>'),
                  (c.childNodes[0].style.borderCollapse = 'separate'),
                  ((u = c.getElementsByTagName('td'))[0].style.cssText =
                    'margin:0;border:0;padding:0;display:none'),
                  (r = 0 === u[0].offsetHeight) &&
                    ((u[0].style.display = ''),
                    (u[1].style.display = 'none'),
                    (r = 0 === u[0].offsetHeight))),
                d.removeChild(l)
            }
            c.style &&
              ((c.style.cssText = 'float:left;opacity:.5'),
              (p.opacity = '0.5' === c.style.opacity),
              (p.cssFloat = !!c.style.cssFloat),
              (c.style.backgroundClip = 'content-box'),
              (c.cloneNode(!0).style.backgroundClip = ''),
              (p.clearCloneStyle = 'content-box' === c.style.backgroundClip),
              ((l = s.createElement('div')).style.cssText =
                'border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute'),
              (c.innerHTML = ''),
              l.appendChild(c),
              (p.boxSizing =
                '' === c.style.boxSizing ||
                '' === c.style.MozBoxSizing ||
                '' === c.style.WebkitBoxSizing),
              m.extend(p, {
                reliableHiddenOffsets: function() {
                  return null == t && u(), r
                },
                boxSizingReliable: function() {
                  return null == t && u(), i
                },
                pixelMarginRight: function() {
                  return null == t && u(), e
                },
                pixelPosition: function() {
                  return null == t && u(), t
                },
                reliableMarginRight: function() {
                  return null == t && u(), o
                },
                reliableMarginLeft: function() {
                  return null == t && u(), a
                }
              }))
          })()
          var Xt,
            Ut,
            Vt = /^(top|right|bottom|left)$/
          function Yt(t, e) {
            return {
              get: function() {
                if (!t()) return (this.get = e).apply(this, arguments)
                delete this.get
              }
            }
          }
          n.getComputedStyle
            ? ((Xt = function(t) {
                var e = t.ownerDocument.defaultView
                return (e && e.opener) || (e = n), e.getComputedStyle(t)
              }),
              (Ut = function(t, e, n) {
                var i,
                  r,
                  o,
                  s,
                  a = t.style
                return (
                  ('' !==
                    (s = (n = n || Xt(t))
                      ? n.getPropertyValue(e) || n[e]
                      : void 0) &&
                    void 0 !== s) ||
                    m.contains(t.ownerDocument, t) ||
                    (s = m.style(t, e)),
                  n &&
                    !p.pixelMarginRight() &&
                    Pt.test(s) &&
                    Bt.test(e) &&
                    ((i = a.width),
                    (r = a.minWidth),
                    (o = a.maxWidth),
                    (a.minWidth = a.maxWidth = a.width = s),
                    (s = n.width),
                    (a.width = i),
                    (a.minWidth = r),
                    (a.maxWidth = o)),
                  void 0 === s ? s : s + ''
                )
              }))
            : Wt.currentStyle &&
              ((Xt = function(t) {
                return t.currentStyle
              }),
              (Ut = function(t, e, n) {
                var i,
                  r,
                  o,
                  s,
                  a = t.style
                return (
                  null == (s = (n = n || Xt(t)) ? n[e] : void 0) &&
                    a &&
                    a[e] &&
                    (s = a[e]),
                  Pt.test(s) &&
                    !Vt.test(e) &&
                    ((i = a.left),
                    (o = (r = t.runtimeStyle) && r.left) &&
                      (r.left = t.currentStyle.left),
                    (a.left = 'fontSize' === e ? '1em' : s),
                    (s = a.pixelLeft + 'px'),
                    (a.left = i),
                    o && (r.left = o)),
                  void 0 === s ? s : s + '' || 'auto'
                )
              }))
          var Gt = /alpha\([^)]*\)/i,
            Kt = /opacity\s*=\s*([^)]*)/i,
            Jt = /^(none|table(?!-c[ea]).+)/,
            Zt = new RegExp('^(' + X + ')(.*)$', 'i'),
            te = {
              position: 'absolute',
              visibility: 'hidden',
              display: 'block'
            },
            ee = { letterSpacing: '0', fontWeight: '400' },
            ne = ['Webkit', 'O', 'Moz', 'ms'],
            ie = s.createElement('div').style
          function re(t) {
            if (t in ie) return t
            for (
              var e = t.charAt(0).toUpperCase() + t.slice(1), n = ne.length;
              n--;

            )
              if ((t = ne[n] + e) in ie) return t
          }
          function oe(t, e) {
            for (var n, i, r, o = [], s = 0, a = t.length; s < a; s++)
              (i = t[s]).style &&
                ((o[s] = m._data(i, 'olddisplay')),
                (n = i.style.display),
                e
                  ? (o[s] || 'none' !== n || (i.style.display = ''),
                    '' === i.style.display &&
                      Y(i) &&
                      (o[s] = m._data(i, 'olddisplay', Ht(i.nodeName))))
                  : ((r = Y(i)),
                    ((n && 'none' !== n) || !r) &&
                      m._data(i, 'olddisplay', r ? n : m.css(i, 'display'))))
            for (s = 0; s < a; s++)
              (i = t[s]).style &&
                ((e && 'none' !== i.style.display && '' !== i.style.display) ||
                  (i.style.display = e ? o[s] || '' : 'none'))
            return t
          }
          function se(t, e, n) {
            var i = Zt.exec(e)
            return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || 'px') : e
          }
          function ae(t, e, n, i, r) {
            for (
              var o =
                  n === (i ? 'border' : 'content') ? 4 : 'width' === e ? 1 : 0,
                s = 0;
              o < 4;
              o += 2
            )
              'margin' === n && (s += m.css(t, n + V[o], !0, r)),
                i
                  ? ('content' === n &&
                      (s -= m.css(t, 'padding' + V[o], !0, r)),
                    'margin' !== n &&
                      (s -= m.css(t, 'border' + V[o] + 'Width', !0, r)))
                  : ((s += m.css(t, 'padding' + V[o], !0, r)),
                    'padding' !== n &&
                      (s += m.css(t, 'border' + V[o] + 'Width', !0, r)))
            return s
          }
          function le(t, e, n) {
            var i = !0,
              r = 'width' === e ? t.offsetWidth : t.offsetHeight,
              o = Xt(t),
              s = p.boxSizing && 'border-box' === m.css(t, 'boxSizing', !1, o)
            if (r <= 0 || null == r) {
              if (
                (((r = Ut(t, e, o)) < 0 || null == r) && (r = t.style[e]),
                Pt.test(r))
              )
                return r
              ;(i = s && (p.boxSizingReliable() || r === t.style[e])),
                (r = parseFloat(r) || 0)
            }
            return r + ae(t, e, n || (s ? 'border' : 'content'), i, o) + 'px'
          }
          function ce(t, e, n, i, r) {
            return new ce.prototype.init(t, e, n, i, r)
          }
          m.extend({
            cssHooks: {
              opacity: {
                get: function(t, e) {
                  if (e) {
                    var n = Ut(t, 'opacity')
                    return '' === n ? '1' : n
                  }
                }
              }
            },
            cssNumber: {
              animationIterationCount: !0,
              columnCount: !0,
              fillOpacity: !0,
              flexGrow: !0,
              flexShrink: !0,
              fontWeight: !0,
              lineHeight: !0,
              opacity: !0,
              order: !0,
              orphans: !0,
              widows: !0,
              zIndex: !0,
              zoom: !0
            },
            cssProps: { float: p.cssFloat ? 'cssFloat' : 'styleFloat' },
            style: function(t, e, n, i) {
              if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                var r,
                  o,
                  s,
                  a = m.camelCase(e),
                  l = t.style
                if (
                  ((e = m.cssProps[a] || (m.cssProps[a] = re(a) || a)),
                  (s = m.cssHooks[e] || m.cssHooks[a]),
                  void 0 === n)
                )
                  return s && 'get' in s && void 0 !== (r = s.get(t, !1, i))
                    ? r
                    : l[e]
                if (
                  ('string' === (o = typeof n) &&
                    (r = U.exec(n)) &&
                    r[1] &&
                    ((n = G(t, e, r)), (o = 'number')),
                  null != n &&
                    n == n &&
                    ('number' === o &&
                      (n += (r && r[3]) || (m.cssNumber[a] ? '' : 'px')),
                    p.clearCloneStyle ||
                      '' !== n ||
                      0 !== e.indexOf('background') ||
                      (l[e] = 'inherit'),
                    !(s && 'set' in s && void 0 === (n = s.set(t, n, i)))))
                )
                  try {
                    l[e] = n
                  } catch (t) {}
              }
            },
            css: function(t, e, n, i) {
              var r,
                o,
                s,
                a = m.camelCase(e)
              return (
                (e = m.cssProps[a] || (m.cssProps[a] = re(a) || a)),
                (s = m.cssHooks[e] || m.cssHooks[a]) &&
                  'get' in s &&
                  (o = s.get(t, !0, n)),
                void 0 === o && (o = Ut(t, e, i)),
                'normal' === o && e in ee && (o = ee[e]),
                '' === n || n
                  ? ((r = parseFloat(o)), !0 === n || isFinite(r) ? r || 0 : o)
                  : o
              )
            }
          }),
            m.each(['height', 'width'], function(t, e) {
              m.cssHooks[e] = {
                get: function(t, n, i) {
                  if (n)
                    return Jt.test(m.css(t, 'display')) && 0 === t.offsetWidth
                      ? $t(t, te, function() {
                          return le(t, e, i)
                        })
                      : le(t, e, i)
                },
                set: function(t, n, i) {
                  var r = i && Xt(t)
                  return se(
                    0,
                    n,
                    i
                      ? ae(
                          t,
                          e,
                          i,
                          p.boxSizing &&
                            'border-box' === m.css(t, 'boxSizing', !1, r),
                          r
                        )
                      : 0
                  )
                }
              }
            }),
            p.opacity ||
              (m.cssHooks.opacity = {
                get: function(t, e) {
                  return Kt.test(
                    (e && t.currentStyle
                      ? t.currentStyle.filter
                      : t.style.filter) || ''
                  )
                    ? 0.01 * parseFloat(RegExp.$1) + ''
                    : e
                    ? '1'
                    : ''
                },
                set: function(t, e) {
                  var n = t.style,
                    i = t.currentStyle,
                    r = m.isNumeric(e) ? 'alpha(opacity=' + 100 * e + ')' : '',
                    o = (i && i.filter) || n.filter || ''
                  ;(n.zoom = 1),
                    ((e >= 1 || '' === e) &&
                      '' === m.trim(o.replace(Gt, '')) &&
                      n.removeAttribute &&
                      (n.removeAttribute('filter'),
                      '' === e || (i && !i.filter))) ||
                      (n.filter = Gt.test(o) ? o.replace(Gt, r) : o + ' ' + r)
                }
              }),
            (m.cssHooks.marginRight = Yt(p.reliableMarginRight, function(t, e) {
              if (e)
                return $t(t, { display: 'inline-block' }, Ut, [
                  t,
                  'marginRight'
                ])
            })),
            (m.cssHooks.marginLeft = Yt(p.reliableMarginLeft, function(t, e) {
              if (e)
                return (
                  (parseFloat(Ut(t, 'marginLeft')) ||
                    (m.contains(t.ownerDocument, t)
                      ? t.getBoundingClientRect().left -
                        $t(t, { marginLeft: 0 }, function() {
                          return t.getBoundingClientRect().left
                        })
                      : 0)) + 'px'
                )
            })),
            m.each({ margin: '', padding: '', border: 'Width' }, function(
              t,
              e
            ) {
              ;(m.cssHooks[t + e] = {
                expand: function(n) {
                  for (
                    var i = 0,
                      r = {},
                      o = 'string' == typeof n ? n.split(' ') : [n];
                    i < 4;
                    i++
                  )
                    r[t + V[i] + e] = o[i] || o[i - 2] || o[0]
                  return r
                }
              }),
                Bt.test(t) || (m.cssHooks[t + e].set = se)
            }),
            m.fn.extend({
              css: function(t, e) {
                return tt(
                  this,
                  function(t, e, n) {
                    var i,
                      r,
                      o = {},
                      s = 0
                    if (m.isArray(e)) {
                      for (i = Xt(t), r = e.length; s < r; s++)
                        o[e[s]] = m.css(t, e[s], !1, i)
                      return o
                    }
                    return void 0 !== n ? m.style(t, e, n) : m.css(t, e)
                  },
                  t,
                  e,
                  arguments.length > 1
                )
              },
              show: function() {
                return oe(this, !0)
              },
              hide: function() {
                return oe(this)
              },
              toggle: function(t) {
                return 'boolean' == typeof t
                  ? t
                    ? this.show()
                    : this.hide()
                  : this.each(function() {
                      Y(this) ? m(this).show() : m(this).hide()
                    })
              }
            }),
            (m.Tween = ce),
            (ce.prototype = {
              constructor: ce,
              init: function(t, e, n, i, r, o) {
                ;(this.elem = t),
                  (this.prop = n),
                  (this.easing = r || m.easing._default),
                  (this.options = e),
                  (this.start = this.now = this.cur()),
                  (this.end = i),
                  (this.unit = o || (m.cssNumber[n] ? '' : 'px'))
              },
              cur: function() {
                var t = ce.propHooks[this.prop]
                return t && t.get
                  ? t.get(this)
                  : ce.propHooks._default.get(this)
              },
              run: function(t) {
                var e,
                  n = ce.propHooks[this.prop]
                return (
                  this.options.duration
                    ? (this.pos = e = m.easing[this.easing](
                        t,
                        this.options.duration * t,
                        0,
                        1,
                        this.options.duration
                      ))
                    : (this.pos = e = t),
                  (this.now = (this.end - this.start) * e + this.start),
                  this.options.step &&
                    this.options.step.call(this.elem, this.now, this),
                  n && n.set ? n.set(this) : ce.propHooks._default.set(this),
                  this
                )
              }
            }),
            (ce.prototype.init.prototype = ce.prototype),
            (ce.propHooks = {
              _default: {
                get: function(t) {
                  var e
                  return 1 !== t.elem.nodeType ||
                    (null != t.elem[t.prop] && null == t.elem.style[t.prop])
                    ? t.elem[t.prop]
                    : (e = m.css(t.elem, t.prop, '')) && 'auto' !== e
                    ? e
                    : 0
                },
                set: function(t) {
                  m.fx.step[t.prop]
                    ? m.fx.step[t.prop](t)
                    : 1 !== t.elem.nodeType ||
                      (null == t.elem.style[m.cssProps[t.prop]] &&
                        !m.cssHooks[t.prop])
                    ? (t.elem[t.prop] = t.now)
                    : m.style(t.elem, t.prop, t.now + t.unit)
                }
              }
            }),
            (ce.propHooks.scrollTop = ce.propHooks.scrollLeft = {
              set: function(t) {
                t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
              }
            }),
            (m.easing = {
              linear: function(t) {
                return t
              },
              swing: function(t) {
                return 0.5 - Math.cos(t * Math.PI) / 2
              },
              _default: 'swing'
            }),
            (m.fx = ce.prototype.init),
            (m.fx.step = {})
          var ue,
            fe,
            de = /^(?:toggle|show|hide)$/,
            he = /queueHooks$/
          function pe() {
            return (
              n.setTimeout(function() {
                ue = void 0
              }),
              (ue = m.now())
            )
          }
          function me(t, e) {
            var n,
              i = { height: t },
              r = 0
            for (e = e ? 1 : 0; r < 4; r += 2 - e)
              i['margin' + (n = V[r])] = i['padding' + n] = t
            return e && (i.opacity = i.width = t), i
          }
          function ge(t, e, n) {
            for (
              var i,
                r = (ve.tweeners[e] || []).concat(ve.tweeners['*']),
                o = 0,
                s = r.length;
              o < s;
              o++
            )
              if ((i = r[o].call(n, e, t))) return i
          }
          function ve(t, e, n) {
            var i,
              r,
              o = 0,
              s = ve.prefilters.length,
              a = m.Deferred().always(function() {
                delete l.elem
              }),
              l = function() {
                if (r) return !1
                for (
                  var e = ue || pe(),
                    n = Math.max(0, c.startTime + c.duration - e),
                    i = 1 - (n / c.duration || 0),
                    o = 0,
                    s = c.tweens.length;
                  o < s;
                  o++
                )
                  c.tweens[o].run(i)
                return (
                  a.notifyWith(t, [c, i, n]),
                  i < 1 && s ? n : (a.resolveWith(t, [c]), !1)
                )
              },
              c = a.promise({
                elem: t,
                props: m.extend({}, e),
                opts: m.extend(
                  !0,
                  { specialEasing: {}, easing: m.easing._default },
                  n
                ),
                originalProperties: e,
                originalOptions: n,
                startTime: ue || pe(),
                duration: n.duration,
                tweens: [],
                createTween: function(e, n) {
                  var i = m.Tween(
                    t,
                    c.opts,
                    e,
                    n,
                    c.opts.specialEasing[e] || c.opts.easing
                  )
                  return c.tweens.push(i), i
                },
                stop: function(e) {
                  var n = 0,
                    i = e ? c.tweens.length : 0
                  if (r) return this
                  for (r = !0; n < i; n++) c.tweens[n].run(1)
                  return (
                    e
                      ? (a.notifyWith(t, [c, 1, 0]), a.resolveWith(t, [c, e]))
                      : a.rejectWith(t, [c, e]),
                    this
                  )
                }
              }),
              u = c.props
            for (
              !(function(t, e) {
                var n, i, r, o, s
                for (n in t)
                  if (
                    ((r = e[(i = m.camelCase(n))]),
                    (o = t[n]),
                    m.isArray(o) && ((r = o[1]), (o = t[n] = o[0])),
                    n !== i && ((t[i] = o), delete t[n]),
                    (s = m.cssHooks[i]) && ('expand' in s))
                  )
                    for (n in ((o = s.expand(o)), delete t[i], o))
                      (n in t) || ((t[n] = o[n]), (e[n] = r))
                  else e[i] = r
              })(u, c.opts.specialEasing);
              o < s;
              o++
            )
              if ((i = ve.prefilters[o].call(c, t, u, c.opts)))
                return (
                  m.isFunction(i.stop) &&
                    (m._queueHooks(c.elem, c.opts.queue).stop = m.proxy(
                      i.stop,
                      i
                    )),
                  i
                )
            return (
              m.map(u, ge, c),
              m.isFunction(c.opts.start) && c.opts.start.call(t, c),
              m.fx.timer(
                m.extend(l, { elem: t, anim: c, queue: c.opts.queue })
              ),
              c
                .progress(c.opts.progress)
                .done(c.opts.done, c.opts.complete)
                .fail(c.opts.fail)
                .always(c.opts.always)
            )
          }
          ;(m.Animation = m.extend(ve, {
            tweeners: {
              '*': [
                function(t, e) {
                  var n = this.createTween(t, e)
                  return G(n.elem, t, U.exec(e), n), n
                }
              ]
            },
            tweener: function(t, e) {
              m.isFunction(t) ? ((e = t), (t = ['*'])) : (t = t.match(Q))
              for (var n, i = 0, r = t.length; i < r; i++)
                (n = t[i]),
                  (ve.tweeners[n] = ve.tweeners[n] || []),
                  ve.tweeners[n].unshift(e)
            },
            prefilters: [
              function(t, e, n) {
                var i,
                  r,
                  o,
                  s,
                  a,
                  l,
                  c,
                  u = this,
                  f = {},
                  d = t.style,
                  h = t.nodeType && Y(t),
                  g = m._data(t, 'fxshow')
                for (i in (n.queue ||
                  (null == (a = m._queueHooks(t, 'fx')).unqueued &&
                    ((a.unqueued = 0),
                    (l = a.empty.fire),
                    (a.empty.fire = function() {
                      a.unqueued || l()
                    })),
                  a.unqueued++,
                  u.always(function() {
                    u.always(function() {
                      a.unqueued--, m.queue(t, 'fx').length || a.empty.fire()
                    })
                  })),
                1 === t.nodeType &&
                  ('height' in e || 'width' in e) &&
                  ((n.overflow = [d.overflow, d.overflowX, d.overflowY]),
                  'inline' ===
                    ('none' === (c = m.css(t, 'display'))
                      ? m._data(t, 'olddisplay') || Ht(t.nodeName)
                      : c) &&
                    'none' === m.css(t, 'float') &&
                    (p.inlineBlockNeedsLayout && 'inline' !== Ht(t.nodeName)
                      ? (d.zoom = 1)
                      : (d.display = 'inline-block'))),
                n.overflow &&
                  ((d.overflow = 'hidden'),
                  p.shrinkWrapBlocks() ||
                    u.always(function() {
                      ;(d.overflow = n.overflow[0]),
                        (d.overflowX = n.overflow[1]),
                        (d.overflowY = n.overflow[2])
                    })),
                e))
                  if (((r = e[i]), de.exec(r))) {
                    if (
                      (delete e[i],
                      (o = o || 'toggle' === r),
                      r === (h ? 'hide' : 'show'))
                    ) {
                      if ('show' !== r || !g || void 0 === g[i]) continue
                      h = !0
                    }
                    f[i] = (g && g[i]) || m.style(t, i)
                  } else c = void 0
                if (m.isEmptyObject(f))
                  'inline' === ('none' === c ? Ht(t.nodeName) : c) &&
                    (d.display = c)
                else
                  for (i in (g
                    ? 'hidden' in g && (h = g.hidden)
                    : (g = m._data(t, 'fxshow', {})),
                  o && (g.hidden = !h),
                  h
                    ? m(t).show()
                    : u.done(function() {
                        m(t).hide()
                      }),
                  u.done(function() {
                    var e
                    for (e in (m._removeData(t, 'fxshow'), f))
                      m.style(t, e, f[e])
                  }),
                  f))
                    (s = ge(h ? g[i] : 0, i, u)),
                      i in g ||
                        ((g[i] = s.start),
                        h &&
                          ((s.end = s.start),
                          (s.start = 'width' === i || 'height' === i ? 1 : 0)))
              }
            ],
            prefilter: function(t, e) {
              e ? ve.prefilters.unshift(t) : ve.prefilters.push(t)
            }
          })),
            (m.speed = function(t, e, n) {
              var i =
                t && 'object' == typeof t
                  ? m.extend({}, t)
                  : {
                      complete: n || (!n && e) || (m.isFunction(t) && t),
                      duration: t,
                      easing: (n && e) || (e && !m.isFunction(e) && e)
                    }
              return (
                (i.duration = m.fx.off
                  ? 0
                  : 'number' == typeof i.duration
                  ? i.duration
                  : i.duration in m.fx.speeds
                  ? m.fx.speeds[i.duration]
                  : m.fx.speeds._default),
                (null != i.queue && !0 !== i.queue) || (i.queue = 'fx'),
                (i.old = i.complete),
                (i.complete = function() {
                  m.isFunction(i.old) && i.old.call(this),
                    i.queue && m.dequeue(this, i.queue)
                }),
                i
              )
            }),
            m.fn.extend({
              fadeTo: function(t, e, n, i) {
                return this.filter(Y)
                  .css('opacity', 0)
                  .show()
                  .end()
                  .animate({ opacity: e }, t, n, i)
              },
              animate: function(t, e, n, i) {
                var r = m.isEmptyObject(t),
                  o = m.speed(e, n, i),
                  s = function() {
                    var e = ve(this, m.extend({}, t), o)
                    ;(r || m._data(this, 'finish')) && e.stop(!0)
                  }
                return (
                  (s.finish = s),
                  r || !1 === o.queue ? this.each(s) : this.queue(o.queue, s)
                )
              },
              stop: function(t, e, n) {
                var i = function(t) {
                  var e = t.stop
                  delete t.stop, e(n)
                }
                return (
                  'string' != typeof t && ((n = e), (e = t), (t = void 0)),
                  e && !1 !== t && this.queue(t || 'fx', []),
                  this.each(function() {
                    var e = !0,
                      r = null != t && t + 'queueHooks',
                      o = m.timers,
                      s = m._data(this)
                    if (r) s[r] && s[r].stop && i(s[r])
                    else for (r in s) s[r] && s[r].stop && he.test(r) && i(s[r])
                    for (r = o.length; r--; )
                      o[r].elem !== this ||
                        (null != t && o[r].queue !== t) ||
                        (o[r].anim.stop(n), (e = !1), o.splice(r, 1))
                    ;(!e && n) || m.dequeue(this, t)
                  })
                )
              },
              finish: function(t) {
                return (
                  !1 !== t && (t = t || 'fx'),
                  this.each(function() {
                    var e,
                      n = m._data(this),
                      i = n[t + 'queue'],
                      r = n[t + 'queueHooks'],
                      o = m.timers,
                      s = i ? i.length : 0
                    for (
                      n.finish = !0,
                        m.queue(this, t, []),
                        r && r.stop && r.stop.call(this, !0),
                        e = o.length;
                      e--;

                    )
                      o[e].elem === this &&
                        o[e].queue === t &&
                        (o[e].anim.stop(!0), o.splice(e, 1))
                    for (e = 0; e < s; e++)
                      i[e] && i[e].finish && i[e].finish.call(this)
                    delete n.finish
                  })
                )
              }
            }),
            m.each(['toggle', 'show', 'hide'], function(t, e) {
              var n = m.fn[e]
              m.fn[e] = function(t, i, r) {
                return null == t || 'boolean' == typeof t
                  ? n.apply(this, arguments)
                  : this.animate(me(e, !0), t, i, r)
              }
            }),
            m.each(
              {
                slideDown: me('show'),
                slideUp: me('hide'),
                slideToggle: me('toggle'),
                fadeIn: { opacity: 'show' },
                fadeOut: { opacity: 'hide' },
                fadeToggle: { opacity: 'toggle' }
              },
              function(t, e) {
                m.fn[t] = function(t, n, i) {
                  return this.animate(e, t, n, i)
                }
              }
            ),
            (m.timers = []),
            (m.fx.tick = function() {
              var t,
                e = m.timers,
                n = 0
              for (ue = m.now(); n < e.length; n++)
                (t = e[n])() || e[n] !== t || e.splice(n--, 1)
              e.length || m.fx.stop(), (ue = void 0)
            }),
            (m.fx.timer = function(t) {
              m.timers.push(t), t() ? m.fx.start() : m.timers.pop()
            }),
            (m.fx.interval = 13),
            (m.fx.start = function() {
              fe || (fe = n.setInterval(m.fx.tick, m.fx.interval))
            }),
            (m.fx.stop = function() {
              n.clearInterval(fe), (fe = null)
            }),
            (m.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
            (m.fn.delay = function(t, e) {
              return (
                (t = (m.fx && m.fx.speeds[t]) || t),
                (e = e || 'fx'),
                this.queue(e, function(e, i) {
                  var r = n.setTimeout(e, t)
                  i.stop = function() {
                    n.clearTimeout(r)
                  }
                })
              )
            }),
            (function() {
              var t,
                e = s.createElement('input'),
                n = s.createElement('div'),
                i = s.createElement('select'),
                r = i.appendChild(s.createElement('option'))
              ;(n = s.createElement('div')).setAttribute('className', 't'),
                (n.innerHTML =
                  "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
                (t = n.getElementsByTagName('a')[0]),
                e.setAttribute('type', 'checkbox'),
                n.appendChild(e),
                ((t = n.getElementsByTagName('a')[0]).style.cssText =
                  'top:1px'),
                (p.getSetAttribute = 't' !== n.className),
                (p.style = /top/.test(t.getAttribute('style'))),
                (p.hrefNormalized = '/a' === t.getAttribute('href')),
                (p.checkOn = !!e.value),
                (p.optSelected = r.selected),
                (p.enctype = !!s.createElement('form').enctype),
                (i.disabled = !0),
                (p.optDisabled = !r.disabled),
                (e = s.createElement('input')).setAttribute('value', ''),
                (p.input = '' === e.getAttribute('value')),
                (e.value = 't'),
                e.setAttribute('type', 'radio'),
                (p.radioValue = 't' === e.value)
            })()
          var ye = /\r/g,
            be = /[\x20\t\r\n\f]+/g
          m.fn.extend({
            val: function(t) {
              var e,
                n,
                i,
                r = this[0]
              return arguments.length
                ? ((i = m.isFunction(t)),
                  this.each(function(n) {
                    var r
                    1 === this.nodeType &&
                      (null == (r = i ? t.call(this, n, m(this).val()) : t)
                        ? (r = '')
                        : 'number' == typeof r
                        ? (r += '')
                        : m.isArray(r) &&
                          (r = m.map(r, function(t) {
                            return null == t ? '' : t + ''
                          })),
                      ((e =
                        m.valHooks[this.type] ||
                        m.valHooks[this.nodeName.toLowerCase()]) &&
                        'set' in e &&
                        void 0 !== e.set(this, r, 'value')) ||
                        (this.value = r))
                  }))
                : r
                ? (e =
                    m.valHooks[r.type] ||
                    m.valHooks[r.nodeName.toLowerCase()]) &&
                  'get' in e &&
                  void 0 !== (n = e.get(r, 'value'))
                  ? n
                  : 'string' == typeof (n = r.value)
                  ? n.replace(ye, '')
                  : null == n
                  ? ''
                  : n
                : void 0
            }
          }),
            m.extend({
              valHooks: {
                option: {
                  get: function(t) {
                    var e = m.find.attr(t, 'value')
                    return null != e ? e : m.trim(m.text(t)).replace(be, ' ')
                  }
                },
                select: {
                  get: function(t) {
                    for (
                      var e,
                        n,
                        i = t.options,
                        r = t.selectedIndex,
                        o = 'select-one' === t.type || r < 0,
                        s = o ? null : [],
                        a = o ? r + 1 : i.length,
                        l = r < 0 ? a : o ? r : 0;
                      l < a;
                      l++
                    )
                      if (
                        ((n = i[l]).selected || l === r) &&
                        (p.optDisabled
                          ? !n.disabled
                          : null === n.getAttribute('disabled')) &&
                        (!n.parentNode.disabled ||
                          !m.nodeName(n.parentNode, 'optgroup'))
                      ) {
                        if (((e = m(n).val()), o)) return e
                        s.push(e)
                      }
                    return s
                  },
                  set: function(t, e) {
                    for (
                      var n, i, r = t.options, o = m.makeArray(e), s = r.length;
                      s--;

                    )
                      if (
                        ((i = r[s]),
                        m.inArray(m.valHooks.option.get(i), o) > -1)
                      )
                        try {
                          i.selected = n = !0
                        } catch (t) {
                          i.scrollHeight
                        }
                      else i.selected = !1
                    return n || (t.selectedIndex = -1), r
                  }
                }
              }
            }),
            m.each(['radio', 'checkbox'], function() {
              ;(m.valHooks[this] = {
                set: function(t, e) {
                  if (m.isArray(e))
                    return (t.checked = m.inArray(m(t).val(), e) > -1)
                }
              }),
                p.checkOn ||
                  (m.valHooks[this].get = function(t) {
                    return null === t.getAttribute('value') ? 'on' : t.value
                  })
            })
          var xe,
            qe,
            we = m.expr.attrHandle,
            Te = /^(?:checked|selected)$/i,
            ke = p.getSetAttribute,
            Ce = p.input
          m.fn.extend({
            attr: function(t, e) {
              return tt(this, m.attr, t, e, arguments.length > 1)
            },
            removeAttr: function(t) {
              return this.each(function() {
                m.removeAttr(this, t)
              })
            }
          }),
            m.extend({
              attr: function(t, e, n) {
                var i,
                  r,
                  o = t.nodeType
                if (3 !== o && 8 !== o && 2 !== o)
                  return void 0 === t.getAttribute
                    ? m.prop(t, e, n)
                    : ((1 === o && m.isXMLDoc(t)) ||
                        ((e = e.toLowerCase()),
                        (r =
                          m.attrHooks[e] ||
                          (m.expr.match.bool.test(e) ? qe : xe))),
                      void 0 !== n
                        ? null === n
                          ? void m.removeAttr(t, e)
                          : r && 'set' in r && void 0 !== (i = r.set(t, n, e))
                          ? i
                          : (t.setAttribute(e, n + ''), n)
                        : r && 'get' in r && null !== (i = r.get(t, e))
                        ? i
                        : null == (i = m.find.attr(t, e))
                        ? void 0
                        : i)
              },
              attrHooks: {
                type: {
                  set: function(t, e) {
                    if (
                      !p.radioValue &&
                      'radio' === e &&
                      m.nodeName(t, 'input')
                    ) {
                      var n = t.value
                      return t.setAttribute('type', e), n && (t.value = n), e
                    }
                  }
                }
              },
              removeAttr: function(t, e) {
                var n,
                  i,
                  r = 0,
                  o = e && e.match(Q)
                if (o && 1 === t.nodeType)
                  for (; (n = o[r++]); )
                    (i = m.propFix[n] || n),
                      m.expr.match.bool.test(n)
                        ? (Ce && ke) || !Te.test(n)
                          ? (t[i] = !1)
                          : (t[m.camelCase('default-' + n)] = t[i] = !1)
                        : m.attr(t, n, ''),
                      t.removeAttribute(ke ? n : i)
              }
            }),
            (qe = {
              set: function(t, e, n) {
                return (
                  !1 === e
                    ? m.removeAttr(t, n)
                    : (Ce && ke) || !Te.test(n)
                    ? t.setAttribute((!ke && m.propFix[n]) || n, n)
                    : (t[m.camelCase('default-' + n)] = t[n] = !0),
                  n
                )
              }
            }),
            m.each(m.expr.match.bool.source.match(/\w+/g), function(t, e) {
              var n = we[e] || m.find.attr
              ;(Ce && ke) || !Te.test(e)
                ? (we[e] = function(t, e, i) {
                    var r, o
                    return (
                      i ||
                        ((o = we[e]),
                        (we[e] = r),
                        (r = null != n(t, e, i) ? e.toLowerCase() : null),
                        (we[e] = o)),
                      r
                    )
                  })
                : (we[e] = function(t, e, n) {
                    if (!n)
                      return t[m.camelCase('default-' + e)]
                        ? e.toLowerCase()
                        : null
                  })
            }),
            (Ce && ke) ||
              (m.attrHooks.value = {
                set: function(t, e, n) {
                  if (!m.nodeName(t, 'input')) return xe && xe.set(t, e, n)
                  t.defaultValue = e
                }
              }),
            ke ||
              ((xe = {
                set: function(t, e, n) {
                  var i = t.getAttributeNode(n)
                  if (
                    (i ||
                      t.setAttributeNode(
                        (i = t.ownerDocument.createAttribute(n))
                      ),
                    (i.value = e += ''),
                    'value' === n || e === t.getAttribute(n))
                  )
                    return e
                }
              }),
              (we.id = we.name = we.coords = function(t, e, n) {
                var i
                if (!n)
                  return (i = t.getAttributeNode(e)) && '' !== i.value
                    ? i.value
                    : null
              }),
              (m.valHooks.button = {
                get: function(t, e) {
                  var n = t.getAttributeNode(e)
                  if (n && n.specified) return n.value
                },
                set: xe.set
              }),
              (m.attrHooks.contenteditable = {
                set: function(t, e, n) {
                  xe.set(t, '' !== e && e, n)
                }
              }),
              m.each(['width', 'height'], function(t, e) {
                m.attrHooks[e] = {
                  set: function(t, n) {
                    if ('' === n) return t.setAttribute(e, 'auto'), n
                  }
                }
              })),
            p.style ||
              (m.attrHooks.style = {
                get: function(t) {
                  return t.style.cssText || void 0
                },
                set: function(t, e) {
                  return (t.style.cssText = e + '')
                }
              })
          var Se = /^(?:input|select|textarea|button|object)$/i,
            Ee = /^(?:a|area)$/i
          m.fn.extend({
            prop: function(t, e) {
              return tt(this, m.prop, t, e, arguments.length > 1)
            },
            removeProp: function(t) {
              return (
                (t = m.propFix[t] || t),
                this.each(function() {
                  try {
                    ;(this[t] = void 0), delete this[t]
                  } catch (t) {}
                })
              )
            }
          }),
            m.extend({
              prop: function(t, e, n) {
                var i,
                  r,
                  o = t.nodeType
                if (3 !== o && 8 !== o && 2 !== o)
                  return (
                    (1 === o && m.isXMLDoc(t)) ||
                      ((e = m.propFix[e] || e), (r = m.propHooks[e])),
                    void 0 !== n
                      ? r && 'set' in r && void 0 !== (i = r.set(t, n, e))
                        ? i
                        : (t[e] = n)
                      : r && 'get' in r && null !== (i = r.get(t, e))
                      ? i
                      : t[e]
                  )
              },
              propHooks: {
                tabIndex: {
                  get: function(t) {
                    var e = m.find.attr(t, 'tabindex')
                    return e
                      ? parseInt(e, 10)
                      : Se.test(t.nodeName) || (Ee.test(t.nodeName) && t.href)
                      ? 0
                      : -1
                  }
                }
              },
              propFix: { for: 'htmlFor', class: 'className' }
            }),
            p.hrefNormalized ||
              m.each(['href', 'src'], function(t, e) {
                m.propHooks[e] = {
                  get: function(t) {
                    return t.getAttribute(e, 4)
                  }
                }
              }),
            p.optSelected ||
              (m.propHooks.selected = {
                get: function(t) {
                  var e = t.parentNode
                  return (
                    e &&
                      (e.selectedIndex,
                      e.parentNode && e.parentNode.selectedIndex),
                    null
                  )
                },
                set: function(t) {
                  var e = t.parentNode
                  e &&
                    (e.selectedIndex,
                    e.parentNode && e.parentNode.selectedIndex)
                }
              }),
            m.each(
              [
                'tabIndex',
                'readOnly',
                'maxLength',
                'cellSpacing',
                'cellPadding',
                'rowSpan',
                'colSpan',
                'useMap',
                'frameBorder',
                'contentEditable'
              ],
              function() {
                m.propFix[this.toLowerCase()] = this
              }
            ),
            p.enctype || (m.propFix.enctype = 'encoding')
          var je = /[\t\r\n\f]/g
          function Oe(t) {
            return m.attr(t, 'class') || ''
          }
          m.fn.extend({
            addClass: function(t) {
              var e,
                n,
                i,
                r,
                o,
                s,
                a,
                l = 0
              if (m.isFunction(t))
                return this.each(function(e) {
                  m(this).addClass(t.call(this, e, Oe(this)))
                })
              if ('string' == typeof t && t)
                for (e = t.match(Q) || []; (n = this[l++]); )
                  if (
                    ((r = Oe(n)),
                    (i = 1 === n.nodeType && (' ' + r + ' ').replace(je, ' ')))
                  ) {
                    for (s = 0; (o = e[s++]); )
                      i.indexOf(' ' + o + ' ') < 0 && (i += o + ' ')
                    r !== (a = m.trim(i)) && m.attr(n, 'class', a)
                  }
              return this
            },
            removeClass: function(t) {
              var e,
                n,
                i,
                r,
                o,
                s,
                a,
                l = 0
              if (m.isFunction(t))
                return this.each(function(e) {
                  m(this).removeClass(t.call(this, e, Oe(this)))
                })
              if (!arguments.length) return this.attr('class', '')
              if ('string' == typeof t && t)
                for (e = t.match(Q) || []; (n = this[l++]); )
                  if (
                    ((r = Oe(n)),
                    (i = 1 === n.nodeType && (' ' + r + ' ').replace(je, ' ')))
                  ) {
                    for (s = 0; (o = e[s++]); )
                      for (; i.indexOf(' ' + o + ' ') > -1; )
                        i = i.replace(' ' + o + ' ', ' ')
                    r !== (a = m.trim(i)) && m.attr(n, 'class', a)
                  }
              return this
            },
            toggleClass: function(t, e) {
              var n = typeof t
              return 'boolean' == typeof e && 'string' === n
                ? e
                  ? this.addClass(t)
                  : this.removeClass(t)
                : m.isFunction(t)
                ? this.each(function(n) {
                    m(this).toggleClass(t.call(this, n, Oe(this), e), e)
                  })
                : this.each(function() {
                    var e, i, r, o
                    if ('string' === n)
                      for (
                        i = 0, r = m(this), o = t.match(Q) || [];
                        (e = o[i++]);

                      )
                        r.hasClass(e) ? r.removeClass(e) : r.addClass(e)
                    else
                      (void 0 !== t && 'boolean' !== n) ||
                        ((e = Oe(this)) && m._data(this, '__className__', e),
                        m.attr(
                          this,
                          'class',
                          e || !1 === t
                            ? ''
                            : m._data(this, '__className__') || ''
                        ))
                  })
            },
            hasClass: function(t) {
              var e,
                n,
                i = 0
              for (e = ' ' + t + ' '; (n = this[i++]); )
                if (
                  1 === n.nodeType &&
                  (' ' + Oe(n) + ' ').replace(je, ' ').indexOf(e) > -1
                )
                  return !0
              return !1
            }
          }),
            m.each(
              'blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(
                ' '
              ),
              function(t, e) {
                m.fn[e] = function(t, n) {
                  return arguments.length > 0
                    ? this.on(e, null, t, n)
                    : this.trigger(e)
                }
              }
            ),
            m.fn.extend({
              hover: function(t, e) {
                return this.mouseenter(t).mouseleave(e || t)
              }
            })
          var De = n.location,
            Ae = m.now(),
            Le = /\?/,
            _e = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g
          ;(m.parseJSON = function(t) {
            if (n.JSON && n.JSON.parse) return n.JSON.parse(t + '')
            var e,
              i = null,
              r = m.trim(t + '')
            return r &&
              !m.trim(
                r.replace(_e, function(t, n, r, o) {
                  return (
                    e && n && (i = 0),
                    0 === i ? t : ((e = r || n), (i += !o - !r), '')
                  )
                })
              )
              ? Function('return ' + r)()
              : m.error('Invalid JSON: ' + t)
          }),
            (m.parseXML = function(t) {
              var e
              if (!t || 'string' != typeof t) return null
              try {
                n.DOMParser
                  ? (e = new n.DOMParser().parseFromString(t, 'text/xml'))
                  : (((e = new n.ActiveXObject('Microsoft.XMLDOM')).async =
                      'false'),
                    e.loadXML(t))
              } catch (t) {
                e = void 0
              }
              return (
                (e &&
                  e.documentElement &&
                  !e.getElementsByTagName('parsererror').length) ||
                  m.error('Invalid XML: ' + t),
                e
              )
            })
          var Ne = /#.*$/,
            Qe = /([?&])_=[^&]*/,
            Me = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            Re = /^(?:GET|HEAD)$/,
            ze = /^\/\//,
            Fe = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            Ie = {},
            He = {},
            Be = '*/'.concat('*'),
            Pe = De.href,
            $e = Fe.exec(Pe.toLowerCase()) || []
          function We(t) {
            return function(e, n) {
              'string' != typeof e && ((n = e), (e = '*'))
              var i,
                r = 0,
                o = e.toLowerCase().match(Q) || []
              if (m.isFunction(n))
                for (; (i = o[r++]); )
                  '+' === i.charAt(0)
                    ? ((i = i.slice(1) || '*'), (t[i] = t[i] || []).unshift(n))
                    : (t[i] = t[i] || []).push(n)
            }
          }
          function Xe(t, e, n, i) {
            var r = {},
              o = t === He
            function s(a) {
              var l
              return (
                (r[a] = !0),
                m.each(t[a] || [], function(t, a) {
                  var c = a(e, n, i)
                  return 'string' != typeof c || o || r[c]
                    ? o
                      ? !(l = c)
                      : void 0
                    : (e.dataTypes.unshift(c), s(c), !1)
                }),
                l
              )
            }
            return s(e.dataTypes[0]) || (!r['*'] && s('*'))
          }
          function Ue(t, e) {
            var n,
              i,
              r = m.ajaxSettings.flatOptions || {}
            for (i in e)
              void 0 !== e[i] && ((r[i] ? t : n || (n = {}))[i] = e[i])
            return n && m.extend(!0, t, n), t
          }
          function Ve(t) {
            return (t.style && t.style.display) || m.css(t, 'display')
          }
          m.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
              url: Pe,
              type: 'GET',
              isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
                $e[1]
              ),
              global: !0,
              processData: !0,
              async: !0,
              contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
              accepts: {
                '*': Be,
                text: 'text/plain',
                html: 'text/html',
                xml: 'application/xml, text/xml',
                json: 'application/json, text/javascript'
              },
              contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
              responseFields: {
                xml: 'responseXML',
                text: 'responseText',
                json: 'responseJSON'
              },
              converters: {
                '* text': String,
                'text html': !0,
                'text json': m.parseJSON,
                'text xml': m.parseXML
              },
              flatOptions: { url: !0, context: !0 }
            },
            ajaxSetup: function(t, e) {
              return e ? Ue(Ue(t, m.ajaxSettings), e) : Ue(m.ajaxSettings, t)
            },
            ajaxPrefilter: We(Ie),
            ajaxTransport: We(He),
            ajax: function(t, e) {
              'object' == typeof t && ((e = t), (t = void 0)), (e = e || {})
              var i,
                r,
                o,
                s,
                a,
                l,
                c,
                u,
                f = m.ajaxSetup({}, e),
                d = f.context || f,
                h = f.context && (d.nodeType || d.jquery) ? m(d) : m.event,
                p = m.Deferred(),
                g = m.Callbacks('once memory'),
                v = f.statusCode || {},
                y = {},
                b = {},
                x = 0,
                q = 'canceled',
                w = {
                  readyState: 0,
                  getResponseHeader: function(t) {
                    var e
                    if (2 === x) {
                      if (!u)
                        for (u = {}; (e = Me.exec(s)); )
                          u[e[1].toLowerCase()] = e[2]
                      e = u[t.toLowerCase()]
                    }
                    return null == e ? null : e
                  },
                  getAllResponseHeaders: function() {
                    return 2 === x ? s : null
                  },
                  setRequestHeader: function(t, e) {
                    var n = t.toLowerCase()
                    return x || ((t = b[n] = b[n] || t), (y[t] = e)), this
                  },
                  overrideMimeType: function(t) {
                    return x || (f.mimeType = t), this
                  },
                  statusCode: function(t) {
                    var e
                    if (t)
                      if (x < 2) for (e in t) v[e] = [v[e], t[e]]
                      else w.always(t[w.status])
                    return this
                  },
                  abort: function(t) {
                    var e = t || q
                    return c && c.abort(e), T(0, e), this
                  }
                }
              if (
                ((p.promise(w).complete = g.add),
                (w.success = w.done),
                (w.error = w.fail),
                (f.url = ((t || f.url || Pe) + '')
                  .replace(Ne, '')
                  .replace(ze, $e[1] + '//')),
                (f.type = e.method || e.type || f.method || f.type),
                (f.dataTypes = m
                  .trim(f.dataType || '*')
                  .toLowerCase()
                  .match(Q) || ['']),
                null == f.crossDomain &&
                  ((i = Fe.exec(f.url.toLowerCase())),
                  (f.crossDomain = !(
                    !i ||
                    (i[1] === $e[1] &&
                      i[2] === $e[2] &&
                      (i[3] || ('http:' === i[1] ? '80' : '443')) ===
                        ($e[3] || ('http:' === $e[1] ? '80' : '443')))
                  ))),
                f.data &&
                  f.processData &&
                  'string' != typeof f.data &&
                  (f.data = m.param(f.data, f.traditional)),
                Xe(Ie, f, e, w),
                2 === x)
              )
                return w
              for (r in ((l = m.event && f.global) &&
                0 == m.active++ &&
                m.event.trigger('ajaxStart'),
              (f.type = f.type.toUpperCase()),
              (f.hasContent = !Re.test(f.type)),
              (o = f.url),
              f.hasContent ||
                (f.data &&
                  ((o = f.url += (Le.test(o) ? '&' : '?') + f.data),
                  delete f.data),
                !1 === f.cache &&
                  (f.url = Qe.test(o)
                    ? o.replace(Qe, '$1_=' + Ae++)
                    : o + (Le.test(o) ? '&' : '?') + '_=' + Ae++)),
              f.ifModified &&
                (m.lastModified[o] &&
                  w.setRequestHeader('If-Modified-Since', m.lastModified[o]),
                m.etag[o] && w.setRequestHeader('If-None-Match', m.etag[o])),
              ((f.data && f.hasContent && !1 !== f.contentType) ||
                e.contentType) &&
                w.setRequestHeader('Content-Type', f.contentType),
              w.setRequestHeader(
                'Accept',
                f.dataTypes[0] && f.accepts[f.dataTypes[0]]
                  ? f.accepts[f.dataTypes[0]] +
                      ('*' !== f.dataTypes[0] ? ', ' + Be + '; q=0.01' : '')
                  : f.accepts['*']
              ),
              f.headers))
                w.setRequestHeader(r, f.headers[r])
              if (
                f.beforeSend &&
                (!1 === f.beforeSend.call(d, w, f) || 2 === x)
              )
                return w.abort()
              for (r in ((q = 'abort'), { success: 1, error: 1, complete: 1 }))
                w[r](f[r])
              if ((c = Xe(He, f, e, w))) {
                if (
                  ((w.readyState = 1),
                  l && h.trigger('ajaxSend', [w, f]),
                  2 === x)
                )
                  return w
                f.async &&
                  f.timeout > 0 &&
                  (a = n.setTimeout(function() {
                    w.abort('timeout')
                  }, f.timeout))
                try {
                  ;(x = 1), c.send(y, T)
                } catch (t) {
                  if (!(x < 2)) throw t
                  T(-1, t)
                }
              } else T(-1, 'No Transport')
              function T(t, e, i, r) {
                var u,
                  y,
                  b,
                  q,
                  T,
                  k = e
                2 !== x &&
                  ((x = 2),
                  a && n.clearTimeout(a),
                  (c = void 0),
                  (s = r || ''),
                  (w.readyState = t > 0 ? 4 : 0),
                  (u = (t >= 200 && t < 300) || 304 === t),
                  i &&
                    (q = (function(t, e, n) {
                      for (
                        var i, r, o, s, a = t.contents, l = t.dataTypes;
                        '*' === l[0];

                      )
                        l.shift(),
                          void 0 === r &&
                            (r =
                              t.mimeType || e.getResponseHeader('Content-Type'))
                      if (r)
                        for (s in a)
                          if (a[s] && a[s].test(r)) {
                            l.unshift(s)
                            break
                          }
                      if (l[0] in n) o = l[0]
                      else {
                        for (s in n) {
                          if (!l[0] || t.converters[s + ' ' + l[0]]) {
                            o = s
                            break
                          }
                          i || (i = s)
                        }
                        o = o || i
                      }
                      if (o) return o !== l[0] && l.unshift(o), n[o]
                    })(f, w, i)),
                  (q = (function(t, e, n, i) {
                    var r,
                      o,
                      s,
                      a,
                      l,
                      c = {},
                      u = t.dataTypes.slice()
                    if (u[1])
                      for (s in t.converters)
                        c[s.toLowerCase()] = t.converters[s]
                    for (o = u.shift(); o; )
                      if (
                        (t.responseFields[o] && (n[t.responseFields[o]] = e),
                        !l &&
                          i &&
                          t.dataFilter &&
                          (e = t.dataFilter(e, t.dataType)),
                        (l = o),
                        (o = u.shift()))
                      )
                        if ('*' === o) o = l
                        else if ('*' !== l && l !== o) {
                          if (!(s = c[l + ' ' + o] || c['* ' + o]))
                            for (r in c)
                              if (
                                (a = r.split(' '))[1] === o &&
                                (s = c[l + ' ' + a[0]] || c['* ' + a[0]])
                              ) {
                                !0 === s
                                  ? (s = c[r])
                                  : !0 !== c[r] && ((o = a[0]), u.unshift(a[1]))
                                break
                              }
                          if (!0 !== s)
                            if (s && t.throws) e = s(e)
                            else
                              try {
                                e = s(e)
                              } catch (t) {
                                return {
                                  state: 'parsererror',
                                  error: s
                                    ? t
                                    : 'No conversion from ' + l + ' to ' + o
                                }
                              }
                        }
                    return { state: 'success', data: e }
                  })(f, q, w, u)),
                  u
                    ? (f.ifModified &&
                        ((T = w.getResponseHeader('Last-Modified')) &&
                          (m.lastModified[o] = T),
                        (T = w.getResponseHeader('etag')) && (m.etag[o] = T)),
                      204 === t || 'HEAD' === f.type
                        ? (k = 'nocontent')
                        : 304 === t
                        ? (k = 'notmodified')
                        : ((k = q.state), (y = q.data), (u = !(b = q.error))))
                    : ((b = k), (!t && k) || ((k = 'error'), t < 0 && (t = 0))),
                  (w.status = t),
                  (w.statusText = (e || k) + ''),
                  u ? p.resolveWith(d, [y, k, w]) : p.rejectWith(d, [w, k, b]),
                  w.statusCode(v),
                  (v = void 0),
                  l &&
                    h.trigger(u ? 'ajaxSuccess' : 'ajaxError', [
                      w,
                      f,
                      u ? y : b
                    ]),
                  g.fireWith(d, [w, k]),
                  l &&
                    (h.trigger('ajaxComplete', [w, f]),
                    --m.active || m.event.trigger('ajaxStop')))
              }
              return w
            },
            getJSON: function(t, e, n) {
              return m.get(t, e, n, 'json')
            },
            getScript: function(t, e) {
              return m.get(t, void 0, e, 'script')
            }
          }),
            m.each(['get', 'post'], function(t, e) {
              m[e] = function(t, n, i, r) {
                return (
                  m.isFunction(n) && ((r = r || i), (i = n), (n = void 0)),
                  m.ajax(
                    m.extend(
                      { url: t, type: e, dataType: r, data: n, success: i },
                      m.isPlainObject(t) && t
                    )
                  )
                )
              }
            }),
            (m._evalUrl = function(t) {
              return m.ajax({
                url: t,
                type: 'GET',
                dataType: 'script',
                cache: !0,
                async: !1,
                global: !1,
                throws: !0
              })
            }),
            m.fn.extend({
              wrapAll: function(t) {
                if (m.isFunction(t))
                  return this.each(function(e) {
                    m(this).wrapAll(t.call(this, e))
                  })
                if (this[0]) {
                  var e = m(t, this[0].ownerDocument)
                    .eq(0)
                    .clone(!0)
                  this[0].parentNode && e.insertBefore(this[0]),
                    e
                      .map(function() {
                        for (
                          var t = this;
                          t.firstChild && 1 === t.firstChild.nodeType;

                        )
                          t = t.firstChild
                        return t
                      })
                      .append(this)
                }
                return this
              },
              wrapInner: function(t) {
                return m.isFunction(t)
                  ? this.each(function(e) {
                      m(this).wrapInner(t.call(this, e))
                    })
                  : this.each(function() {
                      var e = m(this),
                        n = e.contents()
                      n.length ? n.wrapAll(t) : e.append(t)
                    })
              },
              wrap: function(t) {
                var e = m.isFunction(t)
                return this.each(function(n) {
                  m(this).wrapAll(e ? t.call(this, n) : t)
                })
              },
              unwrap: function() {
                return this.parent()
                  .each(function() {
                    m.nodeName(this, 'body') ||
                      m(this).replaceWith(this.childNodes)
                  })
                  .end()
              }
            }),
            (m.expr.filters.hidden = function(t) {
              return p.reliableHiddenOffsets()
                ? t.offsetWidth <= 0 &&
                    t.offsetHeight <= 0 &&
                    !t.getClientRects().length
                : (function(t) {
                    if (!m.contains(t.ownerDocument || s, t)) return !0
                    for (; t && 1 === t.nodeType; ) {
                      if ('none' === Ve(t) || 'hidden' === t.type) return !0
                      t = t.parentNode
                    }
                    return !1
                  })(t)
            }),
            (m.expr.filters.visible = function(t) {
              return !m.expr.filters.hidden(t)
            })
          var Ye = /%20/g,
            Ge = /\[\]$/,
            Ke = /\r?\n/g,
            Je = /^(?:submit|button|image|reset|file)$/i,
            Ze = /^(?:input|select|textarea|keygen)/i
          function tn(t, e, n, i) {
            var r
            if (m.isArray(e))
              m.each(e, function(e, r) {
                n || Ge.test(t)
                  ? i(t, r)
                  : tn(
                      t +
                        '[' +
                        ('object' == typeof r && null != r ? e : '') +
                        ']',
                      r,
                      n,
                      i
                    )
              })
            else if (n || 'object' !== m.type(e)) i(t, e)
            else for (r in e) tn(t + '[' + r + ']', e[r], n, i)
          }
          ;(m.param = function(t, e) {
            var n,
              i = [],
              r = function(t, e) {
                ;(e = m.isFunction(e) ? e() : null == e ? '' : e),
                  (i[i.length] =
                    encodeURIComponent(t) + '=' + encodeURIComponent(e))
              }
            if (
              (void 0 === e &&
                (e = m.ajaxSettings && m.ajaxSettings.traditional),
              m.isArray(t) || (t.jquery && !m.isPlainObject(t)))
            )
              m.each(t, function() {
                r(this.name, this.value)
              })
            else for (n in t) tn(n, t[n], e, r)
            return i.join('&').replace(Ye, '+')
          }),
            m.fn.extend({
              serialize: function() {
                return m.param(this.serializeArray())
              },
              serializeArray: function() {
                return this.map(function() {
                  var t = m.prop(this, 'elements')
                  return t ? m.makeArray(t) : this
                })
                  .filter(function() {
                    var t = this.type
                    return (
                      this.name &&
                      !m(this).is(':disabled') &&
                      Ze.test(this.nodeName) &&
                      !Je.test(t) &&
                      (this.checked || !et.test(t))
                    )
                  })
                  .map(function(t, e) {
                    var n = m(this).val()
                    return null == n
                      ? null
                      : m.isArray(n)
                      ? m.map(n, function(t) {
                          return { name: e.name, value: t.replace(Ke, '\r\n') }
                        })
                      : { name: e.name, value: n.replace(Ke, '\r\n') }
                  })
                  .get()
              }
            }),
            (m.ajaxSettings.xhr =
              void 0 !== n.ActiveXObject
                ? function() {
                    return this.isLocal
                      ? sn()
                      : s.documentMode > 8
                      ? on()
                      : (/^(get|post|head|put|delete|options)$/i.test(
                          this.type
                        ) &&
                          on()) ||
                        sn()
                  }
                : on)
          var en = 0,
            nn = {},
            rn = m.ajaxSettings.xhr()
          function on() {
            try {
              return new n.XMLHttpRequest()
            } catch (t) {}
          }
          function sn() {
            try {
              return new n.ActiveXObject('Microsoft.XMLHTTP')
            } catch (t) {}
          }
          n.attachEvent &&
            n.attachEvent('onunload', function() {
              for (var t in nn) nn[t](void 0, !0)
            }),
            (p.cors = !!rn && 'withCredentials' in rn),
            (rn = p.ajax = !!rn) &&
              m.ajaxTransport(function(t) {
                var e
                if (!t.crossDomain || p.cors)
                  return {
                    send: function(i, r) {
                      var o,
                        s = t.xhr(),
                        a = ++en
                      if (
                        (s.open(t.type, t.url, t.async, t.username, t.password),
                        t.xhrFields)
                      )
                        for (o in t.xhrFields) s[o] = t.xhrFields[o]
                      for (o in (t.mimeType &&
                        s.overrideMimeType &&
                        s.overrideMimeType(t.mimeType),
                      t.crossDomain ||
                        i['X-Requested-With'] ||
                        (i['X-Requested-With'] = 'XMLHttpRequest'),
                      i))
                        void 0 !== i[o] && s.setRequestHeader(o, i[o] + '')
                      s.send((t.hasContent && t.data) || null),
                        (e = function(n, i) {
                          var o, l, c
                          if (e && (i || 4 === s.readyState))
                            if (
                              (delete nn[a],
                              (e = void 0),
                              (s.onreadystatechange = m.noop),
                              i)
                            )
                              4 !== s.readyState && s.abort()
                            else {
                              ;(c = {}),
                                (o = s.status),
                                'string' == typeof s.responseText &&
                                  (c.text = s.responseText)
                              try {
                                l = s.statusText
                              } catch (t) {
                                l = ''
                              }
                              o || !t.isLocal || t.crossDomain
                                ? 1223 === o && (o = 204)
                                : (o = c.text ? 200 : 404)
                            }
                          c && r(o, l, c, s.getAllResponseHeaders())
                        }),
                        t.async
                          ? 4 === s.readyState
                            ? n.setTimeout(e)
                            : (s.onreadystatechange = nn[a] = e)
                          : e()
                    },
                    abort: function() {
                      e && e(void 0, !0)
                    }
                  }
              }),
            m.ajaxSetup({
              accepts: {
                script:
                  'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
              },
              contents: { script: /\b(?:java|ecma)script\b/ },
              converters: {
                'text script': function(t) {
                  return m.globalEval(t), t
                }
              }
            }),
            m.ajaxPrefilter('script', function(t) {
              void 0 === t.cache && (t.cache = !1),
                t.crossDomain && ((t.type = 'GET'), (t.global = !1))
            }),
            m.ajaxTransport('script', function(t) {
              if (t.crossDomain) {
                var e,
                  n = s.head || m('head')[0] || s.documentElement
                return {
                  send: function(i, r) {
                    ;((e = s.createElement('script')).async = !0),
                      t.scriptCharset && (e.charset = t.scriptCharset),
                      (e.src = t.url),
                      (e.onload = e.onreadystatechange = function(t, n) {
                        ;(n ||
                          !e.readyState ||
                          /loaded|complete/.test(e.readyState)) &&
                          ((e.onload = e.onreadystatechange = null),
                          e.parentNode && e.parentNode.removeChild(e),
                          (e = null),
                          n || r(200, 'success'))
                      }),
                      n.insertBefore(e, n.firstChild)
                  },
                  abort: function() {
                    e && e.onload(void 0, !0)
                  }
                }
              }
            })
          var an = [],
            ln = /(=)\?(?=&|$)|\?\?/
          m.ajaxSetup({
            jsonp: 'callback',
            jsonpCallback: function() {
              var t = an.pop() || m.expando + '_' + Ae++
              return (this[t] = !0), t
            }
          }),
            m.ajaxPrefilter('json jsonp', function(t, e, i) {
              var r,
                o,
                s,
                a =
                  !1 !== t.jsonp &&
                  (ln.test(t.url)
                    ? 'url'
                    : 'string' == typeof t.data &&
                      0 ===
                        (t.contentType || '').indexOf(
                          'application/x-www-form-urlencoded'
                        ) &&
                      ln.test(t.data) &&
                      'data')
              if (a || 'jsonp' === t.dataTypes[0])
                return (
                  (r = t.jsonpCallback = m.isFunction(t.jsonpCallback)
                    ? t.jsonpCallback()
                    : t.jsonpCallback),
                  a
                    ? (t[a] = t[a].replace(ln, '$1' + r))
                    : !1 !== t.jsonp &&
                      (t.url +=
                        (Le.test(t.url) ? '&' : '?') + t.jsonp + '=' + r),
                  (t.converters['script json'] = function() {
                    return s || m.error(r + ' was not called'), s[0]
                  }),
                  (t.dataTypes[0] = 'json'),
                  (o = n[r]),
                  (n[r] = function() {
                    s = arguments
                  }),
                  i.always(function() {
                    void 0 === o ? m(n).removeProp(r) : (n[r] = o),
                      t[r] && ((t.jsonpCallback = e.jsonpCallback), an.push(r)),
                      s && m.isFunction(o) && o(s[0]),
                      (s = o = void 0)
                  }),
                  'script'
                )
            }),
            (m.parseHTML = function(t, e, n) {
              if (!t || 'string' != typeof t) return null
              'boolean' == typeof e && ((n = e), (e = !1)), (e = e || s)
              var i = C.exec(t),
                r = !n && []
              return i
                ? [e.createElement(i[1])]
                : ((i = ht([t], e, r)),
                  r && r.length && m(r).remove(),
                  m.merge([], i.childNodes))
            })
          var cn = m.fn.load
          function un(t) {
            return m.isWindow(t)
              ? t
              : 9 === t.nodeType && (t.defaultView || t.parentWindow)
          }
          ;(m.fn.load = function(t, e, n) {
            if ('string' != typeof t && cn) return cn.apply(this, arguments)
            var i,
              r,
              o,
              s = this,
              a = t.indexOf(' ')
            return (
              a > -1 &&
                ((i = m.trim(t.slice(a, t.length))), (t = t.slice(0, a))),
              m.isFunction(e)
                ? ((n = e), (e = void 0))
                : e && 'object' == typeof e && (r = 'POST'),
              s.length > 0 &&
                m
                  .ajax({ url: t, type: r || 'GET', dataType: 'html', data: e })
                  .done(function(t) {
                    ;(o = arguments),
                      s.html(
                        i
                          ? m('<div>')
                              .append(m.parseHTML(t))
                              .find(i)
                          : t
                      )
                  })
                  .always(
                    n &&
                      function(t, e) {
                        s.each(function() {
                          n.apply(this, o || [t.responseText, e, t])
                        })
                      }
                  ),
              this
            )
          }),
            m.each(
              [
                'ajaxStart',
                'ajaxStop',
                'ajaxComplete',
                'ajaxError',
                'ajaxSuccess',
                'ajaxSend'
              ],
              function(t, e) {
                m.fn[e] = function(t) {
                  return this.on(e, t)
                }
              }
            ),
            (m.expr.filters.animated = function(t) {
              return m.grep(m.timers, function(e) {
                return t === e.elem
              }).length
            }),
            (m.offset = {
              setOffset: function(t, e, n) {
                var i,
                  r,
                  o,
                  s,
                  a,
                  l,
                  c = m.css(t, 'position'),
                  u = m(t),
                  f = {}
                'static' === c && (t.style.position = 'relative'),
                  (a = u.offset()),
                  (o = m.css(t, 'top')),
                  (l = m.css(t, 'left')),
                  ('absolute' === c || 'fixed' === c) &&
                  m.inArray('auto', [o, l]) > -1
                    ? ((s = (i = u.position()).top), (r = i.left))
                    : ((s = parseFloat(o) || 0), (r = parseFloat(l) || 0)),
                  m.isFunction(e) && (e = e.call(t, n, m.extend({}, a))),
                  null != e.top && (f.top = e.top - a.top + s),
                  null != e.left && (f.left = e.left - a.left + r),
                  'using' in e ? e.using.call(t, f) : u.css(f)
              }
            }),
            m.fn.extend({
              offset: function(t) {
                if (arguments.length)
                  return void 0 === t
                    ? this
                    : this.each(function(e) {
                        m.offset.setOffset(this, t, e)
                      })
                var e,
                  n,
                  i = { top: 0, left: 0 },
                  r = this[0],
                  o = r && r.ownerDocument
                return o
                  ? ((e = o.documentElement),
                    m.contains(e, r)
                      ? (void 0 !== r.getBoundingClientRect &&
                          (i = r.getBoundingClientRect()),
                        (n = un(o)),
                        {
                          top:
                            i.top +
                            (n.pageYOffset || e.scrollTop) -
                            (e.clientTop || 0),
                          left:
                            i.left +
                            (n.pageXOffset || e.scrollLeft) -
                            (e.clientLeft || 0)
                        })
                      : i)
                  : void 0
              },
              position: function() {
                if (this[0]) {
                  var t,
                    e,
                    n = { top: 0, left: 0 },
                    i = this[0]
                  return (
                    'fixed' === m.css(i, 'position')
                      ? (e = i.getBoundingClientRect())
                      : ((t = this.offsetParent()),
                        (e = this.offset()),
                        m.nodeName(t[0], 'html') || (n = t.offset()),
                        (n.top += m.css(t[0], 'borderTopWidth', !0)),
                        (n.left += m.css(t[0], 'borderLeftWidth', !0))),
                    {
                      top: e.top - n.top - m.css(i, 'marginTop', !0),
                      left: e.left - n.left - m.css(i, 'marginLeft', !0)
                    }
                  )
                }
              },
              offsetParent: function() {
                return this.map(function() {
                  for (
                    var t = this.offsetParent;
                    t &&
                    !m.nodeName(t, 'html') &&
                    'static' === m.css(t, 'position');

                  )
                    t = t.offsetParent
                  return t || Wt
                })
              }
            }),
            m.each(
              { scrollLeft: 'pageXOffset', scrollTop: 'pageYOffset' },
              function(t, e) {
                var n = /Y/.test(e)
                m.fn[t] = function(i) {
                  return tt(
                    this,
                    function(t, i, r) {
                      var o = un(t)
                      if (void 0 === r)
                        return o
                          ? e in o
                            ? o[e]
                            : o.document.documentElement[i]
                          : t[i]
                      o
                        ? o.scrollTo(
                            n ? m(o).scrollLeft() : r,
                            n ? r : m(o).scrollTop()
                          )
                        : (t[i] = r)
                    },
                    t,
                    i,
                    arguments.length,
                    null
                  )
                }
              }
            ),
            m.each(['top', 'left'], function(t, e) {
              m.cssHooks[e] = Yt(p.pixelPosition, function(t, n) {
                if (n)
                  return (
                    (n = Ut(t, e)), Pt.test(n) ? m(t).position()[e] + 'px' : n
                  )
              })
            }),
            m.each({ Height: 'height', Width: 'width' }, function(t, e) {
              m.each(
                { padding: 'inner' + t, content: e, '': 'outer' + t },
                function(n, i) {
                  m.fn[i] = function(i, r) {
                    var o = arguments.length && (n || 'boolean' != typeof i),
                      s = n || (!0 === i || !0 === r ? 'margin' : 'border')
                    return tt(
                      this,
                      function(e, n, i) {
                        var r
                        return m.isWindow(e)
                          ? e.document.documentElement['client' + t]
                          : 9 === e.nodeType
                          ? ((r = e.documentElement),
                            Math.max(
                              e.body['scroll' + t],
                              r['scroll' + t],
                              e.body['offset' + t],
                              r['offset' + t],
                              r['client' + t]
                            ))
                          : void 0 === i
                          ? m.css(e, n, s)
                          : m.style(e, n, i, s)
                      },
                      e,
                      o ? i : void 0,
                      o,
                      null
                    )
                  }
                }
              )
            }),
            m.fn.extend({
              bind: function(t, e, n) {
                return this.on(t, null, e, n)
              },
              unbind: function(t, e) {
                return this.off(t, null, e)
              },
              delegate: function(t, e, n, i) {
                return this.on(e, t, n, i)
              },
              undelegate: function(t, e, n) {
                return 1 === arguments.length
                  ? this.off(t, '**')
                  : this.off(e, t || '**', n)
              }
            }),
            (m.fn.size = function() {
              return this.length
            }),
            (m.fn.andSelf = m.fn.addBack),
            void 0 ===
              (i = function() {
                return m
              }.apply(e, [])) || (t.exports = i)
          var fn = n.jQuery,
            dn = n.$
          return (
            (m.noConflict = function(t) {
              return (
                n.$ === m && (n.$ = dn),
                t && n.jQuery === m && (n.jQuery = fn),
                m
              )
            }),
            r || (n.jQuery = n.$ = m),
            m
          )
        }),
        'object' == typeof t.exports
          ? (t.exports = r.document
              ? o(r, !0)
              : function(t) {
                  if (!t.document)
                    throw new Error('jQuery requires a window with a document')
                  return o(t)
                })
          : o(r)
    },
    function(t, e, n) {
      'use strict'
      t.exports = function(t) {
        var e = []
        return (
          (e.toString = function() {
            return this.map(function(e) {
              var n = (function(t, e) {
                var n = t[1] || '',
                  i = t[3]
                if (!i) return n
                if (e && 'function' == typeof btoa) {
                  var r = ((s = i),
                    (a = btoa(unescape(encodeURIComponent(JSON.stringify(s))))),
                    (l = 'sourceMappingURL=data:application/json;charset=utf-8;base64,'.concat(
                      a
                    )),
                    '/*# '.concat(l, ' */')),
                    o = i.sources.map(function(t) {
                      return '/*# sourceURL='
                        .concat(i.sourceRoot)
                        .concat(t, ' */')
                    })
                  return [n]
                    .concat(o)
                    .concat([r])
                    .join('\n')
                }
                var s, a, l
                return [n].join('\n')
              })(e, t)
              return e[2] ? '@media '.concat(e[2], '{').concat(n, '}') : n
            }).join('')
          }),
          (e.i = function(t, n) {
            'string' == typeof t && (t = [[null, t, '']])
            for (var i = {}, r = 0; r < this.length; r++) {
              var o = this[r][0]
              null != o && (i[o] = !0)
            }
            for (var s = 0; s < t.length; s++) {
              var a = t[s]
              ;(null != a[0] && i[a[0]]) ||
                (n && !a[2]
                  ? (a[2] = n)
                  : n && (a[2] = '('.concat(a[2], ') and (').concat(n, ')')),
                e.push(a))
            }
          }),
          e
        )
      }
    },
    function(t, e, n) {
      'use strict'
      n.r(e)
      var i = n(1),
        r = n.n(i),
        o = n(0),
        s = n.n(o),
        a = n(5)
      a.getInterface(2)
      function l(t) {
        return (l =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function(t) {
                return typeof t
              }
            : function(t) {
                return t &&
                  'function' == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? 'symbol'
                  : typeof t
              })(t)
      }
      function c(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
              })
            : (t[e] = n),
          t
        )
      }
      function u(t, e) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n]
          ;(i.enumerable = i.enumerable || !1),
            (i.configurable = !0),
            'value' in i && (i.writable = !0),
            Object.defineProperty(t, i.key, i)
        }
      }
      function f(t, e) {
        return !e || ('object' !== l(e) && 'function' != typeof e)
          ? (function(t) {
              if (void 0 === t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                )
              return t
            })(t)
          : e
      }
      function d(t) {
        return (d = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function(t) {
              return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
      }
      function h(t, e) {
        return (h =
          Object.setPrototypeOf ||
          function(t, e) {
            return (t.__proto__ = e), t
          })(t, e)
      }
      var p = (function(t) {
        function e(t) {
          var n
          return (
            (function(t, e) {
              if (!(t instanceof e))
                throw new TypeError('Cannot call a class as a function')
            })(this, e),
            ((n = f(this, d(e).call(this, t))).element = null),
            (n.mathField = null),
            (n.ignoreEditEvents = 4),
            n
          )
        }
        var n, i, o
        return (
          (function(t, e) {
            if ('function' != typeof e && null !== e)
              throw new TypeError(
                'Super expression must either be null or a function'
              )
            ;(t.prototype = Object.create(e && e.prototype, {
              constructor: { value: t, writable: !0, configurable: !0 }
            })),
              e && h(t, e)
          })(e, r.a.Component),
          (n = e),
          (i = [
            {
              key: 'componentDidMount',
              value: function() {
                var t = this,
                  e = { restrictMismatchedBrackets: !0, handlers: {} }
                this.props.config &&
                  (e = (function(t) {
                    for (var e = 1; e < arguments.length; e++) {
                      var n = null != arguments[e] ? arguments[e] : {},
                        i = Object.keys(n)
                      'function' == typeof Object.getOwnPropertySymbols &&
                        (i = i.concat(
                          Object.getOwnPropertySymbols(n).filter(function(t) {
                            return Object.getOwnPropertyDescriptor(
                              n,
                              t
                            ).enumerable
                          })
                        )),
                        i.forEach(function(e) {
                          c(t, e, n[e])
                        })
                    }
                    return t
                  })({ config: e }, this.props.config)),
                  (e.handlers.edit = function(e) {
                    t.ignoreEditEvents > 0
                      ? (t.ignoreEditEvents -= 1)
                      : t.props.onChange && t.props.onChange(e)
                  }),
                  (this.mathField = a.MathField(this.element, e)),
                  this.mathField.latex(this.props.latex || ''),
                  this.props.className &&
                    this.element.classList.add(this.props.className),
                  this.props.mathquillDidMount &&
                    this.props.mathquillDidMount(this.mathField)
              }
            },
            {
              key: 'render',
              value: function() {
                var t = this
                return r.a.createElement('div', {
                  ref: function(e) {
                    t.element = e
                  }
                })
              }
            }
          ]) && u(n.prototype, i),
          o && u(n, o),
          e
        )
      })()
      p.propTypes = {
        latex: s.a.string,
        onChange: s.a.func,
        config: s.a.object,
        mathquillDidMount: s.a.func
      }
      var m = p,
        g = n(2),
        v = n.n(g)
      function y() {
        if (null == document.getElementById('react-mathquill-styles')) {
          var t = document.createElement('style')
          t.setAttribute('id', 'react-mathquill-styles'),
            (t.innerHTML = v.a[0][1]),
            document.getElementsByTagName('head')[0].appendChild(t)
        }
      }
      n.d(e, 'addStyles', function() {
        return y
      })
      e.default = m
    }
  ])
})
