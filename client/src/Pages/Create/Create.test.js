import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import Create, { createGame } from './Create';
import { fakeGame, fakePlayer } from '../../Utils/testUtils';

const game = fakeGame(false);
const player = fakePlayer();
const mocks = [
	{
		request: {
			query: createGame,
			variables: {
				name: game.name,
				player: {
					name: player.name,
					avatar: 1
				}
			}
		},
		result: {
			data: {
				createGame: {
					...game
				}
			}
		},
	},
];

describe('<Create />', () => {

	let wrapper;

	beforeEach(() => {
		wrapper = mount(
			<Router>
				<MockedProvider mocks={mocks}>
					<Create />
				</MockedProvider>
			</Router>
		);
	})

	it('should mount properly', () => {

		expect(wrapper.find('[data-test="create-form"]')).toHaveLength(1)
	});

	it('should fill the form properly', () => {

		wrapper
			.find('input#match')
			.simulate('change', { target: { value: game.name, name: 'match' } });

		wrapper
			.find('input#author')
			.simulate('change', { target: { value: player.name, name: 'author' } });

		expect(wrapper.find('Create').state().match).toBe(game.name);
		expect(wrapper.find('Create').state().author).toBe(player.name);
	});

	it('should submit the form properly', async () => {

		wrapper
			.find('input#match')
			.simulate('change', { target: { value: game.name, name: 'match' } });

		wrapper
			.find('input#author')
			.simulate('change', { target: { value: player.name, name: 'author' } });

		wrapper
			.find('form')
			.simulate('submit');

		await wait();
		wrapper.update();

		expect(wrapper.find('Create').state().createdGame).toMatchObject(game);
	});
});
