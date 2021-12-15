"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLang = exports.i18n = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueI18n = _interopRequireDefault(require("vue-i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 国际化
_vue.default.use(_vueI18n.default);

var i18n = new _vueI18n.default({
  silentFallbackWarn: true,
  locale: 'zhcn',
  // 语言标识
  missing: function missing(lang, key) {
    // 如果翻译不到取 最后一个 . 后的字符串
    if (key && key.indexOf('.') >= 0) {
      return key.substring(key.lastIndexOf('.') + 1);
    }

    return key;
  }
});
exports.i18n = i18n;

var setLang = function setLang(lang, data) {
  i18n.setLocaleMessage(lang, data);
};

exports.setLang = setLang;