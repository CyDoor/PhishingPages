/********************************************************************************
 **    External Links
 *********************************************************************************/

$jq('a[rel="external"]').live('click', function () {
    window.open(this.href);
    return false;
});

/********************************************************************************
 **    External PayPal
 *********************************************************************************/

$jq("a[rel=external_paypal]").live('click', function () {
    window.open($jq(this).attr('href'), "PayPal", "width=800,height=500");

    return false;
});


/********************************************************************************
 **    Benefit Bar
 *********************************************************************************/

NWS_WS.openBenefitLayer = function (objThis) {
    var strId = objThis.attr('id');
    var strLayerId = '#' + strId + '_text';
    var layer = $jq(strLayerId);
    var position = objThis.position();
    var positionParent = objThis.parent().position();

    var intPosTop = position.top - layer.height() - 23;
    var intPosLeft = position.left;

    var intParentWidth = objThis.parent().width();

    var intParentPosLeft = positionParent.left;
    var intParentPosRight = positionParent.left + intParentWidth;

    var intLayerWidth = layer.width();
    var intWidth = objThis.width();

    // center layer
    intPosLeft = (intPosLeft - intLayerWidth / 2) + intWidth / 2;

    // don't center first layer
    intPosLeft = intPosLeft < intParentPosLeft ? position.left : intPosLeft;

    // reposition last layer
    if (intPosLeft + intLayerWidth > intParentWidth + intParentPosLeft) {
        intDiff = (intPosLeft + intLayerWidth) - (intParentWidth + intParentPosLeft);
        intPosLeft = intPosLeft - intDiff - 20;
    }

    layer.css({
        'top': intPosTop + 'px',
        'left': intPosLeft + 'px'
    });

    layer.show();
};

var boolUserOnBenefitInfo = false;
var boolUserOnBenefitText = false;

NWS_WS.closeBenefitLayer = function (strLayerId) {
    $jq(strLayerId).hide();
};

$jq('#benefitbar-headers > li').live('mouseenter', function () {
    // hide all layers
    $jq('#benefitbar-layer').children().each(function () {
        $jq(this).hide();
    });

    boolUserOnBenefitText = true;
    boolUserOnBenefitInfo = false;
    NWS_WS.openBenefitLayer($jq(this));
});

$jq('#benefitbar-layer > .dropdown_img_container_open').live('mouseenter', function () {
    boolUserOnBenefitText = false;
    boolUserOnBenefitInfo = true;
});

$jq('#benefitbar-layer > .dropdown_img_container_open').live('mouseleave', function () {
    NWS_WS.closeBenefitLayer('#' + $jq(this).attr('id'));
});

$jq('#benefitbar-headers > li').live('mouseleave', function () {
    boolUserOnBenefitText = false;
    var objThis = $jq(this);
    $jq(document).oneTime(500, function () {
        if (!boolUserOnBenefitInfo && !boolUserOnBenefitText) {
            NWS_WS.closeBenefitLayer('#' + objThis.attr('id') + '_text');
        }
    });
});

jQuery(document).ready(function () {
    //show backtomobile-link if cookie exists
    if ($jq.cookie('mobile') == "2") {
        $jq('#footer-backtomobile').show();
    }

    //if exists set link for backtomobile
    $jq('#footer-backtomobile').click(function () {
        // ESPMOB-33: display loading image with faded out content while loading the request and the mobile shop
        var strLodingImageUrl = NWS_WS.arrJshelper["local_picpath_nolang"] !== undefined
            ? NWS_WS.arrJshelper["local_picpath_nolang"] + '/loader.gif'
            : NWS_WS.arrJshelper["localpicpath_nolang"] + '/loader.gif';
        var loadingImage = '<img src="' + strLodingImageUrl + '" alt="loading" />';
        $jq('body').jNetradaGloballayer({
            strContentToDisplay: loadingImage,
            intWidth: 32,
            intHeight: 32,
            boolCloseOnEsc: false,
            boolShowCloser: false
        });

        $jq.ajax({
            url: NWS_WS.strBaseUrl + 'httprequest/backtomobile/?' + NWS_WS.ajaxGetParamLanguage,
            async: true,
            success: function () {
                location.reload();
            }
        });
    });
});

NWS_WS.loadStoreFinder = function () {
    $jq('body').jNetradaGloballayer(
        {
            'strPartialName': 'storefinder',
            'intWidth': 960,
            'intHeight': 600,
            'fltOpacity': 0.5,
            'boolOpenPopup': false,
            'strGlobalLayerType': 'footerstorefinder'
        });
};
