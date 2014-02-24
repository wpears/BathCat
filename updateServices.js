var request = require("request");
var trans = require("stream").Transform;
var fs= require('fs');

var reg = /\.(\d)\d*/g;


function run(url,file, varName){
  var t = new trans();
  t._transform = regStream;

  var out = fs.createWriteStream(file);

  out.write("window."+varName + "=");
  request(url).pipe(t).pipe(out);
}

function regStream(chunk, enc, cb){
  this.push(chunk.toString().replace(reg,".$1"));
  cb();
}
var server = process.argv[2];

if(!server) throw new Error("Must provide server name as first argument.");

run(
    "http://"+server+"/ArcGIS/rest/services/BATH/data_out/MapServer/0/query?f=json&where=1%20%3D%201&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=102100"
   ,"data_out.js"
   ,"DATA_OUTLINES"
   );


run(
    "http://"+server+"/ArcGIS/rest/services/BATH/s_ti/MapServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=15&outFields=OBJECTID&outSR=102100"
   ,"s_ti.js"
   ,"TIGHT_OUTLINES"
   );
