//绑定手机
angular.module('bw.controller')
    .controller('bindPhone', ['$scope', '$state', '$rootScope', 'baseService', 'appointmentService', 'toast', function($scope, $state, $rootScope, baseService, appointmentService, toast) {
        $scope.phone = '';
        $scope.getCaptchaWords = '获取验证码';
        $scope.time = 0;
        if (window.userInfo && window.userInfo.phone) {
            history.replaceState(null, null, './index.html#createOrder');
            window.location.reload();
            //$state.go('createOrder');
            return;
        }

        function validPhone() {
            if ($scope.phone === '') {
                toast.showToast("请输入手机号码", 1500);
                return false;
            }
            if (!baseService.validatemobile($scope.phone)) {
                toast.showToast("手机号码无效", 1500);
                return false;
            }
            return true;
        }
        //获取验证码
        $scope.getCaptcha = function() {
            if ($scope.time > 0) return false;
            if (!validPhone()) return false;
            //验证码接口
            appointmentService.SendValidSMS({ PhoneNumber: $scope.phone }, function(reseponse) {
                if (reseponse.Status == 1) {
                    //设置倒计时
                    $scope.time = 59;
                    $scope.getCaptchaWords = $scope.time + '秒以后重试';
                    var interval = setInterval(function() {
                        $scope.time--;
                        $scope.getCaptchaWords = $scope.time + '秒以后重试';
                        if ($scope.time <= 0) {
                            clearInterval(interval);
                            $scope.getCaptchaWords = '获取验证码';
                        }
                        $scope.$apply();
                    }, 1000);
                } else {
                    //toast.showToast('验证码发送失败', 1500);
                }
            });
        }
        $scope.bindPhone = function() {
            try {
                if (!validPhone()) return false;
                if ($scope.captcha === '') {
                    toast.showToast("请输入验证码", 1500);
                    return false;
                }
                var params = {
                    "PhoneNumber": $scope.phone,
                    "ValidateCode": $scope.captcha,
                    "UserData": { Longitude: $rootScope.userLocation.longitude, Latitude: $rootScope.userLocation.latitude },
                    "OpenId": '',
                    "ClientId": ''
                }
                if ($bw.isWxAndH5()) {
                    if ($bw.isWx()) {
                        toast.showToast("231", 1500);
                        params.OpenId = window.userInfo && window.userInfo.openId ? window.userInfo.openId : '';
                        params.ClientId = "wechat";
                        // params.ClientId = "";
                    } else {
                        params.ClientId = "CHHTML5";
                    }
                }

                appointmentService.LoginWithSMS(params, function(reseponse) {
                    if (reseponse.Status == 1 && reseponse.Data) {
                        var data = reseponse.Data;
                        $bw.loginUserInfo(data);
                        //设置默认选择城市
                        $bw.setSeclectedInitCity($rootScope, data);
                        $bw.addStorage({
                            name: 'selectedCity',
                            info: $rootScope.selectedCity
                        })
                        contactApp('AppBridgeSaveToken', { token: window._token }, function() {});
                        $rootScope.IsNewUser = data.IsNewUser;
                        if ($bw.isWx()) wxLoginLoad(data);
                        toast.showToast('登录成功', 1500, function() {
                            history.replaceState(null, null, './index.html#createOrder');
                            window.location.reload();
                            return;
                            //$state.go('createOrder');
                        });
                    } else {
                        toast.showToast(reseponse.Message, 1500);
                    }
                });
            } catch (error) {
                toast.showToast(error, 3000);
            }
        }

        function wxLoginLoad(data) {

        }
    }])