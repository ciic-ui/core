import Vue from 'vue'
import Vuex from 'vuex'
import {
  local,
  session
} from '../core/storage';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    accessToken: '',
    httpCount: 0,
    loadding: false,
    siteConfig: {},

  },
  mutations: {
    SET_ACCESS_TOKEN: (state, accessToken) => {
      state.accessToken = accessToken;
      session.setItem('accessToken', state.accessToken);
    },
    SET_HTTPCOUNT: (state, data) => {
      state.httpCount = data;
    },
    SET_LOADING: (state, data) => {
      state.loadding = !!data;
    },
  },
  getters: {

  }
})

const register = (path, module, moduleOptions) => {
  store.registerModule(path, module, moduleOptions);
}

export {
  store,
  register
}