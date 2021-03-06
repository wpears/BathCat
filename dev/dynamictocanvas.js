define(["modules/colorrampobject.js"],function(ramp){
  return function(rasterLayer, canvashtml){  
    var ifr = document.createElement('iframe')
      , getImage=rasterLayer.getImageUrl
      , ifrWin
      , can
      , ctx
      ;
    ifr.onload = function(){
      ifrWin = ifr.contentWindow;
      can = ifrWin.can;
      ctx = ifrWin.ctx;
    }

    document.body.appendChild(ifr);
    ifr.src=canvashtml;  //"http://mrsbmapp00642/bathcat/canvasworkaround.html"


    rasterLayer.getImageUrl = function(){
      var args = Array.prototype.slice.call(arguments,0,arguments.length-1)
        , cb = arguments[3]
        , fn = function(){
                 ifr.contentWindow.postMessage(arguments[0]);
                 cb.apply(this,arguments);
               }
        ;
      args.push(fn)
      getImage.apply(this,args);
    };

  return function getElevation(point){
   var data = ctx.getImageData(point.x, point.y, 1, 1).data
    , key = data[0]*65536+data[1]*256+data[2]
    ;
    return ramp[key];
  }
 }
});