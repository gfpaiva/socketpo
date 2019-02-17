import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';

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

	state = {
		currentRound: this.localMatch && this.localMatch.currentRound ? this.localMatch.currentRound : 0,
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
		const { GameByHash, loading } = this.props.getGame;
		const { currentRound, showModal } = this.state;
		const game = GameByHash;
		const rounds = game && game.results.rounds;
		const players = game && game.players;

		if(loading) return <Alerts type='Loading' />
		if(!loading && !game) return <Alerts type='Not Fround' />
		if(players && players.length === 2 && !this.currentPlayer) return <Alerts type='Full' />
		if(!this.currentPlayer) return <Join game={game} />

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
	}
}

export default compose(
	graphql(getGame, {
		name: 'getGame',
		options: props => ({ variables: { hash: props.match.params.hash } })
	})
)(Single);
