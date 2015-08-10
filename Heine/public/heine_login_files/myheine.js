/*
 *	Functions and Eventhandlers for MyHeine-Area
 */
$(document).ready(function() {

	// 'MyAccount Returns' - show or hide the 'items' table row
	$('table.returns td.first').click(function() {
		var currentRow = $(this).parent('tr');
		var itemsRow = currentRow.next('tr.items');

		// add class 'open' if tr 'items' is there
		if (itemsRow.length > 0) {
			$(this).toggleClass('open');
		}

		// check if there is more than one 'items' row
		while (itemsRow.length > 0) {
			itemsRow.toggle();
			itemsRow = itemsRow.next('tr.items');
		}

	});

	// 'MyProfile CredentialForm' - change password
	$("a#changePwSubmit").click(function(e) {
		e.preventDefault();
		if (6 <= $("#login02").val().length && $("#login02").val().length <= 12 && $("#login02").val() == $("#login02repeat").val()) {
			$("#anmelden1").submit();
		} else {
			$("#login02").parent(".formCol").addClass("error");
			$("#login02repeat").parent(".formCol").addClass("error");
			if ($("#login02").val() == "")
			{	
				$('#passwordError').html(MyHeineError.passwordEmpty);
			}
			else if ($("#login02").val().length < 6 || $("#login02").val().length > 12)
			{	
				$('#passwordError').html(MyHeineError.passwordLength);
			}
			else
			{
				$('#passwordError').html(MyHeineError.passwordNotEqual);
			}
			$('#passwordError').show();
			$("#login02").val("");
			$("#login02repeat").val("");
			password_strength_callback(0);
		}
	});
	
	// 'MyProfile CredentialForm' - change email
	$("a#changeEmailSubmit").click(function(e) {
		var oldMail = $("#orgEmail").val();
		var newMail = $("#login01").val();
		$('#emailError').hide();
		$("#ILHChangeLogin .formCol").removeClass("error");
		if(!VALIDATE_RULES.email.test(newMail)) {
			$("#ILHChangeLogin .formCol").addClass("error");
			$('#emailError').html(MyHeineError.emailFormat);
			$('#emailError').show();
		} else if (oldMail == newMail) {
			// do nothing
		} else {
			$("#ILHChangeLogin").submit();
		}
	});
	
	// load wish list items if class 'js_wishlistTeaser' exists in document
	if($('.js_wishlistTeaser').length) {
		var items = 0;
		var request = Wishlist.getItems();
		request.done(function(wishlist) {
			// check if wishlist has content
			if(typeof(wishlist.content) === 'undefined') {
				items = 0;
			} else {
				items = wishlist.content.length;
			}
			if(items > 0) {
				// newest items first
				$.each(wishlist.content, function(index, item) {
					var img = $('.js_wishlistTeaser').find('[data-index=' + index + ']');
					$(img).attr('src', Wishlist.createTeaserUrl(item.mmoid));
					$(img).closest('.image').css('display', 'inline-block');
				});
				// only show additional text if more than 4 items are in wish list
				if((items > 4)) {
					//  show additional count, so subtract 3
					$('.js_wishlistItemCount').html(items - 3);
					$('.js_wishlistHasItems').show();
				}
			} else {
				$('.js_wishlistHasNoItems').show();
			}
		});
	}
	
	if (gMyAccountData && gMyAccountData.isRequestedViaCustomerNumber && gMyAccountData.errorMessage) {
		openHeineCustomerFrame();
	}
	
	if (typeof successfullSubmit !== 'undefined' && successfullSubmit) {
		if (!$.i18n.containsBundles('desktop.myheine')) {
			$.i18n.init({
				requestedBundles : [ 'DESKTOP_MY_HEINE' ]
			});
		}
		
		switch (preFormId) {
		case "PhoneDataForm":
			phoneDataFormSubmitted(preFormId);
			break;
		}
	}
});

function openInfoLayer(url) {
	$.ajax({
		type : 'GET',
        url : url,
        cache : false
	}).done(function(data) {
        	hei.cl.widgets.dialog.layer(data, 'infoLayer');
	});
}

/* initialize error messages */
MyHeineError = {
	emailFormat : '',
	emailEqual : '',
	passwordEmpty: '',
	passwordLength: '',
	passwordNotEqual: '',
		
	init:function(emailFormat, emailEqual, passwordNotEqual, passwordLength, passwordEmpty) {
		this.emailFormat = emailFormat;
		this.emailEqual = emailEqual;
		this.passwordNotEqual = passwordNotEqual;
		this.passwordLength = passwordLength;
		this.passwordEmpty = passwordEmpty;
	}
}

LoginError = {
	emailFormat : '',
	customerNumberAndBirthdayFormat : '',
	logonPasswordLength: '',
	logonPasswordNEqual: '',
	init:function(emailFormat, customerNumberAndBirthdayFormat, logonPasswordLength, logonPasswordNEqual) {
		this.emailFormat = emailFormat;
		this.customerNumberAndBirthdayFormat = customerNumberAndBirthdayFormat;
		this.logonPasswordLength = logonPasswordLength;
		this.logonPasswordNEqual = logonPasswordNEqual;		
	}
}

/* initialize resetpassword-error messages */
ResetPasswordError = {
		passwordNotEqual: '',
		passwordLength: '',
	
	init:function(passwordNotEqual, passwordLength) {
		this.passwordNotEqual = passwordNotEqual;
		this.passwordLength = passwordLength;
	}
}

//Password Reset 
function checkPasswordReset() {
	if (6 <= $("#login02").val().length && $("#login02").val().length <= 12 && $("#login02").val() == $("#login02repeat").val())
		{
			$("#anmelden1").submit();
		}
	else
		{
			$("#login02").parent().addClass("error");
			$("#login02repeat").parent().addClass("error");
			if ($("#login02").val().length < 6 || $("#login02").val().length > 12)
			{	
				$('#pwdError').html(ResetPasswordError.passwordLength);
			}
			else if ($("#login02").val() != $("#login02repeat").val())
			{
				$('#pwdError').html(ResetPasswordError.passwordNotEqual);
			}
			$('#pwdError').show();
			$("#login02").val("");
			$("#login02repeat").val("");
		}
}

/* 'MyProfile CredentialForm' */

// check password length
function checkPasswordLenght() {
	$("#login02").val('');
	password_strength_callback(0);
	alert($('<div/>').html(MyHeineError.passwordLength).text());
}

// check password strength
function password_strength_callback(staerke) {
	var infodiv = $('#password_strength_info');
	var divs = $('#password_strength_info').children('div');

	if (typeof staerke === "undefined") {
		staerke = 0;
	}
	if (staerke > divs.length) {
		staerke = divs.length;
	}
	for (var d = 0; d < staerke; d++) {
		$(divs[d]).children('img').attr('src', 'HeineStorefrontAssetStore/images/icons/haken_uni.png');
	}
	if (staerke >= divs.length) {
		return;
	}
	for (var d = staerke; d < divs.length; d++) {
		$(divs[d]).children('img').attr('src', 'HeineStorefrontAssetStore/images/icons/haken_kontur.png');
	}
}

/* 'MyProfile EmailServicesForm' */

function checkForEmailServiceChanges() {
	var orderValue;
	var newsletterValue;
	if ($('#order').is(':checked')) {orderValue= 1;} else {orderValue = 0;}
	if ($('#newsletter').is(':checked')) {newsletterValue = 1;} else {newsletterValue = 0;}
	$('<input>').attr({
		'type'	:	'hidden',
		'name'	:	'permission-4-contents_null_r'
	}).val(orderValue).appendTo('#EMailServiceForm');
	$('<input>').attr({
		'type'	:	'hidden',
		'name'	:	'permission-5-contents_null_r'
	}).val(newsletterValue).appendTo('#EMailServiceForm');
	$('#EMailServiceForm').submit();
}

/* 'MyProfile InvoiceAddressForm' */

function setErrorMsgText(text) {
	$('#error_div').html('<a name="errorbox"></a>' + text);
}

function showErrorMsg(text) {
	setErrorMsgText(text);
	$('#error_div').show();
}

function hideErrorMsg() {
	$('#error_div').hide();
}

//check for changes in invoice addess form
function checkForInvoiceAddressChanges() {

	if ((document.AddressForm.personTitle.value.toLowerCase() == document.AddressForm.personTitle_old.value.toLowerCase()) && (document.AddressForm.firstName.value == document.AddressForm.firstName_old.value) && (document.AddressForm.lastName.value == document.AddressForm.lastName_old.value) && (document.AddressForm.address1.value == document.AddressForm.address1_old.value) && (document.AddressForm.address2.value == document.AddressForm.address2_old.value) && (document.AddressForm.zipCode.value == document.AddressForm.zipCode_old.value) && (document.AddressForm.city.value == document.AddressForm.city_old.value)) {
		document.AddressForm.address_changed.value = "false";
	} else {
		document.AddressForm.address_changed.value = "true";
	}

	if (checkFormBeforeSubmit('AddressForm')) {
		document.AddressForm.submit();
	};
}

/* 'MyAccount Order Tracking' */

// confirm article storno 
function storno_confirm(url) {
	//stornoAlertMsg = "Wollen Sie den Artikel wirklich stornieren?";
	stornoAlertMsg = "Do you really want to cancel this article?";
	if (confirm(stornoAlertMsg)) {
		window.location.href = url;
	}
}

function checkForAddressChanges() {
	if ($('[name=personTitle_old]').val().toLowerCase() == $('#personTitle').val().toLowerCase() &&
			$('[name=firstName_old]').val().toLowerCase() == $('#firstName').val().toLowerCase() &&
			$('[name=lastName_old]').val().toLowerCase() == $('#lastName').val().toLowerCase() &&
			$('[name=address1_old]').val().toLowerCase() == $('#address1').val().toLowerCase() &&
			$('[name=address2_old]').val().toLowerCase() == $('#address2').val().toLowerCase() &&
			$('[name=address3_old]').val().toLowerCase() == $.trim($('#address3').val()).toLowerCase() &&
			$('[name=zipCode_old]').val().toLowerCase() == $('#zipCode').val().toLowerCase() &&
			$('[name=city_old]').val().toLowerCase() == $('#city').val().toLowerCase()) {
		return false
	}
	else return true;
}

function checkForChangesAndValidateMyHeineAddress() {
	if(checkForAddressChanges()) {
		validateMyHeineAddress();
	}
}

function validateMyHeineAddress() {
	var $addressForm = $("#AddressForm");	
	var newAddressForm = new Object();
	var isValid = validateMyHeineAddressForm(newAddressForm);
	if (isValid) {
		if($('#nickName').val() == undefined) {
			var $nickName = $('<input>', {
				'type': 'hidden',
				'name': 'nickName',
				'value': $('#firstName').val() + ' ' + $('#lastName').val() + ' ' + new Date()
			});
			$addressForm.append($nickName);
		}
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
					$addressForm.append($dynamicGenderElem);
				}	
			}
		}
		var phoneNumber = "";
		if ($('#fixedLinePhonePreSelection').length > 0 && $('#fixedLinePhone').val().length > 0 && $('#fixedLinePhonePreSelection').val().length > 0 && $('#fixedLinePhone').val().length > 0) {	
			phoneNumber = $('#fixedLinePhonePreSelection').val() + '/' + $('#fixedLinePhone').val();
		}
		var $phone1 = $('<input>', {
			'type': 'hidden',
			'name': 'phone1',
			'value': phoneNumber
		});
		$addressForm.append($phone1);		
		
		if (addressValidationActive == 'true') {
			validateAddress(gAddressValidationURL,
					$addressForm,					
					newAddressForm.personTitle, 
					$dynamicGenderElem, 
					newAddressForm.lastName, 
					newAddressForm.address1, 
					newAddressForm.address2, 
					newAddressForm.zipCode, 
					newAddressForm.city);
		}
		else {
			$addressForm.submit();
		}
	}
}

function validateLogonEmail() {	
	var emailRegex = VALIDATE_RULES.email;
	var email = $('#logonId').val();
	var passwordLength = $('#password').val().length;
	if (!emailRegex.test(email)) {
		$('#emailError').html(LoginError.emailFormat);
		$('#emailError').show();
	} else if (passwordLength < 6 || passwordLength > 12) {
		$('#emailError').html(LoginError.logonPasswordLength);
		$('#emailError').show();		
	} else {
		$('#ILHLogin').submit();
	}
}

function loginWithCustomerNumber() {
	if (validateCustomerNumberLogin()) {
		var $gbdLoginForm = $('#gbd_logon_form');
		if ($gbdLoginForm.length > 0) {
			$gbdLoginForm.append($('<input>', {
				'type': 'hidden',
				'name': 'dateOfBirth',
				'value': ($('#login_gbd_geb_jjjj').val() + '-' + $('#login_gbd_geb_mm').val() + '-' + $('#login_gbd_geb_tt').val())	
			}));				
			$gbdLoginForm.submit();
		}
	}
}

function validateCustomerNumberLogin() {
	var custNumberRegex = VALIDATE_RULES.customerNumber;
	var birthDateDayRegex = VALIDATE_RULES.birthdayDay;
	var birthDateMonthRegex = VALIDATE_RULES.birthdayMonth;
	var birthDateYearRegex = VALIDATE_RULES.birthdayYear;
	
	if (!custNumberRegex || !birthDateDayRegex || !birthDateMonthRegex || !birthDateYearRegex) {
		return false;
	}
	
	var inputError = false;
	
	// customer number
	var $customerNumber = $('#login_gbd_custnummer');
	if ($customerNumber.length > 0) {
		var customerNumberValue = $customerNumber.val();
		if (!custNumberRegex.test(customerNumberValue)) {
			inputError = true;
		} 
	} else {
		return false;
	}
		
	// birth day
	var $birthDay = $('#login_gbd_geb_tt');
	if ($birthDay.length > 0) {
		var birthDayValue = $birthDay.val();
		if (!birthDateDayRegex.test(birthDayValue)) {
			inputError = true;
		}
	} else {
		return false;
	}
		
	// birth month
	var $birthMonth = $('#login_gbd_geb_mm');
	if ($birthMonth.length > 0) {
		var birthMonthValue = $birthMonth.val(); 
		if (!birthDateMonthRegex.test(birthMonthValue)) {
			inputError = true;
		}
	} else {
		return false;
	}
	
	// birth year
	var $birthYear = $('#login_gbd_geb_jjjj');
	if ($birthYear.length > 0) {
		birthYearValue = $birthYear.val();
		if (!birthDateYearRegex.test(birthYearValue)) {
			inputError = true;
		}
	} else {
		return false;
	}
	
	if (inputError) {
		$('#loginNumberBirthdayError').html(LoginError.customerNumberAndBirthdayFormat);
		$('#loginNumberBirthdayError').show();
		return false;
	} else {
		return true;
	}
}

function validateCreateCustomerAccount() {
	$('#emailError').hide();
	$('#passwordError').hide();
	
	var inputError = false;
	var emailRegex = VALIDATE_RULES.email;
	var email = $('#logonId').val();

	if (!emailRegex.test(email)) {
		$('#emailError').html(LoginError.emailFormat);
		$('#emailError').show();
		inputError = true;
	}	
	
	var passwordRegex = VALIDATE_RULES.passwordRegister;
	if (passwordRegex) {
		var $login02 = $('#login02');
		var $login02repeat = $('#login02repeat');
		if ($login02.length > 0 && $login02repeat.length > 0) {
			if (!passwordRegex.test($login02.val())) {
				$('#passwordError').html(LoginError.logonPasswordLength);
				$('#passwordError').show();
				inputError = true;
			} else {
				if ($login02.val() != $login02repeat.val()) {
					$('#passwordError').html(LoginError.logonPasswordNEqual);
					$('#passwordError').show();
					inputError = true;
				}
			}
		}
	}
	if (!inputError) {
		$('#createCustomerAccount').submit();
	}
}

function openHeineCustomerFrame() {
	if ($('#tabL1').hasClass('active')) {
		$('#tabL1').removeClass('active');
		$('#tabL2').addClass('active');
		$('#txtLogin').hide();
		$('#txtNewCustomer').show();
	}
}

function removeDeliveryAddress(removeURL) {
	if (!$.i18n.containsBundles('desktop.myheine')) {
		$.i18n.init({
			requestedBundles : [ 'DESKTOP_MY_HEINE' ]
		});
	}
	check = confirm(unescape($.i18n.message('desktop.myheine', 'profile.address.remove.confirm')));
	if (check == true) {
		$.ajax({
		    url: removeURL,
		}).done(function() {
			location.reload();
		})
	}
}

function checkForDataChanges(formId) {
	var changedData = false;
	$('#' + formId + ' .changeCheck').each(function() {
		if ($(this).val() != $('#' + ($(this).attr('id') + '_old')).val()) {
			changedData = true;
		}
	});
	return changedData;
}

function resetMessages(formId) {
	$('#displayMessages').children().hide();
	$('#error-messages-js').children().hide();
	$('#' + formId + ' .formCol ').each(function() {
		if ($(this).hasClass('error')) {
			$(this).removeClass('error');
		}
	});	
}

function dataFormSubmit(formId) {
	resetMessages(formId);
	switch (formId) {
		case "PhoneDataForm":
			phoneDataSubmit(formId);
			break;
		case "AddressForm":
			addressDataSubmit(formId);
			break;
	}
}

function createCompletePhoneNumber(phonePreSelectionId, phoneNumberId) {
	if ($('#' + phonePreSelectionId).val().length > 0 && $('#' + phoneNumberId).val().length > 0) {
		return $('#' + phonePreSelectionId).val() + "/" + $('#' + phoneNumberId).val();
	} else {
	return null;
	}
}

function appendToForm(formId, attrType, attrName, attrValue) {
	$('<input>').attr({
		type:	attrType,
		name:	attrName,
		value:	attrValue
	}).appendTo('#' + formId);
}

function displayError(errorId) {
	$('#' + errorId).show();	
	$('#' + errorId).parent().show();
}

function phoneDataSubmit(formId) {	
	if (checkForDataChanges(formId)) {
		if (isNonStandardLayout == 'true') {
		
			var phone1Value = getAndNormalizePhoneNumber('#phone1');
			var mobile1Value = getAndNormalizePhoneNumber('#mobilePhone1');
			var fax1Value = getAndNormalizePhoneNumber('#fax1');
					
			if (validatePhoneNumber(phone1Value) && validatePhoneNumber(mobile1Value) && validatePhoneNumber(fax1Value)){
				$('form[name="AddressForm"]').submit();
			 }
			
		} else {
			$('#' + formId + ' .toNormalize').each(function() {
				var currentId = $(this).attr('id');
				var normalizedVal = getAndNormalizePhoneNumber('#' + currentId);
				if (($(this).attr('class')).match('phone')) {
					$('#' + currentId).val(normalizedVal);						
				}
			});
			var isValid = true;
			if (($('#phone_101_number').val().length == 0 && $('#phone_102_number').val().length != 0) ||
				($('#phone_101_number').val().length != 0 && $('#phone_102_number').val().length == 0)) {
				$('#phone_101_number').parent().addClass('error');
				displayError('error-invalidInput');
				isValid = false;
			}
			if (($('#phone_201_number').val().length == 0 && $('#phone_202_number').val().length != 0) ||
					($('#phone_201_number').val().length != 0 && $('#phone_202_number').val().length == 0)) {
				$('#phone_201_number').parent().addClass('error');
				displayError('error-invalidInput');
				isValid = false;
			}
			if (($('#fax_101_number').val().length == 0 && $('#fax_102_number').val().length != 0) ||
					($('#fax_101_number').val().length != 0 && $('#fax_102_number').val().length == 0)) {
				$('#fax_101_number').parent().addClass('error');
				displayError('error-invalidInput');
				isValid = false;
			}			
			
			if (isValid) {
				if (!validateInputById('phone_101_number', VALIDATE_RULES.fixedLinePhonePreSelection) || !validateInputById('phone_102_number', VALIDATE_RULES.fixedLinePhone)) {
					displayError('error-invalidChar');
					isValid = false;
				}
				if (!validateInputById('phone_201_number', VALIDATE_RULES.mobilePhonePreSelection) || !validateInputById('phone_202_number', VALIDATE_RULES.mobilePhone)) {
					displayError('error-invalidChar');
					isValid = false;
				}			
				if (!validateInputById('fax_101_number', VALIDATE_RULES.fixedLinePhonePreSelection) || !validateInputById('fax_102_number', VALIDATE_RULES.fixedLinePhone)) {
					displayError('error-invalidChar');
					isValid = false;
				}
				if (isValid) {
					var phone1Value = createCompletePhoneNumber('phone_101_number', 'phone_102_number');
					var mobile1Value = createCompletePhoneNumber('phone_201_number', 'phone_202_number');
					var fax1Value = createCompletePhoneNumber('fax_101_number', 'fax_102_number');	
					appendToForm(formId, 'hidden', 'phone1', phone1Value);
					appendToForm(formId, 'hidden', 'mobilePhone1', mobile1Value);
					appendToForm(formId, 'hidden', 'fax1', fax1Value);
					$('#PhoneDataForm').submit();					
				}
			}
		}
	};
}

function phoneDataFormSubmitted(preFormId) {
	var commitURL = $('a#phoneBtn').attr('href');
	
	$('#' + preFormId + ' .btGo').html($.i18n.message('desktop.myheine', 'profile.continue')).text();
	$('#' + preFormId + ' a#phoneBtn').attr('href', profileDetailsURL);

	$('#' + preFormId + ' .text').focus(function () {
		$('#' + preFormId + ' .btGo').html($.i18n.message('desktop.myheine', 'profile.savechanges')).text();
		$('#' + preFormId + ' a#phoneBtn').attr('href', commitURL);
	});
		
	$('#' + preFormId + ' .text').focusout(function () {
		if (checkForDataChanges(preFormId)) {
			$('#' + preFormId + ' .btGo').html($.i18n.message('desktop.myheine', 'profile.savechanges')).text();
			$('#' + preFormId + ' a#phoneBtn').attr('href', commitURL);
		} else {
			$('#' + preFormId + ' .btGo').html($.i18n.message('desktop.myheine', 'profile.continue')).text();
			$('#' + preFormId + ' a#phoneBtn').attr('href', profileDetailsURL);
		}
	});
}

function addressDataSubmit(formId) {
	if (checkForDataChanges(formId)) {
		validateMyHeineAddress();
	}
}