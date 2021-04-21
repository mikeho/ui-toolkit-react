import React from 'react';
import PropTypes from "prop-types";
import {Form, Button, InputGroup} from "react-bootstrap";
import {ErrorMessage, useField} from "formik";
import ExistingFile from "./ExistingFile";

const FileUpload = ({ label, instructions, ...props }) => {
	const [field, meta, helpers] = useField(props);

	const fileControl = React.createRef();

	const textValue = (field.value && (field.value instanceof ExistingFile)) ? field.value.filename
		: (field.value && (field.value instanceof File)) ? field.value.name
			: '';

	const remove_Click = () => {
		helpers.setValue(null, false);
	};

	/**
	 * @param {Event} e
	 */
	const file_Submitted = e => {
		e.preventDefault();
		const file = e.target.files[0];
		if (file) {
			helpers.setError(null);
			helpers.setValue(file, true);
		}
	};

	const browse_Click = () => {
		fileControl.current.click();
	};

	/**
	 * @param {Event} e
	 */
	const textbox_Click = e => {
		e.preventDefault();

		if (!field.value) {
			browse_Click();
			return;
		}

		if (field.value && (field.value instanceof ExistingFile) && field.value.downloadUrl) {
			window.open(field.value.downloadUrl);
		}
	};

	return (
		<Form.Group controlId={field.name}>

			{label ? (
				<Form.Label>{label}</Form.Label>
			) : null}

			<InputGroup>
				<Form.Control
					type="text"
					value={textValue}
					onChange={e => e.preventDefault()}
					className={meta.error && meta.touched ? ' is-invalid' : ''}
					onFocus={e => e.currentTarget.blur()}
					onClick={textbox_Click}/>

				{(field.value && (field.value instanceof ExistingFile)) ? (
					<InputGroup.Append>
						<Button variant="outline-secondary" onClick={remove_Click}>Remove</Button>
					</InputGroup.Append>
				) : (field.value && (field.value instanceof File)) ? (
					<InputGroup.Append>
						<Button variant="outline-secondary" onClick={remove_Click}>Remove</Button>
					</InputGroup.Append>
				) : (
					<InputGroup.Append>
						<Button variant="outline-secondary" onClick={browse_Click}>Browse...</Button>
					</InputGroup.Append>
				)}

				<ErrorMessage {...field} component="div" className="invalid-feedback"/>

				<input style={{display: 'none'}} id={field.name} name={field.name} type="file" ref={fileControl} onChange={file_Submitted}/>

			</InputGroup>

			{instructions && (<Form.Text className="text-muted">{instructions}</Form.Text>)}

		</Form.Group>
	);
};

export default FileUpload;

FileUpload.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	instructions: PropTypes.string,
};
