var fs = require('fs');


function getBuildTag(){
  return (Date.now()/100000 >>0).toString();
}

module.exports = function(grunt){


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
            dest:'../dojo/'
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


  grunt.registerTask('minify', ['uglify','cssmin'])
  grunt.registerTask('deploy', ['uglify', 'cssmin', 'copy:deploy'])
  grunt.registerTask('build', ['deploy','copy:build'])
  grunt.registerTask("update", "Update build dependencies",function(){});
  //clean
  
  grunt.registerTask('default','deploy');

};
