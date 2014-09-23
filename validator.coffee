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
            if $item.prop('tagName') is 'SELECT' then return result = !$item.find(':selected').val()
            if $item.attr('type') is 'checkbox' or $item.attr('type') is 'radio' then return result = !$item.find(':checked').val()

            regex = /^\s+$/
            value = $item.val().trim()
            result = !!value.length && !regex.test value

        email: (name, $item) ->
            regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            value = $item.val()?.trim()
            result = regex.test value

        # 手机：仅中国手机适应；以 1 开头，第二位是 3-9，并且总位数为 11 位数字
        mobile: (name, $item) ->
            regex = /^1[3-9]\d{9}$/
            value = $item.val()?.trim()
            result = regex.test value

        # 座机：仅中国座机支持；区号可有 3、4位数并且以 0 开头；电话号不以 0 开头，最 8 位数，最少 7 位数
        # 但 400/800 除头开外，适应电话，电话本身是 7 位数
        # 0755-29819991 | 0755 29819991 | 400-6927972 | 4006927927 | 800...
        tel: (name, $item) ->
            regex = /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/
            value = $item.val()?.trim()
            result = regex.test value

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
        if $item.prop('tagName') is 'SELECT' then return @validFields[name] = $item.find(':selected').val()
        if $item.attr('type') is 'radio' then return @validFields[name] = $item.find(':checked').val()
        if $item.attr('type') is 'checkbox'
            @validFields[name] = []
            for checkbox in $item.find(':checked')
                @validFields[name].push(checkbox)
            return

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

    Validator::bindEvents = ($item) ->
        $item.on 'focus', () =>
            if @isOnParent then $item.parent().removeClass @errorClass else $item.removeClass @errorClass

    Validator::checker = (names) ->
        for name of names when names.hasOwnProperty name
            identifier = "*[data-validator=#{name}]"
            $item = @$element.find($(identifier))

            # 表单中不存在指定 `data-validator` 的dom element
            if not $item.length then throw new Error('Validator: please fill in a element that exisits in your form')
            # `data-validator` 项没有设置 `data-rules' 属性
            if not $item.data('rules').length then throw new Error('Validator: please fill in data-rules attributes')

            rules = $item.data('rules').split(' ')

            @bindEvents $item

            for rule in rules
                # 配置验证规则
                rule = @storeValue rule
                # 调用验证规则
                result = @patterns[rule](name, $item)
                # 验证报错
                # if not result and rules.indexOf('required') isnt -1
                if not result and rules.indexOf('required') isnt -1
                    @errorValidator(name, $item, names[name][rule])
                else if result
                    @passValidator(name, $item)

            @validateReturn()

    # 逻辑操作
    # 
    # 参数：opts = 
    #   msg: 指定 `data-validator` 项验证不通过时返回的内容
    #   multiple: 是否遇到错误即退出 or 等验证全部选项后返回结果
    #   errorClass: 验证不通过时将添加在指定验证项上的class
    #   isOnParent: 验证不通过时错误class是否添加在指定验证项的父元素上
    #
    #   cb: 回调函数
    # 
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



