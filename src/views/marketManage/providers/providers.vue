<template> 
  <div id="providers">
    <router-view></router-view>
    <dcm-footer></dcm-footer>
  </div>
</template>
<script>
import dcmFooter from './../../../components/footer.vue';
export default {
  name: 'providers',
  components: {dcmFooter}
};
</script>
<style lang="less" >
#providers{
  width: 100%;
  height: 100%;
  padding-top: 20px;
}
</style>
