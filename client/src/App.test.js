import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mountWrap } from './Utils/testUtils'
import App from './App';

// Mock play and pause on audio tags
Object.defineProperty(document, 'querySelector', {
	value: jest.fn().mockReturnValue({ play: jest.fn(), pause: jest.fn() })
});

let wrapper, AppInstance;

beforeEach(() => {
	wrapper = mountWrap(
		<Router>
			<App />
		</Router>
	);

	AppInstance = wrapper.find('App').instance();
});

describe('<App />', () => {
	it('should mount properly and play the audio', () => {
		// Mount and compare snapshot and match if play have been called
		expect(wrapper.find('App')).toMatchSnapshot();
		expect(AppInstance.audio.play).toHaveBeenCalled();
	});

	it('should toggle music state on button click', () => {
		// Initial muted is false
		expect(AppInstance.state.isMusicMuted).toBe(false);

		// Click on CTA button, match if state has beend updated and pause function called
		wrapper.find('.audio-controls__volume').simulate('click');
		expect(AppInstance.state.isMusicMuted).toBe(true);
		expect(AppInstance.audio.pause).toHaveBeenCalled();

		// Click on CTA button, match if state has beend updated and play function called
		wrapper.find('.audio-controls__volume').simulate('click');
		expect(AppInstance.state.isMusicMuted).toBe(false);
		expect(AppInstance.audio.play).toHaveBeenCalled();
	})
});
