import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import CreatedGame from '../CreatedGame/CreatedGame';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';
import Loading from '../../Components/Loading/Loading';
import Add from '../../Components/Icons/Add';

import { setObject } from '../../Utils/storageAPI';
import { parseAvatar } from '../../Utils/enums';

import './Create.scss';

class Create extends Component {

	state = {
		match: '',
		author: 'Player 1',
		createdGame: null,
		loading: false,
		selectedAvatar: 1
	}

	createGame = async e => {
		e.preventDefault();

		const { match, author, selectedAvatar } = this.state;

		this.setState({ loading: true });

		const { data } = await this.props.createGame({
			variables: {
				name: `${match}`,
				player: {
					name: author,
					avatar: selectedAvatar
				}
			}
		});

		const { createGame } = data;

		setObject(`match-${createGame.hash}`, { player: createGame.players[0] });

		this.setState({
			loading: false,
			createdGame: createGame
		});
	}

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
	}

	render() {

		const {
			match,
			author,
			loading,
			createdGame,
			selectedAvatar
		} = this.state;

		return (
			<div className="page page--full page--centered page--bg-gradient page--create">
				<div>
					{loading && <Loading />}

					{!loading && createdGame && (
						<CreatedGame {...{createdGame}} />
					)}

					{!loading && !createdGame && (
						<form onSubmit={this.createGame}>
							<h1>Create a new game</h1>
							<Input
								type="text"
								placeholder="Match Name"
								name="match"
								id="match"
								onChange={this.changeHandler}
								value={match}
								required
								autoComplete="off"
							/>

							<Input
								type="text"
								placeholder="Player Name"
								name="author"
								id="author"
								onChange={this.changeHandler}
								value={author}
								required
								autoComplete="off"
							/>

							<div>
								<p>Select an avatar: </p>

								{[1, 2, 3, 4].map(avatarValue => (
									<button
										key={avatarValue}
										className={`select-avatar${selectedAvatar === avatarValue ? ' select-avatar--active' : ''}`}
										onClick={e => this.selectAvatar(e, avatarValue)}
									>
										{parseAvatar(avatarValue)}
									</button>
								))}
							</div>

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
			</div>
		);
	}
}

const createGame = gql`
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

export default graphql(createGame, { name: 'createGame' })(Create);
