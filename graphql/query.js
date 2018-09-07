const { gameQueries } = require('./resources/game/game.schema');

module.exports = `
 type Query {
	${gameQueries}
 }
`;