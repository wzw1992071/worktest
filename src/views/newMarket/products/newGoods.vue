// 最新上传商品
<template>
    <div id="new">
        <!-- 搜索框 -->
        <div class="search">
            <Input  placeholder="请输入商品名" v-model="params.search" style="width: 256px; height: 38px;"></Input>
            <Button type="primary" style="position: relative; left: -16px; background: #45c8dc; border-color: #45c8dc; height: 38px; width: 62px;" @click="searchGoods">搜索</Button>
        </div>
        <div class="products-page">
            <ul v-if="data.goods.length !=0" class="product-list" style="margin-top: 20px;overflow:hidden">
                <li class="product-item" v-for="(item, $index) in data.goods" :key="$index" >
                    <div class="item-info">
                        <div class="item-img"><img :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+item.pic" @mouseover="productsMouseover($event,item)" @mouseout="MouseOut"></div>
                        <div class="item-des">
                            <p @click="showGoodsDetail(item.id)">{{item.title}}</p>
                            <div class="putaway-price"><span>￥<span>{{item.price}}</span>/{{item.unit}} <del>￥{{item.origin_price}}</del></span></div>
                            <div class="putaway-price"><span><span>{{item.shop_name}}</span><span style="float:right">{{item.market_name}}</span></span></div>
                            <div class="putaway-btn" data-type="once" @click="choiceServer(item, $index)">选择供应商</div>
                        </div>
                    </div>
                    
                </li>
            </ul>
            <h3 v-if="data.goods.length ===0">暂无最新上传商品</h3>
            <div class="pageBar">
                <Page :current="data.page"  :page-size="8"  :total="data.total" simple @on-change="produactPageChange"></Page>
            </div>
            <!-- 服务商列表 -->
            <ServerList 
                v-if="serverListlModal"
               :id="choiceGoodsId"
                ></ServerList>
                 <!-- 改价页面 -->
            <ChangePrice 
                v-if="changePriceShow"
               :id="choiceGoodsId"
               @changeSuccess="getProducts"
                ></ChangePrice>
            <div class="dcm_price_info" id="dcm_price_info">
                <div class="sanjiao"></div>
                <p>上传时间：</p>
                <p>{{updataTime.time}}</p>
            </div>
        </div>
        <goodsDetail v-if="$store.state.goodsDetailModal" />
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ServerList from "../../../components/serverList.vue";
import ChangePrice from "../../../components/changePrice.vue";
import goodsDetail from './../../../components/goodsDetail.vue';
export default {
  name: "newGoods",
  data() {
    return {
      // 搜索条件
      params: {
        on_sale: 3,
        page: 1,
        size: 8
      },
      // 显示数据
      data: {
        goods: []
      },
      choiceGoodsId: ""
    };
  },
  components: {
    goodsDetail,
    ServerList,
    ChangePrice
  },
  computed: {
    ...mapGetters(["serverListlModal","changePriceShow"])
  },
  methods: {
    ...mapMutations(["openServerList"]),
    // 搜索商品
    searchGoods() {
      this.params.page = 1;
      this.getProducts();
    },
    choiceServer(item, $index) {
    //   console.log(item);
      this.choiceGoodsId = item.id;
      this.openServerList();
    }
  },
  created: function() {
    this.getProducts();
  }
};
</script>


<style lang="less" scoped>
.products-page {
  .dcm_price_info {
    width: 150px;
    height: 60px;
    padding-left: 10px;
  }
}
#new {
  .search {
    margin-bottom: 10px;
  }
}
</style>
