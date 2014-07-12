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