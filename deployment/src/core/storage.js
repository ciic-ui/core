"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionStorage = exports.session = exports.localStorage = exports.local = void 0;
var local = {
  name: 'ls',
  expire: 0,
  suffix: 'CIIC-',
  setItem: function setItem(key, data) {
    if (key == undefined) {
      window.console.error("Local set param key is required");
      return;
    } //存储storage


    window.localStorage.setItem(this.suffix + key, JSON.stringify({
      value: data,
      //真实数据
      expire: this.expire > 0 ? Date.now() : null //过期时间

    }));
  },

  /**
   * 获取localstorage的key的值
   * @param key localstorage的key
   * @returns any
   */
  getItem: function getItem(key) {
    if (key) {
      var localData = JSON.parse(window.localStorage.getItem(this.suffix + key) || '{}');

      if (this.expire > 0) {
        //判断过期与否
        if (Date.now() - localData.expire > this.expire) {
          //已经过期
          return null;
        } else {
          return localData.value;
        }
      } else {
        return localData.value;
      }
    }
  },

  /**
   * 移除localstorage的键为key的项
   * @param key localstorage的key
   */
  removeItem: function removeItem(key) {
    key && window.localStorage.removeItem(this.suffix + key);
  },

  /**
   * 清空缓存
   * 注意： 调用此方法的时候通常会让用户确认
   */
  clear: function clear() {
    // for (let i = 0; i < window.localStorage.length; i++) {
    //     let key = window.localStorage.key(i);
    //     if (key.startsWith(this.suffix)) {
    //         this.removeItem(key);
    //     }
    // }
    window.localStorage.clear();
  },

  /**
   * 刷新过期时间
   * @param key localstorage的key
   */
  refreshItem: function refreshItem(key) {
    //重新刷新过期时间
    if (this.expire > 0) {
      var localData = JSON.parse(window.localStorage.getItem(this.suffix + key) || '{}');
      localData.expire = Date.now();
      window.localStorage.setItem(this.suffix + key, JSON.stringify(localData));
    }
  }
};
exports.local = local;
var session = {
  suffix: 'CIIC-',
  name: 'ss',
  expire: 0,

  /**
  * 存储sessionStorage
  * @param key sessionStorage的key
  * @param data 要存入的值
  */
  setItem: function setItem(key, data) {
    if (key == undefined) {
      window.console.error("Session set param key is required");
      return;
    } //存储storege


    window.sessionStorage.setItem(this.suffix + key, JSON.stringify({
      value: data,
      //真实数据
      expire: this.expire > 0 ? Date.now() : null //过期时间

    }));
  },

  /**
   * 根据key获取sessionStorage的值
   * @param key  key sessionStorage的key
   * @returns any
   */
  getItem: function getItem(key) {
    if (key) {
      var localData = JSON.parse(window.sessionStorage.getItem(this.suffix + key) || '{}');

      if (this.expire > 0) {
        //判断过期与否
        if (Date.now() - localData.expire > this.expire) {
          //已经过期
          return null;
        } else {
          return localData.value;
        }
      } else {
        return localData.value;
      }
    }
  },

  /**
   * 移除sessionStorage的键为key的项
   * @param key 键
   */
  removeItem: function removeItem(key) {
    key && window.sessionStorage.removeItem(this.suffix + key);
  },

  /**
   * 清空缓存
   * 注意： 调用此方法的时候通常会让用户确认
   */
  clear: function clear() {
    // for (let i = 0; i < window.sessionStorage.length; i++) {
    //     let key = window.sessionStorage.key(i);
    //     if (key.startsWith(this.suffix)) {
    //         this.removeItem(key);
    //     }
    // }
    window.sessionStorage.clear();
  },

  /**
   * 刷新过期时间
   * @param key 
   */
  refreshItem: function refreshItem(key) {
    //重新刷新过期时间
    if (this.expire > 0) {
      var localData = JSON.parse(window.sessionStorage.getItem(this.suffix + key) || '{}');
      localData.expire = Date.now();
      window.sessionStorage.setItem(this.suffix + key, JSON.stringify(localData));
    }
  }
};
exports.session = session;
var sessionStorage = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    session.expire = options.expire || 0;
    session.name = options.name || 'ss';
    session.suffix = options.suffix || 'CIIC-';
    Vue[options.name || 'ss'] = session;
    Vue.prototype["$".concat(options.name || 'ss')] = session;
  }
};
exports.sessionStorage = sessionStorage;
var localStorage = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    local.expire = options.expire || 0;
    local.name = options.name || 'ls';
    local.suffix = options.suffix || 'CIIC-';
    Vue[options.name || 'ls'] = local;
    Vue.prototype["$".concat(options.name || 'ls')] = local;
  }
};
exports.localStorage = localStorage;