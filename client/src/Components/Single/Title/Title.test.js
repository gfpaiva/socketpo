import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import Title from './Title';
import { getGame } from '../../../Utils/graphqlAPI';
import { fakeGame } from '../../../Utils/testUtils';

const game = fakeGame();
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

describe('<Title />', () => {

	it('should mount properly', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<Title.WrappedComponent match={{params: {hash: game.hash}}} />
			</MockedProvider>
		);

		await wait();
		wrapper.update();

		expect(wrapper.find('.single__title')).toMatchSnapshot();
	});
});
