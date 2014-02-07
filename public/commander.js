define(['can/model',
	'can/map/attributes',
	'can/compute',
	'socketio'], function(Model, Map, compute, io) {
	var socket = io.connect('http://localhost:8000');

	var Commander = can.Model.extend({
		findAll: 'GET /api/commanders',
		update: function(id, data) {
			var def = new $.Deferred();

			socket.emit('api/commanders::update', id, data, {}, function(e, commander) {
				//We're just assuming it's successful here, but be sure to handle
				//errors(argument e) accordingly with def.fail, etc
				def.resolve(commander);
			});

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
		Commander.model(commander);
	});

	return Commander;
});