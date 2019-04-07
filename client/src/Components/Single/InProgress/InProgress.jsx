import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Query, Mutation } from 'react-apollo';
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

	makePlay = async (e, playValue, play) => {

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

		await play({
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

		return (
			<Query
				query={getGame}
				variables={{
					hash: this.props.match.params.hash
				}}
			>
				{({ data, loading, error }) => {
					if(loading || error) return null

					const game = data.GameByHash;
					const players = game && game.players;

					return (
						players.map(player => (
							<Player
								key={`play-${player.id}`}
								game={game}
								player={player}
								currentPlayer={currentPlayer}
							>
								{!roundPlay[currentRound] && player.id === currentPlayer.id && (
									<Mutation mutation={play}>
										{play => {
											return (
												<div className="single__play-area">
													<p>Make a move: </p>

													<button className='single__play-btn' onClick={e => this.makePlay(e, 1, play)}>
														<Rock />
													</button>

													<button className='single__play-btn' onClick={e => this.makePlay(e, 2, play)}>
														<Paper />
													</button>

													<button className='single__play-btn' onClick={e => this.makePlay(e, 3, play)}>
														<Scissors />
													</button>
											</div>
											)
										}}
									</Mutation>
								)}

								{roundPlay[currentRound] && player.id === currentPlayer.id && (
									<div data-test="inprogress-choosed">
										<Loading />
										<p>You choosed <span className="icon icon--small">{parsePlayIcons(currentRoundMove)}</span></p>
									</div>
								)}

								{player.id !== currentPlayer.id && (
									<div data-test="inprogress-wait">
										<Loading />
										<p>Wait for other player move...</p>
									</div>
								)}

								<RoundsSummary player={player} />
							</Player>
						))
					);
				}}
			</Query>
		)
	}

	static propTypes = {
		match: PropTypes.object.isRequired,
		currentPlayer: PropTypes.object.isRequired,
		currentRound: PropTypes.number
	}
};

export default withRouter(InProgress);
