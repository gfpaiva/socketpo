import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import RoundsSummary from './RoundsSummary';
import { getGame } from '../../../Utils/graphqlAPI';
import { fakeGame, fakePlayer, fakeRound } from '../../../Utils/testUtils';

const game = fakeGame(
	true,
	null,
	[
		fakeRound(),
		fakeRound({ winner: fakePlayer({ id: 'player02', name: 'Player 02' }) }),
		fakeRound({ isDraw: true })
	]
);
const player = fakePlayer();
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

describe('<RoundsSummary />', () => {

	it('should mount properly (Win, Lose, Draw)', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<RoundsSummary.WrappedComponent
					match={{params: {hash: game.hash}}}
					player={player}

				/>
			</MockedProvider>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('[data-test="summary"]')).toMatchSnapshot();
	});
});
