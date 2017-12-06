import React from 'react';
import {
	Route,
	Switch,
} from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import About from '../../static/about/About';
import NoMatch from '../../static/noMatch/NoMatch';
import Home from '../../static/home/Home';
import './PrimaryLayout.scss';
import '../../../assets/styles/main.scss';

export const PrimaryLayout = () => {
	return (
		<main className="PrimaryLayout">
			<Header />
			<div className="content blue-grey lighten-5">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />
					<Route component={NoMatch} />
				</Switch>
			</div>
			<Footer />
		</main>
	);
};

export default PrimaryLayout;
