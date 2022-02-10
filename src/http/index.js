/**
 *
 * http配置
 *
 */
 import Vue from 'vue';
 import axios from 'axios';
 import router from '../router';
 import store from '../store';
 import errorCode from '../code/errorCode';
 import mock from '../api/mock';
 import i18n from '../i18n'
 import comConst from '../const/common.js'
 import {getStore} from "../utils/store";

 // 超时时间
 axios.defaults.timeout = 30000;
 // 跨域请求，允许保存cookie
 axios.defaults.withCredentials = true;
 // 重新请求标志位，避免无限循环请求
 axios.defaults.isRetryRequest = false;

 axios.defaults.validateStatus = function validateStatus(status) {
   return /^(2|3)\d{2}$/.test(status) || status === 401;
 };

 // 刷新token的状态 0-未刷新 1-正在刷新 2-刷新失败
 let refreshingTokenStatus = 0;



 /**
  * 错误处理，自动跳转登录页并提示
  */
 function toLogin(){
   // 清除缓存
   store.commit("SET_USER_INFO", {});
   store.commit("SET_ACCESS_TOKEN", "");
   store.commit("SET_REFRESH_TOKEN", "");
   store.commit("SET_ROLES", []);
   store.commit("SET_MENU_ROUTERS", []);
   store.commit("SET_MENU", []);
   store.commit("DEL_ALL_TAG");
   localStorage.removeItem('insightDicts');
   router.push({ path: '/login' });
 }


 // HTTPrequest拦截
 axios.interceptors.request.use((config) => {
   let GROUP_NAME = getStore({
     name: "GROUP_NAME"
   })
   config.headers['Accept-Language'] = i18n.locale
   //后端请求优先级配置项
   config.headers['Priority-Value'] = GROUP_NAME?GROUP_NAME:'default'
  //  if(config.url != '../serverConfig.yml'){
     // 设置请求默认前缀
     let baseApi = comConst.serverConfig ? comConst.serverConfig.baseApi : ''
     config.baseURL = baseApi;
  //  }
   // NProgress.start() // start progress bar
   if (store.getters.accessToken) {
     if (!config.headers.Authorization) {
       // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
       config.headers.Authorization = `Bearer ${store.getters.accessToken}`;
     }
   }
   if (mock.enabled && process.env.NODE_ENV === 'development'){
     const proxy = mock.proxy;
     for (let i = 0; i < proxy.length; i++) {
       // 匹配到需要mock的接口，替换服务端地址为mock服务器地址
       if(proxy[i].url === config.url && proxy[i].method === config.method) {
         config.baseURL  = mock.apiPPrefix + mock.repositoryId;
         break;
       }
     }
   }
   return config;
 }, error => Promise.reject(error));

 // HTTPresponse拦截
 axios.interceptors.response.use(async (data) => {
   let resultData = data;
   const { msg, code } = data.data;
   const { status, config } = data;
   const message = data.data.msg || '未知错误';
   if (status === 401){
       store.dispatch("setRelogin", true);
       toLogin()
   }else{
     if(status === 200) {
       if(Number(code) > 0) {
         // fxd 修改 解决导入时的消息提示问题
         if(!(msg && (msg.indexOf('文件导入失败') != '-1'))){
           if(Number(code)==204){//流程定义key不存在时不出提示

           }else{
            Vue.prototype.$message.error({
              dangerouslyUseHTMLString: true,
              message: msg || errorCode.default,
              duration: 3500,
            });
           }

         }
       }
       return resultData;
     }else {
       Vue.prototype.$message.error({
         message: message,
       })
       return resultData
     }
   }
 }, (error) => {
   if (error && error.response) {
     const { status } = error.response;
     if (status) {
       Vue.prototype.$message.error({
         message: errorCode[status] || errorCode.default,
         duration: 3500,
       });
     }
   }
   return Promise.reject(new Error(error));
 });
 export default axios;
