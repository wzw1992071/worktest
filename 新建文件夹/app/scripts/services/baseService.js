// 自定义指令
angular.module("bw.directive")
    .directive('touchBg', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.bind("touchstart", function() {
                    element.attr('style', 'background-color:#eee');
                });
                element.bind("touchend", function() {
                    element.attr('style', '');
                });
            }
        };
    })
    .directive('onFinishRenderFilters', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }])
    .directive('onFinishRenderActivity', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinishedActivity');
                    });
                }
            }
        };
    }])
    .directive('onFinishRender', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinishedScroll');
                    });
                }
            }
        };
    }])
    .directive('showUserCenter', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            replace: true,
            template: '<div class="user-center-icon"><img src="./imgs/user-center.png" alt=""></div>',
            link: function(scope, element, attrs, ctrl) {
                element.bind("touchend", function() {
                    $rootScope.showUserCenter = true;
                    $rootScope.showBlock = true;
                    scope.$apply();
                });
            }
        }
    }])
    // 输入框上移
    .directive('inputMove', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.bind('focus', function() {
                    var h = element.offset().top;
                    setTimeout(function() {
                        document.body.scrollTop = h;
                    }, 500);
                });
            }
        }
    })
    // 输入框点击去掉placehodler
    .directive('inputPlaceholder', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.attr('placeholder', attr.inputPlaceholder);
                element.bind('focus', function() {
                    element.attr('placeholder', "");
                });
                element.bind('blur', function() {
                    element.attr('placeholder', attr.inputPlaceholder);
                });
            }
        }
    })
    //验证用户界面座位选择
    .directive('checkUserArea', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var area = new lArea();
                var seatJson = [{ id: 1, name: '需要1个座位' }, { id: 2, name: '需要2个座位' }, { id: 3, name: '需要3个座位' }, { id: 4, name: '需要4个座位' }, { id: 5, name: '需要5个座位' }, { id: 6, name: '需要6个座位' }];
                area.init({
                    'trigger': '#check-seat',
                    'data': seatJson,
                    type: 'string',
                    callback: function(val) {
                        //选择座位
                        scope.showSeatList(seatJson[val[0]].id);
                        scope.$apply();
                    }
                });
            }
        }
    })
    .directive('dateFormat', ['$filter', function($filter) {
        var dateFilter = $filter('date')(date, 'MM月dd日');
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                function formatter(value) {
                    return dateFilter(value, 'MM月dd日'); //format
                }

                function parser() {
                    return ctrl.$modelValue;
                }

                ctrl.$formatters.push(formatter);
                ctrl.$parsers.unshift(parser);

            }
        };
    }])



angular.module("bw.services")
    .factory("baseService", ['$state', '$rootScope', '$cookieStore', '$resource', function($state, $rootScope, $cookieStore, $resource) {
        var baseService = {
            /**验证手机号
             * [validatemobile description]
             * @param  {[type]}   mobile   [description]
             * @param  {Function} callback [description]
             * @return {[type]}            [description]
             */
            validatemobile: function(mobile) {
                var myreg = /^[0-9]{11}$/;
                if (!myreg.test(mobile)) {
                    return false;
                } else {
                    return true;
                }
            },
            /**日期转时间戳
             * [tranTime description]
             * @param  {[type]} date [description]
             * @return {[type]}      [description]
             */
            tranTime: function(date) {
                date = date.replace(/-/g, '/');
                var timestamp = new Date(date).getTime();
                return timestamp;
            },

            /**
             * [isWxBower description]
             * 判断当前浏览器是否微信的内核
             * 
             * @author  wei.liu@ritetrek.com
             * @DateTime 2017-01-12T17:04:18+0800
             * @return   {Boolean}                [description]
             */
            isWxBower: function() {
                var ua = navigator.userAgent.toLowerCase();
                return ua.match(/MicroMessenger/i) == "micromessenger";
            },

            /**
             * [getUserAgent description]
             * 判断用户的设备类型
             * 
             * @author  wei.liu@ritetrek.com
             * @DateTime 2017-01-13T03:07:19+0800
             * @return   {[type]}                 [description]
             */
            getUserAgent: function() {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/iPhone\sOS/i) == "iphone os") {
                    return "ios";
                } else if (ua.match(/Android/i) == "android") {
                    return "android";
                } else {
                    return "other";
                }
            },
            formate: function(source, char) {
                var result = "";
                try {
                    var _t = new Date(source);
                    result = _t.getFullYear() + char + buling(_t.getMonth() + 1) + char + buling(_t.getDate()) + ' ' + buling(_t.getHours()) + ':' + buling(_t.getMinutes());
                } catch (ex) {
                    result = "";
                }
                return result;
            },
            formateToMonth: function(source, char) {
                var result = "";
                try {
                    var _t = new Date(source);
                    result = buling(_t.getMonth() + 1) + (char ? char : '月') + buling(_t.getDate()) + (char ? char : '日');
                } catch (ex) {
                    result = "";
                }
                return result;
            },
            formateToDate: function(source, char) {
                var result = "";
                try {
                    var _t = new Date(source);
                    result = _t.getFullYear() + char + buling(_t.getMonth() + 1) + char + buling(_t.getDate());
                } catch (ex) {
                    result = "";
                }
                return result;
            },
            formateToTime: function(source, char) {
                var result = "";
                try {
                    var _t = new Date(source);
                    result = buling(_t.getHours()) + char + buling(_t.getMinutes());
                } catch (ex) {
                    result = "";
                }
                return result;
            },
            formateToDay: function(time) {
                var a = new Array("日", "一", "二", "三", "四", "五", "六");
                var week = new Date(time).getDay();
                return a[week];
            },


            /**数组移除指定值元素
             * [removeArray description]
             * @param  {[type]} array [description]数组
             * @param  {[type]} value [description]指定值
             * @return {[type]}       [description]
             */
            removeArray: function(array, value) {
                Array.prototype.indexOf = function(val) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == val) return i;
                    }
                    return -1;
                };
                Array.prototype.remove = function(val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                array.remove(value);
            },
            shareTo: function(url, img) {
                var desc = "铁航专线，预约接送，为您提供最优质、便捷的出行服务。";
                var title = "铁航专线";
                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: url, // 分享链接    
                    imgUrl: img, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function() {}
                });
                wx.onMenuShareTimeline({
                    title: '铁航专线，预约接送，为您提供最优质、便捷的出行服务。', // 分享标题
                    link: url, // 分享链接
                    imgUrl: img, // 分享图标
                    success: function() {}
                });
                wx.onMenuShareQQ({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: url, // 分享链接
                    imgUrl: img, // 分享图标
                    success: function() {}
                });
                wx.onMenuShareWeibo({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: url, // 分享链接
                    imgUrl: img, // 分享图标
                    success: function() {}
                });
                wx.onMenuShareQZone({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: url, // 分享链接
                    imgUrl: img, // 分享图标
                    success: function() {}
                });
            },
            setTitle: function(name) {
                document.title = name;
                //微信中的浏览器中单页面第一次加载成功后，不再监听tile的变化,通过iframe来触发 页面重新来监听
                var $body = angular.element(document.getElementById('big-box'));
                var $iframe = angular.element("<iframe style='opacity: 0;' src='/favicon.ico'></iframe>");
                $iframe.on('load', function() {
                    setTimeout(function() {
                        $iframe.off('load').remove();
                    }, 0);
                });
                $body.append($iframe);
            }
        }
        return baseService;

        function buling(no) {
            return no < 10 ? "0" + no : no;
        }
    }])
    .factory("baiduService", ['$state', '$rootScope', '$cookieStore', '$resource', function($state, $rootScope, $cookieStore, $resource) {
        var resource = $resource(ENV.api, {}, {
            get_BaiduSugestAddressList: {
                method: 'GET', //输入用户信息获取航班信息
                // url: ENV.api + "Trips/GetAddress",
                url: ENV.api + "Trips/SearchAddress",
                isLoading: false
            },
            getTrackHistoryUrl: {
                isLoading: false,
                method: 'POST', //查询鹰眼中某一监控对象的历史轨迹点【一天24小时内的】
                url: ENV.api + "Trips/GetHistory" //ENV.baiduMap.trackHistoryUrl
            }
        });
        return {
            get_BaiduSugestAddressList: function(params, callback) {
                return resource.get_BaiduSugestAddressList(params, null,
                    function(response) {
                        callback && callback(response);
                    });
            },
            getTrackHistoryUrl: function(params, callback) {
                return resource.getTrackHistoryUrl(null, params,
                    function(response) {
                        callback && callback(response);
                    });
            }
        }
    }])
    .factory("toast", ['$compile', '$document', function($compile, $document) {
        var toast = {
            showConfirm: function(obj) {
                var config = {
                    cancelWords: obj.cancelWords ? obj.cancelWords : '取消',
                    sureWords: obj.sureWords ? obj.sureWords : '确认'
                }
                var idNum = new Date().getTime() + '-' + Math.ceil(Math.random() * 1000);
                var toast = angular.element('<div class="bw-toast"><div class="toast-body toast-confirm"><div class="toast-content ng-binding">' + obj.text + '</div><div><span class="toast-btn toast-cancel" id="toast-cancel' + idNum + '">' + config.cancelWords + '</span><span class="toast-btn toast-sure" id="toast-sure' + idNum + '">' + config.sureWords + '</span></div></div></div>');
                $document.find("body").append(toast);
                angular.element(document.getElementById('toast-cancel' + idNum)).bind('click', function() {
                    toast.remove();
                    if (obj.cancelFn) obj.cancelFn();
                });
                angular.element(document.getElementById('toast-sure' + idNum)).bind('click', function() {
                    toast.remove();
                    if (obj.sureFn) obj.sureFn();
                });

            },
            showTips: function(text, callback) {
                var idNum = new Date().getTime() + '-' + Math.ceil(Math.random() * 1000);
                var toast = angular.element('<div class="bw-toast"><div class="toast-body toast-tips"><div class="toast-content ng-binding">' + text + '</div><div><span class="toast-btn toast-sure" id="toast-sure' + idNum + '">确认</span></div></div></div>');
                $document.find("body").append(toast);
                angular.element(document.getElementById('toast-sure' + idNum)).bind('click', function() {
                    toast.remove();
                    if (callback) callback();
                });

            },
            showToast: function(text, time, callback) {
                var idNum = new Date().getTime() + '-' + Math.ceil(Math.random() * 1000);
                var toast = angular.element('<div class="bw-toast" id="bw-toast' + idNum + '"><div class="toast-body toast-box" id="toast-body' + idNum + '"><div class="toast-content ng-binding">' + text + '</div></div></div>');
                $document.find("body").append(toast);
                var animation1 = setTimeout(function() {
                    angular.element(document.getElementById('toast-body' + idNum)).css({ transform: 'scale3d(0,0,1)' });
                    toast.css({ opacity: '0' });
                }, time);
                var animation2 = setTimeout(function() {
                    toast.remove();
                    if (callback) callback();
                }, time + 500);

                angular.element(document.getElementById('bw-toast' + idNum)).bind('click', function() {
                    toast.remove();
                    clearTimeout(animation1);
                    clearTimeout(animation2);
                })
            },
            showLoading: function() {
                var toast = angular.element('<div class="bw-toast"><div class="toast-body toast-loading"><div class="toast-content ng-binding"><img src="./imgs/load.gif" alt=""/></div></div></div>');
                var id = "loading-" + this.generateUUID();
                toast.attr({
                    'id': id
                });
                $document.find("body").append(toast);
                return id;
            },
            generateUUID: function() {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            },
            hideLoading: function(id) {
                var loading = angular.element(document.getElementById(id));
                loading.remove();
            }
        };
        return toast;
    }]);

angular.module("bw.filters")
    .filter('trustAsHtml', ['$sce', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
angular.module("bw.filters")
    .filter('toFixed', function() {
        return function(text, num) {
            if (!num) num = 2;
            if (!text) return '0';
            text = parseFloat(text);
            var intText = text.toFixed(0);
            text = text.toFixed(num);
            if (num == 1 && text == intText) {
                return intText;
            }
            return text;
        };
    });
angular.module("bw.filters")
    .filter('showPhone', function() {
        return function(text) {
            if (!text) return '';
            return text.replace(/^(\d{3})\d{4}(\d*)$/g, "$1****$2")
        };
    });