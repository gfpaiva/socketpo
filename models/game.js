module.exports = (app) => {
	const db = require('./../libs/db')(),
		mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		game = new Schema({
			name: { type: String, required: true },
			hash: { type: String, unique: true },
			createdAt: { type: Date, default: Date.now }
		});

	return db.model('games', game);
};