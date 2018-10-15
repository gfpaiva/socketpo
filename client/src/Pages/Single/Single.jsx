import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import { parseStatus, parseAvatar, parsePlay } from '../../Utils/enums';
import { getObject, setObject } from '../../Utils/storageAPI';
import { sanitize } from '../../Utils/helpers';

import Loading from '../../Components/Loading/Loading';
import Player from '../../Components/Player/Player';
import Join from '../Join/Join';
import Rock from '../../Components/Icons/Rock';
import Paper from '../../Components/Icons/Paper';
import Scissors from '../../Components/Icons/Scissors';
import Time from '../../Components/Icons/Time';
import Draw from '../../Components/Icons/Draw';
import Win from '../../Components/Icons/Win';
import Loose from '../../Components/Icons/Loose';
import Champion from '../../Components/Icons/Champion';

import './Single.scss';

class Single extends Component {

	localMatch = getObject(`match-${this.props.match.params.hash}`);
	currentPlayer = this.localMatch ? this.localMatch.player : null;
	timeOutTimer = null;

	state = {
		currentRound: this.localMatch && this.localMatch.currentRound ? this.localMatch.currentRound : 0,
		roundPlay: this.localMatch && this.localMatch.roundPlay ? this.localMatch.roundPlay : [],
		timer: true
	}

	componentWillMount() {

		const { hash } = this.props.match.params;

		this.props.getGame.subscribeToMore({
			document: gameSub,
			variables: { hash },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;

				const { currentRound } = this.state;
				const { game } = subscriptionData.data.gameSubscription;
				const { results } = game;

				if(!results.matchWinner && results.rounds[currentRound] && results.rounds[currentRound].finished === true ) {
					this.setState(prevState => ({
						currentRound: prevState.currentRound + 1,
						timer: true
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

	// componentWillReceiveProps(props) {
	// }

	componentDidUpdate() {
		const { GameByHash } = this.props.getGame;
		const { currentRound, roundPlay } = this.state;
		const game = GameByHash;

		if(game && game.status === 1 && !roundPlay[currentRound]) {
			this.timeOutTimer = window.setTimeout(() => {
				this.setState(() => ({
					timer: false
				}), () => {
					window.clearTimeout(this.timeOutTimer);
					this.makePlay(null, 0);
				});
			}, 1000 * 30);
		} else {
			window.clearTimeout(this.timeOutTimer);
		}
	}


	makePlay = async (e, playValue) => {
		e && e.preventDefault();

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
		const { currentRound, roundPlay, timer } = this.state;
		const game = GameByHash;
		const rounds = game && game.results.rounds;

		if(loading) return (
			<div className="page page--full page--centered page--bg-gradient page--single">
				<div>
					<Loading />
					<p>Loading, please wait</p>
				</div>
			</div>
		);

		if(!loading && !GameByHash) return (
			<div className="page page--full page--centered page--bg-gradient page--single">
				<p>Match not found <span role='img' aria-label='think'>🤔</span></p>
			</div>
		);

		if(GameByHash && GameByHash.players.length === 2 && !this.currentPlayer) return (
			<div className="page page--full page--centered page--bg-gradient page--single">
				<div>
					<p>This match is full and in progress</p>
					<Link className='link link--underline' to='/create'>Create a new match</Link>
				</div>
			</div>
		);

		if(!this.currentPlayer) return <Join game={game} />

		return (
			<div className={`page page--full page--bg-gradient page--single${game && game.status === 2 ? ' page--height-auto' : ''}`}>
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

					<div className={`single__content${game && game.status === 2 ? ' page--height-auto' : ''}`}>
						{game.status === 0 && (
							<div className='single__split'>
								{game.players.map(player => (
									<Player
										key={`ready-${player.id}`}
										game={game}
										player={player}
										currentPlayer={this.currentPlayer}
										showReady
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

						{game.status === 1 && (
							<div className='single__split'>
								{game.players.map(player => (
									<Player
										key={`play-${player.id}`}
										game={game}
										player={player}
										currentPlayer={this.currentPlayer}
									>
										{!roundPlay[currentRound] && player.id === this.currentPlayer.id && (
											<div className="single__play-area">
												{timer && (
													<div className="single__play-countdown">
														<Time />
														<span className="single__play-countdown-bar"><em></em></span>
													</div>
												)}

												<p>Choose an option below: </p>

												<button className='single__play-btn' onClick={e => this.makePlay(e, 1)}>
													<Rock />
												</button>
												<button className='single__play-btn' onClick={e => this.makePlay(e, 2)}>
													<Paper />
												</button>
												<button className='single__play-btn' onClick={e => this.makePlay(e, 3)}>
													<Scissors />
												</button>
											</div>
										)}

										{roundPlay[currentRound] && player.id === this.currentPlayer.id && (
											<Fragment>
												<Loading />
												<p>Please wait...</p>
											</Fragment>
										)}

										{player.id !== this.currentPlayer.id && (
											<Fragment>
												<Loading />
												<p>Please wait...</p>
											</Fragment>
										)}

										{rounds.length > 0 && (
											<div className='single__play-results'>
												{rounds.map((round, roundIdx) => {
													if(round.finished) {
														return (
															<div className='single__play-result' key={`round-${roundIdx}`}>
																<h3>Round {roundIdx+1}</h3>
																<span>
																	{round.isDraw && <Draw />}
																	{!round.isDraw && round.winner.id === player.id && <Win />}
																	{!round.isDraw && round.winner.id !== player.id && <Loose />}
																</span>
															</div>
														);
													}

													return null;
												})}
											</div>
										)}
									</Player>
								))}
							</div>
						)}

						{game.status === 2 && (
							<div className="single__win">
								<h1>{game.name}</h1>
								<p className='my-0'>Congratulations!</p>
								<h2 className='my-0'>{game.results.matchWinner.name}</h2>
								<p className='my-0'>You win this match!</p>
								<div>
									<span className='single__win-champion'><Champion /></span>
									{parseAvatar(game.results.matchWinner.avatar)}
									<p>
										<Link className='link link--underline' to='/create'>Create a new game!</Link>
									</p>
								</div>

								{rounds.length > 0 && rounds.map((round, roundIdx) => {
									if(round.finished) {
										return (
											<div className='single__win-results' key={`round-${roundIdx}`}>
												<h3>Round {roundIdx+1}</h3>
												<p><strong>Result: </strong>{round.isDraw ? 'Draw' : `${round.winner.name} win this round`}</p>

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
						)}
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
