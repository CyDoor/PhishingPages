/*hv_content_no_tloc/../default*/
/* Version 12.07.07 */

////////////////////////////////////////////////////////////////////////
// AGNITAS SHOPMESSUNGS-LANDMARKS
//////////////////////////////////////////////////////////////////////// 
 
// functions for Agnitas Shopmessung
var AgnLMArrLen = 10;
var AgnLMimg = new Array(AgnLMArrLen);
var AgnLMArrPos = 0;

function setAgnitasLM(action, pagetag, attributes) {
	AgnLMimg[AgnLMArrPos] = new Image();
	var URL = "https://www.ssl-einkaufen.de/g.do?action=" + action + "&ci=14&pagetag=" + pagetag;
	if (attributes) {
		URL = URL + attributes;
	}
	AgnLMimg[AgnLMArrPos++].src = URL;
	if (AgnLMArrPos == AgnLMArrLen) {
		AgnLMArrPos = 0;
	}
	//alert( "Lm set: " + URL );
}
// Ende: functions for Agnitas Shopmessung 