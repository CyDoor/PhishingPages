//20150520

var webtrekk_identifyUserAgentAndBlockPlugin = function() {
    var ua = "";
    if(typeof navigator.userAgent !== "undefined" && navigator.userAgent && navigator.userAgent !== null) {
        ua = navigator.userAgent;
    }

    return (ua.search(/K(eynote|HTE|TXN)/) !== -1);
};

var wt_countryMapping = function(conf) {
    if(conf.mode == "page" && conf.type == "before" && conf.requestCounter == 1) {

        this.getPluginConfigObjectByContentId=function(b){
            if("object"===typeof this.customParameter&&"string"===typeof this.customParameter[11]){
                var c=this.customParameter[11],a;
                for(a in b)
                    if(-1!=c.search(a))
                        return b[a]
            }
            return null
        };

    }
};

var wt_productNameMapping = function(conf) {
    if(conf.mode == "page" && conf.type == "before" && conf.requestCounter == 1) {
        this.productName=this.product?this.product:"";
        this.customEcommerceParameter&&"undefined"!==typeof this.customEcommerceParameter[22]&&(this.productName=this.customEcommerceParameter[22]);
    }
};

var wt_frequencyAnalysis = function(conf) {
    if(conf.mode == "page" && conf.type == "before" && conf.requestCounter == 1) {

        var lifetime = 6*30;									// Cookielaufzeit in Tagen
        var deleteVisitCounter = 180;							// Löschen der Besucherzählung nach x-Tagen ohne Besuch
        var frequencyAnalysisType = "daily;weekly;monthly"; 	// daily, weekly, monthly

        var frequencyAnalysis = new this.cookieManager("wt_fa", lifetime, "/");var frequencyAnalysisSession = new this.cookieManager("wt_fa_s", "", "/");var visitFrequency = 0;if(!this.config.customSessionParameter) {this.config.customSessionParameter = {};}var getLastVisitByTimestamp = function(date) {if(!isNaN(date)) {var today = new Date();var lv = new Date(date);var a = new Date(today.getFullYear(), today.getMonth(), today.getDate());var b = new Date(lv.getFullYear(), lv.getMonth(), lv.getDate());return parseInt((a-b) / (24*60*60*1000));}return 0;};var getVisitFrequency = function(fType) {var v = false, p = false;switch(fType) {case "daily": if(visitFrequency == 1) {v = '1', p = '17';}break;case "weekly": if(visitFrequency <= 7 && visitFrequency > 0) {v = '1', p = '18';}break;case "monthly": if(visitFrequency <= 30 && visitFrequency > 0) {v = '1', p = '19';}break;}return [v, p];};var getDateByTimestamp = function(tstamp) {if(tstamp) {var date = new Date(tstamp);var fv = date.getFullYear() + "-";fv += ((date.getMonth() < 9) ? "0" : "");fv += (date.getMonth() +1);return fv;}return "";};	if(!frequencyAnalysisSession.get("start")) {if(frequencyAnalysis.get("lv")) {visitFrequency = getLastVisitByTimestamp(parseInt(frequencyAnalysis.get("lv"))); frequencyAnalysis.set("vf", visitFrequency, lifetime*24*60*60);this.config.customSessionParameter["15"] = visitFrequency + "";}frequencyAnalysis.set("lv", new Date().getTime(), lifetime*24*60*60);if(frequencyAnalysis.get("cv")) {if(visitFrequency <= deleteVisitCounter) {var count = parseInt(frequencyAnalysis.get("cv"));count++;this.config.customSessionParameter["16"] = count + "";frequencyAnalysis.set("cv", count, lifetime*24*60*60);}else {frequencyAnalysis.set("cv", "1", lifetime*24*60*60);this.config.customSessionParameter["16"] = "1";}}else {frequencyAnalysis.set("cv", "1", lifetime*24*60*60);this.config.customSessionParameter["16"] = "1";}if(frequencyAnalysisType) {var fat = frequencyAnalysisType.split(";");for(var i = 0; i < fat.length; i++) {var vf = getVisitFrequency(fat[i]);if(vf[0]) {this.config.customSessionParameter[vf[1]] = vf[0];break;}}}if(frequencyAnalysis.get("fv")) {this.config.customSessionParameter["20"] = getDateByTimestamp(parseInt(frequencyAnalysis.get("fv")));}else {var date = new Date().getTime();var fv = getDateByTimestamp(date);this.config.customSessionParameter["20"] = fv;frequencyAnalysis.set("fv", date, lifetime*24*60*60);}if(frequencyAnalysis.get("fv")) {var today = new Date().getTime();var oldDate = parseInt(frequencyAnalysis.get("fv"));var fvl = parseInt(Math.round((today - oldDate) / (24*60*60*1000) * 1000) / 1000);this.config.customSessionParameter["21"] = fvl + "";}}frequencyAnalysisSession.set("start", "1");

    }
};

var wt_scrollposition = function(conf) {
    if(conf.mode == "page" && conf.type == "after" && conf.requestCounter == 1) {
        if(
            -1!==this.contentId.indexOf("detail")||
            -1!==this.contentId.indexOf("styleoverview")||
            -1!==this.contentId.indexOf("startpage")||
            -1!==this.contentId.indexOf("startseite")||
            -1!==this.contentId.search(/\.women\.clothes$/)||
            -1!==this.contentId.search(/\.men\.clothes$/)||
            -1!==this.contentId.search(/\.kids$/)||
            -1!==this.contentId.search(/\.new$/)||
            -1!==this.contentId.search(/\.sale$/)||
            -1!==this.contentId.search(/\.home$/)||
            ("undefined"!==typeof webtrekk&&"undefined"!==typeof webtrekk.listing&&webtrekk.listing)
        ){
            var instance=this,event=this.wtTypeof(window.onbeforeunload)?"beforeunload":"unload",de=document.documentElement,scrollPosition=window.scrollY+window.innerHeight||self.scrollY+self.innerHeight||de&&de.scrollTop+de.clientHeight||document.body.scrollTop+document.body.clientHeight;this.registerEvent(window,"scroll",function(){var a=window.scrollY+window.innerHeight||self.scrollY+self.innerHeight||de&&de.scrollTop+de.clientHeight||document.body.scrollTop+document.body.clientHeight;a>scrollPosition&&(scrollPosition=a)});this.registerEvent(window,event,function(){scrollPosition=Math.round(100*(scrollPosition/(window.innerHeight+window.scrollMaxY||self.innerHeight+self.scrollMaxY||de&&de.scrollHeight||document.body.offsetHeight)));for(100<scrollPosition&&(scrollPosition=100);;)if(0!=scrollPosition%5)scrollPosition++;else break;instance.sendinfo({linkId:"scrollposition",customClickParameter:{6:scrollPosition+""},sendOnUnload:1})})
        }
    }
};

var wt_socialMedia = function(conf){if(conf.mode=="page"&&conf.type=="before"&&conf.requestCounter==1){if(typeof(window.wt_instance)==="undefined"){window.wt_instance=[];}window.wt_instance.push({"obj":this});}window.wt_googlePlusone=function(plusone){for(var j=0;j<window.wt_instance.length;j++){var obj = window.wt_instance[j].obj;try{if(plusone.state=="on"){obj.send("social media button","click","ck550=google - plus one");}if(plusone.state=="off"){obj.send("social media button","click","ck550=google - minus one");}}catch(e){};}};wt_socialMediaAsync();};
var wt_socialMediaAsync=function(){for(var i=0;i<window.wt_instance.length;i++){var wtObj=window.wt_instance[i];if(typeof(wtObj.fb)==="undefined"){try{if(FB&&FB.Event&&FB.Event.subscribe){FB.Event.subscribe('edge.create',function(targetUrl){wtObj.obj.send("social media button","click","ck550=facebook - i like");});FB.Event.subscribe('edge.remove',function(targetUrl){wtObj.obj.send("social media button","click","ck550=facebook - unlike");});FB.Event.subscribe('message.send',function(targetUrl){wtObj.obj.send("social media button","click","ck550=facebook - send");});wtObj.fb=1;}}catch(e){};}if(typeof(wtObj.tw)==="undefined"){try{if(twttr&&twttr.events&&twttr.events.bind){twttr.events.bind('tweet',function(event){if(event){wtObj.obj.send("social media button","click","ck550=twitter - tweet");}});}wtObj.tw=1;}catch(e){};}}};

var wt_adClear = function(conf) {
    if(!webtrekk_identifyUserAgentAndBlockPlugin() && conf.mode == "page" && conf.type == "before" && conf.requestCounter == 1) {

        var adclearMapping = {
            "de\\.de" : {
                "trackDomain" : "bcd.esprit.de",
                "orderCurrency" : "EUR"
            },
            "fr\\.fr" : {
                "trackDomain" : "bcd.esprit.fr",
                "orderCurrency" : "EUR"
            },
            "nl\\.nl" : {
                "trackDomain" : "bcd.esprit.nl",
                "orderCurrency" : "EUR"
            },
            "at\\.de" : {
                "trackDomain" : "bcd.esprit.at",
                "orderCurrency" : "EUR"
            },
            "ch\\.(de|fr)" : {
                "trackDomain" : "bcd.espritshop.ch",
                "orderCurrency" : "CHF"
            },
            "dk\\.da" : {
                "trackDomain" : "bcd.esprit.dk",
                "orderCurrency" : "DKK"
            },
            "fi\\.fi" : {
                "trackDomain" : "bcd.esprit.fi",
                "orderCurrency" : "EUR"
            },
            "be\\.(fr|nl)" : {
                "trackDomain" : "bcd.esprit.be",
                "orderCurrency" : "EUR"
            },
            "gb\\.en" : {
                "trackDomain" : "bcd.esprit.co.uk",
                "orderCurrency" : "GBP"
            },
            "se\\.sv" : {
                "trackDomain" : "bcd.esprit.se",
                "orderCurrency" : "SEK"
            },
            "es\\.es" : {
                "trackDomain" : "esprit.adclear.net",
                "orderCurrency" : "EUR"
            },
            "it\\.it" : {
                "trackDomain" : "esprit.adclear.net",
                "orderCurrency" : "EUR"
            },
            "cz\\.cs" : {
                "trackDomain" : "esprit.adclear.net",
                "orderCurrency" : "CZK"
            },
            "eu\\.en" : {
                "trackDomain" : "esprit.adclear.net",
                "orderCurrency" : "EUR"
            }
        };


        var adclearConfig = this.getPluginConfigObjectByContentId(adclearMapping);
        if(adclearConfig && adclearConfig !== null) {
            adclearConfig.advertiserId = "A2201341";
            adclearConfig.doACF = true;
            adclearConfig.doACTW = false;
            adclearConfig.lifeCycle = false;
            adclearConfig.lifeCycleTime = 2000;
            adclearConfig.contentId = this.config.contentId;
            adclearConfig.mediaCode = this.config.campaignId;
            adclearConfig.conversionTarget = "";
            adclearConfig.conversionId = this.config.orderId;
            adclearConfig.orderValue = this.config.orderValue;
            adclearConfig.customerId = this.config.customerId;
            adclearConfig.invoiceValue = "";
            adclearConfig.discountCode = "";
            adclearConfig.discountValue = "";
            adclearConfig.trackCategory = "";
            adclearConfig.isCustomerNew = "";
            adclearConfig.passThrough = "";
            adclearConfig.product = this.config.product;
            adclearConfig.productCost = this.config.productCost;
            adclearConfig.productQuantity = this.config.productQuantity;
            adclearConfig.productCategory = "";

            (function(w,d){var a=function(){this.prt=((location.protocol.toLowerCase())=="https:"?"https:":"http:");},p=a.prototype;p.tst=function(){return new Date().getTime();};p.enc=function(e){if(e){if(typeof encodeURIComponent==="function"){return encodeURIComponent(e)}return escape(e)}};p.img=function(e){if(typeof Image==="undefined"){var Image=function(){return document.createElement("img")};}if(typeof t!=="object"){var t=[];}var n=t.length;t[n]=new Image();t[n].src=e;t[n].width=1;t[n].height=1;t[n].border=0;t[n].onload=function(){};};p.frm=function(e){var t=d,n=t.createElement("iframe"),b=t.body||t.getElementsByTagName('body')[0];n.src=e;n.width=0;n.height=0;n.vspace=0;n.hspace=0;n.marginWidth=0;n.marginHeight=0;n.allowTransparency=true;n.scrolling="no";n.frameBorder=0;try{b.insertBefore(n,b.firstChild);}catch(r){}};p.apr=function(e){var t="ts="+this.tst();t+="&cvt="+this.enc(e.conversionTarget);var n=((e.conversionId)?e.conversionId:e.conversionTarget+":"+this.tst());t+="&cvid="+this.enc(n);if(e.orderValue){t+="&ov="+this.enc(e.orderValue)}if(e.orderCurrency){t+="&oc="+this.enc(e.orderCurrency)}if(e.invoiceValue){t+="&iv="+this.enc(e.invoiceValue)}if(e.discountCode){t+="&dc="+this.enc(e.discountCode)}if(e.discountValue){t+="&dv="+this.enc(e.discountValue)}if(e.trackCategory){t+="&tc="+this.enc(e.trackCategory)}if(e.customerId){t+="&cuid="+this.enc(e.customerId)}if(e.isCustomerNew){var r=e.isCustomerNew.toLowerCase();t+="&icn=";t+=((r=="true"||r=="false")?r:"null");}if(e.basket){t+="&bk="+this.enc(e.basket)}if(e.contentId){t+="&ci="+this.enc(e.contentId)}if(e.passThrough){t+='&pt='+this.enc(e.passThrough);}if(e.wteid){t+="&wteid="+this.enc(e.wteid)}return this.afp(e,t)};p.cpr=function(e){var t="ts="+this.tst();if(e.mediaCode){t+="&ac_mc="+this.enc(e.mediaCode)};if(e.contentId){t+="&ci="+this.enc(e.contentId)};if(e.wteid){t+="&wteid="+this.enc(e.wteid)};var n=w.document.referrer;if(n){t+="&oref="+this.enc(n)}return this.afp(e,t)};p.afp=function(e,t){try{var n=new ACFP();t+=((e.doACF)?n.afp():"");}catch(r){}return t};p.aca=function(e){var t=this.prt+"//"+e.trackDomain+"/"+((e.doACTW)?"tm":"acv")+"/"+e.advertiserId+"/aca?mod=m&"+this.apr(e);this.frm(t);};p.acc=function(e){var t=this.prt+"//"+e.trackDomain+"/acv/"+e.advertiserId+"/acc?"+this.cpr(e);this.img(t);};w.ACTR=a;})(window,document);var createAdClear=function(b,a){var d=a.lifeCycleTime?a.lifeCycleTime:2E3,g="https:"==location.protocol?"https://":"http://",h=function(b){b&&(b=new ACTR,a.orderValue||a.conversionTarget?b.aca(a):b.acc(a))},f=function(a,b){a&&(adclear_xlc_id&&null!==adclear_xlc_id&&(b.config.xlc=adclear_xlc_id,b.config.xlct="ac1"),b.sendinfo(b.config))};a.contentId=a.contentId||b.config.contentId||"";a.orderValue=a.orderValue||b.config.orderValue||"";a.conversionId=a.conversionId||b.config.orderId||"";a.orderCurrency=a.orderCurrency||b.config.currency||"";a.wteid=b.eid||"";a.invoiceValue=a.invoiceValue||"";a.discountCode=a.discountCode||"";a.discountValue=a.discountValue||"";a.product=a.product||b.config.product||"";a.productCost=a.productCost||b.config.productCost||"";a.productQuantity=a.productQuantity||b.config.productQuantity||"";a.trackCategory=a.trackCategory||"";a.productCategory=a.productCategory||"";a.mediaCode=a.mediaCode||b.config.campaignId||"";a.passThrough=a.passThrough||"";a.customerId=a.customerId||b.config.customerId||"";a.isCustomerNew=a.isCustomerNew||"";a.customerSurvey=a.customerSurvey||"";if(a.orderValue||a.conversionTarget){if(a.orderValue){if(a.lifeCycle){var e=g+a.trackDomain+"/acv/"+a.advertiserId+"/aca?getLifeCycleId";b.loadAsynchron(e,"adclear_xlc_id",f,d);b.deactivateRequest=!0}for(var d=a.product.split(";"),f=a.productCost.split(";"),e=a.productQuantity.split(";"),i=a.productCategory.split(";"),j=[],c=0,o=d.length,k,l,m,n;c<o;c++)k="undefined"!==typeof d[c]?d[c]:"",l="undefined"!==typeof f[c]?f[c]:"",m="undefined"!==typeof e[c]?e[c]:"",n="undefined"!==typeof i[c]?i[c]:"",j.push('{"id":"'+k+'","tc":"","pr":"'+l+'","qt":"'+m+'","pc":"'+n+'"}');d="["+j.join(",")+"]";a.basket=d}a.conversionTarget=a.conversionTarget||"Sale"}a.doACF?(e=g+a.trackDomain+"/scripts/acfp.js",b.loadAsynchron(e,"ACFP",h,6E4)):h(!0,b)};createAdClear(this, adclearConfig);
        }
    }
};

var wt_adClearCookieHandshake = function (conf) {
    if(!webtrekk_identifyUserAgentAndBlockPlugin() && conf.mode == "page" && conf.type == "before" && conf.requestCounter == 1) {

        var adclearTag = {
            advertiserId : '20'
        };

        var ACCM=function(){this.prt=location.protocol.toLowerCase()=="https:"?"https:":"http:";this.tst=function(){var e=new Date;var t=e.getTime();return t};this.img=function(e){if(document.images){if(typeof t!="object"){var t=new Array}
        var n=t.length;t[n]=new Image;t[n].src=e;t[n].width=1;t[n].height=1;t[n].border=0;t[n].onload=function(){}}else{var r=document.getElementsByTagName("body")[0];var t=document.createElement("img");t.src=e;t.width=1;t.height=1;t.border=0;t.alt="";r.appendChild(t)}};this.ckm=function(e){var t=this.gcc();if(t==null||t==""){return;}
        var c=document.cookie;var u=c.indexOf("accm_scm=1;")>-1?'accm_scm':this.scm();if(u!='accm_scm'){var n="ts="+this.tst();var n=this.prt+"//track.adclear.net/ckm/"+e.advertiserId+"/?ts="+this.tst()+"&ck="+t;this.img(n)}};this.gcc=function(){if(typeof String.prototype.trim!=='function'){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,'');}}
        var e=document.cookie.split(";");for(var t=0;t<e.length;++t){var n=e[t].split("=");if(n[0].trim()=="acc"){return n[1].trim()}}
        return null};this.scm=function(){var t=new Date();var d=t.getTime()+(1*24*60*60*1000);t.setTime(d);document.cookie="accm_scm=1; expires="+t.toGMTString();return null};};var act=new ACCM;act.ckm(adclearTag);
    }
};

var wt_criteo = function(conf) {
    if(!webtrekk_identifyUserAgentAndBlockPlugin() && conf.mode == "page" && conf.type == "after" && conf.requestCounter == 1) {

        var criteoMapping = {
            "de\\.de" : {
                'partnerId' : 1998,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["de.de.startpage", "de.de.startpagemen", "m.de.de.startpage", "m.de.de.startpagemen"],
                'contentIdBasket' : ["de.de.basket", "m.de.de.basket"]
            },
            "at\\.de" : {
                'partnerId' : 2537,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["at.de.startpage", "at.de.startpagemen", "m.at.de.startpage", "m.at.de.startpagemen"],
                'contentIdBasket' : ["at.de.basket", "m.at.de.basket"]
            },
            "fr\\.fr" : {
                'partnerId' : 2163,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["fr.fr.startpage", "fr.fr.startpagemen", "m.fr.fr.startpage", "m.fr.fr.startpagemen"],
                'contentIdBasket' : ["fr.fr.basket", "m.fr.fr.basket"]
            },
            "nl\\.nl" : {
                'partnerId' : 3130,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["nl.nl.startpage", "nl.nl.startpagemen", "m.nl.nl.startpage", "m.nl.nl.startpagemen"],
                'contentIdBasket' : ["nl.nl.basket", "m.nl.nl.basket"]
            },
            "dk\\.da" : {
                'partnerId' : 4826,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["dk.da.startpage", "dk.da.startpagemen", "m.dk.da.startpage", "m.dk.da.startpagemen"],
                'contentIdBasket' : ["dk.da.basket", "m.dk.da.basket"]
            },
            "fi\\.fi" : {
                'partnerId' : 4947,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["fi.fi.startpage", "fi.fi.startpagemen", "m.fi.fi.startpage", "m.fi.fi.startpagemen"],
                'contentIdBasket' : ["fi.fi.basket", "m.fi.fi.basket"]
            },
            "ch\\.de" : {
                'partnerId' : 2538,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["ch.de.startpage", "ch.de.startpagemen", "m.ch.de.startpage", "m.ch.de.startpagemen"],
                'contentIdBasket' : ["ch.de.basket", "m.ch.de.basket"]
            },
            "ch\\.fr" : {
                'partnerId' : 4460,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["ch.fr.startpage", "ch.fr.startpagemen", "m.ch.fr.startpage", "m.ch.fr.startpagemen"],
                'contentIdBasket' : ["ch.fr.basket", "m.ch.fr.basket"]
            },
            "be\\.fr" : {
                'partnerId' : 2539,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["be.fr.startpage", "be.fr.startpagemen", "m.be.fr.startpage", "m.be.fr.startpagemen"],
                'contentIdBasket' : ["be.fr.basket", "m.be.fr.basket"]
            },
            "be\\.nl" : {
                'partnerId' : 2540,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["be.nl.startpage", "be.nl.startpagemen", "m.be.nl.startpage", "m.be.nl.startpagemen"],
                'contentIdBasket' : ["be.nl.basket", "m.be.nl.basket"]
            },
            "gb\\.en" : {
                'partnerId' : 2536,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["gb.en.startpage", "gb.en.startpagemen", "m.gb.en.startpage", "m.gb.en.startpagemen"],
                'contentIdBasket' : ["gb.en.basket", "m.gb.en.basket"]
            },
            "se\\.sv" : {
                'partnerId' : 9902,
                'list' : (typeof(webtrekk) != "undefined" && typeof(webtrekk.listing) != "undefined") ? webtrekk.listing : "",
                'contentIdHomepage' : ["se.sv.startpage", "se.sv.startpagemen", "m.se.sv.startpage", "m.se.sv.startpagemen"],
                'contentIdBasket' : ["se.sv.basket", "m.se.sv.basket"]
            }
        };

        var criteoConfig=this.getPluginConfigObjectByContentId(criteoMapping);

        if(null!==criteoConfig){
            criteoConfig.criteoStaticJS="/javascript/jquery-plugins/jNetradaWebtrekk/ld.js";
            criteoConfig.userSegment="";
            criteoConfig.newCustomer="";
            criteoConfig.siteType=((this.contentId.search(/^m\./)!==-1)?"m":"d");

            var criteoIntegrationData={currentPage:null,internalSearch:"",transactionId:"",products:null};criteoConfig="undefined"!==typeof window.webtrekkCriteoConfig?window.webtrekkCriteoConfig:criteoConfig;
            if(null!==criteoConfig&&criteoConfig.partnerId){window.criteo_q=window.criteo_q||[];criteo_q.push({event:"setAccount",account:criteoConfig.partnerId},{event:"setCustomerId",id:this.customerId?this.customerId:""},{event:"setSiteType",type:criteoConfig.siteType});var include=function(b){if(!document.createElement)return!1;var c=document.getElementsByTagName("head").item(0),a=document.createElement("script");a.setAttribute("language","javascript");a.setAttribute("type","text/javascript");a.setAttribute("src",
                b);c.appendChild(a);return!0},productTag=function(){null!==criteoIntegrationData.products&&0<criteoIntegrationData.products.length&&criteo_q.push({event:"viewItem",item:criteoIntegrationData.products[0].id,user_segment:criteoConfig.userSegment})},saleTag=function(){if(null!==criteoIntegrationData.products){for(var b=[],c=0;c<criteoIntegrationData.products.length;c++){var a=criteoIntegrationData.products[c],d=parseFloat(a.singlePrice),e=parseInt(a.quantity),d=d/e;b.push({id:a.id,price:isNaN(d)?a.singlePrice:
                safeString(d),quantity:a.quantity})}0<b.length&&criteo_q.push({event:"trackTransaction",user_segment:criteoConfig.userSegment,id:criteoIntegrationData.transactionId,new_customer:criteoConfig.newCustomer,deduplication:"",item:b})}},homeTag=function(){criteo_q.push({event:"viewHome",user_segment:criteoConfig.userSegment})},listTag=function(){null!==criteoIntegrationData.products&&0<criteoIntegrationData.products.length&&criteo_q.push({event:"viewList",item:criteoIntegrationData.products,user_segment:criteoConfig.userSegment,
                keywords:criteoIntegrationData.internalSearch?criteoIntegrationData.internalSearch:""})},basketTag=function(){if(null!==criteoIntegrationData.products){for(var b=[],c=0;c<criteoIntegrationData.products.length;c++){var a=criteoIntegrationData.products[c],d=parseFloat(a.singlePrice),e=parseInt(a.quantity),d=d/e;b.push({id:a.id,price:isNaN(d)?a.singlePrice:safeString(d),quantity:a.quantity})}0<b.length&&criteo_q.push({event:"viewBasket",item:b,user_segment:criteoConfig.userSegment})}},safeString=function(b){return!1===
                b?"":b+""};if(null===criteoIntegrationData.currentPage)for(var i=0;i<criteoConfig.contentIdHomepage.length;i++)if(this.contentId==criteoConfig.contentIdHomepage[i]){criteoIntegrationData.currentPage="home";break}if(null===criteoIntegrationData.currentPage)for(i=0;i<criteoConfig.contentIdBasket.length;i++)if(this.contentId==criteoConfig.contentIdBasket[i]){criteoIntegrationData.currentPage="basket";break}null===criteoIntegrationData.currentPage&&"view"==this.productStatus&&(criteoIntegrationData.currentPage=
                "product");if(null===criteoIntegrationData.currentPage&&(criteoConfig.list||this.internalSearch)){criteoIntegrationData.currentPage="list";if(criteoConfig.list){criteoIntegrationData.products=[];for(var products=criteoConfig.list.split(";"),length=3>=products.length?products.length:3,j=0;j<length;j++)criteoIntegrationData.products.push(products[j])}this.internalSearch&&(criteoIntegrationData.internalSearch=this.internalSearch)}null===criteoIntegrationData.currentPage&&this.orderValue&&(criteoIntegrationData.currentPage=
                "sale",this.orderId&&(criteoIntegrationData.transactionId=this.orderId));if(this.product){criteoIntegrationData.products=[];for(var products=safeString(this.productName).split(";"),productCosts=safeString(this.productCost).split(";"),productQuantities=safeString(this.productQuantity).split(";"),i=0;i<products.length;i++)criteoIntegrationData.products.push({id:"undefined"!==typeof products[i]&&products[i]?products[i]:"",singlePrice:"undefined"!==typeof productCosts[i]&&productCosts[i]?productCosts[i]:
                "0",quantity:"undefined"!==typeof productQuantities[i]&&productQuantities[i]?productQuantities[i]:"1"})}var loadCriteo=!1;switch(criteoIntegrationData.currentPage){case "product":productTag();loadCriteo=!0;break;case "sale":saleTag();loadCriteo=!0;break;case "home":homeTag();loadCriteo=!0;break;case "list":listTag();loadCriteo=!0;break;case "basket":basketTag(),loadCriteo=!0}loadCriteo&&include(criteoConfig.criteoStaticJS)};
        }

    }
};

var wt_sociomantic = function(conf) {
    if(!webtrekk_identifyUserAgentAndBlockPlugin() && conf.mode == "page" && conf.type == "after" && conf.requestCounter == 1) {

        var pixel = this;
        var sociomanticMapping = {
            "de\\.de" : {
                get: function() {
                    return {
                        "advertiserId": "esprit-de" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder": ["DE_IC_XX_RG_40_00002", "DE_IC_XX_RG_40_00005", "DE_IC_BB_RG_40_00001", "DE_IC_BB_RG_40_00002", "DE_IC_BB_RG_40_00004", "DE_IC_BB_RG_40_00005", "DE_IC_BB_RG_40_00006", "DE_IC_BB_RG_40_00007"],
                        "contentIdHomepage": ["de.de.startpage", "de.de.startpagemen", "m.de.de.startpage", "m.de.de.startpagemen"],
                        "contentIdBasket": ["de.de.basket", "m.de.de.basket"],
                        "currency": "EUR"
                    };
                }
            },
            "at\\.de" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-at" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["AT_IC_XX_RG_40_00002", "AT_IC_XX_RG_40_00004", "AT_IC_BB_RG_40_00001", "AT_IC_BB_RG_40_00002"],
                        "contentIdHomepage" : ["at.de.startpage", "at.de.startpagemen", "m.at.de.startpage", "m.at.de.startpagemen"],
                        "contentIdBasket" : ["at.de.basket", "m.at.de.basket"],
                        "currency" : "EUR"
                    };
                }
            },
            "ch\\.fr" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-ch-fr" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["CF_IC_XX_RG_40_00002", "CF_IC_XX_RG_40_00004", "CF_IC_BB_RG_40_00001", "CF_IC_BB_RG_40_00002"],
                        "contentIdHomepage" : ["ch.fr.startpage", "ch.fr.startpagemen", "m.ch.fr.startpage", "m.ch.fr.startpagemen"],
                        "contentIdBasket" : ["ch.fr.basket", "m.ch.fr.basket"],
                        "currency" : "CHF"
                    };
                }
            },
            "ch\\.de" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-ch" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["CD_IC_XX_RG_40_00002", "CD_IC_XX_RG_40_00004", "CD_IC_BB_RG_40_00001", "CD_IC_BB_RG_40_00002"],
                        "contentIdHomepage" : ["ch.de.startpage", "ch.de.startpagemen", "m.ch.de.startpage", "m.ch.de.startpagemen"],
                        "contentIdBasket" : ["ch.de.basket", "m.ch.de.basket"],
                        "currency" : "CHF"
                    };
                }
            },
            "fr\\.fr" : {
                get: function() {
                    return {
                        "advertiserId" : "esprit-fr" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["FR_IC_XX_RG_40_00002", "FR_IC_XX_RG_40_00005", "FR_IC_BB_RG_40_00001", "FR_IC_BB_RG_40_00002"],
                        "contentIdHomepage" : ["fr.fr.startpage", "fr.fr.startpagemen", "m.fr.fr.startpage", "m.fr.fr.startpagemen"],
                        "contentIdBasket" : ["fr.fr.basket", "m.fr.fr.basket"],
                        "currency" : "EUR"
                    };
                }
            },
            "nl\\.nl" : {
                get: function() {
                    return {
                        "advertiserId" : "esprit-nl" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["NL_IC_XX_RG_40_00002", "NL_IC_XX_RG_40_00003", "NL_IC_BB_RG_40_00001", "NL_IC_BB_RG_40_00002"],
                        "contentIdHomepage" : ["nl.nl.startpage", "nl.nl.startpagemen", "m.nl.nl.startpage", "m.nl.nl.startpagemen"],
                        "contentIdBasket" : ["nl.nl.basket", "m.nl.nl.basket"],
                        "currency" : "EUR"
                    };
                }
            },
            "dk\\.da" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-dk" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["DK_IC_XX_RG_40_00002", "DK_IC_XX_RG_40_00004", "DK_IC_BB_RG_40_00001", "DK_IC_BB_RG_40_00002"],
                        'contentIdHomepage' : ["dk.da.startseite_men", "dk.da.startpagemen", "m.dk.da.startseite_men", "m.dk.da.startpagemen"],
                        'contentIdBasket' : ["dk.da.basket", "m.dk.da.basket"],
                        "currency" : "DKK"
                    };
                }
            },
            "fi\\.fi" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-fi" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["FI_IC_XX_RG_40_00002", "FI_IC_XX_RG_40_00005", "FI_IC_BB_RG_40_00001", "FI_IC_BB_RG_40_00002"],
                        'contentIdHomepage' : ["fi.fi.startseite_men", "fi.fi.startpagemen", "m.fi.fi.startseite_men", "m.fi.fi.startpagemen"],
                        'contentIdBasket' : ["fi.fi.basket", "m.fi.fi.basket"],
                        "currency" : "EUR"
                    };
                }
            },
            "be\\.fr" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-be-fr" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["BF_IC_XX_RG_40_00002", "BF_IC_XX_RG_40_00004", "BF_IC_BB_RG_40_00001", "BF_IC_BB_RG_40_00002"],
                        'contentIdHomepage' : ["be.fr.startpage", "be.fr.startpagemen", "m.be.fr.startpage", "m.be.fr.startpagemen"],
                        'contentIdBasket' : ["be.fr.basket", "m.be.fr.basket"],
                        "currency" : "EUR"
                    };
                }
            },
            "be\\.nl" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-be" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["BN_IC_XX_RG_40_00002", "BN_IC_XX_RG_40_00004", "BN_IC_BB_RG_40_00001", "BN_IC_BB_RG_40_00002"],
                        'contentIdHomepage' : ["be.nl.startpage", "be.nl.startpagemen", "m.be.nl.startpage", "m.be.nl.startpagemen"],
                        'contentIdBasket' : ["be.nl.basket", "m.be.nl.basket"],
                        "currency" : "EUR"
                    };
                }
            },
            "gb\\.en" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-uk" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["UK_IC_XX_RG_40_00002", "UK_IC_XX_RG_40_00005", "UK_IC_BB_RG_40_00001", "UK_IC_BB_RG_40_00002"],
                        'contentIdHomepage' : ["gb.en.startpage", "gb.en.startpagemen", "m.gb.en.startpage", "m.gb.en.startpagemen"],
                        'contentIdBasket' : ["gb.en.basket", "m.gb.en.basket"],
                        "currency" : "GBP"
                    };
                }
            },
            "se\\.sv" : {
                get: function() {
                    if(pixel.contentId.search(/^m\./) !== -1) {
                        return null;
                    }

                    return {
                        "advertiserId" : "esprit-se" + ((pixel.contentId.search(/^m\./) !== -1) ? "-m" : ""),
                        "lastClickOrder" : ["SE_IC_XX_RG_40_00002", "SE_IC_XX_RG_40_00004", "SE_IC_BB_RG_40_00001", "SE_IC_BB_RG_40_00002"],
                        'contentIdHomepage' : ["se.sv.startpage", "se.sv.startpagemen", "m.se.sv.startpage", "m.se.sv.startpagemen"],
                        'contentIdBasket' : ["se.sv.basket", "m.se.sv.basket"],
                        "currency" : "SEK"
                    };
                }
            },
            "config" : {
                "category": [],		// Seiten-Kategorien
                "valid": "",		// Zeitstempel bis wann das Produkt verfuegbar ist
                "quantity": "",		// Anzahl der Produkte die noch verfuegbar sind
                "score" : "",		// Prioritaetswert des Produktes
                "fn": "",			// Produktname
                "description": "",	// Produktbeschreibung
                "brand": "",		// Marke oder Hersteller
                "currency": "",		// Waehrungscode
                "photo": ""			// URL des Produktbildes
            }
        };
        var sociomanticConfig=this.getPluginConfigObjectByContentId(sociomanticMapping);if(null!==sociomanticConfig){sociomanticConfig=sociomanticConfig.get()}if(null!==sociomanticConfig){sociomanticConfig.product=sociomanticMapping.config;if(this.contentGroup)for(var pc=[3,5,6],i=0;i<pc.length;i++)"undefined"!==typeof this.contentGroup[pc[i]]&&sociomanticConfig.product.category.push(this.contentGroup[pc[i]]);if(null!==document.getElementById("sonar")){return;}var createSonarTag=function(){var a=document.getElementsByTagName("head").item(0),b=document.createElement("script");b.id="sonar";b.type="text/javascript";a.appendChild(b)},createBasket=function(a,b,d){for(var e=[],a=a?a.split(";"):[],b=b?b.split(";"):[],d=d?d.split(";"):[],c=0;c<a.length;c++)e.push({identifier:"undefined"!==typeof a[c]?a[c]:"",amount:"undefined"!==typeof b[c]?b[c]:"",currency:sociomanticConfig.currency,quantity:"undefined"!==typeof d[c]?d[c]:""});return e},setSociomanticTag=function(a){var b=document.createElement("script");b.id="sonar-adpan";b.type="text/javascript";b.async;b.src=a;a=document.getElementById("sonar");a.parentNode.insertBefore(b,a)},isHomeOrBasket=function(a){for(var b=0;b<a.length;b++)if(pixel.contentId==a[b])return!0;return!1},isConfirmed=function(){if(pixel.config.customEcommerceParameter&&"undefined"!==typeof pixel.config.customEcommerceParameter[15])for(var a=0;a<sociomanticConfig.lastClickOrder.length;a++)if(pixel.config.customEcommerceParameter[15]==sociomanticConfig.lastClickOrder[a])return!0;return!1};0<sociomanticConfig.product.category.length&&""!==sociomanticConfig.product.category[0]&&(window.product={category:sociomanticConfig.product.category},isHomeOrBasket(sociomanticConfig.contentIdHomepage)&&(window.product={}));"view"==this.productStatus&&-1==this.productName.indexOf(";")&&(window.product={identifier:this.productName});this.internalSearch&&(window.search={query:this.internalSearch,type:1});isHomeOrBasket(sociomanticConfig.contentIdBasket)&&this.productName&&(window.product={},window.basket={products:createBasket(this.productName,this.productCost,this.productQuantity)});if("conf"==this.productStatus||this.orderId)window.basket={products:createBasket(this.productName,this.productCost,this.productQuantity),transaction:this.orderId,amount:this.orderValue},window.sale={confirmed:isConfirmed()};this.customerId&&(window.customer={identifier:this.customerId});createSonarTag();setSociomanticTag(document.location.protocol+"//sonar.sociomantic.com/js/2010-07-01/adpan/"+sociomanticConfig.advertiserId)};
    }
};

var wt_defacto = function(conf) {
    if(!webtrekk_identifyUserAgentAndBlockPlugin() && conf.mode == "page" && conf.type == "after") {
        var newsletterCamp = "";
        if(conf.requestCounter == 1) {
            newsletterCamp = this.urlParam(document.location.href, "camp", "");
            if(newsletterCamp.search(/.+(_ES_MC|_WT_.+)_NL_60.*/) === -1) {
                newsletterCamp = "";
            }
        }

        var isCountry = this.getPluginConfigObjectByContentId({
            "de\\.de": true
        });

        if((this.productStatus == "add" || this.orderId || newsletterCamp) && isCountry && isCountry !== null) {
            var defactoURL = document.location.protocol + "//esprit01.defacto-software.de/c/wt?";

            var defactoParameter = [];
            defactoParameter.push("p=" + this.wtEscape(this.config.contentId));
            defactoParameter.push("eid=" + this.wtEscape(this.eid));

            if(this.config.product) {
                defactoParameter.push("ba=" + this.wtEscape(this.config.product));
                defactoParameter.push("i=" + this.wtEscape(this.productName));
                defactoParameter.push("co=" + this.wtEscape(this.config.productCost));
                defactoParameter.push("qn=" + this.wtEscape(this.config.productQuantity));
                defactoParameter.push("st=" + this.wtEscape(this.config.productStatus));
            }

            if(newsletterCamp) {
                defactoParameter.push("mc=" + this.wtEscape(newsletterCamp));
            }

            if(this.config.productStatus == "add") {
                if(typeof NWS_WS !== "undefined" && typeof NWS_WS.arrJshelper !== "undefined" && typeof NWS_WS.arrJshelper["strStyleName"] !== "undefined" && NWS_WS.arrJshelper["strStyleName"]) {
                    defactoParameter.push("pn=" + this.wtEscape(NWS_WS.arrJshelper["strStyleName"]));
                }

                var currentCAMP = false;
                try {
                    var campaignCookie = this.getCookie("campaign").split("\"");
                    var data = [];

                    for(var i = 0; i < campaignCookie.length; i++) {
                        if(campaignCookie[i].search(/^\w+$/) !== -1) {
                            data.push(campaignCookie[i]);
                        }
                    }

                    for(var j = 0; j < data.length; j++) {
                        if(data[j] === "currentCAMP" && typeof data[j+1] !== "undefined" && data[j+1] && data[j] !== "kickoffCAMP" && data[j] !== "referrerUrl") {
                            currentCAMP = data[j+1];
                        }
                    }
                }
                catch(e){}

                if(currentCAMP) {
                    defactoParameter.push("cb15=" + this.wtEscape(currentCAMP));
                }
            }

            if(this.config.currency) {
                defactoParameter.push("cr=" + this.wtEscape(this.config.currency));
            }

            if(this.config.customerId) {
                defactoParameter.push("cd=" + this.wtEscape(this.config.customerId));
            }

            if(this.config.orderId) {
                defactoParameter.push("ov=" + this.wtEscape(this.config.orderId));
                defactoParameter.push("oi=" + this.wtEscape(this.config.orderValue));
            }

            defactoURL += defactoParameter.join("&");
            defactoURL += this.checkCustomParameter(this.config.productCategory, "ca");
            defactoURL += this.checkCustomParameter(this.config.customEcommerceParameter, "cb");

            this.sendPixel(defactoURL);
        }
    }
};


/**
 * webtrekkConfig
 *
 * globale webtrekk konfiguration
 * global webtrekk config
 * @type Object
 */
var webtrekkConfig = {
    trackId : "111111111111111",
    trackDomain : "q3.webtrekk.net",
    domain : "www.domain.de",
    cookie : "1",
    contentId : ""
};


/*
 ********************* Ab hier nichts Aendern ********************
 ********************* Don't change anything beyond this line ********************
 */
var webtrekkUnloadObjects=[];var webtrekkLinktrackObjects=[];var webtrekkHeatmapObjects=[];var webtrekkV3 = function($b){var webtrekkUnload=function($c,$d){if($e.cookie=="1"&&!$e.optOut&&!$e.deactivatePixel){$e.firstParty();};var $f=($d)?$d:($e.formObject&&$c!="noForm")?"form":"link";if($e.beforeUnloadPixel!=false){$e.beforeUnloadPixel();}else if($f=="form"){$e.executePlugin($e.getPluginConfig("form","before"));};var p="";if($e.config.linkId){p+="&ct="+$e.wtEscape($e.maxlen($e.config.linkId,255));if(p){if($e.linktrackOut){p+="&ctx=1";};var $g=$e.ccParams;if(typeof($g)=='string'&&$g!=''){p+=$g;}}};if($e.wtEp){if($e.wtEpEncoded){p+=$e.wtEp;}else{var $h=$e.wtEp;if(typeof($h)=='string'&&$h!=''){$h=$h.split(/;/);for(var z=0;z<$h.length;z++){if($e.wtTypeof($h[z])){var $i=$h[z].split(/=/);if($e.checkSC('custom')){$i[1]=$e.decrypt($i[1]);};$i[1]=$e.wtEscape($i[1]);p+='&'+$i[0]+'='+$i[1];}}}}};if($c!="noForm"){p+=$e.checkFormTracking();};if(p!=""){$e.quicksend($e.wtEscape($e.contentId.split(";")[0])+",1,"+$e.baseparams(),p);$e.config.linkId="";$e.ccParams="";$e.wtEp="";};if($e.afterUnloadPixel!=false){$e.afterUnloadPixel();}else if($f=="form"){$e.executePlugin($e.getPluginConfig("form","after"));}};var webtrekkLinktrack=function(e){if((e.which&&e.which==1)||(e.button&&e.button==1)){var a=((document.all&&window.event!==null)?window.event.srcElement:this);for(var i=0;i<4;i++){if(a.tagName&&a.tagName.toLowerCase()!="a"&&a.tagName.toLowerCase()!="area"){a=a.parentElement;}};$e.config=$e.getConfig(true);$e.config.customClickParameter=$e.customClickParameter;a.lname=$e.getAttribute(a,$e.linkTrackAttribute);a.lpos=0;$e.getCCParams(a);if(!$e.wtLength(a.lpos)&&a.tagName){var c=document.links;for(var d=0;d<$e.wtLength(c);d++){if(a==c[d]){a.lpos=d+1;break;}}};if(a.lpos){if($e.getJSON(a.lname)!=null){$e.parseJSON($e.getJSON(a.lname));a.lname=$e.config.linkId;};if($e.linkTrack=="link"){var y=a.href.indexOf("//");y=(y>=0?a.href.substr(y+2):a.href);if($e.linkTrackPattern){if(!$e.linkTrackReplace){$e.linkTrackReplace="";};y=y.replace($e.linkTrackPattern,$e.linkTrackReplace);};$e.config.linkId=(a.lname?(a.lname+"."):"")+y.split("?")[0].replace(/\//g,".");var p="";if($e.linkTrackParams){p=$e.linkTrackParams.replace(/;/g,",").split(",");};for(var i=0;i<p.length;i++){var v=$e.urlParam(y,p[i],"");if(v){$e.config.linkId+="."+p[i]+"."+v;}}}else if($e.linkTrack=="standard"&&a.lname){$e.config.linkId=a.lname;};var $j=false;if($e.linkTrackDownloads){var $k=a.href.split(".");$k=$k.pop();var $l=$e.linkTrackDownloads.split(";");for(i=0;i<$l.length;i++){if($l[i]==$k){$j=true;break;}}};if($e.config.linkId){if($e.domain&&!$e.isOwnDomain(a.href)){$e.linktrackOut=true;}};var $m="link";if($j||($e.config.linkId&&a.target!=""&&a.target!="_self")){$m="click";};$e.sendinfo($e.config,$e.config.linkId,$m);}}};var webtrekkHeatmapClick=function(e){var $n=document.getElementById($e.heatmapRefpoint),$o;if($n&&$n!==null){$o={left:0,top:0};}else{$o={left:-1,top:-1};};if($n&&$n!==null){if($e.wtTypeof($n.offsetLeft)){while($n){$o.left+=(($n.offsetLeft>=0)?$n.offsetLeft:0);$o.top+=(($n.offsetTop>=0)?$n.offsetTop:0);$n=$n.offsetParent;}}};var $p=0;var $q=0;if(!e){var e=window.event;};if(e.pageX||e.pageY){$p=e.pageX;$q=e.pageY;}else{if(e.clientX||e.clientY){$p=e.clientX;$q=e.clientY;if($e.isIE){if(document.body.scrollLeft>0||document.body.scrollTop>0){$p+=document.body.scrollLeft;$q+=document.body.scrollTop;}else{if(document.documentElement.scrollLeft>0||document.documentElement.scrollTop>0){$p+=document.documentElement.scrollLeft;$q+=document.documentElement.scrollTop;}}}}};var $r=0;if($e.isIE){$r=document.body.clientWidth;}else{$r=self.innerWidth-16;};var $s=true;if($p>=$r||!$e.sentFullPixel){$s=false;};if(($o.top>=0||$o.left>=0)&&$p>$o.left&&$q>$o.top){$p='-'+($p-$o.left);$q='-'+($q-$o.top);};if($s&&$e.heatmap=="1"){$e.executePlugin($e.getPluginConfig("heatmap","before"));$e.quicksend($e.wtEscape($e.contentId.split(";")[0])+","+$p+","+$q,'',"hm");$e.executePlugin($e.getPluginConfig("heatmap","after"));}};var webtrekkStartHeatmap=function(){if(typeof(wt_heatmap)!="undefined"){window.setTimeout("wt_heatmap()",1000);}else{if(typeof($t)=="undefined"){$t=0;};$t++;if($t<60){window.setTimeout(function(){webtrekkStartHeatmap();},1000);}}};var webtrekkStartOverlay=function(){if(typeof(wt_overlay)!="undefined"){wt_overlay();}else{if(typeof($u)=="undefined"){$u=0;};$u++;if($u<60){window.setTimeout(function(){webtrekkStartOverlay();},1000);}}};var webtrekkFormTrackInstall=function(){$e.findForm();if(!$e.formObject){return;};for(var j=0;j<$e.formObject.elements.length;j++){var e=$e.formObject.elements[j];$e.registerEvent(e,"focus",webtrekkFormFocus);};$e.registerEvent($e.formObject,"submit",webtrekkFormSubmit);$e.registerEvent(window,(($e.wtTypeof(window.onbeforeunload))?"beforeunload":"unload"),webtrekkUnload);};this.webtrekkFormTrackInstall=function(){webtrekkFormTrackInstall();};var webtrekkFormSubmit=function(e){if(!$e.form){return;};if(e.target==$e.formObject||e.srcElement==$e.formObject){$e.formSubmit=true;}};var webtrekkFormFocus=function(e){var a=((document.all&&window.event!==null)?window.event.srcElement:e.target);if(!a.name||a.type=="submit"||a.type=="image"){return;};if($e.formObject){$e.formFocus=a;}};var c=webtrekkConfig,$e=this;if(!$b){var $b=c;};this.defaultAttribute=["contentId","linkId","trackId","trackDomain","domain","linkTrack","linkTrackParams","linkTrackPattern","linkTrackReplace","linkTrackDownloads","linkTrackIgnorePattern","customParameter","crmCategory","urmCategory","customClickParameter","customSessionParameter","customTimeParameter","customCampaignParameter","customEcommerceParameter","orderValue","currency","orderId","product","productCost","productQuantity","productCategory","productStatus","couponValue","customerId","contentGroup","mediaCode","mediaCodeValue","mediaCodeCookie","campaignId","campaignAction","internalSearch","customSid","customEid","cookieDomain","cookieEidTimeout","cookieSidTimeout","forceNewSession","xwtip","xwtua","xwtrq","xwteid","mediaCodeFrames","framesetReferrer","forceHTTPS","secureConfig","heatmap","pixelSampling","form","formFullContent","formAnonymous","disableOverlayView","beforeSendinfoPixel","afterSendinfoPixel","beforeUnloadPixel","afterUnloadPixel","executePluginFunction","xlc","xlct","xlcv","ignorePrerendering","isIE","isOpera","isSafari","isChrome","isFirefox","email","emailRID","emailOptin","firstName","lastName","telefon","gender","birthday","birthdayJ","birthdayM","birthdayD","country","city","postalCode","street","streetNumber","validation"];this.cookie=($b.cookie)?$b.cookie:(c.cookie)?c.cookie:"3";this.optoutName=($b.optoutName)?$b.optoutName:(c.optoutName)?c.optoutName:"webtrekkOptOut";this.paramFirst=($b.paramFirst)?$b.paramFirst:(c.paramFirst)?c.paramFirst:"";this.plugins=($b.plugins&&$b.plugins!='')?$b.plugins:(c.plugins&&c.plugins!='')?c.plugins:['Adobe Acrobat','Windows Media Player','Shockwave Flash','RealPlayer','QuickTime','Java','Silverlight'];if(typeof(this.plugins)=="string"){this.plugins=this.plugins.split(";");};this.heatmapRefpoint=($b.heatmapRefpoint)?$b.heatmapRefpoint:(c.heatmapRefpoint)?c.heatmapRefpoint:"wt_refpoint";this.linkTrackAttribute=($b.linkTrackAttribute)?$b.linkTrackAttribute:(c.linkTrackAttribute)?c.linkTrackAttribute:"name";this.formAttribute=($b.formAttribute)?$b.formAttribute:(c.formAttribute)?c.formAttribute:"name";this.formFieldAttribute=($b.formFieldAttribute)?$b.formFieldAttribute:(c.formFieldAttribute)?c.formFieldAttribute:"name";this.formValueAttribute=($b.formValueAttribute)?$b.formValueAttribute:(c.formValueAttribute)?c.formValueAttribute:"value";this.formFieldDefaultValue=($b.formFieldDefaultValue)?$b.formFieldDefaultValue:(c.formFieldDefaultValue)?c.formFieldDefaultValue:{};this.reporturl=($b.reporturl)?$b.reporturl:(c.reporturl)?c.reporturl:'report2.webtrekk.de/cgi-bin/wt';this.updateCookie=($b.updateCookie)?$b.updateCookie:(c.updateCookie)?c.updateCookie:true;this.version=326;this.deactivatePixel=false;this.deactivateRequest=false;this.optOut=false;this.eid=false;this.firstVisitContact=false;this.lastVisitContact=false;this.sampleCookieString=false;this.cookieOne=false;this.linktrackOut=false;this.linktrackNamedlinksOnly=true;this.ccParams=false;this.sentFullPixel=false;this.sentCampaignIds={};this.wtEp=false;this.wtEpEncoded=false;this.trackingSwitchMediaCode=false;this.trackingSwitchMediaCodeValue=false;this.trackingSwitchMediaCodeTimestamp=false;this.heatmapOn=false;this.overlayOn=false;this.gatherFormsP=false;this.formObject=false;this.formName=false;this.formFocus=false;this.formSubmit=false;this.browserLang=false;this.config=false;this.unloadInstance=webtrekkUnloadObjects.length;this.plugin={};this.pageCounter=0;this.clickCounter=0;this.linkCounter=0;this.formCounter=0;this.heatmapCounter=0;this.browserLang=false;if(typeof(navigator.language)=="string"){this.browserLang=navigator.language.substring(0,2);}else if(typeof(navigator.userLanguage)=="string"){this.browserLang=navigator.userLanguage.substring(0,2);};this.jsonPara={"ck":["customClickParameter",{}],"cp":["customParameter",{}],"cs":["customSessionParameter",{}],"ce":["customTimeParameter",{}],"cb":["customEcommerceParameter",{}],"vc":["crmCategory",{}],"uc":["urmCategory",{}],"ca":["productCategory",{}],"cc":["customCampaignParameter",{}],"cg":["contentGroup",{}],"ct":["linkId",""],"ov":["orderValue",""],"cr":["currency",""],"oi":["orderId",""],"ba":["product",""],"co":["productCost",""],"qn":["productQuantity",""],"st":["productStatus",""],"cd":["customerId",""],"is":["internalSearch",""],"mc":["campaignId",""],"mca":["campaignAction",""]};this.generateDefaultConfig=function($v,$w){for(var i=0;i<this.defaultAttribute.length;i++){var a=this.defaultAttribute[i];this[a]=($v[a])?$v[a]:($w[a])?$w[a]:false;}};this.generateDefaultConfig($b,c);this.campaignAction=($b.campaignAction)?$b.campaignAction:(c.campaignAction)?c.campaignAction:"click";this.getJSON=function(s){if(s&&s.charAt(0)=="{"&&s.charAt(s.length-1)=="}"){try{return eval("("+s+")");}catch(e){return null;}};return null;};this.parseJSON=function(o,n){for(var $x in o){if(typeof(o[$x])=="object"){if(typeof(this.jsonPara[$x])!="undefined"&&typeof(this.config[this.jsonPara[$x][0]])!="object"){this.config[this.jsonPara[$x][0]]={};};this.parseJSON(o[$x],$x);continue;};if(n){if(isNaN(parseInt($x))||parseInt($x)<500){this.config[this.jsonPara[n][0]][$x]=o[$x];}}else{if(typeof(this.jsonPara[$x])!="undefined"){this.config[this.jsonPara[$x][0]]=o[$x];}}}};this.getMappingParam=function(np){var p=np.split(""),i,$y,$z,$A;for(i=0;i<p.length;i++){if(!isNaN(parseInt(p[i]))){$y=i;break;}};if($y){$z=np.substr(0,$y);$A=np.substr($y,np.length-1);}else{$z=np;};return{"mapping":((typeof(this.jsonPara[$z])!="undefined")?this.jsonPara[$z][0]:false),"index":(($A)?$A:false)};};this.getConfig=function(d){var c={};for(var i=0;i<this.defaultAttribute.length;i++){var a=this.defaultAttribute[i];c[a]=((d)?false:this[a]);};return c;};this.getRequestCounter=function($d,$B){var c=0;if($B=="before"){c++;};if($d=="link"){this.linkCounter+=c;return this.linkCounter;}else if($d=="click"){this.clickCounter+=c;return this.clickCounter;}else if($d=="page"){this.pageCounter+=c;return this.pageCounter;}else if($d=="heatmap"){this.heatmapCounter+=c;return this.heatmapCounter;}else if($d=="form"){this.formCounter+=c;return this.formCounter;}};this.getPluginConfig=function($d,$B){return{"instance":this,"mode":$d,"type":$B,"requestCounter":this.getRequestCounter($d,$B)};};this.checkAsynchron=function($C,$D,$E,$F){if(typeof(window[$C])!="undefined"){if($D){$D(true,$E);};return;}else if($F<=0){if($D){$D(false,$E);};return;};window.setTimeout(function(){$E.checkAsynchron($C,$D,$E,($F-100));},100);};this.loadAsynchron=function($G,$C,$D,$F){if(this.include($G)){$D=($D)?$D:false;$F=($F)?$F:2000;this.checkAsynchron($C,$D,this,$F);}};this.include=function(s){if(!document.createElement){return false;};var $H=document.getElementsByTagName('head').item(0);var js=document.createElement('script');js.setAttribute('language','javascript');js.setAttribute('type','text/javascript');js.setAttribute('src',s);$H.appendChild(js);return true;};this.executePlugin=function($I){if(!this.executePluginFunction||typeof(this.executePluginFunction)!="string"){return;};this.epf=false;var $J=this.executePluginFunction.split(";");for(var z=0;z<$J.length;z++){if(typeof(window[$J[z]])=="function"){this.epf=window[$J[z]];this.epf($I);}}};this.indexOf=function(a,b,c){return a.indexOf(b,c?c:0);};this.wtTypeof=function(v){return((typeof(v)!="undefined")?1:0);};this.wtLength=function(a){return((a!="undefined")?a.length:0);};this.getAttribute=function(o,a){if(typeof(o.getAttribute(a))=="string"){return o.getAttribute(a);};if(typeof(o.getAttribute(a))=="object"&&typeof(o.attributes[a])=="object"){if(o.attributes[a]!=null){return o.attributes[a].nodeValue;}};return "";};this.getTimezone=function(){return Math.round((new Date().getTimezoneOffset()/60)*(-1));};this.wtHref=function(){return this.wtLocation().href;};this.wtLocation=function(){var $K=document.location;if(!document.layers&&document.getElementById){try{$K=top.document.location;}catch(e){$K=document.location;}}else{$K=top.document.location;};return $K;};this.getWebtrekkPath=function(){if(!document.layers&&document.getElementById){var $L=document.getElementsByTagName('script');for(var i=0;i<$L.length;i++){if($L[i].src.match(/webtrekk[a-z|A-Z|0-9|_]*\.js/g)){return $L[i].src.replace(/webtrekk[a-z|A-Z|0-9|_]*\.js/g,'');}}};return '';};this.isIE=this.indexOf(navigator.appName,"Microsoft")?false:true;if(!this.isIE){this.isOpera=this.indexOf(navigator.appName,"Opera")?false:true;if(!this.isOpera){this.isSafari=(navigator.vendor.toLowerCase().indexOf("apple")!=-1)?true:false;this.isChrome=(navigator.vendor.toLowerCase().indexOf("google")!=-1)?true:false;if(!this.isSafari&&!this.isChrome){this.isFirefox=(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)?true:false;}}};this.url2contentId=function($K){if(!$K){return "no_content";};var tmp=new RegExp("//(.*)").exec($K);if(tmp.length<1){return "no_content";};var $a=tmp[1].split("?")[0].replace(/\./g,"_").replace(/\//g, ".").replace(/\.{2,};/g,".").toLowerCase();return $a.split(";")[0];};this.contentId=($b.contentId)?$b.contentId:this.url2contentId(document.location.href);this.registerEvent=function($M,e,f){if($M.addEventListener){if(e=="webkitvisibilitychange"){this.unregisterEvent($M,e,f);};$M.addEventListener(e,f,false);}else{if($M.attachEvent){if(e=="beforeunload"||e=="webkitvisibilitychange"){this.unregisterEvent($M,e,f);};$M.attachEvent("on"+e,f);}}};this.unregisterEvent=function($M,e,f){if($M.removeEventListener){$M.removeEventListener(e,f,false);}else{if($M.detachEvent){$M.detachEvent("on"+e,f);}}};this.maxlen=function(v,l){if(v&&v.length>l){return v.substring(0,l-1);};return v;};this.wtEscape=function(u){try{return encodeURIComponent(u);}catch(e){return escape(u);}};this.wtUnescape=function(u){try{return decodeURIComponent(u);}catch(e){return unescape(u);}};this.decrypt=function(x){var $N="";if(x){try{$N=this.wtUnescape(x.replace(/([0-9a-fA-F][0-9a-fA-F])/g,'%$1'));}catch(e){};};return $N;};this.checkSC=function(x){if(typeof(this.secureConfig)!='string'){return false;};var sc=this.secureConfig.split(';');for(var i=0;i<sc.length;i++){if(sc[i]==x){return true;}};return false;};this.zeroPad=function(n,$O){var $P="000000000000"+n;return $P.substring(($P.length-$O),$P.length);};this.generateEid=function(){return '2'+this.zeroPad(Math.floor(new Date().getTime()/1000),10)+this.zeroPad(Math.floor(Math.random()*1000000),8);};this.getexpirydate=function($Q){var $R;var $S=new Date();var $T=$S.getTime();$S.setTime($T+$Q*60*1000);$R=$S.toUTCString();return $R;};this.setCookie=function(name,$U,$V){var d=location.hostname;var $W="^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$";if(d.search($W)==-1){d=location.hostname.split(".");d=d[d.length-2]+"."+d[d.length-1];};var c,f=false;if(this.cookieDomain){var cd=this.cookieDomain.split(";");for(var i=0;i<cd.length;i++){if(location.hostname.indexOf(cd[i])!=-1){d=cd[i];f=true;break;}}};if(f&&typeof($V)!="undefined"&&$V){c=name+"="+escape($U)+";domain="+d+";path=/;expires="+this.getexpirydate($V);}else if(f){c=name+"="+escape($U)+";path=/;domain="+d;}else if(d.split('.')[0].length<3&&typeof($V)!="undefined"&&$V){c=name+"="+escape($U)+";path=/;expires="+this.getexpirydate($V);}else if(d.split('.')[0].length<3){c=name+"="+escape($U)+";path=/";}else if(typeof($V)!="undefined"&&$V){c=name+"="+escape($U)+";domain="+d+";path=/;expires="+this.getexpirydate($V);}else{c=name+"="+escape($U)+";path=/;domain="+d;};document.cookie=c;};this.getCookie=function($X){var $Y=document.cookie.split(";");for(var i=0;i<$Y.length;i++){var $Z=$Y[i].substr(0,$Y[i].indexOf("="));var $00=$Y[i].substr($Y[i].indexOf("=")+1);$Z=$Z.replace(/^\s+|\s+$/g,"");if($Z==$X){return unescape($00);}};return "";};this.optOut=(this.getCookie(this.optoutName))?true:false;if(this.optOut){this.deactivatePixel=true;};this.urlParam=function($K,$01,$02){if(!$K||$K===null||typeof($K)==="undefined"){return $02;};var p=new Array();if($K.indexOf("?")>0){p=$K.split("?")[1].replace(/&amp;/g,"&").split("#")[0].split("&");};for(var i=0;i<p.length;i++){if(p[i].indexOf($01+"=")==0){return this.wtUnescape(p[i].substring($01.length+1).replace(/\+/g,"%20"));}};return $02;};this.allUrlParam=function($01,$02){if(this.mediaCodeFrames&&this.mediaCodeFrames!=''){var lf=this.mediaCodeFrames.split(";");for(var i=0;i<lf.length;i++){var $03=false;eval("try{$03=eval(lf[i])}catch(e){};");if($03&&$03!=top&&$03.location){var $04=this.urlParam($03.location.href,$01,$02);if($04!=$02){return $04;}}};return $02;}else{var topLocation="";try{topLocation=top.location.href;}catch(e){topLocation=document.location.href;};return this.urlParam(topLocation,$01,$02);}};this.linkTrackInit=function(){var $05=false;for(var i=0;i<webtrekkLinktrackObjects.length;i++){if(this==webtrekkLinktrackObjects[i]){$05=true;}};if(!$05){webtrekkLinktrackObjects.push(this);};if(this.linkTrack&&this.linkTrack=="link"){this.linktrackNamedlinksOnly=false;};for(var c=0;c<document.links.length;c++){var $06=document.links[c];var name=this.getAttribute(document.links[c],this.linkTrackAttribute);var $07=this.getAttribute(document.links[c],"href");if((this.linkTrackIgnorePattern&&$07.search(this.linkTrackIgnorePattern)==-1)||!this.linkTrackIgnorePattern){var $08=false;var $09="";if(typeof($06.wt_marked)==="undefined"){$08=true;}else if(typeof($06.wt_marked)==="string"&&$06.wt_marked.indexOf(this.trackId.split(",")[0])===-1){$08=true;$09=$06.wt_marked;};if((name||!this.linktrackNamedlinksOnly)&&$08){$06.wt_marked=$09+";"+this.trackId.split(",")[0];this.registerEvent(document.links[c],'mousedown',webtrekkLinktrack);}}}};if(this.linkTrack){this.linkTrackInit();};this.getCCParams=function(a){var p='';if(this.config.customClickParameter){var $0a=(this.config.customClickParameter[this.getAttribute(a,"name")])?this.config.customClickParameter[this.getAttribute(a,"name")]:this.config.customClickParameter[a.id];if(!$0a){$0a=this.config.customClickParameter;};for(var z in $0a){if(!isNaN(z)&&this.wtTypeof($0a[z])&&typeof($0a[z])=='string'&&$0a[z]!=''){if(this.checkSC('custom')){$0a[z]=this.decrypt($0a[z]);};p+='&ck'+z+'='+this.wtEscape($0a[z]);}}};this.ccParams=p;return;};this.plugInArray=function($0b,$0c){if(typeof($0b)!='object'){return false;};for(var i=0;i<$0b.length;i++){var $0d=new RegExp($0b[i].toLowerCase(),'g');if($0c.toLowerCase().search($0d)!=-1){return $0b[i];}};return false;};this.quicksend=function($0e,$0f,$0g){if(!this.trackDomain||!this.trackId||this.deactivatePixel||this.deactivateRequest){this.deactivateRequest=false;return;};if(!$0g){$0g="wt";};if(typeof(this.requestTimeout)=="undefined"){this.requestTimeout=5;};if(this.cookie=="1"){$0f="&eid="+this.eid+"&one="+(this.cookieOne?"1":"0")+"&fns="+(this.forceNewSession?"1":"0")+$0f;};if(this.cookie!="1"&&(this.wtTypeof(this.cookieEidTimeout)||this.wtTypeof(this.cookieSidTimeout))){if(this.wtTypeof(this.cookieEidTimeout)&&this.cookieEidTimeout!=''){$0f="&cet="+this.cookieEidTimeout+$0f;};if(this.wtTypeof(this.cookieSidTimeout)&&this.cookieSidTimeout!=''){$0f="&cst="+this.cookieSidTimeout+$0f;}};if(this.pixelSampling>0){$0f+="&ps="+this.pixelSampling;};$0f="&tz="+this.getTimezone()+$0f;var $0h="//"+this.trackDomain+"/"+this.trackId+"/"+$0g+"?p="+this.version+","+$0e+$0f+"&eor=1";if(!this.ignorePrerendering&&this.isChrome&&typeof(document.webkitHidden)!="undefined"){if(typeof(this.prerendering)!="object"){this.prerendering=new Array();};if(document.webkitHidden){this.prerendering.push($0h);var pi=this;this.registerEvent(document,"webkitvisibilitychange",function(){pi.sendPrerendering();});return;}};this.sendPixel($0h,$0g);if($0g!='hm'){this.cookieOne=false;this.forceNewSession=false;this.sentFullPixel=1;}};this.sendPrerendering=function(){if(!document.webkitHidden){for(var i=0;i<this.prerendering.length;i++){this.sendPixel(this.prerendering[i]);};this.prerendering=new Array();}};this.sendPixel=function($0i,$0j){if(this.isFirefox){this.sendPixelElement($0i,$0j);}else{this.sendPixelImage($0i,$0j);}};this.sendPixelImage=function($0i,$0j){var $0k=((document.location.protocol=="https:")?"https:":"http:");if(this.forceHTTPS){$0k="https:";};if($0i.search(/https\:|http\:/)!==0){$0i=$0k+$0i;};if($0j=="hm"){$0i+="&hm_ts="+new Date().getTime();};if(typeof(Image)==='undefined'){var Image=function(){return document.createElement('img');};};if(typeof($0l)==="undefined"){var $0l=[];};var $0m=new Date().getTime();var $0n=$0l.length;$0l[$0n]=new Image();$0l[$0n].onload=function(){return;};$0l[$0n].src=$0i;};this.createPixelElement=function($0i){$0i=$0i.replace(/\'/g,"%27");var $0o=document.createElement("div");$0o.style.width="0px";$0o.style.height="0px";$0o.style.backgroundImage="url('"+$0i+"')";window.setTimeout(function(){$0o.parentElement.removeChild($0o);},5000);return $0o;};this.sendPixelElement=function($0i,$0j){var $0k=((document.location.protocol=="https:")?"https:":"http:");if(this.forceHTTPS){$0k="https:";};if($0i.search(/https\:|http\:/)!==0){$0i=$0k+$0i;};if($0j=="hm"){$0i+="&hm_ts="+new Date().getTime();};if(typeof this.sendPixelObject==="undefined"||this.sendPixelObject===null){var $0p=document.getElementById("webtrekk-image");if($0p&&$0p!==null){this.sendPixelObject=$0p;}else{this.sendPixelObject=document.createElement("div");this.sendPixelObject.id="webtrekk-image";this.sendPixelObject.style.width="0px";this.sendPixelObject.style.height="0px";this.sendPixelObject.style.overflow="hidden";var $0q=null;if(typeof document.body==="object"){$0q=document.body;}else if(typeof document.getElementsByTagName('body')[0]==="object"){$0q=document.getElementsByTagName('body')[0];};if($0q&&$0q!==null){$0q.appendChild(this.sendPixelObject);}else{this.sendPixelObject=null;this.sendPixelImage($0i,"wt");}}};if(this.sendPixelObject!==null){this.sendPixelObject.appendChild(this.createPixelElement($0i));}};this.checkCustomParameter=function(cp,np){var p="";if(typeof(cp)=='object'){for(var z in cp){if(!isNaN(z)&&this.wtTypeof(cp[z])&&typeof(cp[z])=='string'&&cp[z]!=''){if(this.checkSC('custom')){cp[z]=this.decrypt(cp[z]);};if(this.paramFirst.indexOf(np+z+';')==-1){p+='&'+np+z+'='+this.wtEscape(cp[z]);}}}};return p;};this.send=function(p,$d,ep){if($d=="link"||$d=="click"){this.config.linkId=p;};this.config.contentId=(this.config.contentId)?this.config.contentId:this.contentId;var $0r=($d&&($d=="link"||$d=="click"))?this.config.contentId:(p)?p:this.config.contentId;if(!$0r){$0r="no_content";};var $0s="";var $0t=this.wtEscape($0r)+",1,";$0t+=this.baseparams();var $0u=navigator.plugins.length;var $0v="";if($0u>0){var $0w=Array();for(var i=0;i<$0u;i++){if(navigator.plugins&&navigator.appName!='Microsoft Internet Explorer'){if(navigator.plugins[i].name=="Shockwave Flash"){$0v=navigator.plugins[i].description;}else{$0v=navigator.plugins[i].name;};var $0x=this.plugInArray(this.plugins,$0v);if($0x&&!this.plugInArray($0w,$0x)){$0w.push($0x);}}};$0v=$0w.join("|");};if(this.paramFirst){var $0y=this.paramFirst.split(";");for(var i=0;i<$0y.length;i++){var $01=this.getMappingParam($0y[i]);var $0z=$01.mapping;var $A=$01.index;if($0z){if($A){if(this.config[$0z]&&typeof(this.config[$0z][$A])!="undefined"&&this.config[$0z][$A]){$0s+="&"+$0y[i]+"="+this.wtEscape(this.config[$0z][$A]);}}else if(this.config[$0z]){$0s+="&"+$0y[i]+"="+this.wtEscape(this.config[$0z]);}}}};if(typeof(ep)=="string"&&ep!=""){ep=ep.split(/;/);for(var z=0;z<ep.length;z++){if(this.wtTypeof(ep[z])){$i=ep[z].split(/=/);if(this.checkSC('custom')){$i[1]=this.decrypt($i[1]);};$i[1]=this.wtEscape($i[1]);$0s+='&'+$i[0]+'='+$i[1];}}}else{this.wtEpEncoded=false;var $0A=this.checkCustomParameter(this.config.customParameter,"cp");var $0B=this.checkCustomParameter(this.config.customSessionParameter,"cs");var $0C=this.checkCustomParameter(this.config.customTimeParameter,"ce");if(this.config.couponValue){if(!this.config.customEcommerceParameter){this.config.customEcommerceParameter={};}this.config.customEcommerceParameter[563]=this.config.couponValue;}var $0D=this.checkCustomParameter(this.config.customEcommerceParameter,"cb");if(this.config.orderValue){if(this.paramFirst.indexOf("ov;")==-1){if(this.checkSC('order')){$0s+="&ov="+this.wtEscape(this.decrypt(this.config.orderValue));}else{$0s+="&ov="+this.wtEscape(this.config.orderValue);}}};if(this.config.currency){if(this.paramFirst.indexOf("cr;")==-1){if(this.checkSC('order')){$0s+="&cr="+this.wtEscape(this.decrypt(this.config.currency));}else{$0s+="&cr="+this.wtEscape(this.config.currency);}}};if(this.config.orderId){if(this.paramFirst.indexOf("oi;")==-1){$0s+="&oi="+this.wtEscape(this.config.orderId);}};if(this.config.product){if(this.paramFirst.indexOf("ba;")==-1){$0s+="&ba="+this.wtEscape(this.config.product);};if(this.config.productCost){if(this.paramFirst.indexOf("co;")==-1){$0s+="&co="+this.wtEscape(this.config.productCost);}};if(this.config.productQuantity){if(this.paramFirst.indexOf("qn;")==-1){$0s+="&qn="+this.wtEscape(this.config.productQuantity);}};$0s+=this.checkCustomParameter(this.config.productCategory,"ca");if(this.config.productStatus){if(this.paramFirst.indexOf("st;")==-1){$0s+="&st="+this.wtEscape(this.config.productStatus);}}};var customerId=$0E("wt_cd","(.*)");if(!this.config.customerId){this.config.customerId=customerId;};if(this.config.customerId){if(this.paramFirst.indexOf("cd;")==-1){$0s+="&cd="+this.wtEscape(this.config.customerId);}};$0s+=this.checkCustomParameter(this.config.crmCategory,"vc");if(!this.config.birthday&&this.config.birthdayJ&&this.config.birthdayM&&this.config.birthdayD){this.config.birthday=this.config.birthdayJ+this.config.birthdayM+this.config.birthdayD;};if(this.config.telefon){this.config.telefon=this.config.telefon.replace(/\W|\_/g,"");};if(!this.config.urmCategory){this.config.urmCategory={};};this.config.urmCategory[700]=this.config.email;this.config.urmCategory[701]=this.config.emailRID;this.config.urmCategory[702]=this.config.emailOptin;this.config.urmCategory[703]=this.config.firstName;this.config.urmCategory[704]=this.config.lastName;this.config.urmCategory[705]=this.config.telefon;this.config.urmCategory[706]=this.config.gender;this.config.urmCategory[707]=this.config.birthday;this.config.urmCategory[708]=this.config.country;this.config.urmCategory[709]=this.config.city;this.config.urmCategory[710]=this.config.postalCode;this.config.urmCategory[711]=this.config.street;this.config.urmCategory[712]=this.config.streetNumber;this.config.urmCategory[713]=this.config.validation;$0s+=this.checkCustomParameter(this.config.urmCategory,"uc");if(this.browserLang){$0s+="&la="+this.wtEscape(this.browserLang);};$0s+=this.checkCustomParameter(this.config.contentGroup,"cg");var $0F='';if(this.config.campaignId){if(!(this.config.campaignId in this.sentCampaignIds)){if(this.paramFirst.indexOf("mc;")==-1){$0s+="&mc="+this.wtEscape(this.config.campaignId);}}else{if(this.paramFirst.indexOf("mc;")==-1){$0s+="&mc="+this.wtEscape("ignore%3Dignore");}};if(this.paramFirst.indexOf("mca;")==-1){$0s+="&mca="+((this.config.campaignAction)?this.config.campaignAction.substring(0,1):"c");};this.sentCampaignIds[this.config.campaignId]=true;};$0F+=this.checkCustomParameter(this.config.customCampaignParameter,"cc");if(this.trackingSwitchMediaCode){$0s+="&tmc="+this.wtEscape(this.trackingSwitchMediaCode);};if(this.trackingSwitchMediaCodeValue){$0s+="&tmcv="+this.wtEscape(this.trackingSwitchMediaCodeValue);};if(this.trackingSwitchMediaCodeTimestamp){$0s+="&tmct="+this.wtEscape(this.trackingSwitchMediaCodeTimestamp);};if(typeof($0G)=="object"&&typeof($0G.trackingSwitchMediaCode)!="undefined"){$0s+="&tmc="+this.wtEscape($0G.trackingSwitchMediaCode);};if(typeof($0G)=="object"&&typeof($0G.trackingSwitchMediaCodeValue)!="undefined"){$0s+="&tmcv="+this.wtEscape($0G.trackingSwitchMediaCodeValue);};if(typeof($0G)=="object"&&typeof($0G.trackingSwitchMediaCodeTimestamp)!="undefined"){$0s+="&tmct="+this.wtEscape($0G.trackingSwitchMediaCodeTimestamp);};var $0H="";var $0I;if(typeof(wt_vt)!="undefined"){$0I=wt_vt;};if(!this.wtTypeof($0I)){$0I=this.urlParam(location.href,'wt_vt',false);};if($0I){var $0J=this.getCookie('wt_vt').split(";");for(var i=0;i<$0J.length;i++){if($0J[i].indexOf($0I+'v')!=-1){$0H='&wt_vt='+$0J[i].split('t')[0].split('v')[1];}}};if($0H){$0s+=$0H;};if(this.config.internalSearch){if(this.paramFirst.indexOf("is;")==-1){$0s+="&is="+this.wtEscape(this.maxlen(this.config.internalSearch,255));}};if($0A){$0s+=$0A;};if($0F){$0s+=$0F;};if($0C){$0s+=$0C;};if($0D){$0s+=$0D;};if($0B){$0s+=$0B;};if(this.wtTypeof(this.config.customSid)&&this.config.customSid!=''){$0s+="&csid="+this.config.customSid;};if(this.wtTypeof(this.config.customEid)&&this.config.customEid!=''){$0s+="&ceid="+this.config.customEid;};if(this.wtTypeof(this.config.xwtip)&&this.config.xwtip!=''){$0s+="&X-WT-IP="+this.wtEscape(this.config.xwtip);};if(this.wtTypeof(this.config.xwtua)&&this.config.xwtua!=''){$0s+="&X-WT-UA="+this.wtEscape(this.config.xwtua);};if(this.wtTypeof(this.config.xwtrq)&&this.config.xwtrq!=''){$0s+="&X-WT-RQ="+this.wtEscape(this.config.xwtrq);};if(this.wtTypeof(this.xwteid)&&this.xwteid!=''){$0s+="&X-WT-EID="+this.wtEscape(this.xwteid);this.xwteid=false;};if(!this.sentFullPixel&&this.firstVisitContact){$0s+="&fvc="+this.firstVisitContact;};if(!this.sentFullPixel&&this.lastVisitContact){$0s+="&lvc="+this.lastVisitContact;}};$0s+="&pu="+this.wtEscape(document.location.href.split("#")[0]);if(this.config.linkId&&this.config.customClickParameter){var $0a=(this.config.customClickParameter[this.config.linkId])?this.config.customClickParameter[this.config.linkId]:this.config.customClickParameter;$0s+=this.checkCustomParameter($0a,"ck");this.ccParams=false;};if(this.config.xlc&&this.config.xlct){if(this.config.xlc!=""||this.config.xlct!=""){if(this.config.xlcv){var $0K=this.getExtLifeCycles(this.config.xlc,this.config.xlct,this.config.xlcv);}else{var $0K=this.getExtLifeCycles(this.config.xlc,this.config.xlct);};$0s+=$0K;}};if(!this.config.contentId&&!this.config.linkId){this.config.contentId=this.contentId;this.config.linkId="wt_ignore";};if(this.config.linkId){this.wtEp=$0s;this.wtEpEncoded=true;webtrekkUnload('noForm',$d);return;};if(this.cookie=="1"){if(this.cookieOne){$0s+="&np="+this.wtEscape($0v);}}else{$0s+="&np="+this.wtEscape($0v);};this.quicksend($0t,$0s);};this.sendinfo=function(c,p,$d,ep){$d=(($d)?$d:"page");if(!this.optOut&&!this.deactivatePixel){if(this.cookie=="1"){this.firstParty();}else{this.xwteid=$0E("wt_eid","^[0-9]{19}$");}};if(location.href.indexOf('fb_xd_fragment')!=-1){return;};if(typeof(c)=='object'){this.config=c;}else{this.config=this.getConfig();};if(!this.config.campaignId&&this.mediaCode&&$d=="page"&&!this.config.linkId){this.getMediaCode();};if(this.beforeSendinfoPixel!=false){this.beforeSendinfoPixel();}else{this.executePlugin(this.getPluginConfig(($d)?$d:"page","before"));};if(this.contentId!=""||p!=""||document.layers){this.send(p,$d,ep);};if(this.afterSendinfoPixel!=false){this.afterSendinfoPixel();}else{this.executePlugin(this.getPluginConfig(($d)?$d:"page","after"));}};this.sendinfo_media=function($0L,mk,$0M,$0N,mg,bw,$0O,$0P){if(this.wtTypeof($0Q)){$0Q($0L,mk,$0M,$0N,mg,bw,$0O,$0P,this.unloadInstance);}};this.getExtLifeCycles=function(xlc,xlct,xlcv){var $0R="";var $0S=new Object();var $0T=xlc.split("|");for(var i=0;i<$0T.length;i++){var $0U=$0T[i].split(";");for(var j=0;j<$0U.length;j++){if(j==0){$0R+=this.wtEscape($0U[j]);}else{$0R+=$0U[j];};$0R+=";";};$0R=$0R.substr(0,$0R.length-1);$0R+="|";};$0R=$0R.substr(0,$0R.length-1);$0S.xlcl=this.wtEscape(xlc.split("|").length);$0S.xlct=this.wtEscape(xlct);if(typeof(xlcv)!="undefined"){$0S.xlcv=this.wtEscape(xlcv);};$0S.xlc=this.wtEscape($0R);var $0f="";for(i in $0S){$0f+="&"+i+"="+$0S[i];};return $0f;};this.isOwnDomain=function(l){var pt='';if(this.domain){if(this.domain.toUpperCase().indexOf("REGEXP:")==0){pt=new RegExp(this.domain.substring(7),"i");if(pt.test(this.getDomain(l))){return true;}}else{var $0V=this.domain.split(';');var $0W=this.getDomain(l);for(var i=0;i<$0V.length;i++){if($0W==$0V[i]){return true;}}}}else{return false;};return false;};this.getDomain=function(l){if(typeof(l)!='string'){return '';};l=this.wtUnescape(l);l=l.split('://')[1];var rx=new RegExp('^(?:[^\/]+:\/\/)?([^\/:]+)','g');if(typeof(l)!="undefined"){l=l.match(rx);if(l[0]){return l[0].toLowerCase();}};return '';};var $0X=function(){var $0Y=0,$0Z=$0E("wt_ref","(.*)");if($e.framesetReferrer){$0Y=$e.wtEscape($e.framesetReferrer);}else if($e.getCookie("wt_ref")!=""){$0Y=$e.wtEscape($e.getCookie("wt_ref"));$e.setCookie("wt_ref","",-3600);}else if($0Z){$0Y=$e.wtEscape($0Z);}else{if(document.referrer.length>0){$0Y=$e.wtEscape(document.referrer);}};if($e.sentFullPixel){$0Y="2";}else if($e.isOwnDomain($0Y)){$0Y="1";};return $0Y;};var $10=function(){var $11=0;if(!document.layers&&document.getElementById){try{$11=top.window.innerHeight;}catch(e){};}else{$11=top.window.innerHeight;};if(!$11){try{$11=top.document.documentElement.clientHeight;}catch(e){};};if(!$11){try{$11=top.document.body.clientHeight;}catch(e){};};if(typeof($11)=='undefined'){$11=-1;};return $11;};var $12=function(){var $13=0;if(!document.layers&&document.getElementById){try{$13=top.window.innerWidth;}catch(e){};}else{$13=top.window.innerWidth;};if(!$13){try{$13=top.document.documentElement.clientWidth;}catch(e){};};if(!$13){try{$13=top.document.body.clientWidth;}catch(e){};};if(typeof($13)=='undefined'){$13=-1;};return $13;};this.baseparams=function(){var $14=screen.width+"x"+screen.height+","+(navigator.appName!='Netscape'?screen.colorDepth:screen.pixelDepth)+",";$14+=((navigator.cookieEnabled==true)?"1,":((navigator.cookieEnabled==false)?"0,":((document.cookie.indexOf("=")!=-1)?"1,":"0,")));$14+=new Date().getTime()+",";$14+=$0X();var $11=$10();var $13=$12();if($11&&$11>screen.height){$11=screen.height;};if($13&&$13>screen.width){$13=screen.width;};$14+=","+$13+"x"+$11;$14+=","+(navigator.javaEnabled()?"1":"0");return $14;};this.getMediaCode=function(mc){if(!mc){if(!this.mediaCode){return false;};mc=this.mediaCode;};var v;if(this.mediaCodeValue){v=this.mediaCodeValue.split(";");};var m=mc.split(";");var $15=0;var $16=[];for(var i=0;i<m.length;i++){if(this.mediaCodeCookie){var mediaCodeValue=this.allUrlParam(m[i],"");if(this.getCookie('wt_'+m[i].toLowerCase()+mediaCodeValue.toLowerCase())===""&&mediaCodeValue){$16.push(m[i]+this.wtEscape("="+mediaCodeValue));}else{$15++;};var $17='';if(this.mediaCodeCookie=='eid'){$17=60*30*24*60;};this.setCookie('wt_'+m[i].toLowerCase()+this.allUrlParam(m[i],"").toLowerCase(),1,$17);}else{if(typeof(v)!="undefined"&&typeof(v[i])!="undefined"&&v[i]!=""){$16.push(m[i]+this.wtEscape("="+v[i]));}else if(this.allUrlParam(m[i],"")!=""){$16.push(m[i]+this.wtEscape("="+this.allUrlParam(m[i],"")));}}};if(m.length===$15&&m.length!==0){$16.push("ignore%3Dignore");};this.config.campaignId=$16.join(";");};this.searchContentIds=function(){var $18=0;var $05=0;this.contentIds=this.wtEscape(this.contentId.split(";")[0]);do{$18++;var $19=this.urlParam(document.location.href,"wt_contentId"+$18,false);if($19){this.contentIds+="&wt_contentId"+$18+"="+this.wtEscape($19);$05++;}}while($05>=$18);};this.startHeatmapOrOverlay=function($0k,$D){this.searchContentIds();var reporturl="";if(this.urlParam(document.location.href,"wt_reporter",false)){reporturl=this.urlParam(document.location.href,"wt_reporter",false).split("/");reporturl.pop();this.reporturl=reporturl.join("/");}else if(this.getCookie("wt_overlayFrame")){reporturl=this.getCookie("wt_overlayFrame").split("/");reporturl.pop();this.reporturl=reporturl.join("/");};if(this.reporturl.search(/http|https/)===-1){this.reporturl=document.location.protocol+"//"+this.reporturl;};if(this.contentIds){if(this.include(this.reporturl+"/"+$0k+".pl?wt_contentId="+this.contentIds+"&x="+new Date().getTime())){if($0k=="heatmap"&&navigator.userAgent.indexOf('MSIE 6')!=-1&&navigator.userAgent.indexOf('Windows NT 5.0')!=-1){alert("Click OK to start heatmap.");};if(document.readyState!="complete"){this.registerEvent(window,"load",$D);}else{$D();}}}};this.heatmapOn=(this.wtHref().indexOf("wt_heatmap=1")>=0);this.overlayOn=(this.wtHref().indexOf("wt_overlay=1")>=0||document.cookie.indexOf("wt_overlay=1")>=0);if(this.wtHref().indexOf("wt_overlay=0")>=0){this.overlayOn=false;this.setCookie("wt_overlay","",-1);};var $1a=false;for(i=0;i<webtrekkHeatmapObjects.length;i++){if(this==webtrekkHeatmapObjects[i]){$1a=true;}};if(!$1a&&this.heatmap&&this.heatmap=="1"){webtrekkHeatmapObjects.push(this);this.registerEvent(document,"mousedown",webtrekkHeatmapClick);this.registerEvent(document,"touchstart",webtrekkHeatmapClick);};if(this.heatmapOn&&!this.disableOverlayView){this.searchContentIds();this.startHeatmapOrOverlay("heatmap",webtrekkStartHeatmap);};if(this.overlayOn&&!this.disableOverlayView){this.searchContentIds();this.setCookie("wt_overlay","1");this.startHeatmapOrOverlay("overlay",webtrekkStartOverlay);};this.setPixelSampling=function($1b){if(!$1b){var $1b=this.pixelSampling;};var trackId=this.trackId.split(",")[0];var $1c=this.getCookie("wt3_sample").split(";");var $1d=false;for(var i=0;i<$1c.length;i++){if(this.indexOf($1c[i],trackId+"|"+$1b)!=-1){$1d=true;}else{if(this.indexOf($1c[i],trackId+"|")!=-1){$1c[i]="";}}};var $1e=6;if(this.cookieEidTimeout){$1e=this.cookieEidTimeout;};if(!$1d){if(Math&&Math.random&&parseInt(Math.random()*$1b)==0){$1c.push(trackId+"|"+$1b+"|1");}else{$1c.push(trackId+"|"+$1b+"|0");};this.setCookie("wt3_sample",$1c.join(";"),$1e*30*24*60);$1c=this.getCookie("wt3_sample");}else{$1c=$1c.join(";");this.setCookie("wt3_sample",$1c,$1e*30*24*60);};if(this.indexOf($1c,trackId+"|"+$1b+"|1")==-1){this.deactivatePixel=true;}};if(this.pixelSampling&&!this.optOut){this.setPixelSampling();};var $0E=function($01,$1f){var $1g=$e.urlParam(location.href,$01,false);var $1h=$e.urlParam(location.href,"wt_t",false);var $1i=new Date().getTime();var $1j=new RegExp($1f);if($1h){$1h=parseInt($1h)+(15*60*1000);}else{$1h=$1i-(15*60*1000);};if($1g&&$1j.test($1g)&&$1h>$1i){return $1g;};return false;};var $1k=function($1l){if($1l&&$1l.substring(0,1)=="2"){var $1m=parseInt($1l.substring(1,11)+"000");var $1n=new Date($1m);var $1o=$1n.getFullYear();$1o+=(($1n.getMonth()<9)?"0":"");$1o+=($1n.getMonth()+1);$1o+=(($1n.getDate()<9)?"0":"");$1o+=$1n.getDate();$1o+=(($1n.getHours()<9)?"0":"");$1o+=$1n.getHours();$1o+=(($1n.getMinutes()<9)?"0":"");$1o+=$1n.getMinutes();return $1o;};return "";};this.firstParty=function(){var $1p=this.getCookie("wt3_sid").split(";");var $1q=this.getCookie("wt3_eid").split(";");var $1e=((this.cookieEidTimeout===0)?this.cookieEidTimeout:((this.cookieEidTimeout)?this.cookieEidTimeout:6));var trackId=this.trackId.split(",")[0];var $1r=false;var $1s=false;var $1t=false;var $1n=this.generateEid();for(var i=0;i<$1p.length;i++){if($1p[i].indexOf(trackId)!=-1){$1r=i;break;}};for(var i=0;i<$1q.length;i++){if($1q[i].indexOf(trackId+"|")!=-1){$1s=i;break;}};this.eid=$0E("wt_eid","^[0-9]{19}$");if(!$1r){$1p.push(trackId);if($1s&&!this.eid){this.forceNewSession=true;}};if(!$1s){if(!this.eid){this.eid=this.generateEid();this.cookieOne=true;};$1q.push(trackId+"|"+this.eid+"#"+$1n);if($1e){this.setCookie("wt3_eid",$1q.join(";"),$1e*30*24*60);}else{this.setCookie("wt3_eid",$1q.join(";"));}}else{if(this.eid){$1q[$1s]=trackId+"|"+this.eid;this.updateCookie=true;};if($1q[$1s].indexOf("#")==-1){$1q[$1s]+="#"+$1n;};$1t=$1q[$1s].replace(trackId+"|","").split("#")[1];this.eid=$1q[$1s].replace(trackId+"|","").split("#")[0];$1q[$1s]=$1q[$1s].replace(/\#[0-9]{19}/g,"#"+$1n);if(this.updateCookie){if($1e){this.setCookie("wt3_eid",$1q.join(";"),$1e*30*24*60);}else{this.setCookie("wt3_eid",$1q.join(";"));}}};this.setCookie("wt3_sid",$1p.join(";"));if(!$1r){this.firstVisitContact=$1k(this.eid);if(this.updateCookie){$1t=(($1t)?$1t:$1n);this.lastVisitContact=$1k($1t);}}};var $1u=false;for(i=0;i<webtrekkUnloadObjects.length;i++){if(this==webtrekkUnloadObjects[i]){$1u=true;}};if(!$1u){webtrekkUnloadObjects.push(this);};this.findForm=function(){if(!this.form||this.formObject){return;};var f=document.forms;for(var i=0;i<f.length;i++){var cf=f[i];if(this.wtTypeof(cf.elements["wt_form"])){this.formObject=cf;return;}}};this.checkFormFocus=function($1v){if($1v==this.formFocus){return 1;};return 0;};this.getFormFieldValue=function(ff){var p=ff.name;if(this.formFieldAttribute){p='';var tmp=this.getAttribute(ff,this.formFieldAttribute);if(tmp||tmp!==null){p=tmp;}};return p;};this.isFormFieldAnonym=function(ff){var $1w=[];if(this.formFullContent){$1w=this.formFullContent.split(";");};if(this.formAnonymous||(ff.type!="select-multiple"&&ff.type!="select-one"&&ff.type!="checkbox"&&ff.type!="radio")){for(var k=0;k<$1w.length;k++){if($1w[k]==this.getFormFieldValue(ff)){return false;}};return true;};return false;};this.getFieldValue=function(ff,e){var $U=this.getAttribute(e,this.formValueAttribute).replace(/[\.|\;|\|]/g,"_");if(ff.type!="select-multiple"&&ff.type!="select-one"&&ff.type!="checkbox"&&ff.type!="radio"){return this.maxlen(e.value,30);};if(!this.isFormFieldAnonym(ff)){return this.maxlen($U,30);};return "anon";};this.isFormFieldDefaultValue=function($1x,$U){if(typeof(this.formFieldDefaultValue[$1x])!=="undefined"&&this.formFieldDefaultValue[$1x]==$U){return true;};return false;};this.gatherForm=function(){var $1y=";";if(!this.formObject){return;};var f=this.formObject;this.formName=this.getAttribute(f,this.formAttribute)?this.getAttribute(f,this.formAttribute):this.contentId.split(";")[0];var fl="";if(this.wtTypeof(f.elements["wt_fields"])){fl=f.elements["wt_fields"].value;};if(!fl){for(var i=0;i<f.elements.length;i++){var e=f.elements[i];if(this.getFormFieldValue(e)){fl+=this.getFormFieldValue(e)+$1y;}};fl=fl.substring(0,fl.lastIndexOf($1y));};var $1z=fl.split($1y);var $1A=$1z.length;var pa="";var $1B={},$1C=false;for(var i=0;i<f.elements.length;i++){var e=f.elements[i],$U,$1D,$1E,$1F=false;if(fl){for(var j=0;j<$1A;j++){if(this.getFormFieldValue(e)==$1z[j]){$1F=true;}}}else{if(this.getFormFieldValue(e)){$1F=true;}};if($1F){$U=null;if(e.type=='select-multiple'){for(var j=0;j<e.options.length;j++){var $05=false;if(e.options[j].selected){$05=true;pa+=";"+this.getFormFieldValue(e).replace(/[\.|\;|\|]/g,"_")+"."+e.type+"|"+this.getFieldValue(e,e.options[j])+"|"+this.checkFormFocus(e);};if(!$05){$U="empty";}}}else if(e.type=='select-one'){if(e.selectedIndex!=-1){$U=this.getFieldValue(e,e.options[e.selectedIndex]);if(!$U){$U="empty";}}}else if(e.type=='checkbox'||e.type=='radio'){if(!e.checked){$U="empty";}else{$U=this.getFieldValue(e,e);}}else{if(e.type!="hidden"&&e.type!="button"&&e.type!="image"&&e.type!="reset"&&e.type!="submit"){$U=(this.getFieldValue(e,e)?"filled_out":"empty");if(!this.isFormFieldAnonym(e)){$U=this.getFieldValue(e,e);};if(this.isFormFieldDefaultValue(this.getFormFieldValue(e),this.getFieldValue(e,e))&&$U!=="empty"){$U="empty";};if(!$U){$U="empty";}}};if($U){name=this.getFormFieldValue(e).replace(/[\.|\;|\|]/g,"_");$1D=";"+name+"."+e.type+"|";$1E=((this.isFormFieldAnonym(e)&&$U!="empty"&&$U!="filled_out")?"anon":$U)+"|"+this.checkFormFocus(e);if(e.type=='radio'){$1C=true;if(($1D in $1B)){if($1B[$1D].indexOf("empty")==0){$1B[$1D]=$1E;};continue;};$1B[$1D]=$1E;}else if(pa.indexOf($1D)==-1){pa+=$1D+$1E;}}}};if($1C){for(var $1G in $1B){pa+=$1G+$1B[$1G];}};if(pa){pa=pa.substring(1);};return pa;};this.checkFormTracking=function(){var p="";if(this.formObject){var gatherFormsP=this.gatherForm();if(gatherFormsP){p+="&fn="+((this.formName)?this.formName:this.contentId.split(";")[0])+"|"+((this.formSubmit)?"1":"0");p+="&ft="+this.wtEscape(gatherFormsP);};this.formObject=false;this.formSubmit=false;};return p;};this.sendFormRequest=function(){if(this.beforeUnloadPixel!=false){this.beforeUnloadPixel();}else{this.executePlugin(this.getPluginConfig("form","before"));};var $1H=this.checkFormTracking();if($1H){this.quicksend(this.wtEscape(this.contentId.split(";")[0])+",1,"+this.baseparams(),$1H,false,"sendRequest");};if(this.afterUnloadPixel!=false){this.afterUnloadPixel();}else{this.executePlugin(this.getPluginConfig("form","after"));}};this.formTrackInstall=function(f){if(f){this.formObject=f;}else{this.formObject=(document.forms[0])?document.forms[0]:false;};if(this.formObject){this.form="1";webtrekkFormTrackInstall();}};if(this.form){webtrekkFormTrackInstall();};this.cookieManager=function(name,$1I,$1J){var i,j;this.name=name;this.keySeperator="~";this.fieldSeparator="#";this.durationSeperator="|";this.found=false;this.expires=$1I;this.accessPath=$1J;this.rawValue="";this.fields=[];this.fieldsDuration=[];this.fieldnames=[];this.read=function(){var $C=this.name+"=";var $1K=document.cookie;this.rawValue=null;this.found=false;if($1K.length>0){$1L=$1K.indexOf($C);if($1L!=-1){$1L+=$C.length;end=$1K.indexOf(";",$1L);if(end==-1){end=$1K.length;};this.rawValue=$1K.substring($1L,end);this.found=true;}};if(this.rawValue!=null){var sl=this.rawValue.length;var $1M=0;var $1N=0;var i=0;do{$1N=this.rawValue.indexOf(this.fieldSeparator,$1M);if($1N!=-1){var $1O=this.rawValue.substring($1M,$1N).split(this.durationSeperator);var rV=$1O[0].split(this.keySeperator);this.fields[rV[0]]=unescape(rV[1]);this.fieldsDuration[rV[0]]=parseInt(unescape($1O[1]));i++;$1M=$1N+1;}}while($1N!=-1&$1N!=(this.rawValue.length-1));};return this.found;};this.getSize=function(){var $1P=new Date().getTime();var $1Q="";for(i in this.fields){if(this.fieldsDuration[i]>=$1P){$1Q+=escape(i)+this.keySeperator+escape(this.fields[i])+this.durationSeperator+escape(this.fieldsDuration[i])+this.fieldSeparator;}};return $1Q.length;};this.write=function(){var $1P=new Date().getTime();var $1R=true;var $1Q=this.name+"=";for(i in this.fields){if(this.fieldsDuration[i]>=$1P){$1Q+=escape(i)+this.keySeperator+escape(this.fields[i])+this.durationSeperator+escape(this.fieldsDuration[i])+this.fieldSeparator;$1R=false;}};var $1S=($1R)?-99999:this.expires;if($1S!=""){if(typeof($1S)=="number"){var $1T=new Date();var $1U=new Date();$1U.setTime($1T.getTime()+1000*60*60*24*$1S);$1Q+="; expires="+$1U.toGMTString();}else{$1Q+="; expires="+$1S.toGMTString();}};if(this.accessPath!=null){$1Q+="; PATH="+this.accessPath;};var d=location.hostname;var $W="^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$";if(d.search($W)==-1){d=location.hostname.split(".");d=d[d.length-2]+"."+d[d.length-1];};$1Q+="; DOMAIN="+d;document.cookie=$1Q;return null;};this.remove=function(){this.expires=-10;this.write();return this.read();};this.get=function($1V){var $1P=new Date().getTime();if(this.fieldsDuration[$1V]>=$1P){return this.fields[$1V];};return "";};this.set=function($1V,$1W,$V,$d,$1X){if(!$V){$V=31536000;};if(!$d){$d="";};var $1P=new Date().getTime();if($d=="first"&&this.fields[$1V]!=""&&this.fields[$1V]!=null&&this.fieldsDuration[$1V]>=$1P){return this.fields[$1V];};this.fields[$1V]=$1W;this.fieldsDuration[$1V]=$1P+(parseInt($V)*1000);if(!$1X){this.write();};return $1W;};this.prepare=function($1V,$1W,$V,$d){this.set($1V,$1W,$V,$d,true);};this.read();};};
/* Ende der webtrekk.js */

/* Kompatibilitaetsmodus */
var webtrekkPixel = false;
function wt_sendinfo(p, mode, ep) {
    if(webtrekkPixel) {
        for(var i in webtrekk) {
            if(i != "plugins" && i != "sendinfo" && i != "cookie") {
                webtrekkPixel[i] = webtrekk[i];
            }
        }

        if(!p && !mode && !ep) {
            webtrekkPixel.sendinfo(false, p, mode, ep);
        }
        else {
            webtrekkPixel.sendinfo({}, p, mode, ep);
        }
    }
}

if (typeof(webtrekk) == "object") {
    webtrekkConfig = webtrekk;
    webtrekkPixel = new webtrekkV3({
        executePluginFunction: "wt_countryMapping;wt_productNameMapping;wt_frequencyAnalysis;wt_scrollposition;wt_socialMedia;wt_adClear;wt_criteo;wt_sociomantic;wt_defacto;wt_adClearCookieHandshake",
        cookie: "1",
        forceHTTPS: true
    });
    webtrekkPixel.registerEvent(window, "load", function() {
        webtrekkPixel.webtrekkFormTrackInstall();
    });

    if(typeof(wt_updatePixel) == "function"){
        wt_updatePixel();
    }

    if (webtrekk.sendinfo && webtrekk.sendinfo == '1'){
        webtrekkPixel.sendinfo();
    }
}
/* End Kompatibilitaetsmodus */