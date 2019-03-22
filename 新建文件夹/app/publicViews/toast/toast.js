var toast = function() {
    var _self = this;
    this.append = function(parent, html, id) {
        var txtNode = document.createElement("div");
        txtNode.id = id;
        txtNode.innerHTML = html;
        parent.appendChild(txtNode);
    };
    this.hide = function(id, callback) {
        document.getElementById('toast-body' + id).style.transform = "scale3d(0,0,1)";
        document.getElementById('bw-toast' + id).style.opacity = "0";
        setTimeout(function() {
            var node = document.getElementById(id);
            node.parentNode.removeChild(node);
            if (callback) callback();
        }, 500);
    }
    this.hideAll = function() {
        var getElementsClass = function(classnames) {
            var classobj = new Array(); //定义数组 
            var classint = 0; //定义数组的下标 
            var tags = document.getElementsByTagName("*"); //获取HTML的所有标签
            var myreg = new RegExp("(\\s|^)" + classnames + "(\\s|$)");
            for (var i in tags) { //对标签进行遍历 
                if (tags[i].nodeType == 1) { //判断节点类型 
                    if (myreg.test(tags[i].getAttribute("class"))) {
                        classobj[classint] = tags[i];
                        classint++;
                    }
                }
            }
            return classobj; //返回组成的数组 
        };
        var nodeArr = getElementsClass('bw-toast');
        var len = nodeArr.length;
        for (var i = 0; i < len; i++) {
            var node = nodeArr[i];
            if (node && node.parentNode) node.parentNode.removeChild(node);
        }
    }
    this.showConfirm = function(obj) {
        var config = {
            cancelWords: obj.cancelWords ? obj.cancelWords : '取消',
            sureWords: obj.sureWords ? obj.sureWords : '确认'
        }
        var idNum = new Date().getTime() + '-' + Math.ceil(Math.random() * 1000);
        var html = '<div class="bw-toast" id="bw-toast' + idNum + '"><div class="toast-body toast-confirm" id="toast-body' + idNum + '"><div class="toast-content">' + obj.text + '</div><div><span class="toast-btn toast-cancel" id="toast-cancel' + idNum + '">' + config.cancelWords + '</span><span class="toast-btn toast-sure" id="toast-sure' + idNum + '">' + config.sureWords + '</span></div></div></div>';
        _self.append(document.getElementsByTagName("body")[0], html, idNum);

        document.getElementById('toast-cancel' + idNum).onclick = function() {
            _self.hide(idNum, obj.cancelFn);
        }
        document.getElementById('toast-sure' + idNum).onclick = function() {
            _self.hide(idNum, obj.sureFn);
        }
    };
    this.showTips = function(text, callback) {
        var idNum = new Date().getTime() + '-' + Math.ceil(Math.random() * 1000);
        var html = '<div class="bw-toast" id="bw-toast' + idNum + '"><div class="toast-body toast-tips" id="toast-body' + idNum + '"><div class="toast-content">' + text + '</div><div><span class="toast-btn toast-sure" id="toast-sure' + idNum + '">确认</span></div></div></div>';
        _self.append(document.getElementsByTagName("body")[0], html, idNum);
        document.getElementById('toast-sure' + idNum).onclick = function() {
            _self.hide(idNum, callback);
        }
    };
    this.showToast = function(text, time, callback) {
        if (!time) time = 1500;
        time = parseInt(time);
        var idNum = new Date().getTime() + '-' + Math.ceil(Math.random() * 1000);
        var html = '<div class="bw-toast" id="bw-toast' + idNum + '"><div class="toast-body toast-box" id="toast-body' + idNum + '"><div>' + text + '</div></div></div>';
        _self.append(document.getElementsByTagName("body")[0], html, idNum);

        var animation = setTimeout(function() {
            _self.hide(idNum, callback);
        }, time);
        document.getElementById('bw-toast' + idNum).onclick = function() {
            _self.hide(idNum, callback);
            clearTimeout(animation);
        }
    };
    this.showLoading = function() {
        var idNum = new Date().getTime() + '-' + Math.ceil(Math.random() * 1000);
        var html = '<div class="bw-toast loading-toast" id="bw-toast' + idNum + '"><div class="toast-body toast-loading"><div class="toast-content"><img src="/imgs/load.gif" alt=""/></div></div></div>';
        _self.append(document.getElementsByTagName("body")[0], html, idNum);
        return idNum;
    };
    this.hideLoading = function(id) {
        var node = document.getElementById(id);
        node.parentNode.removeChild(node);
    }
};
window.$toast = new toast();