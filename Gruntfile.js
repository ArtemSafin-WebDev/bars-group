'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks("grunt-modernizr");

  grunt.initConfig({
    
    assemble: {
      options: {
        helpers: [
          'handlebars-helpers',
          'handlebars-helper-repeat'
        ],
        partials: 'src/templates/partials/**/*.hbs',
        layoutdir: 'src/templates/layouts',
        ext: '.html'
      },
      site: {
        expand: true,
        cwd: 'src/templates/pages',
        src: ['**/*.hbs'],
        dest: 'public/'
      }
    },

    modernizr: {
      dist: {
        "crawl": false,
        "customTests": [],
        "dest": "./public/js/modernizr-output.js",
        "tests": [
          "touchevents"
        ],
        "options": [
          "setClasses"
        ],
        "uglify": true
      }
    }

  });

};