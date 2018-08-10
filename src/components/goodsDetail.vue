<template>
 <div class="dcanmou_modal_shade" v-if="$store.state.goodsDetailModal">
  <div id="goodsDetail">
      <span class="icon icon-cha" @click="close"></span>
      <p class="goodstitile"> 商品详情</p>
      <div class="goodsImgs"  v-if="data">
          <img v-for="img in data.goods_picture.slice(0, 4)" :key="img.goods_id" :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+img.pic"/>
      </div>
      <div class="goods_title" v-if="data">
          <p>{{data.goods_title}}</p>
           <div class="putaway-price">
               <span>￥<input v-model="data.new_price" type="number">/{{data.unit}} <del>{{data.old_price}}</del></span>
               <span>已销售：{{data.total_sale_num}}{{data.unit}}</span>
               </div>
           <!-- <button class="dcm_so_btn" style="right:110px" @click="putDownGoods">下架</button>
           <button class="dcm_so_btn" @click="putOnGoods">上架</button> -->
      </div>
      <div class="gray"></div>
      <!--TAB选项卡 -->
      <Tabs :animated="false">
        <TabPane label="商品详情" v-if="data">
            <span>
                {{data.desc}}
                </span>
            <p style="line-height:50px;font-size:16px;">商品图片</p>
            <div class="goodsImgs">
                 <img  v-for="img in data.goods_picture" :key="img.goods_id" :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+img.pic"/>
            </div>
        </TabPane>
        <TabPane label="供应商" v-if="data">
            <ul class="shop_text">
                            <li><p><i class="iconfont icon-dianpu1"></i><span>店铺名称：<span class="inner_txt">{{data.shop_name}}</span></span><i class="iconfont icon-shijian"></i><span>入驻时长：</span>{{data.year}}</p></li>
                            <li style="border-bottom:10px solid #e8e8e8"><p><i class="iconfont icon-iconfont31quanbushangpin"></i><span>在售商品：<span class="inner_txt">{{data.on_sale_num}}</span></span><span>近期已售：</span>{{data.near_sale_num}}{{data.unit}}</p></li>
                            <li><p><i class="iconfont icon-zuobiao"></i><span>发货地址：</span>{{data.send_address}}</p></li>
                            <li><p><i class="iconfont icon-dianpu1"></i><span>店铺地址：</span>{{data.shop_address}}</p></li>
                            <li><p><i class="iconfont icon-star-outline"></i><span>主营业务：</span>{{data.main_sale}}</p></li>
                            <li style="border-bottom:10px solid #e8e8e8">
                                <p><i class="iconfont icon-huangguan"></i><span>销售品牌</span></p>
                                <p class="brands">
                                    <span v-for="brand in data.brands" :key="brand.id">
                                        {{brand.name}}
                                    </span>
                                </p>
                            </li>
                             <li><p><i class="iconfont icon-pingjia"></i><span>店铺评价：</span></p></li>
                            <li><p class="no_border"><span class="pd_rt_20">发货速度</span><span class="icon">
                                <i v-for="i in shop_arr.speed" :key="i" style="padding-right:15px" class="iconfont icon-xingxing-copy-copy-copy"></i>
                                <i v-for="i in shop_arr.speed2" :key="i" style="padding-right:15px" class="iconfont icon-star-outline"></i>
                                {{data.send_num}}</span><span>{{shop_arr.speed3}}</span></p></li>
                            <li><p class="no_border"><span class="pd_rt_20">货品质量</span><span class="icon">
                                <i v-for="i in shop_arr.quality" :key="i" style="padding-right:15px" class="iconfont icon-xingxing-copy-copy-copy"></i>
                                <i v-for="i in shop_arr.quality2" :key="i" style="padding-right:15px" class="iconfont icon-star-outline"></i>
                                {{data.goods_quality}}</span><span>{{shop_arr.quality3}}</span></p></li>
                            <li><p class="no_border"><span class="pd_rt_20">卖家态度</span><span class="icon">
                                <i v-for="i in shop_arr.server" :key="i" style="padding-right:15px" class="iconfont icon-xingxing-copy-copy-copy"></i>
                                <i v-for="i in shop_arr.server2" :key="i" style="padding-right:15px" class="iconfont icon-star-outline"></i>
                                {{data.service_num}}</span><span>{{shop_arr.server3}}</span></p></li>
                        </ul>
        </TabPane>
        <TabPane label="型号规格" v-if="data">
            <ul class="size">
                <li v-for="(item, $index) in data.special_attribute" :key="$index"><b>{{item.name}}</b>{{item.value}}</li>
            </ul>
        </TabPane>
    </Tabs>
  </div>
 </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
    data (){
        return {
            params: {},
            data: null,
            goods_params2: {
                  info: {
                      ids: [],
                      range:0,
                      search_info: [],
                      type:5
                  }
            },
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
         ...mapMutations({close: 'closeGoodsDetail'}),
         getData () {
             window.req.getProviderGoodsDetail(this, this.params, res => {
                 if (res.code === 0) {this.data = res.data; 
                 this.shopLevel();
                 }
             });
         },
        shopLevel () {
            if (this.data.shop_level <=5) {
                this.shop_arr.tong = 1;
                this.shop_arr.shop_level = new Array(this.data.shop_level);
            }
            else if (this.data.shop_level > 5 && this.data.shop_level <=10) {
                this.shop_arr.yin = 1;
                this.shop_arr.shop_level = new Array(this.data.shop_level-5);
            }
            else if (this.data.shop_level > 10 && this.data.shop_level <=15) {
                this.shop_arr.jin = 1;
                this.shop_arr.shop_level = new Array(this.data.shop_level-10);
            }
            else if (this.data.shop_level > 15 && this.data.shop_level <=20) {
                this.shop_arr.zuan = 1;
                this.shop_arr.shop_level = new Array(this.data.shop_level-15);
            }
            this.shop_arr.speed = new Array(parseInt(this.data.send_num));
            this.shop_arr.speed2 = new Array(5-parseInt(this.data.send_num));
            this.shop_arr.quality = new Array(parseInt(this.data.goods_quality));
            this.shop_arr.quality2 = new Array(5-parseInt(this.data.goods_quality));
            this.shop_arr.server = new Array(parseInt(this.data.service_num));
            this.shop_arr.server2 = new Array(5-parseInt(this.data.service_num));
            if(this.data.send_num>=0 && this.data.send_num<=2) this.shop_arr.speed3 = '一般';
            else  if(this.data.send_num>2 && this.data.send_num<5) this.shop_arr.speed3 = '好';
            else this.shop_arr.speed3 = '很好';
           if(this.data.service_num>=0 && this.data.service_num<=2) this.shop_arr.server3 = '一般';
           else if(this.data.service_num>=2 && this.data.service_num<5) this.shop_arr.server3 = '好';
           else this.shop_arr.server3 = '很好';
           if(this.data.goods_quality>=0 && this.data.goods_quality<=2) this.shop_arr.quality3 = '一般';
           else if(this.data.goods_quality>=2 && this.data.goods_quality<5) this.shop_arr.quality3 = '好';
           else this.shop_arr.quality3 = '很好';
           console.log('this.shop_arr', this.shop_arr);
        },
        putDownGoods () {
            console.log('goods_params', this.goods_params2);
            this.$Loading.start();
            window.req.putProvidersDown(this, this.goods_params2, res => {
				if (res.code === 0) {
					this.$Loading.error();
					this.requestSuccess('商品下架成功');
				}
				else this.requestError('商品下架', res.message);
			});
        },
        putOnGoods () {
            this.$Loading.start();
            window.req.putProvidersOn(this, this.goods_params2, res => {
				if (res.code === 0) {
					this.$Loading.error();
					this.requestSuccess('商品上架成功');
				}
				else this.requestError('商品上架', res.message);
			});
        }
    },
    created () {
        this.params = this.$store.state.goods_params;
        this.goods_params2.info.ids.push(this.params.id);
        this.getData();
    }
};
</script>
<style lang="less">
@bdColor:#e5e7e6;
#goodsDetail{
    .ivu-tabs-nav .ivu-tabs-tab{
        margin-left: 0px !important;
    }
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20%;
    margin-left: -380px;
    width: 775px;
    height: 76%;
    background: #fff;
    color: #333;
    overflow-y: auto;
    .goodstitile{
        font-size: 16px;text-align: center;line-height: 60px;
    }
     .icon-cha{position: absolute;right: 10px;height: 10px;color: #62d5d5;font-size: 17px;}
    .goodsImgs{
        padding: 0 30px;
        img{width: 158px;height: 140px;margin-right: 18px;border: 1px solid @bdColor;}
    }
    .goodsImgs img:last-child{margin-right: 0px;}
    
    .gray{width: 100%;height: 10px;background: #f6f5f5}
    .goods_title{ 
        padding: 0 30px;
        p{line-height: 40px;}
        .putaway-price {
            margin-bottom: 20px;
            del {padding: 0 30px 0 24px;}
            input{border: 1px solid @bdColor;width: 56px;margin: 0 5px;}
            span:last-child{color: #45c8dc}
            }
        .dcm_so_btn {position: absolute;right: 30px; top: 230px;width: 70px;height: 40px;}
    }
    .ivu-tabs-tabpane:first-child{padding: 0 30px;
        .goodsImgs{padding: 0;}
    }
    .ivu-tabs-nav{margin-left: 195px;}
    .ivu-tabs-tabpane:first-child {
        span {line-height: 40px;color: #5d5d5d}
        .goodsImgs img{margin-bottom: 15px;}
        .goodsImgs img:nth-child(4n){
            margin-right: 0px;
        }
    }
    .ivu-tabs-tabpane:last-child {
        .size{
            padding-left: 230px;
            padding-top: 35px;
            li{
                line-height: 35px;
                b{display: inline-block;width: 205px;font-weight: normal;color: #494949}
            }
        }
    }
       .no_border .icon {
       .iconfont {color: rgb(255, 132, 0)}
   }
   .level {display: inline-block;width: 30px;height: 30px;}
}
.shop_text li .no_border .icon {width: auto;}
</style>


