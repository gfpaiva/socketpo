const mongoose = require('mongoose');

module.exports = () => {
	const url = process.env.MONGODB_URI;
	let single_connection;

	if(!single_connection) single_connection = mongoose.connect(url, { useNewUrlParser: true });

	mongoose.set('useCreateIndex', true);

	return single_connection;
};
