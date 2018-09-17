<template>
    <div class="box" ref="viewBox" v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10">
        <div class="searchBox" :class="{ transparent: searchStyle }">
            <div class="search">
                <div class="bgColor"></div>
                <span class="iconfont icon-sousuo"></span>
                <input type="text" placeholder="请输入商品名">
            </div>
        </div>
        <div class="banner">
            <mt-swipe :auto="2000">
                <mt-swipe-item class="swpierMain">
                    <div >1
                    </div>
                </mt-swipe-item>
                <mt-swipe-item class="swpierMain">
                    <div >
                        2
                    </div>
                </mt-swipe-item>
                <mt-swipe-item class="swpierMain">
                    <div >
                        3
                    </div>
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <div class="typeBox">
            <div class="shopTyPe" v-for="(item,index) in typeData" :key="index" >
                <div class="img" :class="item.bgClass" @click="changeType(item.shopType)">
                    <span class="iconfont" :class="item.icon"></span>
                </div>
                <div class="text">{{item.name}}</div>
            </div>
        </div>
        <div class="recommend">
            <div class="content">
      
                <div class="guessLike" @click="$utils.goRouter('guessLike',$router)">
                    <div>猜你喜欢</div>
                </div>
               
                <div class="shopRecommend" @click="$utils.goRouter('bossRecommend',$router)">
                    <div>热门推荐</div>
                </div>
            </div>
        </div>
        <div class="shopList">
            <div class="title">
                ──<span><label class="iconfont icon-huoyan"></label>热销商品</span>──
            </div>
                <ul >
                  <li class="goods" v-for="(item,index) in goodsList" :key="index">
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
                  </li>
              </ul>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      isloading: false,
      // 获取商品列表参数
      params: {
        page: 1,
        page_size: 10
      },
      // 店铺类型列表
      typeData: [
        { shopType: 1, icon: "icon-huoguo", name: "火锅", bgClass: "iconbg1" },
        {
          shopType: 2,
          icon: "icon-zhongcan1",
          name: "中餐",
          bgClass: "iconbg2"
        },
        {
          shopType: 3,
          icon: "icon-chuanchuan",
          name: "串串",
          bgClass: "iconbg3"
        },
        {
          shopType: 4,
          icon: "icon-xiaochikuaican",
          name: "小吃快餐",
          bgClass: "iconbg4"
        },
        {
          shopType: 5,
          icon: "icon-fenmian",
          name: "粉面馆",
          bgClass: "iconbg5"
        },
        { shopType: 6, icon: "icon-zizhu", name: "自助", bgClass: "iconbg6" },
        {
          shopType: 7,
          icon: "icon-liangbanlucai",
          name: "凉拌卤菜",
          bgClass: "iconbg7"
        },
        {
          shopType: 8,
          icon: "icon-xiangchu",
          name: "乡厨",
          bgClass: "iconbg8"
        },
        { shopType: 9, icon: "icon-maocai", name: "冒菜", bgClass: "iconbg9" },
        {
          shopType: 10,
          icon: "icon-chaoshi",
          name: "超市",
          bgClass: "iconbg10"
        }
      ],
      // 商品列表
      goodsList: [],
      searchStyle: false //搜索框是否不透明
    };
  },
  computed: {
    ...mapGetters(["fileBaseUrl"])
  },
  methods: {
    ...mapMutations(["saveCustomerType", "saveCustomerTypes"]),
    //   下划刷新
    loadMore() {
      this.params.page += 1;
      this.getData();
    },
    // 滚动条事件
    handleScroll() {
      let scrollTop = this.$refs.viewBox.scrollTop;
      this.searchStyle = scrollTop > 180;
    },
    // 获取首页商品列表数据
    getData() {
      this.isloading = true;
      this.$http
        .typeRecommend(this.params)
        .then(res => {
          this.goodsList = this.goodsList.concat(res.data.lists);
          this.isloading = false;
        })
        .catch(error => {
          this.isloading = false;
        });
    },
    // 转换店铺类型重新获取数据
    changeType(type) {
      this.goodsList = [];
      this.params = {
        customer_type: type,
        page: 1,
        page_size: 10
      };
      this.getData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.viewBox) {
        this.$refs.viewBox.addEventListener("scroll", this.handleScroll);
      }
    });
  },
  created() {
    this.$http
      .getIndexData()
      .then(res => {
        this.typeData.forEach((item, index) => {
          if ((item.shopType = res.data.customer_type)) {
            let a = this.typeData[index];
            this.typeData[index] = this.typeData[0];
            this.typeData[0] = a;
          }
        });
        this.changeType(res.data.customer_type);
      })
      .catch(error => {});
  }
};
</script>

<style lang="less" scoped>
.box {
  overflow-y: scroll;
  height: 100%;
  position: relative;
  .banner {
    height: 10rem;
    .swpierMain {
      background: #f60;
    }
  }
  .searchBox {
    width: 100%;
    position: fixed;
    top: 0rem;
    z-index: 9999;
    display: flex;
    justify-content: space-around;
    .search {
      position: relative;
      padding: 0.8rem;
      height: 1.6rem;
      border-radius: 2rem;
      width: 90%;
      div {
        height: 1.8rem;
        background-color: #d6d4d4;
        opacity: 0.5;
        border-radius: 1rem;
      }
      span {
        top: 1.1rem;
        left: 1.2rem;
        color: #fff;
        position: absolute;
      }
      input {
        top: 1.1rem;
        margin-left: 2rem;
        width: 70%;
        position: absolute;
        background-color: transparent;
        border: transparent;

        &::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #fff;
        }
      }
    }
    &.transparent {
      background-color: #fff;
      .search {
        span {
          color: #666;
        }
        input {
          &::-webkit-input-placeholder {
            /* WebKit browsers */
            color: #666;
          }
        }
      }
    }
  }
  .typeBox {
    padding-top: 0.8rem;
    width: 100%;
    position: absolute;
    top: 9.3rem;
    height: 12rem;
    background-image: url(../../../assets/img/bg1.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    .shopTyPe {
      width: 20%;
      height: 5rem;
      .text {
        font-size: 0.8rem;
        color: #333;
      }
      .img {
        background-repeat: no-repeat;
        background-position: center;
        background-size: 60% 70%;
        height: 4rem;
        width: 100%;
        .iconfont {
          color: #fff;
          line-height: 4rem;
          font-size: 2rem;
        }
        &.iconbg1 {
          background-image: url(../../../assets/img/iconbg1.png);
        }
        &.iconbg2 {
          background-image: url(../../../assets/img/iconbg2.png);
        }
        &.iconbg3 {
          background-image: url(../../../assets/img/iconbg3.png);
        }
        &.iconbg4 {
          background-image: url(../../../assets/img/iconbg4.png);
        }
        &.iconbg5 {
          background-image: url(../../../assets/img/iconbg5.png);
        }
        &.iconbg6 {
          background-image: url(../../../assets/img/iconbg6.png);
        }
        &.iconbg7 {
          background-image: url(../../../assets/img/iconbg7.png);
        }
        &.iconbg8 {
          background-image: url(../../../assets/img/iconbg8.png);
        }
        &.iconbg9 {
          background-image: url(../../../assets/img/iconbg9.png);
        }
        &.iconbg10 {
          background-image: url(../../../assets/img/iconbg10.png);
        }
      }
    }
  }
  .recommend {
    margin-top: 12rem;
    height: 6.4rem;
    background-color: #f5f5f5;
    padding: 0.5rem 0;
    .content {
      height: 6.4rem;
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      & > div {
        height: 5.9rem;
        width: 49%;
        margin: 0.25rem 1.2%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        &.guessLike {
          background-image: url(../../../assets/img/cainixihuan.png);
        }
        &.shopRecommend {
          background-image: url(../../../assets/img/zhangguituijian.png);
        }
        & > div {
          color: #fff;
          margin-top: 0.2rem;
          margin-left: 0.4rem;
        }
      }
    }
  }
  .shopList {
    text-align: center;
    padding: 0.5rem 1%;
    .title {
      color: #666;
      margin-bottom: 0.4rem;
      span {
        padding: 0 1rem;
        label {
          color: #fa0f11;
        }
      }
    }
    .goods {
      padding: 0.3rem 0;
      display: flex;
      height: 6rem;
      border-top: 1px solid #f5f5f5;
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
  }
}
</style>




