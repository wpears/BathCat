define( ["dojo/on"
        ],
function( on
        ){
  return function(rastersShowing, geoSearch, rasterLayer, map){

    var animTargets = getTargets();
    var playButton = document.getElementById("anim");

    on(playButton,"mousedown",animate);

    function animate(){
      var current = animTargets[0];
    }




    function getTargets(){
      return geoSearch.selected.filter(filterTargets)
    }

    function filterTargets(target){
      return rastersShowing[target]
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