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
				hash: game.hash
			}
		},
	},
];

describe('<Player />', () => {
	it('should mount properly with class, props and children', () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<Player
					game={game}
					player={player}
					currentPlayer={player}
				/>
			</MockedProvider>
		);

		console.log("TCL: wrapper", wrapper.find('Player').debug())
		// expect(wrapper).toMatchSnapshot();
	});
});
