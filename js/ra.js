/*
 * ra.js
 * Responsive framework for full screen applications
 *
 * Copyright 2013 Francis Gassert
 * Released under the MIT License
 */

var ra = function(window, document) {
    'use strict';
    
    var

    //////////////////////////////////////////////////////////
    /* HELPER FUNCTIONS
     * Extracted from impress.js
     *
     * Copyright 2011-2012 Bartek Szopka (@bartaz)
     *
     * Released under the MIT and GPL Licenses.
     *
     * ------------------------------------------------
     *  author:  Bartek Szopka
     *  version: 0.5.3
     *  url:     http://bartaz.github.com/impress.js/
     *  source:  http://github.com/bartaz/impress.js/
     */

    // `pfx` is a function that takes a standard CSS property name as a parameter
    // and returns it's prefixed version valid for current browser it runs in.
    // The code is heavily inspired by Modernizr http://www.modernizr.com/
    pfx = (function () {
        var style = document.createElement('dummy').style,
            prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            memory = {};
        return function ( prop ) {
            if ( typeof memory[ prop ] === "undefined" ) {
                var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
                memory[ prop ] = null;
                for ( var i in props ) {
                    if ( style[ props[i] ] !== undefined ) {
                        memory[ prop ] = props[i];
                        break;
                    }
                }
            }
            return memory[ prop ];
        };
    })(),
    // `arraify` takes an array-like object and turns it into real Array
    // to make all the Array.prototype goodness available.
    arrayify = function ( a ) {
        return [].slice.call( a );
    },
    // `css` function applies the styles given in `props` object to the element
    // given as `el`. It runs all property names through `pfx` function to make
    // sure proper prefixed version of the property is used.
    css = function ( el, props ) {
        var key, pkey;
        for ( key in props ) {
            if ( props.hasOwnProperty(key) ) {
                pkey = pfx(key);
                if ( pkey !== null ) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    },
    // `byId` returns element with given `id` - you probably have guessed that ;)
    byId = function ( id ) {
        return document.getElementById(id);
    },

    //////////////////////////////////////////////////////////

    // binds an event listener
    bind = function (obj, event, callback) {
	if (!obj.addEventListener) {
	    // IE8
	    obj.attachEvent('on'+event, callback);
	} else {
	    obj.addEventListener(event, callback, false);
	};
    },
    arrAddC = function (obj, c) {
	for (var i=0;i<obj.length;i++) {
	    addC(obj[i],c);
	};
    },
    addC = function (obj, c) {
	obj.classList.add(c);
    },
    arrRemoveC = function (obj, c) {
	for (var i=0;i<obj.length;i++) {
	    removeC(obj[i],c);
	};
    },
    removeC = function (obj, c) {
	obj.classList.remove(c);
    },
    getWindowWidth = function () {
	return window.innerWidth || document.documentElement.clientWidth;
    },
    getWindowHeight = function () {
	return window.innerHeight || document.documentElement.clientHeight;
    },
    px = function ( numeric ) {
	return numeric+'px';
    },

    ra = function (options) {
	// DOM objects
	var 
	
	container = byId('ra-container'),
	responsiveMenu = byId('ra-responsivemenu'),
	btnL = byId('ra-responsivemenu-btn-l'),
	btnR = byId('ra-responsivemenu-btn-r'),
	headMatter = byId('ra-headmatter'),
	panelL = byId('ra-panel-l'),
	panelLContent = byId('ra-panel-l-content'),
	panelR = byId('ra-panel-r'),
	panelRContent = byId('ra-panel-r-content'),
	cover = byId('ra-cover'),
	main = byId('ra-main'),

	// class names
	hide = 'ra-hidden',
	small = 'ra-small',
	large = 'ra-large',
	full = 'ra-fullscreen',

	// closure variables
	currentPanel = 0,

	// default config
	config = { 
	    minWidth:640, // minimum width for screen size to count as large
	    panelWidth:284, // panel width
	    panel2MaxHeight:150, // panel 2 max height when on screen bottom
	    panel1:true, // panel 1 on
	    panel2:true // panel 2 on
	},

	// custom events
	_screenChangeEvent = function( target ) {
	    target.dispatchEvent(
		new CustomEvent(
		    "ra-screenchange", 
		    { details: screenSize(), bubbles: true, cancelable: true }
		)
	    );
	},
	_panelChangeEvent = function( target ) {
	    target.dispatchEvent(
		new CustomEvent(
		    "ra-panelchange", 
		    { details: currentPanel, bubbles: true, cancelable: true }
		)
	    );
	},

	screenSize = function() {
	    return container.className;
	},
	// translate container to view offscreen panels
	_gotoX = function (x) {
	    if (pfx('transform') === null) {
		// IE8
		css(container, {left: x+'px'});
	    } else {
		css(container, {transform: "translate(" + x +"px, 0px)"});
	    };
	},
	// check to see if the screen changed from small to large or vice versa
	_checkScreenChange = function () {
	    if (screenSize() === full) {
		return false;
	    };  
	    if (getWindowWidth() < config.minWidth) {
		if (screenSize() === small) {
		    return false;
		} else {
		    container.className = small;
		    return true;
		};
	    } else {
		if (screenSize() === large) {
		    return false;
		} else {
		    container.className = large;
		    return true;
		};
	    };
	},
	// resize respective panels
	_onResize = function (x, force) {
	    var w, h;
	    if (_checkScreenChange() || force) {
		// dispatch event
		_screenChangeEvent(container);
		// only when screen mode changes 
		if (screenSize() === small) {
		    // if the screen is now small
		    // move headmatter to left panel
		    panelLContent.insertBefore(headMatter,panelLContent.childNodes[0]);
		    w = px(config.panelWidth);
		    css(main, {width:'',left:''})
		    css(panelL, {width: w, height: ''});
		    css(panelR, {width: w, left:'100%'});
		    css(panelRContent, {'max-height':''});
		} else if (screenSize() === large) {
		    // if the screen is now large
		    // move headmatter to top
		    container.insertBefore(headMatter,container.childNodes[0]);

		    css(panelL, {width: px(config.panelWidth)});
		    css(panelRContent, {'max-height':px(config.panel2MaxHeight)});
		    // reset screen view
		    gotoPanel(0);
		} else if (screenSize() === full) {
		    // reset css
		    css(main, {height: '', width:'', left:''});
		    gotoPanel(0);
		};  
	    };
	    if (screenSize() === large) {
		// resize panels
		h = getWindowHeight()-headMatter.offsetHeight;
		w = getWindowWidth()-panelL.offsetWidth;
		css(main, {left: px(w)});
		css(panelL, {height: px(h)});
		css(panelR, {left: px(panelL.offsetWidth), width: px(w)})
		h -= panelR.offsetHeight;
		css(main, {left: px(panelL.offsetWidth), width: px(w), height: px(h)});
	    } else if (screenSize() === small) {
		css(main,{height:px(getWindowHeight()-responsiveMenu.offsetHeight)});	
	    };
	},
	// turn off panel
	_hidePanel = function( panelId ) {
	    if (panelId === 1) {
		addC(panelL,hide);
		addC(btnL,hide);
	    } else if (panelId === 2) {
		addC(panelR,hide);
		addC(btnR,hide);
	    };
	    gotoPanel(0);
	},
	// turn on panel
	_showPanel = function( panelId ) {
	    if (panelId === 1) {
		removeC(panelL,hide);
		removeC(btnL,hide);
	    } else if (panelId === 2) {
		removeC(panelR,hide);
		removeC(btnR,hide);
	    };
	},
	// toggle full screen main content
	toggleFullScreen = function( ) {
	    if (screenSize() === full) {
		container.className = undefined;
		resize();
	    } else {
		container.className = full;
		resize();
	    };
	},
	// gotoPanel scrolls container to show panel 
	// if panel is currently shown return to showing panel0
	gotoPanel = function (panelId) {
	    if (currentPanel === panelId || panelId === 0) {
		_gotoX(0);
		currentPanel = 0;
		// remove cover
		addC(cover, hide);
		// dispatch event
		_panelChangeEvent(container);
	    } else if (screenSize() === small) { 
		currentPanel = panelId;
		// place cover over the main content
		removeC(cover, hide);
		if (panelId === 1) {
		    _gotoX(config.panelWidth);
		} else if (panelId === 2) {
		    _gotoX(-config.panelWidth);
		};
		_panelChangeEvent(container);
	    };
	},
	// Temporarily set panel1 width
	setPanel1Width = function ( w ) {
	    css(panelL, {width: w+'px'});
	    //TODO
	},
	// sets config and resets display
	setConfig = function(options) {
	    for (var i in options) { 
		config[i]=options[i];
	    };
	    //reset display
	    config.panel1 ? _showPanel(1) : _hidePanel(1);
	    config.panel2 ? _showPanel(2) : _hidePanel(2);

	    resize();
	},
	// getConfig returns config object or named attribute
	getConfig = function(key) {
	    return config[key] ? config[key] : config
	},
	// Recalculates panel sizes
	resize = function() {
	    _onResize(false,true); 
	};
	
	
	// add event listeners to buttons
	bind(btnL,'click',function(x){gotoPanel(1)});
	bind(btnR,'click',function(x){gotoPanel(2)});
	bind(cover,'click',function(x){gotoPanel(0)});
	// detect screen resize and orientation change (mobile)
	bind(window,'resize',_onResize);
	bind(document,'orientationchange',_onResize);

	// bind public properties
	this.gotoPanel = gotoPanel;
	this.resize = resize;
	this.screenSize = screenSize;
	this.toggleFullScreen = toggleFullScreen;
	this.setConfig = setConfig;
	this.getConfig = getConfig;
	this.setPanel1Width = setPanel1Width;

	// call setConfig and onResize to initialize display
	setConfig(options);
    };
    
    return ra;

}(window, document);

