import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { parseStatus, parsePlay } from '../../Utils/enums';
import { getObject, setObject } from '../../Utils/storageAPI';

class Single extends Component {

	localMatch = getObject(`match-${this.props.match.params.hash}`);

	currentPlayer = this.localMatch ? this.localMatch.player : null;

	state = {
		player: '',
		currentRound: this.localMatch && this.localMatch.currentRound ? this.localMatch.currentRound : 0,
		roundPlay: this.localMatch && this.localMatch.roundPlay ? this.localMatch.roundPlay : []
	}

	componentWillMount() {

		const { hash } = this.props.match.params;

		this.props.getGame.subscribeToMore({
			document: gameSub,
			variables: { hash },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;

				// console.log('😅😅😅😅', prev, subscriptionData);
				const { currentRound } = this.state;
				const { game } = subscriptionData.data.gameSubscription;
				const { results } = game;

				if(!results.matchWinner && results.rounds[currentRound] && results.rounds[currentRound].finished === true ) {
					this.setState(prevState => ({
						currentRound: prevState.currentRound + 1
					}), () => {
						setObject(`match-${hash}`, {
							...getObject(`match-${hash}`),
							currentRound: this.state.currentRound
						});
					});
				}

				return { GameByHash: game }
			}
		})
	}

	/* componentWillReceiveProps(props) {
		console.log('💣💣💣💣', props);
	} */

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

		setObject(`match-${hash}`, { player: joinGame.players[1] });
		this.currentPlayer = getObject(`match-${hash}`);
		window.location.reload();
	};

	getReady = async e => {
		e.preventDefault();

		const { hash } = this.props.match.params;

		await this.props.ready({
			variables: {
				hash,
				player: {
					id: this.currentPlayer.id
				}
			}
		});

		// this.props.getGame.refetch();
	}

	makePlay = async (e, playValue) => {
		e.preventDefault();

		const { hash } = this.props.match.params;

		this.setState(prevState => {
			const roundPlay = prevState.roundPlay.concat(true);

			return { roundPlay }
		}, () => {
			setObject(`match-${hash}`, {
				...getObject(`match-${hash}`),
				roundPlay: this.state.roundPlay
			});
		});

		await this.props.play({
			variables: {
				hash,
				player: {
					id: this.currentPlayer.id
				},
				play: playValue
			}
		});
	}

	render() {
		const { GameByHash, loading } = this.props.getGame;
		const { player, currentRound, roundPlay } = this.state;
		const game = GameByHash;
		const rounds = game && game.results.rounds;

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
						<button type="submit">Join game</button>
					</form>

				</div>
			)
		}

		return (
			<div className="page page--single">
				<p>Game: {game.name}</p>
				<p>Status: {parseStatus(game.status)}</p>
				{game.status === 0 && (
					<div>
						{game.players.map(player => (
							<div key={player.id}>
								<p>
									{player.name} | {player.ready ? 'Im ready' : 'Wait pls..'}
									{
										game.players.length === 2 &&
										!player.ready &&
										player.id === this.currentPlayer.id &&
										<button onClick={this.getReady}>Ready</button>
									}
								</p>
							</div>
						))}
					</div>
				)}

				{game.status === 1 && !roundPlay[currentRound] && (
					<div>
						<button onClick={e => this.makePlay(e, 1)}>Rock</button>
						<button onClick={e => this.makePlay(e, 2)}>Paper</button>
						<button onClick={e => this.makePlay(e, 3)}>Scissors</button>
					</div>
				)}

				{rounds.length > 0 && rounds.map((round, roundIdx) => {
					if(round.finished) {
						return (
							<div key={`round-${roundIdx}`}>
								<h3>Round {roundIdx+1}</h3>
								<p>Result: {round.isDraw ? 'Draw' : `${round.winner.name} win this round`}</p>

								{round.plays.map((play, playIdx) => (
									<div key={`roud-${roundIdx}-play-${playIdx}`}>
										<p>Player {play.player.name} choose {parsePlay(play.play)}</p>
									</div>
								))}
							</div>
						);
					}

					return null;
				})}
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
			hash
			players {
				id
				name
				avatar
			}
		}
	}
`;

const ready = gql`
	mutation ready($hash: String!, $player: PlayerInput!) {
		ready(hash: $hash, player: $player) {
			hash
		}
	}
`;

const play = gql`
	mutation play($hash: String!, $player: PlayerInput!, $play: Int! ) {
		play(hash: $hash, player: $player, play: $play ) {
			hash
			status
		}
	}
`;

const gameSub = gql`
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

export default compose(
		graphql(getGame, {
			name: 'getGame',
			options: (props) => ({ variables: { hash: props.match.params.hash } })
		}),
		graphql(joinGame, {name: 'joinGame'}),
		graphql(ready, {name: 'ready'}),
		graphql(play, {name: 'play'}),
	)(Single);
