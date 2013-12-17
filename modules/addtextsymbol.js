define(["esri/symbols/TextSymbol","esri/symbols/Font"],function(TextSymbol,Font){
  function addTextSymbol(map, text, geom, ang, trackingArr, handlers){
    var txtsym=new TextSymbol(text)
      , gra
      , offsetFactor = map.extent.getWidth()/100
      , x = Math.sin(0.87+ang)
      , y = Math.cos(0.87+ang)
      ;
    txtsym.setOffset(x*offsetFactor, y*offsetFactor);
    txtsym.setFont=addTextSymbol.font;
    gra=new esri.Graphic(geom, txtsym);
    map.graphics.add(gra);
    trackingArr.push(gra);
    handlers.push(map.on('zoom-end',function(zoomObj){
      var offsetFactor = zoomObj.extent.getWidth()/100;
      txtsym.setOffset(x*offsetFactor,y*offsetFactor)
    }));
    return txtsym;
  }
  addTextSymbol.font=new Font("14px","STYLE_NORMAL","VARIANT_NORMAL","WEIGHT_BOLDER");
  return addTextSymbol;
});