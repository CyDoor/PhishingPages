try {
	var touchEnabled = ('ontouchstart' in window);
	if (!touchEnabled) 
		touchEnabled = ((typeof window.navigator.msPointerEnabled != 'undefined') && window.navigator.msPointerEnabled === true && window.navigator.msMaxTouchPoints > 0) || false;
	if (!touchEnabled) {
		var ua = window.navigator.userAgent.toLowerCase()
		touchEnabled = ((ua.indexOf('tablet pc') > -1 && ua.indexOf('arm') > -1 )) || false;
	}
	if (!touchEnabled) {
		$('#metanav div a').hover(function(){
		$(this).children('.love').css('background','url(/is-bin/intershop.static/WFS/Heine-HeineDe-Site/-/de_DE/imagesOnline/icons/ic_love_white.png) no-repeat 0 0');
		}, function(){
		$(this).children('.love').css('background','url(/is-bin/intershop.static/WFS/Heine-HeineDe-Site/-/de_DE/imagesOnline/icons/ic_love.png) no-repeat 0 0 #0c184b');
		});
	}
} catch(ex){
	if (typeof(console) != 'undefined') {
		console.log(ex);
	}
}

$('document').ready(function(){
	try {
		if (!touchEnabled) {
			$('.tooltip_qtip').each(function(i) {
				var obj = $(this);
				if (typeof(obj.attr('data-hovertext'))!='undefined') {
					var qtipoptions = {
						id: obj.attr('id'),
						content: obj.attr('data-hovertext'),
						position: {},
						adjust: {
						screen: 'flip',
						x: 0,
						y: 0
						},
						style: {
							classes: 'ui-tooltip-wrapper',
							tip: {
								corner: false
							}
						},
						show: {
							solo: true,
							delay: 100
						}
					}
					if (typeof(obj.attr('data-hoverpos-top'))!='undefined') 
						qtipoptions.position.my = 'top '+obj.attr('data-hoverpos-top');
					else 
						qtipoptions.position.my = 'top left';
					if (typeof(obj.attr('data-hoverpos-bottom'))!='undefined') 
						qtipoptions.position.at = 'bottom '+obj.attr('data-hoverpos-bottom');
					else 
						qtipoptions.position.at = 'bottom left';
					if (typeof(obj.attr('data-hoverpos-target'))=='undefined' || obj.attr('data-hoverpos-target')=='yes') 
						qtipoptions.position.target = obj.children('a:first');
					if (typeof(obj.attr('data-hoverpos-adjustx'))!='undefined') 
						qtipoptions.adjust.x = obj.attr('data-hoverpos-adjustx');
					if (typeof(obj.attr('data-hoverpos-adjusty'))!='undefined') 
						qtipoptions.adjust.y = obj.attr('data-hoverpos-adjusty');
					if (typeof(obj.attr('data-hoverpos-style'))!='undefined') 
						qtipoptions.style.classes = obj.attr('data-hoverpos-style');
					$(this).qtip(qtipoptions);
				}
			});
		} else {
			$('.tooltip_qtip').children('a').each(function(i){
				$(this).css('height','35px');
			});
			$('#metanav div a').hover(function(){
				$(this).css('background','none');
			});
		}
	} catch(ex){
		if (typeof(console) != 'undefined') {console.log(ex);}
	}
});