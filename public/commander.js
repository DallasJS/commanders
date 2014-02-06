define(['can/model', 'can/compute', 'can/map/attributes'], function(Model) {
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

	return Commander;
});