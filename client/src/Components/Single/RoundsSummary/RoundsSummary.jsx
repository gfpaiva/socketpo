import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

import GetGame from '../../GetGame/GetGame';
import {
	Draw,
	Win,
	Lose
} from '../../Icons/Icons';

import './RoundsSummary.scss';

const RoundsSummary = ( { match, player } ) => {

	return (
		<GetGame hash={match.params.hash}>
			{data => {

				const game = data.GameByHash;
				const rounds = game && game.results.rounds;

				return (
					<div data-test="summary">
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
													{!round.isDraw && round.winner.id !== player.id && <Lose />}
												</span>
											</div>
										);
									}

									return null;
								})}
							</div>
						)}
					</div>
				);
			}}
		</GetGame>
	);
};

RoundsSummary.propTypes = {
	player: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
}

export default withRouter(RoundsSummary);
