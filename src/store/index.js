

import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import common from './modules/common';
import impData from './modules/impData';
import tags from './modules/tags';
import screen from './modules/screen';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    common,
    tags,
    screen,
    impData,
  },
  getters,
})
