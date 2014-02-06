define(['can/control',
	'can/view/ejs',
	'can/view/modifiers',
	'tooltip',
	'commander'],
function(Control, view, modifiers, Tooltip, Commander) {
	var Main = can.Control.extend({
		init: function(el, ops) {
			var self = this,
				deferred = Commander.findAll({});

			this.element.html(can.view('main.ejs', {
				commanders: deferred
			}));

			deferred.done(function(list) {
				self.reorder();
			});
		},

		reorder : function() {
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

		'.sort click' : function() {
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

		'.photo mouseenter': function(el, ev){
			var commander = el.closest('tr').data('commander');

			new Tooltip($('<div class="tooltip alert"><div class="tooltip-arrow"></div>' +
				'<div class="tooltip-inner">' + commander.attr('name') + '</div></div>'), {
				anchor: el
			});
		}
	});

	return Main;
});