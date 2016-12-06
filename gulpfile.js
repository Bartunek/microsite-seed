// Import all necessary modules
var gulp =        require('gulp'),
    stylus =      require('gulp-stylus'),
    prefix =      require('gulp-autoprefixer'),
    changed =     require('gulp-changed'),
    connect =     require('gulp-connect'),
    flatten =     require('gulp-flatten'),
    plumber =     require('gulp-plumber'),
    logger =      require('gulp-logger'),
    concat =      require('gulp-concat'),
    sourcemaps =  require('gulp-sourcemaps'),
    babel =       require('gulp-babel'),
    jade =        require('gulp-pug'),
    bowerFiles =  require('main-bower-files'),
    rm =          require('gulp-rm'),
    util =        require('util'),
    browserSync = require('browser-sync'),

    // Chose port for runnig dev server on
    DEV_PORT = 3000,

    STYLUS_FOLDER =     'code/styl/',
    STYLUS_FILES =      STYLUS_FOLDER + '**/*.styl',
    STYLUS_MAIN_FILE =  STYLUS_FOLDER + 'main.styl',

    // What to copy to public folder
    // to be distributed by dev server
    FILES = [
      'code/**/*.*',
      '!code/**/*.pug',
      '!code/js/**/*',
      '!code/styl/**/*'
    ],

    // Javascript and JSX files, transpiled by Babel
    JS_FILES = 'code/js/**/*.{js,jsx}',

    // Jade Files to be transformed to HTML
    JADE_FILES = 'code/**/*.pug',

    // Name of public folder
    DIST_FOLDER = '_public/';

// Global error handler for "plumber" plugin
var onError = function( err ) { util.inspect(err);};

// Clean completely public folder
gulp.task('clean', function (cb) {
  gulp.src( DIST_FOLDER + '/**/*', { read: false } )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( rm({ async: false }) );
  cb();
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

// Prepare Browser-sync
gulp.task('browsersync', function () {
  browserSync.init({
    proxy: 'localhost:3000'
  });
});

// Compile jade files
gulp.task('jade', function () {
  return gulp.src( JADE_FILES )
    .pipe( jade({
      pretty: true
    }) )
    .pipe( gulp.dest( DIST_FOLDER ) );
});

// Compile stylus files
gulp.task('stylus', function () {
  return gulp.src( STYLUS_FILES )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( stylus({
      compress: true
    }) )
    .pipe( prefix() )
    .pipe( gulp.dest( DIST_FOLDER + 'css/' ) )
    .pipe( browserSync.stream() );
});

// Transpile Javascript and JSX files, concat them and save
gulp.task('babel', function () {
  return gulp.src( JS_FILES )
    .pipe( sourcemaps.init() )
    .pipe( concat( 'main.js' ) )
    .pipe( babel() )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest( DIST_FOLDER + 'js/') );
});

// Just build and compile everything and don't start the server and watchers
gulp.task('build', ['copy:vendor', 'babel', 'jade', 'stylus']);

// Default entry point, compile, start watchers and dev server
gulp.task('default', ['build', 'connect', 'browsersync'], function () {
  gulp.watch( FILES,        ['copy:changed'] ).on( 'change', browserSync.reload );
  gulp.watch( STYLUS_FILES, ['stylus'] );
  gulp.watch( JS_FILES,     ['babel'] ).on( 'change', browserSync.reload );
  gulp.watch( JADE_FILES,   ['jade'] ).on( 'change', browserSync.reload );
  console.log('Watching files...');
});
