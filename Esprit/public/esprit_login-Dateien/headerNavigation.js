/**
 * Resort flyout menu elements
 */
NWS_WS.flyoutResort = function () {
    /* SALE flyout resort
     *****************************************************************************************************************/
    NWS_WS.flyoutResortSale(
        $jq('#menu-1758'),
        $jq('#menu-1759'),
        $jq('#menu-1874'),
        $jq('#menu-1873'),
        $jq('#menu-294')
    );

    /* SOLDES FR flyout resort
     *****************************************************************************************************************/
    NWS_WS.flyoutResortSale(
        $jq('#menu-5086'),
        $jq('#menu-5164'),
        $jq('#menu-5210'),
        $jq('#menu-5205'),
        $jq('#menu-5243')
    );

    /* BONNES AFFAIRES FR flyout resort
     *****************************************************************************************************************/
    NWS_WS.flyoutResortSale(
        $jq('#menu-5858'),
        $jq('#menu-5945'),
        $jq('#menu-5983'),
        $jq('#menu-5977'),
        $jq('#menu-6013')
    );
};

// checks if submenu of shoes exists, then removes the clothes link and the shoes submenu
NWS_WS.removeClothesLinkAndShoesSubmenu = function ($clothes, $shoes) {
    if ($shoes.next('ul').length !== 0) {
        // remove WOMEN - BEKLEIDUNG link
        $clothes.remove();
        // insert a new line before WOMEN - SCHUHE & ACC. and remove it's submenu
        $shoes.prepend('<br />').next().remove();
    }
};
// resorts SALE women and men columns and removes kids submenu
NWS_WS.flyoutResortSale = function ($womenClothes, $womenShoes, $menClothes, $menShoes, $kids) {
    NWS_WS.removeClothesLinkAndShoesSubmenu($womenClothes, $womenShoes);
    NWS_WS.removeClothesLinkAndShoesSubmenu($menClothes, $menShoes);
    // remove SALE - KIDS submenu
    $kids.parent().find('ul.topnavi-level-4').remove();
};


/**
 * Initialize Header Submenu functionality
 *
 * return void
 */
NWS_WS.inFlyout = false;
NWS_WS.initHeaderSubmenu = function () {
    // get all flyouts
    var flyouts = $jq('#header-menu .mainmenu ul.topnavi-level-2');

    // do not run through this function if no flyout exists
    if (flyouts.length === 0) {
        return;
    }

    NWS_WS.flyoutResort();

    $jq(flyouts).each(function () {
        $jq(this).width(1200);

        var boxes;
        var boxHeight = 0;
        var flyoutHeight = 0;
        var allBoxesWidth = 0;

        // get all available boxes
        boxes = $jq('li.level-2', this);

        // get max height of available boxes and sum of all boxes width
        $jq(boxes).each(function () {
            // remove the last bottom margin
            if (!$jq('li.level-3.topnavi-lastchild:last', this).parent().next().length > 0) {
                $jq('li.level-3.topnavi-lastchild:last', this).css('margin-bottom', '0');
            }

            // get max box height
            var currentHeight = $jq(this).height();
            if (currentHeight > boxHeight) {
                boxHeight = currentHeight;
                flyoutHeight = $jq(this).outerHeight();
            }

            // sum boxes width
            allBoxesWidth += $jq(this).outerWidth(true);
        });

        // adjust height all boxes box
        $jq(boxes).css('height', boxHeight + 'px');

        // adjust the parent box height
        $jq(this).css('height', flyoutHeight + 'px');

        // adjust width of parent box
        $jq(this).width(allBoxesWidth);

        // hide this flyout
        $jq(this).hide();
    });

    // prevent main menu click for mobile devices on first click
    NWS_WS.clickedId = '';
    if ($jq('body').hasClass('mobile')) {
        $jq('#header-menu li.level-1').click(function (event) {
            if (NWS_WS.clickedId != $jq('a:first', this).attr('id')) {
                event.preventDefault();
            }
            NWS_WS.clickedId = $jq('a:first', this).attr('id');
        });
    }

    // set hover effect on topnavi to show flyout menu
    $jq('#header-menu li.level-1')
        .mouseenter(function () {
            var that = this;
            NWS_WS.removeFlyout();
            if (!$jq('body').hasClass('mobile')) {
                $jq('#header-menu').stopTime('showTopNavi').oneTime(500,
                    'showTopNavi', function () {
                        NWS_WS.showFlyout(that);
                    });
            } else {
                NWS_WS.showFlyout(that);
            }
        })
        .mouseleave(function () {
            $jq('#header-menu')
                .stopTime('showTopNavi')
                .stopTime('showFlyout')
                .oneTime(200, 'showFlyout', function () {
                    if (!NWS_WS.inFlyout) {
                        NWS_WS.removeFlyout();
                    }
                });
        });
};

NWS_WS.showFlyout = function (that) {
    var flyoutTopPositionOffset = 6;
    var flyoutContent = $jq('.flyout', that).clone().show();
    var flyout = $jq('<div id="flyout" class="font-georgia-italic">');

    var $menu = $jq('#header-menu');
    var menuOffset = $menu.offset();
    var menuPos = menuOffset.left;
    var menuBottom = $menu.height() + menuOffset.top - flyoutTopPositionOffset;

    var elemOffset = $jq(that).offset();
    var elemWidth = $jq(that).width();
    var elemPos = elemOffset.left + elemWidth;

    var flyoutWidth = flyoutContent.outerWidth();
    var flyoutPos = menuPos + flyoutWidth;
    var flyoutOffset;

    if (flyoutPos > elemPos) {
        flyoutOffset = menuPos;
    } else {
        flyoutOffset = menuPos + (elemPos - flyoutPos);
    }

    $jq('body').append(flyout);
    flyout.append(flyoutContent).css({
        'left' : flyoutOffset + 'px',
        'top' : menuBottom + 'px'
    });

    $jq('a:first', this).toggleClass('active');

    flyout
        .bind('mouseenter', function () {
            window.clearTimeout(window.FlyoutTime);
            flyout.stopTime('removeFlyout');
            NWS_WS.inFlyout = true;
            $jq('#header-menu').stopTime('showFlyout');
        })
        .bind('mouseleave', function () {
            window.FlyoutTime = setTimeout("NWS_WS.removeFlyout()", 200);
        });
};

NWS_WS.removeFlyout = function () {
    NWS_WS.inFlyout = false;
    $jq('#header-menu').stopTime('showFlyout');
    $jq('#flyout').remove();
    $jq('#header-menu li.level-1 a').removeClass('active');
};

jQuery(document).ready(function () {
    if (typeof NWS_WS.arrJshelper["hide_flyout"] == "undefined" || !NWS_WS.arrJshelper["hide_flyout"]) {
        NWS_WS.initHeaderSubmenu();
    }
});
