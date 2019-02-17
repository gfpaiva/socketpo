import React, { Component } from 'react';


import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { parsePlayIcons } from '../../../Utils/enums';
import { getGame, play } from '../../../Utils/graphqlAPI';
import { getObject, setObject } from '../../../Utils/storageAPI';

import Loading from '../../Loading/Loading';
import Player from '../../Player/Player';
import RoundsSummary from '../RoundsSummary/RoundsSummary';
import {
	Rock,
	Paper,
	Scissors
} from '../../Icons/Icons';

import './InProgress.scss';

class InProgress extends Component {

	localMatch = getObject(`match-${this.props.match.params.hash}`);

	audio = {
		select: null,
	};

	state = {
		roundPlay: this.localMatch && this.localMatch.roundPlay ? this.localMatch.roundPlay : [],
		currentRoundMove: ''
	}

	componentDidMount() {

		this.audio = {
			select: document.querySelector('#audio-select')
		}
	}

	makePlay = async (e, playValue) => {

		e && e.preventDefault();

		const { hash } = this.props.match.params;
		const { currentPlayer } = this.props;

		this.setState(prevState => {

			const roundPlay = prevState.roundPlay.concat(true);
			const currentRoundMove = playValue;

			return { roundPlay, currentRoundMove }
		}, () => {

			setObject(`match-${hash}`, {
				...getObject(`match-${hash}`),
				roundPlay: this.state.roundPlay
			});

			this.audio.select.play();
		});

		await this.props.play({
			variables: {
				hash,
				player: {
					id: currentPlayer.id
				},
				play: playValue
			}
		});
	}

	render() {

		const { roundPlay, currentRoundMove } = this.state;
		const { currentRound, currentPlayer } = this.props;
		const { GameByHash } = this.props.getGame;

		const game = GameByHash;
		const players = game && game.players;

		return players.map(player => (
				<Player
					key={`play-${player.id}`}
					game={game}
					player={player}
					currentPlayer={currentPlayer}
				>
					{!roundPlay[currentRound] && player.id === currentPlayer.id && (
						<div className="single__play-area">
							<p>Make a move: </p>

							<button className='single__play-btn' onClick={e => this.makePlay(e, 1)}>
								<Rock />
							</button>

							<button className='single__play-btn' onClick={e => this.makePlay(e, 2)}>
								<Paper />
							</button>

							<button className='single__play-btn' onClick={e => this.makePlay(e, 3)}>
								<Scissors />
							</button>
						</div>
					)}

					{roundPlay[currentRound] && player.id === currentPlayer.id && (
						<div>
							<Loading />
							<p>You choosed <span className="icon icon--small">{parsePlayIcons(currentRoundMove)}</span></p>
						</div>
					)}

					{player.id !== currentPlayer.id && (
						<div>
							<Loading />
							<p>Wait for other player move...</p>
						</div>
					)}

					<RoundsSummary player={player} />
				</Player>
			));
		}
};

export default withRouter(compose(
	graphql(getGame, {
		name: 'getGame',
		options: props => ({ variables: { hash: props.match.params.hash } })
	}),
	graphql(play, {name: 'play'}),
)(InProgress));
