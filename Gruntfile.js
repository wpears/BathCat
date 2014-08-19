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
    copy: {
      main: {
        files:[
          {
            src: 'images/*',
            dest: 'built/'
          },
          {
            src:'fonts/*',
            dest:'built/'
          }
        ]
      }
    },
    watch:{
      files:['BathCat.js','BathCat.css'],
      tasks:['default']
    }
  })

  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-contrib-watch");


  grunt.registerTask('default', ['uglify','cssmin'])
  grunt.registerTask('build', ['uglify', 'cssmin', 'copy'])
};
