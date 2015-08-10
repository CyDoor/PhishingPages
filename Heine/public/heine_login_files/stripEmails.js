
(function(Webtrends) {

	Webtrends.registerPlugin("stripEmails", function (tag, options) {

		options = options || {};
		var pathDelimiter = options.pathDelimiter || "/"
		var queryDelimiter = options.queryDelimiter || "&"

		var regex = /[a-z0-9_.+-]+(@|\%40|\%2540)[a-z0-9-]+/ig

		tag.addTransform(function(tag) {

			if (regex.test(window.location.pathname)) {
				tag['DCS'].dcsuri = window.location.pathname.replace(regex, "xxx@xxx");
			}

			if (regex.test(window.location.search)) {
				tag['DCS'].dcsqry = window.location.search.replace(regex, "xxx@xxx");
			}

			if (regex.test(document.referrer)) {
				tag['DCS'].dcsref = document.referrer.replace(regex, "xxx@xxx");
			}


		}, "all", tag);

	})

})(Webtrends);
