import React from 'react';
import {
	NavLink,
} from 'react-router-dom';
import './Header.scss';

const activeStyles = {
	color: 'red',
};

const Header = () => {
	return (
		<nav>
			<div className="nav-wrapper">
				<NavLink className="brand-logo" to="/">Home</NavLink>
				<ul id="nav-mobile" className="right hide-on-med-and-down">
					<li><NavLink to="/about" activeStyle={activeStyles}>About</NavLink></li>
				</ul>
			</div>
		</nav>
	);
};

export default Header;
