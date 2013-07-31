define(['can/model'], function(Model) {
	var Commander = can.Model({
		findAll: 'GET /api/commanders',
		findOne: 'GET /api/commanders/{id}',
		create: 'POST /api/commanders',
		update: 'PUT /api/commanders/{id}',
		destroy: 'DELETE /api/commanders/{id}',
		attributes: {
			upvotes: 'number',
			downvotes: 'number'
		}
	}, {
		votes: function() {
			return this.attr('upvotes') - this.attr('downvotes');
		}
	});

	return Commander;
});