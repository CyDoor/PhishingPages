SepiaUseraction = {

	dispatchActionByType : function(type) {
		if(typeof type != 'undefined') {
			if(type === 'pdv') {
				this.trackProductDetailViewVisit();
			} else if (type === 'bdv') {
				this.trackBundleDetailViewVisit();
			} else if (type === 'xp') {
				this.trackXpackVisit();
			} else if (type === 's') {
				this.trackSearchVisit();
			} else if (type === 'c') {
				this.trackContentVisit();
			} else if (type === 'b') {
				this.trackRating();
			}
		}
	},
	
	trackProductDetailViewVisit : function() {
		var catEntryId = $('#productdetail').data('productid');
		if(catEntryId != null) {
			var productObject = this.createBaseObject();
			productObject.type = 'pdv';
			productObject.catEntryId = catEntryId;
			this.doRequest(JSON.stringify(productObject));
		}
	},
	
	trackBundleDetailViewVisit : function() {
		var catEntryId = $('#bundledv').data('bundleid');
		if(catEntryId != null) {
			var bundleObject = this.createBaseObject();
			bundleObject.type = 'bdv';
			bundleObject.catEntryId = catEntryId;
			this.doRequest(JSON.stringify(bundleObject));
		}
	}, 
	
	trackXpackVisit : function() {
		var shNumber = $('#products').data('shnumber');
		// check if filter was used -> based on the fact if a div with id 'xpackFilter' is available in dom
		var $filterDiv = $('#xpackFilter');
		var filterUsed = jQuery.contains(document, $filterDiv[0]);
		if(shNumber != null) {
			var xpackObject = this.createBaseObject();
			xpackObject.type = 'xp';
			xpackObject.shNumber = shNumber;
			xpackObject.filter = filterUsed;
			this.doRequest(JSON.stringify(xpackObject));
		}
	},
	
	trackSearchVisit : function() {
		var catEntryIds = [];
		var searchTerm = $('#products').data('searchterm');
		if(searchTerm == null) {
			// no search result
			searchTerm = $('.searchresult').data('searchterm');
		}
		// check if filter was used -> based on the fact if a div with id 'searchFilter' is available in dom
		var $filterDiv = $('#searchFilter');
		var filterUsed = jQuery.contains(document, $filterDiv[0]);
		$('#products > li').each(function() {
		    catEntryIds.push(parseInt($(this).attr('id'), 10));
		});
		var searchObject = this.createBaseObject();
		searchObject.type = 's';
		searchObject.result = catEntryIds;
		searchObject.searchTerm = encodeURIComponent(searchTerm);
		searchObject.filter = filterUsed;
		this.doRequest(JSON.stringify(searchObject));
	},
	
	trackContentVisit : function() {
		var contentId = $('#cmsContent').data('contentid');
		if(contentId != null) {
			var contentObject = this.createBaseObject();
			contentObject.type = 'c';
			contentObject.content = encodeURIComponent(contentId);
			this.doRequest(JSON.stringify(contentObject));
		}
	},
	
	trackRating : function() {
		var catEntryId = $('#productdetail').data('productid');
		if(catEntryId != null) {
			var trackingObject = this.createBaseObject();
			trackingObject.type = 'b';
			trackingObject.content = catEntryId;
			this.doRequest(JSON.stringify(trackingObject));
		}
	},
	
	doRequest : function(data) {
		var that = this;
		$.ajax({
			type: 'POST',
	    	url: that.getUrl(),
	    	data: data,
	    	dataType: 'json',
	    	contentType: 'application/json',
	    	cache: false
	    });
	},
	
	createBaseObject : function() {
		var basicObject = new Object();
		basicObject.sepiaId = $.cookie('SepiaID');
		basicObject.sessionId = sessionId;
		basicObject.userAgent = navigator.userAgent;
		basicObject.timestamp = new Date;
		basicObject.url =  location.pathname + location.search + location.hash;
		return basicObject;
	},
	
	getUrl : function() {
		var hostname = location.hostname;
		var sepiaPath = featureParams.sepia.useractionPath;
		return '/FRCVN' + sepiaPath + 'ua';
	}
}