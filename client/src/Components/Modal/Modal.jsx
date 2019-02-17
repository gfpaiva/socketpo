import React from 'react';

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

export default Modal;
