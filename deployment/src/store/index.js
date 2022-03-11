"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = exports.register = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

var _storage = require("../core/storage");

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  state: {
    accessToken: '',
    httpCount: 0,
    loadding: false,
    siteConfig: {}
  },
  mutations: {
    SET_ACCESS_TOKEN: function SET_ACCESS_TOKEN(state, accessToken) {
      state.accessToken = accessToken;

      _storage.session.setItem('accessToken', state.accessToken);
    },
    SET_HTTPCOUNT: function SET_HTTPCOUNT(state, data) {
      state.httpCount = data;
    },
    SET_LOADING: function SET_LOADING(state, data) {
      state.loadding = !!data;
    }
  },
  getters: {}
});
exports.store = store;

var register = function register(path, module, moduleOptions) {
  store.registerModule(path, module, moduleOptions);
};

exports.register = register;