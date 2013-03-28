module.exports = function(grunt) {
// Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */ \n',
    concat: {
      prod: {
        src: ['app/lib/*.js', 'app/lib/**/*.js', 'app/*.js' ],
        dest: 'customforms.js',
        banner: '<%= banner %>',
        stripBanners: true
      },
      test: {
        src: 'test/specs/**/*.js',
        dest: 'test/tests.js',
        banner: '<%= banner %>',
        stripBanners: false
      },
      dev: {
        src: '<%= concat.prod.src %>',
        dest: 'demo/customforms.js',
        banner: '<%= banner %>',
        stripBanners: false
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        separtor: ';'
      },
      dist: {
        src: '<%= concat.prod.dest %>',
        dest: 'customforms.<%= pkg.version %>.min.js'
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
        globals: {
            module: false 
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['app/lib/**/*.js','app/app/**/*.js', 'app/*.js']
      }
    },
    qunit: {
        all: ['test/**/*.html']
    },
    docco: {
      all: {
          src: ['<%= concat.prod.dest %>'],
          dest: 'doc/'
      }   
    },
    watch: {
      js: {
          files: ['<%= concat.prod.src %>'],
          tasks: ['concat:dev', 'reload']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'test']
      },
      dev_test: {
        files: 'test/specs/**/*.js',
        tasks: ['concat:test', 'test']
      }
    },  
    bowerful: {
        store: 'components',
        dest: 'demo',
        packages: {
            jquery: ''
        }   
    }, 
    clean: {
        install: {
            src: '<%= bowerful.store.src %>'
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-bowerful');

  // Better naming conventions
  grunt.registerTask('lint', 'Lint javascript files with default validator', 'jshint');
  grunt.registerTask('min',  'Minify files with default minifier', 'uglify');
  grunt.registerTask('test', 'Unit testing on the command line with default testing framework', ['concat:test', 'qunit']);
  grunt.registerTask('dev', 'Watch javascript files and rebuild', 'watch:js');

  // docco
  grunt.loadNpmTasks('grunt-docco');

  // install 
  grunt.registerTask('install', 'Install javascript components defined on Gruntfile',  ['bowerful', 'clean:install']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'test', 'concat', 'uglify']);

};
