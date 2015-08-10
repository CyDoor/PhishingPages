HashHandle = function(method) {
	var methods = {
		/**
		 * @param params
		 *            the parameter string to parse. default:
		 *            window.location.hash
		 * @return the hash fragments as an object which holds the key/value
		 *         pairs
		 */
		get : function(params) {
			return methods["_parse"].call(this, params || window.location.hash);
		},
		/**
		 * add a new key=value hash or change an old one
		 * 
		 * @param key
		 *            the key of the param to add/change
		 * @param value
		 *            the value of the param to add/change
		 * @param changeHistory
		 *            indicate whether the adding/changing of the hash should
		 *            result in changed browser history. default: false
		 */
		add : function(key, value, changeHistory) {
			var hashParams = methods["get"].call(this, null);
			if (typeof key !== 'undefined') {
				hashParams[key] = value;
			}
			return methods["_changeLocation"].call(this, hashParams, changeHistory || false);
		},
		/**
		 * removes all hashes from the location
		 * 
		 * @param changeHistory
		 *            indicate whether the adding/changing of the hash should
		 *            result in changed browser history. default: false
		 */
		clear : function(changeHistory) {
			hashParams = {};
			return methods["_changeLocation"].call(this, hashParams, changeHistory || false);
		},
		/**
		 * removes the given hash from the location
		 * 
		 * @param key
		 *            name of the hash to remove
		 * @param changeHistory
		 *            indicate whether the adding/changing of the hash should
		 *            result in changed browser history. default: false
		 */
		remove : function(key, changeHistory) {
			var hashParams = methods["get"].call(this, null);
			delete hashParams[key];
			return methods["_changeLocation"].call(this, hashParams, changeHistory || false);
		},
		/**
		 * parses the given param string for parameters which will be added to
		 * an result object.
		 * 
		 * @return an object that holds the key/value pairs of the param string
		 *         or window.location.href
		 */
		_parse : function(hash) {
			var result = {};
			if (typeof hash === 'string') {
				if (hash.charAt(0) == "#") {
					hash = hash.substring(1);
				}
				if (hash != "") {
					var params = hash.split("&");
					for (var i = 0; i < params.length; i++) {
						var paramSplitted = params[i].split('=');
						switch (paramSplitted.length) {
						case 1:
							result[paramSplitted[0]] = "";
							break;
						case 2:
							result[paramSplitted[0]] = paramSplitted[1];
							break;
						}
					}
				}
			}
			return result;
		},
		/**
		 * stringifies the given object
		 * 
		 * @param params
		 *            the object which holds the hash parameters
		 * @return the object as string
		 */
		_stringify : function(params) {
			var tmpArr = [];
			for ( var key in params) {
				tmpArr.push(key + '=' + params[key]);
			}
			return tmpArr.join('&');
		},
		/**
		 * change the location
		 * 
		 * @param hashParams
		 *            the hashParams for the location
		 * @param changeHistory
		 *            whether or not the change of the location should result in
		 *            a history change
		 */
		_changeLocation : function(hashParams, changeHistory) {
			var fragment = '#' + methods["_stringify"].call(this, hashParams), 
				newLocation = ('' + window.location).split('#')[0] + fragment;
			if (changeHistory) {
				window.location = fragment;
			} else {
				if (window.history && window.history.replaceState) {
					window.history.replaceState( {}, '', newLocation);
					if ($ && $.mobile && $.mobile.urlHistory) {
						$.mobile.urlHistory.initialDst = fragment.substring(1);
						$.mobile.urlHistory.getActive().url = newLocation;
						$.mobile.urlHistory.getActive().hash = fragment;
					}
				} else {
					// causes jump to top of page in IE8
					// window.location.replace(newLocation);
				}
			}
			return this;
		}
	};
	
	method = method || 'get';
	if (!methods[method]) {
		throw "Invalid method '" + method + "'";
	} else {
		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	}
};