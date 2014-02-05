var feathers = require('feathers');
var request = require('request');

var legacyDomain = 'http://localhost:4567/api/commanders';

var commanderSvc = {
	find: function(params, callback) {
		request.get({
			uri: legacyDomain,
			qs: params,
			json: true
		}, function(e, r, commanders) {
			callback(null, commanders);
		});
	},

	get: function(id, params, callback) {
		request.get({
			uri: legacyDomain + '/' + id,
			qs: params,
			json: true
		}, function(e, r, commander) {
			callback(null, commander);
		});
	},

	create: function(data, params, callback) {},

	update: function(id, data, params, callback) {
		request.put({
			uri: legacyDomain + '/' + id,
			body: data,
			qs: data,
			json: true
		}, function(e, r, commander) {
			callback(null, commander);
		});
	},

	remove: function(id, params, callback) {}
};

feathers()
		.configure(feathers.socketio())
		.use(feathers.static(__dirname + '/public'))
		.use('/api/commanders', commanderSvc)
		.listen(8000);