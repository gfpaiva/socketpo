import React, { Component, Fragment } from 'react';

import { Query } from 'react-apollo';

import { getGame, gameSub } from '../../Utils/graphqlAPI';
import { getObject, setObject } from '../../Utils/storageAPI';

import Header from '../../Components/Single/Header/Header';
import Alerts from '../../Components/Single/Alerts/Alerts';
import Title from '../../Components/Single/Title/Title';

import StandBy from '../../Components/Single/StandBy/StandBy';
import InProgress from '../../Components/Single/InProgress/InProgress';
import End from '../../Components/Single/End/End';
import Join from '../Join/Join';
import RoundModal from '../../Components/Single/RoundModal/RoundModal';

import './Single.scss';

class Single extends Component {

	localMatch = getObject(`match-${this.props.match.params.hash}`);
	currentPlayer = this.localMatch ? this.localMatch.player : null;
	querySubscription = null;

	audio = {
		win: null,
		lose: null
	}

	state = {
		currentRound: this.localMatch && this.localMatch.currentRound ? this.localMatch.currentRound : 0,
		showModal: false,
	}

	componentDidMount() {
		this.audio = {
			win: document.querySelector('#audio-win'),
			lose: document.querySelector('#audio-lose')
		}
	}

	updateQuery = (prev, { subscriptionData }) => {

		if (!subscriptionData.data) return prev;

		const { match: { params: { hash } } } = this.props;
		const { currentRound } = this.state;
		const { game } = subscriptionData.data.gameSubscription;
		const { results } = game;

		if(!results.matchWinner && results.rounds[currentRound] && results.rounds[currentRound].finished === true ) {

			this.setState(prevState => ({

				currentRound: prevState.currentRound + 1,
				showModal: true,
			}), () => {

				const lastRound = results.rounds[currentRound];

				if(lastRound && !lastRound.isDraw) {
					if(this.currentPlayer.id === lastRound.winner.id) {
						this.audio.win.play();
					} else {
						this.audio.lose.play();
					}
				}

				setObject(`match-${hash}`, {
					...getObject(`match-${hash}`),
					currentRound: this.state.currentRound
				});
			});
		}

		return { GameByHash: game }
	}

	componentDidUpdate() {

		const { showModal } = this.state;

		if(showModal) {
			setTimeout(() => {
				this.setState({
					showModal: false
				})
			}, 3000);
		}
	}

	render() {

		const { match: { params: { hash } } } = this.props;

		return (
			<Query
				query={getGame}
				variables={{
					hash
				}}
			>
				{({ data, loading, error, subscribeToMore }) => {

					if(loading) return <Alerts type='Loading' />
					if(error) return null

					const { currentRound, showModal } = this.state;
					const game = data.GameByHash;
					const rounds = game && game.results.rounds;
					const players = game && game.players;

					if(!loading && !game) return <Alerts type='Not Fround' />
					if(players && players.length === 2 && !this.currentPlayer) return <Alerts type='Full' />
					if(!this.currentPlayer) return <Join game={game} />

					subscribeToMore({
						document: gameSub,
						variables: { hash },
						updateQuery: this.updateQuery
					});

					return (
						<div className={`page page--bg-gradient page--single${game && game.status === 2 ? ' page--height-auto' : ''}`}>
							<div className='container'>
								<Header />
								<Title />

								<div className={`single__content${game && game.status === 2 ? ' page--height-auto' : ''}`}>
									{(game.status === 0 || game.status === 1) && (
										<div className='single__split'>
											{/* WAITING FOR PLAYER */}
											{game.status === 0 && <StandBy currentPlayer={this.currentPlayer} />}

											{/* GAME IN PROGRESS */}
											{game.status === 1 && (
												<Fragment>
													<InProgress
														currentPlayer={this.currentPlayer}
														currentRound={currentRound}
													/>

													{showModal && rounds.length > 0 && <RoundModal currentRound={currentRound} />}
												</Fragment>
											)}
										</div>
									)}

									{/* GAME HAS FINISHED */}
									{game.status === 2 && <End />}
								</div>
							</div>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default Single;
