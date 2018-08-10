<template>
  <div id="products" class="products">
    <Menu></Menu>
    <router-view></router-view>
  </div>
</template>

<script>
  import Menu from './productsMenu.vue';

  export default {
      name: 'product',
      components: { Menu }
  };
</script>
