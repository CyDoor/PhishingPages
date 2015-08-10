if (typeof (NWS_WS) == "undefined") {
    var NWS_WS = function()
    {
        return {};
    }();
};

/**
 *
 */
NWS_WS.objPopupWindow = null;
/**
 *
 */
NWS_WS.tempOpacity = null;

/**
 * closure to bind the Query in the dollar sign
 */
;(function($)
{

    /**
     * Name of the Plugin
     */
    var pluginName = 'jNetradaGloballayer';

    /**
     * default settings
     */
    var defaults = {
        strPartialName : 'error',
        objPartialData : {},
        intWidth : 0,
        intHeight : 0,
        fltOpacity : 0.6,
        intZindex : 6000,
        strOverlayBgColor : '#000',
        strLayerBgColor : '#FFF',
        strLayerBorderColor : '#AAA',
        strLayerBorderWidth : 0,
        strTemplate : '',
        boolOpenPopup : false,
        boolAsyncRequest : false,
        boolCloseOnEsc : true,
        boolShowCloser : true,
        strGlobalLayerType : 'globallayer',
        strBaseUrl : null,
        strLodingImageUrl : null,
        strContentToDisplay : null,
        hideLayerContent: true,
        strOverflow : 'hidden',
        boolOppressCSSReLoading : false,
        // callback functions
        complete : null,
        layerClosed : null,
        closerWidth: 110,
        closerHeight: 30
    };

    /**
     * open the globallayer in a pop-window
     *
     * @param <object> element
     * @param <object> options
     */
    var PluginPopUp = function(element, options)
    {
        this.options = $.extend({}, defaults, options);
        this.init();
    };

    PluginPopUp.prototype = {

        /**
         * load the content of the globallayer
         */
        init : function()
        {
            var options = this.options;
            var strPartialData = $.toJSON(options.objPartialData);
            var intWidth = options.intWidth;
            var intHeight = options.intHeight;
            var intLeft = screen.availWidth / 2 - intWidth / 2;
            var intTop = screen.availHeight / 2 - intHeight / 2;

            if (NWS_WS.objPopupWindow != null) {
                NWS_WS.objPopupWindow.close();
                NWS_WS.objPopupWindow = null;
            }

            NWS_WS.objPopupWindow = window.open('', 'esprit_popup', 'width='
                    + intWidth + ',height=' + intHeight + ',left=' + intLeft
                    + ',top=' + intTop
                    + ',location=no,scrollbars=no,resizeable=no');

            if (NWS_WS.objPopupWindow != null) {
                NWS_WS.objPopupWindow.focus();
                if (options.strContentToDisplay === null) {
                    var strLastUriElement = NWS_WS.arrJshelper["stylenumber"];

                    var strPostForm = ' <form id="popupForm" name="popupForm" action="'
                            + options.strBaseUrl
                            + 'globallayer/'
                            + options.strPartialName.toLowerCase()
                            + '/'
                            + strLastUriElement
                            + '" target="esprit_popup" method="post">'
                            + '<input type="hidden" name="strPartialName" value="'
                            + options.strPartialName
                            + '" />'
                            + '<textarea class="hidden" name="strPartialData">'
                            + strPartialData
                            + '</textarea>'
                            + '<input type="hidden" name="strTemplate" value="'
                            + options.strTemplate
                            + '" />'
                            + '<input type="hidden" name="boolOpenPopup" value="'
                            + options.boolOpenPopup
                            + '" />'
                            + '<input type="hidden" name="intWidth" value="'
                            + options.intWidth
                            + '" />'
                            + '<input type="hidden" name="intHeight" value="'
                            + options.intHeight + '" />' + '</form>';

                    $('#popupForm').remove();
                    $('body').append(strPostForm);
                    $('#popupForm').submit();
                } else {
                    NWS_WS.objPopupWindow.document
                            .write(options.strContentToDisplay);
                }
            }
            // @todo: Diesen Workaround entfernen wenn man beim Banner mit Type
            // Globallayer die Maße des Layers mit angeben kann!
            // Workaround for Storefinder as External page so set the correct
            // layer height
            if ($('#storefinder_header_PIC').parent().hasClass('globallayer')) {
                $('#storefinder_header_PIC').parent().css({
                    'height' : '765px'
                });
            }
        }
    };

    /**
     * Constructur to show the globallayer in a div
     *
     * @param element
     * @param <object> options
     */
    var PluginGloballayer = function(element, options)
    {
        this.options = $.extend({}, defaults, options);
        this.options.intZindex = this.getLastZindex(this.options.intZindex);
        this.globallayer = null;
        this.globallayerData = null;
        this.globallayerCloser = null;
        this.loadingImage = null;
        this.init(element);
    };

    PluginGloballayer.prototype = {

        /**
         * controls the order of events
         *
         * @param element
         */
        init : function(element)
        {
            var that = this;
            var defaults = this.options;
            var strPartialData = $.toJSON(defaults.objPartialData);

            this.globallayer = this.generateLayer(defaults);
            $(element).append(this.globallayer);
            this.generateOverlay(this.globallayer, defaults);
            //add this globallayer to body
            if (defaults.strContentToDisplay == null) {
                this.loadingImage = this.generateLoadingImage(defaults);
                this.globallayer.append(this.loadingImage);
                this.displayLayer(this.globallayer);
                $.ajax({
                        url : defaults.strBaseUrl + 'globallayer?' + NWS_WS.ajaxGetParamLanguage,
                        type : 'POST',
                        data : {
                            'strPartialName' : defaults.strPartialName,
                            'strPartialData' : strPartialData,
                            'boolOpenPopup' : defaults.boolOpenPopup,
                            'boolOppressCSSReLoading' : defaults.boolOppressCSSReLoading
                        },
                        async : defaults.boolAsyncRequest,
                        success : function(data)
                        {
                        	if(-1 == data.indexOf('flashvars')) {
                                   data = data.replace(/http:/gi, '');
                            }
                            defaults.strContentToDisplay = data;
                            that.globallayerData = that.generateInnerHtml.call(that, defaults);
                            // increase z-index for grey mask
                            $('#overlay').css('z-index', defaults.intZindex + 1);
                            if (defaults.boolShowCloser) {
                                that.globallayerCloser = that.displayCloser.call(that);
                                that.globallayer.append(that.globallayerCloser);
                            }

                            that.globallayer.append(that.globallayerData);
                            // recenter layer after globallayerLoad event
                            that.globallayer.bind('globalLayerLoad', function()
                            {
                                that.loadingImage.remove();
                                that.globallayerData.show();
                                that.globallayer.centerAlign().data(that).trigger('globalLayerReady');
                            });
                            that.globalLayerReady.call(that, that.globallayer, defaults);
                        },
                        // will be used, if the GloballayerSPV has the wrong
                        // Stylenumber or no Stock
                        error : function(strData, strError)
                        {
                            that.closeGloballayerOrMask.call(that, that.globallayer);
                            console.log(strError);
                        }
                    });
                } else {
                    this.globallayerData = this.generateInnerHtml(defaults);
                    // increase z-index for grey mask
                    $('#overlay').css('z-index', defaults.intZindex + 1);
                    if (defaults.boolShowCloser) {
                        this.globallayerCloser = this.displayCloser();
                        this.globallayer.append(this.globallayerCloser);
                    }
                    this.globallayer.append(this.globallayerData);
                    // recenter layer after globallayerLoad event
                    this.globallayer.bind('globalLayerLoad', function()
                    {
                        that.globallayerData.show();
                        that.displayLayer.call(that, that.globallayer);
                        that.globallayer.centerAlign().data(that).trigger('globalLayerReady');
                    });
                    this.globalLayerReady(this.globallayer, defaults);
                }
        },

        /**
         * generte the outer div-box of the globallayer
         *
         * @param defaults
         * @returns <object> globallayer
         */
        generateLayer : function(defaults)
        {
            var that = this;
            var globallayer;

            // create globallayer wrapper div
            globallayer = $('<div/>')
                .addClass('globallayer ' + defaults.strGlobalLayerType)
                .hide()
                .css({
                    'z-index'           : defaults.intZindex + 10,
                    'background-color'  : defaults.strLayerBgColor,
                    border              : defaults.strLayerBorderWidth + 'px solid ' + defaults.strLayerBorderColor,
                    position            : 'absolute',
                    overflow            : defaults.strOverflow,
                    width               : (defaults.intWidth != 0) ? defaults.intWidth + 'px' : 'auto',
                    height              : (defaults.intHeight != 0) ? defaults.intHeight + 'px' : 'auto'
                });

            /* centering of content during resizing of window */
            $(window).resize(function()
            {
                that.reactToResizedWindow(globallayer);
            });
            return globallayer;
        },

        /**
         * generte the overlay
         *
         * @param element
         * @param defaults
         */
        generateOverlay : function(element, defaults)
        {
            var $overlay;
            var that = this;
            element.expose({
                maskId : 'overlay',
                closeOnEsc : defaults.boolCloseOnEsc,
                closeOnClick : false,
                color : defaults.strOverlayBgColor,
                loadSpeed : 0,
                opacity : defaults.fltOpacity,
                zIndex : defaults.intZindex + 1,
                onClose : function(event)
                {
                    $('.globallayer').fadeOut('fast', function()
                    {
                        $(this).remove();
                    });
                }
            });
            $overlay = $.mask.getMask();

            $overlay.css({
                'background-color'  : defaults.strOverlayBgColor,
                'z-index'           : defaults.intZindex + 1
            });
            if (element.hasClass('fullscreenzoomlayer')
                    && NWS_WS.tempOpacity === null
            ) {
                NWS_WS.tempOpacity = $overlay.css('opacity');
                $overlay.css('opacity', 1);
                this.reactToResizedWindow(this.globallayer);
            }

            if(defaults.boolShowCloser) {
                $overlay.unbind('click').click(function()
                {
                    that.closeGloballayerOrMask.call(that, $('div.globallayer:last'));
                });
            }
        },

        /**
         * generate the loading image
         * @param defaults
         * @returns <object> with the image-tag
         */
        generateLoadingImage : function(defaults)
        {
            var centerLoadingImage = function($loadingImage)
            {
                var top = defaults.intHeight > 0 ? (defaults.intHeight / 2 - $loadingImage.innerHeight() / 2) + 'px' : 0;
                var left = defaults.intWidth > 0 ? (defaults.intWidth / 2 - $loadingImage.innerWidth() / 2) + 'px' : 0;
                $loadingImage.css({
                    left: left,
                    top: top
                });
            };
            var loadingImage = $('<img/>')
                                   .addClass('globallayer-loadinglayer-image')
                                   .attr('src', defaults.strLodingImageUrl)
                                   .attr('alt', "loading-image")
                                   .css({
                                        position : 'relative',
                                        'z-index' : defaults.intZindex + 10,
                                        padding: '10px'
                                    });

            if (loadingImage.complete) {
                centerLoadingImage(loadingImage);
            } else {
                loadingImage.bind('load.loadingImage', function(event) {
                    centerLoadingImage($(this));
                });
            }
            return loadingImage;
        },

        /**
         * generate an jquery DOM-Object from the Data
         * @param defaults
         * @returns <object> inner-HTML DOM-Object
         */
        generateInnerHtml : function(defaults)
        {
            // add data to globallayer
            var content = $(defaults.strContentToDisplay);
            if(defaults.hideLayerContent) {
                content.hide();
            }
            return content;
        },

        /**
         * show the globalalyer and center it
         *
         * @param globallayer
         */
        displayLayer : function(globallayer)
        {
            globallayer.show();
            globallayer.centerAlign();

            // The layer should stand still while scrolling.
            if ($(window).height() > 800) {
                $(window).scroll(function()
                {
                    globallayer
                        .not('.showCelebrationFlash, .lookbookCelebration')
                        .centerAlign();
                });
            }
        },

        /**
         * checks that all images loaded
         *
         * @param globallayer#
         * @trigger <event> globalLayerLoad
         */
        globalLayerReady : function(globallayer, defaults)
        {
            var that = this;
            var blankpicture    = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            var arrElements = globallayer.find('img');
            var intElementCount = arrElements.length;
            var src = null;
            if (intElementCount) {
                arrElements.bind('load.globalLayerReady error.globalLayerReady', function()
                {
                    if ( --intElementCount <= 0 && this.src != blankpicture )
                    {
                        arrElements.unbind('load.globalLayerReady error.globalLayerReady');
                        // execute complete callback when globallayer is completely loaded
                        $.isFunction(defaults.complete) && defaults.complete.call(that);
                        // but before event globallayerLoad, so that the content of callback can also use the event!
                        // also fix for working SizeChooser in GloballayerSPV after color change (ESPNWSROLL-1445)
                        globallayer.trigger('globalLayerLoad');
                    }
                }).each(function() {
                    if ( this.src == '')
                    {
                        $(this).trigger('error.globalLayerReady');
                    } else if ( this.complete || this.complete === undefined ) {
                            src = this.src;
                            this.src = blankpicture;
                            this.src = src;
                    }
                });
            } else {
                // execute complete callback when globallayer is completely loaded
                $.isFunction(defaults.complete) && defaults.complete.call(that);
                // but before event globallayerLoad, so that the content of callback can also use the event!
                // also fix for working SizeChooser in GloballayerSPV after color change (ESPNWSROLL-1445)
                globallayer.trigger('globalLayerLoad');
            }
        },

        /**
         * put a div in the right corner
         *
         * @returns <object> closer dom-object
         */
        displayCloser : function()
        {
            var closerWidth = '';
            var $globallayer_closer;
            var that = this;

            switch (NWS_WS.arrJshelper['chosen_language']) {
                case 'fr' :
                case 'bf' :
                case 'fr-CH' :
                    closerWidth = '85px';
                    break;
                    case 'en' :
                    case 'fi' :
                    case 'en-GB' :
                    case 'nl' :
                    case 'bn' :
                        closerWidth = '75px';
                        break;
                    case 'da' :
                        closerWidth = '60px';
                        break;
                    default :
                    closerWidth = this.options.closerWidth + 'px';
                        //nobreak
          }

          $globallayer_closer = $('<div/>')
              .addClass('globallayer_closer')
              .css({
                  'width' : closerWidth,
                    'height' : this.options.closerHeight,
                  'top' : '0',
                  'right' : '0',
                  'z-index' : defaults.intZindex + 12,
                  'cursor' : 'pointer',
                  'position' : 'absolute',
                  'background-color' : '#000000',
                  'opacity' : '0',
                  'filter' : 'alpha(opacity=0)'
                  })
                .click(function (event) {
                  event.stopPropagation();
                  that.closeGloballayerOrMask.call(that, that.globallayer);
                });

              return $globallayer_closer;
          },

        /**
         *
         * @param globallayer
         */
        reactToResizedWindow : function(globallayer)
        {
            globallayer.vAlign();
            var fltOverlayWidth = $(window).width();
            if (fltOverlayWidth > $('.page_width').width()
                    && fltOverlayWidth != parseInt($('#overlay').css('width'))) {
                $('#overlay').css('width', fltOverlayWidth);
            }
        },


        /*
         * this method handles closing of grey mask, globallayer container and
         * message windows
         */
        closeGloballayerOrMask : function(globallayer)
        {
            var $objLastGlobalLayer = null;
            var objLastGloballayerData = null;
            var $overlay = $.mask.getMask();

            // hide very last globallayer
            globallayer.hide();
            // execute layerClosed callback when globallayer is closed by user,
            // but bevore dom is removed
            $.isFunction(this.options.layerClosed)
                    && this.options.layerClosed.call(globallayer);
            // fire globalerlayer closed event
            globallayer.trigger('globallayerClosed');
            // remove very last globallayer
            globallayer.remove();

            // try to get another globallayer. if there is none, close grey
            // mask, too
            $objLastGlobalLayer = $('.globallayer:last');
            if ($objLastGlobalLayer.length > 0) {
                $objLastGlobalLayer.show();
                    objLastGloballayerData = $objLastGlobalLayer.data();
                    $overlay.css({
                        'background-color': objLastGloballayerData.options.strOverlayBgColor,
                        'z-index'         : $objLastGlobalLayer.css('z-index') - 1
                    });
                this.reactToResizedWindow(globallayer);
            } else {
                $.mask.close();
            }

            if (NWS_WS.tempOpacity !== null) {
                $('#overlay').css('opacity', NWS_WS.tempOpacity);
                NWS_WS.tempOpacity = null;
            }
        },

        /**
         * funktion to get the index of the globallayer
         */
        getLastZindex : function(defaultZindex)
        {
            var inZindex = defaultZindex;
            $lastLayer = $('div.globallayer:last');
            if ($lastLayer.length > 0) {
                inZindex = parseInt($('div.globallayer:last').css('z-index'));
            }
            return inZindex;
        }
    };

    /**
     * plugin call
     *
     * @param options
     */
    $.fn[pluginName] = function(options)
    {

        this.each(function(index, element)
        {

        	defaults.strBaseUrl = window.location.protocol === 'https:' ? NWS_WS.arrJshelper["baseurl"].replace('http://', 'https://') : NWS_WS.arrJshelper["baseurl"];
        	defaults.strLodingImageUrl = NWS_WS.arrJshelper["local_picpath_nolang"] !== undefined ? NWS_WS.arrJshelper["local_picpath_nolang"] + '/loader.gif' : NWS_WS.arrJshelper["localpicpath_nolang"] + '/loader.gif';

            if (defaults.boolOpenPopup) {
                new PluginPopUp(this, options);
            } else {
                new PluginGloballayer(this, options);
            }
        });
        return this;
    };

})(jQuery);
