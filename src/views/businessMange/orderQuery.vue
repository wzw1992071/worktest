<template>
  <div id="orderQuery">
        <Tabs value="orderQuery">
        <Tab-pane label="订单查询" name="orderQuery">
            <div class="orderQuery">
               <div id="name">
                   <i class="iconfont icon-kehujingli1"></i>
                       <Select  v-if="isBoss" v-model="personModel" style="width:100px">
                            <Option v-for="item in personList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                   <span v-else class="users">{{users}}</span>
               </div>
               <div class="filterBar">
                   <DatePicker type="date" v-model="params.time[0]" placeholder="请选择日期" formate="yyyy-MM-dd" style="width: 160px;height:40px"></DatePicker>
                   <span style="line-height:35px;color: #818080;padding: 0 3px">——</span>
                   <DatePicker type="date" v-model="params.time[1]" placeholder="请选择结束日期" formate="yyyy-MM-dd" style="width: 160px;height:40px;margin-right:30px;"></DatePicker>
                   <Select v-model="params.order" style="width:110px;height:40px;margin-right:10px">
                        <Option v-for="item in filterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div class="dcanmou_so_area">
                        <input class="dcm_ipt" v-model="params.name" placeholder="     请输入要查询的内容">
                        <button class="dcm_so_btn" >搜索</button>
                    </div>
                    <button class="dcm_so_btn" style="margin-left:10px">刷新</button>
               </div>
               <p class="result">搜索结果<span>{{'共'+num+'笔'}}</span>订单</p>
               <Table :columns="columns" :data="data"></Table>
            </div>
        </Tab-pane>
    </Tabs>
     <dcm-footer></dcm-footer>
  </div>
</template>
<script>
import dcmFooter from './../../components/footer.vue';
export default {
  components: {dcmFooter},
  data () {
      return {
          isBoss: false,
          num:10,
          personModel: '',
          personList: [{
              value: 1,
              label: '小王'
          }, {
              value: 2,
              label: '小黄'
          }],
          filterList: [{
              value:'dnm',
              label: '店铺名'
          }, {
              value: 'dh',
              label: '电话'
          }, {
              value: 'sp',
              label: '商品'
          }],
          users: '张大大',
          params: {
              time: ['2012-10-10', ''],
              name: '',
              order: 'dnm'
          },
          data: [],
          columns:[
              {
                title: '买家店铺名',
                key: 'buyer_name'
              },
              {
                  title: '买家地址',
                  key: 'buyer_address'
              },
              {
                  title: '买家手机',
                  key: 'buyer_phone'
              }
            ]
      }
  }
}
</script>

<style lang="less" >
@Colr: #4ccadd;
@boderStyle: 1px solid #f5f5f5;
@textColor: #495060;
#orderQuery {
    color: @textColor!important;
    .dcm_so_btn:focus {
        outline: none;
    }
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
        margin-bottom: 10px;
    }
        font-size: 14px;
        padding-right: 40px;
    .orderQuery {
        font-size: 14px;
        padding-left: 30px;
        padding-bottom: 70px;
        .dcanmou_so_area {
            border-color: #dddee1;
        }
        .filterBar {
            display: inline-flex;
            .ivu-input, .ivu-select-single .ivu-select-selection{height: 40px;font-size: 14px;}
            .ivu-select-placeholder, .ivu-select-selected-value{line-height: 40px;}
            .dcanmou_so_area .dcm_ipt {color: @textColor}
        }
        .result {
            span { color: #ff4242;}
            font-size: 16px;
            line-height: 50px;
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
