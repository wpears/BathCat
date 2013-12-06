define( ["modules/colorrampobject.js"
        ,"modules/elementcache.js"
        ,"dojo/on"
        ],
function( ramp
        , elCache
        , on
        ){
  return function(rasterLayer, map){
    var getImage=rasterLayer.getImageUrl
      , width = map.width
      , height = map.height
      , prefix = rasterLayer.url+"export?dpi=96&transparent=true&format=png8&layers=show%3A"
      , suffix = makeSuffix(width,height)
      , srText = "&bboxSR=102100&imageSR=102100&size="
      , points
      , currentLayers = []
      , currentBbox = 'curr'
      , lastBbox = 'last'
      , canCache = elCache('canvas')
      , imgCache = elCache('img')
      , layerCache = {}
      ;
    rasterLayer.getImageUrl = function(){
      var args = Array.prototype.slice.call(arguments,0,3)
        , cb = arguments[3]
        , fn = function(){
                 var urlArr = arguments[0].split('&');
                 currentLayers = urlArr[3].slice(19).split('%2C');
                 currentBbox = urlArr[4].slice(5);
                 console.log(currentLayers,currentBbox);
                 cb.apply(this,arguments);
               }
        ;
      args.push(fn)
      getImage.apply(this,args);
    };

    on(window, 'resize', setDim)


function setDim(){
  width = map.container.clientWidth;
  height = map.container.clientHeight;
  suffix = makeSuffix(width, height);
}


function makeSuffix(width,height){
  return srText + width + "%2C" + height + "&f=image"
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
  var elevs = new Array(arr.length/2);
  for(var i = 0, j = arr.length; i<j; i+=2){
    elevs[i/2]=getElevation(arr[i],arr[i+1],ctx);
  }
  return elevs;
}


function testCache(){
  if (lastBbox !== currBbox){
    for(var key in layerCache){
      var item = layerCache[key]
        , can = item.can
        , ctx = item.ctx
        , img = item.img
        ;
      ctx.clearRect(0,0,can.width,can.height)
      imgCache.reclaim(img)
      canCache.reclaim(can)
      layerCache[key] = null;
    }
    lastBbox = currBbox;
  }
}


function prepare(layers){
  testCache();
  for(var i=0, len=layers.length; i < len; i++){
    var cachedContext = getCanvas(layers[i], createPrepare, this)
    if(cachedContext){
      runPrep(layers[i], cachedContext, this);
    }
  }
}


function execute(layers,points,cb){ //points is a flattened array [x0,y0,x1,y1,x2,y2,...]
  this.points = points;
  this.cb = cb;
  this.executing = 1;
  testCache();
  var prep = this.prepared
  for(var i=0, len=layers.length; i < len; i++){
    if(prep[layers[i]]) continue;
    getCanvas(layers[i], createExecute, this);
  }
  for(var layer in prep){
    getElevations(this.points,prep[layer]);
    decLayerCount(this);
  }

  /*loop through layers, if in prepared continue, else build or pull from cache. execute from prepared.
  execute others.
  */

}


function getCanvas(layer, createOnload, that){
  that.layerCount++;
  var cachedContext = layerCache[layer];
  if(cachedContext) return cachedContext;
  createCanvas(layer, createOnload, that);
  return false;
}



/*create a canvas that, when loaded, will do the operation 
  and spit out an object {layerid:[1:-32.2,2:-28.4, etc]}
  This means currying the point/list of points on the onload.
  HOWEVER, necessarily don't know list of points on prepare
  So instead the PREPARE onloads should put the ready contexts in a stack
  the execute onloads know everything, and can be passed the curried fn

  And yet how to signal finished, AND ensure whole stack called?
  Executing flag...
  on preparing onloads.. could check and execute rather than pushing to stack
  The "pull or build" fn also increments overlapCount
  the curried fn decrements before passing to getElevs


 okay. constructor and prototype
   bbox and current layers. hm. I think I still have to disallow dragging for now.
   current layers though... NOPE.remember you are building one query for each layer.
   you need to instead 


   heyyyyyyyo. So the cache. It's done loading... I'll need to just store the context and call
   getElevations on the pnt arr and context
  */


function buildQuery(layer){
  return prefix+layer+currentBbox+suffix;
}

function decLayerCount(that){
  that.layerCount--;
  if(that.layerCount === 0){
    that.cb(that.results);
  }
}

function runPrep(layer, ctx, that){
  if(that.executing){
      that.results[layer] = getElevations(that.points,ctx);
      decLayerCount(that);
  }else{
      that.prepared[layer]=ctx;
  }
}

function createPrepare(layer, ctx, img){
  return function(){
    ctx.drawImage(img,0,0);
    runPrep(layer, ctx, this);
  }
}

function createExecute(layer, ctx, img){
  return function(){
    ctx.drawImage(img,0,0);
    this.results[layer] = getElevations(this.points,ctx);
    decLayerCount(this);
  }
}


function createCanvas(layer, createOnload, that){
  console.log("create")
  var can = canCache.get()  //watch garbage.. recreate canvas/img trackers
    , img = imgCache.get()
    , ctx  =can.getContext('2d')
    , onload = createOnload(layer, ctx, img);
    layerCache[layer]=ctx;  
    can.width = width;
    can.height = height;
    img.onload = onload.bind(that);
    img.src = buildQuery(layer);
}


function release(){
  thisCtx = null;
  for(var i=0, j=canvases.length; i<j; i++){
    var thisCan=canvases[i],thisImg=images[i];
    thisCan.getContext('2d').clearRect(0,0,thisCan.width,thisCan.height)
    canCache.reclaim(canvases[i]);
    images[i].pnt = null;
    imgCache.reclaim(images[i]);
  }
  canvases.length = 0;
  images.length = 0;
}

function task(){
  this.points=null;
  this.executing = 0;
  this.prepared = {};
  this.results ={};
}


identifyTask.prototype.prepare = prepare;
identifyTask.prototype.execute = execute;


function identify(layers, pnt){
  console.log('ident');
  testCache();

  if(currentRaster !== lastRaster){
    createCanvas(pnt);
    lastRaster=currentRaster;
  }else{
    console.log(getElevation(pnt.x,pnt.y,thisCtx))
  }
}

  return {
    task:task
  }
}
});

//in crosstool
// instantiate the id tool.
// get two points.
// calculate points for full line
// identify each of these points