window.onload = function() {
    setRem();
    handleFontSizeAnd();
    window.onresize = function() {
        setRem();
    }
    var urlp = getUrlParams() || {};
    var cityId = urlp.cityId ? urlp.cityId : '510100';
    cityId && document.getElementById("cityId_" + cityId) && (document.getElementById("cityId_" + cityId).style.display = "block");
    if (typeof(display) == 'function') display();
    document.body.setAttribute('style', 'opacity:1');

}

function setRem() {
    var windowWidth = document.body.offsetWidth;
    RootFontSize = windowWidth / 750 * 100;
    document.getElementsByTagName("html")[0].style.fontSize = RootFontSize + "px";
}

function getUrlParams(url) {
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
};

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