(function($){
    $.clickableTable = function(el){
        var base = this;

        base.$el = $(el);
        base.el = el;

        base.$el.data("clickableTable", base);


        base.init = function(){
            base.linkedRows = base.$el.find('tr[data-link]');
            base.hoveredRows = base.$el.find('tr.clickable:not([data-link])');

            base.wrapRows(base.linkedRows, true);
            base.wrapRows(base.hoveredRows);
        };

        base.wrapRows = function(rows, linked) {

            linked = typeof linked !== 'undefined' ? linked : false;


            rows.each(function(ri, row) {
                row = $(row);
                var cells = row.find('td:not(.nowrap)');
                var link = row.data('link');

                var wrap = linked ? $('<a href="'+link+'"></a>') : $('<div></div>');

                cells.each(function(ci, cell) {
                    cell = $(cell);
                    cell.wrapInner(wrap);
                    cell.addClass('wrapped');
                });
            });
        };



        base.init();
    };

    $.fn.clickablesTable = function() {
        return this.each(function() {
            (new $.clickableTable(this));
        });
    };

    $(function() {
        $('table.linked-rows').clickablesTable();
    });
})(jQuery);