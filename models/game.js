const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = () => {
	const player = new Schema({
		name: { type: String, default: 'Guest' },
		plays: [ { type: Number, default: 0 } ]
	}),
	game = new Schema({
		name: { type: String, required: true },
		hash: { type: String, unique: true },
		status: { type: Number, default: 0 },
		players: [player],
		result: [{
			message: { type: String },
			won: [player],
			rounds: [{

			}]
		}],
		createdAt: { type: Date, default: Date.now }
	});

	return mongoose.model('games', game);
};
