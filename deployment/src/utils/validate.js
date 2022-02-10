"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cardid = cardid;
exports.checkIdcard = checkIdcard;
exports.isvalidUsername = isvalidUsername;
exports.isvalidatemobile = isvalidatemobile;
exports.startMoneyRule = startMoneyRule;
exports.vaildatePc = void 0;
exports.validBankNumForm = validBankNumForm;
exports.validEmalForm = validEmalForm;
exports.validPhoneForm = validPhoneForm;
exports.validatAlphabets = validatAlphabets;
exports.validateAgeForm = validateAgeForm;
exports.validateBankNum = validateBankNum;
exports.validateEmail = validateEmail;
exports.validateLowerCase = validateLowerCase;
exports.validatePass = validatePass;
exports.validateURL = validateURL;
exports.validateUpperCase = validateUpperCase;
exports.validatename = validatename;
exports.validatenull = validatenull;
exports.validatenum = validatenum;
exports.validatenumber = validatenumber;
exports.validatenumord = validatenumord;

/**
 * Created by jiachenpan on 16/11/18.
 */
function isvalidUsername(str) {
  var valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}
/* 合法uri */


function validateURL(textval) {
  var strRegex = "^((https|http)?://)";
  var re = new RegExp(strRegex);
  var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return re.test(textval);
}
/* 小写字母 */


function validateLowerCase(str) {
  var reg = /^[a-z]+$/;
  return reg.test(str);
}
/* 大写字母 */


function validateUpperCase(str) {
  var reg = /^[A-Z]+$/;
  return reg.test(str);
}
/* 大小写字母 */


function validatAlphabets(str) {
  var reg = /^[A-Za-z]+$/;
  return reg.test(str);
}
/* 数字和字母 */


function validatenumber(str) {
  var reg = /^[a-z0-9]{3,10}$/;
  return reg.test(str);
}
/* 验证pad还是pc */


var vaildatePc = function vaildatePc() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  var flag = true;

  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) >= 0) {
      flag = false;
      break;
    }
  }

  return flag;
};
/**
 * validate email
 * @param email
 * @returns {boolean}
 */


exports.vaildatePc = vaildatePc;

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
/**
 * 判断身份证号码
 */


function cardid(code) {
  var list = [];
  var result = true;
  var msg = '';
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  };

  if (!validatenull(code)) {
    if (code.length == 18) {
      if (!code || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        msg = '证件号码格式不正确';
      } else if (!city[code.substr(0, 2)]) {
        msg = '地址编码不正确';
      } else {
        // 18位身份证需要验证最后一位校验位
        code = code.split(''); // ∑(ai×Wi)(mod 11)
        // 加权因子

        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 校验位

        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2, 'x'];
        var sum = 0;
        var ai = 0;
        var wi = 0;

        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        /*const last = parity[sum % 11];*/


        if (parity[sum % 11] != code[17]) {
          msg = '证件号码校验位不正确';
        } else {
          result = false;
        }
      }
    } else {
      msg = '证件号码长度不正确，应为18位';
    }
  } else {
    msg = '请输入证件号码';
  }

  list.push(result);
  list.push(msg);
  return list;
}
/**
 * 判断手机号码是否正确
 */


function isvalidatemobile(phone) {
  var list = [];
  var result = true;
  var msg = '';
  var isMob = /^1(2|3|4|5|6|7|8|9)\d{9}$/;

  if (!validatenull(phone)) {
    if (phone.length == 11) {
      if (!isMob.test(phone)) {
        msg = '手机号码格式不正确';
      } else {
        result = false;
      }
    } else {
      msg = '请输入11位手机号码';
    }
  } else {
    result = false;
  }

  list.push(result);
  list.push(msg);
  return list;
}
/**
 * 判断姓名是否正确
 */


function validatename(name) {
  var regName = /^[\u4e00-\u9fa5]{2,4}$/;
  if (!regName.test(name)) return false;
  return true;
}
/**
 * 判断是否为整数
 */


function validatenum(num, type) {
  var regName = /[^\d.]/g;

  if (type == 1) {
    if (!regName.test(num)) return false;
  } else if (type == 2) {
    regName = /[^\d]/g;
    if (!regName.test(num)) return false;
  }

  return true;
}
/**
 * 判断是否为小数
 */


function validatenumord(num, type) {
  var regName = /[^\d.]/g;

  if (type == 1) {
    if (!regName.test(num)) return false;
  } else if (type == 2) {
    regName = /[^\d.]/g;
    if (!regName.test(num)) return false;
  }

  return true;
}
/**
 * 判断是否为空
 */


function validatenull(val) {
  if (val instanceof Array) {
    if (val.length == 0) return true;
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true;
  } else {
    if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
    return false;
  }

  return false;
} //护照 通行证校验


function validatePass(idType, val) {
  if (idType == "3133100226") {
    if (!/(^(EC)\d{7}$)|(^(14|15)\d{7}$)|(^\d{9}$)|(^(SE)\d{7}$)|(^(PE)\d{7}$)|(^(DE)\d{7}$)|(^(G|P|S|D)\d{8}$)/.test(val)) {
      this.$message.warning("护照输入不合法");
    }
  } else if (idType == "3133100328") {
    if (!/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/.test(val)) {
      this.$message.warning("通行证输入不合法");
    }
  }
}

function checkIdcard(num) {
  num = num.toUpperCase(); //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。

  if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
    //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
    this.$message.warning("身份证长度不对！");
    return false;
  } //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
  //下面分别分析出生日期和校验位


  var len, re;
  len = num.length;

  if (len == 15) {
    this.$message.warning(num + ",身份证号码需为18位！");
    return false;
  }

  if (len == 18) {
    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    var arrSplit = num.match(re); //检查生日日期是否正确

    var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
    var bGoodDay;
    bGoodDay = dtmBirth.getFullYear() == Number(arrSplit[2]) && dtmBirth.getMonth() + 1 == Number(arrSplit[3]) && dtmBirth.getDate() == Number(arrSplit[4]);

    if (!bGoodDay) {
      this.$message.warning(num + ",输入的身份证号里出生日期不对！");
      return false;
    } else {
      //检验18位身份证的校验码是否正确。
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var valnum;
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var nTemp = 0,
          i;

      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i];
      }

      valnum = arrCh[nTemp % 11];

      if (valnum != num.substr(17, 1)) {
        this.$message.warning(num + ",身份证校验不通过！");
        return false;
      }

      return true;
    }
  }

  return false;
} //银行卡号


function validateBankNum(num) {
  var re = /^([1-9]{1})(\d{15}|\d{18})$/;
  return re.test(num);
} //表单银行卡号


function validBankNumForm(rule, value, callback) {
  if (value) {
    if (!validateBankNum(value)) {
      callback(new Error("请输入正确的银行卡号"));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

; //表单年龄校验

function validateAgeForm(rule, value, callbackFn) {
  var reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/; //年龄是1-120之间有效

  if (value) {
    if (!reg.test(value)) {
      callbackFn(new Error("年龄输入不合法"));
    } else if (value < 18) {
      callbackFn(new Error("年龄需大于18岁"));
    } else {
      callbackFn();
    }
  }

  callbackFn();
} // 表单邮箱


function validEmalForm(rule, value, callback) {
  if (value) {
    if (!validateEmail(value)) {
      callback(new Error("请输入正确的邮箱地址"));
    } else {
      callback();
    }
  } else {
    callback();
  }
} // 表单电话


function validPhoneForm(rule, value, callback) {
  if (value) {
    if (isvalidatemobile(value)[0] == true) {
      callback(new Error("请输入正确的手机号码"));
    } else {
      callback();
    }
  } else {
    callback();
  }
}
/**
 * 判断数字范围是否正确
 * @param min
 * @param max
 */


function startMoneyRule(value, min, max) {
  var list = [];
  var result = true;
  var msg = '';

  if (min && !max) {
    if (value && value < min) {
      msg = '不得小于' + min;
      result = false;
    }
  }

  if (!min && max) {
    if (value && value > max) {
      msg = '不得大于' + max;
      result = false;
    }
  }

  if (min && max) {
    if (!(value >= min && value <= max)) {
      msg = "\u8BF7\u8F93\u5165".concat(min, "\uFF5E").concat(max, "\u4E4B\u95F4\u7684\u503C");
      result = false;
    }
  }

  list.push(result);
  list.push(msg);
  return list;
}