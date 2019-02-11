import React from 'react';

import './Modal.scss';

const Modal = ({ children }) => (

	<div className="modal">
		<div className="modal__wrapper">
			<div className="modal__content">
				{children}
			</div>
		</div>
	</div>
);

export default Modal;
