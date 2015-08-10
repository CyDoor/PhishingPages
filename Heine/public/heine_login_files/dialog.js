hei.widget("hei.cl.widgets.dialog", {}, function () {
    var module = this;
    var options = {
		closeOnEscape: true,
		modal:     true,
		bgiframe:  true,
		draggable: false,
		resizable: false,
		stack:     true,
		height:	   "auto",
		width:	   "450px",
		innerWidthIE:"375px",
		modal:    true,
		closeText: "schliessen"
	};

	var getTitle = function(opt){
	    if(opt.title) return opt.title
		return i18n("global.alertHeader")
	}

    var dialogOpen = false;

	this.confirm = function (msg, opt){
		if(opt) opt.confirm = 1;
		this.alert(msg, opt)
	}

	hei.on("a.js_popup", "click", function (e) {
	    e.preventDefault();
	    var self = $(this);
	    var href = self.attr("href");
	    module.popup(href, self.attr("target"), self.classData())
	})

	this.popup = function (url, name, params) {
		var sizeX = 0;
		var sizeY = 0;
		var winX = screen.availWidth;
		var winY = screen.availHeight;

			params.scrollbars = params.scrollbars || "1";
			params.resizable = params.resizable || "0";
			params.width = params.width || 640;
			params.height = params.height || 480;

		var sizeX = parseInt(params.width, 10) || 640;
		var sizeY = parseInt(params.height, 10) || 480;

			params.left = Math.round(winX / 2 - sizeX / 2);
			params.top  =  Math.round(winY / 2 - sizeY / 2);

		var paraString = "";
		for(var i in params) {
		    paraString += i+"="+params[i]+","
		}

		window.open(url, name, paraString).focus();
	}

	this.layer = function (data, id, params, openInIframe) {
		if (!$.i18n.containsBundles('desktop.general')) {
			$.i18n.init({
				requestedBundles : [ 'DESKTOP_GENERAL' ]
			});
		}
		if(!params || typeof params=='string'){params = {'modal':true}}
    	if (typeof params.modal == 'undefined') params.modal =true;
    	if (typeof params.adjustHeight == 'undefined') params.adjustHeight = 0;
    	if (typeof params.width == 'undefined') params.width = 0;
    	if (typeof params.zIndex == 'undefined') params.zIndex = 0;
        if (typeof id == 'undefined' || id==null) id='layer_'+new Date().getTime();
        if (params.modal) {
        	if (typeof($('#overlay').attr('id'))=='undefined') $('body').append('<div id="overlay" />');
    	}
      if ($(data).hasClass('pwd')) 
      {		
    	  layer = $('<div id="'+id+'" class="contentbox"><a href="" class="close js_closelayer" id="pwd">'+$.i18n.message('desktop.general', 'schliessen')+'</a><div class="content clearfix"></div></div>');
      }
      else 
      { 	
    	  layer = $('<div id="'+id+'" class="contentbox"><a href="" class="close js_closelayer">'+$.i18n.message('desktop.general', 'schliessen')+'</a><div class="content clearfix"></div></div>');
      }
        if (typeof(data)=='object') {
        	layer.find('.content:first').append(data);
        	$(data).show();
        } else if (openInIframe) {
        	layer.find('.content:first').html('<iframe width="540" height="600" src="' + data + '"></iframe>');
        } else {
        	layer.find('.content:first').html(data);
        }
        $('body').append(layer);
        var contentbox = $('.contentbox');

        var chHeight = parseInt(contentbox.height());
        var chWidth = parseInt(contentbox.width());
        
        if (params.maxHeight && chHeight > params.maxHeight) {
        	contentbox.height(params.maxHeight);
        	chHeight = params.maxHeight;
        	
        	var elem = $('.infolayer');
        	var paddings = elem.innerHeight() - elem.height();
        	var headerHeight = $('.close.js_closelayer').outerHeight(true) + 16;
        	elem.height(params.maxHeight - (paddings + headerHeight));
        	elem.addClass('verticalScroll');
        }
        
		// get current page size
        var pageScroll = getPageScroll();
        var pageSize = getPageSize();
        // set new position
        var cbTop = null;
        if (params.top && !isNaN(params.top)) {
            cbTop = params.top;
        } else cbTop = ((pageSize.windowHeight - chHeight - params.adjustHeight) / 2) + pageScroll.yScroll;
        var cbLeft = (pageSize.windowWidth - chWidth) / 2;        
        if(cbTop > 0){contentbox.css({'top':cbTop});}
        if(cbLeft > 0){contentbox.css({'left':cbLeft});}
        if (params.width!=0){contentbox.css({'width':params.width});}
        if (!params.modal) $('#'+id).show(); else $('#overlay').show();
        if (params.zIndex!=false) 
        {
        	$('#vkfLayer').css({"z-index":params.zIndex});
        }
        
        contentbox.fadeIn('fast');
		hei.on("click",".js_closelayer", function(e) {
        	e.preventDefault();
        	if (typeof(params.closecallback)=='function') 
        	{
            	params.closecallback();
            } 
        	else 
        	{
	            $('.contentbox').fadeOut('fast',function(){
	                $('#overlay').remove();
	                 $(this).remove();
	            });
	            return false;
            }
        });
	}
	this.layer2 = function (data, id, params) {
		if(!params){params = {}}

        var layer = '<div id="'+id+'" class="contentbox2">'+data+'</div>';
        $('body').append(layer);
        var contentbox2 = $('.contentbox2');

        contentbox2.fadeIn('fast');

        hei.live(".js_closelayer2", "click", function () {
            $('#overlay').remove();
            $('.contentbox2').fadeOut('fast',function(){
                $(this).remove();
                $('.arrow').remove();
            });
            return false;
        });
	}
	
	this.iFrameLayer = function (data, id, params, text, callback) {

        if(!params || typeof params=='string'){params = {'modal':true}}
    	if (typeof params.modal == 'undefined') params.modal =true;
    	if (typeof params.adjustHeight == 'undefined') params.adjustHeight = 0;
        if (typeof id == 'undefined' || id==null) id='layer_'+new Date().getTime();
        if (params.modal) {
        	if (typeof($('#overlay').attr('id'))=='undefined') $('body').append('<div id="overlay" />');
    	}
        
        if (typeof text == 'undefined') text = {};
        if (typeof text.headerText == 'undefined') text.headerText='';
        if (typeof text.close == 'undefined') text.close='close';
       	layer = $('<div id="'+id+'" class="contentbox"><div id="layerheader"><span id="headertext">' + text.headerText + '</span><span id="headerclose"><a href="#" class="close js_closelayer">' + text.close + '</a></span></div><div class="content clearfix"></div></div>');

       	layer.find('.content:first').append('<iframe frameBorder="0" width="' + params.layerWidth + '" height="' + params.layerHeight + '" src="' + data + '"></iframe>');
       

        $('body').append(layer);
        var contentbox = $('.contentbox');

		// get current page size
        var pageScroll = getPageScroll();
        var pageSize = getPageSize();
        // set new position
        var chHeight = parseInt(contentbox.height());
        var chWidth = parseInt(contentbox.width());
        var cbTop = null;
        if (params.top && !isNaN(params.top)) {
            cbTop = params.top;
        } else cbTop = ((pageSize.windowHeight - chHeight - params.adjustHeight) / 2) + pageScroll.yScroll;
        var cbLeft = (pageSize.windowWidth - chWidth) / 2;        
        if(cbTop > 0){contentbox.css({'top':cbTop});}
        if(cbLeft > 0){contentbox.css({'left':cbLeft});}
        if (!params.modal) $('#'+id).show(); else $('#overlay').show();
        contentbox.fadeIn('fast');
		$('.js_closelayer').on("click", function(e) {
        	e.preventDefault();
        	if (typeof(params.closecallback)=='function') {
            	params.closecallback();
            } else {
	            $('.contentbox').fadeOut('fast',function(){
	                $('#overlay').remove();
	                 $(this).remove();
	            });
	            return false;
            }
        });
		
		if (typeof callback === 'function') {
			callback();
		}
	}
	
	// used by tablet-zoom function for productimages in detailview. (inside product-controller.js)
	this.zoomlayer = function (data, id, orientation, ipad) {
		
        //$('body').append('<div id="tablet-overlay" />');
    	
        layer = $('<div id="'+id+'" class="contentbox"><a href="" class="close js_closelayer">Schlie&szlig;en</a><div class="content clearfix"></div></div>');
        if (typeof(data)=='object') {
        	layer.find('.content:first').append(data);
        	$(data).show();
        } else {
        	layer.find('.content:first').html(data);
        }
        $('body').append(layer);
        var contentbox = $('.contentbox');

		// get current page size
        var pageScroll = getPageScroll();
        var pageSize = getPageSize();
        // set new position
        if(ipad){
        	var chHeight = (orientation == "landscape") ? 640 : 1180;
        	var chWidth = 940;
        }else{
	        var chHeight = (orientation == "landscape") ? 490 : 1180;
	        var chWidth = 940; // orientation doesnt matter here
        }
        var cbTop = ((pageSize.windowHeight - chHeight) / 2);
        var cbLeft = (pageSize.windowWidth - chWidth) / 2;        
        if(cbTop > 0){contentbox.css({'top':cbTop});}
        if(cbLeft > 0){contentbox.css({'left':cbLeft});}
        $('#overlay').show();
        contentbox.fadeIn('fast');
		hei.on("click", ".js_closelayer", function(e) {
        	e.preventDefault();
        	if (typeof(params.closecallback)=='function') {
            	params.closecallback();
            } else {
	            $('.contentbox').fadeOut('fast',function(){
	                $('#overlay').remove();
	                 $(this).remove();
	            });
	            return false;
            }
        });
	}

		//Parameters width, height and background-color will be regarded
		this.layerWithOverlay = function (data, id, params) {

        if(!params || typeof params=='string'){params = {'modal':true}}
    	if (typeof params.modal == 'undefined') params.modal =true;
    	if (typeof params.lWidth == 'undefined') params.lWidth = 'auto';
    	if (typeof params.lHeight == 'undefined') params.lHeight = 'auto';
    	if (typeof params.lBgColor == 'undefined') params.lBgColor = 'transparent';
        if (typeof id == 'undefined' || id==null) id='layer_'+new Date().getTime();
        if (!params.modal) {
    		var layer = '';
    	} else {
    		var layer = '<div id="overlay" />';
    	}
        layer += '<div id="'+id+'" class="contentbox" width="' + params.lWidth + '" height="' + params.lHeight +'" style="background-color: ' + params.lBgColor + ';">'+data+'</div>';

        $('body').append(layer);
        var contentbox = $('.contentbox');

		// get current page size
        var pageScroll = getPageScroll();
        var pageSize = getPageSize();
        // set new position
        var chHeight = 0;
        var chWidth = 0;
        if (params.lHeight != 'auto') {chHeight = parseInt(contentbox.height());}
        if (params.lWidth != 'auto') { chWidth = parseInt(contentbox.width());}
        var cbTop = Math.round(((pageSize.windowHeight - chHeight) / 2)) + pageScroll.yScroll - 30;
		BrowserDetect.init();

		if(BrowserDetect.browser=='Firefox'){
			cbTop = Math.round(((pageSize.windowHeight - chHeight) / 3)) + pageScroll.yScroll - 60;
		}

        var cbLeft = Math.round((pageSize.windowWidth - chWidth) / 3);

        if(cbTop > 0){contentbox.css({'top':cbTop});}
        if(cbLeft > 0){contentbox.css({'left':cbLeft});}
        if (!params.modal) $('#'+id).show(); else $('#overlay').show();
        contentbox.fadeIn('fast');

        hei.on(".js_closelayer", "click", function () {
            $('.contentbox').fadeOut('fast',function(){
                $('#overlay').remove();
                $(this).remove();
            });
            return false;
        })
	}

    this.layerBox = function(data, id, dataheight,datawidth) {
        var layer = '<div id="overlayBox" />';

        layer += '<div id="'+id+'" class="layerBox">'+data+'</div>';
        $('body').append(layer);
        var layerBox = $('.layerBox');

        // set new position
        var chHeight = dataheight;
        var chWidth = datawidth;
    	var wWidth = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
    	var wHeight = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);

        var cbTop = ((wHeight - chHeight) / 2);
        var cbLeft = ((wWidth - chWidth) / 2);

        if(cbTop > 0){layerBox.css({'top':cbTop});}
        if(cbLeft > 0){layerBox.css({'left':cbLeft});}

        $('#overlayBox').show();
        layerBox.fadeIn('normal');
        $('#linkID').click(function(){
        	$('.layerBox').fadeOut('normal');
        	$('#overlayBox').hide();
        });
      }

	this.screenAjaxLoader = function (pAction) {
		if ("show" === pAction) {
			var layer = '<div id="overlay" /><div id="screen-ajax-loader" class="contentbox" style="background-color:#777777;"><div class="content clearfix"><img height="30" src="' + storePath + '/images/symbol/ajax-loader_blue-transparent.gif"></div></div>';
	        $('body').append(layer);
	        var contentbox = $('.contentbox');
	        // get current page size
	        var pageScroll = getPageScroll();
	        var pageSize = getPageSize();
	        // set new position
	        var chHeight = parseInt(contentbox.height());
	        var chWidth = parseInt(contentbox.width());
	        var cbTop = ((pageSize.windowHeight - chHeight) / 2) + pageScroll.yScroll;
	        var cbLeft = (pageSize.windowWidth - chWidth) / 2;

	        if(cbTop > 0){contentbox.css({'top':cbTop});}
	        if(cbLeft > 0){contentbox.css({'left':cbLeft});}
	        $('#overlay').show();
	        contentbox.fadeIn('fast');
		} else if ("hide" === pAction) {
			$('.contentbox').remove();
		}
	}
	
	this.alert = function (msg, opt) {}

	var getPageSize = function () {
        var xScroll, yScroll;
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = window.innerWidth + window.scrollMaxX;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac... would also work in Explorer 6 Strict, Mozilla and Safari
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }

        var windowWidth, windowHeight;
        if (self.innerHeight) {	// all except Explorer
            if(document.documentElement.clientWidth){
                windowWidth = document.documentElement.clientWidth;
            } else {
                windowWidth = self.innerWidth;
            }
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }

        // for small pages with total height less then height of the viewport
        if(yScroll < windowHeight){
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }

        // for small pages with total width less then width of the viewport
        if(xScroll < windowWidth){
            pageWidth = xScroll;
        } else {
            pageWidth = windowWidth;
        }

        return {'pageWidth':pageWidth,'pageHeight':pageHeight,'windowWidth':windowWidth,'windowHeight':windowHeight};
    }

    var getPageScroll = function ( ) {
        var xScroll, yScroll;
        if (self.pageYOffset) {
            yScroll = self.pageYOffset;
            xScroll = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
        } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;
        }

        return {'xScroll':xScroll,'yScroll':yScroll};
    }

})
