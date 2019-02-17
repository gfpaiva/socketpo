import gql from 'graphql-tag';

export const totalGameFields = `
name
hash
status
players {
	id
	name
	avatar
	ready
	roundsWin
}
results {
	message
	matchWinner {
		id
		name
		avatar
	}
	rounds {
		isDraw
		finished
		plays {
			player {
				id
				name
			}
			play
		}
		winner {
			id
			name
			avatar
		}
	}
}`;

export const getGame = gql`
	query getGame($hash: String!) {
		GameByHash(hash: $hash) {
			${totalGameFields}
		}
	}
`;

export const play = gql`
	mutation play($hash: String!, $player: PlayerInput!, $play: Int! ) {
		play(hash: $hash, player: $player, play: $play ) {
			hash
			status
		}
	}
`;

export const gameSub = gql`
	subscription gameSub($hash: String!) {
		gameSubscription(hash: $hash) {
			game {
				${totalGameFields}
			}
			message
			hash
			player
		}
	}
`;
