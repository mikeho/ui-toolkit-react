import React, { Component } from 'react';

export default class DataGridHeader {
	/**
	 * @param {object} options
	 */
	constructor(options) {
		/**
		 * @type {string|null}
		 */
		this.title = (options && options.title) ? options.title : null;

		/**
		 * @type {string|null}
		 */
		this.sortToken = (options && options.sortToken) ? options.sortToken : null;

		/**
		 * @type {function|null}
		 */
		this.render = (options && options.render) ? options.render : null;

		/**
		 * @type {number|null}
		 */
		this.width = (options && options.width) ? options.width : null;
	}
}
