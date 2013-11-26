/*!
 * easy-sql - lib/index.js
 * Author: tangyao <tangyao@alibaba-inc.com>
 */

"use strict";

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var utils = require('./utils');

var OPTIONS = {
  sqlPool: path.resolve(__dirname, '../sql_pool')
}
var SQL = {};
var MULTI = {};
var SUFFIX = '.sql';

var clean = exports.clean = function (sql) {
  sql += '\n';
  return sql.replace(/(-{2,}.*\s+)/g, ' ').replace(/\s+/g, ' ');
};

var one = exports.one = function (key, options) {
  options = options || {};
  var pool = options.sqlPool || OPTIONS.sqlPool;
  var sql = SQL[key] || null;
  if (!sql) {
    if (path.extname(key) !== SUFFIX) {
      key += SUFFIX;
    }
    var filePath = path.resolve(pool, key);
    if (fs.existsSync(filePath)) {
      sql = SQL[key] = clean(fs.readFileSync(filePath, 'utf8'));
    } else {
      console.warn('%s not found.', filePath);
    }
  }
  return sql;
};

exports.multi = function (key, options) {
  var result = MULTI[key] || [];
  if (!result.length) {
    var sql = one(key, options);
    if (sql) {
      var arr = sql.split(';');
      for (var i = 0, len = arr.length; i < len; i++) {
        var part = arr[i];
        if (!utils.isEmpty(part)) {
          result.push(part);
        }
      }
    }
    MULTI[key] = result;
  }
  return result;
};

exports.map = function (key, params, options) {
  var sql = one(key, options);
  if (sql) {
    sql = ejs.render(sql, params);
  }
  return sql;
};

exports.init = function (options) {
  options = options || {};
  for (var key in options) {
    OPTIONS[key] = options[key];
  }
};