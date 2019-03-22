function leftTouch() {
    var initX; //触摸位置
    var moveX; //滑动时的位置
    var X = 0; //移动距离
    var objX = 0; //目标对象位置
    var width = 70;
    window.addEventListener('touchstart', function(event) {
        //event.preventDefault();
        var obj = event.target.parentNode;
        if (obj.className == "box order-list-li") {
            initX = event.targetTouches[0].pageX;
            objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
        }
        if (objX == 0) {
            window.addEventListener('touchmove', function(event) {
                //event.preventDefault();
                var obj = event.target.parentNode;
                if (obj.className == "box order-list-li") {
                    moveX = event.targetTouches[0].pageX;
                    X = moveX - initX;
                    if (X >= 0) {
                        obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                    } else if (X < 0) {
                        var l = Math.abs(X / 2);
                        obj.style.WebkitTransform = "translateX(" + -l + "px)";
                        if (l > width) {
                            l = width;
                            obj.style.WebkitTransform = "translateX(" + -l + "px)";
                        }
                    }
                }
            });
        } else if (objX < 0) {
            window.addEventListener('touchmove', function(event) {
                //event.preventDefault();
                var obj = event.target.parentNode;
                if (obj.className == "box order-list-li") {
                    moveX = event.targetTouches[0].pageX;
                    X = moveX - initX;
                    if (X >= 0) {
                        var r = -width + Math.abs(X / 2);
                        obj.style.WebkitTransform = "translateX(" + r + "px)";
                        if (r > 0) {
                            r = 0;
                            obj.style.WebkitTransform = "translateX(" + r + "px)";
                        }
                    } else { //向左滑动
                        obj.style.WebkitTransform = "translateX(" + -width + "px)";
                    }
                }
            });
        }

    })
    window.addEventListener('touchend', function(event) {
        //event.preventDefault();
        var obj = event.target.parentNode;
        if (obj && obj.className == "box order-list-li") {
            objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
            if (objX > -(width / 2)) {
                obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                objX = 0;
            } else {
                obj.style.WebkitTransform = "translateX(" + -width + "px)";
                objX = -width;
            }
        }
    })
}