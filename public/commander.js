define(['can/model', 'can/map/attributes', 'can/compute'], function(Model) {
	var Commander = can.Model({
		findAll: 'GET /api/commanders',
		findOne: 'GET /api/commanders/{id}',
		create: 'POST /api/commanders',
		update: 'PUT /api/commanders/{id}',
		// this is the true destroy API, however
		// for demos, we'll just destroy the record visually
		// destroy: 'DELETE /api/commanders/{id}',
		destroy: function() {
			var def = new $.Deferred();
			def.resolve();

			return def;
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

	return Commander;
});