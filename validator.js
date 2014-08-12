~function () {
	var Validator = function () {}

	Validator.prototype = {
		constructor: Validator,
		init: function (config) {
			var self = this

			self.config = config
		},
		validate: function (data, callback) {
			var self = this,
				result = null,
				types = [];

			for (var i in data) {
				if (!data.hasOwnProperty(i)) continue

				types = self.config[i];

				for (var j = 0, len = types.length; j < len; j++) {
					result = self.rules[types[j]](data[i])

					if (!result.pass) {
						return callback({
							pass: false,
							msg: self.config.msg[i][types[j]]
						})
					}
				}
			}

			return callback({pass: true})
		},
		rules: {
			notEmpty: function (value) {
				if (value === '') {
					return {
						pass: false,
					}
				}

				return {pass: true}
			},
			email: function (email) {
				var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
					result = null;

				result = regex.test(email)

				return {pass: result}
			},
			maxLength: function (value) {
				var attr = value.split(','),
					value = value[0],
					max = value[1];

				if (value.length > parseInt(max, 10)) {
					return {
						pass: false
					}
				}

				return {pass: true}
			},
			minLength: function (value) {
				var attr = value.split(','),
					value = value[0],
					max = value[1];

				if (value.length < parseInt(max, 10)) {
					return {
						pass: false
					}
				}

				return {pass: true}
			}
		}
	}

	return (new Validator())
}()
