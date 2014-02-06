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

	var Main = can.Control({
		init: function(el, ops) {
			this.favorites = new Commander.List();

			var self = this,
				deferred = Commander.findAll({});

			can.view('main.ejs', {
				commanders: deferred,
				favorites: this.favorites
			}).then(function(frag) {
				self.element.html(frag);
			});

			deferred.done(function(list) {
				self.reorder();
				self.on(list, 'change', 'reorder');
			});
		},

		reorder: function() {
			var rows = $(this.element.find('tr:gt(0)'));

			Array.prototype.sort.call(rows, function(a, b) {
				var rowA = $(a),
						rowB = $(b),
						modelA = rowA.data('commander'),
						modelB = rowB.data('commander');

				if(modelA.attr('votes') < modelB.attr('votes')) {
					rowA.before(rowB);

					return 1;
				}
				else if(modelB.attr('votes') < modelA.attr('votes')) {
					rowB.before(rowA);

					return -1;
				}

				return 0;
			});
		},

		'{Commander} updated': function() {
			this.reorder();
		},

		'.up click': function(el, ev) {
			var commander = el.closest('tr').data('commander');
			commander.attr('upvotes', commander.upvotes + 1).save();
		},

		'.down click': function(el, ev) {
			var commander = el.closest('tr').data('commander');
			commander.attr('downvotes', commander.downvotes + 1).save();
		},

		'.favorite click': function(el, ev) {
			this.favorites.push(el.closest('tr').data('commander'));
			el.remove();
		},

		'.delete click': function(el, ev) {
			el.closest('tr').data('commander').destroy();
		},

		'.photo mouseenter': function(el, ev){
			var commander = el.closest('tr').data('commander');

			new Tooltip($('<div class="tooltip alert"><div class="tooltip-arrow"></div>' +
				'<div class="tooltip-inner">' + commander.attr('name') + '</div></div>'), {
				anchor : el
			});
		}
	});

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

	new Main('#main');
})();
