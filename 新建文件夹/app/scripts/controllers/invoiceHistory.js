// 开具发票
angular.module('bw.controller')
    //首页
    .controller('invoiceHistory', ['$scope', '$rootScope', '$state', 'baseService', 'appointmentService', '$q', function($scope, $rootScope, $state, baseService, appointmentService, $q) {
        $scope.showNoMore = false;//是否显示
        $scope.noMessage = false;
        $scope.showInvoiceList = false;
        $scope.listParams = {
            "PageIndex": 0,
            "PageSize": 7,
            "IsPaged": true
        };
        $scope.invoiceList = [{id:112},{id:111},{id:114},{id:151},{id:1116},{id:1711},{id:8111},{id:9111},{id:1011}];
        $scope.$on('$destroy', function() {
            window.onscroll = null
        });
        // 获取开票历史列表
        $scope.getInvoiceList=function(page,callback){
            // appointmentService.GetInvoiceHistory($scope.listParams, function(reseponse) {
            //     if (reseponse.Status == 1 && reseponse.Data) {
            //         $scope.setInfiniteParams()
            //         if (callback) callback();
            //     }
            // });
        }
        // 判断是否还有数据
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
        // 到底获取下一页数据
        $rootScope.GetDicts(function() {
            window.onscroll = function() {
                if ($scope.infinite.busy === true) return;
                if ($scope.showInvoiceList === false) return;
                if ($bw.getScrollTop() > 0 && ($bw.getScrollTop() + $bw.getWindowHeight() >= $bw.getScrollHeight() - 50)) {
                    $scope.infinite.busy = true;
                    $scope.getInvoiceList($scope.infinite.page, false);
                }
            };
            $scope.infinite = {
                page: 1,
                busy: false,
            }
            $scope.getInvoiceList($scope.infinite.page, false);
        });
        $scope.showInvoiceList = true;
        //下滑刷新调用
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            if ($scope.myBwSlideDown) return;
            
            $scope.myBwSlideDown = new bwSlideDown();
            $scope.myBwSlideDown.init("content", "y", 'invoice-list-down', function(callback) {
                $scope.myBwSlideDown = false;
                $scope.noMessage = false;
                $scope.showNoMore = false;
                $scope.infinite.page = 1;
                $scope.orderList = [];
                $scope.getInvoiceList(1, callback);
            });
        });
        // 路由跳转
        $scope.goDetail=function(data){
            if(!data) return;
            $state.go("invoiceDetail", { id: data.id });
        }
    }])