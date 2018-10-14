import React from 'react';

import './Button.scss';

const Button = ({ children, className, medium, big, spaced, secondary, mx, ...props }) => (
	<button
		className={
			`${className ? `${className} ` : ''}
			button
			${big ? ' button--big' : ''}
			${medium ? ' button--medium' : ''}
			${spaced ? ' button--spaced' : ''}
			${secondary ? ' button--secondary' : ''}
			${mx ? ' button--mx' : ''}`}
		{...props}
	>
		{children}
	</button>
);

export default Button;

