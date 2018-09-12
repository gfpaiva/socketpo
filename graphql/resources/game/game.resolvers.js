const crypto = require('crypto');
const pubsub = require('../../../libs/pubsub');
const { JUST_TEST } = require('../../../libs/events');

module.exports = {
	Query: {
		Games: (root, args, ctx) => ctx.models.game.find(),
		GameByHash: (root, { hash }, ctx) => ctx.models.game.findOne({ hash }),
		GameById: (root, { id }, ctx) => ctx.models.game.findById(id)
	},

	Mutation: {
		createGame: (root, args, ctx) => {
			const Game = ctx.models.game;
			const newGame = new Game(args);

			newGame.hash = crypto.createHash('sha1').update(newGame.id).digest('hex');

			pubsub.publish(JUST_TEST, { [JUST_TEST]: newGame });

			// try {
			// 	newGame.save();
			// } catch (error) {
			// 	throw new Error(error);
			// }

			return newGame;
		}
	}
}