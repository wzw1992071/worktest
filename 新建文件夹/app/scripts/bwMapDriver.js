/**
 * 地图marker的移动和车辆移动是的方向 转向等
 */


function bwMapDriver(obj) {
    this.intervalTimer = obj.intervalTimer; //数据更新间隔
    this.carMoveTimer = obj.carMoveTimer;//图标更新间隔
    this.map = obj.map;

    var _this = this;
    /**
     * 移动marker
     * @Author duan     2017-08-29T10:13:29+0800
     * @param  {[type]} prvePoint                [description]
     * @param  {[type]} newPoint                 [description]
     */
    this.Move = function(prvePoint, newPoint,marker,markerName, isSetRotation) {
        clearInterval(_this['intervalFlag' +markerName]);
        if (prvePoint.lat == newPoint.lat && prvePoint.lng == newPoint.lng) return;

        if (_this['intervalFlag' + markerName]) clearInterval(_this['intervalFlag' + markerName]);
        _this['currentCount' + markerName] = 0;
        //初始坐标
        var _prvePoint = _this.map.getMapType().getProjection().lngLatToPoint(prvePoint), //将球面坐标转换为平面坐标
            //获取结束点的(x,y)坐标
            _newPoint = _this.map.getMapType().getProjection().lngLatToPoint(newPoint),
            //两点之间要循环定位的次数
            count = _this.intervalTimer / _this.carMoveTimer;
        //两点之间匀速移动
        _this['intervalFlag' +markerName] = setInterval(function() {
            //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
            if (_this['currentCount' + markerName] >= count) {
                clearInterval(_this['intervalFlag' +markerName]);
            } else {
                //动画移动
                _this['currentCount' +markerName]++; //计数
                var x = _this.effect(_prvePoint.x, _newPoint.x, _this['currentCount' + markerName], count),
                    y = _this.effect(_prvePoint.y, _newPoint.y, _this['currentCount' + markerName], count);
                //根据平面坐标转化为球面坐标
                var pos = _this.map.getMapType().getProjection().pointToLngLat(new BMap.Pixel(x, y));
                //设置marker角度(两点之间的距离车的角度保持一致)
                if (_this['currentCount' + markerName] == 1 && isSetRotation) {
                    //转换角度                                                                                                                            
                    _this.setRotation(prvePoint, newPoint,marker);
                }
                //正在移动
                marker.setPosition(pos);
            }
        }, _this.carMoveTimer);
    }
    /**
     * 计算每次位移的坐标
     * @Author duan     2017-08-29T10:24:55+0800
     * @param  {[type]} prvePoint                [description]
     * @param  {[type]} newPoint                 [description]
     * @param  {[type]} nowNum                   [description]
     * @param  {[type]} count                    [description]
     * @return {[type]}                          [description]
     */
    this.effect = function(prvePoint, newPoint, nowNum, count) {
        return parseInt((newPoint - prvePoint) / count * nowNum) + parseInt(prvePoint);
    }
    /**
     *在每个点的真实步骤中设置小车转动的角度
     *@param{BMap.Point} curPos 起点
     *@param{BMap.Point} targetPos 终点
     */
    this.setRotation = function(curPos, targetPos,marker) {
        var deg = 0;
        curPos = _this.map.pointToPixel(curPos);
        targetPos = _this.map.pointToPixel(targetPos);
        if (targetPos.x != curPos.x) {
            var tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x),
                atan = Math.atan(tan);
            deg = atan * 360 / (2 * Math.PI);
            if (targetPos.x < curPos.x) {
                deg = -deg + 90 + 90;
            } else {
                deg = -deg;
            }
            marker.setRotation(-deg);
        } else {
            var disy = targetPos.y - curPos.y;
            var bias = 0;
            if (disy > 0)
                bias = -1
            else
                bias = 1
            marker.setRotation(-bias * 90);
        }
        return;
    };
    return this;
}