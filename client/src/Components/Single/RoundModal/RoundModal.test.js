import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import RoundModal from './RoundModal';
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

describe('<RoundModal />', () => {

	it('should mount draw properly', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<RoundModal.WrappedComponent
					match={{params: {hash: game.hash}}}
					currentRound={3}
				/>
			</MockedProvider>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('.modal-round__draw')).toMatchSnapshot();
	});

	it('should mount win properly', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<RoundModal.WrappedComponent
					match={{params: {hash: game.hash}}}
					currentRound={1}
				/>
			</MockedProvider>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('.modal-round__win')).toMatchSnapshot();
	});
});
