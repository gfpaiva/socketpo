import React from 'react';
import { mount } from 'enzyme';
import Modal from './Modal';

describe('<Modal />', () => {
	it('should mount properly with class, props and children', () => {
		const wrapper = mount(
			<Modal
				className="test"
				test="test"
			>
				<p>Test</p>
			</Modal>
		);

		expect(wrapper).toMatchSnapshot();
	});
});
