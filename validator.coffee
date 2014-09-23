### 
Validator
Licensed under MIT
###

'use strict'

# factory函数，用来搭配不同的模块加载器
factory = ($) ->
    class Validator
        constructor: (element) ->
            @$element = $(element)

    # 类型判断
    Validator::patterns = 
        # 必须 填/选 字段
        required: (name, $item) ->
            regex = /^\s+$/
            value = $item.val().trim()
            result = !!value.length && !regex.test(value)

        email: (name, $item) ->
            regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            value = $item.val()?.trim()
            result = regex.test(value)

    # 验证规则配置
    Validator::defineValues = 
        maxLength: null,
        minLength: null,
        max: null,
        min: null,
        check: null

    # 配置验证规则
    Validator::storeValue = (rule) ->
        pattern_maxLength = /maxLength=/i
        pattern_minLength = /minLength=/i
        pattern_check    = /check=/i
        patterns = [pattern_maxLength, pattern_minLength, pattern_check]

        for pattern in patterns
            if rule.match pattern
                rule = rule.split('=')
                switch pattern
                    when pattern_maxLength
                        @defineValues.maxLength = rule[1]
                        return rule[0]
                    when pattern_minLength
                        @defineValues.minLength = rule[1]
                        return rule[0]
                    when pattern_check
                        @defineValues.check = rule[1]
                        return rule[0]

        rule

    Validator::passValidator = (name, $item) ->
        # TODO: 判断select/checkbox/radio
        @validFields[name] = $item.val()

    Validator::errorValidator = (name, $item, msg) ->
        @unvalidFields.push {name: name, msg: msg, item: $item}

    Validator::validateReturn = () ->
        if @unvalidFields.length then @falsyReturn() else @truthyReturn()

    Validator::truthyReturn = () ->
        @cb(@validFields)

    Validator::falsyReturn = () ->
        if not @multiple
            if @isOnParent then @unvalidFields[0].item.parent().addClass @errorClass else @unvalidFields[0].item.addClass @errorClass
            @cb(@unvalidFields[0])
        else 
            for field in @unvalidFields
                if @isOnParent then field.item.parent().addClass @errorClass else field.addClass @errorClass

    Validator::checker = (names) ->
        for name of names when names.hasOwnProperty name
            identifier = "*[data-validator=#{name}]"
            $item = @$element.find($(identifier))
            if not $item.length then throw new Error('Validator: please fill in a element that exisits in your form')
            if not $item.data('rules').length then throw new Error('Validator: please fill in data-rules attributes')
            rules = $item.data('rules').split(' ')

            for rule in rules
                # 配置验证规则
                rule = @storeValue rule
                # 调用验证规则
                result = @patterns[rule](name, $item)
                # 验证报错
                if not result then @errorValidator(name, $item, names[name][rule]) else @passValidator(name, $item)

            @validateReturn()

    # 逻辑操作
    Validator::validate = (opts, cb) ->
        @msg = opts.msg || {}
        @isOnParent = opts.isOnParent || true
        @multiple = opts.multiple || false
        @cb = cb
        @unvalidFields = []
        @validFields = []

        # `has-error` is bootstrap default input error
        @errorClass = opts.errorClass || 'has-error'
        @checker(opts.msg)

    old = $.fn.validate

    $.fn.validate = (config, callback) ->
        new Validator(@).validate(config, callback)

    $.fn.validate.constructor = Validator

    $.fn.validate.noConflict = ->
        $.fn.validate = old
        @

do (factory) ->
    if typeof define is "function" and define.amd

        # AMD
        define ["jquery"], factory
    else if typeof exports is "object"

        # CommonJS
        factory require("jquery")
    else if typeof define is "function" and define.cmd

        # CMD
        define (require) ->
            require "jquery"
            factory $
    else
        window.Validator = factory(jQuery)



