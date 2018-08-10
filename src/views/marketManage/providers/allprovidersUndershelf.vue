<template>
  <div id="allprovidersUndershelf">
      <div class="dcanmou_so_area" style="margin-left:30px;">
        <input class="dcm_ipt" v-model="params.name" placeholder="     请输入供应商名">
        <button class="dcm_so_btn" @click="getProviders">搜索</button>
    </div>
      <div class="inner">
                <div class="innerinfo">
                        <div class="actions_area">
                            <button class="dcm_so_btn" @click="putOnmore">上架</button>
                            <Select v-model="params.area" @on-change="areaChange" style="width:150px">
                                <Option v-for="item in areaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <!-- 表格 -->
                        <Table border :columns="underShelfcolumns" :data="data.shops" @on-selection-change="selectMore"></Table>
                        <div class="pageBar">
                            <Page :current="data.current"  :total="data.total" @on-change="providerPageChange" simple></Page>
                        </div>
                </div>
                 <!-- 上架提示框 -->
        <div class="dcanmou_modal_shade" id="dcanmou_modal_shade" v-if="noticeShow">
            <!-- 上架是否改价提示 -->
            <div class="dcanmou_modal changeTips">
                <p class=" modal_title">改价提醒</p>
                <i class="iconfont icon-icon dcanmou_close" @click="noticeShow=!noticeShow"></i>
                <p>   亲！您要上架的品牌还没进行加价，</p>
                <p>为了避免您的损失，请及时改价</p>
                <p class="btns">
                                    <button class="dcm_so_btn" @click="toChangePrice">去改价</button>
                                    <button class="dcm_so_btn"  @click="putOnmoreSure">直接上架</button>
                                </p>
            </div>
        </div>
        <!-- end -->
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
                            <button class="dcm_so_btn" @click="yuanChange">确定</button>
                            <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
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
                                <button class="dcm_so_btn" @click="percentChange">确定</button>
                                <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
                            </p>
                        </div>
                </TabPane>
                <TabPane label="按区间改价" icon="checkmark-circled" name=3>
                    <div class="section">
                        <p>价格修改为</p>
                        <div class="changePriceActionArea">
                                <p class="actionInfo" v-for="(line,$index) in changeRules" :key="$index" >
                                <input v-model="line.markup_small"/> <span class="jian">-</span><input v-model="line.markup_big"/>
                                <Select style="width:60px"  v-model="line.jiajian">
                                    <Option v-for="item in plusOrminus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <input v-model="line.val"/>
                                <Select style="width:60px"  v-model="line.markup_type">
                                    <Option v-for="item in yuanOrpercent" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <Button  icon="ios-trash-outline" @click="rangeDelete($index)"></Button >
                            </p>
                            <p class="btns" style="margin-bottom:20px;">
                            <button class="dcm_so_btn add" @click="addRuler"><Icon type="plus-circled"></Icon>添加</button>
                            <button class="dcm_so_btn" @click="rangeChange">确定</button>
                            <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
                            </p>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div> 
    </div>
    <shopDetail v-if="$store.state.shopDetailModal"/>
    <goodsDetail v-if="$store.state.goodsDetailModal" />
    <!-- end -->
            </div>
        </div>
  </div>
</template>
<script>
import shopDetail from './../../../components/shopDetail.vue';
import goodsDetail from './../../../components/goodsDetail.vue';
import { mapMutations } from 'vuex';
export default {
    components: {shopDetail, goodsDetail},
    data () {
      return {
          	noticeShow: false,
            changePriceModel: false,
            params: {
                is_sell: 2,
                page:1,
                size: 10,
                area: 0
            },
            isUnder: 'not' //未上架的供应商，调用改价的时候，调用上架接口，表示，改价自动上架
      };
    },
    methods: {
        whichName (name) { // 选择改价方式
        //    this.adjustParams.info.ids = this.changePrice_params.ids;
           this.changePrice_params.markup_info[0].markup_type = name;
            console.log('this.adjust', this.changePrice_params)
        },
            toChangePrice: function () {
                this.changePrice_params.info.ids = this.adjustParams.info.ids;
                this.change_putOn = 1;
                this.noticeShow =  false;
                // this.adjustParams.info.putaway = 3; // 上架类型：1=>上架 2=>下架 3.新商品
                // this.adjustParams.info.type = 5; //新商品商品为5
                this.$store.state.showPutaway = false;
                this.changePriceModel = true;
            },
    },
    created () {
        this.changePrice_params.info.type = 4;
        this.getProviders();
    }
};
</script>
<style lang="less">
@checkcolor: #12b571; @bgcolor: #45c8dc;
#allprovidersUndershelf {
  .inner{margin-left: 30px;}
  .innerinfo {
    .ivu-checkbox-checked .ivu-checkbox-inner {border-color: @bgcolor;background-color: @bgcolor;}
    .ivu-checkbox-inner{border-color: @bgcolor;}
    .ivu-table-cell{padding: 0}
  }
.dcanmou_so_area {
        margin-bottom: 10px;
        .dcm_so_btn{margin-right: 0;}
    }
}
</style>

