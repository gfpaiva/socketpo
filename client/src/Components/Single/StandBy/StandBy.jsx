import React, { Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { getGame } from '../../../Utils/graphqlAPI';

import Loading from '../../Loading/Loading';
import Player from '../../Player/Player';

const StandBy = ( { getGame, currentPlayer } ) => {

	const game = getGame.GameByHash;
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
				<div className='single__player'>
					<div>
						<Loading />
						<p>Wating for other player</p>
					</div>
				</div>
			)}
		</Fragment>
	);
};

export default withRouter(compose(
	graphql(getGame, {
		name: 'getGame',
		options: props => ({ variables: { hash: props.match.params.hash } })
	}),
)(StandBy));
