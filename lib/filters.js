/*!
 * easy-sql - lib/filters.js
 * Author: tangyao <tangyao@alibaba-inc.com>
 */

"use strict";

/**
 * Module dependencies.
 */

exports.isEmpty = function (obj) {
  return !this[obj];
};

exports.isNotEmpty = function (obj) {
  return !!this[obj];
};
