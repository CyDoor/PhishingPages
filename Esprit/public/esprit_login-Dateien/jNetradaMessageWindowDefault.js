(function($)
{
	$.fn.jNetradaMessageWindowDefault = function(arrOptions)
	{
		var arrDefaults = {	strID:								'global',
							strCaption:							'',
							mixData:							'',
							strClass:							'messagelayer_default',
							boolCenterPosition:					false,
							strButton1:							'',
							objCallbackFunction1:				null,
							strButton2:							'',
							objCallbackFunction2:				null,
							strButton3:							'',
							objCallbackFunction3:				null,
							objCallbackFunctionCloserbutton:	null,
							objCallbackFunctionWindowclose:		null,
							boolAddIndexToCaption:				false,
							zindex:								8000,
                            closeOtherMessageWindowsFirst:      true
						};

		if (arrOptions) $.extend(arrDefaults, arrOptions);
		arrOptions = arrDefaults;

		this.each(function(index, element)
		{
			// close other messages
			$jq('.container_message_window').each(function()
			{
				var myId = $jq(this).attr('id');
				myId = myId.replace('container_message_window_','');

                if (arrOptions.closeOtherMessageWindowsFirst) {
				    $('#container_message_window_'+ myId).remove();
                }
			});

			if($jq('[id^=container_message_window_]:last').length == 0)
			{
				// first message window
				var strMessageWindowIndex = '_0';
			}
			else
			{
				// second and all following message windows
				// *1 first one is for numbers higher than 0 to convert to integer
				// +1 adds one count to the window index
				// *1 second one is for converting 01 to integer 1 for the second window
				var strMessageWindowIndex = '_'+($jq($jq('[id^=container_message_window_]:last').attr('id').split('_')).last()[0]*1+1)*1;
			}

			var strID = arrOptions.strID + strMessageWindowIndex;

			var strCaption = arrOptions.strCaption;
			if(arrOptions.boolAddIndexToCaption)
			{
				strCaption += strMessageWindowIndex;
			}

			// We want to change the size of popup window
			var strButton2 = arrOptions.strButton2; 
			
			if(strButton2){
				$('body').append('<div class="container_message_window" id="container_message_window_'+ strID +'" style="z-index: '+arrOptions.zindex+';">\n\
					<div id="message_window_content_'+ strID +'" class="message_window_content message_window_content_context '+ arrOptions.strClass +'">\n\
					<div id="message_window_close_'+ strID +'" class="message_window_close font-lucida">'+NWS_WS.arrJshelper["str_close"]+'<img src="'+ NWS_WS.arrJshelper['localpicpath_nolang'] +'/globallayer_close.png" alt=""/></div>\n\
					<div class="message_window_context">\n\
						<div class="message_window_context_title" >'+ strCaption +'</div>\n\
								<div class=\"maxBasketLayer font-sansserif\" id="message_window_context_text">'+ arrOptions.mixData +'</div>\n\
									<button type="button" name="ok" class="submit_message message_window_button font-serif" id="button1_'+ strID +'" tabindex="995">'+ arrOptions.strButton1 +'</button>\n\
							</div>\n\
						</div>\n\
					 </div>\n\
				');				
			}
			else
			{
				$('body').append('<div class="container_message_window" id="container_message_window_'+ strID +'" style="z-index: '+arrOptions.zindex+';">\n\
					<div id="message_window_content_'+ strID +'" class="message_window_content '+ arrOptions.strClass +'">\n\
					<div id="message_window_close_'+ strID +'" class="message_window_close font-lucida">'+NWS_WS.arrJshelper["str_close"]+'<img src="'+ NWS_WS.arrJshelper['localpicpath_nolang'] +'/globallayer_close.png" alt=""/></div>\n\
					<table cellspacing="0" cellpadding="0" style="height:100%;width:100%">\n\
						<tr>\n\
							<td style="vertical-align:middle">\n\
								<div id="message_window_caption_'+ strID +'" class="message_window_caption font-serif">'+ strCaption +'</div>\n\
								<div id="message_window_message_'+ strID +'" class="message_window_message">'+ arrOptions.mixData +'</div>\n\
								<div id="message_window_buttons_'+ strID +'" class="message_window_buttons">\n\
									<button type="button" name="ok" class="submit_message message_window_button font-serif" id="button1_'+ strID +'" tabindex="995">'+ arrOptions.strButton1 +'</button>\n\
									<button type="button" name="cancel" class="submit_message message_window_button dontRefresh font-serif" id="button2_'+ strID +'" tabindex="996">'+ arrOptions.strButton2 +'</button>\n\
									<button type="button" name="back" class="submit_message message_window_button font-serif" id="button3_'+ strID +'" tabindex="997">'+ arrOptions.strButton3 +'</button>\n\
								</div>\n\
							</td>\n\
						</tr>\n\
					</table>\n\
					</div>\n\
				');
			}
			
			messageWindowPixel(strCaption);
			
			if(strCaption == '')
			{
				$jq('.message_window_caption').hide();
			}

			// first, hide all buttons
			$('#button1_'+ strID +', #button2_'+ strID +', #button3_'+ strID).hide();

			// set click event (close) on close symbol
			$('#message_window_close_'+ strID +', #inlayer_banner').click(function()
			{
				if(typeof(arrOptions.objCallbackFunctionCloserbutton) == 'function') arrOptions.objCallbackFunctionCloserbutton();
				closeMessageWindow(strID);
			});

			// move window to foreground
			$('#message_window_content_'+ strID).mousedown(function()
			{
				$('[id^=message_window_content_]').each(function()
				{
					$(this).css('z-index', arrOptions.zindex);
				});
				$(this).css('z-index', arrOptions.zindex+1);
			});

			// add buttons
			if(arrOptions.strButton1 != '')
			{
				$('#button1_'+ strID).click(function()
				{
					if(typeof(arrOptions.objCallbackFunction1) == 'function') arrOptions.objCallbackFunction1();
					closeMessageWindow(strID);
				}).show();
				$('#message_window_buttons_'+ strID).show();
			}

			if(arrOptions.strButton2 != '')
			{
				$('#button2_'+ strID).click(function()
				{
					if(typeof(arrOptions.objCallbackFunction2) == 'function') arrOptions.objCallbackFunction2();
					closeMessageWindow(strID);
				}).show();
				$('#message_window_buttons_'+ strID).show();
			}
			if(arrOptions.strButton3 != '')
			{
				$('#button3_'+ strID).click(function()
				{
					if(typeof(arrOptions.objCallbackFunction3) == 'function') arrOptions.objCallbackFunction3();
					closeMessageWindow(strID);
				}).show();
				$('#message_window_buttons_'+ strID).show();
			}

			// show the message
			$('#message_window_content_'+ strID).show();

			// hide globallayer fader
			if(!$jq('div.globallayer:last').exists())
			{
				$('#overlay').hide();
			}

			setWindowPosition(strID, element, arrOptions.boolCenterPosition);

			//set focus to now message window
			$('#message_window_content_'+ strID).mousedown();

			//	// tracking
			//	if((typeof(track_error_message) != 'undefined') && (strButtonType == 'error')) track_error_message();

			function messageWindowPixel(strText)
			{
			    if (typeof $jq('body').jNetradaWebtrekk == 'function') {
                    // send message pixel for Webtrekk
                    $jq('body').jNetradaWebtrekk.sendErrorPixel(strText);
                }
			}
			
			function setWindowPosition(strID, element, boolCenterPosition)
			{
				var intElementPositionX = $(element).offset().left;
				var intElementPositionY = $(element).offset().top;
				var intElementWidth = $(element).width();
				var intElementHeight = $(element).height();

				var msgWidth 	= $('.message_window_content').width();
				var msgHeight 	= $('.message_window_content').height();
				var contentLeft = $('#content').offset().left;

				var windowHeight = $(window).height() + $(window).scrollTop();

				// Links positionieren
				var posLeft = (intElementPositionX - msgWidth - 10);
				var posTop = intElementPositionY;

				// Rechts positionieren wenn Links nicht genügend Platz vorhanden
				if(posLeft < 0 || posLeft < contentLeft)
				{
					posLeft = intElementPositionX + intElementWidth + 10;
				}

				// Top Position anpassen falls Message Window unter Bildschirmrand
				if(posTop + msgHeight + 10 > windowHeight)
				{
					var diff = posTop + msgHeight + 10 - windowHeight;
					posTop = posTop - diff;
				}

				// Top Position anpassen falls Message Window über Bildschirmrand
				if(posTop < $(window).scrollTop())
				{
					posTop = $(window).scrollTop() + 10;
				}

				var scTop = 0;

				if(posLeft > $(window).width() || boolCenterPosition)
				{
					posTop 		= ($(window).height() / 2) - (msgHeight / 2);
				    posLeft 	= ($(window).width() / 2) - (msgWidth / 2);

				    scTop = posTop;
				}
				else
				{
					scTop = posTop - $(window).scrollTop() ;
				}

				$('.message_window_content').css(
			    {
			    	'top'		: scTop + 'px',
			    	'left'		: posLeft + 'px',
			    	'position'	: 'fixed'
			    });
			}

			function closeMessageWindow(strID)
			{
				if(typeof(arrOptions.objCallbackFunctionWindowclose) == 'function')
				{
					arrOptions.objCallbackFunctionWindowclose();
				}

				$('#button1_'+ strID +
				', #button2_'+ strID +
				', #button3_'+ strID +
				', #message_window_close_'+ strID +
				', #inlayer_banner').unbind('click');

				$('#container_message_window_'+ strID).remove();
			}
		});
	};
})(jQuery);