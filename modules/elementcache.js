define([],function(){

  /**Call with an element name to create a simple cache which saves old elements to be reused
   **Used in the catalog for the hidden imgs and canvases involved in the profile tool's internals
   **/
  return function(element){
     var cache=[]
       , pointer = 0
       , doc = document
       ;


    function get(){
      var el;
      if(pointer === cache.length){
        el = doc.createElement(element);
      }else{
        el = cache[pointer]
        cache[pointer] = null;
        pointer++;
        if(pointer === cache.length){
          cache.length = 0;
          pointer = 0;
        }
      }
      return el
    }


    function reclaim(el){
      cache[cache.length] = el;
    }


    return {
      get:get,
      reclaim:reclaim
    }

  }
});