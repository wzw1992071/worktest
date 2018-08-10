<template>
    <div>
                    <!-- 上架提示框 -->
        <div class="dcanmou_modal_shade" id="dcanmou_modal_shade" v-if="this.$store.state.noticeShow">
            <!-- 上架是否改价提示 -->
            <div class="dcanmou_modal changeTips">
                <p class=" modal_title">改价提醒</p>
                <i class="iconfont icon-icon dcanmou_close" @click="showNotice"></i>
                <p>   亲！您要上架的品牌还没进行加价，</p>
                <p>为了避免您的损失，请及时改价</p>
                <p class="btns">
                                    <button class="dcm_so_btn">去改价</button>
                                    <button class="dcm_so_btn">直接上架</button>
                                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
  data () {
      return {
         
      };
  },
  methods: {
      ...mapMutations({showNotice: 'openPriceChangeNocetice'})
  }
};
</script>
<style lang="less" scoped>
     .changeTips{
        .btns{margin-top: 30px;}
        .modal_title{font-size: 18px;margin: 22px 0;}
        p{font-size: 16px;text-align: center;line-height: 32px;}
    }
</style>


