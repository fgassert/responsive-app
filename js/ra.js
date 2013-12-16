/*
 * ra.js
 * Responsive framework for full screen applications
 *
 * Copyright 2013 Francis Gassert
 * Released under the MIT License
 */

var ra = function(window, document) {
    'use strict';

    
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
    var pfx = (function () {
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
    })();
    // `arraify` takes an array-like object and turns it into real Array
    // to make all the Array.prototype goodness available.
    var arrayify = function ( a ) {
        return [].slice.call( a );
    };
    // `css` function applies the styles given in `props` object to the element
    // given as `el`. It runs all property names through `pfx` function to make
    // sure proper prefixed version of the property is used.
    var css = function ( el, props ) {
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
    };
    // `byId` returns element with given `id` - you probably have guessed that ;)
    var byId = function ( id ) {
        return document.getElementById(id);
    };

    //////////////////////////////////////////////////////////

    // binds an event listener
    var bind = function (obj, event, callback) {
	if (!obj.addEventListener) {
	    //ie8
	    obj.attachEvent(event, callback);
	} else {
	    obj.addEventListener(event, callback, false);
	};
    };
    var toggle = function (obj, c) {
	obj.classList.toggle(c);
    };
    var arrAddC = function (obj, c) {
	for (var i=0;i<obj.length;i++) {
	    addC(obj[i],c);
	};
    };
    var addC = function (obj, c) {
	obj.classList.add(c);
    };
    var arrRemoveC = function (obj, c) {
	for (var i=0;i<obj.length;i++) {
	    removeC(obj[i],c);
	};
    };
    var removeC = function (obj, c) {
	obj.classList.remove(c);
    };

    var ra = function (options) {
	// DOM objects
	var container = byId('ra-container');
	var responsiveMenu = byId('ra-responsivemenu');
	var btnL = byId('ra-responsivemenu-btn-l');
	var btnR = byId('ra-responsivemenu-btn-r');
	var btnNav = byId('ra-nav-btn-showhide');
	var navButtons = byId('ra-nav-buttons');
	var headMatter = byId('ra-headmatter');
	var panelL = byId('ra-panel-l');
	var panelLContent = byId('ra-panel-l-content');
	var panelR = byId('ra-panel-r');
	var panelRContent = byId('ra-panel-r-content');
	var cover = byId('ra-cover');
	var main = byId('ra-main');

	// class names
	var hide = 'ra-hidden';
	var small = 'ra-small';
	var large = 'ra-large';
	var full = 'ra-fullscreen';

	// closure variables
	var currentPanel = 0;

	// default config
	var config = { 
	    minWidth:640, // minimum width for screen size to count as large
	    panelWidth:284, // panel width
	    panel2MaxHeight:200, // panel 2 max height when on screen bottom
	    panel1:true, // panel 1 on
	    panel2:true // panel 2 on
	};

	var screenSize = function() {
	    return container.className;
	};
	// translate container to view offscreen panels
	var _gotoX = function (x) {
	    css(container, {transform: "translate(" + x +"px, 0px)"});
	};
	// check to see if the screen changed from small to large or vice versa
	var _checkScreenChange = function () {
	    if (screenSize() === full) {
		return false;
	    };
	    if (window.innerWidth < config.minWidth) {
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
	};
	// resize respective panels
	var _onResize = function (x, force) {
	    var w, h;
	    if (_checkScreenChange() || force) {
		// only when screen mode changes 
		if (screenSize() === small) {
		    // if the screen is now small
		    // move headmatter to left panel
		    panelLContent.insertBefore(headMatter,panelLContent.childNodes[0]);
		    h = document.body.offsetHeight-responsiveMenu.offsetHeight;
		    w = config.panelWidth+'px';
		    css(panelL, {width: w, height: ''});
		    css(main, {height: h+'px', width:'', left:''});
		    css(panelR, {width: w, left:'100%',});
		} else if (screenSize() === large) {
		    // if the screen is now large
		    // move headmatter to top
		    container.insertBefore(headMatter,container.childNodes[0]);
		    w = config.panelWidth+'px';
		    css(panelL, {width: w});
		    css(main, {left: w});
		    css(panelR, {left: w});
		    css(panelRContent, {'max-height':config.panel2MaxHeight});
		    // make sure nave buttons are showing
		    removeC(navButtons,hide);
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
		w = document.body.offsetWidth-panelL.offsetWidth;
		h = document.body.offsetHeight-headMatter.offsetHeight;
		css(panelL, {height: h+'px'});
		css(panelR, {width: w+'px'});
		h -= panelR.offsetHeight;
		css(main, {width: w+'px', height: h+'px'});
	    };
	};
	// turn off panel
	var _hidePanel = function( panelId ) {
	    if (panelId === 1) {
		addC(panelL,hide);
		addC(btnL,hide);
	    } else if (panelId === 2) {
		addC(panelR,hide);
		addC(btnR,hide);
	    };
	    gotoPanel(0);
	};
	// turn on panel
	var _showPanel = function( panelId ) {
	    if (panelId === 1) {
		removeC(panelL,hide);
		removeC(btnL,hide);
	    } else if (panelId === 2) {
		removeC(panelR,hide);
		removeC(btnR,hide);
	    };
	};
	// toggle full screen main content
	var toggleFullScreen = function( ) {
	    if (screenSize() === full) {
		container.className = undefined;
		resize();
	    } else {
		container.className = full;
		resize();
	    };
	};
	
	// sets config and resets display
	var setConfig = function(options) {
	    for (var i in options) { 
		config[i]=options[i];
	    };
	    //reset display
	    config.panel1 ? _showPanel(1) : _hidePanel(1);
	    config.panel2 ? _showPanel(2) : _hidePanel(2);
	    resize();
	};
	// getConfig returns config object or named attribute
	var getConfig = function(key) {
	    return config[key] ? config[key] : config
	};
	// gotoPanel scrolls container to show panel 
	// if panel is currently shown return to showing panel0
	var gotoPanel = function (panelId) {
	    if (currentPanel === panelId || panelId === 0) {
		_gotoX(0);
		currentPanel = 0;
		// remove cover
		addC(cover, hide);
	    } else if (screenSize() === small) { 
		addC(navButtons, hide); 
		currentPanel = panelId;
		// place cover over the main content
		removeC(cover, hide);
		if (panelId === 1) {
		    _gotoX(config.panelWidth);
		} else if (panelId === 2) {
		    _gotoX(-config.panelWidth);
		};
	    };
	};
	// Recalculates panel sizes
	var resize = function() {
	    _onResize(false,true); 
	};
	
	// add event listeners to buttons
	bind(btnL,'click',function(x){gotoPanel(1)});
	bind(btnR,'click',function(x){gotoPanel(2)});
	bind(btnNav,'click',function(x){toggle(navButtons,hide)});
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

	// call setConfig and onResize to initialize display
	setConfig(options);
    };
    
    return ra;

}(window, document);
