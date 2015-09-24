module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // all of our configuration will go here

    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },
      // when this task is run, lint the Gruntfile and all js files in src
      build: ['Grunfile.js', ['public/javascripts/script.js', 'public/javascripts/goal.js']]
    },

    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'public/javascripts/script.min.js': 'public/javascripts/script.js', 
          'public/javascripts/goal.min.js': 'public/javascripts/goal.js'
        }
      }
    },

    less: {
      options : {
        compress: true
      },
      build: {
        files: {
          'public/stylesheets/style.css': 'public/less/style.less'
        }
      }
    },

    execute: {
      target: {
        src: './bin/www'
      }
    }

  });

  grunt.registerTask('default', ['jshint', 'uglify', 'less', 'execute']);

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-execute');

};