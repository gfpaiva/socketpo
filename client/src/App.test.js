import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mountWrap } from './Utils/testUtils'
import App from './App';

// Mock play and pause on audio tags
Object.defineProperty(document, 'querySelector', {
	value: jest.fn().mockReturnValue({ play: jest.fn(), pause: jest.fn() })
});

let wrapper;

beforeEach(() => {
	wrapper = mountWrap(
		<Router>
			<App />
		</Router>
	);
});

describe('<App />', () => {
	it('should mount properly and play the audio', () => {
		// Mount and compare snapshot and match if play have been called
		expect(wrapper.find('App')).toMatchSnapshot();
	});

	it('should toggle music state on button click', () => {
		// Initial muted is false
		expect(wrapper.find('SoundOn')).toHaveLength(1);
		expect(wrapper.find('SoundOff')).toHaveLength(0);

		// Click on CTA button, match if state has beend updated and pause function called
		wrapper.find('.audio-controls__volume').simulate('click');
		expect(wrapper.find('SoundOff')).toHaveLength(1);
		expect(wrapper.find('SoundOn')).toHaveLength(0);

		// Click on CTA button, match if state has beend updated and play function called
		wrapper.find('.audio-controls__volume').simulate('click');
		expect(wrapper.find('SoundOn')).toHaveLength(1);
		expect(wrapper.find('SoundOff')).toHaveLength(0);
	})
});
