module.exports = function (grunt) {

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
                reporter: require('jshint-stylish'), // use jshint-stylish to make our errors look and read good
                multistr: true
            },
            // when this task is run, lint the Gruntfile and all js files in src
            build: ['Grunfile.js', ['public/javascripts/global.js',
                'public/javascripts/indexPage.js',
                'public/javascripts/adminValidationPage.js',
                'public/javascripts/validationPage.js',
                'public/javascripts/corporateProfilePage.js',
                'public/javascripts/nonprofitProfilePage.js',
                'public/javascripts/resetPage.js',
                'public/javascripts/editProfilePage.js',
                'public/javascripts/volunteerProfilePage.js',
                'public/javascripts/searchPage.js',
                'public/javascripts/loginPage.js',
                'public/javascripts/goal.js']]
        },

        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'public/javascripts/global.min.js': 'public/javascripts/global.js',
                    'public/javascripts/indexPage.min.js': 'public/javascripts/indexPage.js',
                    'public/javascripts/adminValidationPage.min.js': 'public/javascripts/adminValidationPage.js',
                    'public/javascripts/validationPage.min.js': 'public/javascripts/validationPage.js',
                    'public/javascripts/corporateProfilePage.min.js': 'public/javascripts/corporateProfilePage.js',
                    'public/javascripts/nonprofitProfilePage.min.js': 'public/javascripts/nonprofitProfilePage.js',
                    'public/javascripts/resetPage.min.js': 'public/javascripts/resetPage.js',
                    'public/javascripts/editProfilePage.min.js': ['public/javascripts/editProfilePage.js', 'public/javascripts/goal.js'],
                    'public/javascripts/volunteerProfilePage.min.js': 'public/javascripts/volunteerProfilePage.js',
                    'public/javascripts/searchPage.min.js': 'public/javascripts/searchPage.js',
                    'public/javascripts/loginPage.min.js': 'public/javascripts/loginPage.js'
                }
            }
        },

        less: {
            options: {
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
                src: 'main.js'
            }
        }

    });

    grunt.registerTask('default', ['jshint', 'uglify', 'less', 'execute']);
    grunt.registerTask('prod', ['jshint', 'uglify', 'less']);

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