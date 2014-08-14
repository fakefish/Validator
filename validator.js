~function () {
	var Validator = function () {}

	Validator.prototype = {
		constructor: Validator,

		config: {
			REPEAT: {},
			MAXLENGTH: {},
			MINLENGTH: {},
			ATMOST: {},
			ATLEAST: {}
		},

		result: {},

		/**
		 *
		 * @paramater:config 根据config初始化Validator
		 *
		 */
		init: function (config) {
			this.setup(config)
		},

		setup: function (config) {
			/**
			 *
			 * @variables: config            根据config初始化Validator
			 * @variables: index:            截取结果的索引
			 * @variables: str:              截取的目标字段
			 *
			 * @variables: REPEAT_PATTERN    验证重复的正则
			 * @variables: MAXLENGTH_PATTERN 验证最大长度的正则
			 * @variables: MINLENGTH_PATTERN 验证最小长度的正则
			 * @variables: ATMOST_PATTERN    验证最多选择的正则
			 * @variables: ATLEAST_PATTERN   验证最小选择的正则
			 *
			 */
			var self = this,
				index,
				str,

				REPEAT_PATTERN    = /repeat=/i,
				MAXLENGTH_PATTERN = /maxLength=/i,
				MINLENGTH_PATTERN = /minLength=/i,
				ATMOST_PATTERN    = /atMost=/i,
				ATLEAST_PATTERN   = /atLeast=/i;

			for (var i in config) {

				// 过滤继承属性和msg字段
				if (!config.hasOwnProperty(i) || i === 'msg') continue

				for (var j = 0, len = config[i].length; j < len; j++) {

					// ************
					// TODO: 更好的写法？
					// *****************

					// 匹配maxlength规则
					if (config[i][j].match(MAXLENGTH_PATTERN)) {
						str = config[i][j]
						index = str.indexOf('=')
						self.config.MAXLENGTH[i] = parseInt(str.substring(index + 1), 10)
					}

					// 匹配minlength规则
					if (config[i][j].match(MINLENGTH_PATTERN)) {
						str = config[i][j]
						index = str.indexOf('=')
						self.config.MINLENGTH[i] = parseInt(str.substring(index + 1), 10)
					}

					// 匹配atmost规则
					if (config[i][j].match(ATMOST_PATTERN)) {
						str = config[i][j]
						index = str.indexOf('=')
						self.config.ATMOST[i] = parseInt(str.substring(index + 1), 10)
					}

					// 匹配atleast规则
					if (config[i][j].match(ATLEAST_PATTERN)) {
						str = config[i][j]
						index = str.indexOf('=')
						self.config.ATLEAST[i] = parseInt(str.substring(index + 1), 10)
					}

					// 匹配repeat规则
					if (config[i][j].match(REPEAT_PATTERN)) {
						str = config[i][j]
						index = str.indexOf('=')
						self.config.REPEAT[i] = str.substring(index + 1)
					}
				}
			}

			self.config = config
		},

		validate: function (data, callback) {
			/**
			 *
			 * @variables: result 验证结果
			 * @variables: type   数据的特定验证规则
			 * @variables: types  数据的验证规则集合
			 *
			 */
			var self = this,
				result = null,
				type = null,
				types = [];

			for (var i in data) {

				// 过滤数据的继承属性
				if (!data.hasOwnProperty(i)) continue

				types = self.config[i];

				for (var j = 0, len = types.length; j < len; j++) {
					type = types[j];

					if (type.indexOf('repeat') !== -1) type = 'repeat'
					if (type.indexOf('maxLength') !== -1) type = 'maxLength'
					if (type.indexOf('minLength') !== -1) type = 'minLength'
					if (type.indexOf('atLeast') !== -1) type = 'atLeast'
					if (type.indexOf('atMost') !== -1) type = 'atMost'

					result = self.rules[type](self, i, data[i])

					if (!result.pass) {
						return callback({
							pass: false,
							msg: self.config.msg[i][type]
						})
					}
				}
			}

			return callback({pass: true})
		},
		rules: {
			notEmpty: function (context, name, value) {
				var self = context,
					regex = /^\s+$/,
					result = !!value.length && !regex.test(value)

				if (result) {
					self.result[name] = value
					return {pass: true}
				}

				return {pass: false}
			},
			email: function (context, name, email) {
				var self = context,
					regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
					result = regex.test(email);

				if (result) {
					self.result[name] = email
					return {pass: true}
				}

				return {pass: false}
			},
			maxLength: function (context, name, value) {
				var self = context,
					attr = value.split('='),
					value = attr[0],
					max = attr[1],
					result = value.length < parseInt(max, 10)

				if (result) {
					self.result[name] = value
					return {pass: true}
				}

				return {pass: false}
			},
			minLength: function (context, name, value) {
				var self = context,
					attr = value.split('='),
					value = attr[0],
					min = attr[1],
					result = value.length > parseInt(min, 10)

				if (result) {
					self.result[name] = value
					return {pass: true}
				}

				return {pass: false}
			},
			atLeast: function (context, name, value) {
				var self = context,
					result = !!$('input[name=' + value + ']:checked').length;

				if (result) {
					self.result[name] = result
					return {pass: true}
				}

				return {pass: false}
			},
			atMost: function (name) {

			},
			repeat: function (value) {
				var result = ($('#new-password').val() === $('#repeat-password').val())

				return {pass: result}
			}
		}
	}

	return (new Validator())
}()
