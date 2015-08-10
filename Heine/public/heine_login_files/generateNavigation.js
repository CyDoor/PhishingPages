$(document).ready(function() {
	if ((typeof(e_template) !== 'undefined') && (e_template != 'homepage')) {
		var dt = $('body').attr('data-dt'),
			deploymentTimestamp = null;
		if (dt) {
			deploymentTimestamp = dt.charAt(0) == '/' ? dt.substr(1) : dt;
			if (dt.charAt(dt.length - 1) != '/') {
				deploymentTimestamp += '/';
			}
		}
		var templateURI = "/HeineStorefrontAssetStore/",
    		templateURI = templateURI + (null != deploymentTimestamp ? deploymentTimestamp : ''),
            templateURI = templateURI + "js/navigation/navigation.tpl";
		function onJSON(model) {
			$.get(templateURI, function(view) {
				alldata = {
					menuFlyout: model
				};
				var article = Mustache.render(view, alldata);
				if (typeof article != 'undefined' && article.length>10) {
					$(".mainnav").replaceWith(article);
				}
				
				if (gIsTabletDevice==true)
				{
					$(".firstlevel_hover").removeClass("firstlevel_hover");
					$('.mainnav div.secondlevel').prepend('<div class="navigationcloseformobile">'+dynamicNavigationConfig.text.close+'</div>');
					$('.navigationcloseformobile').click(function(e){
						e.preventDefault();		
						$(this).parent().hide();
						$(".fakehover").removeClass("fakehover");
					});
					
					var element = $('.mainnav a.mainnav_mainlink');
					var eventType = 'touchstart';
					var eventType2nd = '';
					if (typeof(window.navigator.msPointerEnabled)!="undefined" && window.navigator.msPointerEnabled) {				
						eventType = 'MSPointerDown';
						eventType2nd= 'MSPointerOut';
					}
					
					element.click(function(e) {
						e.preventDefault();
					});
					
					element.bind(eventType, function(e){
						e.preventDefault();
						if (eventType=="MSPointerDown")
						{
							$(".fakehover").removeClass("fakehover");	
						}
						else
						{
							//$(".fakehover").removeClass("fakehover");
							if ($(this).next().hasClass("fakehover")) {
								console.log('has fakehover1: '+$(this).next().hasClass("fakehover"));
								$(this).next().hide();
								$(this).next().removeClass("fakehover");
								$(this).removeClass("fakehover");
								$('.navigationcloseformobile').click();
								$(".fakehover").removeClass("fakehover");
							}
							else {
								console.log('has fakehover2: '+$(this).next().hasClass("fakehover"));
								$(".fakehover").removeClass("fakehover");
								$(this).next().addClass("fakehover");
								$(this).addClass("fakehover");
								$(this).next().show();
							}
						}								
					});
						
					element.bind(eventType2nd, function(e){
						e.preventDefault();
						$(this).next().addClass("fakehover");
						//$(this).addClass("fakehover");			
					});
				}else{
					var b = this;
					var a = 200;
					var f = $(".mainnav > li");
					f.bind("mouseenter", function() {
						var h = $(this);
						if (h.data("timeout")) {
							clearTimeout(h.data("timeout"));
							h.data("timeout", false)
						}
						h.data("timeout", setTimeout(function() {
							f.removeClass("hover");
							h.addClass("hover")
						}, a));
					})
					f.bind("mouseleave", function() {
						var h = $(this);
						if (h.data("timeout")) {
							clearTimeout(h.data("timeout"));
							h.data("timeout", false)
						}
						h.data("timeout", setTimeout(function() {
							h.removeClass("hover")
						}, a));
					})
				}
			}).done(function() {
				$( "ul.col1 li.empty-nav-point").each(function() {
					var spaceCount = $(this).attr('data-spacecount');					
					if (spaceCount != 'undefined' && $.isNumeric(spaceCount) && spaceCount > 0) {
						$(this).show();
						spaceCount--;
						while (spaceCount > 0) {
							$(this).after('<li class="empty-nav-point">&nbsp;</li> ');
							spaceCount--;
						}
					}
				});				
			});
		}
		//$.getJSON('/HeineStorefrontAssetStore/js/navigation/heine.json', function(model) { return onJSON(model); });
		if (typeof(JSONdynamicNavigation) !== 'undefined') {
			onJSON(JSONdynamicNavigation);
		}
	}else if((typeof(e_template) !== 'undefined') && (e_template == 'homepage')){
		var b = this;
		var a = 200;
		var f = $(".mainnav > li");
		f.bind("mouseenter", function() {
			var h = $(this);
			if (h.data("timeout")) {
				clearTimeout(h.data("timeout"));
				h.data("timeout", false)
			}
			h.data("timeout", setTimeout(function() {
				f.removeClass("hover");
				h.addClass("hover")
			}, a));
		})
		f.bind("mouseleave", function() {
			var h = $(this);
			if (h.data("timeout")) {
				clearTimeout(h.data("timeout"));
				h.data("timeout", false)
			}
			h.data("timeout", setTimeout(function() {
				h.removeClass("hover")
			}, a));
		})
	}	
});