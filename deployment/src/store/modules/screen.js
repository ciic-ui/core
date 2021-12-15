"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _storage = require("../../core/storage");

var screen = {
  state: {
    clientWidth: _storage.session.getItem('clientWidth') || 1920,
    clientHeight: _storage.session.getItem('clientHeight') || 1080,
    tableSize: _storage.session.getItem('clientHeight') || 'mini',
    workspaceRect: {}
  },
  mutations: {
    SET_CLIENT_WIDTH: function SET_CLIENT_WIDTH(state, clientWidth) {
      state.clientWidth = clientWidth;

      _storage.session.setItem('clientWidth', state.clientWidth);
    },
    SET_CLIENT_HEIGHT: function SET_CLIENT_HEIGHT(state, clientHeight) {
      state.clientHeight = clientHeight;

      _storage.session.setItem('clientHeight', state.clientHeight);
    },
    SET_TABLE_SIZE: function SET_TABLE_SIZE(state) {
      var tableSize = 'mini';

      if (state.clientWidth <= 1366) {
        tableSize = 'mini';
      } else if (state.clientWidth <= 1600) {
        tableSize = 'small';
      } else if (state.clientWidth > 1600) {
        tableSize = 'medium';
      }

      state.tableSize = tableSize;

      _storage.session.setItem('tableSize', state.tableSize);
    },
    SET_WORKSPACE_RECT: function SET_WORKSPACE_RECT(state, workspaceRect) {
      state.workspaceRect = workspaceRect;
    }
  }
};
var _default = screen;
exports.default = _default;