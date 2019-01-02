import React from 'react';

import './Icons.scss';

const Rock = ({ fill, ...rest }) => (
	<svg
		version="1.1"
		x="0px"
		y="0px"
		viewBox="0 0 45 48"
		enableBackground="new 0 0 45 48"
		{...rest}
	>
		<g>
			<polygon points="48,54 48,51 36,51 36,54 48,54  " />
			<path d="M60,39c0,6,0,12,0,18h3c0-6,0-12,0-18H60L60,39z" />
			<polygon points="45,24 39,24 39,27 45,27 45,24  " />
			<polygon points="51,57 51,54 48,54 48,57 51,57  " />
			<path d="M27,48v3c3,0,6,0,9,0c0-2,0-4,0-6h-3v3h-3c0-6,0-12,0-18c-3,0-6,0-9,0v3c2,0,4,0,6,0c0,4,0,8,0,12h-6c0-4,0-8,0-12h-3   c0,7,0,14,0,21h3v-6H27L27,48z" />
			<polygon points="21,54 21,63 24,63 24,54 21,54  " />
			<path d="M54,63h-3c0,2,0,4,0,6H27v-6h-3v9c10,0,20,0,30,0c0-2,0-4,0-6h3v-6h-3V63L54,63z" />
			<polygon points="57,60 60,60 60,57 57,57 57,60  " />
			<path d="M36,39c0,2,0,4,0,6c7,0,14,0,21,0v-6h3v-3h-3v-6h-3c0,4,0,8,0,12h-6c0-4,0-8,0-12h6v-3h-9c0,5,0,10,0,15c-2,0-4,0-6,0   c0-5,0-10,0-15c-3,0-6,0-9,0v3h6V39L36,39z" />
		</g>
	</svg>
);

export default Rock;

