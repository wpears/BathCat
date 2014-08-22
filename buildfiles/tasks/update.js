var fs = require('fs');
var async = require('async');
var cheerio = require('cheerio');
var getBuilds = require('../modules/getBuilds')


module.exports = function(grunt){
  grunt.registerTask('update', 'Update build dependencies',function(){
    var done = this.async();

    async.map(['./','../dojo/'], getBuilds, function(err,buildsArr){
      if(err){
        grunt.log.error("\nError getting builds.\n");
        return done();
      }
      var bcBuildDir = './' + buildsArr[0].sort().pop();
      var dojoBuildDir = '../dojo/' + buildsArr[1].sort().pop();

      var bcSrc = bcBuildDir + '/BathCat.min.js';
      var bcHref = bcBuildDir + '/BathCat.min.css';
      var dojoSrc = dojoBuildDir + '/dojo/dojo.js';

      fs.readFile('index.html',function(err,data){
        if(err){
          grunt.log.error("\nError reading index.html\n");
          return done();
        }

        var $ = cheerio.load(data);

        $('#bcScript').attr('src',bcSrc);
        $('#bcLink').attr('href',bcHref);
        $('#dojoScript').attr('src',dojoSrc);


        fs.writeFile('index.html',$.html(),function(err){
          if(err){
            grunt.log.error("\nError writing html.\n");
          }
          grunt.log.writeln("\nindex.html sources updated to latest build.\n");
          return done();
        });

      });

    });

  });

}