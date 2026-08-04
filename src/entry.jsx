import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './assets/styles/main.scss';
import { AudioProvider } from './context/AudioContext';
import ErrorBoundary from './components/shared/ErrorBoundary/ErrorBoundary';
import PrimaryLayout from './components/shared/PrimaryLayout/PrimaryLayout';

const container = document.getElementById('root');

if (!container) {
	throw new Error('Root container not found');
}

const root = createRoot(container);

const App = () => {
	return (
		<Router basename="/rose-hobart">
			<ErrorBoundary>
				<AudioProvider>
					<PrimaryLayout />
				</AudioProvider>
			</ErrorBoundary>
		</Router>
	);
};

root.render(<App />);
