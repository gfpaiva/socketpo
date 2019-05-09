import React, { Component, Fragment } from 'react';

import StandBy from '../StandBy/StandBy';
import InProgress from '../InProgress/InProgress';
import End from '../End/End';
import RoundModal from '../RoundModal/RoundModal';

class Steps extends Component {

	componentDidMount() {
		this.props.subscribeToNewData();
	}

	render() {
		const { currentRound, currentPlayer, showModal, data } = this.props;

		const game = data.GameByHash;
		const rounds = game && game.results.rounds;

		return (
			<div className={`single__content${game && game.status === 2 ? ' page--height-auto' : ''}`}>
				{(game.status === 0 || game.status === 1) && (
					<div className='single__split'>
						{/* WAITING FOR PLAYER */}
						{game.status === 0 && <StandBy currentPlayer={currentPlayer} />}

						{/* GAME IN PROGRESS */}
						{game.status === 1 && (
							<Fragment>
								<InProgress
									currentPlayer={currentPlayer}
									currentRound={currentRound}
								/>

								{showModal && rounds.length > 0 && <RoundModal currentRound={currentRound} />}
							</Fragment>
						)}
					</div>
				)}

				{/* GAME HAS FINISHED */}
				{game.status === 2 && <End />}
			</div>
	);
	}
};

export default Steps;
