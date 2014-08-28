/*!
 * Validator v0.0.1
 * Licensed under MIT
 */

'use strict';

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory)
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'))
	} else if (typeof define === 'function' && define.cmd) {
		// CMD
		define(function (require) {
			require('jquery')
			factory($)
		})
	} else {
		window.Validator = factory(jQuery)
	}
}(function ($){
	var Validator = function () {}

	Validator.prototype = {
		constructor: Validator,

		config: {},
		result: {},

		settings: {
			MAXLENGTH: {},
			MINLENGTH: {},
			ATMOST: {},
			ATLEAST: {},
			REPEAT: {}
		},

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
			 */
			var self = this,
				index,
				str,

				REPEAT_PATTERN    = /repeat=/i,
				MAXLENGTH_PATTERN = /maxLength=/i,
				MINLENGTH_PATTERN = /minLength=/i,
				ATMOST_PATTERN    = /atMost=/i,
				ATLEAST_PATTERN   = /atLeast=/i,

				PATTERNS = [REPEAT_PATTERN, MAXLENGTH_PATTERN, MINLENGTH_PATTERN, ATMOST_PATTERN, ATLEAST_PATTERN];

			for (var i in config) {
				// 过滤继承属性和msg字段
				if (!config.hasOwnProperty(i) || i === 'msg') continue

				for (var j = 0, jLen = config[i].length; j < jLen; j++) {

					for (var k = 0, kLen = PATTERNS.length; k < kLen; k++) {
						if (config[i][j].match(PATTERNS[k])) {
							str = config[i][j]
							index = str.indexOf('=')

							switch (PATTERNS[k]) {
								case MAXLENGTH_PATTERN:
									config[i][j] = 'maxLength'
									self.settings.MAXLENGTH[i] = +str.substring(index + 1)
									break;
								case MINLENGTH_PATTERN:
									config[i][j] = 'minLength'
									self.settings.MINLENGTH[i] = +str.substring(index + 1)
									break;
								case ATMOST_PATTERN:
									config[i][j] = 'atMost'
									self.settings.ATMOST[i] = +str.substring(index + 1)
									break;
								case ATLEAST_PATTERN:
									config[i][j] = 'atLeast'
									self.settings.ATLEAST[i] = +str.substring(index + 1)
									break;
								case REPEAT_PATTERN:
									config[i][j] = 'repeat'
									self.settings.REPEAT[i] = str.substring(index + 1)
									break;
								default:
									console.info('plugin validator unexpected type: ' + PATTERNS[k])
									break;
							}
						}
					}
				}
			}

			self.config = config
		},

		validate: function (element, callback) {
			/**
			 *
			 * @variables: result 验证结果
			 * @variables: type   数据的特定验证规则
			 * @variables: types  数据的验证规则集合
			 *
			 */
			var self = this,
				$form = element,
				$input = null,
				identifier,
				config = self.config,
				types = [],
				result,
				data = {};

			for (var i in config) {
				if (!config.hasOwnProperty(i) || i === 'msg') continue

				types = config[i]
				identifier = 'input[name="' + i + '"]';
				$input = $form.find($(identifier))

				for (var j = 0; j < types.length; j++) {
					result = self.rules[types[j]](self, i, $input.val().trim())

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
					len = value.length,
					maxLen = +self.settings.MAXLENGTH[name];

				if (len <= maxLen) {
					self.result[name] = value
					return {pass: true}
				}

				return {pass: false}
			},
			minLength: function (context, name, value) {
				var self = context,
					len = value.length,
					minLen = +self.settings.MINLENGTH[name];

				if (len >= minLen) {
					self.result[name] = value
					return {pass: true}
				}

				return {pass: false}
			},
			atLeast: function (context, name) {
				var self = context,
					len = $('input[name=' + name + ']:checked').length,
					minLen = self.settings.ATLEAST[name];

				if (len >= minLen) {
					self.result[name] = $('input[name=' + name + ']:checked').val()
					return {pass: true}
				}

				return {pass: false}
			},
			atMost: function (context, name) {
				var self = context,
					len = $('input[name=' + name + ']:checked').length,
					maxLen = self.settings.ATMOST[name];

				if (len <= maxLen) {
					self.result[name] = $('input[name=' + name + ']:checked').val()
					return {pass: true}
				}

				return {pass: false}
			},
			repeat: function (value) {
				// TODO: 缓存用户目标值
			}
		}
	}

	return (new Validator())
}))

	