(function ($) {

    /**
     *
     * @param cookieData
     * @param $headerElement
     * @param $headerElementLogin
     * @param $headerElementLogout
     * @param $headerElementSalutation
     * @param forceUnpersonalizedLogout
     * @constructor
     */
    HeaderPersonalisation = function (
        cookieData,
        $headerElement,
        $headerElementLogin,
        $headerElementLogout,
        $headerElementSalutation,
        forceUnpersonalizedLogout
    ) {
        this.$element = $headerElement;
        this.$elementLogin = $headerElementLogin;
        this.$elementLogout = $headerElementLogout;
        this.$elementSalutation = $headerElementSalutation;
        this.forceUnpersonalizedLogout = forceUnpersonalizedLogout;

        this.logoutUrl = $headerElementLogout.attr('href');

        this.cookieData = this.evaluateCookieData(cookieData) || null;
        this.custumerName = this.getFullNameFromCookieData();

        if (this.cookieData !== null || this.forceUnpersonalizedLogout === 1) {
            this.hideElement(this.$elementLogin);
            this.showElement(this.$elementLogout);
        } else {
            this.showElement(this.$elementLogin);
            this.hideElement(this.$elementLogout);
        }

        if( this.custumerName != "" ) {
            this.writeFullNameToElement(this.custumerName);
            this.showElement(this.$elementSalutation);
        }

        this.setEvents();
        this.setReturnValueToLogin(location.href);

        this.showElement(this.$element);
    };

    HeaderPersonalisation.prototype = {
        /**
         *
         * @param cookieData
         * @returns {*}
         */
        evaluateCookieData : function(cookieData)
        {
            var data = null;
            if(typeof cookieData !== 'undefined' && cookieData !== null) {
                data = $.parseJSON(cookieData.replace(/\+/g, ' '));
            }
            return data;
        },

        /**
         *
         * @param fullname
         */
        writeFullNameToElement : function (fullname)
        {
            $('em', this.$elementSalutation).text(fullname);
        },

        /**
         *
         * @returns {string}
         */
        getFullNameFromCookieData : function ()
        {
            var name = "";
            if( this.cookieData !== null) {
                name = this.cookieData.vn + " " + this.cookieData.nn;
            }
            return name;
        },

        /**
         *
         */
        setEvents : function()
        {
            var that = this;
            this.$elementLogout.on('click', function(e){
                e.preventDefault();
                that.forceLogOut();
            });
        },

        /**
         *
         * @param url
         */
        setReturnValueToLogin : function(url)
        {
            $("input[name='returnurl']", this.$elementLogin).val(url);
        },


        forceLogOut : function()
        {
            /* Needed, for cookies without subdomain */
            /* e.g.: .esprit.de */
            var cookieDomain = window.location.hostname.replace(window.location.protocol+'//', '');
            cookieDomain = cookieDomain.substring(cookieDomain.indexOf('.'));

            var cookiesToDelete = ['NWS_USER', 'SESS_NWS', 'BasketPreview'];
            $.each(cookiesToDelete, function(index, item){
                $.cookie(item, null, { 'path': '/', expires : 0 });
                $.cookie(item, null, { 'path': '/', expires : 0, domain: cookieDomain});
            });

            $.ajax(this.logoutUrl).done(function() {
                location.reload();
            }).fail(function() {
                location.reload();
            });
        },

        /**
         *
         * @param $element
         */
        showElement : function ($element)
        {
            $element.show();
        },

        /**
         *
         * @param $element
         */
        hideElement : function ($element)
        {
            $element.hide();
        }
    };

    $().ready(function () {

        if (typeof NWS_WS === "undefined") {
            NWS_WS = {
                arrJshelper : []
            };
        };

        var forceUnpersonalizedLogout = NWS_WS.arrJshelper.forceUnpersonalizedLogout;

        new HeaderPersonalisation(
            $.cookie('NWS_USER'),
            $('#header_myesprit'),
            $('#header_myesprit_login'),
            $('#header_myesprit_logout'),
            $('#header_myesprit_salutation'),
            forceUnpersonalizedLogout
        );
    });
}(jQuery));
