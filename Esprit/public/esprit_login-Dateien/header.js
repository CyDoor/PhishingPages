if (typeof NWS_WS === 'undefined') {
    var NWS_WS = (function () {
        return {};
    }());
}

/*******************************************************************************
 * Search *
 ******************************************************************************/

NWS_WS.searchhelper = {};

NWS_WS.searchhelper.Pos = function (x, y) {
    this.x = x;
    this.y = y;
};

NWS_WS.searchhelper.Area = function (topLeft, bottomRight) {
    if (
        !(topLeft instanceof NWS_WS.searchhelper.Pos) ||
        !(topLeft instanceof NWS_WS.searchhelper.Pos)
    ) {
        throw 'params must instance NWS_WS.searchhelper.pos';
    }

    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
};

NWS_WS.searchhelper.Area.prototype.inArea = function (x, y) {
    if (
        x >= this.topLeft.x &&
        x <= this.bottomRight.x &&
        y >= this.topLeft.y &&
        y <= this.bottomRight.y
    ) {
        return true;
    } else {
        return false;
    }
};

(function ($) {
    NWS_WS.search = function (settings) {
        if (!(this instanceof NWS_WS.search)) {
            return new NWS_WS.search(settings);
        }
        var options = {
            searchUri     : NWS_WS.arrJshelper["search_uri"],
            baseUri       : NWS_WS.arrJshelper["baseurl"],
            warningText   : NWS_WS.arrJshelper['search_too_short'],
            inputField    : 'input.search'
        };
        this.options = $.extend({}, options, settings);
        this.$inputField = $(this.options.inputField);

        if (typeof LastSearchTermsController === 'function') {
            /**
             * @type {LastSearchTermsController}
             */
            this.lastSearchTermsController = new LastSearchTermsController();
        }

        if (typeof SuggestController === 'function' &&
            typeof suggestConfig === 'object' &&
            NWS_WS.arrJshelper["enable_suggest"] === "1"
        ) {
            /**
             * @type {Callback}
             */
            var searchCallback = new Callback(this.send, this);
            /**
             * @type {SuggestController}
             */
            this.suggestController = new SuggestController(suggestConfig, searchCallback, searchCallback);
        }
    };

    NWS_WS.search.prototype = {

        initEvents : function () {
            var that = this,
                eventData = {
                    that : this
                },
                inputField = this.options.inputField,
                $inputField = this.$inputField;

            $inputField.each(function () {
                var $field = $(this);
                $field.data('searchInputValue', $field.val());

                // search input clear on focus
                $field.focus(eventData, that.getFocus);
                $field.focusout(eventData, that.focusOut);
                $field.keyup(eventData, that.keyupEvents);
            });

            $('#header-search .search-image').click(eventData, this.clickfield);

            $('.search-button').click(function (objEvent)
            {
                that.checkInputField($(this).siblings(inputField));
            });
        },


        /**
         * checks whether the mouse click on the send field
         * @param objEvent
         */
        clickfield : function (objEvent) {
            var that = objEvent.data.that,
                objClickObject = $(this),
                topLeft = new NWS_WS.searchhelper.Pos(
                    objClickObject.offset().left + objClickObject.outerWidth() - 30,
                    objClickObject.offset().top
                ),
                bottomRight = new NWS_WS.searchhelper.Pos(
                    objClickObject.offset().left + objClickObject.outerWidth(),
                    objClickObject.offset().top  + objClickObject.outerHeight()
                ),
                objClickArea = new NWS_WS.searchhelper.Area(topLeft, bottomRight);

            if (objClickArea.inArea(objEvent.pageX, objEvent.pageY)) {
                that.checkInputField($(that.options.inputField, objClickObject));
            }
        },

        /**
         * @param {eventObject} event
         */
        keyupEvents : function(event) {
            var that = event.data.that;
            // var that = objEvent.
            if (event.which == 0x0d) {
                that.checkInputField($(this));
            } else {
                that.keyUpSearchFieldQueryLengthControll.call(that, $(this));
            }
        },

        /**
         * @param {jQuery} searchField
         */
        keyUpSearchFieldQueryLengthControll : function(searchField) {
            var searchFieldLength = searchField.val().length;
            if (searchFieldLength < 2) {
                this.removeSuggest.call(this);
                this.displayLastSearchTerms.call(this, searchField);
            } else {
                this.removeLastSearchTerms.call(this);
                this.displaySuggest.call(this, searchField);
            }
        },
        /**
         * @returns {boolean}
         */
        lastSearchTermsControllerDefined : function () {
            return typeof this.lastSearchTermsController !== 'undefined';
        },

        /**
         * @param {jQuery} inputField
         */
        displayLastSearchTerms : function (inputField) {
            if (this.lastSearchTermsControllerDefined()) {
                var searchField = this.getSearchFieldFromInputField(inputField);
                var layerTexts = {
                    headerLable : NWS_WS.arrJshelper['last_search_terms_header'],
                    deleteLable : NWS_WS.arrJshelper['last_search_terms_clear']
                };
                this.lastSearchTermsController.displayLastSearchTerms(
                    new Callback(this.send, this),
                    searchField,
                    layerTexts
                );
            }
        },

        removeLastSearchTerms : function () {
            if (this.lastSearchTermsControllerDefined()) {
                this.lastSearchTermsController.removeLastSearchTermsFromDisplay();
            }
        },

        /**
         * @param {jQuery} inputField
         */
        focusOutSearchFieldLastSearchTermsHandler : function (inputField) {
            if (this.lastSearchTermsControllerDefined()) {
                if (this.lastSearchTermsController.checkMouseOverSearchFieldLayer()) {
                    inputField.focus();
                } else {
                    this.lastSearchTermsController.removeLastSearchTermsFromDisplay();
                }
            }
        },

        /**
         * @returns {boolean}
         */
        suggestControllerDefined : function () {
            return typeof this.suggestController !== 'undefined';
        },

        /**
         * @param {jQuery} inputField
         */
        displaySuggest : function (inputField) {
            if (this.suggestControllerDefined() &&
                !this.suggestController.checkMouseOverSuggestdLayer()) {
                var query = inputField.val();
                var  rightButtonOffset =  this.calcRightButtonOffsetFromSearchField(inputField);

                this.suggestController.displaySuggest(query, rightButtonOffset);
            }
        },

        removeSuggest : function () {
            if (this.suggestControllerDefined()) {
                this.suggestController.removeSuggestFromDisplay();
            }
        },

        /**
         * @param {jQuery} inputField
         * @return {Offset}
         */
        calcRightButtonOffsetFromSearchField : function (inputField) {
            /**
             * @type {Offset}
             */
            var offset = new Offset();
            var searchField = this.getSearchFieldFromInputField(inputField);
            var pageOffset = $('#wrapper').offset();

            offset.left = searchField.offset().left
                + searchField.outerWidth()
                - pageOffset.left;

            offset.top = searchField.offset().top
                + searchField.outerHeight()
                - pageOffset.top;
            return offset;
        },

        /**
         * @param {jQuery} inputField
         * @returns {jQuery}
         */
        getSearchFieldFromInputField : function (inputField) {
            return inputField.hasClass('search-nofound') ?
                inputField.parents('.search-image') :
                $('#header-search');
        },

        /**
         * @param inputField
         */
        focusOutSearchFieldSuggestHandler : function (inputField) {
            if (this.suggestControllerDefined()) {
                if (this.suggestControllerDefined()) {
                    if (this.suggestController.checkMouseOverSuggestdLayer()) {
                        inputField.focus();
                    } else {
                        this.suggestController.removeSuggestFromDisplay();
                    }
                }
            }
        },

        /**
         *
         * @param objEvent
         */
        getFocus : function (objEvent) {
            var that = objEvent.data.that;
            var $field = $(this);
            var messageWindowID = $("div[id^='container_message_window_searchwarning_']");
            var fieldval = $field.val();
            var fieldStandardVal = $field.data('searchInputStandardValue')
                ? $field.data('searchInputStandardValue')
                : $field.data('searchInputValue');

            if (messageWindowID) {
                $('.message_window_close', messageWindowID).trigger('click');
            }
            if (fieldval.toLowerCase() === fieldStandardVal.toLowerCase()){
                $field.val('');
            }

            that.keyUpSearchFieldQueryLengthControll.call(that, $field);
        },

        /**
         * set search text on focusout
         */
        focusOut : function (objEvent) {
            var that = objEvent.data.that;
            var $field = $(this);
            var searchInputStandardValue = $field.data('searchInputStandardValue')
                ? $field.data('searchInputStandardValue')
                : $field.data('searchInputValue');
            if ($(this).val() == '') {
                $(this).attr('value', searchInputStandardValue);
            }

            that.focusOutSearchFieldLastSearchTermsHandler.call(that, $field);
            that.focusOutSearchFieldSuggestHandler.call(that, $field);
        },

        checkInputField : function ($inputField) {
            var searchDefaultValue = $inputField.data('searchInputStandardValue')
                ? $inputField.data('searchInputStandardValue')
                : $inputField.data('searchInputValue');
            var searchValue = $inputField.val();
            var searchQuery = '';

            if(NWS_WS.getUrlParam('query')){
                searchQuery = NWS_WS.getUrlParam('query');
            }

            $('[id*=container_message_window_searchwarning_]').hide();

            if (searchValue.length < 2) {
                $inputField.attr('value', searchDefaultValue);
                $('#header-search').jNetradaMessageWindowDefault({
                    strID : 'searchwarning',
                    mixData : this.options.warningText,
                    boolBackground : true,
                    boolDraggable : true
                });
            } else if (
                searchDefaultValue.toLowerCase() !== searchValue.toLowerCase() &&
                searchQuery.toLowerCase() !== searchValue.toLowerCase()
            ) {
                this.send.call(this, searchValue, '', false);
            }
        },

        send : function (searchText, navigation, suggestQuery) {

            var query = encodeURIComponent(searchText.replace(/\//g, '')),
                searchUri = this.options.searchUri,
                baseUrl = this.options.baseUri,
                suggestQueryText = '';

            if(typeof this.lastSearchTermsController !== 'undefined') {
                this.lastSearchTermsController.storeNewSearchTerm(searchText);
            }

            $('#searchloadinglayer')
                .remove()
                .appendTo('body')
                .centerAlign()
                .expose({
                    closeOnClick: false,
                    closeOnEsc: false,
                    closeSpeed: 0,
                    color: '#FFFFFF',
                    loadSpeed: 0,
                    maskId: 'serachMask',
                    operacity: 0.8,
                    startOpacity: 0,
                    zIndex: 6000
                })
                .fadeIn('fast')
                .stopTime('searchloadinglayer')
                .oneTime(
                    500,
                    'searchloadinglayer',
                    function () {
                        if (typeof (navigation) === 'undefined' || navigation === '') {
                            window.location.href = baseUrl + searchUri + '?query=' + query;
                        } else {
                            suggestQueryText = (suggestQuery === true) ? '&suggestQuery=true' : '';
                            navigation = navigation
                                .replace(/\&/, '')
                                .replace(/\s/gi, '_');

                            window.location.href = baseUrl
                                + searchUri
                                + '?query='
                                + query
                                + suggestQueryText
                                + '&site=1'
                                + '&navigation=' + navigation;
                        }
                    }
                );
        }
    };
}(jQuery));


jQuery(document).ready(function () {
    // -- SEARCH
    var search = new NWS_WS.search(jQuery);
    search.initEvents();

    //set red color for sale top menu for FR-Shop, includes border-color (hover/active)
    $jq('#menu-5084').css('color','#AE3232');
    if($jq('#header-menu .mainmenu li.level-1 a#menu-5084').parent('li').hasClass('active'))
    {
        $jq('#header-menu .mainmenu li.level-1 a#menu-5084').css('border-bottom','2px solid #AE3232');
    }
    $jq('#header-menu .mainmenu li.level-1 a#menu-5084').css('border-color','#AE3232');

    //storefinder
    $jq('#header-storefinder').on("click", NWS_WS.loadStoreFinder);
});

// Required for header transfer
(function ($) {
    'use strict';

    if ($jq.fn.vAlign === undefined) {
        //Vertically align an element in viewport
        $.fn.vAlign = function () {
            return this.each(function () {
                var elementHeight		= $(this).height();
                var windowHeight		= $(window).height();
                var scrollTop			= $(window).scrollTop();
                var newVerticalValue	= Math.ceil(((windowHeight - elementHeight) / 2) + scrollTop);

                // position will never be below 10px to top
                if(newVerticalValue < 10) {
                    newVerticalValue = 10;
                }
                $(this).css('top', newVerticalValue);
            });
        };
    }

    // Horizontally align an element in viewport
    if ($.fn.hAlign === undefined) {
        $.fn.hAlign = function() {
            return this.each( function(){
                var w = $(this).width();
                var ow = $(this).outerWidth();
                var ml = (w + (ow - w)) / 2;
                $(this).css('margin-left', '-' + ml + 'px');
                $(this).css('left', '50%');
            });
        };
    }

    // Wrapper plugin for hor/ver centering
    if ($.fn.centerAlign === undefined) {
        $.fn.centerAlign = function() {
            return this.each( function() {
                $(this).vAlign().hAlign();
            });
        };
    }
})(jQuery);
