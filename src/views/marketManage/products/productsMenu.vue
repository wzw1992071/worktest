<template>
    <div class="product-menu">
        <Menu mode="horizontal" active-name="1">
            <router-link to="/products"><MenuItem name="1">最新上传商品 <span style="color: red">({{new_num}})</span></MenuItem></router-link>
            <router-link to="/products/putaway"><MenuItem name="2">已上架</MenuItem></router-link>
            <router-link to="/products/unputaway"><MenuItem name="4">未上架</MenuItem></router-link>
            <router-link to="/products/invalid"><MenuItem name="5">失效商品<span style="color: red">({{invalid_num}})</span></MenuItem></router-link>
        </Menu>
        <p>最新上传时间：<span style="color: #ff3333">{{new_time}}</span></p>
    </div>
</template>

<script>
export default {
  name: "productsMenu",
  data() {
    return {
      new_num: "",
      new_num: null,
      invalid_num: null,
      params: {
        on_sale: 3,
        page: 1,
        size: 10
      },
      invalid_params: {
        on_sale: 4, // 失效商品
        page: 1,
        size: 10,
        order: [5, false]
      }
    };
  },
  methods: {
    getProducts2() {
      window.req.getProducts(this, this.params, res => {
        if (res.code === 0) {
          this.new_num = res.data.total;
          this.new_time = res.data.new_put_time;
        }
      });
    },
    getProducts3() {
      window.req.getProducts(this, this.invalid_params, res => {
        if (res.code === 0) {
          this.invalid_num = res.data.total;
        }
      });
    }
  },
  created() {
    this.getProducts2();
    this.getProducts3();
  }
};
</script>
<style lang="less" scoped>
.product-menu {
  z-index: 1;
}
</style>
