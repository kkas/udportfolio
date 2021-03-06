/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    critical: { // https://github.com/bezoerb/grunt-critical
      test: {
        options: {
            base: './',
            css: [
                'test/fixture/styles/style-mobile.css',
                'test/fixture/styles/style.css'
            ]
            // ],
            // width: 320,
            // height: 70
        },
        src: 'test/fixture/index.html',
        dest: 'test/generated/index-critical.html'
      }
    },
    cssmin: {
      options: {
        keepBreaks: false,
        mergeAdjacent: true
      },
      target1: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['*.css', '!*.min.css'],
          dest: 'css',
          ext: '.min.css'
        }]
      },
      target2: {
        files: [{
          expand: true,
          cwd: 'views/css',
          src: ['*.css', '!*.min.css'],
          dest: 'views/css',
          ext: '.min.css'
        }]
      }
    },
    responsive_images: {
      mytask: {
        options: {
          engine: 'im',
          newFilesOnly: false,
          rename: true,
          quality: 50,
          sizes: [{
            width: 720,
            height: 540
          },
          {
            width: 100,
            height: 75
          }]
        },
        files: [{
          expand: true,
          src: ['views/images/pizzeria.jpg']
        }]
      }
    },
    imageoptim: {
      myPngs: {
        options: {
          jpegMini: false,
          imageAlpha: true,
          quitAfter: true
        },
        src: ['img/*.png', 'views/images/*.png']
      },
      myJpgs: {
        options: {
          jpegMini: true,
          imageAlpha: false,
          quitAfter: true
        },
        src: ['img/*.jpg', 'views/images/*.jpg']
      }
    },
    pagespeed: {
      options: {
        nokey: true
      },
      prod_desktop: {
        options: {
          url: "http://kkas.github.io/udportfolio/",
          locale: "en_GB",
          strategy: "desktop",
          threshold: 90
        }
      },
      prod_mobile: {
        options: {
          url: "http://kkas.github.io/udportfolio/",
          locale: "en_GB",
          strategy: "mobile",
          threshold: 90
        }
      },
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        mangle: false,
      },
      my_target: {
        files: {
          'js/perfmatters.min.js': ['js/perfmatters.js'],
          'views/js/main.min.js': ['views/js/main.js']
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-imageoptim');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-critical');
  grunt.loadNpmTasks('grunt-pagespeed');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

  // Tasks for production.
  grunt.registerTask('prod', ['critical', 'minify']);
  grunt.registerTask('minify', ['cssmin', 'uglify']);

  // Image optimization.
  grunt.registerTask('image', ['imageoptim']);
  grunt.registerTask('img-responsive', ['responsive_images']);

  // Tasks for PageSpped.
  grunt.registerTask('speedtest', ['pagespeed']);
  grunt.registerTask('pagespeed-desk', ['pagespeed:prod_desktop']);
  grunt.registerTask('pagespeed-mobi', ['pagespeed:prod_mobile']);
};
