hei.widget("hei.cl.widgets.flaplist", {onDemand:true}, function () {
    var loc = window.location.hash;
    var hash = $(loc);
    if(hash){
       hash.addClass('open').next('dd').addClass('open');
    }
    
    hei.on("click", "a.js_infolayer#invalidLink", function (e) {
		var loc = $(this).attr('href');
		e.preventDefault();
        $.ajax({
            type:'GET',
            url: loc,
            cache: false,
            async: false,
            success: function(data){
                hei.cl.widgets.dialog.layer(data,'infoLayer');
            }
        });
	});

	hei.on("click", "dl dd a.js_infolayer", function (e) {
		var loc = $(this).attr('href');
		e.preventDefault();
        $.ajax({
            type:'GET',
            url: loc,
            cache: false,
            async: false,
            success: function(data){
                hei.cl.widgets.dialog.layer(data,'infoLayer');
            }
        });
	});

    hei.on("click", "dl.js_flaplist dd a", function () {
        var hash = $(this).attr('href');
        var prevElement = $(this).closest('dd').prev('dt');
        if(hash != null){
        	$(prevElement).toggleClass("open").next('dd').toggleClass('open');
        	$('dt' + hash).addClass("open").next('dd').addClass("open"); 	
        }
    });

    
    hei.on("click", "dl.js_flaplist dt", function (e) {
    	e.preventDefault();
    	$(this).toggleClass("open").next('dd').toggleClass('open');
    	var clickedElement = $(this);
    	$('dl.js_flaplist dt').not(clickedElement).each(function() {
    		if ($(this).hasClass('open')) {
    			$(this).toggleClass("open").next('dd').toggleClass('open');    
    		}
    	})
    })
    

    $("select.js_quicknav").change(function () {
        var val = $(this).val();
        window.location.hash = val;
        var hash = $(val);
        if(hash){
           hash.addClass('open').next('dd').addClass('open');
           $(this).children('option').filter(':first').attr('selected','selected');
        }
    });

})
