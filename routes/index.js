const graphqlHTTP = require('express-graphql');
const schema = require('../graphql/schema');
const path = require('path');

const subscriptionsEndpoint = `ws://${process.env.HOST || 'localhost'}:${process.env.PORT || 3001}/subscriptions`;

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

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
		return;
	});
};
