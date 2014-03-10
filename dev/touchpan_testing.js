//setTimeout(function(){map.disableMapNavigation()},300)



/*
if(!touch){
on(mapDiv,"mousedown",function(e){
  screenToMap = map.getScale()/pixelsPerMeter;
  var center = map.extent.getCenter()
    , centx = center.x
    , centy = center.y
    , sx = e.screenX
    , sy = e.screenY
    ; 
  var mover = on(W,"mousemove",function(e){
    console.log("mousemove");
    var mvx = e.screenX
      , mvy = e.screenY
      ;
  //  var p = new Point(centx+((mvx-sx)*screenToMap),centy+(mvy-sy)*screenToMap,spatialRef);
  //  console.log(p);
  //  map.centerAt(p);
  });
  on.once(W,"mouseup",function(e){
    var mvx = e.screenX
      , mvy = e.screenY
      ;
      console.log(mvx,mvy)
      var p=new Point(centx-(mvx-sx)*screenToMap,centy+(mvy-sy)*screenToMap,spatialRef);
      console.log(p);
    map.centerAt(p);
    mover.remove();
  }); 
});
}
*/

      var pixelsPerMeter = 3779.52; //based on 96 dpi
      var screenToMap;

      
if(0&&touch){
on(mapDiv,"touchstart",function(e){
  //map.navigationManager._swipeInitHandle.remove();
  var sx = e.screenX
    , sy = e.screenY
    , arr =[0,0]
    ;
  var mover = on(W,"touchmove",function(e){
    var mvx = e.screenX
      , mvy = e.screenY
      ;
    arr[0]=mvx-sx;
    arr[1]=mvy-sy;
    map.__pan(arr);
    })
  on.once(W,"touchend",function(e){
    var mvx = e.screenX
      , mvy = e.screenY
      ;
    arr[0]=mvx-sx;
    arr[1]=mvy-sy;
    console.log(arr);
  //map.__panEnd(arr);
    mover.remove();
  })
});
}
/*
on(map,"click",function(e){
  var mp=e.mapPoint;
  var sp=e.screenPoint;
  on.once(map,"mouse-down",function(e){
    var nmp=e.mapPoint;
    var nsp=e.screenPoint;
    var mxd=nmp.x-mp.x
      , myd=nmp.y-mp.y
      , sxd=nsp.x-sp.x
      , syd=nsp.y-sp.y
      , xrat=mxd/sxd
      , yrat=myd/syd
      ;
    console.log("map x: %f, map  y: %f, screen x: %f, screen y: %f, x ratio: %f, y ratio: %f, scale div ratio: %f",mxd,myd,sxd,syd,xrat,yrat,map.getScale()/xrat)
  })
})
*/