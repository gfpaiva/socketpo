import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';

describe('<Header />', () => {

	it('should mount properly', () => {
		const wrapper = mount(
			<Router>
				<Header />
			</Router>
		);

		expect(wrapper.find('Header')).toMatchSnapshot();
	});
});
