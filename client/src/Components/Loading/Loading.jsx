import React from 'react';

import Loader from 'react-loaders';

import './Loading.scss';

const Loading = ( {...props} ) => (
	<Loader
		{...props}
		type="ball-pulse"
	/>
);

export default Loading;

