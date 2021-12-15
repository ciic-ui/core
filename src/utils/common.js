import {
    RegExpUtil
} from '../utils';

import {store} from '../store';
// import {router} from './router';
import md5 from 'md5';

/**
 * 生成签名
 * @param appcode appcode
 * @param timestap 事件戳
 * @param data body
 * @param params params
 */
export const signature = (appcode, timestap, data, params) => {
    return md5(appcode + '__' + timestap + '__' + JSON.stringify(data) + '__' + JSON.stringify(params))
}

/**
 * 错误处理，自动跳转登录页并提示
 */

export function toLogin() {
    // 清除缓存
    store.commit("SET_USER_INFO", {});
    store.commit("SET_ACCESS_TOKEN", "");
    store.commit("SET_REFRESH_TOKEN", "");
    store.commit("SET_ROLES", []);
    store.commit("SET_MENU_ROUTERS", []);
    store.commit("SET_MENU", []);
    store.commit("SET_ORGTREE", []);
    store.commit("SET_ISSHOWEMPLOYEE", false);
    store.commit("DEL_ALL_TAG");
    localStorage.removeItem('insightDicts');
    // router.push({ path: '/login' });
}
/**
 * 加载script的js
 * @param {*} url 加载js的地址
 * @param {*} callback 回调函数
 * @returns 返回Promise对象
 */
export const loadScript = (url, callback) => {
    return new Promise(resolve => {
        let script = window.document.createElement('script')
        script.type = 'text/javascript'
        script.src = url;
        window.document.getElementsByTagName('head')[0].appendChild(script);
        if (script.readyState) {
            // ie游览器
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    resolve(true)
                    if (callback && typeof callback === 'function') {
                        callback()
                    }
                }
            }
        } else {
            // 其他
            script.onload = function () {
                resolve(true)
                if (callback && typeof callback === 'function') {
                    callback()
                }
            }
        }
    })
}

/**
 * 从insight里获取字典和组织等需要缓存的数据
 * @param string
 * @param callback
 */
export function cachInsightDicts(string, callback) {
    let codeList = getCodeFun(code)
    let initArr = string.split(',')
    if (codeList.length != initArr.length) {
        codeList.map(val => {
            initArr.map((item, index) => {
                if (val == item) {
                    initArr.splice(index, 1)
                }
            })
        })
    }
    if (initArr.length > 0) {
        getOperateCache(initArr.join(',')).then(res => {
            let obj = getStore({ name: 'insightDicts' }) ? JSON.parse(getStore({ name: 'insightDicts' })) : {}
            let cacheList = res.data.data
            let newObj = Object.assign(obj, cacheList)
            console.log(newObj)
            setStore({
                name: 'insightDicts',
                content: JSON.stringify(newObj),
            })
            callback()
        })
    } else {
        callback()
    }
}

/**
 * 获取项目的code字典
*/
export function getCodeFun(code) {
    if (!$.isEmptyObject(code)) {
        let _arr = []
        Object.keys(code).map(val => {
            _arr.push(code[val])
        })
        return _arr
    }
}

/**
 * 将对象转为参数拼接到URL上
 * @param url 要拼接的URL
 * @param obj 要转换的对象
 * @param encode 是否需要进行编码
 * @returns 返回拼接后的URL
 */
export const obj2ParamUrl = (url, obj, encode) => {
    let itemList = [];
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            itemList.push(`${key}=${JSON.stringify(obj[key])}`)
        } else {
            itemList.push(`${key}=${obj[key]}`)
        }
    }
    let quest = ''
    if (!url.includes('?')) {
        quest = '?'
    }
    url = `${url}${quest}${itemList.join('&')}`;
    if (encode) {
        return window.encodeURI(url);
    }
    return url;
}

/**
 * 将URL上的参数转为对象，如果没有参数返回{};
 * @param url url地址
 * @param decode 是否需要进行解码
 */
export const paramUrl2Obj = (url, decode) => {
    if (decode) {
        url = decodeURI(url);
    }
    let obj = {};
    let searchParams = new window.URLSearchParams(url.substring(url.indexOf('?') + 1));
    // 显示键/值对
    for (var pair of searchParams.entries()) {
        obj[pair[0]] = pair[1];
    }
    return obj;
}


/**
 * 订阅者-观察者  设计模式
 */
export const pubSub = {
    typeMap: {}, //{type:[] }
    /**
     * 订阅者
     * @param type 订阅事件
     * @param data 发射数据
     */
    next(type, data) {
        if (Array.isArray(this.typeMap[type])) {
            this.typeMap[type].forEach((item) => {
                item(data);
            })
        }
    },
    /**
     * 观察者
     * @param type 观察事件
     * @param fn 回调函数
     */
    subscribe(type, fn) {
        if (this.typeMap[type]) {
            this.typeMap[type].push(fn);
        } else {
            this.typeMap[type] = [fn];
        }
    }
}

/**
 * 防抖工具函数
 * @param func 需要防抖的函数
 * @param wait 延迟执行的事件
 * @param immediate 第一次是否立即执行
 */
export const debounce = (func, wait, immediate) => {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait);
        }
    }
}

/**
 * 根据身份证号获取出生年月日
 * @param idCard 身份证号
 * @param format 生日格式化字符串，默认YYYY-MM-DD
 * @returns 返回出生年月日
 */
export const getBirthDayFromIdCard = (idCard, format) => {
    if (idCard && typeof idCard === 'string' && idCard.length === 18) {
        if (RegExpUtil.idcard.pattern.test(idCard)) {
            let regExp = /^YYYY*.MM*.DD*.$/
            if (!regExp.test(format)) format = 'YYYY-MM-DD';
            return format.replace('YYYY', idCard.substr(6, 4)).replace('MM', idCard.substr(10, 2)).replace('DD', idCard.substr(12, 2));
        } else {
            return "";
        }
    } else {
        return "";
    }
}

/**
 * 根据身份证获取性别 1 = 男  ； 2=女； 
 * @param {*} idCard 
 */
export const getSexFromIdCard = (idCard) => {
    if (idCard && typeof idCard === 'string' && idCard.length === 18 && idCard.substr(16, 1) % 2) {
        return 1
    } else {
        return 2
    }
}


/**
 * 是否是内网
 * @param {*} ip host地址
 */
export const isInnerHost = () => {
    function getIpNum(ipAddress) {
        /*获取IP数*/
        var ip = ipAddress.split(".");
        var a = parseInt(ip[0]);
        var b = parseInt(ip[1]);
        var c = parseInt(ip[2]);
        var d = parseInt(ip[3]);
        var ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
        return ipNum;
    }

    function isInner(userIp, begin, end) {
        return (userIp >= begin) && (userIp <= end);
    }

    // 获取当前页面url
    var curPageUrl = window.location.href;

    var reg1 = /(http|ftp|https|www):\/\//g; //去掉前缀
    curPageUrl = curPageUrl.replace(reg1, '');

    var reg2 = /\:+/g; //替换冒号为一点
    curPageUrl = curPageUrl.replace(reg2, '.');

    curPageUrl = curPageUrl.split('.'); //通过一点来划分数组
    var ipAddress = curPageUrl[0] + '.' + curPageUrl[1] + '.' + curPageUrl[2] + '.' + curPageUrl[3];
    var isInnerIp = false; //默认给定IP不是内网IP      
    var ipNum = getIpNum(ipAddress);
    /** 
     * 私有IP：A类  10.0.0.0    -10.255.255.255 
     *       B类  172.16.0.0  -172.31.255.255    
     *       C类  192.168.0.0 -192.168.255.255   
     *       D类   127.0.0.0   -127.255.255.255(环回地址)  
     **/
    var aBegin = getIpNum("10.0.0.0");
    var aEnd = getIpNum("10.255.255.255");
    var bBegin = getIpNum("172.16.0.0");
    var bEnd = getIpNum("172.31.255.255");
    var cBegin = getIpNum("192.168.0.0");
    var cEnd = getIpNum("192.168.255.255");
    var dBegin = getIpNum("127.0.0.0");
    var dEnd = getIpNum("127.255.255.255");
    isInnerIp = isInner(ipNum, aBegin, aEnd) || isInner(ipNum, bBegin, bEnd) || isInner(ipNum, cBegin, cEnd) || isInner(ipNum, dBegin, dEnd);
    return isInnerIp || window.location.href.startsWith('http://localhost:')
}