/*!
 * VERSION: 0.2.0
 * DATE: 2018-08-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2018, GreenSock. All rights reserved.
 * DrawSVGPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit https://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        var e, t = _gsScope.document,
            p = t.defaultView ? t.defaultView.getComputedStyle : function() {},
            l = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
            _ = -1 !== ((_gsScope.navigator || {}).userAgent || "").indexOf("Edge"),
            g = {
                rect: ["width", "height"],
                circle: ["r", "r"],
                ellipse: ["rx", "ry"],
                line: ["x2", "y2"]
            },
            C = "DrawSVGPlugin";

        function u(e, t, r, i, o, s) {
            return r = (parseFloat(r || 0) - parseFloat(e || 0)) * o, i = (parseFloat(i || 0) - parseFloat(t || 0)) * s, Math.sqrt(r * r + i * i)
        }

        function c(e) {
            return "string" != typeof e && e.nodeType || (e = _gsScope.TweenLite.selector(e)).length && (e = e[0]), e
        }

        function y(e) {
            if (!e) return 0;
            var t, r, i, o, s, n, a, h = (e = c(e)).tagName.toLowerCase(),
                f = 1,
                d = 1;
            "non-scaling-stroke" === e.getAttribute("vector-effect") && (d = e.getScreenCTM(), f = Math.sqrt(d.a * d.a + d.b * d.b), d = Math.sqrt(d.d * d.d + d.c * d.c));
            try {
                r = e.getBBox()
            } catch (e) {
                console.log("Error: Some browsers like Firefox won't report measurements of invisible elements (like display:none or masks inside defs).")
            }
            if (r && (r.width || r.height) || !g[h] || (r = {
                    width: parseFloat(e.getAttribute(g[h][0])),
                    height: parseFloat(e.getAttribute(g[h][1]))
                }, "rect" !== h && "line" !== h && (r.width *= 2, r.height *= 2), "line" === h && (r.x = parseFloat(e.getAttribute("x1")), r.y = parseFloat(e.getAttribute("y1")), r.width = Math.abs(r.width - r.x), r.height = Math.abs(r.height - r.y))), "path" === h) o = e.style.strokeDasharray, e.style.strokeDasharray = "none", t = e.getTotalLength() || 0, f !== d && console.log("Warning: <path> length cannot be measured accurately when vector-effect is non-scaling-stroke and the element isn't proportionally scaled."), t *= (f + d) / 2, e.style.strokeDasharray = o;
            else if ("rect" === h) t = 2 * r.width * f + 2 * r.height * d;
            else if ("line" === h) t = u(r.x, r.y, r.x + r.width, r.y + r.height, f, d);
            else if ("polyline" === h || "polygon" === h)
                for (i = e.getAttribute("points").match(l) || [], "polygon" === h && i.push(i[0], i[1]), t = 0, s = 2; s < i.length; s += 2) t += u(i[s - 2], i[s - 1], i[s], i[s + 1], f, d) || 0;
            else "circle" !== h && "ellipse" !== h || (n = r.width / 2 * f, a = r.height / 2 * d, t = Math.PI * (3 * (n + a) - Math.sqrt((3 * n + a) * (n + 3 * a))));
            return t || 0
        }

        function x(e, t) {
            if (!e) return [0, 0];
            e = c(e), t = t || y(e) + 1;
            var r = p(e),
                i = r.strokeDasharray || "",
                o = parseFloat(r.strokeDashoffset),
                s = i.indexOf(",");
            return s < 0 && (s = i.indexOf(" ")), t < (i = s < 0 ? t : parseFloat(i.substr(0, s)) || 1e-5) && (i = t), [Math.max(0, -o), Math.max(0, i - o)]
        }(e = _gsScope._gsDefine.plugin({
            propName: "drawSVG",
            API: 2,
            version: "0.2.0",
            global: !0,
            overwriteProps: ["drawSVG"],
            init: function(e, t, r, i) {
                if (!e.getBBox) return !1;
                var o, s, n, a, h, f, d, l, g, u, c = y(e) + 1;
                return this._style = e.style, this._target = e, "function" == typeof t && (t = t(i, e)), !0 === t || "true" === t ? t = "0 100%" : t ? -1 === (t + "").indexOf(" ") && (t = "0 " + t) : t = "0 0", o = x(e, c), h = t, f = c, d = o[0], -1 === (u = h.indexOf(" ")) ? (l = void 0 !== d ? d + "" : h, g = h) : (l = h.substr(0, u), g = h.substr(u + 1)), l = -1 !== l.indexOf("%") ? parseFloat(l) / 100 * f : parseFloat(l), s = (g = -1 !== g.indexOf("%") ? parseFloat(g) / 100 * f : parseFloat(g)) < l ? [g, l] : [l, g], this._length = c + 10, 0 === o[0] && 0 === s[0] ? (n = Math.max(1e-5, s[1] - c), this._dash = c + n, this._offset = c - o[1] + n, this._offsetPT = this._addTween(this, "_offset", this._offset, c - s[1] + n, "drawSVG")) : (this._dash = o[1] - o[0] || 1e-6, this._offset = -o[0], this._dashPT = this._addTween(this, "_dash", this._dash, s[1] - s[0] || 1e-5, "drawSVG"), this._offsetPT = this._addTween(this, "_offset", this._offset, -s[0], "drawSVG")), _ && (a = p(e)).strokeLinecap !== a.strokeLinejoin && (s = parseFloat(a.strokeMiterlimit), this._addTween(e.style, "strokeMiterlimit", s, s + 1e-4, "strokeMiterlimit")), this._live = "non-scaling-stroke" === e.getAttribute("vector-effect") || -1 !== (t + "").indexOf("live"), !0
            },
            set: function(e) {
                if (this._firstPT) {
                    if (this._live) {
                        var t, r = y(this._target) + 11;
                        r !== this._length && (t = r / this._length, this._length = r, this._offsetPT.s *= t, this._offsetPT.c *= t, this._dashPT ? (this._dashPT.s *= t, this._dashPT.c *= t) : this._dash *= t)
                    }
                    this._super.setRatio.call(this, e), this._style.strokeDashoffset = this._offset, this._style.strokeDasharray = 1 === e || 0 === e ? this._offset < .001 && this._length - this._dash <= 10 ? "none" : this._offset === this._dash ? "0px, 999999px" : this._dash + "px," + this._length + "px" : this._dash + "px," + this._length + "px"
                }
            }
        })).getLength = y, e.getPosition = x
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function(e) {
        "use strict";
        var t = function() {
            return (_gsScope.GreenSockGlobals || _gsScope).DrawSVGPlugin
        };
        "undefined" != typeof module && module.exports ? (require("TweenLite"), module.exports = t()) : "function" == typeof define && define.amd && define(["TweenLite"], t)
    }();