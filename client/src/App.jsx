import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';

import NotFound from './Pages/NotFound/NotFound';
import Home from './Pages/Home/Home';
import Create from './Pages/Create/Create';
import Single from './Pages/Single/Single';

import SoundOn from './Components/Icons/SoundOn';
import SoundOff from './Components/Icons/SoundOff';

import mainSound from './Assets/main.mp3';

class App extends Component {

	state = {
		isMusicMuted: false
	}

	musicHandler = e => {
		e.preventDefault();

		this.audio.muted = !this.state.isMusicMuted;

		this.setState(prevState => ({
			isMusicMuted: !prevState.isMusicMuted
		}))
	};

	render() {

		const { isMusicMuted } = this.state;

		return (
			<div className="App">
				<Switch>
					<Route exact path="/" component={Home}/>
					<Route exact path="/create" component={Create}/>
					<Route exact path="/game/:hash" component={Single}/>

					{/* 404 page */}
					<Route component={NotFound} />
				</Switch>
				<audio
					ref={audio => this.audio = audio}
					autoPlay
					loop
				>
					<source src={mainSound} type="audio/mpeg" />
				</audio>

				<div className="audio-controls">
					<button
						className="audio-controls__volume"
						onClick={this.musicHandler}
					>
						{isMusicMuted ? <SoundOff /> : <SoundOn /> }
					</button>
				</div>

			</div>
		);
	}
}

export default App;
