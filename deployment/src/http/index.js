"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.install = exports.http = exports.getUrlByApi = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _vue = _interopRequireDefault(require("vue"));

var _axios = _interopRequireDefault(require("axios"));

var _store = require("../store");

var _core = require("../core");

var _elementUi = require("element-ui");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * 根据API配置生成URL
 * @param api API配置
 * @returns 返回拼接好的完整URL
 */
var getUrlByApi = function getUrlByApi(api) {
  var url = '';

  if (typeof api === 'string') {
    url = api;
  } else if ((0, _typeof2.default)(api) === 'object') {
    url = api['api'];
  }

  return url;
}; //请求的数据是放在body里的


exports.getUrlByApi = getUrlByApi;
var methodBodyList = ['post', 'put', 'patch'];

var http = function http(api, data, httpOptions) {
  var isMobile = window.innerWidth < 576 ? true : false;
  var url = getUrlByApi(api);
  var method = 'get';

  if ((0, _typeof2.default)(api) == 'object' && api['method']) {
    method = api['method'] || 'get';
  }

  if (httpOptions === true) {
    httpOptions = {
      wrapBody: 'request'
    };
  }

  if (!httpOptions) httpOptions = {};
  var axiosConfig = httpOptions.AxiosRequestConfig;

  if (!axiosConfig) {
    httpOptions.AxiosRequestConfig = {};
    axiosConfig = httpOptions.AxiosRequestConfig;
  }

  var isDataBody = methodBodyList.includes(method.toLowerCase());
  var user = _store.store.state.user;

  var accessToken = _core.storage.session.getItem("accessToken");

  console.log(accessToken, '---user.accessToken----');
  var timestamp = Date.now();
  var ciicHeaders = {
    'Content-Type': 'application/json;charset=utf-8',
    'Authorization': "Bearer ".concat(accessToken),
    timestamp: timestamp
  };
  axiosConfig.headers = _objectSpread(_objectSpread({}, ciicHeaders), axiosConfig.headers);

  if (_store.store.state.httpCount <= 0) {
    if (!httpOptions.loadingDisabled) {
      if (_vue.default['$Loading']) {
        _vue.default['$Loading'].start(); // if (isMobile) {
        //     Toast.loading({
        //         Notification: '加载中...',
        //         forbidClick: true,
        //         duration: 0
        //     });
        // } else {
        //     NProgress.start();
        // }

      }
    }
  }

  _store.store.commit('SET_HTTPCOUNT', _store.store.state.httpCount + 1);

  _store.store.commit('SET_LOADING', true);

  if (isDataBody && httpOptions.wrapBody) {
    if (typeof httpOptions.wrapBody === 'string') {
      data = (0, _defineProperty2.default)({}, httpOptions.wrapBody, data);
    } else {
      data = {
        request: data
      };
    }
  }

  return new Promise(function (resolve, reject) {
    (0, _axios.default)(_objectSpread(_objectSpread({}, httpOptions.AxiosRequestConfig), {}, {
      url: url,
      method: method,
      params: isDataBody ? null : data,
      data: isDataBody ? data : null,
      timeout: _store.store.state.siteConfig.Timeout * 1000 || 999999
    })).then(function (res) {
      if (httpOptions.isNotCIIC) {
        //如果是外部接口的话直接返回
        resolve(res.data);
      } else {
        resolve(res); // if (res.data.Data !== undefined && res.data.IsSuccess === true) {
        // resolve(res.data.Data)
        // } else {
        //   exceptionHandler(res.data.ErrorList, httpOptions.handleError, httpOptions.async, resolve, reject, isMobile);
        // }
      }
    }).catch(function (err) {
      exceptionHandler(err, httpOptions.handleError, httpOptions.async, resolve, reject, isMobile);
    }).finally(function () {
      var count = _store.store.state.httpCount - 1;

      _store.store.commit('SET_HTTPCOUNT', count);

      if (count <= 0) {
        _store.store.commit('SET_LOADING', false);

        if (!httpOptions.loadingDisabled) {
          if (_vue.default['$Loading']) {
            _vue.default['$Loading'].done();
          }
        }
      }
    });
  });
};

exports.http = http;
var exceptionTitle = '请求错误';
/**
 * 
 * @param error 错误示例
 * @param handError 是否处理错误
 * @param asyncFlag 是否支持同步
 * @param resolve 正确处理函数
 * @param reject 错误处理函数
 */

var exceptionHandler = function exceptionHandler(error, handError, asyncFlag, resolve, reject, isMobile) {
  if (handError !== false) {
    //如果需要错误处理
    if (typeof error === 'string') {
      if (_vue.default['$Notification']) {
        _vue.default['$Notification'].error({
          title: exceptionTitle,
          message: error
        });
      } // if (isMobile) {
      //     Notify({ type: 'danger', Notification: error });
      // } else {
      //     notification.error({
      //         Notification: exceptionTitle,
      //         message: error,
      //     })
      // }

    } else if ((0, _typeof2.default)(error) === 'object') {
      if (Array.isArray(error)) {
        if (error.length > 0) {
          if (error[0].Code === '400' && error[0].Msg.includes('-token')) {
            window.localStorage.clear();
            window.sessionStorage.clear();
            window.location.href = window.location.href;
          } else {
            if (_vue.default['$Notification']) {
              _vue.default['$Notification'].error({
                title: error[0].Code || exceptionTitle,
                message: error[0].Msg || error[0].Code || '其他错误'
              });
            }
          } // if (isMobile) {
          //     Notify({ type: 'danger', Notification: error[0].Msg || error[0].Code || '其他错误' });
          // } else {
          //     notification.error({
          //         Notification: error[0].Code || exceptionTitle,
          //         message: error[0].Msg || error[0].Code || '其他错误',
          //     })
          // }

        } else {
          if (_vue.default['$Notification']) {
            _vue.default['$Notification'].error({
              title: exceptionTitle,
              message: '未知错误'
            });
          } // if (isMobile) {
          //     Notify({ type: 'danger', Notification: '未知错误' });
          // } else {
          //     notification.error({
          //         Notification: exceptionTitle,
          //         message: '未知错误',
          //     })
          // }

        }
      } else {
        if (_vue.default['$Notification']) {
          _vue.default['$Notification'].error({
            title: error.Code || exceptionTitle,
            message: error.Notification || JSON.stringify(error) || "网络请求失败"
          });
        } // if (isMobile) {
        //     Notify({ type: 'danger', Notification: error.Notification || JSON.stringify(error) || "网络请求失败" });
        // } else {
        //     notification.error({
        //         Notification: error.Code || exceptionTitle,
        //         message: error.Notification || JSON.stringify(error) || "网络请求失败",
        //     })
        // }

      }
    } else {
      if (_vue.default['$Notification']) {
        _vue.default['$Notification'].error({
          title: error.Code || exceptionTitle,
          message: error.Notification || JSON.stringify(error) || "网络请求失败"
        });
      } // if (isMobile) {
      //     Notify({ type: 'danger', Notification: error.Notification || JSON.stringify(error) || "网络请求失败" });
      // } else {
      //     notification.error({
      //         Notification: error.Code || exceptionTitle,
      //         message: error.Notification || JSON.stringify(error) || "网络请求失败",
      //     })
      // }

    }
  }

  if (asyncFlag) {
    resolve(error);
  } else {
    //如果需要同步处理
    reject(error);
  }
};

var getMethod = function getMethod(api, data, httpOptions) {
  var url = '';

  if (typeof api === 'string') {
    url = api;
  } else {
    url = _objectSpread(_objectSpread({}, api), {}, {
      method: 'get'
    });
  }

  return http(url, data, httpOptions);
};

var postMethod = function postMethod(api, data, httpOptions) {
  var url = '';

  if (typeof api === 'string') {
    url = {
      api: api,
      method: 'post'
    };
  } else {
    url = _objectSpread(_objectSpread({}, api), {}, {
      method: 'post'
    });
  }

  return http(url, data, httpOptions);
};

var putMethod = function putMethod(api, data, httpOptions) {
  var url = '';

  if (typeof api === 'string') {
    url = {
      api: api,
      method: 'put'
    };
  } else {
    url = _objectSpread(_objectSpread({}, api), {}, {
      method: 'put'
    });
  }

  return http(url, data, httpOptions);
};

var patchMethod = function patchMethod(api, data, httpOptions) {
  var url = '';

  if (typeof api === 'string') {
    url = {
      api: api,
      method: 'patch'
    };
  } else {
    url = _objectSpread(_objectSpread({}, api), {}, {
      method: 'patch'
    });
  }

  return http(url, data, httpOptions);
};

var deleteMethod = function deleteMethod(api, data, httpOptions) {
  var url = '';

  if (typeof api === 'string') {
    url = {
      api: api,
      method: 'delete'
    };
  } else {
    url = _objectSpread(_objectSpread({}, api), {}, {
      method: 'delete'
    });
  }

  return http(url, data, httpOptions);
};

var headMethod = function headMethod(api, data, httpOptions) {
  var url = '';

  if (typeof api === 'string') {
    url = {
      api: api,
      method: 'head'
    };
  } else {
    url = _objectSpread(_objectSpread({}, api), {}, {
      method: 'head'
    });
  }

  return http(url, data, httpOptions);
};

var install = function install(Vue) {
  Vue['http'] = http;
  Vue.prototype['$http'] = http;
  var aloneHttpMap = {
    'get': getMethod,
    'post': postMethod,
    'put': putMethod,
    'patch': patchMethod,
    'delete': deleteMethod,
    'head': headMethod
  };
  Vue['axios'] = aloneHttpMap;
  Vue.prototype['$axios'] = aloneHttpMap;
};

exports.install = install;

var register = function register(_ref) {
  var Loading = _ref.Loading,
      Notification = _ref.Notification;
  _vue.default['$Loading'] = Loading;
  _vue.default['$Notification'] = Notification;
};

exports.register = register;