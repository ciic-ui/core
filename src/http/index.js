
import Vue from 'vue';
import axios from 'axios';
import store from '../store';
import i18n from '../i18n'
import { toLogin } from "../utils/common"
let PRIORITY_GROUP = process.env.PRIORITY_GROUP || 'default';
// import NProgress from 'nprogress'
// import { Notification } from 'element-ui';

const requestContinue = 100
// 超时时间
axios.defaults.timeout = 300000;
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// 重新请求标志位，避免无限循环请求
axios.defaults.isRetryRequest = false;
axios.defaults.validateStatus = function validateStatus(status) {
    return /^(2|3)\d{2}$/.test(status) || status === 401;
};
// HTTPrequest拦截
axios.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.locale
    // 添加优先路由的 header 标记 ，需要配合网关和服务注册元数据
    console.info('请求会优先路由至配有spring.cloud.nacos.discovery.metadata.priority_group={} 的服务节点', PRIORITY_GROUP);
    config.headers['priority_group'] = PRIORITY_GROUP;
    if (config.url != '../serverConfig.yml') {
        // 设置请求默认前缀
        axios.defaults.baseURL = config.url
    }
    // NProgress.start() // start progress bar
    const { requestCount, prevRequsetEndTime, requestEndTimer } = store.getters
    const nowTime = +new Date()
    if (nowTime - prevRequsetEndTime < requestContinue) {
        clearTimeout(requestEndTimer)
    } else if (requestCount === 0) {
        store.commit('SET_LOADING', true)
    }
    store.commit('ADD_REQUEST_COUNT')


    if (store.getters.accessToken) {
        if (!config.headers.Authorization) {
            // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
            config.headers.Authorization = `Bearer ${store.getters.accessToken}`;
        }
    }
    return config;
}, (error) => {
    store.commit("SUBTRACT_REQUEST_COUNT");

    const { requestCount } = store.getters
    if (requestCount === 0) {
        const timer = setTimeout(() => {
            store.commit('SET_LOADING', false)
        }, requestContinue)
        store.commit('SET_REQUEST_END_TIMER', timer)
    }
    return Promise.reject(error)
});

// HTTPresponse拦截
axios.interceptors.response.use((data) => {
    let resultData = data;
    const { msg, code } = data.data;
    const { status, config } = data;
    const message = data.data.msg || '未知错误';
    // NProgress.done()
    store.commit("SUBTRACT_REQUEST_COUNT");
    store.commit('SET_PREV_REQUEST_END_TIME', +new Date())
    const { requestCount } = store.getters
    if (requestCount === 0) {
        const timer = setTimeout(() => {
            store.commit('SET_LOADING', false)
        }, requestContinue)
        store.commit('SET_REQUEST_END_TIMER', timer)
    }

    if (status === 401) {
        store.dispatch("setRelogin", true);
        toLogin()
    } else {
        if (status === 200) {
            if (Number(code) > 0) {
                // fxd 修改 解决导入时的消息提示问题
                if (!msg || msg && (msg.indexOf('文件导入失败') == '-1')) {
                    // Notification.error({
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
            return resultData
        }
    }
}, (error) => {
    store.commit("SUBTRACT_REQUEST_COUNT");
    const { requestCount } = store.getters
    if (requestCount === 0) {
        const timer = setTimeout(() => {
            store.commit('SET_LOADING', false)
        }, requestContinue)
        store.commit('SET_REQUEST_END_TIMER', timer)
    }
    if (error && error.response) {
        const { status } = error.response;
        if (status) {
            // Notification.error({
            //     title: '错误',
            //     message: status + ':' + errorCode.default
            // })
        }


    }
    return Promise.reject(new Error(error));
});
export default axios;
