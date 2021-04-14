export default class ExistingFile {
	/**
 	 * @param {string} filename
	 * @param {string} mimeType
	 * @param {string} downloadUrl
	 */
	constructor(filename, mimeType, downloadUrl) {
		this.filename = filename;
		this.mimeType = mimeType;
		this.downloadUrl = downloadUrl;
	}
}
