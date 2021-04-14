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
		return date.toLocaleDateString();
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	static displayTime(date) {
		return date.toLocaleTimeString();
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
}
