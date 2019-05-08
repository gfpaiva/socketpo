import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

import GetGame from '../../GetGame/GetGame';
import Loading from '../../Loading/Loading';
import Player from '../../Player/Player';

const StandBy = ( { currentPlayer, match } ) => {

	return (
		<GetGame hash={match.params.hash}>
			{data => {

				const game = data.GameByHash;
				const players = game && game.players;

				return (
					<Fragment>
						{players.map(player => (
							<Player
								key={`ready-${player.id}`}
								game={game}
								player={player}
								currentPlayer={currentPlayer}
								showReady
							/>
						))}

						{players.length === 1 && (
							<div className='single__player' data-test="waiting">
								<div>
									<Loading />
									<p>Wating for other player</p>
								</div>
							</div>
						)}
					</Fragment>
				);
			}}
		</GetGame>
	);
};

StandBy.propTypes = {
	match: PropTypes.object.isRequired,
	currentPlayer: PropTypes.object
};

export default withRouter(StandBy);
