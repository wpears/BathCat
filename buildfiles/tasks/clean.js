var rimraf = require('rimraf');
var async = require('async');
var getBuilds = require('../modules/getBuilds');

var buildSorter = function(a,b){return a<b};

module.exports = function(grunt){

  grunt.registerTask('clean','Remove all but the newest build.', function(){

    grunt.log.writeln("\n\nRemoving old builds.\n");
    var done = this.async();

    getBuilds('.', function(err,builds){
     if(err){
        grunt.log.error("\nError checking for old builds.\n");
        return done();
      }

      builds.sort(buildSorter);
      builds.shift();

      async.each(builds,rimraf,function(err){
        if(err){
          grunt.log.error("\nDidn't delete builds properly.\n");
          return done();
        }
        grunt.log.writeln("\nBuilds cleaned.\n")
        done();
      });
    });
  });
}