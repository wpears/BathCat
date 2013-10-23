define([],function(){
  function addTextSymbol(map, esri, text, geom, x, y, trackingArr){
    var txtsym=new esri.symbol.TextSymbol(text), gra;
    txtsym.setOffset(x, y);
    txtsym.setFont=addTextSymbol.font;
    gra=new esri.Graphic(geom, txtsym);
    map.graphics.add(gra);
    trackingArr.push(gra);
    return txtsym;
  }
  addTextSymbol.font=new esri.symbol.Font("14px","STYLE_NORMAL","VARIANT_NORMAL","WEIGHT_BOLDER");
  return addTextSymbol;
});