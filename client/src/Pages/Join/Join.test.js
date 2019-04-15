import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import Join, { joinGame } from './Join';
import { fakeGame, fakePlayer } from '../../Utils/testUtils';

global.window.location.reload = jest.fn();

const game = fakeGame(false);
const player = fakePlayer();
const mocks = [
	{
		request: {
			query: joinGame,
			variables: {
				hash: game.hash,
				player: {
					name: player.name,
					avatar: 1
				}
			}
		},
		result: {
			data: {
				joinGame: {
					...game
				}
			}
		},
	},
];

describe('<Join />', () => {

	let wrapper;

	beforeEach(() => {
		wrapper = mount(
			<Router>
				<MockedProvider mocks={mocks}>
					<Join
						game={game}
					/>
				</MockedProvider>
			</Router>
		);
	})

	it('should mount properly', () => {

		expect(wrapper.find('[data-test="join-form"]')).toHaveLength(1)
	});

	it('should fill the form properly', () => {

		wrapper
			.find('input#player')
			.simulate('change', { target: { value: player.name, name: 'player' } });

		expect(wrapper.find('Join').state().player).toBe(player.name);
	});

	it('should submit the form properly', async () => {

		wrapper
			.find('input#player')
			.simulate('change', { target: { value: player.name, name: 'player' } });

		wrapper
			.find('form')
			.simulate('submit');

		await wait(100);
		wrapper.update();

		expect(window.location.reload).toHaveBeenCalled();
	});
});
