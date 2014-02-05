require.config({
	deps: ['commanders'],
	paths: {
		'can': 'lib/canjs/amd/can',
		'jquery': 'lib/jquery/jquery',
		'socketio': 'lib/socket.io-client/dist/socket.io'
	},
	shim: {
		'socketio': {
			exports: 'io'
		}
	}
});