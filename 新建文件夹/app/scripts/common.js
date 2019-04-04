window.$bw = {
    websolitStart: false,
    websokitFn: function(scope) {
        $bw.websolitStart = true;
        //因为
        var connection = new signalR.HubConnectionBuilder()
            .withUrl(ENV.sorket + "signalr/hubs?city=" + (window.userInfo.phone))
            .configureLogging(signalR.LogLevel.Information)
            .build();
        connection.start().catch(function(err) {
            console.error(err.toString());
        });
        connection.onclose( function(){
            try {
                 connection.start();
                console.log("connected");
            } catch (err) {
                console.log(err);
                setTimeout(function(){
                    start()
                },5000);
            }
        });
        //定义方法使用connection.on方法来接收返回数据
        connection.on("sendMessage", function(user, message) {
            console.info(message);
            scope.$broadcast("signalrInfo", message);
        });


    },
    //设置默认选择城市
    "setSeclectedInitCity": function($rootScope, data) {
        var selCity = $bw.getStorage("selectedCity");
        if (selCity) {
            selCity = {
                CityId: selCity.CityId ? selCity.CityId : '510100',
                CityCode: selCity.CityCode ? selCity.CityCode : '',
                CityName: selCity.CityName ? selCity.CityName : '成都',
                CityIdentity: selCity.CityIdentity ? selCity.CityIdentity : ''
            }
        } else if (data) {
            selCity = {
                CityId: (data.OpenCity && data.OpenCity.CityId) ? data.OpenCity.CityId : '510100',
                CityCode: (data.OpenCity && data.OpenCity.CityCode) ? data.OpenCity.CityCode : '',
                CityName: (data.OpenCity && data.OpenCity.CityName) ? data.OpenCity.CityName : '成都',
                CityIdentity: (data.OpenCity && data.OpenCity.CityIdentity) ? data.OpenCity.CityIdentity : ''
            }

        }
        $rootScope.selectedCity = selCity || {};
    },
    "getToken": function(callback) {
        // window._token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2" +
        //     "FwLm9yZy93cy8yMDA5LzA5L2lkZW50aXR5L2NsYWltcy9iZXN0d2lzZS90cmFuc2Zlci91c2VyaWQiOiJjNWRmODYwMC1iOWQyLTRlNjAtODA5Ni1jNGNhZTY4NDMwYTEiLCJodHRwOi8vc2NoZW1hc" +
        //     "y54bWxzb2FwLm9yZy93cy8yMDA5LzA5L2lkZW50aXR5L2NsYWltcy9iZXN0d2lzZS90cmFuc2Zlci91c2VybmFtZSI6IjE5OTgzMjgxNTYwIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwOS8wO" +
        //     "S9pZGVudGl0eS9jbGFpbXMvYmVzdHdpc2UvdHJhbnNmZXIvbmlja25hbWUiOiIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA5LzA5L2lkZW50aXR5L2NsYWltcy9iZXN0d2lzZS90cmFuc2Zlci9hY" +
        //     "2NvdW50dHlwZSI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA5LzA5L2lkZW50aXR5L2NsYWltcy9iZXN0d2lzZS9kZXZpY2VpZCI6IklPUyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzI" +
        //     "wMDkvMDkvaWRlbnRpdHkvY2xhaW1zL2Jlc3R3aXNlL2xhc3Rsb2dpbnRpbWUiOiIyMDE5LeS6jOaciC0xMyAwOTozNjo1NSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDkvMDkvaWRlbnRpdHkvY2xh" +
        //     "aW1zL2Jlc3R3aXNlL3NlY3VyaXR5c3RhbXAiOiJmYTA1ZDAyMTIyZDg0YjEyYjdiZTRlNjRlZTU0NDFjZCIsIm5iZiI6MTU1MDAyMzEzNiwiZXhwIjoxNTU3Nzk5MTM2LCJpc3MiOiJUcmFuc2Zlcl9WMSIsImF1ZCI6" +
        //     "IlRyYW5zZmVyX1YxIn0.hSyAlQWWx2qfDx8Dyc1vvVmYNt6Kdtt1G53AE4bGjs0";
        // // window._token = "";
        // window.userInfo = {};
        // window.userInfo.phone = "19983281560";
        // localStorage.setItem("selectedCity", JSON.stringify({
        //     "info": {
        //         "CityId": 'CTU',
        //         "CityCode": "510100",
        //         "CityName": '成都市',
        //         "CityIdentity": "CTU"
        //     }
        // }));

        // var _element = document.getElementById('loading-html')
        // if (_element) _element.parentNode.removeChild(_element);
        // callback();
        // return;

        webViewIni(function() {
            window._token = $bw.getStorage('bwLoginToken');
            window.userInfo = $bw.getStorage('bwUserInfo') || {};
            window.selectedCity = $bw.getStorage('selectedCity') || {};
            window.ClientType = $bw.getSession('UserClientType') || window.userInfo.ClientType || ($bw.isWx() ? 'wechat' : 'CHHTML5');
            if (window._token && window._token != 'false') {
                //授权成功过
                callback();
            } else {
                contactApp('AppBridgeGetAuthorizationToken', {}, function(res) {
                    window.ClientType = res.ClientType;
                    if (res.token) {
                        window._token = res.token;
                        callback();
                    } else {
                        $bw.indexGetToken(callback);
                    }
                })
            }
        })
    },
    "addStorage": function(obj) {
        //如果不规定生命周期 默认一年
        if (!obj.livetime) { obj.livetime = 60 * 60 * 24 * 365; }
        var msg = {
            info: obj.info,
            time: new Date().getTime(),
            livetime: obj.time
        };
        localStorage[obj.name] = JSON.stringify(msg);
    },
    //取Cookie缓存
    "getStorage": function(name) {
        var msg = null;
        if (typeof(localStorage[name]) == 'undefined' || localStorage[name] === null || localStorage[name] == 'null') {
            return null;
        } else {
            msg = JSON.parse(localStorage[name]);
            if (!msg.info || msg.info === null || msg.info.length === 0) return null;
        }
        if (msg.time + msg.livetime * 1000 < new Date().getTime()) return null;
        return msg.info;
    },
    //写入session缓存 时间以秒计算
    "addSession": function(obj) {
        var msg = {
            info: obj.info,
            time: new Date().getTime(),
            livetime: obj.time
        };
        sessionStorage[obj.name] = JSON.stringify(msg);
    },
    //取session缓存
    "getSession": function(name) {
        if (typeof(sessionStorage[name]) == 'undefined' || sessionStorage[name] === null || sessionStorage[name] === 'null') {
            return null;
        } else {
            msg = JSON.parse(sessionStorage[name]);
            if (!msg.info || msg.info === null || msg.info.length === 0) return null;
        }
        if (msg.livetime) {
            if (msg.time + msg.livetime * 1000 < new Date().getTime()) return null;
        }
        return msg.info;
    },
    "getUrlParams": function(url) {
        var args = {};
        url = url || location.href;
        try {
            var pairs = url.split("?")[1].split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].split('=');
                if (pos.length == 1) {
                    continue;
                }
                args[pos[0]] = decodeURIComponent(pos[1]);
            }
        } catch (e) {}
        return args;
    },
    "getUserInfoOther": function(callback) {
        var params = $bw.getSession('OtherLoginParmas') || {};
        if (!params.appId || !params.Signature) {
            callback();
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', ENV.externalapi + 'login?appId=' + params.appId + '&signature=' + params.Signature, true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.setRequestHeader("Accept", "application/json,text/javascript");
        xhr.onreadystatechange = function() { //response
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.response);
                if (response.Status == 1) {
                    $bw.loginUserInfo(response.Data);
                    callback();
                } else {
                    window.location.href = ENV.url + "#/createOrder";
                }
            }
        };
        xhr.send();
    },
    "getUserInfoWx": function(code, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ENV.api + 'Weixin/GetToken?wXCode=' + code, true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.setRequestHeader("Accept", "application/json,text/javascript");
        xhr.onreadystatechange = function() { //response
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.response);
                if (response.Status == 1) {
                    $bw.loginUserInfo(response.Data);
                    callback();
                } else if (response.Status == -1) {
                    callback();
                } else if (response.Status == 0) {
                    $bw.jumpWxGetCode(true, callback);
                } else {
                    $bw.jumpWxGetCode(false, callback);
                }
            }
        };
        xhr.send();
    },
    "logoOut": function() {
        window._token = null;
        window.userInfo = null;
        $bw.addStorage({ name: 'bwUserInfo', info: null });
        $bw.addStorage({ name: 'bwLoginToken', info: null });
        contactApp('AppBridgeSaveToken', {}, function() {});
    },
    "loginUserInfo": function(data) {
        window._token = data.AccessToken;
        var userInfo = {
            phone: data.Phone,
            openId: data.OpenId,
            hiddenIDCard: '',
            ClientType: window.ClientType,
            IsNewUser: data.IsNewUser
        }
        if (data.IDCard) {
            var str = data.IDCard;
            userInfo.IDCard = str;
            userInfo.IsRealValid = true;
            userInfo.Name = data.Name;
            userInfo.hiddenIDCard = str.substr(0, 4) + '**********' + str.substr(-4, 4);
        }
        window.userInfo = userInfo;
        $bw.addStorage({ name: 'bwUserInfo', info: userInfo });
        $bw.addStorage({ name: 'bwLoginToken', info: window._token });
    },
    "indexGetToken": function(callback) {
        if ($bw.isWx()) {
            var code = $bw.getUrlParams(location.href)['code'];
            if (code) {
                $bw.getUserInfoWx(code, callback);
            } else {
                $bw.jumpWxGetCode(false, callback);
            }
        } else {
            $bw.getUserInfoOther(callback);
        }
    },
    "jumpWxGetCode": function(b, callback) {
        // var hrf = window.location.href.indexOf('bindPhone');
        if ($bw.isWx()) {
            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + ENV.appId + "&redirect_uri=" + encodeURIComponent(location.href) + "&response_type=code&scope=snsapi_base&state=11#wechat_redirect";
        } else {
            window.location.href = ENV.url + "#/bindPhone";
        }
        // if ($bw.isWx() && hrf >= 0 && callback) {
        //     callback();
        // }
    },
    "jsApiCall": function(callback, errorback, wechatPayInfo) {
        WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayInfo, function(res) {
            WeixinJSBridge.log(res.err_msg);
            if (res['err_msg'] == "get_brand_wcpay_request:ok") {
                callback()
            } else if (res['err_msg'] == "get_brand_wcpay_request:cancel") {
                errorback("用户取消支付！");
            } else {
                var errorStr = '';
                for (var i in res) {
                    errorStr += (i + ":" + res[i]);
                }
                errorback(errorStr);
            }
        });
    },
    "callpay": function(callback, errorback, wechatPayInfo) {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', function() {
                    $bw.jsApiCall(callback, errorback, wechatPayInfo)
                }, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', function() {
                    $bw.jsApiCall(callback, errorback, wechatPayInfo)
                });
                document.attachEvent('onWeixinJSBridgeReady', function() {
                    $bw.jsApiCall(callback, errorback, wechatPayInfo)
                });
            }
        } else {
            $bw.jsApiCall(callback, errorback, wechatPayInfo);
        }
    },
    loadJS: function(url, callback) {
        var head = document.getElementsByTagName('head');
        if (head && head.length) {
            head = head[0];
        } else {
            head = document.body;
        }
        var script = document.createElement('script');

        script.type = "text/javascript";
        head.appendChild(script);

        script.onload = script.onreadystatechange = function() {
            if ((!this.readyState) || this.readyState == "complete" || this.readyState == "loaded") {
                if (callback) callback();
            }
        };
        script.src = url;
    },
    getScrollTop: function() {
        var scrollTop = 0,
            bodyScrollTop = 0,
            documentScrollTop = 0;
        if (document.body) { bodyScrollTop = document.body.scrollTop; }
        if (document.documentElement) { documentScrollTop = document.documentElement.scrollTop; }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    },
    //文档的总高度
    getScrollHeight: function() {
        var scrollHeight = 0,
            bodyScrollHeight = 0,
            documentScrollHeight = 0;
        if (document.body) { bodyScrollHeight = document.body.scrollHeight; }
        if (document.documentElement) { documentScrollHeight = document.documentElement.scrollHeight; }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    },
    //浏览器视口的高度
    getWindowHeight: function() {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    },
    /**
     * 新增历史记录
     */
    addHistoryGo: function(addUrl, toUrl) {
        history.pushState(null, null, addUrl);
        setTimeout(function() {
            window.location.href = toUrl;
        }, 500)
    },
    isWxAndH5: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger' || $bw.getSession('isWebH5')) {
            return true;
        } else {
            return false;
        }
    },
    "isWx": function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') return true;
        return false;
    },
    inArray: function(val, arr) {
        for (var i in arr) {
            if (arr[i] === val) {
                return true;
            }
        }
        return false;
    },
    validateEmail:function(email){
        var re= /\w@\w*\.\w/;
        return re.test(email);
    }
}


/**
 * 加密
 * @author duantingting@bestwise.cc 2017-07-05
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function encode(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ 9);
    }
    var base = new Base64();
    result = base.encode(result);
    return result;
}
/** 
 * 
 * Base64 encode / decode 
 * 
 * @author haitao.tu 
 * @date 2010-04-26 
 * @email tuhaitao@foxmail.com 
 * 
 */
function Base64() {
    // private property 
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding 
    this.encode = function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding 
    this.decode = function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding 
    _utf8_encode = function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding 
    _utf8_decode = function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
/**
 * 判断订单是否可以取消
 * @Author duan     2017-08-07T17:11:51+0800
 * @param  {[type]} obj                      [description]
 */
function setCancelStatus(obj) {
    var cancelStatus = false;
    //如果是拼车
    if (obj.ServiceType == '1') {
        //拼车送机
        if (obj.TripType == '2') {
            switch (obj.Status) {
                //不能取消的
                case 'InHand': //进行中
                    cancelStatus = true;
                    if (obj.ChildStatus === 'Aboard') {
                        cancelStatus = false;
                    }
                    break;
                case 'Arrived': //已到达
                    cancelStatus = false;
                    break;
                case 'Cancel': //已取消
                    cancelStatus = false;
                    break;
                case 'Completed': //已完成
                    cancelStatus = false;
                    break;
                case 'Invalidation': //已失效
                    cancelStatus = false;
                    break;
                default:
                    cancelStatus = true;
                    break;
            }
        } else {
            //拼车接机
            switch (obj.Status) {
                //可以取消的
                case 'Registered': //预约成功
                    cancelStatus = true;
                    break;
                case 'BookSuccess': //等待上车
                    /*if (obj.ChildStatus === 'PickUp') {
                        cancelStatus = true;
                    }*/
                    cancelStatus = true;
                    break;
                case 'NotPaid': //未支付
                    cancelStatus = true;
                    break;
                default:
                    cancelStatus = false;
                    break;
            }
        }
    } else {
        //如果是专车
        switch (obj.Status) {
            //不能取消的
            case 'InHand': //进行中
                cancelStatus = true;
                if (obj.ChildStatus === 'Aboard') {
                    cancelStatus = false;
                }
                break;
            case 'Arrived': //已到达
                cancelStatus = false;
                break;
            case 'Cancel': //已取消
                cancelStatus = false;
                break;
            case 'Completed': //已完成
                cancelStatus = false;
                break;
            case 'Invalidation': //已失效
                cancelStatus = false;
                break;
            default:
                cancelStatus = true;
                break;
        }
    }
    return cancelStatus;
}
/**
 * 链接iphone app
 * @Author duan       2018-10-25T11:13:23+0800
 * @param  {Function} callback                 [description]
 * @return {[type]}                            [description]
 */
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe);
    }, 0)

}
/**
 * 链接android app
 * @Author duan       2018-10-25T11:13:44+0800
 * @param  {Function} callback                 [description]
 * @return {[type]}                            [description]
 */
function setupWebViewJavascriptBridgeAndroid(callback) {
    var bridge = window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge;
    if (bridge) { return callback(bridge); }

    var callbacks = window.WVJBCallbacks || window.WKWVJBCallbacks;
    if (callbacks) { return callbacks.push(callback); }
    window.WVJBCallbacks = window.WKWVJBCallbacks = [callback];
    if (window.WKWebViewJavascriptBridge) {
        //for https://github.com/Lision/WKWebViewJavascriptBridge
        window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
    } else {
        //for https://github.com/marcuswestin/WebViewJavascriptBridge
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
}

function webViewIni(callback) {
    var ua = window.navigator.userAgent.toLowerCase();
    //是否微信
    $bw.clientType = 'weichat';
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        callback();
    } else if (!$bw.getSession('isAppLogin')) {
        callback();
    } else if (/iphone|ipad|ipod/.test(ua)) {
        setupWebViewJavascriptBridge(function(bridge) {
            $bw.clientType = 'iphone';
            $bw.bridge = bridge;
            callback();
        })
    } else if (/android/.test(ua)) {
        setupWebViewJavascriptBridgeAndroid(function(bridge) {
            /* Initialize your app here */
            $bw.clientType = 'android';
            $bw.bridge = bridge;
            callback();
        })
    } else {
        callback();
    }
}

function contactApp(fn, option, callback) {
    if ($bw.clientType === 'weichat') {
        contactWX(fn, option, callback);
    } else if ($bw.clientType === 'iphone') {
        $bw.bridge.callHandler(fn, option, callback)
    } else if ($bw.clientType === 'android') {
        $bw.bridge.callHandler(fn, option, callback)
    } else {
        callback('err')
    }
}

function contactWX(fn, option, callback) {
    var fnObj = {
        AppBridgeGetAuthorizationToken: function() {
            token = $bw.getStorage('bwLoginToken');
            callback({ token: token, ClientType: window.ClientType });
        },
        AppBridgeSaveToken: function() {
            callback();
        },
        AppBridgeOrderStatusDidChanged: function() {
            callback();
        },
        AppBridgeOrderPriceDetail: function() {
            callback($bw.getSession('AppBridgeOrderPriceDetail'));
        },
        AppBridgeTokenExpired: function() {
            window.location.href = window.ENV.url + "/#/bindPhone";
        }

    }
    fnObj[fn]();
}

