var request = require("request");
var trans = require("stream").Transform;
var fs= require('fs');

var reg = /\.(\d)\d*/g;


function run(url,file){
  var t = new trans();
  t._transform = regStream;
  request(url).pipe(t).pipe(fs.createWriteStream(file));
}

function regStream(chunk, enc, cb){
  this.push(chunk.toString().replace(reg,".$1"));
  cb();
}


run(
    "http://mrsbmapp00642/ArcGIS/rest/services/BATH/data_out/MapServer/0/query?f=json&where=1%20%3D%201&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=102100"
   ,"data_out.js"
   );


run(
    "http://mrsbmapp00642/ArcGIS/rest/services/BATH/s_ti/MapServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=15&outFields=OBJECTID&outSR=102100"
   ,"s_ti.js"
   );
   