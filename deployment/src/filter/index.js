"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateFormat = void 0;
exports.dictFilter = dictFilter;
exports.filterCommen = filterCommen;
exports.filterMultipleCommen = void 0;
exports.formatDate = formatDate;
exports.formatNumber = formatNumber;
exports.formatTime = formatTime;
exports.html2Text = html2Text;
exports.lowercase = void 0;
exports.moneyFilter = moneyFilter;
exports.nFormatter = nFormatter;
exports.numFormat = void 0;
exports.parseTime = parseTime;
exports.pluralize = pluralize;
exports.substr = void 0;
exports.timeAgo = timeAgo;
exports.toThousandslsFilter = toThousandslsFilter;
exports.uppercase = exports.translate = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _i18n = require("../i18n");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * 翻译过滤器
 * @param key 要翻译的字段
 * @param moduleName 模块名字 string[] | string
 * @param data 要传参的数据
 */
var translate = function translate(key, moduleName, data) {
  var name = Array.isArray(moduleName) ? moduleName.join('.') : moduleName;
  return _i18n.i18n.t((name ? name + '.' : '') + key, data);
};
/**
 * 整数格式化  123456  =>  123,456
 * @param value 格式化数据
 * @param digit 数位， 【可选】 默认： 3
 * @param split 连接符 【可选】 默认： ,
 */


exports.translate = translate;

var numFormat = function numFormat(value, digit, split) {
  if (!digit) digit = 3;
  if (!split) split = ',';
  if (value) value += '';else return '';
  return value.replace(new RegExp('(\\S)(?=(?:\\S{' + digit + '})+$)', 'g'), "$1".concat(split));
};
/**
 * 时间格式化
 * @param value 目标时间
 * @param format 格式化字符串 【可选】 默认 YYYY-MM-DD HH:mm:ss
 */


exports.numFormat = numFormat;

var dateFormat = function dateFormat(value, format) {
  if (!value) return '';else return (0, _moment.default)(value).format(format || 'YYYY-MM-DD HH:mm:ss');
};
/**
 * 转换为大写
 * @param key 
 */


exports.dateFormat = dateFormat;

var uppercase = function uppercase(key) {
  if (typeof key === 'string') {
    return key.toUpperCase();
  } else {
    return key;
  }
};
/**
 * 转为小写
 * @param key 
 */


exports.uppercase = uppercase;

var lowercase = function lowercase(key) {
  if (typeof key === 'string') {
    return key.toLowerCase();
  } else {
    return key;
  }
};
/**
 * 截取字符串
 * @param {*} key 待截取的字符串
 * @param {*} reverse 是否反向截取
 * @param {*} len 截取的长度
 */


exports.lowercase = lowercase;

var substr = function substr(key, len, reverse) {
  if (typeof key === 'string') {
    if (reverse) {
      return key.substr(key.length - (len || 0), key.length);
    } else {
      return key.substr(0, len || key.length);
    }
  } else {
    return key;
  }
};
/**
 * 字典回显
 * @param val 要回显的数据
 * @param list 字典字段
 */


exports.substr = substr;

function filterCommen(val, list) {
  var name = '';

  if (list && list.length) {
    list.forEach(function (item) {
      if (val == item.id) {
        name = item.text;
      }
    });
    return name;
  }
}
/**
 * 多选字典过滤回显
 * @param key 要回显的数据
 * @param dicKey 字典字段
 * @param split 以什么分割数据
 * @param join 分割数据后以什么连接
 */


var filterMultipleCommen = function filterMultipleCommen(key, dicKey, split, join) {
  var NameC = key;

  if (key && typeof key === 'string') {
    var arr = key.split(split || ',');
    var result = [];

    if (dicKey != null && dicKey.length > 0 && arr.length) {
      arr.forEach(function (item) {
        dicKey.forEach(function (dicItem) {
          if (item === dicItem.id) {
            result.push(dicItem.text);
          }
        });
      });
      NameC = result.join(join || '、');
    }
  }

  return NameC;
};

exports.filterMultipleCommen = filterMultipleCommen;

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }

  return "".concat(time + label, "s");
}

function dictFilter(codeId, dicts, setId) {
  if (dicts && dicts.codeMap) {
    var setMap = dicts.codeMap[setId];

    if (setMap) {
      return setMap[codeId];
    }
  }
}

function timeAgo(time) {
  var between = Date.now() / 1000 - Number(time);

  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  }

  return pluralize(~~(between / 86400), ' day');
}

function parseTime(time, cFormat) {
  time = Date.parse(new Date(time));

  if (arguments.length === 0) {
    return null;
  }

  if ("".concat(time).length === 10) {
    time = +time * 1000;
  }

  var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  var date;

  if (_typeof(time) === 'object') {
    date = time;
  } else {
    date = new Date(parseInt(time));
  }

  var formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function (result, key) {
    var value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];

    if (result.length > 0 && value < 10) {
      value = "0".concat(value);
    }

    return value || 0;
  });
  return time_str;
}

function formatTime(time, option) {
  time = +time * 1000;
  var d = new Date(time);
  var now = Date.now();
  var diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return "".concat(Math.ceil(diff / 60), "\u5206\u949F\u524D");
  } else if (diff < 3600 * 24) {
    return "".concat(Math.ceil(diff / 3600), "\u5C0F\u65F6\u524D");
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }

  if (option) {
    return parseTime(time, option);
  }

  return "".concat(d.getMonth() + 1, "\u6708").concat(d.getDate(), "\u65E5").concat(d.getHours(), "\u65F6").concat(d.getMinutes(), "\u5206");
}
/* 数字 格式化 */


function formatNumber(num, digits) {
  if (num) {
    num = num.toFixed(digits || 2);
  } else if (num === 0) {
    num = '0.00';
  }

  return num;
}
/* 数字 格式化 */


function nFormatter(num, digits) {
  var si = [{
    value: 1E18,
    symbol: 'E'
  }, {
    value: 1E15,
    symbol: 'P'
  }, {
    value: 1E12,
    symbol: 'T'
  }, {
    value: 1E9,
    symbol: 'G'
  }, {
    value: 1E6,
    symbol: 'M'
  }, {
    value: 1E3,
    symbol: 'k'
  }];

  for (var i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }

  return num.toString();
}

function html2Text(val) {
  var div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, function (m) {
    return m.replace(/(?=(?!\b)(\d{3})+$)/g, ',');
  });
}
/* 金额格式化 */


function moneyFilter(val) {
  var value = val + '';
  if (!value) return '0.00';
  /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1*/

  var intPart = Number(value) | 0; //获取整数部分

  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

  var floatPart = ".00"; //预定义小数部分

  var value2Array = value.split("."); //=2表示数据有小数位

  if (value2Array.length == 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分

    if (floatPart.length == 1) {
      //补0,实际上用不着
      return intPartFormat + "." + floatPart + '0';
    } else {
      return intPartFormat + "." + floatPart;
    }
  } else {
    return intPartFormat + floatPart;
  }
}
/* vxe table-column中的日期格式化 */


function formatDate(_ref) {
  var cellValue = _ref.cellValue;
  return XEUtils.toDateString(cellValue, 'yyyy-MM-dd');
}