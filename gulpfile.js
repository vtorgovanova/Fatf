// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

var config = {
    bowerDir: './bower_components'
};

// Styles
gulp.task('styles', function() {
    return gulp.src(['_scss/*.scss'])
        .pipe(sass({
            style: 'expanded'
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest('binaries/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src('img/**')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload(server))
        .pipe(gulp.dest('binaries/img'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Icons
gulp.task('fonts', function() {
    return gulp.src(config.bowerDir + '/font-awesome-sass/assets/fonts/**')
        .pipe(gulp.dest('binaries/fonts')); 
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['binaries/css', 'binaries/img'], {read: false})
        .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.run('styles', 'images', 'fonts');
});

// Watch
gulp.task('watch', function() {

    // Listen on port 35729
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err)
        }

        // Watch .scss files
        gulp.watch('_scss/**', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.run('styles');
        });

        // Watch image files
        gulp.watch('img/*', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.run('images');
        });

    });

});