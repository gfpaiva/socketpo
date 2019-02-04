import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Button from '../../Components/Button/Button';

import './CreatedGame.scss';

class CreatedGame extends Component {

	state = {
		copied: false,

	}

	gameUrl = `${window.location.protocol}//${window.location.host}/game/${this.props.createdGame.hash}`

	copyHandler = e => {
		e.preventDefault();

		const copyFunc = e => {
			e.preventDefault();
			e.clipboardData && e.clipboardData.setData("text/plain", this.gameUrl);
		};

		document.addEventListener('copy', copyFunc, false);
		document.execCommand('copy');
		document.removeEventListener('copy', copyFunc, false);

		this.setState(() => ({ copied: true }), () => {
			window.setTimeout(() => {
				this.setState({ copied: false });
			}, 2000);
		});
	}

	render() {

		const { createdGame } = this.props;
		const { copied } = this.state;

		return (
			<div className="page page--created">
				<h2>Game has been created: </h2>
				<p><strong>Name: </strong>{createdGame.name}</p>
				<p>
					<strong>Link: </strong>
					<span class="created__game-url">{this.gameUrl}</span>
					<Button
						spaced
						onClick={this.copyHandler}
					>
						{copied ? 'Link Copied' : 'Copy Link'}
					</Button>
				</p>

				<p><Link className='link  link--underline' to={`/game/${createdGame.hash}`}>Go to the game</Link></p>
			</div>
		);
	}
}

export default CreatedGame;

