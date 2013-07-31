define(['can/control'], function(Control) {
	var Tooltip = can.Control({
		init: function( el, options ) {
			var offset = $(options.anchor).offset();
			el.appendTo(document.body)
				.offset( {
					left: offset.left,
					top: offset.top - 32
				}).animate({ opacity : 1 });
		},
		'{anchor} mouseleave': function( el, ev ) {
			this.element.remove();
		}
	});

	return Tooltip;
});