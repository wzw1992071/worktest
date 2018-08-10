import * as types from '../mutation-types';

const initialState = {
  openbtn:true,
  navbar: false //默认为关闭首页
};

const mutations = {
  [types.MIDDLEWARE_ASSIGN](state, data) {
    Object.assign(state, data);
  }
};

const actions = {
};

const getters = {
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state: Object.assign({}, initialState)
};
