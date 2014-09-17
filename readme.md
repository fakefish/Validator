# Validator

> Validator is a plugin for form validator based on jQuery, you can use it in any module loader.

-------------------

- Live DEMO [http://klamtlne.github.io/Validator/](http://klamtlne.github.io/Validator/)

-------------------

## Usage
```html
	<form id="form">
		<input type="text" data-validator="name" data-rules="notEmpty, maxLength=10">
		<input type="password" data-validator="password" data-rules="notEmpty, minLength=6">
		<input type="email" data-validator="email" data-rules="notEmpty, email">
		<input type="text" data-validator="phone" data-rules="phone">
		<input type="checkbox" data-validator="fruit" value="apple" data-rules="atLeast=1, atMost=2">
		<input type="checkbox" data-validator="fruit" value="pear">
		<input type="checkbox" data-validator="fruit" value="lemon">
		<select data-validator="selection" data-rules="notEmpty">
			<option value="1"></option>
			<option value="2"></option>
		</select>
	</form>
```

```javascript
	var config = {
		msg: {
			name: {
				notEmpty: "name can’t be empty",
				maxLength: "name can't be more than 10 characters"
			},
			password: {
				minLength: "password can’t be less than 6 characters"
			}
			// other messages goes here...
		}
	}

	$("#form").valdiate(config, function (result, data) {
		// if success: result = {pass: true}
		// data = {name: xxx, password: xxx, email: xxx...}
		
		// if fail: {pass: false, msg: xxx}
		// data = undefined
		console.log(result)
	})
```

## Introduction

Validator will quit as soon as it meets up the first error, Valdiator would return {key: value} pair in config file while success, which is super convient for form validation & upload

## OPTIONS

```javascript
	options = {
		// error msg returned when meets error
		msg: {Object},

		// whether to addclass on parent dom element while error occurs
		isOnParent: {Boolean},

		// error class prepare to add
		errorClass: {String}
	}
```


## Rules
- notEmpty
- email
- phone
- int
- maxLength
- minLength
- atLeast
- atMost

## License
**MIT**

