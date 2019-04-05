import React from 'react';
import PropTypes from 'prop-types';

import { parseAvatar } from '../../Utils/enums';

import './SelectAvatar.scss';

const SelectAvatar = ( { selectedAvatar, selectAvatar } ) => (
	<div>
		<p>Select an avatar: </p>

		{[1, 2, 3, 4].map(avatarValue => (
			<button
				key={avatarValue}
				className={`select-avatar${selectedAvatar === avatarValue ? ' select-avatar--active' : ''}`}
				onClick={e => selectAvatar(e, avatarValue)}
			>
				{parseAvatar(avatarValue)}
			</button>
		))}
	</div>
);

SelectAvatar.propTypes = {
	selectedAvatar: PropTypes.number.isRequired,
	selectAvatar: PropTypes.func.isRequired
};

export default SelectAvatar;

