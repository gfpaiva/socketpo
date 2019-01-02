import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { parseAvatar } from '../../Utils/enums';

import Button from '../Button/Button';
import { Play } from '../Icons/Icons';

import './Player.scss';


class Player extends Component {

	getReady = async e => {
		e.preventDefault();

		const { hash } = this.props.game;

		await this.props.ready({
			variables: {
				hash,
				player: {
					id: this.props.currentPlayer.id
				}
			}
		});
	}

	render() {

		const { game, player, currentPlayer, showReady, children } = this.props;

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
									<Button
										onClick={this.getReady}
										spaced
										medium
									>
										<Play fill="#fff" className="icon icon--mr icon--fix icon--medium" />
										Im Ready
									</Button>
								}
							</p>
						</div>
					)}

					{children ? children : null}
				</div>
			</div>
		);
	}
};

const ready = gql`
	mutation ready($hash: String!, $player: PlayerInput!) {
		ready(hash: $hash, player: $player) {
			hash
		}
	}
`;

export default graphql(ready, {name: 'ready'})(Player);

