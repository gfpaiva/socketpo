import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { getObject, setObject } from '../../Utils/storageAPI';

import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';
import { Play } from '../../Components/Icons/Icons';
import SelectAvatar from '../../Components/SelectAvatar/SelectAvatar';

import './Join.scss';

class Join extends Component {

	state = {
		player: 'Player 2',
		selectedAvatar: 1
	};

	changeHandler = e => {
		const { target } = e;

		this.setState({
			[target.name]: target.value
		});
	};

	selectAvatar = (e, avatarValue) => {
		e.preventDefault();

		this.setState({
			selectedAvatar: avatarValue
		});
	};

	joinMatch = async e => {
		e.preventDefault();

		const { player } = this.state;
		const { hash } = this.props.game;
		const { data } = await this.props.joinGame({
			variables: {
				hash,
				player: {
					name: player,
					avatar: this.state.selectedAvatar
				}
			}
		});
		const { joinGame } = data;

		setObject(`match-${hash}`, { player: joinGame.players[1] });
		this.currentPlayer = getObject(`match-${hash}`);
		window.location.reload();
	};

	render() {

		const { player, selectedAvatar } = this.state;
		const { game } = this.props;

		return (
			<div className="page page--full page--centered page--bg-gradient page--single">
				<form onSubmit={this.joinMatch}>
					<h1>{game.name}</h1>
					<p>Want join this match? Enter your name:</p>
					<Input
						type="text"
						placeholder="Player Name"
						name="player"
						id="player"
						onChange={this.changeHandler}
						value={player}
						required
						autoComplete="off"
					/>

					<SelectAvatar
						selectedAvatar={selectedAvatar}
						selectAvatar={this.selectAvatar}
					/>

					<Button
						type="submit"
						spaced
						medium
					>
						<Play fill="#fff" className="icon icon--mr icon--fix icon--medium" />
						Join game
					</Button>
				</form>
			</div>
		);
	}
}

const joinGame = gql`
	mutation joinGame($hash: String!, $player: PlayerInput!) {
		joinGame(hash: $hash, player: $player) {
			hash
			players {
				id
				name
				avatar
			}
		}
	}
`;

export default graphql(joinGame, {name: 'joinGame'})(Join);
