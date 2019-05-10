import React, { useState, useEffect } from 'react';

import { Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';

import NotFound from './Pages/NotFound/NotFound';
import Home from './Pages/Home/Home';
import Create from './Pages/Create/Create';
import Single from './Pages/Single/Single';

import { SoundOn, SoundOff } from './Components/Icons/Icons';

const heightHandler = () => {
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
};

const App = () => {

	const audio = document.querySelector('#audio-initial');
	const [ isMusicMuted, updateMusicMuted ] = useState(false);
	const musicHandler = e => {
		e.preventDefault();
		updateMusicMuted(!isMusicMuted);
	};
	useEffect(() => {
		isMusicMuted ? audio.pause() : audio.play();
	}, [isMusicMuted, audio]);

	// Try to autoplay the audio-music on 1st load
	useEffect(() => {
		const playPromise = audio.play();

		if (playPromise !== undefined) {
			playPromise.catch(error => {
				updateMusicMuted(true);
			});
		};
	}, [audio]);

	// On 1st load set the --vh css variable to handle with full height
	useEffect(() => {
		heightHandler();
		window.addEventListener('resize', heightHandler);
	}, []);

	return (
		<div className="App">
			<AnimatedSwitch
				atEnter={{
					opacity: 0,
					translateX: 10,
				}}
				atLeave={{
					opacity: 0,
					translateX: -10,
				}}
				atActive={{
					opacity: 1,
					translateX: 0,
				}}
				mapStyles={styles => ({
					transform: `translateX(${styles.translateX}%)`,
					opacity: styles.opacity
				})}
				className="switch-wrapper"
			>
				<Route exact path="/" component={Home}/>
				<Route exact path="/create" component={Create}/>
				<Route exact path="/game/:hash" component={Single}/>

				{/* 404 page */}
				<Route component={NotFound} />
			</AnimatedSwitch>

			<div className="audio-controls">
				<button
					role="img"
					aria-label="Sound"
					className="audio-controls__volume"
					onClick={musicHandler}
				>
					{isMusicMuted ? <SoundOff /> : <SoundOn /> }
				</button>
			</div>

		</div>
	);
};

export default App;
