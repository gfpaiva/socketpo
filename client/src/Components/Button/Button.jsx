import React from 'react';
import PropTypes from 'prop-types';

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

Button.propTypes = {
	className: PropTypes.string,
	medium: PropTypes.bool,
	big: PropTypes.bool,
	spaced: PropTypes.bool,
	secondary: PropTypes.bool,
	mx: PropTypes.bool
};

export default Button;

