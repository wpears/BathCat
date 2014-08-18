module.exports = function(grunt){
  grunt.initConfig({
    dojo: {
      dist:{
        options: {
          dojo:'js/api_amd_38.min.js',          
          profile:'build.profile.js',
          basePath:'./',
          releaseDir:'./release',
          action:'release'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-dojo');
  grunt.registerTask('default',function(){
    grunt.task.run('dojo:dist')
  })

}

module.exports = function(grunt){
  grunt.initConfig({
    uglify:{
      options:{
        mangle:true,
        compress:true
      },
      my_target:{
        files:{
          './spree.min.js':['./spree.js']
        }
      }
    },
    watch:{
      files:['./spree.js'],
      tasks:['default']
    }
  })

  
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");


  grunt.registerTask('default',['uglify'])
};