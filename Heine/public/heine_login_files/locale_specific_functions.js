// calculation for service faq payment
function calculateRates() {
	var orderValue = $("input[name='OrderValue']").val();
	orderValue = orderValue.replace(',', '.');
	if ((orderValue == "") || isNaN(orderValue)) {
		if (!$('#calcresult').hasClass('hidden')) {
			$('#calcresult').addClass('hidden');
		};
		$('#calcerror').removeClass('hidden');
	}
	else {
		if (!$('#calcerror').hasClass('hidden')) { 
			$('#calcerror').addClass('hidden');
		}
		orderValue=parseFloat(orderValue);
		var numberOfRates = parseInt($("input[name='NumberOfRates']:checked").val());
		var monthlySpread;
		switch (numberOfRates) {
			case 3: monthlySpread = 0.73;break;
			case 5:	monthlySpread = 0.66;break;
			case 7: monthlySpread = 0.63;break; 
			default: break;
		}
		var spread = parseFloat((orderValue * monthlySpread * numberOfRates / 100).toFixed(2));
		var newPrice = parseFloat(orderValue + spread);
		var monthlyRate = (newPrice/numberOfRates).toFixed(2);
		$('#calcresult').removeClass('hidden');
		$('td#yourOrderValue').text(orderValue + " EUR");
		$('td#numberOfRates').text(numberOfRates + unescape(" Teilbetr%E4ge"));
		$('td#newPrice').text(newPrice + " EUR");
		$('td#monthlyRate').text(monthlyRate + " EUR");
	}
}

// Topics for service contact
function updateTopics() {
	var selectmenu = $("#EMailForm_destination");
	var destination = selectmenu.find(':selected').val();
	$('#EMailForm_betreff').empty();
	$('#EMailForm_betreff').removeAttr("disabled");
	$('#EMailForm_betreff').css('background-color','');
	switch (destination) {
	case "Kundenbetreuung":
		$('#EMailForm_betreff').append(new Option (unescape('Bitte%20ausw%E4hlen'),''));
		$('#EMailForm_betreff').append(new Option (unescape('Anfragen%20bzw.%20%C4nderung%20zur%20Bestellung'),'Anfragen_bzw_Aenderung_zur_Bestellung'));
		$('#EMailForm_betreff').append(new Option (unescape('Lieferung%20und%20R%FCcksendung'),'Lieferung_und_Ruecksendung'));
		$('#EMailForm_betreff').append(new Option (unescape('Nachfrage%20zum%20Artikel%20oder%20Katalog'),'Nachfrage_zum_Artikel_oder_Katalog'));
		$('#EMailForm_betreff').append(new Option (unescape('Adresse%20%E4ndern'),'Adresse_Aendern'));
		$('#EMailForm_betreff').append(new Option (unescape('Kundenkonto'),'Kundenkonto'));
		$('#EMailForm_betreff').append(new Option (unescape('Lob%20%26%20Kritik'),'Lob_Kritik'));
		$('#EMailForm_betreff').append(new Option (unescape('Sonstiges'),'Sonstiges'));
		break;
	case "Webmaster":
		$('#EMailForm_betreff').append(new Option (unescape('Bitte%20ausw%E4hlen'),''));
		$('#EMailForm_betreff').append(new Option (unescape('Online-Bestellung'),'Online-Bestellung'));
		$('#EMailForm_betreff').append(new Option (unescape('Anmeldung/Passwort'),'Anmeldung/Passwort'));
		$('#EMailForm_betreff').append(new Option (unescape('Mein%20Heine'),'Mein_Heine'));
		$('#EMailForm_betreff').append(new Option (unescape('Mein%20Profil'),'Mein_Profil'));
		$('#EMailForm_betreff').append(new Option (unescape('Beratung/Service'),'Beratung/Service'));
		$('#EMailForm_betreff').append(new Option (unescape('Sonstiges'),'Sonstiges'));		
		break;
	case "Newsletter":
		$('#EMailForm_betreff').append(new Option (unescape('Bitte%20ausw%E4hlen'),''));
		$('#EMailForm_betreff').append(new Option (unescape('Abonnieren'),'Abonnieren'));
		$('#EMailForm_betreff').append(new Option (unescape('E-Mailadresse%20%E4ndern'),'E-Mailadresse_Aendern'));
		$('#EMailForm_betreff').append(new Option (unescape('Abbestellen'),'Abbestellen'));
		$('#EMailForm_betreff').append(new Option (unescape('Sonstiges'),'Sonstiges'));			
		break;
	case "Club":
		$('#EMailForm_betreff').append(new Option (unescape('Bitte%20ausw%E4hlen'),''));
		$('#EMailForm_betreff').append(new Option (unescape('Mitglied%20werden'),'Mitglied%20werden'));
		$('#EMailForm_betreff').append(new Option (unescape('Bonus%20+'),'Bonus+'));
		$('#EMailForm_betreff').append(new Option (unescape('Sonstiges'),'Sonstiges'));
		break;
	default:
		$('#EMailForm_betreff').append(new Option ('',''));
		$('#EMailForm_betreff').attr('disabled','disabled');
		$('#EMailForm_betreff').css('background-color','#EEEEEE');
		break;
	}
}

$(document).ready(function() {
	if (localStorage.getItem('dsActive') == '1') {
		$("#inputDatenschutz").attr('checked', true);
	}
	$('#inputDatenschutz').click(function() {
		if ($('#inputDatenschutz').prop('checked') == true) {
			try {
				localStorage.setItem('dsActive', '1');
				econdaOnClick(emospro.content+"/MSIOptOut", emospro.url);
			} catch(e) {}
		} else {
			try {
				localStorage.removeItem('dsActive');
				econdaOnClick(emospro.content+"/MSIOptIn", emospro.url);
			} catch(e) {}
		}
	});
	
	
	$('#fbActivationLink').click(function(e) {
		e.preventDefault();
		var headLine = 'Widerspruch';
		var beforeText = 'Sie k&ouml;nnen der Anzeige von Facebook Social Plugins ("Facebook Like-Button") widersprechen, indem Sie das nachfolgende K&auml;stchen anhaken.';
		var checkText = 'Der Anzeige von Facebook Social Plugins widersprechen';
		var afterText = '<b>Bitte beachten Sie:</b> Der Widerspruch (Opt-Out) wird in Form eines Cookies vorgehalten. Wenn Sie Ihre Cookies l&ouml;schen, k&ouml;nnen wir nicht l&auml;nger sehen, dass Sie widersprochen haben.';
		var btnText = '%DCbernehmen';
		var fbLayerId = 'fbLayer';
				
		var data = $('<div/>')
							.append($('<h2>' + headLine + '</h2><br />'))
							.append($('<p>' + beforeText + '</p>'))
							.append($('<input type="checkbox" id="fbChecker"/>'))
							.append($('<span>' + checkText + '</span>'))
							.append($('<p><br />' + afterText + '</p>'))
							.append($('<a />').attr('id', 'fbAccept').addClass('go').append($('<span />').addClass('btGo').text(unescape(btnText))));
		
		hei.cl.widgets.dialog.layer(data, fbLayerId);

		if (localStorage.getItem('fbActive') == '1') {
			$("#fbChecker").attr('checked', true);
		}
		
		$('#fbAccept').click(function() {
			if ($('#fbChecker').prop('checked')) {
				try {
					localStorage.setItem('fbActive', '1');
				} catch(e) {}
			} else {
				try {
					localStorage.removeItem('fbActive');
				} catch(e) {}
			}
			$('.js_closelayer').click();
		});
	});
	
	$('#ga_ds').click(function(){
		econdaOnClick(emospro.content+'/GAOptOut', emospro.url, emospro.heinesid)
	});
	
	if ($('#friendshipPromotion').length > 0) {
		addFWContent();
		addRegisteredUserData();
	}
});