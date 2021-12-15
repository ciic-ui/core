"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cachInsightDicts = cachInsightDicts;
exports.getBirthDayFromIdCard = exports.debounce = void 0;
exports.getCodeFun = getCodeFun;
exports.signature = exports.pubSub = exports.paramUrl2Obj = exports.obj2ParamUrl = exports.loadScript = exports.isInnerHost = exports.getSexFromIdCard = void 0;
exports.toLogin = toLogin;

var _utils = require("../utils");

var _store = require("../store");

var _md = _interopRequireDefault(require("md5"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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
 * 错误处理，自动跳转登录页并提示
 */


exports.signature = signature;

function toLogin() {
  // 清除缓存
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
 * 加载script的js
 * @param {*} url 加载js的地址
 * @param {*} callback 回调函数
 * @returns 返回Promise对象
 */


var loadScript = function loadScript(url, callback) {
  return new Promise(function (resolve) {
    var script = window.document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    window.document.getElementsByTagName('head')[0].appendChild(script);

    if (script.readyState) {
      // ie游览器
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
      // 其他
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
 * 从insight里获取字典和组织等需要缓存的数据
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
 * 获取项目的code字典
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
 * 将对象转为参数拼接到URL上
 * @param url 要拼接的URL
 * @param obj 要转换的对象
 * @param encode 是否需要进行编码
 * @returns 返回拼接后的URL
 */


var obj2ParamUrl = function obj2ParamUrl(url, obj, encode) {
  var itemList = [];

  for (var key in obj) {
    if (_typeof(obj[key]) === 'object') {
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
 * 将URL上的参数转为对象，如果没有参数返回{};
 * @param url url地址
 * @param decode 是否需要进行解码
 */


exports.obj2ParamUrl = obj2ParamUrl;

var paramUrl2Obj = function paramUrl2Obj(url, decode) {
  if (decode) {
    url = decodeURI(url);
  }

  var obj = {};
  var searchParams = new window.URLSearchParams(url.substring(url.indexOf('?') + 1)); // 显示键/值对

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
 * 订阅者-观察者  设计模式
 */


exports.paramUrl2Obj = paramUrl2Obj;
var pubSub = {
  typeMap: {},
  //{type:[] }

  /**
   * 订阅者
   * @param type 订阅事件
   * @param data 发射数据
   */
  next: function next(type, data) {
    if (Array.isArray(this.typeMap[type])) {
      this.typeMap[type].forEach(function (item) {
        item(data);
      });
    }
  },

  /**
   * 观察者
   * @param type 观察事件
   * @param fn 回调函数
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
 * 防抖工具函数
 * @param func 需要防抖的函数
 * @param wait 延迟执行的事件
 * @param immediate 第一次是否立即执行
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
 * 根据身份证号获取出生年月日
 * @param idCard 身份证号
 * @param format 生日格式化字符串，默认YYYY-MM-DD
 * @returns 返回出生年月日
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
 * 根据身份证获取性别 1 = 男  ； 2=女； 
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
 * 是否是内网
 * @param {*} ip host地址
 */


exports.getSexFromIdCard = getSexFromIdCard;

var isInnerHost = function isInnerHost() {
  function getIpNum(ipAddress) {
    /*获取IP数*/
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
  } // 获取当前页面url


  var curPageUrl = window.location.href;
  var reg1 = /(http|ftp|https|www):\/\//g; //去掉前缀

  curPageUrl = curPageUrl.replace(reg1, '');
  var reg2 = /\:+/g; //替换冒号为一点

  curPageUrl = curPageUrl.replace(reg2, '.');
  curPageUrl = curPageUrl.split('.'); //通过一点来划分数组

  var ipAddress = curPageUrl[0] + '.' + curPageUrl[1] + '.' + curPageUrl[2] + '.' + curPageUrl[3];
  var isInnerIp = false; //默认给定IP不是内网IP      

  var ipNum = getIpNum(ipAddress);
  /** 
   * 私有IP：A类  10.0.0.0    -10.255.255.255 
   *       B类  172.16.0.0  -172.31.255.255    
   *       C类  192.168.0.0 -192.168.255.255   
   *       D类   127.0.0.0   -127.255.255.255(环回地址)  
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