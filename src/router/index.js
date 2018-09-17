import Vue from "vue";
import Router from "vue-router";

const _import = file => () => import("@/views/" + file + ".vue");

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Box",
      component: _import("index"),
      children: [
        // 首页路由
        {
          alias: "/",
          path: "index",
          component: _import("pages/index/index"),
          meta: {
            keepAlive: true
          }
        },
        // 我的
        {
          path: "setting",
          component: _import("pages/me/setting")
        },
        // 设置个人信息
        {
          path: "me",
          component: _import("pages/me/me")
        },
        // 收货列表
        {
          path: "adressList",
          component: _import("pages/me/adressList")
        },
         // 修改收货列表
         {
          path: "editAdress",
          component: _import("pages/me/editAdress")
        },
        // 测试调试页面
        {
          path: "shopCar",
          component: _import("pages/orderDetail/orderDetail")
        },
        // 猜你喜欢
        {
          path: "guessLike",
          component: _import("pages/include/guessLike")
        },
        // 掌柜推荐
        {
          path: "bossRecommend",
          component: _import("pages/include/bossRecommend")
        },
        
        
      ]
    }
  ]
});
