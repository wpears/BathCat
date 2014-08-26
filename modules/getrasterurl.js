define([],function(){
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
      ;



    /**Utilities to create image endpoint url**/
    function makeSuffix(width,height){
      return srText + width + "%2C" + height + "&f=image"
    }

    function buildQuery(layer){
      return prefix+layer+currentBbox+suffix;
    }



    /**Track dimensions and update image endpoint suffix**/
    map.on('resize', setDimensions)

    function setDimensions(){
      width = map.width;
      height = map.height;
      suffix = makeSuffix(width, height);
    }



    /**Allow access to managed dimensions**/
    function getWidth(){
      return width;
    }

    function getHeight(){
      return height;
    }

    function bBoxChanged(){
      var different = lastBbox !== currentBbox;

      if(different){
        lastBbox = currentBbox;
      }

      return different;
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



    return {
      getUrl: buildQuery,
      getWidth: getWidth,
      getHeight: getHeight,
      bBoxChanged: bBoxChanged
    }
  }
});