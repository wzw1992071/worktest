<template>
<div class="dcanmou_modal_shade" id="dcanmou_modal_shade">
        <div class="dcanmou_modal" >
        <p class=" modal_title">改价方式</p>
        <i class="iconfont icon-icon dcanmou_close" @click="toggleChangePrice"></i>
        <Tabs @on-click="whichName">
           <TabPane label="按元改价" icon="checkmark-circled" name=1>
                <div class="rmbchange">
                    <span>价格增加 </span>
                    <Button type="primary" shape="circle" icon="plus" @click="handleYuanChange(1)"></Button>
                    <div class="iptPrice">
                        <input v-model="yuanChangeInput"/>
                        <span>元</span>
                    </div>
                    <Button type="primary" shape="circle" icon="minus" @click="handleYuanChange(0)"></Button>
                    <p class="btns">
                        <button class="dcm_so_btn" @click="handleClick(1)">确定</button>
                        <button class="dcm_so_btn" @click="toggleChangePrice">取消</button>
                    </p>
                </div>
            </TabPane>
            <TabPane label="按百分比改价" icon="checkmark-circled" name=2>
                <div class="rmbchange">
                    <span>价格增加 </span>
                    <Button type="primary" shape="circle" icon="plus" @click="handlePercentChange(1)"></Button>
                    <div class="iptPrice">
                        <input v-model="percentChangeInput"/>
                        <span>%</span>
                    </div>
                    <Button type="primary" shape="circle" icon="minus" @click="handlePercentChange(0)"></Button>
                    <p class="btns">
                        <button class="dcm_so_btn" @click="handleClick(2)">确定</button>
                        <button class="dcm_so_btn"  @click="toggleChangePrice">取消</button>
                    </p>
                </div>
            </TabPane>
        
         
        </Tabs>
    </div> 
    </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ChangePrice",
  props: {
    props: ["id"],
  },
  data () {
      return{
        yuanChangeInput: 0,
        percentChangeInput:0 
      };
  },
  computed: {
    // ...mapGetters(["changePriceShow"])
  },
  methods: {
    ...mapMutations(["toggleChangePrice"]),
    // 按元加价
    handleYuanChange(status){
        if(status){
            this.yuanChangeInput++;
        }else{
             this.yuanChangeInput--;
        }
    },
    // 按百分比加价
    handlePercentChange(status){
        if(status){
            this.percentChangeInput++;
        }else{
             this.percentChangeInput--;
        }
    },
    // 点击确认处理数据
    handleClick(type) {
        window.req.changePrice(this,{
            mode:type,
            increase:(type==1)?this.yuanChangeInput:this.percentChangeInput,
            status:0
        },res=>{
            if(res.code==0){
                this.$Message.success('改价成功');
                this.$emit('changeSuccess');//改价成功提醒父组件刷新数据
                this.toggleChangePrice()
            }else{
                this.$Message.error('改价失败');
            }
        },this.id)
        
    },
    whichName (name) { // 选择改价方式
        this.changePrice_params.markup_info[0].markup_type = name;
    }
  }
};
</script>
