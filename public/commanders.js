require.config({
	paths: {
		'can': 'lib/canjs/amd/can',
		'jquery': 'lib/jquery/jquery'
	}
});

require(['main'], function(Main) {
	new Main('#main');
});