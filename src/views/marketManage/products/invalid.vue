<template>
<div id="new">
    <!-- <div class="search">
      <Input  placeholder="请输入商品名" v-model="params.search" style="width: 256px; height: 38px;"></Input>
      <Button type="primary" style="position: relative; left: -16px; background: #45c8dc; border-color: #45c8dc; height: 38px; width: 62px;" @click="searchGoods">搜索</Button>
    </div> -->
    <div class="products-page">
        <ul v-if="data.goods.length !=0" class="product-list" style="margin-top: 20px;overflow:hidden">
            <li class="product-item" v-for="(item, $index) in data.goods" :key="$index" >
                <div class="item-info">
                    <div class="item-img"><img :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+item.pic" @mouseover="productsMouseover($event,item)" @mouseout="MouseOut"></div>
                    <div class="item-des">
                        <p @click="showGoodsDetail(item.id)">{{item.title}}</p>
                        <div class="putaway-price"><span>￥<span>{{item.price}}</span>/{{item.unit}} <del>￥{{item.origin_price}}</del></span></div>
                        <div class="putaway-price"><span><span>{{item.shop_name}}</span><span style="float:right">{{item.market_name}}</span></span></div>
                        <div class="putaway-price"><span><span>下架原因：</span><span style="float:right">{{item.reason}}</span></span></div>                        
                    </div>
                </div>
                <!--<div name="btnChecked" class="checked"><i class="icon icon-checked" @click="checkGood($event,item, $index)"></i></div>-->
            </li>
        </ul>
        <h3 v-if="data.goods.length ===0">暂无最新上传商品</h3>
        <div class="pageBar">
                    <Page :current="data.page"   :total="data.total" simple @on-change="produactPageChange"></Page>
        </div>
    </div>
    
</div>
</template>

<script>
    export default {
        data: function () {
            return {
                params: {
                    on_sale: 4, // 失效商品
                    page: 1,
                    size: 10,
                    order: [5, false]
                }
            };
        },
        methods: {
        },
        created: function () {
            this.getProducts();
            // this.$store.state.invalid_num = this.data.total;
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
    .search{margin-bottom: 10px;}
}
</style>
