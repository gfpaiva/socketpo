const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const PlaySchema = new Schema({
	play: { type: Number, default: 0 }
});

const PlayerSchema = new Schema({
	name: { type: String, default: 'Guest' },
	avatar: { type: String }
});

const RoundSchema = new Schema({
	first: {
		player: PlayerSchema,
		play: PlaySchema
	},
	second: {
		player: PlayerSchema,
		play: PlaySchema
	}
});

const GameSchema = new Schema({
	name: { type: String, required: true },
	hash: { type: String, unique: true },
	status: { type: Number, default: 0 },
	createdBy: PlayerSchema,
	players: [ PlayerSchema ],
	results: [{
		message: { type: String },
		matchWinner: PlayerSchema,
		rounds: [ RoundSchema ]
	}],
	createdAt: { type: Date, default: Date.now }
});

module.exports = () => mongoose.model('Game', GameSchema);
