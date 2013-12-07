define(["esri/symbols/TextSymbol","esri/symbols/Font"],function(TextSymbol,Font){
  function addTextSymbol(map, text, geom, x, y, trackingArr){
    var txtsym=new TextSymbol(text), gra;
    txtsym.setOffset(x, y);
    txtsym.setFont=addTextSymbol.font;
    gra=new esri.Graphic(geom, txtsym);
    map.graphics.add(gra);
    trackingArr.push(gra);
    return txtsym;
  }
  addTextSymbol.font=new Font("14px","STYLE_NORMAL","VARIANT_NORMAL","WEIGHT_BOLDER");
  return addTextSymbol;
});