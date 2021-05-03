import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";
import {ErrorMessage, useField} from "formik";
import InputFilter from "./InputFilter";

const Input = ({ label, instructions, disabled, type, placeholder, ...props }) => {
	const [field, meta, helpers] = useField(props);

	if (props.onChange || props.filter) {
		const defaultOnChange = field.onChange;
		field.onChange = e => {
			if (props.onChange) {
				props.onChange(e);
			}
			if (props.filter) {
				props.filter.handleChange(e);
			}
			defaultOnChange(e);
		};
	}

	return (
		<Form.Group controlId={field.name}>
			{label ? (
				<Form.Label>{label}</Form.Label>
			) : null}
			<Form.Control type={type} placeholder={placeholder} disabled={!!disabled} {...field} className={meta.error && meta.touched ? ' is-invalid' : ''}/>
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
	disabled: PropTypes.bool,

	type: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	filter: PropTypes.instanceOf(InputFilter),
};
