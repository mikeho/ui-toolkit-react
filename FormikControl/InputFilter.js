export default class InputFilter {
	/**
	 * @param {'alpha'|'alphanumeric'|'numeric'|'number'|'alphanumber'} type
	 * @param {number} maximumLength
	 */
	constructor(type, maximumLength) {
		if (type) {
			this.type = type;
		}

		if (maximumLength) {
			this.maximumLength = maximumLength;
		}
	}

	handleChange = e => {
		switch (this.type) {
		case 'alpha':
			e.target.value = e.target.value.replace(/[^a-z]/gi, '');
			break;
		case 'alphanumeric':
			e.target.value = e.target.value.replace(/[^\W]/g, '');
			break;
		case 'alphanumber':
			e.target.value = e.target.value.replace(/[^0-9a-z]/gi, '');
			break;
		case 'number':
			e.target.value = e.target.value.replace(/[^\d]/g, '');
			break;
		case 'numeric':
			e.target.value = e.target.value.replace(/[^\d.-]/g, '');
			break;
		default:
			e.target.value = e.target.value.trim();
		}

		if (this.maximumLength) {
			e.target.value = e.target.value.substring(0, this.maximumLength);
		}
	};
}
