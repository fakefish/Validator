mocha.setup('bdd');

describe('Validator', function () {
	describe('#notEmpty', function () {
		it('Validator notEmpty test', function () {
			var config = {
				name: ['notEmpty'],
				msg: {
					name: {
						notEmpty: 'name can not be empty'
					}
				}
			}

			$('form').validate(config, function (result, data) {
				chai.assert.equal(result.pass, false, 'should return false')
				chai.assert.equal(result.msg, 'name can not be empty', 'should return name notEmpty errormsg')
			})

			$('#name').val('some text')

			$('form').validate(config, function (result, data) {
				chai.assert.equal(result.pass, true, 'should return false')
				chai.assert.equal(data.name, 'some text', 'should return input value')
			})

			$('#name').val('')
		})
	})
})

mocha.run()
