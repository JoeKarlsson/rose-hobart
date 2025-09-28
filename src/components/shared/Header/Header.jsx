import React, { useEffect } from 'react';
import {
	NavLink,
} from 'react-router-dom';
import './Header.scss';

const activeStyles = {
	color: 'var(--marquee-glow)',
	textShadow: '0 0 10px var(--primary-gold)',
};

const Header = () => {
	useEffect(() => {
		// Trigger marquee sequence animation on page load
		const marqueeElements = document.querySelectorAll('.marquee-bulb');
		marqueeElements.forEach((element, index) => {
			setTimeout(() => {
				element.style.animation = 'marqueeSequence 1s ease-out forwards';
			}, index * 200);
		});
	}, []);

	return (
		<header className="art-deco-header">
			{/* Geometric Deco Pattern Border */}
			<div className="deco-border-top">
				<div className="geometric-pattern"></div>
			</div>
			
			<nav className="art-deco-nav">
				<div className="nav-wrapper">
					{/* Main Title with Marquee Effect */}
					<NavLink className="brand-logo art-deco-headline marquee-bulb" to="/">
						<span className="subtitle-text art-deco-elegant">now playing</span>
						<span className="title-text">Rose Hobart</span>
					</NavLink>
					
					{/* Navigation Menu */}
					<ul className="nav-menu">
						<li>
							<NavLink 
								className="nav-link art-deco-title brass-button" 
								to="/about" 
								activeStyle={activeStyles}
							>
								About
							</NavLink>
						</li>
					</ul>
					
				</div>
			</nav>
			
			{/* Bottom Deco Border */}
			<div className="deco-border-bottom">
				<div className="geometric-pattern"></div>
			</div>
		</header>
	);
};

export default Header;
