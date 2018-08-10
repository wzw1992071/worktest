// 配货系统，作为中间件跳转
<template>
  <div>
     {{msg}}
  </div>
</template>
<script>
export default {
  data () {
    return{
      msg:"如打开无反应，请允许浏览器弹窗"
    };
  },
  methods: {
   
  },
  created(){
      window.open("http://test.dongpin.me/blade/ph")
  }
};
</script>
