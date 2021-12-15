"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var getters = {
  tag: function tag(state) {
    return state.tags.tag;
  },
  isCollapse: function isCollapse(state) {
    return state.common.isCollapse;
  },
  isLock: function isLock(state) {
    return state.common.isLock;
  },
  isFullScren: function isFullScren(state) {
    return state.common.isFullScren;
  },
  isIndex: function isIndex(state) {
    return state.common.isIndex;
  },
  showPanel: function showPanel(state) {
    return state.common.showPanel;
  },
  searchBox: function searchBox(state) {
    return state.common.searchBox;
  },
  isRouterAlive: function isRouterAlive(state) {
    return state.common.isRouterAlive;
  },
  lockPasswd: function lockPasswd(state) {
    return state.common.lockPasswd;
  },
  tagList: function tagList(state) {
    return state.tags.tagList;
  },
  tagCurrent: function tagCurrent(state) {
    return state.tags.tagCurrent;
  },
  tagWel: function tagWel(state) {
    return state.tags.tagWel;
  },
  accessToken: function accessToken(state) {
    return state.user.accessToken;
  },
  refreshToken: function refreshToken(state) {
    return state.user.refreshToken;
  },
  userInfo: function userInfo(state) {
    return state.user.userInfo;
  },
  userInfoPass: function userInfoPass(state) {
    return state.user.userInfoPass;
  },
  loadingStatus: function loadingStatus(state) {
    return state.common.loadingStatus;
  },
  clientWidth: function clientWidth(state) {
    return state.screen.clientWidth;
  },
  clientHeight: function clientHeight(state) {
    return state.screen.clientHeight;
  },
  tableSize: function tableSize(state) {
    return state.screen.tableSize;
  },
  workspaceRect: function workspaceRect(state) {
    return state.screen.workspaceRect;
  },
  dicts: function dicts(state) {
    return state.common.dicts;
  },
  menuRouters: function menuRouters(state) {
    return state.user.menuRouters;
  },
  menu: function menu(state) {
    return state.user.menu;
  },
  isShowEmployee: function isShowEmployee(state) {
    return state.common.isShowEmployee;
  },
  requestCount: function requestCount(state) {
    return state.common.requestCount;
  },
  axiosLoading: function axiosLoading(state) {
    return state.common.axiosLoading;
  },
  requestEndTimer: function requestEndTimer(state) {
    return state.common.requestEndTimer;
  },
  prevRequsetEndTime: function prevRequsetEndTime(state) {
    return state.common.prevRequsetEndTime;
  }
};
var _default = getters;
exports.default = _default;