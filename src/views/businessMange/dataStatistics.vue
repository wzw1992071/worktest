<template>
  <div id="dataStatistics">
        <Tabs value="dataStatistics">
        <Tab-pane label="数据统计" name="dataStatistics">
            <div class="dataStatistics">
               <div id="name">
                   <i class="iconfont icon-kehujingli1"></i>
                       <Select  v-if="isBoss" v-model="personModel" style="width:100px">
                            <Option v-for="item in personList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                   <span v-else class="users">{{users}}</span>
               </div>
                <div class="menu"><span></span>订单数据</div>
                <div class="chartBar">
                    <div class="filterBar">
                        <p>日期范围</p>
                        <DatePicker type="date" placeholder="请选择日期" style="width: 100px" format="yyyy-MM-dd"></DatePicker>
                        <b>——</b>
                        <DatePicker type="date" placeholder="请选择日期" style="width: 100px" format="yyyy-MM-dd"></DatePicker>
                        <div class="empty"></div>
                        <p>分组方式</p>
                        <RadioGroup v-model="params.order">
                            <Radio label="day" >按日</Radio>
                            <Radio label="week">按周</Radio>
                            <Radio label="month">按月</Radio>
                            <Radio label="year">按年</Radio>
                        </RadioGroup>
                        <div class="empty"></div>
                        <p>未完成订单</p>
                        <RadioGroup v-model="params.show">
                            <Radio label=1 >显示</Radio>
                            <Radio label=0>不显示</Radio>
                        </RadioGroup>
                    </div>
                    <div class="contextBar">
                        <div class="contextBarLeft" id="contextBarLeft1">
                        </div>
                        <div class="contextBarRight" id="contextBarRight1">
                        </div>
                    </div>
                </div>
                <div class="menu"><span></span>业绩数据</div>
                <div class="chartBar">
                    <div class="filterBar">
                        <p>日期范围</p>
                        <DatePicker type="date" placeholder="请选择日期" style="width: 100px" format="yyyy-MM-dd"></DatePicker>
                        <b>——</b>
                        <DatePicker type="date" placeholder="请选择日期" style="width: 100px" format="yyyy-MM-dd"></DatePicker>
                        <div class="empty"></div>
                        <p>分组方式</p>
                        <RadioGroup v-model="params.order">
                            <Radio label="day" >按日</Radio>
                            <Radio label="week">按周</Radio>
                            <Radio label="month">按月</Radio>
                            <Radio label="year">按年</Radio>
                        </RadioGroup>
                        <div class="empty"></div>
                        <p>未完成订单</p>
                        <RadioGroup v-model="params.show">
                            <Radio label=1 >显示</Radio>
                            <Radio label=0>不显示</Radio>
                        </RadioGroup>
                    </div>
                    <div class="contextBar">
                        <div class="contextBarLeft" id="contextBarLeft2">
                        </div>
                        <div class="contextBarRight" id="contextBarRight2">
                        </div>
                    </div>
                </div>
                <div class="menu"><span></span>客户数量</div>
                <div class="chartBar">
                    <div class="filterBar">
                        <p>日期范围</p>
                        <DatePicker type="date" placeholder="请选择日期" style="width: 100px" format="yyyy-MM-dd"></DatePicker>
                        <b>——</b>
                        <DatePicker type="date" placeholder="请选择日期" style="width: 100px" format="yyyy-MM-dd"></DatePicker>
                        <div class="empty"></div>
                        <p>分组方式</p>
                        <RadioGroup v-model="params.order">
                            <Radio label="day" >按日</Radio>
                            <Radio label="week">按周</Radio>
                            <Radio label="month">按月</Radio>
                            <Radio label="year">按年</Radio>
                        </RadioGroup>
                        <div class="empty"></div>
                        <p>未完成订单</p>
                        <RadioGroup v-model="params.show">
                            <Radio label=1 >显示</Radio>
                            <Radio label=0>不显示</Radio>
                        </RadioGroup>
                    </div>
                    <div class="contextBar">
                        <div class="contextBarLeft" id="contextBarLeft3">
                        </div>
                        <div class="contextBarRight" id="contextBarRight3">
                        </div>
                    </div>
                </div>
            </div>
        </Tab-pane>
    </Tabs>
    <dcm-footer></dcm-footer>
  </div>
</template>
<script>
import dcmFooter from './../../components/footer.vue';
import initCharts from './initCharts.js';
export default {
  mixins: [initCharts],
  components: {dcmFooter},
  name: 'dataStatistics',
  data () {
      return {
          users: '张大大',
          isBoss: false,
          personModel: '',
          personList: [{
              value: 1,
              label: '小王'
          }, {
              value: 2,
              label: '小黄'
          }],
          params: {
              order: 'day',
              show: 1
          }
      };
  },
  methods: {
      
  },
  mounted  () {
      this.initContextBarLeft1();
      this.initContextBarRight1();
      this.initContextBarLeft2();
      this.initContextBarRight2();
      this.initContextBarLeft3();
      this.initContextBarRight3();
  }
};
</script>

<style lang="less">
@boderStyle: 1px solid #f5f5f5;
@Colr: #4ccadd;
#dataStatistics {
    padding-right: 40px;
    .ivu-tabs-nav .ivu-tabs-tab {
        margin-left:0px;
        font-size: 16px;
    }
    .ivu-tabs-nav .ivu-tabs-ink-bar {
        left: 0;
        height: 8px;
        width: 120px;
    }
    .ivu-tabs-nav{
        margin-left: 30px;
    }
    .ivu-tabs-bar{
        margin-bottom: 20px;
    }
    .dataStatistics{
        font-size: 14px;
        padding-left: 30px;
        padding-bottom: 70px;
        .menu {
            font-size: 16px;color: #4d4c4c;
            line-height: 42px;
            span {
                display: inline-block;
                margin-right: 10px;
                width: 11px;
                height: 11px;
                border-radius: 11px;
                background-color: @Colr;
            }
        }
        .chartBar {
            .filterBar {
                background-color: #f0f0f0;
                height: 50px;
                display: flex;
                .ivu-date-picker{padding-top: 9px;}
                p, b{
                    line-height: 50px;
                    padding: 0 20px;
                }
                .empty {
                    width: 26px;
                    height: 30px;
                    border-right: 1px solid #cccccc;
                    margin-top: 10px;
                }
                .ivu-radio-group {
                    padding-top: 16px;
                }
            }
            .contextBar {
                display: flex;
                .contextBarRight {
                    height: 270px;
                    width: 63%;
                    border: @boderStyle;
                    border-top: none;
                    border-left: none;
                }
            }
            .contextBarLeft{
                width: 37%;
                height: 270px;
                border: @boderStyle;
                border-top: none;
            }
        }
    }
    #name{
        position: relative;
        .icon-kehujingli1{font-size: 28px;color: @Colr}
        .ivu-select-single .ivu-select-selection {
            height: 30px;
        }
        .ivu-select {margin-top: -11px;}
        .users {
            position: absolute;
            top: 10px;
            left: 41px;
        }
    }
}

</style>
