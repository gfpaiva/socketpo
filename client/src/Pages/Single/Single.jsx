import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { status } from '../../Utils/enums';

class Single extends Component {

	componentWillMount() {
		/* this.props.getGames.subscribeToMore({
			document: gameSub,
			variables: { hash: '1' },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				console.log('😅😅😅😅', prev, subscriptionData);

				const newGame = subscriptionData.data.gameSubscription;
				return {
					Games: [
						...prev.Games,
						newGame
					]
				}
			}
		}) */
	}

	componentWillReceiveProps(nextProps) {
		console.log('💣💣💣💣', nextProps);
	}

	render() {
		const { GameByHash, loading } = this.props.getGame;
		const game = GameByHash;

		if(loading) return <p>Loading, please wait</p>

		return (
			<div className="page page--single">
				<p>Game: {game.name}</p>
				<p>Status: {status(game.status)}</p>
				<div>
					{game.players.map(player => (
						<div>
							<p key={player.id}>
								{player.name} | {player.ready ? 'Im ready' : 'Wait pls..'}
								{!player.ready && <button>Ready</button>}
							</p>
						</div>
					))}
				</div>
			</div>
		);
	}
}

const getGame = gql`
	query getGame($hash: String!) {
		GameByHash(hash: $hash) {
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
					}
				}
			}
		}
	}
`;

const gameSub = gql`
	subscription gameSub($hash: String!) {
		gameSubscription(hash: $hash) {
			id
			name
			hash
		}
	}
`;

export default compose(
		graphql(getGame, {
			name: 'getGame',
			options: (props) => ({ variables: { hash: props.match.params.hash } })
		}),
	)(Single);
