import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import StandBy from './StandBy';
import { getGame } from '../../../Utils/graphqlAPI';
import { fakeGame, fakePlayer } from '../../../Utils/testUtils';

const game = fakeGame();
const player = fakePlayer();
const mocks = (full = true) => [
	{
		request: { query: getGame, variables: { hash: game.hash } },
		result: {
			data: {
				GameByHash: {
					...fakeGame(full)
				}
			}
		},
	},
];

describe('<StandBy />', () => {

	it('should mount one player match properly', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks(false)}>
				<StandBy.WrappedComponent
					match={{params: {hash: game.hash}}}
					currentPlayer={player}
				/>
			</MockedProvider>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('Player')).toHaveLength(1);
		expect(wrapper.find('[data-test="waiting"]')).toHaveLength(1);
	});

	it('should mount two player match properly', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks(true)}>
				<StandBy.WrappedComponent
					match={{params: {hash: game.hash}}}
					currentPlayer={player}
				/>
			</MockedProvider>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('Player')).toHaveLength(2);
		expect(wrapper.find('[data-test="waiting"]')).toHaveLength(0);
	});
});
