import React from 'react';
import {
	Routes,
	Route,
} from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import About from '../../static/about/About.jsx';
import NoMatch from '../../static/noMatch/NoMatch.jsx';
import Home from '../../static/home/Home.jsx';
// import './PrimaryLayout.scss';
// import '../../../assets/styles/main.scss';

export const PrimaryLayout = () => {
	return (
		<main className="PrimaryLayout">
			<Header />
			<div className="content blue-grey lighten-5">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="*" element={<NoMatch />} />
				</Routes>
			</div>
			<Footer />
		</main>
	);
};

export default PrimaryLayout;
