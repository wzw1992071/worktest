angular.module('bw.controller')
    //详情
    .controller('orderDetail', ['$scope', '$rootScope', '$state', 'baseService', '$stateParams', 'appointmentService', 'toast', '$resource', 'setLightTime', function($scope, $rootScope, $state, baseService, $stateParams, appointmentService, toast, $resource, setLightTime) {
        var driving = null;
        var carMarker = false;
        var carMarkerInfoLabel = false;
        var carMarkerPoint;
        var ongoingTnterval;
        $scope.typeParams = {
            showInfoBox: true, //定义订单状态提示是否展示
            intervalTimer: 15000, //数据更新间隔
            carMoveTimer: 50, //车辆图片更新间隔
            showCancel: false,

        };
        $scope.pickupCode=""//机乘车验证码

        $scope.setDefault = function() {
            $scope.typeParams.showCode = false; //定义是否显示二维码
            $scope.typeParams.showDriver = false; //是否显示司机信息
            $scope.otherTips = '';
            $scope.orderTimeinfo = { ArriveTime: '0分钟' }
        }
        $scope.setDefault();

        //获取订单内容
        $scope.getOrderDetail = function(callback) {
            appointmentService.GetDetailNoLoading({ bookingId: $stateParams.id }, function(reseponse) {
                if (reseponse.Status == 1 && reseponse.Data) {
                    if (ongoingTnterval) clearInterval(ongoingTnterval);
                    driving.clearResults();
                    map.clearOverlays();
                    carMarker = false;
                    carMarkerInfoLabel = false;


                    $scope.orderDetail = reseponse.Data;
                    $scope.$broadcast('GetDetail', {});
                    if ($scope.orderDetail.TripType == '2') {
                        $scope.typeParams.stroke = 'songji';
                    } else {
                        $scope.typeParams.stroke = 'jieji';
                    }
                    var status = $scope.orderDetail.Status;
                    //如果订单已经被取消  返回到上一页
                    if (status === 'Cancel') {
                        toast.showTips('该订单已被取消', function() {
                            window.history.go(-1);
                            return false;
                        })
                        if (callback) callback();
                        return;
                    }
                    var ChildStatus = $scope.orderDetail.ChildStatus;
                    $scope.orderDetail.lookStatusName = $scope.dicts['BookState'][$scope.orderDetail.Status].ItemValue;
                    if ($scope.orderDetail.ServiceType == '1') {
                        //如果是拼车
                        $scope.setShowByStatusCarpooling(status);
                        $scope.typeParams.carType = 'carpooling';
                    } else {
                        $scope.setShowByStatusSpecial(status);
                        $scope.typeParams.carType = 'special';
                    }
                    if (status === 'InHand') {
                        $scope.isInit = true;
                        if ($scope.typeParams.carType == 'carpooling') {
                            //如果是拼车 先获取其他乘客
                            $scope.GetOtherPassengersStatus($scope.orderDetail.BookingID, function() {
                                $scope.getCarLocation();
                            })
                        } else {
                            $scope.getCarLocation();
                        }

                        //设置定时器获取车辆位置
                        ongoingTnterval = window.setInterval(function() {
                            $scope.getCarLocation();
                        }, $scope.typeParams.intervalTimer);

                        $scope.$on("$destroy", function() {
                            clearInterval(ongoingTnterval);
                        });
                    } else if (status === 'BookSuccess') {
                        if ((reseponse.Data.PickupTime - new Date(reseponse.Data.CurrentTime)) > 30 * 60 * 1000) {
                            var startPoint = new BMap.Point($scope.orderDetail.PickupLongitude, $scope.orderDetail.PickupLatitude);
                            var endPoint = new BMap.Point($scope.orderDetail.DestLongitude, $scope.orderDetail.DestLatitude);
                            driving.search(startPoint, endPoint);
                            driving.enableAutoViewport();
                        } else {
                            $scope.getCarLocation();
                            ongoingTnterval = window.setInterval(function() {
                                $scope.getCarLocation();
                            }, $scope.typeParams.intervalTimer);
                            $scope.$on("$dest$roy", function() {
                                clearInterval(ongoingTnterval);
                            });
                        }
                    } else {
                        var startPoint = new BMap.Point($scope.orderDetail.PickupLongitude, $scope.orderDetail.PickupLatitude);
                        var endPoint = new BMap.Point($scope.orderDetail.DestLongitude, $scope.orderDetail.DestLatitude);
                        driving.search(startPoint, endPoint);
                        driving.enableAutoViewport();
                    }
                    //验证订单是否可以取消
                    $scope.typeParams.cancelStatus = setCancelStatus($scope.orderDetail);
                }
                if (callback) callback();
            });
        };
        //取消订单
        $scope.cancelOrder = function() {
            var tips = "您确定要取消订单么？";
            if ($scope.orderDetail.Status === 'InHand') {
                if ($scope.orderDetail.ChildStatus === 'PickUp') {
                    tips = "司机已经在火速赶来了，是否仍要取消订单？";
                } else if ($scope.orderDetail.ChildStatus === 'Wait') {
                    tips = "司机已经在预约的上车点等您了，是否仍要取消订单？";
                }
            }
            toast.showConfirm({
                cancelWords: '暂不取消',
                sureWords: '确定取消',
                text: tips,
                sureFn: function() {
                    //$state.go('cancel', { id: $scope.orderDetail.BookingID });
                    window.location.href = window.ENV.publicUrl + "/cancelOrder.html?timeStr=" + new Date().getTime() + "&id=" + $scope.orderDetail.BookingID + "&cityId=" + $rootScope.selectedCity.CityId
                }
            })
        };
        //确认到达 拼车
        $scope.sureArrive = function() {
            appointmentService.ConfirmArrive({ BookingId: $scope.orderDetail.BookingID }, function(res) {
                if (res.Status == 1) {
                    //$state.go('evaluate', { id: $scope.orderDetail.BookingID });
                    window.location.href = window.ENV.publicUrl + "/evaluate.html?timeStr=" + new Date().getTime() + "&id=" + $scope.orderDetail.BookingID + "&cityId=" + $rootScope.selectedCity.CityId
                }
            });
        };
        //确认到达 专车
        $scope.privateCarConfirmArrive = function() {
                var getInfo = $resource(ENV.api + 'Booking/PrivateCarConfirmArrive?bookingId=' + $scope.orderDetail.BookingID, {});
                getInfo.save({}, function(res) {
                    if (res.Status == 1) {
                        //$state.go('evaluate', { id: $scope.orderDetail.BookingID });
                        window.location.href = window.ENV.publicUrl + "/evaluate.html?timeStr=" + new Date().getTime() + "&id=" + $scope.orderDetail.BookingID + "&cityId=" + $rootScope.selectedCity.CityId
                            /*if (res.Data <= 0) {
                                //不需要补差价，跳转到评价页面
                                $state.go('evaluate', { id: $scope.orderDetail.BookingID });
                            } else {
                                //需要补差价
                                $scope.typeParams.showPayDerivative = true;
                                $scope.typeParams.showInfoBox = false;
                            }*/
                    }
                });
            }
            //确认上车
        $scope.surePickup = function() {
            toast.showConfirm({
                text: '请确定您已乘坐指定车辆。',
                sureFn: function() {
                    appointmentService.ConfirmPickup({ BookingId: $scope.orderDetail.BookingID }, function(res) {
                        if (res.Status == 1) {
                            $scope.setDefault();
                            $scope.getOrderDetail();
                        }
                    });
                }
            });
        };

        //去评价
        $scope.goEvaluate = function() {
            //$state.go('evaluate', { id: $scope.orderDetail.BookingID });
            window.location.href = window.ENV.publicUrl + "/evaluate.html?timeStr=" + new Date().getTime() + "&id=" + $scope.orderDetail.BookingID + "&cityId=" + $rootScope.selectedCity.CityId
        };
        //查看上车地址 接机时
        $scope.showPickupAddress = function() {
            window.location.href = window.ENV.publicUrl + "/phonePickup.html?cityId=" + $rootScope.selectedCity.CityId;
        };
        //显示二维码
        $scope.showCode = function() {
            appointmentService.GetPickupCode({ bookingId: $stateParams.id }, function(reseponse) {
                $scope.pickupCode=reseponse.Data
                $scope.typeParams.showCode = true;
                $rootScope.showBlock = true;
            })
            
        };
        //隐藏二维码
        $scope.hideCode = function() {
            $scope.typeParams.showCode = false;
            $rootScope.showBlock = false;
        };
        //展开动画
        $scope.switchOngoing = function() {
            $scope.typeParams.showInfoBox = !$scope.typeParams.showInfoBox;
        };
        //专车补差价支付订单
        $scope.pay = function(payMethod, payWay) {
            if (!baseService.isWxBower()) {
                toast.showToast('请在微信中打开页面。', 1500);
                return;
            }
            var params = {
                bookingId: $scope.orderDetail.BookingID,
                payMethod: payMethod,
                payWay: payWay
            }
            appointmentService.PayBooking(params, function(reseponse) {
                if (reseponse.Status == 1) {
                    //如果是钱包支付，代表已支付成功
                    if (reseponse.Data === 'Paid') {
                        toast.showToast("支付成功", 1000, function() {
                            window.location.reload();
                        });
                        return;
                    }
                    //如果是付费订单 调起微信支付
                    var data = '';
                    eval('data=' + reseponse.Data);
                    $scope.wechatPayInfo = {
                        "appId": data.appId, //公众号名称，由商户传入     
                        "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数     
                        "nonceStr": data.nonceStr, //随机串     
                        "package": data.package,
                        "signType": "MD5", //微信签名方式：     
                        "paySign": data.paySign //微信签名 
                    };
                    $bw.callpay(
                        function() {
                            toast.showToast("支付成功", 1000, function() {
                                window.location.reload();
                            });
                        },
                        function() {
                            toast.showToast("支付失败", 10000);
                        }, $scope.wechatPayInfo);
                } else {
                    //toast.showToast("支付失败：" + reseponse.Message, 1000);

                }
            });
        }

        //状态变化
        $scope.$on('signalrInfo', function(e, data) {
            $scope.isInit = true;
            $scope.setDefault();
            $scope.getOrderDetail();
            $scope.hideCode();
        });
        //获取其他乘客的信息
        $scope.GetOtherPassengersStatus = function(id, callback) {
            appointmentService.GetOtherPassengersStatus({ bookingId: id }, function(res) {
                $scope.otherUser = res.Data;
                callback();
            });
        };
        /**
         * 根据车型
         * @Author duan     2017-07-26T16:20:17+0800
         * @param  {[type]} distance                 [description]
         * @return {[type]}                          [description]
         */
        $scope.getUserPrice = function(obj) {
                var distance = (obj.distance / 1000).toFixed(3); //获得公里数
                var startingPrice = $scope.orderDetail.PriceRule.StartingPrice;
                var milestones = $scope.orderDetail.PriceRule.MilePrice; //每公里
                var timePrice = $scope.orderDetail.PriceRule.TimePrice; //每分钟
                var longPrice = $scope.orderDetail.PriceRule.FarPrice; //每公里
                var longDistance = $scope.orderDetail.PriceRule.FarMile; //超过多少公里算长途费
                var lightPrice = $scope.orderDetail.PriceRule.NightPrice; //夜间费每公里
                var coefficient = $scope.orderDetail.PriceRule.EstimatedPriceOffset; //预估系数
                var timeDifference = ((obj.endTime - obj.startTime) / 1000 / 60).toFixed(0);

                var userPrice = 0;
                if (obj.isLight) {
                    userPrice += lightPrice * distance;
                } else {
                    var LongPriceSum = distance > longDistance ? (distance - longDistance) * longPrice : 0;
                    userPrice += distance * milestones + timeDifference * timePrice + startingPrice + LongPriceSum;
                }
                $scope.userPrice += coefficient * userPrice;
            }
            //获取一段时间的里程
        $scope.getCarDistance = function(startTime, endTime, isLight) {
            var startTimeStr = startTime + '';
            var endTimeStr = endTime + '';
            var params = {
                ak: ENV.baiduMap.ak,
                service_id: ENV.baiduMap.service_id,
                entity_name: $scope.orderDetail.DriverCode,
                start_time: startTimeStr.substring(0, startTimeStr.length - 3),
                end_time: endTimeStr.substring(0, endTimeStr.length - 3),
                is_processed: 1,
                supplement_mode: 'driving'
            };
            $.ajax({
                type: "get",
                async: false,
                data: params,
                url: "https://yingyan.baidu.com/api/v3/track/getdistance",
                dataType: "jsonp",
                jsonp: "callback",
                success: function(json) {
                    if (json.status == 0) {
                        $scope.getUserPrice({ startTime: startTime, endTime: endTime, distance: json.distance, isLight: isLight })
                        return;
                    }
                },
                error: function() {}
            })
        };
        //获取司机位置 并绘制路径
        $scope.getCarLocation = function(callback) {
            $scope.userPrice = $scope.orderDetail.EstimatedActualPrice;
            /*if ($scope.typeParams.carType === 'special' && $scope.orderDetail.Status === 'InHand' && $scope.orderDetail.ChildStatus === 'Aboard') {
                //如果是专车 需要计算价格
                //定义当前价格为0
                $scope.userPrice = 0;
                var startTime = $scope.orderDetail.ActualPickupTime;
                var endTime = new Date().getTime();
                $scope.getCarDistance(startTime, endTime, false);

                //获取夜间距离和计费
                var lightTimeArr = setLightTime.getLightInfo(startTime, endTime, $scope.orderDetail.PriceRule);
                for (var i in lightTimeArr) {
                    $scope.getCarDistance(lightTimeArr[i].startTime, lightTimeArr[i].endTime, true);
                }
            }*/

            var params = {
                ak: ENV.baiduMap.ak,
                service_id: ENV.baiduMap.service_id,
                entity_name: $scope.orderDetail.DriverCode
            };
            $.ajax({
                type: "get",
                async: false,
                data: params,
                url: "https://yingyan.baidu.com/api/v3/track/getlatestpoint",
                dataType: "jsonp",
                jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
                //jsonpCallback:"flightHandler",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
                success: function(json) {
                    if (json.status == 0) {
                        var pt = new BMap.Point(json.latest_point.longitude, json.latest_point.latitude);

                        if (!carMarker) {
                            carMarker = new BMap.Marker(pt, { icon: carIcon }); // 创建标注
                            map.addOverlay(carMarker);
                            map.centerAndZoom(pt, 16);
                        }
                        driving.disableAutoViewport();
                        if ($scope.typeParams.carType == 'carpooling') {
                            //如果是拼车
                            $scope.createMapCarpooling(json);
                        } else {
                            $scope.createMapSpecial(json);
                        }
                    }
                },
                error: function() {}
            });
        };
        $scope.createMapSpecial = function(json) {
            var pt = new BMap.Point(json.latest_point.longitude, json.latest_point.latitude);
            if (!carMarkerInfoLabel) {
                carMarkerInfoLabel = new BMap.Label('', { position: pt, offset: new BMap.Size(-90, -65) });
                carMarkerInfoLabel.setStyle({ border: 'none', background: 'none' });
            }
            if ($scope.orderDetail.Status == "BookSuccess") {
                if (($scope.orderDetail.PickupTime - new Date($scope.orderDetail.CurrentTime)) < 30 * 60 * 1000) {
                    console.log($scope.typeParams)
                    // var endPoint = ($scope.typeParams.stroke === 'jieji') ? new BMap.Point($scope.orderDetail.DestLongitude, $scope.orderDetail.DestLatitude) : new BMap.Point($scope.orderDetail.PickupLongitude, $scope.orderDetail.PickupLatitude);
                    var endPoint = new BMap.Point($scope.orderDetail.PickupLongitude, $scope.orderDetail.PickupLatitude);
                    $scope.prvePoint = $scope.prvePoint ? $scope.prvePoint : pt;
                    driving.clearResults();
                    driving.search($scope.prvePoint, endPoint);
                    $scope.prvePoint = pt;
                }
            }
            switch ($scope.orderDetail.ChildStatus) {
                case 'PickUp': //司机已出发
                    var endPoint = new BMap.Point($scope.orderDetail.PickupLongitude, $scope.orderDetail.PickupLatitude);
                    $scope.prvePoint = $scope.prvePoint ? $scope.prvePoint : pt;
                    driving.clearResults();
                    driving.search($scope.prvePoint, endPoint);
                    $scope.prvePoint = pt;

                    break;
                case 'Wait': //司机已到达
                    //司机已到达 显示司机的位置和乘客的位置
                    var ePoint = new BMap.Point($scope.orderDetail.PickupLongitude, $scope.orderDetail.PickupLatitude);
                    var mineMarker = new BMap.Marker(ePoint, { icon: mineIcon }); // 创建标注
                    map.addOverlay(mineMarker);
                    break;
                case 'Aboard': //已上车
                    var endPoint = new BMap.Point($scope.orderDetail.DestLongitude, $scope.orderDetail.DestLatitude);
                    $scope.prvePoint = $scope.prvePoint ? $scope.prvePoint : pt;
                    driving.clearResults();
                    driving.search($scope.prvePoint, endPoint);
                    $scope.prvePoint = pt;
                    break;

                default:
                    break;
            }
            map.addOverlay(carMarkerInfoLabel);
            if (carMarkerPoint) {
                var bwMapDriverObj = new bwMapDriver({ intervalTimer: $scope.typeParams.intervalTimer, carMoveTimer: $scope.typeParams.carMoveTimer, map: map });
                bwMapDriverObj.Move(carMarkerPoint, pt, carMarker, 'carmarker', true);
                bwMapDriverObj.Move(carMarkerPoint, pt, carMarkerInfoLabel, 'carlabel');
            }
            carMarkerPoint = pt;

        }

        /**
         * 拼车规划地图
         * @Author duan     2017-07-31T15:00:35+0800
         * @param  {[type]} json                     [description]
         * @return {[type]}                          [description]
         */
        $scope.createMapCarpooling = function(json) {
            //初始化地图路径规划，只初始化一次，后续状态变化再次初始化
            var nowLong = json.latest_point.longitude,
                nowLat = json.latest_point.latitude;
            var pt = new BMap.Point(nowLong, nowLat);
            if (carMarkerPoint) {
                var bwMapDriverObj = new bwMapDriver({ intervalTimer: $scope.typeParams.intervalTimer, carMoveTimer: $scope.typeParams.carMoveTimer, map: map });
                bwMapDriverObj.Move(carMarkerPoint, pt, carMarker, 'carmarker', true);
            }
            carMarkerPoint = pt;

            if ($scope.isInit) {
                $scope.isInit = false;
                var minPoint, distance = null;
                var thisPoint = {
                    PickupLatitude: $scope.orderDetail.PickupLatitude,
                    PickupLongitude: $scope.orderDetail.PickupLongitude,
                    DestLatitude: $scope.orderDetail.DestLatitude,
                    DestLongitude: $scope.orderDetail.DestLongitude,
                    Status: $scope.orderDetail.Status,
                    ChildStatus: $scope.orderDetail.ChildStatus,
                    PickupTime: $scope.orderDetail.PickupTime,
                    bookingId: $scope.orderDetail.BookingID,
                }
                var userArr = $scope.otherUser;
                userArr.push(thisPoint);

                //如果是接机
                if ($scope.typeParams.stroke === 'jieji') {
                    for (var i in userArr) {
                        if (userArr[i].Status != 'Arrived') {
                            var p = userArr[i];
                            p.DestLatitude = isNaN(p.DestLatitude) ? 0 : p.DestLatitude;
                            p.DestLongitude = isNaN(p.DestLongitude) ? 0 : p.DestLongitude;
                            var thisDistance = (p.DestLongitude - nowLong) * (p.DestLongitude - nowLong) + (p.DestLatitude - nowLat) * (p.DestLatitude - nowLat)
                            if (distance === null || distance > thisDistance) {
                                distance = thisDistance;
                                minPoint = p;
                            }
                            var point = new BMap.Point(p.DestLongitude, p.DestLatitude);
                            var marker;
                            if (p.bookingId == $scope.orderDetail.BookingID) {
                                marker = new BMap.Marker(point, { icon: mineIcon }); // 创建标注  
                            } else {
                                marker = new BMap.Marker(point, { icon: Icon }); // 创建标注  
                            }
                            map.addOverlay(marker);
                        }
                    }
                    var firstUserPoint = new BMap.Point(minPoint.DestLongitude, minPoint.DestLatitude);
                    driving.search(pt, firstUserPoint);

                } else {
                    //如果是送机
                    var waitingArr = [];
                    var aboardArr = [];
                    var endPoint = new BMap.Point($scope.orderDetail.DestLongitude, $scope.orderDetail.DestLatitude);
                    var pickUpPoint = null;
                    var pickUpUser;
                    var upCar = [];
                    var len = userArr.length;
                    //根据状态分组
                    for (var i in userArr) {
                        if (userArr[i].ChildStatus === 'PickUp') {
                            pickUpUser = userArr[i];
                        } else if (userArr[i].ChildStatus === 'Aboard') {
                            aboardArr.push(userArr[i]);
                        } else if (userArr[i].ChildStatus === 'ToSend') {
                            waitingArr.push(userArr[i]);
                        } else {
                            waitingArr.push(userArr[i]);
                        }
                    }
                    //对待接的人进行排序 按时间
                    for (var j in waitingArr) {
                        if (j < waitingArr.length - 1) {
                            var n = parseInt(j) + 1;
                            if (waitingArr[j].PickupTime > waitingArr[n].PickupTime) {
                                var k = waitingArr[j];
                                waitingArr[j] = waitingArr[n];
                                waitingArr[n] = k;
                            }
                        }
                    }
                    //对已接的人进行排序 按时间
                    /*for (var j in aboardArr) {
                        if (j < aboardArr.length - 1) {
                            var n = parseInt(j) + 1;
                            if (aboardArr[j].PickupTime > aboardArr[n].PickupTime) {
                                var k = aboardArr[j];
                                aboardArr[j] = aboardArr[n];
                                aboardArr[n] = k;
                            }
                        }
                    }*/

                    //获取待接坐标
                    var pointArr = [];
                    //放入已接的乘客
                    //已接的乘客不再绘出
                    /*for (var k in aboardArr) {
                        pointArr.push(new BMap.Point(aboardArr[k].PickupLongitude, aboardArr[k].PickupLatitude));
                        if (aboardArr[k].bookingId == $scope.orderDetail.BookingID) {
                            $scope.thisUserIndex = pointArr.length - 1;
                        }
                    }*/
                    //正接的乘客
                    if (pickUpUser) {
                        pointArr.push(new BMap.Point(pickUpUser.PickupLongitude, pickUpUser.PickupLatitude));
                        if (pickUpUser.bookingId == $scope.orderDetail.BookingID) {
                            $scope.thisUserIndex = pointArr.length - 1;
                        }
                    }
                    //放入待接的乘客
                    for (var k in waitingArr) {
                        pointArr.push(new BMap.Point(waitingArr[k].PickupLongitude, waitingArr[k].PickupLatitude));
                        if (waitingArr[k].bookingId == $scope.orderDetail.BookingID) {
                            $scope.thisUserIndex = pointArr.length - 1;
                        }
                    }

                    driving.clearResults();
                    driving.search(pt, endPoint, { waypoints: pointArr });
                    $scope.$apply();
                }
            }
        }

        $scope.onMarkersSetCarpooling = function(routes) {
            if ($scope.orderDetail.Status !== 'InHand') return;
            var len = routes.length;
            if ($scope.typeParams.stroke === 'songji') {
                var markerProto;
                for (var i = 0; i < len; i++) {
                    if (i === 0) markerProto = routes[i].marker.__proto__;
                    if (i === 0 || i === len - 1) continue;
                    if (i - 1 == $scope.thisUserIndex) {
                        for (var k in routes[i]) {
                            if (routes[i][k].__proto__ === markerProto) routes[i][k].setIcon(mineIcon);
                        }
                    } else {
                        for (var k in routes[i]) {
                            if (routes[i][k].__proto__ === markerProto) routes[i][k].setIcon(Icon);
                        }
                    }
                }
            }
        }
        $scope.onMarkersSetSpecial = function(routes) {}
        $scope.buildMap = function() {
            map.enableScrollWheelZoom();
            map.centerAndZoom(new BMap.Point($rootScope.userLocation.longitude || 104.072366, $rootScope.userLocation.latitude || 30.662304), 16);

            driving = new BMap.DrivingRoute(map, {
                renderOptions: { map: map, autoViewport: false, panel: false, highlightMode: BMAP_HIGHLIGHT_ROUTE },
                onMarkersSet: function(routes) {
                    var len = routes.length;
                    if ($scope.typeParams.carType == 'carpooling') {
                        $scope.onMarkersSetCarpooling(routes);
                    } else {
                        //如果是专车
                        $scope.onMarkersSetSpecial(routes);
                    }
                    var labelStyle = {
                            "background-color": "transparent",
                            "border": "none",
                            "color": "#2B2B2B",
                            "font-weight": "bold",
                            "white-space": "inherit",
                            "width": "2rem",
                            "font-size": "0.28rem",
                            "text-shadow": "0 1px #fff, 1px 0 #fff, -1px 0 #fff, 0 -1px #fff"
                        }
                        //替换起点

                    var sPoint = new BMap.Point($scope.orderDetail.PickupLongitude, $scope.orderDetail.PickupLatitude); //routes[0].marker.getPosition();
                    map.removeOverlay(routes[0].marker);
                    if ($scope.typeParams.carType == 'special' && ($scope.orderDetail.PickupTime - new Date($scope.orderDetail.CurrentTime)) < 30 * 60 * 1000 && $scope.orderDetail.Status == 'BookSuccess') {} else {
                        if (($scope.typeParams.carType == 'carpooling' && $scope.typeParams.stroke === 'jieji') || $scope.orderDetail.Status !== 'InHand') {
                            var opts = {
                                position: sPoint, // 指定文本标注所在的地理位置
                                offset: new BMap.Size(0, 0) //设置文本偏移量
                            }
                            var label = new BMap.Label($scope.orderDetail.PickupAddress, opts); // 创建文本标注对象
                            label.setStyle(labelStyle);
                            map.addOverlay(label);
                            var sMarker = new BMap.Marker(sPoint, { icon: startIcon, offset: new BMap.Size(0, -20) }); // 创建标注
                            map.addOverlay(sMarker);
                        }
                    }

                    //替换终点
                    var ePoint = routes[len - 1].marker.getPosition();
                    map.removeOverlay(routes[len - 1].marker);
                    if ($scope.orderDetail.ChildStatus === 'PickUp' && $scope.typeParams.carType == 'special') {
                        var opts = {
                            position: ePoint, // 指定文本标注所在的地理位置
                            offset: new BMap.Size(0, 0) //设置文本偏移量
                        }
                        var label = new BMap.Label($scope.orderDetail.PickupAddress, opts); // 创建文本标注对象
                        label.setStyle(labelStyle);
                        map.addOverlay(label);
                        var mineMarker = new BMap.Marker(ePoint, { icon: mineIcon }); // 创建标注
                        map.addOverlay(mineMarker);
                    } else if($scope.typeParams.carType == 'special' && ($scope.orderDetail.PickupTime - new Date($scope.orderDetail.CurrentTime)) < 30 * 60 * 1000 && $scope.orderDetail.Status == 'BookSuccess' && $scope.typeParams.stroke === 'jieji'){       
                        var ePoint2 = new BMap.Point($scope.orderDetail.PickupLongitude, $scope.orderDetail.PickupLatitude)
                        console.log(ePoint2)
                        var opts = {
                            position: ePoint2, // 指定文本标注所在的地理位置
                            offset: new BMap.Size(0, 0) //设置文本偏移量
                        }
                        var label = new BMap.Label($scope.orderDetail.PickupAddress, opts); // 创建文本标注对象
                        label.setStyle(labelStyle);
                        map.addOverlay(label);
                        var mineMarker = new BMap.Marker(ePoint2, { icon: mineIcon }); // 创建标注
                        map.addOverlay(mineMarker);
                    }else if ($scope.typeParams.carType == 'special' && ($scope.orderDetail.PickupTime - new Date($scope.orderDetail.CurrentTime)) < 30 * 60 * 1000 && $scope.orderDetail.Status == 'BookSuccess') {
                        var opts = {
                            position: ePoint, // 指定文本标注所在的地理位置
                            offset: new BMap.Size(0, 0) //设置文本偏移量
                        }
                        var label = new BMap.Label($scope.orderDetail.PickupAddress, opts); // 创建文本标注对象
                        label.setStyle(labelStyle);
                        map.addOverlay(label);
                        var mineMarker = new BMap.Marker(ePoint, { icon: mineIcon }); // 创建标注
                        map.addOverlay(mineMarker);
                    } else if ($scope.typeParams.stroke === 'songji' || $scope.typeParams.carType == 'special' || $scope.orderDetail.Status !== 'InHand') {
                        var opts = {
                            position: ePoint, // 指定文本标注所在的地理位置
                            offset: new BMap.Size(0, 0) //设置文本偏移量
                        }
                        var label = new BMap.Label($scope.orderDetail.DestAddress, opts); // 创建文本标注对象
                        label.setStyle(labelStyle);
                        map.addOverlay(label);
                        var eMarker = new BMap.Marker(ePoint, { icon: endIcon, offset: new BMap.Size(0, -20) }); // 创建标注
                        map.addOverlay(eMarker);
                    }
                },

            });
            driving.setPolylinesSetCallback(function(lines) {
                var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                    scale: 0.6, //图标缩放大小
                    strokeColor: '#fff', //设置矢量图标的线填充颜色
                    strokeWeight: '2', //设置线宽
                });
                var icons = new BMap.IconSequence(sy, '10', '30');

                var len = lines.length;
                for (var i = 0; i < len; i++) {
                    var polyline = lines[i].getPolyline()
                    polyline.setStrokeOpacity('0.7');

                }
                angular.element(document.getElementById('ArriveTime')).html($scope.orderTimeinfo.ArriveTime);
                $scope.$apply();
            });
            driving.setSearchCompleteCallback(function(results) {
                if (driving.getStatus() != BMAP_STATUS_SUCCESS) return;
                var plan = results.getPlan(0);
                var selTime = plan.getDuration(true); //获取时间
                var lev = plan.getDistance(true); //获取距离
                $scope.orderTimeinfo.ArriveTime = selTime;
                if (!carMarkerInfoLabel) return;
                if ($scope.orderDetail.ChildStatus === 'PickUp' || ($scope.typeParams.carType == 'special' && ($scope.orderDetail.PickupTime - new Date($scope.orderDetail.CurrentTime)) < 30 * 60 * 1000)) {
                    carMarkerInfoLabel.setContent('<div class="map-label-pickup">距您约<span class="c-red">' + lev + '，' + selTime + '</span></div>');
                } else if ($scope.orderDetail.ChildStatus === 'Aboard') {
                    carMarkerInfoLabel.setContent('<div class="map-label-aboard"><div class="aboard-info"><div>距终点约<span class="c-red">' + lev + '</span></div><div>预计行驶<span class="c-red">' + selTime + '</span></div></div><div class="aboard-price"><div>一口价<div><div class="c-red">' + $scope.userPrice.toFixed(2) + '元 <div></div></div>');
                }
            });
        };
        /**
         * 跳转到价格详情界面
         * @Author duan     2017-08-01T10:38:53+0800
         * @return {[type]} [description]
         */
        $scope.showPriceDetail = function() {
                $state.go('orderDetail.priceDetailed');
            }
            /**
             * 跳转到差价详情界面
             * @Author duan     2017-08-08T09:48:20+0800
             * @return {[type]} [description]
             */
        $scope.showDerivative = function() {
                $state.go('orderDetail.priceDetailed');
            }
            /**
             * 获取钱包信息
             * @Author duan     2017-07-31T17:46:21+0800
             * @return {[type]} [description]
             */
        $scope.getWalletInfo = function(callback) {
            appointmentService.GetWalletInfo({}, function(res) {
                callback(res);
            });
        }
        $scope.refresh = function() {
                location.reload();
            }
            /**
             * 进行中时根据不同子状态显示不同界面 拼车子状态
             * @Author duan 2017-07-24T14:08:06+0800
             */
        $scope.setShowByChildStatus = function() {
            if ($scope.typeParams.stroke === 'songji') {
                switch ($scope.orderDetail.ChildStatus) {
                    case 'ToSend': //待接送
                        $scope.orderDetail.lookStatusName = '司机正在接同行乘客';
                        $scope.otherTips = '<div>司机预计' + baseService.formateToTime($scope.orderDetail.PickupTime, ':') + '到达</div>';
                        break;
                    case 'Completed': //已完成
                        $scope.typeParams.showSwitch = false;
                        $scope.orderDetail.lookStatusName = '已完成';
                        break;
                    case 'Arrived': //已到达
                        $scope.orderDetail.lookStatusName = '行程已结束';
                        break;
                    case 'Aboard': //已上车
                        $scope.orderDetail.lookStatusName = '您已上车';
                        $scope.otherTips = '<div>预计<span id="ArriveTime">' + $scope.orderTimeinfo.ArriveTime + '</span>到达机场</div>';
                        break;
                    case 'Cancel': //已取消
                        break;
                    case 'PickUp': //正在接送
                        $scope.orderDetail.lookStatusName = '司机正在接您的途中';
                        $scope.otherTips = '<div>司机预计' + baseService.formateToTime($scope.orderDetail.PickupTime, ':') + '到达</div>';
                        break;
                    default:
                        break;
                }
            } else {
                switch ($scope.orderDetail.ChildStatus) {
                    case 'Arrived': //接机行程结束
                        $scope.orderDetail.lookStatusName = '行程已结束';
                        break;
                    case 'Completed': //已完成
                        $scope.typeParams.showSwitch = false;
                        $scope.orderDetail.lookStatusName = '已完成';
                        break;
                    default:

                        $scope.typeParams.showSwitch = false;
                        $scope.orderDetail.lookStatusName = '司机已发车';
                        /*$scope.otherTips = '<div>预计<span id="ArriveTime"></span>到达下一位乘客下车处</div>';*/
                        break;
                }
            }
        };
        $scope.formateNew = function(source, char) {
                var buling = function(no) {
                    return no < 10 ? "0" + no : no;
                }
                var _t = new Date(source);
                return _t.getFullYear() + '年' + buling(_t.getMonth() + 1) + '月' + buling(_t.getDate()) + '日 ' + buling(_t.getHours()) + ':' + buling(_t.getMinutes());
            }
            /**
             * 根据不同状态展示不同界面 拼车
             * @Author duan     2017-07-24T14:08:33+0800
             * @param  {[type]} status                   [description]
             */
        $scope.setShowByStatusCarpooling = function(status) {
            $scope.typeParams.showSwitch = true;
            // BookState Aboard 已上车
            // BookState Arrived 已到达
            // BookState BookSuccess 派单成功
            // BookState Cancel 已取消
            // BookState Completed 已完成
            // BookState Confirmed 派单中
            // BookState InHand 进行中
            // BookState Registered 预约成功
            switch (status) {
                case 'InHand': //进行中
                    $scope.typeParams.showDriver = true;
                    $scope.setShowByChildStatus();
                    break;
                case 'Completed': //进行中
                    $scope.typeParams.showDriver = true;
                    $scope.typeParams.showSwitch = false;
                    break;
                case 'NotPaid': //待支付
                    window.location.href = ENV.url + '/#/payOrder?id=' + data.BID;
                    break;
                case 'Invalidation': //失效
                    window.location.href = ENV.url + '/#/payOrder?id=' + data.BID;
                    break;
                case 'Cancel': //已取消
                    break;
                case 'Registered': //预约成功
                    var nowTime = new Date().getTime();
                    if ($scope.typeParams.stroke === 'songji') {
                        //$scope.registeredTop = '<div class="registered-time"><span class="iconfont">&#xe670;</span>上车时间:' + $scope.formateNew($scope.orderDetail.PickupTime, '/') + '</div>';

                        var timeStr = '<div class="registered-time"><span class="iconfont">&#xe670;</span>上车时间:' + $scope.formateNew($scope.orderDetail.PickupTime, '/') + '</div>';
                        if ($scope.orderDetail.IsMorning) {
                            $scope.otherTips = timeStr + '<div>在您出行前一天<span class="c-red">23:00后</span>为您发送司机信息</div>';
                        } else {
                            $scope.otherTips = timeStr + '<div>在您乘车<span class="c-red">前2小时</span>为您发送司机信息</div>';
                        }
                    } else {
                        $scope.otherTips = '<div>无需担心航班延误或提前到达</div>';
                    }
                    break;
                case 'BookSuccess':
                    $scope.typeParams.showDriver = true;
                    if ($scope.typeParams.stroke === 'songji') {
                        $scope.orderDetail.lookStatusName = '等待接驾';
                        $scope.otherTips = '<div class="c-red"><img class="other-tips-img" src="./imgs/clock.png">上车时间:' + $scope.formateNew($scope.orderDetail.PickupTime, '/') + '</div><div>请提前5分钟到达约定地点，做好上车准备</div>';
                    } else {
                        if ($scope.orderDetail.ChildStatus === 'Aboard') {
                            $scope.orderDetail.lookStatusName = '已上车';
                            $scope.otherTips = '<div>等待司机发车</div>';
                        } else {
                            $scope.orderDetail.lookStatusName = '等待上车';
                            $scope.otherTips = '<div>请确认您已上车，确认上车后司机才可发车</div>';
                        }
                    }
                    break;
                case 'Arrived': //已到达
                    $scope.typeParams.showDriver = true;
                    $scope.orderDetail.lookStatusName = "行程结束";
                    break;
                default:
                    $scope.typeParams.showDriver = true;
                    //$state.go("orderDetail", { id: data.BID });
                    break;
            }
        };
        /**
         * 根据不同状态展示不同界面 专车
         * @Author duan 2017-07-24T15:02:06+0800
         */
        $scope.setShowByStatusSpecial = function(status) {
            $scope.typeParams.showSwitch = true;
            switch (status) {
                case 'InHand': //进行中
                    $scope.typeParams.showDriver = true;
                    $scope.orderDetail.lookStatusName = "行程已开始";
                    switch ($scope.orderDetail.ChildStatus) {
                        case 'PickUp': //司机已出发
                            $scope.typeParams.showSwitch = false;
                            $scope.orderDetail.lookStatusName = '司机正在接您的途中';
                            break;
                        case 'Wait': //司机已到达
                            $scope.orderDetail.lookStatusName = '司机已到达';
                            $scope.otherTips = '<div>司机<span class="c-red">已到达</span>约定地点，请您尽快上车</div>';
                            break;
                        case 'Aboard': //已上车
                            $scope.typeParams.showSwitch = false;
                            break;
                        default:
                            break;
                    }
                    break;
                case 'Registered': //预约成功
                    //$scope.orderDetail.lookStatusName = $scope.dicts[$scope.orderDetail.Status].ItemValue;
                    var pickupTime = parseInt($scope.orderDetail.PickupTime);
                    var nowTime = new Date().getTime();
                    $scope.registeredTop = '<div class="registered-time"><span class="iconfont">&#xe670;</span>上车时间：' + $scope.formateNew(pickupTime, '/') + '</div>';

                    /*//乘车前35分钟更改提示
                    if ($scope.orderDetail.PickupTime - nowTime > 2100000) {
                        $scope.otherTips ='<div>在您<span class="c-red">乘车前30分钟</span>为您发送司机的信息</div>';
                    } else {
                        $scope.otherTips ='<div>我们会尽快为您发送司机的信息</div>';
                    }*/
                    console.log($scope.orderDetail.AppointDriverCarLicense)
                    if ($scope.orderDetail.AppointDriverCarLicense) {
                        console.log(1)
                        $scope.otherTips = '<div>等待司机<span class="c-red">' + $scope.orderDetail.AppointDriverCarLicense + '</span>接单</div>'
                    } else {
                        console.log(2)
                        $scope.otherTips = '<div>等待司机接单</div>'
                    }
                    break;
                case 'BookSuccess':
                    $scope.typeParams.showDriver = true;

                    $scope.orderDetail.lookStatusName = '等待接驾';
                    $scope.otherTips = '<div class="c-red"><img class="other-tips-img" src="./imgs/clock.png">您的上车时间为' + $scope.formateNew($scope.orderDetail.PickupTime, '/') + '</div>';
                    break;
                case 'Arrived':
                    $scope.typeParams.showDriver = true;

                    $scope.typeParams.showSwitch = false;
                    $scope.orderDetail.lookStatusName = '行程结束';
                    if ($scope.orderDetail.ChildStatus === 'NotPaid') {
                        //显示全部未支付页面
                        //获取钱包剩余金额 判断是否支付差价
                        if ($scope.orderDetail.Wallet.CurrentBookEnableBalance < $scope.orderDetail.ActualPrice) {
                            //如果需要支付差价 
                            $scope.typeParams.differencePrice = true;
                            $scope.walletDeductible = $scope.orderDetail.Wallet.CurrentBookEnableBalance;
                        } else {
                            $scope.typeParams.differencePrice = false;
                            $scope.walletDeductible = $scope.orderDetail.ActualPrice;
                        }
                    } else if ($scope.orderDetail.ChildStatus === 'PartPaid') {
                        //显示部分支付页面
                        $scope.typeParams.showPayDerivative = true;
                        $scope.typeParams.showInfoBox = false;
                    }

                    break;
                default:
                    $scope.typeParams.showDriver = true;

                    $scope.typeParams.showSwitch = false;
                    //$scope.orderDetail.lookStatusName = $scope.dicts[$scope.orderDetail.Status].ItemValue;
                    break;
            }
        };

        var map, mineIcon, Icon, carIcon, startIcon, endIcon;
        var loading = toast.showLoading();
        map = new BMap.Map("map");
        map.setMapStyle({
            styleJson: [{
                    "featureType": "manmade",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#eaeff5ff"
                    }
                },
                {
                    "featureType": "poilabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#b4ababff"
                    }
                },
                {
                    "featureType": "education",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#eaeff5ff"
                    }
                },
                {
                    "featureType": "medical",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#f0f4f3ff"
                    }
                },
                {
                    "featureType": "building",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#f5f8ffff"
                    }
                },
                {
                    "featureType": "scenicspots",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#daeee8ff"
                    }
                },
                {
                    "featureType": "land",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#edf0f7ff"
                    }
                },
                {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#ede8e3ff"
                    }
                },
                {
                    "featureType": "city",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#444444ff"
                    }
                },
                {
                    "featureType": "subway",
                    "elementType": "geometry",
                    "stylers": {
                        "weight": "0.1",
                        "lightness": 52
                    }
                },
                {
                    "featureType": "educationlabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "medicallabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "district",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "scenicspotslabel",
                    "elementType": "all",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "green",
                    "elementType": "all",
                    "stylers": {
                        "color": "#daeee8ff"
                    }
                },
                {
                    "featureType": "manmade",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "subwaystation",
                    "elementType": "all",
                    "stylers": {
                        "color": "#6fa8dcff"
                    }
                },
                {
                    "featureType": "highway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "town",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "arterial",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#999999ff"
                    }
                }
            ]
        });
        mineIcon = new BMap.Icon("./imgs/header-mine.png", new BMap.Size(36, 40), { imageSize: new BMap.Size(20, 25), imageOffset: new BMap.Size(6, 15) });
        Icon = new BMap.Icon("./imgs/header.png", new BMap.Size(36, 40), { imageSize: new BMap.Size(20, 20), imageOffset: new BMap.Size(6, 20) }); //, {anchor: new BMap.Size(6, 6) }
        carIcon = new BMap.Icon("./imgs/mapCar.png", new BMap.Size(36, 18), { imageSize: new BMap.Size(36, 18) });

        startIcon = new BMap.Icon("./imgs/map-start.png", new BMap.Size(26, 40), { imageSize: new BMap.Size(26, 40) });
        endIcon = new BMap.Icon("./imgs/map-end.png", new BMap.Size(26, 40), { imageSize: new BMap.Size(26, 40) });

        $scope.buildMap();

        $rootScope.GetDicts(function() {
            $scope.getOrderDetail(function() {
                toast.hideLoading(loading);
            });
        });



        //如果websokit没有启用 开启websokit;
        if ($bw.websolitStart === false) {
            $bw.loadJS('bower_components/signalR/signalr_core.js', function() {
                $bw.websokitFn($scope.$parent);
            })
        }

        $(document).on('touchstart', '.refresh-img', function() {
            $scope.typeParams.refreshClick = true;
            $scope.$apply();
        });
        $(document).on('touchend', '.refresh-img', function() {
            $scope.refresh();
        });
    }])