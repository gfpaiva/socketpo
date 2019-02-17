import React from 'react';

import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { parseStatus } from '../../../Utils/enums';
import { sanitize } from '../../../Utils/helpers';
import { getGame } from '../../../Utils/graphqlAPI';

import './Title.scss';

const Title = ( { getGame } ) => {

	const game = getGame.GameByHash

	return (
		<div className="single__title">
			<p>{game.name}</p>
			<p>
				<strong>Status: </strong>{parseStatus(game.status)}
				<span className={`single__status single__status--${sanitize(parseStatus(game.status))}`}></span>
			</p>
		</div>
	);
}

export default withRouter(compose(
	graphql(getGame, {
		name: 'getGame',
		options: props => ({ variables: { hash: props.match.params.hash } })
	}),
)(Title));
