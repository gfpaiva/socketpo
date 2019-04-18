const crypto = require('crypto');

const app = require('./server');
const request = require('supertest')(app);
const models = require('./models/game');

describe('Server GraphQL requests', () => {

	let newGame;
	let newGamePlayer;

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
			.send({ query: 'query { Games { id } }'})
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
			.send({ query: `query { GameByHash(hash: "${newGame.hash}") { id } }`})
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
			.send({ query: `query { GameById(id: "${newGame.id}") { id } }`})
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
			.send({ query: `mutation { createGame(name: "CreatedGameTest", player: { name: "CreatedPlayerTest", avatar: 1 }) { id name } }`})
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
			.send({ query: `mutation { joinGame(hash: "${newGame.hash}", player: { name: "CreatedPlayerTest", avatar: 1 }) { id players { name } } }`})
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
			.send({ query: `mutation { ready(hash: "${newGame.hash}", player: { id: "${playerId}" }) { id players { name ready } } }`})
			.expect(200)
			.end((err,res) => {
				if(err) throw new Error(err);

				expect(res.body.errors).toBeUndefined();
				expect(res.body.data.ready.players[0].ready).toBeTruthy();
				done();
			})
	});
});
