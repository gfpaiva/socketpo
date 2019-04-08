import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import Single from './Single';
import { getGame } from '../../Utils/graphqlAPI';
import { fakeGame, fakePlayer, fakeRound } from '../../Utils/testUtils';

const game = fakeGame(
	false,
	fakePlayer(),
	[
		fakeRound(),
		fakeRound({ winner: fakePlayer({ id: 'player02', name: 'Player 02' }) }),
		fakeRound({ isDraw: true })
	]
);
const mocks = [
	{
		request: { query: getGame, variables: { hash: game.hash } },
		result: {
			data: {
				GameByHash: {
					...game
				}
			}
		},
	},
];

describe('<Single />', () => {

	it('should mount properly', async () => {
		const wrapper = mount(
			<Router>
				<MockedProvider mocks={mocks}>
					<Single
						match={{params: {hash: game.hash}}}
					/>
				</MockedProvider>
			</Router>
		);

		await wait();
		wrapper.update();

		console.log(wrapper.debug());
	});
});
