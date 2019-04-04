import React from 'react';
import { mount } from 'enzyme';
import Loading from './Loading';

describe('<Loading />', () => {
	it('should mount properly with props', () => {
		const wrapper = mount(
			<Loading test="test"/>
		);

		expect(wrapper).toMatchSnapshot();
	});
});
