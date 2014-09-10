# Validator
Validator是一个基于jQuery的验证器

## 使用方法
```html
	<form id=“form”>
		<input type=“text” name=“name”>
		<input type=“password” name=“password”>
		<input type=“email” name=“email”>
		<input type=“text” name=“phone”>
		<input type=“checkbox” name=“fruit” value=“apple”>
		<input type=“checkbox” name=“fruit” value=“pear”>
		<input type=“checkbox” name=“fruit” value=“lemon”>
	</form>
```

```javascript
	var config = {
		name: [“notEmpty”],
		password: [“minLength=6”, “maxLength=20”],
		email: [“notEmpty”, “email”],
		phone: [“notEmpty”, “email”],
		fruit: [“atLeast=1”],
		msg: {
			name: {
				notEmpty: “name can’t be empty”
			},
			password: {
				minLength: “password can’t be less than 6 characters”,
				maxLength: “password can’t be more than 20 characters”
			}

			…
		}
	}

	$(“#form”).valdiate(config, function (result) {
		// if success: {pass: true, result: {name: xxx, password:
		// xxx, email: xxx…}}
		// if fail: {pass: false, msg: xxx}
		console.log(result)
	})
```

## 规则
- notEmpty
- email
- phone
- maxLength
- minLength
- atLeast
- atMost

## License
**MIT**

