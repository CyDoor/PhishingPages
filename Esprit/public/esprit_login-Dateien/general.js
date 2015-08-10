var pageLoaded = false;
$jq(document).ready(function () {

    // make all selects to selectpickers
    $jq('select').selectpicker({size: false});

    var container = $jq(':checkbox.checkall').parents('table');
    var checkall = container.find(':checkbox.checkall');
    var checkboxes = container.find(':checkbox:not(.checkall)');
    var complete = ['','1','2','3','4','5','6','7','8'];
    var partial = ['','9','10','11','12','13','7','8'];
    var reasonRelevantOptions = ['1', '7', '10', '12'];
    var reason = $jq('#reason_text');

    $jq.fn.cancelarticles =
    {
        shallAdditionalReasonBeShown : function()
        {
            if ($jq.inArray($jq('select#reason').val(), reasonRelevantOptions) !== -1) {
                return true;
            }
            return false;
        },

        showReason : function()
        {
            reason.show();
        },

        hideReason : function()
        {
            reason.val('').hide();
        }
    };

    checkall.change(function(event) {
        if ($jq(event.target).is(':checked')) {
            checkboxes.prop('checked', true);
        } else {
            checkboxes.prop('checked', false);
        }
        updateSelect(complete);

        checkboxes.parents('tr').removeClass('checked');
        checkboxes.filter(':checked').parents('tr').addClass('checked');
    });

    checkboxes.change(function(event) {
        if (checkboxes.filter(':checked').length == checkboxes.length) {
            checkall.prop('checked', true);
            updateSelect(complete);
        } else if (checkboxes.filter(':checked').length == 0) {
            updateSelect(complete);
        } else {
            checkall.prop('checked', false);
            updateSelect(partial);
        }

        checkboxes.parents('tr').removeClass('checked');
        checkboxes.filter(':checked').parents('tr').addClass('checked');
    });

    function updateSelect(allowed) {
        var select = $jq('select#reason');

        select.find('option').each(function(i, e) {
            e = $jq(e);
            if ($jq.inArray(e.val(), allowed) > -1) {
                e.attr("disabled", false);
            } else {
                e.attr("disabled", true);
            }
        });

        var disabledselected = select.find(':selected:disabled');

        if (disabledselected.length > 0) {
            disabledselected.removeAttr('selected');
            select.find(':not(:disabled):first').attr('selected','selected');
        }

        $jq('select').selectpicker('refresh');
    }
    
    updateSelect(complete);

    $jq('select#reason').on('change', function(e) {
        if($jq.fn.cancelarticles.shallAdditionalReasonBeShown()) {
            $jq.fn.cancelarticles.showReason();
        } else {
            $jq.fn.cancelarticles.hideReason();
        }
    });

    $jq('input, textarea').placeholder();
    
    // toggle placeholder text on focus and focusout
    $jq('[placeholder!=""]').focus(function(){
        var tempText = $jq(this).attr('placeholder');
        $jq(this).attr('placeholder', '');
        $jq(this).focusout(function(){
            $jq(this).attr('placeholder', tempText);
        });
    });

    $jq('.focus').each(function(i, e){
        if($jq(e).val() == '') {
            $jq(e).focus();
            return false;
        }
    });

    pageLoaded = true;
});