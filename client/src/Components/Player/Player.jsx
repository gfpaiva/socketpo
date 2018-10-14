import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { parseAvatar } from '../../Utils/enums';

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

		const { game, player, currentPlayer } = this.props;

		return (
			<div className={`single__player${player.id === currentPlayer.id ? ' single__player--me' : ''}`}>
				<div>
					<div class="single__player-avatar">
						{parseAvatar(player.avatar)}
					</div>
					<p className='single__player-name'>{player.name}</p>
					<p>{player.ready ? 'Im ready' : 'Getting Ready'}</p>
					<p>
						{
							game.players.length === 2 &&
							!player.ready &&
							player.id === currentPlayer.id &&
							<button onClick={this.getReady}>Im Ready</button>
						}
					</p>
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

