import React from 'react';
import PropTypes from 'prop-types';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { parseAvatar } from '../../Utils/enums';

import Button from '../Button/Button';
import { Play } from '../Icons/Icons';

import './Player.scss';

const Player = ({ game, player, currentPlayer, showReady, children }) => {

	const getReady = async (e, ready) => {
		e.preventDefault();

		const { hash } = game;

		return await ready({
			variables: {
				hash,
				player: {
					id: currentPlayer.id
				}
			}
		});
	};

	return (
		<div className={`single__player${player.id === currentPlayer.id ? ' single__player--me' : ''}`}>
			<div className="single__player-container">
				<div>
					<div className="single__player-avatar">
						{parseAvatar(player.avatar)}
					</div>
					<p className='single__player-name'>{player.name}</p>
				</div>

				{/* TO-DO: Improve component split */}
				{showReady && (
					<div>
						<p>{player.ready ? 'Im ready' : 'Getting Ready'}<span className={`single__player-ready ${player.ready ? 'single__player-ready--on' : 'single__player-ready--off'}`}></span></p>
						<p>
							{
								game.players.length === 2 &&
								!player.ready &&
								player.id === currentPlayer.id &&
								<Mutation mutation={ready}>
									{(ready, { loading }) => (
										<Button
											onClick={e => !loading && getReady(e, ready)}
											spaced
											medium
										>
											<Play fill="#fff" className="icon icon--mr icon--fix icon--medium" />
											{loading ? 'Getting Ready' : 'Im Ready'}
										</Button>
									)}
								</Mutation>
							}
						</p>
					</div>
				)}

				{children ? children : null}
			</div>
		</div>
	);
};

Player.propTypes = {
	game: PropTypes.object.isRequired,
	player: PropTypes.object.isRequired,
	currentPlayer: PropTypes.object.isRequired,
	showReady: PropTypes.bool
};

export const ready = gql`
	mutation ready($hash: String!, $player: PlayerInput!) {
		ready(hash: $hash, player: $player) {
			hash
		}
	}
`;

export default Player;

