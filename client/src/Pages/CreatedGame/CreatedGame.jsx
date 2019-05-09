import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import Button from '../../Components/Button/Button';

import './CreatedGame.scss';

const CreatedGame = ({ createdGame }) => {

	const [ copied, updateCopied ] = useState(false);

	let copyTimeout = null;
	const gameUrl = `${window.location.protocol}//${window.location.host}/game/${createdGame.hash}`;

	const copyHandler = e => {
		e.preventDefault();

		const copyFunc = e => {
			e.preventDefault();
			e.clipboardData && e.clipboardData.setData("text/plain", gameUrl);
		};

		document.addEventListener('copy', copyFunc, false);
		document.execCommand('copy');
		document.removeEventListener('copy', copyFunc, false);

		updateCopied(true);
		copyTimeout = setTimeout(() => {
			updateCopied(false);
		}, 2000);
	};

	// Clear timeout anyway on unmount
	useEffect(() => {
		return () => {
			clearTimeout(copyTimeout);
		}
	});

	return (
		<div className="page page--created">
			<h2>Game has been created: </h2>
			<p><strong>Name: </strong>{createdGame.name}</p>
			<p>
				<strong>Link: </strong>
				<span className="created__game-url">{gameUrl}</span>
				<Button
					spaced
					onClick={copyHandler}
				>
					{copied ? 'Link Copied' : 'Copy Link'}
				</Button>
			</p>

			<p><Link className='link  link--underline' to={`/game/${createdGame.hash}`}>Go to the game</Link></p>
		</div>
	);
};

CreatedGame.propTypes = {
	createdGame: PropTypes.object.isRequired
};

export default CreatedGame;

