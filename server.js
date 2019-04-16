const express = require('express'),
	path = require('path'),
	dotenv = require('dotenv').config(),
	compression = require('compression'),
	helmet = require('helmet'),
	db = require('./libs/db')(),
	models = require('./models/game'),
	routes = require('./routes'),
	{ Query, Mutation } = require('./graphql/resources/game/game.resolvers'),
	{ Subscription } = require('./graphql/resources/subscription/subscription.resolvers'),
	{ GraphQLServer } = require('graphql-yoga');

const server = new GraphQLServer({
	typeDefs: './graphql/schema.graphql',
	resolvers: {
		Mutation,
		Query,
		Subscription
	},
	resolverValidationOptions: {
		requireResolversForResolveType: false,
	},
	context: req => ({
		...req,
		db,
		models
	}),
});
const app = server.express;


app.use(compression());
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(helmet());

routes(app);

server.start({
	port: process.env.PORT || 3001,
	endpoint: '/graphql',
	subscriptions: '/graphql',
	playground: process.env.NODE_ENV === 'development' ? '/graphql' : false
}, ({ port }) => console.log(`SocketPO running on port ${port}`));

module.exports = app;
