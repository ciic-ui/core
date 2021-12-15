import {
  local,
  session
} from '../../core/storage';

const user = {
  state: {
    userInfo:
      session.getItem("userInfo"
      ) || {},
    userInfoPass:
      session.getItem("userInfoPass"
      ) || {},
    roles:
      session.getItem("roles"
      ) || [],
    setting:
      session.getItem("setting") || [],
    accessToken:
      session.getItem("accessToken"
      ) || "",
    refreshToken:
      session.getItem("refreshToken"
      ) || "",
    menu:
      session.getItem("menu") || "",
    menuRouters:
      session.getItem("menuRouters") || "",
    OrgTree: session.getItem('OrgTree') || [],
    postTree: session.getItem('postTree') || [],
    userPermissions: session.getItem("userPermissions") || "0",
  },
  actions: {


  },
  mutations: {
    SET_ACCESS_TOKEN: (state, accessToken) => {
      state.accessToken = accessToken;
      session.setItem("accessToken", state.accessToken
      );
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      session.setItem("userInfo", state.userInfo
      );
    },
    SET_USER_INFOPASS: (state, userInfo) => {
      state.userInfoPass = userInfo;
      session.setItem("userInfoPass", state.userInfoPass
      );
    },
    SET_MENU: (state, menu) => {
      state.menu = menu;
      session.setItem("menu", state.menu
      );
    },
    SET_MENU_ROUTERS: (state, menuRouters) => {
      state.menuRouters = menuRouters;
      session.setItem("menuRouters", state.menuRouters
      );
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken;
      session.setItem("refreshToken", state.refreshToken
      );
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
      session.setItem("setting", state.setting
      );
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
      session.setItem("roles", state.roles
      );
    },
    SET_ORGTREE: (state, OrgTree) => {
      state.OrgTree = OrgTree;
      session.setItem("OrgTree", state.OrgTree
      );
    },
    SET_POSTLIST: (state, postTree) => {
      state.postTree = postTree;
      session.setItem("postTree", state.postTree
      );
    },
    SET_USERPERMISSIONS: (state, userPermissions) => {
      state.userPermissions = userPermissions;
      session.setItem("userPermissions", state.userPermissions
      );
    }
  }
};
export default user;
