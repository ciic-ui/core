"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _axios = _interopRequireDefault(require("axios"));

var _store = _interopRequireDefault(require("../store"));

var _i18n = _interopRequireDefault(require("../i18n"));

var _common = require("../utils/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PRIORITY_GROUP = process.env.PRIORITY_GROUP || 'default'; // import NProgress from 'nprogress'
// import { Notification } from 'element-ui';

var requestContinue = 100; // 超时时间

_axios.default.defaults.timeout = 300000; // 跨域请求，允许保存cookie

_axios.default.defaults.withCredentials = true; // 重新请求标志位，避免无限循环请求

_axios.default.defaults.isRetryRequest = false;

_axios.default.defaults.validateStatus = function validateStatus(status) {
  return /^(2|3)\d{2}$/.test(status) || status === 401;
}; // HTTPrequest拦截


_axios.default.interceptors.request.use(function (config) {
  config.headers['Accept-Language'] = _i18n.default.locale; // 添加优先路由的 header 标记 ，需要配合网关和服务注册元数据

  console.info('请求会优先路由至配有spring.cloud.nacos.discovery.metadata.priority_group={} 的服务节点', PRIORITY_GROUP);
  config.headers['priority_group'] = PRIORITY_GROUP;

  if (config.url != '../serverConfig.yml') {
    // 设置请求默认前缀
    _axios.default.defaults.baseURL = config.url;
  } // NProgress.start() // start progress bar


  var _store$getters = _store.default.getters,
      requestCount = _store$getters.requestCount,
      prevRequsetEndTime = _store$getters.prevRequsetEndTime,
      requestEndTimer = _store$getters.requestEndTimer;
  var nowTime = +new Date();

  if (nowTime - prevRequsetEndTime < requestContinue) {
    clearTimeout(requestEndTimer);
  } else if (requestCount === 0) {
    _store.default.commit('SET_LOADING', true);
  }

  _store.default.commit('ADD_REQUEST_COUNT');

  if (_store.default.getters.accessToken) {
    if (!config.headers.Authorization) {
      // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      config.headers.Authorization = "Bearer ".concat(_store.default.getters.accessToken);
    }
  }

  return config;
}, function (error) {
  _store.default.commit("SUBTRACT_REQUEST_COUNT");

  var requestCount = _store.default.getters.requestCount;

  if (requestCount === 0) {
    var timer = setTimeout(function () {
      _store.default.commit('SET_LOADING', false);
    }, requestContinue);

    _store.default.commit('SET_REQUEST_END_TIMER', timer);
  }

  return Promise.reject(error);
}); // HTTPresponse拦截


_axios.default.interceptors.response.use(function (data) {
  var resultData = data;
  var _data$data = data.data,
      msg = _data$data.msg,
      code = _data$data.code;
  var status = data.status,
      config = data.config;
  var message = data.data.msg || '未知错误'; // NProgress.done()

  _store.default.commit("SUBTRACT_REQUEST_COUNT");

  _store.default.commit('SET_PREV_REQUEST_END_TIME', +new Date());

  var requestCount = _store.default.getters.requestCount;

  if (requestCount === 0) {
    var timer = setTimeout(function () {
      _store.default.commit('SET_LOADING', false);
    }, requestContinue);

    _store.default.commit('SET_REQUEST_END_TIMER', timer);
  }

  if (status === 401) {
    _store.default.dispatch("setRelogin", true);

    (0, _common.toLogin)();
  } else {
    if (status === 200) {
      if (Number(code) > 0) {
        // fxd 修改 解决导入时的消息提示问题
        if (!msg || msg && msg.indexOf('文件导入失败') == '-1') {// Notification.error({
          //     title: '错误',
          //     message: status + ':' + message
          // })
        }
      }

      return resultData;
    } else {
      // Notification.error({
      //     title: '错误',
      //     message: status + ':' + message
      // })
      return resultData;
    }
  }
}, function (error) {
  _store.default.commit("SUBTRACT_REQUEST_COUNT");

  var requestCount = _store.default.getters.requestCount;

  if (requestCount === 0) {
    var timer = setTimeout(function () {
      _store.default.commit('SET_LOADING', false);
    }, requestContinue);

    _store.default.commit('SET_REQUEST_END_TIMER', timer);
  }

  if (error && error.response) {
    var status = error.response.status;

    if (status) {// Notification.error({
      //     title: '错误',
      //     message: status + ':' + errorCode.default
      // })
    }
  }

  return Promise.reject(new Error(error));
});

var _default = _axios.default;
exports.default = _default;