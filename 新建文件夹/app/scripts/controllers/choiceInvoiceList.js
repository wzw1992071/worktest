//选择开票行程
angular.module('bw.controller')
    //首页
    .controller('choiceInvoiceList', ['$scope', '$rootScope', '$state', 'baseService', 'appointmentService', '$q', function($scope, $rootScope, $state, baseService, appointmentService, $q) {
        $scope.historyList=[];
        // 页面显示数据
        $scope.pageData={
            isALLcheck:false,
            historyList:[],
            checkTotal:0,
            checkNumber:0,
            totalMoney:0
        }
        $scope.checkList = [] //选中数据
        $scope.allCheckList = [] //全选中数据
        // 点击选择功能
        $scope.checkF = function(item){
            item.ischeck = !item.ischeck;
            if(item.ischeck){
                $scope.checkList.push(item.BookingID)
            }else{
                baseService.removeArray($scope.checkList,item.BookingID)
            }
            if($scope.checkList.length == $scope.allCheckList.length){
                $scope.pageData.isALLcheck=true
            }else{
                $scope.pageData.isALLcheck=false
            }
            console.log($scope.allCheckList)
        }
        // 全选功能
        $scope.ALLcheckF = function(vale){
            if($scope.pageData.historyList.length==0) return;
            $scope.pageData.isALLcheck = !$scope.pageData.isALLcheck;
            var value =  $scope.pageData.isALLcheck;
            $scope.pageData.historyList.forEach((item,index)=> {
                item.ischeck = value;
                if(value){
                    $scope.pageData.totalMoney += item.PaidPrice;
                }
            });
            $scope.pageData.checkNumber = value?$scope.pageData.historyList.length:0;
            $scope.checkList = value?$scope.allCheckList:[]
        }
        $scope.goRouter=function(rooter){
            $state.go(rooter);
        }
        $scope.getData = function(){
            appointmentService.invoiceOrderList({},function(res){
                if (res.Status == 1 && res.Data) {
                    res.Data.forEach(function(item){
                        item.ischeck = false;
                        $scope.allCheckList.push(item.BookingID)
                    })
                    $scope.pageData.historyList = res.Data;
                    $scope.pageData.isALLcheck = false
                }
            })
        }
        // 页面加载
        $scope.getData()
    }])