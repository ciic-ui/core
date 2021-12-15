"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

var _user = _interopRequireDefault(require("./modules/user"));

var _common = _interopRequireDefault(require("./modules/common"));

var _impData = _interopRequireDefault(require("./modules/impData"));

var _tags = _interopRequireDefault(require("./modules/tags"));

var _screen = _interopRequireDefault(require("./modules/screen"));

var _getters = _interopRequireDefault(require("./getters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue.default.use(_vuex.default);

var _default = new _vuex.default.Store({
  modules: {
    user: _user.default,
    common: _common.default,
    tags: _tags.default,
    screen: _screen.default,
    impData: _impData.default
  },
  getters: _getters.default
});

exports.default = _default;