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
	* an optional `filter`, which is a `FormikControl.InputFilter` object that you can provide filtering rules for
* `FormikControl.Checkbox` — for checkboxes
	* an optional `caption` which is displayed to the right of the checkbox
* `FormikControl.FileUpload` — for file uploads
	* the `value` can be set ahead of time to an instance of `FormikControl.ExistingFile`
	* after the user uploads, the `value` is an instance of `File`
* `FormikControl.Select` — for dropdowns
	* additional `<option>` tags as children

An example of using FormikControls within a FormikForm:

```
<Formik
	initialValues={{
		username: '',
		password: '',
		remember: false,
	}}
	validationSchema={Yup.object().shape({
		username: Yup.string()
			.required('Your username is required'),
		password: Yup.string()
			.min(6, 'Password must be at least 6 characters')
			.required('Password is required'),
	})}
	onSubmit={form_Submit}
>
	<Form>
		<FormikControl.Input name="username" type="text" label="Your Username" placeholder="Please enter your username"/>
		<FormikControl.Input name="password" type="password" label="Password"/>
		<FormikControl.Checkbox name="remember" label="Remember Your Username?" caption="Click here to remember your username for next time"/>

		<Button variant="primary" type="submit">
				Log In
		</Button>
	</Form>
</Formik>
```

## DataGrid

The DataGrid can be used to bind an array of items (which can be objects, strings, etc.) to be displayed in a React Bootstrap `Table` component.

It consists of two components:

* `DataGrid.Table` -- this is the table itself
* `DataGrid.Header` -- this defines each header cell (`<th>`) within the header row (`<thead><tr>...</tr></thead>`)

The rows within the body of the table (`<tbody>...</tbody>`) is defined using a custom render function that you will need to provide as a prop to `DataGrid.Table`.

Note: It is **_strongly recommended_** that you specify a `key` for each `DataGrid.Table`, especially if you have pages that will dynamically generate/switch between rendering different `DataGrid.Table` components.

### Setup

To set up, at a minimum you need to include the following:
* how to render each item
* the data to render (where the data needs to be an array of items)

So the most basic, simple table could be as easy as:

```
<DataGrid.Table
	key="fruits"
	dataSource={[
		{id: 1, fruit: 'Apple'},
		{id: 2, fruit: 'Banana'},
		{id: 3, fruit: 'Cherries'},
	]}
	renderItem={(fruitItem, index) => (
		<tr key={'fruits-row-' + index}>
			<td>{fruitItem.id}</td>
			<td>{fruitItem.fruit}</td>
		</tr>
	)}
/>
```

### Header Row

You can add a header row by defining one or more `DataGrid.Header` components which would make up the cells for each column in the header row.

```
const fruitArray = [
	{id: 1, fruit: 'Apple'},
	{id: 2, fruit: 'Banana'},
	{id: 3, fruit: 'Cherries'},
];

function renderFruitItem(fruit, index, table) {
	return (
		<tr key={'fruits-row-' + index}>
			<td>{fruitItem.id}</td>
			<td>{fruitItem.fruit}</td>
		</tr>
	);
};
```
```
<DataGrid.Table key="fruits" dataSource={fruitArray} renderItem={renderFruitItem}>
	<DataGrid.Header label="Identifier"/>
	<DataGrid.Header label="Fruit Name"/>
</DataGrid.Table>
```

### Data Binding

There are two ways to provide data to the `DataGrid.Table`.  You can simply set `dataSource` to be an array of items (as seen above).  This is the preferred approach for simple datagrids, especially when:

* the array is already available (e.g. you won't need to make an async webservice call to get that data)
* you don't need to worry about sorting or pagination (e.g. you want to always display all of the data)

However, sometimes you need a bit more power.  In those cases, instad of specifying an explicit `dataSource`, you can specify a `queryData` function.

The `queryData` function you define must take in the `Table` itself as a parameter.  This allows you to call one of two methods available on your `Table`:

* `bindData(items, totalCount)` -- this is the function your `queryData` function _must_ call when the array of items is ready for your `Table` to start rendering.  `items` is required.  `totalCount` is required only if you are paginating the results (see "Pagination" below)
* `getResultParameter` -- if you are optionally using Pagination and/or Sorting, then you call this method to have the `Table` calculate the `ResultParameter` to use.  You pass this into your Qcodo API call that accepts a `ResultParameter`, to have the API add the appropriate `ORDER BY` and `LIMIT` clauses to its database query

```
<DataGrid.Table key="fruits" queryData={myQueryData} renderItem={renderFruitItem}>
	<DataGrid.Header label="Identifier"/>
	<DataGrid.Header label="Fruit Name"/>
</DataGrid.Table>
```
```
function myQueryData(table) {
	const fruitSearchRequest = {
		...
	};
	
	// optionally add pagination/sorting parameters to my request
	fruitSearchRequest.resultParameter = table.getResultParameter();
	
	Client.FruitApi.SearchForFruit(fruitSearchRequest, {
		status200: fruitArray => {
			table.bindData(fruitArray);
		}
	});
}
```

##### Reloading/Rerunning `queryData`

If you are using the `queryData` approach, you may find that you need to re-run the method.  A typical example of this is if you have search filters in your UI.  Whenever the user changes/adds/removes a search filter, you may want to re-run `queryData` to take those filters into account.

To do this, you can call `.reload()` on the datagrid itself.  The recommended approach would be to store a ref of the datagrid, and then you can call `.reload()` on the ref.

### Pagination 

`DataGrid.Table` provides an easy way to add pagination.  Note that all pagination is done via the server -- so any API request that can support paginating results will take in pagination parameters.

To enable pagination, set the `itemsPerPage` prop to the number of items you want to render per page.  Then, the request object that you pass in to a Qcodo-based API call can have its pagination parameters set up by calling the `setupRequest` callback that is passed to your `queryData` function.

Note, the Swagger definition typically has it so that the request object you pass in can have its pagination parameters set up by setting up the resultParameter as the result of `getResultParameter()` call to the Table object you are rendering.

### Sorting

TBD
