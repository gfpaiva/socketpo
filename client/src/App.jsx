import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';

import NotFound from './Pages/NotFound/NotFound';
import Home from './Pages/Home/Home';
import Create from './Pages/Create/Create';
import Single from './Pages/Single/Single';

import { SoundOn, SoundOff } from './Components/Icons/Icons';

class App extends Component {

	state = {
		isMusicMuted: false
	}

	audio = null;

	musicHandler = e => {
		e.preventDefault();

		this.setState(prevState => ({
			isMusicMuted: !prevState.isMusicMuted
		}), () => this.state.isMusicMuted ? this.audio.pause() : this.audio.play())
	};

	componentDidMount() {
		this.audio = document.querySelector('#audio-initial');

		setTimeout(() => {
			this.audio.play();
		}, 1000);
	}

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
