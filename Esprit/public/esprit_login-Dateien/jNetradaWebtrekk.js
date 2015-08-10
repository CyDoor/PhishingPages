webtrekk								= (typeof webtrekk != 'object') ? new Object() : webtrekk;
webtrekk.form							= '';
webtrekk.formAnonymous					= '';
webtrekk.formFullContent				= 'invoice-strPostcode;invoice-strCity';
webtrekk.formAttribute					= 'wt_id';
webtrekk.formFieldAttribute				= 'wt_id';
webtrekk.heatmap						= '';
webtrekk.cookie							= '3';
webtrekk.customParameter 				= new Object();
webtrekk.customerId                     = arrJshelper['customerId'];

strLastClickContent						= '';	//last click content - required for layer's close-buttons

// initialisierung
var intTrackID 							= arrJshelper['TRACKING_ID'];
var boolInitIsDone 						= false;
var boolPagePixelSent					= false;
var boolPageLoadingViaClickPixelEnabled = true;
var boolPageLoadingViaPagePixelEnabled 	= true;
var str_country							= arrJshelper['country'].toString().toLowerCase();
var str_language 						= arrJshelper['language_spoken'].toString().toLowerCase();
var language 							= str_country + '.' + str_language;
var strTrackingType						= (typeof arrJshelper['STR_TRACKING_TYPE'] != 'undefined') ? arrJshelper['STR_TRACKING_TYPE'] : 'unknown';
var strWtUri							= arrJshelper['uri'];
var timeStart 							= arrJshelper['timeStart'];
var intLoadingTime 						= 0;
var strMailEntryContent 				= (arrJshelper['mailentry'] != '') ? arrJshelper['mailentry'].toString() : '';
var trackingOptions                     = arrJshelper['trackingOptions'];
var trackDomain                         = arrJshelper["webtrekkTrackDomain"];

jQuery(function($)	// Document is ready
{
	// plugin section
	$jq.fn.jNetradaWebtrekk =
	{
		init : function(options)
		{
			if (boolInitIsDone) return;
			boolInitIsDone = true;
			
			TrackID = new Object();
			TrackID["at"] = 999955867561122;
			TrackID["be"] = 819862300000215;
			TrackID["ch"] = 939290126550099;
			TrackID["de"] = 580450832286493;
			TrackID["dk"] = 882183888888128;
			TrackID["eu"] = 745445434234434;
			TrackID["fi"] = 457917977906250;
			TrackID["fr"] = 777973221237776;
			TrackID["gb"] = 922289666233344;
			TrackID["nl"] = 966661233466666;
			TrackID["us"] = 182920392988439;
			TrackID["ca"] = 644359812874629;
			TrackID["se"] = 888690780611740;
			TrackID["it"] = 215886563367294;
			TrackID["es"] = 279299157297351;
			TrackID["nws"] = 281556864956905;
			TrackID["cz"] = 439523701272176;
			UniversalTrackID = 151869295800997;

			intTrackID = (intTrackID == '') ? TrackID[str_country].toString() : intTrackID;
			if ((intTrackID.indexOf(UniversalTrackID) == -1) && (intTrackID.indexOf(",") == -1))
			{
				intTrackID = intTrackID + ',' + UniversalTrackID;
			}
			
			webtrekk.customSessionParameter = new Object();

			webtrekk.customSessionParameter[23] = arrJshelper['userRole'] == 'nonmember' ? '' : $jq.cookie('known_user');

			if(strWtUri == '')
			{
				strWtUri = 'startpage';	//default
			}
			else
			{
				strWtUri = strWtUri.replace(/\//g, '.');
			}
			
			var defaults =
			{
				TrackingType			:	strTrackingType	,
				TrackDomain_q3			:	trackDomain,
				TrackId_q3				:	intTrackID,
				Domain_q3				:	'REGEXP:localhost|127\\.0\\.0\\.1|esprit\\.[be|com|dk|fr|nl|fi|se]|espritshop\\.[at|ch|co\\.uk|com|cz|pl]|esprit\\-club\\.com|esprit\\-online\\.com|edc\\.com|club\\-edc\\.com|esprit\\.de|esprit\\.at',
				Plugins_q3				:	'Shockwave Flash 10;Shockwave Flash 9;Shockwave Flash 8;Shockwave Flash 7;Shockwave Flash 6;Shockwave Flash 5;Shockwave Flash 4;Shockwave Flash 3;Shockwave Flash 2;Shockwave Flash 1;Adobe Acrobat;Java;Windows Media Player;QuickTime;Silverlight;RealPlayer;Flash Lite',
				TrackDomain_premium		:	'',
				TrackId_premium			:	'',
				Domain_premium			:	'',
				Plugins_premium			:	''
			};

			if(options)
			{
				$.extend(defaults, options);
			}

			if(defaults.TrackingType == 'q3')
			{
				// track url
				webtrekk.trackDomain	= defaults.TrackDomain_q3;
				// webtrekk ID
				webtrekk.trackId		= defaults.TrackId_q3;
				// shop domain
				webtrekk.domain			= defaults.Domain_q3;
				// plugins
				webtrekk.plugins		= defaults.Plugins_q3;
			}
			else
			{
				// track url
				webtrekk.trackDomain	= defaults.TrackDomain_premium;
				// webtrekk ID
				webtrekk.trackId		= defaults.TrackId_premium;
				// shop domain
				webtrekk.domain			= defaults.Domain_premium;
				// plugins
				webtrekk.plugins		= defaults.Plugins_premium;
			}
			// extend the webtrekk object with custom options
	        $jq.extend(true, webtrekk, trackingOptions);
		},
		
		setCampaignId : function(strCampaignId)
		{
		    if ((typeof strCampaignId != 'undefined') && (strCampaignId != '')) {
                webtrekk.campaignId = strCampaignId.toString();
            }
		    else if ((typeof strMailEntryContent != 'undefined') && (strMailEntryContent != '')) {
		        webtrekk.campaignId = 'mc=' + strMailEntryContent.toString();
		    }
		},

		sendPagePixel : function()
		{
			// send page pixel, once per page
			if (!boolInitIsDone) this.init();
			if (boolPagePixelSent) return;
			boolPagePixelSent = true;
			
			this.setWebtrekkContentId();
			this.setContentGroups();
			this.setDepthOfPenetration();

			wt_sendinfo();
		},
		
		setContentGroups : function(strContentId)
		{
			if (!webtrekk.contentGroup) webtrekk.contentGroup = new Object();
			strContentId = (typeof strContentId == 'undefined') ? '' : strContentId;
			strContentId = (strContentId == '') ? webtrekk.contentId : strContentId;
			
			var arrUri = strContentId.split('.');
			if (arrUri.length > 3)
			{
				arrUri.pop();
			}
			arrUri.each(function(arg, index, key)
			{
				// contentgroup starts with 1
				webtrekk.contentGroup[arg+1] = key;
			});
		},

		bIsErrorDisplayed : function()
		{
			// check if an error is displayed, return boolean true if error found
			var bIsErrorDisplayedResult = false;
			$jq('div[id*="message_window_content_"]').each(function() {
				bIsErrorDisplayedResult = true;
			});			
			return bIsErrorDisplayedResult;
		},
		
		getMessageFromMessageLayer : function()
		{
			// get error message from a displayed error/message layer
			var arrMessagesFound = new Array();
			$jq('div[id*="message_window_message_"]').contents().each(function()
			{
				if ($jq(this).text() != '')
				{
					arrMessagesFound[arrMessagesFound.length] = $jq(this).text();
				}
			});
			var strErrorMessageFoundWithinMessageLayer = arrMessagesFound.join(' ');
			return strErrorMessageFoundWithinMessageLayer;
		},
		
		sendPagePixel_3 : function(content_id)
		{
			if (!boolInitIsDone) this.init();
			webtrekk.contentId		= replaceUmlauts(language +'.'+ strWtUri +'.'+ content_id);
			webtrekk.contentGroup	= new Object();
			var arrUri = webtrekk.contentId.split('.');
			if (arrUri.length > 2)
			{
				arrUri.pop();
			}
			arrUri.each(function(arg, index, key)
			{
				// contentgroup starts with 1
				webtrekk.contentGroup[arg+1] = key;
			});
			wt_sendinfo();
		},

		sendCampPixel : function()
		{
			if (!boolInitIsDone) this.init();
			var strCamp = (arrJshelper['current_campaign'] == '' ? arrJshelper['kickoff_campaign'] : arrJshelper['current_campaign']);
			webtrekk.contentId = replaceUmlauts(language +'.'+ strWtUri +'.'+ strCamp);
			wt_sendinfo();
		},

		sendClickPixel : function(arrData)
		{
			if (!boolInitIsDone) { this.init(); }
			
			if (arrData['contentId'])
			{
				// back up original contentid if another one passed
				strOldwebtrekkContentId = webtrekk.contentId;
			}
			var strContentId = (!arrData['contentId']) ? language +'.'+ strWtUri : arrData['contentId'];
			this.setWebtrekkContentId(strContentId);
			arrData['contentType'] = arrData['contentType'].toString().replace(strContentId, '');
			arrData['contentType'] = strContentId + '.' + trimDots(arrData['contentType']);
			arrData['contentType'] = trimDots(replaceDoubleDots(replaceUmlauts(arrData['contentType'])));
			strLastClickContent = arrData['contentType'];
			wt_sendinfo(arrData['contentType'], arrData['pixelType']);
			
			if ((arrData['contentId']) && (arrData['pixelType'] != 'link'))
			{
				// restore original contentid if another one passed and pixeltype is not 'link'
				this.setWebtrekkContentId(strOldwebtrekkContentId);
			}
			
		},

		track_error_message : function(strErrorMessage)
		{
			if (!boolInitIsDone) this.init();
			if (typeof webtrekk.customParameter == 'undefined') webtrekk.customParameter = new Object();
			
			if ((typeof strErrorMessage != 'undefined') && (strErrorMessage != ''))
			{
				webtrekk.customParameter[6] = this.format_error_message(strErrorMessage);
			}
			else if ((typeof strErrorMessage == 'undefined') || (strErrorMessage == ''))
			{
				webtrekk.customParameter[6] = this.format_error_message(this.getMessageFromMessageLayer());
			}
			if ((!webtrekk.contentGroup) || (!webtrekk.contentGroup[1]))
			{
				this.setContentGroups();
			}
			if ((webtrekk.customParameter[6] != '') && (webtrekk) && (webtrekk.contentId) && (webtrekk.contentGroup) && (webtrekk.contentGroup[1]))
			{
				this.setDepthOfPenetration();
				wt_sendinfo();
			}
			this.un_track_error_message();
		},
		
		format_error_message : function(strMessage)
		{
			// formatieren der fehlermeldung laut webtrekk-regeln
			strMessage = replaceUmlauts(strMessage).toString();
			strMessage = strMessage.replace(/\t/g,' ');
			strMessage = strMessage.replace(/'/g,escape("'")).replace(/"/g,escape('"'));
			strMessage = this.trim(strMessage);
			strMessage = strMessage.toString().substr(0, 100);
			return strMessage;
		},

		un_track_error_message : function()
		{
			if (typeof webtrekk.customParameter == 'undefined') webtrekk.customParameter = new Object();
			webtrekk.customParameter[6] = '';
		},
		
		trim : function(strString)
		{
			strString = (typeof strString == 'undefined') ? '' : strString;
			// cut whitespaces at starting and at end positions
			strString = strString.toString();
			while ((strString.match(/^\s/)) || (strString.match(/\s$/)))
			{
				strString = strString.replace(/^\s/,"").replace(/\s$/,"");
			}
			return strString;
		},
		
		getSetLoadingTime : function()
		{
			// if intLoadingTime is not 0, then its already set
			if ((typeof timeStart != 'undefined') && (intLoadingTime == 0))
			{
				var timeStop = new Date().getTime();
				intLoadingTime = timeStop - timeStart;
			}
			return intLoadingTime;
		},
		
		setLoadingTimeParameter : function()
		{
			if (typeof webtrekk.customParameter == 'undefined') webtrekk.customParameter = new Object();
			webtrekk.customParameter[7] = intLoadingTime.toString();
		},
		
		sendLoadingTimeClickPixel : function()
		{
			if (intLoadingTime == 0)
			{
				intLoadingTime = this.getSetLoadingTime();
			}
			wt_sendinfo("loading_time", "click", "ck1=" + intLoadingTime);
		},
		
		loadingTimePixel : function()
		{
			// code originally copied from webtrekk's documentation
			var timeStop = new Date().getTime();
			var lt = timeStop - timeStart;
			wt_sendinfo("loading_time", "click", "ck1="+lt);
		},
		
		setWebtrekkContentId : function(strId)
		{
			strId = (typeof strId != 'undefined') ? strId : language +'.'+ strWtUri;
			webtrekk.contentId = replaceDoubleDots(trimDots(strId));
		},
		
		setDepthOfPenetration : function(strDepthOfPenetration)
		{
			if (!boolInitIsDone) this.init();
			strDepthOfPenetration 				= (typeof strDepthOfPenetration == 'undefined') ? strWtUri : strDepthOfPenetration;
			if (!webtrekk.customSessionParameter) { webtrekk.customSessionParameter = new Object(); }
			webtrekk.customSessionParameter[5] 	= strDepthOfPenetration;
		},
		
		getWebtrekkContentString : function(strInput)
		{
			// convert a string to a webtrekk compatible content-string
			strOutput = replaceUmlauts(strInput.toString().toLowerCase());
			strOutput = strOutput.replace(/ /g, '_');
			strOutput = strOutput.replace(/\s/g, '');
			return strOutput;
		}
	};
	
	if ((boolPageLoadingViaClickPixelEnabled) || (boolPageLoadingViaPagePixelEnabled))
	{
		intLoadingTime = $jq('body').jNetradaWebtrekk.getSetLoadingTime();
		if (boolPageLoadingViaPagePixelEnabled)
		{
			$jq('body').jNetradaWebtrekk.setLoadingTimeParameter();
		}
	}
	// initialisation
	$jq('body').jNetradaWebtrekk.init();
	// set (conditionally) a campaign id
	$jq('body').jNetradaWebtrekk.setCampaignId();
	// send pixel
	$jq('body').jNetradaWebtrekk.sendPagePixel();
	if (boolPageLoadingViaClickPixelEnabled)
	{
		$jq('body').jNetradaWebtrekk.sendLoadingTimeClickPixel();
	}
});

function replaceUmlauts(strReplacementString)
{
	try
	{
		return strReplacementString.toString().replace(/ß/gi, 'ss').replace(/ü/gi, 'ue').replace(/ä/gi, 'ae').replace(/ö/gi, 'oe');
	}
	catch(e)
	{
		return '';
	}
}

function trimDots(strString)
{
	// trim dots (.) at the begin and at the end
	var strStringDotTrimmed = strString.toString();
	while ((strStringDotTrimmed.match(/^\./)) || (strStringDotTrimmed.match(/\.$/)))
	{
		strStringDotTrimmed = strStringDotTrimmed.replace(/^\./,"").replace(/\.$/,"");
	}
	return strStringDotTrimmed;
}

function replaceDoubleDots(strString)
{
	var strStringReplaced 	= strString.toString();
	while (strStringReplaced.match(/\.\./))
	{
		strStringReplaced 	= strStringReplaced.replace(/\.\./g,'.');
	}
	return strStringReplaced;
}
