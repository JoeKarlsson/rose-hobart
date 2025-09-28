import React, { useEffect } from 'react';
import {
	Routes,
	Route,
} from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import About from '../../static/about/About.jsx';
import NoMatch from '../../static/noMatch/NoMatch.jsx';
import Home from '../../static/home/Home.jsx';
import './PrimaryLayout.scss';

export const PrimaryLayout = () => {
	useEffect(() => {
		// Trigger curtain opening animation on page load
		const leftCurtain = document.querySelector('.curtain-left');
		const rightCurtain = document.querySelector('.curtain-right');
		
		if (leftCurtain) {
			leftCurtain.style.animation = 'curtainOpen 2s ease-out forwards';
		}
		if (rightCurtain) {
			rightCurtain.style.animation = 'curtainOpenRight 2s ease-out forwards';
		}
	}, []);

	return (
		<main className="PrimaryLayout art-deco-cinema">
			{/* Spotlight Effects */}
			<div className="spotlight spotlight-top-left"></div>
			<div className="spotlight spotlight-top-right"></div>
			
			{/* Left Velvet Curtain */}
			<div className="velvet-curtain curtain-left"></div>
			
			{/* Right Velvet Curtain */}
			<div className="velvet-curtain curtain-right"></div>
			
			{/* Ornate Header */}
			<Header />
			
			{/* Main Content Area with Art Deco Border */}
			<div className="content-wrapper">
				<div className="art-deco-border content-frame">
					<div className="content">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/about" element={<About />} />
							<Route path="*" element={<NoMatch />} />
						</Routes>
					</div>
				</div>
			</div>
			
			{/* Art Deco Footer */}
			<Footer />
		</main>
	);
};

export default PrimaryLayout;
