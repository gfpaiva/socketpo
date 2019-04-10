import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import Single from './Single';
import { getGame, gameSub } from '../../Utils/graphqlAPI';
import { fakeGame, fakePlayer, fakeRound } from '../../Utils/testUtils';

const game = fakeGame(
	true,
	fakePlayer(),
	[
		fakeRound(),
		fakeRound({ winner: fakePlayer({ id: 'player02', name: 'Player 02' }) }),
		fakeRound({ isDraw: true })
	],
	{ status: 1 }
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
	{
		request: { query: gameSub, variables: { hash: game.hash } },
		result: {
			data: {
				gameSubscription: {
					__typename: "GameSub",
					game : {
						...game
					},
					message: '',
					hash: game.hash,
					player: player.name
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

		const SingleInstance = wrapper.find('Single').instance();

		SingleInstance.currentPlayer = player;

		await wait();
		wrapper.update();

		expect(wrapper.find('.single__split').length).toBe(1);
	});
});
