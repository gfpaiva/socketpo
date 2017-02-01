module.exports = () => {
	const mongoose = require('mongoose');

	mongoose.Promise = global.Promise;

	let single_connection,
		url = `mongodb://${process.env.DB_HOST}/${process.env.DB_BASE}`;


	if(!single_connection) {
		single_connection = mongoose.connect(url);
	}

	return single_connection;
};
