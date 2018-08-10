// 已上架商品
<template>
    <div id="putway">
        <div class="search">
            <Input  placeholder="请输入商品名" v-model="params.search" style="width: 256px; height: 38px;"></Input>
            <Button type="primary" style="position: relative; left: -16px; background: #45c8dc; border-color: #45c8dc; height: 38px; width: 62px;" @click="searchGoods">搜索</Button>
        </div>
    </div>
</template>

<script>
export default {
    name:"putWayed",
    data: function () {
        return {
            params: {
                on_sale: 1, //1上架
                page: 1,
                size:10
            },
            autoPutaway:false,
            showPutaway: false,
            showType: false,
            changePriceModel: false,
            changePriceType: '',
            stickModel: false,
            typeTree: {},
            typeData: [],
            typeBtnData: [],
            typeBtn: [],
            adjust_params: {
                type: 2, //2商品
                switch: 1, //1置顶， 2取消置顶
                ids: [],
                sort_id: 0
            },
            topData:null,
            topParams: {
                type:2,
                sort_id: 0,
            },
            treeid: 0,
            isOnPut: 1 // 如果是上架的商品改价，列表不清除
        };
    },
    methods:{
         // 搜索商品
        searchGoods() {
            this.params.page = 1;
            this.getProducts();
        },
        getProducts(){
            
        }
    },
}
</script>
