# ui-toolkit-react

This is a UI toolkit that, while open source and published for anyone to use, is primarily used for Quasidea's ReactJS projects that build on top of the following packages:

* `oas-client-react`
* `formik`
* `react-bootstrap`

It provides:

* a central set of utility methods
* a set of React Components which combine Formik controls with React Bootstrap
* a datagrid component which allows for an easy way to build tables using React Bootstrap and OAS Client models

## Installation

There is currently _no_ NPM package for this module.  This is by design -- since these tools are likely going to iterate pretty regularly and directly by the Quasidea projects that use them (at least for the foreseeable future), it was a better approach to allow integration with this module as a GIT submodule for ReactJS projects.

Given the Quasidea standard/recommended filesystem structure, it is recommended that this be installed as a submodule in `src/js/toolkit`:

```
git submodule init
git submodule add https://github.com/mikeho/ui-toolkit-react.git src/js/toolkit
```

That way, any updates can be pushed directly to this GIT repo without forcing a round trip of updates, as required with NPM.

## Utilities

The Utilities class is used to hold the set of miscellanous but generally useful utility methods that can be called statically.

* `Utilities.displayDate(Date)`
* `Utilities.displayTime(Date)`
* `Utilities.sentenceCaseFromCamelCase(string)`
* etc.

Please see the individual JSDoc comments in `Utilities.js` itself for more information.

## FormikControls

This is a set of React Native components which allows you to use React Bootstrap `Form.Group` components with Formik.

Each control has the following props:

* a required `name`, which is the same `name` that is used by Formik to access the control's value, validation rules, error state, etc.
* an optional `label` to be display aboved the control
* an optional `instructions` to be displayed below the control

And then depending on the _type_ of FormikControl, each one may have additional props as well:

* `FormikControl.Input` — primarily for text-based input
	* a required `type`, which is `text`, `password`, etc.
	* an optional `placeholder`
* `FormikControl.Checkbox` — for checkboxes
	* an optional `caption` which is displayed to the right of the checkbox
* `FormikControl.FileUpload` — for file uploads
	* the `value` can be set ahead of time to an instance of `FormikControl.ExistingFile`
	* after the user uploads, the `value` is an instance of `File`
* `FormikControl.Select` — for dropdowns
	* additional `<option>` tags as children

## DataGrid

