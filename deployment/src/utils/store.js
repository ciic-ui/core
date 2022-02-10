"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setStore = exports.removeStore = exports.getStore = void 0;

var _validate = require("./validate.js");

var gettype = Object.prototype.toString;
/**
 * 存储localStorage
 */

var setStore = function setStore(params) {
  var name = params.name,
      content = params.content,
      type = params.type;
  var obj = {
    dataType: gettype.call(content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  };

  if (obj.dataType === '[object Set]') {
    obj.content = Array.from(obj.content);
  }

  if (type) WESESSION.setItem(name, _serialize(obj));else WELOCAL.setItem(name, _serialize(obj));
};
/**
 * 序列化对象
 * @param obj
 * @returns {string}
 * @private
 */


exports.setStore = setStore;

function _serialize(obj) {
  return JSON.stringify(obj, function (key, val) {
    if (typeof val === 'function') {
      return val + '';
    }

    return val;
  });
}
/**
 * 对象反序列化
 * @param jsonStr
 * @returns {any}
 * @private
 */


function _deserialize(jsonStr) {
  return JSON.parse(jsonStr, function (k, v) {
    if (typeof v === 'string' && v.indexOf('function') > -1) {
      return eval("(function(){return " + v + " })()");
    }

    return v;
  });
}
/**
 * 获取localStorage
 */


var getStore = function getStore(params) {
  var name = params.name;
  var obj = {};
  var content;
  obj = WELOCAL.getItem(name);
  if ((0, _validate.validatenull)(obj)) obj = WESESSION.getItem(name);
  if ((0, _validate.validatenull)(obj)) return;
  obj = _deserialize(obj);

  if (obj.dataType === '[object String]') {
    content = obj.content;
  } else if (obj.dataType === '[object Number]') {
    content = Number(obj.content);
  } else if (obj.dataType === '[object Boolean]') {
    content = eval(obj.content);
  } else if (obj.dataType === '[object Set]') {
    if ((0, _validate.validatenull)(obj.content)) {
      content = new Set();
    } else {
      content = new Set(obj.content);
    }
  } else if (obj.dataType === '[object Object]' || obj.dataType === '[object Array]') {
    content = obj.content;
  }

  return content;
};
/**
 * 删除localStorage
 */


exports.getStore = getStore;

var removeStore = function removeStore(params) {
  var name = params.name;
  WELOCAL.removeItem(name);
  WESESSION.removeItem(name);
};

exports.removeStore = removeStore;