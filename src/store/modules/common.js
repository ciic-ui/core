

import {
  local,
  session
} from '../../core/storage';

const common = {

  state: {
    reLoginMsg: false,
    isCollapse: false,
    isShowEmployee: session.getItem(
      'isShowEmployee'
    ) || false,
    isFullScren: false,
    isLock: session.getItem(
      'isLock'
    ) || false,
    dicts: session.getItem(
      'dicts'
    ) || null,

    theme: session.getItem(
      'theme'
    ) || '#409EFF',
    lockPasswd: session.getItem(
      'lockPasswd'
    ) || '',
    loadingStatus: {
      main: null,
      full: null,
    },
    isRouterAlive: true,

    isIndex: true,  //当前路由是否是首页
    showPanel: {
      show: false,
      type: 'waitDone'  //区分是数据中心还是待办提醒
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
    ADD_REQUEST_COUNT: (state) => {
      state.requestCount = state.requestCount + 1
    },
    SUBTRACT_REQUEST_COUNT: (state) => {
      state.requestCount = state.requestCount - 1
      if (state.requestCount < 0) state.requestCount = 0
    },

    SET_REQUEST_END_TIMER: (state, requestEndTimer) => {
      state.requestEndTimer = requestEndTimer
    },
    SET_PREV_REQUEST_END_TIME: (state, prevRequsetEndTime) => {
      state.prevRequsetEndTime = prevRequsetEndTime
    },
    SET_RELOGINMSG: (state, flag) => {
      state.reLoginMsg = flag;
    },
    SET_COLLAPSE: (state, flag) => {
      state.isCollapse = flag;
    },
    SET_ISSHOWEMPLOYEE: (state, flag) => {
      state.isShowEmployee = flag
        ({
          name: 'isShowEmployee',
          content: state.isShowEmployee,
          type: 'session',
        });
    },
    SET_DICTS: (state, dicts) => {
      state.dicts = dicts;
      session.setItem(
        'dicts', state.dicts
      );
    },
    SET_ROUTERALIVE: (state, isRouterAlive) => {
      state.isRouterAlive = isRouterAlive;
    },
    SET_FULLSCREN: (state, action) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_SHOWPANEL: (state, showPanel) => {
      state.showPanel = showPanel
    },
    SET_SEARCHBOX: (state, searchBox) => {
      state.searchBox = searchBox
    },
    SET_LOCK: (state, action) => {
      state.isLock = true;
      session.setItem(
        'isLock', state.isLock
      );
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      session.setItem(
        'lockPasswd', state.lockPasswd
      );
    },
    CLEAR_LOCK: (state, action) => {
      state.isLock = false;
      state.lockPasswd = '';
      session.removeItem('lockPasswd'
      );
      session.removeItem('isLock'
      );
    },
    SET_LOADING_STATUS: (state, { main = null, full = null } = {}) => {
      state.loadingStatus = { main, full };
    },
    SET_ISINDEX: (state, isIndex) => {
      state.isIndex = isIndex;
    },

  },
  actions: {
    setRelogin({ commit }, info) {
      commit("SET_RELOGINMSG", info);
    }
  }
};
export default common;
