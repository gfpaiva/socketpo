import React, { Fragment } from 'react';

import { Link } from 'react-router-dom';

import Loading from '../../Loading/Loading';

const Alerts = ( { type } ) => (
	<div className="page page--full page--centered page--bg-gradient page--single">
		<div>
			{type === 'Loading' && (
				<Fragment>
					<Loading />
					<p>Loading, please wait</p>
				</Fragment>
			)}

			{type === 'Not Found' && (
				<Fragment>
					<p>
						Match not found <span role='img' aria-label='think'>🤔</span><br />
						<Link className='link link--underline' to='/create'>Create a new match</Link>
					</p>
				</Fragment>
			)}

			{type === 'Full' && (
				<Fragment>
					<p>
						This match is full and in progress <br />
						<Link className='link link--underline' to='/create'>Create a new match</Link>
					</p>
				</Fragment>
			)}
		</div>
	</div>
);

export default Alerts;
