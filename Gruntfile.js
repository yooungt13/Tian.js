module.exports = function(grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: './Tian.jQuery.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            all: {
                src: './Tian.js',
                options: {
                    bitwise: true,
                    camelcase: true,
                    curly: true,
                    eqeqeq: true,
                    forin: true,
                    immed: true,
                    indent: 4,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    noempty: true,
                    nonew: true,
                    //quotmark: 'single',
                    regexp: true,
                    undef: true,
                    unused: true,
                    trailing: true,
                    //maxlen: 120
                }
            }
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint')

    // 默认任务
    grunt.registerTask('default', ['uglify']);
}
