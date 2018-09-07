const crypto = require('crypto');

module.exports = {
	Query: {
		Games: (root, args, ctx) => ctx.models.Game.find(),
		GameByHash: (root, { hash }, ctx) => ctx.models.Game.findOne({ hash }),
		GameById: (root, { id }, ctx) => ctx.models.Game.findById(id)
	},

	Mutation: {
		createGame: (root, args, ctx) => {
			const Game = ctx.models.Game;
			const newGame = new Game(args);

			newGame.hash = crypto.createHash('sha1').update(newGame.id).digest('hex');

			try {
				newGame.save();
			} catch (error) {
				throw new Error(error);
			}

			return newGame;
		}
	}
}