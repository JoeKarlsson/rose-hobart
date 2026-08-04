import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, info) {
		this.setState({ errorInfo: info });
		console.error(error, info);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div className="Error">
					<h1>Something went wrong.</h1>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo?.componentStack}
					</details>
				</div>
			);
		}
		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

ErrorBoundary.defaultProps = {
	children: '',
};

export default ErrorBoundary;
