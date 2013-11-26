/*!
 * easy-sql - lib/utils.js
 * Author: tangyao <tangyao@alibaba-inc.com>
 */

"use strict";

/**
 * Module dependencies.
 */

exports.isEmpty = function (str) {
  if (!str) {
    return true;
  }
  if (typeof str === 'string') {
    return !str.replace(/\s/g, '');
  }
};

exports.thin = function (str) {
  return str.replace(/\s+/g, ' ');
};

exports.clean = function (sql) {
  sql += '\n';
  return exports.thin(sql.replace(/(-{2,}.*\s+)/g, ' '));
}
