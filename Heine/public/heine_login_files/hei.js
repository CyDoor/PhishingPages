(function() {

    var shortName = function (name) {
        var parts = name.split(".");
        return parts[parts.length-1]
    }

    var Namespace = function(name) { this.name = name; }
    Namespace.prototype = {
        toString: function () { return this.name; }
    }
    var hei = new Namespace("hei");
    window.HEINE = hei

    // lege einen Namespace mit dem Namen @name an. Dieser darf Punkte "." enthalten
    // Als Parameter func muss eine function übergeben werden in der die Elemente
    // des Namespaces definiert werden. Beispiel:
    /**
    * bf.namespace("bf.cl.booking", function () {
    *      this.myFunction = function () {
    *          ...
    *      }
    * })
    */
    hei.namespace = function(name, func) {
        var parts = name.split(".");
        var ns = hei;

        var partName = "hei";
        for (var i = 1; i < parts.length; i++) {
            var part = parts[i];
            partName += part;
            if (ns[part] == null) {
                ns[part] = new Namespace(partName);
            }
            ns = ns[part];
        }
        func.call(ns, ns);
        return ns
    };

    // Declare a widget. If it defines a ready method the widget will be called upon doc ready
    hei.widget = function (name, opts, func) {
        if(!opts.onDemand || hei.cl.Page.needs(shortName(name))) {
            var ns = this.namespace(name, func);
            if(ns.ready) {
                jQuery(function () {
                    hei.cl.Page.widgets.push(ns);
                    ns.ready.call(ns)
                })
            }
        }
    }

    // publish a custom event
    hei.publish = function (topic, data) {
        topic = "hei:" + topic
		$(document).trigger(topic, [data])
	}

	// subscribe to a given topic
    hei.subscribe = function (topic, func) {
		var self = this;
		topic = "hei:" + topic
		if(!func.displayName) func.displayName = "EventHandler$"+topic
		$(document).bind(topic, function observe (e, data) {
			func.call(self, data)
		})
	}

	// bind a jQuery live event
	hei.on = function (event, selector,  handler) {
	    $(selector).on(event, handler)
	}

	// show a lightbox-style alert box
	hei.alert = function (msg, options) {
	    if(!options) {
	        options = {};
	    }
	    if(!options.raw) {
	        msg = hei.i18n(msg);
        }
	    hei.cl.widgets.dialog.alert(msg, options)
	}

	// show a lightbox-style alert box
	hei.flashInfo = function (data, options) {
	    if(!options) {
	        options = {};
	    }
	    hei.cl.widgets.flashInfo.showMessage(data, options)
	}

	hei.i18n = function () {
	    return hei.cl.util.Text.get.apply(hei.util.Text, arguments);
	}

	var gData;
	hei.globalData = function (key){
	    if(!gData) gData = hei.cl.util.JSONData.getAll("script[type=text/x-json-data-js_globalData]");
	    if(!( key in gData )) {
	        throw "Cannot find global data "+key
	    }
	    return gData[key]
	}

	var timeouts = {};
	hei.doOnceInTimeout = function (id, fn, timeout){
	    if(timeouts[id]) clearTimeout(timeouts[id])
	    if(timeout == null) timeout = 0;
	    timeouts[id] = setTimeout(fn, timeout)
	};

	//jQuery.browser.msie6 = jQuery.browser.msie && jQuery.browser.version.substr(0,1) == "6";

	// hier darf niemand außer Malte weitere Funktionen rein schreiben!

})()

var hei = window.HEINE;