//模块声明和导入
var bwApp = angular.module('bwApp', [
    'bw.controller',
    'bw.services',
    'ui.router',
    'ngCookies',
    'bw.filters',
    'bw.directive',
    'oc.lazyLoad'
]);

bwApp.config(['$urlRouterProvider', '$stateProvider', '$httpProvider', function($urlRouterProvider, $stateProvider, $httpProvider) {
    // 路由配置
    $stateProvider
        .state('default_index', {
            url: '/index',
            controller: 'hello',
            stateName: '我要预约',
            templateUrl: "views/hello.html"
        })
        .state('userCenter', {
            url: '/userCenter',
            controller: 'userCenter',
            stateName: '个人中心',
            templateUrl: "views/userCenter.html"
        })
        .state('commonAddress', {
            url: '/commonAddress/:type',
            params: { type: null, selAddress: null },
            controller: 'commonAddress',
            stateName: '常用地址',
            templateUrl: "views/commonAddress.html",
            resolve: {
                loadJq: ['$ocLazyLoad', function($ocLazyLoad) { //依赖JQ
                    return $ocLazyLoad.load('bower_components/jquery/dist/jquery.min.js');
                }]
            }
        })
        .state('createOrder.selectAddress.selectCity', {
            url: '/selectCity',
            stateName: '选择城市',
            views: {
                "selectCity": {
                    controller: "selectCity",
                    templateUrl: "views/selectCity.html"
                }
            },
            resolve: {
                sidebar: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('bower_components/sidebar.js');
                }],
            }
        })
        .state('commonAddress.selectCity', {
            url: '/selectCity',
            stateName: '设置-选择城市',
            views: {
                "selectCity": {
                    controller: "selectCity",
                    templateUrl: "views/selectCity.html"
                }
            },
            resolve: {
                sidebar: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('bower_components/sidebar.js');
                }],
            }
        })
        .state('commonAddress.selectAddress', {
            url: '/selectAddress',
            stateName: '选择地址',
            views: {
                "selectAddress": {
                    controller: "commonAddressSel",
                }
            },
        })
        /*新版生成订单*/
        .state('createOrder', {
            url: '/createOrder',
            controller: 'createOrder',
            stateName: '接送机预约',
            templateUrl: "views/createOrder.html",
            cache: true,
            resolve: {
                loadLCalendar: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('bower_components/lcalendar/LCalendar-new2.js');
                }],
                loadlArea: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('bower_components/lcalendar/lArea.js');
                }],

                loadSwiperCss: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('bower_components/swiper/swiper.min.css');
                    // return $ocLazyLoad.load('bower_components/swiper/swiper-3.4.2.min.css');
                }]
            }
        })
        .state('createOrder.selectAddress', {
            url: '/selectAddress',
            stateName: '选择地址',
            views: {
                "selectAddress": {
                    controller: "selectAddress",
                    templateUrl: "views/selectAddress.html"
                }
            },
            resolve: {
                loadJq: ['$ocLazyLoad', function($ocLazyLoad) { //依赖JQ
                    return $ocLazyLoad.load('bower_components/jquery/dist/jquery.min.js');
                }]
            }
        })
        .state('createOrder.mapSelect', {
            url: '/mapSelect',
            stateName: '选择地址',
            views: {
                "mapSelect": {
                    controller: 'mapSelect',
                    templateUrl: "views/mapSelect.html",
                }
            },
            resolve: {
                loadJq: ['$ocLazyLoad', function($ocLazyLoad) { //依赖JQ
                    return $ocLazyLoad.load('bower_components/jquery/dist/jquery.min.js');
                }]
            }
        })
    .state('createOrder.priceDetailed', {
            url: '/priceDetailed',
            stateName: '付款明细',
            views: {
                "priceDetailed": {
                    controller: "priceDetailed",
                    templateUrl: "views/priceDetailed.html"
                }
            }
        })
        .state('createOrder.editUser', {
            url: '/editUser',
            stateName: '更换乘车人',
            views: {
                "editUser": {
                    controller: "editUser",
                    templateUrl: "views/editUser.html"
                }
            }
        })

    .state('createOrder.recharge', { //支付页面
            url: '/recharge',
            stateName: '在线充值',
            cache: true,
            views: {
                "recharge": {
                    controller: "recharge",
                    templateUrl: "views/recharge.html"
                }
            }
        })
        .state('bindID', {
            url: '/bindID',
            controller: 'bindID',
            stateName: '实名认证',
            templateUrl: "views/bindingIDcard.html",
            cache: true
        })
        .state('bindPhone', {
            url: '/bindPhone',
            controller: 'bindPhone',
            stateName: '登录',
            templateUrl: "views/bindingPhone.html",
            cache: true
        })
        .state('setting', {
            url: '/setting',
            controller: 'setting',
            stateName: '设置',
            templateUrl: "views/setting.html",
            cache: true
        })
        .state('orderList', {
            url: '/orderList',
            controller: 'orderList',
            stateName: '我的行程',
            templateUrl: "views/orderList.html",
            cache: true,
            resolve: {
                loadJq: ['$ocLazyLoad', function($ocLazyLoad) { //依赖JQ
                    return $ocLazyLoad.load('bower_components/jquery/dist/jquery.min.js');
                }]
            }
        })
        .state('orderList.payOrder', { //支付页面
            url: '/payOrder/:id',
            stateName: '我的行程',
            cache: true,
            views: {
                "payOrder": {
                    controller: "payOrder",
                    templateUrl: "views/payOrder.html"
                }
            }
        })
        .state('orderList.orderInvalid', { //过期
            url: '/orderInvalid/:id',
            stateName: '行程过期',
            cache: true,
            views: {
                "orderInvalid": {
                    controller: "orderInvalid",
                    templateUrl: "views/orderInvalid.html"
                }
            }
        })
        .state('payOrder', {
            url: '/payOrder',
            controller: 'payOrder',
            stateName: '订单详情',
            templateUrl: "views/payOrder.html",
            cache: true
        })
        .state('orderDetail', {
            url: '/orderDetail/:id',
            controller: 'orderDetail',
            stateName: '行程详情',
            templateUrl: "views/orderDetail.html",
            cache: true,
            resolve: {
                loadQrcode: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('bower_components/qrcode/qrcode.js');
                }],
                loadNgQrcode: ['$ocLazyLoad', function($ocLazyLoad) { //依赖qrcode.js
                    return $ocLazyLoad.load('bower_components/qrcode/ng-qrcode.js');
                }],
                loadJq: ['$ocLazyLoad', function($ocLazyLoad) { //依赖JQ
                    return $ocLazyLoad.load('bower_components/jquery/dist/jquery.min.js');
                }]
            }
        })
        .state('orderDetail.priceDetailed', {
            url: '/priceDetailed',
            stateName: '付款明细',
            views: {
                "priceDetailed": {
                    controller: "priceDetailed",
                    templateUrl: "views/priceDetailed.html"
                }
            }
        })
        .state('wallet', {
            url: '/wallet',
            stateName: '我的钱包',
            controller: 'myWallet',
            templateUrl: "views/wallet.html",
            cache: true
        })
        .state('recharge', {
            url: '/recharge',
            stateName: '余额充值',
            controller: 'recharge',
            templateUrl: "views/recharge.html",
            cache: true
        })
        .state('walletDetaile', {
            url: '/walletDetaile/:id',
            stateName: '余额明细',
            controller: 'walletDetaile',
            templateUrl: "views/walletDetaile.html",
            cache: true
        })
        .state('wxpay', {
            url: '/wxpay',
            stateName: '支付',
            controller: 'wxpay',
            templateUrl: "views/wxpay.html",
            cache: true
        })
        .state('editPhone', {
            url: '/editPhone',
            stateName: '更换手机号',
            controller: 'editPhone',
            templateUrl: "views/editPhone.html",
            cache: true
        });
        
    //默认访问的页面地址
    $urlRouterProvider.otherwise('/index');
    //上传文件http配置信息
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    // $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
    $httpProvider.defaults.withCredentials = true;

    // 配置http拦截器
    $httpProvider.interceptors.push('httpInterceptor');
}]);
bwApp.run(['$rootScope', '$state', '$cookieStore', 'baseService', '$timeout', function($rootScope, $state, $cookieStore, baseService, $timeout) {
    //路由拦截器切换之前
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        //判断用户是否绑定手机号
        if (!window._token && toState.name != 'bindPhone') {
            event.preventDefault();
            $state.go('bindPhone');
            return;
        }
        if ((!window.userInfo || !window.userInfo.phone) && toState.name != 'bindPhone' && $bw.isWx()) {
            event.preventDefault();
            $state.go('bindPhone');
            return;
        }

    });
    //路由切换成功之后
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if ($rootScope.bwTransition === true) {
            $rootScope.bwTransition = false;
            $timeout(function() {
                $state.go($rootScope.bwTransitionParmas.name, $rootScope.bwTransitionParmas.parmas);
            }, 200)
            return;
        }

        $rootScope.showBlock = false;
        $rootScope.routerHide = false;
        $rootScope.showUserCenter = false;
        $rootScope.fromState = fromState;

        document.body.scrollTop = 0; //置顶
        document.title = toState.stateName; //设置title  android 直接就可以修改成功
        //微信中的浏览器中单页面第一次加载成功后，不再监听tile的变化,通过iframe来触发 页面重新来监听
        var $body = angular.element(document.getElementsByTagName('body'));

        var $iframe = angular.element("<iframe style='opacity: 0;' src='/favicon.ico'></iframe>");
        $iframe.on('load', function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        });
        $body.append($iframe);
    });
    //post请求时需要格式化参数（编码和序列化）
    window.param = function(obj) {
        return JSON.stringify(obj);
    };
    setRem();
    window.onresize = function() {
        setTimeout(setRem, 300)
    }
    FastClick.attach(document.body);
}]);

angular.module('bw.controller', ['bw.services']);
angular.module('bw.services', ['ngResource']);
angular.module('bw.directive', ['bw.services']);
angular.module('bw.filters', []);

angular.element(document).ready(function() {
    $bw.noConfig = true;
    $bw.getToken(function() {
        angular.element(document.getElementById('loading-html')).remove();
        angular.bootstrap(document.getElementById("big-box"), ["bwApp"]);
    });

});

function setRem() {
    var windowWidth = document.body.offsetWidth;
    RootFontSize = parseInt(windowWidth / 750 * 100);
    document.getElementsByTagName("html")[0].style.fontSize = RootFontSize + "px";
}