var gulp = require('gulp'),
    less = require('gulp-less'),
    prefix = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    connect = require('gulp-connect'),
    del = require('del'),

    LESS = 'code/less/**/*.less',
    FILES = [ 'code/**/*.*', '!code/less/**/*'],
    DIST_FOLDER = '_public/';

gulp.task('clean', function (cb) {
  del( '_public/*', {force: true}, cb );
});

gulp.task('copy', ['clean'], function () {
  return gulp.src( FILES )
    .pipe( gulp.dest( DIST_FOLDER ) )
    .pipe( connect.reload() );
});

gulp.task('copy:changed', function () {
  return gulp.src( FILES )
    .pipe( changed( DIST_FOLDER  ) )
    .pipe( gulp.dest( DIST_FOLDER ) )
    .pipe( connect.reload() );
});

// Start server with livereload enabled
gulp.task('connect', function () {
  connect.server({
    root: ['_public'],
    port: 4242,
    livereload: true
  });
});

// Compile less files
gulp.task('less', function () {
  return gulp.src( 'code/less/main.less' )
    .pipe( less() )
    .pipe( prefix() )
    .pipe( gulp.dest('_public/css/') )
    .pipe( connect.reload() );
});

// Default entry point, compile, start watchers and dev server
gulp.task('default', ['copy', 'less', 'connect'], function () {
  gulp.watch( FILES, ['copy:changed'] );
  gulp.watch( LESS, ['less'] );
  console.log('Watching files...');
});

// Just build and compile everything and don't start the server and watchers
gulp.task('build', ['copy', 'less'], function () {
  console.log('Build finished');
});