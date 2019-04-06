import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Alerts from './Alerts';

describe('<Alerts />', () => {

	it('should mount "loading" properly', () => {
		const wrapper = mount(
			<Router>
				<Alerts
					type="Loading"
				/>
			</Router>
		);

		expect(wrapper.find('Alerts')).toMatchSnapshot();
	});

	it('should mount "not found" properly', () => {
		const wrapper = mount(
			<Router>
				<Alerts
					type="Not Found"
				/>
			</Router>
		);

		expect(wrapper.find('Alerts')).toMatchSnapshot();
	});

	it('should mount "full" properly', () => {
		const wrapper = mount(
			<Router>
				<Alerts
					type="Full"
				/>
			</Router>
		);

		expect(wrapper.find('Alerts')).toMatchSnapshot();
	});
});
