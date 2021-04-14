import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.render) {
			return this.props.render();
		}

		const props = {...this.props};
		delete props.name;
		delete props.label;
		delete props.render;

		return (
			<th {...props}>{this.props.label}</th>
		);
	}
}

Header.propTypes = {
	name: PropTypes.string,
	label: PropTypes.string,
	render: PropTypes.func,
};
