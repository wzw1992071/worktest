<template>
  <div id="signedprovidersOnshelf">
    <div class="dcanmou_so_area" style="margin-left:30px;">
        <input class="dcm_ipt" v-model="params.name" placeholder="     请输入供应商名">
        <button class="dcm_so_btn" @click="getProviders">搜索</button>
    </div>
      <div class="inner">
                <div class="actions_area">
                    <button class="dcm_so_btn" @click="putDownMore">下架</button>
                    <button class="dcm_so_btn" @click="changePriceMore">改价</button>
                    <span class="txt">自动上架已选供应商商品商品</span>
                    <span v-if="show_mask"><div class="mask_bar" @click="beforeAutoPutGoods2"></div></span>
                        <i-switch size="large"   @on-change="beforeAutoPutGoods">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                        <Select v-model="params.area" @on-change="areaChange" style="width:150px">
                            <Option v-for="item in areaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    <span class="dcanmou_newUpload_time">最新上传时间：<span>{{newTime}}</span></span> <!--这个为全局样式-->
                </div>
                <!-- 表格 -->
                <Table border :columns="Shelfcolumns" :data="data.shops" @on-selection-change="selectMore"></Table>
                <div class="pageBar">
                    <Page :current="data.current"  :total="data.total" simple></Page>
                </div>
            </div>
            <!-- 改价 -->
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
 <!-- end -->
         <!-- 改价内容弹窗 -->
    <div class="dcm_price_info" id="dcm_price_info">
        <div class="sanjiao"></div>
        <p style="padding-top:5px;padding-left:5px">区间外:</p>
        <p v-for="(item, $index) in hoverData.all_change2" :key="$index" style="padding-left:10px">
           加价:<span style="padding-left:10px">{{item.val}}{{item.typeName}}</span>
        </p>
        <p style="padding-left:5px">区间内:</p>
        <p v-for="(item, $index) in hoverData.info_change" :key="$index" style="padding-left:10px">
           {{item.min}}-{{item.max}}元<span style="padding-left:10px">加{{item.val}}{{item.typeName}}</span>
        </p>
    </div>
    <!-- 销售品种弹窗 -->
    <!-- end -->
    <shopDetail v-if="$store.state.shopDetailModal"/>
    <goodsDetail v-if="$store.state.goodsDetailModal" />
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
           newTime: '2012-01-01',
        //    switch1: true,
           changePriceModel: false,
           params: {
               is_sell: 1,
               signing: 2,
               size:10,
               page:1,
               area: 0
           },
           isOnPut:1,
           hoverData: {
               all_change: [],
               goods_change: '',
               info_change: [],
                all_change2: []
           }, //鼠标移动上去显示的信息
           other_params: {
              info: {
                  type: 4, //1：供应商；2：分类；3：品牌；4：商品
                  range: 0, //1：全部，0:部分
                  ids: [],
                  search_info: []
              }
            },
            changeDetail: {
              type: 5,
              id: 0
          }
       };
   },
   methods: {
       remove (index, id) { // 服务商下架
            console.log('id', id)
            this.other_params.info.ids = [];
            this.data.shops.splice(index, 1); //本地下架 
            this.other_params.info.ids.push(id);
            window.req.putProvidersDown (this, this.other_params, res => {
                if (res.code == 0) this.requestSuccess('服务商下架成功')
                else this.requestError('服务商下架', res.message)
            })
      },
        whichName (name) { // 选择改价方式
           this.changePrice_params.markup_info[0].markup_type = name;
            console.log('this.adjust', this.changePrice_params)
        },
       MouseHover (e, id) {
         this.changeDetail.type = 5;
            this.changeDetail.id = id;
          this.getChangePriceDetail ();
          var priceInfo = document.getElementById('dcm_price_info');
          priceInfo.style.display = 'block';
          priceInfo.style.top=e.clientY+ 'px';
          priceInfo.style.left=e.clientX+ 'px';
      },
      MouseOut () {
          var priceInfo = document.getElementById('dcm_price_info');
          priceInfo.style.display = 'none';
      },
      sellsortMouseHover (e, name) {
          var sellSortDiv = document.getElementById('dcm_sellsort');
          sellSortDiv.style.display = 'block';
          sellSortDiv.style.top=e.clientY+ 'px';
          sellSortDiv.style.left=e.clientX+ 'px';
          return name;
      },
      sellsortMouseOut () {
          var sellSortDiv = document.getElementById('dcm_sellsort');
          sellSortDiv.style.display = 'none';
      },
      switchChange (val,index, id) { //开关改变

        console.log('val', val,'id', id)
        if(!val) {  //开始为关闭，点击一次后，开启
            this.adjustParams2.off_ids = [];
            this.adjustParams2.on_ids = [];
            this.adjustParams2.on_ids.push(id)
           window.req.autoPutPrividersGoods(this, this.adjustParams2, res => {
				if (res.code === 0)  {this.requestSuccess('自动上架新商品成功'); this.data.shops[index].auto_on_sale = true;}
					else this.requestError('自动上架新商品', res.message)
			})
        }
        else {
            this.adjustParams2.off_ids = [];
            this.adjustParams2.on_ids = [];
            this.adjustParams2.off_ids.push(id)
            window.req.autoPutPrividersGoods(this, this.adjustParams2, res => {
				if (res.code === 0)  {this.requestSuccess('关闭自动上架新商品成功');this.data.shops[index].auto_on_sale = false;}
					else this.requestError('关闭自动上架新商品', res.message)
			})
        }
      }
   },
   created () {
       this.getProviders();
   }
};
</script>
<style lang="less">
@checkcolor: #12b571; @bgcolor: #45c8dc;
#signedprovidersOnshelf {
    .inner{margin-left: 30px;}
    .ivu-checkbox-checked .ivu-checkbox-inner {border-color: @bgcolor;background-color: @bgcolor;}
    .ivu-checkbox-inner{border-color: @bgcolor;}
    .ivu-table-cell{padding: 0;}
    .actions_area {
        .mask_bar {
            left: 434px;
        }
    }
    .dcanmou_so_area {
        margin-bottom: 10px;
        .dcm_so_btn{margin-right: 0;}
    }
}
</style>


