

import { validatenull } from './validate.js';

const gettype = Object.prototype.toString
/**
 * 存储localStorage
 */
export const setStore = (params) => {
  const {
    name,
    content,
    type,
  } = params;

  const obj = {
    dataType: gettype.call(content),
    content,
    type,
    datetime: new Date().getTime(),
  };
  if(obj.dataType === '[object Set]') {
    obj.content = Array.from(obj.content)
  }
  if (type)WESESSION.setItem(name, _serialize(obj));
  else WELOCAL.setItem(name, _serialize(obj));
};

/**
 * 序列化对象
 * @param obj
 * @returns {string}
 * @private
 */
function _serialize(obj){
  return JSON.stringify(obj, function(key, val) {
    if (typeof val === 'function') {
      return val + '';
    }
    return val;
  });
}

/**
 * 对象反序列化
 * @param jsonStr
 * @returns {any}
 * @private
 */
function _deserialize(jsonStr) {
  return JSON.parse(jsonStr,function(k,v){
    if(typeof v === 'string' && v.indexOf('function')>-1){
      return eval("(function(){return "+v+" })()")
    }
    return v;
  });

}

/**
 * 获取localStorage
 */
export const getStore = (params) => {
  const {
    name,
  } = params;
  let obj = {};
  let content;
  obj = WELOCAL.getItem(name);
  if (validatenull(obj)) obj = WESESSION.getItem(name);
  if (validatenull(obj)) return;
  obj = _deserialize(obj);
  if (obj.dataType === '[object String]') {
    content = obj.content;
  } else if (obj.dataType === '[object Number]') {
    content = Number(obj.content);
  } else if (obj.dataType === '[object Boolean]') {
    content = eval(obj.content);
  } else if (obj.dataType === '[object Set]') {
    if (validatenull(obj.content)) {
      content = new Set();
    } else {
      content = new Set(obj.content);
    }
  } else if (obj.dataType === '[object Object]' || obj.dataType === '[object Array]') {
    content = obj.content;
  }
  return content;
};
/**
 * 删除localStorage
 */
export const removeStore = (params) => {
  const {
    name,
  } = params;
  WELOCAL.removeItem(name);
  WESESSION.removeItem(name);
};

