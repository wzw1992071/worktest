<template>
  <div class="dcanmou_modal_shade">
      <div id="shopDetail">
          <span class="icon icon-cha" @click="close"></span>
          <div class="shopHead">
              <img class="shop_img" :scr="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+shop_data.shop_img">
              <p class="shop_name">{{shop_data.shop_name}} <i v-if="shop_data.is_signing" class="iconfont icon-unfavourite"></i></p>
              <p class="shop_level">
                    <span v-if="shop_arr.tong"><i  v-for="i in shop_arr.shop_level" :key="i" class="level tongpai"></i></span>
                    <span v-if="shop_arr.yin"><i  v-for="i in shop_arr.shop_level" :key="i" class="level yinpai"></i></span>
                    <span v-if="shop_arr.jin"><i  v-for="i in shop_arr.shop_level" :key="i" class="level jinpai"></i></span>
                    <span v-if="shop_arr.zuan"><i  v-for="i in shop_arr.shop_level" :key="i" class="level zuanshi"></i></span>
                  </p>
              <div class="btns">
                <div class="dcm_so_btn" @click="put">上架</div>
                <div class="dcm_so_btn" @click="putDown">下架</div>
                <!-- <div class="dcm_so_btn">改价</div> -->
              </div>
          </div>
          <div class="tabBar">
               <Tabs :animated="false">
                    <!-- 店铺商品 -->
                    <TabPane label="店铺商品">
                        <div class="shop_goods">
                            <!-- <div class="btns" style="margin-left:30px;margin-top:15px;display:inline-block" @click="checkType">
                                <p class="dcm_so_btn  checked">全部</p>
                                <!-- <p class="dcm_so_btn" >毛肚</p>
                                <p class="dcm_so_btn"  >牛筋</p>
                                <p class="dcm_so_btn" >鸭肠</p> 
                            </div> -->
                            <!-- <Checkbox @on-change="checkAll">全选</Checkbox> -->
                            <div class="shop_goods_info">
                                <ul class="product-list">
                                    <li class="product-item" v-for="good in goods.list" :key="good.id">
                                        <div class="item-info">
                                            <div class="item-img"><img :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+good.goods_img"></div>
                                            <div class="item-des">
                                                <p @click="showGood(good.id)">{{good.goods_name}}</p>
                                                <div class="putaway-price"><span>￥<input v-model="good.price" type="number">/件 <span>销量: {{good.sale}}</span></span></div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div class="pageBar">
                                    <Page :current="params.page"   :total="goods.total" simple @on-change="goodsPageChange"></Page>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                     <!-- 店铺商品end -->
                    <TabPane label="店铺详情">
                        <ul class="shop_text">
                            <li><p><i class="iconfont icon-shijian"></i><span>入驻时长：</span>{{shop_data.year}}年</p></li>
                            <li style="border-bottom:10px solid #e8e8e8">
                                <p><i class="iconfont icon-iconfont31quanbushangpin"></i><span>在售商品：<span class="inner_txt">{{shop_data.on_sale_num}}</span></span>
                                <span>近期已售：</span>{{shop_data.near_sale_num}}件</p></li>
                            <li><p><i class="iconfont icon-zuobiao"></i><span>发货地址：</span>{{shop_data.send_address}}</p></li>
                            <li><p><i class="iconfont icon-dianpu1"></i><span>店铺地址：</span>{{shop_data.shop_address}}</p></li>
                            <li><p><i class="iconfont icon-star-outline"></i><span>主营业务：</span>{{shop_data.main_sale}}</p></li>
                            <li style="border-bottom:10px solid #e8e8e8">
                                <p><i class="iconfont icon-huangguan"></i><span>销售品牌</span></p>
                                <p class="brands">
                                    <span v-for="brand in shop_data.brands" :key="brand.id">
                                        {{brand.name}}
                                    </span>
                                </p>
                            </li>
                            <li><p><i class="iconfont icon-pingjia"></i><span>店铺评价：</span></p></li>
                            <li><p class="no_border"><span class="pd_rt_20">发货速度</span><span class="icon">
                                <i v-for="i in shop_arr.speed" :key="i" style="padding-right:15px" class="iconfont icon-xingxing-copy-copy-copy"></i>
                                <i v-for="i in shop_arr.speed2" :key="i" style="padding-right:15px" class="iconfont icon-star-outline"></i>
                                {{shop_data.send_num}}</span><span>{{shop_arr.speed3}}</span></p></li>
                            <li><p class="no_border"><span class="pd_rt_20">货品质量</span><span class="icon">
                                <i v-for="i in shop_arr.quality" :key="i" style="padding-right:15px" class="iconfont icon-xingxing-copy-copy-copy"></i>
                                <i v-for="i in shop_arr.quality2" :key="i" style="padding-right:15px" class="iconfont icon-star-outline"></i>
                                {{shop_data.goods_num}}</span><span>{{shop_arr.quality3}}</span></p></li>
                            <li><p class="no_border"><span class="pd_rt_20">卖家态度</span><span class="icon">
                                <i v-for="i in shop_arr.server" :key="i" style="padding-right:15px" class="iconfont icon-xingxing-copy-copy-copy"></i>
                                <i v-for="i in shop_arr.server2" :key="i" style="padding-right:15px" class="iconfont icon-star-outline"></i>
                                {{shop_data.service_num}}</span><span>{{shop_arr.server3}}</span></p></li>
                        </ul>
                    </TabPane>
                </Tabs>
             
            
          </div>
      </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
  data () {
      return {
          checkedBtns: true,
          params: null,
          shop_data: null,
          goods: null,
          shop_arr: {
              tong: 0,
              yin:0,
              jin:0,
              zuan:0,
              shop_level: [],
              speed: [],
              speed3: '',
              speed2: [],
              quality: [],
              quality2: [],
              quality3: '',
              server: [],
              server2: [],
              server3: ''
          }
      };
  },
  methods: {
      checkType (e){
          let node = e.target,
                    html = e.target.innerText;
                    if (node.nodeName != 'P') {
                    return;
                }
                if (html == '全部') {
                    if (e.target.className.indexOf('checked') == -1) {
                        for (let i = 0; i < e.target.parentNode.children.length; i++) {
                            if (e.target.parentNode.children[i].innerText != '全部') {
                                e.target.parentNode.children[i].className = 'dcm_so_btn';
                            }
                            e.target.className = 'dcm_so_btn checked';
                        }
                    } else {
                        return;
                    }
                } else {
                        for (let i = 0; i < e.target.parentNode.children.length; i++) {
                            if (e.target.parentNode.children[i].innerText == '全部') {
                                e.target.parentNode.children[i].className = 'dcm_so_btn';
                            }
                        }

                        if (e.target.className.indexOf('checked') == -1) {
                            e.target.className = 'dcm_so_btn checked';
                        } else {
                            e.target.className = 'dcm_so_btn';
                        }
                }
      },
      ...mapMutations({showGoodsDeatail: 'openGoodsDetail'}),
      close () {
          this.$store.state.shopDetailModal = false;
      },
        checkGood: function (e) {
                let target = e.target.parentNode;

                if (target.className.indexOf('active') != -1) {
                    target.className = 'checked';
                    e.target.className = 'icon icon-checked';
                } else {
                    target.className = 'checked active';
                    e.target.className = 'icon icon-checked active';
                }
        },
        checkAll: function (status) {
                let nodes = document.getElementsByName('btnChecked');

                if(status){
                    for(let i = 0; i<nodes.length; i++){
                        nodes[i].className = 'checked active';
                        nodes[i].children[0].className = 'icon icon-checked active';
                    }
                }else{
                    for(let i = 0; i<nodes.length; i++){
                        nodes[i].className = 'checked';
                        nodes[i].children[0].className = 'icon icon-checked';
                    }
                }
        },
        goodsPageChange (e) {
            this.params.page = e;
            this.getGoods();
        },
        getData () {
            window.req.getProviderDetail(this, this.$store.state.shop_params, res => {
                if(res.code === 0) {this.shop_data = res.data;this.shopLevel()};
            });
        },
        getGoods () {
            window.req.getProviderGoods(this, this.$store.state.shop_params, res => {
                if(res.code === 0) {this.goods = res.data;}
            });
        },
        showGood(id) {
            this.showGoodsDeatail();
            this.$store.state.goods_params.id = id;
        },
        shopLevel () {
            if (this.shop_data.shop_level <=5) {
                this.shop_arr.tong = 1;
                this.shop_arr.shop_level = new Array(this.shop_data.shop_level);
            }
            else if (this.shop_data.shop_level > 5 && this.shop_data.shop_level <=10) {
                this.shop_arr.yin = 1;
                this.shop_arr.shop_level = new Array(this.shop_data.shop_level-5);
            }
            else if (this.shop_data.shop_level > 10 && this.shop_data.shop_level <=15) {
                this.shop_arr.jin = 1;
                this.shop_arr.shop_level = new Array(this.shop_data.shop_level-10);
            }
            else if (this.shop_data.shop_level > 15 && this.shop_data.shop_level <=20) {
                this.shop_arr.zuan = 1;
                this.shop_arr.shop_level = new Array(this.shop_data.shop_level-15);
            }
            this.shop_arr.speed = new Array(parseInt(this.shop_data.send_num));
            this.shop_arr.speed2 = new Array(5-parseInt(this.shop_data.send_num));
            this.shop_arr.quality = new Array(parseInt(this.shop_data.goods_num));
            this.shop_arr.quality2 = new Array(5-parseInt(this.shop_data.goods_num));
            this.shop_arr.server = new Array(parseInt(this.shop_data.service_num));
            this.shop_arr.server2 = new Array(5-parseInt(this.shop_data.service_num));
            if(this.shop_data.send_num>=0 && this.shop_data.send_num<=2) this.shop_arr.speed3 = '一般';
            else  if(this.shop_data.send_num>2 && this.shop_data.send_num<5) this.shop_arr.speed3 = '好';
            else this.shop_arr.speed3 = '很好';
           if(this.shop_data.service_num>=0 && this.shop_data.service_num<=2) this.shop_arr.server3 = '一般';
           else if(this.shop_data.service_num>=2 && this.shop_data.service_num<5) this.shop_arr.server3 = '好';
           else this.shop_arr.server3 = '很好';
           if(this.shop_data.goods_num>=0 && this.shop_data.goods_num<=2) this.shop_arr.quality3 = '一般';
           else if(this.shop_data.goods_num>=2 && this.shop_data.goods_num<5) this.shop_arr.quality3 = '好';
           else this.shop_arr.quality3 = '很好';
        }

  },
  created () {
      this.params = this.$store.state.shop_params;
      this.getData();
      this.getGoods();
  }
};
</script>
<style lang="less" >
#shopDetail{width: 920px;
    height: 830px;
    position: absolute;
    overflow-y: auto;
    left: 50%;
    margin-left: -460px;
    line-height: 30px;
    background: #ffffff;
    top: 50%;
    margin-top: -415px;
    .shop_goods{
        .btns{
            
            .dcm_so_btn{
                background: #fff;
                color: #45c8dc;
                border: 1px solid #45c8dc;
            }
            .checked{
                background: #45c8dc;
                color: #fff;
            }
        }
    }
    .icon-cha{position: absolute;right: 10px;height: 10px;color: #62d5d5;font-size: 17px;}
    .shopHead{
        .btns{position: absolute;right: 30px;top: 50px;
            .dcm_so_btn{width: 70px;height: 30px;border: none;line-height: 30px;}
        }
        background-color: #eeeeee;
        .shop_img{
            width: 90px;
            height: 90px;
            border-radius: 90px;
            position: absolute;
            top: 22px;
            left: 30px;
            background-color:#fff;
        }
        .shop_name{font-size: 20px; color: #333333; margin-left: 140px;padding-top:35px;
            .icon-unfavourite{padding-left: 20px;font-size: 26px;color: #f2582a;}
        }
        .shop_level{padding-bottom: 35px;margin-left: 140px;
            .level {display: inline-block;width: 30px;height: 30px;}
        }
    }

    .shop_goods_info{
        padding: 0 30px;padding-right: 1px;
        .product-list {
            .product-item{margin: 20px 18px 0 0;height: 250px;}
        }
    }
   .ivu-tabs .ivu-tabs-bar{margin-bottom: 0px;}
   .tabBar{
       line-height: 1
   }
   .no_border .icon {
       .iconfont {color: rgb(255, 132, 0)}
   }
}
</style>
