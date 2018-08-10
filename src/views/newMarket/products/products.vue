// 商品管理主页面
<template>
  <div id="productsBox" class="products">
    <Menu></Menu>
    <router-view></router-view>
  </div>
</template>

<script>
  import Menu from './productsMenu.vue';

  export default {
      name: 'productBox',
      components: { Menu }
  };
</script>