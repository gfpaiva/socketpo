import React from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { parseStatus } from '../../../Utils/enums';
import { sanitize } from '../../../Utils/helpers';
import { getGame } from '../../../Utils/graphqlAPI';

import './Title.scss';

const Title = ( { match } ) => {

	return (
		<Query
			query={getGame}
			variables={{
				hash: match.params.hash
			}}
		>
			{({ data, loading, error }) => {
				if(loading || error) return null;

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
		</Query>
	);
};

Title.propTypes = {
	match: PropTypes.object.isRequired
}

export default withRouter(Title);
