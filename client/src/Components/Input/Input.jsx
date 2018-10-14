import React from 'react';

import './Input.scss';

const Input = ({ className, ...props }) => (
	<input
		className={
		`${className ? `${className} ` : ''}
		input`}
		{...props}
	/>
);

export default Input;

