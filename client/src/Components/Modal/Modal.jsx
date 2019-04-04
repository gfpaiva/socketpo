import React from 'react';
import PropTypes from 'prop-types';

import './Modal.scss';

const Modal = ({ children, className, ...rest }) => (

	<div
		className={`${className ? `${className} ` : ''}modal`}
		{...rest}
	>
		<div className="modal__wrapper">
			<div className="modal__content">
				{children}
			</div>
		</div>
	</div>
);

Modal.propTypes = {
	className: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};

export default Modal;
