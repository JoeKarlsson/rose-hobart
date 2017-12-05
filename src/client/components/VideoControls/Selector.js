import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
	root: {
		display: 'flex',
		flexDirection: 'row',
	},
	select: {
		flex: 1,
	},
};

class Selector extends Component {
	constructor() {
		super();
		this.onChange = this.onChange.bind(this);
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
		this.random = this.random.bind(this);
	}

	onChange(e) {
		const { onChange } = this.props;
		onChange(e.target.value);
	}

	random() {
		const { onChange, choices } = this.props;
		onChange(choices[Math.floor(Math.random() * choices.length)].key);
	}

	prev(e) {
		e.preventDefault();
		const { onChange, choices, currColor } = this.props;
		const keys = choices.map(c => c.key);
		const index = keys.indexOf(currColor);
		const lastIndex = keys.length - 1;
		onChange(keys[(index + lastIndex) % keys.length]);
	}

	next(e) {
		e.preventDefault();
		const { onChange, choices, currColor } = this.props;
		const keys = choices.map(c => c.key);
		const index = keys.indexOf(currColor);
		onChange(keys[(index + 1) % keys.length]);
	}

	render() {
		const { choices, currColor } = this.props;

		return (
			<div style={styles.root}>
				<button onClick={this.prev}>←</button>
				<select style={styles.select} value={currColor} onChange={this.onChange}>
					{choices.map(({ key, label }) =>
						<option key={key} value={key}>{label}</option>)}
				</select>
				<button onClick={this.next}>→</button>
			</div>
		);
	}
}

Selector.propTypes = {
	currColor: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
	choices: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
	onChange: PropTypes.func.isRequired,
};

Selector.defaultProps = {};

export default Selector;
