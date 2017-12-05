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

	onChange(e) {
		e.preventdefault();
		this.props.onChange(e.target.value);
	}
	random() {
		const { onChange, choices } = this.props;
		onChange(choices[Math.floor(Math.random() * choices.length)].key);
	}
	prev() {
		const { onChange, choices } = this.props;
		const keys = choices.map(c => c.key);
		const index = keys.indexOf(this.props.value);
		const lastIndex = keys.length - 1;
		onChange(keys[(index + lastIndex) % keys.length]);
	}

	next() {
		const { onChange, choices } = this.props;
		const keys = choices.map(c => c.key);
		const index = keys.indexOf(this.props.value);
		onChange(keys[(index + 1) % keys.length]);
	}

	render() {
		const { value, choices } = this.props;
		return (
			<div style={styles.root}>
				<button onClick={this.prev}>←</button>
				<select style={styles.select} value={value} onChange={this.onChange}>
					{choices.map(({ key, label }) =>
						<option key={key} value={key}>{label}</option>)}
				</select>
				<button onClick={this.next}>→</button>
			</div>
		);
	}
}

Selector.propTypes = {
	choices: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
	onChange: PropTypes.func.isRequired,
};

Selector.defaultProps = {};

export default Selector;
