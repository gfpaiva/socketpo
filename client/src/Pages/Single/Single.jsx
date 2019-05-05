import React, { useState, useEffect, Fragment } from 'react';

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

const Single = ({ match }) => {

	const localMatch = getObject(`match-${match.params.hash}`);
	const currentPlayer = localMatch ? localMatch.player : null;
	const audio = {
		win: document.querySelector('#audio-win'),
		lose: document.querySelector('#audio-lose')
	};
	const { params: { hash } } = match;

	const [ currentRound, updateCurrentRound ] = useState((localMatch && localMatch.currentRound) ? localMatch.currentRound : 0);
	const [ showModal, updateShowModal ] = useState(false);
	useEffect(() => {

		if(showModal) setTimeout(() => updateShowModal(false), 3000);
	}, [showModal]);

	const updateQuery = (prev, { subscriptionData }) => {

		if (!subscriptionData.data) return prev;

		const { game } = subscriptionData.data.gameSubscription;
		const { results } = game;

		if(!results.matchWinner && results.rounds[currentRound] && results.rounds[currentRound].finished === true ) {

			updateCurrentRound(prevState => {

				const lastRound = results.rounds[prevState];
				const currentRound = prevState + 1;

				if(lastRound && !lastRound.isDraw) {
					if(currentPlayer.id === lastRound.winner.id) {
						audio.win.play();
					} else {
						audio.lose.play();
					}
				}

				setObject(`match-${hash}`, {
					...getObject(`match-${hash}`),
					currentRound
				});

				return currentRound;
			});
			updateShowModal(true);
		}

		return { GameByHash: game }
	};

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

				const game = data.GameByHash;
				const rounds = game && game.results.rounds;
				const players = game && game.players;

				if(!loading && !game) return <Alerts type='Not Fround' />
				if(players && players.length === 2 && !currentPlayer) return <Alerts type='Full' />
				if(!currentPlayer) return <Join game={game} />

				subscribeToMore({
					document: gameSub,
					variables: { hash },
					updateQuery
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
										{game.status === 0 && <StandBy currentPlayer={currentPlayer} />}

										{/* GAME IN PROGRESS */}
										{game.status === 1 && (
											<Fragment>
												<InProgress
													currentPlayer={currentPlayer}
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
};

export default Single;
