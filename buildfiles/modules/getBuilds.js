var fs = require('fs');

var buildReg = /build\d{8}/; //Will break in November 2286!
var buildSorter = function(a,b){return a<b};


module.exports = function(dir,cb){
  fs.readdir(dir, function(err,files){
    if(err) return cb(err);

    var builds = files.filter(function(v){
      return buildReg.test(v);
    });

    cb(null,builds)

  });
};