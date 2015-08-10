
var gIsTabletDevice = false;


if (Modernizr.prefixed("MaxTouchPoints", navigator)>0 || Modernizr.touch)
{
	gIsTabletDevice=true;
}


if (gIsTabletDevice==true)
{
	$("#tablet-zoom").show();
	$(document).ready(function(){
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
	});
	
}


var tAddressCheckAjaxURL = "http://www.heine.de/is-bin/INTERSHOP.enfinity/WFS/Heine-HeineDe-Site/de_DE/-/EUR/HV_CheckAddress-Start";
var feedbackdiv = $('<div id="feedbackbutton"></div>');
var mixmatcha = $('<a></a>'); // Mix and Match
//mixmatcha.attr('href','http://www.heine.de/Outfit/MixAndMatch/HeineDe?lmPromo=la%2C3%2Chk%2Csh_home%2Cfl%2Cfooter_mixmatch');
//mixmatcha.append('<img src="' + storePath + '/images/buttons/bt_mix_match_tab.gif" align="middle">');
feedbackdiv.append(mixmatcha);
feedbackdiv.css({'position':'relative', 'top':'-33px', 'left':'0px','z-index':'900','display':'none'});
$('#footer').prepend(feedbackdiv);
$(document).ready(function(){
$('#feedbackbutton').fadeIn();
});
if (typeof swfobject == 'object' && swfobject.getFlashPlayerVersion().major<9) {
$('.flcontrem').remove();
}
