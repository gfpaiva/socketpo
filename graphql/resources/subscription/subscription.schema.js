module.exports = {
	subsTypes: `
		type GameSub {
			game: Game
			hash: String
			player: String
			message: String
		}
	`,

	subsSchema:`
		gameSubscription(hash: String!): GameSub
	`
}
