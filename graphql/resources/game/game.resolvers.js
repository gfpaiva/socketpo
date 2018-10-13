const crypto = require('crypto');
const pubsub = require('../../../libs/pubsub');
const { GAME } = require('../../../libs/events');

module.exports = {
	Query: {
		Games: (root, args, ctx) => ctx.models.game.find(),
		GameByHash: (root, { hash }, ctx) => ctx.models.game.findOne({ hash }),
		GameById: (root, { id }, ctx) => ctx.models.game.findById(id)
	},

	Mutation: {
		createGame: (root, { name , player }, ctx) => {
			const Game = ctx.models.game;
			let newGame;
			let newGamePlayer;

			try {
				newGame = new Game({ name });
				newGamePlayer = {
					...player,
					creator: true
				};

				newGame.hash = crypto.createHash('sha1').update(newGame.id).digest('hex');
				newGame.players.push(newGamePlayer);

				newGame.save();
			} catch (error) {
				throw new Error(error);
			}

			// pubsub.publish(GAME, { [GAME]: newGame });
			return newGame;
		},

		joinGame: async (root, { hash, player }, ctx) => {
			const game = await ctx.models.game.findOne({ hash });

			if(game.status === 0 && game.players.length === 1) {
				game.players.push(player);

				try {
					game.save();
				} catch (error) {
					throw new Error(error);
				}
			} else {
				throw new Error('Match full or alredy start');
			}

			pubsub.publish(GAME, { [GAME]: { game, hash, player: player.id, message: `Player: ${player.name} join the match!` } });
			return game;
		},

		ready: async (root, { hash, player }, ctx) => {
			const game = await ctx.models.game.findOne({ hash });
			const gamePlayer = game.players.id(player.id);

			if(game.status !== 0) throw new Error('Match alredy start');
			gamePlayer.ready = true;
			if(!game.players.some(player => player.ready === false)) game.status = 1;

			try {
				game.save();
			} catch (error) {
				throw new Error(error);
			}

			pubsub.publish(GAME, { [GAME]: { game, hash, player: player.id, message: `Player: ${gamePlayer.name} is ready!` } });
			return game;
		},

		play: async (root, { hash, player, play }, ctx) => {
			const game = await ctx.models.game.findOne({ hash });
			const { rounds } = game.results;
			const gamePlayer = game.players.id(player.id);

			if(game.status !== 1) throw new Error('Match alredy finished');

			if(rounds && rounds.length <= 0) game.results.rounds.push({ plays: [] });

			let currentRound = rounds[rounds.length - 1];
			let winner;

			if(currentRound.finished) {
				game.results.rounds.push({ plays: [] });
				currentRound = rounds[rounds.length - 1];
			} else {
				if(currentRound.plays.some(play => play.player.id === player.id)) throw new Error('You alredy play in this round');
			}

			currentRound.plays.push({
				player: gamePlayer,
				play
			});

			if(currentRound.plays.length === 2) {
				const playOne = currentRound.plays[0];
				const playTwo = currentRound.plays[1];
				const playOneValue = playOne.play;
				const playTwoValue = playTwo.play;

				if(playOneValue === playTwoValue) {
					currentRound.isDraw = true;
				} else {
					/*
						0: W.O.
						1: Rock
						2: Paper
						3: Scissors
					 */
					switch (playOneValue) {
						case 0:
							winner = playerTwo.player;
						break;

						case 1:
							if(playTwoValue === 3 || playTwoValue === 0) {
								winner = playOne.player;
							} else {
								winner = playTwo.player;

							}
						break;

						case 2:
							if(playTwoValue === 1 || playTwoValue === 0) {
								winner = playOne.player;
							} else {
								winner = playTwo.player;
							}
						break;

						case 3:
							if(playTwoValue === 2 || playTwoValue === 0) {
								winner = playOne.player;
							} else {
								winner = playTwo.player;
							}
						break;
					}

					currentRound.winner = winner;
					const roundWinner = game.players.id(winner.id);
					roundWinner.roundsWin = roundWinner.roundsWin + 1;
				}

				currentRound.finished = true;

				const matchWinner = game.players.find(player => player.roundsWin === 2);

				if(matchWinner) {
					game.status = 2;
					game.message = `Player ${matchWinner.name} win this match!`;
					game.results.matchWinner = matchWinner;
				}
			}

			try {
				game.save();
			} catch (error) {
				throw new Error(error);
			}

			pubsub.publish(GAME, { [GAME]: { game, hash, message: `IDK FOR NOW` } });
			return game;
		}
	}
}
