require(["dojo/has"],function(has){
  var D = document, sc = 'script', s = D.createElement(sc), f = D.getElementsByTagName(sc)[0];
  if(has("touch")){
    s.src = "./bcmobile.js"
  }else{
    s.src ="./bathcat.js"
  }
  f.parentNode.insertBefore(s,f);
});