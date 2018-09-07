const mongoose = require('mongoose');

module.exports = () => {
	const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_BASE}`;
	let single_connection;

	if(!single_connection) single_connection = mongoose.connect(url, { useNewUrlParser: true });

	mongoose.set('useCreateIndex', true);

	return single_connection;
};
