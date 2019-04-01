import React from 'react';
import { mount } from 'enzyme';
import Button from './Button';

describe('<Button />', () => {
	it('should mount properly', () => {
		const wrapper = mount(<Button />);
		expect(wrapper).toMatchSnapshot();
	});

	it('should mount with children properly', () => {
		const wrapper = mount(<Button>Test</Button>);
		expect(wrapper).toMatchSnapshot();
	});

	it('should mount with props "className, medium, big, spaced, secondary, mx, onClick"', () => {
		const wrapper = mount(
			<Button
				className="test"
				medium
				big
				spaced
				secondary
				mx
				onClick={jest.fn()}
			>
				Test
			</Button>
		);
		expect(wrapper).toMatchSnapshot();
	});

	it('should button to be "clickable"', () => {
		const mockFn = jest.fn();
		const wrapper = mount(
			<Button
				onClick={mockFn}
			>
				Test
			</Button>
		);

		wrapper.find('button').simulate('click');
		expect(mockFn).toHaveBeenCalled();
	});
});
