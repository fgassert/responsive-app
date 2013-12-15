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
	    obj[i].classList.add(c);
	};
    };
    var addC = function (obj, c) {
	obj.classList.add(c);
    };
    var arrRemoveC = function (obj, c) {
	for (var i=0;i<obj.length;i++) {
	    obj[i].classList.remove(c);
	};
    };
    var removeC = function (obj, c) {
	obj.classList.remove(c);
    };

    var ra = function (options) {
	// DOM objects
	var container = byId('ra-container');
	var responsiveMenu = byId('ra-main-responsivemenu');
	var btnL = byId('ra-main-responsivemenu-btn-l');
	var btnR = byId('ra-main-responsivemenu-btn-r');
	var btnNav = byId('ra-nav-btn-showhide');
	var navButtons = byId('ra-nav-buttons');
	var headMatter = byId('ra-headmatter');
	var panelL = byId('ra-panel-l');
	var panelR = byId('ra-panel-r');
	var cover = byId('ra-cover');
	var main = byId('ra-main');

	// class names
	var hide = 'ra-hidden';
	var small = 'ra-small';
	var large = 'ra-large';

	// closure variables
	var currentPanel = 0;

	var config = { minWidth:640, panelWidth:284 };
	for (var i in options) { 
	    config[i]=options[i];
	};

	
	// Scrolls container to show panel 
	// if panel is currently shown return to showing panel0
	var gotoPanel = function (panelId) {
	    if (currentPanel === panelId || panelId === 0) {
		gotoX(0);
		currentPanel = 0;
		addC(cover, hide);
	    } else if (isSmallScreen()) { 
		addC(navButtons, hide); 
		currentPanel = panelId;
		removeC(cover, hide);
		if (panelId === 1) {
		    gotoX(config.panelWidth);
		} else if (panelId === 2) {
		    gotoX(-config.panelWidth);
		};
	    };
	};
	var gotoX = function (x) {
	    css(container, {transform: "translate(" + x +"px, 0px)"});
	};
	var isSmallScreen = function() {
	    return container.className === small;
	};
	var checkScreenChange = function () {
	    if (window.innerWidth < config.minWidth) {
		if (isSmallScreen()) {
		    return false;
		};
		container.className=small;
		return true;
	    } else {
		if (!isSmallScreen()) {
		    return false;
		};
		container.className=large;
		return true;
	    };
	};
	var onResize = function (x, force) {
	    var w, h;
	    if (checkScreenChange() || force) {
		if (isSmallScreen()) {
		    // if the screen is now small
		    // move headmatter to left panel
		    panelL.insertBefore(headMatter,panelL.childNodes[0]);
		    h = document.body.offsetHeight-responsiveMenu.offsetHeight;
		    w = config.panelWidth;
		    css(panelL, {height: '', width:w+'px', left:(-w)+'px'});
		    css(main, {height: h+'px', width:'', left:''});
		    css(panelR, {width: w+'px', left:'', right:(-w)+'px'});
		} else {
		    // if the screen is now large
		    // move headmatter to top
		    container.insertBefore(headMatter,container.childNodes[0]);
		    w = panelL.offsetWidth;
		    css(panelL, {left: ''});
		    css(main, {left: w+'px'});
		    css(panelR, {left: w+'px'});
		    // make sure nave buttons are showing
		    removeC(navButtons,hide);
		    // reset screen view
		    if (currentPanel !== 0) {
			gotoPanel(0);
		    }
		};		
	    };
	    if (!isSmallScreen()) {
		w = document.body.offsetWidth-panelL.offsetWidth;
		h = document.body.offsetHeight-headMatter.offsetHeight;
		css(panelL, {height: h+'px'});
		css(panelR, {width: w+'px'});
		h -= panelR.offsetHeight;
		css(main, {width: w+'px', height: h+'px'});
	    };
	};
	var togglePanel = function( panelId ) {
	    if (panelId === 1) {
		toggle(panelL,hide);
		toggle(btnL,hide);
	    } else if (panelId === 2) {
		toggle(panelR,hide);
		toggle(btnR,hide);
	    };
	    gotoPanel(0);
    	    onResize(false,true);
	};
	// add event listeners to buttons
	bind(btnL,'click',function(x){gotoPanel(1)});
	bind(btnR,'click',function(x){gotoPanel(2)});
	bind(btnNav,'click',function(x){toggle(navButtons,hide)});
	bind(cover,'click',function(x){gotoPanel(0)});
	// detect screen resize and orientation change (mobile)
	window.onresize = onResize;
	bind(document,'orientationchange',onResize);

	// bind public properties
	this.gotoPanel = gotoPanel;
	this.togglePanel = togglePanel;
	this.forceResize = function(){onResize(false,true);};

	// call onResize to initialize display size
	onResize();
    };
    
    return ra;

}(window, document);
