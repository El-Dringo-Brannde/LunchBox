//to install a dependency: npm install NAME --save-dev

//include gulp
var gulp = require('gulp');

//include the gulp scss compiler
var scss = require('gulp-scss');

//include a fancy destination locator
var dest = require('gulp-dest');

//include the autoprefixer (that auto creates support for old browsers)
var autoprefixer = require('gulp-autoprefixer');

var runSequence = require('run-sequence'); // runs tasks in a sequnce

//browser sync and runs a static server
var browserSync = require('browser-sync').create();

var reload = browserSync.reload;


//set the autoprefixer to work on
//  - the last two versions of all major browsers
//  - all browsers that have more than 5% market share
//  - firefox ESR
var autoprefixerOptions = {
   browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};


//handle an error instead of puking and dying
function handleError(error) {
   console.log(error.toString());
   this.emit('end');
}

var paths = {
   jsWatch: '**/*.js',
   scssWatch: '**/*.scss',
   htmlWatch: '**/*.html',

   scssComplile: 'ClientSide/scss/*.scss',
   htmlCompile: 'ClientSide/html/*.html'
}


//this will compile all our scss files
gulp.task('scss', function () {
   return gulp
      .src(paths.scssComplile)
      .pipe(scss())
      .pipe(autoprefixer())
      .pipe(dest('product', {
         ext: '.css'
      }))
      .pipe(gulp.dest('./'));
});

gulp.task('html', function () {
   return gulp
      .src(paths.htmlCompile)
      .pipe(dest('product'))
      .pipe(gulp.dest('./'));
});


gulp.task('js', function () {
   return;
})

var config = {
   port: 8080,
   browser: "google chrome",
   devBaseUrl: 'http://localhost'
}

gulp.task('browser-sync', function () {
   browserSync.init({
      server: {
         baseDir: "dist",
         index: "index.html",
         directory: false
      },
      port: config.port,
      open: "local",
      browser: config.browser,
      reloadOnRestart: true,
      notify: false,
      injectChanges: true
   });
});


gulp.task('build', function () {
   runSequence(
      'scss',
      'html'
   );
});


//gulp watch will do all the checking and work for us
gulp.task('default', function () {
   gulp.watch(paths.scssWatch, ['scss']);
   gulp.watch(paths.htmlWatch, ['html']);
});
