var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    server  = require('gulp-server-livereload'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    minifycss = require('gulp-minify-css'),
    jsmin = require('gulp-jsmin'),
    rename = require('gulp-rename'),
   // twig = require('gulp-twig'),
    concat = require('gulp-concat');

var jsSources = ['components/scripts/custom.js', 'components/scripts/maps.js'];

var sassSources = ['components/sass/style.scss'];
var htmlSources = ['www/templates/*.twig'];

//var jsonSources = ['builds/development/js/*.json'];

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(jsmin())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('www/public/js'))
        //.pipe(connect.reload())
        //.pipe(livereload());
});

// Compile Sass
gulp.task('sass', function() {
    gulp.src(['components/sass/*.scss'])
        .pipe(plumber())
        .pipe(sass({
            includePaths: ['components/sass', 'bower_components/foundation/scss'],
            outputStyle: 'expanded'
        }))
        .on('error', gutil.log)
        //.pipe(gulp.dest('www/public/css'))
        .pipe(concat('style.css'))
        //.pipe(minifycss())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('www/public/css'))
        //.pipe(connect.reload())
        //.pipe(livereload());
});


gulp.task('watch', function() {
   //livereload.listen();
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*scss', ['sass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch('bower_components/foundation/scss/foundation/components/*scss', ['sass']);
    //gulp.watch(jsonSources, ['json']);
});

/*gulp.task('connect', function() {
    connect.server({
        port: 8888,
        livereload: true
    });
});*/

/*gulp.task('compile', function () {
    'use strict';
    return gulp.src('index.twig')
        .pipe(twig({
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
        .pipe(gulp.dest('../../public'));
});*/


gulp.task('html', function() {
    gulp.src(htmlSources)
    //.pipe(connect.reload())
    //.pipe(livereload());
});

/*gulp.task('json', function() {
    gulp.src(jsonSources)
    .pipe(connect.reload())
});*/

gulp.task('webserver', function() {
  gulp.src('www/public')
    .pipe(server({
      port: 8888,
      livereload: true,
      directoryListing: true,
      open: true,
      debug: true
    }));
});



//gulp.task('default', ['html', 'json', 'sass', 'js', 'connect', 'watch']);
gulp.task('default', ['html', 'sass', 'js', 'webserver', 'watch']);