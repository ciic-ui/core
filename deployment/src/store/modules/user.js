"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _storage = require("../../core/storage");

var user = {
  state: {
    userInfo: _storage.session.getItem("userInfo") || {},
    userInfoPass: _storage.session.getItem("userInfoPass") || {},
    roles: _storage.session.getItem("roles") || [],
    setting: _storage.session.getItem("setting") || [],
    accessToken: _storage.session.getItem("accessToken") || "",
    refreshToken: _storage.session.getItem("refreshToken") || "",
    menu: _storage.session.getItem("menu") || "",
    menuRouters: _storage.session.getItem("menuRouters") || "",
    OrgTree: _storage.session.getItem('OrgTree') || [],
    postTree: _storage.session.getItem('postTree') || [],
    userPermissions: _storage.session.getItem("userPermissions") || "0"
  },
  actions: {},
  mutations: {
    SET_ACCESS_TOKEN: function SET_ACCESS_TOKEN(state, accessToken) {
      state.accessToken = accessToken;

      _storage.session.setItem("accessToken", state.accessToken);
    },
    SET_USER_INFO: function SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;

      _storage.session.setItem("userInfo", state.userInfo);
    },
    SET_USER_INFOPASS: function SET_USER_INFOPASS(state, userInfo) {
      state.userInfoPass = userInfo;

      _storage.session.setItem("userInfoPass", state.userInfoPass);
    },
    SET_MENU: function SET_MENU(state, menu) {
      state.menu = menu;

      _storage.session.setItem("menu", state.menu);
    },
    SET_MENU_ROUTERS: function SET_MENU_ROUTERS(state, menuRouters) {
      state.menuRouters = menuRouters;

      _storage.session.setItem("menuRouters", state.menuRouters);
    },
    SET_REFRESH_TOKEN: function SET_REFRESH_TOKEN(state, refreshToken) {
      state.refreshToken = refreshToken;

      _storage.session.setItem("refreshToken", state.refreshToken);
    },
    SET_SETTING: function SET_SETTING(state, setting) {
      state.setting = setting;

      _storage.session.setItem("setting", state.setting);
    },
    SET_ROLES: function SET_ROLES(state, roles) {
      state.roles = roles;

      _storage.session.setItem("roles", state.roles);
    },
    SET_ORGTREE: function SET_ORGTREE(state, OrgTree) {
      state.OrgTree = OrgTree;

      _storage.session.setItem("OrgTree", state.OrgTree);
    },
    SET_POSTLIST: function SET_POSTLIST(state, postTree) {
      state.postTree = postTree;

      _storage.session.setItem("postTree", state.postTree);
    },
    SET_USERPERMISSIONS: function SET_USERPERMISSIONS(state, userPermissions) {
      state.userPermissions = userPermissions;

      _storage.session.setItem("userPermissions", state.userPermissions);
    }
  }
};
var _default = user;
exports.default = _default;