angular.module('bw.controller')
    .controller('createOrder', ['$timeout', 'toast', '$rootScope', '$scope', '$cookieStore', '$state', 'baseService', '$stateParams', 'appointmentService', function($timeout, toast, $rootScope, $scope, $cookieStore, $state, baseService, $stateParams, appointmentService) {
        $scope.verifyMsg = { sureValidNum: 0 };
        $rootScope.routerHide = true;
        $scope.typeParams = {
            isAllow: false,
            showCheckTips: false,
            showCarTypeTips: false
        };
        $scope.serviceTripType = {
            special: {
                songji: '输入航班号',
                jieji: '输入航班号'
            },
            carpooling: {
                songji: '输入航班号',
                jieji: '输入航班号'
            }
        };

        $scope.nowTime ="&t="+ new Date().getTime();
        $scope.selectedInteriorCity = ""; //选择地址的值不保存
        $scope.showSelectAddress = true;
        $scope.carTypeImgUrl = ENV.sorket;
        $scope.checkPassengers = [];
        $scope.chengduAirPort = []; //航站楼
        $scope.appointmentInfo = {};
        $scope.appointmentInfo.TripType = 1; //接机为1，送机为2
        $scope.appointmentInfo.PickupAddress = '';
        $scope.appointmentInfo.PickupDetailAddress = '';
        $scope.appointmentInfo.PickupLongitude = '';
        $scope.appointmentInfo.PickupLatitude = '';
        $scope.appointmentInfo.DestAddress = '';
        $scope.appointmentInfo.DestLongitude = '';
        $scope.appointmentInfo.DestLatitude = '';
        $scope.carTypeList = []; //专车类型
        $scope.eventPlan = []; //活动列表
        $scope.eventSwiper = null;
        $scope.isgetActivitySp = true; //活动专车,只请求一次
        $scope.isgetActivityCp = true; //活动拼车,只请求一次
        $scope.isgetRecentBook = true; //最近单子,只请求一次
        $scope.activitsCp = []; //拼车公告
        $scope.activitsSp = []; //专车公告
        $scope.isgetActivitySpSession = $bw.getSession('isgetActivitySp');
        $scope.isgetActivityCpSession = $bw.getSession('isgetActivityCp');
        $scope.isgetRecentBookSession = $bw.getSession('isgetRecentBook');

        $scope.stepOneClick = function() {
            if ($scope.typeParams.stroke === 'jieji') {
                if (!$scope.appointmentInfo.DestAddress) {
                    toast.showToast('请选择下车地址', 1000);
                    return;
                }
            } else {
                if (!$scope.appointmentInfo.PickupAddress) {
                    toast.showToast('请选择上车地址', 1000);
                    return;
                }
            }
            if (!$scope.appointmentInfo.FlightNo) {
                toast.showToast('请选择航班', 1000);
                return;
            }
            if ($scope.jiejiSelectFlight($scope.appointmentInfo.ArriveTime) === false) return false;
            if ($scope.typeParams.carType === 'special' && !$scope.appointmentInfo.stepone && !$scope.appointmentInfo.PickupTime) {
                // toast.showToast('请选择乘车时间', 1000);
                $scope.flightDateSelect();
                return;
            }
            if (!$scope.appointmentInfo.stepone) {
                $scope.confirmAppointment();
            }
            //弹出提示和设置是否川航航班
            if ($scope.flightResInfo.FlightNo.substring(0, 2).toUpperCase() === '3U' && $scope.appointmentInfo.stepone) {
                $scope.typeParams.isSiChuanFlight = true;
                $scope.showCheckTips(true);
            } else {
                $scope.typeParams.isSiChuanFlight = false;
            }
            $scope.appointmentInfo.stepone = false;

            $bw.addSession({
                name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType,
                info: $scope.appointmentInfo
            });
        };
        /**
         * 航班选择日期设置
         * @Author duan 2017-07-18T15:37:13+0800
         */
        $scope.setFilghtSelectDate = function() {
            if ($scope.typeParams.stroke === 'jieji') {
                $scope.typeParams.minDate = new Date().getTime() - 86400000;
                $scope.typeParams.maxDate = parseInt(new Date().getTime()) + 518400000;
            } else {
                $scope.typeParams.minDate = new Date().getTime();
                $scope.typeParams.maxDate = parseInt(new Date().getTime()) + 518400000;
            }
        };

        $scope.setPickupTime = function(minTime, editVal) {
                $scope.specialJiejiDefaultTips = '';
                var ceilTime = $scope.ceilTime(minTime);
                var nowLevTime = 3600000;
                if ($scope.typeParams.stroke === 'jieji') {
                    nowLevTime = 1800000;
                }
                if ($scope.typeParams.carType === 'special') {

                    // if (editVal) $scope.appointmentInfo.PickupTime = baseService.formate(ceilTime + nowLevTime, '-');

                    //如果选择了航班 按航班时间规划
                    if ($scope.appointmentInfo.FlightNo) {
                        var TakeOffTime = $scope.floorTime($scope.appointmentInfo.TakeOffTime);
                        var ArriveTime = $scope.ceilTime($scope.appointmentInfo.ArriveTime);
                        var nowTime = $scope.ceilTime(new Date().getTime());
                        if ($scope.typeParams.stroke === 'jieji') {
                            //接机专车有航班号上车时间范围
                            var maxTime = ArriveTime + 600000;
                            if (maxTime < nowTime + nowLevTime) maxTime = nowTime + nowLevTime;
                            if (ArriveTime > $scope.appointmentInfo.ArriveTime) {
                                ArriveTime = ArriveTime - 600000;
                            }
                            $scope.setCalendarPickupDate(maxTime, ArriveTime + 86400000);
                            if (ArriveTime + nowLevTime > nowTime + nowLevTime) {
                                // $scope.appointmentInfo.PickupTime = baseService.formate(ArriveTime + nowLevTime, '-');
                                $scope.specialJiejiDefaultTips = '航班到达30分钟乘车';
                            }
                        } else {
                            //送机专车有航班号上车时间范围
                            var maxTime = TakeOffTime - 604800000;
                            if (maxTime < nowTime + nowLevTime) maxTime = nowTime + nowLevTime;
                            $scope.setCalendarPickupDate(maxTime, TakeOffTime - 7200000);
                        }

                    } else {
                        var date = new Date(baseService.formateToDate(ceilTime, '/') + ' 23:59').getTime(); //苹果的new Date不支持-的形式

                        $scope.setCalendarPickupDate(ceilTime + nowLevTime, date + (6 * 24 * 60 * 60 * 1000));
                    }
                } else {
                    // $scope.appointmentInfo.PickupTime = minTime;
                }
            }
            /**
             * 设置接机默认值
             * @Author duan     2017-07-17T11:25:53+0800
             * @return {[type]} [description]
             */
        $scope.setjiejisongjiDetault = function() {
            $scope.appointmentInfo.PickupAddress = '';
            $scope.appointmentInfo.PickupDetailAddress = '';
            $scope.appointmentInfo.PickupLongitude = '';
            $scope.appointmentInfo.PickupLatitude = '';
            $scope.appointmentInfo.DestAddress = '';
            $scope.appointmentInfo.DestLongitude = '';
            $scope.appointmentInfo.DestLatitude = '';
            if ($scope.typeParams.stroke === 'songji') {
                $scope.appointmentInfo.TripType = 2;
            } else {
                $scope.appointmentInfo.TripType = 1;
            }
            if ($scope.typeParams.carType === 'carpooling') {
                //接机拼车
                $scope.appointmentInfo.ServiceType = 1;
                $scope.typeParams.maxSeat = 6;
            } else {
                //接机专车
                $scope.appointmentInfo.ServiceType = 2;
                var num = $bw.swiper ? $bw.swiper.activeIndex : 0;
                $scope.typeParams.maxSeat = $scope.carTypeList ? $scope.carTypeList[num].NumberOfSeats : 1;
            }
        }

        /**
         * 设置默认值
         * @author duantingting@bestwise.cc 2017-06-22
         */
        $scope.setDefault = function() {
            if (!$scope.typeParams.stroke || !$scope.typeParams.carType) return;
            $scope.inPassengers = [];
            $scope.typeParams.havePrice = true;
            $scope.typeParams.isAllow = false;
            $scope.typeParams.showFalsePriceBox = false;
            $scope.typeParams.showFlightTips = false;
            $scope.typeParams.isSiChuanFlight = false;
            $scope.flightInputInfo = { flightNum: '' };
            $scope.flightResInfo = {};


            $scope.verifyMsg = { sureValidNum: 0 };
            // $scope.appointmentInfo = $bw.getSession('appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType);
            var appointmentInfo1 = $bw.getSession('appointmentInfosongji' + $scope.typeParams.carType) || null;
            var appointmentInfo2 = $bw.getSession('appointmentInfojieji' + $scope.typeParams.carType) || null;
            if (appointmentInfo1 && !appointmentInfo1.stepone) {
                $scope.appointmentInfo = appointmentInfo1;
                $scope.typeParams.stroke = 'songji';
            } else if (appointmentInfo2 && !appointmentInfo2.stepone) {
                $scope.appointmentInfo = appointmentInfo2;
                $scope.typeParams.stroke = 'jieji';
            } else {
                $scope.appointmentInfo = $bw.getSession('appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType);
            }

            if ($scope.appointmentInfo) {
                for (var i in $scope.appointmentInfo.Passengers) {
                    if ($scope.appointmentInfo.Passengers[i].IsValid) $scope.verifyMsg.sureValidNum++;
                }
                if ($scope.typeParams.carType === 'special') {
                    $scope.typeParams.maxSeat = ($scope.carTypeList.length && $scope.carTypeList[$scope.appointmentInfo.swiperActiveIndex]) ? $scope.carTypeList[$scope.appointmentInfo.swiperActiveIndex].NumberOfSeats : 1;
                } else {
                    $scope.typeParams.maxSeat = 6;
                }
                if ($scope.appointmentInfo.sureValidNum > $scope.appointmentInfo.SeatNum) {
                    $scope.appointmentInfo.SeatNum = $scope.appointmentInfo.sureValidNum;
                }
                if ($scope.appointmentInfo.Passengers && $scope.appointmentInfo.Passengers.length) {
                    $scope.appointmentInfo.isChecked = true;
                }
                $scope.showSeatList($scope.appointmentInfo.SeatNum, true);
                //如果有填写记录，不设置默认值
                if ($scope.appointmentInfo.FlightNo) {
                    //如果有选择航班，需设置上车时间 调用选择航班方法 设置选中航班和航班选择默认值
                    $scope.flightResInfo.FlightNo = $scope.appointmentInfo.FlightNo;
                    $scope.flightResInfo.Date = $scope.appointmentInfo.FlightDate;

                    $scope.flightInputInfo.flightNum = $scope.appointmentInfo.FlightNo;
                    $scope.flightInputInfo.flightTime = $scope.appointmentInfo.FlightDate;

                    var data = {
                            FlightDeptimePlanDate: $scope.appointmentInfo.TakeOffTime,
                            FlightArrtimePlanDate: $scope.appointmentInfo.ArriveTime,
                            FlightDepAirport: $scope.appointmentInfo.FlightDepAirport,
                            FlightDepTerminal: $scope.appointmentInfo.FlightDepTerminal,

                            DepLatitude: $scope.appointmentInfo.DestLatitude || '',
                            DepLongitude: $scope.appointmentInfo.DestLongitude || '',

                            ArrLatitude: $scope.appointmentInfo.PickupLatitude || '',
                            ArrLongitude: $scope.appointmentInfo.PickupLongitude || '',

                            FlightArrAirport: $scope.appointmentInfo.FlightArrAirport || '',
                            FlightArrTerminal: $scope.appointmentInfo.FlightArrTerminal || '',

                            DepAirPortFullName: $scope.appointmentInfo.DestDetailAddress || '',
                            ArrAirPortFullName: $scope.appointmentInfo.PickupDetailAddress || ''
                        }
                        //如果接机 
                    var tcity;
                    if ($scope.typeParams.stroke === 'jieji') {
                        if ($scope.appointmentInfo.FlightArrAirport.indexOf($rootScope.selectedCity.CityName.replace("市", "")) == -1) {
                            $rootScope.openCityList.forEach(function(val) {
                                if ($scope.appointmentInfo.FlightArrAirport.indexOf(val.CityName.replace("市", "")) >= 0) {
                                    tcity = val;
                                }
                            });
                            $rootScope.selectedCity = tcity;
                            $bw.addStorage({
                                name: 'selectedCity',
                                info: $rootScope.selectedCity
                            })
                        }
                    } else {
                        if ($scope.appointmentInfo.FlightDepAirport.indexOf($rootScope.selectedCity.CityName.replace("市", "")) == -1) {
                            $rootScope.openCityList.forEach(function(val) {
                                if ($scope.appointmentInfo.FlightDepAirport.indexOf(val.CityName.replace("市", "")) >= 0) {
                                    tcity = val;
                                }
                            });
                            $rootScope.selectedCity = tcity;
                            $bw.addStorage({
                                name: 'selectedCity',
                                info: $rootScope.selectedCity
                            })
                        }
                    }
                    $scope.createFlighInfo(data);

                } else if ($scope.appointmentInfo.DestAddress) {
                    $scope.getPrice();
                }
                if ($scope.verifyMsg.sureValidNum > $scope.appointmentInfo.SeatNum) {
                    $scope.appointmentInfo.SeatNum = $scope.verifyMsg.sureValidNum;
                }
                $scope.typeParams.seatTips = $scope.appointmentInfo.SeatNum + '人乘车';
                if ($bw.swiper) $bw.swiper.slideTo($scope.appointmentInfo.swiperActiveIndex);

                // $scope.setPickupTime(new Date().getTime(), false);
            } else {
                if (!window.userInfo.phone) {
                    $state.go('bindPhone');
                }
                $scope.appointmentInfo = {
                    Phone: window.userInfo.phone,
                    // City: $rootScope.selectedCity.CityName || '成都',
                    FlightNo: '',
                    FlightDate: '',
                    TakeOffTime: null,
                    ArriveTime: null,
                    TakeOffStation: '',
                    ArriveStation: '',
                    Passengers: [],
                    ContactName: '更换乘车人',
                    swiperActiveIndex: 0,
                    stepone: true,
                    IsNow: false, //乘车时间是否选择‘现在’
                    CarTypeId: ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].CarTypeId : '',
                    CarSeats: ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].NumberOfSeats : '',
                    CarTypeName: ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].CarTypeName : ''
                };

                if ($rootScope.userInfo.IsRealValid) {
                    $scope.appointmentInfo.Passengers.push({
                        verify: false,
                        idNum: 0,
                        IDCardNo: $rootScope.userInfo.IDCard
                    })
                }
                $scope.showSeatList(1);
                //没有填写记录 根据状态设置不同的默认值
                $scope.setjiejisongjiDetault();

                // $scope.setPickupTime(new Date().getTime(), true);
            }
        };

        /**
         * 切换送机和接机
         * @author duantingting@bestwise.cc 2017-06-22
         * @return {[stroke]} [description]
         */
        $scope.switchStroke = function(stroke) {
            if ($scope.typeParams.carType) $bw.addSession({ name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType, info: $scope.appointmentInfo });
            $scope.typeParams.stroke = stroke;
            $scope.setDefault();
            $bw.addSession({
                name: 'createOrderNowType',
                info: {
                    stroke: $scope.typeParams.stroke,
                    carType: $scope.typeParams.carType
                }
            });
        };
        /**
         * 切换专车和拼车,车型切换
         * @Author duan      2017-08-09T18:39:08+0800
         * @param  {[type]} carType                  [description]
         * @return {[type]}                          [description]
         */
        $scope.switchCar = function(carType) {
            if ($scope.typeParams.carType) $bw.addSession({ name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType, info: $scope.appointmentInfo });
            $scope.typeParams.carType = carType;
            $scope.setDefault();
            $bw.addSession({
                name: 'createOrderNowType',
                info: {
                    stroke: $scope.typeParams.stroke,
                    carType: $scope.typeParams.carType
                }
            });
            if ($scope.isgetActivitySp && $scope.typeParams.carType === 'special') {
                $scope.getActivity();
                $scope.isgetActivitySp = false;
                $bw.addSession({ name: 'isgetActivitySp', info: 'false' });
                // $scope.specialCarSwiper();
            }
            if ($scope.isgetActivityCp && $scope.typeParams.carType === 'carpooling') {
                $scope.isgetActivityCp && $scope.getActivity();
                $scope.isgetActivityCp = false;
                $bw.addSession({
                    name: 'isgetActivityCp',
                    info: 'false'
                });
            }

            // $scope.appointmentInfo.stepone = false;
        };


        $scope.showCreateOrderCheck = function(type) {
            $scope.typeParams.showCreateOrderCheck = type;

            $rootScope.showBlock = type;
            $rootScope.routerHide = type;
        };
        /**
         * 显示充值弹窗
         * @type {Boolean}
         */
        $scope.typeParams.showRecharge = false;
        $scope.showRechargeF = function() {
            $scope.typeParams.showRecharge = true;
            $rootScope.showBlock = true;
        };
        /**
         * 专车下单钱包金额不足去充值
         */
        $scope.creatOrderRecharge = function() {
            $scope.typeParams.showRecharge = false;
            $rootScope.showBlock = true;
            $state.go('createOrder.recharge');
        };
        /**
         * 显示选择航班的弹窗
         * @type {Boolean}
         */
        $scope.showSelectFlight = false;
        $scope.showSelectFlightF = function() {
            $scope.showSelectFlight = true;
            $rootScope.routerHide = true;
            $rootScope.showBlock = true;
            $scope.hasFlight = false;
            $scope.flightList = [];
        };

        /**
         * 点击背景关闭弹窗
         * @author duantingting@bestwise.cc 2017-06-22
         * @param  {[type]} event [description]
         * @param  {[type]} data) {                       $scope.showSelectFlight [description]
         * @return {[type]}       [description]
         */
        $scope.$on('hideBlock', function(event, data) {
            $scope.showSelectFlight = false;
            $scope.showSelectDriver = false;
            $scope.typeParams.showRecharge = false;
            $scope.typeParams.showRechargeing = false;
            $scope.typeParams.showCreateOrderCheck = false;
            $rootScope.routerHide = false;
            $scope.typeParams.showRecommend = false;
        });

        /**
         * 
         * 选择座位后展示座位列表，并根据座位数量构建验证页面
         * @author duantingting@bestwise.cc 2017-06-21
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         */
        $scope.showSeatList = function(num, noGetPrice) {
            // if ($scope.typeParams.maxSeat < num) {
            //     toast.showToast('已超过当前车型的最大乘坐人数。', 1500);
            //     return false;
            // }
            if ($scope.verifyMsg.sureValidNum > $scope.appointmentInfo.SeatNum) {
                $scope.appointmentInfo.SeatNum = $scope.verifyMsg.sureValidNum;
            } else {
                $scope.appointmentInfo.SeatNum = num;
            }
            $scope.typeParams.seatTips = $scope.appointmentInfo.SeatNum + '人乘车';
            if (!noGetPrice) $scope.getPrice();
        };
        /**
         * 输入航班号时验证航班号
         * @author duantingting@bestwise.cc 2017-06-22
         * @return {[type]} [description]
         */
        $scope.verifyFlightNo = function() {
            if ($scope.flightInputInfo.flightNum.length >= 10) {
                $scope.flightInputInfo.flightNum = $scope.flightInputInfo.flightNum.substr(0, 10);
            }
        };
        /**
         * 根据航班信息获取航班列表
         * @author duantingting@bestwise.cc 2017-06-22
         * @return {[type]} [description]
         */
        $scope.getTripList = function() {
            if (!$scope.flightInputInfo.flightTime) {
                toast.showToast("请选择起飞时间", 1500);
                return false;
            }
            if (!$scope.flightInputInfo.flightNum) {
                toast.showToast("请输入航班号", 1500);
                return false;
            }
            // if ($scope.flightInputInfo.flightNum.substring(0, 2).toUpperCase() !== '3U') {
            //     toast.showToast("目前只支持川航航班", 1500);
            //     return false;
            // }
            /*if ($scope.flightInputInfo.flightNum.length != 6) {
                toast.showToast("航班号不正确", 1500);
                return false;
            }*/
            appointmentService.getTripsList({
                flightNo: $scope.flightInputInfo.flightNum,
                Date: $scope.flightInputInfo.flightTime,
                ServiceType: $scope.typeParams.carType === 'carpooling' ? 1 : 2,
            }, function(reseponse) {
                $scope.showFlightNoData = false;
                $scope.hasFlight = false;
                if (reseponse.Status == 1 && reseponse.Data) {
                    if (!reseponse.Data.length) {
                        toast.showToast("未查询到航班", 1500);
                    } else {
                        $scope.flightResInfo.FlightNo = reseponse.Data[0].FlightNo;
                        $scope.flightResInfo.Date = baseService.formateToDate(reseponse.Data[0].FlightDeptimePlanDate, '-');
                        $scope.flightList = reseponse.Data;
                        $scope.hasFlight = true;
                        if (reseponse.Data.length == 1) $scope.selectFlight(reseponse.Data[0]);
                    }
                } else {
                    $scope.flightList = [];
                    $scope.showFlightNoData = true;
                }
            });
        };
        /**
         * 绑定数据渲染完成加载swiper;
         * @author duantingting@bestwise.cc 2017-06-23
         * @param  {[type]} ngRepeatFinishedEvent)
         * @return {[type]}                        [description]
         */
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            if (typeof(Swiper) == 'undefined') {
                var swiperLoading = toast.showLoading();
                $bw.loadJS('bower_components/swiper/swiper.min.js', function() {
                    // $bw.loadJS('bower_components/swiper/swiper-3.4.2.min.js', function() {
                    $scope.ngRepeatFinished();
                    $scope.carTypeList = $scope.carTypeList || [];
                    $scope.$apply();
                    toast.hideLoading(swiperLoading);
                })
            } else {
                $scope.ngRepeatFinished();
                $scope.carTypeList = $scope.carTypeList || [];
            }
        });

        //活动的数据加载完成
        $scope.$on('ngRepeatFinishedActivity', function() {
            // conosole.log(ENV)
            if (typeof(Swiper) == 'undefined') {
                var swiperLoading = toast.showLoading();
                $bw.loadJS('bower_components/swiper/swiper.min.js', function() {
                    try {
                        $scope.eventSwiper.destroy()
                    } catch (err) {}
                    $scope.eventSwiper = new Swiper('.swiper-container2', {
                        pagination: {
                            el: '.swiper-pagination2',
                        },
                        initialSlide: $scope.eventPlan,
                        on: {

                            slideChangeTransitionEnd: function() {
                                var activeIndex = this.activeIndex; //切换结束时，告诉我现在是第几个slide
                                if ($scope.eventPlan.length == 1 && activeIndex == 1) {
                                    swiper2.slideTo(0, 100, false);
                                }
                                $('.swiper-pagination2')
                                    .find('span')
                                    .eq(activeIndex)
                                    .addClass('swiper-pagination-bullet-active')
                                    .siblings()
                                    .removeClass('swiper-pagination-bullet-active');
                            }
                        }
                    });
                    $scope.eventSwiper.slideTo(0, 100, false); //切换到第一个slide，速度为1秒
                    $scope.$apply();
                    toast.hideLoading(swiperLoading);
                })
            } else {
                try {
                    $scope.eventSwiper.destroy()
                } catch (err) {}
                $scope.eventSwiper = new Swiper('.swiper-container2', {
                    pagination: {
                        el: '.swiper-pagination2',
                    },
                    initialSlide: $scope.eventPlan,
                    on: {

                        slideChangeTransitionEnd: function() {
                            var activeIndex = this.activeIndex; //切换结束时，告诉我现在是第几个slide
                            $('.swiper-pagination2')
                                .find('span')
                                .eq(activeIndex)
                                .addClass('swiper-pagination-bullet-active')
                                .siblings()
                                .removeClass('swiper-pagination-bullet-active');
                        }
                    }
                })
                $scope.eventSwiper.slideTo(0, 100, false); //切换到第一个slide，速度为1秒

            }

        })
        $scope.$on('ngRepeatFinishedScroll', function() {
            if ($scope.typeParams.carType === 'special') {
                ($scope.activitsSp.length > 1) && $scope.notificationScroll('notification');
            } else {
                ($scope.activitsCp.length > 1) && $scope.notificationScroll('notification-carpooling');
            }
        });
        //车型的swiper
        $scope.ngRepeatFinished = function() {
            $scope.appointmentInfo.CarTypeId = ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].CarTypeId : '';
            $scope.appointmentInfo.CarSeats = ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].NumberOfSeats : '';
            $scope.appointmentInfo.CarTypeName = ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].CarTypeName : '';
            $scope.typeParams.maxSeat = ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].NumberOfSeats : '';
            $bw.swiper = new Swiper('.swiper-container1', {
                pagination: {
                    el: '.swiper-pagination1',
                },
                initialSlide: $scope.appointmentInfo.swiperActiveIndex,
                on: {
                    slideChangeTransitionEnd: function() {
                        var activeIndex = this.activeIndex; //切换结束时，告诉我现在是第几个slide
                        $('.swiper-pagination1')
                            .find('span')
                            .eq(activeIndex)
                            .addClass('swiper-pagination-bullet-active')
                            .siblings()
                            .removeClass('swiper-pagination-bullet-active');
                        //如果有指定司机 不允许选择车型
                        if ($scope.appointmentInfo.WantDriverCode && $scope.carTypeList.length && $scope.appointmentInfo.CarTypeId != $scope.carTypeList[this.activeIndex].CarTypeId) {
                            toast.showTips('由于您指定了司机' + $scope.appointmentInfo.diverCarNum.toUpperCase() + '接单，不能切换其他车型');
                            for (var i in $scope.carTypeList) {
                                if ($scope.appointmentInfo.CarTypeId == $scope.carTypeList[i].CarTypeId) {
                                    this.slideTo(i);
                                }
                            }
                            return;
                        }
                        $scope.typeParams.isAllow = false;
                        $scope.typeParams.maxSeat = $scope.carTypeList[this.activeIndex].NumberOfSeats;

                        if ($scope.verifyMsg.sureValidNum > $scope.typeParams.maxSeat) {
                            var _this = this;
                            toast.showTips('当前验证人数超过车型准载人数', function() {
                                _this.slideTo(_this.previousIndex);
                            });
                        } else {
                            $scope.appointmentInfo.swiperActiveIndex = this.activeIndex;
                            $scope.appointmentInfo.swiperSeat = $scope.carTypeList[this.activeIndex].NumberOfSeats;
                            $scope.appointmentInfo.CarTypeId = $scope.carTypeList[this.activeIndex].CarTypeId;
                            $scope.appointmentInfo.CarSeats = $scope.carTypeList[this.activeIndex].NumberOfSeats;
                            $scope.appointmentInfo.CarTypeName = $scope.carTypeList[this.activeIndex].CarTypeName;
                            $scope.getPrice();
                        }

                    }
                }
            })
        };


        /**
         * 获取专车类型
         * @author duantingting@bestwise.cc 2017-06-23
         * @return {[type]} [description]
         */
        $scope.getCarType = function(callback, bool) {
            appointmentService.GetCarTypes({
                // serviceType: 2
            }, function(res) {
                if (res.Data) {
                    // $bw.carTypeList = res.Data;
                    $scope.carTypeList = res.Data;
                    $scope.typeParams.haveCarList = true;
                    $bw.addStorage({
                        info: res.Data,
                        name: 'carTypes'
                    });
                    if (bool) {
                        $scope.appointmentInfo.CarTypeId = ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].CarTypeId : '';
                        $scope.appointmentInfo.CarSeats = ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].NumberOfSeats : '';
                        $scope.appointmentInfo.CarTypeName = ($scope.carTypeList.length && $scope.carTypeList[0]) ? $scope.carTypeList[0].CarTypeName : '';
                    }
                    callback && callback();
                } else {
                    $scope.typeParams.haveCarList = false;
                    callback && callback();
                }
            });
        };
        /**
         * 向上取整时间 用于规划航班上车时间
         * @author duantingting@bestwise.cc 2017-06-21
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        $scope.ceilTime = function(date) {
            var minDate = baseService.formate(date, '/').split(' ');
            var minTArr = minDate[1].split(':');
            var s = minTArr[1];
            var newS = Math.ceil(s * 0.1) * 10;
            if (newS == 60) {
                return parseInt(date) + (60 - s) * 60000;
            } else {
                var timeStr = minDate[0] + ' ' + minTArr[0] + ':' + newS;
                return new Date(timeStr).getTime();
            }
        };
        /**
         * 向下取整时间 用于规划航班上车时间
         * @author duantingting@bestwise.cc 2017-06-21
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        $scope.floorTime = function(date) {
            var str = baseService.formate(date, '/');
            var minDate = str.split(' ');
            var minTArr = minDate[1].split(':');
            var add = 0;
            var s = minTArr[1];
            var newS = Math.floor(s * 0.1) * 10;
            return new Date(minDate[0] + ' ' + minTArr[0] + ':' + newS).getTime();
        };
        /**
         * 送机选择航班，构建上车时间选择范围
         * @author duantingting@bestwise.cc 2017-06-21
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        $scope.songjiSelectFlight = function(data) {
            var nowTime = new Date().getTime();
            if ($scope.typeParams.carType === 'carpooling') {
                try {
                    var takeOffDateArr = baseService.formate(data.FlightDeptimePlanDate, '/').split(' ');
                    var takeOffTimeArr = takeOffDateArr[1].split(':');
                    //获得取整后的时间点 如2017/08/23 05:30 取整为 2017/08/23 05:00 
                    var takeOffFloorTime = new Date(takeOffDateArr[0] + ' ' + takeOffTimeArr[0] + ':00').getTime(); //向下取整
                } catch (e) {
                    toast.showTips('未知错误。');
                    return false;
                }

                //规定必须提前4个小时预约 起飞时间向上取整后计算
                if (takeOffFloorTime - 14400000 < nowTime) {
                    toast.showConfirm({
                        cancelWords: '我知道了',
                        sureWords: '<a href="tel:028-86868686">联系客服</a>',
                        text: '请在航班起飞前5小时预约。如有需要，请拨打客服电话028-86868686人工预约'
                    });
                    return false;
                }


                //规定当前时间在22:00以后 则只能预约第二天13点以后的航班,当前时间在22：00 以前 只能预约今天13点以后的航班
                var minTime = new Date(baseService.formateToDate(nowTime, '/') + ' 22:00').getTime();
                var minFlightTime;
                var text = '';

                if (nowTime > minTime) {
                    minFlightTime = new Date(baseService.formateToDate(nowTime + 86400000, '/') + ' 13:00').getTime();
                    text = "当前时间仅可预约明日13:00之后的航班。如有需要，请拨打客服电话028-86868686人工预约"
                } else {
                    minFlightTime = new Date(baseService.formateToDate(nowTime, '/') + ' 13:00').getTime();
                    text = "当前时间仅可预约13:00之后的航班。如有需要，请拨打客服电话028-86868686人工预约"
                }
                if (data.FlightDeptimePlanDate < minFlightTime) {
                    toast.showConfirm({
                        cancelWords: '我知道了',
                        sureWords: '<a href="tel:028-86868686">联系客服</a>',
                        text: text
                    });
                    return false;
                }
            } else {
                //专车送机必须提前两小时预约 加上必须提前一小时预约上车  共需提前3小时预约
                if (data.FlightDeptimePlanDate - 10800000 < nowTime) {
                    toast.showTips('已超过预约时间');
                    return false;
                }
            }
            return true;
        };
        $scope.jiejiSelectFlight = function(FlightArrtimePlanDate) {
            var nowTime = new Date().getTime();
            if (FlightArrtimePlanDate + 86400000 < nowTime) {
                toast.showTips('已超过预约时间');
                return false;
            }
            return true;
        };
        /**
         * 构建航班信息
         * @Author duan     2017-07-15T14:39:29+0800
         * @param  {[type]}
         * @param  {[type]}
         * @return {[type]}
         */
        $scope.createFlighInfo = function(data) {
                var isOldFlight = false;
                if ($scope.appointmentInfo.FlightNo === $scope.flightResInfo.FlightNo && $scope.appointmentInfo.FlightDate === $scope.flightResInfo.Date) {
                    isOldFlight = true;
                }

                if ($scope.typeParams.stroke === 'songji') {
                    $scope.appointmentInfo.DestAddress = data.DepAirPortFullName;
                    $scope.appointmentInfo.DestDetailAddress = data.DepAirPortFullName;

                    $scope.appointmentInfo.DestLatitude = data.DepLatitude;
                    $scope.appointmentInfo.DestLongitude = data.DepLongitude;
                } else {
                    $scope.appointmentInfo.PickupAddress = data.ArrAirPortFullName;
                    $scope.appointmentInfo.PickupDetailAddress = data.ArrAirPortFullName;
                    $scope.appointmentInfo.PickupLatitude = data.ArrLatitude;
                    $scope.appointmentInfo.PickupLongitude = data.ArrLongitude;
                }
                $scope.appointmentInfo.FlightDepAirport = data.FlightDepAirport;
                $scope.appointmentInfo.FlightDepTerminal = data.FlightDepTerminal;
                $scope.appointmentInfo.FlightArrAirport = data.FlightArrAirport;
                $scope.appointmentInfo.FlightArrTerminal = data.FlightArrTerminal;

                $scope.appointmentInfo.FlightNo = $scope.flightResInfo.FlightNo;
                $scope.appointmentInfo.FlightDate = $scope.flightResInfo.Date;
                $scope.appointmentInfo.TakeOffTime = data.FlightDeptimePlanDate;
                $scope.appointmentInfo.ArriveTime = data.FlightArrtimePlanDate;
                $scope.appointmentInfo.TakeOffStation = data.FlightDepAirport + data.FlightDepTerminal;
                $scope.appointmentInfo.ArriveStation = data.FlightArrAirport + data.FlightArrTerminal;

                $scope.typeParams.showFlightTips = true;
                $scope.flightTipsInfoSongji = "预计" + baseService.formateToMonth(data.FlightDeptimePlanDate) + ' ' + baseService.formateToTime(data.FlightDeptimePlanDate, '点') + '起飞';
                // $scope.flightTipsInfoSongji = "预计" + baseService.formateToMonth(data.TakeOffTime) + ' 周' + baseService.formateToDay(data.TakeOffTime) + ' ' + baseService.formateToTime(data.TakeOffTime, ':') + '起飞';
                $scope.flightTipsInfoJieji = "预计" + baseService.formateToMonth(data.FlightArrtimePlanDate) + ' ' + baseService.formateToTime(data.FlightArrtimePlanDate, '点') + '到达';
                //是否川航航班
                if ($scope.flightResInfo.FlightNo.substring(0, 2).toUpperCase() === '3U') {
                    $scope.typeParams.isSiChuanFlight = true;
                } else {
                    $scope.typeParams.isSiChuanFlight = false;
                }
                // $scope.setPickupTime(new Date().getTime(), true);

                //测试要求 删除用户验证信息，上车时间为空
                if (!isOldFlight) {
                    $scope.verifyMsg.sureValidNum = 0;
                    $scope.appointmentInfo.Passengers = [];
                    $scope.checkPassengers = [];
                    $scope.appointmentInfo.PickupTime = "";
                    $scope.appointmentInfo.isChecked = false;
                }
                $bw.addSession({
                    name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType,
                    info: $scope.appointmentInfo
                });

                $scope.showSeatList($scope.appointmentInfo.SeatNum);
            }
            /**
             * 选择航班，构建航班相关内容
             * @author duantingting@bestwise.cc 2017-06-21
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
        $scope.selectFlightCity = function(data, city) {
            if ($rootScope.selectedCity.CityId != city.CityId) {
                appointmentService.GetPassengerSubsidyPrice({}, function(res) {
                    $rootScope.ENV.freePrice = res.Data.SubsidyPrice;
                });
                $rootScope.selectedCity = city;
                $bw.addStorage({
                    name: 'selectedCity',
                    info: $rootScope.selectedCity
                })
                $scope.getCarType(function() {
                    if ($scope.typeParams.carType === 'carpooling' && $scope.typeParams.stroke === 'jieji' && data.FlightArrcode == "CTU" && data.FlightArrTerminal == "T2") {
                        $scope.showTerminalTips = true;
                        $rootScope.showBlock = true;
                        $rootScope.routerHide = true;
                    } else {
                        $scope.selectFlightContinue(data);
                    }
                }, true);
            } else {
                if ($scope.typeParams.carType === 'carpooling' && $scope.typeParams.stroke === 'jieji' && data.FlightArrcode == "CTU" && data.FlightArrTerminal == "T2") {
                    $scope.showTerminalTips = true;
                    $rootScope.showBlock = true;
                    $rootScope.routerHide = true;
                } else {
                    $scope.selectFlightContinue(data);
                }
            }

        };
        //判断选择航班服务城市是否开通服务
        $scope.selectFlight = function(data) {
            $scope.showTerminalTipsData = data;
            var jiejiFlag = false,
                jiejiCity = {};
            var songjiFlag = false,
                songjiCity = {};
            angular.forEach($rootScope.openCityList, function(item) {
                if (item.CityName.indexOf(data.FlightArr) >= 0) {
                    jiejiFlag = true;
                    jiejiCity = item;
                }
                if (item.CityName.indexOf(data.FlightDep) >= 0) {
                    songjiFlag = true;
                    songjiCity = item;
                }
            });
            //如果接机 
            if ($scope.typeParams.stroke === 'jieji') {
                if (!data.ArrLatitude || !data.ArrLongitude) {
                    toast.showToast('该航班未开通接机服务.', 1500);
                    return false;
                }
                if (jiejiFlag) {
                    $scope.selectFlightCity(data, jiejiCity);
                } else {
                    toast.showToast('该航班暂不支持接机服务.', 1500);
                    return false;
                }
            }
            //如果是送机 
            if ($scope.typeParams.stroke === 'songji') {
                if (!data.DepLatitude || !data.DepLongitude) {
                    toast.showToast('该航班未开通送机服务.', 1500);
                    return false;
                }
                if (songjiFlag) {
                    $scope.selectFlightCity(data, songjiCity);
                } else {
                    toast.showToast('该航班暂不支持送机服务.', 1500);
                    return false;
                }
            }
            return true;
        }

        $scope.selectFlightStop = function(bool, isFlightNull) {
            $scope.showTerminalTips = bool;
            if (isFlightNull) {
                $scope.flightInputInfo.flightNum = '';
                $scope.appointmentInfo.FlightNo = '';
                $scope.appointmentInfo.FlightDate = '';
                $scope.typeParams.showFlightTips = false;
                $scope.typeParams.isAllow = false;
            }

            $scope.hasFlight = false;
            $scope.flightList = [];

        }
        $scope.selectFlightContinue = function(data) {
            var data = data ? data : $scope.showTerminalTipsData;
            $scope.selectFlightStop(false);
            if ($scope.typeParams.stroke === 'songji') {
                if ($scope.songjiSelectFlight(data) === false) return false;
            } else {
                if ($scope.jiejiSelectFlight(data.FlightArrtimePlanDate) === false) return false;
            }
            $scope.showSelectFlight = false;
            $rootScope.showBlock = false;
            $rootScope.routerHide = false;
            $scope.createFlighInfo(data);
        };
        /**
         * 弹出提示用户验证的界面
         * @author duantingting@bestwise.cc 2017-06-27
         * @return {[type]} [description]
         */
        $scope.showCheckTips = function(type, isKnow) {
                if ($scope.typeParams.carType !== 'carpooling') return;
                if (location.hash != '#/createOrder') return;
                if ($bw.getStorage('checkIsKnow') === 'true') return;
                if (isKnow === true) {
                    $bw.addStorage({
                        name: 'checkIsKnow',
                        info: 'true'
                    });
                }
                $rootScope.showBlock = type;
                $scope.typeParams.showCheckTips = type;
            }
            /**
             * 显示拼车专车切换引导
             * @Author duan     2017-08-14T16:59:29+0800
             * @param  {[type]} type                     [description]
             * @return {[type]}                          [description]
             */
        $scope.showCarTypeTips = function(type, isKnow) {
            // return;
            if ($bw.getStorage('showCarTypeTips') === 'true') return;
            if (isKnow === true) {
                $bw.addStorage({
                    name: 'showCarTypeTips',
                    info: 'true'
                });
            }
            // $rootScope.showBlock = type;
            // $scope.typeParams.showCarTypeTips = type;
        }
        $scope.showCarTypeTips(true);
        /**
         * 显示司机推荐码
         * @Author duan      2017-09-20T10:00:26+0800
         * @param  {[type]}  type                     [description]
         * @param  {Boolean} isKnow                   [description]
         * @return {[type]}                           [description]
         */
        $scope.recommend = { one: '', two: '', thr: '', four: '', inputVal: '', index: 0 };
        $scope.oldRecommend = { one: '', two: '', thr: '', four: '', inputVal: '', index: 0 };
        $scope.showRecommend = function(type) {
                $rootScope.IsNewUser = false;
                if (type) document.getElementById('rInput').focus();
                $rootScope.showBlock = type;
                $scope.typeParams.showRecommend = type;
            }
            //首次登陆弹窗推荐码
        if ($rootScope.IsNewUser) $scope.showRecommend(true);
        $scope.recommendIn = function() {
            var reg = /^[a-zA-Z0-9]{0,4}$/;
            if (!reg.test($scope.recommend.inputVal)) {
                for (i in $scope.oldRecommend) {
                    $scope.recommend[i] = $scope.oldRecommend[i];
                }
                toast.showToast('请输入合法的推荐码', 1500);
            } else {
                $scope.recommend.one = ($scope.recommend.inputVal[0] || '').toUpperCase();
                $scope.recommend.two = ($scope.recommend.inputVal[1] || '').toUpperCase();
                $scope.recommend.thr = ($scope.recommend.inputVal[2] || '').toUpperCase();
                $scope.recommend.four = ($scope.recommend.inputVal[3] || '').toUpperCase();
                $scope.recommend.index = $scope.recommend.inputVal.length;
                for (i in $scope.recommend) {
                    $scope.oldRecommend[i] = $scope.recommend[i];
                }
            }

        }
        $scope.BindReferralDriver = function() {
            if ($scope.recommend.inputVal.length < 4) return;
            appointmentService.BindReferralDriver({ ReferralCode: $scope.recommend.inputVal }, function(reseponse) {
                if (reseponse.Status == 1) $scope.showRecommend(false);

            });
        }
        $scope.recommendKey = function($event) {
                if ($event.keyCode === 13) {
                    $scope.BindReferralDriver();
                }
            }
            /**
             * 切换验证用户界面
             * @type {Boolean}
             */
        $scope.showCheckUser = false;
        $scope.showCheckUserF = function() {
            if (!$scope.appointmentInfo.FlightNo) {
                toast.showToast('请先选择航班。', 1500);
                return;
            }
            $scope.showCheckUser = true;

            //更新用户信息缓存 用于验证界面跳转后返回的信息保存
            $bw.addSession({ name: 'createOrderNowType', info: { stroke: $scope.typeParams.stroke, carType: $scope.typeParams.carType } });
            $bw.addSession({ name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType, info: $scope.appointmentInfo });
            window.location.href = window.ENV.publicUrl + "/verification.html?timeStr=" +
                new Date().getTime() + "&cityId=" + $rootScope.selectedCity.CityId +
                "&carType=" + $scope.typeParams.carType +
                "&stroke=" + $scope.typeParams.stroke;

        };


        $scope.submitCenterCheckuser = function() {

            $scope.appointmentInfo.DestLatitude = $scope.appointmentInfo.DestLatitude ? $scope.appointmentInfo.DestLatitude : 0;
            $scope.appointmentInfo.DestLongitude = $scope.appointmentInfo.DestLongitude ? $scope.appointmentInfo.DestLongitude : 0;
            $scope.appointmentInfo.PickupLatitude = $scope.appointmentInfo.PickupLatitude ? $scope.appointmentInfo.PickupLatitude : 0;
            $scope.appointmentInfo.PickupLongitude = $scope.appointmentInfo.PickupLongitude ? $scope.appointmentInfo.PickupLongitude : 0;

            appointmentService.AddVerification($scope.appointmentInfo, function(reseponse) {
                if (reseponse.Status == 1) {
                    $scope.typeParams.showCheckuserNum = false;
                    toast.showTips('提交后台验证成功，验证结果将以短信的方式发送给您，请注意查收！', function() {
                        $rootScope.showBlock = false;
                        $scope.$apply();
                        window.history.go(-1);
                        return false;
                    })
                }
            });
        }
        $scope.goBack = function() {
                $rootScope.showBlock = false;
                $scope.typeParams.showCheckuserNum = false;
                //window.history.go(-1);
            }
            /**
             * 弹出验证结果
             * @author duantingting@bestwise.cc 2017-06-23
             * @param  {[type]} showStr [description]
             * @return {[type]}         [description]
             */
        $scope.showCheckInfo = function(showStr) {
            toast.showConfirm({
                sureWords: '下一步',
                text: showStr,
                sureFn: function() {
                    window.history.go(-1);
                    return false;
                    //$state.go('createOrder');
                }
            });
        };

        /**
         * 构建航班选择时间选择器
         * @type {LCalendar}
         */
        $scope.calendarFlightDate = new LCalendar();
        $scope.flightTimeSelect = function() {
            $scope.setFilghtSelectDate();
            $scope.calendarFlightDate.clickFn({
                'title': '请选择起飞日期',
                'trigger': '#flight-time', //标签id
                'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
                'minDate': baseService.formateToDate($scope.typeParams.minDate, '-'), //最小日期
                'maxDate': baseService.formateToDate($scope.typeParams.maxDate, '-'), //最大日期
                callback: function(value) {
                    $scope.flightInputInfo.flightTime = value;
                    $scope.$apply();
                },
                cancel: function() {

                }
            });
        }

        /**
         * 构建上车时间选择器
         * @type {LCalendar}
         */
        $scope.calendar = new LCalendar();
        $scope.flightDateSelect = function() {
            if ($scope.typeParams.stroke === 'jieji') {
                var nowTime = new Date().getTime();
                if ($scope.appointmentInfo.FlightArrtimePlanDate + 86400000 < nowTime) {
                    toast.showTips('已超过预约时间');
                    return false;
                }
            }
            $scope.setPickupTime(new Date().getTime(), $scope.isSetPickupFlag);
        };
        $scope.setCalendarPickupDate = function(minDate, maxDate) {
            if ($scope.jiejiSelectFlight($scope.appointmentInfo.ArriveTime) === false) return false;
            $scope.calendar.clickFn({
                'title': '请选择乘车时间',
                'trigger': '#select-flight-date', //标签id
                'type': 'datetime', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
                'minDateTimestamp': minDate,
                'maxDateTimestamp': maxDate,
                'minDate': baseService.formate(minDate, '-'), //最小日期
                'maxDate': maxDate = maxDate ? baseService.formate(maxDate, '-') : '', //最大日期
                'isNow': $scope.typeParams.stroke === 'jieji' && $scope.typeParams.carType === 'special' ? true : false, //专车接机才有现在
                callback: function(value) {
                    if (value == "现在") { //选择现在时间
                        $scope.appointmentInfo.IsNow = true;
                    } else {
                        $scope.appointmentInfo.IsNow = false;
                        $scope.appointmentInfo.diverCarNum = '';
                        $scope.appointmentInfo.WantDriverCode = '';
                    }
                    $scope.appointmentInfo.PickupTime = value;
                    $bw.addSession({
                        name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType,
                        info: $scope.appointmentInfo
                    });
                    setTimeout(function() {
                        $scope.getPrice();
                    }, 100);
                    $scope.$apply();
                },
                cancel: function() {

                }
            })
        };

        $scope.goEditUser = function() {
            $scope.typeParams.showEditUser = true;
            $state.go("createOrder.editUser");
        }
        $scope.$on("editUserEmit", function(event, editInfo) {
            $scope.appointmentInfo.ContactName = editInfo.UserName;
            $scope.appointmentInfo.Phone = editInfo.Phone;
            $scope.appointmentInfo.IsSendOtherMessage = editInfo.notice;
            $scope.getPrice();
        });
        /**
         * 跳转到地址选择界面
         * @author duantingting@bestwise.cc 2017-06-22
         * @return {[type]} [description]
         */
        $scope.showSelectAddressF = function() {
            $scope.showSelectAddress = true;
            $bw.addSession({
                name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType,
                info: $scope.appointmentInfo
            });
            $state.go("createOrder.selectAddress");
        };
        /**
         * 选择地址，构建地址相关内容
         * @author duantingting@bestwise.cc 2017-06-21
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        $scope.$on("selectAddress", function(event, obj) {
            $scope.appointmentInfo.selAddressCity = obj.city;
            if ($scope.typeParams.stroke === 'songji') {
                $scope.appointmentInfo.PickupAddress = obj.name;
                $scope.appointmentInfo.PickupLongitude = obj.location.lng;
                $scope.appointmentInfo.PickupLatitude = obj.location.lat;
                $scope.appointmentInfo.PickupDetailAddress = obj.addressInfo;
                $scope.getPrice();

            } else {
                $scope.appointmentInfo.DestAddress = obj.name;
                $scope.appointmentInfo.DestLongitude = obj.location.lng;
                $scope.appointmentInfo.DestLatitude = obj.location.lat;
                $scope.appointmentInfo.DestDetailAddress = obj.addressInfo;
                $scope.getPrice();

            }
            //$scope.showSelectAddress = false;
        });

        /**
         * 验证内容是否可以获取价格
         * @author duantingting@bestwise.cc 2017-06-22
         * @return {[type]} [description]
         */
        $scope.verifyInfoToGetPrice = function() {
            if ($scope.typeParams.stroke === 'jieji') {
                if ($scope.typeParams.carType === 'carpooling') {
                    //接机拼车
                    if (!$scope.appointmentInfo.DestAddress || !$scope.appointmentInfo.FlightNo) return false;
                } else if ($scope.typeParams.carType === 'special') {
                    //接机专车
                    if (!$scope.appointmentInfo.CarTypeId || !$scope.appointmentInfo.DestAddress) return false;
                }
            } else if ($scope.typeParams.stroke === 'songji') {
                if ($scope.typeParams.carType === 'carpooling') {
                    //送机拼车
                    if (!$scope.appointmentInfo.PickupAddress || !$scope.appointmentInfo.FlightNo) return false;
                } else if ($scope.typeParams.carType === 'special') {
                    //送机专车
                    if (!$scope.appointmentInfo.CarTypeId || !$scope.appointmentInfo.PickupAddress) return false;
                }
            }
            return true;
        };
        /**
         * 验证是否可以点击创建订单
         * @author duantingting@bestwise.cc 2017-06-22
         * @return {[type]} [description]
         */
        $scope.verifyInfoToCreateOrder = function() {
            if ($scope.typeParams.stroke === 'jieji') {
                if ($scope.typeParams.carType === 'carpooling') {
                    //接机拼车
                    if ($scope.appointmentInfo.DestAddress) $scope.typeParams.isAllow = true;
                } else if ($scope.typeParams.carType === 'special') {
                    //接机专车
                    if ($scope.appointmentInfo.CarTypeId && $scope.appointmentInfo.DestAddress) $scope.typeParams.isAllow = true;
                }
            } else if ($scope.typeParams.stroke === 'songji') {
                if ($scope.typeParams.carType === 'carpooling') {
                    //送机拼车
                    if ($scope.appointmentInfo.PickupAddress && $scope.appointmentInfo.FlightNo) $scope.typeParams.isAllow = true;
                } else if ($scope.typeParams.carType === 'special') {
                    //送机专车
                    if ($scope.appointmentInfo.CarTypeId && $scope.appointmentInfo.PickupAddress) $scope.typeParams.isAllow = true;
                }
            }
        };

        /**
         * 根据用户身份信息获取订单价格
         * @author duantingting@bestwise.cc 2017-06-21
         * @param  {[type]} showTips [是否弹出验证结果提示]
         * @return {[type]}          [null]
         */

        $scope.getPrice = function(callback) {
            if (!$scope.verifyInfoToGetPrice()) return;
            $scope.appointmentInfo.ContactNumber = $scope.appointmentInfo.Phone;
            $scope.appointmentInfo.IDCardNos = [];
            !$scope.appointmentInfo.WantDriverCode && ($scope.appointmentInfo.diverCarNum = '');

            for (var i in $scope.appointmentInfo.Passengers) {
                var idNum = $scope.appointmentInfo.Passengers[i].IDCardNo;

                if (idNum && $scope.appointmentInfo.FlightNo) {
                    $scope.appointmentInfo.IDCardNos.push(idNum);
                }
            }

            // delete $scope.appointmentInfo.ID;
            var pobj = {};
            pobj = angular.copy($scope.appointmentInfo);
            if (pobj.PickupTime == "现在") {
                pobj.PickupTime = "";
            }
            $scope.typeParams.isAllow = false;
            appointmentService.PreviewBooking(pobj, function(reseponse) {
                if (reseponse.Status == 1 && reseponse.Data) {
                    var resPassengers = reseponse.Data.Passengers;
                    var IsValidNum = 0;
                    resPassengers.forEach(function(val) {
                        if (val.IsValid) {
                            IsValidNum++;
                        }
                    });
                    if (IsValidNum) {
                        $scope.verifyMsg.sureValidNum = IsValidNum;
                        if ($scope.verifyMsg.sureValidNum > $scope.appointmentInfo.SeatNum) {
                            $scope.appointmentInfo.SeatNum = $scope.verifyMsg.sureValidNum;
                        }
                        $scope.typeParams.seatTips = $scope.appointmentInfo.SeatNum + '人乘车';
                        if (IsValidNum > $scope.appointmentInfo.CarSeats) {
                            for (var i in $scope.carTypeList) {
                                if (IsValidNum <= $scope.carTypeList[i].NumberOfSeats) {
                                    $bw.swiper.slideTo(i);
                                }
                            }
                        }
                    }
                    // $scope.ValidatePassenger(resPassengers, true)
                    $scope.orderDetail = reseponse.Data;
                    angular.forEach(function(item) {
                        if (item.CarTypeId == $scope.orderDetail.CarTypeId) {
                            $scope.orderDetail.CarTypeName = item.CarTypeName;
                        }
                    });
                    // $scope.appointmentInfo.ID = reseponse.Data.ID;
                    $scope.typeParams.havePrice = true;
                    $scope.typeParams.showFalsePriceBox = false;
                    $scope.verifyInfoToCreateOrder();
                    if (callback) callback();
                } else {
                    $scope.typeParams.showFalsePriceBox = true;
                    $scope.typeParams.havePrice = false;
                }
            });
        };

        //展示计费详情
        $scope.showPriceDetail = function() {
            $bw.addSession({ name: 'createOrderNowType', info: { stroke: $scope.typeParams.stroke, carType: $scope.typeParams.carType } });
            $bw.addSession({ name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType, info: $scope.appointmentInfo });
            $bw.addSession({ name: 'AppBridgeOrderPriceDetail', info: $scope.orderDetail });
            window.location.href = window.ENV.publicUrl + "/priceDetail.html?timeStr=" + new Date().getTime() + "&cityId=" + $rootScope.selectedCity.CityId;
            //$state.go('createOrder.priceDetailed');
        };

        /**
         * 确认预约订单
         * @author duantingting@bestwise.cc 2017-06-23
         * @return {[type]} [description]
         */
        $scope.confirmAppointment = function() {
            //记住当前数据
            $bw.addSession({ name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType, info: $scope.appointmentInfo });
            if (!$scope.typeParams.isAllow) {
                return;
            }
            // if (!$scope.appointmentInfo.ID) {
            //     toast.showToast("程式错误，没有ID", 1500);
            //     return false;
            // }
            //用户没有验证过,并且是川航航班 弹框提示
            if ($scope.appointmentInfo.isChecked !== true && $scope.typeParams.isSiChuanFlight) {
                $scope.showCreateOrderCheck(true);
            } else {
                $scope.verifyAddOrder();
            }
        };
        $scope.verifyAddOrder = function() {
                //专车需要判断时间20分钟内和钱包余额
                if ($scope.typeParams.carType === 'special') {
                    //判断时间是否超时
                    var nowTime = new Date().getTime();
                    if ($scope.appointmentInfo.PickupTime - nowTime < 1200000) {
                        toast.showToast("上车时间已超时，请重新选择", 1500);
                        return false;
                    }
                    $scope.addOrder();
                    //判断钱包余额是否充足
                    /*appointmentService.GetWalletInfo({}, function(res) {
                        $scope.walletInfo = res.Data;
                        if ($scope.walletInfo.EnableBalance >= $scope.orderDetail.EstimatedActualPrice) {
                            $scope.addOrder();
                        } else {
                            $scope.derivative = $scope.orderDetail.EstimatedActualPrice - $scope.walletInfo.EnableBalance;
                            $scope.showRechargeF();
                            return false;
                        }
                    });*/
                } else {
                    $scope.addOrder();
                }
            }
            /**
             * 免费支付订单
             * @author duantingting@bestwise.cc 2017-06-23
             * @param  {[type]} BID [description]
             * @return {[type]}     [description]
             */
        $scope.payBooking = function(ID) {
                var params = {
                    bookingId: ID,
                    payMethod: 'WeChat',
                    payWay: 'Public'
                }
                appointmentService.PayBooking(params, function(reseponse) {
                    if (reseponse.Status == 1) {
                        toast.showToast("预约成功", 1000, function() {
                            $rootScope.bwTransition = true;
                            $rootScope.bwTransitionParmas = { name: 'orderDetail', parmas: { id: ID } };
                            $state.go('orderList');
                        });
                    } else {
                        //toast.showToast("预约失败", 1000);
                    }
                });
            }
            /**
             * 构建订单
             * @author duantingting@bestwise.cc 2017-06-23
             */
        $scope.addOrder = function() {
            // appointmentService.AddBooking({ BID: $scope.appointmentInfo.ID, UserData: { Longitude: $rootScope.userLocation.longitude, Latitude: $rootScope.userLocation.latitude } }, function(reseponse) {
            var pobj = {};
            $scope.appointmentInfo.UserData = {
                Longitude: $rootScope.userLocation.longitude,
                Latitude: $rootScope.userLocation.latitude
            };
            pobj = angular.copy($scope.appointmentInfo);
            if (pobj.PickupTime == "现在") {
                pobj.PickupTime = "";
            }
            appointmentService.AddBooking(pobj, function(reseponse) {
                if (reseponse.Status == 1 && reseponse.Data) {
                    $bw.addSession({ name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType, info: null });

                    if ($scope.typeParams.carType === 'carpooling') {
                        //如果是拼车
                        //预约成功 如果不需支付
                        if ($scope.orderDetail.ActualPrice === 0) {
                            $scope.payBooking(reseponse.Data);
                            return;
                        }
                        //预约成功 跳向支付页
                        $state.go('orderList.payOrder', { id: reseponse.Data });
                    } else {
                        //预约成功 如果不需支付
                        if ($scope.orderDetail.EstimatedActualPrice === 0) {
                            $scope.payBooking(reseponse.Data);
                            return;
                        }
                        $state.go('orderList.payOrder', { id: reseponse.Data });
                    }
                } else {
                    if (reseponse.Message === '订单已超时，请重新输入') {
                        $scope.getPrice(function() {
                            $scope.addOrder();
                        });
                    } else {
                        if (reseponse.Message === '有未支付订单,请先支付') {
                            toast.showConfirm({
                                sureWords: '去支付',
                                text: '您有未确认支付的订单，请先确认支付后再进行预约。',
                                sureFn: function() {
                                    $state.go("orderDetail", { id: reseponse.Data });
                                }
                            })
                        } else {
                            toast.showToast(reseponse.Message, 1500);
                        }
                    }
                }
            });
        };
        $('.select-driver-inpout').on('blur', function() {
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 100)
        })
        $scope.selectDriver = function(type) {
            $rootScope.showBlock = type;
            $rootScope.routerHide = type;
            $scope.showSelectDriver = type;
            if (type) {
                $(".select-driver-inpout").focus();
            }
            $scope.showSelectDriverTips = false;
        };
        $scope.unselectDriver = function($event) {
            $event.stopPropagation();
            toast.showConfirm({
                text: '您确定要删除指定司机吗？',
                sureFn: function() {
                    $scope.appointmentInfo.WantDriverCode = '';
                    $scope.appointmentInfo.diverCarNum = '';
                    $scope.getPrice();
                    $scope.$apply();
                }
            })
        };
        $scope.selectDriverInfo = { tips: '' };
        $scope.getSelectDriverInfo = function($event) {
            $event.stopPropagation();
            if (!$scope.diverInputCarNum) {
                toast.showToast('请输入司机编号或车牌号', 1500);
                return;
            }
            appointmentService.GetDriverInfoByLicense({
                license: $scope.diverInputCarNum
            }, function(reseponse) {
                if (reseponse.Status == 1) {
                    if (reseponse.Data) {
                        var thisDriverKey = 0
                        for (var i in $scope.carTypeList) {
                            if (reseponse.Data.CarTypeId == $scope.carTypeList[i].CarTypeId) {
                                thisDriverKey = i;
                            }
                        }

                        if ($scope.verifyMsg.sureValidNum > $scope.carTypeList[thisDriverKey].NumberOfSeats) {
                            toast.showTips('验证人数超过司机车型准载人数', function() {});
                            return;
                        }
                        $scope.appointmentInfo.WantDriverCode = reseponse.Data.Code;
                        $scope.appointmentInfo.diverCarNum = $scope.diverInputCarNum.toUpperCase();
                        $scope.diverInputCarNum = '';
                        $scope.appointmentInfo.CarTypeId = reseponse.Data.CarTypeId;
                        $scope.appointmentInfo.CarSeats = reseponse.Data.NumberOfSeats;
                        $scope.appointmentInfo.CarTypeName = reseponse.Data.CarTypeName;

                        $scope.selectDriver(false);


                        if ($bw.swiper.activeIndex == thisDriverKey) {
                            $scope.getPrice()
                        } else {
                            $bw.swiper.slideTo(thisDriverKey);
                        }

                    } else {
                        $scope.showSelectDriverTips = true;
                        $scope.appointmentInfo.WantDriverCode = '';
                        $scope.appointmentInfo.diverCarNum = '';
                        $scope.selectDriverInfo.tips = "司机不存在";
                    }
                } else {
                    $scope.appointmentInfo.WantDriverCode = '';
                    $scope.appointmentInfo.diverCarNum = '';
                }
                $bw.addSession({
                    name: 'appointmentInfo' + $scope.typeParams.stroke + $scope.typeParams.carType,
                    info: $scope.appointmentInfo
                });
            })

        };
        $scope.lookTiplsSpecial = function(type) {
            $(".swiper-container2 .swiper-slide-active").siblings().css("opacity", "0");
            if ($scope.typeParams.carType === 'special') {
                !$scope.isgetActivitySpSession && ($rootScope.showBlock = type)
            } else {
                !$scope.isgetActivityCpSession && ($rootScope.showBlock = type)
            }
            $scope.typeParams.showTipsSpecial = $rootScope.showBlock;
            if ($scope.showSelectFlight) {
                $rootScope.showBlock = true
            }
            if (!type && $scope.isgetRecentBookSession != 'false' && $scope.isgetRecentBook) {
                $scope.getRecent();
            }
        };

        // $scope.jiejiArea = new lArea();
        $scope.jiejiTerminal = function() {
            if (!$scope.jiejiArea) {
                $scope.jiejiArea = new lArea();
            }
            //航站楼选择插件 接机
            var pickUpParams = {
                'trigger': '#airportInputPickup',
                'data': $scope.chengduAirPort,
                type: 'string',
                callback: function(val) {
                    //选择航站楼
                    var obj = $scope.chengduAirPort[val[0]];
                    $scope.appointmentInfo.PickupAddress = obj.name;
                    $scope.appointmentInfo.PickupDetailAddress = obj.name;
                    $scope.appointmentInfo.PickupLongitude = obj.lng;
                    $scope.appointmentInfo.PickupLatitude = obj.lat;
                    $scope.$apply();
                }
            }
            $scope.jiejiArea.init(pickUpParams);
            $scope.setjiejisongjiDetault();
        };
        //构建送机航站楼选择器
        // $scope.songjiArea = new lArea();
        $scope.songjiTerminal = function() {
            if (!$scope.songjiArea) {
                $scope.songjiArea = new lArea();
            }
            //航站楼选择插件 送机
            var pickUpParams = {
                'trigger': '#airportInputDest',
                'data': $scope.chengduAirPort,
                type: 'string',
                callback: function(val) {
                    //选择航站楼
                    var obj = $scope.chengduAirPort[val[0]];
                    $scope.appointmentInfo.DestAddress = obj.name;
                    $scope.appointmentInfo.DestDetailAddress = obj.name;
                    $scope.appointmentInfo.DestLongitude = obj.lng;
                    $scope.appointmentInfo.DestLatitude = obj.lat;
                    $scope.$apply();
                }
            }
            $scope.songjiArea.init(pickUpParams);
            if ($scope.typeParams.carType) {

            }
            $scope.typeParams.carType || 'carpooling';
            $scope.setjiejisongjiDetault();

        };
        //通知栏滚动
        $scope.notificationScroll = function(dom) {
            var notification = document.getElementById(dom);
            var con1 = document.getElementById(dom + '1');
            var con2 = document.getElementById(dom + '2');
            if (!con1 && !con2) {
                return;
            }
            var mytimer1 = null;
            var mytimer = null;
            var time = 1000 / 60;
            var fontSize = document.getElementsByTagName("html")[0].style.fontSize;
            var step = Math.ceil((parseFloat(fontSize ? fontSize : '50')));

            con2.innerHTML = con1.innerHTML;

            function scrollUp() {
                if (notification.scrollTop >= con1.offsetHeight) {
                    notification.scrollTop = 0;
                } else {
                    if (notification.scrollTop % step == 0) {
                        console.log(notification.scrollTop % step)
                        clearInterval(mytimer);
                        clearTimeout(mytimer1);
                        mytimer1 = null;
                        mytimer1 = setTimeout(function() {
                            mytimer = setInterval(scrollUp, time);
                        }, 3000);
                    }
                    notification.scrollTop++;
                }
            }
            mytimer = setInterval(scrollUp, time);
        };
        //图片预加载
        $scope.preloadImg = function(list, imgs) {
            var def = $.Deferred(),
                len = list.length;
            $(list).each(function(i, e) {
                var img = new Image();
                img.src = e;
                if (img.complete) {
                    imgs[i] = img;
                    len--;
                    if (len == 0) {
                        def.resolve();
                    }
                } else {
                    img.onload = (function(j) {
                        $scope.eventPlan[j].isimg = true;
                        return function() {
                            imgs[j] = img
                            len--;
                            if (len == 0) {
                                def.resolve();
                            }
                        };
                    })(i);
                    img.onerror = function() {
                        len--;
                        console.log('fail to load image');
                    };
                }
            });
            return def.promise();
        };
        //获取通知栏信息
        $scope.getActivity = function() {
            appointmentService.getActivity({
                // AdType: 2,
                CarCategory: $scope.typeParams.carType === 'carpooling' ? 1 : 2
            }, function(res) {
                if (res.Status == 1) {
                    $scope.eventPlan = [];
                    var list = [];
                    var imgs = [];
                    for (var i = 0, len = res.Data.length; i < len; i++) {
                        if (res.Data[i].ExternalLinks) {
                            res.Data[i].toLink = res.Data[i].ExternalLinks;
                        } else if (res.Data[i].ContentLink) {
                            res.Data[i].toLink = ENV.img_url + res.Data[i].ContentLink;
                        } else {
                            res.Data[i].toLink = '';
                        }
                        if (res.Data[i].AdType == 2) { //公告列表
                            if ($scope.typeParams.carType === 'carpooling') {
                                $scope.activitsCp.push(res.Data[i]);
                            } else {
                                $scope.activitsSp.push(res.Data[i]);
                            }
                        }
                        if (res.Data[i].AdType == 1) { //活动列表
                            res.Data[i].isimg = false;
                            $scope.eventPlan.push(res.Data[i]);
                            list.push(ENV.img_url + res.Data[i].AdCover);
                        }
                    }
                    if ($scope.eventPlan.length > 0) {
                        $scope.lookTiplsSpecial(true);
                        $.when($scope.preloadImg(list, imgs)).done(
                            function() {
                                //预加载结束
                                if (!$scope.$$phase) {
                                    $scope.$apply();
                                }
                            }
                        );
                    } else {
                        $scope.isgetRecentBook && !$scope.isgetRecentBookSession && $scope.getRecent();
                    }
                }
            })
        };
        //获取最近的单子
        $scope.getRecent = function() {
            appointmentService.getRecentBooking({}, function(res) {
                if (res.Data) {
                    if (res.Data.Status == 'NotPaid') {
                        $scope.isgetRecentBook = false;
                        $bw.addSession({
                            name: 'isgetRecentBook',
                            info: 'false'
                        });
                        toast.showConfirm({
                            text: '您有订单待支付',
                            cancelWords: '关闭',
                            sureWords: '查看',
                            sureFn: function() {
                                $state.go('orderList.payOrder', {
                                    id: res.Data.BookingID
                                });
                            },
                            cancelFn: function() {}
                        });
                    } else if (res.Data.Status == 'Registered' || res.Data.Status == 'BookSuccess' || res.Data.Status == 'InHand' || res.Data.Status == 'Arrived') {
                        $scope.isgetRecentBook = false;
                        $bw.addSession({
                            name: 'isgetRecentBook',
                            info: 'false'
                        });
                        toast.showConfirm({
                            text: '您有订单在进行中',
                            cancelWords: '关闭',
                            sureWords: '查看',
                            sureFn: function() {
                                $state.go("orderDetail", {
                                    id: res.Data.BookingID
                                });
                            },
                            cancelFn: function() {}
                        });
                    }

                }
            });
        };

        (function() {
            var n = 3;
            var init = function() {
                    n--;
                    if (n <= 0) {
                        var createOrderNowType = $bw.getSession('createOrderNowType') || {};
                        $scope.switchStroke(createOrderNowType.stroke || 'songji');
                        $scope.switchCar(createOrderNowType.carType || 'special');
                        // //展示专车广告
                        // if (!$bw.getStorage('showTipsSpecial')) {
                        //     showTipsSpecial(true);
                        //     $bw.addStorage({ name: 'showTipsSpecial', info: 1 })
                        // }

                    }
                }
            appointmentService.GetUserInfo({}, function(response) {
                var data = window.userInfo;
                data.AccessToken = window._token;
                data.OpenId = response.Data.WeChatOpenId;
                data.IDCard = response.Data.IDCardNo;
                data.Phone = response.Data.Phone;
                $bw.loginUserInfo(data);
                $rootScope.userInfo = window.userInfo;
                init();
                setTimeout(function(){
                    //获取价格配置
                    appointmentService.GetPassengerSubsidyPrice({}, function(res) {
                        $rootScope.ENV.freePrice = res.Data.SubsidyPrice;
                        init();
                    });
                },50)
            })
            $scope.getCarType(function() {
                init();
            });
            // if ($rootScope.userInfo.IsRealValid) {
            //     init();
            // } else {
            
            // }

            //最近单子
            if (!$scope.isgetRecentBookSession && ($scope.isgetActivitySpSession == 'false' || $scope.isgetActivityCpSession == 'false')) {
                $scope.getRecent();
            }
            //座位选择插件
            var area = new lArea();
            var seatJson = [{ id: 1, name: '需要1个座位' }, { id: 2, name: '需要2个座位' }, { id: 3, name: '需要3个座位' }, { id: 4, name: '需要4个座位' }, { id: 5, name: '需要5个座位' }, { id: 6, name: '需要6个座位' }];
            area.init({
                'trigger': '#seat',
                'data': seatJson,
                type: 'string',
                callback: function(val) {
                    //选择座位
                    var num = seatJson[val[0]].id;
                    if (num < $scope.verifyMsg.sureValidNum) {
                        toast.showToast('您已经成功验证了' + $scope.verifyMsg.sureValidNum + '人, 请至少选择' + $scope.verifyMsg.sureValidNum + '个座位', 1500);
                    } else {
                        $scope.showSeatList(num);
                        $scope.$apply();
                    }

                }
            });

        })();

    }])