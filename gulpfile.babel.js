'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import changed from 'gulp-changed';
import nodemon from 'gulp-nodemon';
//import eslint from 'gulp-eslint';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream'; //to 'rename' your resulting file
import buffer from 'vinyl-buffer'; // to transform the browserify results into a 'stream'
import browserify from "browserify";
import less from "gulp-less";
import path from "path";

const paths = {
    server_src: [
        "src/model/**/*.js",
        "src/server/**/*.js",
        "src/shared/**/*.js"
    ],
    server_dest: "build",

    server_views_src: "src/server/views/**/*.*",
    server_views_dest: "build/server/views",

    client_src: "src/client",
    client_dest: "build/client",

    less_src: "src/client/css/",
    less_dest: "build/client/css/",

    img_src: "src/client/img/**/*.*",
    img_dest: "build/client/img"
};

gulp.task('build-server', function () {
    gulp.src(paths.server_src, {base: "./src"})
        .pipe(changed(paths.server_dest))
        .pipe(babel({presets: ["es2015", "react"]}))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest(paths.server_dest));
});

gulp.task('copy-server-views', function () {
    gulp.src(paths.server_views_src)
        .pipe(changed(paths.server_views_dest))
        .pipe(gulp.dest(paths.server_views_dest));
});

gulp.task('start-server', function () {
    nodemon({
        verbose: true,
        watch: [
            "build/model/",
            "build/server/",
            "build/shared/"
        ],
        script: 'build/server/app.js',
        ext: 'js html ejs jsx',
        env: {'NODE_ENV': 'development'}
    })
});

gulp.task('build-client', function () {
    browserify(paths.client_src + '/entry.js')
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .on('error', console.log)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest(paths.client_dest));
});

gulp.task('build-less', function () {
    return gulp.src(paths.less_src + 'main.less')
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.less_dest));
});


gulp.task('copy-img', function () {
    gulp.src(paths.img_src)
        .pipe(changed(paths.img_dest))
        .pipe(gulp.dest(paths.img_dest));
});

gulp.task('watch', function () {
    gulp.watch([paths.server_src], ['build-server','build-client']);
    gulp.watch([paths.server_views_src], ['copy-server-views']);
    gulp.watch([paths.client_src + '/**/*.*'], ['build-client']);
    gulp.watch([paths.less_src + '/**/*.less'], ['build-less']);
    gulp.watch([paths.img_src ], ['copy-img']);
});

gulp.task('default', [
    'build-server',
    'copy-img',
    'build-client',
    'copy-server-views',
    'build-less',
    'start-server',
    'watch'
]);
