module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'app/styles/app.css': 'app/styles/app.scss'
        }
      }
    },
    watch: {
      sass: {
        files: ['app/styles/**/*.scss'],
        tasks: ['sass:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass:dev', 'watch']);

};
