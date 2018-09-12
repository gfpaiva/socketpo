import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentWillReceiveProps(nextProps) {
    console.log('💣💣💣💣', nextProps);
  }

  createGame = e => {
    e.preventDefault();

    this.props.createGame({
      variables: {
        name: `Match random: ${Math.floor(Math.random() * 100)}`
      }
    })
    .then(res => {
      console.log('⌛⌛⌛⌛ MUTATION RES', res);
      this.props.getGames.refetch();
    })
  }

  render() {
    const { Games } = this.props.getGames;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.createGame}>Create a random named game</button>
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

const testSub = gql`
  subscription test($id: ID!) {
    justTesting(id: $id) {
      id
      name
      hash
    }
  }
`;

export default compose(
    graphql(getGames, {name: 'getGames'}),
    graphql(createGame, {name: 'createGame'}),
    graphql(testSub, {
      name: 'testSub',
      withRef:true,
      options: {
        variables: { id: 1 }
      }
    })
  )(App);
