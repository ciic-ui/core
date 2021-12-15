

import {
  local,
  session
} from '../../core/storage';
const screen = {
  state: {
    clientWidth: session.getItem('clientWidth') || 1920,
    clientHeight: session.getItem('clientHeight') || 1080,
    tableSize: session.getItem('clientHeight') || 'mini',
    workspaceRect: {},
  },
  mutations: {
    SET_CLIENT_WIDTH: (state, clientWidth) => {
      state.clientWidth = clientWidth;
      session.setItem(
        'clientWidth', state.clientWidth
      );
    },
    SET_CLIENT_HEIGHT: (state, clientHeight) => {
      state.clientHeight = clientHeight;
      session.setItem(
        'clientHeight', state.clientHeight
      );
    },
    SET_TABLE_SIZE: (state) => {
      let tableSize = 'mini';
      if (state.clientWidth <= 1366) {
        tableSize = 'mini';
      } else if (state.clientWidth <= 1600) {
        tableSize = 'small';
      } else if (state.clientWidth > 1600) {
        tableSize = 'medium';
      }
      state.tableSize = tableSize;
      session.setItem(
        'tableSize', state.tableSize,
      );
    },
    SET_WORKSPACE_RECT: (state, workspaceRect) => {
      state.workspaceRect = workspaceRect;
    }
  },

};

export default screen;
