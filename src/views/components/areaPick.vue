<template>
    <div>
        <mt-popup
            v-model="togglePicker"
            :closeOnClickModal=false
            position="bottom"
            >
            <div class="btnGroup">
                <div @click="commitData(0)">取消</div>
                <div @click="commitData(1)">确认</div>
            </div>
           <!-- <mt-picker :slots="pickSlots" @change="onValuesChange"></mt-picker> -->
           <mt-picker :slots="slots"  @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>
<script>
export default {
  name: "AreaPick",
  data() {
    return {
       hasData:false, //是否需要回填数据
    //    选中的数据
      selectData: {
        province: {
          id: "",
          name: ""
        },
        city: {
          id: "",
          name: ""
        },
        county: {
          id: "",
          name: ""
        }
      },
    //   选择数据列
      slots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: [],
          className: "slot5",
          textAlign: "center"
        }
      ],
      provinceList:[],
      cityList:[],
      countyList:[]
    };
  },
  props: ["area", "togglePicker"],
  methods: {
    onValuesChange(picker, values) {
      if (this.togglePicker) {
        if (values[0]) {
          console.log(picker);
          console.log(values);
          if(this.hasData){
              picker.setSlotValue(0, this.area.provinceName)
              this.selectData.province.id = this.serachID(values[0],this.provinceList);
              this.selectData.province.name = values[0];
              console.log(this.serachID(values[0],this.provinceList))
          }else{
              this.selectData.province.id = this.area.province_id;
              this.selectData.province.name = values[0];
          }
    //       if (values[0].id == this.selectData.province.id) {
    //         if (values[1].id == this.selectData.city.id) {
    //           if (values[2].id == this.selectData.county.id) {
    //           } else {
    //             this.selectData.county.id = values[2].id;
    //             this.selectData.county.name = values[2].name;
    //           }
    //         } else {
    //           this.selectData.city.id = values[1].id;
    //           this.selectData.city.name = values[1].name;
    //           this.getChildArea(values[1].id, 2, picker);
    //         }
    //       } else {
    //         if(this.hasData){
    //             // this.selectData.province.id = this.area.province_id;
    //             // this.selectData.province.name = values[0].provinceName;
    //             // console.log(4)
    //             // console.log({
    //             //     id: this.area.province_id,
    //             //     level: 20,
    //             //     name:this.area.provinceName,
    //             // })
    //             picker.setSlotValue(0, this.area.provinceName)

    //         }else{
    //             this.selectData.province.id = values[0].id;
    //             this.selectData.province.name = values[0].name;
    //         }
    //         this.getChildArea(values[0].id, 1, picker);
    //       }
        }
      }
    },
    commitData(type) {
      this.$emit("commitData", {
          type:type,
          data:this.selectData
      });
    },
    getChildArea(id, level, picker) {
      this.$http
        .getChildArea(id)
        .then(res => {
          picker.setSlotValues(level, res.data);
        })
        .catch(error => {});
    },
    // 根据地区名查ID
    serachID(name,array=[]){
        array.forEach((item,index)=>{
            if(name==item.name){
                return item
            }
        })
    }
  },
  mounted() {
    console.log(this.area)
    if(this.area.city_id){
        this.hasData=true;
    }
    this.$nextTick(() => {
      this.$http
        .getProvinces()
        .then(res => {
          res.data.forEach((element, index) => {
            this.slots[0].values.push(element.name);
          });
          this.provinceList=res.data
            // this.slots[0].values=Object.keys(res.data)
        })
        .catch(error => {});
    });
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