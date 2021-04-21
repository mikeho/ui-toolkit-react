import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";
import {ErrorMessage, useField} from "formik";

const Input = ({ label, instructions, type, placeholder, ...props }) => {
	const [field, meta, helpers] = useField(props);

	return (
		<Form.Group controlId={field.name}>
			{label ? (
				<Form.Label>{label}</Form.Label>
			) : null}
			<Form.Control type={type} placeholder={placeholder} {...field} className={meta.error && meta.touched ? ' is-invalid' : ''}/>
			<ErrorMessage {...field} component="div" className="invalid-feedback"/>
			{instructions && (<Form.Text className="text-muted">{instructions}</Form.Text>)}
		</Form.Group>
	);
};

export default Input;

Input.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	instructions: PropTypes.string,

	type: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
};
