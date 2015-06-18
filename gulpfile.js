// Import all necessary modules
var gulp =        require('gulp'),
    less =        require('gulp-less'),
    prefix =      require('gulp-autoprefixer'),
    changed =     require('gulp-changed'),
    connect =     require('gulp-connect'),
    flatten =     require('gulp-flatten'),
    plumber =     require('gulp-plumber'),
    logger =      require('gulp-logger'),
    bowerFiles =  require('main-bower-files'),
    del =         require('del'),
    util =        require('util'),
    browserSync = require('browser-sync'),

    // Chose port for runnig dev server on
    DEV_PORT = 3000,

    // Where are my LESS files and main less file name
    LESS_FOLDER =     'code/less/',
    FILES_LESS =      LESS_FOLDER + '**/*.less',
    LESS_MAIN_FILE =  LESS_FOLDER + 'main.less',

    // What to copy to public folder
    // to be distributed by dev server
    FILES = [
      'code/**/*.*',
      '!code/less/**/*'
    ],

    // Name of public folder
    DIST_FOLDER = '_public/';

// Global error handler for "plumber" plugin
var onError = function( err ) { util.inspect(err);};

// Prepare Browser-sync
gulp.task('browsersync', function () {
  browserSync.init({
    proxy: 'localhost:3000'
  });
});

// Clean completely public folder
gulp.task('clean', function (cb) {
  del( DIST_FOLDER + '*', {force: true}, cb );
});

// Copy ALL files to public folder
gulp.task('copy', ['clean'], function () {
  return gulp.src( FILES )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( gulp.dest( DIST_FOLDER ) );
});

// Copy JUST CHANGED files to public folder
gulp.task('copy:changed', function () {
  return gulp.src( FILES )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( logger({
      before: 'Copying of files started...',
      after: 'Copying of files finished.',
      showChange: false,
      display: 'name'
    }) )
    .pipe( changed( DIST_FOLDER  ) )
    .pipe( gulp.dest( DIST_FOLDER ) )
    .pipe( browserSync.stream() );
});

// Copy main files of libs added via Bower to public folder
// and flatten relative paths
gulp.task('copy:vendor', ['copy'], function () {
  return gulp.src( bowerFiles(), { base: 'bower_components'} )
    .pipe( flatten() )
    .pipe( gulp.dest( DIST_FOLDER + 'js/vendor/' ) );
});

// Start server with livereload enabled
gulp.task('connect', function () {
  connect.server({
    root: [ DIST_FOLDER ],
    port: DEV_PORT,
    livereload: false
  });
});

// Compile less files
gulp.task('less', function () {
  return gulp.src( LESS_MAIN_FILE )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( less() )
    .pipe( prefix() )
    .pipe( gulp.dest( DIST_FOLDER + 'css/') )
    .pipe( browserSync.stream() );
});

// Just build and compile everything and don't start the server and watchers
gulp.task('build', ['copy:vendor'], function () {
  console.log('Building files...');
  return gulp.src( LESS_MAIN_FILE )
    .pipe( less() )
    .pipe( prefix() )
    .pipe( gulp.dest( DIST_FOLDER + 'css/' ) );
});

// Default entry point, compile, start watchers and dev server
gulp.task('default', ['build', 'connect', 'browsersync'], function () {
  gulp.watch( FILES, ['copy:changed'] ).on( 'change', browserSync.reload );
  gulp.watch( FILES_LESS, ['less'] );
  console.log('Watching files...');
});
