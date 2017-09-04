# Intro

* No styling frameworks are included in the site
* All styles are written in scss

# Organization

* Modules: code snippets to be reused through out the website.
* Variables: contains scss files with variables defining colors and anything else that would be good to standardize across stylesheets.
* Components: used to break up big files into smaller components.

## [SCSS coding guidelines](https://sass-guidelin.es/)

For this project:

* Use whatever indentation format was already there. Changing the indentations artificially inflates line count change and makes it hard to see what was really modified during a diff.
* Since this page is built with Angular and all stylesheets are loaded into the same file, compartmentalization is achieved by setting an id tag for a container over the whole page and then nesting all selectors and class elements under that tag.
* Some things should always be represented as a variable as it gives the codebase much more flexibility:
    * colors
    * media-query break points
* NO use of the !important tag. Keep it simple. If you want your rule to take priority and it isn’t, you should probably read up on [css specificity](https://css-tricks.com/specifics-on-css-specificity/).
* Do not use inline-html styles. This makes the code rigid and difficult to maintain.
* There is a discussion about whether to use ID's vs classes when applying css rules. I think a good rule of thumb is to add a class to anything that shows up more than once, and an ID to a singular item.
