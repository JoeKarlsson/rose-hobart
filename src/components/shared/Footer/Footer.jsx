import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => (
	<footer className="art-deco-footer">
		{/* Top Deco Border */}
		<div className="deco-border-top">
			<div className="geometric-pattern"></div>
		</div>
		
		<div className="footer-content">
			<div className="footer-wrapper">
				
				{/* Navigation Links */}
				<div className="footer-navigation">
					<Link to="/about" className="footer-link">About</Link>
					<a 
						href="https://github.com/JoeKarlsson/rose-hobart" 
						target="_blank" 
						rel="noopener noreferrer" 
						className="footer-link"
					>
						GitHub
					</a>
					<a 
						href="https://github.com/JoeKarlsson/rose-hobart" 
						target="_blank" 
						rel="noopener noreferrer" 
						className="footer-link"
					>
						Code
					</a>
				</div>
				
				{/* Footer Text */}
				<div className="footer-text">
					<div className="copyright-section">
						<p className="copyright-text art-deco-body">
							© 2018 Karlsson - For Study Purposes Only
						</p>
					</div>
					
					<div className="credits-section">
						<p className="credits-text art-deco-elegant">
							site by{' '}
							<a 
								className="credit-link" 
								target="_blank" 
								rel="noopener noreferrer" 
								href="http://www.callmejoe.net/"
							>
								joe
							</a>
							{' '}&{' '}
							<a 
								className="credit-link" 
								target="_blank" 
								rel="noopener noreferrer" 
								href="http://www.callmejoe.net/"
							>
								laurel
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
		
		{/* Bottom Deco Border */}
		<div className="deco-border-bottom">
			<div className="geometric-pattern"></div>
		</div>
	</footer>
);

export default Footer;
