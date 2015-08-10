(function($)
{
	$.fn.jNetradaMessageWindow = function(arrOptions)
	{
		var arrDefaults = {	strID:								'global',
							strCaption:							'',
							mixData:							'',
							strClass:							'messagelayer_default',
							intPadding:							15,
							boolBackground:						false,
							boolHideFaderOnClose:				false,
							boolHideOtherMessages:				false,
							boolHideNose:						false,
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
							zindex:								9999
						};

		if (arrOptions) $.extend(arrDefaults, arrOptions);
		arrOptions = arrDefaults;

		this.each(function(index, element)
		{
			// hide other messages if option is set
			if(arrOptions.boolHideOtherMessages)
			{
				$jq('[id^=container_message_window_]').hide();
			}

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

			
			$('body').append('<div class="container_message_window" id="container_message_window_'+ strID +'" style="z-index: '+arrOptions.zindex+';">\n\
				<div id="message_window_content_'+ strID +'" class="message_window_content '+ arrOptions.strClass +'">\n\
					<div id="message_window_caption_'+ strID +'" class="message_window_caption">'+ strCaption +'</div>\n\
						<img id="message_window_close_'+ strID +'" src="'+ NWS_WS.arrJshelper['localpicpath_nolang'] +'/checkout/layer_close.gif" alt="" class="message_window_close"/>\n\
						<div id="message_window_message_'+ strID +'" class="message_window_message" style="padding: '+ arrOptions.intPadding +'px;">'+ arrOptions.mixData +'</div>\n\
						<div id="message_window_buttons_'+ strID +'" class="message_window_buttons">\n\
							<button type="button" name="ok" class="submit_message message_window_button" id="button1_'+ strID +'" tabindex="995">'+ arrOptions.strButton1 +'</button>\n\
							<button type="button" name="cancel" class="submit_message message_window_button dontRefresh" id="button2_'+ strID +'" tabindex="996">'+ arrOptions.strButton2 +'</button>\n\
							<button type="button" name="back" class="submit_message message_window_button" id="button3_'+ strID +'" tabindex="997">'+ arrOptions.strButton3 +'</button>\n\
						</div>\n\
						<div id="nose_left_'+ strID +'" class="message_window_nose_left"><img src="'+ NWS_WS.arrJshelper['localpicpath_nolang'] +'/checkout/layer_nose_left.gif" alt="" /></div>\n\
						<div id="nose_right_'+ strID +'" class="message_window_nose_right"><img src="'+ NWS_WS.arrJshelper['localpicpath_nolang'] +'/checkout/layer_nose_right.gif" alt="" /></div>\n\
						<div id="nose_bottom_'+ strID +'" class="message_window_nose_bottom"><img src="'+ NWS_WS.arrJshelper['localpicpath_nolang'] +'/checkout/layer_nose_bottom.gif" alt="" /></div>\n\
					</div>\n\
				</div>\n\
			');
			
			messageWindowPixel(strCaption);
			
			$jq('#message_window_close_'+ strID +'').each(function(){
				var nimg = new Image();
				var that = this;
				$jq(nimg).bind('error',function(){
					$jq(that).remove();
				});
				nimg.src = $jq(this).attr('src');
			});

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

			// default cursor setting
			$('#message_window_caption_'+ strID).css('cursor', 'default');

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

			// shift the buttons a few pixels up when there is no padding
			if(arrOptions.intPadding == 0)
			{
				$('#message_window_buttons_'+ strID).css({'position' : 'absolute', 'bottom' : '0px'});
			}
			else
			{
				$('#message_window_buttons_'+ strID).css({'position' : 'relative', 'bottom' : '0px'});
			}

			// set min-width if not set
			if($('#message_window_content_'+ strID).css('min-width') == '0px' || $('#message_window_content_'+ strID).css('min-width') == '')
			{
				$('#message_window_content'+ strID).css('min-width', $('#message_window_content'+ strID).outerWidth());
				$('#message_window_content'+ strID).css('max-width', $('#message_window_content'+ strID).outerWidth());
			}

			// show overlayer
			if(arrOptions.boolBackground) $('#message_layer_fader').css({'z-index':arrOptions.zindex-1,'height':$(document).height()}).show();

			// show the message
			$('#message_window_content_'+ strID).show();

			// set the offset position if no reference element is given
			if(element.nodeName.toLowerCase() == 'body'
			|| $(element).offset().left == 0 && $(element).offset().top == 0)
			{
				/*get window and body size*/
				var fltWindowWidth = $(window).width();
				var fltWindowHeight = $(window).height();

				/*get message window object and object measures*/
				var objMessageWindow = $('#message_window_content_'+ strID);

				var fltMessageWindowHeight = objMessageWindow.height();
				var fltMessageWindowWidth = objMessageWindow.width();

				/*calculate MessageWindow position*/
				/* TOP */
				var fltMessageWindowTop  =  fltWindowHeight > fltMessageWindowHeight ? (fltWindowHeight - fltMessageWindowHeight)/2 : 25;
				fltMessageWindowTop = $(window).scrollTop() + fltMessageWindowTop;

				/* LEFT */
				var fltMessageWindowLeft 	= (fltWindowWidth - fltMessageWindowWidth)/2;
				fltMessageWindowLeft 		= fltMessageWindowLeft < 0 ? $(window).scrollLeft() + 0 : $(window).scrollLeft() +fltMessageWindowLeft;

				/* Check window scroll position */
				if( $(window).scrollLeft() != 0)
				{
					fltMessageWindowLeft = fltMessageWindowLeft - $(window).scrollLeft();
					$(window).scrollLeft(0);
				}

				/*set globallayer position*/
				objMessageWindow.css('top', fltMessageWindowTop + 'px');
				objMessageWindow.css('left', fltMessageWindowLeft + 'px');

				$('#nose_left_'+ strID +', #nose_right_'+ strID +', #nose_bottom_'+ strID).hide();
			}
			else
			{
				$('#nose_left_'+ strID).hide().css({'left' : -6});
				$('#nose_right_'+ strID).hide().css({'left' :	$('#message_window_content_'+ strID).width()});
				$('#nose_bottom_'+ strID).hide().css({'top' :	$('#message_window_content_'+ strID).height() - 6});
				setWindowPosition(strID, element, arrOptions.boolCenterPosition);
				positionNose(strID, element, arrOptions.boolHideNose);
			}

			// set the width of the buttons area to the biggest width in the window
			var intWidths	= new Array();
			intWidths[0]	= $('#message_window_caption_'+ strID).width();
			intWidths[1]	= $('#message_window_message_'+ strID).width();
			intWidths[2]	= $('#message_window_buttons_'+ strID).width();
			intWidths.sort();
			$('#message_window_buttons_'+ strID).width(intWidths[2]);

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
			
			function positionNose(strID, element, boolHideNose)
			{
				objOffsetContent = $jq('#message_window_content_'+ strID).offset();
				intPointY = $jq(element).offset().top - 10 + $jq(element).height() / 2;
				intPointX = $jq(element).offset().left + $jq(element).width() / 2;

				intY = intPointY - objOffsetContent.top;
				intY = Math.max(15, intY);
				intY = Math.min($jq('#message_window_content_'+ strID).height() - 10, intY);

				intX = intPointX - objOffsetContent.left;
				intX = Math.max(0, intX);
				intX = Math.min($jq('#message_window_content_'+ strID).width() - 7, intX);

				$jq('#nose_left_'+ strID +' , #nose_right_'+ strID).css({'top' : intY});
				$jq('#nose_bottom_'+ strID).css({'left' : intX});
				$jq('#nose_left_'+ strID +', #nose_right_'+ strID +', #nose_bottom_'+strID).hide();

				// show left nose if in range
				if(intPointX < objOffsetContent.left - 6 && intPointY > objOffsetContent.top + 10 && intPointY < objOffsetContent.top + $jq('#message_window_content_'+ strID).height() - 10)
				{
					$jq('#nose_left_'+ strID).show();
				}

				// show right nose if in range
				if(intPointX > objOffsetContent.left + $jq('#message_window_content_'+ strID).width() + 6 && intPointY > objOffsetContent.top + 10 && intPointY < objOffsetContent.top + $jq('#message_window_content_'+ strID).height() - 10)
				{
					$jq('#nose_right_'+ strID).show();
				}

				// show bottom nose if in range
				if(intPointY > objOffsetContent.top + $jq('#message_window_content_'+ strID).height() && intPointX > objOffsetContent.left && intPointX < objOffsetContent.left + $jq('#message_window_content_'+ strID).width())
				{
					$jq('#nose_bottom_'+ strID).show();
				}
			}

			function setWindowPosition(strID, element, boolCenterPosition)
			{
				if ( $('#content').exists() )
				{
					intPageXCenter = $('#content').offset().left + $('#content').width() / 3 * 2;
					intPageYCenter = $(window).height() / 2;
					intElementPositionX = $(element).offset().left;
					intElementPositionY = $(element).offset().top;
					intElementWidth = $(element).width() + parseInt($(element).css('padding-left'), 10) + parseInt($(element).css('padding-right'), 10);
					intElementHeight = $(element).height() + parseInt($(element).css('padding-top'), 10) + parseInt($(element).css('padding-bottom'), 10);
					intLayerWidth = $('#message_window_content_'+ strID).width();
					intLayerQuarterHeight = $('#message_window_content_'+ strID).height() / 4;

					if(intElementPositionX + intElementWidth > intPageXCenter)
					{
						$('#message_window_content_'+ strID).css({'left' : intElementPositionX - intLayerWidth - 10});
					}
					else if(intElementPositionX + intElementWidth < intPageXCenter)
					{
						$('#message_window_content_'+ strID).css({'left' : intElementPositionX + intElementWidth + 10});
					}

					if(intElementPositionY < intPageYCenter)
					{
						$('#message_window_content_'+ strID).css({'top' : intElementPositionY - intLayerQuarterHeight});
					}
					else if(intElementPositionY > intPageYCenter)
					{
						$('#message_window_content_'+ strID).css({'top' : intElementPositionY - intLayerQuarterHeight * 3});
					}
				}
				else
				{
					$('#message_window_content_'+ strID).css({'top' : '50%'});
					$('#message_window_content_'+ strID).css({'left' : '50%'});
				}
			}

			function closeMessageWindow(strID)
			{
				if(typeof(arrOptions.objCallbackFunctionWindowclose) == 'function') arrOptions.objCallbackFunctionWindowclose();
				$('#button1_'+ strID +', #button2_'+ strID +', #button3_'+ strID +', #message_window_close_'+ strID +', #inlayer_banner').unbind('click');
				$('#container_message_window_'+ strID).remove();
				if($('body').find('[id^=container_message_window_]').length == 0 || arrOptions.boolHideFaderOnClose) $('#message_layer_fader').hide();

				// show all other hidden messages if hide option is set
				if(arrOptions.boolHideOtherMessages)
				{
					$jq('[id^=container_message_window_]').show();
				}
			}
		});
	};
})(jQuery);