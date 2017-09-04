# LunchBox

A social tool revolving around going out to lunch.

## Build & Development

1. `yarn install`
1. `bower install`
1. `gulp prod`

## Gulp Options

We are using [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0), which is a rather new release. This gulp file functions almost exactly the same as previous versions of gulp, but it has the added feature of being faster and being able to more smoothly run things [in parallel or in series](https://fettblog.eu/gulp-4-parallel-and-series/).

Gulp defaults to running a local build, which builds for development. This means simply typing `gulp` will go through steps to compile and render your code, without going through all the steps to minify and concatenate.

####Options and their subtasks:  
* `gulp prod`
   1. clean
   1. build
* `gulp local`
   1. build
   1. serve
* `gulp serve`
   * Loads the compiled code on the browser for live reloading an previewing of the site
* `gulp clean`
   * Removes all files and folders that was used for the build process

The gulp configuration pulls information from config.json. Anything relating to how you would like to structure your build, can be configured there.  

The output of the files in the destination folder do not have configuration options. This is to maintain consistency, and because the file placement doesn't really matter when it is compressed and concatenated.

For any more information on gulp, *Gulpfile.js* is well documented.

### *Config.json*

Json does not allow for comments in the code, so documentation for it is provided here.

root: where your app is stored  
end: where you would like your build to be placed  
folders: an object containing the name of the folders where your code is located  
localhost: an object containing the url information for where socket.io is hosted
prod: the url where the production socket.io is hosted  

The sole purpose of localhost and prod is to be able to format the path where socket.io can be found
