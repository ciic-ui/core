import moment from 'moment'
import { i18n } from '../i18n';

/**
 * 翻译过滤器
 * @param key 要翻译的字段
 * @param moduleName 模块名字 string[] | string
 * @param data 要传参的数据
 */
export const translate = (key, moduleName, data) => {
    let name = Array.isArray(moduleName) ? moduleName.join('.') : moduleName;
    return i18n.t((name ? name + '.' : '') + key, data)
}


/**
 * 整数格式化  123456  =>  123,456
 * @param value 格式化数据
 * @param digit 数位， 【可选】 默认： 3
 * @param split 连接符 【可选】 默认： ,
 */
export const numFormat = (value, digit, split) => {
    if (!digit) digit = 3;
    if (!split) split = ',';
    if (value) value += '';
    else return '';
    return value.replace(new RegExp('(\\S)(?=(?:\\S{' + digit + '})+$)', 'g'), `$1${split}`)
}

/**
 * 时间格式化
 * @param value 目标时间
 * @param format 格式化字符串 【可选】 默认 YYYY-MM-DD HH:mm:ss
 */
export const dateFormat = (value, format) => {
    if (!value) return '';
    else return moment(value).format(format || 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 转换为大写
 * @param key 
 */
export const uppercase = key => {
    if (typeof key === 'string') {
        return key.toUpperCase()
    } else {
        return key
    }
}

/**
 * 转为小写
 * @param key 
 */
export const lowercase = key => {
    if (typeof key === 'string') {
        return key.toLowerCase()
    } else {
        return key
    }
}

/**
 * 截取字符串
 * @param {*} key 待截取的字符串
 * @param {*} reverse 是否反向截取
 * @param {*} len 截取的长度
 */
export const substr = (key, len, reverse) => {
    if (typeof key === 'string') {
        if (reverse) {
            return key.substr(key.length - (len || 0), key.length)
        } else {
            return key.substr(0, len || key.length)
        }
    } else {
        return key
    }
}


/**
 * 字典回显
 * @param val 要回显的数据
 * @param list 字典字段
 */
export function filterCommen(val, list) {
    let name = ''
    if (list && list.length) {
        list.forEach(item => {
            if (val == item.id) {
                name = item.text
            }
        })
        return name
    }
}

/**
 * 多选字典过滤回显
 * @param key 要回显的数据
 * @param dicKey 字典字段
 * @param split 以什么分割数据
 * @param join 分割数据后以什么连接
 */
export const filterMultipleCommen = (key, dicKey, split, join) => {
    let NameC = key;
    if (key && typeof key === 'string') {
        let arr = key.split(split || ',');
        let result = [];
        if (dicKey != null && dicKey.length > 0 && arr.length) {
            arr.forEach(item => {
                dicKey.forEach(dicItem => {
                    if (item === dicItem.id) {
                        result.push(dicItem.text);
                    }
                })
            })
            NameC = result.join(join || '、');
        }
    }
    return NameC
}
export function pluralize(time, label) {
    if (time === 1) {
        return time + label;
    }
    return `${time + label}s`;
}

export function dictFilter(codeId, dicts, setId) {

    if (dicts && dicts.codeMap) {
        const setMap = dicts.codeMap[setId];
        if (setMap) {
            return setMap[codeId];
        }
    }
}


export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time);
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute');
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour');
    }
    return pluralize(~~(between / 86400), ' day');
}

export function parseTime(time, cFormat) {
    time = Date.parse(new Date(time));
    if (arguments.length === 0) {
        return null;
    }

    if ((`${time}`).length === 10) {
        time = +time * 1000;
    }

    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        date = new Date(parseInt(time));
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = `0${value}`;
        }
        return value || 0;
    });
    return time_str;
}

export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) { // less 1 hour
        return `${Math.ceil(diff / 60)}分钟前`;
    } else if (diff < 3600 * 24) {
        return `${Math.ceil(diff / 3600)}小时前`;
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    }
    return `${d.getMonth() + 1}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`;
}


/* 数字 格式化 */
export function formatNumber(num, digits) {
    if (num) {
        num = num.toFixed(digits || 2);
    } else if (num === 0) {
        num = '0.00';
    }
    return num;
}

/* 数字 格式化 */
export function nFormatter(num, digits) {
    const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' },
    ];
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
        }
    }
    return num.toString();
}

export function html2Text(val) {
    const div = document.createElement('div');
    div.innerHTML = val;
    return div.textContent || div.innerText;
}

export function toThousandslsFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

/* 金额格式化 */
export function moneyFilter(val) {
    let value = val + ''
    if (!value) return '0.00';

    /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1*/
    let intPart = Number(value) | 0; //获取整数部分
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

    let floatPart = ".00"; //预定义小数部分
    let value2Array = value.split(".");

    //=2表示数据有小数位
    if (value2Array.length == 2) {
        floatPart = value2Array[1].toString(); //拿到小数部分

        if (floatPart.length == 1) { //补0,实际上用不着
            return intPartFormat + "." + floatPart + '0';
        } else {
            return intPartFormat + "." + floatPart;
        }

    } else {
        return intPartFormat + floatPart;
    }
}
/* vxe table-column中的日期格式化 */
export function formatDate({ cellValue }) {
    return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
}

