import React, { Component } from 'react';
import PropTypes from "prop-types";
import {Col, Container, FormControl, Pagination, Row, Table as ReactBootstrapTable} from "react-bootstrap";
import Header from "./Header";
import ResultParameter from "../../models/ResultParameter";

export default class Table extends Component {
	static DisplayItemsPerPageSelector = false;
	static DisplayItemsPerPageCount = 25;

	constructor(props) {
		super(props);

		this.state = {
			items: null,
			totalCount: null,
			itemsPerPage: Table.DisplayItemsPerPageCount,

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
			this.props.queryData(this);
		} else if (this.props.dataSource) {
			this.setState({
				items: this.props.dataSource,
				totalCount: this.props.dataSource.length,
			});
		} else {
			console.error('No queryData method or dataSource provided');
		}
	}

	calculateItemsPerPage = () => {
		if (this.props.itemsPerPageSelector || Table.DisplayItemsPerPageSelector) {
			return Table.DisplayItemsPerPageCount;
		}

		if (this.props.itemsPerPage) {
			return this.props.itemsPerPage;
		}

		return null;
	}

	/**
	 * @param {string} orderByToken
	 */
	orderByClick = (orderByToken) => {
		if (this.state.orderByToken === orderByToken) {
			const orderAscendingFlag = !this.state.orderAscendingFlag;
			this.setState({orderAscendingFlag});
		} else {
			const orderAscendingFlag = true;
			this.setState({orderByToken, orderAscendingFlag});
		}

		this.reload();
	}

	/**
	 * @param {Array} items
	 * @param {number} totalCount
	 */
	bindData = (items, totalCount) => {
		this.setState({items, totalCount});
	}

	/**
	 * @return {ResultParameter}
	 */
	getResultParameter = () => {
		const resultParameter = new ResultParameter();

		if (this.calculateItemsPerPage() > 0) {
			resultParameter.resultsLimitCount = this.calculateItemsPerPage();
			resultParameter.resultsLimitOffset = (this.state.pageNumber - 1) * this.calculateItemsPerPage();
		}

		if (this.state.orderByToken) {
			resultParameter.resultsOrderBy = this.state.orderByToken;
			resultParameter.resultsOrderAscending = this.state.orderAscendingFlag;
		}

		return resultParameter;
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
			this.props.queryData(this);
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

		if (Number.isNaN(pageNumber) || (pageNumber < 1) || (pageNumber > Math.ceil(this.state.totalCount / this.calculateItemsPerPage()))) {
			this.setState({
				pageNumberText: this.state.pageNumber
			});
		} else {
			this.setState({
				pageNumber: pageNumber,
				pageNumberText: pageNumber
			}, () => {
				this.props.queryData(this);
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
		this.setPageNumber(Math.ceil(this.state.totalCount / this.calculateItemsPerPage()));
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
		const pageCount = Math.floor(this.state.totalCount / this.calculateItemsPerPage()) + ((this.calculateItemsPerPage() % this.state.totalCount) ? 1 : 0);
		return (
			<Row className="align-items-center">
				<Col md={9} style={{paddingLeft: '0.1rem'}}>
					Viewing items <strong>{(this.state.pageNumber - 1) * this.calculateItemsPerPage() + 1} - {Math.min(this.state.pageNumber * this.calculateItemsPerPage(), this.state.totalCount)}</strong> of <strong>{this.state.totalCount}</strong> on
					page <strong>{this.state.pageNumber}</strong> of <strong>{pageCount}</strong>
				</Col>
				{(this.state.totalCount > this.calculateItemsPerPage()) && (
					<Col md={3} style={{paddingRight: 0}}>
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

	paginatorDropdown_Change = (event) => {
		const itemsPerPage = parseInt(event.target.value);
		this.setState({
			itemsPerPage
		}, this.reload);

		Table.DisplayItemsPerPageCount = itemsPerPage;
	}

	renderPaginatorDropdown = () => {
		return (
			<Row className="align-items-center">
				<Col md={6} style={{paddingLeft: '0.1rem'}}>
					View &nbsp;
					<select value={this.state.itemsPerPage} onChange={event => this.paginatorDropdown_Change(event)}>
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</select>
					&nbsp; items per page
				</Col>
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
				{this.calculateItemsPerPage() && this.renderPaginator()}
				<Row>
					<ReactBootstrapTable
						className={this.props.className !== undefined ? this.props.className : null}
						bordered={this.props.bordered === true}
						borderless={this.props.borderless === true}
						striped={this.props.striped === true}
						hover={this.props.hover === true}
						size={this.props.size !== undefined ? this.props.size : null}
						variant={this.props.variant !== undefined ? this.props.variant : null}
						responsive={this.props.responsive !== undefined ? this.props.responsive : null}
					>
						<thead>
							<tr>
								{React.Children.map(children, (child) =>
									React.cloneElement(child, {
										orderByClick: this.orderByClick,
										currentOrderByToken: this.state.orderByToken,
										currentOrderByAscendingFlag: this.state.orderAscendingFlag
									})
								)}
							</tr>
						</thead>
						{(!this.state.items.length && this.props.renderNoDataTbody) ? this.props.renderNoDataTbody() : this.renderItems()}
					</ReactBootstrapTable>
				</Row>
				{(this.props.itemsPerPageSelector || Table.DisplayItemsPerPageSelector) ? this.renderPaginatorDropdown() : null}
			</Container>
		);
	}
}

Table.propTypes = {
	children: PropTypes.node.isRequired,
	renderItem: PropTypes.func.isRequired,

	queryData: PropTypes.func,
	dataSource: PropTypes.array,

	renderNoData: PropTypes.func,
	renderNoDataText: PropTypes.string,
	renderNoDataTbody: PropTypes.func,

	itemsPerPage: PropTypes.number,
	itemsPerPageSelector: PropTypes.bool,

	pageNumber: PropTypes.number,
	orderByToken: PropTypes.string,
	orderAscendingFlag: PropTypes.bool,

	className: PropTypes.any,
	bordered: PropTypes.bool,
	borderless: PropTypes.bool,
	striped: PropTypes.bool,
	hover: PropTypes.bool,
	size: PropTypes.string,
	variant: PropTypes.string,
	responsive: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
