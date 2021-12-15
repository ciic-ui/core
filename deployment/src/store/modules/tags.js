"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _storage = require("../../core/storage");

var tagObj = {
  label: '',
  value: '',
  query: '',
  num: '',
  close: true
};

function setFistTag(list) {
  if (list.length === 1) {
    list[0].close = false;
  } else {
    list.some(function (a) {
      a.close = true;
    });
    list[0].close = false;
  }

  return list;
}

var tags = {
  state: {
    tagList: _storage.session.getItem('tagList') || [],
    tag: _storage.session.getItem('tag') || tagObj,
    tagWel: {
      label: '首页',
      traText: '首页',
      enText: 'home',
      value: '/index'
    },
    tagCurrent: _storage.session.getItem('tagCurrent') || []
  },
  actions: {},
  mutations: {
    ADD_TAG: function ADD_TAG(state, action) {
      state.tag = action;

      _storage.session.setItem('tag', state.tag);

      if (state.tagList.some(function (a) {
        return a.value === action.value;
      })) return;
      state.tagList.push({
        label: action.label,
        traText: action.traText,
        enText: action.enText,
        value: action.value,
        query: action.query,
        isSensitive: action.isSensitive
      });
      state.tagList = setFistTag(state.tagList);

      _storage.session.setItem('tagList', state.tagList);
    },
    SET_TAG_CURRENT: function SET_TAG_CURRENT(state, tagCurrent) {
      state.tagCurrent = tagCurrent;

      _storage.session.setItem('tagCurrent', state.tagCurrent);
    },
    SET_TAG: function SET_TAG(state, value) {
      state.tagList.forEach(function (ele, num) {
        if (ele.value === value) {
          state.tag = state.tagList[num];

          _storage.session.setItem('tag', state.tag);
        }
      });
    },
    DEL_ALL_TAG: function DEL_ALL_TAG(state, action) {
      state.tag = tagObj;
      state.tagList = [];
      state.tagList.push(state.tagWel);

      _storage.session.removeItem('tag');

      _storage.session.removeItem('tagList');
    },
    DEL_TAG_OTHER: function DEL_TAG_OTHER(state, action) {
      state.tagList.forEach(function (ele, num) {
        if (ele.value === state.tag.value) {
          state.tagList = state.tagList.slice(num, num + 1);
          state.tag = state.tagList[0];
          state.tagList[0].close = false;

          _storage.session.setItem('tag', state.tag);

          _storage.session.setItem('tagList', state.tagList);
        }
      });
    },
    DEL_TAG: function DEL_TAG(state, action) {
      state.tagList.forEach(function (ele, num) {
        if (ele.value === action.value) {
          state.tagList.splice(num, 1);
          state.tagList = setFistTag(state.tagList);

          _storage.session.setItem('tag', state.tag);

          _storage.session.setItem('tagList', state.tagList);
        }
      });
    }
  }
};
var _default = tags;
exports.default = _default;