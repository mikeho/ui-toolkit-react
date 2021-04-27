import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";
import {ErrorMessage, useField, Field} from "formik";

const Checkbox = ({ label, instructions, disabled, caption, ...props }) => {
	const [field, meta, helpers] = useField(props);

	return (
		<Form.Group controlId={field.name}>
			{label ? (
				<Form.Label>{label}</Form.Label>
			) : null}
			<div className="form-check">
				<Field type="checkbox" id={field.name} name={field.name} disabled={disabled} className={'form-check-input ' + (meta.error && meta.touched ? ' is-invalid' : '')} />
				{caption ? (
					<label htmlFor={field.name} className="form-check-label">{caption}</label>
				) : null}
				<ErrorMessage {...field} component="div" className="invalid-feedback"/>
			</div>
			{instructions && (<Form.Text className="text-muted">{instructions}</Form.Text>)}
		</Form.Group>
	);
};

export default Checkbox;

Checkbox.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	instructions: PropTypes.string,
	disabled: PropTypes.booleanValue,

	caption: PropTypes.string,
};
