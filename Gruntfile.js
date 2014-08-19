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
      deploy: {
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

  grunt.registerTask('default','deploy');

};
