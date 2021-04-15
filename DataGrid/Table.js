import React, { Component } from 'react';
import PropTypes from "prop-types";
import {Col, Container, FormControl, Pagination, Row, Table as ReactBootstrapTable} from "react-bootstrap";
import Header from "./Header";

export default class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			items: null,
			totalCount: null,

			pageNumberText: (this.props.pageNumber > 1) ? this.props.pageNumber : 1,
			pageNumber: (this.props.pageNumber > 1) ? this.props.pageNumber : 1,
			orderByToken: this.props.orderByToken,
			orderAscendingFlag: (this.props.orderAscendingFlag !== false),
		};

		this.pageNumberTextbox = React.createRef();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if ((prevProps.dataSource || this.props.dataSource) && (prevProps.dataSource !== this.props.dataSource)) {
			this.setState({
				items: this.props.dataSource,
				totalCount: this.props.dataSource.length,
			});
		}
	}

	componentDidMount() {
		if (this.props.queryData) {
			this.props.queryData(this.bindData, this.setupRequest);
		} else if (this.props.dataSource) {
			this.setState({
				items: this.props.dataSource,
				totalCount: this.props.dataSource.length,
			});
		} else {
			console.error('No queryData method or dataSource provided');
		}
	}

	/**
	 * @param {Array} items
	 * @param {number} totalCount
	 */
	bindData = (items, totalCount) => {
		this.setState({items, totalCount});
	}

	/**
	 * @param {ModelBaseClass} request
	 */
	setupRequest = (request) => {
		if (this.props.itemsPerPage > 0) {
			request.resultsLimitCount = this.props.itemsPerPage;
			request.resultsLimitOffset = (this.state.pageNumber - 1) * this.props.itemsPerPage;
		}

		if (this.state.orderByToken) {
			request.resultsOrderBy = this.state.orderByToken;
			request.resultsOrderAscending = this.state.orderAscendingFlag;
		}
	}

	reload = () => {
		if (!this.props.queryData) {
			console.warn('Cannot reload when no queryData has been defined');
		}

		this.setState({
			items: null,
			totalCount: null,
			pageNumber: 1,
			pageNumberText: 1
		}, () => {
			this.props.queryData(this.bindData, this.setupRequest);
		});
	}

	/**
	 * @return {Array.}
	 */
	getItems = () => {
		return this.state.items;
	}

	/**
	 * @return {number}
	 */
	getTotalCount = () => {
		return this.state.totalCount;
	}

	/**
	 * @param {number} pageNumber
	 */
	setPageNumber = (pageNumber) => {
		if (!this.props.queryData) {
			console.warn('Cannot setPageNumber when no queryData has been defined');
		}

		pageNumber = parseInt(pageNumber);

		if (Number.isNaN(pageNumber) || (pageNumber < 1) || (pageNumber > Math.ceil(this.state.totalCount / this.props.itemsPerPage))) {
			this.setState({
				pageNumberText: this.state.pageNumber
			});
		} else {
			this.setState({
				pageNumber: pageNumber,
				pageNumberText: pageNumber
			}, () => {
				this.props.queryData(this.bindData, this.setupRequest);
			});
		}
	}

	first_Click = () => {
		this.setPageNumber(1);
	}

	previous_Click = () => {
		this.setPageNumber(this.state.pageNumber - 1);
	}

	next_Click = () => {
		this.setPageNumber(this.state.pageNumber + 1);
	}

	last_Click = () => {
		this.setPageNumber(Math.ceil(this.state.totalCount / this.props.itemsPerPage));
	}

	pageNumberText_KeyPress = (event) => {
		switch (event.key) {
		case 'Enter':
			this.setPageNumber(this.state.pageNumberText);
			this.pageNumberTextbox.current.blur();
			break;

		case 'Escape':
			this.setState({
				pageNumberText: this.state.pageNumber
			});
			this.pageNumberTextbox.current.blur();
			break;
		}
	}

	renderPaginator = () => {
		return (
			<Row className="align-items-center">
				<Col md={6} style={{paddingLeft: '0.75rem'}}>Viewing {(this.state.pageNumber - 1) * this.props.itemsPerPage + 1} to {Math.min(this.state.pageNumber * this.props.itemsPerPage, this.state.totalCount)} of {this.state.totalCount}</Col>
				{(this.state.totalCount > this.props.itemsPerPage) && (
					<Col md={6} style={{paddingRight: '0.75rem'}}>
						<Pagination size="sm" className="justify-content-end">
							<Pagination.First onClick={this.first_Click} />
							<Pagination.Prev onClick={this.previous_Click} />
							<FormControl
								ref={this.pageNumberTextbox}
								type="text"
								size="sm"
								value={this.state.pageNumberText}
								onBlur={event => this.setPageNumber(this.state.pageNumberText)}
								onFocus={event => event.target.select()}
								onChange={event => this.setState({pageNumberText: event.target.value.replace(/\D/g,'')})}
								onKeyDown={this.pageNumberText_KeyPress}
								style={{width: '40px', textAlign: 'center', borderRadius: 0, borderLeftWidth: 0}}/>
							<Pagination.Next onClick={this.next_Click} />
							<Pagination.Last onClick={this.last_Click} />
						</Pagination>
					</Col>
				)}
			</Row>
		);
	}

	renderItems = () => {
		return (
			<tbody>
				{this.state.items.map((item, index) => this.props.renderItem(item, index, this))}
			</tbody>
		);
	}

	render() {
		if (this.state.items === null) {
			return (
				<div>Please Wait...</div>
			);
		}

		if (!this.state.items.length && (this.props.renderNoData || this.props.renderNoDataText)) {
			if (this.props.renderNoData) {
				return this.props.renderNoData();
			} else {
				return (
					<>
						{this.props.renderNoDataText}
					</>
				);
			}
		}

		let children = [];
		if (this.props.children) {
			if (this.props.children.length) {
				children = this.props.children.filter(child => (child.type === Header));
			} else if (this.props.children.type === Header) {
				children = [this.props.children];
			}
		}

		return (
			<Container fluid>
				{this.props.itemsPerPage && this.renderPaginator()}
				<Row>
					<ReactBootstrapTable striped={this.props.striped === true} hover={this.props.hover === true}>
						<thead>
							<tr>
								{children}
							</tr>
						</thead>
						{this.renderItems()}
					</ReactBootstrapTable>
				</Row>
			</Container>
		);
	}
}

Table.propTypes = {
	children: PropTypes.node.isRequired,
	renderItem: PropTypes.func.isRequired,

	key: PropTypes.string,

	queryData: PropTypes.func,
	dataSource: PropTypes.array,

	renderNoData: PropTypes.func,
	renderNoDataText: PropTypes.string,

	itemsPerPage: PropTypes.number,

	pageNumber: PropTypes.number,
	orderByToken: PropTypes.string,
	orderAscendingFlag: PropTypes.bool,

	striped: PropTypes.bool,
	hover: PropTypes.bool,
};
