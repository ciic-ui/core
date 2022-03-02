"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getBoundingClientRect = _getBoundingClientRect;
exports._getClientHeight = _getClientHeight;
exports.clearEmptyTreeChildren = exports.base64Encode = void 0;
exports.colorRgb = colorRgb;
exports.deepCopy = deepCopy;
exports.downloadFile = void 0;
exports.downloadPic = downloadPic;
exports.exitFullScreen = void 0;
exports.find = find;
exports.findParent = exports.findByvalue = exports.findArray = void 0;
exports.formatDate = formatDate;
exports.getTreePid = exports.getTreeChildrenId = exports.getTreeAllPid = exports.getInervalHour = exports.getCurrentMonthLast = exports.getCurrentMonthFirst = exports.getCompanyCodeFromUrl = exports.getAuthorizedMenu = exports.fullscreenToggel = exports.fullscreenEnable = void 0;
exports.isJSON = isJSON;
exports.isJsonString = isJsonString;
exports.isNonNegativeNumber = void 0;
exports.isObject = isObject;
exports.loadStyle = exports.listenfullscreen = exports.isStrNotEmpty = void 0;
exports.plusOrMinus = plusOrMinus;
exports.reqFullScreen = exports.randomLenNum = void 0;
exports.resetObj = resetObj;
exports.ucs2_utf8 = exports.signature = exports.setUrlPath = exports.setTitle = exports.resolveUrlPath = void 0;
exports.uuid = uuid;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _md = _interopRequireDefault(require("md5"));

var _validate = require("./validate");

var _vue = _interopRequireDefault(require("vue"));

var _html2canvas = _interopRequireDefault(require("html2canvas"));

/**
 * Get the first item that pass the test
 * by second argument function
 
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find(list, f) {
  return list.filter(f)[0];
}
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


function deepCopy(obj) {
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  // just return if obj is immutable value
  if (obj === null || (0, _typeof2.default)(obj) !== "object") {
    return obj;
  } // if obj is hit, it is in circular structure


  var hit = find(cache, function (c) {
    return c.original === obj;
  });

  if (hit) {
    return hit.copy;
  }

  var copy = Array.isArray(obj) ? [] : {}; // put the copy into cache at first
  // because we want to refer it in recursive deepCopy

  cache.push({
    original: obj,
    copy: copy
  });
  Object.keys(obj).forEach(function (key) {
    copy[key] = deepCopy(obj[key], cache);
  });
  return copy;
}
/**
 * 获取有权限的菜单
 */


var getAuthorizedMenu = function getAuthorizedMenu(menu, pmsSet) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "menu";
  if (!menu) return;
  var authorizedMenu = [];

  for (var i = 0; i < menu.length; i++) {
    var subMenus = menu[i].children;

    if (!menu[i].type) {
      menu[i].type = "menu";
    }

    if (menu[i].type === type) {
      // 菜单无法点击并且存在子节点
      if (subMenus && subMenus.length > 0) {
        // 将子节点替换为有权限的子节点
        menu[i].children = getAuthorizedMenu(subMenus, pmsSet);

        if (menu[i].children.length > 0) {
          authorizedMenu.push(menu[i]);
        } // 菜单可以点击，有权限访问，并且不存在子节点

      } else if (pmsSet.has(menu[i].permission) && !subMenus) {
        authorizedMenu.push(menu[i]);
      }
    }
  } // 返回有权限的子节点


  return authorizedMenu;
};
/**
 * 下载文件
 * @param resp
 * flag = fileService ciic-iba-file-service的文件下载
 */


exports.getAuthorizedMenu = getAuthorizedMenu;

var downloadFile = function downloadFile(resp, flag) {
  var data = resp.data;
  var arr = resp.headers["content-disposition"] ? resp.headers["content-disposition"].split('filename=') : []; // let filename = resp.headers["content-disposition"].substring(
  //   resp.headers["content-disposition"].indexOf("fileName=") +
  //     "fileName=".length
  // );
  // console.log(resp)

  var filename = arr[1]; // console.log(filename)

  filename = decodeURIComponent(filename);
  var blob = new Blob([data], {
    type: "application/octet-stream;charset=UTF-8" // type: "application/vnd.ms-excel"

  });

  if (typeof window.navigator.msSaveBlob !== "undefined") {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL = window.URL.createObjectURL(blob);
    var tempLink = document.createElement("a");
    tempLink.style.display = "none";

    if (flag == 'fileService') {
      tempLink.href = resp.request.responseURL;
    } else {
      //开发人员自己定义的一些问件流
      tempLink.href = blobURL;
    }

    tempLink.setAttribute("download", filename);

    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
};
/**
 * 获取树指定节点的父id
 * @param pId
 * @param treeData
 * @returns {*}
 */


exports.downloadFile = downloadFile;

var getTreePid = function getTreePid(pId, treeData) {
  console.log(pId);
  var temp = null;

  for (var i = 0; i < treeData.length; i++) {
    getPid(null, treeData[i]);

    if (temp) {
      return temp;
    }
  }

  function getPid(pNode, cNode) {
    if (cNode.id === pId) {
      return temp = pNode;
    }

    if (cNode.children) {
      for (var _i = 0; _i < cNode.children.length; _i++) {
        getPid(cNode, cNode.children[_i]);
      }
    }
  }
};
/**
 * 获取当前节点所有子节点id
 * @param treeData
 * @returns {Array}
 */


exports.getTreePid = getTreePid;

var getTreeChildrenId = function getTreeChildrenId(treeData) {
  var temp = [];
  temp.push(treeData.id);
  getPid(treeData);
  return temp;

  function getPid(node) {
    if (node.children.length == 0) {
      return;
    }

    for (var i = 0; i < node.children.length; i++) {
      temp.push(node.children[i].id);
      getPid(node.children[i]);
    }
  }
};
/**
 * 从根节点开始获取当前节点所有父节点id
 * @param treeData
 * @returns {Array}
 */


exports.getTreeChildrenId = getTreeChildrenId;

var getTreeAllPid = function getTreeAllPid(treeData, nodeId) {
  var temp = [];
  var isEnd = false;
  var id = "".concat(nodeId);

  for (var i = 0; i < treeData.length; i++) {
    if (isEnd) break;
    temp = [];
    getPid(treeData[i]);
  }

  return isEnd ? temp : [];

  function getPid(node) {
    temp.push(node.id);

    if (node.id === id) {
      isEnd = true; // temp.push(node.id)
    } else if (!isEnd) {
      if (!node.children || node.children.length === 0) {
        // 叶子节点删除数据
        temp.pop();
      } else {
        for (var _i2 = 0; _i2 < node.children.length; _i2++) {
          if (isEnd) break; // temp.push(node.id)

          getPid(node.children[_i2]);

          if (!isEnd && _i2 !== 0 && _i2 === node.children.length - 1) {
            // 当前所有子节点没有找到匹配数据，返回上一层级
            temp.pop();
          }
        }
      }
    }
  }
};
/**
 * 清除叶子节点所有空Children属性
 * @param treeData
 * @returns {Array}
 */


exports.getTreeAllPid = getTreeAllPid;

var clearEmptyTreeChildren = function clearEmptyTreeChildren(treeData) {
  // const temp = []
  // temp.push(treeData.id)
  treeData.forEach(function (data) {
    getPid(data);
  }); // getPid(treeData)
  // return temp

  function getPid(node) {
    if (node.children.length === 0) {
      _vue.default.delete(node, "children");

      return;
    }

    for (var i = 0; i < node.children.length; i++) {
      // temp.push(node.children[i].id)
      getPid(node.children[i]);
    }
  }
};
/**
 * 设置浏览器头部标题
 */


exports.clearEmptyTreeChildren = clearEmptyTreeChildren;

var setTitle = function setTitle(title) {
  title = title ? "".concat(title) : "insight-HR";
  window.document.title = title;
};
/**
 * 浏览器判断是否全屏
 */


exports.setTitle = setTitle;

var fullscreenToggel = function fullscreenToggel() {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
/**
 * esc监听全屏
 */


exports.fullscreenToggel = fullscreenToggel;

var listenfullscreen = function listenfullscreen(callback) {
  function listen() {
    callback();
  }

  document.addEventListener("fullscreenchange", function (e) {
    listen();
  });
  document.addEventListener("mozfullscreenchange", function (e) {
    listen();
  });
  document.addEventListener("webkitfullscreenchange", function (e) {
    listen();
  });
  document.addEventListener("msfullscreenchange", function (e) {
    listen();
  });
};
/**
 * 浏览器判断是否全屏
 */


exports.listenfullscreen = listenfullscreen;

var fullscreenEnable = function fullscreenEnable() {
  return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false;
};
/**
 * 浏览器全屏
 */


exports.fullscreenEnable = fullscreenEnable;

var reqFullScreen = function reqFullScreen() {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */


exports.reqFullScreen = reqFullScreen;

var exitFullScreen = function exitFullScreen() {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};
/**
 * 递归寻找子类的父类
 */


exports.exitFullScreen = exitFullScreen;

var findParent = function findParent(menu, id) {
  for (var i = 0; i < menu.length; i++) {
    if (menu[i].children.length !== 0) {
      for (var j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id === id) {
          return menu[i];
        }

        if (menu[i].children[j].children.length !== 0) {
          return findParent(menu[i].children[j].children, id);
        }
      }
    }
  }
};
/**
 * 总体路由处理器
 */


exports.findParent = findParent;

var resolveUrlPath = function resolveUrlPath(url, name) {
  var reqUrl = url; // if (url.indexOf('#') !== -1 && url.indexOf('http') === -1) {
  //   const port = reqUrl.substr(reqUrl.indexOf(':'));
  //   reqUrl = `/myiframe/urlPath?src=${baseUrl}${port}${reqUrl.replace('#', '').replace(port, '')}}&name=${name}`;
  // } else if (url.indexOf('http') !== -1) {
  //   reqUrl = `/myiframe/urlPath?src=${reqUrl}&name=${name}`;
  // } else {
  //   reqUrl = `${reqUrl}`;
  // }

  return reqUrl;
};
/**
 * 总体路由设置器
 */


exports.resolveUrlPath = resolveUrlPath;

var setUrlPath = function setUrlPath($route) {
  var value = "";

  if ($route.query.src) {
    value = $route.query.src;
  } else {
    value = $route.path;
  }

  return value;
};
/**
 * 动态插入css
 */


exports.setUrlPath = setUrlPath;

var loadStyle = function loadStyle(url) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
};
/**
 * 根据字典的value显示label
 */


exports.loadStyle = loadStyle;

var findByvalue = function findByvalue(dic, value) {
  var result = "";
  if ((0, _validate.validatenull)(dic)) return value;

  if (typeof value === "string" || typeof value === "number") {
    var index = 0;
    index = findArray(dic, value);

    if (index !== -1) {
      result = dic[index].label;
    } else {
      result = value;
    }
  } else if (value instanceof Array) {
    result = [];
    var _index = 0;
    value.forEach(function (ele) {
      _index = findArray(dic, ele);

      if (_index !== -1) {
        result.push(dic[_index].label);
      } else {
        result.push(value);
      }
    });
    result = result.toString();
  }

  return result;
};
/**
 * 根据字典的value查找对应的index
 */


exports.findByvalue = findByvalue;

var findArray = function findArray(dic, value) {
  for (var i = 0; i < dic.length; i++) {
    if (dic[i].value === value) {
      return i;
    }
  }

  return -1;
};
/**
 * 生成随机len位数字
 */


exports.findArray = findArray;

var randomLenNum = function randomLenNum(len, date) {
  var random = "";
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === "number" ? len : 4);
  if (date) random += Date.now();
  return random;
};
/**
 * base64编码
 * @param data
 * @returns {string|*}
 */


exports.randomLenNum = randomLenNum;

var base64Encode = function base64Encode(data) {
  var Base64Chars = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789@*" + "-";
  if (!data || data.length == 0) return data;
  var d = "";
  var b = ucs2_utf8(data);
  var b0, b1, b2, b3;
  var len = b.length;
  var i = 0;

  while (i < len) {
    var tmp = b[i++];
    b0 = (tmp & 0xfc) >> 2;
    b1 = (tmp & 0x03) << 4;

    if (i < len) {
      tmp = b[i++];
      b1 |= (tmp & 0xf0) >> 4;
      b2 = (tmp & 0x0f) << 2;

      if (i < len) {
        tmp = b[i++];
        b2 |= (tmp & 0xc0) >> 6;
        b3 = tmp & 0x3f;
      } else {
        b3 = 64; // 1 byte "-" is supplement
      }
    } else {
      b2 = b3 = 64; // 2 bytes "-" are supplement
    }

    d += Base64Chars.charAt(b0);
    d += Base64Chars.charAt(b1);
    d += Base64Chars.charAt(b2);
    d += Base64Chars.charAt(b3);
  }

  return d;
};

exports.base64Encode = base64Encode;

var ucs2_utf8 = function ucs2_utf8(s) {
  if (!s) return null;
  var d = new Array();
  if (s == "") return d;
  var c = 0,
      i = 0,
      j = 0;
  var len = s.length;

  while (i < len) {
    c = s.charCodeAt(i++);

    if (c <= 0x7f) {
      // 1 byte
      d[j++] = c;
    } else if (c >= 0x80 && c <= 0x7ff) {
      // 2 bytes
      d[j++] = c >> 6 & 0x1f | 0xc0;
      d[j++] = c & 0x3f | 0x80;
    } else {
      // 3 bytes
      d[j++] = c >> 12 | 0xe0;
      d[j++] = c >> 6 & 0x3f | 0x80;
      d[j++] = c & 0x3f | 0x80;
    }
  }

  return d;
};
/**
 * getBoundingClientRect兼容性处理
 * @param obj
 * @returns {{top: number, left: number, bottom: number, width: number, right: number, height: number}}
 */


exports.ucs2_utf8 = ucs2_utf8;

function _getBoundingClientRect(obj) {
  var xy = obj.getBoundingClientRect();
  var top = xy.top - document.documentElement.clientTop + document.documentElement.scrollTop,
      //document.documentElement.clientTop 在IE67中始终为2，其他高级点的浏览器为0
  bottom = xy.bottom,
      left = xy.left - document.documentElement.clientLeft + document.documentElement.scrollLeft,
      //document.documentElement.clientLeft 在IE67中始终为2，其他高级点的浏览器为0
  right = xy.right,
      width = xy.width || right - left,
      //IE67不存在width 使用right - left获得
  height = xy.height || bottom - top;
  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left,
    width: width,
    height: height
  };
}

function _getClientHeight() {
  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return h;
} // 重置对象的每一项


function resetObj(data) {
  for (var key in data) {
    data[key] = "";
  }
} // 时间格式化


function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };

  for (var k in o) {
    if (new RegExp("(".concat(k, ")")).test(fmt)) {
      var str = o[k] + "";
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }

  return fmt;
}

var getInervalHour = function getInervalHour(startDate, endDate) {
  var ms = endDate.getTime() - startDate.getTime();
  if (ms < 0) return 0;
  var a = ms / 1000 / 60 / 60;

  if (a.toString().length > 3) {
    var b = a.toFixed(1);
    return b;
  } else {
    return a;
  }
};

exports.getInervalHour = getInervalHour;

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

var isStrNotEmpty = function isStrNotEmpty(str) {
  if (str != "" && str != null && str != undefined) {
    return true;
  } else {
    return false;
  }
}; //获取当前月的第一天


exports.isStrNotEmpty = isStrNotEmpty;

var getCurrentMonthFirst = function getCurrentMonthFirst() {
  var date = new Date();
  date.setDate(1);
  var month = parseInt(date.getMonth() + 1);
  var day = date.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return date.getFullYear() + "-" + month + "-" + day;
}; //获取当前月的最后一天


exports.getCurrentMonthFirst = getCurrentMonthFirst;

var getCurrentMonthLast = function getCurrentMonthLast() {
  var date = new Date();
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  var lastTime = new Date(nextMonthFirstDay - oneDay);
  var month = parseInt(lastTime.getMonth() + 1);
  var day = lastTime.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return date.getFullYear() + "-" + month + "-" + day;
}; //校验输入正负数， 保留2位小数


exports.getCurrentMonthLast = getCurrentMonthLast;

function plusOrMinus(values) {
  if (!values) {
    return "";
  } else {
    var value = Math.round(Number(values) * 100) / 100;
    var s = value.toString().split(".");

    if (s.length == 1) {
      value = value.toString() + ".00";
      return value;
    }

    if (s.length > 1) {
      if (s[1].length < 2) {
        value = value.toString() + "0";
      }

      return value;
    }
  }
}
/* 是正整数 */


var isNonNegativeNumber = function isNonNegativeNumber(v) {
  if (v) {
    var re = new RegExp("^[0-9]+(.[0-9]{1})?$");

    if (re.test(v)) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}; // 获取当前数据导出


exports.isNonNegativeNumber = isNonNegativeNumber;

function currentTime() {
  var aData = new Date();
  var month = aData.getMonth() < 9 ? "0" + (aData.getMonth() + 1) : aData.getMonth() + 1;
  var date = aData.getDate() <= 9 ? "0" + aData.getDate() : aData.getDate();
  var value = aData.getFullYear() + month + date;
  return value;
}
/** 导出图片格式图片
 * @param ele
 * @param name
 */


function downloadPic(ele, name) {
  //生成图片
  ele = document.getElementById(ele);
  (0, _html2canvas.default)(ele, {
    dpi: 300,
    useCORS: true
  }).then(function (canvas) {
    var imgUrl; // 转成图片，生成图片地址

    imgUrl = canvas.toDataURL("image/png"); //可将 canvas 转为 base64 格式

    var eleLink = document.createElement("a");
    eleLink.href = imgUrl;
    eleLink.download = name;
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  });
} //uuid唯一值


function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
      i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    // rfc4122, version 4 form
    var r; // rfc4122 requires these characters

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4'; // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}
/**
 * 判断是否为json字符串
 * @param str
 * @returns {boolean}
 */


function isJsonString(str) {
  try {
    if ((0, _typeof2.default)(JSON.parse(str)) == "object") {
      return true;
    }
  } catch (e) {}

  return false;
}
/**
 * 判断是否为obj
 * @param obj
 * @returns {boolean}
 */


function isObject(obj) {
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
    return false;
  }

  return true;
} //十六进制颜色转换为rgb


function colorRgb(hex) {
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; // 把颜色值变成小写

  var color = hex.toLowerCase();

  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = "#";

      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }

      color = colorNew;
    } // 处理六位的颜色值，转为RGB


    var colorChange = [];

    for (var _i3 = 1; _i3 < 7; _i3 += 2) {
      colorChange.push(parseInt("0x" + color.slice(_i3, _i3 + 2)));
    }

    return "rgba(" + colorChange.join(",") + ",0.2)";
  } else {
    return color;
  }
} //判断值是否为Json


function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);

      if ((0, _typeof2.default)(obj) == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
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