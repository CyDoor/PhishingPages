(function($) {
$.i18n = {};

/** Map holding bundle keys */
$.i18n.map = {};
$.i18n.initialized = false;
    
/**
 * Load message bundle files from the server.
 * 
 * @param  source                 (string, optional) url to data source. Defaults to "/wcsstore/i18n.js"
 * @param  requestedBundles       (string/string[], optional) bundles to load (eg, '0,1,2,3,4' or [0,1,2,3,4,5,6]). Defaults to "[0,1,2,3,4,5,6,7,8,9]"
 * @param  callback               (function, optional) callback function to be called after script is terminated
 */
$.i18n.init = function(settings) {
    // set up settings
    var defaults = {
        source:				'/webapp/wcs/stores/servlet/i18n.json',
        requestedBundles:	['desktop.general', 
                         	 'desktop.footer', 
                         	 'desktop.myheine',
                         	 'desktop.checkout',
                         	 'desktop.storeErrorMessages',
                         	 'mobile.general',
                         	 'mobile.footer',
                         	 'mobile.myheine',
                         	 'mobile.checkout',
                         	 'mobile.storeErrorMessages'],
        storeId:			jsStoreId,
        catalogId:			jsCatalog,
        languageId:			jsLanguage,
        callback:			null
    };
    settings = $.extend({}, defaults, settings);
    var self = this,
		neededBundles = self.getNeededBundles(settings.requestedBundles);
    if (neededBundles.length > 0) {
    	var requestData = {};
		requestData['requestedBundles'] = neededBundles.join(',');
	    if (settings.storeId) {
	    	requestData['storeId'] = settings.storeId;
	    }
	    if (settings.catalogId) {
	    	requestData['catalogId'] = settings.catalogId;
	    }
	    if (settings.languageId) {
	    	requestData['langId'] = settings.languageId;
	    }
	    $.ajax({
	        type: 'GET',
	        dataType: 'json',
	        url: settings.source,
	        data: requestData,
	        async: false
	    }).done(function(json) {
	    	$.extend(self.map, json);
	    	self.initSuccess();
	    }).fail(function( jqxhr, textStatus, error ) {
	      var err = textStatus + ", " + error;
	      console.log( "Request Failed: " + err );
	    });
    } else {
    	self.initSuccess();
    }
    
    // call callback
    if(settings.callback){ settings.callback(); }
};
$.i18n.initSuccess = function() {
	this.initialized = true;
};

$.i18n.isInitialized = function() {
	return this.initialized;
};
$.i18n.getNeededBundles = function(requestedBundles) {
	var result = [],
		self = this;
	if ($.isArray(requestedBundles)) {
		$.each(requestedBundles, function(i, bundle) {
			// replace first '_' with a '.'
			var bundleToTest = bundle.toLowerCase().replace('_', '.');
			// replace all leftover '_' with ''
			bundleToTest = bundleToTest.replace(/_/g , '');
			if (!(bundleToTest in self.map)) {
				result.push(bundleToTest);
			}
		});
	}
	return result;
}
$.i18n.containsBundles = function(requestedBundles) {
	var requestedBundlesArray = requestedBundles.split(",");
	var containsAllBundles = true;
	var thisMap = this.map;
	$.each(requestedBundlesArray, function(i, bundle) {
		if (!(bundle in thisMap)) {
			containsAllBundles = false;
		}
	});
	return containsAllBundles;
};


/**
 * allows access to bundle values by specifying its key.
 * Eg, jQuery.i18n.message('com.company.bundles.menu_add')
 */
$.i18n.message = function(bundle, key, parametersIn) {
	if (!$.i18n.initialized) {
		return '[ i18n bundle not initialized ]';
	}
	var bundle = $.i18n.map[bundle];
	if (bundle == null) {
		return '???' + bundle + '???';
	}
    var value = bundle[key];
    if (value == null) {
        return '???' + key + '???';
    }
    
    var EXPRESSION_PATTERN = /(\{[^\}]+\})/g;
    var parameters = parametersIn || [];
    var result;

    while (result = EXPRESSION_PATTERN.exec(value)) {
		var placeholder = result[1];
        if (placeholder.length > 2) {
			var index = placeholder.substring(1, placeholder.length - 1);
			var regex = new RegExp("\\{" + index + "\\}", "g");
			value = value.replace(regex, (index < parameters.length) ? parameters[index] : "");
        }		
	}
    
    // decode html
    return value;
};
})(jQuery);