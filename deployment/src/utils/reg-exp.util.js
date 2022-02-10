"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegExpUtil = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _RegExpUtil;

var RegExpUtil = (_RegExpUtil = {
  name: {
    pattern: /^[\u4E00-\u9FA5]{2,4}$/,
    trigger: 'blur',
    message: '请输入2-4字中文名称'
  },
  idcard: {
    pattern: /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/,
    trigger: 'blur',
    message: '请输入正确身份证号'
  },
  phone: {
    pattern: /^1[3456789]\d{9}$/,
    trigger: 'blur',
    message: '请输入正确手机号'
  },
  tel: {
    pattern: /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
    // pattern: /^[0-9]*$/,
    trigger: 'blur',
    message: '请输入正确固定电话'
  },
  phoneOrTel: {
    pattern: /^((0\d{2,3})-)(\d{7,8})|1[3456789]\d{9}$/,
    trigger: 'blur',
    message: '请输入正确电话格式'
  },
  email: {
    pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
    trigger: 'blur',
    message: '请输入正确邮箱'
  },
  postcode: {
    pattern: /^[0-9][0-9]{5}$/,
    trigger: 'blur',
    message: '请输入正确邮编'
  },
  positiveInteger: {
    pattern: /^[1-9]\d*$/,
    trigger: 'blur',
    message: '请输入正整数'
  },
  number: {
    pattern: /^[0-9]*$/,
    trigger: 'blur',
    message: '请输入数字'
  },
  positiveNumber: {
    //pattern:/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
    pattern: /(^\d+$)|(^\d+\.\d+$)/,
    trigger: 'blur',
    message: '请输入非负数字'
  }
}, (0, _defineProperty2.default)(_RegExpUtil, "name", {
  pattern: /^[\u4e00-\u9fa5]{2,6}$/,
  trigger: 'blur',
  message: '请输入正确的名字'
}), (0, _defineProperty2.default)(_RegExpUtil, "numOrLetter", {
  pattern: /^[a-zA-Z0-9]*$/,
  trigger: 'blur',
  message: '请输入正确的名字'
}), (0, _defineProperty2.default)(_RegExpUtil, "inputLength", {
  pattern: /^[\S]{1,20}$/,
  trigger: 'blur',
  message: '请输入20字以内'
}), (0, _defineProperty2.default)(_RegExpUtil, "textareaLength", {
  pattern: /^[\S]{1,150}$/,
  trigger: 'blur',
  message: '请输入150字以内'
}), (0, _defineProperty2.default)(_RegExpUtil, "inputCode", {
  pattern: /^[A-Za-z0-9]+$/,
  trigger: "blur",
  message: "请输入字母和数字"
}), (0, _defineProperty2.default)(_RegExpUtil, "proportion", {
  pattern: /^([1-9]?\d|100)%$/,
  trigger: 'blur',
  message: '请输入0-100的百分号数字'
}), (0, _defineProperty2.default)(_RegExpUtil, "textareaLengths", {
  pattern: /^[\S]{1,300}$/,
  trigger: 'blur',
  message: '请输入300字以内'
}), _RegExpUtil);
exports.RegExpUtil = RegExpUtil;