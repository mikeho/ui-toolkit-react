import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class Header extends Component {
	constructor(props) {
		super(props);
	}

	isCurrentlyOrderBy = () => {
		return this.props.currentOrderByToken === this.props.orderByToken;
	}

	render() {
		if (this.props.render) {
			return this.props.render();
		}

		const props = {...this.props};
		delete props.name;
		delete props.label;
		delete props.render;
		delete props.orderByToken;

		delete props.orderByClick;
		delete props.currentOrderByToken;
		delete props.currentOrderByAscendingFlag;

		if (!this.props.orderByToken) {
			return (
				<th {...props}>{this.props.label}</th>
			);
		}

		return (
			<th {...props}>
				<span style={{cursor: 'pointer'}} onClick={() => this.props.orderByClick(this.props.orderByToken)}>
					{this.props.label}
					{this.isCurrentlyOrderBy() ?
						this.props.currentOrderByAscendingFlag ? (
							<span> &#x25B2;</span>
						) : (
							<span> &#x25BC;</span>
						) : null
					}
				</span>
			</th>
		);
	}
}

Header.propTypes = {
	name: PropTypes.string,
	label: PropTypes.string,
	render: PropTypes.func,
	orderByToken: PropTypes.string,

	orderByClick: PropTypes.func,
	currentOrderByToken: PropTypes.string,
	currentOrderByAscendingFlag: PropTypes.bool,
};
