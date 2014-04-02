(function() {
	var Commander = can.Model({
		findAll: 'GET /api/commanders',
		update: 'PUT /api/commanders/{id}',
		//for demo purposes, we're not actually destroying anything on the server
		destroy: function() {
			return new $.Deferred().resolve();
		},
		attributes: {
			upvotes: 'number',
			downvotes: 'number'
		}
	}, {
		votes: can.compute(function() {
			return this.attr('upvotes') - this.attr('downvotes');
		})
	});

	can.Component.extend({
		tag: 'commanders-list',
		template: can.view('main.mustache'),
		scope: {
			commanders: new Commander.List(),

			favorites: new Commander.List(),

			tooltipCommander: null,
			Commander: Commander,

			upvote: function(commander) {
				commander.attr('upvotes', commander.upvotes + 1).save();
			},

			downvote: function(commander) {
				commander.attr('downvotes', commander.downvotes + 1).save();
			},

			favorite: function(commander, el) {
				this.attr('favorites').push(commander);
				el.remove();
			},

			delete: function(commander) {
				commander.destroy();
			},

			mouseenter: function(commander) {
				this.attr('tooltipCommander', commander);
			},

			reorder: function() {
				var commanders = this.attr('commanders');

				commanders.comparator = 'votes';
				var sorted = commanders.sort().reverse();

				commanders.replace(can.makeArray(sorted));
			}
		},
		events: {
			'inserted': function() {
				console.log('inserted')
				var scope = this.scope;
				Commander.findAll({}, function(commanders) {
					scope.attr('commanders', commanders);
					scope.reorder();
				});
			},

			'{Commander} updated': function() {
				this.scope.reorder();
			}
		}
	});

	can.Component.extend({
		tag: 'commander-tooltip',
		template: can.view('tooltip.mustache'),
		scope: {},
		events: {
			'{scope} commander': function(o, ev, val, old) {
				console.log('show', arguments);
			}
		}
	});

	$('#main').html(can.view('app.mustache', {}));

	// 	'.photo mouseenter': function(el, ev){
	// 		var commander = el.closest('tr').data('commander');

	// 		new Tooltip($('<div class="tooltip alert"><div class="tooltip-arrow"></div>' +
	// 			'<div class="tooltip-inner">' + commander.attr('name') + '</div></div>'), {
	// 			anchor : el
	// 		});
	// 	}
	// });

	// var Tooltip = can.Control({
	// 	init: function( el, options ) {
	// 		var offset = $(options.anchor).offset();
	// 		el.appendTo(document.body)
	// 			.offset( {
	// 				left: offset.left,
	// 				top: offset.top - 32
	// 			}).animate({ opacity : 1 });
	// 	},
	// 	'{anchor} mouseleave': function( el, ev ) {
	// 		this.element.remove();
	// 	}
	// });
})();
