import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

const Input = ({ className, ...props }) => (
	<input
		className={
		`${className ? `${className} ` : ''}
		input`}
		{...props}
	/>
);

Input.propTypes = {
	className: PropTypes.string,
	type: PropTypes.string.isRequired
};

export default Input;

