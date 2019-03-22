//我的行程
angular.module('bw.controller')
    .controller('orderList', ['$scope', '$rootScope', '$state', 'baseService', 'appointmentService', '$q', function($scope, $rootScope, $state, baseService, appointmentService, $q) {
        $scope.showNoMore = false;
        $scope.noMessage = false;
        $scope.showOrderList = false;
        $scope.listParams = {
            "PageIndex": 0,
            "PageSize": 7,
            "IsPaged": true
        };
        $scope.orderList = [];
        $scope.setShowStatusName = function(obj) {
            if (obj.Status === 'BookSuccess') {
                if (obj.ServiceType == '2') {
                    return '等待接驾';
                } else {
                    if (obj.TripType == '2') {
                        return '等待接驾';
                    } else {
                        if (obj.ChildStatus === 'Aboard') {
                            return '等待发车';
                        } else {
                            return '等待上车';
                        }
                    }
                }

            } else if (obj.Status === 'Arrived' && (obj.ChildStatus === 'NotPaid' || obj.ChildStatus === 'PartPaid')) {
                return '已到达-未支付';
            } else if (obj.Status === 'NotPaid' && obj.ExpireAt - obj.CurrentTime <= 0) {
                return '已失效';
            } else {
                return $scope.dicts['BookState'][obj.Status].ItemValue;
            }
        }
        $scope.setInfiniteParams = function() {
            if ($scope.TotalPageCount >= $scope.infinite.page) {
                $scope.infinite.busy = false;
                $scope.infinite.page += 1;
            } else {
                if ($scope.infinite.page == 1) {
                    $scope.noMessage = true
                } else {
                    $scope.showNoMore = true;
                }
            }
        }
        $scope.getOrderList = function(page, callback) {
            $scope.listParams.PageIndex = page;
            appointmentService.GetBookings($scope.listParams, function(reseponse) {
                $scope.TotalPageCount = reseponse.Data.TotalPageCount;
                if (reseponse.Status == 1 && reseponse.Data) {
                    var items = reseponse.Data.Items;
                    for (var i in items) {
                        items[i].showStatusName = $scope.setShowStatusName(items[i]);
                        $scope.orderList.push(items[i]);
                    }
                    $scope.setInfiniteParams()
                    if (callback) callback();
                }
            });
        };

        $scope.goDetail = function(data) {
            switch (data.Status) {
                case 'NotPaid': //待支付
                    $scope.showOrderList = false;
                    $state.go('orderList.payOrder', { id: data.BookingID });
                    break;
                case 'Invalidation': //失效
                    $scope.showOrderList = false;
                    $state.go('orderList.payOrder', { id: data.BookingID });
                    break;
                case 'Cancel': //已取消
                    //$state.go('cancel', { id: data.BookingID });
                    window.location.href = window.ENV.publicUrl + "/cancelOrder.html?timeStr=" + new Date().getTime() + "&id=" + data.BookingID + "&cityId=" + (data.CityId || $rootScope.selectedCity.CityId)
                    break;
                case 'Overdue': //已过期
                    $scope.showOrderList = false;
                    $state.go('orderList.orderInvalid', { id: data.BookingID });
                    break;
                case 'Completed': //已完成
                    if (data.IsComment) {
                        window.location.href = window.ENV.publicUrl + "/evaluate.html?timeStr=" + new Date().getTime() + "&id=" + data.BookingID + "&cityId=" + (data.CityId || $rootScope.selectedCity.CityId)
                    } else {
                        $state.go("orderDetail", { id: data.BookingID });
                    }
                    break;
                default:
                    $state.go("orderDetail", { id: data.BookingID });
                    break;
            }
        }
        $scope.showOrderList = true;
        $rootScope.GetDicts(function() {
            window.onscroll = function() {
                if ($scope.infinite.busy === true) return;
                if ($scope.showOrderList === false) return;
                if ($bw.getScrollTop() > 0 && ($bw.getScrollTop() + $bw.getWindowHeight() >= $bw.getScrollHeight() - 50)) {
                    $scope.infinite.busy = true;
                    $scope.getOrderList($scope.infinite.page, false);
                }
            };
            $scope.infinite = {
                page: 1,
                busy: false,
            }
            $scope.getOrderList($scope.infinite.page, false);
        });

        $scope.$on('showPay', function(e, data) {
            $scope.showOrderList = false;
        });
        $scope.$on('showMine', function(e, data) {
            $scope.showOrderList = true;
        });
        $scope.$on('$destroy', function() {
            window.onscroll = null
        });

        /*$scope.onReload = function() {
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(true);
            }, 1000);
            return deferred.promise;
            //window.location.reload();
        };*/

        //状态改变
        $scope.$on('signalrInfo', function(e, res) {
            var data = res.Data;
            console.info(data);
            for (var i in $scope.orderList) {
                if ($scope.orderList[i].BookingId && $scope.orderList[i].BookingId.toUpperCase() === data.BookingId.toUpperCase()) {
                    $scope.orderList[i].Status = data.Status;
                    $scope.orderList[i].StatusName = data.StatusName;
                    $scope.orderList[i].showStatusName = $scope.setShowStatusName($scope.orderList[i]);
                    $scope.orderList[i].cancelStatus = setCancelStatus($scope.orderList[i]);
                    $scope.$apply();
                    break;
                }
            }
        });

        //下滑刷新调用
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            if ($scope.myBwSlideDown) return;
            $scope.myBwSlideDown = new bwSlideDown();
            $scope.myBwSlideDown.init("content", "y", 'order-list-down', function(callback) {
                $scope.myBwSlideDown = false;
                $scope.noMessage = false;
                $scope.showNoMore = false;
                $scope.infinite.page = 1;
                $scope.orderList = [];
                $scope.getOrderList(1, callback);
            });
        });

        //如果websokit没有启用 开启websokit;

        if ($bw.websolitStart === false) {
            $bw.loadJS('bower_components/signalR/signalr_core.js', function() {
                $bw.websokitFn($scope.$parent);
            })
        }
    }])