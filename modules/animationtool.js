define( ["dojo/on"
        ,"dojo/dom-class"
        ,"modules/getrasterurl"
        ,"modules/elementcache"
        ],
function( on
        , domClass
        , GetRasterUrl
        , ElementCache
        ){
  return function(anchor, selected, rasterLayer, options){

    var map = options.map || window.map || null;
    var features = options.features || null;
    var rastersShowing = options.rastersShowing || null;
    var getRow = options.getRow || null;

    var getRasterUrl = GetRasterUrl(rasterLayer, map);
    var imgCache = ElementCache('img');

    var animTargets;
    var images = [];

    var DOC = document;

    var container;
    var animClass = "animationImage";
    var transClass = "animationImage animationTransition";
    var animOn = "animationOn";

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
        , click
        ;

      return {
        attach:function(){
          panStart = map.on("pan-start", stopAnim);
          panEnd = map.on("pan-end", restartAnim);
          zoomStart = map.on("zoom-start", stopAnim);
          zoomEnd = map.on("zoom-end", restartAnim);
          click = on(DOC.body, "click", checkForUpdate);
        },
        remove:function(){
          panStart.remove();
          panEnd.remove();
          zoomStart.remove();
          zoomEnd.remove();
          click.remove();
        }
      }
    }();


    var toggleAnimation = function(){
      var animating = 0;

      return function(){
        domClass.toggle(anchor, animOn);

        if(animating){
          freeze();
          animating = 0;
        }else{
          animate();
          animating = 1;
        }
      }
    }();



    on(anchor,"mouseup", toggleAnimation);





    function animate(){
      if(!container) container = DOC.getElementById("mapDiv_layers");
      animTargets = getTargets();
      makeImages(animTargets);

      handlers.attach();
    }


    function freeze(){
      stopAnim();
      var elems = Array.prototype.slice.call(DOC.getElementsByClassName(animClass));

      for(var i=0, len = elems.length; i<len;i++){
        removeNode(elems[i])
      }

      images.length = 0;
      handlers.remove();
    }

    function removeNode(v){
      container.removeChild(v)
    }





    function getTargets(){
      return selected
              .filter(rastersOn)
              .map(oidsToLayers)
              .sort(featureDates)
              ;
    }

    function rastersOn(target){
      if(rastersShowing) return rastersShowing[target];
      return 1;
    }

    function oidsToLayers(target){
      return target - 1;
    }

    function featureDates(a,b){
      if(features) return +features[a].attributes.Date - +features[b].attributes.Date;
      return a-b;
    }




    function selectedChanged(){
      var oldTargets = animTargets;
      animTargets = getTargets();

      if(animTargets.length !== oldTargets.length) return 1;

      for(var i=0; i<animTargets.length; i++){
        if(animTargets[i] !== oldTargets[i]) return 1;
      }

      return 0;
    }


    function checkForUpdate(){
      if(selectedChanged()){
        clearTimeout(loopHandle);
        startLoop = 0;

        var prev = images[getPrev(currIndex)]
        if(prev)hideLast(prev.layer+1)

        currIndex = 0;
        updateImages(animTargets);
      }
    }



    function stopAnim(){
      clearTimeout(loopHandle);
      startLoop = 0;

      var prev = images[getPrev(currIndex)]
      if(prev)hideLast(prev.layer+1)

      wipeImages();
    }


    function restartAnim(){
      if(restartHandle){
        clearTimeout(restartHandle);
      }


      restartHandle = setTimeout(function(){
        restartHandle = null;
        selectedChanged();
        makeImages(animTargets);
      },0);
    }



    function getNewImage(layer, cb){
      var image = imgCache.get();
      var oldSrc = image.src;

      image.className = animClass;

      image.onload = cb;
      
      image.src= getRasterUrl.getUrl(layer);

      container.appendChild(image);

      if(oldSrc === image.src)setTimeout(cb,0);

      return {layer:layer, img:image};
    }



    function makeImages(targets){
      var count = targets.length;
      startLoop = 1;
      releaseImages(count);

      function cb(){
        if(--count===0){
          if(startLoop)animLoop();
        }
      }

      targets.forEach(function(v,i){
        images[i] = getNewImage(v, cb);
      });

      showImages();

      if(!targets.length){
        animLoop();
      }
    }



    function updateImages(targets){
      var count = targets.length;
      var imgIndex = 0;

      function cb(){
        if(--count===0){
          animLoop();
        }
      }

      for(var i=0; i<targets.length; i++){
        var layer = targets[i];
        var imgObj = images[imgIndex];

        if(!imgObj){
          images[imgIndex] = getNewImage(layer,cb);
          imgIndex++;
          continue;
        }

        var dateOrder = featureDates(layer,imgObj.layer);

        if(dateOrder===0){
          count--;
        }else if(dateOrder < 0){
          images.splice(imgIndex,0,getNewImage(layer,cb));
        }else{
          reclaim(images[imgIndex].img);
          images.splice(imgIndex,1);
          imgIndex--;
          i--;
        }

        imgIndex++;
      }
      cleanImages(targets.length);


      if(count===0) animLoop();

    }


    function reclaim(img){
      img.style.opacity = 0;
      imgCache.reclaim(img);
    }


    function releaseImages(count){
      for(var i=0;i<images.length;i++){
        reclaim(images[i].img)
      }
      images.length=count;
    }


    function cleanImages(count){
      for(var i = count; i<images.length; i++){
        if(images[i]){
          reclaim(images[i].img)
        }
      }

      images.length = count;
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



    function showCurrent(oid){
      
      if(getRow){
        var row = getRow(oid);
        domClass.add(row.firstChild,"animHighlight");
      }

      var multi = DOC.querySelector('span[data-oid="'+oid+'"]');

      if(multi){
        multi.style.borderBottom="1px solid #a5b6e0";
        multi.style.marginBottom="0"
      }

    }

    function hideLast(oid){

      if(getRow){
        var row = getRow(oid);
        domClass.remove(row.firstChild,"animHighlight");
      }

      var multi = DOC.querySelector('span[data-oid="'+oid+'"]');

      if(multi){
        multi.style.borderBottom="";
        multi.style.marginBottom="1px"
      }

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
      if(!images.length) return loopHandle = setTimeout(animLoop, animDelay);

      var prevIndex = getPrev(currIndex);
      var nextIndex = getNext(currIndex);

      var curr = images[currIndex].img;
      var prev = images[prevIndex].img;
      var next = images[nextIndex].img;

      curr.className = transClass;
      prev.className = animClass;

      next.style.opacity = 1;
      curr.style.opacity = 0;

      hideLast(images[prevIndex].layer+1)
      showCurrent(images[currIndex].layer+1);
      currIndex = nextIndex;

      loopHandle = setTimeout(animLoop, animDelay);
    }

  }
});