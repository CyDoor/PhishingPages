if (typeof NWS_WS == 'undefined') {
    var NWS_WS = (function () {
        return {};
    }());
}

/**
 * Get current browser type and version and set identification class to <body>
 * for header and footer delivery, this file must be delivered in both requests
 *
 * @return void
 */
NWS_WS.setBrowserIdentificationClass = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    $jq.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    var version = 0;

    // is this a version of IE?
    if ($jq.browser.msie || userAgent.indexOf("trident") > 0) {
        userAgent = $jq.browser.version;
        userAgent = userAgent.split('.');
        version = 'ie ie' + userAgent[0];
    }

    // is this a version of Chrome?
    if ($jq.browser.chrome) {
        userAgent = userAgent.substring(userAgent.indexOf('chrome/') + 7);
        version = 'gch';
        // If it is chrome then jQuery thinks it's safari so we have to tell it it isn't
        $jq.browser.safari = false;
    }

    // is this a version of Safari?
    if ($jq.browser.safari) {
        userAgent = userAgent.substring(userAgent.indexOf('safari/') + 7);
        version = 'saf';
        if (navigator.userAgent.indexOf('Mobile/') > 0) {
            version += ' mobile';
        }
    }

    // is this a version of Mozilla?
    if ($jq.browser.mozilla && navigator.userAgent.toLowerCase().indexOf("trident") === -1) {
        //Is it Firefox?
        if (navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
            userAgent = userAgent.substring(userAgent.indexOf('firefox/') + 8);
            userAgent = userAgent.split('.');
            version = 'ff ff' + userAgent[0] + userAgent[1];
        } else { // if not then it must be another Mozilla
            version = 'ff';
        }
    }

    // is this a version of Opera?
    if ($jq.browser.opera) {
        userAgent = userAgent.substring(userAgent.indexOf('version/') + 8);
        userAgent = userAgent.substring(0, userAgent.indexOf('.'));
        version = 'op';
    }

    //write userAgent and version to body
    $jq('body').removeClass('ie7').addClass(version);
};

// Document is ready
jQuery(function () {
    // write userAgent and version to body
    NWS_WS.setBrowserIdentificationClass();
});
