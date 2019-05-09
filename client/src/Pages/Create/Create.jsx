import React, { useState } from 'react';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import CreatedGame from '../CreatedGame/CreatedGame';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';
import Loading from '../../Components/Loading/Loading';
import SelectAvatar from '../../Components/SelectAvatar/SelectAvatar';
import { Add } from '../../Components/Icons/Icons';

import { setObject } from '../../Utils/storageAPI';

import './Create.scss';

const Create = () => {

	const [ { match, author, selectedAvatar }, updateInputData ] = useState({
		match: '',
		author: 'Player 1',
		selectedAvatar: 1
	});
	const [ createdGame, updateCreatedGame ] = useState(null);

	const createGameSubmit = async (e, createGame) => {
		e.preventDefault();

		const { data } = await createGame({
			variables: {
				name: `${match}`,
				player: {
					name: author,
					avatar: selectedAvatar
				}
			}
		});

		setObject(`match-${data.createGame.hash}`, { player: data.createGame.players[0] });

		updateCreatedGame(data.createGame);
	};

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

	return (
		<div className="page page--full page--centered page--bg-gradient page--create">
			<Mutation mutation={createGame}>
				{(createGame, { loading }) => (
					<div>
						{loading && <Loading />}

						{!loading && createdGame && (
							<CreatedGame {...{createdGame}} />
						)}

						{!loading && !createdGame && (
							<form onSubmit={e => createGameSubmit(e, createGame)} data-test="create-form">
								<h1>Create a new game</h1>
								<Input
									type="text"
									placeholder="Match Name"
									name="match"
									id="match"
									onChange={changeHandler}
									value={match}
									required
									autoComplete="off"
								/>

								<Input
									type="text"
									placeholder="Player Name"
									name="author"
									id="author"
									onChange={changeHandler}
									value={author}
									required
									autoComplete="off"
								/>

								<SelectAvatar
									selectedAvatar={selectedAvatar}
									selectAvatar={selectAvatar}
								/>

								<Button
									type="submit"
									medium
									spaced
								>
									<Add fill="#fff" className="icon icon--mr icon--fix icon--medium" />
									Create Game
								</Button>
							</form>
						)}
					</div>
				)}
			</Mutation>
		</div>
	);
};

export const createGame = gql`
	mutation createGame($name: String!, $player: PlayerInput) {
		createGame(name: $name, player: $player) {
			id
			hash
			name
			players {
				id
				name
				avatar
			}
		}
	}
`;

export default Create;
