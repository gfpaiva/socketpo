const mongoose = require('mongoose');

module.exports = () => {
	mongoose.set('useCreateIndex', true);

	const url = process.env.MONGODB_URI;
	let db;

	if(!db) db = mongoose.connect(url, { useNewUrlParser: true });

	return db;
};
