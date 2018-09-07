module.exports = {
	gameTypes: `
		type Game {
			id: ID
			name: String!
			hash: String!
			status: Int!
			players: [ Player ]
			results: [ Result ]
			createdAt: String
		}

		type Player {
			name: String!
			avatar: String!
		}

		type Result {
			message: String
			winner: Player
			rounds: [ Player ]
		}

		input PlayerInput {
			name: String
			avatar: String
		}
	`,

	gameQueries: `
		Games: [ Game ]!
		GameByHash(hash: String): Game!
		GameById(id: ID!): Game!

	`,

	gameMutations: `
		createGame(name: String!, createdBy: PlayerInput): Game
	`
}