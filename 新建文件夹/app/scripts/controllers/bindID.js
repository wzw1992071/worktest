 //绑定身份证
 angular.module('bw.controller')
     .controller('bindID', ['$scope', '$state', 'baseService', 'appointmentService', 'toast', function($scope, $state, baseService, appointmentService, toast) {
         $scope.IsRealValid = false;
         if (window.userInfo.IsRealValid) $scope.IsRealValid = true;
         $scope.bindInfo = {
             Name: '',
             IDCard: ''
         };
         $scope.bindID = function() {
             if ($scope.bindInfo.Name === '') {
                 toast.showToast("姓名不能为空", 1500);
                 return;
             }
             if ($scope.bindInfo.IDCard === '') {
                 toast.showToast("身份证号不能为空", 1500);
                 return;
             }
             if (/^[\u4E00-\u9FA5]*$/.test($scope.bindInfo.Name) === false) {
                 toast.showToast("姓名只能输入中文", 1500);
                 return;
             }
             appointmentService.ValidRealIDCard($scope.bindInfo, function(reseponse) {
                 if (reseponse.Status == 1) {
                     var str = $scope.bindInfo.IDCard;
                     if (reseponse.Data.Result) {
                         window.userInfo.IsRealValid = true;
                         window.userInfo.IDCard = str;
                         window.userInfo.Name = reseponse.Data.RealName;
                         window.userInfo.hiddenIDCard = str.substr(0, 4) + '**********' + str.substr(-4, 4);
                         $bw.addStorage({
                             name: 'bwUserInfo',
                             info: window.userInfo
                         });
                         toast.showToast("认证成功", 1500, function() {
                             $state.go('createOrder');
                         });
                     } else {
                         toast.showToast(reseponse.Data.Reason, 1500);
                     }
                 }
             });
         };
         $scope.jump = function() {
             $state.go('createOrder');
         };
         $scope.IDCardChange = function() {
             if (/^[\dxX]*$/.test($scope.bindInfo.IDCard) === false) {
                 $scope.bindInfo.IDCard = $scope.bindInfo.IDCard.substr(0, $scope.bindInfo.IDCard.length - 1);
             }
         };
         $scope.nameChange = function() {

         };
     }])