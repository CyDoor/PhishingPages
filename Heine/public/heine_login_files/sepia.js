/*
	Set's a cookie SepiaID with the current sessionID as it's value.
	If the cookie is already existing, it won't be created again.
	The cookie will be available for one year, or until the user removes it.
*/
function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].replace(/^\s+|\s+$/g, '');
		if (c.indexOf(name)==0) {
			return c.substring(name.length,c.length);
		}
	}
	return;
}
/* check if cookie SepiaID exists and sessionId is available */
if ((typeof(getCookie('SepiaID')) === 'undefined') && (typeof(sessionId) !== 'undefined')) {
	setCookie('SepiaID', sessionId, 365);
}

SepiaStorageJS = {
	sepiaStorageUrl: '',
	
	invalidateAmpel: function(customerNumber, invalidateAmpel, sepiaId) {
		var that = this;
		var invalidateAmpelURL = that.addUrlParameter('customerNumber', customerNumber, that.sepiaStorageUrl);
		invalidateAmpelURL = that.addUrlParameter('invalidateAmpel' , invalidateAmpel, invalidateAmpelURL);
		invalidateAmpelURL = that.addUrlParameter('sepiaId', sepiaId, invalidateAmpelURL);

		$.ajax({
	    	url: invalidateAmpelURL,
	    	dataType: 'json',
	    	cache: false
		}).done(function(data) {
			if (data.message === 'ok' && data.success == true && data.data && data.data[0]) {
				that.addSessionStorageEntry('sepia:data', JSON.stringify(data.data));
			}
	    }).fail(function() {
	    	console.error('Error while requesting ' + invalidateAmpelURL);
		});			
	},
	
	sepiaData: function(sepiaId) {
		var that = this;
		if (typeof sepiaLogon != 'undefined' && sepiaLogon == true) {
			that.sepiaLoadedFalse();
		} else {
			var sepiaStorageUrlWithId = that.addUrlParameter('sepiaId', sepiaId, that.sepiaStorageUrl);
			$.ajax({
		    	url: sepiaStorageUrlWithId,
		    	dataType: 'json',
		    	cache: false
			}).done(function(data) {
				if ((typeof JSON == "object") && data.message === 'ok' && data.success == true && data.data && data.data[0]) {
					that.addSessionStorageEntry('sepia:data', JSON.stringify(data.data));
				}
				that.sepiaLoadedTrue();
		    }).fail(function() {
		    	console.error('Error while requesting ' + sepiaStorageUrlWithId);
			}).always(function() {
				SepiaStorageJS.triggerSepiaLoadedEvent();
			});			
		}
	},
	
	sepiaNL: function(orgSepiaId, emh) {
		var that = this;
		var sepiaNLURL = that.addUrlParameter('sepiaId', orgSepiaId, that.sepiaStorageUrl);
		sepiaNLURL = that.addUrlParameter('emh', emh, sepiaNLURL);
		$.ajax({
	    	url: sepiaNLURL,
	    	dataType: 'json',
	    	cache: false
		}).done(function(data) {
			if ((typeof JSON == "object") && data.message === 'ok' && data.success == true && data.data && data.data[0]) {
				that.addSessionStorageEntry('sepia:data', JSON.stringify(data.data));
			}
			that.sepiaLoadedTrue();
	    }).fail(function() {
	    	console.error('Error while requesting ' + sepiaNLURL);
		}).always(function() {
			SepiaStorageJS.triggerSepiaLoadedEvent();
		});	
		
	},
	
	addUrlParameter: function(key, value, url) {
		// check if url already contains GET parameters
		if(url.indexOf('?') != -1) {
			url = url + '&' + key + '=' + value;
		} else {
			url = url + '?' + key + '=' + value;
		}
		return url;
	},
	
	sepiaLoadedFalse: function() {
		this.addSessionStorageEntry('sepia:loaded', false);
	},
	
	sepiaLoadedTrue: function() {
		this.addSessionStorageEntry('sepia:loaded', true);
	},

	setSepiaStorageUrl: function(url) {
		this.sepiaStorageUrl = url;
	},
	
	addSessionStorageEntry: function(key, value) {
		try {
			if (!!window.sessionStorage) {
				sessionStorage.setItem(key, value);
			}
		} catch(e) {}
	},
	
	getSessionStorageEntry: function(key) {
		var result = null;
		try {
			if (!!window.sessionStorage) {
				result = sessionStorage.getItem(key);
			}
		} catch(e) {}
		return result;
	},
	
	triggerSepiaLoadedEvent: function() {
	    var eventData = {};
		if (SepiaStorageJS.getSessionStorageEntry('sepia:loaded') === 'true') {
			var rawData = $.parseJSON(SepiaStorageJS.getSessionStorageEntry('sepia:data'));
			if (null != rawData && !!rawData[0]) {				
				eventData.ampelValide = rawData[0].ampelValide;
				if (rawData[0].ampelValide == true) {
					var now = new Date();
					eventData.ampelRot = SepiaStorageJS.ampelTimestampToBoolean(rawData[0].ampelRot, now);
					eventData.ampelGelb = SepiaStorageJS.ampelTimestampToBoolean(rawData[0].ampelGelb, now);
					if (!eventData.ampelRot && !eventData.ampelGelb) {
						eventData.ampelGruen = true;
					} else {
						eventData.ampelGruen = false;
					}
				} else {
					eventData.ampelRot = false;
					eventData.ampelGelb = false;
					eventData.ampelGruen = false;
				}
				eventData.Misch = rawData[0].Misch;
				eventData.retourenstatus = rawData[0].retourenstatus;
				eventData.KuKlaTOP = rawData[0].KuKlaTOP;
				eventData.NL = rawData[0].NL;
			}
		}
		var event = $.Event('sepiaLoaded', { sepia: eventData } );
		$(document).trigger(event);
	},
	
	ampelTimestampToBoolean: function(/*Number*/ timestamp, /*Date*/ now) {
		var result = false;
		if (typeof timestamp !== 'undefined' && !!now) {
			result = new Date(timestamp) <= now;
		}
		return result;
	},
	
	init: function(url) {
		SepiaStorageJS.setSepiaStorageUrl(url);
		var sepiaId = $.cookie('SepiaID');
		
		if (typeof sepiaId != 'undefined') {	
			if ((typeof pNLRec != 'undefined') && (pNLRec != '')) {
				var orgSepiaId = $.cookie("SepiaID");
				$.removeCookie("SepiaID");
				$.cookie("SepiaID", pNLRec, {expires: 365, path:'/'});
				SepiaStorageJS.sepiaNL(orgSepiaId, pNLRec);
			}
			
			if ((sessionStorage.getItem('sepia:loaded') == null || sessionStorage.getItem('sepia:loaded') != 'true')
					|| (typeof sepiaLogon != 'undefined' && sepiaLogon == true) || (document.location.protocol==='http:' && document.referrer==='')) {
				SepiaStorageJS.sepiaData(sepiaId);
			} else {
				SepiaStorageJS.triggerSepiaLoadedEvent();
			}
			
			if (typeof invalidateAmpel != 'undefined' && invalidateAmpel == true) {
				SepiaStorageJS.invalidateAmpel(customerNumber, invalidateAmpel, sepiaId);
			}
		}
	}
}