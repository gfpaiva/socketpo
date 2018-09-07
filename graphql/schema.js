const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const Query = require('./query');
const Mutation = require('./mutation');

const { gameTypes } = require('./resources/game/game.schema');

const gameResolvers = require('./resources/game/game.resolvers');

const resolvers = merge(
	gameResolvers
);

const SchemaDefinition = `
	type Schema {
		query: Query
		mutation: Mutation
	}
`;

module.exports = makeExecutableSchema({
	typeDefs: [
		SchemaDefinition,
		Query,
		Mutation,
		gameTypes
	],
	resolvers
})