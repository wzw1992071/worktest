 //支付页面
 angular.module('bw.controller')
     .controller('payOrder', ['$scope', 'toast', '$state', 'baseService', 'appointmentService', '$stateParams', '$rootScope', function($scope, toast, $state, baseService, appointmentService, $stateParams, $rootScope) {
         var isWayPayBack = $bw.getSession('isWayPayBack');
         $scope.orderDetail = {};
         $scope.payWayList = [];
         if ($bw.isWx()) {
             $scope.payWayList.push({ name: '微信支付', img: "./imgs/pay-wx.png", payMethod: 'WeChat', payWay: 'Public', select: false })
         } else {
             $scope.payWayList.push({ name: '支付宝支付', img: "./imgs/pay-ali.png", payMethod: 'AliPay', payWay: 'Public', select: false })
         }
         $scope.typeParams = {};
         $scope.isInvalidation = false;
         $scope.showPay = false;
         $scope.isSongji = false;
         $scope.isJieji = false;
         $scope.showCancelBtn = true;
         //取消订单
         $scope.cancelOrder = function() {
             //$state.go('cancel', { id: $scope.orderDetail.BookingID });
             window.location.href = window.ENV.publicUrl + "/cancelOrder.html?timeStr=" + new Date().getTime() + "&id=" + $scope.orderDetail.BookingID + "&cityId=" + ($scope.orderDetail.CityId || $rootScope.selectedCity.CityId)
         };
         $scope.pay = function() {
             var params = {
                 bookingId: $scope.orderDetail.BookingID,
                 payMethod: $scope.payParams.payMethod,
                 payWay: $scope.payParams.payWay,
                 returnUrl: window.location.href
             }
             payBooking(params);
         }
         $scope.$on('$destroy', function() {
             $scope.$emit('showMine', {});
         });
         /**
          * 选择支付方式
          * @Author duan     2017-08-08T16:48:47+0800
          * @param  {[type]} app                      [description]
          * @return {[type]}                          [description]
          */
         $scope.selectPayWay = function(app) {
             if (app.payMethod === 'Wallet' && $scope.walletInfo.EnableBalance < $scope.orderDetail.ActualPrice) {
                 toast.showToast("钱包可用余额不足", 1000);
                 return;
             }
             for (var i in $scope.payWayList) {
                 $scope.payWayList[i].select = false
             }
             app.select = true;
             $scope.payParams = { payMethod: app.payMethod, payWay: app.payWay };
         }
         $scope.selectPayWay($scope.payWayList[0]);


         /**
          * 发起支付
          * @Author duan     2018-08-09T15:46:40+0800
          * @param  {[type]} params                   [description]
          * @return {[type]}                          [description]
          */
         function payBooking(params) {

             appointmentService.PayBooking(params, function(reseponse) {
                 if (reseponse.Status == 1) {
                     //如果是免费支付订单或者钱包支付
                     if (reseponse.Data === 'Paid') {
                         toast.showToast("支付成功", 1000, function() {
                             $state.go('orderDetail', { id: $scope.orderDetail.BookingID });
                         });
                         return;
                     }
                     //如果是付费订单 调起支付
                     var wechatPayInfo = {}
                     if ($bw.isWx()) {
                         var data = '';
                         eval('data=' + reseponse.Data);
                         wechatPayInfo = {
                             "appId": data.appId, //公众号名称，由商户传入     
                             "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数     
                             "nonceStr": data.nonceStr, //随机串     
                             "package": data.package,
                             "signType": "MD5", //微信签名方式：     
                             "paySign": data.paySign, //微信签名 
                             "bookingId": params.bookingId //订单id
                         };
                     } else {
                         wechatPayInfo = reseponse.Data;
                     }

                     $bw.addSession({ name: 'wxpayInfo', info: wechatPayInfo });
                     $state.go('wxpay');
                     return;
                 } else {
                     //toast.showToast("支付失败：" + reseponse.Message, 1500);
                 }
             });
         }
         /**
          * 获取钱包信息
          * @Author duan     2017-07-31T17:46:21+0800
          * @return {[type]} [description]
          */
         function getWalletInfo() {
             appointmentService.GetWalletInfo({}, function(res) {
                 $scope.walletInfo = res.Data;
             });
         }
         getWalletInfo();
         /**
          * 获取专车车型
          * @Author duan       2018-08-09T15:42:19+0800
          * @param  {Function} callback                 [description]
          * @return {[type]}                            [description]
          */
         function getCarType(callback) {
             appointmentService.GetCarTypes({
                 //  serviceType: 2
             }, function(res) {
                 if (res.Data) {
                     $scope.carType = {};
                     for (var i in res.Data) {
                         $scope.carType[res.Data[i].CarTypeId] = res.Data[i].CarTypeName;
                     }
                 }
             });
         }
         getCarType();
         /**
          * 获取订单详情
          * @Author duan     2018-08-09T15:42:30+0800
          * @return {[type]} [description]
          */
         function getDetail() {

             appointmentService.GetDetail({ bookingId: $stateParams.id }, function(reseponse) {
                 $scope.$emit('showPay', {});
                 $bw.addSession({ name: 'isWayPayBack', info: 'false' });
                 if (reseponse.Status == 1 && reseponse.Data) {
                     var status = reseponse.Data.Status;
                     if (reseponse.Data.TripType == 2) {
                         $scope.isSongji = true;
                     } else {
                         $scope.isJieji = true;
                     }
                     if (status !== 'NotPaid' && status !== 'Invalidation') {
                         //如果订单已支付
                         if (isWayPayBack === 'true') {
                             $state.go('orderDetail', { id: $stateParams.id });
                         } else {
                             $scope.showPay = false;
                             $scope.$emit('showMine', {});
                         }
                         return;
                     } else {
                         $scope.showPay = true;
                         baseService.setTitle('确认支付');
                     }
                     if (status === 'Invalidation') {
                         $scope.isInvalidation = true;
                         baseService.setTitle('订单失效');
                     }
                     $scope.orderDetail = reseponse.Data;

                     //计算支付剩余时间

                     $scope.differenceTime = reseponse.Data.ExpireAt - reseponse.Data.CurrentTime;
                     var payTimeInterval = setInterval(function() {
                         if ($scope.differenceTime <= 0) {
                             clearInterval(payTimeInterval);
                             $scope.differenceTime = 0;
                             $scope.isInvalidation = true;
                         } else {
                             $scope.differenceTime -= 1000;
                         }

                         $scope.$apply();
                     }, 1000);
                     if ($scope.differenceTime <= 0) {
                         clearInterval(payTimeInterval);
                         $scope.differenceTime = 0;
                         $scope.isInvalidation = true;
                     }

                     //  var difference = reseponse.Data.ExpireAt - reseponse.Data.CurrentTime;


                     //  $scope.differenceTime = difference + 1493136000000;

                     //  var payTimeInterval = setInterval(function() {
                     //      if ($scope.differenceTime <= 1493136000000) {
                     //          clearInterval(payTimeInterval);
                     //          $scope.differenceTime = 0;
                     //          $scope.isInvalidation = true;
                     //      } else {
                     //          $scope.differenceTime -= 1000;
                     //      }

                     //      $scope.$apply();
                     //  }, 1000)
                     //  if ($scope.differenceTime <= 1493136000000) {
                     //      clearInterval(payTimeInterval);
                     //      $scope.differenceTime = 0;
                     //      $scope.isInvalidation = true;
                     //  }
                 } else {

                 }

             });
         }
         getDetail();
         document.addEventListener('visibilitychange', function() {
             if (document.visibilityState == 'visible') {
                 if (location.href.indexOf("payOrder") >= 0) {
                     location.reload(true);
                 }
             }
         })
         document.addEventListener('webkitvisibilitychange', function() {
             if (document.webkitVisibilityState == 'visible') {
                 if (location.href.indexOf("payOrder") >= 0) {
                     location.reload(true);
                 }
             }
         })
     }])