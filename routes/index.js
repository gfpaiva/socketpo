const graphqlHTTP = require('express-graphql');
const schema = require('../graphql/schema');

const subscriptionsEndpoint = `ws://localhost:${process.env.PORT || 5000}/subscriptions`;

module.exports = app => {
	const context = app;

	app.use('/graphql',
		graphqlHTTP((req) => ({
			schema,
			graphiql: process.env.NODE_ENV === 'development',
			subscriptionsEndpoint,
			context
		}))
	);

	app.use((req, res) => {
		res.status(404);
		res.json({'msg': '404 not found'});
	});

	app.use((error, req, res) => {
		res.status(500);
		res.json({'msg': `500 ${error}`});
	});
};