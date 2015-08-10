Wishlist = {
	wishlistManageUrl: '',
	wishlistUrl: '',
	wishlistItemsRequest: '',
	wishlistItemsRequestNeedsUpdate: false,
	wishlistEnabled: false,
	
	initialize: function() {		
		if (this.wishlistEnabled)
			this.updateItemCount();
	},
	
	setWishlistItemsRequest: function(wishlistItemsRequest) {
		this.wishlistItemsRequest = wishlistItemsRequest;
	},
	
	/**
	 * Tries to return the request saved in the variable wishlistItemsRequest.
	 * If it is not set yet, or the variable wishlistItemsRequestNeedsUpdate 
	 * is <code>true</code> a new request via getItems() will be executed and
	 * saved.
	 * 
 	 * This function can set the wishlistItemsRequestNeedsUpdate to <code>false</code>!
	 */
	getWishlistItemsRequest: function() {
		if(this.wishlistItemsRequest === '' || this.wishlistItemsRequestNeedsUpdate) {
			this.setWishlistItemsRequest(this.getItems());
			this.wishlistItemsRequestNeedsUpdate = false;
		}
		return this.wishlistItemsRequest;
	},
	
	setWishlistManageUrl: function(url) {
		if (typeof url === 'string' && url.length > 0 ) {
			this.wishlistManageUrl = url;
			this.wishlistEnabled = true;
		}
	},
	
	setWishlistUrl: function(url) {
		if (typeof url === 'string' && url.length > 0 ) {
			this.wishlistUrl = url;
			this.wishlistEnabled = true;
		}
	},
	
	updateItemCount: function() {
		if (! this.wishlistEnabled) return;
		var that = this;
		var sepiaURL = '/FRCVN' + featureParams.sepia.path + 'bookmarks/' + $.cookie('SepiaID');
		var itemCount = 0;
		$.ajax({
			dataType: "json",
			url: sepiaURL,
			cache: false
		}).done(function(data) {
			itemCount = that.getItemCountFromJSONResponse(data);
		})
		  .fail(function(data) {})
		  .always(function() {
			  that.updateMetaNav(itemCount);
			  that.updateMyAccount(itemCount);
		  });
	},
	
	getItemCountFromJSONResponse: function(response) {
		var jsonArray = response;
		var uniquePartNumberArr = [];
		$.each(jsonArray, function(key, value) {
			$.each(value.content, function(k, v) {
				var partNumber = v.partNumber;
				if($.inArray(partNumber, uniquePartNumberArr) == -1) {
					uniquePartNumberArr.push(partNumber);
				}
			})
		});
		return uniquePartNumberArr.length;
	},
	
	/**
	 * Updates the wish list item count in the meta navigation.
	 */
  	updateMetaNav: function(items) {
  		$('#js_wishlist_metanav').html(' (' + items + ')');
  	},
  	
  	/**
	 * Updates the wish list item count in the my account sidebar.
  	 */
  	updateMyAccount: function(items) {
  		$('#js_wishlist_myaccount').html(' (' + items + ')');
  	},

	/**
	 * The request to the servlet which will call the sepia api
	 * to retrieve the wish list.
	 * Returns the request.
	 */
	getItems: function() {
		var that = this;
		var ajaxRequest = $.ajax({
	    	url: that.getItemsUrl(),
	    	dataType: "json",
	    	cache: false
	    });
		return ajaxRequest;
	},
	
	/**
	 * The request to the servlet which will calls the Sepia API to add an item to the wishlist collection.
	 * This function can set the wishlistItemsRequestNeedsUpdate to <code>true</code>!
	 */
	addItem: function(catEntryId, mmoid, pController) {
		var that = this;
		$.ajax({
	    	url: that.getItemAddUrl(catEntryId, mmoid),
	    	dataType: 'json',
	    	cache: false
		}).done(function(data) {
			pController.triggerEvent('showAdd2WishlistLayerItemAdded');
			that.wishlistItemsRequestNeedsUpdate = true;
			that.updateItemCount();
			that.updateWishlistTextForDetailView(catEntryId);
	    }).fail(function() {
			console.error('Error while requesting ' + that.getItemAddUrl(catEntryId, mmoid));
		});
	},
	
	/**
	 * Remove item using proxy pass url.
	 */
	removeItem: function(catEntryId) {
		var url = '/FRCVN' + featureParams.sepia.path + 'bookmarks/article/' + $.cookie('SepiaID') + '/' + catEntryId;
		var ajaxRequest = $.ajax({
		    url: url,
		    type: 'DELETE',
		    cache: false
		});
		return ajaxRequest;
	},
	
	/**
	 * The request to the servlet which will call the sepia api
	 * to remove multiple items from the wish list.
	 * Returns the request.
	 */
	removeMultipleItems: function(catEntryIds) {
		var that = this;
		var ajaxRequest = $.ajax({
	    	url: that.getRemoveMultipleItemsUrl(catEntryIds),
	    	dataType: "json",
	    	cache: false
	    });
		return ajaxRequest;
	},
	
	removeAllItems: function() {
		var url = '/FRCVN' + featureParams.sepia.path + 'bookmarks/' + $.cookie('SepiaID');
		$.ajax({
		    url: url,
		    type: 'DELETE',
		    cache: false
		}).done(function(data){
			setTimeout(window.location.reload(), 150);
		});
	},
	
	/**
	 * Creates the request parameters which will be used to call the servlet which
	 * will add the given item id to the shopping bag.
	 * Executes the request to add the item and if it was added, the removeItem() function
	 * will be called.
	 * If the remove request was executed, the success layer will be shown and the mini basket
	 * will be updated.
	 */
	addItemToShoppingBag: function(catEntryId) {
		if (! this.wishlistEnabled) return;
		this.showAddToBasketLayer(false);
		var reqParams = {
	      quantity: 1,
	      catEntryId: catEntryId,
          calculationUsage: 1,
	      langId: jsLanguage,
	      storeId: jsStoreId
	    };
		var that = this;
	    $.ajax({
	    	url: addToBasketUrl,
	    	data: reqParams,
	    	dataType: "json",
	    	cache: false
	    }).done(function(addData) {
    		var removeRequest = that.removeItem(catEntryId);
    		removeRequest.done(function(removeData) {
    	    	that.showAdd2BasketLayerItemAdded(that.getWishlistItemInfosById(catEntryId));
        		that.updateMiniBasket();
    		});
    		if(typeof BasketRecoveryJS !== 'undefined') {
	    		// add item to sepia shopping bag api for basket recovery
	    		BasketRecoveryJS.addItemToSepia(catEntryId);
    		}
	    });
	},
	
	/**
	 * Creates the request parameters which will be used to call the servlet which
	 * will add all available items on the wish list to the shopping bag.
	 * The items will be determined by the id of the <code>li</code> elements.
	 * Executes the request to add the items.
	 * After the request all added items will be removed via removeMultipleItems() and
	 * the mini basket will be updated.
	 */
	addAllItemsToShoppingBag: function() {
		if (! this.wishlistEnabled) return;
		this.showAddToBasketLayer(true);
		var that = this;
		var wishlistItems = [];
		var j = 0;
		// create the request parameters for the add to basket request
		var reqParams = {
			calculationUsage: 1,
			langId: jsLanguage,
			storeId: jsStoreId
	    };
		var allListElements = $('ol').find('li.article-list-item');
		// add all viable items in an array and to the request params
		$(allListElements).each(function() {
			// only add this item if it is available (<li> doesn't have the class 'soldout')
			if(!$(this).hasClass('soldout')) {
				var id = $(this).attr('id');
				var q = 'quantity_'+j;
				var c = 'catEntryId_'+j;
				reqParams[q] = 1;
				reqParams[c] = id;
				wishlistItems.push(that.getWishlistItemInfosById(id));
				j++;
			}
		});
	    var addToBasketRequest = $.ajax({
	    	url: addToBasketUrl,
	    	data: reqParams,
	    	dataType: "json",
	    	cache: false
	    }).done(function(data) {
	    	that.removeMultipleItems(wishlistItems);
	    	that.showAdd2BasketLayerMultipleItemsAdded(wishlistItems, data);
    		that.updateMiniBasket();
	    });
	},
	
	/**
	 * Shows the add2basket layer while the add request will be executed.
	 * Calls hei.cl.widgets.dialog.layer to create the layer and passes the callback
	 * to reload the page, if the close button of the layer will be used.
	 */
	showAddToBasketLayer: function(multipleItems) {
		if (! this.wishlistEnabled) return;
		var output = [];
        output.push('<h2>');
        if (multipleItems) {
        	output.push($.i18n.message('desktop.general', 'bittewartena2bm'));
        } else {
        	output.push($.i18n.message('desktop.general', 'bittewartena2b'));
        }
        output.push('</h2>');
        output.push('<ul class="added">');
        output.push('<li class="wait">');
        output.push('<img src="'+storePath+'/images/elements/heinetasche.gif">');
        output.push('</li>');
        output.push('</ul>');
        output.push('<div style="clear: both;"></div>');
        output.push('<div class="btns">');
        output.push('<a id="basketLayer_back" class="backbutton left js_closelayer"><span class="backbutton">');
        output.push($.i18n.message('desktop.general', 'weitershoppen'));
        output.push('</span></a>');
        output.push('<a id="basketLayer_viewbasket" class="go right js_viewbasket" href="');
        output.push(viewBasketURL);
        output.push('"><span class="btGo">');
        output.push($.i18n.message('desktop.general', 'einkaufstascheansehen'));
        output.push('</span></a>');
        output.push('</div>');
        output.push('<ul id="a2brecomm" class="recommended"/>');
        var arts = new Array();arts.push('1'); //@TODO: Wird fuer adjustHeight benoetigt s.u.
        // adjust height: no. of article lines X line height + height recommendation
        hei.cl.widgets.dialog.layer(output.join(''),'wishlistAddToBasketLayer',{'adjustHeight':(arts.length/2)*(112+16)+178, 'closecallback': function(){setTimeout(window.location.reload(), 150);}});
	},
	
	/**
	 * Updates the add2basket layer, with the added item information.
	 */
	showAdd2BasketLayerItemAdded: function(wishlistItem) {
		if (! this.wishlistEnabled) return;
		// quickfix url
		var imageSrc = wishlistItem.image.replace('http://images.heine.de/asset/heine/mmo/hv_format_redesign_detail', window.location.protocol + '//images.heine.de/asset/heine/mmo/hv_format_redesign_thumb2');
		// check if src ends with '.jpg'
		if(!imageSrc.match(/.jpg$/)) {
			imageSrc += '.jpg';
		}
		var output = [];
		output.push('<li>');
		output.push('<div class="image"><img src="' + imageSrc + '" alt="" /></div>');
		output.push('<div class="info">');
		output.push('<h3>' + wishlistItem.name + '</h3>');
		output.push('<div class="price">' + wishlistItem.price + '</div>');
		output.push('<dl>');
		if (wishlistItem.dim1.length > 0) {
			output.push('<dt>' + $.i18n.message('desktop.general', 'farbe') + ':</dt>');
			output.push('<dd>' + wishlistItem.dim1 + '</dd>');
		}
		if (wishlistItem.dim2.length > 0) {
			output.push('<dt>' + $.i18n.message('desktop.general', 'groesse') + ':</dt>');
			output.push('<dd>' + wishlistItem.dim2 + '</dd>');
		}
		if (wishlistItem.dim3.length > 0) {
			output.push('<dt>' + $.i18n.message('desktop.general', 'variante') + ':</dt>');
			output.push('<dd>' + wishlistItem.dim3 + '</dd>');
		}
		output.push('</dl>');
		output.push('</div>');
		output.push('</li>');
		$('#wishlistAddToBasketLayer ul.added li.wait').before(output.join(''));
		$('#wishlistAddToBasketLayer ul.added li.wait').remove();
		$('#wishlistAddToBasketLayer h2').html($.i18n.message('desktop.general', 'fertiga2b'));
		// ECONDA
		try 
		{
			
			if (typeof emospro.content != "undefined") 
			{
				var tmp = emospro.content;
				//econdaOnClickEvent(type,ev_artno,ev_name,ev_price,ev_category,ev_amount,ev_source,ev_avail,ev_bundle,ev_mkz,ev_sku,ev_bdf,ev_size,e_sid,e_wkid,e_marker,e_content, useExistingEvent)
				econdaOnClickEvent("c_add", wishlistItem.artNo, wishlistItem.name, wishlistItem.price, 'NULL', 1, 'Merkzettel', 'NULL', 'NULL', wishlistItem.mkz, wishlistItem.sku, 'NULL', wishlistItem.dim2);
				emospro.content = tmp;
			}
		} 
		catch (ex) 
		{
			econdaConsole('ECONDA Tracking Error',ex);
        }
		return true;
	},
	
	/**
	 * Updates the add2basket layer, with the added items information.
	 */
	showAdd2BasketLayerMultipleItemsAdded: function(wishlistItems, data) {
		if (! this.wishlistEnabled) return;
		var output = [];
		for(var i in wishlistItems) {
			var imageSrc = wishlistItems[i].image.replace('http://images.heine.de/asset/heine/mmo/hv_format_redesign_detail', window.location.protocol + '//images.heine.de/asset/heine/mmo/hv_format_redesign_thumb2');
			// check if src ends with '.jpg'
			if(!imageSrc.match(/.jpg$/)) {
				imageSrc += '.jpg';
			}
			output.push('<li>');
			output.push('<div class="image"><img src="' + imageSrc + '" alt="" /></div>');
			output.push('<div class="info">');
			output.push('<h3>' + wishlistItems[i].name + '</h3>');
			output.push('<div class="price">' + wishlistItems[i].price + '</div>');
			output.push('<dl>');
			if (wishlistItems[i].dim1.length > 0) {
				output.push('<dt>' + $.i18n.message('desktop.general', 'farbe') + ':</dt>');
				output.push('<dd>' + wishlistItems[i].dim1 + '</dd>');
			}
			if (wishlistItems[i].dim2.length > 0) {
				output.push('<dt>' + $.i18n.message('desktop.general', 'groesse') + ':</dt>');
				output.push('<dd>' + wishlistItems[i].dim2 + '</dd>');
			}
			if (wishlistItems[i].dim3.length > 0) {
				output.push('<dt>' + $.i18n.message('desktop.general', 'variante') + ':</dt>');
				output.push('<dd>' + wishlistItems[i].dim3 + '</dd>');
			}
			output.push('</dl>');
			output.push('</div>');
			output.push('</li>');
		}
		$('#wishlistAddToBasketLayer ul.added li.wait').before(output.join(''));
		$('#wishlistAddToBasketLayer ul.added li.wait').remove();
		$('#wishlistAddToBasketLayer h2').html($.i18n.message('desktop.general', 'fertiga2bm'));
		// ECONDA
		try 
		{
			if (typeof emospro.content != "undefined") 
			{
				for (var i in wishlistItems) {
					wishlistItem = wishlistItems[i];
					var tmp = emospro.content;
					emospro.content = 'Payment/BasketOL';
					var tmp = emospro.content;
					//econdaOnClickEvent(type,ev_artno,ev_name,ev_price,ev_category,ev_amount,ev_source,ev_avail,ev_bundle,ev_mkz,ev_sku,ev_bdf,ev_size,e_sid,e_wkid,e_marker,e_content, useExistingEvent)
					econdaOnClickEvent("c_add", wishlistItem.artNo, wishlistItem.name, wishlistItem.price, 'NULL', 1, 'Merkzettel', 'NULL', 'NULL', wishlistItem.mkz, wishlistItem.sku, 'NULL', wishlistItem.dim2);
					emospro.content = tmp;
				}
			}
		} 
		catch (ex) 
		{
			econdaConsole('ECONDA Tracking Error',ex);
        }
		return true;
	},
	
	/**
	 * Retrieves the informations of an item by the data-tags of the <li> element.
	 * Will return a wishlistItem JSON.
	 */
	getWishlistItemInfosById: function(catEntryId) {
		var id = catEntryId;
		var jqueryIdentifier = '#'+id;
		var name = $(jqueryIdentifier).attr('data-itemname');
		var dim1 = $(jqueryIdentifier).attr('data-dim1');
		var dim2 = $(jqueryIdentifier).attr('data-dim2');
		var dim3 = $(jqueryIdentifier).attr('data-dim3');
		var image = $(jqueryIdentifier).attr('data-itemimage');
		var price = $(jqueryIdentifier).attr('data-price');
		var artNo = $(jqueryIdentifier).attr('data-partnumber').split('-')[0];
		var sku = $(jqueryIdentifier).attr('data-partnumber');
		var mkz = $(jqueryIdentifier).attr('data-mkz');
		var wishlistItem = {
			'id' : id,
			'name' : name,
			'dim1' : dim1,
			'dim2' : dim2,
			'dim3' : dim3,
			'image' : image,
			'price' : price,
			'sku' : sku,
			'mkz' : mkz,
			'artNo' :artNo
		}
		return wishlistItem;
	},
    
	generateKalRequest: function(articleElementsXML) {
		if (typeof articleElementsXML != 'string' || articleElementsXML == '') throw 'You have to provide the <Article> XML as a String';
		var requestStringBuffer = new Array();
		requestStringBuffer.push('<?xml version="1.0" encoding="utf-8"?>');
		requestStringBuffer.push('<tns:KALAvailabilityRequest xmlns:tns="http://'+window.hostname+'/KAL" ');
		requestStringBuffer.push('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ');
		requestStringBuffer.push('xsi:schemaLocation="http://www.heine.de/KAL http://'+window.hostname+'/KAL/KALAvailabilityRequestSchema.xsd">');
		requestStringBuffer.push('<Articles>');
		requestStringBuffer.push(articleElementsXML);
		requestStringBuffer.push('</Articles></tns:KALAvailabilityRequest>');
		return requestStringBuffer.join('');
	},

	/* Generates a KAL request string */
	getKalRequest: function() {
		var elementStringBuffer = new Array();
		function pushArticleElement(articleNo, size, promo, company) {
			elementStringBuffer.push('<Article>');
			elementStringBuffer.push('<CompleteCatalogItemNo>');
			elementStringBuffer.push(articleNo);
			elementStringBuffer.push('</CompleteCatalogItemNo>');
			elementStringBuffer.push('<SizeAlphaText>');
			elementStringBuffer.push(size);
			elementStringBuffer.push('</SizeAlphaText>');
			elementStringBuffer.push('<Std_Promotion>');
			elementStringBuffer.push(promo);
			elementStringBuffer.push('</Std_Promotion>');
			elementStringBuffer.push('<CustomerCompanyID>')
			elementStringBuffer.push(company);
			elementStringBuffer.push('</CustomerCompanyID>');
			elementStringBuffer.push('</Article>');
		}
		
		var partNumber, splitSKU, articleNo, promo, size = null;
		var allListElements = $('ol').find('li.article-list-item');
		$(allListElements).each(function() {
			partNumber = $(this).attr('data-partnumber');
			splitSKU = partNumber.split('-');
			articleNo = splitSKU[0];
			promo = "";
			size = splitSKU[1];
			pushArticleElement(articleNo, size, promo, '0');
		});
		return this.generateKalRequest(elementStringBuffer.join(''));
	},

	initializeAvailability: function() {
		if (! this.wishlistEnabled) return;
  		var allListElements = $('ol').find('li.article-list-item');
  		// only do a KAL request if min. 1 item is in wish list
  		if($(allListElements).length > 0) {
	  		var that = this;
	  		var lKalRequestURL = window.location.protocol + '//'+window.hostname+':'+location.port+'/KAL/AvailabilityServlet';
	  		var request = this.getKalRequest();
	        if (request != null) {
	            $.ajax({
	                type: "POST",
	                url: lKalRequestURL,
	                processData: false,
	                dataType: "xml",
	                timeout: 2000,
	                contentType: "application/xml; charset=UTF-8",
	                data: request
	            }).done(function(xmlResponse, textStatus, XMLHttpRequest) {
                    var availabilityArray = that.handleAvailabilityResponse(xmlResponse);
                    that.updateItemAvailability(availabilityArray);
            	});
	        }
  		}
  	},
  	
  	handleAvailabilityResponse: function(xmlResponse) {
  		try {
  	    	var availability = [];
  	        $(xmlResponse).find('Article').each(function() {
  	    		var l$KalArticle = $(this);
  	    		var lKalArticleNo = l$KalArticle.find('CompleteCatalogItemNo').first().text().substring(0, 6);
  	    		var lKalArticleSize = l$KalArticle.find('SizeAlphaText').first().text();
  	    		var lKalDeliveryDesignation = l$KalArticle.find('DeliveryDesignation').first().text();
  	    		lKalDeliveryDesignation = parseInt(lKalDeliveryDesignation);
  	    		var lKalDeliveryStatement = l$KalArticle.find('DeliveryStatement').first().text();
  	    		lKalDeliveryStatement = parseInt(lKalDeliveryStatement);
  	    		var availabilityCode, availabilityStatement = null;
  	            switch (lKalDeliveryDesignation) {
  	                case 0:
  	                  availabilityCode = 0;
  	                  availabilityStatement = globalData.availability[0]; // 'globalData' object inside 'availability.js'
  	                  break;
  	                case 1:
  	                  availabilityCode = 1;
  	                  availabilityStatement = globalData.availability[1]; // globalData object inside 'availability.js'
  	                  break;
  	                case 2:
  	                  availabilityCode = 2;
  	                  availabilityStatement = globalData.availability[2][lKalDeliveryStatement]; // globalData object inside 'availability.js'
  	                  // zu behandeln wie ausverkauft: An das Datenobjekt 2/103 wird 1/0 geschrieben
  	                  if (2 == lKalDeliveryDesignation && 103 == lKalDeliveryStatement) {
  	                    availabilityCode = 1;
  	                    availabilityStatement = globalData.availability[1]; // globalData object inside 'availability.js'
  	                  }
  	                  break;
  	            }
  	            availability[lKalArticleNo+"-"+lKalArticleSize] = {
  	    			'code':availabilityCode,
  	    			'statement':availabilityStatement
  	    		}
  	        });
  	        return availability;
  	    } catch (ex) {
  	    	console.log("*** Error: KAL parsing error: " + ex);
  	    }
  	},
  	
  	updateItemAvailability: function(availabilityArray) {
		if (! this.wishlistEnabled) return;
  		var allListElements = $('ol').find('li.article-list-item');
		$(allListElements).each(function() {
			partNumber = $(this).attr('data-partnumber');
			var availabilityItem = availabilityArray[partNumber];
			var code = availabilityItem.code;
			var statement = availabilityItem.statement;
			var cssClass = '';
			switch (code) {
				case 0:
					cssClass = 'available';
					break;
                case 2:
                	cssClass = 'later';
			}
			var availabilitySpan = $(this).find('.availability span');
			$(availabilitySpan).text(statement).addClass(cssClass);
			// special handling if item is sold out
			if(1 == code || (2 == code && 103 == statement)) {
				$(this).addClass('soldout');
				$(this).find('.leftArrow').remove();
				$(this).find('.rightArrow').remove();
				$(this).find('.js_addWishlistItemToBasket').remove();
				$(this).find('.unavailable').show();
			}
		});
  	},
  	
  	createTeaserUrl: function(mmoid) {
  		var url = window.location.protocol + '//images.heine.de/asset/heine/mmo/hv_format_redesign_thumb2/' + mmoid + '/.jpg';
  		return url;
  	},
	
	/**
	 * Check if the provided catEntryId is already added to the wishlist
	 * Use the provided wishlist to search for the id's.
	 * If no wishlist is provided the items will be received per API call.
	 */
	wishlistContainsId: function(catEntryId, wishlist) {
		var containsId = false;
		// check if wishlist is available and contains valid data
		if(typeof(wishlist) !== 'undefined' && typeof(wishlist.content) !== 'undefined' && typeof(wishlist.error) === 'undefined') {
			// first object in this array is the active wishlist, loop through it's content
			$.each(wishlist.content, function(i,item) {
				if(item.partNumber === catEntryId) {
					containsId = true;
					// stop looping
					return false;
				}
			});
		}
		return containsId;
	},
	
	updateWishlistTextForDetailView: function(catEntryId) {
		if (! this.wishlistEnabled) return;
		var that = this;
		this.getWishlistItemsRequest().done(function(wishlist) {
			if(that.wishlistContainsId(catEntryId, wishlist)) {
				$('.wishlist #js_wishlistNotAdded').hide();
				$('.wishlist #js_wishlistAdded').show();
			} else {
				$('.wishlist #js_wishlistNotAdded').show();
				$('.wishlist #js_wishlistAdded').hide();
			}
		});
	},
	
  	updateMiniBasket: function() {
		if (! this.wishlistEnabled) return;
  		var that = this;
  		$.ajax({
			url:servletRoot+"MiniBasketSolo?storeId="+jsStoreId,
			dataType:"html",
			cache: false
		}).done(function(data) {
			$(".minibasket").replaceWith(data);
		});
  	},
	
	getItemsUrl: function() {
		var retUrl = this.wishlistManageUrl;
		retUrl = this.addUrlParameter('task', 'G', retUrl);
		retUrl = this.addUrlParameter('sepiaId', $.cookie('SepiaID'), retUrl);
		return retUrl;
	},
	
	getCreateAndAddUrl: function(catEntryId, mmoid) {
		var addUrl = this.wishlistManageUrl;
		addUrl = this.addUrlParameter('task', 'C', addUrl);
		addUrl = this.addUrlParameter('catEntryId', catEntryId, addUrl);
		addUrl = this.addUrlParameter('mmoid', mmoid, addUrl);
		addUrl = this.addUrlParameter('sepiaId', $.cookie('SepiaID'), addUrl);
		return addUrl;
	},
	
	getItemAddUrl: function(catEntryId, mmoid) {
		var addUrl = this.wishlistManageUrl;
		addUrl = this.addUrlParameter('task', 'A', addUrl);
		addUrl = this.addUrlParameter('catEntryId', catEntryId, addUrl);
		addUrl = this.addUrlParameter('mmoid', mmoid, addUrl);
		addUrl = this.addUrlParameter('sepiaId', $.cookie('SepiaID'), addUrl);
		return addUrl;
	},
	
	getRemoveMultipleItemsUrl: function(catEntryIds) {
		var removeUrl = this.wishlistManageUrl;
		removeUrl = this.addUrlParameter('task', 'RMA', removeUrl);
		var that = this;
		$.each(catEntryIds, function(i,catEntryId) {
			removeUrl = that.addUrlParameter('catEntryId_'+i, catEntryId.id, removeUrl);
		});
		removeUrl = this.addUrlParameter('sepiaId', $.cookie('SepiaID'), removeUrl);
		return removeUrl;
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
	
	callLayer: function(location, cssClass) {
        $.ajax({
            type:'GET',
            url: location,
            cache: false
        }).done(function(data) {
            hei.cl.widgets.dialog.layer(data, cssClass);
        });
	}
}