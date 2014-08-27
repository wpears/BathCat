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
    var images = {};
    var DOC = document;
    var playButton = DOC.getElementById("anim");

    var container;

    on(playButton,"mousedown",animate);

    function animate(){
      if(!container) container = DOC.getElementById("mapDiv_layers");
      animTargets = getTargets();
      makeImages(animTargets);

      var current = animTargets[0];
      console.log(animTargets)
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
      targets.forEach(function(v){
        var image = imgCache.get();
        image.className = "animationImage";
        image.onload = function(){
          if(--count===0){
            startAnimation();
          }
        }
        image.src=getRasterUrl.getUrl(v);
        images[v]=image;
        container.appendChild(image);
      });
    }


    function startAnimation(){
      console.log("STARTING");
      rasterLayer.hide();

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