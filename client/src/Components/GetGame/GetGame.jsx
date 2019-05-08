import React from 'react';

import { Query } from 'react-apollo';

import { getGame } from '../../Utils/graphqlAPI';

const GetGame = ( { hash, children } ) => {

	return (
		<Query
			query={getGame}
			variables={{ hash }}
		>
			{({ data, loading, error }) => {
				if(loading || error) return null;

				children(data);
			}}
		</Query>
	);
};

export default GetGame;
