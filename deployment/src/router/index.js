"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

_vue.default.use(_vueRouter.default);

var _default = new _vueRouter.default({
  mode: 'history',
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior: function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (from.meta.keepAlive) {
      from.meta.savedPosition = document.body.scrollTop;
    }

    return {
      x: 0,
      y: to.meta.savedPosition || 0
    };
  }
});

exports.default = _default;