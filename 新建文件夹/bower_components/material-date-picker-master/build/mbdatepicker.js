(function() {
    'use strict';

    /**
     * By Mo Binni
     */
    var app, contains;

    app = angular.module('materialDatePicker', []);

    contains = function(container, contained) {
        var node;
        node = contained.parentNode;
        while (node !== null && node !== container) {
            node = node.parentNode;
        }
        return node !== null;
    };

    app.directive("outsideClick", [
        '$document', '$parse',
        function($document, $parse) {
            return {
                link: function($scope, $element, $attributes) {
                    var onDocumentClick, scopeExpression;
                    scopeExpression = $attributes.outsideClick;
                    onDocumentClick = function(event) {
                        if (!contains($element[0], event.target)) {
                            $scope.$apply(scopeExpression);
                        }
                    };
                    $document.on("click", onDocumentClick);
                    $element.on("$destroy", function() {
                        $document.off("click", onDocumentClick);
                    });
                }
            };
        }
    ]);

    app.directive('mbDatepicker', [
        '$filter', '$cookieStore',
        function($filter, $cookieStore) {
            return {
                scope: {
                    elementId: '@',
                    date: '=',
                    dateFormat: '@',
                    minDate: '@',
                    maxDate: '@',
                    inputClass: '@',
                    inputName: '@',
                    placeholder: '@',
                    arrows: '=?',
                    calendarHeader: '=?',
                    utcMode: '=',
                    ngDisabled: '=',
                    label: '@',
                    customInputClass: '@',
                    type: '=', //判断是出生还是试听
                    openCalender: '=' //是否打开日期选择
                },
                template: '<div id="dateSelectors" class="date-selectors"  outside-click="hidePicker()"> <label ng-bind="label" class="mb-input-label" for="{{inputName}}"></label> <input name="{{ inputName }}" type="text" ng-disabled="{{ngDisabled}}" ng-class="{disabled: ngDisabled}" class="mb-input-field {{customInputClass}}"    class="form-control" id="{{inputName}}" ng-model="date" placeholder="{{ placeholder }}"> <div class="mb-datepicker" ng-show="openCalender"> <table> <caption> <div class="header-year-wrapper"> <span style="width:3%;height:1.5rem;display: inline-block; float: left; padding-left:20px; cursor: pointer" class="noselect"  ><img ng-hide="isMaxMin.isMinYear" style="height: 1.5rem;" ng-src="{{ arrows.year.left }}" ng-click="previousYear(currentDate)"/></span> <span class="header-year noselect" ng-class="noselect">{{ year }}</span> <span style="width:3%;height:1.5rem;display: inline-block; float: right; padding-right:20px; cursor: pointer" class="noselect"  ><img ng-hide="isMaxMin.isMaxYear" style="height: 1.5rem;" ng-src="{{ arrows.year.right }}" ng-click="nextYear(currentDate)"/></span> </div> <div class="header-nav-wrapper"> <span class="header-item noselect" style="width:3%;height:1.5rem;float: left; cursor:pointer"  ><img ng-hide="isMaxMin.isMinMonth" style="height: 1.5rem;" ng-src="{{ arrows.month.left }}" ng-click="previousMonth(currentDate)"/></span> <span class="header-month noselect">{{ month }}</span> <span class="header-item header-right noselect" style="width:3%;height:1.5rem;float: right; cursor:pointer" > <img ng-hide="isMaxMin.isMaxMonth" style="height: 1.5rem;" ng-src="{{ arrows.month.right }}" ng-click="nextMonth(currentDate)"/></span> </div> </caption> <tbody> <tr> <td class="day-head">{{ ::calendarHeader.monday }}</td> <td class="day-head">{{ ::calendarHeader.tuesday }}</td> <td class="day-head">{{ ::calendarHeader.wednesday }}</td> <td class="day-head">{{ ::calendarHeader.thursday }}</td> <td class="day-head">{{ ::calendarHeader.friday }}</td> <td class="day-head">{{ ::calendarHeader.saturday }}</td> <td class="day-head">{{ ::calendarHeader.sunday }}</td> </tr> <tr class="days" ng-repeat="week in weeks"> <td ng-click="selectDate(day)"  class="noselect" ng-class="::day.class" ng-repeat="day in week" > <div style="display: block;" ng-class="{selected: selectedDate === day.selected}"> {{ ::day.value }} </div> </td> </tr> </tbody> </table> </div> </div>',
                restrict: 'E',
                transclude: true,
                link: function(scope, element, attrs) {

                    /**
                     *1.左点击，-1,右点击，+1
                     * 2.出生，月份无限制，年份-12<YearCount<=0即可,初始化该日期之后不可点击
                     * 3.试听，年份不可点击,0<=monthCount<3,该日期之前不可点击
                     *
                     */
                    scope.monthCount = 0;
                    scope.YearCount = 0; //初始点击次数为0


                    var getWeeks, init, selectors, today;
                    selectors = document.querySelector('#dateSelectors');
                    today = moment();
                    if (scope.utcMode) {
                        today.utc();
                    }
                    scope.month = '';
                    scope.year = today.year();
                    if (scope.inputClass) {
                        selectors.className = selectors.className + " " + scope.inputClass;
                    }
                    if (!scope.dateFormat) {
                        scope.dateFormat = "YYYY-MM-DD";
                    }
                    if (scope.minDate) {
                        scope.minDate = moment(scope.minDate, scope.dateFormat);
                        if (scope.utcMode) {
                            scope.minDate.utc();
                        }
                    }
                    if (scope.maxDate) {
                        scope.maxDate = moment(scope.maxDate, scope.dateFormat);
                        if (scope.utcMode) {
                            scope.maxDate.utc();
                        }
                    }
                    if (!scope.calendarHeader) {
                        scope.calendarHeader = {
                            monday: $filter('date')(new Date(moment().isoWeekday(1)), 'EEE'),
                            tuesday: $filter('date')(new Date(moment().isoWeekday(2)), 'EEE'),
                            wednesday: $filter('date')(new Date(moment().isoWeekday(3)), 'EEE'),
                            thursday: $filter('date')(new Date(moment().isoWeekday(4)), 'EEE'),
                            friday: $filter('date')(new Date(moment().isoWeekday(5)), 'EEE'),
                            saturday: $filter('date')(new Date(moment().isoWeekday(6)), 'EEE'),
                            sunday: $filter('date')(new Date(moment().isoWeekday(7)), 'EEE')
                        };
                    }
                    if (!scope.arrows) {
                        scope.arrows = {
                            year: {
                                left: 'images/white_arrow_left.svg',
                                right: 'images/white_arrow_right.svg'
                            },
                            month: {
                                left: 'images/grey_arrow_left.svg',
                                right: 'images/grey_arrow_right.svg'
                            }
                        };
                    }
                    getWeeks = function(monthLength, startDay, month) {
                        var chunk_size, day, j, monthDays, newDate, ref, start, weeks;

                        monthDays = [];
                        for (day = j = 0, ref = monthLength; 0 <= ref ? j <= ref : j >= ref; day = 0 <= ref ? ++j : --j) {
                            start = moment(startDay);
                            if (scope.utcMode) {
                                start.utc();
                            }
                            newDate = start.add(day, 'd');
                            day = {
                                date: newDate,
                                value: newDate.format('DD')
                            };
                            //判断日期限制--yxt
                            if (scope.type == "birth") {
                                scope.maxDate = today;
                            } else if (scope.type == "listen") {
                                scope.minDate = today;
                            }

                            if (scope.minDate && moment(newDate, scope.dateFormat) < moment(scope.minDate, scope.dateFormat)) {

                                day.isToday = true;
                                day.isEnabled = false;
                                day["class"] = 'disabled';
                                // monthDays.push(day);
                            } else if (scope.maxDate && moment(newDate, scope.dateFormat) > moment(scope.maxDate, scope.dateFormat)) {
                                day.isToday = true;
                                day.isEnabled = false;
                                day["class"] = 'disabled';
                            } else if (newDate.month() === month) {
                                day.isToday = false;
                                day.isEnabled = true;
                                day["class"] = 'day-item day';
                            } else if (newDate.day() === 0 || newDate.day() === 6) {
                                day.isToday = false;
                                day.isEnabled = true;
                                day["class"] = 'day-item weekend';
                            } else {
                                day.isToday = false;
                                day.isEnabled = true;
                                day["class"] = 'day-item';
                            }
                            if (newDate.format(scope.dateFormat) === moment().format(scope.dateFormat)) {
                                day.isToday = true;
                                day.isEnabled = true;
                                day["class"] = 'day-item today';
                            }
                            //除去不是本月的--yxt
                            if (newDate.month() != month) {
                                day.value = "";
                                day["class"] = 'disabled';
                                day.isEnabled = false;
                            }

                            monthDays.push(day);

                        }
                        chunk_size = 7;
                        weeks = monthDays.map(function(e, i) {
                            if (i % chunk_size === 0) {
                                return monthDays.slice(i, i + chunk_size);
                            } else {
                                return null;
                            }
                        }).filter(function(e) {
                            return e;
                        });
                        if (weeks) {
                            //除去多余一行
                            for (var i = 0; i < weeks.length; i++) {

                                for (var j = 0; j < weeks[i].length; j++) {
                                    var count = 0;
                                    if (weeks[i] instanceof Array) {
                                        for (var k = 0; k < weeks[i].length; k++) {
                                            // console.log(weeks[i][k].value);
                                            if (weeks[i][k].value == "") {
                                                count++;
                                                // console.log('week', count);
                                            }
                                            if (count == 7) {
                                                for (var h = 0; h < 7; h++) {
                                                    weeks[i].splice(weeks[i][h], 1);
                                                }

                                            }
                                        }
                                    }

                                }
                            }
                            return weeks;
                        } else {
                            return [];
                        }

                    };
                    scope.nextMonth = function(date) {
                        scope.monthCount++; //与当前月份+1

                        var first_day, last_day, next_month;
                        next_month = moment(date).date(0);
                        last_day = moment(next_month).add(4, 'months').date(0);
                        scope.year = last_day.year();
                        if (last_day.day() !== 7) {
                            last_day = last_day.add(7 - last_day.day(), 'days');
                        }
                        first_day = moment(next_month).add(2, 'months').startOf('isoweek');
                        scope.currentDate = first_day;


                        scope.weeks = [];
                        scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, next_month.add(3, 'months').month());
                        scope.month = $filter('date')(new Date(next_month), 'M');
                        scope.isType();
                    };
                    scope.previousMonth = function(date) {
                        scope.monthCount--;


                        var first_day, last_day, last_month;
                        last_month = moment(date).date(0);
                        last_day = moment(last_month).add(2, 'months').date(0);
                        scope.year = last_day.year();
                        if (last_day.day() !== 7) {
                            last_day = last_day.add(7 - last_day.day(), 'days');
                        }
                        first_day = moment(last_month).startOf('isoweek');
                        scope.currentDate = first_day;
                        scope.weeks = [];
                        scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, last_month.add(1, 'months').month());
                        scope.month = $filter('date')(new Date(last_month), 'M');
                        scope.isType();
                    };
                    scope.nextYear = function(date) {
                        scope.YearCount++;

                        var first_day, last_day, next_month;
                        next_month = moment(date).date(0);
                        last_day = moment(next_month).add(1, 'year').add(3, 'months').date(0);
                        scope.year = last_day.year();


                        if (last_day.day() !== 7) {
                            last_day = last_day.add(7 - last_day.day(), 'days');
                        }
                        first_day = moment(next_month).add(1, 'years').add(1, 'months').startOf('isoweek');
                        scope.currentDate = first_day;
                        scope.weeks = [];
                        scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, next_month.add(2, 'months').month());
                        scope.month = $filter('date')(new Date(next_month), 'M');
                        scope.isType();
                    };
                    scope.previousYear = function(date) {
                        scope.YearCount--;

                        var first_day, last_day, last_month;
                        last_month = moment(date).date(0);
                        last_day = moment(last_month).subtract(1, 'years').add(3, 'months').date(0);
                        scope.year = last_day.year();

                        if (last_day.day() !== 7) {
                            last_day = last_day.add(7 - last_day.day(), 'days');
                        }
                        first_day = moment(last_month).subtract(1, 'years').add(1, 'months').startOf('isoweek');
                        scope.currentDate = first_day;

                        scope.weeks = [];
                        scope.weeks = getWeeks(last_day.diff(first_day, 'days'), first_day, last_month.add(2, 'months').month());
                        scope.month = $filter('date')(new Date(last_month), 'M');
                        scope.isType();
                    };
                    scope.selectDate = function(day) {
                        if (day.isEnabled) {
                            scope.date = day.date.format(scope.dateFormat);
                            if (day.selected === scope.date) {
                                scope.selectedDate = day.selected;

                            }
                            if (scope.type == 'birth') {
                                $cookieStore.put('orderObj.Birthday', scope.date);
                            } else if (scope.type == 'listen') {
                                $cookieStore.put('orderObj.PreviewTime', scope.date);
                            }

                            history.go(-1);
                            scope.openCalender = false;



                        } else {
                            //选中不可点击的则不会关闭--yxt
                            scope.openCalender = true;
                        }
                        // return scope.openCalender;
                    };
                    // scope.showPicker = function() {
                    //     scope.openCalender = true;
                    // };
                    // scope.hidePicker = function() {
                    //     scope.openCalender = false;
                    // };
                    // 通过类型判断日期选择限制--yxt


                    scope.isType = function() {
                        // console.log(scope.type);

                        if (scope.type == "birth") {
                            if (scope.year >= today.year()) {
                                scope.isMaxMin.isMinMonth = false;
                                //若为当年
                                if (scope.month >= today.month() + 1) {
                                    scope.isMaxMin.isMaxMonth = true;
                                } else {
                                    scope.isMaxMin.isMaxMonth = false;
                                }
                            } else if (scope.year <= today.year() - 11) {
                                scope.isMaxMin.isMaxMonth = false;
                                if (scope.month <= today.month() + 1) {
                                    scope.isMaxMin.isMinMonth = true;
                                } else {
                                    scope.isMaxMin.isMinMonth = false;
                                }
                            } else {
                                scope.isMaxMin.isMinMonth = false;

                            }
                            // if (scope.year > today.year()) {
                            //     scope.isMaxMin.isMaxMonth = true;
                            // } else {
                            //     scope.isMaxMin.isMaxMonth = false;
                            // }
                            // scope.isMaxMin.isMinMonth = false;
                            if (scope.YearCount <= -11) {
                                scope.isMaxMin.isMinYear = true;
                                scope.isMaxMin.isMaxYear = false;
                            } else if (scope.YearCount >= 0) {
                                scope.isMaxMin.isMaxYear = true;
                                scope.isMaxMin.isMinYear = false;
                            } else {
                                scope.isMaxMin.isMaxYear = false;
                                scope.isMaxMin.isMinYear = false;
                            }
                        }
                        if (scope.type == "listen") {
                            console.log('选择试听日期');
                            scope.isMaxMin.isMaxYear = true;
                            scope.isMaxMin.isMinYear = true;
                            if (scope.monthCount <= 0) {
                                scope.isMaxMin.isMinMonth = true;
                                scope.isMaxMin.isMaxMonth = false;
                            } else if (scope.monthCount >= 2) {
                                scope.isMaxMin.isMaxMonth = true;
                                scope.isMaxMin.isMinMonth = false;
                            } else {
                                scope.isMaxMin.isMaxMonth = false;
                                scope.isMaxMin.isMinMonth = false;
                            }
                        }
                    }
                    init = function() {
                        scope.isMaxMin = {

                        };
                        var days, endDate, firstMonday;
                        if (scope.utcMode) {
                            firstMonday = moment.utc(moment.utc().date(1)).startOf('isoweek');
                        } else {
                            firstMonday = moment(moment().date(1)).startOf('isoweek');
                        }
                        if (firstMonday.date() === 1) {
                            firstMonday.subtract(1, 'weeks');
                        }

                        days = moment(moment().date(today.month())).daysInMonth();
                        endDate = moment().add(1, 'months').date(0);
                        scope.month = $filter('date')(new Date(endDate), 'M');
                        scope.isType();
                        if (endDate.day() !== 7) {
                            endDate = endDate.add(7 - endDate.day(), 'days');
                        }
                        scope.currentDate = firstMonday;
                        return scope.weeks = getWeeks(endDate.diff(firstMonday, 'days'), firstMonday, today.month());
                    };
                    return init();
                }
            };
        }
    ]);

}).call(this);
