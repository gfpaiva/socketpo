import React from 'react';

import './Icons.scss';

const Scissors = ({ fill, ...rest }) => (
	<svg
		version="1.1"
		x="0px" y="0px"
		viewBox="0 0 78 97.5"
		enableBackground="new 0 0 78 78"
		{...rest}
	>
		<g>
			<rect x="57" y="39" width="3" height="3" />
			<polygon points="51,51 54,51 54,39 57,39 57,36 54,36 54,27 51,27  " />
			<rect x="48" y="9" width="3" height="9" />
			<rect x="54" y="18" width="3" height="9" />
			<rect x="51" y="6" width="6" height="3" />
			<rect x="45" y="18" width="3" height="9" />
			<rect x="27" y="9" width="3" height="9" />
			<rect x="30" y="6" width="6" height="3" />
			<rect x="15" y="36" width="3" height="18" />
			<rect x="57" y="9" width="3" height="9" />
			<rect x="18" y="33" width="3" height="3" />
			<path d="M48,69H24v-6h-3v9c10,0,20,0,30,0c0-3,0-6,0-9h-3V69z" />
			<path d="M51,63h3v-3h3v-3c-2,0-4,0-6,0V63z" />
			<rect x="42" y="27" width="3" height="12" />
			<rect x="60" y="42" width="3" height="12" />
			<rect x="57" y="54" width="3" height="3" />
			<rect x="18" y="54" width="3" height="9" />
			<rect x="39" y="18" width="3" height="9" />
			<rect x="36" y="9" width="3" height="9" />
			<polygon points="33,36 36,36 36,27 33,27 33,18 30,18 30,27 27,27 27,30 33,30  " />
			<path d="M24,42h3c0-4,0-8,0-12c-2,0-4,0-6,0v3h3V42z" />
		</g>
	</svg>
);

export default Scissors;

