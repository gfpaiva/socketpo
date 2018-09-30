import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { status } from '../../Utils/enums';
import { getObject, setObject } from '../../Utils/storageAPI';

class Single extends Component {

	state = {
		player: ''
	}

	currentPlayer = getObject(`match-${this.props.match.params.hash}`);

	componentWillMount() {
		console.log('⌛⌛⌛', this.currentPlayer);
	}

	componentWillReceiveProps(nextProps) {
		console.log('💣💣💣💣', nextProps);
	}

	changeHandler = e => {
		const { target } = e;

		this.setState({
			[target.name]: target.value
		});
	};

	joinMatch = async e => {
		e.preventDefault();

		const { player } = this.state;
		const { hash } = this.props.match.params;

		const { data } = await this.props.joinGame({
			variables: {
				hash,
				player: {
					name: player
				}
			}
		});

		const { joinGame } = data;
		console.log(joinGame, `${player} Joined the game`);
		setObject(`match-${hash}`, joinGame.players[1]);
		this.props.getGame.refetch();
	};

	getReady = async e => {
		e.preventDefault();

		const { hash } = this.props.match.params;

		const { data } = await this.props.ready({
			variables: {
				hash,
				player: {
					id: this.currentPlayer.id
				}
			}
		});

		const { ready } = data;
		console.log(ready);
		this.props.getGame.refetch();
	}

	render() {
		const { GameByHash, loading } = this.props.getGame;
		const { player } = this.state;
		const game = GameByHash;

		if(loading) return <p>Loading, please wait</p>

		if(!loading && !GameByHash) return <p>Match not found</p>

		if(GameByHash && GameByHash.players.length === 2 && !this.currentPlayer) return <p>Full match</p>

		if(!this.currentPlayer) {
			return (
				<div>
					<p>Want join this match? Enter your name:</p><br />
					<form onSubmit={this.joinMatch}>
						<input
							type="text"
							placeholder="Player Name"
							name="player"
							id="player"
							onChange={this.changeHandler}
							value={player}
							required
							autoComplete="off"
						/>
						<br />
						<button type="submit">Create game</button>
					</form>

				</div>
			)
		}

		return (
			<div className="page page--single">
				<p>Game: {game.name}</p>
				<p>Status: {status(game.status)}</p>
				<div>
					{game.players.map(player => (
						<div key={player.id}>
							<p>
								{player.name} | {player.ready ? 'Im ready' : 'Wait pls..'}
								{!player.ready && player.id === this.currentPlayer.id && <button onClick={this.getReady}>Ready</button>}
							</p>
						</div>
					))}
				</div>
			</div>
		);
	}
}

const totalGameFields = `
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
`

const getGame = gql`
	query getGame($hash: String!) {
		GameByHash(hash: $hash) {
			${totalGameFields}
		}
	}
`;

const joinGame = gql`
	mutation joinGame($hash: String!, $player: PlayerInput!) {
		joinGame(hash: $hash, player: $player) {
			${totalGameFields}
		}
	}
`;

const ready = gql`
	mutation ready($hash: String!, $player: PlayerInput!) {
		ready(hash: $hash, player: $player) {
			${totalGameFields}
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
		graphql(joinGame, {name: 'joinGame'}),
		graphql(ready, {name: 'ready'})
	)(Single);
