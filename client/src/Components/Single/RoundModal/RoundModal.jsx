import React, { Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { getGame } from '../../../Utils/graphqlAPI';
import { parsePlayIcons, parseAvatar } from '../../../Utils/enums';

import Modal from '../../Modal/Modal';
import {
	Draw,
	Win,
} from '../../Icons/Icons';

import './RoundModal.scss';

const RoundModal = ( { getGame, currentRound } ) => {

	const game = getGame.GameByHash;
	const rounds = game && game.results.rounds;

	return (
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
	);
};

export default withRouter(compose(
	graphql(getGame, {
		name: 'getGame',
		options: props => ({ variables: { hash: props.match.params.hash } })
	}),
)(RoundModal));
