define(['can/model',
	'can/map/attributes',
	'can/compute',
	'socketio'], function(Model, Map, compute, io) {
	var socket = io.connect('http://localhost:8000');

	var Commander = can.Model.extend({
		findAll: 'GET /api/commanders',
		update: function(id, data) {
			socket.emit('api/commanders::update', id, data, {}, function() {});
			return new $.Deferred();
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