import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import CreatedGame from './CreatedGame';
import { fakeGame } from '../../Utils/testUtils';

const game = fakeGame(false);
global.document.execCommand = jest.fn()

describe('<CreatedGame />', () => {

	let wrapper;

	beforeEach(() => {
		wrapper = mount(
			<Router>
				<CreatedGame
					createdGame={game}
				/>
			</Router>
		);
	})

	it('should mount properly', () => {

		expect(wrapper.find('CreatedGame')).toMatchSnapshot();
	});

	it('should handle copy properly', () => {

		wrapper.find('Button').simulate('click');

		expect(wrapper.find('CreatedGame').state().copied).toBeTruthy();
	});
});
