'use strict';

var set = require('set-value');
var get = require('get-value');

module.exports = function (app) {
  app.visit('mixin', {

    /**
     * Set or get an option.
     */

    option: function(key, val) {
      var len = arguments.length;
      if (len === 1 && typeof key === 'string') {
        return this.getOption(key);
      }
      if (utils.isObject(key)) {
        this.visit('option', key);
        return this;
      }
      set(this.options, key, val);
      this.emit('option', key, val);
      return this;
    },

    /**
     * Get an option.
     *
     * @param  {String} `key`
     * @return {any}
     * @api public
     */

    getOption: function (key) {
      if (key.indexOf('.') === -1) {
        return this.options[key];
      }
      return get(this.options, key);
    },

    /**
     * Enable `key`.
     *
     * ```js
     * app.enable('a');
     * ```
     * @param {String} `key`
     * @return {Object} `Options`to enable chaining
     * @api public
     */

    enable: function(key) {
      this.option(key, true);
      return this;
    },

    /**
     * Disable `key`.
     *
     * ```js
     * app.disable('a');
     * ```
     *
     * @param {String} `key` The option to disable.
     * @return {Object} `Options`to enable chaining
     * @api public
     */

    disable: function(key) {
      this.option(key, false);
      return this;
    },

    /**
     * Check if `key` is enabled (truthy).
     *
     * ```js
     * app.enabled('a');
     * //=> false
     *
     * app.enable('a');
     * app.enabled('a');
     * //=> true
     * ```
     *
     * @param {String} `key`
     * @return {Boolean}
     * @api public
     */

    enabled: function(key) {
      return Boolean(this.options[key]);
    },

    /**
     * Check if `key` is disabled (falsey).
     *
     * ```js
     * app.disabled('a');
     * //=> true
     *
     * app.enable('a');
     * app.disabled('a');
     * //=> false
     * ```
     *
     * @param {String} `key`
     * @return {Boolean} Returns true if `key` is disabled.
     * @api public
     */

    disabled: function(key) {
      return !Boolean(this.options[key]);
    }
  });
};
