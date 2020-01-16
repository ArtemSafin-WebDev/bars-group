/*! modernizr 3.8.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-csspointerevents-hiddenscroll-lowbandwidth-objectfit-requestanimationframe-touchevents-video-setclasses !*/
!function(e,t,n){function r(e,t){return typeof e===t}function o(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):T?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function i(){var e=t.body;return e||(e=o(T?"svg":"body"),e.fake=!0),e}function a(e,n,r,a){var s,l,u,c,f="modernizr",d=o("div"),p=i();if(parseInt(r,10))for(;r--;)u=o("div"),u.id=a?a[r]:f+(r+1),d.appendChild(u);return s=o("style"),s.type="text/css",s.id="s"+f,(p.fake?p:d).appendChild(s),p.appendChild(d),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(t.createTextNode(e)),d.id=f,p.fake&&(p.style.background="",p.style.overflow="hidden",c=C.style.overflow,C.style.overflow="hidden",C.appendChild(p)),l=n(d,e),p.fake?(p.parentNode.removeChild(p),C.style.overflow=c,C.offsetHeight):d.parentNode.removeChild(d),!!l}function s(e,t){return!!~(""+e).indexOf(t)}function l(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function u(t,n,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,t,n);var i=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){var a=i.error?"error":"log";i[a].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!n&&t.currentStyle&&t.currentStyle[r];return o}function c(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(l(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+l(t[o])+":"+r+")");return i=i.join(" or "),a("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"===u(e,null,"position")})}return n}function f(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function d(e,t,i,a){function l(){d&&(delete E.style,delete E.modElem)}if(a=!r(a,"undefined")&&a,!r(i,"undefined")){var u=c(e,i);if(!r(u,"undefined"))return u}for(var d,p,v,m,y,h=["modernizr","tspan","samp"];!E.style&&h.length;)d=!0,E.modElem=o(h.shift()),E.style=E.modElem.style;for(v=e.length,p=0;p<v;p++)if(m=e[p],y=E.style[m],s(m,"-")&&(m=f(m)),E.style[m]!==n){if(a||r(i,"undefined"))return l(),"pfx"!==t||m;try{E.style[m]=i}catch(e){}if(E.style[m]!==y)return l(),"pfx"!==t||m}return l(),!1}function p(e,t){return function(){return e.apply(t,arguments)}}function v(e,t,n){var o;for(var i in e)if(e[i]in t)return!1===n?e[i]:(o=t[e[i]],r(o,"function")?p(o,n||t):o);return!1}function m(e,t,n,o,i){var a=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+_.join(a+" ")+a).split(" ");return r(t,"string")||r(t,"undefined")?d(s,t,o,i):(s=(e+" "+z.join(a+" ")+a).split(" "),v(s,t,n))}var y=[],h={_version:"3.8.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){y.push({name:e,fn:t,options:n})},addAsyncTest:function(e){y.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=h,Modernizr=new Modernizr;var g=[],C=t.documentElement,T="svg"===C.nodeName.toLowerCase(),w=h._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];h._prefixes=w;var S=function(){var t=e.matchMedia||e.msMatchMedia;return t?function(e){var n=t(e);return n&&n.matches||!1}:function(t){var n=!1;return a("@media "+t+" { #modernizr { position: absolute; } }",function(t){n="absolute"===(e.getComputedStyle?e.getComputedStyle(t,null):t.currentStyle).position}),n}}();h.mq=S,Modernizr.addTest("touchevents",function(){if("ontouchstart"in e||e.TouchEvent||e.DocumentTouch&&t instanceof DocumentTouch)return!0;var n=["(",w.join("touch-enabled),("),"heartz",")"].join("");return S(n)}),function(){var e=o("video");Modernizr.addTest("video",function(){var t=!1;try{t=!!e.canPlayType,t&&(t=new Boolean(t))}catch(e){}return t});try{e.canPlayType&&(Modernizr.addTest("video.ogg",e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,"")),Modernizr.addTest("video.h264",e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,"")),Modernizr.addTest("video.webm",e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")),Modernizr.addTest("video.vp9",e.canPlayType('video/webm; codecs="vp9"').replace(/^no$/,"")),Modernizr.addTest("video.hls",e.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/,"")))}catch(e){}}(),Modernizr.addTest("lowbandwidth",function(){var e=navigator.connection||{type:0};return 3===e.type||4===e.type||/^[23]g$/.test(e.type)}),Modernizr.addTest("csspointerevents",function(){var e=o("a").style;return e.cssText="pointer-events:auto","auto"===e.pointerEvents});var b=h.testStyles=a;Modernizr.addTest("hiddenscroll",function(){return b("#modernizr {width:100px;height:100px;overflow:scroll}",function(e){return e.offsetWidth===e.clientWidth})});var x="Moz O ms Webkit",_=h._config.usePrefixes?x.split(" "):[];h._cssomPrefixes=_;var P={elem:o("modernizr")};Modernizr._q.push(function(){delete P.elem});var E={style:P.elem.style};Modernizr._q.unshift(function(){delete E.style});var z=h._config.usePrefixes?x.toLowerCase().split(" "):[];h._domPrefixes=z,h.testAllProps=m;var j=function(t){var r,o=w.length,i=e.CSSRule;if(void 0===i)return n;if(!t)return!1;if(t=t.replace(/^@/,""),(r=t.replace(/-/g,"_").toUpperCase()+"_RULE")in i)return"@"+t;for(var a=0;a<o;a++){var s=w[a];if(s.toUpperCase()+"_"+r in i)return"@-"+s.toLowerCase()+"-"+t}return!1};h.atRule=j;var N=h.prefixed=function(e,t,n){return 0===e.indexOf("@")?j(e):(-1!==e.indexOf("-")&&(e=f(e)),t?m(e,t,n):m(e,"pfx"))};Modernizr.addTest("objectfit",!!N("objectFit"),{aliases:["object-fit"]}),Modernizr.addTest("requestanimationframe",!!N("requestAnimationFrame",e),{aliases:["raf"]}),function(){var e,t,n,o,i,a,s;for(var l in y)if(y.hasOwnProperty(l)){if(e=[],t=y[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)a=e[i],s=a.split("."),1===s.length?Modernizr[s[0]]=o:(Modernizr[s[0]]&&(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean)||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=o),g.push((o?"":"no-")+s.join("-"))}}(),function(e){var t=C.className,n=Modernizr._config.classPrefix||"";if(T&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(e.length>0&&(t+=" "+n+e.join(" "+n)),T?C.className.baseVal=t:C.className=t)}(g),delete h.addTest,delete h.addAsyncTest;for(var $=0;$<Modernizr._q.length;$++)Modernizr._q[$]();e.Modernizr=Modernizr}(window,document);