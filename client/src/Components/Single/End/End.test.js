import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import End from './End';
import { getGame } from '../../../Utils/graphqlAPI';
import { fakeGame, fakePlayer, fakeRound } from '../../../Utils/testUtils';

const game = fakeGame(
	true,
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

describe('<End />', () => {

	it('should mount draw properly', async () => {
		const wrapper = mount(
			<Router>
				<MockedProvider mocks={mocks}>
					<End.WrappedComponent
						match={{params: {hash: game.hash}}}
						currentRound={3}
					/>
				</MockedProvider>
			</Router>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('.single__win')).toMatchSnapshot();
	});
});
