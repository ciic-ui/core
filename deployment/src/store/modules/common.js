"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _storage = require("../../core/storage");

var common = {
  state: {
    reLoginMsg: false,
    isCollapse: false,
    isShowEmployee: _storage.session.getItem('isShowEmployee') || false,
    isFullScren: false,
    isLock: _storage.session.getItem('isLock') || false,
    dicts: _storage.session.getItem('dicts') || null,
    theme: _storage.session.getItem('theme') || '#409EFF',
    lockPasswd: _storage.session.getItem('lockPasswd') || '',
    loadingStatus: {
      main: null,
      full: null
    },
    isRouterAlive: true,
    isIndex: true,
    //当前路由是否是首页
    showPanel: {
      show: false,
      type: 'waitDone' //区分是数据中心还是待办提醒

    },
    searchBox: {
      show: false,
      content: ''
    },

    /**
     * 显示隐藏loading
    */
    axiosLoading: false,

    /**
     * 处理并发
     * axios 计数
    */
    requestCount: 0,

    /**
     * 处理继发
     * axios 记状态
    */
    requestEndTimer: null,
    prevRequsetEndTime: 0
  },
  mutations: {
    ADD_REQUEST_COUNT: function ADD_REQUEST_COUNT(state) {
      state.requestCount = state.requestCount + 1;
    },
    SUBTRACT_REQUEST_COUNT: function SUBTRACT_REQUEST_COUNT(state) {
      state.requestCount = state.requestCount - 1;
      if (state.requestCount < 0) state.requestCount = 0;
    },
    SET_REQUEST_END_TIMER: function SET_REQUEST_END_TIMER(state, requestEndTimer) {
      state.requestEndTimer = requestEndTimer;
    },
    SET_PREV_REQUEST_END_TIME: function SET_PREV_REQUEST_END_TIME(state, prevRequsetEndTime) {
      state.prevRequsetEndTime = prevRequsetEndTime;
    },
    SET_RELOGINMSG: function SET_RELOGINMSG(state, flag) {
      state.reLoginMsg = flag;
    },
    SET_COLLAPSE: function SET_COLLAPSE(state, flag) {
      state.isCollapse = flag;
    },
    SET_ISSHOWEMPLOYEE: function SET_ISSHOWEMPLOYEE(state, flag) {
      state.isShowEmployee = flag({
        name: 'isShowEmployee',
        content: state.isShowEmployee,
        type: 'session'
      });
    },
    SET_DICTS: function SET_DICTS(state, dicts) {
      state.dicts = dicts;

      _storage.session.setItem('dicts', state.dicts);
    },
    SET_ROUTERALIVE: function SET_ROUTERALIVE(state, isRouterAlive) {
      state.isRouterAlive = isRouterAlive;
    },
    SET_FULLSCREN: function SET_FULLSCREN(state, action) {
      state.isFullScren = !state.isFullScren;
    },
    SET_SHOWPANEL: function SET_SHOWPANEL(state, showPanel) {
      state.showPanel = showPanel;
    },
    SET_SEARCHBOX: function SET_SEARCHBOX(state, searchBox) {
      state.searchBox = searchBox;
    },
    SET_LOCK: function SET_LOCK(state, action) {
      state.isLock = true;

      _storage.session.setItem('isLock', state.isLock);
    },
    SET_LOCK_PASSWD: function SET_LOCK_PASSWD(state, lockPasswd) {
      state.lockPasswd = lockPasswd;

      _storage.session.setItem('lockPasswd', state.lockPasswd);
    },
    CLEAR_LOCK: function CLEAR_LOCK(state, action) {
      state.isLock = false;
      state.lockPasswd = '';

      _storage.session.removeItem('lockPasswd');

      _storage.session.removeItem('isLock');
    },
    SET_LOADING_STATUS: function SET_LOADING_STATUS(state) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$main = _ref.main,
          main = _ref$main === void 0 ? null : _ref$main,
          _ref$full = _ref.full,
          full = _ref$full === void 0 ? null : _ref$full;

      state.loadingStatus = {
        main: main,
        full: full
      };
    },
    SET_ISINDEX: function SET_ISINDEX(state, isIndex) {
      state.isIndex = isIndex;
    }
  },
  actions: {
    setRelogin: function setRelogin(_ref2, info) {
      var commit = _ref2.commit;
      commit("SET_RELOGINMSG", info);
    }
  }
};
var _default = common;
exports.default = _default;