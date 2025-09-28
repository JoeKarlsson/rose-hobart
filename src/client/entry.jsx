import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/shared/ErrorBoundary/ErrorBoundary';
import PrimaryLayout from './components/shared/PrimaryLayout/PrimaryLayout';

console.log('=== React App Starting ===');
console.log('Document ready state:', document.readyState);

const container = document.getElementById('root');
console.log('Container element:', container);

if (!container) {
	console.error('Root container not found!');
	throw new Error('Root container not found');
}

const root = createRoot(container);
console.log('React root created:', root);

console.log('About to render with routing...');

// Test component with PrimaryLayout
const TestApp = () => {
	console.log('TestApp rendering...');
	return (
		<Router>
			<ErrorBoundary>
				<PrimaryLayout />
			</ErrorBoundary>
		</Router>
	);
};

try {
	root.render(<TestApp />);
	console.log('Router test rendered successfully!');
} catch (error) {
	console.error('Error rendering router test app:', error);
	throw error;
}

console.log('=== React App Setup Complete ===');
