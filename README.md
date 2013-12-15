Responsive App
---
A lightweight responsive full screen web appliction framework.
Built in html, css3, and javascript.

TODO
===
 - Verify IE and Mobile Support
 - Add build scripts
 - Add examples
 - Add support for subpanels
 - Write documentation

Features
===
 - Supports all modern browsers, IE 9+, iOS. Limited functionality in IE 7+

How it works
===

Use
===
**Option 1: Edit the html**

Clone the master branch. All dependencies are held in the `_site` folder.
Edit these files:
 - `_site/index.html`: Base html. Rather than creating a layout on the fly, the framework relies on static HTML and CSS for better performance [read the source](http://github.com/fgassert/responsive-app/_site/index.html) to see where to insert content.
 - `_site/css/style.css`: Additional styling information, edit this document to change framework appearance
Core files:
 - `_site/css/ra.css`: Core css.
 - `_site/js/ra.js`: Core javascript
 - `_site/js/classList.min.js`: [classList shim](https://github.com/eligrey/classList.js/blob/master/classList.js) for older browser support

**Option 2: Jekyll + GitHub Pages**

The Responsive App framework is built using [Jekyll](http://jekyllrb.com) and [Stylus](http://learnboost.github.io/stylus/) for css preprocessing.

Jekyll uses the [Liquid](http://liquidmarkup.org) templating engine.
`_templates/ra.html` is the main template for the Responsive app framework.
The files in `_includes` hold the html content for the app.

Fork this repository, switch to the `gh-pages` branch and replace `_includes/main-content.html` with your own content.
Go to http://<username>/github.io/responsive-app/ to see the changes!

Options and methods
===
Initialize the Responsive App framework using `ra = new ra({options})`.

**Default options:**
```
{
minWidth:640,        // minimum window width (px) for screen size to count as large, when window width is smaller than minWidth the layout will be condensed
panelWidth:284,      // panel width (px) in both large screen and small screen layouts.
panel2MaxHeight:200, // panel 2 max content height (px) when on screen bottom (large screen layout).
panel1:true,         // toggle panel 1 on/off
panel2:true          // toggle panel 2 on/off
}
```

**Methods**
The ra object supports the following methods
```
ra.gotoPanel({panel #})  \\ When in small screen mode, shifts the view to the given panel
                         \\ 0: main, 1: left, 2: right
ra.resize()              \\ Forces ra to recalculate panel sizes
ra.screenSize()          \\ Returns the current mode (#ra-container.className)
                         \\ Small: 'ra-small', Large: 'ra-large', Fullscreen, 'ra-fullscreen'
ra.toggleFullScreen()    \\ Toggles full screen mode. 
                         \\ In fullscreen mode the main content fills the entire window
ra.setConfig({options})  \\ Edits the ra options and recalculates panel appearance
ra.getConfig()           \\ Returns the current configuration
```




