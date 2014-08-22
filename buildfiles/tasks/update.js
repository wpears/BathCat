var fs = require('fs');
var async = require('async');
var cheerio = require('cheerio');
var getBuilds = require('../modules/getBuilds')

module.exports = function(grunt){
  grunt.registerTask('update', 'Update build dependencies',function(){
    var done = this.async();

    fs.readFile('index.html',function(err,data){
      if(err){
        grunt.log.error("\nError reading index.html\n");
        return done();
      }

      var $ = cheerio.load(data);


    })

  });
}