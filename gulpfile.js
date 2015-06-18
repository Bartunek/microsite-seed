// Import all necessary modules
var gulp =        require('gulp'),
    less =        require('gulp-less'),
    prefix =      require('gulp-autoprefixer'),
    changed =     require('gulp-changed'),
    connect =     require('gulp-connect'),
    flatten =     require('gulp-flatten'),
    react =       require('gulp-react'),
    coffee =      require('gulp-coffee'),
    plumber =     require('gulp-plumber'),
    logger =      require('gulp-logger'),
    bowerFiles =  require('main-bower-files'),
    del =         require('del'),
    util =        require('util'),

    // Chose port for runnig dev server on
    DEV_PORT = 4242,

    // Where are my LESS files and main less file name
    LESS_FOLDER =     'code/less/',
    FILES_LESS =      LESS_FOLDER + '**/*.less',
    LESS_MAIN_FILE =  LESS_FOLDER + 'main.less',

    // What to copy to public folder
    // to be distributed by dev server
    FILES = [
      'code/**/*.*',
      '!code/less/**/*',
      '!code/**/*.coffee',
      '!code/**/*.jsx'
    ],
    FILES_COFFEE =  [ 'code/**/*.coffee'],
    FILES_JSX =     [ 'code/**/*.jsx' ];

    // Name of public folder
    DIST_FOLDER = '_public/';

// Global error handler for "plumber" plugin
var onError = function( err ) { util.inspect(err);};


// Clean completely public folder
gulp.task('clean', function (cb) {
  del( DIST_FOLDER + '*', {force: true}, cb );
});

// Copy ALL files to public folder
gulp.task('copy', ['clean'], function () {
  return gulp.src( FILES )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( gulp.dest( DIST_FOLDER ) )
    .pipe( connect.reload() );
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
    .pipe( connect.reload() );
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
    livereload: true
  });
});

// Compile less files
gulp.task('less', function () {
  return gulp.src( LESS_MAIN_FILE )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( less() )
    .pipe( prefix() )
    .pipe( gulp.dest( DIST_FOLDER + 'css/') )
    .pipe( connect.reload() );
});

// Transpile CoffeeScript files
gulp.task('coffee', function () {
  return gulp.src( FILES_COFFEE )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( logger({
      before: 'Compiling CoffeeScript...',
      after: 'Compiling CoffeeScript finished.',
      showChange: false,
      display: 'name'
    }) )
    .pipe( coffee( { bare: true } ) )
    .pipe( gulp.dest( DIST_FOLDER ) );
});

// Transpile React JSX files
gulp.task('react', function () {
  return gulp.src( FILES_JSX )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( logger({
      before: 'Compiling JSX files...',
      after: 'Compiling JSX files finished.',
      showChange: false,
      display: 'name'
    }) )
    .pipe( react() )
    .pipe( gulp.dest( DIST_FOLDER ) );
});

// Just build and compile everything and don't start the server and watchers
gulp.task('build', ['copy:vendor', 'coffee', 'react'], function () {
  console.log('Building files...');
  return gulp.src( LESS_MAIN_FILE )
    .pipe( less() )
    .pipe( prefix() )
    .pipe( gulp.dest( DIST_FOLDER + 'css/') );
});

// Default entry point, compile, start watchers and dev server
gulp.task('default', ['build', 'connect'], function () {
  gulp.watch( FILES, ['copy:changed'] );
  gulp.watch( FILES_LESS, ['less'] );
  gulp.watch( FILES_COFFEE, ['coffee'] );
  gulp.watch( FILES_JSX, ['react'] );
  console.log('Watching files...');
});