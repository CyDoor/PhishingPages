/**
 * Script loader
 *
 */

(function () {
  var load_all = function (scripts) {
	var baseURL = '/'+storeName+'/',
		html = "";
	if (typeof jsLoadingVersion === 'string' && '' != jsLoadingVersion) {
		baseURL = baseURL + jsLoadingVersion + '/';
	}
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].indexOf('jquery-1.9.1')>-1) {
    	if (typeof jQuery != 'undefined') continue;
      }
      if (scripts[i].indexOf('swfobject')>-1) {
      	if (typeof swfobject == 'object') continue;
      }
      if (typeof window.skipselectorjs != 'undefined' && window.skipselectorjs === true && scripts[i].indexOf('selector.js')>-1 ) continue;
      if (typeof window.skipselectorlegacyjs != 'undefined' && window.skipselectorlegacyjs === true && scripts[i].indexOf('selector_legacy.js')>-1 ) continue;
      if (typeof window.donotminifyjs != 'undefined' && window.donotminifyjs === true) {
    	  if (scripts[i].indexOf('/min/')>-1) scripts[i] = scripts[i].substring(0,scripts[i].indexOf('/min/'))+scripts[i].substring(scripts[i].indexOf('/min/')+4);
      }
      if (scripts[i].indexOf('/')==0) scripts[i] = scripts[i].substring(1);
      html += '<script type="text/javascript" src="' + baseURL + scripts[i] + '"></script>'
    }
    document.write(html)
  }

  window.load = function (scripts) {
	  load_all(scripts)
  }
})()



/**
 * Loading configuration starts here
 */
load([
  '/js/ext/jquery.qtip.min.js',
  '/js/ext/jquery.cookie.js',
  '/js/hei.js',
  '/js/hei/cl/Page.js',
  '/js/hei/cl/widgets/dialog.js',
  '/js/hei/cl/widgets/flaplist.js',
  '/js/mustache.js'// used in recommendation.js and for navigation 
])


