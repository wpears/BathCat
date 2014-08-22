define( ["modules/colorrampobject"
        ,"modules/elementcache"
        ,"dojo/on"
        ],
function( ramp
        , elementCache
        , on
        ){

  /*****Identify cross sections with minimal server interaction*****/

  /*
   * The naive way to make cross sections is to send an identify task to the server for every
   * point of interest. This leads to hundreds of simultaneous requests to the ArcGIS Server,
   * taking 3-5 seconds to draw a profile and requiring substantial server resources.
   *
   * This module is an elaborate hack to almost eliminate server interaction from the tool and
   * reduce profile creation time to a few hundred miliseconds (much of which is graph drawing)
   *
   * This is done by creating and updating a hidden img and canvas to match the image returned
   * from the ArcGIS server that represents the bathymetry rasters in the current extent.
   *
   * The hidden img is written to the canvas, which provides access to individual pixel values.
   *
   * The color ramp of every image is fixed such that each color represents the same elevation
   * across datasets. The mapping from color to elevation was preprocessed with a script in
   * development. The result is the colorrampobject dependency.
   *
   * Thus we can query pixel values from the canvas and get elevations from them with a simple
   * object lookup. This is quite fast.
   */

  return function(rasterLayer, map){

    var width = map.width
      , height = map.height
      , extent = map.extent

      , srText = "&bboxSR=102100&imageSR=102100&size="
      , prefix = rasterLayer.url+"/export?dpi=96&transparent=true&format=png8&layers=show%3A"
      , suffix = makeSuffix(width,height)
      , currentBbox = "&bbox="+extent.xmin+"%2C"+extent.ymin+"%2C"+extent.xmax+"%2C"+extent.ymax
      , lastBbox = 'last'
      , getImage = rasterLayer.getImageUrl

      , canCache = elementCache('canvas')
      , imgCache = elementCache('img')
      , layerCache = {}

      , points
      ;



    /**Utilities to create image endpoint url**/
    function makeSuffix(width,height){
      return srText + width + "%2C" + height + "&f=image"
    }


    function buildQuery(layer){
      return prefix+layer+currentBbox+suffix;
    }



    /**Monkey patch getImageUrl to auto-update the bounding box**/
    rasterLayer.getImageUrl = function(){
      var args = Array.prototype.slice.call(arguments,0,3)
        , cb = arguments[3]
        , fn = function(){
                 var urlArr = arguments[0].split('&');
                 currentBbox = '&'+urlArr[4];
                 cb.apply(this,arguments);
               }
        ;
      args.push(fn)
      getImage.apply(this,args);
    };



    /**track dimensions and update image endpoint suffix**/
    on(window, 'resize', setDimensions)

    function setDimensions(){
      width = map.container.clientWidth;
      height = map.container.clientHeight;
      suffix = makeSuffix(width, height);
    }



    /**Constructor of a canvas identify task. This will be returned to the caller.**/
    function task(){
      this.points=null;
      this.prepping = 0;
      this.executing = 0;
      this.layerCount = 0;
      this.prepared = {};
      this.called = 0;
      this.results ={};
    }



    /**The id task's two main functions: prepare a task, then execute it**/
    task.prototype.prepare = prepare;
    task.prototype.execute = execute;



    /**Prepare for the id. Get new img/canvas if the bbox has changed, else reuse them. **/
    function prepare(layers){
      if(this.executing&&!layers.length){
        this.cb(null);
      }
      this.prepping = 1;
      checkBboxFreshness();

      for(var i=0, len=layers.length; i < len; i++){
        var id=layers[i];
        this.prepared[id] = 1;
        var cachedContext = getCanvas(id, createPrepare, this)
        if(cachedContext){
          runPrep(id, cachedContext, this);
        }
      }
    }




    function checkBboxFreshness(){
      if(lastBbox !== currentBbox){
        
        for(var key in layerCache){
          var item = layerCache[key]
            , can = item.can
            , ctx = item.ctx
            , img = item.img
            ;
          ctx.clearRect(0,0,can.width,can.height)
          imgCache.reclaim(img)
          canCache.reclaim(can)
          delete layerCache[key]
        }

        lastBbox = currentBbox;
      }
    }



    function getCanvas(layer, createOnload, thisTask){
      thisTask.layerCount++;
      var cachedContext = layerCache[layer]?layerCache[layer].ctx:null;
      if(cachedContext) return cachedContext;
      createCanvas(layer, createOnload, thisTask);
      return false;
    }




function getElevation(x,y,ctx){
   var data = ctx.getImageData(x, y, 1, 1).data
    , key = (data[0]<<16)+(data[1]<<8)+data[2]
    ;
 //   console.log(data,key)
    return ramp[key];
}


function getElevations(points, ctx){
  var elevs = new Array(points.length/2);
  for(var i = 0, j = points.length; i<j; i+=2){
    elevs[i/2]=getElevation(points[i],points[i+1],ctx);
  }
  return elevs;
}

function getElevsForChart(points, ftGap, ctx){
  var elevs = new Array(points.length/2);
  for(var i = 0, j = points.length; i<j; i+=2){
    elevs[i/2]={x:ftGap*i/2,y:getElevation(points[i],points[i+1],ctx)};
  }
  return elevs;
}








function execute(layers,pointObj,cb){ //points is a flattened array [x0,y0,x1,y1,x2,y2,...]
  this.points = pointObj.points;
  this.ftGap = pointObj.ftGap;
  this.cb = cb;
  this.executing = 1;
  checkBboxFreshness();
  var prep = this.prepared;
  var thisTask = this;
 // console.log("prepped for executing",prep)
  for(var i=0, len=layers.length; i < len; i++){
    var id = layers[i];
    if(prep[id]) continue;
    getCanvas(id, createExecute, this);
  }
//  console.log("checking for layers in prep")
  for(var layer in prep){
    //console.log(layer,prep[layer])
    if(prep[layer] !== 1){
      this.results[layer] = getElevsForChart(this.points, this.ftGap, prep[layer]);
      decLayerCount(this);
    }
  }
  if(this.prepping &&!Object.keys(prep).length){cb(null);}

  /*loop through layers, if in prepared continue, else build or pull from cache. execute from prepared.
  execute others.
  */

}




function decLayerCount(thisTask){
  thisTask.layerCount--;
  if(thisTask.layerCount === 0){
    thisTask.called=1;
    thisTask.cb(thisTask.results);
  }
}

function runPrep(layer, ctx, thisTask){
//  console.log("runPrep", arguments,thisTask.executing)
  if(thisTask.executing){
      thisTask.results[layer] = getElevsForChart(thisTask.points, thisTask.ftGap, ctx);
      decLayerCount(thisTask);
  }else{
      thisTask.prepared[layer]=ctx;
  }
}

function createPrepare(layer, ctx, img){
 // console.log("createPrep",arguments)
  return function(){
    ctx.drawImage(img,0,0);
    runPrep(layer, ctx, this);
  }
}

function createExecute(layer, ctx, img){
  return function(){
    ctx.drawImage(img,0,0);
    this.results[layer] = getElevsForChart(this.points, this.ftGap, ctx);
    decLayerCount(this);
  }
}


function createCanvas(layer, createOnload, thisTask){
  //console.log("creating canvas", arguments)
  var can = canCache.get()  //watch garbage.. recreate canvas/img trackers
  //console.log(can)
  var img = imgCache.get()
    //console.log(img)
  var ctx  =can.getContext('2d')
  //console.log(ctx)
  var onload = createOnload(layer, ctx, img);

  //  console.log("Created",can,img,ctx,onload)
    layerCache[layer]={ctx:ctx,can:can,img:img};
    can.width = width;
    can.height = height;
    img.onload = onload.bind(thisTask);
    img.src = buildQuery(layer);
  //  console.log("waiting for onload");
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