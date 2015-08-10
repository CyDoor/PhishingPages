/**
 * language chooser functions
 *
 * */

$jq(document).ready(function () {

    // move the language chooser into the footer
    $jq('div#footer-iconbar').before($jq('#language_chooser_container'));
    // show our language chooser
    $jq('#language_chooser_container').show();
});