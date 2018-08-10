var eCharts  =require('echarts');
export default {
    methods: {
        initContextBarLeft1 () { // 初始化第一个折线图
            var contextBarLeft1 = eCharts.init(document.getElementById('contextBarLeft1'));
            var colors = ['#45c8dc'];
            contextBarLeft1.setOption({
                color: colors,
                legend: {
                    data:['订单数量']
                },
                xAxis: {
                        name: '日期',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    },
                yAxis: {
                    name: '订单数量'
                },
                series: [
                    {
                        name:'订单数量',
                        type:'line',
                        data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    }
                ]
            });
        },
        initContextBarRight1 () {
            var contextBarRight1 = eCharts.init(document.getElementById('contextBarRight1'));
            // var colors = ['#45c8dc'];
            contextBarRight1.setOption({
                // color: colors,
                title: {
                    text: '订单分布',
                    x:'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:['金牛区', '武侯区', '锦江区', '高新区', '青羊区']
                },
                series: [
                    {
                        name:'订单分布',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:335, name:'金牛区'},
                            {value:310, name:'武侯区'},
                            {value:234, name:'锦江区'},
                            {value:135, name:'高新区'},
                            {value:1548, name:'青羊区'}
                        ]
                    }
                ]
            });
        },
        initContextBarLeft2 () { // 初始化第二个折线图
            var contextBarLeft2 = eCharts.init(document.getElementById('contextBarLeft2'));
            var colors = ['#45c8dc'];
            contextBarLeft2.setOption({
                color: colors,
                legend: {
                    data:['订单数量']
                },
                xAxis: {
                        name: '日期',
                        data: ['1月', '2月', '3月', '4月', '5月']
                    },
                yAxis: {
                    name: '订单数量'
                },
                series: [
                    {
                        name:'订单数量',
                        type:'line',
                        data:[10, 12, 16, 18, 20]
                    }
                ]
            });
        },
        initContextBarRight2 () {
            var contextBarRight2 = eCharts.init(document.getElementById('contextBarRight2'));
            // var colors = ['#45c8dc'];
            contextBarRight2.setOption({
                // color: colors,
                title: {
                    text: '订单分布',
                    x:'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:['金牛区', '武侯区', '锦江区', '高新区', '青羊区']
                },
                series: [
                    {
                        name:'订单分布',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:35, name:'金牛区'},
                            {value:30, name:'武侯区'},
                            {value:24, name:'锦江区'},
                            {value:35, name:'高新区'},
                            {value:48, name:'青羊区'}
                        ]
                    }
                ]
            });
        },
        initContextBarLeft3 () { // 初始化第三个折线图
            var contextBarLeft3 = eCharts.init(document.getElementById('contextBarLeft3'));
            var colors = ['#45c8dc'];
            contextBarLeft3.setOption({
                color: colors,
                legend: {
                    data:['订单数量']
                },
                xAxis: {
                        name: '日期',
                        data: ['10月', '12月', '3月', '9月', '7月']
                    },
                yAxis: {
                    name: '订单数量'
                },
                series: [
                    {
                        name:'订单数量',
                        type:'line',
                        data:[20, 12, 6, 1, 30]
                    }
                ]
            });
        },
        initContextBarRight3 () {
            var contextBarRight3 = eCharts.init(document.getElementById('contextBarRight3'));
            // var colors = ['#45c8dc'];
            contextBarRight3.setOption({
                // color: colors,
                title: {
                    text: '订单分布',
                    x:'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:['金牛区', '武侯区', '锦江区', '高新区', '青羊区']
                },
                series: [
                    {
                        name:'订单分布',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:5, name:'金牛区'},
                            {value:30, name:'武侯区'},
                            {value:14, name:'锦江区'},
                            {value:85, name:'高新区'},
                            {value:28, name:'青羊区'}
                        ]
                    }
                ]
            });
        }
    }
};