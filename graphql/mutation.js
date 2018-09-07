const { gameMutations } = require('./resources/game/game.schema');

module.exports = `
 type Mutation {
	 ${gameMutations}
 }
`;