<template>
  <div id="onShelfBrands">
    
      <div class="actions_area">
                        <button class="dcm_so_btn" @click="putDownBrands">下架</button>
                        <button class="dcm_so_btn" @click="changePrice">改价</button>
                        <button class="dcm_so_btn">置顶</button>
                        <button class="dcm_so_btn cancel">取消置顶</button>
                        <span class="txt">自动上架已选分类商品</span>
                        <i-switch size="large" v-model="switch1">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                        <span class="dcanmou_newUpload_time">最新上传时间：<span>{{newTime}}</span></span> <!--这个为全局样式-->
        </div>
        <Row>
            <Col span="4">
                <div class="typing">
                    <Checkbox>全选</Checkbox>
                    <Tree :data="typeData" @on-select-change="choiceTree" v-cloak></Tree>
                </div>
            </Col>
            <Col span="20">
                <Table border :loading="loading" :columns="oncolumns" @on-selection-change="selectBrands" :data="data.list"></Table>
                <div class="pageBar">
                    <Page :current="data.current"   :total="data.total" simple></Page>
                </div>
            </Col>
        </Row>
        <!-- <div class="typing">
                <Checkbox>全选</Checkbox>
                <Tree :data="typeData" @on-select-change="choiceTree" v-cloak></Tree>
            </div> -->
       <!-- <Table border :loading="loading" :columns="oncolumns" @on-selection-change="selectBrands" :data="data.list"></Table>
                <div class="pageBar">
                    <Page :current="data.current"   :total="data.total" simple></Page>
                </div> -->
  <!-- 改价弹窗 -->
<div class="dcanmou_modal_shade" id="dcanmou_modal_shade" v-if="changePriceModel">
        <div class="dcanmou_modal" >
        <p class=" modal_title">改价方式</p>
        <i class="iconfont icon-icon dcanmou_close" @click="changePriceModel=!changePriceModel"></i>
        <Tabs @on-click="whichName">
            <TabPane label="按元改价" icon="checkmark-circled" name=1>
                <div class="rmbchange">
                    <span>价格增加 </span>
                    <Button type="primary" shape="circle" icon="plus" @click="yuanPlus"></Button>
                    <div class="iptPrice">
                        <input v-model="yuan"/>
                        <span>元</span>
                    </div>
                    <Button type="primary" shape="circle" icon="minus" @click="yuanMinus"></Button>
                    <p class="btns">
                        <button class="dcm_so_btn">确定</button>
                        <button class="dcm_so_btn">取消</button>
                    </p>
                </div>
            </TabPane>
            <TabPane label="按百分比改价" icon="checkmark-circled" name=2>
                <div class="rmbchange">
                    <span>价格增加 </span>
                    <Button type="primary" shape="circle" icon="plus" @click="percentPlus"></Button>
                    <div class="iptPrice">
                        <input v-model="percent"/>
                        <span>%</span>
                    </div>
                    <Button type="primary" shape="circle" icon="minus" @click="percentMinus"></Button>
                    <p class="btns">
                        <button class="dcm_so_btn">确定</button>
                        <button class="dcm_so_btn">取消</button>
                    </p>
                </div>
            </TabPane>
            <TabPane label="按区间改价" icon="checkmark-circled" name=3>
                <div class="section">
                    <p>价格修改为</p>
                    <div class="changePriceActionArea">
                        <p class="actionInfo" v-for="item in changeRules" :key="item.value">
                            <input/> <span class="jian">-</span><input/>
                            <Select style="width:70px">
                                <Option v-for="item in plusOrminus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select style="width:82px" @on-change="yuan_percent_change">
                                <Option v-for="item in yuanOrpercent" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <input/>
                            <span class="yuan_percent">{{yuan_percent}}</span>
                            <Button  icon="ios-trash-outline" @click="rangeDelete"></Button >
                        </p>
                        <p class="btns" style="margin-bottom:20px;">
                        <button class="dcm_so_btn add" @click="addRuler"><Icon type="plus-circled"></Icon>添加</button>
                        <button class="dcm_so_btn">确定</button>
                        <button class="dcm_so_btn">取消</button>
                    </p>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div> 
    </div>
    <!-- 改价弹end -->
             <!-- 改价内容弹窗 -->
    <div class="dcm_price_info" id="dcm_price_info">
        <div class="sanjiao"></div>
    </div>
  </div>
  
</template>
<script>
export default {
  data (){
    return {
        loading: true,
        newTime: '2012-12-12 00:00:00',
        changePriceModel: false,
        switch1: true,
        typeData: [],
        params: {
            type: 1,
            page: 1,
            size: 10
        },
        selectedBrands: []
    };
  },
  methods: {
      putunderShelfBrands (index, id) { //下架
          console.log(index, id);
          this.data.splice(index, 1);
      },
      changePrice (index, id) { //改价
         this.changePriceModel = true;
         if(!id) {
             console.log('打印的东西', this.selectedBrands);
         }
         else{
             console.log('单一改价');
         }
      },
      pushTop (index, id) { //置顶
        var vm = this;
        if(!id) {
             return ;
        }
        else {
            console.log('单一置顶', index, id);
             var serial = {serial: 1};
             vm.data[index]= Object.assign(vm.data[index], serial);
        }
      },
      cancelpushTop (index, id) { //取消置顶
          console.log(index, id);
      },
      MouseHover (e, name) {
          var priceInfo = document.getElementById('dcm_price_info');
          priceInfo.style.display = 'block';
          priceInfo.style.top=e.clientY+10+ 'px';
          priceInfo.style.left=e.clientX-15+ 'px';
          return name;
      },
      MouseOut () {
          var priceInfo = document.getElementById('dcm_price_info');
          priceInfo.style.display = 'none';
      },
      selectBrands (e) { //多选
          this. selectedBrands = [];
          e.forEach(function(element) {
               this. selectedBrands.push(element.id);
          }, this);
      },
      putDownBrands () { //多个下架
        var vm = this;
        vm.selectedBrands.forEach(function(selections){
            vm.data.forEach(function(element, index){
                if(selections == element.id) {
                        vm.data.splice(index, 1);
                        console.log('对应的index', index);
                    }
            });
        });
      }
  },
  mounted () {
      this.getGoodsType();
      this.getBrands();
  }
};
</script>

<style lang="less" >
@checkcolor: #12b571; @bgcolor: #45c8dc;
  #onShelfBrands{
    padding-right: 50px;
    margin-left: 30px;margin-top: 12px;
    .cancel{width:70px}
    .dcm_so_btn{margin-right: 20px;}
    .txt{padding-right: 60px;padding-left: 20px;}
    .ivu-switch-checked { border-color: @checkcolor ; background-color: @checkcolor ;}
    .ivu-checkbox-checked .ivu-checkbox-inner {border-color: @bgcolor;background-color: @bgcolor;}
    .ivu-checkbox-inner{border-color: @bgcolor;}
     tr.ivu-table-row-hover td{background-color:#fff}
    .ivu-tabs-bar {padding-left: 0;}
    .typing {
            border: 1px solid #e5e7e6;
            padding: 20px;
            margin-top: 10px;
            margin-right: 10px;
    }
    .ivu-table-wrapper {margin-top: 10px;}
  }
</style>
