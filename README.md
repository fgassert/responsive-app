Responsive App
---
A lightweight responsive framework for fullscreen web applications.
Built in HTML, CSS3, and javascript.

Supports all modern browsers, IE 8+, iOS.

### TODO
 - [ ] Verify IE and Mobile Support
 - [ ] Add build scripts
 - [ ] Add examples
 - [ ] Add support for subpanels
 - [ ] Write documentation

### How it works
The responsive app framework divides the screen realestate into four sections: two responsive panels, headmatter, and main content. See a [demo](http://fgassert.github.io/responsive-app/).

![layout](http://raw.github.com/fgassert/responsive-app/master/fullscreen-app-layout.png)

The framework is designed to be easily modified by inserting HTML into these sections. Rather than creating a layout on the fly, the framework relies on static HTML and CSS for better performance.

ra.js monitors window size and moves the respective panels. The main element is a div called `#ra-container`, which slides to the left and right to reveal the side panels when on small screens.

The `#ra-container` element is assigned a class depending on the screen mode:
```
.ra-large /* for normal window sizes */
.ra-small /* for small window sizes */
.ra-fullscreen /* when in full screen mode */
```

Use
===
### Option 1: Edit the html

Clone the master branch. All dependencies are held in the `_site` folder.

**Edit these files:**

`_site/index.html`: Base html. Rather than creating a layout on the fly, the framework relies on static HTML and CSS for better performance [read the source](https://github.com/fgassert/responsive-app/blob/master/_site/index.html) to see where to insert content.

`_site/css/style.css`: Additional styling information, edit this document to change framework appearance

**Core files:**

`_site/css/ra.css`: Core css.

`_site/js/ra.js`: Core javascript

`_site/js/classList.min.js`: [classList shim](https://github.com/eligrey/classList.js/blob/master/classList.js) for older browser support

### Option 2: Jekyll + GitHub Pages

The Responsive App framework is built using [Jekyll](http://jekyllrb.com) which uses the [Liquid](http://liquidmarkup.org) templating engine. 

Fork this repository, switch to the `gh-pages` branch and replace `_includes/main-content.html` with your own content.
Go to http://{username}/github.io/responsive-app/ to see the changes!

`_templates/ra.html` is the main template for the Responsive app framework.

`_includes/*` holds the html content for the app. Edit these files.

GitHub Pages and Jekyll will automatically compile the `gh-pages` repository into a static site located in the `_site` folder. The `index.html` file in the base directory tells Jekyll to use the `ra.html` template which then loads up the content in the `_includes` folder.

ra.js Options and methods
===

Initialize the Responsive App framework using `ra = new ra({options})`.

**Default options:**
```
{
  minWidth:640,        // minimum window width (px) for screen size to count as large, 
                       //  when window width is smaller than minWidth the layout will be condensed
  panelWidth:284,      // panel width (px) in both large screen and small screen layouts.
  panel2MaxHeight:200, // panel 2 max content height (px) when on screen bottom (large screen layout).
  panel1:true,         // toggle panel 1 on/off
  panel2:true          // toggle panel 2 on/off
}
```

**Methods:**

The `ra` object supports the following methods
```
ra.gotoPanel({panel #})  \\ When in small screen mode, shifts the view to the given panel
                         \\  0: main, 1: left, 2: right
ra.resize()              \\ Forces ra to recalculate panel sizes
ra.screenSize()          \\ Returns the current mode (#ra-container.className)
                         \\  Small: 'ra-small', Large: 'ra-large', Fullscreen, 'ra-fullscreen'
ra.toggleFullScreen()    \\ Toggles fullscreen mode. 
                         \\  In fullscreen mode the main content fills the entire window
ra.setConfig({options})  \\ Edits the ra options and recalculates panel appearance
ra.getConfig()           \\ Returns the current configuration
```




