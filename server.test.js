const crypto = require('crypto');

const app = require('./server');
const request = require('supertest')(app);
const models = require('./models/game');

describe('Server GraphQL requests', () => {

	let newGame, newGamePlayer;

	beforeAll(async () => {
		const Game = models.game;

		await Game.deleteMany({});

		newGame = new Game({ name: 'GameTest' });
		newGamePlayer = {
			name: 'PlayerTest',
			avatar: 1,
			creator: true
		};

		newGame.hash = crypto.createHash('sha1').update(newGame.id).digest('hex');
		newGame.players.push(newGamePlayer);

		await newGame.save();
	});

	it('Get all games Query', done => {
		request.post('/graphql')
			.send({ query: `
				query {
					Games { id }
				}
			`})
			.expect(200)
			.end((err,res) => {
				if(err) throw new Error(err);

				expect(res.body.errors).toBeUndefined();
				expect(res.body.data.Games.length).toBeGreaterThanOrEqual(0);
				done();
			})
	});

	it('Get single game by hash Query', done => {
		request.post('/graphql')
			.send({ query: `
				query {
					GameByHash(hash: "${newGame.hash}") { id }
				}
			`})
			.expect(200)
			.end((err,res) => {
				if(err) throw new Error(err);

				expect(res.body.errors).toBeUndefined();
				expect(res.body.data.GameByHash.id).toBe(newGame.id)
				done();
			})
	});

	it('Get single game by id Query', done => {
		request.post('/graphql')
			.send({ query: `
				query {
					GameById(id: "${newGame.id}") { id }
				}
			`})
			.expect(200)
			.end((err,res) => {
				if(err) throw new Error(err);

				expect(res.body.errors).toBeUndefined();
				expect(res.body.data.GameById.id).toBe(newGame.id)
				done();
			})
	});

	it('Create game Mutation', done => {
		request.post('/graphql')
			.send({ query: `
				mutation {
					createGame(name: "CreatedGameTest", player: { name: "CreatedPlayerTest", avatar: 1 }) {
						id
						name
					}
				}
			`})
			.expect(200)
			.end((err,res) => {
				if(err) throw new Error(err);

				expect(res.body.errors).toBeUndefined();
				expect(typeof res.body.data.createGame).toBe('object');
				done();
			})
	});

	it('Join game Mutation', done => {
		request.post('/graphql')
			.send({ query: `
				mutation {
					joinGame(hash: "${newGame.hash}", player: { name: "CreatedPlayerTest", avatar: 1 }) {
						id
						players { name }
					}
				}
			`})
			.expect(200)
			.end((err,res) => {
				if(err) throw new Error(err);

				expect(res.body.errors).toBeUndefined();
				expect(res.body.data.joinGame.players).toHaveLength(2);
				done();
			})
	});

	it('Ready Player Mutation', done => {
		const playerId = newGame.players[0].id;

		request.post('/graphql')
			.send({ query: `
				mutation {
					ready(hash: "${newGame.hash}", player: { id: "${playerId}" }) {
						id
						players {
							name
							ready
						}
					}
				}
			`})
			.expect(200)
			.end((err,res) => {
				if(err) throw new Error(err);

				expect(res.body.errors).toBeUndefined();
				expect(res.body.data.ready.players[0].ready).toBeTruthy();
				done();
			})
	});

	it('Play mutation cases (new round, draw, win)', async (done) => {
		const Game = models.game;
		let newGame, newGamePlayer, newGamePlayerTwo;

		/*
		* Create a new Game and new players to test mutation play
		*/
		newGame = new Game({
			name: 'GameTest',
			status: 1
		});
		newGamePlayer = {
			name: 'PlayerTest',
			creator: true,
			ready: true
		};
		newGamePlayerTwo = {
			name: 'PlayerTestTwo',
			ready: true
		};
		newGame.hash = crypto.createHash('sha1').update(newGame.id).digest('hex');
		newGame.players.push(newGamePlayer);
		newGame.players.push(newGamePlayerTwo);

		// Save new data to DB
		await newGame.save();

		const playerId = newGame.players[0].id;
		const playerTwoId = newGame.players[1].id;



		/*
		* Play to create a new round
		*/
		const playOne = await request.post('/graphql')
			.send({ query: `
				mutation {
					play(hash: "${newGame.hash}", player: { id: "${playerId}" }, play: 1) {
						results {
							rounds {
								plays {
									player { id }
									play
								}
							}
						}
					}
				}
			`})
			.expect(200);

		const { rounds: roundsOne } = playOne.body.data.play.results;

		expect(playOne.body.errors).toBeUndefined();
		expect(roundsOne.length).toBeGreaterThanOrEqual(1);
		expect(roundsOne[0].plays[0].player.id).toBe(playerId);



		/*
		* Same play with another player, finish round with a draw
		*/
		const playDraw = await request.post('/graphql')
			.send({ query: `
				mutation {
					play(hash: "${newGame.hash}", player: { id: "${playerTwoId}" }, play: 1) {
						results {
							rounds {
								isDraw
								finished
								plays {
									player { id }
									play
								}
							}
						}
					}
				}
			`})
			.expect(200);

		const { rounds: roundsDraw } = playDraw.body.data.play.results;

		expect(roundsDraw[0].finished).toBeTruthy();
		expect(roundsDraw[0].isDraw).toBeTruthy();
		expect(roundsDraw[0].plays[1].player.id).toBe(playerTwoId);



		/*
		* Two players moves, the first one is the winner
		*/
		await request.post('/graphql')
			.send({ query: `
				mutation {
					play(hash: "${newGame.hash}", player: { id: "${playerId}" }, play: 1) {
						hash
					}
				}
			`})
			.expect(200);
		const playWin = await request.post('/graphql')
			.send({ query: `
				mutation {
					play(hash: "${newGame.hash}", player: { id: "${playerTwoId}" }, play: 3) {
						results {
							rounds {
								finished
								winner { id }
							}
						}
					}
				}
			`})
			.expect(200);

		const { rounds: roundsWin } = playWin.body.data.play.results;
		expect(roundsWin[1].finished).toBeTruthy();
		expect(roundsWin[1].winner.id).toBe(playerId);



		/*
		* Moves to end the game, with player one the winner
		*/
		await request.post('/graphql')
			.send({ query: `
				mutation {
					play(hash: "${newGame.hash}", player: { id: "${playerId}" }, play: 1) {
						hash
					}
				}
			`})
			.expect(200);
		const playEnd = await request.post('/graphql')
			.send({ query: `
				mutation {
					play(hash: "${newGame.hash}", player: { id: "${playerTwoId}" }, play: 3) {
						status
						results {
							matchWinner { id }
						}
					}
				}
			`})
			.expect(200);

		const gameWin = playEnd.body.data.play;
		expect(gameWin.status).toBe(2);
		expect(gameWin.results.matchWinner.id).toBe(playerId);


		/*
		* End the "play" test cases
		*/
		done();
	});
});
