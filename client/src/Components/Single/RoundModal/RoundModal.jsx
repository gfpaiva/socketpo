import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

import { parsePlayIcons, parseAvatar } from '../../../Utils/enums';

import GetGame from '../../GetGame/GetGame';
import Modal from '../../Modal/Modal';
import {
	Draw,
	Win,
} from '../../Icons/Icons';

import './RoundModal.scss';

const RoundModal = ( { match, currentRound } ) => {

	return (
		<GetGame hash={match.params.hash}>
			{data => {

				const game = data.GameByHash;
				const rounds = game && game.results.rounds;
				const currentRoundIdx = currentRound;
				const currentRoundObj = rounds[currentRoundIdx-1]

				return (
					<Modal className='modal-round'>
						<p className='modal-round__title'>Round {currentRoundIdx}</p>
						{currentRoundObj.isDraw ? (
							<div className='modal-round__draw'>
								<div className='modal-round__draw-icon'>
									<span className='icon icon--big'>
										<Draw />
									</span>
								</div>
								<p>This round has finished with a draw</p>
								<div className='modal-round__plays'>
									{currentRoundObj.plays.map(( { play, player }, idx ) => (
										<p key={idx} className='card modal-round__play'>
											{player.name} <br /> <span className='icon icon--small'>{parsePlayIcons(play)}</span>
										</p>
									))}
								</div>
							</div>
						) : (
							<div className='modal-round__win'>
								{currentRoundObj.winner && (
									<Fragment>
										<div className='modal-round__win-icon'>
											<span className="icon icon--big">
												<Win />
											</span>
										</div>
										<div className='modal-round__win-avatar'>
											{parseAvatar(currentRoundObj.winner.avatar)}
										</div>
										<p>
											<span role="img" aria-label="Party Popper">🎉</span>
											<strong>{currentRoundObj.winner.name}</strong> win this round!
											<span role="img" aria-label="Party Popper">🎉</span>
										</p>
										<div className='modal-round__plays'>
											{currentRoundObj.plays.map(( { play, player }, idx ) => (
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
			}}
		</GetGame>
	);
};

RoundModal.propTypes = {
	match: PropTypes.object.isRequired,
	currentRound: PropTypes.number.isRequired
}

export default withRouter(RoundModal);
