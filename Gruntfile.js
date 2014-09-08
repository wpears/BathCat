
function getBuildTag(){
  return (Date.now()/100000 >>0).toString();
}

module.exports = function(grunt){

  var dojoBuildDir = '../dojo/';
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
            src: 'buildfiles/web.config',
            dest: buildDir + 'web.config'
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

  grunt.loadTasks('./buildfiles/tasks/'); //clean and update


  grunt.registerTask('minify', ['uglify','cssmin']);
  grunt.registerTask('deploy', ['uglify', 'cssmin', 'copy:deploy']);
  grunt.registerTask('build', ['deploy','copy:build']);

  
  grunt.registerTask('default',['deploy']);

};
