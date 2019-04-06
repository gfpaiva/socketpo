import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { parsePlayIcons, parseAvatar } from '../../../Utils/enums';
import { getGame } from '../../../Utils/graphqlAPI';

import {
	Draw,
	Champion
} from '../../Icons/Icons';

import './End.scss';

const End = ( { match } ) => {

	return (
		<Query
			query={getGame}
			variables={{
				hash: match.params.hash
			}}
		>
			{({ data, loading, error }) => {
				if(loading || error) return null;

				const game = data.GameByHash;
				const rounds = game && game.results.rounds;

				return (
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
				);
			}}
		</Query>
	);
};

End.propTypes = {
	match: PropTypes.object.isRequired
};

export default withRouter(End);
