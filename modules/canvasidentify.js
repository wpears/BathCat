define( ["modules/colorrampobject.js"
        ,"modules/elementcache.js"
        ,"dojo/aspect"
        ],
function( ramp
        , elCache
        , aspect
        ){
  return function(rasterLayer, map){
    var getImage=rasterLayer.getImageUrl
      , currentRaster = 'curr'
      , lastRaster = 'last'
      , thisCtx
      , canCache = elCache('canvas')
      , canvases = []
      , imgCache = elCache('img')
      , images = []
      , width = map.width
      , height = map.height
      ;
    rasterLayer.getImageUrl = function(){
      var args = Array.prototype.slice.call(arguments,0,arguments.length-1)
        , cb = arguments[3]
        , fn = function(){
                 currentRaster = arguments[0];
                 cb.apply(this,arguments);
               }
        ;
      args.push(fn)
      getImage.apply(this,args);
    };

    aspect.after(map, 'resize', function(){setTimeout(setDim,400)});

function setDim(){
  width = map.width;
  height = map.height;
}

function drawImg(){
  thisCtx.drawImage(this,0,0)
  console.log(getElevation(this.pnt.x,this.pnt.y,thisCtx))
}

function getElevation(x,y,ctx){
  console.log('get elev')
   var data = ctx.getImageData(x, y, 1, 1).data
    , key = (data[0]<<16)+(data[1]<<8)+data[2]
    ;
    console.log(data,key)
    return ramp[key];
  }

function getElevations(arr,ctx){
  var elevs = new Array(arr.length);
  for(var i = 0, j = arr.length; i<j; i++){
    var pnt = arr[i];
    elevs[i] = getElevation(pnt.x,pnt.y,ctx);
  }
  return elevs;
}

function initCanvas(pnt){
  console.log("init")
  var can = canCache.get()
    , img = imgCache.get()
    , ctx  =can.getContext('2d')
    ;
    canvases[canvases.length] = can;
    images[images.length] = img;

    can.width = width;
    can.height = height;
    thisCtx = ctx;
    img.pnt = pnt;
    img.onload = drawImg;
    img.src = currentRaster
}

function release(){
  thisCtx = null;
  for(var i=0, j=canvases.length; i<j; i++){
    canvases[i].getContext('2d').clearRect()
    canCache.reclaim(canvases[i]);
    images[i].pnt = null;
    imgCache.reclaim(images[i]);
  }
  canvases.length = 0;
  images.length = 0;
}

function identify(pnt){
  console.log('ident');
  if(currentRaster !== lastRaster){
    initCanvas(pnt);
  }else{
    thisCtx.clearRect();
    console.log(getElevation(pnt.x,pnt.y,thisCtx))
  }
}

  return {
    identify:identify
  }
}
});

//in crosstool
// instantiate the id tool.
// get two points.
// calculate points for full line
// identify each of these points