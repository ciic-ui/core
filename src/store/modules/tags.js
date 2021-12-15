import {
  local,
  session
} from '../../core/storage';
const tagObj = {
  label: '',
  value: '',
  query: '',
  num: '',
  close: true,
};
function setFistTag(list) {
  if (list.length === 1) {
    list[0].close = false;
  } else {
    list.some((a) => {
      a.close = true;
    });
    list[0].close = false;
  }
  return list;
}
const tags = {
  state: {
    tagList: session.getItem('tagList') || [],
    tag: session.getItem('tag') || tagObj,
    tagWel: {
      label: '首页',
      traText: '首页',
      enText: 'home',
      value: '/index',
    },
    tagCurrent: session.getItem('tagCurrent') || [],
  },
  actions: {

  },
  mutations: {
    ADD_TAG: (state, action) => {
      state.tag = action;
      session.setItem('tag', state.tag);
      if (state.tagList.some(a => a.value === action.value)) return;
      state.tagList.push({
        label: action.label,
        traText: action.traText,
        enText: action.enText,
        value: action.value,
        query: action.query,
        isSensitive:action.isSensitive
      });
      state.tagList = setFistTag(state.tagList);
      session.setItem('tagList', state.tagList);
    },
    SET_TAG_CURRENT: (state, tagCurrent) => {
      state.tagCurrent = tagCurrent;
      session.setItem('tagCurrent',  state.tagCurrent);
    },
    SET_TAG: (state, value) => {
      state.tagList.forEach((ele, num) => {
        if (ele.value === value) {
          state.tag = state.tagList[num];
          session.setItem('tag',state.tag);
        }
      });
    },
    DEL_ALL_TAG: (state, action) => {
      state.tag = tagObj;
      state.tagList = [];
      state.tagList.push(state.tagWel);
      session.removeItem('tag');
      session.removeItem('tagList');
    },
    DEL_TAG_OTHER: (state, action) => {
      state.tagList.forEach((ele, num) => {
        if (ele.value === state.tag.value) {
          state.tagList = state.tagList.slice(num, num + 1);
          state.tag = state.tagList[0];
          state.tagList[0].close = false;
          session.setItem('tag', state.tag);
          session.setItem('tagList', state.tagList);
        }
      });
    },
    DEL_TAG: (state, action) => {
      state.tagList.forEach((ele, num) => {
        if (ele.value === action.value) {
          state.tagList.splice(num, 1);
          state.tagList = setFistTag(state.tagList);
          session.setItem('tag', state.tag);
          session.setItem('tagList',state.tagList);
        }
      });
    },
  },
};
export default tags;
