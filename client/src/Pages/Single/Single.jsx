import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import { parseStatus, parseAvatar, parsePlayIcons } from '../../Utils/enums';
import { getObject, setObject } from '../../Utils/storageAPI';
import { sanitize } from '../../Utils/helpers';

import Loading from '../../Components/Loading/Loading';
import Player from '../../Components/Player/Player';
import Join from '../Join/Join';
import Modal from '../../Components/Modal/Modal';
import {
	Rock,
	Paper,
	Scissors,
	Draw,
	Win,
	Loose,
	Champion
} from '../../Components/Icons/Icons';

import './Single.scss';

class Single extends Component {

	localMatch = getObject(`match-${this.props.match.params.hash}`);
	currentPlayer = this.localMatch ? this.localMatch.player : null;
	audio = {
		select: null,
		win: null,
		lose: null
	};
	querySubscription = null;

	state = {
		currentRound: this.localMatch && this.localMatch.currentRound ? this.localMatch.currentRound : 0,
		currentRoundMove: '',
		roundPlay: this.localMatch && this.localMatch.roundPlay ? this.localMatch.roundPlay : [],
		showModal: false,
	}

	componentWillMount() {

		const { hash } = this.props.match.params;

		this.querySubscription = this.props.getGame.subscribeToMore({
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
						showModal: true,
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

	componentWillUnmount() {

		this.querySubscription();
	}

	componentDidMount() {

		this.audio = {
			select: document.querySelector('#audio-select'),
			win: document.querySelector('#audio-win'),
			lose: document.querySelector('#audio-lose')
		}
	}

	componentDidUpdate() {
		const { showModal } = this.state;

		if(showModal) {
			setTimeout(() => {
				this.setState({
					showModal: false
				})
			}, 4000);
		}
	}

	makePlay = async (e, playValue) => {
		e && e.preventDefault();

		const { hash } = this.props.match.params;

		this.setState(prevState => {
			const roundPlay = prevState.roundPlay.concat(true);
			const currentRoundMove = playValue;

			return { roundPlay, currentRoundMove }
		}, () => {
			setObject(`match-${hash}`, {
				...getObject(`match-${hash}`),
				roundPlay: this.state.roundPlay
			});
			this.audio.select.play();
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
		const { currentRound, roundPlay, currentRoundMove, showModal } = this.state;
		const game = GameByHash;
		const rounds = game && game.results.rounds;
		const players = game && game.players;

		if(loading) return (
			<div className="page page--full page--centered page--bg-gradient page--single">
				<div>
					<Loading />
					<p>Loading, please wait</p>
				</div>
			</div>
		);

		if(!loading && !game) return (
			<div className="page page--full page--centered page--bg-gradient page--single">
				<p>
					Match not found <span role='img' aria-label='think'>🤔</span><br />
					<Link className='link link--underline' to='/create'>Create a new match</Link>
				</p>
			</div>
		);

		if(players && players.length === 2 && !this.currentPlayer) return (
			<div className="page page--full page--centered page--bg-gradient page--single">
				<div>
					<p>
						This match is full and in progress <br />
						<Link className='link link--underline' to='/create'>Create a new match</Link>
					</p>
				</div>
			</div>
		);

		if(!this.currentPlayer) return <Join game={game} />

		return (
			<div className={`page page--bg-gradient page--single${game && game.status === 2 ? ' page--height-auto' : ''}`}>
				<div className='container'>
					<div className="single__head">
						<h1 className="single__socketpo"><Link to='/'>SocketPo</Link></h1>
					</div>

					<div className="single__title">
						<p>{game.name}</p>
						<p>
							<strong>Status: </strong>{parseStatus(game.status)}
							<span className={`single__status single__status--${sanitize(parseStatus(game.status))}`}></span>
						</p>
					</div>

					<div className={`single__content${game && game.status === 2 ? ' page--height-auto' : ''}`}>
						{(game.status === 0 || game.status === 1) && (
							<div className='single__split'>
								{game.status === 0 && (
									<Fragment>
										{players.map(player => (
											<Player
												key={`ready-${player.id}`}
												game={game}
												player={player}
												currentPlayer={this.currentPlayer}
												showReady
											/>
										))}

										{players.length === 1 && (
											<div className='single__player'>
												<div>
													<Loading />
													<p>Wating for other player</p>
												</div>
											</div>
										)}
									</Fragment>
								)}

								{game.status === 1 && (
									<Fragment>
										{players.map(player => (
											<Player
												key={`play-${player.id}`}
												game={game}
												player={player}
												currentPlayer={this.currentPlayer}
											>
												{!roundPlay[currentRound] && player.id === this.currentPlayer.id && (
													<div className="single__play-area">
														<p>Make a move: </p>

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
													<div>
														<Loading />
														<p>You choosed <span className="icon icon--small">{parsePlayIcons(currentRoundMove)}</span></p>
													</div>
												)}

												{player.id !== this.currentPlayer.id && (
													<div>
														<Loading />
														<p>Wait for other player move...</p>
													</div>
												)}

												<div>
													<p className="single__play-summary-result">
														<strong>{player.roundsWin}</strong>
													</p>

													{rounds.length > 0 && (
														<div className='single__play-results'>
															{rounds.map((round, roundIdx) => {
																if(round.finished) {
																	return (
																		<div className='card single__play-result' key={`round-${roundIdx}`}>
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
												</div>
											</Player>
										))}

										{showModal && rounds.length > 0 && (
											<Modal className='modal-round'>
												<p className='modal-round__title'>Round {currentRound}</p>
												{rounds[currentRound-1].isDraw ? (
													<div className='modal-round__draw'>
														<div className='modal-round__draw-icon'>
															<span className='icon icon--big'>
																<Draw />
															</span>
														</div>
														<p>This round has finished with a draw</p>
														<div className='modal-round__plays'>
															{rounds[currentRound-1].plays.map(( { play, player }, idx ) => (
																<p key={idx} className='card modal-round__play'>
																	{player.name} <br /> <span className='icon icon--small'>{parsePlayIcons(play)}</span>
																</p>
															))}
														</div>
													</div>
												) : (
													<div className='modal-round__win'>
														{rounds[currentRound-1].winner && (
															<Fragment>
																<div className='modal-round__win-icon'>
																	<span className="icon icon--big">
																		<Win />
																	</span>
																</div>
																<div className='modal-round__win-avatar'>
																	{parseAvatar(rounds[currentRound-1].winner.avatar)}
																</div>
																<p>
																	<span role="img" aria-label="Party Popper">🎉</span>
																	<strong>{rounds[currentRound-1].winner.name}</strong> win this round!
																	<span role="img" aria-label="Party Popper">🎉</span>
																</p>
																<div className='modal-round__plays'>
																	{rounds[currentRound-1].plays.map(( { play, player }, idx ) => (
																		<p key={idx} className='card modal-round__play'>
																			{player.name} <br /> <span className='icon icon--small'>{parsePlayIcons(play)}</span>
																		</p>
																	))}
																</div>
															</Fragment>
														)}
													</div>
												)}
											</Modal>
										)}
									</Fragment>
								)}
							</div>
						)}

						{game.status === 2 && (
							<div className="single__win">
								<h1>{game.name}</h1>
								<p className='my-0'>Congratulations!</p>
								<h2 className='my-0'>{game.results.matchWinner.name}</h2>
								<p className='my-0'>You win this match!</p>
								<div>
									<div>
										<span className='single__win-champion'>{parseAvatar(game.results.matchWinner.avatar)}</span>
										<span className='icon icon--huge single__win-champion-icon'><Champion /></span>
									</div>
									<p>
										<Link className='link link--underline' to='/create'>Create a new game!</Link>
									</p>
								</div>

								{rounds.length > 0 && rounds.map((round, roundIdx) => {
									if(round.finished) {
										return (
											<div
												className={`single__win-result${round.isDraw ? ' single__win-result--draw': ''}`}
												key={`round-${roundIdx}`}
											>
												<h3 className='single__win-result-title'>Round {roundIdx+1}</h3>
												<p className='single__win-result-content'>
													<strong>Result: </strong>
													{round.isDraw ?
														(
															<Fragment>
																<span className='icon icon--small single__win-result-icon-draw'><Draw /></span>
																<span className='single__win-result-text'>&nbsp;Draw</span>
															</Fragment>
														)
														: (
															<Fragment>
																<span className='single__win-result-avatar'>{parseAvatar(round.winner.avatar)}</span>
																<span className='single__win-result-text'><strong>{round.winner.name}</strong> win this round</span>
															</Fragment>
														)}
												</p>

												{round.plays.map((play, playIdx) => (
													<div key={`roud-${roundIdx}-play-${playIdx}`}>
														<p>Player {play.player.name} choosed <span className='icon icon--small'>{parsePlayIcons(play.play)}</span></p>
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
				name
				avatar
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
			options: props => ({ variables: { hash: props.match.params.hash } })
		}),
		graphql(play, {name: 'play'}),
)(Single);
