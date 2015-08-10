firstli=false;
function appendli(list,imagesrc,maptext,linkref,firstli) {
	var clE=$('<li></li>');
	var clEImage=$('<img>');
	clEImage.attr({
		'width':17,
		'height':9,
		'src':imagesrc});
	clEImage.css('margin','2px 5px 2px 0');

	if (firstli) {
		clE.addClass('first');
		var sspan=$('<span>');
		sspan.addClass('first-cont');
		sspan.append(clEImage);
		sspan.append($.i18n.map["desktop.footer"][maptext]);
		clE.append(sspan);
	} else {
		var clELink=$('<a></a>');
		clELink.append(clEImage);
		clELink.append($.i18n.map["desktop.footer"][maptext]);
		clELink.attr('href',linkref);
		clE.append(clELink);
	}
	list.append(clE);
}
if ($('#nav #liste').length === 0) {
	$.i18n.init({requestedBundles:['DESKTOP_FOOTER']});
	var countrylist=$('<ul></ul>');
	countrylist.attr('id','liste');
	if (storeId != 2) appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_at.jpg","countryselector.austria","http://www.heine.at");
	if (storeId != 3) appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_ch.jpg","countryselector.switz","http://www.heine.ch");
	if (storeId != 4) appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_nl.jpg","countryselector.neth","http://www.heine-shop.nl");
	if (storeId != 1) appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_de.jpg","countryselector.deutsch","http://www.heine.de");
	appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_fr.jpg","countryselector.france","http://www.helline.fr");

	if (storeId == 1) appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_de.jpg","countryselector.deutsch","http://www.heine.de", true);
	if (storeId == 2) appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_at.jpg","countryselector.austria","http://www.heine.at", true);
	if (storeId == 3) appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_ch.jpg","countryselector.switz","http://www.heine.ch", true);
	if (storeId == 4) appendli(countrylist,"/HeineStorefrontAssetStore/images/flags/flag_nl.jpg","countryselector.neth","http://www.heine-shop.nl", true);
		$('#nav li').append(countrylist);
}

$(document).ready(function(){
	if (gIsTabletDevice){
		if (typeof(countrylist)!='object'){
			var countrylist=$('#country_choice_content_summary ul#nav li ul#liste');
		}
		if (typeof(i18n)!='object'){
			$.i18n.init({requestedBundles:['DESKTOP_FOOTER']});
		}
		countrylist.css('height','141px');
		countrylist.css('margin-top','-141px');
		var csclosebutton=$('<li></li>');
		csclosebutton.attr('id','close-countrySel');
		csclosebutton.addClass('closeCS');
		csclosebutton.text($.i18n.map["desktop.footer"]["countryselector.close"]);
		$('#liste').prepend(csclosebutton);
		$('#close-countrySel').click(function(){
			$('#liste').css('display','none');
		});
		$('#selector-countrySel').mouseover(function(){
			$('#liste').css('display','block');
		});
	}
	$cchoice_div  = $("#countrychoice");
	if ($cchoice_div){
		$cchoice_div.show();
	}
});