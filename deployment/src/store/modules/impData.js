"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var impData = {
  // 用于修改行数据
  state: {
    contentList: [],
    // 导入内容
    noMatchTitleList: [],
    // 未匹配的标题
    matchTitleList: [],
    // 已匹配的标题
    fileTitleList: [],
    // 导入excel的表头
    fileName: [],
    // 导出excel的名称
    successCount: 0,
    // 导入成功的条数
    errorCount: 0,
    // 导入失败的条数
    success: '',
    // 导入状态
    tableNames: '',
    // 导入的临时表名
    tmplIds: '' // 导入的模板id 可以多个

  },
  mutations: {}
};
var _default = impData;
exports.default = _default;