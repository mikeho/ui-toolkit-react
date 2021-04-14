import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";
import {ErrorMessage, useField, Field} from "formik";

const Select = ({ label, ...props }) => {
	const [field, meta, helpers] = useField(props);

	return (
		<Form.Group controlId={field.name}>
			{label ? (
				<Form.Label>{label}</Form.Label>
			) : null}
			<Field as="select" id={field.name} name={field.name} className={'form-control ' + (meta.error && meta.touched ? ' is-invalid' : '')}>
				{props.children}
			</Field>
			<ErrorMessage {...field} component="div" className="invalid-feedback"/>
		</Form.Group>
	);
};

export default Select;

Select.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	children: PropTypes.array,
};
