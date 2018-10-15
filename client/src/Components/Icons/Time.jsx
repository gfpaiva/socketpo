import React from 'react';

import './Icons.scss';

const Time = ({ fill, ...rest }) => (
	<svg
		version="1.1"
		x="0px"
		y="0px"
		viewBox="0 0 100 125"
		enableBackground="new 0 0 100 100"
		{...rest}
	>
		<g>
			<rect x="45" y="45" width="10" height="10" />
			<rect x="35" y="35" width="10" height="10" />
			<rect x="25" y="25" width="10" height="10" />
			<rect x="55" y="35" width="10" height="10" />
			<rect x="15" y="15" width="10" height="10" />
			<polygon points="15,45 15,35 5,35 5,45 5,55 5,65 15,65 15,55  " />
			<polygon points="25,75 25,65 15,65 15,75 15,85 25,85 35,85 35,75  " />
			<polygon points="45,85 35,85 35,95 45,95 55,95 65,95 65,85 55,85  " />
			<polygon points="75,75 65,75 65,85 75,85 85,85 85,75 85,65 75,65  " />
			<polygon points="85,45 85,55 85,65 95,65 95,55 95,45 95,35 85,35  " />
			<polygon points="85,15 75,15 65,15 65,25 75,25 75,35 85,35 85,25  " />
			<polygon points="55,5 45,5 35,5 35,15 45,15 55,15 65,15 65,5  " />
		</g>
	</svg>
);

export default Time;

