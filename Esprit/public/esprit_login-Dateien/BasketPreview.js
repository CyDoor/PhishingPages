/**
 * class for showing the basket preview
 *
 * @author [pl]
 * @version 1.0
 *
 * @access public
 * @param Object
 *            (config Object)
 * @function writePreview
 * @returns Object (BasketPreview)
 */
function BasketPreview(configObject) {
    /*
     * configuration Object with HTML element IDs and language @var Object
     */
    var config = configObject;

    /**
     * writes the basket preview
     *
     * @access public
     * @param integer (items)
     * @param string (price with currency symbol)
     * @param function (callback function, optional)
     * @return void
     */
    this.writePreview = function (items, price, callback) {
        // set items and price
        $jq('#' + config.itemsCountElementId).text(items).show();
        $jq('#' + config.itemPriceElementId).html('<span class="header_seperation_basket">&nbsp;|&nbsp;</span>'+price).show();
        // call the callback if it has been passed
        $jq.isFunction(callback) && callback.call(this);
    };
}

$jq(document).ready(function () {
    if (typeof basketPreviewConfig !== 'undefined') {
        NWS_WS.basketPreview = new BasketPreview(basketPreviewConfig);
    }
});

