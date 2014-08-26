# Validator
Validator是一个基于jQuery的验证器

## 使用方法

```html
		<form id="form">
				<input type="text" data-validator="name">
		</form>

		<script src="validator.js"></script>
```

```javascript
		var config = {
				name: ['notEmpty'],
				msg: {
						name: {
								notEmpty: '用户姓名不能为空'
						}
				}
		}

		validator.init(config)
		validator.validate($('#form'), function (result) {
				result.pass // false
				result.msg // '用户名不能为空'
		})
```

## 规则
- notEmpty
- maxLength
- minLength
- atLeast
- atMost

## License
**MIT**

