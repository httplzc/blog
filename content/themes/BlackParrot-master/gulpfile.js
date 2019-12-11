'use strict';

// Packages
var gulp       = require('gulp');
var Q          = require('q');
var sourcemaps = require('gulp-sourcemaps');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var sass       = require('gulp-sass');
var rename     = require('gulp-rename');
var cssnano    = require('gulp-cssnano');
var image      = require('gulp-image');

// Paths
var bower = {
	bs4: 'components/bootstrap',
	flv: 'components/fluidvids/',
	sre: 'components/scrollreveal/'
};

var sassOpts = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var dir = {
  src: {
    js:  'assets/src/js/',
    scss: 'assets/src/scss/'
  },
  dist: {
    js: 'assets/dist/js/',
    css: 'assets/dist/css/'
  }
};

// Tasks
gulp.task('sync', function () {
  var deferred = Q.defer();

  setTimeout(function () {
    deferred.resolve();
  }, 200);

  return deferred.promise;
});

gulp.task('jsbuild', function () {
  return gulp.src([
  	bower.flv + 'dist/fluidvids.js',
		bower.sre + 'dist/scrollreveal.js',
  	dir.src.js + 'gm.search.js',
  	dir.src.js + 'gm.stickynav.js',
  	dir.src.js + 'main.js'
  	])
    .pipe(sourcemaps.init())
    .pipe(concat('blackparrot.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.dist.js));
});

gulp.task('jsmin', function () {
  return gulp.src(dir.dist.js + 'blackparrot.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.dist.js));
});

// Copy fonts from modules to dist
gulp.task('fonts', function() {
  return gulp.src(
    ['components/font-awesome/fonts/fontawesome-webfont.*']
    )
    .pipe(gulp.dest('assets/dist/fonts/'));
});
//
// Optimize PNG, JPEG, GIF, SVG and copy to dist/
gulp.task('images', function () {
  gulp.src('assets/src/img/*')
    .pipe(image())
    .pipe(gulp.dest('assets/dist/img/'));
});
//

gulp.task('cssbuild', function () {
  return gulp.src(dir.src.scss + 'blackparrot.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOpts).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.dist.css));
});

gulp.task('cssmin', function () {
  return gulp.src(dir.dist.css + 'blackparrot.css')
    .pipe(sourcemaps.init())
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.dist.css));
});

//
gulp.task('assets', ['fonts','images']);
//
gulp.task('styles', ['cssbuild','sync'], function () {
  gulp.start('cssmin');
});
//
gulp.task('scripts', ['jsbuild','sync'], function () {
  gulp.start('jsmin');
});
//

///
gulp.task('default', ['assets', 'scripts', 'styles']);
///
