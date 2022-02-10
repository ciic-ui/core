"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _vue = _interopRequireDefault(require("vue"));

var _axios = _interopRequireDefault(require("axios"));

var _router = _interopRequireDefault(require("../router"));

var _store = _interopRequireDefault(require("../store"));

var _errorCode = _interopRequireDefault(require("../code/errorCode"));

var _mock = _interopRequireDefault(require("../api/mock"));

var _i18n = _interopRequireDefault(require("../i18n"));

var _common = _interopRequireDefault(require("../const/common.js"));

var _store2 = require("../utils/store");

/**
 *
 * http配置
 *
 */
// 超时时间
_axios.default.defaults.timeout = 30000; // 跨域请求，允许保存cookie

_axios.default.defaults.withCredentials = true; // 重新请求标志位，避免无限循环请求

_axios.default.defaults.isRetryRequest = false;

_axios.default.defaults.validateStatus = function validateStatus(status) {
  return /^(2|3)\d{2}$/.test(status) || status === 401;
}; // 刷新token的状态 0-未刷新 1-正在刷新 2-刷新失败


var refreshingTokenStatus = 0;
/**
 * 错误处理，自动跳转登录页并提示
 */

function toLogin() {
  // 清除缓存
  _store.default.commit("SET_USER_INFO", {});

  _store.default.commit("SET_ACCESS_TOKEN", "");

  _store.default.commit("SET_REFRESH_TOKEN", "");

  _store.default.commit("SET_ROLES", []);

  _store.default.commit("SET_MENU_ROUTERS", []);

  _store.default.commit("SET_MENU", []);

  _store.default.commit("DEL_ALL_TAG");

  localStorage.removeItem('insightDicts');

  _router.default.push({
    path: '/login'
  });
} // HTTPrequest拦截


_axios.default.interceptors.request.use(function (config) {
  var GROUP_NAME = (0, _store2.getStore)({
    name: "GROUP_NAME"
  });
  config.headers['Accept-Language'] = _i18n.default.locale; //后端请求优先级配置项

  config.headers['Priority-Value'] = GROUP_NAME ? GROUP_NAME : 'default'; //  if(config.url != '../serverConfig.yml'){
  // 设置请求默认前缀

  var baseApi = _common.default.serverConfig ? _common.default.serverConfig.baseApi : '';
  config.baseURL = baseApi; //  }
  // NProgress.start() // start progress bar

  if (_store.default.getters.accessToken) {
    if (!config.headers.Authorization) {
      // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      config.headers.Authorization = "Bearer ".concat(_store.default.getters.accessToken);
    }
  }

  if (_mock.default.enabled && process.env.NODE_ENV === 'development') {
    var proxy = _mock.default.proxy;

    for (var i = 0; i < proxy.length; i++) {
      // 匹配到需要mock的接口，替换服务端地址为mock服务器地址
      if (proxy[i].url === config.url && proxy[i].method === config.method) {
        config.baseURL = _mock.default.apiPPrefix + _mock.default.repositoryId;
        break;
      }
    }
  }

  return config;
}, function (error) {
  return Promise.reject(error);
}); // HTTPresponse拦截


_axios.default.interceptors.response.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(data) {
    var resultData, _data$data, msg, code, status, config, message;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            resultData = data;
            _data$data = data.data, msg = _data$data.msg, code = _data$data.code;
            status = data.status, config = data.config;
            message = data.data.msg || '未知错误';

            if (!(status === 401)) {
              _context.next = 9;
              break;
            }

            _store.default.dispatch("setRelogin", true);

            toLogin();
            _context.next = 16;
            break;

          case 9:
            if (!(status === 200)) {
              _context.next = 14;
              break;
            }

            if (Number(code) > 0) {
              // fxd 修改 解决导入时的消息提示问题
              if (!(msg && msg.indexOf('文件导入失败') != '-1')) {
                if (Number(code) == 204) {//流程定义key不存在时不出提示
                } else {
                  _vue.default.prototype.$message.error({
                    dangerouslyUseHTMLString: true,
                    message: msg || _errorCode.default.default,
                    duration: 3500
                  });
                }
              }
            }

            return _context.abrupt("return", resultData);

          case 14:
            _vue.default.prototype.$message.error({
              message: message
            });

            return _context.abrupt("return", resultData);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), function (error) {
  if (error && error.response) {
    var status = error.response.status;

    if (status) {
      _vue.default.prototype.$message.error({
        message: _errorCode.default[status] || _errorCode.default.default,
        duration: 3500
      });
    }
  }

  return Promise.reject(new Error(error));
});

var _default = _axios.default;
exports.default = _default;