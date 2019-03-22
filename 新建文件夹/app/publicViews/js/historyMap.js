var ak = ''
var serviceId = ''
var map = {};
var app

function display() {
    app = new Vue({
        el: '#history-map',
        data: {
            serviceType: '',
            stroke: '',
            orderListShow: false,
            orderListNum: 0,
            orderDetail: {},
            allowPhone: false
        },
        computed: {
            showOrderList: function() {
                // `this` 指向 vm 实例
                if (this.orderListShow) {
                    if (this.serviceType == 'carpooling') {
                        return { "height": this.orderListNum * 1.57 + 'rem' }
                    } else {
                        return { "height": '1rem' }
                    }
                } else {
                    if (this.serviceType == 'carpooling') {
                        return { "height": "0" }
                    } else {
                        return { "height": '0' }
                    }

                }
            },
            userScrollBox: function() {
                if (this.orderListShow) {
                    return { "height": this.orderListNum * 1.57 + 1.76 + 'rem', "overflow": "scroll", "max-height": '87vh' }
                } else {
                    return ""
                }
            },
            orderTime: function() {

            }

        },
        methods: {
            switchOrderList: switchOrderList,
            noCallPhone: noCallPhone,
            jumpPrice: jumpPrice
        },
        filters: {
            toFixed: function(text, num) {
                if (!num) num = 2;
                if (!text) return '0';
                text = parseFloat(text);
                if (num == 1 && text == text.toFixed(0)) {
                    return text.toFixed(0);
                }
                return text.toFixed(num);
            },
            encodePhone: function(text) {
                if (!text) return '';
                return text.substr(text.length - 4);
            }
        }
    })
    document.body.setAttribute('style', 'opacity:1');



    // $bw.userInfo = { AccessToken: 'AljN85px20t126EtoYyXYNw_lyC3WCDmrOLQC0PpXEocCKs9UNsiQIRBgfrBvQ6bMDfYU_8CC80DS4MXMy3SYuliFaY3Ysp5fWuxQJTJQwTspN3IZI-gBeXT5ttmD85xeP1meLWZtz0wXYN-HO0REmnoTN2BAXFKu9_1no3lzAPf9PT_b93zqZXOeKrJfswjEDwkh9YcXbO6AvfJ-gQcu5Px9MXqxtb5geKW8Hx1ovr2Re6Y3uuB6gttZEOBo-WWwl6jZ2BeIR2wuzORPUB_C_y-fw30KJO64dXXrCTXyxYq4Rz0sH-VA6sSkvE5On95UzbxO5jIja3Hqhyal_bwD7p7olLyZfAgCmprHY7eGEGXci_99dod28qX8b6lC-sjgzAsBrFPhTi1xQ3kmQ1y-RB37xphUiR0ejkKE8bnpN7aK36gLn1OxBdylLbcwVoamwPLs7eaOH-1eF4dz9R7cTm-NYUg1S833hFHi9bsTvkVb3qr8SrL4FFDVAg' }
    // initMap({
    //     strokeColor: "blue",
    //     strokeWeight: 4,
    //     strokeOpacity: 0.5
    // })
    // render();
    // getOrderDetail();

    contactApp('AppBridgeGetAuthorizationToken', {}, function(res) {
        $bw.userInfo = { AccessToken: res.token }
        initMap({
            strokeColor: "blue",
            strokeWeight: 4,
            strokeOpacity: 0.5
        })
        getOrderDetail(render);
    })
}

function jumpPrice() {
    jumpByTime("./driverPrice.html", { cityId: $bw.getUrlInfo('cityId') });
}

function noCallPhone() {
    $toast.showToast("行程已结束，不能联系乘客", 1500, function() {});
}

function getOrderDetail(callback) {
    if (!$bw.getUrlInfo('id')) return;
    $bw.ajax({
        url: 'driverorder/GetOrderDetail',
        type: 'get',
        data: { poId: $bw.getUrlInfo('id') },
        callback: function(reseponse) {
            app.orderDetail = reseponse.Data;
            var orderDetail = reseponse.Data;
            var tembooks = orderDetail.Bookings.filter(function(val) {
                return val.Status != 'Cancel';
            });
            app.orderListNum = tembooks.length;
            if (orderDetail.TripType == '2') {
                app.stroke = '送机';
            } else {
                app.stroke = '接机';
            }
            if (orderDetail.ServiceType == '1') {
                //如果是拼车
                app.serviceType = 'carpooling';
            } else {
                app.serviceType = 'special';
            }
            var nowTime = new Date().getTime()
            if ((orderDetail.EndDate + 30 * 60 * 1000) > nowTime) {
                app.allowPhone = true
            }
            addSession({
                info: reseponse.Data,
                name: 'driverPrice'
            });

            callback()
        }
    })
}

function switchOrderList() {
    app.orderListShow = !app.orderListShow;
}

function render() {
    $('#done').remove();
    getHistoryLinePoint(function(polyLineParams, start_point, end_point) {
        var polyline = new BMap.Polyline(polyLineParams); //创建折线
        map.addOverlay(polyline); //增加折线
        var Bounds = polyline.getBounds();
        var zoom = getZoom(Bounds.getSouthWest(), Bounds.getNorthEast(), map);

        map.centerAndZoom(Bounds.getCenter(), zoom);
        var sIcon = new BMap.Icon("../imgs/driver-history-start.png", new BMap.Size(24, 36), { anchor: new BMap.Size(12, 36) });
        var sMarker = new BMap.Marker(start_point, {
            title: '起点',
            icon: sIcon
        });
        map.addOverlay(sMarker);

        var eIcon = new BMap.Icon("../imgs/driver-history-last.png", new BMap.Size(24, 36), { anchor: new BMap.Size(12, 36) });
        var eMarker = new BMap.Marker(end_point, {
            title: '终点',
            icon: eIcon
        });

        map.addOverlay(eMarker);
        $('body').append('<input type="hidden" id="done" />')

    }, function() {
        $('body').append('<input type="hidden" id="done" />')

    });
}

function initMap(params) {
    //初始化地图
    map = new BMap.Map('map');
    var point = new BMap.Point(104.073516, 30.647391); // 地图的中心地理坐标。
    map.centerAndZoom(point, 16);
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.enableScrollWheelZoom(true);
    //获取车辆鹰眼坐标库

}

function getHistoryLinePoint(callback, failcb) {
    var rqsdata = {};
    rqsdata.Code = $bw.getUrlInfo('code');
    rqsdata.POID = $bw.getUrlInfo('id');

    // var api_url = window.ENV.api + 'trajectory/points';
    try {
        $bw.ajax({
            url: 'trajectory/points',
            type: 'POST',
            data: rqsdata,
            callback: function(resd) {
                var res = resd.Data;
                try {
                    // if (!res.Points || res.Points.length <= 0) {
                    //     alert("无轨迹！")
                    // }
                    var polyLineParams = [];
                    var l = res.Points.length
                    var start_point = new BMap.Point(res.Points[0].Longitude, res.Points[0].Latitude);
                    var location;
                    for (var i in res.Points) {
                        location = res.Points[i];
                        polyLineParams.push(new BMap.Point(location.Longitude, location.Latitude));
                    }
                    var end_point = new BMap.Point(res.Points[l - 1].Longitude, res.Points[l - 1].Latitude);
                    // if (!polyLineParams || polyLineParams.length <= 0) {
                    //     alert("无轨迹！")
                    // }
                    //
                    if (res.MarkerPoints && res.MarkerPoints.length > 0 && app.orderDetail.ServiceType == '1') {
                        for (var k in res.MarkerPoints) {
                            if (res.MarkerPoints[k] && res.MarkerPoints[k] != null) {
                                var icon = new BMap.Icon('../imgs/driver-history' + (parseInt(k) + 1) + ".png", new BMap.Size(24, 36), { anchor: new BMap.Size(12, 36) });
                                var marker = new BMap.Marker(
                                    new BMap.Point(res.MarkerPoints[k].Longitude,
                                        res.MarkerPoints[k].Latitude), { icon: icon });

                                map.addOverlay(marker)
                            }
                        }
                    }
                    callback(polyLineParams, start_point, end_point);
                } catch (error) {
                    alert("轨迹获取失败！");
                    failcb()
                } finally {
                    failcb()
                }
            }
        });
    } catch (e) {
        $('body').html(e);
    }

}

//根据经纬极值计算绽放级别。  
function getZoom(southWest, northEast, map) {
    var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000",
            "200000", "500000", "1000000", "2000000"
        ] //级别18到3。
    var distance = map.getDistance(southWest, northEast).toFixed(1); //获取两点距离,保留小数点后两位  
    for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
            return 18 - i + 2; //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
        }
    };
}