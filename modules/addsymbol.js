define(["esri/graphic"],function(Graphic){
  return function (map, geom, sy, trackingArr){
    console.log(arguments)
    var sym=new Graphic(geom, sy);
    map.graphics.add(sym);
    trackingArr.push(sym);
    console.log(sym)
    return sym;
  }
});
