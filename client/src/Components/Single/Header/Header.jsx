import React from 'react';

import { Link } from 'react-router-dom';

import './Header.scss';

const Header = () => (
	<div className="single__head">
		<h1 className="single__socketpo"><Link to='/'>SocketPo</Link></h1>
	</div>
);

export default Header;
