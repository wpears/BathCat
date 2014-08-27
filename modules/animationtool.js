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

    var animationOn = 0;
    var currIndex = 0;
    var animDelay = 1500;



    on(playButton,"mousedown",animate);

    function animate(){
      if(!container) container = DOC.getElementById("mapDiv_layers");
      animTargets = getTargets();
      makeImages(animTargets);

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


    function makeImages(targets){
      var count = targets.length;
      targets.forEach(function(v,i){
        var image = imgCache.get();
        image.className = animClass;
        image.onload = function(){
          if(--count===0){
            rasterLayer.hide();
            animationOn = 1;
            animLoop();
          }
        }
        image.src=getRasterUrl.getUrl(v);
        images.push({layer:v, img:image});
        container.appendChild(image);
      });
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

      if(animationOn) setTimeout(animLoop, animDelay);
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