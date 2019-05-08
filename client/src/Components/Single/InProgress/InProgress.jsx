import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { parsePlayIcons } from '../../../Utils/enums';
import { play } from '../../../Utils/graphqlAPI';
import { getObject, setObject } from '../../../Utils/storageAPI';

import GetGame from '../../GetGame/GetGame';
import Loading from '../../Loading/Loading';
import Player from '../../Player/Player';
import RoundsSummary from '../RoundsSummary/RoundsSummary';
import {
	Rock,
	Paper,
	Scissors
} from '../../Icons/Icons';

import './InProgress.scss';

const InProgress = ({ match, currentPlayer, currentRound }) => {

	const localMatch = getObject(`match-${match.params.hash}`);
	const audio = document.querySelector('#audio-select');

	const [ { roundPlay, currentRoundMove }, updateStatusPlay ] = useState({
		roundPlay: localMatch && localMatch.roundPlay ? localMatch.roundPlay : [],
		currentRoundMove: ''
	});

	const makePlay = async (e, playValue, play) => {

		e && e.preventDefault();

		const { hash } = match.params;

		updateStatusPlay(prevState => {

			const roundPlay = prevState.roundPlay.concat(true);
			const currentRoundMove = playValue;

			setObject(`match-${hash}`, {
				...getObject(`match-${hash}`),
				roundPlay
			});

			audio.play();

			return { roundPlay, currentRoundMove }
		});

		await play({
			variables: {
				hash,
				player: {
					id: currentPlayer.id
				},
				play: playValue
			}
		});
	};

	return (
		<GetGame hash={match.params.hash}>
			{data => {

				const game = data.GameByHash;
				const players = game && game.players;

				return (
					players.map(player => (
						<Player
							key={`play-${player.id}`}
							game={game}
							player={player}
							currentPlayer={currentPlayer}
						>
							{!roundPlay[currentRound] && player.id === currentPlayer.id && (
								<Mutation mutation={play}>
									{play => (
											<div className="single__play-area">
													<p>Make a move: </p>

													<button className='single__play-btn' onClick={e => makePlay(e, 1, play)}>
														<Rock />
													</button>

													<button className='single__play-btn' onClick={e => makePlay(e, 2, play)}>
														<Paper />
													</button>

													<button className='single__play-btn' onClick={e => makePlay(e, 3, play)}>
														<Scissors />
													</button>
											</div>
										)
									}
								</Mutation>
							)}

							{roundPlay[currentRound] && player.id === currentPlayer.id && (
								<div data-test="inprogress-choosed">
									<p>You choosed <span className="icon icon--small">{parsePlayIcons(currentRoundMove)}</span></p>
								</div>
							)}

							{player.id !== currentPlayer.id && (
								<div data-test="inprogress-wait">
									<Loading />
									<p>Wait for other player move...</p>
								</div>
							)}

							<RoundsSummary player={player} />
						</Player>
					))
				);
			}}
		</GetGame>
	);
};

InProgress.propTypes = {
	match: PropTypes.object.isRequired,
	currentPlayer: PropTypes.object.isRequired,
	currentRound: PropTypes.number
};

export default withRouter(InProgress);
