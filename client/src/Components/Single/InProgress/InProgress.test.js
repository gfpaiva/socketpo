import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import InProgress from './InProgress';
import { getGame, play } from '../../../Utils/graphqlAPI';
import { fakeGame, fakePlayer} from '../../../Utils/testUtils';

// Mock play and pause on audio tags
Object.defineProperty(document, 'querySelector', {
	value: jest.fn().mockReturnValue({ play: jest.fn(), pause: jest.fn() })
});

const game = fakeGame();
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
	{
		request: {
			query: play,
			variables: {
				hash: game.hash,
				player: {
					id: player.id
				},
				play: 2
			}
		},
		result: {
			data: {
				GameByHash: {
					...game
				}
			}
		},
	},
];

describe('<InProgress />', () => {

	it('should mount whithout round play properly', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<Router>
					<InProgress.WrappedComponent
						match={{params: {hash: game.hash}}}
						currentPlayer={{id: player.id}}
					/>
				</Router>
			</MockedProvider>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('.single__play-area')).toHaveLength(1);
		expect(wrapper.find('[data-test="inprogress-wait"]')).toHaveLength(1);
	});

	it('should handle play move', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<Router>
					<InProgress.WrappedComponent
						match={{params: {hash: game.hash}}}
						currentPlayer={{id: player.id}}
						currentRound={0}
					/>
				</Router>
			</MockedProvider>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('[data-test="inprogress-choosed"]')).toHaveLength(0);

		wrapper.find('.single__play-btn').at(1).simulate('click');

		expect(wrapper.find('[data-test="inprogress-choosed"]')).toHaveLength(1);
	});
});
