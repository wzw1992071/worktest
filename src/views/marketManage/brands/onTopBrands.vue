<template>
  <div id="onTopBrands">
    
        <div class="actions_area">
                        <button class="dcm_so_btn" @click="putDownBrands">下架</button>
                        <button class="dcm_so_btn" @click="changPrice">改价</button>
                        <button class="dcm_so_btn cancel" @click="cancelTop">取消置顶</button>
                        <span class="txt">自动上架已选商品品牌</span>
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
                <Table border :columns="oncolumns" @on-selection-change="selectBrands" :loading="loading" :data="data.list"></Table>
                            <div class="pageBar">
                                <Page :current="data.current"  :total="data.total" simple></Page>
                            </div>
            </Col>
        </Row>
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
                            <Select style="width:60px">
                                <Option v-for="item in plusOrminus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select style="width:60px">
                                <Option v-for="item in yuanOrpercent" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <input/>
                            <span>元</span>
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
    <!-- 改价弹窗结束 -->
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
        typeData: [],
        changePriceModel: false,
        newTime: '2012-12-12 00:00:00',
        switch1: true,
        params: {
            type: 2,
            ids: []
        },
        current: 2,
        onTopcolumns: [
              {
                        type: 'selection',
                        align: 'center',
                        width: '7%',
                        title: '全选'
                    },
                    {
                        title: '品牌名',
                        width: '12%',
                        align: 'center',
                        key: 'brand_name',
                        render: (h, params) =>{
                            return h('div', [
                                h('span', {
                                    on: {
                                        mouseover: (e) => {
                                            this.MouseHover (e, params.row.brand_name);
                                        },
                                        mouseout: (evt) => {
                                            this.MouseOut(evt);
                                        }
                                    }
                                }, params.row.brand_name)
                            ]);
                        }
                    },
                    {
                        title: '自动上架供应商商品',
                        align: 'center',
                        width: '11%',
                        key: 'auto_show',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    props: {
                                        value: params.row.auto_show,
                                        size: 'default'
                                    }
                                    
                                })
                            ]);
                        }
                    },
                    {
                        title: '下架',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        background: '#45c8dc',
                                        borderColor: '#45c8dc',
                                        fontSize: '14px'
                                    },
                                    on: {
                                        click: () => {
                                            this.putunderShelfBrands(params.index, params.row.id);
                                        }
                                    }
                                }, '下架')
                            ]);
                        }
                    },
                    {
                        title: '改价',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        background: '#45c8dc',
                                        borderColor: '#45c8dc',
                                        fontSize: '14px'
                                    },
                                    on: {
                                        click: () => {
                                            this.changPrice(params.index, params.row.id);
                                        }
                                    }
                                }, '改价')
                            ]);
                        }
                    },
                     {
                        title: '取消置顶',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'text'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        background: '#fff',
                                        border: 0,
                                        color: '#45c8dc',
                                        fontSize: '14px'
                                    },
                                    on: {
                                        click: () => {
                                            this.cancelTop(params.index, params.row.id);
                                        }
                                    }
                                }, '取消置顶')
                            ]);
                        }
                    }
          ],
        data: [],
        selectedBrands: []
    };
  },
  methods: {
      changPrice (index, id) {
          this.changePriceModel = true;
          if(!id) {
              console.log('多选', this.selectedBrands);
          }
          else{
              console.log('单选', index, id);
          }
          
      },
      putunderShelfBrands (index, id) { //下架之后取到未上架
          console.log(index, id);
          this.data.splice(index, 1);
      },
      cancelTop (index, id) { //取消置顶后去到已上架
        if(!id) {
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
        else {
            console.log(index, id);
            this.data.splice(index, 1);
        }
          
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
      },
      addRuler () {
                var num = 1;
                this.add.push(num);
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
  #onTopBrands{
      .ivu-tabs {margin-right: 50px;} //导航栏右侧空白
    padding-right: 50px;
    margin-left: 30px;margin-top: 12px;
    .cancel{width:70px}
    .dcm_so_btn{margin-right: 20px;}
    .txt{padding-right: 60px;padding-left: 20px;}
    .ivu-switch-checked { border-color: @checkcolor ; background-color: @checkcolor ;}
    .ivu-checkbox-inner{border-color: @bgcolor;}
    .ivu-checkbox-checked .ivu-checkbox-inner {border-color: @bgcolor;background-color: @bgcolor;}
     font-size: 14px;
    margin-bottom: 60px;
    // 设置表头背景色
    .ivu-table-header .ivu-table-column-center{background: #f0f0f0}
     tr.ivu-table-row-hover td{background-color:#fff}
    .typing {
            border: 1px solid #e5e7e6;
            padding: 20px;
            margin-top: 10px;
            margin-right: 10px;
    }
    .ivu-table-wrapper {margin-top: 10px;}
    
  }
</style>
