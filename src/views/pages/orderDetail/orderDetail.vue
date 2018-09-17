<template>
    <div class="box">
        <div>
            <div class="orderNum" >订单编号: {{orderNum}}</div>
            <div class="copy"
                v-clipboard:copy="orderNum"
                v-clipboard:success="onCopy">
                复制编号</div>
        </div>
        <div >
            <div class="orderHead">
                <p><span class="iconfont icon-dianpu"></span>讲真拉</p>
                <span class="iconfont icon-jiantou"></span>
            </div>
            <ul>
                <li>
                    <div class="goodsPic"></div>
                    <div class="goodsInfo">
                        <p>罗七号 净 重20kg</p>
                        <span class="discount">满100减50</span>
                    </div>
                   
                    <div class="goodsPrice">
                        <p>￥200.00</p>
                        <p>x5</p>
                    </div>
                </li>
                <li>
                    <div class="goodsPic"></div>
                    <div class="goodsInfo">
                        <p>鲁班 净 重10kg</p>
                        <span class="discount">满100减50</span>
                    </div>
                   
                    <div class="goodsPrice">
                        <p>￥200.00</p>
                        <p>x5</p>
                    </div>
                </li>
            </ul>
            <div class="total">
                <p>共10件商品</p>
                <p>优惠10元</p>
                <p>合计：<span class="orange">￥200.00</span>元</p>
            </div>
        </div>
        <div>
            <p>订单创建：   2018/09/09  12:09:27</p>
            <p>支付方式：   微信支付</p>
            <p>收货方式：   买家找车</p>
        </div>
         <div>
           <div class="iconfont icon-dizhi"></div>
           <div class="buyerInfo">
               <div><span>蓝小狸Ay</span><span class="phoneNum">18380458045</span></div>
               <div>四川省 成都市 高新区 创业路49号3楼</div>
           </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
    data(){
        return{
            orderNum:"ks421421421412"
        }
    },
  methods: {
    onCopy() {
        Toast('复制成功！');
    }
  }
};
</script>
 <style lang="less" scoped>
.box {
  background: #f5f5f5;
  & > div {
    background: #fff;
    padding: 0 2% 3%;
    margin-bottom: 2%;
    &:nth-of-type(1) {
      padding-top: 2%;
      display: flex;
      justify-content: space-between;
      .orderNum {
        line-height: 2rem;
      }
      .copy {
        border: 1px solid #f60;
        padding: 0.2rem 0.6rem;
        border-radius: 1rem;
        color: #f60;
      }
    }
    &:nth-of-type(2) {
      padding-top: 2%;
      .orderHead {
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        padding: 1% 0 3%;
        p {
          font-size: 0.8rem;
          font-weight: 350;
          .iconfont {
            font-size: 0.8rem;
            color: #f60;
            margin-right: 0.2rem;
          }
        }
      }
      ul {
        li {
          height: 6rem;
          display: flex;
          border-bottom: 1px solid #eee;
          .goodsPic {
            width: 25%;
          }
          .goodsInfo {
            width: 50%;
            p {
              font-weight: 350;
              font-size: 1rem;
              padding: 0.4rem 0;
              margin-bottom: 0.2rem;
            }
            .discount {
              border: 1px solid #f60;
              padding: 0.2rem 0.6rem;
              border-radius: 1rem;
              color: #f60;
            }
          }
          .goodsPrice {
            margin-top: 0.4rem;
            width: 25%;
            text-align: right;
            p {
              &:nth-of-type(1) {
                font-size: 1rem;
                font-weight: 350;
              }
              &:nth-of-type(2) {
                font-size: 0.8rem;
                color: #aaa;
              }
            }
          }
        }
      }
      .total {
        margin-top: 0.4rem;
        text-align: right;
        p {
          margin-bottom: 0.4rem;
          font-size: 0.8rem;
          font-weight: 350;
          .orange {
            font-weight: bolder;
            font-size: 1rem;
          }
        }
      }
    }
    &:nth-of-type(3) {
      padding-top: 0.4rem;
      padding-bottom: 0.2rem;
      p {
        font-weight: 350;
        font-size: 0.9rem;
        margin: 0.4rem 0;
      }
    }
    &:nth-of-type(4) {
      padding-top: 0.6rem;
      display: flex;
      .iconfont {
        font-size: 2rem;
        padding-top: 0.5rem;
        background: -webkit-linear-gradient(bottom right, #fc501d, #fe8c6b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-right: 1rem;
      }
      .buyerInfo {
        div {
          font-weight: 500;
          margin-bottom: 0.4rem;
          .phoneNum {
            font-size: 0.8rem;
            font-weight: 350;
            margin-left: 2rem;
          }
        }
      }
    }
  }
}
</style>
 
