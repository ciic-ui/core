"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cachInsightDicts = cachInsightDicts;
exports.getBirthDayFromIdCard = exports.debounce = void 0;
exports.getCodeFun = getCodeFun;
exports.signature = exports.pubSub = exports.paramUrl2Obj = exports.obj2ParamUrl = exports.loadScript = exports.isInnerHost = exports.getSexFromIdCard = void 0;
exports.toLogin = toLogin;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _utils = require("../utils");

var _store = require("../store");

var _md = _interopRequireDefault(require("md5"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * ????????????
 * @param appcode appcode
 * @param timestap ?????????
 * @param data body
 * @param params params
 */
var signature = function signature(appcode, timestap, data, params) {
  return (0, _md.default)(appcode + '__' + timestap + '__' + JSON.stringify(data) + '__' + JSON.stringify(params));
};
/**
 * ?????????????????????????????????????????????
 */


exports.signature = signature;

function toLogin() {
  // ????????????
  _store.store.commit("SET_USER_INFO", {});

  _store.store.commit("SET_ACCESS_TOKEN", "");

  _store.store.commit("SET_REFRESH_TOKEN", "");

  _store.store.commit("SET_ROLES", []);

  _store.store.commit("SET_MENU_ROUTERS", []);

  _store.store.commit("SET_MENU", []);

  _store.store.commit("SET_ORGTREE", []);

  _store.store.commit("SET_ISSHOWEMPLOYEE", false);

  _store.store.commit("DEL_ALL_TAG");

  localStorage.removeItem('insightDicts'); // router.push({ path: '/login' });
}
/**
 * ??????script???js
 * @param {*} url ??????js?????????
 * @param {*} callback ????????????
 * @returns ??????Promise??????
 */


var loadScript = function loadScript(url, callback) {
  return new Promise(function (resolve) {
    var script = window.document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    window.document.getElementsByTagName('head')[0].appendChild(script);

    if (script.readyState) {
      // ie?????????
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          resolve(true);

          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      };
    } else {
      // ??????
      script.onload = function () {
        resolve(true);

        if (callback && typeof callback === 'function') {
          callback();
        }
      };
    }
  });
};
/**
 * ???insight????????????????????????????????????????????????
 * @param string
 * @param callback
 */


exports.loadScript = loadScript;

function cachInsightDicts(string, callback) {
  var codeList = getCodeFun(code);
  var initArr = string.split(',');

  if (codeList.length != initArr.length) {
    codeList.map(function (val) {
      initArr.map(function (item, index) {
        if (val == item) {
          initArr.splice(index, 1);
        }
      });
    });
  }

  if (initArr.length > 0) {
    getOperateCache(initArr.join(',')).then(function (res) {
      var obj = getStore({
        name: 'insightDicts'
      }) ? JSON.parse(getStore({
        name: 'insightDicts'
      })) : {};
      var cacheList = res.data.data;
      var newObj = Object.assign(obj, cacheList);
      console.log(newObj);
      setStore({
        name: 'insightDicts',
        content: JSON.stringify(newObj)
      });
      callback();
    });
  } else {
    callback();
  }
}
/**
 * ???????????????code??????
*/


function getCodeFun(code) {
  if (!$.isEmptyObject(code)) {
    var _arr = [];
    Object.keys(code).map(function (val) {
      _arr.push(code[val]);
    });
    return _arr;
  }
}
/**
 * ??????????????????????????????URL???
 * @param url ????????????URL
 * @param obj ??????????????????
 * @param encode ????????????????????????
 * @returns ??????????????????URL
 */


var obj2ParamUrl = function obj2ParamUrl(url, obj, encode) {
  var itemList = [];

  for (var key in obj) {
    if ((0, _typeof2.default)(obj[key]) === 'object') {
      itemList.push("".concat(key, "=").concat(JSON.stringify(obj[key])));
    } else {
      itemList.push("".concat(key, "=").concat(obj[key]));
    }
  }

  var quest = '';

  if (!url.includes('?')) {
    quest = '?';
  }

  url = "".concat(url).concat(quest).concat(itemList.join('&'));

  if (encode) {
    return window.encodeURI(url);
  }

  return url;
};
/**
 * ???URL???????????????????????????????????????????????????{};
 * @param url url??????
 * @param decode ????????????????????????
 */


exports.obj2ParamUrl = obj2ParamUrl;

var paramUrl2Obj = function paramUrl2Obj(url, decode) {
  if (decode) {
    url = decodeURI(url);
  }

  var obj = {};
  var searchParams = new window.URLSearchParams(url.substring(url.indexOf('?') + 1)); // ?????????/??????

  var _iterator = _createForOfIteratorHelper(searchParams.entries()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var pair = _step.value;
      obj[pair[0]] = pair[1];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return obj;
};
/**
 * ?????????-?????????  ????????????
 */


exports.paramUrl2Obj = paramUrl2Obj;
var pubSub = {
  typeMap: {},
  //{type:[] }

  /**
   * ?????????
   * @param type ????????????
   * @param data ????????????
   */
  next: function next(type, data) {
    if (Array.isArray(this.typeMap[type])) {
      this.typeMap[type].forEach(function (item) {
        item(data);
      });
    }
  },

  /**
   * ?????????
   * @param type ????????????
   * @param fn ????????????
   */
  subscribe: function subscribe(type, fn) {
    if (this.typeMap[type]) {
      this.typeMap[type].push(fn);
    } else {
      this.typeMap[type] = [fn];
    }
  }
};
/**
 * ??????????????????
 * @param func ?????????????????????
 * @param wait ?????????????????????
 * @param immediate ???????????????????????????
 */

exports.pubSub = pubSub;

var debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    if (timeout) clearTimeout(timeout);

    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
};
/**
 * ???????????????????????????????????????
 * @param idCard ????????????
 * @param format ?????????????????????????????????YYYY-MM-DD
 * @returns ?????????????????????
 */


exports.debounce = debounce;

var getBirthDayFromIdCard = function getBirthDayFromIdCard(idCard, format) {
  if (idCard && typeof idCard === 'string' && idCard.length === 18) {
    if (_utils.RegExpUtil.idcard.pattern.test(idCard)) {
      var regExp = /^YYYY*.MM*.DD*.$/;
      if (!regExp.test(format)) format = 'YYYY-MM-DD';
      return format.replace('YYYY', idCard.substr(6, 4)).replace('MM', idCard.substr(10, 2)).replace('DD', idCard.substr(12, 2));
    } else {
      return "";
    }
  } else {
    return "";
  }
};
/**
 * ??????????????????????????? 1 = ???  ??? 2=?????? 
 * @param {*} idCard 
 */


exports.getBirthDayFromIdCard = getBirthDayFromIdCard;

var getSexFromIdCard = function getSexFromIdCard(idCard) {
  if (idCard && typeof idCard === 'string' && idCard.length === 18 && idCard.substr(16, 1) % 2) {
    return 1;
  } else {
    return 2;
  }
};
/**
 * ???????????????
 * @param {*} ip host??????
 */


exports.getSexFromIdCard = getSexFromIdCard;

var isInnerHost = function isInnerHost() {
  function getIpNum(ipAddress) {
    /*??????IP???*/
    var ip = ipAddress.split(".");
    var a = parseInt(ip[0]);
    var b = parseInt(ip[1]);
    var c = parseInt(ip[2]);
    var d = parseInt(ip[3]);
    var ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
    return ipNum;
  }

  function isInner(userIp, begin, end) {
    return userIp >= begin && userIp <= end;
  } // ??????????????????url


  var curPageUrl = window.location.href;
  var reg1 = /(http|ftp|https|www):\/\//g; //????????????

  curPageUrl = curPageUrl.replace(reg1, '');
  var reg2 = /\:+/g; //?????????????????????

  curPageUrl = curPageUrl.replace(reg2, '.');
  curPageUrl = curPageUrl.split('.'); //???????????????????????????

  var ipAddress = curPageUrl[0] + '.' + curPageUrl[1] + '.' + curPageUrl[2] + '.' + curPageUrl[3];
  var isInnerIp = false; //????????????IP????????????IP      

  var ipNum = getIpNum(ipAddress);
  /** 
   * ??????IP???A???  10.0.0.0    -10.255.255.255 
   *       B???  172.16.0.0  -172.31.255.255    
   *       C???  192.168.0.0 -192.168.255.255   
   *       D???   127.0.0.0   -127.255.255.255(????????????)  
   **/

  var aBegin = getIpNum("10.0.0.0");
  var aEnd = getIpNum("10.255.255.255");
  var bBegin = getIpNum("172.16.0.0");
  var bEnd = getIpNum("172.31.255.255");
  var cBegin = getIpNum("192.168.0.0");
  var cEnd = getIpNum("192.168.255.255");
  var dBegin = getIpNum("127.0.0.0");
  var dEnd = getIpNum("127.255.255.255");
  isInnerIp = isInner(ipNum, aBegin, aEnd) || isInner(ipNum, bBegin, bEnd) || isInner(ipNum, cBegin, cEnd) || isInner(ipNum, dBegin, dEnd);
  return isInnerIp || window.location.href.startsWith('http://localhost:');
};

exports.isInnerHost = isInnerHost;