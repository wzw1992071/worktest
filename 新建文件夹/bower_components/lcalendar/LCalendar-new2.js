window.LCalendar = (function() {
    var MobileCalendar = function() {
        this.gearDate;
        this.minY = 1900;
        this.minM = 1;
        this.minD = 1;
        this.maxY = 2099;
        this.maxM = 12;
        this.maxD = 31;
        this.isNow = false;
        this.clickFn;
        this.title = '';
        this.minLevel = 0;
        this.maxLevel = 7;
    };
    MobileCalendar.prototype = {
        init: function(params) {
            this.title = params.title;
            this.type = params.type;
            this.minDateTimestamp = params.minDateTimestamp || '';
            this.maxDateTimestamp = params.maxDateTimestamp || '';
            this.trigger = document.querySelector(params.trigger);
            if (this.trigger.getAttribute("data-lcalendar") != null) {
                var arr = this.trigger.getAttribute("data-lcalendar").split(',');
                var minArr = arr[0].split('-');
                this.minY = ~~minArr[0];
                this.minM = ~~minArr[1];
                this.minD = ~~minArr[2];
                var maxArr = arr[1].split('-');
                this.maxY = ~~maxArr[0];
                this.maxM = ~~maxArr[1];
                this.maxD = ~~maxArr[2];
            }

            if (params.minDate) {
                var minDate = params.minDate.split(' ');
                if (minDate[1]) {
                    var minTArr = minDate[1].split(':');
                    this.minT = ~~minTArr[0];
                    this.minS = ~~minTArr[1];
                }
                var minArr = minDate[0].split('-');

                this.minY = ~~minArr[0];
                this.minM = ~~minArr[1];
                this.minD = ~~minArr[2];

            }
            if (params.maxDate) {
                var maxDate = params.maxDate.split(' ');
                if (maxDate[1]) {
                    var maxTArr = maxDate[1].split(':');
                    this.maxT = ~~maxTArr[0];
                    this.maxS = ~~maxTArr[1];
                }
                var maxArr = maxDate[0].split('-');
                this.maxY = ~~maxArr[0];
                this.maxM = ~~maxArr[1];
                this.maxD = ~~maxArr[2];

            }
            // this.bindEvent(this.type);
            if (this.minM == this.maxM) {
                this.maxLevel = this.maxD - this.minD;
            } else {
                var minl = this.calcDays(this.minY, this.minM - 1);
                this.maxLevel = minl - this.minD + this.maxD; //比总共的天数少一
            }
            if (params.isNow) {
                this.maxLevel++
            }
            this.isNow = params.isNow;
            this.callback = params.callback;
            this.cancel = params.cancel;
            return this;
        },

        //呼入字符,串选择
        //呼出日期插件
        popupDate: function(e) {
            var _self = this;
            _self.gearDate = document.createElement("div");
            _self.gearDate.className = "gearDate";
            _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                '<div class="date_btn_box">' +
                '<div class="date_btn lcalendar_cancel">取消</div>' +
                '<div class="date_btn">' + _self.title + '</div>' +
                '<div class="date_btn lcalendar_finish">确定</div>' +
                '</div>' +
                '<div class="date_roll_mask">' +
                '<div class="date_roll">' +
                '<div style="display:none">' +
                '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                '<div class="date_grid">' +
                '<div>年</div>' +
                '</div>' +
                '</div>' +
                '<div style="display:none">' +
                '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                '<div class="date_grid">' +
                '<div>月</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div class="gear date_dd" data-datetype="date_dd"></div>' +
                '<div class="date_grid">' +
                // '<div>日</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(_self.gearDate);
            _self.dateCtrlInit();
            var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
            lcalendar_cancel.addEventListener('touchstart', function(e) { _self.closeMobileCalendar(e, _self, true); });
            var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
            lcalendar_finish.addEventListener('touchstart', function(e) { _self.finishMobileDate(e, _self); });
            var date_yy = _self.gearDate.querySelector(".date_yy");
            var date_mm = _self.gearDate.querySelector(".date_mm");
            var date_dd = _self.gearDate.querySelector(".date_dd");
            date_yy.addEventListener('touchstart', _self.gearTouchStart);
            date_mm.addEventListener('touchstart', _self.gearTouchStart);
            date_dd.addEventListener('touchstart', _self.gearTouchStart);
            date_yy.addEventListener('touchmove', _self.gearTouchMove);
            date_mm.addEventListener('touchmove', _self.gearTouchMove);
            date_dd.addEventListener('touchmove', _self.gearTouchMove);
            date_yy.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
            date_mm.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
            date_dd.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
        },
        //初始化年月日插件默认值
        dateCtrlInit: function() {
            var _self = this;
            var date = new Date();
            var dateArr = {
                yy: date.getFullYear(),
                mm: date.getMonth(),
                dd: date.getDate() - 1
            };
            if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(_self.trigger.value)) {
                rs = _self.trigger.value.match(/(^|-)\d{1,4}/g);
                dateArr.yy = rs[0] - _self.minY;
                dateArr.mm = rs[1].replace(/-/g, "") - 1;
                dateArr.dd = rs[2].replace(/-/g, "") - 1;
            } else {
                dateArr.yy = dateArr.yy - _self.minY;
            }
            _self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
            _self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
            // _self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
            _self.gearDate.querySelector(".date_dd").setAttribute("val", _self.minLevel);
            // _self.setDateGearTooth();
            _self.setDateGearToothAleter();
        },
        //呼出年月插件
        popupYM: function(e) {
            var _self = this;
            _self.gearDate = document.createElement("div");
            _self.gearDate.className = "gearDate";
            _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                '<div class="date_btn_box">' +
                '<div class="date_btn lcalendar_cancel">取消</div>' +
                '<div class="date_btn">' + _self.title + '</div>' +
                '<div class="date_btn lcalendar_finish">确定</div>' +
                '</div>' +
                '<div class="date_roll_mask">' +
                '<div class="ym_roll">' +
                '<div>' +
                '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                '<div class="date_grid">' +
                '<div>年</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                '<div class="date_grid">' +
                '<div>月</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(_self.gearDate);
            _self.ymCtrlInit();
            var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
            lcalendar_cancel.addEventListener('touchstart', function(e) { _self.closeMobileCalendar(e, _self, true); });
            var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
            lcalendar_finish.addEventListener('touchstart', function(e) {
                _self.finishMobileYM(e, _self);
            });
            var date_yy = _self.gearDate.querySelector(".date_yy");
            var date_mm = _self.gearDate.querySelector(".date_mm");
            date_yy.addEventListener('touchstart', _self.gearTouchStart);
            date_mm.addEventListener('touchstart', _self.gearTouchStart);
            date_yy.addEventListener('touchmove', _self.gearTouchMove);
            date_mm.addEventListener('touchmove', _self.gearTouchMove);
            date_yy.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
            date_mm.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
        },
        //初始化年月插件默认值
        ymCtrlInit: function() {
            var _self = this;
            var date = new Date();
            var dateArr = {
                yy: date.getFullYear(),
                mm: date.getMonth()
            };
            if (/^\d{4}-\d{1,2}$/.test(_self.trigger.value)) {
                rs = _self.trigger.value.match(/(^|-)\d{1,4}/g);
                dateArr.yy = rs[0] - _self.minY;
                dateArr.mm = rs[1].replace(/-/g, "") - 1;
            } else {
                dateArr.yy = dateArr.yy - _self.minY;
            }
            _self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
            _self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
            _self.setDateGearTooth();
        },
        //呼出日期+时间插件
        popupDateTime: function(e) {
            var _self = this;
            _self.gearDate = document.createElement("div");
            _self.gearDate.className = "gearDatetime";
            _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                '<div class="date_btn_box">' +
                '<div class="date_btn lcalendar_cancel">取消</div>' +
                '<div class="date_btn">' + _self.title + '</div>' +
                '<div class="date_btn lcalendar_finish">确定</div>' +
                '</div>' +
                '<div class="date_roll_mask">' +
                '<div class="datetime_roll">' +
                '<div style="display:none">' +
                '<div id="calendar-yy" class="gear date_yy" data-datetype="date_yy"></div>' +
                '<div class="date_grid">' +
                '<div>年</div>' +
                '</div>' +
                '</div>' +
                '<div style="display:none">' +
                '<div id="calendar-mm" class="gear date_mm" data-datetype="date_mm"></div>' +
                '<div class="date_grid">' +
                '<div>月</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div id="calendar-dd" class="gear date_dd" data-datetype="date_dd"></div>' +
                '<div class="date_grid">' +
                // '<div>日</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div id="calendar-hh" class="gear time_hh" data-datetype="time_hh"></div>' +
                '<div class="date_grid">' +
                // '<div></div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div id="calendar-ss" class="gear time_mm" data-datetype="time_mm"></div>' +
                '<div class="date_grid">' +
                // '<div></div>' +
                '</div>' +
                '</div>' +
                '</div>' + //date_roll
                '</div>' + //date_roll_mask
                '</div>';
            document.body.appendChild(_self.gearDate);
            _self.dateTimeCtrlInit();
            var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
            lcalendar_cancel.addEventListener('touchstart', function(e) {
                _self.closeMobileCalendar(e, _self, true);
            });
            var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
            // var g = _self.gearDate;
            lcalendar_finish.addEventListener('touchstart', function(e) {
                // _self.gearDate = g;
                _self.finishMobileDateTime(e, _self)
            });
            if (_self.minDateTimestamp > _self.maxDateTimestamp) {
                _self.gearDate.querySelector(".date_dd").innerHTML = "<div class='tooth'>现在</div>";
                _self.gearDate.querySelector(".time_hh").innerHTML = "<div class='tooth'>--</div>";
                _self.gearDate.querySelector(".time_mm").innerHTML = "<div class='tooth'>--</div>";
                return;
            }
            var date_yy = _self.gearDate.querySelector(".date_yy");
            var date_mm = _self.gearDate.querySelector(".date_mm");
            var date_dd = _self.gearDate.querySelector(".date_dd");
            var time_hh = _self.gearDate.querySelector(".time_hh");
            var time_mm = _self.gearDate.querySelector(".time_mm");
            date_yy.addEventListener('touchstart', _self.gearTouchStart);
            date_mm.addEventListener('touchstart', _self.gearTouchStart);
            date_dd.addEventListener('touchstart', _self.gearTouchStart);
            time_hh.addEventListener('touchstart', _self.gearTouchStart);
            time_mm.addEventListener('touchstart', _self.gearTouchStart);
            date_yy.addEventListener('touchmove', _self.gearTouchMove);
            date_mm.addEventListener('touchmove', _self.gearTouchMove);
            date_dd.addEventListener('touchmove', _self.gearTouchMove);
            time_hh.addEventListener('touchmove', _self.gearTouchMove);
            time_mm.addEventListener('touchmove', _self.gearTouchMove);
            date_yy.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
            date_mm.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
            date_dd.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
            time_hh.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
            time_mm.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
        },
        //初始化年月日时分插件默认值
        dateTimeCtrlInit: function() {
            var _self = this;
            var date = new Date();
            var dateArr = {
                yy: date.getFullYear(),
                mm: date.getMonth(),
                // dd: '--',
                dd: date.getDate() - 2,
                hh: date.getHours(),
                mi: 0 //date.getMinutes()
            };
            _self.isNow && (_self.initDateTimeDD = _self.minD - 1);
            if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}$/.test(_self.trigger.value)) {
                rs = _self.trigger.value.match(/(^|-|\s|:)\d{1,4}/g);
                dateArr.yy = rs[0] - _self.minY;
                dateArr.mm = rs[1].replace(/-/g, "") - 1;
                dateArr.dd = rs[2].replace(/-/g, "") - 1;
                dateArr.hh = parseInt(rs[3].replace(/\s0?/g, ""));
                dateArr.mi = parseInt(rs[4].replace(/:0?/g, ""));
            } else {
                dateArr.yy = dateArr.yy - _self.minY;
            }

            _self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
            _self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
            _self.gearDate.querySelector(".date_dd").setAttribute("val", _self.minLevel);
            // _self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
            // _self.setDateGearTooth();
            _self.setDateGearToothAleter();
            _self.gearDate.querySelector(".time_hh").setAttribute("val", dateArr.hh);
            _self.gearDate.querySelector(".time_mm").setAttribute("val", dateArr.mi);
            _self.setTimeGearTooth();
        },
        //呼出时间插件
        popupTime: function(e) {
            var _self = this;
            _self.gearDate = document.createElement("div");
            _self.gearDate.className = "gearDate";
            _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                '<div class="date_btn_box">' +
                '<div class="date_btn lcalendar_cancel">取消</div>' +
                '<div class="date_btn">' + _self.title + '</div>' +
                '<div class="date_btn lcalendar_finish">确定</div>' +
                '</div>' +
                '<div class="date_roll_mask">' +
                '<div class="time_roll">' +
                '<div>' +
                '<div class="gear time_hh" data-datetype="time_hh"></div>' +
                '<div class="date_grid">' +
                // '<div>点</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div class="gear time_mm" data-datetype="time_mm"></div>' +
                '<div class="date_grid">' +
                // '<div>分</div>' +
                '</div>' +
                '</div>' +
                '</div>' + //time_roll
                '</div>' +
                '</div>';
            document.body.appendChild(_self.gearDate);
            _self.timeCtrlInit();
            var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
            lcalendar_cancel.addEventListener('touchstart', function(e) {
                _self.closeMobileCalendar(e, _self, true);
            });
            var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
            lcalendar_finish.addEventListener('touchstart', function(e) {
                _self.finishMobileTime(e, _self);
            });
            var time_hh = _self.gearDate.querySelector(".time_hh");
            var time_mm = _self.gearDate.querySelector(".time_mm");
            time_hh.addEventListener('touchstart', _self.gearTouchStart);
            time_mm.addEventListener('touchstart', _self.gearTouchStart);
            time_hh.addEventListener('touchmove', _self.gearTouchMove);
            time_mm.addEventListener('touchmove', _self.gearTouchMove);
            time_hh.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
            time_mm.addEventListener('touchend', function(e) { _self.gearTouchEnd(e, _self); });
        },
        //初始化时分插件默认值
        timeCtrlInit: function() {
            var _self = this;
            var d = new Date();
            var e = {
                hh: d.getHours(),
                mm: d.getMinutes()
            };
            if (/^\d{2}:\d{2}$/.test(_self.trigger.value)) {
                rs = _self.trigger.value.match(/(^|:)\d{2}/g);
                e.hh = parseInt(rs[0].replace(/^0?/g, ""));
                e.mm = parseInt(rs[1].replace(/:0?/g, ""))
            }
            _self.gearDate.querySelector(".time_hh").setAttribute("val", e.hh);
            _self.gearDate.querySelector(".time_mm").setAttribute("val", e.mm);
            _self.setTimeGearTooth();
        },
        //设置年月
        setDateGearToothAleter: function() {
            var _self = this;

            var date_dd = _self.gearDate.querySelector(".date_dd");

            if (date_dd && date_dd.getAttribute("val")) {
                var ddVal = parseInt(date_dd.getAttribute("val"));
                //当年份月份到达最大值
                if (ddVal == 0) {
                    _self.isMinYM = true;
                }
                //当年、月到达最小值
                if (ddVal == _self.maxLevel) {
                    _self.isMaxYM = true;
                }
                if (_self.isNow) {
                    itemStr = "<div class='tooth'>现在</div>";
                } else {
                    itemStr = "";
                }


                if (_self.minM == _self.maxM) {
                    for (var ta = _self.minD; ta <= _self.maxD; ta++) {
                        itemStr += "<div class='tooth'>" + (_self.minM < 10 ? '0' + _self.minM : _self.minM) + '月' +
                            (ta < 10 ? '0' + ta : ta) + '日' + "</div>";
                    }
                } else {
                    var maxMonthDays = _self.calcDays(_self.minY, _self.minM - 1);
                    for (var t = _self.minD; t <= maxMonthDays; t++) {
                        itemStr += "<div class='tooth'>" + (_self.minM < 10 ? '0' + _self.minM : _self.minM) + '月' +
                            (t < 10 ? '0' + t : t) + '日' + "</div>";
                    }
                    for (var tt = 1; tt <= _self.maxD; tt++) {
                        itemStr += "<div class='tooth'>" + (_self.maxM < 10 ? '0' + _self.maxM : _self.maxM) + '月' +
                            (tt < 10 ? '0' + tt : tt) + '日' + "</div>";
                    }
                }

                if (ddVal < _self.minLevel) {
                    ddVal = _self.minLevel;
                } else if (ddVal > _self.maxLevel) {
                    ddVal = _self.maxLevel;
                }
                date_dd.setAttribute("val", ddVal);
                date_dd.innerHTML = itemStr;
                date_dd.style["-webkit-transform"] = 'translate3d(0,' + (8 - ddVal * 2) + 'em,0)';
                date_dd.setAttribute('top', 8 - ddVal * 2 + 'em');
            }
        },
        //重置日期节点个数
        setDateGearTooth: function() {
            var _self = this;
            var passY = _self.maxY - _self.minY + 1;
            var date_yy = _self.gearDate.querySelector(".date_yy");
            var itemStr = "";
            if (date_yy && date_yy.getAttribute("val")) {
                //得到年份的值
                var yyVal = parseInt(date_yy.getAttribute("val"));

                //p 当前节点前后需要展示的节点个数

                for (var p = 0; p <= passY - 1; p++) {
                    itemStr += "<div class='tooth'>" + (_self.minY + p) + "</div>";
                }
                date_yy.innerHTML = itemStr;
                var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
                if (!isNaN(top)) {
                    top % 2 == 0 ? (top = top) : (top = top + 1);
                    top > 8 && (top = 8);
                    var minTop = 8 - (passY - 1) * 2;
                    top < minTop && (top = minTop);
                    date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
                    date_yy.setAttribute('top', top + 'em');
                    yyVal = Math.abs(top - 8) / 2;
                    date_yy.setAttribute("val", yyVal);
                } else {
                    date_yy.style["-webkit-transform"] = 'translate3d(0,' + (8 - yyVal * 2) + 'em,0)';
                    date_yy.setAttribute('top', 8 - yyVal * 2 + 'em');
                }
            } else {
                return;
            }
            var date_mm = _self.gearDate.querySelector(".date_mm");
            if (date_mm && date_mm.getAttribute("val")) {
                itemStr = "";
                //得到月份的值
                var mmVal = parseInt(date_mm.getAttribute("val"));
                var maxM = 11;
                var minM = 0;
                //当年份到达最大值
                if (yyVal == passY - 1) {
                    _self.isMaxY = true;
                    maxM = _self.maxM - 1;
                }
                //当年份到达最小值
                if (yyVal == 0) {
                    _self.isMinY = true;
                    minM = _self.minM - 1;
                }
                //p 当前节点前后需要展示的节点个数
                for (var p = 0; p < maxM - minM + 1; p++) {
                    itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
                }
                date_mm.innerHTML = itemStr;
                if (mmVal > maxM) {
                    mmVal = maxM;
                    date_mm.setAttribute("val", mmVal);
                } else if (mmVal < minM) {
                    mmVal = maxM;
                    date_mm.setAttribute("val", mmVal);
                }
                date_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minM) * 2) + 'em,0)';
                date_mm.setAttribute('top', 8 - (mmVal - minM) * 2 + 'em');
            } else {
                return;
            }
            var date_dd = _self.gearDate.querySelector(".date_dd");
            if (date_dd && date_dd.getAttribute("val")) {
                if (_self.isNow) {
                    itemStr = "<div class='tooth'>现在</div>";
                } else {
                    itemStr = "";
                }
                //得到日期的值
                var ddVal = parseInt(date_dd.getAttribute("val"));
                //返回月份的天数
                var maxMonthDays = _self.calcDays(yyVal, mmVal);
                //p 当前节点前后需要展示的节点个数
                var maxD = maxMonthDays - 1;
                var minD = 0;
                //当年份月份到达最大值
                if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
                    _self.isMaxYM = true;
                    maxD = _self.maxD - 1;
                }
                //当年、月到达最小值
                if (yyVal == 0 && _self.minM == mmVal + 1) {
                    _self.isMinYM = true;
                    if (_self.isNow) {
                        minD = _self.initDateTimeDD - 1;
                    } else {
                        minD = _self.minD - 1;
                    }
                }
                for (var pp = 0; pp < maxM - minM + 1; pp++) {
                    for (var p = 0; p < maxD - minD + 1; p++) {
                        if (_self.isNow && minD == _self.initDateTimeDD - 1 && minD + p + 1 == _self.initDateTimeDD) {

                        } else {
                            itemStr += "<div class='tooth'>" + (minM + pp + 1) + '月' + (minD + p + 1) + '日' + "</div>";
                        }
                    }
                }

                date_dd.innerHTML = itemStr;
                if (ddVal > maxD) {
                    ddVal = maxD;
                    date_dd.setAttribute("val", ddVal);
                } else if (ddVal < minD) {
                    ddVal = minD;
                    date_dd.setAttribute("val", ddVal);
                }

                date_dd.style["-webkit-transform"] = 'translate3d(0,' + (8 - (ddVal - minD) * 2) + 'em,0)';
                date_dd.setAttribute('top', 8 - (ddVal - minD) * 2 + 'em');

            } else {
                return;
            }
        },

        //重置时间节点个数
        setTimeGearTooth: function() {
            var _self = this;
            var time_hh = _self.gearDate.querySelector(".time_hh");

            var maxT = 23;
            var minT = 0;
            //得到日期的值
            // var ddVal = parseInt(_self.gearDate.querySelector(".date_dd").getAttribute("val")) + 1;
            var ddVal;
            var ddrealVal = document.querySelector(".date_dd").querySelectorAll(".tooth")[_self.gearDate.querySelector(".date_dd").getAttribute("val")].innerHTML;
            var exm = ddrealVal.split('月');
            var ex = exm.length > 1 ? exm[1].substr(0, exm[1].length - 1) : '';
            if (ex) {
                ddVal = parseInt(ex);
            } else {
                ddVal = -1;
            }
            //当年月日期到达最大值
            if (ddVal == _self.maxD && _self.isMaxYM === true) {
                _self.isMaxYMD = true;
                maxT = _self.maxT;
            }
            //当年月日期到达最小值
            if ((ddVal == _self.minD && _self.isMinYM === true) || (_self.isNow && ddVal == _self.initDateTimeDD + 1)) {
                _self.isMinYMD = true;
                minT = _self.minT;
            }
            if (time_hh && time_hh.getAttribute("val")) {
                var i = "";
                var hhVal = time_hh.getAttribute("val");
                if (hhVal == "--") {
                    hhVal = _self.minT;
                } else {
                    hhVal = parseInt(hhVal);
                }
                hhVal = hhVal > maxT ? maxT : hhVal;
                hhVal = hhVal < minT ? minT : hhVal;
                for (var g = minT; g <= maxT; g++) {
                    i += "<div class='tooth'>" + g + "点</div>";
                }
                if (i === "") {
                    i = "<div class='tooth'>" + hhVal + "点</div>"
                }

                if (_self.isNow && ddVal == -1) {
                    time_hh.innerHTML = "<div class='tooth'>--</div>";
                    time_hh.setAttribute("val", '--');
                    time_hh.style["-webkit-transform"] = 'translate3d(0,8em,0)';
                    time_hh.setAttribute('top', '8em');
                } else {
                    time_hh.setAttribute("val", hhVal);
                    time_hh.innerHTML = i;
                    time_hh.style["-webkit-transform"] = 'translate3d(0,' + (8 - (hhVal - minT) * 2) + 'em,0)';
                    time_hh.setAttribute('top', 8 - (hhVal - minT) * 2 + 'em');
                }

            } else {
                return
            }
            var maxS = 59;
            var minS = 0;

            //当年月日小时到达最大值并且日期到达最大值
            if (hhVal == maxT && _self.isMaxYMD === true) {
                maxS = _self.maxS;
            }
            //当年月日小时到达最小值
            if (hhVal == minT && _self.isMinYMD === true) {
                minS = _self.minS;
            }

            var time_mm = _self.gearDate.querySelector(".time_mm");

            if (time_mm && time_mm.getAttribute("val")) {
                var i = "";
                var mmVal = time_mm.getAttribute("val");
                if (mmVal == "--") {
                    mmVal = _self.minS;
                } else {
                    mmVal = parseInt(mmVal);
                }
                if (mmVal == 0) {
                    mmVal = 0;
                } else if (mmVal <= 10) {
                    mmVal = 10;
                } else if (mmVal <= 20) {
                    mmVal = 20;
                } else if (mmVal <= 30) {
                    mmVal = 30;
                } else if (mmVal <= 40) {
                    mmVal = 40;
                } else if (mmVal <= 50) {
                    mmVal = 50;
                } else {
                    mmVal = 50;
                }
                mmVal = mmVal > maxS ? maxS : mmVal;
                mmVal = mmVal < minS ? minS : mmVal;

                // time_mm.setAttribute("val", mmVal);
                _self.mmNum = 0;
                _self.mmValArr = [];
                for (var g = minS; g <= maxS; g += 10) {
                    if (g === 0) {
                        i += "<div class='tooth'>00分</div>";
                    } else {
                        i += "<div class='tooth'>" + g + "分</div>";
                    }
                    _self.mmNum++;
                    _self.mmValArr.push(g);
                }
                time_mm.innerHTML = i;
                if (_self.isNow && ddVal == -1) {
                    time_mm.innerHTML = "<div class='tooth'>--</div>";
                    time_mm.setAttribute("val", '--');
                    time_mm.style["-webkit-transform"] = 'translate3d(0,8em,0)';
                    time_mm.setAttribute('top', '8em');
                } else {
                    time_mm.setAttribute("val", mmVal);
                    time_mm.innerHTML = i;
                    time_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minS) * 2 / 10) + 'em,0)';
                    time_mm.setAttribute('top', 8 - (mmVal - minS) * 2 / 10 + 'em');
                }


            } else {
                return
            }
        },
        //求月份最大天数
        calcDays: function(year, month) {
            var _self = this;
            if (month == 1) {
                year += _self.minY;
                if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
                    return 29;
                } else {
                    return 28;
                }
            } else {
                if (month == 3 || month == 5 || month == 8 || month == 10) {
                    return 30;
                } else {
                    return 31;
                }
            }
        },
        //触摸开始
        gearTouchStart: function(e) {
            e.preventDefault();
            var target = e.target;
            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break
                }
            }
            clearInterval(target["int_" + target.id]);
            target["old_" + target.id] = e.targetTouches[0].screenY;
            target["o_t_" + target.id] = (new Date()).getTime();
            var top = target.getAttribute('top');
            if (top) {
                target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
            } else {
                target["o_d_" + target.id] = 0;
            }
            target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
        },
        //手指移动
        gearTouchMove: function(e) {
            var _self = this;
            e.preventDefault();
            var target = e.target;
            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break
                }
            }
            target["new_" + target.id] = e.targetTouches[0].screenY;
            target["n_t_" + target.id] = (new Date()).getTime();
            var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
            target["pos_" + target.id] = target["o_d_" + target.id] + f;
            target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
            target.setAttribute('top', target["pos_" + target.id] + 'em');
            if (e.targetTouches[0].screenY < 1) {
                _self.gearTouchEnd(e);
            };
        },
        //离开屏幕
        gearTouchEnd: function(e, self1) {
            // var _self = this;
            e.preventDefault();
            var target = e.target;
            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break;
                }
            }
            var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
            if (isNaN(flag)) flag = 0;
            if (Math.abs(flag) <= 0.2) {
                target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
            } else {
                if (Math.abs(flag) <= 0.5) {
                    target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                } else {
                    target["spd_" + target.id] = flag / 2;
                }
            }
            if (!target["pos_" + target.id]) {
                target["pos_" + target.id] = 0;
            }
            self1.rollGear(target);
        },
        //缓动效果
        rollGear: function(target) {
            var _self = this;
            var d = 0;
            var stopGear = false;
            var ddVal = parseInt(_self.gearDate.querySelector(".date_dd").getAttribute("val")) + 1;

            function setDuration() {
                target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                stopGear = true;
            }
            var passY = _self.maxY - _self.minY + 1;
            clearInterval(target["int_" + target.id]);
            target["int_" + target.id] = setInterval(function() {
                var pos = target["pos_" + target.id];
                var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                pos += speed;
                if (Math.abs(speed) > 0.1) {} else {
                    var b = Math.round(pos / 2) * 2;
                    pos = b;
                    setDuration();
                }
                if (pos > 8) {
                    pos = 8;
                    setDuration();
                }
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var date_mm = _self.gearDate.querySelector(".date_mm");
                var yyVal = parseInt(date_yy.getAttribute("val"));
                var mmVal = parseInt(date_mm.getAttribute("val"));
                var date_dd = _self.gearDate.querySelector(".date_dd");
                var ddVal = parseInt(date_dd.getAttribute("val"));

                switch (target.dataset.datetype) {
                    case "date_yy":
                        var minTop = 8 - (passY - 1) * 2;
                        if (pos < minTop) {
                            pos = minTop;
                            setDuration();
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2;
                            _self.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "date_mm":
                        var maxM = 11;
                        var minM = 0;
                        //当年份到达最大值
                        if (yyVal == passY - 1) {
                            maxM = _self.maxM - 1;
                        }
                        //当年份到达最小值
                        if (yyVal == 0) {
                            minM = _self.minM - 1;
                        }
                        var minTop = 8 - (maxM - minM) * 2;
                        if (pos < minTop) {
                            pos = minTop;
                            setDuration();
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2 + minM;
                            _self.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "date_dd":
                        //返回月份的天数
                        // var maxMonthDays = _self.calcDays(yyVal, mmVal);
                        // var maxD = maxMonthDays - 1;
                        // var minD = 0;
                        // //当年份月份到达最大值
                        // if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
                        //     maxD = _self.maxD - 1;
                        // }
                        // //当年、月到达最小值
                        // if (yyVal == 0 && _self.minM == mmVal + 1) {
                        //     if (_self.initDateTimeDD) {
                        //         minD = _self.initDateTimeDD - 1;
                        //     } else {
                        //         minD = _self.minD - 1;
                        //     }
                        // }
                        // var minTop = 8 - (maxD - minD) * 2;
                        var minTop = 8 - (_self.maxLevel - _self.minLevel) * 2;
                        if (pos < minTop) {
                            pos = minTop;
                            setDuration();
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2;
                            // var gearVal = Math.abs(pos - 8) / 2 + minD;
                            _self.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "time_hh":
                        var minT = 0;
                        var maxT = 23;
                        //当日期到达最大值
                        if (ddVal == _self.maxLevel) {
                            maxT = _self.maxT;
                        }
                        // if (yyVal == passY - 1 && ddVal == _self.maxD && _self.maxM == mmVal + 1) {
                        //     maxT = _self.maxT;
                        // }
                        //当日期到达最小值
                        if (ddVal == _self.minLevel || (_self.isNow && ddVal == _self.minLevel + 1)) {
                            minT = _self.minT;
                        }
                        // if (yyVal == 0 && ddVal == _self.minD && _self.minM == mmVal + 1) {
                        //     minT = _self.minT;
                        // }
                        var minTop = 8 - (maxT - minT) * 2;
                        if (pos < minTop) {
                            pos = minTop;
                            setDuration();
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2 + minT;
                            _self.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "time_mm":
                        var minS = 0;
                        var date_hh = _self.gearDate.querySelector(".time_hh");
                        var hhVal = parseInt(date_hh.getAttribute("val"));
                        //当时间到达最小值
                        if (hhVal == _self.minT && ddVal == _self.minLevel) {
                            minS = _self.minS;
                        }
                        // if (hhVal == _self.minT && yyVal == 0 && ddVal == _self.minD && _self.minM == mmVal + 1) {
                        //     minS = _self.minS;
                        // }
                        var num = 10 - _self.mmNum * 2;
                        if (pos < num) { //110
                            pos = num;
                            setDuration();
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2 * 10 + minS;
                            _self.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    default:
                }
                target["pos_" + target.id] = pos;
                if (!(_self.isNow && ddVal == _self.minLevel)) {
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                    target.setAttribute('top', pos + 'em');
                }
                d++;
            }, 30);
        },
        //控制插件滚动后停留的值
        setGear: function(target, val) {
            var _self = this;
            _self.isMinYMD = false;
            _self.isMaxYMD = false;
            val = Math.round(val);
            target.setAttribute("val", val);
            if (/date/.test(target.dataset.datetype)) {
                _self.isMinYM = false;
                _self.isMaxYM = false;
                // _self.setDateGearTooth();
                _self.setDateGearToothAleter();
                _self.setTimeGearTooth();
            } else {
                _self.setTimeGearTooth();
            }
        },
        //取消
        closeMobileCalendar: function(e, _self, bool) {
            var date_yy = _self.gearDate.querySelector(".date_yy");
            var date_mm = _self.gearDate.querySelector(".date_mm");
            var date_dd = _self.gearDate.querySelector(".date_dd");
            var time_hh = _self.gearDate.querySelector(".time_hh");
            var time_mm = _self.gearDate.querySelector(".time_mm");
            if (date_yy) clearInterval(date_yy["int_" + date_yy.id]);
            if (date_mm) clearInterval(date_mm["int_" + date_mm.id]);
            if (date_dd) clearInterval(date_dd["int_" + date_dd.id]);
            if (time_hh) clearInterval(time_hh["int_" + time_hh.id]);
            if (time_mm) clearInterval(time_mm["int_" + time_mm.id]);
            e.preventDefault();
            var evt;
            try {
                evt = new CustomEvent('input');
            } catch (e) {
                //兼容旧浏览器(注意：该方法已从最新的web标准中删除)
                evt = document.createEvent('Event');
                evt.initEvent('input', true, true);
            }
            _self.trigger.dispatchEvent(evt);
            //$(_self.gearDate).remove();
            document.body.removeChild(_self.gearDate);
            _self.gearDate = null;
            if (bool) {
                _self.cancel();
            }
        },
        //日期确认
        finishMobileDate: function(e, _self) {
            if (!_self.gearDate) {

            }
            var passY = _self.maxY - _self.minY + 1;
            var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));

            var date_mm;
            var ddrealVal = document.querySelector(".date_dd").querySelectorAll(".tooth")[_self.gearDate.querySelector(".date_dd").getAttribute("val")].innerHTML;
            var exm = ddrealVal.split("月");
            if (exm.length) {
                date_mm = parseInt(exm[0]);
            }
            // var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
            date_mm = date_mm > 9 ? date_mm : '0' + date_mm;

            var date_dd;
            var ex = exm.length > 1 ? exm[1].substr(0, exm[1].length - 1) : '';
            // var ex = ddrealVal.match(new RegExp("(?<=月).+(?=日)"));
            if (ex) {
                date_dd = parseInt(ex);
            }
            // var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
            date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
            //_self.trigger.value = (date_yy % passY + _self.minY) + "-" + date_mm + "-" + date_dd;
            _self.callback((date_yy % passY + _self.minY) + "-" + date_mm + "-" + date_dd);
            _self.closeMobileCalendar(e, _self);


        },
        //年月确认
        finishMobileYM: function(e, _self) {
            if (!_self.gearDate) {
                _self.closeMobileCalendar(e, _self);
                return;
            }
            var passY = _self.maxY - _self.minY + 1;
            var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
            var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
            date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
            //_self.trigger.value = (date_yy % passY + _self.minY) + "-" + date_mm;
            _self.callback((date_yy % passY + _self.minY) + "-" + date_mm);
            _self.closeMobileCalendar(e, _self);
        },
        //日期时间确认
        finishMobileDateTime: function(e, _self) {
            if (!_self.gearDate) {
                _self.closeMobileCalendar(e, _self);
                return;
            }
            var passY = _self.maxY - _self.minY + 1;
            var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
            var date_mm;
            var ddrealVal = document.querySelector(".date_dd").querySelectorAll(".tooth")[_self.gearDate.querySelector(".date_dd").getAttribute("val")].innerHTML;
            var exm = ddrealVal.split("月");
            if (exm.length) {
                date_mm = parseInt(exm[0]);
            }
            // var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
            date_mm = date_mm > 9 ? date_mm : '0' + date_mm;

            var date_dd;
            var ex = exm.length > 1 ? exm[1].substr(0, exm[1].length - 1) : '';
            if (ex) {
                date_dd = parseInt(ex);
            }
            // var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
            date_dd = date_dd > 9 ? date_dd : '0' + date_dd;

            var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));

            time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
            var time_mm = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));

            time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
            //_self.trigger.value = (date_yy % passY + _self.minY) + "-" + date_mm + "-" + date_dd + " " + (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm;
            if (ddrealVal == '现在') {
                _self.callback('现在');
            } else {
                _self.callback((date_yy % passY + _self.minY) + "-" + date_mm + "-" + date_dd + " " + (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm);
            }
            _self.closeMobileCalendar(e, _self);
        },
        //时间确认
        finishMobileTime: function(e, _self) {
            if (!_self.gearDate) {
                _self.closeMobileCalendar(e, _self);
                return;
            }
            var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
            time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
            var time_mm = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));
            time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
            //_self.trigger.value = (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm;
            _self.callback((time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm);
            _self.closeMobileCalendar(e, _self);
        },
        bindEvent: function(type) {
            var _self = this;

            _self.trigger.addEventListener('click', _self.clickFn);
        },
        clickFn: function(params) {
            var _self = this;
            _self.init(params);

            switch (_self.type) {
                case 'ym': //
                    _self.popupYM();
                    break;
                case 'date': //
                    _self.popupDate();
                    break;
                case 'datetime': //
                    _self.popupDateTime();
                    break;
                case 'time': //
                    _self.popupTime();
                    break;
                default:
                    break;
            }
        }
    }
    return MobileCalendar;
})()