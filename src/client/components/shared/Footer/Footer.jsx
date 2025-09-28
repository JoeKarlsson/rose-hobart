import React from 'react';
import './Footer.scss';

const Footer = () => (
	<div className="footer purple darken-1">
		<div className="footer-copyright">
			<div className="container">
				<div className="row">
					<p className="grey-text text-lighten-4 left">
						© 2018 Karlsson - For Study Purposes Only
					</p>
					<p className="grey-text text-lighten-4 right">
						site by <a target="_blank" rel="noopener noreferrer" href="http://www.callmejoe.net/">joe </a> & <a target="_blank" rel="noopener noreferrer" href="http://www.callmejoe.net/">laurel</a>
					</p>
				</div>
			</div>
		</div>
	</div>
);

export default Footer;
