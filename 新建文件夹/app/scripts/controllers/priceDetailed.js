//付费详情控制器
angular.module('bw.controller')
    .controller('priceDetailed', ['$scope', '$state', '$stateParams', 'baseService', 'appointmentService', '$rootScope', function($scope, $state, $stateParams, baseService, appointmentService, $rootScope) {
        if ($state.current.name === 'createOrder.priceDetailed' && !$scope.$parent.typeParams.isAllow) {
            window.location.href = ENV.url + "/#/createOrder";
            return;
        }
        $scope.$emit('showPay', {});
        $scope.$on('$destroy', function() {
            $scope.$emit('showMine', {});
        });
        $scope.PriceDetaileInfo = {};
        $scope.typeParams = {};
        $scope.show = function() {
            if (!$scope.$parent.orderDetail) return;
            if ($scope.$parent.orderDetail.Status == "Completed") $scope.isPayEva = true;
            $scope.payList = $scope.$parent.orderDetail.PayableInfoList;
            for (var i in $scope.payList) {
                switch ($scope.payList[i].PayMethod) {
                    case 'WeChat':
                        $scope.payList[i].PayWay = '微信支付';
                        break;
                    case 'AliPay':
                        $scope.payList[i].PayWay = '支付宝支付';
                        break;
                    case 'Aallet':
                        $scope.payList[i].PayWay = '钱包支付';
                        break;
                    default:
                        $scope.payList[i].PayWay = '微信支付';
                        break;
                }
            }
            var Passengers = $scope.$parent.orderDetail.Passengers;
            var freeNum = 0;
            var freePrice = 0;
            var freePriceTwo = 0;
            var discountPrice = 0;

            for (var j in Passengers) {
                if (Passengers[j].HasBooked === false && Passengers[j].IsValid === true) {
                    freeNum++;
                    freePrice += Passengers[j].Price;
                }
            }
            $scope.PriceDetaileInfo.freeNum = freeNum;
            if (freePrice != 0) {
                freePriceTwo = '-' + freePrice.toFixed(2);
            } else {
                freePriceTwo = freePrice.toFixed(2);
            }
            $scope.PriceDetaileInfo.freePriceTwo = freePriceTwo;
            discountPrice = $scope.$parent.orderDetail.TotalPrice - $scope.$parent.orderDetail.ActualPrice - freePrice;

            if (discountPrice != 0) {
                discountPrice = '-' + discountPrice.toFixed(2);
            } else {
                discountPrice = discountPrice.toFixed(2);
            }
            $scope.PriceDetaileInfo.discountPrice = discountPrice;


            //获取拼车还是专车  
            if ($scope.$parent.orderDetail.ServiceType == '1') {
                //如果是拼车
                $scope.typeParams.carType = 'carpooling';
            } else {
                $scope.typeParams.carType = 'special';
                $scope.PriceRule = $scope.$parent.orderDetail.PriceRule;
                if ($scope.$parent.orderDetail.BookingID) {
                    $scope.PayableInfoList = $scope.$parent.orderDetail.PayableInfoList;
                    $scope.bookingExtPrice = $scope.$parent.orderDetail.BookingExt;

                } else {
                    var estimated = $scope.$parent.orderDetail.BookingExt;
                    $scope.bookingExtPrice = {
                        StartingPrice: estimated.StartingPrice,
                        ActualTime: estimated.EstimatedTime,
                        ActualTimeFee: estimated.EstimatedTimeFee,
                        ActualMile:estimated.EstimatedMile,
                        ActualMileFee: estimated.EstimatedMileFee,
                        ActualFarMile:estimated.EstimatedFarMile,
                        ActualFarMileFee: estimated.EstimatedFarMileFee,
                        ActualNightMile:estimated.EstimatedNightMile,
                        ActualNightMileFee: estimated.EstimatedNightMileFee,
                        SubsidyFee: estimated.SubsidyFee,
                        ActualPriceOffset: estimated.EstimatedPriceOffset
                    }
                    $scope.$parent.orderDetail.ActualPrice = $scope.$parent.orderDetail.EstimatedActualPrice;
                }
                //如果是专车 显示差价还是费用详情 
                $scope.typeParams.isDerivative = false;
                if ($scope.$parent.orderDetail.NotPaidPrice > 0) $scope.typeParams.isDerivative = true;
                if ($scope.typeParams.isDerivative) baseService.setTitle('差价明细');
            }

        }
        $scope.showValuationRules = function() {
            if ($scope.$parent.orderDetail.ServiceType == '1') {
                window.location.href = window.ENV.publicUrl + "/phonePriceRole.html?timeStr=" + new Date().getTime() + "&cityId=" + $rootScope.selectedCity.CityId;
                return;
            } else {
                window.location.href = window.ENV.publicUrl + "/phonePriceRoleSpecial.html?timeStr=" + new Date().getTime() + "&cityId=" + $rootScope.selectedCity.CityId;
                return;
            }

        };
        $scope.$on('GetDetail', function(res) {
            $scope.show();
        })
        $rootScope.GetDicts(function() { $scope.show(); });

    }])