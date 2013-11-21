var doc = document
  , canvasCache=[]
  , imgCache=[]
  , canPointer
  , imgPointer
  ;

function makeAndQuery(url,query){
  var can = getCanvas()
    , im = getImage()
    , ctx = can.getContext('2d')
    , width
    , height
    ;
  im.onload=function(){
    width = im.width;
    height = im.height;
    can.width = width;
    can.height = height;
    ctx.drawImage(im,0,0)
    query(ctx); //watch for leaks here. Remove the reference to context explicitly.
    release();
  }
  im.src=url;
}

function getCanvas(){
  var can = canvasCache[canPointer];
  if(!can){
    can = canvasCache[canPointer] = doc.createElement('canvas');
    canPointer++
  }
  return can
}
function getImage(){
  var img = imgCache[imgPointer];
  if(!img){
    img = imgCache[imgPointer] = doc.createElement('img');
    imgPointer++
  }
  return img
}

function release(ctx){
  imgPointer--;
  canPointer--;
  ctx.clearRect()

}



//Ident to get involved layers.
  //check on first click. If not undefined. Set as canvas background
  //on second click, calculate all points and query them out. Maybe do this in px, with a conversion from wmm.
  //also, do another identify, if different than the first, union the layers and add canvases for each layer
  // then query on these. render chart whenever finished




//make a canvas/img for each of the layers, pulling out of cache if possible. (otherwise create
//new elements, append, and update pointers)
//The onload gets set, then the blocking query happens.
//then, need to release to cache
// This will likely be fine. Need to watch memory.
// Don't have to put anything in the page


//on message, if loaded, set. (set includes marking unloaded.), else hold til loaded