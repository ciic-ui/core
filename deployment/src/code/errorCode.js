"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorCode = void 0;
var errorCode = {
  478: '验证码错误,请重新输入',
  479: '演示环境,没有权限操作',
  401: '用户名或手机号不存在',
  403: '槽糕,您似乎没有相关权限,请与您的管理员联系。',
  400: '用户名不存在或者密码错误',
  default: '系统未知错误,请反馈给管理员'
};
exports.errorCode = errorCode;