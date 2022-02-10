"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signature = exports.getCompanyCodeFromUrl = void 0;

var _md = _interopRequireDefault(require("md5"));

/**
 * 生成签名
 * @param appcode appcode
 * @param timestap 事件戳
 * @param data body
 * @param params params
 */
var signature = function signature(appcode, timestap, data, params) {
  return (0, _md.default)(appcode + '__' + timestap + '__' + JSON.stringify(data) + '__' + JSON.stringify(params));
};
/**
 * 获取地址中的CompanyCode
 */


exports.signature = signature;

var getCompanyCodeFromUrl = function getCompanyCodeFromUrl() {
  var shapIndex = window.location.href.indexOf('#');
  var urlStr = window.location.href.substring(0, shapIndex);
  var startIndex = urlStr.lastIndexOf('/');
  var str = urlStr.substring(startIndex + 1, shapIndex);
  return str;
};

exports.getCompanyCodeFromUrl = getCompanyCodeFromUrl;