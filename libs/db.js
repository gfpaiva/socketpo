module.exports = () => {
	const mongoose = require('mongoose'),
	env_url = {
		"development": "mongodb://localhost/socketpo"
	};
	
	let single_connection,
		url = env_url[process.env.NODE_ENV];

	if(!single_connection) {
		single_connection = mongoose.connect(url);
	}

	return single_connection;
};
