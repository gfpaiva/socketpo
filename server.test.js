const app = require('./server');
const request = require('supertest')(app);

describe('Server GraphQL requests', () => {
	test('Games Query', done => {
		request.post('/graphql')
			.send({ query: '{ Games { id } }'})
			.expect(200)
			.end((err,res) => {
				if(err) return done(err);

				expect(res.body.errors).toBeUndefined();
				expect(res.body.data.Games.length).toBeGreaterThanOrEqual(0);
				done();
			})
	})
})
