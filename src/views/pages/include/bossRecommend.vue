// 掌柜推荐
<template>
    <div class="box" v-infinite-scroll="loadMore">
        <ul
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <li v-for="(item,index) in goodsList" :key="index">
                <div class="goodsInfo">
                    <div class="goodImg">   
                        <img :src="fileBaseUrl+item.images[0].img_path" class="avatar" alt="">
                    </div>
                    <div class="goodText">
                        <div class="goodsName">{{item.title}}</div>
                        <!-- <span class="discount">满50减5元</span> -->
                        <div class="price">
                            <div>￥<b>{{item.supplier.price}}</b>/{{item.unit}}</div>
                            <div>已售{{item.sales_volume}}</div>
                        </div>
                    </div>
                </div>
                <div class="btnGroup">
                    <div v-if="item.isCollection" @click="toggleCollection(0,item)">取消关注</div>
                    <div v-else @click="toggleCollection(1,item)">关注</div>
                    <div @click="contactShop">咨询</div>
                    <div  @click="addGoodsCar(item)">加入购物车</div>
                </div>
            </li>
        </ul>
        <mt-popup
            v-model="toggleAddCar"
            :closeOnClickModal=false
            position="bottom"
            >
            <AddCar
            goodsInfo="AddgoodsInfo"
            @closePop="toggleAddCar=!toggleAddCar"
            ></AddCar>
        </mt-popup>
    </div>
</template>

<script>
import AddCar from "../../components/addCar";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      param: {
        page: 1,
        page_size: 10
      },
      //   数据列表
      goodsList: [],
      //   正在加载数据
      loading: false,
      // 是否显示加入购物车弹窗
      toggleAddCar: false,
      // 添加商品的商品信息
      AddgoodsInfo:{}
    };
  },
  computed: {
    ...mapGetters(["fileBaseUrl"])
  },
  components: {
    AddCar
  },
  methods: {
    loadMore() {
      this.param.page++;
      this.getData();
    },
    getData() {
      this.$http
        .getBossRecommendData(this.param)
        .then(res => {
          this.goodsList = this.goodsList.concat(res.data.lists);
          this.isloading = false;
        })
        .catch(error => {
          this.isloading = false;
        });
    },
    // 关注相关操作
    toggleCollection(type, item) {
      if (type) {
        this.$http
          .collections({ sku_id: [item.sku_id] })
          .then(res => {
            item.isCollection = 1;
          })
          .catch();
      } else {
        this.$http
          .LossCollections({ sku_id: [item.sku_id] })
          .then(res => {
            item.isCollection = 0;
          })
          .catch();
      }
    },
    // 联系商家
    contactShop() {
      this.$http
        .contactShop()
        .then(res => {
          console.log(res);
          location.href = "tel:" + res.data.mobile;
        })
        .catch();
    },
    // 显示加入购物车弹窗
    addGoodsCar(item){
      this.toggleAddCar=true;
      this.AddgoodsInfo=item;

    }
  }
};
</script>

<style lang="less" scoped>
.box {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #f5f5f5;
  z-index: 10;
  li {
    padding: 0.4rem 1rem;
    margin-top: 0.8rem;
    background: #fff;
    .goodsInfo {
      padding: 0.3rem 0;
      display: flex;
      height: 6rem;
      border-bottom: 1px solid #f5f5f5;
      .goodImg {
        width: 36%;

        // background-color: #f60;
        img {
          width: 100%;
        }
      }
      .goodText {
        text-align: left;
        padding: 0rem 0.6rem;
        width: 100%;
        .goodsName {
          height: 3rem;
          color: #000;
          font-weight: bolder;
          font-size: 1rem;
        }
        .discount {
          display: inline-block;
          height: 1rem;
          line-height: 1rem;
          border: 1px solid #f60;
          color: #f60;
          padding: 0.1rem 0.2rem;
          border-radius: 0.6rem;
        }
        .price {
          display: flex;
          justify-content: space-between;
          height: 2rem;
          line-height: 2rem;
          font-size: 1.2rem;
          & > div {
            &:nth-of-type(1) {
              color: #f60;
            }
            &:nth-of-type(2) {
              color: #ccc;
              font-size: 1rem;
            }
          }
        }
      }
    }
    .btnGroup {
      margin: 0.6rem 0 0.2rem;
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
      div {
        border: 1px solid #f60;
        padding: 0.1rem 1rem;
        border-radius: 1rem;
      }
    }
  }
  .mint-popup {
    width: 100%;
  }
}
</style>

