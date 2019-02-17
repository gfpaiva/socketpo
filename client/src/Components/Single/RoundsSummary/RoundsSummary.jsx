import React from 'react';

import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { getGame } from '../../../Utils/graphqlAPI';

import {
	Draw,
	Win,
	Loose
} from '../../Icons/Icons';

import './RoundsSummary.scss';

const RoundsSummary = ( { getGame, player } ) => {

	const game = getGame.GameByHash;
	const rounds = game && game.results.rounds;

	return (
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
	);
};

export default withRouter(compose(
	graphql(getGame, {
		name: 'getGame',
		options: props => ({ variables: { hash: props.match.params.hash } })
	}),
)(RoundsSummary));
