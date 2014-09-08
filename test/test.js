mocha.setup('bdd');

describe('Validator', function () {
	describe('#notEmpty', function () {
		it('Validator notEmpty test', function () {
			var config = {
				name: ['notEmpty'],
				msg: {
					name: {
						notEmpty: 'name can not be empty'
					},
					email: {
						email: 'please fill in illegal email address'
					}
				}
			}

			$('form').validate(config, function (result, data) {
				chai.assert.equal(result.pass, false, 'should return false')
				chai.assert.equal(result.msg, 'name can not be empty', 'should return name notEmpty errormsg')
			})
		})
	})
})

mocha.run()
