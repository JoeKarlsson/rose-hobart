import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
} from 'react-router-dom';
import PrimaryLayout from './components/shared/PrimaryLayout/PrimaryLayout';
import ErrorBoundary from './components/shared/ErrorBoundary/ErrorBoundary';


ReactDOM.render((
	<Router >
		<ErrorBoundary>
			<PrimaryLayout />
		</ErrorBoundary>
	</Router>
), document.getElementById('root'));
