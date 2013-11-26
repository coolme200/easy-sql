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

var one = exports.one = function (key, options) {
  var _key = key;
  options = options || {};
  var pool = options.sqlPool || OPTIONS.sqlPool;
  var sql = SQL[_key] || null;
  if (!sql) {
    if (path.extname(key) !== SUFFIX) {
      key += SUFFIX;
    }
    var filePath = path.resolve(pool, key);
    if (fs.existsSync(filePath)) {
      sql = SQL[_key] = utils.clean(fs.readFileSync(filePath, 'utf8'));
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
  var sql = SQL[key];
  if (!sql) {
    var sql = one(key, options);
    if (sql) {
      sql = SQL[key] = utils.thin(ejs.render(sql, params));
    }  
  }
  return sql;
};

exports.init = function (options) {
  options = options || {};
  for (var key in options) {
    OPTIONS[key] = options[key];
  }
};
