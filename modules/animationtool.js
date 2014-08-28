define( ["dojo/on"
        ,"modules/getrasterurl"
        ,"modules/elementcache"
        ],
function( on
        , GetRasterUrl
        , ElementCache
        ){
  return function(features, rastersShowing, geoSearch, rasterLayer, map){

    var getRasterUrl = GetRasterUrl(rasterLayer, map);
    var imgCache = ElementCache('img');

    var animTargets;
    var images = [];

    var DOC = document;
    var playButton = DOC.getElementById("anim");
    var container;
    var animClass = "animationImage";
    var transClass = "animationImage animationTransition";

    var loopHandle;
    var restartHandle;

    var startLoop = 1;
    var currIndex = 0;
    var animDelay = 1500;

    var handlers = function(){
      var panStart
        , panEnd
        , zoomStart
        , zoomEnd
        ;

      return {
        attach:function(){
          panStart = map.on("pan-start", stopAnim);
          panEnd = map.on("pan-end", restartAnim);
          zoomStart = map.on("zoom-start", stopAnim);
          zoomEnd = map.on("zoom-end", restartAnim);
        }
      }
    }();


    on(playButton,"mousedown",animate);




    function animate(){
      if(!container) container = DOC.getElementById("mapDiv_layers");
      animTargets = getTargets();
      makeImages(animTargets);

      handlers.attach();
    }





    function getTargets(){
      return geoSearch.selected
              .filter(rastersOn)
              .map(oidsToLayers)
              .sort(featureDates)
              ;
    }

    function rastersOn(target){
      return rastersShowing[target]
    }

    function oidsToLayers(target){
      return target - 1;
    }

    function featureDates(a,b){
      return +features[a].attributes.Date - +features[b].attributes.Date;
    }




    function stopAnim(){
      console.log("STOPPING");
      clearTimeout(loopHandle);
      startLoop = 0;
      wipeImages();
    }


    function restartAnim(){
      console.log("RESTARTING")
      if(restartHandle){
        clearTimeout(restartHandle);
      }


      restartHandle = setTimeout(function(){
        restartHandle = null;
        makeImages(animTargets);
      },0);
    }



    function makeImages(targets){
      var count = targets.length;
      startLoop = 1;
      cleanImages(count);

      targets.forEach(function(v,i){
        var image;

        if(images[i]){
          image = images[i].img
        }else{
          image = imgCache.get();
        }

        image.className = animClass;

        image.onload = function(){
          console.log("onload",count)
          if(--count===0){
            if(startLoop)animLoop();
          }
        }

        image.src=getRasterUrl.getUrl(v);
        images[i] = {layer:v, img:image};
        container.appendChild(image);
      });

      showImages();
    }




    function showImages(){
      for(var i=0; i<images.length; i++){
        images[i].img.style.visibility = "visible";
      }
    }
    
    function wipeImages(){
      for(var i=0; i<images.length; i++){
        images[i].img.style.visibility = "hidden";
      }
    }




    function cleanImages(i){
      var count = i;

      for(;i<images.length;i++){
        imgCache.reclaim(images[i].img)
      }

      images.length = count;
    }




    function getPrev(index){
      if(index === 0) return images.length-1;
      return index-1;
    }

    function getNext(index){
      if(index === images.length-1) return 0;
      return index+1;
    }




    function animLoop(){
      console.log("looping");

      var prevIndex = getPrev(currIndex);
      var nextIndex = getNext(currIndex);

      var curr = images[currIndex].img;
      var prev = images[prevIndex].img;
      var next = images[nextIndex].img;

      curr.className = transClass;
      prev.className = animClass;

      next.style.opacity = 1;
      curr.style.opacity = 0;

      currIndex = nextIndex;

      loopHandle = setTimeout(animLoop, animDelay);
    }



//on various updates... animTargets = getTargets();



   /* return {
      handlers:[],

      init:function(e){

      },

      start:function(){
        this.revive();
      },

      idle:function(){

      },

      revive:function(){

      },

      stop:function(){
        this.idle();
      }
    };*/
  }
});