"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrgUploadFileFroCicc = void 0;
exports.downTemplate = downTemplate;
exports.getDownLoadOrgFileFroCiic = getDownLoadOrgFileFroCiic;
exports.uploadBnfFile = uploadBnfFile;

var _http = _interopRequireDefault(require("../http"));

// 组件上传请求
var OrgUploadFileFroCicc = function OrgUploadFileFroCicc(url, obj) {
  return (0, _http.default)({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary0h259iBkAigOjWV3'
    },
    data: obj
  });
}; // 下载组件通过文件流


exports.OrgUploadFileFroCicc = OrgUploadFileFroCicc;

function getDownLoadOrgFileFroCiic(url, contentId) {
  return (0, _http.default)({
    url: url + "/".concat(contentId),
    method: 'get',
    responseType: 'arraybuffer'
  });
}
/*
* downUrl和uploadUrl 都是 服务名+ 接口地址
* let calUrl = '/ciic-ihr-salary-service'
* eq: calUrl + `/mvc/WageTotalBudget/template`,
* */
//下载导入模板


function downTemplate(downUrl, methods) {
  return (0, _http.default)({
    url: downUrl,
    method: methods ? methods : 'get',
    responseType: 'arraybuffer',
    header: {
      contentType: 'application/octet-stream; charset=utf-8'
    }
  });
} // 导入上传接口地址


function uploadBnfFile(data, uploadUrl) {
  return (0, _http.default)({
    url: uploadUrl,
    method: 'post',
    data: data
  });
}