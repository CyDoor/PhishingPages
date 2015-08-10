// is needed, if the footer will be send to myAccount or checkout
if (typeof(NWS_WS) == "undefined")
{
    var NWS_WS = function()
    {
        return {};
    }();
}

//------------------------------------------------------------------------------------------------------------
// external script -> eGain
var eglvchathandle = null;
function openHelp(event) {

    event.preventDefault();

    try{
        if( eglvchathandle != null && eglvchathandle.closed == false ){
            eglvchathandle.focus();
            return;
        }
    }
    catch(err){}

    var w = 400, h = 600;
    var t = 0, l = 0;

    if (window.screen) {
        l = (window.screen.availWidth - w)*98/100;
    }

    var params =  "width=" + w + ",height=" + h + ",left=" + l + ",top=" + t + ",resizable=no,scrollbars=yes,toolbar=no";

    var entryPointId;
    var helpDomain;
    var lngKey;
    var countryKey;

    switch(NWS_WS.arrJshelper["country"])
    {
        case "DE":
            entryPointId     = "1003";
            helpDomain        = "chat.esprit.de";
            lngKey            = "de";
            countryKey        = "DE";
        break;

        case "AT":
            entryPointId     = "1003";
            helpDomain        = "chat.esprit.at";
            lngKey            = "de";
            countryKey        = "DE";
        break;

        case "NL":
            entryPointId     = "1018";
            helpDomain        = "chat.esprit.nl";
            lngKey            = "nl";
            countryKey        = "NL";
        break;

        case "FR":
            entryPointId     = "1019";
            helpDomain        = "chat.esprit.fr";
            lngKey            = "fr";
            countryKey        = "FR";
        break;

        case "BE":
            if(NWS_WS.arrJshelper["chosen_language"] == "fr-BE")
            {
                entryPointId     = "1019";
                helpDomain        = "chat.esprit.be";
                lngKey            = "fr";
                countryKey        = "FR";
            }
            else
            {
                entryPointId     = "1018";
                helpDomain        = "chat.esprit.be";
                lngKey            = "nl";
                countryKey        = "NL";
            }
        break;

        case "CH":
            if(NWS_WS.arrJshelper["chosen_language"] == "fr-CH")
            {
                entryPointId     = "1025";
                helpDomain        = "chat.espritshop.ch";
                lngKey            = "fr";
                countryKey        = "CH";
            }
            else
            {
                entryPointId     = "1024";
                helpDomain        = "chat.espritshop.ch";
                lngKey            = "de";
                countryKey        = "CH";
            }
        break;

        case "DK":
            entryPointId     = "1016";
            helpDomain        = "chat.esprit.dk";
            lngKey            = "da";
            countryKey        = "DA";
        break;

        case "GB":
            entryPointId     = "1016";
            helpDomain        = "chat.esprit.co.uk";
            lngKey            = "en";
            countryKey        = "US";
        break;

        case "EU":
            entryPointId     = "1016";
            helpDomain        = "chat.esprit.eu";
            lngKey            = "en";
            countryKey        = "US";
        break;

        case "FI":
            entryPointId     = "1016";
            helpDomain        = "chat.esprit.fi";
            lngKey            = "en";
            countryKey        = "US";
        break;
    }

    eglvchathandle = window.open('http://'+helpDomain+'/system/web/view/live/templates/Esprit_AquaticPink/chat.html?entryPointId='+entryPointId+'&templateName=Esprit_AquaticPink&languageCode='+lngKey+'&countryCode='+countryKey, "helpChat", params);

    return false;
}

//------------------------------------------------------------------------------------------------------------
//Event onClick load the opinion form
NWS_WS.showGloballayerOpinion = function(e) {
    e.preventDefault();
    $jq('body').jNetradaGloballayer({
        'intWidth'           : 750,
        'intHeight'          : 457,
        'strGlobalLayerType' : 'feedbacklayer',
        'strPartialName'     : 'feedbackLayer'
    }).unbind("globalLayerReady").bind("globalLayerReady", function() {
        $jq("#feedbacklayer_ideas_button").unbind("click").bind("click", NWS_WS.openExternalFeedBack);
        $jq("#feedbacklayer_problems_button").unbind("click").bind("click", NWS_WS.openExternalProblemsLayer);
    });
};
NWS_WS.openExternalFeedBack = function(e) {
    e.preventDefault();
    $jq('body').jNetradaGloballayer({
        'strPartialName' : 'opinion'
    });
};
NWS_WS.openExternalProblemsLayer = function (e) {
    e.preventDefault();
    $jq('body').jNetradaGloballayer( {
        'intHeight' : 457,
        'strPartialName' : 'feedbackLayerProblems'
    });
};
//------------------------------------------------------------------------------------------------------------
// shows the contactform in a popup window or layer
NWS_WS.loadContact = function()
{
    $jq('body').jNetradaGloballayer(
    {
        'strPartialName'    : 'contact',
        'intWidth'            : 645,
        'intHeight'            : 600,
        'fltOpacity'        : 0.5,
        'boolOpenPopup'        : false,
        'strGlobalLayerType': 'footercontact'
    });
};

//------------------------------------------------------------------------------------------------------------
// Newsletter
NWS_WS.initNewsletterSubscription = function (mainSelector) {
    var $initVal = $jq(mainSelector + ' input').val();

    var objLanguage = new NWS_WS.LanguageNewsletter(jQuery, {}, mainSelector);

    $jq(mainSelector + ' input').focus(function () {
        if ($jq(this).val() == $initVal) {
            $jq(this).val('');
        }
    });

    $jq(mainSelector + ' input').blur(function () {
        if ($jq(this).val() == '') {
            $jq(this).val($initVal);
        }
    });

    $jq(mainSelector + ' input').unbind('keypress');
    $jq(mainSelector + ' input').keypress(function (event) {
        if (this.value.length >= 50 &&
            (event.keyCode != '8' && event.keyCode != '46')
        ) {
            $jq(mainSelector).jNetradaMessageWindowDefault({
                strID                 : 'emailerror',
                strCaption             : $jq(mainSelector + ' input[name="newsletter_subscribe_emailerrorcaption"]').val(),
                mixData             :  $jq(mainSelector + ' input[name="newsletter_subscribe_emailerror_length"]').val(),
                boolDraggable         : false,
                boolHideOtherMessages : true
            });
        }

        if (event.keyCode == '13') {
            return false;
        }
    });

    var getNewsletterGender = function ($elem) {
        if ($elem.hasClass('newsletter-button-men') || $elem.attr('id') === 'banner_newsletter_subscriber_btn_men') {
            return 1;
        } else {
            return 2;
        }
    };

    function doNewsletterAction(elem) {
        var emailInputField = $jq(mainSelector + ' input[name="email"]');
        var instanceInputField = $jq(elem).prevAll(mainSelector + ' input[name="instance"]');
        var sourceInputField = $jq(elem).prevAll(mainSelector + ' input[name="source"]');
        var reg = /^([A-Za-z0-9_\-\.]{2,})+\@([A-Za-z0-9_\-\.]{2,})+\.([A-Za-z]{2,6})$/;
        var gender = getNewsletterGender($jq(elem));

        if (reg.test($jq.trim($jq(emailInputField).val())) &&
            emailInputField.val().length < 50
        ) {
            //Geo-Abfrage für DE/AT
            if (NWS_WS.arrJshelper["geo_country"].toUpperCase() === 'AT' &&
                NWS_WS.NewsletterGeoQuery !== true &&
                NWS_WS.arrJshelper["country"] === 'DE'
            ) {
                $jq(mainSelector).jNetradaMessageWindowDefault({
                    strID : 'emailerror',
                    strCaption : '',
                    mixData : 'Auf Esprit.de sind nur Lieferungen nach Deutschland möglich und es werden nur deutschlandweite Aktionen beworben.<br /><br/><input type="submit" value="OK" onclick="NWS_WS.NewsletterGeoQuery = true; $jq(\'.message_window_content\').remove(); $jq(\'#'+gender+'\').click();" />&nbsp;<input type="submit" onclick="$jq(\'.message_window_content\').remove();" value="Abbrechen" />',
                    boolDraggable : false,
                    boolHideOtherMessages : true
                });
                return false;
            }

            var newsletterData = "email=" + $jq.trim($jq(emailInputField).val()) +
                "&instance="+ $jq.trim($jq(instanceInputField).val()) +
                "&source=" + $jq.trim($jq(sourceInputField).val()) +
                "&gender=" + gender;

            $jq.ajax({
                type: "GET",
                url : NWS_WS.strBaseUrl + "newsletter/?" + NWS_WS.ajaxGetParamLanguage,
                data: newsletterData,
                success: function (data) {
                    var objPartialData = {
                        'strEmail' : $jq.trim($jq(emailInputField).val())
                    };
                    switch (data) {
                        case "0":
                            $jq('body').jNetradaGloballayer({
                                'strPartialName' : 'NewsletterAffirmation',
                                'objPartialData' : objPartialData,
                                'fltOpacity' : 0.6,
                                'intWidth'                : 941,
                                'intHeight'                : 551,
                                'strGlobalLayerType': 'newsletter_ok'
                            });

                            emailInputField.val($initVal);
                        break;
                        case "20612":
                        case "20611":
                            $jq('body').jNetradaGloballayer({
                                'strPartialName' : 'NewsletterAffirmationEmailExists',
                                'objPartialData' : objPartialData,
                                'fltOpacity' : 0.6,
                                'intWidth'                : 941,
                                'intHeight'                : 551,
                                'strGlobalLayerType': 'newsletter_email_exists'
                            });
                        break;
                        case "error":
                            // additional error message in JavaScript is possible
                        break;
                        default:
                            // additional default possible here
                    }
                }
            });
        } else {
            $jq(mainSelector).jNetradaMessageWindowDefault({
                strID : 'emailerror',
                strCaption : $jq(mainSelector + ' input[name="newsletter_subscribe_emailerrorcaption"]').val(),
                mixData : $jq(mainSelector + ' input[name="newsletter_subscribe_emailerror"]').val(),
                boolDraggable : false,
                boolHideOtherMessages : true
            });
        }
    }

    $jq(mainSelector + ' .button_container').unbind('click').click(function (e) {
        e.preventDefault();
        doNewsletterAction(this);
        return false;
    });
};

//------------------------------------------------------------------------------------------------------------


/**
 * Shows a Drop Down Menu with Countries
 *
 * @param jQuery
 * @param settings
 * @param mainSelector
 * @returns {NWS_WS.LanguageNewsletter} if is not an instace of it
 */
NWS_WS.LanguageNewsletter = function (jQuery, settings, mainSelector) {
    if (!(this instanceof NWS_WS.LanguageNewsletter)) {
        return new NWS_WS.LanguageNewsletter(jQuery, settings, mainSelector);
    }

    this.$                      = jQuery;
    this._objLanguageSettings   = null;
    this._strImagePath          = '';
    this._strImageExtension     = '';
    this._dropDownIsInit        = false;
    this._dropDownIsShown       = false;

    this._options               = {
        $newsletterbar    : this.$(mainSelector),
        $languageSelector : this.$('#newsletter-promo-languages-dropdown'),
        $displaySelector  : this.$('#newsletter-promo-languages-dropdown-headline'),
        $listSelector     : this.$('#newsletter-promo-dropdown-languages-items'),
        $inputSelector    : this.$(mainSelector + ' input[name="instance"]'),
        intMenuDuration   : 100
    };
    this._options               = this.$.extend(this._options, settings);

    this.init();
};

NWS_WS.LanguageNewsletter.prototype = {
        /**
         * initializes the object
         *
         */
        init: function () {
            if (typeof NWS_WS.languageNewsletterSetting != 'undefined') {
                this.initLanguageSetting();
                this.initImagePath();
                this.initImageExtension();
                this.writeDisplay(0);
                this.intDropDownClickEvent();
            }
        },
        /**
         * writeDisplay
         * writes the Country-Data in the Display
         *
         * @param country can be the country Object or the index in the Array
         * @returns {Boolean}
         */
        writeDisplay: function (country) {
            var objCountry = null;
            if (typeof country === 'number'){
                try {
                    objCountry = this.getLanguageSettingAtPosition(country);
                } catch (exception) {
                    return false;
                }
            }else{
                objCountry = country;
            }
            this._options.$displaySelector
                .html(objCountry.strLanguageName)
                .css(
                    'background-image', 'url("//pics3.esprit.de/Shop/images/' +
                    NWS_WS.arrJshelper.theme + this._strImagePath + objCountry.strCountryIsoCode +
                    this._strImageExtension +'")'
                );
            this._options.$inputSelector.val(objCountry.strLanguageIsoCode);
        },
        /**
         * Bindes the click-event to the Display
         */
        intDropDownClickEvent: function () {
            this._options.$displaySelector.click({that : this}, this.switchDropDownField);
        },
        /**
         * Puts a countries-list in the DropDown Box and binds the click-event at the list entries
         */
        initDropDownField: function () {
            var $list                     = this._options.$listSelector;
            var $elementPattern            = $list.children('[class$="-pattern"]');
            var strElementClassName        = $elementPattern.attr('class').replace(/-pattern/, '');
            $elementPattern.removeClass('[class$="-pattern"]').addClass(strElementClassName);

            for (var index in this._objLanguageSettings) {
                var objCountry = null;
                try {
                    objCountry = this.getLanguageSettingAtPosition(index);
                } catch (exception) {
                    continue;
                }

                $elementPattern.clone()
                    .html(objCountry.strLanguageName)
                    .css(
                        'background-image', 'url("//pics3.esprit.de/Shop/images/' +
                        NWS_WS.arrJshelper.theme + this._strImagePath + objCountry.strCountryIsoCode +
                        this._strImageExtension +'")'
                    )
                    .click(
                        {
                            objCountry : objCountry,
                            that : this
                        },
                        this.changeCountry)
                    .appendTo($list);
            }
            this._dropDownIsInit = true;
        },
        /**
         * initializes the LanguaeSetting Attribute
         */
        initLanguageSetting: function () {
            if (typeof(NWS_WS.languageNewsletterSetting["dropdownJson"]) !== 'undefined') {
                this._objLanguageSettings = NWS_WS.languageNewsletterSetting["dropdownJson"];
            } else {
                throw('dropdownJson is not defined');
            }
        },
        /**
         * initializes the ImagePath Attribute
         */
        initImagePath: function () {
            if (typeof(NWS_WS.languageNewsletterSetting["picPath"]) != 'undefined') {
                this._strImagePath = NWS_WS.languageNewsletterSetting["picPath"];
            } else {
                throw('picPath is not defined');
            }
        },
        /**
         * initializes the imageExtension Attribute
         */
        initImageExtension: function () {
            if (typeof(NWS_WS.languageNewsletterSetting["picExtension"]) != 'undefined') {
                this._strImageExtension = NWS_WS.languageNewsletterSetting["picExtension"];
            } else {
                throw('picExtension is not defined');
            }
        },

        /**
         * Returns the Language Object at the param position
         *
         * @param intPosition
         * @returns languageObject
         */
        getLanguageSettingAtPosition: function (intPosition) {
            var regex = new RegExp('[0-9]+');
            if (regex.test(intPosition)) {
                return this._objLanguageSettings[intPosition];
            } else {
                throw('Parameter is not a number');
            }
        },
        /**
         * change the Country and Hides the List
         *
         * @param element
         */
        changeCountry: function (element) {
            var objCountry = element.data.objCountry;
            var that = element.data.that;
            that.writeDisplay(objCountry);
            that.hideDropDownField();
        },
        /**
         * Show the DropDownField if is hidden or
         * hide the DropDownField if is shown
         *
         * @param element
         */
        switchDropDownField: function (element) {
            var that = element.data.that;
            if (that._dropDownIsShown) {
                that.hideDropDownField.call(that);
            } else {
                that.showDropDownField.call(that);
            }
        },

        /**
         * Show the DropDownField
         */
        showDropDownField: function () {
            if (!this._dropDownIsInit) {
                this.initDropDownField();
            }
            this._options.$languageSelector
                .css(
                    'background-image', 'url("//pics3.esprit.de/Shop/images/' +
                        NWS_WS.arrJshelper.theme + '/global/footer/arrow_up.gif")'
                );
            this._options.$newsletterbar.css('z-index', 3000);
            this._options.$languageSelector.mouseleave({that:this}, this.switchDropDownField);
            this._options.$listSelector.show(this._options.intMenuDuration);
            this._dropDownIsShown = true;
        },
        /**
         * Hide the DropDownField
         */
        hideDropDownField: function () {
            this._options.$languageSelector
                .css(
                    'background-image', 'url("//pics3.esprit.de/Shop/images/' +
                        NWS_WS.arrJshelper.theme + '/global/footer/arrow_down.gif")'
                );
            this._options.$listSelector.hide(this._options.intMenuDuration);
            this._options.$languageSelector.unbind('mouseleave');
            this._options.$newsletterbar.css('z-index', 300);
            this._dropDownIsShown = false;
        }
};

//------------------------------------------------------------------------------------------------------------
//sets all Events for FooterElements
NWS_WS.openCarrierLayer = function(e)
{
    $jq('body').jNetradaGloballayer(
    {
        'strPartialName'    : 'carrier',
        'intWidth'            : 960,
        'intHeight'            : 515,
        'fltOpacity'        : 0.5,
        'boolOpenPopup'        : false,
        'strGlobalLayerType': 'carrier'
    });

    e.preventDefault();
    return false;
};


// ------------------------------------------------------------------------------------------------------------
// sets all Events for FooterElements
NWS_WS.setFooterEvents = function()
{

    // esprit.com
    $jq('#footer-menu .footer_espritcom').on("click", function()
    {
        window.open('http://www.esprit.com', 'esprit');
    });

    // esprit.com - press
    $jq('#footer-menu .footer_press').on("click", function()
    {
        window.open('http://www.esprit.com/press/news/', 'esprit');
    });

    // esprit.com - relation
    $jq('#footer-menu .footer_investor-relations').on("click", function()
    {
        window.open('http://www.esprit.com/investor_relations', 'esprit');
    });

    // facebook
    $jq('#footer-facebook').on('click', function()
    {
        window.open(NWS_WS.arrJshelper["facebook"], 'Facebook');
    });

    // google+
    $jq('#footer-googleplus').on('click', function()
    {
        window.open(NWS_WS.arrJshelper["googleplus"], 'GooglePlus');
    });

    // pinterest
    $jq('#footer-pinterest').on('click', function()
    {
        window.open(NWS_WS.arrJshelper["pinterest"], 'Pinterest');
    });

    // youtube
    $jq('#footer-youtube').on("click", function()
    {
        window.open(NWS_WS.arrJshelper["youtube"], 'YouTube');
    });

    // your opinion
    $jq('#footer-menu .footer-feedback').on("click", function(e) {
        NWS_WS.showGloballayerOpinion(e);
    });

    // storefinder
    $jq('#footer-menu .footer_storefinder').on("click", NWS_WS.loadStoreFinder);

    // footer chat
    $jq('.footer_chat').bind("click", openHelp );

    // footer carrierLayer
    $jq('a[href*="/globallayer/carrier"]').on("click", NWS_WS.openCarrierLayer);
};

// -----------------------------------------------------------------------x  -------------------------------------
// jQuery Document is ready
jQuery(function() {
    NWS_WS.setFooterEvents();

    NWS_WS.initNewsletterSubscription('#newsletter-promo');
});

// handling for eGain-Chat call in footer
