//>>built
define("dgrid/Keyboard","dojo/_base/declare dojo/aspect dojo/on ./List dojo/_base/lang dojo/has put-selector/put dojo/_base/Deferred dojo/_base/sniff".split(" "),function(t,u,m,A,v,k,q,w){var x={checkbox:1,radio:1,button:1},y=/\bdgrid-cell\b/,z=/\bdgrid-row\b/;k.add("dom-contains",function(){return!!document.createElement("a").contains});return t("dgrid.Keyboard",null,{pageSkip:10,tabIndex:0,postCreate:function(){function r(c){var k=c.target;return k.type&&(!x[k.type]||32==c.keyCode)}function s(g){function p(a,
b,h){var f=c.cellNavigation?"cell":"row",d=c[f](a);if(a=d&&d.element)b=v.mixin({grid:c},b),b.type&&(b.parentType=b.type),b.bubbles||(b.bubbles=!0),q(e,"!dgrid-focus[!tabIndex]"),e&&(8>k("ie")&&(e.style.position=""),b[f]=c[f](e),m.emit(a,"dgrid-cellfocusout",b)),e=a,b[f]=d,h||(8>k("ie")&&(a.style.position="relative"),a.tabIndex=c.tabIndex,a.focus()),q(a,".dgrid-focus"),m.emit(e,"dgrid-cellfocusin",b)}for(var n=c.cellNavigation?y:z,e=g,l;(l=e.firstChild)&&!n.test(l.className);)e=l;l&&(e=l);g===c.contentNode?
u.after(c,"renderArray",function(a){return w.when(a,function(b){var a;if(a=n.test(e.className))a=e,a=k("dom-contains")?g.contains(a):g.compareDocumentPosition(a)&8;if(a)return b;a=0;for(var f=g.getElementsByTagName("*"),d;d=f[a];++a)if(n.test(d.className)){e=d;break}e.tabIndex=c.tabIndex;return b})}):n.test(e.className)&&(e.tabIndex=c.tabIndex);m(g,"mousedown",function(a){r(a)||p(a.target,a)});m(g,"keydown",function(a){if(!a.metaKey&&!a.altKey){var b=a.keyCode;if(!r(a)){var h={32:0,33:-c.pageSkip,
34:c.pageSkip,37:-1,38:-1,39:1,40:1,35:1E4,36:-1E4}[b];if(!isNaN(h)){var f,d=c.cell(e);if(37==b||39==b){if(!c.cellNavigation)return;b="right"}else b="down",f=d&&d.column&&d.column.id,d=c.row(e);h&&(d=d&&c[b](d,h,!0));if(h=d&&d.element){f&&(h=c.cell(h,f).element);if(c.cellNavigation){f=h.getElementsByTagName("input");for(var g,d=0;d<f.length;d++)if(b=f[d],(-1!=b.tabIndex||"lastValue"in b)&&!b.disabled){8>k("ie")&&(b.style.position="relative");b.focus();8>k("ie")&&(b.style.position="");g=!0;break}}p(h,
a,g)}a.preventDefault()}}}});return function(a){a=a||e;p(a,{target:a})}}this.inherited(arguments);var c=this;this.tabableHeader&&(this.focusHeader=s(this.headerNode));this.focus=s(this.contentNode)}})});