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
		<div className="PrimaryLayout">
			<Header />
			<div className="content">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />
					<Route component={NoMatch} />
				</Switch>
			</div>
			<Footer />
		</div>
	);
};

export default PrimaryLayout;
