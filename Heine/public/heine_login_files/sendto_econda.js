function sendto_econda()
{
    // currency conversion if necessary
    if (typeof(eCurrencyConvert)=='function')
    {
        if (typeof(ev_price)!='undefined' && ev_price!='NULL')
        {
            ev_price=eCurrencyConvert(ev_price);
        }
        if (typeof(emospro)!='undefined' && typeof(emospro.basket)!='undefined')
        {
            emospro.basket[1]=eCurrencyConvert(emospro.basket[1]);
        }
        if (typeof(emospro.ec_Event)!='undefined')
        {
            var i=0;
            while (i< emospro.ec_Event.length)
            {
                for (var k in emospro.ec_Event[i])
                {
                    if (k==3)
                    {
                        emospro.ec_Event[i][k]=eCurrencyConvert(emospro.ec_Event[i][k]);
                    }
                }
                i++;
            }
        }

	}
    // Bugfix: Alle 1000er Trennzeichen entfernen
    if (typeof(emospro) != 'undefined' && typeof(emospro.basket)!='undefined')
    {
        // Basket-Array fuer Kaufprozessanalyse
        emospro.basket[1]=e_price_format(emospro.basket[1]);
        // Preise evtl. vorhandener Events
        if (typeof(emospro.ec_Event)!='undefined')
        {
            var i=0;
            while (i< emospro.ec_Event.length)
            {
                for (var k in emospro.ec_Event[i])
                {
                    if (k==3)
                    {
                        emospro.ec_Event[i][k]=e_price_format(emospro.ec_Event[i][k]);
                    }
                }
                i++;
            }
        }
    }
    /**
     * ECONDA MARKER - START
     */
    // Teaser
	if (typeof(e_promo)==='string')
	{
		
	    if (typeof(emospro)!=='undefined' && emospro!==null)
	    {
	        emospro.marker='Teaser/'+e_promo;
	    }
	}
	
	// Bedingungen abhaengig vom aktuellen Template
	if (typeof(e_template)!='undefined')
	{
	
	    switch (e_template)
	    {
	        case 'productView':
		        if (ev_source!=='' && ev_source!=='NULL')
		        {
		            emospro.marker=ev_source;
		            if (ev_source=='Teaser' && typeof(e_promo)==='string')
		            {
		                 emospro.marker+='/'+e_promo;
		            }   
		        }
		        else
		        {
		           emospro.marker='Navigation';
		        }
		    break;
		    case 'Wishlist' : 
		    	emospro.marker = 'Merkzettel';
		    break;
		    case 'categoryResultList':
		    case 'searchResultList':	
		    	econdaFilterSet();
		    break;
	    }
	 }
	
	// Marker fuer Suche
	if (typeof(emospro.search)!='undefined')
	{
	    emospro.marker='Suche/'+emospro.search[0][2]+'/'+emospro.search[0][0];
	}
	
	// eob marker
	if (typeof(eobItems)==='object' && eobItems.length && e_template!=='checkout.placedOrder.content')
	{
		emospro.marker='BestDirekt';
	}
    /**
     * ECONDA MARKER - END
     */

    if (typeof(emosDebug)!='undefined' && emosDebug==true)
    {
        emosBigLayer();

    }
    if (emospro.marker==getECookie('lastMarker') && e_template=='productView' && typeof(emospro.search)=='undefined')
    {
        emospro=copy_emospro(emospro);
        setECookie('lastMarker',-1);
    }
    if (typeof(emospro) != 'undefined')
    {

        // Marker eliminieren
        if (marker_set==true)
        {
            emospro=copy_emospro(emospro);
        }
        if (typeof emospro.marker !== 'undefined') {
        	setECookie('lastMarker',emospro.marker,1800000,'/');
        }
        econdaSepia();
        if (e_template!='productView')
        {
        	window.emosPropertiesEvent(emospro);
	        // doppeltes Marker-Setzen verhindern
	        marker_set=true;
		}

        // Manche Marker sieht man nur auf der Console
        if (typeof(emospro.marker)!='undefined' && emospro.marker!=null)
        {
            econdaConsole('Marker gesetzt: '+ emospro.marker);
            econdaConsole('Marker reset: '+ emospro.marker);
        }
    }

    // zusaetzliche InfoLayer NICHT im Footer
    if (e_template=='basket2edit')
    {
        $('#hinweisdatenlink').click(function(){econdaOnClick('Payment/InfoAddressOL', 'empty');})
    }
    // onClickContent fuer Panorama-Ansicht auf xPack und BundleXPack
    if (e_template=='sh_xpack' || e_template=='sh_patchwork')
    {
        try
        {

            econdaConsole('Econda adding clickEvent '+$('#flashcontentss').parent());
            $('#flashcontentss').parent().click(function(){
            var new_content=emospro.content.split('/Xpack');
            new_content=new_content[0]+'/Panoramaueberblick';
            econdaOnClick(new_content,emospro.url);
            });
        }
        catch (e)
        {

            econdaConsole('Fehler'+e);

        }
    }
    // onClickContent fuer trustedShops
    if($('.trusted-shops-logo').length > 0) {
    	$('.trusted-shops-logo').click(function(){
			var position = $(this).attr('id');
			switch (position) {
			    case 'trusted-shops-logo-header' :
				    econdaOnClick(emospro.content + '/TSheader',emospro.url, emospro.heinesid);
			    	break;
			    case 'trusted-shops-logo-footer' :
			    	econdaOnClick(emospro.content + '/TSfooter',emospro.url, emospro.heinesid);
			    	break;
			    case 'trusted-shops-logo-footer-checkout' :
				    econdaOnClick(emospro.content + '/TSfooterbest',emospro.url, emospro.heinesid);
			    	break;
		    }
		});
    }
    if($('#trustedShopsBanner').length > 0) {
    	$('#trustedShopsBanner').click(function(){
    		econdaOnClick(emospro.content + '/TSvideo/Layer',emospro.url, emospro.heinesid);
    	});
    }
}
// Social Media Links tracken
try
{
$('#fb_link_1').click(function(){econdaOnClick('Startseite/Facebook',emospro.url)});
$('#fb_link_2').click(function(){econdaOnClick('Startseite/Facebook',emospro.url)});
$('#tw_link_1').click(function(){econdaOnClick('Startseite/Twitter',emospro.url)});
$('#tw_link_2').click(function(){econdaOnClick('Startseite/Twitter',emospro.url)});
$('#yt_link_1').click(function(){econdaOnClick('Startseite/Youtube',emospro.url)});
$('#yt_link_2').click(function(){econdaOnClick('Startseite/Youtube',emospro.url)});
}
catch(ex)
{
    econdaConsole('Exception: sendto_econda.isml line 335ff: '+ex);
}

