### 
Validator v0.0.1
Licensed under MIT
###

'use strict'

class Validator
	constructor: (element) ->
		@$element = $(element)

trim = () ->
	return @.replace(/^\s+|\s+$/g, '')

# Validator验证通过后的数据
Validator::result = {}

# Validator预设值
Validator::settings = 
	MAXLENGTH: {}
	MINLENGTH: {}
	ATMOST: {}
	ATLEAST: {}
	REPEAT: {}

Validator::validate = (config, callback) ->
	MAXLENGTH_PATTERN = /maxLength=/i
	MINLENGTH_PATTERN = /minLength=/i
	ATMOST_PATTERN    = /atMost=/i
	ATLEAST_PATTERN   = /atLeast=/i
	
	PATTERNS = [
		MAXLENGTH_PATTERN
		MINLENGTH_PATTERN
		ATMOST_PATTERN
		ATLEAST_PATTERN
	]

	for key of config.msg when config.msg.hasOwnProperty(key)
		types = key
		identifier = "*[data-validator=#{key}]"
		$input = @$element.find($(identifier))
		rules = $input.data('rules').split(',')

		for pattern in PATTERNS
			for rule, i in rules
				if (rule.trim().match(pattern))
					index = rule.indexOf('=')
					switch pattern
						when MAXLENGTH_PATTERN
							@settings.MAXLENGTH[key] = parseInt rule.substring(index + 1), 10
							rules[i] = 'maxLength'
						when MINLENGTH_PATTERN
							@settings.MINLENGTH[key] = parseInt rule.substring(index + 1), 10
							rules[i] = 'minLength'
						when ATMOST_PATTERN
							@settings.ATMOST[key] = parseInt rule.substring(index + 1), 10
							rules[i] = 'atMost'
						when ATLEAST_PATTERN
							@settings.ATLEAST[key] = parseInt rule.substring(index + 1), 10
							rules[i] = 'atLeast'

		for rule in rules
			result = @[rule.trim()](key, $input.val()?.trim())

			unless result.pass
				return callback({pass: false, msg: config.msg[key][rule.trim()]})

	callback({pass: true}, @result)

Validator::notEmpty = (name, value) ->
	regex = /^\s+$/
	result = value.length && !regex.test(value)

	if result
		@result[name] = value
		return {pass: true}

	{pass: false}

Validator::email = (name, value) ->
	regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	result = regex.test(value)

	if result
		@result[name] = value
		return {pass: true}

	{pass: false}

Validator::phone = (name, value) ->
	regex = /^1[3-9]\d{9}$/
	result = regex.test(value)

	if result
		@result[name] = value
		return {pass: true}

	{pass: false}

Validator::minLength = (name, value) ->
    len = value.length
    minLen = parseInt(@settings.MINLENGTH[name], 10)

    if len >= minLen
        @result[name] = value
        return {pass: true}

    {pass: false}

Validator::maxLength = (name, value) ->
    len = value.length
    maxLen = parseInt(@settings.MAXLENGTH[name], 10)

    if len <= maxLen
        @result[name] = value
        return {pass: true}

    {pass: false}

Validator::atLeast = (name, value) ->
    len = $("*[data-validator=#{name}]:checked").length || $("*[data-validator=#{name}]:selected").length
    minLen = @settings.ATLEAST[name]

    if len >= minLen
        @result[name] = value
        return {pass: true}

    {pass: false}

Validator::atMost = (name, value) ->
    len = $("*[data-validator=#{name}]:checked").length || $("*[data-validator=#{name}]:selected")
    maxLen = @settings.ATMOST[name]

    if len <= maxLen
        @result[name] = value
        return {pass: true}

    {pass: false}

Validator::int = (name, value) ->
    result = not isNaN(value)

    if result
        @result[name] = value
        return {pass: true}

    {pass: false}

old = $.fn.validate

$.fn.validate = (config, callback) ->
	new Validator(@).validate(config, callback)

$.fn.validate.noConflict = ->
	$.fn.validate = old
	@


