module.exports = {
	gameTypes: `
		type Game {
			id: ID
			name: String
			hash: String
			status: Int
			players: [ Player ]
			results: Result
			createdAt: String
		}

		type Player {
			id: ID
			name: String
			avatar: String
			ready: Boolean
			roundsWin: Int
			creator: Boolean
		}

		type Result {
			message: String
			matchWinner: Player
			rounds: [ Round ]
		}

		type Round {
			plays: [ Play ]
			isDraw: Boolean
			finished: Boolean
			winner: Player
		}

		type Play {
			player: Player
			play: Int
		}

		input PlayerInput {
			id: ID
			name: String
			avatar: String
		}
	`,

	gameQueries: `
		Games: [ Game ]
		GameByHash(hash: String!): Game
		GameById(id: ID!): Game

	`,

	gameMutations: `
		createGame(name: String!, player: PlayerInput): Game
		joinGame(hash: String!, player: PlayerInput!): Game
		ready(hash: String!, player: PlayerInput!): Game
		play(hash: String!, player: PlayerInput!, play: Int!): Game
	`
}
