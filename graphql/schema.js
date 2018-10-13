const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const Query = require('./query');
const Mutation = require('./mutation');
const Subscription = require('./subscription');

const { gameTypes } = require('./resources/game/game.schema');
const { subsTypes } = require('./resources/subscription/subscription.schema');

const gameResolvers = require('./resources/game/game.resolvers');
const subscriptionResolvers = require('./resources/subscription/subscription.resolvers');

const resolvers = merge(
	gameResolvers,
	subscriptionResolvers
);

const SchemaDefinition = `
	type Schema {
		query: Query
		mutation: Mutation
		subscription: Subscription
	}
`;

module.exports = makeExecutableSchema({
	typeDefs: [
		SchemaDefinition,
		Query,
		Mutation,
		Subscription,
		gameTypes,
		subsTypes
	],
	resolvers
})
