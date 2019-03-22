angular.module("bw.services")
    .factory('setLightTime', ['$state','baseService', function($state,baseService) {
        return {
            /**
             * 获取夜间费计算信息
             * @Author duan       2017-07-26T11:32:22+0800
             * @param  {Function} callback                 [description]
             * @return {[type]}                            [description]
             */
            getLightInfo: function(startTime, endTime,NightInfo) {
                var getTime = function(str) {
                    return new Date(str).getTime();
                }
                var NightStartHour = NightInfo.NightStartHour;
                var NightStartMinute = NightInfo.NightStartMinute;
                var NightEndHour = NightInfo.NightEndHour;
                var NightEndMinute = NightInfo.NightEndMinute;

                NightStartHour = NightStartHour.length <= 1 ? '0' + NightStartHour : NightStartHour;
                NightStartMinute = NightStartMinute.length <= 1 ? '0' + NightStartMinute : NightStartMinute;
                NightEndHour = NightEndHour.length <= 1 ? '0' + NightEndHour : NightEndHour;
                NightEndMinute = NightEndMinute.length <= 1 ? '0' + NightEndMinute : NightEndMinute;

                var minLightTime = ' ' + NightStartHour + ':' + NightStartMinute;
                var maxLightTime = ' ' + NightEndHour + ':' + NightEndMinute;
                var isInterDay = false;
                if (getTime('2017/08/03' + minLightTime) > getTime('2017/08/03' + maxLightTime)) isInterDay = true;

                var orderStartDate = baseService.formateToDate(startTime, '/');
                var lightStartTime, lightEndTime, day = 0;

                var orderStartMinLightTime = getTime(orderStartDate + minLightTime);
                var orderStartMaxLightTime = getTime(orderStartDate + maxLightTime);
                var timeDifference = orderStartMaxLightTime - orderStartMinLightTime;

                var lightTimeArr=[];
                //计算第一个区域的夜间时间范围
                if (isInterDay) {
                    //如果开始时间小于当前日期05：00或者大于当前日期23:00 则夜间费计算时间为开始时间
                    if (startTime <= orderStartMaxLightTime) {
                        lightStartTime = startTime;
                        lightEndTime = orderStartMaxLightTime;
                    } else if (startTime >= orderStartMinLightTime) {
                        lightStartTime = startTime;
                        lightEndTime = getTime(baseService.formateToDate(startTime + 86400000, '/') + maxLightTime);
                    } else {
                        lightStartTime = orderStartMinLightTime;
                        lightEndTime = getTime(baseService.formateToDate(startTime + 86400000, '/') + maxLightTime);
                    }
                } else {
                    if (startTime <= orderStartMinLightTime) {
                        lightStartTime = orderStartMinLightTime;
                        lightEndTime = orderStartMaxLightTime;
                    } else if (startTime <= orderStartMaxLightTime) {
                        lightStartTime = startTime;
                        lightEndTime = orderStartMaxLightTime;
                    } else {
                        lightStartTime = getTime(baseService.formateToDate(startTime + 86400000, '/') + minLightTime);
                        lightEndTime = getTime(baseService.formateToDate(startTime + 86400000, '/') + maxLightTime);
                    }
                }

                //如果当前时间大于了夜间费计算时间 有夜间费
                if (endTime > lightStartTime) {
                    var n = 0;
                    var thisDate, thisTime, lastEndTime, lastStartTime, thisMinLightTime, thisMaxLightTime;
                    while (1) {
                        thisTime = endTime - n * 86400000;
                        thisDate = baseService.formateToDate(thisTime, '/');
                        if (n === 0) {
                            thisMinLightTime = getTime(thisDate + minLightTime);
                            thisMaxLightTime = getTime(thisDate + maxLightTime);
                            //计算最后一个区域的夜间时间范围
                            if (isInterDay) {
                                if (thisTime <= thisMaxLightTime) {
                                    lastEndTime = thisTime;
                                    lastStartTime = getTime(baseService.formateToDate(thisTime - 86400000, '/') + minLightTime);
                                } else if (thisTime >= thisMinLightTime) {
                                    lastStartTime = thisMinLightTime;
                                    lastEndTime = thisTime;
                                } else {
                                    lastStartTime = getTime(baseService.formateToDate(thisTime - 86400000, '/') + minLightTime);
                                    lastEndTime = thisMaxLightTime;
                                }
                            } else {
                                if (thisTime <= thisMinLightTime) {
                                    lastStartTime = getTime(baseService.formateToDate(thisTime - 86400000, '/') + minLightTime);
                                    lastEndTime = getTime(baseService.formateToDate(thisTime - 86400000, '/') + maxLightTime);
                                } else if (thisTime <= thisMaxLightTime) {
                                    lastStartTime = thisMinLightTime;
                                    lastEndTime = thisTime;
                                } else {
                                    lastStartTime = thisMinLightTime;
                                    lastEndTime = thisMaxLightTime;
                                }
                            }
                            //如果最后一个区域和第一个区域重合，没有跨天
                            if (lastStartTime <= lightStartTime) {
                                lightEndTime = lastEndTime;
                                break;
                            }
                        } else {
                            if (lastStartTime - n * 86400000 > lightStartTime) {
                                day++;
                                //去鹰眼获取距离
                                lightTimeArr.push({startTime:lastStartTime - n * 86400000,endTime:lastStartTime - n * 86400000 + timeDifference});
                                //$scope.getCarDistance(lastStartTime - n * 86400000, lastStartTime - n * 86400000 + timeDifference, true);
                            } else {
                                break;
                            }
                        }
                        n++;
                    }
                    if (lightEndTime === lastEndTime) {
                        //去鹰眼获取距离
                        //$scope.getCarDistance(lightStartTime, lightEndTime, true);
                        lightTimeArr.push({startTime:lightStartTime,endTime:lightEndTime});
                    } else {
                        //去鹰眼获取距离
                        lightTimeArr.push({startTime:lightStartTime,endTime:lightEndTime});
                        //$scope.getCarDistance(lightStartTime, lightEndTime, true);
                        //去鹰眼获取距离
                        lightTimeArr.push({startTime:lastStartTime,endTime:lastEndTime});
                        //$scope.getCarDistance(lastStartTime, lastEndTime, true);
                    }

                    return lightTimeArr;
                }
            }
        }
    }])