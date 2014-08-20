mocha.setup('bdd');

function restore() {}

describe('Validator', function () {
	describe('#setup', function () {
		it('Validator setup test', function () {
			// 测试用例
			var config = {
				result: 'success'
			}
			Validator.init(config)

			// 测试代码
			chai.assert.equal(Validator.config.result, 'success', 'should return success');

			// 重置对象
			Validator.init(null)
		})
	})
	describe('#validate', function () {
		it('Rules notempty test', function() {
			var config = {
				name: ['notEmpty'],
				msg: {
					name: {
						notEmpty: '用户名不能为空'
					}
				}
			}
			Validator.init(config)

			Validator.validate($('form'), function(result) {
				chai.assert.equal(result.pass, false, 'should return false')
				chai.assert.equal(result.msg, '用户名不能为空', 'should return 用户名不能为空')
			})

			$('input[name="name"]').val('username')

			Validator.validate($('form'), function(result) {
				chai.assert.equal(result.pass, true, 'should return true')
				chai.assert.equal(result.msg, undefined, 'should return undefined')
			})
		})

		it('Rules email test', function () {
			var config = {
				email: ['email'],
				msg: {
					email: {
						email: '请输入合法的邮箱地址'
					}
				}
			}
			Validator.init(config)

			$('input[name="email"]').val('invalid email')

			Validator.validate($('form'), function(result) {
				chai.assert.equal(result.pass, false, 'should return false')
				chai.assert.equal(result.msg, '请输入合法的邮箱地址', 'should return 请输入合法的邮箱地址')
			})

			$('input[name="email"]').val('klamtine@gmail.com')

			Validator.validate($('form'), function(result) {
				chai.assert.equal(result.pass, true, 'should return true')
				chai.assert.equal(result.msg, undefined, 'should return undefined')
			})

			$('input[name="email"]').val('')
		})

		it('Rules maxLength test', function () {
			var config = {
				name: ['maxLength=10'],
				msg: {
					name: {
						maxLength: '不能超过10个字符'
					}
				}
			}
			Validator.init(config)

			Validator.validate($('form'), function(result) {
				chai.assert.equal(result.pass, true, 'should return true')
				chai.assert.equal(result.msg, undefined, 'should return undefined')
			})

			$('input[name="name"]').val('12345678910')

			Validator.validate($('form'), function(result) {
				chai.assert.equal(result.pass, false, 'should return false')
				chai.assert.equal(result.msg, '不能超过10个字符', 'should return 不能超过10个字符')
			})

			$('input[name="name"]').val('')
		})

		it('Rules minLength test', function () {
			var config = {
				name: ['minLength=10'],
				msg: {
					name: {
						minLength: '不能少于10个字符'
					}
				}
			}
			Validator.init(config)

			Validator.validate($('form'), function(result) {
				chai.assert.equal(result.pass, false, 'should return true')
				chai.assert.equal(result.msg, '不能少于10个字符', 'should return 不能少于10个字符')
			})

			$('input[name="name"]').val('1234567891011')

			Validator.validate($('form'), function(result) {
				chai.assert.equal(result.pass, true, 'should return true')
				chai.assert.equal(result.msg, undefined, 'should return undefined')
			})
		})

		// it('Rules atMost test', function () {})
		// it('RUles atLeast test', function () {})
	})
})

mocha.run()
