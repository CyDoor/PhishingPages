IS_WEBROOT="";
PFAD_IMG = IS_WEBROOT;

GIF_BREITE = 138;
GIF_HOEHE = 22;	// ist zugleich Zeilenhoehe
GIF_RAND_BREITE = 1;
GIF_BULLET_BREITE = 17;
GIF_BULLET_HOEHE = 4;
GIF_ECKE_BREITE = GIF_RAND_BREITE + GIF_BULLET_BREITE;
GIF_ECKE_HOEHE = 6;	// ist allg. Hoehe fuer unteren Rand

GIF_BULLET_NAME = PFAD_IMG + "bullet.gif";
GIF_NOBULLET_NAME = PFAD_IMG + "blank.gif";
GIF_ECKE_NAME = PFAD_IMG + "ecke.gif";
GIF_UNTEN_NAME = PFAD_IMG + "fade_unten.gif";
GIF_RAND_NAME = PFAD_IMG + "linie_11.gif";

GIF_RAND_NAME_arr = new Array(PFAD_IMG+"fade_oben_1.gif", PFAD_IMG+"fade_oben_2.gif");;
DIV_BG = "#FFFFFF";	//#F6F6FA
POS_TOP = 111;

NAME_FLASHFILM = "flash";
NAME_ERSATZBILD = "ersatzbild";

var visibleLayer = "nix";
var autoClose_daemon = 0;

var subnav_html_arr = new Array();
subMenue_arr = new Array();

//displays the info for the "Implied Consent" and sets a session-cookie
window.onload = function(){
	initNewsLetterHandling();
	initPopupServiceHandling();
	
	// trusted-Shops Banner
	$('#trustedShopsBanner').click(function(e) {
		hei.cl.widgets.dialog.layer($("#trustedShopsVideo").html(), 'trustedShopsVideoLayer', {width:432});
	});
	
	// register click listeners for service tabs 
	$('.serviceTab').click(function(pEvent) {
		var me = $(this);
		pEvent.preventDefault();
		
		if ($.isEmptyObject(me.data())) {
			openServiceTab(me);
		} else {
			closeServiceTab(me);
		}
	});
}

function initPopupServiceHandling() {
	// servicePopup inside jsglobals.jsp
	if (servicePopup) {
		var $ScrollTarget = $('#' + servicePopup.scrollToElement);
		
		if ($ScrollTarget.length > 0) {
			$('html, body').scrollTop($ScrollTarget.offset().top);
			if (servicePopup.adjustWidth) {
				$('html, body').scrollLeft($ScrollTarget.offset().left - 10);
			}
		}
	}
}

function newsletterIframeOnLoadCallback(pId) {
	var $Elem = $('#' + pId);
	
	if (pId === 'catOrderNewsletterDOIConfirm') {
		$Elem.removeClass('iFrameLoader');
	}
}

function initNewsLetterHandling() {
	// newsletter-handling for storefront, footer and service: start
	$('#newsletter-subscription-footer, #newsletter-subscription-content').submit(handleNewsLetterSubscribeEvent);
	$('#newsletter-unsubscription').submit(handleNewsLetterUnSubscribeEvent);
	$('#CatOrderForm').submit(handleCatOrderEvent);
	$('#submit-doi-completion').click(function(pEvent) {
		handleNewsletterDoiFormEvent(pEvent);
	});
	
	$('#newsletter_Birthday, #newsletter_Birthmonth, #newsletter_Birthyear').keypress(function(pEvent) {
		preventKeyNotInRegex(pEvent, VALIDATE_RULES.simpleDigit);
	});
	
	$('#newsletter-hint').hover(function () {
		$('#newsletter-hint-layer').show();
	},
	function () {
		$('#newsletter-hint-layer').hide();
	});
	
	$(document.body).on('click', '#newsletter-subscribe-footer, #newsletter-subscribe, #newsletter-subscribe-layer', function(pEvent) {
		handleNewsLetterSubscribeEvent(pEvent, $(this));
	});
	
	if($("#newsletter-unsubscribe-mail").length > 0) {
		$("#newsletter-unsubscription #email").val($("#newsletter-unsubscribe-mail").text());
	}
	$('#newsletter-unsubscribe').click(function(pEvent) {
		handleNewsLetterUnSubscribeEvent(pEvent);
	});
	
	// show newsletter subscription for registered customers in cat order if they don't have their newsletter permission set
	if ($('#catOrderCustomerNewsletterSubscribe').length > 0 && typeof newsletterLayer !== 'undefined' && newsletterLayer && newsletterLayer.newsletterPermission !== 1) {
		appendNewsletterInputFieldToCatOrderForm();
	}
	
	// newsletter-handling for storefront, footer and service: end
}

function preventKeyNotInRegex(pEvent, pRegex) {
	var key = "";
	if (!pEvent.charCode) {
		if (pEvent.keyCode === 9 || pEvent.keyCode === 8) { // TAB or backspace
			return;
		}
		key = String.fromCharCode(pEvent.keyCode);
	} else {
		key = String.fromCharCode(pEvent.charCode);
	}
	
	var keyAsInt = parseInt(key); 
	
	if (pRegex && !pRegex.test(keyAsInt)) {
		pEvent.preventDefault();
	}
}

function handleNewsletterDoiFormEvent(pEvent) {
	pEvent.preventDefault();
	if (typeof newsletterLayer !== 'undefined' && newsletterLayer && newsletterLayer.urls) {
		if (newsletterLayer.urls.newsletterDoiConfirmURL && newsletterLayer.isNewsletterDoubleOptinEnabled) {
			var lGender = $('#newsletter_anrede').val();
			var lFirstName = $('#newsletter_vorname').val();
			var lLastName = $('#newsletter_nachname').val();
			
			var lBdayDay = $('#newsletter_Birthday').val();
			var lBdayMonth = $('#newsletter_Birthmonth').val();
			var lBdayYear = $('#newsletter_Birthyear').val();
			
		    var currentDate = new Date();
		    var newsletterDoiConfirmURL = newsletterLayer.urls.newsletterDoiConfirmURL;
		    
		    newsletterDoiConfirmURL = newsletterDoiConfirmURL.substring(5);
		    newsletterDoiConfirmURL = document.location.protocol + newsletterDoiConfirmURL;
		    
		    newsletterDoiConfirmURL = newsletterDoiConfirmURL.replace('{Tag}', currentDate.getDate())
            	.replace('{Monat}', currentDate.getMonth()+1)
            	.replace('{Jahr}', currentDate.getFullYear())
            	.replace('{Geschlecht}',lGender)
            	.replace('{Vorname}',lFirstName)
            	.replace('{Nachname}',lLastName)
            	.replace('{Geburtstag}',lBdayDay)
            	.replace('{Geburtsmonat}',lBdayMonth)
            	.replace('{Geburtsjahr}',lBdayYear)
            	.replace('{CID}', newsletterLayer.newsletterCustomerId);
		    
		    var agnitasIframe = '<iframe style="width: 441px; height: 320px;" hspace="0" src="' + newsletterDoiConfirmURL + '" name="nyroModalIframe" frameborder="0"></iframe>';
		}
	    if (newsletterLayer.urls.storeFrontURL && agnitasIframe) {
	    	hei.cl.widgets.dialog.layer(agnitasIframe, 'newsletterLayer', {
	    		width : 441,
	    		closecallback: function() {
	    			location.href = newsletterLayer.urls.storeFrontURL;
	    		}
	    	});
	    } else if (agnitasIframe) {
	    	hei.cl.widgets.dialog.layer(agnitasIframe, 'newsletterLayer', {
	    		width : 441
	    	});
	    }
	}
    pEvent.stopPropagation();
    return false;		
}

function handleCatOrderEvent(pEvent) {
	var newsletterCustomerCheckBox = $('#newsletterCustomerCatOrder');
	if (newsletterCustomerCheckBox.length > 0 && newsletterCustomerCheckBox.is(':checked')) {
		$('<input>').attr({
			'type'	:	'hidden',
			'name'	:	'permission-5-contents_null_r'
		}).val(1).appendTo('#CatOrderForm');
		$('<input>').attr({
			'type'	:	'hidden',
			'name'	:	'permission-5-source_null_r'
		}).val('CatOrder').appendTo('#CatOrderForm');
		$('<input>').attr({
			'type'	:	'hidden',
			'name'	:	'permission-5-id_null_r'
		}).val(5).appendTo('#CatOrderForm');
		$('<input>').attr({
			'type'	:	'hidden',
			'name'	:	'form'
		}).val('CatOrder').appendTo('#CatOrderForm');
	}
}

function appendNewsletterInputFieldToCatOrderForm() {
	var newsletterDiv = $('#catOrderCustomerNewsletterSubscribe');
	var inputField = $('<input type="checkbox" id="newsletterCustomerCatOrder" name="newsletter" checked="">');
	var newsletterLabel = $('<label>');
	
	if (!$.i18n.containsBundles('desktop.general')) {
		$.i18n.init({
			requestedBundles : [ 'DESKTOP_GENERAL' ]
		});
	}
	newsletterLabel.html($.i18n.message('desktop.general', 'abonnieren'));
	newsletterDiv.append(inputField);
	newsletterDiv.append(newsletterLabel);
}

function handleNewsLetterUnSubscribeEvent(pEvent) {
	if (!$.i18n.containsBundles('desktop.general')) {
		$.i18n.init({
			requestedBundles : [ 'DESKTOP_GENERAL' ]
		});
	}
	var isEmailValid = true;
	var isDemail = false;
	var isValid = true;
	var emailInput = "";
	pEvent.preventDefault();
	// newsletterLayer defined in jsglobals.jsp
	if(typeof newsletterLayer !== 'undefined' && newsletterLayer) {
		emailInput = $('#newsletter-unsubscription #email').val();
		if (validateSimpleEmailAddress(emailInput)) {
			if (checkEmailDeMail(emailInput)) {
				var url = newsletterLayer.urls.contentUnsubscribeURL + $('#newsletter-unsubscription #email').val();
				if (newsletterLayer.isNewsletterUnsubscribeInlineHandling) {
					$("#main .content").fadeOut("fast", function() {
						$("#main .content").html("<iframe src='" + url + "' width='" + newsletterLayer.params.iframeWidth + "' height='" + newsletterLayer.params.iframeHeight + "'></iframe>");
						$("#main .content").fadeIn("fast");
					});
				} else {
					hei.cl.widgets.dialog.iFrameLayer(url, newsletterLayer.id, newsletterLayer.unsubscribeParams, newsletterLayer.text);
				}
			} else {
				isDemail = true;
			}
		} else {
			isEmailValid = false;
		}
	}
	
	if (!isEmailValid) {
		alert($.i18n.message('desktop.general', 'error.mail.format'));
		isValid = false;
	}
	
	if (isDemail) {
		alert($.i18n.message('desktop.general', 'error.demail.format'));
		isValid = false;
	}
	
	if (newsletterLayer.isChangedStatusAtExternalBackend && isValid) {
		if (currentUserType === 'R' && newsletterLayer.currentMail === emailInput) {
			$.post(newsletterLayer.urls.updatePersonURL, {
				'permission-5-id_null_r' : '5',
				'permission-5-contents_null_r' : '0',
				'form' : 'emailservices',
				'URL' : newsletterLayer.urls.storeFrontURL
			});
		} else {
			$.post(newsletterLayer.urls.unSubscribeNewsletterExternalBackendURL, {
				'email1' : emailInput
			});
		}
	}
	
	pEvent.stopPropagation();
}

function handleNewsLetterSubscribeEvent(pEvent, pElement) {
	pEvent.preventDefault();
	if (!$.i18n.containsBundles('desktop.general')) {
		$.i18n.init({
			requestedBundles : [ 'DESKTOP_GENERAL' ]
		});
	}
	// newsletterLayer defined in jsglobals.jsp
	if(typeof newsletterLayer !== 'undefined' && newsletterLayer) {
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var url = '';
		var isEmailValid = true;
		var isDemail = false;
		var emailInput = '';
		var emailSourceSelector = '';

		if((typeof pElement !== 'undefined' && pElement.hasClass("subscribe_from_footer")) || $(this).prop('id') === 'newsletter-subscription-footer') {
			emailInput = $('#newsletter-subscription-footer #email').val();
			emailSourceSelector = '#newsletter-subscription-footer #email';
			if (validateSimpleEmailAddress(emailInput)) {
				if (checkEmailDeMail(emailInput)) {
					url = newsletterLayer.urls.footerSubscribeURL + $('#newsletter-subscription-footer #email').val();
				} else {
					isDemail = true;
				}
			} else {
				isEmailValid = false;
			}
		} else if((typeof pElement !== 'undefined' && pElement.hasClass("subscribe_from_content")) || $(this).prop('id') === 'newsletter-subscription-content') {
			emailInput = $('#newsletter-subscription-content #emailteaser').val();
			emailSourceSelector = '#newsletter-subscription-content #emailteaser';
			if (typeof emailInput === 'undefined') {
				emailInput = $('#newsletter-subscription #email').val();
			}
			if (typeof emailInput !== 'undefined' && validateSimpleEmailAddress(emailInput)) {
				if (checkEmailDeMail(emailInput)) {
					url = newsletterLayer.urls.contentSubscribeURL + emailInput;
				} else {
					isDemail = true;
				}
			} else {
				isEmailValid = false;
			}
		} else if(typeof pElement !== 'undefined' && pElement.hasClass("subscribe_from_layer")) {
			emailInput = $('#newsletter-subscription-layer #email').val();
			emailSourceSelector = '#newsletter-subscription-content #emailteaser';
			if (validateSimpleEmailAddress(emailInput)) {
				if (checkEmailDeMail(emailInput)) {
					url = newsletterLayer.urls.contentSubscribeURL + $('#newsletter-subscription-layer #email').val();
					// need to replace tracking parameter with 'nl_layer' since there is no way to tell in jsglobals if the user is from the layer
					url = url.replace(/nl_home/g, 'nl_layer');
					url = url.replace(/nl_in/g, 'nl_layer');
					// remove newsletter promo layer
					$('#newsletterLayer').remove();
				} else {
					isDemail = true;
				}
			} else {
				isEmailValid = false;
			}
		}
		
		if (!isEmailValid) {
			alert($.i18n.message('desktop.general', 'error.mail.format'));
			return false;
		}
		
		if (isDemail) {
			alert($.i18n.message('desktop.general', 'error.demail.format'));
			return false;
		}
		
		if(url.length > 0) {
			url = url.
				replace("date_contact_DAY_DATE=", "date_contact_DAY_DATE=" + day).
				replace("date_contact_MONTH_DATE=", "date_contact_MONTH_DATE=" + month).
				replace("date_contact_YEAR_DATE=", "date_contact_YEAR_DATE=" + year);
			hei.cl.widgets.dialog.iFrameLayer(url, newsletterLayer.id, newsletterLayer.params, newsletterLayer.text, function() {
				$('#' + newsletterLayer.id).width(newsletterLayer.params.layerWidth);
			});
			if (typeof emailSourceSelector !== 'undefined' && emailSourceSelector !== '') {
				$(emailSourceSelector).val('');
			}
		}
		
		if (newsletterLayer.isChangedStatusAtExternalBackend) {
			if (currentUserType === 'R' && newsletterLayer.currentMail === emailInput) {
				$.post(newsletterLayer.urls.updatePersonURL, {
					'permission-5-id_null_r' : '5',
					'permission-5-contents_null_r' : '1',
					'form' : 'emailservices',
					'URL' : newsletterLayer.urls.storeFrontURL
				});
			} else {
				$.post(newsletterLayer.urls.subscribeNewsletterExternalBackendURL, {
					'email1' : emailInput
				});
			}
		}
	}
	
	pEvent.stopPropagation();
}

function openServiceTab(p$Element) {
	p$Element.children('dt').addClass('open');
	p$Element.children('dd').addClass('open');
	p$Element.data('flag', 'open');
}

function closeServiceTab(p$Element) {
	p$Element.children('dt').removeClass('open');
	p$Element.children('dd').removeClass('open');
	$.removeData(p$Element.get(0));
}

function getPartNrBySKU (sku) {
	var result = "";
	if((sku != null || sku.length > 0) && sku.indexOf('-') > 0) {
		result = sku.split("-")[0].substring(0,6).replace(/^0+/, '') + "-" + sku.split("-")[1];
	}
	return result;
}

function newWin(name, url, width, height, args) {
	var newWin = new Object();
	newWin.args = args;
	newWin.url = url;
	newWin.name = name;
	newWin.width = width;
	newWin.height = height;
		if (document.layers) {// browser is NN
			newWin.left = window.screenX + ((window.outerWidth - newWin.width) / 2);
			newWin.top = window.screenY + ((window.outerHeight - newWin.height) / 2);
			var attr = 'screenX=' + newWin.left + ',screenY=' + newWin.top + ',resizable=yes,width=' + newWin.width + ',height=' + newWin.height + ',' + newWin.args;
		} else {// browser is MSIE
			newWin.left = (screen.width - newWin.width) / 2;
			newWin.top = (screen.height - newWin.height) / 2;
			var attr = 'left=' + newWin.left + ',top=' + newWin.top + ',resizable=yes,width=' + newWin.width + ',height=' + newWin.height + ',' + newWin.args;
		}
	newWin.win=window.open(newWin.url, newWin.name, attr);
	newWin.win.opener=self;
	newWin.win.focus();
}

function popup(url,name) {
	popupWH(url,name,400,600);
}

function popupWH(url,name,width,height) {
	newWin(name,url,width,height,'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,screenX=10,screenY=50');
}

function auw_showHideLayers(pShowlayer){
	// Wenn Browser/Plattform problematisch => zeige Pulldown nicht an
	if( browser_problematisch() ){
		return;	
	}
	clearTimeout(autoClose_daemon);
	if(pShowlayer==visibleLayer){
	}else{
		visibleLayer = "nix";
		var params_arr = new Array();
		for(var i=0; i<subMenue_arr.length; i++){
			params_arr[params_arr.length] = subMenue_arr[i].name;
			var sub_div_name = subMenue_arr[i].name + "_sub";
			var sub_div = document.getElementById(sub_div_name);
			params_arr[params_arr.length] = '';
			// hidden visible
			if(pShowlayer==subMenue_arr[i].name){
				visibleLayer = subMenue_arr[i].name;
				params_arr[params_arr.length] = 'show';
				//params_arr[params_arr.length] = 'hide';
				if( !browser_problematisch("iframe") ){
					sub_div.style.visibility = 'visible';
				}
			}else{
				params_arr[params_arr.length] = 'hide';
				if( !browser_problematisch("iframe") ){
					sub_div.style.visibility = 'hidden';
				}
			}
		}
		
		//alert("sub_divs=" + alert_string);
		if( pShowlayer == '' ){
			hideThemshowThem(false); // boese Seitenelemente wieder zeigen
		}else{
			hideThemshowThem(true); // boese Seitenelemente verstecken
		}
		
		NN_showHideLayers(params_arr);
	}
}

function auw_mouseout(){
	//clearTimeout(autoClose_daemon);
	autoClose_daemon = setTimeout("auw_showHideLayers('')", 500);
}

/*
 */

function writeSubMenueEntry(gif_Breite,nobulletname){
	var aimg_str = "";
	aimg_str += '<a href="'+ this.link +'" title="'+this.alttext+'" target="_top" ';
	// To-Do: over und out auf bullet umlenken
	aimg_str += 'onMouseOut="MM_swapImgRestore();auw_mouseout();" ';
	aimg_str += 'onMouseOver="MM_swapImage('+"'"+nobulletname+"'"+",'','"+GIF_BULLET_NAME+"',1);";
	aimg_str += 'auw_showHideLayers('+"'" +this.layername+"'"+');" title="'+this.alttext+'">';
	aimg_str += '<img name="'+this.name+'" border="0" src="'+PFAD_IMG+this.name+'.gif" ';
	aimg_str += 'width="'+gif_Breite+'" height="'+GIF_HOEHE+'" alt="'+this.alttext+ '"></a>';
	return aimg_str;
}

function writeSubMenue(p_i){
	var d = window.document;
	var m = subMenue_arr[p_i];
	var z_index = 1000 + p_i;
	var sub_z_index = 900 + p_i;
	var div_height = GIF_HOEHE * m.entries_arr.length + GIF_ECKE_HOEHE;	// 
	var div_width = GIF_RAND_BREITE + GIF_BULLET_BREITE + m.gifBreite;	
	var divstr = "";
	var iframe_name = "fr_" + p_i;
	// m.gifName nicht vergessen!
	// 1. iframe-div:
	var frame_src = "/is-bin/intershop.static/WFS/HeineDe/-/de_DE/imagesOnline/js/deckframe.html"; // fuer a) "subnav.html", b) "deckframe.html"
	
	/*	*** weitere Unterschiede von mit/ohne iframe
		standard: iframe-div heisst [..]_sub
	*/
	if( !browser_problematisch("iframe") ){
		divstr += '<div id="' + m.name + '_sub" style="position:absolute; left:'+m.posLeft+'px; ';
		divstr += 'top:'+POS_TOP+'px; width:'+div_width+'px; height:'+div_height+'px; z-index:';
		divstr += sub_z_index+'; background-color: '+DIV_BG+'; layer-background-color: '+DIV_BG;
		divstr += ' padding-left:0px; border-width:0px';
		divstr += 'overflow: visible; visibility: hidden">';//  visible  width="100%" height="100%"
		divstr += '<iframe name="'+iframe_name+'" width="'+div_width+'" height="'+div_height+'" ';
		divstr += 'src="'+frame_src+'" scrolling="no" marginwidth="0" marginheight="0" ';
		divstr += 'frameborder="0"></iframe></div>';
		d.writeln(divstr);
	}
	
	framePtr = document.getElementById(iframe_name);
	
	// 2. menue-div fuer iframe:
	ifrstr = ""
	// a) positioniert auf (0,0) fuer iframe
	ifrstr += '<div id="' + m.name + '" style="position:absolute; left:'+m.posLeft+'px; ';
	ifrstr += 'top:'+POS_TOP+'px; width:'+div_width+'px; height:'+div_height+'px; z-index:';

	// b) pos(x,c) fuer Anzeige ohne iframe
	//ifrstr += '<div id="' + m.name + '" style="position:absolute; left:0px; ';
	//ifrstr += 'top:0px; width:'+div_width+'px; height:'+(div_height)+'px; z-index:';

	ifrstr += z_index + '; background-color: '+DIV_BG+'; layer-background-color: '+DIV_BG+'; ';
	ifrstr += 'padding-left:0px; border-width:0px';
	ifrstr += ' overflow: visible; visibility: hidden">';
	ifrstr += '<table width="'+div_width+'" cellpadding="0" cellspacing="0" border="0">';

	//alert("len=" + m.entries_arr.length);
	for( var i=0; i<m.entries_arr.length; i++){
		ifrstr += '<tr><td width="'+div_width+'" bgcolor="'+DIV_BG+'">';
		
		// alle img in 1 td: Rand (obere beide Verlauf), nobullet (v-mittig), navgif
		var randgif = GIF_RAND_NAME;
		if( i<GIF_RAND_NAME_arr.length){
			randgif = GIF_RAND_NAME_arr[i];
		}

		ifrstr += '<img src="'+randgif+'" width="'+GIF_RAND_BREITE+'" height="'+GIF_HOEHE+'" border="0">';
		
		var nobulletname = m.name + "_bull"+i;
		ifrstr += '<img name="'+nobulletname+'" src="'+GIF_NOBULLET_NAME+'" width="';
		ifrstr += GIF_BULLET_BREITE+'" height="'+GIF_HOEHE+'" border="0">';
		
		ifrstr += m.entries_arr[i].writeHTML(m.gifBreite, nobulletname);
		
		ifrstr += '</td></tr>';
	}

	// tr fuer unteren Rand:
	ifrstr += '<tr><td>';
	ifrstr += '<img src="'+GIF_ECKE_NAME+'" width="'+GIF_ECKE_BREITE+'" height="'+GIF_ECKE_HOEHE+'">';
	ifrstr += '<img src="'+m.gifUntenName+'" width="'+m.gifBreite+'" height="'+GIF_ECKE_HOEHE+'">';
	ifrstr += '</td></tr>';
	
	ifrstr += '</table>';
	ifrstr += '</tr></div>';
	
	document.write(ifrstr);	// *** ohne iframe ***
	
	//var dbg = document.getElementById("debug");
	//dbg.value = "fghfgh";
	//document.dbgform.debug.value = "eeee";
	
	// debug: document.forms[1].elements[0].value = divstr;

}

function writeSubs(){
	for(var i=0; i<subMenue_arr.length; i++){
		writeSubMenue(i);
	}
}

/*	**********************
	Sub-Menue

	Breite gleich Randbreite + Bulletbreite + .gif-Breite
	Hoehe gleich n * .gif-Hoehe + Ecken-Hoehe
	
	********************** */

function SubMenue(){
	var args = arguments[0];
	this.name = args[0];
	this.posLeft = args[1];
	this.gifBreite = GIF_BREITE;
	this.gifUntenName = GIF_UNTEN_NAME;
	if(args.length>2){
		this.gifBreite = args[2];
		this.gifUntenName = PFAD_IMG + args[3];
	}
	this.entries_arr = new Array();
}

function SubMenueEntry(pName,pLink,pAlt){
	this.name = pName;
	this.link = pLink;
	this.alttext = pAlt;
	this.layername = subMenue_arr[(subMenue_arr.length-1)].name; // implizit:letztes Sub
	this.writeHTML = writeSubMenueEntry;
}


function addSubMenue(){	// opt.: 3. Parameter f. d. gif-Breite, 4. Param f. gif unten
	subMenue_arr[subMenue_arr.length] = new SubMenue(arguments);
}

function addSubMenueEntry(pName,pLink,pAlt){
	var lastSub_i = subMenue_arr.length - 1;
	if(lastSub_i>=0){
		var entries_arr_len = subMenue_arr[lastSub_i].entries_arr.length;
		subMenue_arr[lastSub_i].entries_arr[entries_arr_len] = new SubMenueEntry(pName,pLink,pAlt);
	}
}

hideElems_arr = new Array();

function addHideMe( hideElem ){
	var i = hideElems_arr.length;
	hideElems_arr[i] = hideElem;
}

// verbergen oder zeigen von zu ueberdeckenden Elementen
// wird immer ausgefuehrt. Wenn nicht ausgeblendet werden muss, sind die arrays aber leer.
function hideThemshowThem( isItHide){

	var sel_arr = new Array();	// fuer zu verbergende select-elemente
	var hs_flashs = new Array();
	var hs_ersatzbilder = new Array();
	var obj_arr = new Array();	// fuer zu verbergende object-elemente, wenn hs_flashs leer
	
	if( browser_problematisch("select") ){
		sel_arr = document.body.getElementsByTagName("select");
	}	
	
	if( browser_problematisch("object") ){
		obj_arr = document.body.getElementsByTagName("object");
		hs_flashs = document.getElementsByName(NAME_FLASHFILM);
		hs_ersatzbilder = document.getElementsByName(NAME_ERSATZBILD);	
	}	

	var i = 0;
	// verberge elements (= selects)
	for( ; i<sel_arr.length; i++ ){
		hideItShowIt( sel_arr[i], isItHide);
	}
	
	// verberge objects (= flashs)
	// 
	// wenn es 

	for( i=0; i<hs_flashs.length; i++ ){
		hideItShowIt( hs_flashs[i], isItHide);
	}
	// nur wenn es keine markierten Flashfilme gibt, blende alle Flashs aus:
	if( i==0){
		for( i=0; i<obj_arr.length; i++ ){
			hideItShowIt( obj_arr[i], isItHide);
		}
	}
	
	// blende markierte ersatzbild-divs ein:
	for( i=0; i<hs_ersatzbilder.length; i++ ){
		// spreche nicht das <img> an, sondern das <div>:
		hideItShowIt( hs_ersatzbilder[i].parentNode, !isItHide);
	}
}

function hideItShowIt( anObject, isItHide){
	if(isItHide){
		anObject.style.visibility = "hidden";
	}else{
		anObject.style.visibility = "visible";
	}
}
	
// *******************************
// zusaetzlich gehoert ein Aufruf writeSubs(); ans Ende der HTML-Seite

// Extraobjekte, die nicht vom Menue ueberdeckt werden:
flashlayers = new Array();
flashlayers[0] = "flash1";
flashlayers[1] = "flash2";

//alert(navigator.userAgent.toLowerCase());

function browser_problematisch(){
	return true;
}
 
function MM_swapImgRestore() { //v3.0
	var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
	var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
		var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
		if (a[i].indexOf("#'#'#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.0
	var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
		d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
	if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
	if(!x && document.getElementById) x=document.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
	var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
	 if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function NN_showHideLayers() {
	var i,p,v,obj, args = arguments[0];
	for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
		if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v='hide')?'hidden':v; }
		obj.visibility=v; }
}

function MM_showHideLayers() { //v3.0
	var i,p,v,obj;
	for (i=0; i<(arguments.length-2); i+=3) if ((obj=MM_findObj(arguments[i]))!=null) { v=arguments[i+2];
		if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v='hide')?'hidden':v; }
		obj.visibility=v; }
}

function MM_jumpMenu(targ,selObj,restore){ //v3.0
	eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
	if (restore) selObj.selectedIndex=0;
}

// Geschenkefinder
var recwin;
var wkid = document.URL;
var sidnr = wkid.indexOf("sid");
var sidnre = wkid.indexOf("?");
var sidnra = sidnr+4;
var sid = wkid.substring(sidnra,sidnre);

function showRecommender(url) {
	this.name = "Detail";
	recwin = popupWH(url+sid,"Recommender",563,660);
}
// Geschenkefinder Ende

//Bestellinfo Layer

function MM_showHideLayerinfo() { //v3.0
	//alert("showhide: "+arguments[1]+" "+arguments[2]);
	var i,p,v,obj;
	for (i=0; i<(arguments.length-2); i+=3) if ((obj=MM_findObj(arguments[i]))!=null) { v=arguments[i+2];
		if (obj.style) { document.cookie = "Layinfo="+v;obj=obj.style; v=(v=='show')?'visible':(v='hide')?'hidden':v; }
		obj.visibility=v; }
}

function readLayerinfoCookie() {
	var cContent = document.cookie.split(";");
	for (i=0; i<cContent.length; i++) {
	cParts = cContent[i].split("=");
	if (cParts[0].charAt(0) == ' ') {
		cParts[0] = cParts[0].substring(1, cParts[0].length);
	}
	if (cParts[0] == "Layinfo") {
		return unescape(cParts[1]);
	}
	}
	return "null";
}				

//Bestellinfo Layer Ende


//Rï¿½chsprung Suchgesteuerte Shops

function readBackUrlCookie() {
	var cContent = document.cookie.split(";");
	for (i=0; i<cContent.length; i++) {
	cParts = cContent[i].split("=");
	if (cParts[0].charAt(0) == ' ') {
		cParts[0] = cParts[0].substring(1, cParts[0].length);
	}
	if (cParts[0] == "backUrl") {
		return unescape(cParts[1]);
	}
	}
	return "null";
}


function readClickFromDVCookie() {
	var cContent = document.cookie.split(";");
	for (i=0; i<cContent.length; i++) {
	cParts = cContent[i].split("=");
	if (cParts[0].charAt(0) == ' ') {
		cParts[0] = cParts[0].substring(1, cParts[0].length);
	}
	if (cParts[0] == "clickFromDV") {
		return unescape(cParts[1]);
	}
	}
	return "null";
}

//Rï¿½chsprung Suchgesteuerte Shops Ende

//Merkzettel Start

function readreminderBackUrlCookie() {
	var cContent = document.cookie.split(";");
	for (i=0; i<cContent.length; i++) {
	cParts = cContent[i].split("=");
	if (cParts[0].charAt(0) == ' ') {
		cParts[0] = cParts[0].substring(1, cParts[0].length);
	}
	if (cParts[0] == "reminderBackUrl") {
	  if (cParts[1] != "null") {
		  return unescape(cParts[1]);
		}
	}
	}
	return "null";
}

//Merkzettel Ende

function readCookie(name)
{
  var cookieValue = "";
  var search = name + "=";
  if(document.cookie.length > 0)
  { 
    offset = document.cookie.indexOf(search);
    if (offset != -1)
    { 
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      if (end == -1) end = document.cookie.length;
      cookieValue = unescape(document.cookie.substring(offset, end))
    }
  }
  return cookieValue;
}

function writeCookie(name, value, hours)
{
  var expire = "";
  if(hours != null)
  {
    expire = new Date((new Date()).getTime() + hours * 3600000);
    expire = "; expires=" + expire.toGMTString();
  }
      
  document.cookie = name + "=" + escape(value) + expire + "; path=" + "/";
}

function activateVoucherForOrder(ajaxURL) {
		   
	    var xmlhttp = null;
	    // Mozilla
	    if (window.XMLHttpRequest) {
	        xmlhttp = new XMLHttpRequest();
	    }
	    // IE
	    else if (window.ActiveXObject) {
	        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    }
	  
	    xmlhttp.open("GET", ajaxURL, true);
	    xmlhttp.onreadystatechange = function() {
	        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        
	        	hei.cl.widgets.dialog.layer('<div style="text-align: center; font-size: 13px;"><b><br><br><br>Sie k&ouml;nnen nun losshoppen - viel Spass dabei.</b><br><br>Nach Abschicken der Bestellung erhalten Sie per Bestellbest&auml;tigung Ihren 10 EUR Gutschein, welchen Sie bei Ihrer n&auml;chsten Bestellung einl&ouml;sen k&ouml;nnen.<br><br><br></div>','basketLayer');
	        }
	    }
	    xmlhttp.send(null);

}

// KW45 Task 71245 E-Postadressen sperren
function checkEmailDeMail(email) {
	var regex = VALIDATE_RULES.demail;
	
	if(regex && regex.test(email)) {
        return false;
    } else {
    	 return true;
    }
}

// 
function setErrorMsgTextForDeMailWithForm(text){
		document.getElementById('error_p').innerHTML = text;
}
	
function showErrorMsgForDeMailWithForm(text){
	setErrorMsgTextForDeMailWithForm(text);
	document.getElementById('error_p').style.display = 'block';
}

function checkEmailDeMailWithForm(email,aForm) {
	var checkmail = document.getElementById(email).value.toLowerCase();
	
	if(checkmail.match(/@epost\.de$/i) || checkmail.match(/\.de-mail\.de$/i))
    {
		document.getElementById(email).parentNode.className = document.getElementById(email).parentNode.className + ' error';
		showErrorMsgForDeMailWithForm('Leider k&ouml;nnen wir diese Adresse nicht verwenden, bitte geben Sie eine andere Adresse an. Vielen Dank.');
		document.getElementById('error_p').style.display = "block";
		if (document.getElementById('error_mail'))
		{
			document.getElementById('error_mail').style.display = "none";
		}
        return false;
    } else
    {
		document.getElementById('error_p').style.display = "none";
        document.forms[aForm].submit();
    }
}

//*** BEGIN--> New code to validate... functions to case ****/
function validateEmailAddress(email) {
    var regExpTest = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.([a-zA-Z]){2,4})$/;
    var checkEmail = email
    if((!regExpTest.test(checkEmail)) || checkDeMail(checkEmail)){
      return false;
    }
	if (email.match(/@epost\.de$/i) || email.match(/\.de-mail\.de$/i)) {
		return false;
	}
    return true;
}

// validate Email without checkDeMail
function validateSimpleEmailAddress(email) {
	var regExpTest = VALIDATE_RULES.email;
    if(!regExpTest.test(email)){
      return false;
    }
    return true;
}

function validateFirstName(pName) {
	var regex = VALIDATE_RULES.firstName;
	
	if (regex) {
		if (!regex.test(pName)) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
}

function validateLastName(pName) {
	var regex = VALIDATE_RULES.lastName;
	
	if (regex) {
		if (!regex.test(pName)) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
}

function validateZipCode(inputForm) {
	var l$Zip = inputForm.val().replace(" ", "").toLowerCase();
	if (!l$Zip.match(/^([a-z])([a-z]?\d{1,2}|[a-z]?\d[a-z])\d[a-z]{2}$/))
		return false;
	return true;
}

function validateListZipCode(inputForm,l$Zip){
	var l$Zip = inputForm.val();
	var blockZipCodes = ["AL-2640","ASCN 1ZZ","BBND 1ZZ","BIQQ 1ZZ","FIQQ 1ZZ","GX11 1AA","PCRN 1ZZ","SIQQ 1ZZ","STHL 1ZZ","TDCU 1ZZ","TKCA 1ZZ"];
	for (i=0;i < blockZipCodes.length;i++){
		var test = blockZipCodes[i];
		if (l$Zip == test)
			return false;
	}
	return true;
}

function validatePostBox (address) {
    /* PostBox */
    var verifyAddress = address;
    if(!verifyAddress.match(/^(?!.*[Pp]([Oo][Ss][Tt])?\.?\s?([Oo]([Ff][Ff][Ii][Cc][Ee])?)?\.?\s?[BbOoXx]).*$/i)) return false;
    else return true;
}

function validatecity(city) {
	var l$City = city;
	if (l$City.indexOf(".") > -1) {
		return false;
	}
	return true;
}

function validatePassword(password,passwordverify) {
	var pw1 = password;
	var pw2 = passwordverify;
	if(pw1.length < 6 || pw1.length > 12)
	{
		return false;
	}
	return true;
}

function validatePasswordIdentity(password,passwordverify) {
	var pw1 = password;
	var pw2 = passwordverify;
	if(pw1 === pw2)
	{
		return true;
	}
	return false;
}

function validatephone(phone) {
	var l$l$Phone1 = phone;
	if (l$l$Phone1.indexOf(".") > -1) {
		return false;
	}
	return true;
}

function validateBithrday(dateofBirth) {
	var l$Birthday = dateofBirth;
	if ($.trim(l$Birthday)) {
		if (!l$Birthday.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
			return false;
		}
		else {
			var lSplit = l$Birthday.split(".");
			var lDay = lSplit[0];
			var lMonth = lSplit[1];
			var lYear = lSplit[2];
			var lCurrentDate = new Date();
			var lBirthdayAsDate = new Date(lYear, lMonth, lDay);
			if ((lDay > 31 || lDay < 1) || (lMonth > 12 || lMonth < 1)) {
				return false;
			} else if (lBirthdayAsDate > lCurrentDate) {
				return false;
			}
		}
	}
	return true;
}

function validateOptInputById(pElement, pRegex) {
	var $Elem = $('#' + pElement)
	if ($Elem.val() !== '') {
		return validateInputById(pElement, pRegex, null);
	} else {
		return true;
	}	
}

function validate1900Old(geburtJahr){
	 //+100 year-Check:
	var lCurrentDate = new Date();
	if (geburtJahr > lCurrentDate.getFullYear() || geburtJahr < 1900) return false;
	return true;	
}

function validate18Old(geburtTag,geburtMonat,geburtJahr){
	 //U18-Check:
    var min18error = false;
    var min18Day = min18Date.split('.')[0];
    var min18Month = min18Date.split('.')[1];
    var min18Year = min18Date.split('.')[2];

    if(Number(min18Year) < Number(geburtJahr)){
      min18error = true;
    }
    else if(Number(min18Year) == Number(geburtJahr)){
      if(Number(min18Month) < Number(geburtMonat)){
        min18error = true;
      }
      else if(Number(min18Month) == Number(geburtMonat)){
        if(Number(min18Day) < Number(geburtTag)){
          min18error = true;
        }
      }
    }
    return min18error;
}

function ParcingDatumTTMM(datumTTMM){
	if(datumTTMM.length == 1)
		datumTTMM = "0"+datumTTMM;
	else return datumTTMM;
	return datumTTMM;
}

function getAndNormalizePhoneNumber(element) {
	var $element = $(element);
	var value = $element.val();
	if (typeof value === 'string') {
		value = value.replace(/-+/g, '').replace(/\s+/g, '');
		$element.val(value);
	}
	return value;
}

//*** END----> New code to validate... functions to case ****/
function validateAddressForm(formName) {
	var isValid = true;
    var errorAbk="", errorDeMail = "", pwErrorTxt = "", datum_gueltig = "";
    
	// reset error message(s)
	$('#error-messages-js').children().hide();
	var lParentElement = "div.formCol";
	$(lParentElement).removeClass('error');
	
	// start: required input fields
	$('.required-input-js').each(function(pIndex) {
		var l$Self = $(this);
		if (!$.trim(l$Self.val())) {
			l$Self.parents(lParentElement).addClass('error');
			$('#error-required').show();
			isValid = false;
		}
	});

	var gender_mapping={'Mr':'Male','Mrs':'Female','Ms':'Female1','Miss':'Female','Herr':'Male','Frau':'Female','':'Unspecified'};
	
	if (formName == "newCustomerLoginForm" && isValid != false) { 
		var lIsBirthdayInvalid = false;
		var l$title = $('#personTitle').val();
		var l$FirstName = $('#firstName');
		var l$LastName = $('#lastName');
		var inputZip = $('#zipCode');
		var l$Zip = "zipCode";
		var l$Street = $('#address1');
		var l$Street2 = $('#address2');
		var l$City = $('#city');
		var pw1 = $('#logonPassword');
		var pw2 = $('#logonPasswordVerify');
		var l$l$Phone1 = $('#phone1');
		var checkEmail = $('#email1');
		var geburtTag = ParcingDatumTTMM($('#BasketForm_geburttag').val());
		var geburtMonat = ParcingDatumTTMM($('#BasketForm_geburtmonat').val());
		var geburtJahr = $('#BasketForm_geburtjahr').val();
		$('#gender').val(gender_mapping[l$title.toString()]);
		if (!validateFirstName(l$FirstName.val()))
		{
			$('#firstName').parents(lParentElement).addClass('error');
			errorAbk=htcwrite('best_texte_fehler_kursname');
			isValid = false;
		}
		if (!validateLastName(l$LastName.val()))
		{
			$('#lastName').parents(lParentElement).addClass('error');
			errorAbk=htcwrite('best_texte_fehler_kursname');
			isValid = false;
		}
		if (!validateZipCode(inputZip,l$Zip))
		{
			$('#zipCode').parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validateListZipCode(inputZip,l$Zip)){
			$('#zipCode').parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validatePassword(pw1.val(), pw2.val()))
		{
			$('#logonPassword').parents(lParentElement).addClass('error');
			pwErrorTxt = htcwrite('best_texte_fehler_passwordComprising');
			isValid = false;
		}
		if (!validatePasswordIdentity(pw1.val(), pw2.val()))
		{
			$('#logonPassword').parents(lParentElement).addClass('error');
			//pwErrorTxt = htcwrite('best_texte_fehler_requiredLabel');
			isValid = false;
		}		
		
		if (!validatephone(getAndNormalizePhoneNumber('#phone1')))
		{
			$('#phone1').parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validateEmailAddress(checkEmail.val()))
		{
			$('#email1').parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validatePostBox(l$Street.val()))
		{
			pwErrorTxt =  htcwrite('best_texte_fehler_postbox');
			$('#address1').parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validatePostBox(l$Street2.val()))
		{
			 if (pwErrorTxt == "")
				 pwErrorTxt =  htcwrite('best_texte_fehler_postbox');
			$('#address2').parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validateBithrday(geburtTag+"."+geburtMonat+"."+geburtJahr)){
		    datum_gueltig = htcwrite('best_texte_fehler_dateofbirthformat');
			$('#BasketForm_geburttag').parents(lParentElement).addClass('error');
			$('#BasketForm_geburtmonat').parents(lParentElement).addClass('error');
			$('#BasketForm_geburtjahr').parents(lParentElement).addClass('error');
			isValid = false;
		}
	    if(string2date(geburtTag+"."+geburtMonat+"."+geburtJahr) == null){
		      datum_gueltig = htcwrite('best_texte_fehler_dateofbirthformat');
		      $('#BasketForm_geburttag').parents(lParentElement).addClass('error');
		      $('#BasketForm_geburtmonat').parents(lParentElement).addClass('error');
		      $('#BasketForm_geburtjahr').parents(lParentElement).addClass('error');
		      isValid = false;
	    }else if (validate18Old(geburtTag,geburtMonat,geburtJahr)){
		      datum_gueltig = htcwrite('best_texte_fehler_not18year');
		      $('#BasketForm_geburttag').parents(lParentElement).addClass('error');
		      $('#BasketForm_geburtmonat').parents(lParentElement).addClass('error');
		      $('#BasketForm_geburtjahr').parents(lParentElement).addClass('error');
		      isValid = false;
	    }else if (!validate1900Old(geburtJahr)){
	    	datum_gueltig = htcwrite('best_texte_fehler_more100year');
			$('#BasketForm_geburttag').parents(lParentElement).addClass('error');
			$('#BasketForm_geburtmonat').parents(lParentElement).addClass('error');
			$('#BasketForm_geburtjahr').parents(lParentElement).addClass('error');
			isValid = false;
	    }
		if (!isValid){
	        step.showErrorMsg(htcwrite('best_texte_fehler_requieredLabel')+errorDeMail+errorAbk+pwErrorTxt+datum_gueltig);
	        document.location.href = "#errorbox";
		}
	}else if (formName == "newCustomerLoginForm" && isValid == false){
        step.showErrorMsg(htcwrite('best_texte_fehler_requieredLabel')+errorDeMail+errorAbk+pwErrorTxt+datum_gueltig);
        document.location.href = "#errorbox";
	}
	else if (formName == "AddressForm" && isValid != false)
	{
		var l$title = $('#personTitle').val();
		var l$FirstName = $('#firstName');
		var l$LastName = $('#lastName');
		var inputZip = $('#zipCode');
		var l$Zip = "zipCode";
		var l$Street = $('input[name="address1"]');
		var l$City = $('input[name="city"]');

		$('#gender').val(gender_mapping[l$title.toString()]);

		if (!validateFirstName(l$FirstName.val()))		
		{
			$('#firstName').parents(lParentElement).addClass('error');
			$('#error-name').show();
			isValid = false;
		}
		if (!validateLastName(l$LastName.val()))
		{
			$('#lastName').parents(lParentElement).addClass('error');
			$('#error-name').show();
			isValid = false;
		}
		if (!validateZipCode(inputZip,l$Zip))
		{	
			$('#zipCode').parents(lParentElement).addClass('error');
			$('#error-zip').show()
			isValid = false;
		}
		if (!validateListZipCode(inputZip,l$Zip))
		{
			$('#zipCode').parents(lParentElement).addClass('error');
			$('#error-zip').show()
			isValid = false;
		}
	}
	else if (formName == "EMailForm")
	{	
		var l$Email = $('input[name="' + formName + "_email" + '"]');
		if (!validateSimpleEmailAddress(l$Email.val()))
		{
			l$Email.parents(lParentElement).addClass('error');
			if ($('#error-mail').length) {
				$('#error-mail').show();
			} else {
				$('#error-required').show()
			}
			isValid = false;
		}
		var l$Vorname = $('input[name="' + formName + "_vorname" + '"]');
		if (l$Vorname.val() != '' && !validateFirstName(l$Vorname.val()))		
		{
			l$Vorname.parents(lParentElement).addClass('error');
			if ($('#error-name').length) {
				$('#error-name').show();
			} else {
				$('#error-required').show()
			}
			isValid = false;
		}
		var l$Name = $('input[name="' + formName + "_name" + '"]');
		if (l$Name.val() != '' && !validateLastName(l$Name.val()))
		{
			l$Name.parents(lParentElement).addClass('error');
			if ($('#error-name').length) {
				$('#error-name').show();
			} else {
				$('#error-required').show()
			}
			isValid = false;
		}		
		if (!validateOptInputById('EMailForm_strasse', VALIDATE_RULES.address1)) {
			$('#error-required').show();
			isValid = false;
		}
		if (!validateOptInputById('EMailForm_hausnummer', VALIDATE_RULES.houseNumber)) {
			$('#error-required').show();
			isValid = false;
		}
		if (!validateOptInputById('EMailForm_ort', VALIDATE_RULES.city)) {
			$('#error-required').show();
			isValid = false;
		}
		var l$ZipCode = $('input[name="' + formName + "_plz" + '"]');
		if (!validateOptInputById('EMailForm_plz', VALIDATE_RULES.zipCode)) {
			l$ZipCode.parents(lParentElement).addClass('error');
			if ($('#error-zip').length) {
				$('#error-zip').show();
			} else {
				$('#error-required').show()
			}
			isValid = false;
		}
		var l$CustomerNumber = $('input[name="' + formName + "_kundennummer" + '"]');
		if (!validateOptInputById('EMailForm_kundennummer', VALIDATE_RULES.customerNumber)) {
			l$CustomerNumber.parents(lParentElement).addClass('error');
			if ($('#error-customer-number').length) {
				$('#error-customer-number').show();
			} else {
				$('#error-required').show()
			}
			isValid = false;
		}
		if (!validateOptInputById('EMailForm_artikelnummer', VALIDATE_RULES.articleNumber)) {
			$('#error-required').show();
			isValid = false;
		}
		if (!validateOptInputById('fixedLinePhonePreSelection', VALIDATE_RULES.fixedLinePhonePreSelection)) {
			$('#error-required').show();
			isValid = false;
		}
		if (!validateOptInputById('fixedLinePhone', VALIDATE_RULES.fixedLinePhone)) {
			$('#error-required').show();
			isValid = false;
		}
		if (isValid) {
			$('#KontaktForm').append($('<input>', {
				'type': 'hidden',
				'name': 'EMailForm_telefon',
				'value': $('#fixedLinePhonePreSelection').val() + $('#fixedLinePhone').val() 
			}));
		}		
	}
	else if((formName == "webformkatbestellung") && isValid !=false)
	{
		var l$FirstName = $('input[name="' + pFormSrc + "_vorname" + '"]');
		if (formName == "EMailForm")
			var l$LastName = $('input[name="' + pFormSrc + "_name" + '"]');
		else
			var l$LastName = $('input[name="' + pFormSrc + "_nachname" + '"]');
		var l$Zip = pFormSrc + "_plz";
		var inputZip = $('input[name="'+l$Zip+'"]');
		var l$Email = $('input[name="' + pFormSrc + "_email" + '"]');
		if (!validateFirstName(l$FirstName.val()))		
		{
			l$FirstName.parents(lParentElement).addClass('error');
			$('#error-name').show();
			isValid = false;
		}
		if (!validateLastName(l$LastName.val()))
		{
			l$LastName.parents(lParentElement).addClass('error');
			$('#error-name').show();
			isValid = false;
		}
		if (!validateZipCode(inputZip,l$Zip))
		{
			l$Zip.parents(lParentElement).addClass('error');
			$('#error-zip').show()
			isValid = false;
		}
		if (!validateListZipCode(inputZip,l$Zip))
		{
			l$Zip.parents(lParentElement).addClass('error');
			$('#error-zip').show()
			isValid = false;
		}
		var l$NewsletterCheckbox = pFormSrc + "_newsletter";
		l$NewsletterCheckbox = $('input[name="' + l$NewsletterCheckbox + '"]');
		if ($.trim(l$Email.val()) || l$NewsletterCheckbox.attr('checked')) { // if newsletter checkbox is checked, e-mail input is required
			if (!validateEmailAddress(l$Email.val()))
			{
				l$Email.parents(lParentElement).addClass('error');
				$('#error-mail').show();
				isValid = false;
			}
		}
		var l$Birthday = pFormSrc + "_Birthday";
		l$Birthday = $('input[name="' + l$Birthday + '"]');
		if (!validateBithrday(l$Birthday.val())){
			l$Birthday.parents(lParentElement).addClass('error');
			$('#error-birthday').show();
			isValid = false;
		}
	}
	else if(formName == "newAddresseDeliveryForm" && isValid !=false)
	{
		var l$FirstName = $('#FirstName');
		var l$LastName = $('#LastName');
		var l$Street = $('#Street');
		var l$Haus = $('#Street2');
		var inputZip = $('#PostalCode');
		var l$Zip = "zipCode";
		var l$City = $('#City');
//		var l$landVW = $('#newLandesvorwahl');
		var l$phone = $('#newTelefonnummer');
		if (!validateFirstName(l$FirstName.val())){
			l$FirstName.parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validateLastName(l$LastName.val())){
			l$LastName.parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validateZipCode(inputZip,l$Zip))
		{
			inputZip.parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validateListZipCode(inputZip,l$Zip))
		{
			inputZip.parents(lParentElement).addClass('error');
			isValid = false;
		}
		if (!validatecity(l$City.val()))
		{
			l$City.parents(lParentElement).addClass('error');
			isValid = false;
		}
//		if (!validatephone(l$landVW.val()+l$phone.val()))
//		{
//			l$phone.parents(lParentElement).addClass('error');
//			l$landVW.parents(lParentElement).addClass('error');
//			isValid = false;
//		}
	}else if (formName == "newAddresseDeliveryForm" && isValid == false){
		var  texto = htcwrite('best_texte_fehler_requieredLabel');
		$('#newAddressErrorHeadline').html(texto);
	}
	return isValid;	
}


function checkFormBeforeSubmit(pFormSrc) {
	if (validateAddressForm(pFormSrc)) {
		switch (pFormSrc) {
			case "AddressForm":
				return true;
				break;
			case "webformkatbestellung":	
				formsubmit();
				break;
			case "EMailForm":
				validateKontaktForm();
				break;
			case "newCustomerLoginForm":	
				return true;
				break;				
		}
	} else {
		return false;
	}
}

function checkEmailDeMailWithFormSubmit(email) {
	var checkmail = document.getElementById(email).value.toLowerCase();
	
	if(checkmail.match(/@epost\.de$/i) || checkmail.match(/\.de-mail\.de$/i))
    {
		document.getElementById(email).parentNode.className = document.getElementById(email).parentNode.className + ' error';
		document.getElementById('error_p').style.display = "block";
		if (document.getElementById('error_mail'))
		{
			document.getElementById('error_mail').style.display = "none";
		}
        return false;
    } else
    {
		document.getElementById('error_p').style.display = "none";
        formsubmit();
    }
}

function checkEmailDeMailWithFormNL(email,aForm) {
	var checkmail = document.getElementById(email).value.toLowerCase();
	
	if(checkmail.match(/@epost\.de$/i) || checkmail.match(/\.de-mail\.de$/i))
    {
		document.getElementById(email).parentNode.className = document.getElementById(email).parentNode.className + ' error';
		showErrorMsgForDeMailWithForm('Helaas kunnen we geen gebruik maken van dit adres, gelieve een ander adres. Dank je.');
		document.getElementById('error_p').style.display = "block";
		if (document.getElementById('error_mail'))
		{
			document.getElementById('error_mail').style.display = "none";
		}
        return false;
    } else
    {
		document.getElementById('error_p').style.display = "none";
        document.forms[aForm].submit();
    }
}

// Niederland (NL)
function checkEmailDeMailNL(email) {
	var regex = VALIDATE_RULES.demail;
	
	if(regex && regex.test(email)) {
        return false;
    } else {
    	 return true;
    }
}
// Ende Task 71245 E-Postadressen sperren

// --- s: address check handling ---
var gTemplateForm = null;
var gTemplateFormPersonTitle = null;
var gTemplateFormGender = null;
var gTemplateFormLastName = null;
var gTemplateFormStreet = null;
var gTemplateFormHouseNumber = null;
var gTemplateFormZipcode = null;
var gTemplateFormCity = null;
var gAddressCheckEcondaOL = "";

function validateAddress(pAddressValidationURL, pForm, pPersonTitle, pGender, pLastName, pStreet, pHouseNumber, pZipcode, pCity) {
	hei.cl.widgets.dialog.screenAjaxLoader("show");
	
	gTemplateForm = pForm;
	gTemplateFormPersonTitle = pPersonTitle;
	gTemplateFormGender = pGender;
	gTemplateFormLastName = pLastName;
	gTemplateFormStreet = pStreet;
	gTemplateFormHouseNumber = pHouseNumber;
	gTemplateFormZipcode = pZipcode;
	gTemplateFormCity = pCity;
	
	var addressValidationURL = pAddressValidationURL;
	if (addressValidationURL) {
		var addressValidationParams = {
			"personTitle": $(pPersonTitle).val(),
			"gender": $(pGender).val(),
			"lastName": $(pLastName).val(),
			"address1": $(pStreet).val(),
			"address2": $(pHouseNumber).val(),
			"address3": "", // backend trigger exists not yet
			"zipCode": $(pZipcode).val(),
			"city": $(pCity).val()
		};
		addressValidationURL += (addressValidationURL.indexOf('?') > -1) ? "&" : "?";
		addressValidationURL += $.param(addressValidationParams);
		
		$.ajax({
			url: addressValidationURL, 
			success: function(pAjaxResponse) {
				var lValidationError = $(pAjaxResponse).find('#validation-response-error');
				var lValidationWarning = $(pAjaxResponse).find('#validation-response-warning');
				if (0 == lValidationError.length && 0 == lValidationWarning.length) {
					if (gTemplateForm) {
						submitCustomerForm();
					} else {
						closeAddressCheckLayer();
					}
				} else {
					hei.cl.widgets.dialog.screenAjaxLoader("hide");
					hei.cl.widgets.dialog.layer(pAjaxResponse, 'address-validation-layer'); // open address check handling inside a layer box
				}
			},
			error: function(pError) {
				if (gTemplateForm) {
					submitCustomerForm();
				} else {
					closeAddressCheckLayer();
				}
			}
		});
	}
}

function submitAddressCheckLayer() {
	var lCheckedRadioValue = $('input:radio[name=address-check-radio-group]:checked').val();
	if (!lCheckedRadioValue) { // if there is no radio selected
		$('#radio-not-selected-error').show();
	} else {
		$('#radio-not-selected-error').hide();
		switch (lCheckedRadioValue) {
			case "address-corrected":
				econdaOnClick(emospro.content + gAddressCheckEcondaOL + 'Vorschlag', emospro.url);
				var lAddressAsString = $('label[for="address-corrected"]').attr('id');
				splitAddressStringAndSetInputValues(lAddressAsString);
				// submit address form
				if (gTemplateForm) {
					submitCustomerForm();
				} else {
					closeAddressCheckLayer();
				}
				break;
			case "address-options":
				econdaOnClick(emospro.content + gAddressCheckEcondaOL + 'Vorschlag', emospro.url);
				var lAddressAsString = $('select[name="address-options-select"]').val();
				if (lAddressAsString) {
					if (splitAddressStringAndSetInputValues(lAddressAsString)) {
						// submit address form
						if (gTemplateForm) {
							submitCustomerForm();
						} else {
							closeAddressCheckLayer();
						}
					} else {
						closeAddressCheckLayer();
					}
				} else {
					$('#radio-not-selected-error').show(); // if there is no option selected
				}
				break;
			case "address-incorrect":
				econdaOnClick(emospro.content + gAddressCheckEcondaOL + 'Beibehaltung', emospro.url);
				// submit address form
				if (gTemplateForm) {
					submitCustomerForm();
				} else {
					closeAddressCheckLayer();
				} 
				break;
			case "back-to-formular":
				econdaOnClick(emospro.content + gAddressCheckEcondaOL + 'Korrektur', emospro.url);
				closeAddressCheckLayer();
				break;
		}
	}
}

function setAddressFormInputError(pInputErrorKey) {
	var l$ErrorINPUT = null;
	switch (pInputErrorKey) {
		case "PostalCode":
			l$ErrorINPUT = $(gTemplateFormZipcode);
			break;
		case "City":
			l$ErrorINPUT = $(gTemplateFormCity);
			break;
		case "Street":
			l$ErrorINPUT = $(gTemplateFormStreet);
			break;
		case "HouseNumber":
			l$ErrorINPUT = $(gTemplateFormHouseNumber);
			break;
	}
	l$ErrorINPUT.attr('class', 'input_error').parent().addClass('error');
}

function splitAddressStringAndSetInputValues(pAddressAsString) {
	var lStreetExists = false;
	var lAddressAsArray = pAddressAsString.split("&");
	var lAddressAsMap = {};
	for (var i in lAddressAsArray) {
		var lParts = lAddressAsArray[i].split("=");
		lAddressAsMap[lParts[0]] = lParts[1];
	}
	// change form input values
	if (lAddressAsMap['street']) {
		$(gTemplateFormStreet).val(lAddressAsMap['street']);
		$(gTemplateFormHouseNumber).val(lAddressAsMap['houseNumber']);
		
		lStreetExists = true;
	}
	$(gTemplateFormZipcode).val(lAddressAsMap['zipcode']);
	$(gTemplateFormCity).val(lAddressAsMap['city']);
	
	return lStreetExists;
}

function selectAddressOptionsRadio() {
	$('#address-options').attr('checked', true);
}

function closeAddressCheckLayer() {
	$('.contentbox').fadeOut('fast',function(){
        $('#overlay').remove();
        $(this).remove();
    });
}

function setAddressCheckEcondaOL(pStr) {
	gAddressCheckEcondaOL = "/" + pStr + "/";
	econdaOnClick(emospro.content + "/" + pStr, emospro.url);
}

function submitCustomerForm() {
	var $fixedLinePreselection = $('#fixedLinePhonePreSelection');
	var $fixedLineNumber = $('#fixedLinePhone');
	var $mobilePhonePreselection = $('#mobilePhonePreSelection');
	var $mobilePhoneNumber = $('#mobilePhone');
	
	if ($fixedLinePreselection.length > 0 && $fixedLineNumber.length > 0 && $mobilePhonePreselection.length > 0 && $mobilePhoneNumber.length > 0) {
		getAndNormalizePhoneNumber('#fixedLinePhonePreSelection');
		getAndNormalizePhoneNumber('#fixedLinePhone');
		if ($fixedLinePreselection.val() === '' && $fixedLineNumber.val() === '') {
			$fixedLinePreselection.prop('disabled', true);
			$fixedLineNumber.prop('disabled', true);
		}
		getAndNormalizePhoneNumber('#mobilePhonePreSelection');
		getAndNormalizePhoneNumber('#mobilePhone');
		if ($mobilePhonePreselection.val() === '' && $mobilePhoneNumber.val() === '') {
			$mobilePhonePreselection.prop('disabled', true);
			$mobilePhoneNumber.prop('disabled', true);
		}
	}
	
	gTemplateForm.submit();
}

//--- e: address check handling ---

//check browser if cookies enabled - id=cookie-warning-layer
function cookieEnableCheck(pLayerName) {
	var lCookieStatus = (navigator.cookieEnabled) ? true : false;
	var lLayerContent = $('#cookie-warning-layer').html();
			
	if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { 
		document.cookie="testcookie";
		lCookieStatus = (document.cookie.indexOf("testcookie") != -1) ? true : false;
	}

	if (lCookieStatus == false) {
		econdaOnClick("Startseite/Cookieerror",emospro.url);
		hei.cl.widgets.dialog.layer(lLayerContent,pLayerName);	
		
	}
}

function catalogRequestForFriend() {
	$("#cust_03").remove();
	$("#cust_02").show();	
}

function convertUmlauts(pText) {
	if(pText != null && pText.length > 0) {
		pText = pText
		.replace(/ß/g, "ss")
		.replace(/ü/g, "ue")
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/Ü/g, "Ue")
		.replace(/Ö/g, "Oe")
		.replace(/Ä/g, "Ae")
		.replace(/À/g, "A")
		.replace(/Â/g, "A")
		.replace(/Æ/g, "AE")
		.replace(/Ç/g, "C")
		.replace(/È/g, "E")
		.replace(/É/g, "E")
		.replace(/Ê/g, "E")
		.replace(/Ë/g, "E")
		.replace(/Î/g, "I")
		.replace(/Ï/g, "I")
		.replace(/Ô/g, "O")
		.replace(/Œ/g, "Oe")
		.replace(/Ù/g, "U")
		.replace(/Û/g, "U")
		.replace(/Ÿ/g, "Y")
		.replace(/à/g, "a")
		.replace(/â/g, "a")
		.replace(/æ/g, "ae")
		.replace(/ç/g, "c")
		.replace(/è/g, "e")
		.replace(/é/g, "e")
		.replace(/ê/g, "e")
		.replace(/ë/g, "e")
		.replace(/î/g, "i")
		.replace(/ï/g, "i")
		.replace(/ô/g, "o")
		.replace(/œ/g, "oe")
		.replace(/ù/g, "u")
		.replace(/û/g, "u")
		.replace(/ÿ/g, "y");
	}
	return pText;
}

function clearForm(form) {
	var $cForm = $('#' + form);	
	$(':input', $cForm)
	.not(':button, :submit, :reset, :hidden')
	.val('')
	.removeAttr('checked')
	.removeAttr('selected')	;
}

function validateCatOrderAddress(form) {
	var $catOrderForm = $('#' + form);	
	var newAddressForm = new Object();
	var isValid = validateMyHeineAddressForm(newAddressForm);
	var isOptBirthDateValid = validateOptBirthdate();
	
	if (isValid && isOptBirthDateValid[0]) {
		var $dateOfBirth = $('<input>', {
			'type': 'hidden',
			'name': 'dateOfBirth',
			'id': 'dateOfBirth',
			'value': isOptBirthDateValid[1]
		});
		$catOrderForm.append($dateOfBirth);
 
		var $selectedPersonTitleOption = $('#personTitle').children('option:selected');
		if ($selectedPersonTitleOption.length > 0) {
			var personTitleAndGender = $selectedPersonTitleOption.attr('class');
			if (personTitleAndGender) {
				var personTitleAndGenderSplit = personTitleAndGender.split("=");
				if (personTitleAndGenderSplit.length >= 2) {
					var gender = personTitleAndGenderSplit[1];
					var $dynamicGenderElem = $('<input>', {
						'type': 'hidden',
						'name': 'gender',
						'value': gender
					});
					$catOrderForm.append($dynamicGenderElem);
				}	
			}
		}
		if (addressValidationActive == 'true') {
			validateAddress(gAddressValidationURL,
					$catOrderForm,					
					newAddressForm.personTitle, 
					$dynamicGenderElem, 
					newAddressForm.lastName, 
					newAddressForm.address1, 
					newAddressForm.address2, 
					newAddressForm.zipCode, 
					newAddressForm.city);
		}
		else {
			$catOrderForm.submit();
		}
	}
}

function validateKontaktForm() {
	var $contactForm = $('#KontaktForm');
	var isValidateAddress = false;
	
	var street = $('#EMailForm_strasse').val(); 
	var houseNumber = $('#EMailForm_hausnummer').val();
	var zipCode = $('#EMailForm_plz').val();
	var city = $('#EMailForm_ort').val();
	
	isValidateAddress = typeof gFeatureEnabled.addressValidation !== undefined
						&& gFeatureEnabled.addressValidation.enabled === true
						&& street !== ''
						&& houseNumber !== ''
						&& zipCode !== ''
						&& city !== '';

	if (isValidateAddress) {
		// unspecified since at present there is no person Title field in this form
		var $dynamicGenderElem = $('<input>', {
			'type': 'hidden',
			'name': 'gender',
			'value': 'Unspecified'
		});
		$contactForm.append($dynamicGenderElem);
		
		validateAddress(gAddressValidationURL,
				$contactForm,					
				'company', 
				$dynamicGenderElem, 
				'#EMailForm_name', 
				'#EMailForm_strasse', 
				'#EMailForm_hausnummer', 
				'#EMailForm_plz', 
				'#EMailForm_ort');
	} else {
		$contactForm.submit();
	}
}

function validateOptBirthdate() {
	var isValid = true;
	var birthDateDayRegex = VALIDATE_RULES.birthdayDay;
	var birthDateMonthRegex = VALIDATE_RULES.birthdayMonth;
	var birthDateYearRegex = VALIDATE_RULES.birthdayYear;

	var $birthDay = $('#birthDateDay');
	var $birthMonth = $('#birthDateMonth');
	var $birthYear = $('#birthDateYear');
	
	if ($birthDay.parent().hasClass('error')) {
		$birthDay.parent().removeClass('error');
	}
	var dateOfBirthValue = '';
	if ($.trim($birthDay.val()).length > 0 || $.trim($birthMonth.val()).length || $.trim($birthYear.val()).length) {			
		if (!birthDateDayRegex.test($birthDay.val()) || !birthDateMonthRegex.test($birthMonth.val()) || !birthDateYearRegex.test($birthYear.val())) {
			$birthDay.parent().addClass('error');
			$('#error-birthDate').show();
			isValid = false;
		} else {
			dateOfBirthValue = $('#birthDateYear').val() + '-' + $('#birthDateMonth').val() + '-' + $('#birthDateDay').val()
		}
	}
	return [isValid, dateOfBirthValue];
}

function validateMyHeineAddressForm(newAddressForm) {
	// reset error message(s)
	$('#error-messages-js').children().hide();
	
	var isValid = true;

	// required input fields
	$('.required-input-js').each(function(pIndex) {
		if ($(this).parent().hasClass('error')) {
			$(this).parent().removeClass('error');
		}
		if (!$.trim($(this).val())) {
			$(this).parent().addClass('error');
			$('#error-required').show();
			isValid = false;
		}
	});
	
	// opt input fields
	$('.opt-input-js').each(function(pIndex) {
		if ($(this).parent().hasClass('error')) {
			$(this).parent().removeClass('error');
		}
	});
	
	if (isValid) {
		var isFirstNameValid = validateInputById('firstName', VALIDATE_RULES.firstName, newAddressForm);
		var isLastNameValid = validateInputById('lastName', VALIDATE_RULES.lastName, newAddressForm);
		var isZipCodeValid = validateAndSetZipCode(newAddressForm);
		
		var isPobBlockedWordsValid = true;
		
		var isFixedLinePhonePreSelectionValid = true;
		var isFixedLinePhoneValid = true;
		if ($('#fixedLinePhonePreSelection').length > 0 && $('#fixedLinePhone').length > 0 && $('#fixedLinePhonePreSelection').val().length > 0 && $('#fixedLinePhone').val().length > 0) {
			getAndNormalizePhoneNumber('#fixedLinePhonePreSelection');
			getAndNormalizePhoneNumber('#fixedLinePhone');
			var isFixedLinePhonePreSelectionValid = validateInputById('fixedLinePhonePreSelection', VALIDATE_RULES.fixedLinePhonePreSelection, newAddressForm);
			var isFixedLinePhoneValid = validateInputById('fixedLinePhone', VALIDATE_RULES.fixedLinePhone, newAddressForm);
		}
				
		isValid = validateInputById('personTitle', VALIDATE_RULES.title, newAddressForm) &
			isFirstNameValid &
			isLastNameValid &
			validateStreet('address1', newAddressForm, isPobBlockedWordsValid) &
			validateInputById('address2', VALIDATE_RULES.houseNumber, newAddressForm) &
			isZipCodeValid &
			validateInputById('city', VALIDATE_RULES.city, newAddressForm) &
			isFixedLinePhonePreSelectionValid &
			isFixedLinePhoneValid;
		
		if ($.trim($('#address3').val()).length > 0 && !validateInputById('address3', VALIDATE_RULES.address2)) {
	    	$('#error-invalidChar').show();
	    	$('#error-invalidChar').parent().show();
	    	isValid = false;
	    }
		
		if (!isValid) {
			if (!isFirstNameValid || !isLastNameValid) {
		    	$('#error-invalidChar').show();
		    	$('#error-invalidChar').parent().show();
			}
			if (!isZipCodeValid) {
				$('#error-zip').parent().show();
				$('#error-zip').show();
			}
			if (isPobBlockedWordsValid) {
				var errorMsg = $.i18n.message('desktop.general', 'formularfehler.keinepackstationpostfiliale');
				var $ErrorBlock = $('<p id="error-pobblocked" class="error">' + errorMsg + '</p>');
				$ErrorBlock.show();
				$('#error-messages-js').append($ErrorBlock);
			}
		}
	}
	return isValid;
}

function validateStreet(pHTMLElemID, newAddressForm, isPobBlockedWordsValid) {
	var $input = $('#' + pHTMLElemID);
	var address1Regex = VALIDATE_RULES.address1;
	var pobBlockedWords = VALIDATE_RULES.pobBlockedWords;
	
	if (pobBlockedWords && !gFeatureEnabled.checkout.isAddress2OptionalWithPOB) {
		if ($input.length > 0) {
			if (pobBlockedWords.test($input.val())) {
				$input.parent().addClass('error');
				if (newAddressForm != null) {
					newAddressForm[$input.attr('name')] = null;
				}
				isPobBlockedWordsValid = false;
				return false;
			} else {
				return validateInputById('address1', VALIDATE_RULES.address1, newAddressForm);
			}
		} else {
			isPobBlockedWordsValid = true;
			return true;
		}
	} else {
		return validateInputById('address1', VALIDATE_RULES.address1, newAddressForm);
	}
}

function validateInputById(pHTMLElemID, pRegex, newAddressForm) {
	if (pRegex) {
		var $input = $('#' + pHTMLElemID);
		if ($input.length > 0) {
			if (!pRegex.test($input.val())) {
				$input.parent().addClass('error');
				if (newAddressForm != null) {
					newAddressForm[$input.attr('name')] = null;
				}
				return false;
			} else {
				$input.parent().removeClass('error');
				if (newAddressForm != null) {
					newAddressForm[$input.attr('name')] = $input;
				}
				return true;
			}
		} else {
			return true;
		}
	} else {
		return true;
	}
}

function validateAndSetZipCode(newAddressForm, pController) {
	var regex = VALIDATE_RULES.zipCode;
	
	if (regex) {
		var $input = $('#zipCode');
		if ($input.length > 0) {
			var lZipCode = $.trim($input.val()).replace(" ", "").toLowerCase();
			if (!regex.test(lZipCode)) {
				$input.parent().addClass('error');
				newAddressForm[$input.attr('name')] = null;
				return false;
			} else {
				$input.parent().removeClass('error');
				if (isZipCodeCorrection == 'true') {
					var zipCodeTemp = $input.val().replace(/ /g, "");
					zipCodeTemp = zipCodeTemp.substring(0,zipCodeTemp.length - 3) + " " + zipCodeTemp.substring(zipCodeTemp.length - 3, zipCodeTemp.length);
					$input.val(zipCodeTemp.toUpperCase());
				}
				newAddressForm[$input.attr('name')] = $input;
				return true;
			}
		} else {
			return true;
		}
	} else {
		return true;
	}
}

/**
 * Set the session storage key 'newsletter:layerShown' with the value 'true'
 */
function setNewsletterLayerShown() {
	try {
		sessionStorage.setItem('newsletter:layerShown', true);
	} catch (ex) {}
}

/**
 * Return a boolean which decides if the newsletter layer will be shown or not.
 * Conditions which will block a layer are:
 * 		protocol is https
 * 		the url contains a value from the array excludedURLContents
 * 		the key 'newsletter:layerShown' exists in session storage
 */
function isNewsletterLayerViewAllowed() {
	var isAllowed = true;
	// check if user is already a newsletter user, if so: don't show the layer
	var excludedURLContents = ["AffiliateID=newsletter", "ExtCall", "econdaSource=WKAbbruchLayer"];
	var browserURL = document.location.href;
	$.each(excludedURLContents, function(i) {
		if (browserURL.indexOf(excludedURLContents[i]) > -1) {
			isAllowed = false;
		}
	});
	// check if the site is https protocol, if so: don't show the layer
	if(location.protocol === 'https:') {
		isAllowed = false;
	}
	// check if the layer is already shown (per sessionStorage)
	try {
		// long statement for readability
		if(sessionStorage.getItem('newsletter:layerShown')) {
			isAllowed = false;
		}
	} catch (ex) {
		isAllowed = false;
	}
	return isAllowed;
}

function openNHLayer(get_nh_content) {
	var contentText = $('#'+get_nh_content).html();
	var dummyWrap = $('<p></p>');
	var content = $('<div></div>').addClass('nh_popup').html(contentText);
	dummyWrap.append(content);
	hei.cl.widgets.dialog.layer(dummyWrap.html(), 'nh_layer');
}
function enter_ServicePUV(serviceSite) {
	if (!$.i18n.containsBundles('desktop.general')) {
		$.i18n.init({
			requestedBundles : [ 'DESKTOP_GENERAL' ]
		});
	}
	var articleNumber = '';
	var layerText1 = '';
	var layerText2 = '';
	var params = {
      langId: jsLanguage,
      storeId: jsStoreId	
	}
	if (serviceSite == 'shipping-flat') {
		articleNumber = shippingFlatrateArticleNumber;
		articleNumber = removeLeadingZeros(articleNumber);
		params = {
				"partNumber_1" : articleNumber + "-0",
				"promotion_1" : "92",
				"quantity_1" : "1",
				"langId": jsLanguage,
			    "storeId": jsStoreId
		};
		layerText1 = $.i18n.message('desktop.general', 'service.versandkostenfrei.text1');
		layerText2 = $.i18n.message('desktop.general', 'service.versandkostenfrei.text2');
	}
	
	if (serviceSite == 'gift-voucher') {
		articleNumberPromotion = $('#voucherArticle').val();
		var artNumberPromotionArray = filterArticleNumberPromotion(articleNumberPromotion);
		articleNumber = removeLeadingZeros(artNumberPromotionArray[0]);
		params = {
				"partNumber_1" : articleNumber + "-0",
				"promotion_1" : artNumberPromotionArray[1],
				"quantity_1" : $('#Quantity').val(),
				"langId": jsLanguage,
			    "storeId": jsStoreId
		};
		layerText1 = $.i18n.message('desktop.general', 'service.geschenkgutschein.text1');
		layerText2 = $.i18n.message('desktop.general', 'service.geschenkgutschein.text2');
	}	

	var output = [];
	output.push('<div class="puvServiceTitle" id="PUVService_Status_Text">');
	output.push(layerText1);
	output.push('</div>');
    output.push('<div class="pButtons">');
    output.push('<div class="hotpuvserviceaction_1" id="hotpuvserviceaction_1">');
    output.push('<a class="back" href="#" onclick="exitLayer();"><span class="btGo">');
    output.push($.i18n.message('desktop.general', 'weitershoppen'));
    output.push('</span></a></div>');
    output.push('<div class="hotpuvserviceaction_2" id="hotpuvserviceaction_2">');
    output.push('<a class="go" href="');
    output.push(viewBasketURL);		
    output.push('"><span class="btGo">');
    output.push($.i18n.message('desktop.general', 'einkaufstascheansehen'));
    output.push('</span></a></div>');
    output.push('</div>');        
    hei.cl.widgets.dialog.layer(output.join(''),'puv_service_layer');
    
	$.post(addToBasketUrl, params, function(pAjaxResponse) {
		if (serviceSite == 'gift-voucher') {
			changeLayerStatusDone(layerText2);
		}
		if (serviceSite == 'shipping-flat') {
			addServicePuvBonus(pAjaxResponse.orderId, 'servicePUVLayer', layerText2);
		}
	}, "json");
}

function addServicePuvBonus(orderId, layer, layerText2) {
    var params = {
    		"orderId" :  orderId
    };
	
	$.post(bonusAddURL, params)
		.success(function(pAjaxResponse) {
			changeLayerStatusDone(layerText2);
		}
	);
}

function removeLeadingZeros(pArticleNo) {
	if (typeof(pArticleNo) != 'undefined' && pArticleNo) {
		while (pArticleNo.indexOf('0') == 0) {
			pArticleNo = pArticleNo.substring(1, pArticleNo.length);
		}
	}		
	return pArticleNo;
}

function filterArticleNumberPromotion(articleNoPromotion) {
	var artNumberPromoArray = [];
	var promotion = articleNoPromotion.substr(articleNoPromotion.length - 2);
	var artNo = articleNoPromotion.substr(0, articleNoPromotion.length - 2);
	artNumberPromoArray.push(artNo);
	artNumberPromoArray.push(promotion);
	return artNumberPromoArray;
}

function changeLayerStatusDone(layerText2) {
	$('#PUVService_Status_Text').html(layerText2);
	$('#hotpuvserviceaction_1').show();
	$('#hotpuvserviceaction_2').show();
}

function exitLayer() {
	location.reload();
}

function addFWContent() {
	var praemien_nr, praemien_name, praemien_size, praemien_price = ''; 
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == 'praemien_nr') {
			praemien_nr = unescape(sParameterName[1]);
		}
		if (sParameterName[0] == 'praemien_name') {
			praemien_name = unescape(sParameterName[1]);
		}
		if (sParameterName[0] == 'praemien_size') {
			praemien_size = unescape(sParameterName[1]);
		}
		if (sParameterName[0] == 'praemien_price') {
			praemien_price = unescape(sParameterName[1]);
			praemien_price = praemien_price.replace("+", " ");
		}
	}
	$('#praemiennummer').val(praemien_nr);
	$('#praemienname').val(praemien_name);
	$('#praemiengroesse').val(praemien_size);
	$('#praemienzuzahlung').val(praemien_price);
}

function addRegisteredUserData() {
    $.ajax({
        type:'GET',
        url: '/PersonJSON',
        dataType:"JSON",
        cache: false
    }).done(function(data) {
    	$("#personTitle option:contains(" + data.personTitle + ")").attr('selected', true);
    	$('#firstName').val(data.firstName);
    	$('#lastName').val(data.lastName);
    	$('#address3').val(data.address3);
    	$('#address1').val(data.address1);
    	$('#address2').val(data.address2);
    	$('#zipCode').val(data.zipCode);
    	$('#city').val(data.city);
    	$('#customerNumber').val(data.customerNumber);
    	var telephone1SplitString = data.telephone1.split("/");
    	$('#fixedLinePhonePreSelection').val(telephone1SplitString[0]);
    	$('#fixedLinePhone').val(telephone1SplitString[1]);
    	var dobSplitString = data.dateOfBirth.split(".");
    	$('#birthDateDay').val(dobSplitString[0]);
    	$('#birthDateMonth').val(dobSplitString[1]);
    	$('#birthDateYear').val(dobSplitString[2]);
    })
}

function validateFWOrderForm(form) {
	var $fwOrderForm = $('#' + form);
	// reset error message(s)
	var isValid = true;
	$('.error-messages-js').children().hide();

	// check min value of ordered items
	var gPreis = 0;
	var ePreis;
	for (i = 1; i <= 6; i++) {
		ePreis = parseFloat($('#einzelpreis'+i).val());
		if (!isNaN(ePreis)) {
			gPreis += ePreis;
		}
	}
	if (gPreis < 50) {
		$('#error-minValue').show();
		isValid = false;
	}
	
	// start: new customer
	// required input fields
	$('.required-input-js-newCustomer').each(function(pIndex) {
		if ($(this).parent().hasClass('error')) {
			$(this).parent().removeClass('error');
		}
		if (!$.trim($(this).val())) {
			$(this).parent().addClass('error');
			$('#error-required-newCustomer').show();
			isValid = false;
		}
	});
	
	// opt input fields
	$('.opt-input-js-newCustomer').each(function(pIndex) {
		if ($(this).parent().hasClass('error')) {
			$(this).parent().removeClass('error');
		}
	});
	
    if (($.trim($('#firstName_new').val()).length > 0 && !validateInputById('firstName_new', VALIDATE_RULES.firstName)) | ($.trim($('#lastName_new').val()).length > 0 && !validateInputById('lastName_new', VALIDATE_RULES.lastName))) {
    	$('#error-name-newCustomer').show();
    	isValid = false;
    }
    if ($.trim($('#zipCode_new').val()).length > 0 && !validateInputById('zipCode_new', VALIDATE_RULES.zipCode)) {
    	$('#error-zip-newCustomer').show();
    	isValid = false;
    }     
   	if (($.trim($('#address1_new').val()).length > 0 && !validateInputById('address1_new', VALIDATE_RULES.address1)) | (!validateInputById('address3_new', VALIDATE_RULES.address2)) | ($.trim($('#city_new').val()).length > 0 && !validateInputById('city_new', VALIDATE_RULES.city))) {
    	$('#error-address-newCustomer').show();
    	isValid = false;
    }    
    if ($.trim($('#address2_new').val()).length > 0 && !validateInputById('address2_new', VALIDATE_RULES.houseNumber)) {
    	$('#error-houseNumber-newCustomer').show();
    	isValid = false;
    }    
    getAndNormalizePhoneNumber('#fixedLinePhonePreSelection_new');
    getAndNormalizePhoneNumber('#fixedLinePhone_new');
    if (($.trim($('#fixedLinePhonePreSelection_new').val()).length > 0 && !validateInputById('fixedLinePhonePreSelection_new', VALIDATE_RULES.fixedLinePhonePreSelection)) | ($.trim($('#fixedLinePhone_new').val()).length > 0 && !validateInputById('fixedLinePhone_new', VALIDATE_RULES.fixedLinePhone))) {
    	$('#error-phone-newCustomer').show();
    	isValid = false;
    } else if (isValid) {
    	$fwOrderForm.append($('<input>', {
    		'type': 'hidden',
    		'name': 'phone1_new',
    		'value': $('#fixedLinePhonePreSelection_new').val() + '/' + $('#fixedLinePhone_new').val()
    	}));
    }    
    if ($.trim($('#email1_new').val()).length > 0 && !validateInputById('email1_new', VALIDATE_RULES.email)) {
    	$('#error-email-newCustomer').show();
    	isValid = false;
    }   
    var isNewCustomerBirthDateValid = validateBirthdate($('#birthDateDay_new'), $('#birthDateMonth_new'), $('#birthDateYear_new'));
    if (!isNewCustomerBirthDateValid[0]) {
    	$('#error-birthday-newCustomer').show();
	    isValid = false;
    } else if (isValid && isNewCustomerBirthDateValid[0]) {
    	$fwOrderForm.append($('<input>', {
			'type': 'hidden',
			'name': 'dateOfBirth_new',
			'value': isNewCustomerBirthDateValid[1]
		}));
	}	   
   
	// start: existing customer
	// required input fields
	$('.required-input-js-existingCustomer').each(function(pIndex) {
		if ($(this).parent().hasClass('error')) {
			$(this).parent().removeClass('error');
		}
		if (!$.trim($(this).val())) {
			$(this).parent().addClass('error');
			$('#error-required-existingCustomer').show();
			isValid = false;
		}
	});
	
	// opt input fields
	$('.opt-input-js-existingCustomer').each(function(pIndex) {
		if ($(this).parent().hasClass('error')) {
			$(this).parent().removeClass('error');
		}
	});
	
   if (($.trim($('#firstName').val()).length > 0 && !validateInputById('firstName', VALIDATE_RULES.firstName)) | ($.trim($('#lastName').val()).length > 0 && !validateInputById('lastName', VALIDATE_RULES.lastName))) {
	   $('#error-name-existingCustomer').show();
	   isValid = false;
   }
   if ($.trim($('#zipCode').val()).length > 0 && !validateInputById('zipCode', VALIDATE_RULES.zipCode)) {
	   $('#error-zip-existingCustomer').show();
	   isValid = false;
   }     
   if (($.trim($('#address1').val()).length > 0 && !validateInputById('address1', VALIDATE_RULES.address1)) | (!validateInputById('address3', VALIDATE_RULES.address2)) | ($.trim($('#city').val()).length > 0 && !validateInputById('city', VALIDATE_RULES.city))) {
	   $('#error-address-existingCustomer').show();
	   isValid = false;
   }    
   if ($.trim($('#address2').val()).length > 0 && !validateInputById('address2', VALIDATE_RULES.houseNumber)) {
	   $('#error-houseNumber-existingCustomer').show();
	   isValid = false;
   }    
   getAndNormalizePhoneNumber('#fixedLinePhonePreSelection');
   getAndNormalizePhoneNumber('#fixedLinePhone');
   if (($.trim($('#fixedLinePhonePreSelection').val()).length > 0 && !validateInputById('fixedLinePhonePreSelection', VALIDATE_RULES.fixedLinePhonePreSelection)) | ($.trim($('#fixedLinePhone').val()).length > 0 && !validateInputById('fixedLinePhone', VALIDATE_RULES.fixedLinePhone))) {
	   $('#error-phone-existingCustomer').show();
	   isValid = false;
   } else if (isValid) {
	   $fwOrderForm.append($('<input>', {
		   'type': 'hidden',
		   'name': 'phone1',
		   'value': $('#fixedLinePhonePreSelection').val() + '/' + $('#fixedLinePhone').val()
   	}));
   }    
   if ($.trim($('#customerNumber').val()).length > 0 && !validateInputById('customerNumber', VALIDATE_RULES.customerNumber)) {
	   $('#error-customerNumber-existingCustomer').show();
	   isValid = false;
   }       
   var isExistingCustomerBirthDateValid = validateBirthdate($('#birthDateDay'), $('#birthDateMonth'), $('#birthDateYear'));
   if (!isExistingCustomerBirthDateValid[0]) {
	   $('#error-birthday-existingCustomer').show();
	   isValid = false;
   } else if (isValid && isExistingCustomerBirthDateValid[0]) {
	   $fwOrderForm.append($('<input>', {
		   'type': 'hidden',
		   'name': 'dateOfBirth',
		   'value': isExistingCustomerBirthDateValid[1]
	   }));
   }	
	
   if (isValid) {
	   $fwOrderForm.submit();
   }
}

function validateBirthdate($birthDay, $birthMonth, $birthYear) {
	var isValid = true;
	var birthDateDayRegex = VALIDATE_RULES.birthdayDay;
	var birthDateMonthRegex = VALIDATE_RULES.birthdayMonth;
	var birthDateYearRegex = VALIDATE_RULES.birthdayYear;

	var dateOfBirthValue = '';
	if ($.trim($birthDay.val()).length > 0 || $.trim($birthMonth.val()).length || $.trim($birthYear.val()).length) {			
		if (!birthDateDayRegex.test($birthDay.val()) || !birthDateMonthRegex.test($birthMonth.val()) || !birthDateYearRegex.test($birthYear.val())) {
			$birthDay.parent().addClass('error');
			isValid = false;
		} else {
			dateOfBirthValue = $birthYear.val() + '-' + $birthMonth.val() + '-' + $birthDay.val()
		}
	}
	return [isValid, dateOfBirthValue];
}

function confirmCancelOrder(url, message) {
	if (confirm(message)) {
		window.location.href=url;
	}
}

function updateMinibasket(){
	if ($('.minibasket').length > 0) {
		var that = this;
		var requestData = {
			'storeId': jsStoreId,
			'catalogId': jsCatalog,
			'langId': jsLanguage
		};
		$.ajax({
			url: servletRoot + 'MiniBasketSolo',
			data: requestData,
			dataType: 'html',
			cache : false
		}).done(function(data) {
			$('.minibasket').replaceWith(data);
		}).fail(function() {
			//console.error('Error while requesting ' + url);
		});
	}
}

function OpenPopUpName(pWidth, pHeight, ziel, pName, pOption) {
	if (window.pName) {
		if (!window.pName.closed) {
			window.pName.close();
		}
	}

	if (screen.height >= 700) {
		pHeight += 13;
	}

	var options = "width=" + pWidth + ",height=" + pHeight + ",toolbar=no,locationbar=no,directories=no,status=no,menubar=no,resizable=no,scrollbars=auto";
	if (pOption == 'scroll') {
		options = "width=" + pWidth + ",height=" + pHeight + ",toolbar=no,locationbar=no,directories=no,status=no,menubar=no,resizable=no,scrollbars=yes";
	}
	if (pOption == 'noscroll') {
		options = "width=" + pWidth + ",height=" + pHeight + ",toolbar=no,locationbar=no,directories=no,status=no,menubar=no,resizable=no,scrollbars=no";
	}

	pName = open(ziel, pName, options);
}

function updateURLParameter(url, param, paramVal) {
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];
        if (TheAnchor) {
            additionalURL = TheParams;
        }

        tempArray = additionalURL.split("&");

        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }        
    } else {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor  = tmpAnchor[1];

        if (TheParams) {
            baseURL = TheParams;
        }
    }

    if (TheAnchor) {
        paramVal += "#" + TheAnchor;
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

$(document).ready( function() {
	// updateMinibasket();
	if(typeof basketRecoveryLayerEnabled !== "undefined" && basketRecoveryLayerEnabled == false && typeof gNewsletterLayerController !== "undefined" && gNewsletterLayerController !== null) {
		gNewsletterLayerController.initLayer();
	}
	// display layer to inform that a promotion code was attached to the order
	if(typeof localStorage !== "undefined" && localStorage){
		var showLayer = localStorage.getItem("promotionInfoLayer");
		if (showLayer === "true") {
			var $promotionPopup = $("<div/>").attr({
				'class': 'promo_popup infolayer'
			});
			$('<div/>', {
				'class': 'nh_header',
				html: $.i18n.message('desktop.general', 'promotion.code.info.layer')
			}).appendTo($promotionPopup);
			localStorage.setItem("promotionInfoLayer","false")
			hei.cl.widgets.dialog.layer($promotionPopup,'promotionLayer');
		}
	}
});

