<template>
    <div>
       
        <mt-popup
            v-model="togglePicker"
            :closeOnClickModal=false
            position="bottom"
            >
            <div class="btnGroup">
                <div @click="togglePicker=false">取消</div>
                <div @click="commitData">确认</div>
            </div>
           <mt-picker :slots="pickSlots" valueKey="name" @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>
<script>
export default {
  name: "NewPicker",
  data() {
    return {
      selectData: {},
      pickSlots: [
        {
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ]
    };
  },
  props: ["pickDatas", "togglePicker"],
  methods: {
    onValuesChange(picker, values) {
      if (this.togglePicker) {
        console.log(values);
        this.selectData = values[0];
      }
    },
    commitData() {
      this.$emit("commitData", this.selectData);
      this.togglePicker = false;
    }
  },
  mounted() {
    this.pickSlots = this.pickDatas;
  }
};
</script>

<style lang="less" scoped>
.mint-popup {
  width: 100%;
  .btnGroup {
    padding: 1rem 2rem 0;
    display: flex;
    justify-content: space-between;
  }
}
</style>

