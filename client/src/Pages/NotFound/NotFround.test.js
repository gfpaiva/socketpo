import React from 'react';
import { mount } from 'enzyme';
import NotFound from './NotFound';

describe('<NotFound />', () => {

	it('should mount properly', () => {

		const wrapper = mount(<NotFound />);

		expect(wrapper.find('NotFound')).toMatchSnapshot();
	});
});
