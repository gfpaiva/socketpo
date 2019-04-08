import React from 'react';
import { Link } from 'react-router-dom';

import {
	Add,
	Rock,
	Paper,
	Scissors
} from '../../Components/Icons/Icons';

import Button from '../../Components/Button/Button';

import './Home.scss';

const Home = () => (
	<div className="page page--full page--centered page--bg-gradient page--home">
		<div className="page--home__content">
			<div className="page--home__title-section">
				<div className="page--home__title-animation">
					<Rock className="icon icon-animation icon-animation--f" width={70} />
					<Paper className="icon icon-animation icon-animation--s" width={70} />
					<Scissors className="icon icon-animation icon-animation--t" width={70} />
				</div>
				<h2 className="page--home__welcome">Welcome to</h2>
				<h1 className="page--home__title">SocketPo</h1>
			</div>
			<Button>
				<Link className="link link--medium link--spaced" to="/create">
					<Add fill="#fff" className="icon icon--mr icon--fix icon--medium" />
					Create a new game
				</Link>
			</Button>
		</div>
	</div>
);

export default Home;
