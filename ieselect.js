console.log("Need to fix ie selection.");
if (document.all && !window.setTimeout.isPolyfill) {
  var __nativeST__ = window.setTimeout;
  window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeST__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setTimeout.isPolyfill = true;
}
document.body.onselectstart=function(e){console.log("ieselectstart");e.preventDefault();e.stopPropagation();return false};

/*Try function makeUnselectable(node) {
    if (node.nodeType == 1) {
        node.setAttribute('unselectable', 'on');
    }
    var child = node.firstChild;
    while (child) {
        makeUnselectable(child);
        child = child.nextSibling;
    }
}

makeUnselectable(document.getElementById('foo'));*/