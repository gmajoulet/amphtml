(self.AMP=self.AMP||[]).push({n:"amp-geo",v:"1908231648370",f:(function(AMP,_){
var m="function"==typeof Object.create?Object.create:function(a){function b(){}b.prototype=a;return new b},p;if("function"==typeof Object.setPrototypeOf)p=Object.setPrototypeOf;else{var q;a:{var r={a:!0},t={};try{t.__proto__=r;q=t.a;break a}catch(a){}q=!1}p=q?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}var u=p;function v(){var a,b;this.promise=new Promise(function(c,d){a=c;b=d});this.resolve=a;this.reject=b};function w(a,b){b=void 0===b?"":b;try{return decodeURIComponent(a)}catch(c){return b}};var x=/(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;function y(a){var b=Object.create(null);if(!a)return b;for(var c;c=x.exec(a);){var d=w(c[1],c[1]),g=c[2]?w(c[2],c[2]):"";b[d]=g}return b};var z="";
function A(a){var b=a||self;if(b.__AMP_MODE)var c=b.__AMP_MODE;else{c=b;var d=self.AMP_CONFIG||{},g=!!d.test||!1,e=c.__karma__&&c.__karma__.config.amp.testOnIe,h=y(c.location.originalHash||c.location.hash);d=d.spt;var l=y(c.location.search);z||(z=c.AMP_CONFIG&&c.AMP_CONFIG.v?c.AMP_CONFIG.v:"011908231648370");c={localDev:!1,development:!(!["1","actions","amp","amp4ads","amp4email"].includes(h.development)&&!c.AMP_DEV_MODE),examiner:"2"==h.development,filter:h.filter,geoOverride:h["amp-geo"],userLocationOverride:h["amp-user-location"],
minified:!0,lite:void 0!=l.amp_lite,test:g,testIe:e,log:h.log,version:"1908231648370",rtvVersion:z,singlePassType:d};c=b.__AMP_MODE=c}return c};var B=Object.prototype.toString;self.log=self.log||{user:null,dev:null,userForEmbed:null};var C=self.log;function D(){if(C.dev)return C.dev;throw Error("failed to call initLogConstructor");};(function(a){return a||{}})({c:!0,v:!0,a:!0,ad:!0,action:!0});function E(a){var b="";try{"localStorage"in a&&(b=a.localStorage.getItem("amp-experiment-toggles"))}catch(g){D().warn("EXPERIMENTS","Failed to retrieve experiments from localStorage.")}var c=b?b.split(/\s*,\s*/g):[];a=Object.create(null);for(var d=0;d<c.length;d++)0!=c[d].length&&("-"==c[d][0]?a[c[d].substr(1)]=!1:a[c[d]]=!0);return a};function F(a){if(a.nodeType){var b=(a.ownerDocument||a).defaultView;b=b.__AMP_TOP||(b.__AMP_TOP=b);a=G(b,"ampdoc").getAmpDoc(a)}return a}function G(a,b){H(a,b);var c=a.services;c||(c=a.services={});var d=c;a=d[b];a.obj||(a.obj=new a.ctor(a.context),a.ctor=null,a.context=null,a.resolve&&a.resolve(a.obj));return a.obj}function H(a,b){a=a.services&&a.services[b];return!(!a||!a.ctor&&!a.obj)};/*
 https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
function I(a){return"SCRIPT"==a.tagName&&a.hasAttribute("type")&&"APPLICATION/JSON"==a.getAttribute("type").toUpperCase()};var J={"preset-eea":"AT BE BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LV LI LT LU MT NL NO PL PT RO SK SI ES SE GB AX IC EA GF PF TF GI GP GG JE MQ YT NC RE BL MF PM SJ VA WF EZ CH".split(" ")};function K(a,b){try{return JSON.parse(a)}catch(c){return b&&b(c),null}};var L=/amp-iso-country-(\w+)/;function M(a){a=AMP.BaseElement.call(this,a)||this;a.m=0;a.o=!1;a.h="unknown";a.j=[];a.l=[];return a}var N=AMP.BaseElement;M.prototype=m(N.prototype);M.prototype.constructor=M;if(u)u(M,N);else for(var O in N)if("prototype"!=O)if(Object.defineProperties){var P=Object.getOwnPropertyDescriptor(N,O);P&&Object.defineProperty(M,O,P)}else M[O]=N[O];M.w=N.prototype;M.prototype.prerenderAllowed=function(){return!0};
M.prototype.buildCallback=function(){var a=this.element.children;a.length&&Q(1===a.length&&I(a[0]),'amp-geo can only have one <script type="application/json"> child');a=a.length?K(a[0].textContent,function(){return Q(!1,"amp-geo Unable to parse JSON")}):{};var b=R(this,a||{});S.resolve(b)};function Q(a,b){if(!a){S.resolve(null);if(!C.user)throw Error("failed to call initLogConstructor");return C.user.assert(a,b,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0)}return a}
function T(a,b){var c=b.getBody().className.match(L),d=/^(\w{2})?\s*/.exec("us                          ");if(b=A(a.win).geoOverride)b=a.win,b=!(!b.AMP_CONFIG||!b.AMP_CONFIG.canary);if(b&&/^\w+$/.test(A(a.win).geoOverride))a.m=2,a.h=A(a.win).geoOverride.toLowerCase();else{if(b=c){b=a.element;var g=b.ownerDocument.defaultView,e=g.__AMP_TOP||(g.__AMP_TOP=g),h=g!=e;if(e.__AMP__EXPERIMENT_TOGGLES)var l=e.__AMP__EXPERIMENT_TOGGLES;else{e.__AMP__EXPERIMENT_TOGGLES=Object.create(null);l=e.__AMP__EXPERIMENT_TOGGLES;
if(e.AMP_CONFIG)for(var k in e.AMP_CONFIG){var f=e.AMP_CONFIG[k];"number"===typeof f&&0<=f&&1>=f&&(l[k]=Math.random()<f)}if(e.AMP_CONFIG&&Array.isArray(e.AMP_CONFIG["allow-doc-opt-in"])&&0<e.AMP_CONFIG["allow-doc-opt-in"].length&&(k=e.AMP_CONFIG["allow-doc-opt-in"],f=e.document.head.querySelector('meta[name="amp-experiments-opt-in"]'))){f=f.getAttribute("content").split(",");for(var n=0;n<f.length;n++)-1!=k.indexOf(f[n])&&(l[f[n]]=!0)}Object.assign(l,E(e));if(e.AMP_CONFIG&&Array.isArray(e.AMP_CONFIG["allow-url-opt-in"])&&
0<e.AMP_CONFIG["allow-url-opt-in"].length)for(k=e.AMP_CONFIG["allow-url-opt-in"],e=y(e.location.originalHash||e.location.hash),f=0;f<k.length;f++)n=e["e-"+k[f]],"1"==n&&(l[k[f]]=!0),"0"==n&&(l[k[f]]=!1)}l=!!l["ampdoc-fie"];h&&!l?b=H(g,"url")?G(g,"url"):null:(b=F(b),b=F(b),b=b.isSingleDoc()?b.win:b,b=H(b,"url")?G(b,"url"):null);b=!b.isProxyOrigin(a.win.location)}b?(a.m=1,a.h=c[1]):d[1]?(a.m=0,a.h=d[1]):""===d[0]&&(a.o=!0,D().error("amp-geo","GEONOTPATCHED: amp-geo served unpatched, ISO country not set"))}}
function U(a,b){var c=b.ISOCountryGroups,d="<amp-geo> ISOCountryGroups";c&&(Q("[object Object]"===B.call(c),d+" must be an object"),a.l=Object.keys(c),a.l.forEach(function(b){Q(/^[a-z]+[a-z0-9]*$/i.test(b)&&!/^amp/.test(b),d+"["+b+"] name is invalid");Q(Array.isArray(c[b]),d+"["+b+"] must be an array");V(a,c[b])&&a.j.push(b)}))}
function V(a,b){var c=b.reduce(function(a,b){if(/^preset-/.test(b))return Q(Array.isArray(J[b]),"<amp-geo> preset "+b+" not found"),a.concat(J[b]);a.push(b);return a},[]).map(function(a){return a.toLowerCase()});return c.includes(a.h)}function W(a){var b=a.classList,c=[],d=/^amp-iso-country-|^amp-geo-group-/i;for(a=b.length-1;0<a;a--)d.test(b[a])&&c.push(b[a]);return c}
function R(a,b){var c=a.getAmpDoc(),d={};return c.whenReady().then(function(){return c.waitForBodyOpen()}).then(function(g){T(a,c);U(a,b);var e=[];switch(a.m){case 2:e=W(g);case 0:d.ISOCountry=a.h;var h=a.j.map(function(a){d[a]=!0;return"amp-geo-group-"+a});a.j.length||h.push("amp-geo-no-group");a.o&&h.push("amp-geo-error");d.ISOCountryGroups=a.j;h.push("amp-iso-country-"+a.h);a.mutateElement(function(){var a=g.classList;e.push("amp-geo-pending");e.forEach(function(b){a.remove(b)});h.forEach(function(b){return a.add(b)});
if(b.AmpBind){var k=c.getElementById("ampGeo");k&&k.parentNode.removeChild(k);var f=c.win.document.createElement("amp-state"),n=c.win.document.createElement("script");n.setAttribute("type","application/json");n.textContent=JSON.stringify(d);f.appendChild(n);f.id="ampGeo";g.appendChild(f)}},g)}return{ISOCountry:a.h,matchedISOCountryGroups:a.j,allISOCountryGroups:a.l,isInCountryGroup:a.isInCountryGroup.bind(a)}})}
M.prototype.isInCountryGroup=function(a){var b=this,c=a.trim().split(/,\s*/);return c.filter(function(a){return 0<=b.l.indexOf(a)}).length!==c.length?1:0<c.filter(function(a){return 0<=b.j.indexOf(a)}).length?2:3};var S=null;(function(a){S=new v;a.registerElement("amp-geo",M);a.registerServiceForDoc("geo",function(){return S.promise})})(self.AMP);
})});

//# sourceMappingURL=amp-geo-0.1.js.map
