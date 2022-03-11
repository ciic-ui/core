import Vue from 'vue';
import axios from 'axios';
import {
  store
} from '../store';
// import NProgress from "nprogress";
import { Notification, Loading } from 'element-ui';
/**
 * 根据API配置生成URL
 * @param api API配置
 * @returns 返回拼接好的完整URL
 */
const getUrlByApi = api => {
  let url = '';
  if (typeof api === 'string') {
    url = '/api' + api
  }
  return url;
}

//请求的数据是放在body里的
const methodBodyList = ['post', 'put', 'patch']


const http = (api, data, httpOptions) => {
  const isMobile = window.innerWidth < 576 ? true : false
  let url = getUrlByApi(api);
  let method = 'get';
  if (typeof api == 'object' && api['method']) {
    method = api['method'] || 'get';
  }

  if (httpOptions === true) {
    httpOptions = {
      wrapBody: 'request'
    }
  }

  if (!httpOptions) httpOptions = {};

  let axiosConfig = httpOptions.AxiosRequestConfig;
  if (!axiosConfig) {
    httpOptions.AxiosRequestConfig = {};
    axiosConfig = httpOptions.AxiosRequestConfig
  }

  let isDataBody = methodBodyList.includes(method.toLowerCase());
  const user = store.state.user;
  let timestamp = Date.now();

  let ciicHeaders = {
    'Content-Type': 'application/json;charset=utf-8',
    timestamp,
  };


  if (user) {
    ciicHeaders['Authorization'] = user.accessToken || "";
  }


  axiosConfig.headers = {
    ...ciicHeaders,
    ...axiosConfig.headers
  }

  if (store.state.httpCount <= 0) {
    if (!httpOptions.loadingDisabled) {
      if (Vue['$Loading']) {
        Vue['$Loading'].start();
        // if (isMobile) {
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

  store.commit('SET_HTTPCOUNT', store.state.httpCount + 1);
  store.commit('SET_LOADING', true);

  if (isDataBody && httpOptions.wrapBody) {
    if (typeof httpOptions.wrapBody === 'string') {
      data = {
        [httpOptions.wrapBody]: data
      }
    } else {
      data = {
        request: data
      }
    }
  }

  return new Promise((resolve, reject) => {
    axios({
      ...httpOptions.AxiosRequestConfig,
      url,
      method,
      params: isDataBody ? null : data,
      data: isDataBody ? data : null,
      timeout: (store.state.siteConfig.Timeout * 1000) || 999999
    }).then(res => {
      if (httpOptions.isNotCIIC) { //如果是外部接口的话直接返回
        resolve(res.data);
      } else {
        if (res.data.Data !== undefined && res.data.IsSuccess === true) {
          resolve(res.data.Data)
        } else {
          exceptionHandler(res.data.ErrorList, httpOptions.handleError, httpOptions.async, resolve, reject, isMobile);
        }
      }
    }).catch(err => {
      exceptionHandler(err, httpOptions.handleError, httpOptions.async, resolve, reject, isMobile);
    }).finally(() => {
      let count = store.state.httpCount - 1;
      store.commit('SET_HTTPCOUNT', count);
      if (count <= 0) {
        store.commit('SET_LOADING', false);
        if (!httpOptions.loadingDisabled) {
          if (Vue['$Loading']) {
            Vue['$Loading'].done()
          }
        }
      }
    })
  })
}


const exceptionTitle = '请求错误';

/**
 * 
 * @param error 错误示例
 * @param handError 是否处理错误
 * @param asyncFlag 是否支持同步
 * @param resolve 正确处理函数
 * @param reject 错误处理函数
 */
const exceptionHandler = (error, handError, asyncFlag, resolve, reject, isMobile) => {
  if (handError !== false) { //如果需要错误处理
    if (typeof error === 'string') {
      if (Vue['$Notification']) {
        Vue['$Notification'].error({
          title: exceptionTitle,
          message: error,
        })
      }
      // if (isMobile) {
      //     Notify({ type: 'danger', Notification: error });
      // } else {
      //     notification.error({
      //         Notification: exceptionTitle,
      //         message: error,
      //     })
      // }
    } else if (typeof error === 'object') {
      if (Array.isArray(error)) {
        if (error.length > 0) {
          if (error[0].Code === '400' && error[0].Msg.includes('-token')) {
            window.localStorage.clear()
            window.sessionStorage.clear()
            window.location.href = window.location.href
          } else {
            if (Vue['$Notification']) {
              Vue['$Notification'].error({
                title: error[0].Code || exceptionTitle,
                message: error[0].Msg || error[0].Code || '其他错误',
              })
            }
          }

          // if (isMobile) {
          //     Notify({ type: 'danger', Notification: error[0].Msg || error[0].Code || '其他错误' });
          // } else {
          //     notification.error({
          //         Notification: error[0].Code || exceptionTitle,
          //         message: error[0].Msg || error[0].Code || '其他错误',
          //     })
          // }
        } else {

          if (Vue['$Notification']) {
            Vue['$Notification'].error({
              title: exceptionTitle,
              message: '未知错误',
            })
          }
          // if (isMobile) {
          //     Notify({ type: 'danger', Notification: '未知错误' });
          // } else {
          //     notification.error({
          //         Notification: exceptionTitle,
          //         message: '未知错误',
          //     })
          // }
        }
      } else {

        if (Vue['$Notification']) {
          Vue['$Notification'].error({
            title: error.Code || exceptionTitle,
            message: error.Notification || JSON.stringify(error) || "网络请求失败",
          })
        }

        // if (isMobile) {
        //     Notify({ type: 'danger', Notification: error.Notification || JSON.stringify(error) || "网络请求失败" });
        // } else {
        //     notification.error({
        //         Notification: error.Code || exceptionTitle,
        //         message: error.Notification || JSON.stringify(error) || "网络请求失败",
        //     })
        // }
      }
    } else {
      if (Vue['$Notification']) {
        Vue['$Notification'].error({
          title: error.Code || exceptionTitle,
          message: error.Notification || JSON.stringify(error) || "网络请求失败",
        })
      }

      // if (isMobile) {
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
  } else { //如果需要同步处理
    reject(error);
  }
}

const getMethod = (api, data, httpOptions) => {
  let url = ''
  if (typeof api === 'string') {
    url = api
  } else {
    url = {
      ...api,
      method: 'get'
    }
  }
  return http(url, data, httpOptions)
}

const postMethod = (api, data, httpOptions) => {
  let url = ''
  if (typeof api === 'string') {
    url = {
      api,
      method: 'post'
    }
  } else {
    url = {
      ...api,
      method: 'post'
    }
  }
  return http(url, data, httpOptions)
}

const putMethod = (api, data, httpOptions) => {
  let url = ''
  if (typeof api === 'string') {
    url = {
      api,
      method: 'put'
    }
  } else {
    url = {
      ...api,
      method: 'put'
    }
  }
  return http(url, data, httpOptions)
}

const patchMethod = (api, data, httpOptions) => {
  let url = ''
  if (typeof api === 'string') {
    url = {
      api,
      method: 'patch'
    }
  } else {
    url = {
      ...api,
      method: 'patch'
    }
  }
  return http(url, data, httpOptions)
}

const deleteMethod = (api, data, httpOptions) => {
  let url = ''
  if (typeof api === 'string') {
    url = {
      api,
      method: 'delete'
    }
  } else {
    url = {
      ...api,
      method: 'delete'
    }
  }
  return http(url, data, httpOptions)
}

const headMethod = (api, data, httpOptions) => {
  let url = ''
  if (typeof api === 'string') {
    url = {
      api,
      method: 'head'
    }
  } else {
    url = {
      ...api,
      method: 'head'
    }
  }
  return http(url, data, httpOptions)
}



const install = function (Vue) {
  Vue['http'] = http;
  Vue.prototype['$http'] = http;
  const aloneHttpMap = {
    'get': getMethod,
    'post': postMethod,
    'put': putMethod,
    'patch': patchMethod,
    'delete': deleteMethod,
    'head': headMethod,
  }
  Vue['axios'] = aloneHttpMap;

  Vue.prototype['$axios'] = aloneHttpMap
}

const register = function ({
  Loading,
  Notification
}) {
  Vue['$Loading'] = Loading;
  Vue['$Notification'] = Notification;
}


export {
  install,
  getUrlByApi,
  http,
  register
}