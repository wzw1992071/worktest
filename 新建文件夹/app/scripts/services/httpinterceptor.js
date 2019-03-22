angular.module('bw.services')
    .factory('httpInterceptor', ['$q', '$injector', '$rootScope', function($q, $injector, $rootScope) {
        return {
            'request': function(config) {
                if (config.isLoading !== false) config.loadingId = $injector.get("toast").showLoading();
                extendHeaders(config);
                return config;
            },
            'requestError': function(rejection) {
                if (rejection.config.isLoading !== false) $injector.get("toast").hideLoading(rejection.config.loadingId);
                return $q.reject(rejection);
            },
            'response': function(response) {
                if (response.config.isLoading !== false) $injector.get("toast").hideLoading(response.config.loadingId);

                if (response.data.Status === 0 && response.config.isTips !== false) $injector.get("toast").showToast(response.data.Message, 2000);

                if (response.data.Status == -1 || response.data.Status == 401) {
                    var u = $bw.getStorage('bwUserInfo');
                    if (!u.IsNewUser) {
                        // $injector.get("toast").showToast('登录已过期，请刷新后请重试。', 1500);
                        // $bw.logoOut();
                        // $bw.jumpWxGetCode(false);
                    }
                }
                if (response.data.Status == 403) {
                    $injector.get("toast").showToast('设备重复登录。', 1500);
                    $bw.logoOut();
                    $bw.jumpWxGetCode(false);
                }
                if (response.data.Message === '未找到用户！' || response.data.Message === "出现错误,请重新登陆") {
                    $bw.logoOut();
                    $bw.jumpWxGetCode(true);
                }
                return response || $q.when(response);
            },
            'responseError': function(rejection) {
                if (rejection.config.isLoading !== false) {
                    $injector.get("toast").hideLoading(rejection.config.loadingId);

                }
                if ((rejection.data && rejection.data.Status == -1) || rejection.status == 401) {
                    // if (debug) {
                    //     return;
                    // }
                    var u = $bw.getStorage('bwUserInfo');
                    if (!u || !u.IsNewUser) {
                        // $injector.get("toast").showToast('登录已过期，请刷新后请重试。', 1500);
                        // $bw.logoOut();
                        // $bw.jumpWxGetCode(false);
                    }
                } else {
                    $injector.get("toast").showToast('网络错误', 1500);
                }
                return rejection || $q.when(rejection);
                //return $q.reject(rejection);
            }
        };

        /** 
         *config: 请求配置信息
         */
        function extendHeaders(config) {
            config.headers = config.headers || {};
            config.headers['ClientType'] = window.ClientType;
            config.headers['Authorization'] = "Bearer " + window._token;
            if ($rootScope.selectedCity.CityIdentity) {
                config.headers['CityIdentity'] = $rootScope.selectedCity.CityIdentity;
            }
        };

    }]);