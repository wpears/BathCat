function convert(num){
  var rem216=num%65536
  var b = num%256;
  var g = (rem216-b)/256;
  var r = (num-rem216)/65536;
  return rgbToHex(r,g,b);
}

function rgbToHex(r,g,b){
  return decToHex(r)+decToHex(g)+decToHex(b);
}

var hexTable={
  10:'a',
  11:'b',
  12:'c',
  13:'d',
  14:'e',
  15:'f'
}

function hexDigit(dig){
  return dig > 9
       ? hexTable[dig]
       : dig.toString()
       ;
}

function decToHex(dec){
  var d2pre=dec%16;
  var d1pre = (dec-d2pre)/16;
  var d1 = hexDigit(d1pre);
  var d2 = hexDigit(d2pre);
  return d1+d2;       
}