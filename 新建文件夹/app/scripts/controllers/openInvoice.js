// 开具发票
angular.module('bw.controller')
    //首页
    .controller('openInvoice', ['$scope', '$rootScope', '$state', 'baseService', 'appointmentService', '$q', function($scope, $rootScope, $state, baseService, appointmentService, $q) {
        // $state.go('orderDetail', { id: $scope.orderDetail.BookingID });
        // $scope.goRouter=funtion(){

        // }
        
        $scope.goRouter=function(rooter){
            $state.go(rooter);
        }
    }])