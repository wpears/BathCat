module.exports = function(grunt){
  grunt.initConfig({
    uglify:{
      options:{
        mangle:true,
        compress:true
      },
      my_target:{
        files:{
          'built/BathCat.min.js':['BathCat.js']
        }
      }
    },
    cssmin:{
      minify:{
        files:{
          'built/BathCat.min.css':['BathCat.css']
        }

      }
    },
    watch:{
      files:['BathCat.js','BathCat.css'],
      tasks:['default']
    }
  })

  
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks("grunt-contrib-watch");


  grunt.registerTask('default',['uglify','cssmin'])
};