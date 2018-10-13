import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Link } from 'react-router-dom';
import { setObject } from '../../Utils/storageAPI';

class Create extends Component {

	state = {
		match: '',
		author: '',
		createdGame: null,
		loading: false
	}

	createGame = async e => {
		e.preventDefault();

		const { match, author } = this.state;

		this.setState({ loading: true });

		const { data } = await this.props.createGame({
			variables: {
				name: `${match}`,
				player: {
					name: author
				}
			}
		});

		const { createGame } = data;

		setObject(`match-${createGame.hash}`, { player: createGame.players[0] });

		this.setState({
			loading: false,
			createdGame: createGame
		});
		// this.props.getGames.refetch();
	}

	changeHandler = e => {
		const { target } = e;

		this.setState({
			[target.name]: target.value
		});
	};

	render() {

		const {
			match,
			author,
			loading,
			createdGame
		} = this.state;

		if(loading) return <p>Loading, please wait</p>

		if(createdGame) return (
			<div className="page page--created">
				<p>Game has been created: </p>
				<p><strong>Name:</strong> {createdGame.name}</p>
				<p><strong>Hash:</strong> {createdGame.hash}</p>
				<p><Link to={`/game/${createdGame.hash}`}>Link</Link></p>
			</div>
		);

		return (
			<div className="page page--create">
				<form onSubmit={this.createGame}>
					<input
						type="text"
						placeholder="Match Name"
						name="match"
						id="match"
						onChange={this.changeHandler}
						value={match}
						required
						autoComplete="off"
					/>
					<br />
					<input
						type="text"
						placeholder="Author Display Name"
						name="author"
						id="author"
						onChange={this.changeHandler}
						value={author}
						required
						autoComplete="off"
					/>
					<br />
					<button type="submit">Create game</button>
				</form>
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
			}
		}
	}
`;

export default graphql(createGame, { name: 'createGame' })(Create);
