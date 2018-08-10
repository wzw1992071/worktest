import Vue from 'vue';
import Vuex from 'vuex';
import editor from './modules/editor';
import loader from './modules/loader';
import middleware from './modules/middleware';
// const $vue = new Vue();
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        showPutaway: false,
        showType: false,
        shopDetailModal: false,
        goodsDetailModal: false,
        shopname: '找冻品',
        shop_params: {
            shop_id: 0,
            page:1,
            size:8
        },
        goods_params: {id:110},
        serverListlModal:false,//是否显示服务商列表模块
        changePriceShow:false//是否显示改价窗口
    },
    modules: {
      editor,
      loader,
      middleware
    },
    mutations: {
        closeGoodsDetail (state) {
            // 关闭商品详情
            state.goodsDetailModal = false;
            state.shopDetailModal = true;
        },
        openGoodsDetail (state) {
            // 打开商品详情
            state.goodsDetailModal = true;
            state.shopDetailModal = false;
        },
        openPriceChangeNocetice (state) {
            state.noticeShow = !state.noticeShow;
        },
        // 打开服务商列表
        openServerList(state){
            state.serverListlModal = true;
        },
        // 关闭服务商列表
        closeServerList(state){
            state.serverListlModal = false;
        },
        // 打开改价页面
        toggleChangePrice(state){
            state.changePriceShow = !state.changePriceShow;
        },
       
    },
    getters:{
        serverListlModal:state => state.serverListlModal,
        changePriceShow:state => state.changePriceShow,
    }
    
});

export default store;
