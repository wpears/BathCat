define([],function(){
  return function(element,amount){
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
        if(pointer === cache.length) cache.length = 0;
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