
/**
 * This locale: de_DE
 * 
 * The encoding of this file is UTF-8
 * 
 * Specifies Validation rules for input fields.
 * Values are regular expressions.
 */
var VALIDATE_RULES = {
		"address1" : /^[0-9a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´`\.]+[0-9a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´` -\.]*$/, // street
		"address2" : /(^[0-9a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´`\-\.]+[0-9a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´` -\.]*$)|(^$)/,
		"birthdayDay" : /^(0+[1-9]|[12][0-9]|3[01])$/,
		"birthdayMonth" : /^(0+[1-9]|1[012])$/,
		"birthdayYear" : /^\d{4}$/,
		"bonusNumber" : /^(([0-9A-Z]{12})|(^[0-9]{5}))$/g,
		"city" : /^[a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´`]+[a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´` -]*$/,
		"customerNumber" : /^[0-9]{6,}$/,
		"email" : /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.([a-zA-Z]){2,4})$/,
		"employeePhone" : /^[0-9]{4}$/,
		"demail" : /(@[a-zA-Z-\.]*epost\.de$|\.de-mail\.de$|@[a-zA-Z-\.]*post\.de$)/i,
		"firstName" : /^[a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´`]+[a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´` -]*$/,
		"fixedLinePhonePreSelection" : /^[0-9]{0,10}$/,
		"fixedLinePhone" : /^[0-9]{0,14}$/,
		"houseNumber" : /^[0-9\s\/a-zA-Z-]{1,}$/,
		"lastName" : /^[a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´`]+[a-zA-ZÄäÖöÜüßÁáÚúÓóÍíÉéÀàÙùÒòÌìÈèÂâÛûÔôÎîÊêÇçşỏčñøò'´` -]*$/,
		"birthName" : '',
		"mobilePhonePreSelection" : /^[0-9]{0,10}$/,
		"mobilePhone" : /^[0-9]{0,14}$/,
		"packstation" : /packstation|pack station|Postfiliale/i,
		"passwordLogin" : /.+/,
		"passwordRegister" : /^.{6,12}$/,
		"phone" : '',
		"phonePreselectionPrefix" : /^00/,
		"pobBlockedWords" : /Packstation|Postfiliale/i,
		"postBox" : '',
		"simpleDigit" : /\d/,
		"title" : /.+/,
		"zipCode" : /^[0-9]{5}$/,
		"articleNumber" : /^[a-zA-Z0-9\s]{0,15}$/
};