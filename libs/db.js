const mongoose = require('mongoose');

module.exports = () => {
	mongoose.set('useCreateIndex', true);

	const url = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/soketpo' : process.env.MONGODB_URI;
	let db;

	if(!db) db = mongoose.connect(url, { useNewUrlParser: true });

	return db;
};
