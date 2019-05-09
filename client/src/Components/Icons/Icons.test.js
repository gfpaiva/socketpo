import React, { Fragment } from 'react';
import { mount } from 'enzyme';
import * as Icons from './Icons.jsx'


describe('Icons', () => {
	it('should mount all icons properly', () => {
		const wrapper = mount(
			<Fragment>
				<Icons.Add />
				<Icons.Champion />
				<Icons.Draw />
				<Icons.Lose />
				<Icons.Paper />
				<Icons.Play />
				<Icons.Rock />
				<Icons.Scissors />
				<Icons.SoundOff />
				<Icons.SoundOn />
				<Icons.Time />
				<Icons.Win />
			</Fragment>
		);

		expect(wrapper).toMatchSnapshot();
	});
});
