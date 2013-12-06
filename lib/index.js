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
var filters = require('./filters');

var OPTIONS = {
  sqlPool: path.resolve(__dirname, '../sql_pool')
};
var CACHE = {};
var SQL = {};
var MULTI = {};
var SUFFIX = '.sql';

var one = exports.one = function (sqlId, options) {
  var _key = sqlId;
  options = options || {};
  var pool = options.sqlPool || OPTIONS.sqlPool;
  var sql = SQL[_key] || null;
  if (!sql) {
    if (path.extname(sqlId) !== SUFFIX) {
      sqlId += SUFFIX;
    }
    var filePath = path.resolve(pool, sqlId);
    if (fs.existsSync(filePath)) {
      sql = SQL[_key] = utils.clean(fs.readFileSync(filePath, 'utf8'));
    } else {
      console.warn('%s not found.', filePath);
    }
  }
  return sql;
};

exports.multi = function (sqlId, options) {
  var result = MULTI[sqlId] || [];
  if (!result.length) {
    var sql = one(sqlId, options);
    if (sql) {
      var arr = sql.split(';');
      for (var i = 0, len = arr.length; i < len; i++) {
        var part = arr[i];
        if (!utils.isEmpty(part)) {
          result.push(part);
        }
      }
    }
    MULTI[sqlId] = result;
  }
  return result;
};

function _render_sql(fn, params) {
  var sql = utils.thin(fn(params));
  return sql;
}

exports.map = function (sqlId, params, options) {
  params = params || {};
  for (var key in filters) {
    params[key] = filters[key];
  }
  var sql = one(sqlId, options);
  if (sql) {
    var fn = CACHE[sqlId];
    if (!fn) {
      fn = CACHE[sqlId] = ejs.compile(sql);
    }
    return _render_sql(fn, params);
  }
};

exports.init = function (options) {
  options = options || {};
  for (var key in options) {
    OPTIONS[key] = options[key];
  }
};
