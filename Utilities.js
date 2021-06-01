import React from "react";

/**
 * A miscellaneous assortment of methods/utilities
 */
export default class Utilities {
	/**
	 * @param {string} camelCase
	 * @return {string}
	 */
	static sentenceCaseFromCamelCase(camelCase) {
		const result = camelCase.replace(/([A-Z])/g, " $1");
		return result.trim();
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	static displayDate(date) {
		if (!date) return '';
		return date.toLocaleDateString();
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	static displayTime(date) {
		if (!date) return '';
		return date.toLocaleTimeString();
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	static displayDateTime(date) {
		if (!date) return '';
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	}

	/**
	 * @param {File} file
	 * @param {function} callback
	 * @param {function} errorCallback
	 */
	static base64DataFromFile(file, callback, errorCallback) {
		// Setup
		const reader = new FileReader();
		reader.onload = () => {
			const base64Data = reader.result.substring(reader.result.indexOf(',') + 1);
			callback(base64Data);
		};
		reader.onerror = error => {
			console.log(error);
			errorCallback(error);
		};

		// Go
		reader.readAsDataURL(file);
	}

	/**
	 * This will ALWAYS return an array, but it may be blank
	 *
	 * This will preform TRIM on all lines of the string, rejecting anything of 0 length
	 *
	 * @param {string} text
	 * @return {string[]}
	 */
	static getLineArray(text) {
		const returnArray = [];

		text.trim().split("\n").forEach(line => {
			if (line.trim().length) {
				returnArray.push(line.trim());
			}
		});

		return returnArray;
	}

	/**
	 * Given a standard string with linebreaks, this will return React Elements
	 * that can be rendered which will include those same linebreaks.
	 *
	 * @param {string} text
	 * @return {React.Fragment[]}
	 */
	static renderTextBlock(text) {
		const lineArray = [];

		text.trim().split("\n").forEach(line => {
			lineArray.push(line.trim());
		});

		return lineArray.map((value, index) => {
			if (index !== (lineArray.length - 1)) {
				return (
					<React.Fragment key={"text-block-" + index}>
						{value}
						<br/>
					</React.Fragment>
				);
			} else {
				return (
					<React.Fragment key={"text-block-" + index}>
						{value}
					</React.Fragment>
				);
			}
		});
	}

	/**
	 * Given any partial phone text, it will parse to xxx-xxx-xxxx (or a partial version of it)
	 * @param {string} text
	 * @return {string}
	 */
	static parsePhone(text) {
		text = text.replace(/\D/g, '');

		if (text.length > 10) {
			text = text.substring(0, 10);
		}

		if (text.length >= 6) {
			return text.replace(/^(\d{3})(\d{3})/, "$1-$2-");
		}

		if (text.length >= 3) {
			return text.replace(/^(\d{3})/, "$1-");
		}

		return text;
	}
}
