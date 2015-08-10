SuggestJS = {
	/** 
	 * This variable controls the timer handler before triggering the autoSuggest.  If the user types fast, intermittent requests will be cancelled.
	 * The value is initialized to -1.
	 */
	autoSuggestTimer : -1,

	/** 
	 * This variable stores the index of the selected auto suggestion item when using up/down arrow keys.
	 * The value is initialized to -1.
	 */
	autoSelectOption : -1,	

	/** 
	 * This variable indicates whether or not the user is hovering over the autoSuggest results popup display.
	 * The value is initialized to false.
	 */
	autoSuggestHover : false,
	
	/** 
	 * This variable controls the delay of the timer in milliseconds between the keystrokes before firing the search request.
	 * The value is initialized to 10.
	 */
	autoSuggestKeystrokeDelay : 0,

	/** 
	 * This variable stores the old search term used in the auto suggest search box
	 * The value is initialized to empty string.
	 */
	autoSuggestPreviousTerm : '',	
	
	/** 
	 * This variable controls when to trigger the auto suggest box.  The number of characters greater than this threshold will trigger the auto suggest functionality.
	 * The static/cached auto suggest will be performed if this threshold is exceeded.
	 * The value is initialized to 1.
	 */
	AUTOSUGGEST_THRESHOLD : 1,	
	
	/** 
	 * This variable controls when to trigger the dynamic auto suggest.  The number of characters greater than this threshold will trigger the request for keyword search.
	 * The static/cached auto suggest will be be displayed if the characters exceed the above config parameter, but exceeding this threshold will additionally perform the dynamic search to add to the results in the static/cached results.
	 * This value should be greater or equal than the AUTOSUGGEST_THRESHOLD, as the dynamic autosuggest is secondary to the static/cached auto suggest.
	 * The value is initialized to 1.
	 */
	DYNAMIC_AUTOSUGGEST_THRESHOLD : 1,
	
	/** 
	 * This variable is an internal constant used in the element ID's generated in the autosuggest content.
	 * The value is initialized to 1000.
	 */
	CACHED_AUTOSUGGEST_OFFSET : 1000,
	
	/** 
	 * This variable sets the total number of static autosuggest recommendations used for each static category/grouping.
	 * The value is initialized to 3.
	 */
	TOTAL_SUGGESTED : 5,


	/** 
	 * This variable is used to indicate whether or not the auto suggest selection has reached the end of the list.
	 * The value is initialized to false.
	 */
	END_OF_LIST : false,	
	
	/**
	  * The auto suggest container ID's
	  */
	STATIC_CONTENT_SECTION_DIV : ['autoSuggestStatic_1', 'autoSuggestStatic_2', 'autoSuggestStatic_3'],
	
	/**
	 * URL to retrieve Cached suggestions
	 */
	CachedSuggestionsURL : '',

	/**
	 * URL to retrieve auto suggest keywords
	 */
	SearchAutoSuggestServletURL : '',
		
	/**
	 * Timeout variable for suggestions dropdown list
	 */
	searchSuggestionHoverTimeout : '',

	/**
	 * On Each Request totalResultCount is set. Necessary to show or hide the result box.
	 */
	totalResultCount : 0,
	
	init: function(searchContainer) {
		var that = this;
		// load categories and brands on focus
		$('.searchTerm', searchContainer).focus(function(event) {
//			that.retrieveCachedSuggestions();
			that.clearsearchTerm(searchContainer);
		});
		
		// load dynamic results at keyup
		$('.searchTerm', searchContainer).keyup(function(event) {
			that.doAutoSuggest(event, searchContainer);
		});
		
		// keypress
		$('.searchTerm', searchContainer).keypress(function(event) {
			return event.keyCode != 13;
		});
		
		// loses focus
		$('.searchTerm', searchContainer).blur(function(event) {
			clearTimeout(that.searchSuggestionHoverTimeout, searchContainer);
			that.searchSuggestionHoverTimeout = setTimeout(function(){SuggestJS.showAutoSuggest(false, searchContainer)},100);
		});
	},
	
	setCachedSuggestionsURL: function(url) {
		this.CachedSuggestionsURL = url;
	},
	
	setAutoSuggestURL: function(url) {
		this.SearchAutoSuggestServletURL = url;
	},
	
	clearsearchTerm: function(searchContainer) {
		$('.searchTerm', searchContainer).select();
		this.showAutoSuggestIfResults(searchContainer);	
		this.autoSuggestHover = false;
	},
	
	showAutoSuggestIfResults: function(searchContainer) {
		// if no results, hide the autosuggest box
//		if(typeof(staticContent) != 'undefined' && $('.' + this.STATIC_CONTENT_SECTION_DIV[0], searchContainer).html() == '' && $('.dynamicAutoSuggestTotalResults', searchContainer) == null) {
//			this.showAutoSuggest(false);
//		}
		if($('.searchTerm', searchContainer).val().length <= this.AUTOSUGGEST_THRESHOLD) {
			this.showAutoSuggest(false, searchContainer);
		} else if (this.totalResultCount > 0){
			this.showAutoSuggest(true, searchContainer);
		}
	},
	
	doAutoSuggest: function(event, searchContainer) {
		var searchTerm = $('.searchTerm', searchContainer).val();
		
		if(searchTerm.length <= this.AUTOSUGGEST_THRESHOLD ) {
			this.showAutoSuggest(false, searchContainer);
		}
		
		// Enter key
		if(event.keyCode == 13) {
			this.handleEnterKey(searchContainer);
			return;
		}
		
		// Arrow Up Key
		if(event.keyCode == 38) {
			var totalDynamicResults = $('.dynamicAutoSuggestTotalResults', searchContainer);
			if(this.END_OF_LIST) {
				this.END_OF_LIST = false;
				this.autoSelectOption--;
				if(!this.highLightSelection(true, this.autoSelectOption, searchContainer)) {
					if(this.autoSelectOption == this.CACHED_AUTOSUGGEST_OFFSET && totalDynamicResults.length > 0) {	
						this.autoSelectOption = totalDynamicResults.val() - 1;
						this.highLightSelection(true, this.autoSelectOption, searchContainer);
					}
				}
			} else if (this.highLightSelection(true, this.autoSelectOption-1, searchContainer)) {
				this.highLightSelection(false, this.autoSelectOption, searchContainer);
				this.autoSelectOption--;
			} else if(this.autoSelectOption == this.CACHED_AUTOSUGGEST_OFFSET && totalDynamicResults.length > 0) {
				this.highLightSelection(false, this.CACHED_AUTOSUGGEST_OFFSET, searchContainer);	
				this.autoSelectOption = totalDynamicResults.val() - 1;
				this.highLightSelection(true, this.autoSelectOption, searchContainer);
			} else {
				// up arrow back to the very top
				this.highLightSelection(false, this.autoSelectOption, searchContainer);
				this.autoSelectOption = -1;
				var originalKeyedSearchTerm = $('.autoSuggestOriginalTerm', searchContainer).val();
				this.resetAutoSuggestKeyword(searchContainer);
			}
			return;
		}
		
		// Arrow Down Key
		if(event.keyCode == 40) {
			if(this.highLightSelection(true, this.autoSelectOption + 1, searchContainer)) {
				this.highLightSelection(false, this.autoSelectOption, searchContainer);
				this.autoSelectOption++;
			} else if(this.autoSelectOption < this.CACHED_AUTOSUGGEST_OFFSET && this.highLightSelection(true, this.CACHED_AUTOSUGGEST_OFFSET, searchContainer)) {
				// down arrow into the cached autosuggest section
				this.highLightSelection(false, this.autoSelectOption, searchContainer);
				this.autoSelectOption = this.CACHED_AUTOSUGGEST_OFFSET;
				this.resetAutoSuggestKeyword(searchContainer);
			} else if(!this.END_OF_LIST) {
				this.highLightSelection(false, this.autoSelectOption, searchContainer);
				this.autoSelectOption++;
				this.END_OF_LIST = true;
			}
			return;
		}
		
		// set previous search term
		if(searchTerm.length > this.AUTOSUGGEST_THRESHOLD && searchTerm == this.autoSuggestPreviousTerm) {
			return;
		} else {
			this.autoSuggestPreviousTerm = searchTerm;
		}
		
		// don't handle search terms smaller than treshhold
		if(searchTerm.length <= this.AUTOSUGGEST_THRESHOLD) {
			return;
		};
		
		// cancel the dynamic search if one is pending
		if(this.autoSuggestTimer != -1) {
			clearTimeout(this.autoSuggestTimer);
			this.autoSuggestTimer = -1;
		}
		
		if(searchTerm != '') {
			this.autoSelectOption = -1;
			//var hasResults = this.doStaticAutoSuggest(searchTerm);
			if(searchTerm.length > this.DYNAMIC_AUTOSUGGEST_THRESHOLD) {
				var showHeader = true; // hasResults;
				this.doDynamicAutoSuggest(searchTerm, showHeader, searchContainer);
			} else {
				// clear the dynamic results
				$('.autoSuggestDynamic_Result_div', searchContainer).html('');
			}
		} else {
			this.clearAutoSuggestResults();
		}
	},
	
	resetAutoSuggestKeyword:function(searchContainer) {
		var originalKeyedSearchTerm = $('.autoSuggestOriginalTerm', searchContainer);
		if(originalKeyedSearchTerm.length > 0) {
			var searchBox = $('.searchTerm', searchContainer);
			searchBox.val(originalKeyedSearchTerm.val());
			this.autoSuggestPreviousTerm = originalKeyedSearchTerm.val();
		}
	},	
	
	highLightSelection:function(state, index, searchContainer) {
		var selection = $('.autoSelectOption_' + index, searchContainer);
		if(selection.length > 0) {
			if(state) {
				selection.addClass('autoSuggestSelected');
				var searchBox = $('.searchTerm', searchContainer);
				searchBox.attr('aria-activedescendant', 'suggestionItem_' + index);
				var totalDynamicResults = $('.dynamicAutoSuggestTotalResults', searchContainer);
				if(totalDynamicResults.length > 0 && index < totalDynamicResults.val()) {
					searchBox.val(selection.attr('title'));
					this.autoSuggestPreviousTerm = selection.attr('title');
					this.autoSuggestURL = '';
				}
				else {
					this.autoSuggestURL = selection.attr('href');
				}
			}
			else {
				selection.removeClass('autoSuggestSelected');
			}
			return true;
		}
		else {
			return false;
		}
	},	
	
	handleEnterKey: function(searchContainer) {
		if($('.searchTerm', searchContainer).val() != '') {
			if(this.autoSelectOption != -1) {
				//When enter key is hit with one of the suggested keywords or results highlighted
				var item = $('.autoSelectOption_' + this.autoSelectOption, searchContainer);
				var title = item.attr('title');
				var href = item.attr('href');
				$('.searchTerm', searchContainer).val(title);
				if(href == '#') {
					// search for keyword
					$('.searchbar', searchContainer).submit();
				} else {
					// open link to category or brand
					window.location.href = href;
				}
			} else {
				//Enter key is hit, when the focus was in search term input box.
				//Submit the form and get the results.			
				$('.searchbar', searchContainer).submit();
			}
			setTimeout(function(){SuggestJS.showAutoSuggest(false, searchContainer)},100);
		}
	},
	
	clearAutoSuggestResults: function(searchContainer) {
		// clear the static search results.
		for (var i = 0; i < staticContent.length; i++) {
			$('.' + this.STATIC_CONTENT_SECTION_DIV[i], searchContainer).html("");
		}
		this.autoSuggestPreviousTerm = "";
		this.autoSuggestURL = "";
		// clear the dynamic search results;
		$(".autoSuggestDynamic_Result_div", searchContainer).html("");
		this.showAutoSuggest(false, searchContainer);
	},
	
	doDynamicAutoSuggest: function(searchTerm, showHeader, searchContainer) {
		var that = this;
		// if pending autosuggest triggered, cancel it.
		if(this.autoSuggestTimer != -1) {
			clearTimeout(this.autoSuggestTimer);
			this.autoSuggestTimer = -1;
		};
		this.autoSuggestTimer = setTimeout(function() {

			$.getJSON(location.protocol+'//'+location.host+'/SearchComponentAutoSuggestView?searchTerm='+searchTerm, function(data) {
				
				var suggest_dynamic = [];
				var suggest_category = [];
				var suggest_brand = [];
				
				$('.heading', searchContainer).addClass('hidden');
				
				var categoryIndex = 1000;
				//var itemCount = 0;
				SuggestJS.totalResultCount = 0;
				
				$.each(data.suggestionGroups, function(key,val){
					if (val.indexName === "1keywords") {
						$.each(val.suggestions, function(keys, vals) {							
							suggest_dynamic.push('<li tabindex="-1" role="listitem" class="suggestionItem_'+keys+'">'+
												'<a title="'+vals.searchterm+'" class="autoSelectOption_'+keys+' suggest-item" onclick="SuggestJS.selectAutoSuggest(this.title); return false;"'+
												'onmouseover="SuggestJS.enableAutoSelect(&quot;'+keys+'&quot;,true,&quot;#'+searchContainer.attr('id')+'&quot;);" onmouseout="SuggestJS.enableAutoSelect(&quot;'+keys+'&quot;,false,&quot;#'+searchContainer.attr('id')+'&quot;);" href="#" role="listitem" class="">'+vals.searchterm+'</a>'+
												'</li>');
							
						});
						if (suggest_dynamic.length > 0) {
							$('.suggestedKeywordsHeader', searchContainer).removeClass('hidden');	
							SuggestJS.totalResultCount++;
						}
						$('.dynamicAutoSuggestTotalResults', searchContainer).val(suggest_dynamic.length);
					}
					
					if (val.indexName === "2categories") {							 
						$.each(val.suggestions, function(keys, vals) {
							var href='#';
							if (typeof(vals.catid) !== 'undefined' && vals.catid != null) {
								var shnumbers = vals.catid.match(/[sh]+[0-9]+/g);
								
								if (typeof(shnumbers) !== 'undefined' && shnumbers != null) {
									var shnumber = shnumbers[shnumbers.length-1];
									var href = location.protocol+'//'+location.host+'/ExtIF?CategoryName='+shnumber;
								}
							}
							
							var titles = vals.mlValue.split(">");
								title = titles[titles.length-1].replace(/^ /, "");
								
							suggest_category.push('<li tabindex="-1" role="listitem" class="suggestionItem_'+categoryIndex+'">'+
												'<a title="'+title+'" class="autoSelectOption_'+categoryIndex+' suggest-item" onclick="SuggestJS.selectAutoSuggest(this.title); return false;"'+
												'onmouseover="SuggestJS.enableAutoSelect(&quot;'+categoryIndex+'&quot;,true,&quot;#'+searchContainer.attr('id')+'&quot;);" onmouseout="SuggestJS.enableAutoSelect(&quot;'+categoryIndex+'&quot;,false,&quot;#'+searchContainer.attr('id')+'&quot;);" href="'+href+'" role="listitem" class="">'+vals.mlValue+'</a>'+
												'</li>');
							categoryIndex++;
						});
						if (suggest_category.length > 0) {
							$('.categoryHeader', searchContainer).removeClass('hidden');
							SuggestJS.totalResultCount++;
						}
					}
					

					if (val.indexName === "3brands") {
						$.each(val.suggestions, function(keys, vals) {
							var href = searchBaseURL + vals.mlValue;
							href += (href.indexOf('?') == -1 ? '?' : '&') + 'fhLocation='+vals.fhLocation;
							
							suggest_brand.push('<li tabindex="-1" role="listitem" class="suggestionItem_'+categoryIndex+'">'+
												'<a title="'+vals.mlValue+'" class="autoSelectOption_'+categoryIndex+' suggest-item" onclick="SuggestJS.selectAutoSuggest(this.title); return false;"'+
												'onmouseover="SuggestJS.enableAutoSelect(&quot;'+categoryIndex+'&quot;,true,&quot;#'+searchContainer.attr('id')+'&quot;);" onmouseout="SuggestJS.enableAutoSelect(&quot;'+categoryIndex+'&quot;,false,&quot;#'+searchContainer.attr('id')+'&quot;)" href="'+href+'" role="listitem" class="">'+vals.mlValue+'</a>'+
												'</li>');
							categoryIndex++;
						});
						if (suggest_brand.length > 0) {
							$('.brandHeader', searchContainer).removeClass('hidden');
							SuggestJS.totalResultCount++;
						}
					}
					
				});

				$(".keyword-list", searchContainer).empty().append(suggest_dynamic.join(""));
				$(".category-list", searchContainer).empty().append(suggest_category.join(""));
				$(".brand-list", searchContainer).empty().append(suggest_brand.join(""));
				
				$(".autoSuggestOriginalTerm", searchContainer).val(searchTerm);
									
				if (SuggestJS.totalResultCount > 0) {
					that.showAutoSuggestIfResults(searchContainer);
				} 
				
				that.autoSuggestTimer = -1;
			}).fail(function() {
				console.log( "searchTerm: ");
				SuggestJS.showAutoSuggest(false, searchContainer);
			});
			
		}, this.autoSuggestKeystrokeDelay);

	},

	showAutoSuggest: function(display, searchContainer) {
		if(display) {
			$('.AutoSuggestDiv', searchContainer).show();
		} else {
			$('.AutoSuggestDiv', searchContainer).hide();
		}
	},
	
	tokenizeForBidi: function(displayName, searchName, searchTerm, searchTermLower) {
		var tokens = displayName.split( " > " );
		var html = "";
		var str = "";

		for(i = 0; i < tokens.length; i++) {
			if(i!=0) {
				// not the first token
				html = html + "<div class='category_list'><span class='gt'>&nbsp;>&nbsp;</span></div>";
			}
			if(i == tokens.length - 1) {
				// last token
				str = searchName;
			}
			else {
				str = tokens[i];
			}
			
			html = html + "<div class='category_list'>" + str + "</div>";
		}
		return html;
	},
		
	retrieveCachedSuggestions: function(searchContainer) {
		var that = this;
		if(!this.retrievedCachedSuggestions) {
			$.ajax({
				type: "POST",
				url: that.CachedSuggestionsURL
			})
			.success(function(data) {
				//append the cached suggestions to search div
				$('.search', searchContainer).append(data);
				that.retrievedCachedSuggestions = true;
			});
		}
	},
	
	enableAutoSelect: function(index, enabled, searchContainer) {
		searchContainer = $(searchContainer);
		var item = $('.autoSelectOption_' + index, searchContainer);
		if (enabled) {
			this.highLightSelection(false, this.autoSelectOption, searchContainer);
			item.addClass('autoSuggestSelected');
			this.autoSelectOption = index;
		} else {
			item.removeClass('autoSuggestSelected');
		}
	},
	
	selectAutoSuggest: function(term, searchContainer) {
		var item = $('.autoSelectOption_' + this.autoSelectOption, searchContainer);
		var href = $(item).attr('href');
		var searchBox = $('.searchTerm', searchContainer);
		searchBox.val(term);
		searchBox.focus();
		this.autoSuggestPreviousTerm = term;
		if(href == '#') {
			// search for keyword
			$('.searchbar', searchContainer).submit();
		} else {
			// open link to category or brand
			window.location.href = href;
		}
		setTimeout(function(){SuggestJS.showAutoSuggest(false, searchContainer)},100);
	}
}