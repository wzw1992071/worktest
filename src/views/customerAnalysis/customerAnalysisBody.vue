<template>
	<div id="analysisBody">
		<!-- 头部筛选项 -->
			 		<div id="border_bottom">
						<Row>
					        <Col span="3">
					            <div style="margin:30px 0">
									<Select   @on-change="timeLenthChange" v-model="timeLenth" style="width:146px">
				        				<Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    				</Select>
					            </div>
					        </Col>
					        <Col span="6">
					            <div class="timeP">
									<Date-picker type="date" v-model="params.time[0]"  format="yyyy-MM-dd" placeholder="选择日期" @on-change="kaishitimeChange" style="width: 130px;"></Date-picker>
									<p>至</p>
					            	<Date-picker type="date" v-model="params.time[1]" format="yyyy-MM-dd" placeholder="选择日期" @on-change="jieshutimeChange" style="width: 130px;"></Date-picker>
					            </div>
					        </Col>
					    </Row>
			 		</div> <!-- 头部筛选项结束 -->
			<!-- 底部表格 -->
					<div id="eChartsPic"  style="width: 100%;height: 550px;margin-bottom: 20px; margin-left:-130px;"></div>
	
	</div>
</template>
<script>
// 按需引入折线图
	var eCharts  =require ('echarts/lib/echarts');
		require('echarts/lib/chart/line');
		require('echarts/lib/component/tooltip');
		require('echarts/lib/component/title');

	
	export default {
			data () {
				return {
					timeList: [{value: 7, label: '最近7天'}, {value: 15, label: '最近15天'}, {value: 30, label: '最近30天'}],
					params: {time: []},
					timeLenth: 7,
					xData: [],
					yData: [],
					lineData: []
				};
			},
			methods: {
				kaishitimeChange (e) {
					this.params.time[0] = e;
					this.getBaseData();
				},
				jieshutimeChange (e) {
					this.params.time[1] = e;
					this.getBaseData();
				},
				getBaseData () {
					window.req.customerAnalysis(this, this.params, (res) => {
						if (res.code == 0) {
							this.lineData = res.data.detail;
							this.initeChartsPic();
						}
					});
					// _this.$http({
					// 	method: 'POST',
					// 	body: _this.params,
					// 	// url: './mock/fenxi.json',
					// 	url: '/statics/custom',
					// 	header: 'Accept:application/json'
					// }).then(response => {
					// 	if (response.body.code == 0) {
					// 		_this.lineData = response.body.data.detail;
					// 		_this.initeChartsPic();
					// 	}
					// });
				},
				initeChartsPic () {
					var eChartsPic = eCharts.init(document.getElementById('eChartsPic'));
					this.xData = [];
					this.yData = [];
						for (var i in this.lineData) {
									this.xData.push(this.lineData[i].time);
									this.yData.push(this.lineData[i].number);
								}
					eChartsPic.setOption({
					tooltip: {},
					color: ['#A4D4DB'],
					grid: {
						show:true,
						borderColor: '#DCDCDC',
						backgroundColor: '#FFFFFF',
						containLabel: true
					},
					legend: {
						data:['新增客户数'],
						y: 'bottom'
					},
					xAxis: {
						data: this.xData
					},
					yAxis: {},
					series: [{
						name: '新增客户数',
						type: 'line',
						data: this.yData
					}]
							});
				},
				getNowTime (Tlen) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * Tlen);
					var Ystart = start.getFullYear(),
					mstart = start.getMonth() + 1,
					dstart = start.getDate(),
					Yend = end.getFullYear(),
					mend = end.getMonth() + 1,
					dend = end.getDate();
					if (mstart < 10) {mstart = '0' + mstart;}
					if (dstart < 10) {dstart = '0' + dstart;}
					if (mend < 10) {mend = '0' + mend;}
					if (dend < 10) {dend = '0' + dend;}
					var endTime = Yend+ '-' + mend + '-' + dend,
					startTime = Ystart+ '-' + mstart + '-' + dstart;
					this.params.time[0] = startTime;
					this.params.time[1] = endTime;
				},
				timeLenthChange () {
					this.getNowTime(this.timeLenth);
					this.getBaseData();
				}
			},
			created () {
				this.getNowTime(this.timeLenth);
				this.getBaseData();
			}
	};
</script>
<style lang="less">
	#analysisBody {margin-left: 70px;
	#border_bottom {border-bottom: 1px solid #F2F3F2;}
	.timeP{display: flex;margin: 30px 0;}
	.timeP p {line-height: 32px;padding: 0 10px; font-size: 14px;}
	}
</style>