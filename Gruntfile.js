module.exports = function(grunt) {
    grunt.initConfig({
            // Metadata.
            pkg: grunt.file.readJSON('package.json'),
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */ \n',
            concat: {
                prod: {
                    src: ['app/lib/*.js', 'app/lib/**/*.js', 'app/*.js'],
                    dest: 'customforms.js',
                    banner: '<%= banner %>',
                    stripBanners: true
                },
                test: {
                    src: 'test/specs/**/*.js',
                    dest: 'test/tests.js',
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
                        module: false,
                        $: false
                    }
                },
                gruntfile: {
                    src: 'Gruntfile.js'
                },
                lib_test: {
                    src: ['app/lib/**/*.js', 'app/app/**/*.js', 'app/*.js']
                }
            },
            qunit: {
                all: ['test/**/*.html']
            },
            jsdoc: {
                dist: {
                    src: ['<%= concat.prod.src %>'],
                    options: {
                        destination: 'doc'
                    }
                }
            },
            watch: {
                js: {
                    files: ['<%= concat.prod.src %>'],
                    tasks: ['concat:prod']
                },
                gruntfile: {
                    files: '<%= jshint.gruntfile.src %>',
                    tasks: ['jshint:gruntfile']
                },
                lib_test: {
                    files: '<%= jshint.lib_test.src %>',
                    tasks: ['jshint:lib_test', 'utest']
                },
                dev_test: {
                    files: 'test/specs/**/*.js',
                    tasks: ['concat:test', 'utest']
                }
            },
            jsbeautifier: {
                files: ['<%= concat.prod.src %>', '<%= concat.test.src %>'],
                options: {
                    indent_size: 4,
                    indent_char: " ",
                    indent_level: 0,
                    indent_with_tabs: false,
                    preserve_newlines: true,
                    max_preserve_newlines: 10,
                    wrap_line_length: 80,
                    jslint_happy: false,
                    brace_style: "collapse",
                    keep_array_indentation: false,
                    keep_function_indentation: false,
                    space_before_conditional: true,
                    eval_code: false,
                    indent_case: false,
                    unescape_strings: false
                }
            },
            bowerful: {
                latest: {
                    store: 'components',
                    dest: 'demo',
                    destfile: 'vendor',
                    /*
            customtarget: {
                jquery: 'demo/jquery'
            },
            */
                    packages: {
                        jquery: ''
                    }
                },
                older: {
                    store: 'components',
                    dest: 'demo',
                    destfile: 'vendor-old',
                    /*
            customtarget: {
                jquery: 'demo/jquery'
            },
            */
                    packages: {
                        jquery: '1.6.0'
                    }
                }
            },
            clean: {
                installLatest: {
                    src: '<%= bowerful.latest.store.src %>'
                },
                installOlder: {
                    src: '<%= bowerful.older.store.src %>'
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
    grunt.registerTask('min', 'Minify files with default minifier', 'uglify');
    grunt.registerTask('utest', 'Unit testing on the command line with default testing framework', ['concat:test', 'qunit']);
    grunt.registerTask('dev', 'Watch javascript files and rebuild', 'watch:js');

    // documentation generation
    grunt.loadNpmTasks('grunt-jsdoc');

    // js-beautifier
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // install
    grunt.registerTask('install', 'Install javascript components defined on Gruntfile', ['bowerful:latest', 'clean:installLatest', 'bowerful:older', 'clean:installOlder']);

    // test
    grunt.registerTask('test', 'build and integration test', ['install', 'lint', 'utest']);

    // Default task.
    grunt.registerTask('default', ['jshint', 'utest', 'jsbeautifier', 'concat', 'uglify', 'jsdoc']);

};
