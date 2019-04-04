angular.module('bw.controller')
    //首页
    .controller('indexCtrl', ['$scope', '$rootScope', 'appointmentService', '$state', 'toast', 'baseService', function($scope, $rootScope, appointmentService, $state, toast, baseService) {
        $bw.addSession({ name: 'isWebH5', info: true })
        $bw.addStorage({ name: 'showMapTips', info: null })
        $rootScope.userLocation = {};
        $rootScope.userInfo = window.userInfo;
        $rootScope.selectedCity = window.selectedCity || {};
        $rootScope.curCityName = '定位中...';
        $rootScope.curCitycode=""
        // if (!ENV.isTest) {
        if ($bw.isWx()) {
            appointmentService.getWxSign({}, function(reseponse) {
                wx.config({
                    debug: false, //是否弹出错误信 息
                    appId: ENV.appId,
                    timestamp: reseponse.Data.Timestamp,
                    nonceStr: reseponse.Data.NonceStr,
                    signature: reseponse.Data.Signature,
                    jsApiList: ['getLocation', 'scanQRCode',
                        'getNetworkType', 'onMenuShareTimeline',
                        'onMenuShareAppMessage', 'onMenuShareQQ',
                        'onMenuShareWeibo', 'onMenuShareQZone'
                    ]
                });
                wx.ready(function() {
                    baseService.shareTo(ENV.url, ENV.url + '/imgs/logo-share.png');
                    var workTypeInterval = setInterval(function() {
                        wx.getNetworkType({
                            success: function(res) {
                                // res.networkType返回网络类型2g，3g，4g，wifi
                            },
                            fail: function() {
                                clearInterval(workTypeInterval);
                                toast.showToast("你已经断开网络连接", 300000000);
                            }
                        });
                    }, 10000);
                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function(res) {
                            $rootScope.userLocation = res;
                            $scope.getSite(res);
                        }
                    });
                });
            });
        } else {
            AMap.plugin('AMap.Geolocation', function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：5s
                    buttonPosition: 'RB', //定位按钮的停靠位置
                    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点

                });
                geolocation.getCurrentPosition(function(status, result) {
                    if (status == 'complete') {
                        onComplete(result)
                    } else {
                        onError(result)
                    }
                });
            });
            //解析定位结果
            function onComplete(data) {
                $rootScope.userLocation = { longitude: data.position.lng, latitude: data.position.lat };
                $rootScope.curCityName = data.addressComponent.city;
                $rootScope.curCitycode = data.addressComponent.citycode;
                $rootScope.$apply();
                console.info($rootScope.userLocation)
            }

            function onError() {}
        }

        // }
        $scope.getSite = function(site) {
            $.ajax({
                type: "get",
                async: false,
                data: {
                    location: site.latitude + ',' + site.longitude,
                    output: 'json',
                    pois: 0,
                    ak: ENV.baiduMap.ak,
                },
                url: "https://api.map.baidu.com/geocoder/v2/",
                dataType: "jsonp",
                jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
                //jsonpCallback:"flightHandler",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
                success: function(res) {
                    if (res.status == 0) {
                        $rootScope.curCityName = res.result.addressComponent.city;
                        $rootScope.$apply();
                    }
                    console.log(res);
                },
                error: function() {}
            });
        };
        //设置背景层和用户中心的显示
        $rootScope.showBlock = false;
        $rootScope.showUserCenter = false;


        $scope.hideBlock = function() {
            $scope.$broadcast('hideBlock', false);
            $rootScope.showBlock = false;
            $rootScope.showUserCenter = false;
        };
        //用户中心点击跳转
        $scope.userCenterJump = function(self) {
            $scope.hideBlock();
            $scope.$broadcast('jumpOther', false);
            $state.go(self);
        }
        $scope.showAction = false;
        $scope.switchAction = function() {

            if ($scope.showAction) {
                $scope.showAction = false;
                setTimeout(function() {
                    $scope.showActionList = false;
                    $scope.$apply();
                }, 500)
            } else {
                $scope.showActionList = true;
                setTimeout(function() {
                    $scope.showAction = true;
                    $scope.$apply();
                }, 10)
            }
        }
        $rootScope.ENV = ENV;
        //获取开通城市，取是一个为默认选择的城市
        $rootScope.openCityList = []; //开通城市列表
        $scope.GetOpenCity = function() {
            var openCityList = JSON.parse($bw.getStorage('openCityList')) || [];
            if (openCityList.length > 0) {
                $rootScope.openCityList = openCityList;
                if (!$rootScope.selectedCity.CityName) {
                    $rootScope.selectedCity = $rootScope.openCityList.length ? $rootScope.openCityList[0] : {};
                    $bw.addStorage({
                        name: 'selectedCity',
                        info: $rootScope.selectedCity
                    });
                }
            } else {
                appointmentService.GetOpenCity({}, function(param) {
                    if (param.Status == 1 && param.Data) {
                        $rootScope.openCityList = param.Data;
                        $bw.addStorage({
                            name: 'openCityList',
                            info: JSON.stringify($rootScope.openCityList)
                        });
                        if (!$rootScope.selectedCity.CityName) {
                            $rootScope.selectedCity = $rootScope.openCityList.length ? $rootScope.openCityList[0] : {};
                            $bw.addStorage({
                                name: 'selectedCity',
                                info: $rootScope.selectedCity
                            });
                        }
                    }
                });
            }

        };
        //开通城市
        $scope.GetOpenCity();
        //跳转开发票
        $scope.goInvoice = function() {
            window.location.href = window.ENV.publicUrl + "/invoice/openInvoice.html?timeStr=" + new Date().getTime() ;
        };
        //跳转到帮助页
        $scope.goHelp = function() {
            window.location.href = window.ENV.publicUrl + "/faq/faq_list.html?timeStr=" + new Date().getTime() + '&phone=' + userInfo.phone;
        };
        //获取字典信息
        $rootScope.GetDicts = function(callback) {
            if (!window.selectedCity.CityIdentity) {
                return
            }
            var dicts = $bw.getSession('allDicts');
            if (dicts) {
                $scope.dicts = dicts;
                callback && callback();
            } else {
                appointmentService.GetDicts({}, function(res) {
                    var serializeDicts = {};
                    for (var i = 0; i < res.Data.length; i++) {
                        serializeDicts[res.Data[i].CatgCode] = serializeDicts[res.Data[i].CatgCode] || {};
                        serializeDicts[res.Data[i].CatgCode][res.Data[i].ItemCode] = res.Data[i];
                    }
                    $bw.addSession({ info: serializeDicts, name: 'allDicts' });

                    $scope.dicts = serializeDicts;
                    callback && callback();
                });
            }
        };
        $rootScope.GetDicts();

        $rootScope.changeUserCenter = function() {
            $rootScope.showUserCenter = true;
            $rootScope.showBlock = true;
        };
        window.addEventListener('pageshow', function(event) {
            if (!$bw.getSession('reloadSession')) return;
            $bw.addSession({ name: 'reloadSession', info: null })
            var reloadHtml = [/^#\/orderDetail\/[a-zA-Z0-9]*$/];
            for (var i in reloadHtml) {
                if (reloadHtml[i].test(location.hash)) {
                    location.reload();
                    return;
                }
            }
        })
    }])