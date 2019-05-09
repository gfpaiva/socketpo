import React, { Component } from 'react';

import { Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';

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

		const playPromise = this.audio.play();

		if (playPromise !== undefined) {
			playPromise.catch(error => {
				this.setState({
					isMusicMuted: true
				});
			});
		}
	}

	render() {

		const { isMusicMuted } = this.state;

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
