'use strict';

//Requrements
var gulp = require('gulp');
var plugin = require("gulp-load-plugins")({
   pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
   replaceString: /\bgulp[\-.]/
});
var wiredep = require("wiredep").stream;
var rimraf = require("rimraf");
var livereload = require('gulp-livereload');



//config paths
var config = require('config.json')('./config.json');
var root = config.root + "/";
var destination = config.end + "/";
var paths = {
   start: {
      html: root + config.folders.html + "/*.html",
      css: root + config.folders.css + "/*.css",
      less: root + config.folders.less + "/*.less",
      scss: root + config.folders.scss + "/*.scss",
      js: root + config.folders.js + "/**/*.js"
   },
   end: {
      html: destination + "/views/",
      css: destination,
      js: destination + "/scripts/",
   }
}

//////////
// HTML //
//////////

//move all the html files to the destination folder
gulp.task('html', function() {
   return gulp.src(root + "/**/*.html")
      .pipe(gulp.dest(destination));
});

/////////
// CSS //
/////////
gulp.task('compile-scss', function() {
   return gulp.src(paths.start.scss) //get our scss files
      .pipe(plugin.sass()) //compile them
      .pipe(gulp.dest(".temp-css")); //put them in a temp folder
});
gulp.task('compress-css', function() {
   return gulp.src(".temp-css/*.css") //get our temp css files
      .pipe(plugin.order([ //specify the order
         'reset.css', //reset goes first
         '*' //then the rest of the files
      ]))
      .pipe(plugin.concat('main.css')) //name the resulting file main.css
      .pipe(gulp.dest(paths.end.css)); //send it to destination
});
//injects all the css files into index.html
//dependencies: html, compile-scss, compress-css
gulp.task('inject-css', function() {
   return gulp.src('./dist/index.html') //get our index.html
      .pipe(plugin.inject( //call gulp-inject
         gulp.src(
            './dist/**/*.css', //get our css Files
            {
               read: false
            }), //do not read them (that makes it slow)
         {
            relative: true
         })) //when injecting the paths, do not include the dist folder)
      .pipe(gulp.dest('./dist'));
});

gulp.task("inject-NM-css", function() {
   return gulp.src('./dist/index.html') //get our index.html
      .pipe(plugin.inject( //call gulp-inject
         gulp.src(
            './node_modules/**/*.css', //get our css Files
            {
               read: false
            }), //do not read them (that makes it slow)
         {
            relative: true
         })) //when injecting the paths, do not include the dist folder)
      .pipe(gulp.dest('./dist'));
});

//compile all the sass files and move them to the destination folder
gulp.task('css', gulp.series(
   'compile-scss',
   'compress-css'
));

////////
// JS //
////////
//get bower dependencies, compress them and put them in the destination folder
gulp.task('bower', function() {
   return gulp.src(plugin.mainBowerFiles()) //gather all our bower dependencies
      .pipe(plugin.filter('**/*.js')) //filter to only js files
      .pipe(plugin.concat('bower.js')) //concat them all together into
      .pipe(gulp.dest(destination)); //send it to destination/js
});
//get all js files and put them in the destination folder
gulp.task('js', function() {
   return gulp.src(paths.start.js) //get our js files
      .pipe(gulp.dest(paths.end.js)); //move them to our destination folder
});
//injects all the js files into index.html
//line by line description found on inject-css
//dependencies: html, js
gulp.task('inject-js', function() {
   return gulp.src('./dist/index.html')
      .pipe(plugin.inject(
         gulp.src(
            './dist/**/*.js', {
               read: false
            }), {
            relative: true
         }))
      .pipe(gulp.dest('./dist'));
});


///////////
// Serve //
///////////
gulp.task('serve-ui', function() {
   return plugin.connect.server({ //create a little server for our site on localhost
      root: destination, //look for our code in the destination folder
      livereload: true, //reload the page if anything changes
      port: 9000, //make the connection on port 9000
   });
});

//auto open the browser to that url
gulp.task('open', function() {
   return plugin.open('http://localhost:9000');
});

//serve the ui and auto open the browser for the user
gulp.task('serve', gulp.parallel('serve-ui', 'open'));

////////////////
// Misc Files //
////////////////

gulp.task('images', function() {
   return gulp.src(root + '/images/**/*') //get our images folder
      .pipe(plugin.cache(plugin.imagemin({ //cache and minify our images
         optimizationLevel: 5, //optimize it good
         progressive: true,
         interlaced: true
      })))
      .pipe(gulp.dest(destination + '/images'));
});


////////////////////////////
// Production Preperation //
////////////////////////////
gulp.task('socket-io-production', function() {
   return gulp.src("./dist/index.html") //get the dist index file
      .pipe(plugin.replace("!!host!!", config.prod.url)) //replace !!host!! with our prod url
      .pipe(gulp.dest(destination));
});
gulp.task("server-path-prod", function() {
   return gulp.src("./dist/scripts/services/httpService.js")
      .pipe(plugin.replace("!!SERVERPATH!!", config.prod.url))
      .pipe(gulp.dest(destination + "/scripts/services/"));
});

function buildURL(connection, hostname, port) {
   return connection + "://" + hostname + ":" + port + "/";
}

//documentation found on socket-io-production
gulp.task('socket-io-local', function() {
   return gulp.src("./dist/index.html")
      .pipe(plugin.replace(
         "!!host!!",
         buildURL(config.localhost.connection, config.localhost.hostname, config.localhost.port)
      ))
      .pipe(gulp.dest(destination));
});

gulp.task("socket-io-local-connection", function() {
   return gulp.src("./dist/scripts/services/socketioservice.js")
      .pipe(plugin.replace(
         "!!host!!",
         buildURL(config.localhost.connection, config.localhost.hostname, config.localhost.port)
      ))
      .pipe(gulp.dest(destination + "/scripts/services/"));

});

gulp.task("socket-io-prod-connection", function() {
   return gulp.src("./dist/scripts/services/socketioservice.js")
      .pipe(plugin.replace(
         "!!host!!", config.prod.url
      ))
      .pipe(gulp.dest(destination + "/scripts/services/"));

});

gulp.task("server-path-local", function() {
   return gulp.src("./dist/scripts/services/httpService.js")
      .pipe(plugin.replace(
         "!!SERVERPATH!!",
         buildURL(config.localhost.connection, config.localhost.hostname, config.localhost.port)
      ))
      .pipe(gulp.dest(destination + "/scripts/services/"));
});


//////////////
// Cleaning //
//////////////
gulp.task('clean:tmp', function(cb) {
   return rimraf('.temp-css', cb);
});
gulp.task('clean:dist', function(cb) {
   return rimraf('./dist', cb);
});

///////////////////
// Task Managers //
///////////////////
gulp.task('build', gulp.series(
   //execute the file copying and compressing in parallel
   gulp.parallel('html', 'css', 'js', 'bower', 'images'),
   'inject-css',
   'inject-js'
));

//inject the js and css into main
gulp.task('inject', gulp.parallel('inject-css', 'inject-js'));
//remove all files and folders used for the build process
gulp.task('clean', gulp.parallel('clean:dist', 'clean:tmp'));
//clean and build again
gulp.task('rebuild', gulp.series('clean', 'build'));

//build, format the socket.io url to localhost and serve the site
gulp.task('local', gulp.series(
   'clean',
   'build',
   'socket-io-local',
   "server-path-local",
   "socket-io-local-connection",
   'serve'
));
//clean, build, and then format the socket.io url to the deployed instance
gulp.task('prod', gulp.series(
   'clean',
   'build',
   'socket-io-production',
   "socket-io-prod-connection",
   "server-path-prod"
));
//build for local by default
gulp.task('default', gulp.parallel('local'));