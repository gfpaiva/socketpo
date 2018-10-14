const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const PlayerSchema = new Schema({
	name: { type: String, default: 'Guest' },
	avatar: { type: Number, default: 1 },
	ready: { type: Boolean, default: false },
	roundsWin: { type: Number, default: 0 },
	creator: { type: Boolean, default: false },
});

const PlaySchema = new Schema({
	player: PlayerSchema,
	play: { type: Number, default: 0 }
});

const RoundSchema = new Schema({
	plays: [ PlaySchema ],
	isDraw: { type: Boolean, default: false },
	finished: { type: Boolean, default: false },
	winner: PlayerSchema
});

const GameSchema = new Schema({
	name: { type: String, required: true },
	hash: { type: String, unique: true },
	status: { type: Number, default: 0 },
	players: [ PlayerSchema ],
	results: {
		message: { type: String },
		matchWinner: PlayerSchema,
		rounds: [ RoundSchema ]
	},
	createdAt: { type: Date, default: Date.now }
});

module.exports = () => mongoose.model('Game', GameSchema);
