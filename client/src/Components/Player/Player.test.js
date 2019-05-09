import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import Player, { ready } from './Player';
import { fakeGame, fakePlayer } from '../../Utils/testUtils';

const game = fakeGame();
const player = fakePlayer();

const mocks = [
	{
		request: { query: ready, variables: { hash: game.hash, player: {id: player.id} } },
		result: {
			data: {
				ready: {
					__typename: 'Game',
					hash: 'test'
				}
			}
		},
	},
];

describe('<Player />', () => {
	it('should mount same player properly (getting ready and ready)', () => {
		const wrapperReadySamePlayer = mount(
			<MockedProvider>
				<Player
					game={game}
					player={player}
					currentPlayer={player}
					showReady
				/>
			</MockedProvider>
		);

		const wrapperNotReadySamePlayer = mount(
			<MockedProvider>
				<Player
					game={game}
					player={fakePlayer({ ready: true })}
					currentPlayer={player}
					showReady
				/>
			</MockedProvider>
		);

		expect(wrapperReadySamePlayer.find('Player')).toMatchSnapshot();
		expect(wrapperNotReadySamePlayer.find('Player')).toMatchSnapshot();
	});

	it('should mount other player properly (getting ready and ready)', () => {
		const wrapperReadyOtherPlayer = mount(
			<MockedProvider>
				<Player
					game={game}
					player={player}
					currentPlayer={ { id: 'player02' } }
					showReady
				/>
			</MockedProvider>
		);

		const wrapperNotReadyOtherPlayer = mount(
			<MockedProvider>
				<Player
					game={game}
					player={fakePlayer({ ready: true })}
					currentPlayer={ { id: 'player02' } }
					showReady
				/>
			</MockedProvider>
		);

		expect(wrapperReadyOtherPlayer.find('Player')).toMatchSnapshot();
		expect(wrapperNotReadyOtherPlayer.find('Player')).toMatchSnapshot();
	});

	it('should call handler when click', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<Player
					game={game}
					player={player}
					currentPlayer={player}
					showReady
				/>
			</MockedProvider>
		);

		expect(wrapper.find('Button').text()).toBe('Im Ready');

		wrapper.find('Button').simulate('click');

		expect(wrapper.find('Button').text()).toBe('Getting Ready');
	});
});
