define( ["modules/colorrampobject"
        ,"modules/elementcache"
        ,"modules/getrasterurl"
        ,"dojo/on"
        ],
function( ramp
        , ElementCache
        , GetRasterUrl
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
   * from the ArcGIS server that represents the bathymetry rasters in the current extent. The
   * url tracking/building is done in the getrasterurl module.
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

    var getRasterUrl = GetRasterUrl(rasterLayer, map)

      , canCache = ElementCache('canvas')
      , imgCache = ElementCache('img')
      , layerCache = {}

      , points
      ;



    /**Constructor of a canvas identify task. This will be returned to the caller.**/
    function task(){
      this.points=null;
      this.prepping = 0;
      this.executing = 0;
      this.layerCount = 0;
      this.preparedContexts = {};
      this.called = 0;
      this.results ={};
    }



    /**The id task's two main functions: prepare a task, then execute it**/
    task.prototype.prepare = prepare;
    task.prototype.execute = execute;



    /**Prepare for the id. Get new img/canvas if the bbox has changed, else reuse them.
     **This allows for canvases/images to be loaded before the canvas needs to be queried
     **/
    function prepare(layers){
      if(this.executing&&!layers.length){
        this.cb(null);
      }
      this.prepping = 1;
      checkBboxFreshness();

      for(var i=0, len=layers.length; i < len; i++){
        var layer=layers[i];
        this.preparedContexts[layer] = null; //signal preparations for this layer have been started
        var cachedContext = getCachedContext(layer, makePrepareOnload, this)
        if(cachedContext){
          prepareLayer(layer, cachedContext, this);
        }
      }
    }



    /**Return a function that can be used as the onload callback of an img made in preparation.**/
    function makePrepareOnload(layer, ctx, img){
      return function(){
        ctx.drawImage(img,0,0);
        prepareLayer(layer, ctx, this);
      }
    }


    
    /**If we are executing when the image loads, get elevations, else save prepared context**/
    function prepareLayer(layer, ctx, thisTask){
      if(thisTask.executing){
        getLayerElevations(layer, ctx, thisTask);
      }else{
        thisTask.preparedContexts[layer]=ctx;
      }
    }



    /**If the Bbox has changed, wipe and release each canvas and image associated with a layer**/
    function checkBboxFreshness(){
      if(getRasterUrl.bBoxChanged()){

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
      }
    }



    /**If this layer has cached elements, return the context, else create elements for this layer
     **The makeOnloadFn is to compensate for different needs whether we are preparing or executing
     **A simple layer count is used so that we may know when all layers have been processed
     **/
    function getCachedContext(layer, makeOnloadFn, thisTask){
      thisTask.layerCount++;
      var cachedContext = layerCache[layer]?layerCache[layer].ctx:null;
      if(cachedContext) return cachedContext;
      createElements(layer, makeOnloadFn, thisTask);
      return null;
    }



    /**Get and save the canvas/img from the cache manager, run makeOnloadFn to get a function for the
     **img's onload (bound to the current task), set to img src to match the current image in the display
     **/
    function createElements(layer, makeOnloadFn, thisTask){
      var can = canCache.get();
      var img = imgCache.get();
      var ctx  =can.getContext('2d');
      var onload = makeOnloadFn(layer, ctx, img);

      layerCache[layer]={ctx:ctx,can:can,img:img};
      can.width = getRasterUrl.getWidth();
      can.height = getRasterUrl.getHeight();
      img.onload = onload.bind(thisTask);
      img.src = getRasterUrl.getUrl(layer);
    }




    function execute(layers, pointObj, cb){
      /*points is a flattened xy array [x0,y0,x1,y1,...,xn,yn]*/
      /*ftGap determines spacing of points in the query*/
      this.points = pointObj.points;
      this.ftGap = pointObj.ftGap;
      this.cb = cb;
      this.executing = 1;

      checkBboxFreshness();
      var preparedContexts = this.preparedContexts;
      var thisTask = this;

      /*With a new layer (no preparations), get its context/canvas/img, then get elevations*/
      for(var i=0, len=layers.length; i < len; i++){
        var layer = layers[i];
        if(preparedContexts[layer] !== undefined) continue;
        else getCachedContext(layer, makeExecuteOnload, this);
      }

      /*Get elevations for the contexts that were fully prepared before we started executing*/
      for(var layer in preparedContexts){
        if(preparedContexts[layer]){
          getLayerElevations(layer, preparedContexts[layer], this);
        }
      }

      /*exit if in unexpected state*/
      if(this.prepping && !Object.keys(preparedContexts).length){cb(null);}
    }



    /**Draw to the canvas and get elevations for layers first encountered in the execute step**/
    function makeExecuteOnload(layer, ctx, img){
      return function(){
        ctx.drawImage(img,0,0);
        getLayerElevations(layer, ctx, this);
      }
    }



    /**Calculate elevations and mark this layer as processed**/
    function getLayerElevations(layer, ctx, thisTask){
      thisTask.results[layer] = getElevations(thisTask.points, thisTask.ftGap, ctx);
      decLayerCount(thisTask);
    }



    /**Mark a layer as processed by decrementing the task's layerCount
     **Once everything has been processed, call the callback with all the results
     **/
    function decLayerCount(thisTask){
      thisTask.layerCount--;
      if(thisTask.layerCount === 0){
        thisTask.called=1;
        thisTask.cb(thisTask.results);
      }
    }



    /**Return an array of objects, each an x,y point with x as distance along the profile
     **and y as the elevation relative to NAVD88
     **points is a flattened array of xy points *on the canvas* [x0,y0,x1,y1,...,xn,yn]
     **/
    function getElevations(points, ftGap, ctx){
      var elevs = new Array(points.length/2);
      for(var i = 0, j = points.length; i<j; i+=2){
        elevs[i/2]={x:ftGap*i/2,
                    y:getElevation(points[i], points[i+1], ctx)
                   };
      }
      return elevs;
    }



    /*Get image data at a canvas xy point, encode it, and get the elevation from the ramp object**/
    function getElevation(x, y, ctx){
      var data = ctx.getImageData(x, y, 1, 1).data
      , key = (data[0]<<16)+(data[1]<<8)+data[2]
      ;
      return ramp[key];
    }



    return {
      task:task
    }
  }
});