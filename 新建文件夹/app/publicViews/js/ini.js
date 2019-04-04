/**
 * 外部资源引入 css
 * @author duantingting@bestwise.cc 2017-01-09
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function loadCss(url) {
    var head = document.getElementsByTagName('head');
    if (head && head.length) {
        head = head[0];
    } else {
        head = document.body;
    }
    var link = document.createElement('link');
    link.rel = "stylesheet";
    head.appendChild(link);
    link.onload = link.onreadystatechange = function() {
        /*if ((!this.readyState) || this.readyState == "complete" || this.readyState == "loaded") {}*/
    };
    link.href = url;
}
loadCss('/publicViews/toast/toast.css')
loadCss('/font/icon/iconfont.css')
    // loadCss('../font/icon/iconfont.css')
    /**
     * 外部资源引入 js
     * @author duantingting@bestwise.cc 2017-01-19
     * @param  {[type]}   url      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
function loadJS(url, callback) {
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
}
/**
 * 初始化
 * @author duantingting@bestwise.cc 2017-01-19
 * @return {[type]} [description]
 */
function init() {
    if ($bw.loadJsIndex) {
        $bw.loadJsIndex++;
    } else {
        $bw.loadJsIndex = 1;
    }
    if ($bw.loadJsIndex == 3) {
        setRem();
        window.onresize = function() {
            setTimeout(setRem, 300)
        };

        webViewIni(function() {
            //执行页面初始化
            var cityId = $bw.getUrlInfo('cityId') || '510100'; //"chengdu"
            cityId && document.getElementById("cityId_" + cityId) && (document.getElementById("cityId_" + cityId).style.display = "block");
            if (typeof(display) == 'function') display();

        });
        handleFontSizeAnd();
    }
}

window.onload = function() {

    // loadJS('./plug/jquery.min.js', init);
    // loadJS('./toast/toast.js', init);
    // loadJS('../scripts/aconfig.js', init);
    loadJS('/publicViews/plug/jquery.min.js', init);
    loadJS('/publicViews/toast/toast.js', init);
    loadJS('/scripts/aconfig.js', init);

}
if (!$bw) var $bw = {};

function handleFontSizeAnd() {
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
    }

}

function handleFontSize() {
    if (!WeixinJSBridge) return;
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', {
        'fontSize': 0
    });
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', function() {
        WeixinJSBridge.invoke('setFontSizeCallback', {
            'fontSize': 0
        });
    });
}
/*
 *用户模板替换时 避免输出undefined author：段
 */
$bw.N = function(str) {
    if (typeof(str) == 'undefined' || str === null) str = '';
    return $bw.escape(str);
};
$bw.RN = function(str) {
    if (typeof(str) == 'undefined' || str === null) str = '';
    return $bw.escape('-' + str);
};
$bw.TN = function(str) {
    if (typeof(str) == 'undefined' || str === null || str === '') str = '--';
    return $bw.escape(str);
};
/**
 * replaceAll
 */
$bw.replaceAll = function(str, s1, s2) {
    if (typeof(str) == 'string') {
        return str.replace(new RegExp(s1, "gm"), s2);
    } else {
        return str;
    }
};
/*
 * ajax  author：段
 */
$bw.ajax = function(obj) {
    if (!obj.isHideLoading) {
        var layerLoad = $toast.showLoading();
    }
    obj.type = obj.type.toUpperCase();
    obj.data = typeof(obj.data) != 'undefined' ? obj.data : {};
    if (obj.escape) obj.data = $bw.forEscape(obj.data);
    if (obj.type == 'POST' || obj.type == 'PUT') obj.data = JSON.stringify(obj.data);
    var token = $bw.userInfo ? $bw.userInfo.AccessToken : '';
    var cityIdentity = $bw.cityIdentity ? $bw.cityIdentity : 'CTU';
    var headerObj = cityIdentity ? { "Authorization": 'Bearer ' + token, "ClientType": 'wechat', "CityIdentity": cityIdentity } : { "Authorization": 'Bearer ' + token, "ClientType": 'wechat' };
    $.ajax({
        type: obj.type,
        url: window.ENV.api + obj.url,
        data: obj.data,
        dataType: "json",
        headers: headerObj,
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            !obj.isHideLoading && $toast.hideLoading(layerLoad);

            if (res.Status == 3 && res.Errors.length > 0 && res.Errors[0].ErrorMessages[0] != '') {
                $toast.showToast(res.Errors[0].ErrorMessages[0]);
                return;
            }
            if (res.Status != 1) {
                $toast.showToast(res.Message, 1500, function() {
                    //没有登录
                    if (res.Status == -1) {
                        addSession({ name: 'bwLoginToken', info: null });
                        addStorage({ name: 'bwUserInfo', info: null });
                        addStorage({ name: 'bwLoginToken', info: null });
                        contactApp('AppBridgeTokenExpired', {});
                    }
                });
                if (typeof(obj.errorBack) == 'function') { obj.errorBack(res); }
                contactApp('WrbAppBridgeOrderStatusDidChanged', res);
                return;
            }
            if (typeof(obj.callback) == 'function') { obj.callback(res); }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $toast.hideLoading(layerLoad)
            XMLHttpRequest && $toast.showToast(JSON.parse(XMLHttpRequest.responseText).Message)
            console.info(XMLHttpRequest.responseText);
            if (typeof(obj.errorBack) == 'function') {
                obj.errorBack(JSON.parse(XMLHttpRequest.responseText));
            }
            // contactApp('WrbAppBridgeOrderStatusDidChanged', XMLHttpRequest);
        }
    });
};

function showTpl(tpldom, dom, data) {
    if ($(tpldom)[0]) {
        var interText = doT.template($(tpldom).text());
        $(dom).html(interText(data));
    }
}
/**
 * 获取对象长度
 * @author duantingting@bestwise.cc 2017-01-19
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
$bw.getLength = function(obj) {
    var n = 0;
    for (var i in obj) { n++; }
    return n;
};
/**
 * 获取url参数
 * @author duantingting@bestwise.cc 2017-01-19
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
$bw.getUrlInfo = function(name) {
    var url = decodeURI(window.document.location.search.substr(1));
    if (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    } else {
        if (typeof(url) == "string" && url.length > 0) {
            var u = url.split("&"),
                getInfo = {},
                j = '';
            for (var i in u) {
                j = u[i].split("=");
                getInfo[j[0]] = j[1];
            }
            return getInfo;
        }
        return {};
    }
};
//时间戳转文字
function format(shijianchuo, type) {
    if (!shijianchuo && type === '--') return '--';
    if (!shijianchuo) return '';
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(parseInt(shijianchuo));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    var add0 = function(m) {
        return m < 10 ? '0' + m : m;
    };
    if (type == 'minDay') return y + '-' + add0(m) + '-' + '01';
    if (type == 'year') return y + '-' + add0(m) + '-' + add0(d);
    if (type == 'time') return add0(h) + ':' + add0(mm);
    if (type == 'month') return add0(m) + '月' + add0(d) + '日';
    if (type == 'second') return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    return { y: y, m: add0(m), d: add0(d), h: add0(h), m: add0(mm) }
}
//写入Cookie缓存 时间以秒计算
function addStorage(obj) {
    //如果不规定生命周期 默认一年
    if (!obj.livetime) { obj.livetime = 60 * 60 * 24 * 365; }
    var msg = {
        info: obj.info,
        time: new Date().getTime(),
        livetime: obj.time
    };
    localStorage[obj.name] = JSON.stringify(msg);
}
//取Cookie缓存
function getStorage(name) {
    var msg = null;
    if (typeof(localStorage[name]) == 'undefined' || localStorage[name] === null || localStorage[name] == 'null') {
        return null;
    } else {
        msg = JSON.parse(localStorage[name]);
        if (!msg.info || msg.info === null || msg.info.length === 0) return null;
    }
    if (msg.time + msg.livetime * 1000 < new Date().getTime()) return null;
    return msg.info;
}
//写入session缓存 时间以秒计算
function addSession(obj) {
    var msg = {
        info: obj.info,
        time: new Date().getTime(),
        livetime: obj.time
    };
    sessionStorage[obj.name] = JSON.stringify(msg);
}
//取session缓存
function getSession(name) {
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
}

function inArray(val, arr) {
    for (var i in arr) {
        if (arr[i] === val) {
            return true;
        }
    }
    return false;
}
/**
 * 日期转时间戳
 * @author duantingting@bestwise.cc 2017-04-17
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
function dateTonum(date) {
    return Date.parse(new Date(date));
}
/**
 * 验证用户登录
 * @author duantingting@bestwise.cc 2017-01-24
 * @return {[type]}       [description]
 */
function verifyLogin(callback) {
    contactApp('AppBridgeGetAuthorizationToken', {}, function(res) {
        console.log(res)
        if (res.token && res.cityIdentity) {
            $bw.userInfo = {};
            $bw.userInfo.AccessToken = res.token;
            $bw.cityIdentity = "";
            $bw.cityIdentity = res.cityIdentity;
            callback()
        } else {
            // $toast.showToast(res, 1500, function() {});
            $toast.showToast("没有权限访问", 1500, function() {});
        }

    })
}

function tofixed(info, num) {
    if (!info) return 0;
    info = parseFloat(info);
    if (!num) num = 2;
    return info.toFixed(num);
}

function setRem() {
    console.log(1)
    var windowWidth = document.body.offsetWidth;
    RootFontSize = windowWidth / 750 * 100;
    document.getElementsByTagName("html")[0].style.fontSize = RootFontSize + "px";
}

function setTitle(name) {
    document.title = name;
    //微信中的浏览器中单页面第一次加载成功后，不再监听tile的变化,通过iframe来触发 页面重新来监听
    var body = $('#big-box');

    var iframe = document.createElement('iframe');
    iframe.src = "/favicon.ico";
    iframe.style.opacity = "0";

    iframe.onload = function() {
        setTimeout(function() {
            $(iframe).remove();
        }, 0);
    }
    body.append(iframe);
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

function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe); }, 0)
}

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
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe); }, 0);
    }
}

function isWxAndH5() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger' || getSession('isWebH5')) {
        return true;
    } else {
        return false;
    }
}

function webViewIni(callback) {
    if (!$bw.clientType) {
        $bw.clientType = 'weichat';
        var ua = window.navigator.userAgent.toLowerCase();
        //是否微信
        if (ua.match(/MicroMessenger/i) == 'micromessenger' || getSession('isWebH5')) {
            callback();
        } else if (/iphone|ipad|ipod/.test(ua)) {
            setupWebViewJavascriptBridge(function(bridge) {
                /* Initialize your app here */
                $bw.clientType = 'iphone';
                $bw.bridge = bridge;
                callback();
            })
        } else if (/android/.test(ua)) {
            setupWebViewJavascriptBridgeAndroid(function(bridge) {
                /* Initialize your app here */
                $bw.bridge = bridge;
                $bw.clientType = 'android';
                callback();
            })
        } else {
            callback();
        }

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
            //得到微信的token
            // var token = getSession('bwLoginToken');
            var token = getStorage('bwLoginToken');
            var selectedCity = getStorage('selectedCity') || {};
            var cityIdentity = selectedCity.CityIdentity ? selectedCity.CityIdentity : '';
            // if (token === null) {
            //     token = getStorage('bwLoginToken');
            //     addSession({ name: 'bwLoginToken', info: token });
            // }
            callback({
                token: token ? token : '',
                cityIdentity: cityIdentity
            });
        },
        AppBridgeOrderStatusDidChanged: function() {
            callback();
        },
        AppBridgeOrderAppointmentInfo: function() {
            callback();
        },
        AppBridgeOrderAppointmentInfoSave: function() {
            callback();
        },
        AppBridgeOrderPriceDetail: function() {
            callback(getSession('AppBridgeOrderPriceDetail'));
        },
        AppBridgeTokenExpired: function() {
            window.location.href = window.ENV.url + "/#/bindPhone";
        }

    }
    fnObj[fn]();
}

function jumpByTime(url, params) {
    if (!params) params = {};
    params.timeStr = new Date().getTime();
    var paramsUrl = url + '?'
    for (var i in params) {
        paramsUrl += i + '=' + params[i] + '&';
    }

    window.location.href = paramsUrl;
}
/**
 * 解密
 * @author duantingting@bestwise.cc 2017-07-05
 * @return {[type]} [description]
 */
function decode(str) {
    result = '';
    userId = new Base64().decode(str);
    for (var i = 0; i < userId.length; i++) {
        result += String.fromCharCode(userId.charCodeAt(i) ^ 9);
    }
    return result;
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