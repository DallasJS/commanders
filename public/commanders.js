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
			anchor: null,
			showTooltip: false,

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

			mouseenter: function(commander, el) {
				this.attr('anchor', el);
				this.attr('tooltipCommander', commander);
				this.attr('showTooltip', true);
			},

			mouseleave: function() {
				this.attr('showTooltip', false);
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
		events: {
			'{scope} showtooltip': function(o, ev, val, old) {
				if(val) {
					var offset = $(this.scope.anchor).offset();

					this.element.offset({
						left: offset.left + 100,
						top: offset.top
					})
					.animate({ opacity: 1 }, 100);
				}
				else {
					this.element.animate({ opacity: 0 }, 100);;
				}
			}
		}
	});

	$('#main').html(can.view('app.mustache', {}));
})();
