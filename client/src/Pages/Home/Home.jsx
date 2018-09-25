import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class App extends Component {

	state = {
		match: ''
	}

	componentWillMount() {
		this.props.getGames.subscribeToMore({
			document: gameSub,
			variables: { hash: '1' },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				console.log('😅😅😅😅', prev, subscriptionData);

				const newGame = subscriptionData.data.gameSubscription;
				return {
					Games: [
						...prev.Games,
						newGame
					]
				}
			}
		})
	}

	componentWillReceiveProps(nextProps) {
		console.log('💣💣💣💣', nextProps);
	}

	createGame = e => {
		e.preventDefault();

		const { match } = this.state;

		this.props.createGame({
			variables: {
				name: `${match}`
			}
		})
		.then(res => {
			console.log('⌛⌛⌛⌛ MUTATION RES', res);
			// this.props.getGames.refetch();
		})
	}

	changeHandler = e => {
		const { target } = e;

		this.setState({
			[target.name]: target.value
		});
	};

	render() {
		const { Games } = this.props.getGames;
		const { match } = this.state;

		return (
			<div className="App">

				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
				<form onSubmit={this.createGame}>
					<input
						type="text"
						placeholder="Match Name"
						name="match"
						id="match"
						onChange={this.changeHandler}
						value={match}
						required
					/>
					<button type="submit">Create a random game</button>
				</form>
				{Games && Games.length > 0 && (
					<div>
						<p>Here are the games folks:</p>
						{Games.map(game => (
							<div key={game.id}>
								<p>
									<strong>GameID</strong>: {game.id} <br/>
									<strong>GameHash</strong>: {game.hash} <br/>
									<strong>GameName</strong>: {game.name} <br/>
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
}

const getGames = gql`
	query getGames {
		Games {
			id
			name
			hash
		}
	}
`;

const createGame = gql`
	mutation createGame($name: String!) {
		createGame(name: $name) {
			id
			hash
			name
		}
	}
`;

const gameSub = gql`
	subscription gameSub($hash: String!) {
		gameSubscription(hash: $hash) {
			id
			name
			hash
		}
	}
`;

export default compose(
		graphql(getGames, { name: 'getGames' }),
		graphql(createGame, { name: 'createGame' })
	)(App);
