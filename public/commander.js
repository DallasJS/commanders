define(['can/model',
	'can/map/attributes',
	'can/compute',
	'socketio'], function(Model, Map, compute, io) {
	var socket = io.connect('http://localhost:8000');

	var Commander = can.Model({
		findAll: 'GET /api/commanders',
		findOne: 'GET /api/commanders/{id}',
		// create: 'POST /api/commanders',
		update: function(id, data) {
			socket.emit('api/commanders::update', id, data, {}, function() {});
			return new $.Deferred();
		},
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

	socket.on('api/commanders updated', function(commander) {
		Commander.model(commander).updated();
	});

	return Commander;
});