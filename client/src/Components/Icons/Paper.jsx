import React from 'react';

import './Icons.scss';

const Paper = ({ fill, ...rest }) => (
	<svg
		version="1.1"
		x="0px"
		y="0px"
		viewBox="0 0 78 97.5"
		enableBackground="new 0 0 78 78"
		{...rest}
	>
		<g>
			<path d="M33,39h3c0-10,0-20,0-30c-3,0-6,0-9,0v3h6V39z" />
			<path d="M24,45h3c0-11,0-22,0-33h-3v3c-2,0-4,0-6,0v3c2,0,4,0,6,0C24,27,24,36,24,45z" />
			<path d="M45,39c0-8,0-16,0-24h6v-3h-6V9h-3c0,10,0,20,0,30H45z" />
			<path d="M54,48c0-3,0-6,0-9h3v-3h-3V15h-3c0,11,0,22,0,33H54z" />
			<rect x="15" y="18" width="3" height="36" />
			<rect x="36" y="6" width="6" height="3" />
			<rect x="18" y="54" width="3" height="9" />
			<path d="M48,69H24v-6h-3v9c10,0,20,0,30,0c0-3,0-6,0-9h-3V69z" />
			<path d="M57,33v3h6v6h3c0-3,0-6,0-9H57z" />
			<rect x="57" y="45" width="3" height="6" />
			<rect x="60" y="42" width="3" height="3" />
			<rect x="51" y="57" width="3" height="6" />
			<rect x="54" y="51" width="3" height="6" />
		</g>
	</svg>
);

export default Paper;

