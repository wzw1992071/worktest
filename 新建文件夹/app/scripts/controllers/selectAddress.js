//地址选择控制器
angular.module('bw.controller')
    .controller('selectAddress', ['$rootScope', '$scope', '$state', 'baseService', 'appointmentService', 'baiduService', 'toast', function($rootScope, $scope, $state, baseService, appointmentService, baiduService, toast) {
        if (document.querySelector(".gearDate")) {
            document.querySelector(".gearDate").remove();
        }
        if (document.querySelector(".gearDatetime")) {
            document.querySelector(".gearDatetime").remove();
        }
        if (document.querySelector(".bw-toast")) {
            document.querySelector(".bw-toast").remove();
        }
        // console.log($scope.$parent.selectedInteriorCity);
        var type = $bw.getSession("createOrderNowType");
        var appinfo = $bw.getSession("appointmentInfo" + type.stroke + type.carType);
        $scope.selAddressCity = appinfo.selAddressCity || '';
        if (!$scope.$parent.showSelectAddress) {
            //window.location.href = ENV.url + "/#/createOrder";
            $state.go('createOrder');
            return;
        }
        $scope.addressWords = '';
        $scope.mapData = [];
        $scope.toSelectCity = function() {
            $state.go('createOrder.selectAddress.selectCity');
        };
        // $scope.selectedInteriorCity = $bw.getStorage('indexSelectedInteriorCity') || '';
        $scope.setSelectAddress = function(obj) {
            var history = $bw.getStorage('BaiduAddressListHistory');
            var historyList = [];
            if (!history) history = [];
            for (var i in history) {
                if (history[i].uid !== obj.uid) {
                    historyList.push(history[i]);
                }
            }
            var newAddress = {
                addressInfo: obj.addressInfo,
                city: obj.city,
                district: obj.district,
                location: obj.location,
                name: obj.name,
                uid: obj.uid
            }
            historyList.unshift(newAddress);
            if (historyList.length > 10) {
                historyList.splice(10, 99);
            }
            $bw.addStorage({ name: 'BaiduAddressListHistory', info: historyList });
            $scope.$emit('selectAddress', obj);
            //window.history.go(-1)
            $state.go('createOrder');
        }
        $scope.selectAddress = function(obj) {
            var params = {
                "CityCode": $rootScope.selectedCity.CityIdentity || 'CTU',
                "Longitude": obj.location.lng,
                "Latitude": obj.location.lat
            }
            if ($scope.$parent.typeParams.stroke === 'jieji') {
                params.TripType = '1';
            } else {
                params.TripType = '2';
            }
            if ($scope.$parent.typeParams.carType === 'carpooling') {
                params.Type = 'SHARE';
            } else {
                params.Type = 'PRIVATE';
            }
            //专车不需要验证接送地址
            if ($scope.$parent.typeParams.carType === 'special') {
                $scope.setSelectAddress(obj);
            } else {
                appointmentService.IsPositionValidate(params, function(reseponse) {
                    if (reseponse.Status == 1 && reseponse.Data) {
                        if (reseponse.Data.IsValid === true) {
                            $scope.setSelectAddress(obj);
                        } else {
                            toast.showConfirm({
                                cancelWords: '我知道了',
                                sureWords: '查看接送区域',
                                text: reseponse.Data.Message,
                                sureFn: function() {
                                    //记住用户填写信息
                                    $bw.addSession({ name: 'appointmentInfo' + $scope.$parent.typeParams.stroke + $scope.$parent.typeParams.carType, info: $scope.$parent.appointmentInfo });

                                    //跳转到地图
                                    var url = window.ENV.publicUrl + "/mapRange.html?";
                                    url += "serviceType=" + $scope.$parent.appointmentInfo.ServiceType;
                                    url += "&tripType=" + $scope.$parent.appointmentInfo.TripType;
                                    url += "&latitude=" + obj.location.lat;
                                    url += "&longitude=" + obj.location.lng;
                                    url += "&cityId=" + $rootScope.selectedCity.CityId;
                                    window.location.href = url;
                                }
                            })
                        }
                    }
                });
            }
        };
        $scope.getAddressByPoi = function(poi, callback) {
            if (poi == null || !poi) {
                callback({ formatted_address: '' });
                return;
            }
            var params = {
                location: poi.lat + ',' + poi.lng,
                output: 'json',
                pois: 0,
                ak: ENV.baiduMap.ak,
            }
            appointmentService.getBaiDuDetailAddress(params, function(res) {
                if (res.status == 0) {
                    callback(res.result);
                } else {
                    callback(false);
                }
            });
            // $.ajax({
            //     type: "get",
            //     async: false,
            //     data: params,
            //     url: "https://api.map.baidu.com/geocoder/v2/",
            //     dataType: "jsonp",
            //     jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            //     //jsonpCallback:"flightHandler",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            //     success: function(res) {
            //         callback(res.result);
            //     },
            //     error: function() {
            //         callback(false);
            //     }
            // });
        };
        $scope.getAddress = function() {
            if ($scope.addressWords === '') {
                $scope.GetUserAddressBook();
                return;
            }
            $scope.mapData = [];
            var params = {
                Query: $scope.addressWords,
                Region: $scope.selectedInteriorCity || $scope.$parent.appointmentInfo.selAddressCity || $rootScope.curCityName,
                CityLimit: false
            }
            var list = $bw.getSession('BaiduAddressListSelAddr' + params.region + params.query);
            if (list) {
                $scope.mapData = list;
            } else {
                baiduService.get_BaiduSugestAddressList(params, function(reseponse) {
                    if (reseponse.Status == 1 && reseponse.Data && reseponse.Data.results) { //百度地图的成功状态是0
                        $scope.showAddrList(reseponse);
                    }
                });
            }
        };
        $scope.showAddrList = function(reseponse) {
            var list = reseponse.Data.results;
            var len = list.length;
            // var toastId = toast.showLoading();
            if (len === 0) {
                // toast.hideLoading(toastId);
                return;
            }
            var mapData = [];
            for (var i in list) {
                if (list[i].location && list[i].location.lng && list[i].location.lat) {
                    (function(i) {
                        $scope.getAddressByPoi(list[i].location, function(addressRes) {
                            if (addressRes && addressRes.formatted_address) {
                                list[i].addressInfo = addressRes.formatted_address;
                                mapData.push(list[i]);
                            }
                            len--;
                            if (len <= 0) {
                                $bw.addSession({
                                    info: mapData,
                                    name: 'BaiduAddressListSelAddr' + ($scope.selectedInteriorCity || $scope.$parent.appointmentInfo.selAddressCity || $rootScope.curCityName) + $scope.addressWords
                                })
                                $scope.mapData = mapData;
                                // toast.hideLoading(toastId);
                                // $scope.$apply();
                            }

                        })
                    })(i);
                } else {
                    len--;
                    if (len <= 0) {
                        $bw.addSession({
                            info: mapData,
                            name: 'BaiduAddressListSelAddr' + ($scope.selectedInteriorCity || $scope.$parent.appointmentInfo.selAddressCity || $rootScope.curCityName) + $scope.addressWords
                        })
                        $scope.mapData = mapData;
                        toast.hideLoading(toastId);
                    }
                }
            }
        };
        $scope.clickAddr = function(type) {
            if ($scope.addrInfo[type]) {

                var data = $scope.addrInfo[type];
                var obj = {
                    addressInfo: data.DetailAddress,
                    location: {
                        lat: data.Latitude,
                        lng: data.Longitude
                    },
                    name: data.Address
                }
                $scope.selectAddress(obj);
            } else {
                $state.go('commonAddress', {
                    type: type,
                    selAddress: $scope.selectedInteriorCity || $scope.$parent.appointmentInfo.selAddressCity
                });
            }
        }
        $scope.getUserAddress = function() {
            appointmentService.GetUserAddressBook({}, function(res) {
                $scope.addrInfo = {}
                for (var i in res.Data) {
                    if (res.Data[i].AddressName === '公司') {
                        $scope.addrInfo.company = res.Data[i];
                    } else if (res.Data[i].AddressName === '家') {
                        $scope.addrInfo.home = res.Data[i];
                    }
                }
            });
        }
        $scope.getUserAddress();
        //键盘事件
        $scope.addressKeyDown = function($event) {
            if ($event.keyCode === 13) {
                $scope.getAddress();
            }
        };
        //监听到选择的城市改变
        $scope.$watch('selectedInteriorCity', function(newV, oldV) {
            $scope.GetUserAddressBook();
        });
        //获取历史地址
        $scope.GetUserAddressBook = function() {
            $scope.mapData = $bw.getStorage('BaiduAddressListHistory');
        }
        $scope.GetUserAddressBook();
    }])