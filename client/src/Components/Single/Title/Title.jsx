import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

import { parseStatus } from '../../../Utils/enums';
import { sanitize } from '../../../Utils/helpers';

import GetGame from '../../GetGame/GetGame';

import './Title.scss';

const Title = ( { match } ) => {

	return (
		<GetGame hash={match.params.hash}>
			{data => {

				const game = data.GameByHash;

				return (
					<div className="single__title">
						<p>{game.name}</p>
						<p>
							<strong>Status: </strong>{parseStatus(game.status)}
							<span className={`single__status single__status--${sanitize(parseStatus(game.status))}`}></span>
						</p>
					</div>
				);
			}}
		</GetGame>
	);
};

Title.propTypes = {
	match: PropTypes.object.isRequired
}

export default withRouter(Title);
