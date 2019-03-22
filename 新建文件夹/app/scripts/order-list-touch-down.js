function bwSlideDown() {
    var slideflag = true;
    var _content;
    var slidTips;
    var slideImg;
    //第一步：下拉过程 
    var slideDownStep1 = function(dist) {
        _content.style.transform = 'translate(0,' + dist / 2 * (-1) + 'px)';
    };
    //第二步：下拉，然后松开，
    var slideDownStep2 = function() {
        _content.style.transform = 'translate(0,50px)';
        slidTips.style.opacity = '0';
        slideImg.style.opacity = '0';
    };
    //第三步：刷新完成，回归之前状态 
    var slideDownStep3 = function() {
        slideflag = true;
        _content.style.transform = 'inherit';
        slideImg.style.opacity = '1';
    };
    //contentId表示对其进行事件绑定，way==>x表示水平方向的操作，y表示竖直方向的操作 
    this.init = function(contentId, way, classname, callback) {
        slidTips = document.getElementById('slideDownTips');
        slideImg = document.getElementById('slideImg');
        _content = document.getElementById(contentId);

        var class1 = document.getElementById(classname + '0');
        var class2 = document.getElementById(classname + '1');
        var class3 = document.getElementById(classname + '2');
        var _start = 0,
            _end = 0;
        if (class1) {
            class1.addEventListener("touchstart", touchStart, false);
            class1.addEventListener("touchmove", touchMove, false);
            class1.addEventListener("touchend", touchEnd, false);
        }

        if (class2) {
            class2.addEventListener("touchstart", touchStart, false);
            class2.addEventListener("touchmove", touchMove, false);
            class2.addEventListener("touchend", touchEnd, false);
        }

        if (class3) {
            class3.addEventListener("touchstart", touchStart, false);
            class3.addEventListener("touchmove", touchMove, false);
            class3.addEventListener("touchend", touchEnd, false);
        }



        function touchStart(event) {
            //var touch = event.touches[0]; //这种获取也可以，但已不推荐使用 
            if (!slideflag) return false;
            var touch = event.targetTouches[0];
            if (way == "x") {
                _start = touch.pageX;
            } else {
                _start = touch.pageY;
            }
        }

        function touchMove(event) {
            if (!slideflag) return false;
            var touch = event.targetTouches[0];
            if (way == "x") {
                _end = (_start - touch.pageX);
            } else {
                _end = (_start - touch.pageY);
                //下滑才执行操作 
                if (_end < 0) {
                    slideDownStep1(_end);
                    if (document.body.scrollTop < 5 && _end < 0) event.preventDefault();
                    if (Math.abs(_end) > 250) {
                        slidTips.style.opacity = '1';
                    } else {
                        slidTips.style.opacity = '0';
                    }
                }
            }
        }

        function touchEnd(event) {
            slideDownStep2();
            if (slideflag) {
                slideflag = false;
            } else {
                return false;
            }
            //上滑
            if (_end > 0) {
                slideDownStep3();
                return;
            }
            //滑动距离太短
            if (Math.abs(_end) < 250) {
                slideDownStep3();
                return;
            }
            //刷新成功则 
            //模拟刷新成功进入第三步 
            callback(slideDownStep3);

        }
    }
}