/**
 * Created by H5 on 2017.05.10.
 */
(function () {
    let req = {};
    let send = function (obj, method, url, data, callback, header) {
        if(!obj) return;

        let reqOption = {};
        reqOption.method = method;
        reqOption.url = url+'?r='+Math.random();
        if(method == 'post' || method == 'POST'){
            reqOption.body = data;
        }else {
            reqOption.params = data;
        }
        if(header){
            reqOption.header = header;
        }

        let request = obj.$http(reqOption).then((res)=>{
            callback.call(this, res.data?res.data:res.body);
        });

        return request;
    };

    // 获取用户信息
    req.getUserInfo = function (obj, data, callback) {
        return send(obj, 'get', '/user/info', data, callback); 
    };
    // 获得用户是否开启首页功能status 
    req.openIndexFunc = function (obj, data, callback) {
        return send(obj, 'get', '/home/status', data, callback); 
    };
    // 获取商品分类树
    req.getGoodsTree = function (obj, data, callback) {
        return send(obj, 'get', '/goods/categories', data, callback);
    };
    // 获取客户名单
    req.getCustomerList = function (obj, data, callback) {
        return send (obj, 'get', '/custom', data, callback);
    };
    // 获得省
    req.getProvince = function (obj, data, callback) {
        return send (obj, 'get', '/city', data, callback);
    };
    // 设置里面的省市获得
    req.getSettingProvince = function (obj, data, callback) {
        return send (obj, 'get', 'api/other/provinces', data, callback, 'Accept:application/json');
    };
    // 首页里的数据获取
    req.indexStatics = function (obj, data, callback) {
        return send (obj, 'get', '/statics', data, callback, 'Accept:application/json');
    };
    // 客户分析
    req.customerAnalysis = function (obj, data, callback) {
        return send (obj, 'post', '/statics/custom', data, callback, 'Accept:application/json');
    };
    // 商品管理_获得分类
    req.goodsMange_getSort = function (obj, data, callback) {
        return send (obj, 'get', '/goods/categories', data, callback, 'Accept:application/json');
    };
    // 商品管理-获得品牌 
    req.goodsMange_getBrands = function (obj, data, callback) {
        return send (obj, 'get', '/operation/brands-list', data, callback, 'Accept:application/json');
    };
    // 冻参谋首页管理 - 热门品牌管理-获得首页品牌
    req.hotBrands_indexBrands = function (obj, data, callback) {
        return send (obj, 'get', '/home/hot/brand', data, callback, 'Accept:application/json');
    };
    // 冻参谋首页管理 - 热门品牌管理-获得全部品牌
    req.hotBrands_allBrands = function (obj, data, callback) {
        return send (obj, 'get', '/goods/brands', data, callback, 'Accept:application/json');
    };
     // 冻参谋首页管理 - 单品推荐管理-获得首页商品
     req.recommendGoos_indexGoods = function (obj, data, callback) {
        return send (obj, 'get', '/home/hot/goods', data, callback, 'Accept:application/json');
    };
     // 冻参谋首页管理 - 单品推荐管理-获得商品库商品
    req.recommendGoos_allGoods = function (obj, data, callback) {
        return send (obj, 'post', '/goods', data, callback, 'Accept:application/json');
    };
    // 退出登录
    req.quitLogin = function (obj, data, callback) {
        return send (obj, 'get', '/user/logout', data, callback, 'Accept:application/json');
    };
    // 已下接口暂不确定
    // 获得服务商列表
    req.getProvidersList = function (obj, data, callback) {
        return send (obj, 'post', '/operation/supplier-list', data, callback, 'Accept:application/json');
    };
    // 获得供应商详情
    req.getProviderDetail = function (obj, data, callback) {
        return send (obj, 'get', '/operation/supplier-detail', data, callback, 'Accept application/json')
    }
    // 获得供应商商品
    req.getProviderGoods = function (obj, data, callback) {
        return send (obj, 'get', '/operation/supplier-goods-list', data, callback, 'Accept application/json')
    }
    // 获得供应商商品详情
    req.getProviderGoodsDetail = function (obj, data, callback) {
        return send (obj, 'get', '/operation/goods-detail', data, callback, 'Accept application/json')
    }
    // 下架服务商
    req.putProvidersDown =   function (obj, data, callback) {
        return send (obj, 'post', '/operation/down-sale', data, callback, 'Accept:application/json');
    };
    // 上架供应商
    req.putProvidersOn =  function (obj, data, callback) {
        return send (obj, 'post', '/operation/on-sale', data, callback, 'Accept:application/json');
    };
        // 商品有关
    // 获得商品
    req.getProducts =   function (obj, data, callback) {
        return send(obj, 'post', '/operation/goods-list', data, callback, 'Accept:application/json');
    };
    // 获得改价详情
    req.getChangePriceDetail = function (obj, data, callback) {
        return send (obj, 'get', '/operation/change-desc', data, callback, 'Accept:application/json');
    }
    // 改价
    req.changePrice = function (obj, data, callback) {
        return send (obj, 'post', '/operation/change-price', data, callback, 'Accept:application/json');
    }
    // 自动上架新商品
    req.autoPutPrividersGoods = function (obj, data, callback) {
        return send (obj, 'post', '/operation/sale_new', data, callback, 'Accept:application/json');
    }
    // 获得置顶列表
    req.getToplist =  function (obj, data, callback) {
        return send (obj, 'get', '/operation/get-top-list', data, callback, 'Accept:application/json');
    }
    // 置顶排序
    req.setTopOrder = function (obj, data, callback) {
        return send (obj, 'post', '/operation/put-top-sequence', data, callback, 'Accept:application/json');
    }
    // 置顶或者取消置顶
    req.setTopOrNot = function (obj, data, callback) {
        return send (obj, 'post', '/operation/put-top', data, callback, 'Accept:application/json');
    }
    // 获取服务商列表
    req.getServersList = function (obj, data, callback,goodsId) {
        return send (obj, 'post', `/management/goods/${goodsId}/suppliers`, data, callback, 'Accept:application/json');
    }
    // 商品切换服务商
    req.changeServersList = function (obj, data, callback,goodsId) {
        return send (obj, 'patch', `/management/goods/${goodsId}/supplier`, data, callback, 'Accept:application/json');
    }
    // 商品改价（新）
    req.changePrice = function (obj, data, callback,goodsId) {
        return send (obj, 'patch', `/management/goods/${goodsId}/markup`, data, callback, 'Accept:application/json');
    }
    window.req = req;
    
})();