// Import all necessary modules
var gulp = require('gulp'),
    less = require('gulp-less'),
    prefix = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    connect = require('gulp-connect'),
    del = require('del'),

    // Chose port for runnig dev server on
    DEV_PORT = 4242,

    // Where are my LESS files and main less file name
    LESS_FOLDER =     'code/less/',
    LESS_FILES =      LESS_FOLDER + '**/*.less',
    LESS_MAIN_FILE =  LESS_FOLDER + 'main.less',

    // What to copy to public folder
    // to be distributed by dev server
    FILES = [ 'code/**/*.*', '!code/less/**/*'],

    // Name of public folder
    DIST_FOLDER = '_public/';

// Clean completely public folder
gulp.task('clean', function (cb) {
  del( DIST_FOLDER + '*', {force: true}, cb );
});

// Copy ALL files to public folder
gulp.task('copy', ['clean'], function () {
  return gulp.src( FILES )
    .pipe( gulp.dest( DIST_FOLDER ) )
    .pipe( connect.reload() );
});

// Copy JUST CHANGED files to public folder
gulp.task('copy:changed', function () {
  return gulp.src( FILES )
    .pipe( changed( DIST_FOLDER  ) )
    .pipe( gulp.dest( DIST_FOLDER ) )
    .pipe( connect.reload() );
});

// Start server with livereload enabled
gulp.task('connect', function () {
  connect.server({
    root: [ DIST_FOLDER ],
    port: DEV_PORT,
    livereload: true
  });
});

// Compile less files
gulp.task('less', function () {
  return gulp.src( LESS_MAIN_FILE )
    .pipe( less() )
    .pipe( prefix() )
    .pipe( gulp.dest( DIST_FOLDER + 'css/') )
    .pipe( connect.reload() );
});

// Compile less files
gulp.task('less:build', ['copy'], function () {
  return gulp.src( LESS_MAIN_FILE )
    .pipe( less() )
    .pipe( prefix() )
    .pipe( gulp.dest( DIST_FOLDER + 'css/') );
});

// Just build and compile everything and don't start the server and watchers
gulp.task('build', ['less:build'], function () {
  console.log('Build finished');
});

// Default entry point, compile, start watchers and dev server
gulp.task('default', ['build', 'connect'], function () {
  gulp.watch( FILES, ['copy:changed'] );
  gulp.watch( LESS_FILES, ['less'] );
  console.log('Watching files...');
});