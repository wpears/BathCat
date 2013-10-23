define([],function(){
  return function (map, esri, geom, sy, trackingArr){
    var sym=new esri.Graphic(geom, sy);
    map.graphics.add(sym);
    trackingArr.push(sym);
    return sym;
  }
});
