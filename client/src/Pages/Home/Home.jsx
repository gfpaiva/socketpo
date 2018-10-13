import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Link } from 'react-router-dom';

class App extends Component {

	render() {
		const { Games, loading } = this.props.getGames;

		if(loading) return <p>Loading, please wait</p>

		return (
			<div className="page page--home">
				<Link to="/create">Create a new one</Link>
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

export default graphql(getGames, { name: 'getGames' })(App);
