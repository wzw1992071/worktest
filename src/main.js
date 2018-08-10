/**
 * Created by YYM on 2017.06.20.
 */
import 'normalize.css';
import 'font-awesome/css/font-awesome.css';
import 'cropperjs/dist/cropper.css';
import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import vueResource from 'vue-resource';
import store from './store';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './components';
import Dialog from  './common/dialog.js';
import Base from './common/base.js';

Vue.use(iView);
Vue.use(vueResource);

Vue.prototype.$dialog = Dialog;
Vue.mixin(Base);
// 使用加载进度条
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});
router.afterEach(route => {
    iView.LoadingBar.finish();
});
// 完成
new Vue({
	store,
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});