import React from 'react';
import { mount } from 'enzyme';
import Input from './Input';

describe('<Input />', () => {
	it('should mount properly with class and props', () => {
		const wrapper = mount(
			<Input
				className="test"
				type="text"
			/>
		);

		expect(wrapper).toMatchSnapshot();
	});
});
