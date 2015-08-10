hei.namespace("hei.cl", function() {
    
    var req = null;
    
    // Singleton representing the current page
    this.Page = {
        needs: function (capability) {
            if(req == null) {
                req = {};
                if (typeof($("body").attr("class"))!="undefined")
                {
		           var classes = $("body").attr("class").split(/\s+/);
		           for(var i = 0; i < classes.length; ++i) 
		           {
		               req[classes[i]] = true;
		           }
                }
            }
            
            return req[capability] || false
        },
        
        controllers: [],
        widgets: []
    }
})