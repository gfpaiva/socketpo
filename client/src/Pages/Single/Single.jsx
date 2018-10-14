import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import { parseStatus, parsePlay } from '../../Utils/enums';
import { getObject, setObject } from '../../Utils/storageAPI';
import { sanitize } from '../../Utils/helpers';

import Loading from '../../Components/Loading/Loading';
import Player from '../../Components/Player/Player';
import Join from '../Join/Join';

import './Single.scss';

class Single extends Component {

	localMatch = getObject(`match-${this.props.match.params.hash}`);

	currentPlayer = this.localMatch ? this.localMatch.player : null;

	state = {
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
		const { currentRound, roundPlay } = this.state;
		const game = GameByHash;
		const rounds = game && game.results.rounds;

		if(loading) return <p>Loading, please wait</p>

		if(!loading && !GameByHash) return <p>Match not found</p>

		if(GameByHash && GameByHash.players.length === 2 && !this.currentPlayer) return <p>Full match</p>

		if(!this.currentPlayer) return <Join game={game} />

		return (
			<div className="page page--full page--bg-gradient page--single">
				<div className='container'>
					<div className="single__head">
						<h1 className="single__socketpo"><Link to='/'>SocketPo</Link></h1>
					</div>

					<div className="single__title">
						<p><strong>Game: </strong>{game.name}</p>
						<p>
							<strong>Status: </strong>{parseStatus(game.status)}
							<span className={`single__status single__status--${sanitize(parseStatus(game.status))}`}></span>
						</p>
					</div>

					<div className="single__content">
						{game.status === 0 && (
							<div className='single__get-ready'>
								{game.players.map(player => (
									<Player
										game={game}
										player={player}
										currentPlayer={this.currentPlayer}
									/>
								))}

								{game.players.length === 1 && (
									<div className='single__player'>
										<div>
											<Loading />
											<p>Wating for other player</p>
										</div>
									</div>
								)}
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
		graphql(play, {name: 'play'}),
)(Single);
