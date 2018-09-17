<template>
  <div class="box">
    <div class="container">
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <mt-tabbar v-model="selected">
      <mt-tab-item id="index">
        <div class="iconfont" :class="[this.choiceGroup.index ?'icon-shouyexuanzhong':'icon-shouyeweixuanzhong']"></div>
        首页
      </mt-tab-item>
      <mt-tab-item id="classify">
        <div class="iconfont" :class="[this.choiceGroup.classify ?'icon-fenleixuanzhong':'icon-fenleiweixuanzhong']"></div>
        分类
      </mt-tab-item>
      <mt-tab-item id="follow">
        <div class="iconfont" :class="this.choiceGroup.follow ?'icon-guanzhuxuanzhong':'icon-guanzhuweixuanzhong'"></div>
        关注
      </mt-tab-item>
      <mt-tab-item id="shopCar">
        <div class="iconfont" :class="this.choiceGroup.shopCar ?'icon-gouwuchexuanzhong':'icon-gouwucheweixuanzhong'"></div>
        购物车
      </mt-tab-item>
       <mt-tab-item id="me">
        <div class="iconfont" :class="this.choiceGroup.me ?'icon-wodexuanzhong':'icon-wodeweixuanzhong'"></div>
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: 'Box',
  components: {
    
  },
  watch:{
    selected(curVal,oldVal){
      this.choiceGroup[curVal]=true;
      this.choiceGroup[oldVal]=false;
      if(curVal=="classify"){
        
      }else if(curVal=="follow"){

      }else{
        this.$router.push(curVal)
      }
      
    }
  },
  data () {
    return {
      // tabBar选中项
      selected:"index",
      // 底部字体图标展示库
      choiceGroup:{
        index:true,
        classify:false,
        follow:false,
        shopCar:false,
        me:false
      }
    }
  },
  methods:{
    ...mapMutations(["saveCustomerType", "saveCustomerTypes"]),
  },
  beforeCreate () {
   
  },
  created(){
    // 避免不进首页
    this.$http
      .getIndexData()
      .then(res => {
        // 保存店铺类型状态
        this.saveCustomerType(res.data.customer_type);
        this.saveCustomerType(res.data.customer_types);
      })
      .catch(error => {});
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
 .box{
   height: 100%;
   .container{
     height: 92%;
     
   }
   .mint-tabbar{
     height: 8%;
   }
   .mint-tab-item{
     color: #a0a0a0;
     padding: 0.8rem 0;
     background: #fff;
     &.is-selected{
       color:#FF7146;
      //  color:#FF7146;
      // background: -webkit-linear-gradient(bottom right ,  #fc501d ,#fe8c6b);
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
     }
    .mint-tab-item-label{
      font-size: 1.6rem;
    }
    .iconfont{
      font-size: 1.6rem;
    }
   }
 }

  
</style>