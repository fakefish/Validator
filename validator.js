// Generated by CoffeeScript 1.8.0

/* 
Validator
Licensed under MIT
 */

(function() {
  'use strict';
  var factory;

  factory = function($) {
    var Validator, checked, defineValues, old;
    Validator = (function() {
      function Validator(element) {
        this.$element = $(element);
      }

      return Validator;

    })();
    checked = function($item, type) {
      var list;
      list = [];
      if (type === 'checkbox' || type === 'radio') {
        $item.each(function() {
          if ($(this).is(':checked')) {
            return list.push($(this).val());
          }
        });
      } else if (type === 'radio') {
        $item.each(function() {
          if ($(this).is(':checked')) {
            return list = $(this).val();
          }
        });
      } else if (type === 'select') {
        $item.each(function() {
          if ($(this).is(':selected')) {
            return list.push($(this).val());
          }
        });
      }
      return list;
    };
    defineValues = {
      maxLength: null,
      minLength: null,
      max: null,
      min: null,
      check: null
    };
    Validator.prototype.patterns = {
      required: function(name, $item) {
        var regex, result, value;
        if ($item.prop('tagName') === 'SELECT') {
          return result = !!checked($item, 'select').length;
        }
        if ($item.attr('type') === 'checkbox' || $item.attr('type') === 'radio') {
          return result = !!checked($item, 'checkbox').length;
        }
        regex = /^\s+$/;
        value = $item.val().trim();
        return result = !!value.length && !regex.test(value);
      },
      email: function(name, $item) {
        var regex, result, value, _ref;
        regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        value = (_ref = $item.val()) != null ? _ref.trim() : void 0;
        return result = regex.test(value);
      },
      radio: function(name, $item) {
        var result;
        return result = !!checked($item, 'radio').length;
      },
      check: function(name, $item) {
        var len, result;
        len = checked($item, 'checkbox').length;
        return result = !!len && len === +defineValues.check;
      },
      mobile: function(name, $item) {
        var regex, result, value, _ref;
        regex = /^1[3-9]\d{9}$/;
        value = (_ref = $item.val()) != null ? _ref.trim() : void 0;
        return result = regex.test(value);
      },
      tel: function(name, $item) {
        var regex, result, value, _ref;
        regex = /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/;
        value = (_ref = $item.val()) != null ? _ref.trim() : void 0;
        return result = regex.test(value);
      },
      date: function(name, $item) {
        var regex, result, value, _ref;
        regex = /^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/;
        value = (_ref = $item.val()) != null ? _ref.trim() : void 0;
        return result = regex.test(value);
      },
      number: function(name, $item) {
        var _ref;
        return isNaN(+((_ref = $item.val()) != null ? _ref.trim() : void 0));
      }
    };
    Validator.prototype.storeValue = function(rule) {
      var pattern, pattern_check, pattern_maxLength, pattern_minLength, patterns, _i, _len;
      pattern_maxLength = /maxLength=/i;
      pattern_minLength = /minLength=/i;
      pattern_check = /check=/i;
      patterns = [pattern_maxLength, pattern_minLength, pattern_check];
      for (_i = 0, _len = patterns.length; _i < _len; _i++) {
        pattern = patterns[_i];
        if (rule.match(pattern)) {
          rule = rule.split('=');
          switch (pattern) {
            case pattern_maxLength:
              defineValues.maxLength = rule[1];
              return rule[0];
            case pattern_minLength:
              defineValues.minLength = rule[1];
              return rule[0];
            case pattern_check:
              defineValues.check = rule[1];
              return rule[0];
          }
        }
      }
      return rule;
    };
    Validator.prototype.passValidator = function(name, $item) {
      if ($item.prop('tagName') === 'SELECT') {
        return this.validFields[name] = checked($item, 'select');
      }
      if ($item.attr('type') === 'radio' || $item.attr('type') === 'checkbox') {
        return this.validFields[name] = checked($item, 'checkbox');
      }
      return this.validFields[name] = $item.val();
    };
    Validator.prototype.errorValidator = function(name, $item, msg) {
      return this.unvalidFields.push({
        name: name,
        msg: msg,
        item: $item
      });
    };
    Validator.prototype.validateReturn = function() {
      if (this.unvalidFields.length) {
        return this.falsyReturn();
      } else {
        return this.truthyReturn();
      }
    };
    Validator.prototype.truthyReturn = function() {
      return this.cb(this.validFields);
    };
    Validator.prototype.falsyReturn = function() {
      var field, _i, _len, _ref, _results;
      if (!this.multiple) {
        if (this.isOnParent) {
          this.unvalidFields[0].item.parent().addClass(this.errorClass);
        } else {
          this.unvalidFields[0].item.addClass(this.errorClass);
        }
        return this.cb(this.unvalidFields[0]);
      } else {
        _ref = this.unvalidFields;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          if (this.isOnParent) {
            _results.push(field.item.parent().addClass(this.errorClass));
          } else {
            _results.push(field.addClass(this.errorClass));
          }
        }
        return _results;
      }
    };
    Validator.prototype.bindEvents = function($item) {
      return $item.on('focus', (function(_this) {
        return function() {
          if (_this.isOnParent) {
            return $item.parent().removeClass(_this.errorClass);
          } else {
            return $item.removeClass(_this.errorClass);
          }
        };
      })(this));
    };
    Validator.prototype.checker = function(names) {
      var $item, identifier, name, result, rule, rules, _i, _len, _results;
      _results = [];
      for (name in names) {
        if (!(names.hasOwnProperty(name))) {
          continue;
        }
        identifier = "*[data-validator=" + name + "]";
        $item = this.$element.find($(identifier));
        if (!$item.length) {
          throw new Error('Validator: please fill in a element that exisits in your form');
        }
        if (!$item.data('rules').length) {
          throw new Error('Validator: please fill in data-rules attributes');
        }
        rules = $item.data('rules').split(' ');
        this.bindEvents($item);
        for (_i = 0, _len = rules.length; _i < _len; _i++) {
          rule = rules[_i];
          rule = this.storeValue(rule);
          result = this.patterns[rule](name, $item);
          if (!result && rules.indexOf('required') !== -1) {
            this.errorValidator(name, $item, names[name][rule]);
          } else if (!result && rules.indexOf('required') === -1 && rule === 'required') {
            this.errorValidator(name, $item, names[name][rule]);
          } else if (result) {
            this.passValidator(name, $item);
          }
        }
        _results.push(this.validateReturn());
      }
      return _results;
    };
    Validator.prototype.validate = function(opts, cb) {
      this.msg = opts.msg || {};
      this.isOnParent = opts.isOnParent || true;
      this.multiple = opts.multiple || false;
      this.cb = cb;
      this.unvalidFields = [];
      this.validFields = [];
      this.errorClass = opts.errorClass || 'has-error';
      return this.checker(opts.msg);
    };
    old = $.fn.validate;
    $.fn.validate = function(config, callback) {
      return new Validator(this).validate(config, callback);
    };
    $.fn.validate.constructor = Validator;
    return $.fn.validate.noConflict = function() {
      $.fn.validate = old;
      return this;
    };
  };

  (function(factory) {
    if (typeof define === "function" && define.amd) {
      return define(["jquery"], factory);
    } else if (typeof exports === "object") {
      return factory(require("jquery"));
    } else if (typeof define === "function" && define.cmd) {
      return define(function(require) {
        require("jquery");
        return factory($);
      });
    } else {
      return window.Validator = factory(jQuery);
    }
  })(factory);

}).call(this);
