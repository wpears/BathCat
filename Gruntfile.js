var fs = require('fs');
var rimraf = require('rimraf');
var async = require('async');


function getBuildTag(){
  return (Date.now()/100000 >>0).toString();
}

module.exports = function(grunt){

  var dojoBuildDir = '../dojo/'
  var buildDir = 'build'+getBuildTag()+'/';
  var jsMin = buildDir + 'BathCat.min.js';
  var cssMin = buildDir + 'BathCat.min.css'

  var uglifyFiles = {};
  var cssMinFiles = {};

  uglifyFiles[jsMin] = ['BathCat.js'];
  cssMinFiles[cssMin] = ['BathCat.css'];


  grunt.initConfig({
    uglify:{
      options:{
        mangle:true,
        compress:true
      },
      my_target:{
        files:uglifyFiles
      }
    },
    cssmin:{
      minify:{
        files:cssMinFiles
      }
    },
    copy: {
      deploy: {
        files:[
          {
            src: 'images/*',
            dest: buildDir
          },
          {
            src:'fonts/*',
            dest: buildDir
          }
        ]
      },
      build: {
        files:[
          {
            src:'modules/*',
            dest:dojoBuildDir
          }
        ]
      }
    },
    watch:{
      files:['BathCat.js','BathCat.css'],
      tasks:['minify']
    }
  })

  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-contrib-watch");


  grunt.registerTask('minify', ['uglify','cssmin']);
  grunt.registerTask('deploy', ['uglify', 'cssmin', 'copy:deploy']);
  grunt.registerTask('build', ['deploy','copy:build']);

  grunt.registerTask("update", "Update build dependencies",function(){
    var done = this.async();

  });

  grunt.registerTask("clean", "Remove all but most recent build", function(){
    grunt.log.writeln("Removing old builds.");
    var done = this.async();
    fs.readdir('.',function(err,files){
      if(err){grunt.log.error("Error checking for old builds.")}

      var buildReg = /build\d{8}/; //Will break in November 2286!

      var buildSorter = function(a,b){return a<b};

      var builds = files.filter(function(v){
        return buildReg.test(v);
      });

      builds.sort(buildSorter);
      builds.pop();

      async.each(builds,rimraf,function(err){
        if(err)grunt.log.error("Didn't delete builds properly.");
        grunt.log.writeln("Builds cleaned.")
        done();
      });

    })
  });
  
  grunt.registerTask('default','deploy');

};
