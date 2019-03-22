angular.module('bw.controller')
    .controller('hello', ['$scope', '$state', function($scope, $state) {
        history.replaceState(null, null, './index.html#createOrder');
        window.location.reload();
        return;
    }])
    .controller('userCenter', ['$scope', '$state', function($scope, $state) {}])
    .controller('orderInvalid', ['$scope', '$state', 'baseService', 'appointmentService', '$stateParams', 'toast', function($scope, $state, baseService, appointmentService, $stateParams, toast) {
        $scope.getOrderDetail = function() {
            appointmentService.GetDetail({ bookingId: $stateParams.id }, function(reseponse) {
                if (reseponse.Status == 1 && reseponse.Data) {
                    if (reseponse.Data.TripType == 2) {
                        $scope.isSongji = true;
                    } else {
                        $scope.isJieji = true;
                    }
                    var status = reseponse.Data.Status;
                    $scope.orderDetail = reseponse.Data;
                }
            })
        }
        $scope.$on('$destroy', function() {
            $scope.$emit('showMine', {});
        });
        $scope.getOrderDetail();
    }])
    .controller('commonAddressSel', ['$scope', '$state', function($scope, $state) {
        $scope.typeParams.showSetAddr = true;
        $scope.mapData = [];
        $scope.$on('$destroy', function() {
            $scope.typeParams.showSetAddr = false;
        });

    }])
    .controller('commonAddress', ['$rootScope', '$scope', '$state', 'appointmentService', 'baiduService', 'toast', '$resource', '$stateParams', function($rootScope, $scope, $state, appointmentService, baiduService, toast, $resource, $stateParams) {
        $scope.typeParams = { showSetAddr: false };
        $scope.addrInfo = {};
        $scope.previousState = null;
        $scope.isCity = false;
        $scope.selectedInteriorCity = '';
        $scope.mapData = [];
        console.log($scope.typeParams.showSetAddr);
        $scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
            if (to.name == 'commonAddress' && from.name == "commonAddress.selectAddress") {
                $scope.selectedInteriorCity = '';
            }
            if (!$scope.previousState) {
                $scope.previousState = from; //from为前一个页面的路由信息：url,cache,views,name
                if ($scope.previousState.name) {
                    $bw.addSession({
                        name: 'previousState',
                        info: $scope.previousState
                    });
                }
            }
            if ($scope.previousState.name === "setting") { //通过设置里面进去的可以切换城市
                $scope.isCity = true;
                // $scope.selectedInteriorCity = '';
                // $scope.selectedInteriorCity = $bw.getStorage('setSelectedInteriorCity') || '';
            } else if ($scope.previousState.name === "createOrder.selectAddress") { //通过主页进入的要把上一页选择的城市显示
                // $scope.selectedInteriorCity = $bw.getStorage('indexSelectedInteriorCity') || '';
            } else {
                $scope.previousState = $bw.getSession('previousState') || '';
                if ($scope.previousState.name === "setting") { //通过设置里面进去的可以切换城市
                    $scope.isCity = true;
                    // $scope.selectedInteriorCity = $bw.getStorage('setSelectedInteriorCity') || '';
                } else if ($scope.previousState.name === "createOrder.selectAddress") { //通过主页进入的要把上一页选择的城市显示
                    // $scope.selectedInteriorCity = $bw.getStorage('indexSelectedInteriorCity') || '';
                }
            }
            // $scope.previousParams = fromParams; //fromParams为前一个页面的ID信息
            // $scope.nowState = to; //to为当前页面的路由信息：url,cache,views,name，同样，toParams为当前页面的ID信息
        });
        //监听到选择的城市改变
        $scope.$watch('selectedInteriorCity', function(newV, oldV) {
            $scope.mapData = [];
        });
        $scope.toSelectCity = function() {
            $state.go('commonAddress.selectCity');
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
        $scope.clickAddr = function(type) {
            var typeObj = { home: '家', company: '公司' };
            $scope.typeCName = typeObj[type];

            if ($scope.addrInfo[type]) {

            } else {
                $state.go('commonAddress.selectAddress');
                $scope.typeName = type;

            }
        }
        $scope.selectAddress = function(app) {
            var params = {
                "AddressName": $scope.typeCName || '',
                "Address": app.name,
                "DetailAddress": app.addressInfo,
                "Longitude": app.location.lng,
                "Latitude": app.location.lat
            }
            if ($scope.addrInfo[$scope.typeName]) params.UABID = $scope.addrInfo[$scope.typeName].UABID;
            appointmentService.UpdateAddressBook(params, function(res) {
                $scope.getUserAddress();
                window.history.go(-1);
                return false;
            });

        }
        $scope.delete = function(type) {
            var deleteFn = $resource(ENV.api + 'Users/DeleteAddressBook?uabId=' + $scope.addrInfo[type].UABID, {});
            deleteFn.save({}, function(reseponse) {
                if (reseponse.Status == 1) {
                    $scope.getUserAddress();
                }
            }, function() {});
        }
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
                query: $scope.addressWords,
                cityName: $scope.selectedInteriorCity || $rootScope.curCityName,
                output: "json",
                limit: false,
                ak: ENV.baiduMap.ak
            }
            var list = $bw.getSession('BaiduAddressListSelAddr' + params.region + params.query);
            if (list) {
                $scope.mapData = list;
            } else {
                baiduService.get_BaiduSugestAddressList(params, function(reseponse) {
                    if (reseponse.Status == 1 && reseponse.Data && reseponse.Data.result) { //百度地图的成功状态是0
                        $scope.showAddrList(reseponse);
                    }
                });
            }
        };
        $scope.showAddrList = function(reseponse) {
            var list = reseponse.Data.result;
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
                                $bw.addSession({ info: mapData, name: 'BaiduAddressListSelAddr' + ($scope.selectedInteriorCity || $rootScope.curCityName) + $scope.addressWords })
                                $scope.mapData = mapData;
                                // toast.hideLoading(toastId);

                                // $scope.$apply();
                            }

                        })
                    })(i);
                } else {
                    len--;
                    if (len <= 0) {
                        $bw.addSession({ info: mapData, name: 'BaiduAddressListSelAddr' + ($scope.selectedInteriorCity || $rootScope.curCityName) + $scope.addressWords })
                        $scope.mapData = mapData;
                        toast.hideLoading(toastId);
                    }
                }
            }
        };
        //键盘事件
        $scope.addressKeyDown = function($event) {
            if ($event.keyCode === 13) {
                $scope.getAddress();
            }
        };
        if ($stateParams.type !== 'none') {
            $scope.clickAddr($stateParams.type);
            $scope.selectedInteriorCity = $stateParams.selAddress;
        }
    }])
    .controller('editUser', ['$scope', '$state', 'toast', 'baseService', function($scope, $state, toast, baseService) {
        if (document.querySelector(".gearDate")) {
            document.querySelector(".gearDate").remove();
        }
        if (document.querySelector(".gearDatetime")) {
            document.querySelector(".gearDatetime").remove();
        }
        if (document.querySelector(".bw-toast")) {
            document.querySelector(".bw-toast").remove();
        }
        if (!$scope.$parent.typeParams.showEditUser) {
            $state.go('createOrder');
            return false;
        }

        $scope.historyList = $bw.getStorage('historyEditUserList') || [];

        if ($scope.$parent.appointmentInfo.IsSendOtherMessage === false) {
            $scope.typeParams = { notice: false };
        } else {
            $scope.typeParams = { notice: true };
        }
        $scope.editInfo = {};
        $scope.switchNotice = function() {
            $scope.typeParams.notice = !$scope.typeParams.notice;
        }
        $scope.selectHistory = function(app) {
            $scope.editInfo.UserName = app.UserName;
            $scope.editInfo.Phone = app.Phone;
        }
        $scope.cleanHistory = function() {
            $bw.addStorage({ name: 'historyEditUserList', info: null });
            $scope.historyList = [];
        }
        $scope.sureEdit = function() {
            if ($scope.editInfo.Phone === window.userInfo.phone) {
                $scope.editInfo.UserName = '本人乘车';
            }
            // if ($scope.editInfo.UserName == '') {
            //     toast.showToast("姓名不能为空", 1500);
            //     return;
            // }
            if ($scope.editInfo.Phone == '') {
                toast.showToast("联系方式不能为空", 1500);
                return;
            }
            if (!baseService.validatemobile($scope.editInfo.Phone)) {
                toast.showToast("手机号格式不正确", 1500);
                return;
            }

            var historyList = $bw.getStorage('historyEditUserList') || [];
            for (var i in historyList) {
                if (historyList[i].Phone === $scope.editInfo.Phone) {
                    historyList.splice(i, 1);
                }
            }
            historyList.unshift({ Phone: $scope.editInfo.Phone, UserName: $scope.editInfo.UserName });
            $bw.addStorage({ name: 'historyEditUserList', info: historyList });
            $scope.editInfo.notice = $scope.typeParams.notice;
            $scope.$emit('editUserEmit', $scope.editInfo);
            //window.history.go(-1);
            $state.go('createOrder');
        }

    }])
    .controller('selectCity', ['$timeout', '$rootScope', '$scope', '$state', 'appointmentService', 'baiduService', 'toast', '$resource', '$stateParams', function($timeout, $rootScope, $scope, $state, appointmentService, baiduService, toast, $resource, $stateParams) {
        $scope.letters = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];
        $scope.isDelete = false;
        $scope.serchValue = '';

        $scope.letter = '';
        $scope.letterIsShow = false;
        $scope.serchList = []; //查询结果
        $scope.previousState = null;
        $scope.isSession = false; //是否把选择的城市存下来
        var fontSize = document.getElementsByTagName("html")[0].style.fontSize;
        var step = (parseFloat(fontSize ? fontSize : '50') * 0.92).toFixed(2) * 1.3;
        new IndexSidebar().on('charChange', function(ch) {
            var elItemList = document.querySelector(".citys");
            if (ch === '#') {
                elItemList.scrollTop = 0;
            } else {
                var target = elItemList.querySelector('#city-' + ch);
                if (target) {
                    // target.scrollIntoView();
                    $(".citys").scrollTop(document.getElementById("city-" + ch).offsetTop - step);
                }
            }
        });
        $scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
            if (!$scope.previousState) {
                $scope.previousState = from; //from为前一个页面的路由信息：url,cache,views,name
                if ($scope.previousState.name) {
                    $bw.addSession({
                        name: 'previousStateSelectCity',
                        info: $scope.previousState
                    });
                }
            }

            if ($scope.previousState.name === "createOrder.selectAddress") { //通过设置里面进去的可以和通过主页进去的存的字段不同
                $scope.isSession = true;
            } else if ($scope.previousState.name === "commonAddress.selectAddress") {
                $scope.isSession = false;
            } else {
                $scope.previousState = $bw.getSession('previousStateSelectCity') || '';
                if ($scope.previousState.name === "createOrder.selectAddress") {
                    $scope.isSession = true;
                } else if ($scope.previousState.name === "commonAddress.selectAddress") {
                    $scope.isSession = false;
                }
            }
        });
        $scope.selCity = function(city) {
            $scope.$parent.selectedInteriorCity = city;
            // if ($scope.isSession) {
            //     $bw.addStorage({
            //         name: 'indexSelectedInteriorCity',
            //         info: $scope.$parent.selectedInteriorCity
            //     });
            // } else {
            //     $bw.addStorage({
            //         name: 'setSelectedInteriorCity',
            //         info: $scope.$parent.selectedInteriorCity
            //     });
            // }

            window.history.back();
        }
        $scope.serchFocus = function() {
            $scope.isDelete = true;
            if (!$scope.serchValue) {
                $scope.serchList = [];
            }
        }
        $scope.goBack = function() {
            window.history.back();
        }
        $scope.delete = function() {
            $scope.serchValue = '';
            $scope.serchList = [];
        }

        $.getJSON("../../publicViews/resource/allcity.json", function(data) {
            $scope.citys = data;
            $scope.$apply();
        });
        $scope.clickLetter = function(letter) {
            $scope.letter = letter;
            $scope.letterIsShow = true;
            $timeout(function() {
                $scope.letterIsShow = false;
            }, 500);
            if (letter === '#') {
                $(".citys").scrollTop(0);
            } else {
                $(".citys").scrollTop(document.getElementById("city-" + letter).offsetTop - step);
            }
        };
        $scope.change = function() {
            $scope.serchList = [];
            if ($scope.serchValue) {
                if (/^[A-Za-z]*$/.test($scope.serchValue)) {
                    $scope.serchValue = $scope.serchValue.toLowerCase();
                    angular.forEach($scope.citys, function(item, index) {
                        if ($scope.serchValue.indexOf(index.toLowerCase()) === 0) {
                            angular.forEach(item, function(e) {
                                if (e.full.toLowerCase().indexOf($scope.serchValue) >= 0) {
                                    $scope.serchList.push(e.name);
                                }
                            })
                        }

                    })
                } else {
                    angular.forEach($scope.citys, function(item) {
                        angular.forEach(item, function(e) {
                            if (e.name.indexOf($scope.serchValue) >= 0) {
                                $scope.serchList.push(e.name);
                            }
                        })
                    })
                }

            }

            $scope.$apply();

        }

    }])

//设置
.controller('setting', ['$scope', '$state', 'baseService', 'appointmentService', 'toast', function($scope, $state, baseService, appointmentService, toast) {
        $scope.version = ENV.version;
        $scope.IsRealValid = false;
        $scope.showPhone = '';
        $scope.notWx = true;
        if ($bw.isWx()) {
            $scope.notWx = false;
        }
        $scope.userInfo = $bw.getStorage('bwUserInfo');
        // if (!$scope.userInfo) window.location.reload();
        $scope.userInfo && ($scope.showPhone = $scope.userInfo.phone.replace(/^(\d{3})\d{4}(\d*)$/g, "$1****$2"));
        if ($scope.userInfo.IsRealValid) $scope.IsRealValid = true;

        //注销账号
        $scope.SignOut = function() {
            toast.showConfirm({
                cancelWords: '取消',
                sureWords: '确定',
                text: '您确定要退出吗？',
                sureFn: function() {
                    $bw.logoOut();
                    toast.showToast("退出成功", 1000, function() {
                        $state.go('bindPhone')
                    });
                }
            });

        };
        //跳转到帮助页面
        $scope.goHelp = function() {
            window.location.href = window.ENV.publicUrl + "/faq/faq_list.html?timeStr=" + new Date().getTime() + '&phone=' + userInfo.phone;
            return;
        };
        $scope.goAboutUs = function() {
            window.location.href = window.ENV.publicUrl + "/aboutUs.html?version=" + ENV.version;
            return;
        }
        $scope.goPassenger = function() {
            window.location.href = window.ENV.publicUrl + "/airplanePassenger.html?version=" + ENV.version + "&setting=true";
            return;
        }
        $scope.goCommonAddress = function() {
            $state.go('commonAddress', { type: 'none' });
        };
        //跳转到更改手机号界面
        $scope.goEditPhone = function() {
            $state.go('editPhone');
        }
    }])
    .controller('editPhone', ['$scope', '$state', 'toast', 'baseService', '$interval', 'appointmentService', function($scope, $state, toast, baseService, $interval, appointmentService) {
        $scope.validPhone = false;
        $scope.validCaptcha = false;
        $scope.nowType = 'phone'; //phone 显示填写手机界面 或者 msg显示填写验证码界面
        $scope.userPhone = '';
        $scope.showPhone = '';
        $scope.captcha = '';
        $scope.timgRuning = false;
        $scope.time = 0;
        $scope.phoneChange = function() {
            $scope.validPhone = baseService.validatemobile($scope.userPhone);
        }
        $scope.captchaChange = function() {
            if ($scope.captcha.length == 4) {
                $scope.validCaptcha = true;
            } else {
                $scope.validCaptcha = false;
            }
        }
        $scope.jumpMessage = function() {
                //发送验证码成功后显示填写验证码界面
                $scope.nowType = 'msg';
                $scope.showPhone = $scope.userPhone.replace(/^(\d{3})\d{4}(\d*)$/g, "$1****$2");
                $scope.time = 60;
                $scope.timgRuning = true;
                var timeInt = $interval(function() {
                    $scope.time--;
                    if ($scope.time <= 0) {
                        $scope.timgRuning = false;
                        $interval.cancel(timeInt);
                    }
                }, 1000)
            }
            //发送验证码
        $scope.sendMsg = function() {
            if ($scope.validPhone) {
                //先验证手机号是否可以更换
                appointmentService.ValidateModifyPhone({ phone: $scope.userPhone }, function(reseponse) {
                    if (reseponse.Status == 1) {
                        //发送验证码
                        appointmentService.SendValidSMS({ PhoneNumber: $scope.userPhone }, function(reseponse) {
                            if (reseponse.Status == 1) {
                                $scope.jumpMessage();
                            }
                        })
                    }
                })
            } else {
                toast.showToast("请填写正确的手机号码", 1000);
            }
        }
        $scope.bindPhone = function() {
            if ($scope.validCaptcha) {
                //绑定手机
                appointmentService.ModifyCustomPhone({ phone: $scope.userPhone, validateCode: $scope.captcha }, function(reseponse) {
                    if (reseponse.Status == 1) {
                        toast.showToast("更换手机成功，页面正在跳转", 1000, function() {
                            var utem = $bw.getStorage('bwUserInfo');
                            utem.phone = $scope.userPhone;
                            $bw.addStorage({
                                name: 'bwUserInfo',
                                info: utem
                            });
                            var userInfo = window.userInfo;
                            userInfo.phone = $scope.userPhone;
                            window.userInfo = userInfo;
                            window.history.back(-1);
                            return false;
                        });
                    }
                })
            } else {
                toast.showToast("请填写正确的验证码", 1000);
            }
        }
    }])

.controller('wxpay', ['$timeout', '$scope', '$state', '$rootScope', 'baseService', 'appointmentService', 'toast', function($timeout, $scope, $state, $rootScope, baseService, appointmentService, toast) {
    $bw.addSession({ name: 'isWayPayBack', info: 'true' });
    var payInfo = $bw.getSession('wxpayInfo');
    if (!payInfo) { window.history.back(); return false; }
    $bw.addSession({ name: 'wxpayInfo', info: null });

    if ($bw.isWx()) {
        var totalTime = 0;
        $scope.wechatPayInfo = {
            "appId": payInfo.appId, //公众号名称，由商户传入     
            "timeStamp": payInfo.timeStamp, //时间戳，自1970年以来的秒数
            "nonceStr": payInfo.nonceStr, //随机串     
            "package": payInfo.package,
            "signType": payInfo.signType, //微信签名方式：     
            "paySign": payInfo.paySign //微信签名
        }

        $bw.callpay(
            function() {
                toast.showToast("等待支付结果", 1500);
                var toastId = toast.showLoading();
                var bookingId = payInfo.bookingId;
                $scope.GetBookingStatus(toastId, bookingId, toast, totalTime);
            },
            function(errorStr) {
                toast.showToast(errorStr, 1000);
                setTimeout(function() {
                    window.history.back();
                }, 1000);
            }, $scope.wechatPayInfo);
    } else {
        angular.element(document.getElementById('box')).html(payInfo);
        document.forms['submit'].submit();
    }

    $scope.GetBookingStatus = function(toastId, bookingId, toast, totalTime) {
        if (totalTime >= 30000) {
            toast.hideLoading(toastId);
            toast.showToast("网络超时，请联系客服", 1000);
            $state.go('orderList');
        } else {
            appointmentService.GetBookingStatus({
                    bookingId: bookingId
                },
                function(res) {
                    if (res.Data == "NotPaid") {
                        $timeout(function() {
                            totalTime += 2000;
                            $scope.GetBookingStatus(toastId, bookingId, toast, totalTime);
                        }, 2000);
                    } else { //成功
                        toast.hideLoading(toastId);
                        window.history.back();
                    }
                });
        }
    }
}])

//详情上车地址
.controller('pickUpAddr', ['$scope', '$state', 'baseService', 'appointmentService', function($scope, $state, baseService, appointmentService) {}])
    //我的钱包
    .controller('myWallet', ['$scope', '$state', 'baseService', 'appointmentService', '$rootScope', 'toast', function($scope, $state, baseService, appointmentService, $rootScope, toast) {
        $scope.goRecharge = function() {
            $state.go('recharge');
        }
        $scope.goDetaile = function() {
            $state.go('walletDetaile', { id: $scope.walletInfo.ID });
        }
        $scope.getWalletInfo = function() {
            appointmentService.GetWalletInfo({}, function(res) {
                $scope.walletInfo = res.Data;
            });
        }
        $scope.withdrawals = function() {
            toast.showTips('该功能正在开发中，如有需要可以联系我们<a tel="028-86868686">028-86868686</a>');
        }
        $scope.getWalletInfo();
    }])
    //钱包充值
    .controller('recharge', ['$scope', '$state', 'baseService', 'appointmentService', 'toast', '$rootScope', function($scope, $state, baseService, appointmentService, toast, $rootScope) {

        var isWayPayBack = $bw.getSession('isWayPayBack');
        $bw.addSession({ name: 'isWayPayBack', info: 'false' });
        $scope.typeParams = { isCreateOrder: false, };
        if ($state.current.name === 'createOrder.recharge') {
            $scope.typeParams.isCreateOrder = true;
            $scope.rechargePrice = $scope.$parent.derivative;
            if ($scope.$parent.typeParams.isAllow == false) {
                window.location.href = ENV.url + "/#/createOrder";
                return;
            }
        } else {
            if (isWayPayBack === 'true') {
                window.location.reload();
                return;
            }
        }
        $scope.amountList = [
            { amount: 30, select: false },
            { amount: 50, select: false },
            { amount: 100, select: false },
            { amount: 120, select: false },
            { amount: 150, select: false },
            { amount: 200, select: false }
        ];
        $scope.rechargeNumChange = function() {
            reg = /^[0-9]+\.?[0-9]{0,2}$/;
            if ($scope.rechargeNum && !reg.test($scope.rechargeNum)) {
                //toast.showToast('请输入数字', 1500);
                $scope.rechargeNum = $scope.oldRechargeNum;
            }
        }
        $scope.rechargeKeyDown = function() {
            $scope.oldRechargeNum = $scope.rechargeNum;
        }
        $scope.setEmpty = function() {
            $scope.rechargeNum = '';
        }
        $scope.cancelSelect = function(obj) {
            obj.select = false;
        }
        $scope.selectAmount = function(app) {
            $scope.amountList.map($scope.cancelSelect);
            app.select = true;
            $scope.rechargeNum = app.amount.toFixed(2);
        }
        $scope.goRecharge = function() {
            if (!$scope.rechargeNum || $scope.rechargeNum <= 0) {
                toast.showToast('充值金额不能低于0', 1500);
                return false;
            }
            if ($scope.rechargeNum > 10000) {
                toast.showToast('充值金额不能高于10000', 1500);
                return false;
            }
            appointmentService.WalletRecharge({ payMethod: 'WeChat', amount: $scope.rechargeNum, payWay: 'Public' }, function(res) {
                var data = '';
                eval('data=' + res.Data);
                var wechatPayInfo = {
                    "appId": data.appId, //公众号名称，由商户传入     
                    "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数     
                    "nonceStr": data.nonceStr, //随机串     
                    "package": data.package,
                    "signType": "MD5", //微信签名方式
                    "paySign": data.paySign //微信签名 
                };
                if ($scope.typeParams.isCreateOrder) {
                    $bw.callpay(
                        function() {
                            toast.showToast("支付成功", 1000, function() {
                                $scope.$parent.addOrder(true);
                            });
                        },
                        function() {
                            toast.showToast("支付失败", 10000);
                        }, wechatPayInfo);
                } else {
                    wechatPayInfo = JSON.stringify(wechatPayInfo);

                    $bw.addSession({ name: 'wxpayInfo', info: wechatPayInfo });
                    $state.go('wxpay');
                    //window.location.href = ENV.url + '/#/wxpay?payInfo=' + wechatPayInfo;
                    return;
                }
            });
        }
    }])

//钱包明细
.controller('walletDetaile', ['$scope', '$state', '$stateParams', 'baseService', 'appointmentService', '$rootScope', function($scope, $state, $stateParams, baseService, appointmentService, $rootScope) {
    $scope.typeParams = { 'haveList': true, 'showNoMore': false };
    $scope.walletFlowList = [];
    $scope.typeName = {
        'Payment': { code: 4, name: '支付', type: '-' },
        'Refund': { code: 3, name: '退款', type: '+' },
        'Enchashment': { code: 2, name: '提现', type: '-' },
        'Recharge': { code: 1, name: '充值', type: '+' }
    }
    $scope.getWalletFlowList = function(page) {
        appointmentService.GetWalletFlowList({ "PageIndex": page, "PageSize": 10, 'WalletID': $stateParams.id }, function(reseponse) {
            $scope.TotalPageCount = reseponse.Data.TotalPageCount;
            if (reseponse.Status == 1 && reseponse.Data) {
                var Items = reseponse.Data.Items;
                for (var i in Items) {
                    $scope.walletFlowList.push(Items[i]);
                }
                $scope.setInfiniteParams();
            }
        });
    }
    $scope.setInfiniteParams = function() {
        if ($scope.TotalPageCount >= $scope.infinite.page) {
            $scope.infinite.busy = false;
            $scope.infinite.page += 1;
        } else {
            if ($scope.infinite.page == 1) {
                $scope.typeParams.haveList = false;
            } else {
                $scope.typeParams.showNoMore = true;
            }
        }
    }
    $scope.infinite = {
        page: 1,
        busy: false,
    };
    $scope.$on('$destroy', function() {
        window.onscroll = null
    });
    window.onscroll = function() {
        if ($scope.infinite.busy === true) return;
        if ($bw.getScrollTop() > 0 && ($bw.getScrollTop() + $bw.getWindowHeight() >= $bw.getScrollHeight() - 50)) {
            $scope.infinite.busy = true;
            $scope.getWalletFlowList($scope.infinite.page);
        }
    };
    $scope.getWalletFlowList($scope.infinite.page);
}])