/**
 * Created by NETRADA Europe on 23.01.14.
 */


jQuery(function()
{
    $jq.policyLibrary =
    {
        getPolicySetting : function()
        {
            return $jq.cookie('policy');
        },

        setPolicySetting : function(policyValue)
        {
            $jq.cookie(
                'policy',
                policyValue,
                { expires:5000, path: '/' }
            );
        }
    };

    if ($jq.policyLibrary.getPolicySetting() == null)
    {
        $jq.policyLibrary.setPolicySetting('1');
        $jq('#policy_header').show();
        $jq('body').css('margin-top', '0px');
        $jq('.globallayer_close_text').click(function(){
            $jq('#policy_header').hide();
        });
    }
});
