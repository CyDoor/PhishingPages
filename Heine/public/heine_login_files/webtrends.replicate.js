/*
    Copyright (c) 2013 Webtrends, Inc.
    Multiply Hit Plugin v10.2.87
  
    An example of including the plugin with your tag.
  
    <script type="text/javascript">
    // async loader function, called by webtrends.js after load
    window.webtrendsAsyncInit=function(){
        var dcs=new Webtrends.dcs().init({
            dcsid:"YOUR_WEBTRENDS_DCSID_HERE",
            timezone:YOUR_TIMEZONE_HERE,
            plugins:{
                replicate:{ 
					src:"webtrends.replicate.js", 
					servers:[
						{
							domain:	"scs.webtrends.com",
							dcsid:	"YOUR DCSID HERE"		//This is optional, if not present, the dcsid of the base tag will be used
						}
					],
					callbackTimeout: 200					//This is optional, if not present the base tags dcsdelay value will be used.
				}
            }
            }).track();
    };
    (function(){
        var s=document.createElement("script"); s.async=true; s.src="webtrends.js";    
        var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
    }());
    </script>

    This plugin will result in all hits from the base tag also being sent to the specified collection servers with the specified dcsids.
*/

(function () {

    WebtrendsReplicate = function (tag, plugin) {
		
		this.servers = [];
		this.dcs = tag;
		this.requestGroupTimeout = (plugin.callbackTimeout) ? (plugin.callbackTimeout) : Webtrends.dcsdelay;
		
		//Nothing to do
		if (!plugin.servers) {
			return;
		}
		
		//Copy servers from plugin configuration and set dcsid if doesn't exist
		for (var n=0; n < plugin.servers.length; n++) {
			if (plugin.servers[n].domain) {
				var dcsid = plugin.servers[n].dcsid ? plugin.servers[n].dcsid : tag.dcsid;
				this.servers.push({server:plugin.servers[n].domain, dcsid:dcsid});
			}
		}
	}
	
	WebtrendsReplicate.prototype = {
		addHitReplicator: function() {
			var self = this;
			Webtrends.addTransform(
				function(dcs, options) { 
				
					var rep = new requestReplicator(self.servers, self.requestGroupTimeout);
					options.callback = rep.getCallback(dcs, options, options.callback);
					
					var origFinish = options.finish;
					options.finish = function(dcs, options) {
						if (dcs.images.length > 0){  //check for image size of 0 due to Opt out cookie
							rep.finish(dcs, options);
						}
						
						if (typeof(origFinish) == "function")
							origFinish(dcs, options);
					}
				},
				"all",
				this.dcs
			);
		}
	}
		
	requestReplicator = function(servers, timeout) {
		
		this.servers = servers;
		this.requestCount = 0;
		this.origCallback;
		this.callbackTimedOut = false;
		this.timeout = timeout;
		
		var self = this;
		
		this.finish = function(dcs, options) {
		
			//replicate the requests
			this.requestCount++;				//One for the base tag request
			var src = dcs.images[dcs.images.length - 1].src;
			var query = src.substr(src.indexOf("?") + 1);
			if (query) {
				//iterate over the servers we should replicate and send
				for (var n = 0; n < self.servers.length; n++) {
					this.requestCount++;
					replicatedServer = self.servers[n];
					var repSrc = "http" + (location.protocol.indexOf('https:') == 0 ? 's' : '') + "://"; 
					repSrc += replicatedServer.server + "/" + replicatedServer.dcsid + "/dcs.gif?" + query;
					
					if (document.images) {
						var img = new Image();
						img.onload = function() {
							self.requestCount--;
							self.checkDone(dcs, options);
						}
						img.src = repSrc;
					}
				}
			}
			
			//call the original finish
			if (typeof(origFinish) == "function")
				origFinish();
			
			//Set a timeout to prevent a broken/invalid collection server from holding up the callback
			self.requestTimeout = window.setTimeout( 
				function() { 
					self.callbackTimedOut=true;
					if (typeof(self.origCallback) == "function")
						self.origCallback(dcs, options); 
				}, 
				self.timeout
			)
		}
		
		this.getCallback = function(dcs, options, origCallback) {
			this.origCallback = origCallback;
			return function(dcs, options) {
				self.requestCount--;
				self.checkDone(dcs, options);
			}
		}
		
		this.checkDone = function(dcs, options) {
			if (this.requestCount == 0 && typeof(this.origCallback) == "function" && !this.callbackTimedOut) {
				window.clearTimeout(this.requestTimeout);
				if (typeof(this.origCallback) == "function")
					this.origCallback(dcs, options);
			}
		}
	
	}
	
})();

var replicate_loader = function (tag, plugin) {

    var replicate = new WebtrendsReplicate(tag, plugin);
	replicate.addHitReplicator();

}

Webtrends.registerPlugin('replicate', replicate_loader);