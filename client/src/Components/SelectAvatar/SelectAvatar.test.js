import React from 'react';
import { mount } from 'enzyme';
import SelectAvatar from './SelectAvatar';

describe('<SelectAvatar />', () => {

	let wrapper;

	beforeEach(() => {
		wrapper = mount(
			<SelectAvatar
				selectedAvatar={1}
				selectAvatar={jest.fn()}
			/>
		);
	});

	it('should mount properly', () => {
		expect(wrapper).toMatchSnapshot();
	});

	it('should mount with right hightlight', () => {
		wrapper = mount(
			<SelectAvatar
				selectedAvatar={2}
				selectAvatar={jest.fn()}
			/>
		);

		expect(wrapper).toMatchSnapshot();
	});

	it('should call handler select avatar', () => {
		wrapper.find('button.select-avatar').at(2).simulate('click');
		expect(wrapper.props().selectAvatar).toHaveBeenCalled();
	});
});
