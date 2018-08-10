import Vue from 'vue';
import Router from 'vue-router';

import customerManagement from  '../views/customerManagement/customerManagement.vue';
import customerAnalysis from  '../views/customerAnalysis/customerAnalysis.vue';
import customerAnalysisBody from  '../views/customerAnalysis/customerAnalysisBody.vue';
import customerList from  '../views/customerList/customerList.vue';
import settings from '../views/settings/settings.vue';
// import goodsmanage from '../views/goodsmanage/goodsmanage.vue';
import indexmanage from '../views/function/indexmanage.vue';
import hotsortmanage from '../views/indexfunction/hotsortmanage.vue';
import hotbrandmanage from '../views/indexfunction/hotbrandmanage.vue';
import productrecommendmanage from '../views/indexfunction/productrecommendmanage.vue';
import goodsIn from '../views/goodsIn/goodsIn.vue';
// 商城管路router
import brands from '../views/marketManage/brands/brands.vue';
import onShelfBrands from '../views/marketManage/brands/onShelfBrands.vue';
import underShelfBrands from '../views/marketManage/brands/underShelfBrands.vue';
import onTopBrands from '../views/marketManage/brands/onTopBrands.vue';

import products from '../views/marketManage/products/products.vue';

import providers from '../views/marketManage/providers/providers.vue';

import allproviders from '../views/marketManage/providers/allproviders.vue';
import allprovidersOnshelf from '../views/marketManage/providers/allprovidersOnshelf.vue';
import allprovidersUndershelf from '../views/marketManage/providers/allprovidersUndershelf.vue';
import signedproviders from '../views/marketManage/providers/signedproviders.vue';
import signedprovidersOnshelf from '../views/marketManage/providers/signedprovidersOnshelf.vue';
import signedprovidersUndershelf from '../views/marketManage/providers/signedprovidersUndershelf.vue';


import NewProducts from '../views/marketManage/products/newProducts.vue';
import Putway from '../views/marketManage/products/putwayed.vue';
import unPutway from '../views/marketManage/products/unPutway.vue';
import invalid from '../views/marketManage/products/invalid.vue'

// 新商城管理
// 商品页面及子页面
import productsNew from '../views/newMarket/products/products.vue';
import NewGoods from '../views/newMarket/products/newGoods.vue';
import Putwayed from '../views/newMarket/products/putwayed.vue';
import unPutwayed from '../views/newMarket/products/unPutWayed.vue'
import invalidGoods from '../views/newMarket/products/invalid.vue'


Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', component: customerManagement},
        {path: '/customerManagement', component: customerManagement},
        {path: '/customerAnalysis', component: customerAnalysis, children: [{path: '', component:customerAnalysisBody}]},
        {path: '/customerList', component: customerList},
        {path: '/settings', component: settings},
        {path: '/goodsmanage', component:resolve => require(['../views/goodsmanage/goodsmanage.vue'], resolve)},
        {path: '/indexmanage', component: indexmanage},
        {path: '/hotsortmanage', component: hotsortmanage}, 
        {path: '/hotbrandmanage', component: hotbrandmanage},
        {path: '/productrecommendmanage', component: productrecommendmanage},
        {path: '/goodsIn', component: goodsIn},
        {path: '/brands', component: brands,
            children: [{path: '', component: onTopBrands}, {path: 'underShelfBrands', component: underShelfBrands}, {path: 'onShelfBrands', component: onShelfBrands}]
        },
        
        {path: '/providers', component: providers, 
        children: [
            {path: '', component: allproviders},
            {path: 'allproviders', component: allproviders, children: [
                {path: '', component: allprovidersOnshelf},
                {path: 'allprovidersUndershelf', component: allprovidersUndershelf}
            ]},
            {path:'signedproviders', component: signedproviders, children: [
                {path: '', component: signedprovidersOnshelf},
                {path: 'signedprovidersUndershelf', component: signedprovidersUndershelf}
            ]}
        ]},
        // 新商城管理
        {path: '/productsNew', component: productsNew, 
            children: [
                {path: '', component: NewGoods}, {path: 'putaway', component: Putwayed}, {path: 'unputaway', component: unPutwayed}, {path: 'invalid', component: invalidGoods}
            ]
        },
        {path: '/sort', component:resolve => require(['../views/marketManage/sort/sort.vue'], resolve),children: 
            [
                {path: '', component: resolve => require(['../views/marketManage/sort/onsort.vue'], resolve)},
                {path: 'onsort', component: resolve => require(['../views/marketManage/sort/onsort.vue'], resolve)},
                {path: 'undersort', component: resolve => require(['../views/marketManage/sort/undersort.vue'], resolve)}
            ]
        },
        {path: '/products', component: products, children: [
            {path: '', component: NewProducts}, {path: 'putaway', component: Putway}, {path: 'unputaway', component: unPutway}, {path: 'invalid', component: invalid}
        ]},
        {
            path: '/memberManage', component:resolve => require(['../views/memberMange/memberMange.vue'], resolve)
        },
        {
            path: '/dataStatistics', component:resolve => require(['../views/businessMange/dataStatistics.vue'], resolve)
        },
        {
            path: '/orderQuery', component:resolve => require(['../views/businessMange/orderQuery.vue'], resolve)
        },
        {
            path: '/distribution', component:resolve => require(['../views/distribution/distribution.vue'], resolve)
        }
    ]
    // mode: 'history'
});