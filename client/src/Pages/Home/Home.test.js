import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';

describe('<Home />', () => {

	it('should mount properly', () => {

		const wrapper = mount(
			<Router>
				<Home />
			</Router>
		);

		expect(wrapper.find('Home')).toMatchSnapshot();
	});
});
