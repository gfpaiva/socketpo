import React, { useState, useEffect } from 'react';

import { Route, Switch } from 'react-router-dom';

import NotFound from './Pages/NotFound/NotFound';
import Home from './Pages/Home/Home';
import Create from './Pages/Create/Create';
import Single from './Pages/Single/Single';

import { SoundOn, SoundOff } from './Components/Icons/Icons';


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

	useEffect(() => {
		const playPromise = audio.play();

		if (playPromise !== undefined) {
			playPromise.catch(error => {
				updateMusicMuted(true);
			});
		};
	}, [audio]);

	return (
		<div className="App">
			<Switch>
				<Route exact path="/" component={Home}/>
				<Route exact path="/create" component={Create}/>
				<Route exact path="/game/:hash" component={Single}/>

				{/* 404 page */}
				<Route component={NotFound} />
			</Switch>

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
