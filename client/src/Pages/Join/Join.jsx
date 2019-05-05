import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { setObject } from '../../Utils/storageAPI';

import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';
import { Play } from '../../Components/Icons/Icons';
import SelectAvatar from '../../Components/SelectAvatar/SelectAvatar';

import './Join.scss';

const Join = ({ game }) => {

	const [ { player, selectedAvatar }, updateInputData ] = useState({
		player: 'Player 2',
		selectedAvatar: 1
	});

	const changeHandler = e => {
		const { target } = e;

		updateInputData((prevState) => ({
			...prevState,
			[target.name]: target.value
		}));
	};

	const selectAvatar = (e, avatarValue) => {
		e.preventDefault();

		updateInputData((prevState) => ({
			...prevState,
			selectedAvatar: avatarValue
		}));
	};

	const joinMatch = async (e, joinGame) => {
		e.preventDefault();

		const { hash } = game;
		const { data } = await joinGame({
			variables: {
				hash,
				player: {
					name: player,
					avatar: selectedAvatar
				}
			}
		});

		setObject(`match-${hash}`, { player: data.joinGame.players[1] });
		// this.currentPlayer = getObject(`match-${hash}`);
		window.location.reload();
	};

	return (
		<div className="page page--full page--centered page--bg-gradient page--single">
			<Mutation mutation={joinGame}>
				{joinGame => (
					<form onSubmit={e => joinMatch(e, joinGame)} data-test="join-form">
						<h1>{game.name}</h1>
						<p>Want join this match? Enter your name:</p>
						<Input
							type="text"
							placeholder="Player Name"
							name="player"
							id="player"
							onChange={changeHandler}
							value={player}
							required
							autoComplete="off"
						/>

						<SelectAvatar
							selectedAvatar={selectedAvatar}
							selectAvatar={selectAvatar}
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
				)}
			</Mutation>
		</div>
	);
};

Join.propTypes = {
	game: PropTypes.object.isRequired
};

export const joinGame = gql`
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

export default Join;
