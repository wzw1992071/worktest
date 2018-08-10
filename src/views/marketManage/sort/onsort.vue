<template>
<div id="onsort">
    <div class="products-page putaway">
        <div class="type-list">
            <div class="page-oper">
                <Button type="primary" @click="unPutaway" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">下架</Button>
                <Button type="primary" @click="toChangePrice" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">改价</Button>
                <Button type="primary" @click="auto_show" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 150px;">自动上架已选分类商品</Button>
            </div>
            <div class="typing">
                <Tree :data="typeData" @on-select-change="choiceTree"  v-cloak></Tree>
            </div>
        </div>
        <div  class="products-list">
            <div class="list-type">
                <div class="type-ul" @click="checkType">
                    <div v-for="btn in this.typeBtn" :key="btn.type_id" class="last_sort">
                        <button  class="type-btn"  :dataId="btn.type_id">{{btn.type_name}}</button>
                        <!-- <Checkbox :dataId="btn.type_id">自动上架</Checkbox> -->
                    </div>
                    
                </div>
            </div>
        </div>
        <!-- 改价开始 -->
<div class="dcanmou_modal_shade" id="dcanmou_modal_shade" v-if="changePriceModel">
        <div class="dcanmou_modal" >
        <p class=" modal_title">改价方式</p>
        <i class="iconfont icon-icon dcanmou_close" @click="changePriceModel=!changePriceModel"></i>
        <Tabs @on-click="whichName">
            <TabPane label="按元改价" icon="checkmark-circled" name=1>
                <div class="rmbchange">
                    <span>价格增加 </span>
                    <Button type="primary" shape="circle" icon="plus" @click="yuanPlus"></Button>
                    <div class="iptPrice">
                        <input v-model="yuan"/>
                        <span>元</span>
                    </div>
                    <Button type="primary" shape="circle" icon="minus" @click="yuanMinus"></Button>
                    <p class="btns">
                        <button class="dcm_so_btn" @click="yuanChange">确定</button>
                        <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
                    </p>
                </div>
            </TabPane>
            <TabPane label="按百分比改价" icon="checkmark-circled" name=2>
                <div class="rmbchange">
                    <span>价格增加 </span>
                    <Button type="primary" shape="circle" icon="plus" @click="percentPlus"></Button>
                    <div class="iptPrice">
                        <input v-model="percent"/>
                        <span>%</span>
                    </div>
                    <Button type="primary" shape="circle" icon="minus" @click="percentMinus"></Button>
                    <p class="btns">
                        <button class="dcm_so_btn"  @click="percentChange">确定</button>
                        <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
                    </p>
                </div>
            </TabPane>
            <TabPane label="按区间改价" icon="checkmark-circled" name=3>
                <div class="section">
                    <p>价格修改为</p>
                    <div class="changePriceActionArea">
                        <p class="actionInfo" v-for="(line,$index) in changeRules" :key="$index" >
                            <input v-model="line.markup_small"/> <span class="jian">-</span><input v-model="line.markup_big"/>
                            <Select style="width:60px"  v-model="line.jiajian">
                                <Option v-for="item in plusOrminus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                             <input v-model="line.val"/>
                            <Select style="width:60px"  v-model="line.markup_type">
                                <Option v-for="item in yuanOrpercent" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Button  icon="ios-trash-outline" @click="rangeDelete($index)"></Button >
                        </p>
                        <p class="btns" style="margin-bottom:20px;">
                        <button class="dcm_so_btn add" @click="addRuler"><Icon type="plus-circled"></Icon>添加</button>
                        <button class="dcm_so_btn" @click="rangeChange">确定</button>
                        <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
                        </p>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div> 
    </div>
       
        
    </div>
    </div>
</template>

<script>
    export default {
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
                isOnPut: 1, // 如果是上架的商品改价，列表不清除
                auto_show_params: {
                    type:2,
                    range: 0,
                    on_type_three_ids: [],
                    off_type_three_ids: []
                },
                typeData2: [],
                noSeleted: true,
                noSeleted2:false
            };
        },
        methods: {
            whichName (name) { // 选择改价方式
                this.changePrice_params.markup_info[0].markup_type = name;
            },
            // 下架
            unPutaway: function (id) {
                if(typeof id === 'number') {
                    this.adjustParams.info.ids.push(id)
                    this.suerPutDown()
                }
                else {
                    if (this.adjustParams.info.ids.length === 0 && this.adjustParams.info.three_ids.length === 0) this.requestWarn('请选择下架分类')
                    else this.suerPutDown()
                }
            },
            suerPutDown () {
                window.req.putProvidersDown(this, this.adjustParams, res => {
					if (res.code === 0) {
                        this.requestSuccess('分类下架成功');
                        this.adjustParams.info.ids = [];
                    }
					else this.requestError('分类下架', res.message);
				});
            },
            // 去改价
            toChangePrice: function () {
                if (this.adjustParams.info.ids.length === 0 &&this.adjustParams.info.three_ids.length === 0) this.requestWarn('请选择改价分类')
                else {
                    this.adjustParams.info.type = 2;
                    this.changePrice_params.info = this.adjustParams.info;
                    this.changePriceModel = true;
                    }
            },
            // 选择树形结构
            choiceTree: function (nodes) {
                this.params.type_ids = [];
                if(nodes.length<=0){
                    this.typeBtn = [];
                    return;
                    this.adjustParams.info.ids = [];
                }
                let id = nodes[0].title.split('>')[2].split('<')[0];
                this.adjustParams.info.ids = [];
                this.adjustParams.info.ids.push(id)
                console.log('tree_id', id)
                let typeBtn = [];
                if(!nodes[0].children || nodes[0].children.length<=0){
                    for(let fIndex in this.typeTree){
                        if(this.typeTree[fIndex].type_id == id){
                            // 第一级
                            for(let sIndex in this.typeTree[fIndex]){
                                if(typeof this.typeTree[fIndex][sIndex] == 'object'){
                                    for(let tIndex in this.typeTree[fIndex][sIndex]){
                                        if(typeof this.typeTree[fIndex][sIndex][tIndex] == 'object'){
                                            this.typeBtnData.map((data)=>{
                                                if(this.typeTree[fIndex][sIndex][tIndex].type_id == data.pid){
                                                    typeBtn.push(data);
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        } else {
                            // 第二级
                            for(let sIndex in this.typeTree[fIndex][id]){
                                if(typeof this.typeTree[fIndex][id][sIndex] == 'object'){
                                    console.log('this.typeTree[fIndex][id][sIndex]', this.typeTree[fIndex][id][sIndex])
                                    let obj = {type_id: this.typeTree[fIndex][id][sIndex].type_id, type_name: this.typeTree[fIndex][id][sIndex].type_name}
                                    console.log('OBJ', obj)
                                    typeBtn.push(obj)
                                }
                            }
                        }
                    }
                } else {
                    console.log(234)
                    // 第二种情况是有子节点的
                    for(let fIndex in this.typeTree){
                        if(this.typeTree[fIndex].type_id == id){
                            // 第一级
                            for(let sIndex in this.typeTree[fIndex]){
                                if(typeof this.typeTree[fIndex][sIndex] == 'object'){
                                    for(let tIndex in this.typeTree[fIndex][sIndex]){
                                        if(typeof this.typeTree[fIndex][sIndex][tIndex] == 'object'){
                                            console.log('this.typeTree[fIndex][sIndex][tIndex]', this.typeTree[fIndex][sIndex][tIndex])
                                            let obj = {type_id: this.typeTree[fIndex][sIndex][tIndex].type_id, type_name:this.typeTree[fIndex][sIndex][tIndex].type_name}
                                            typeBtn.push(obj)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                this.typeBtn = typeBtn;
                this.auto_show_params.on_type_three_ids = [];
                for (let item of this.typeBtn) {
                    this.auto_show_params.on_type_three_ids.push(item.type_id);
                    this.noSeleted = false;
                    this.noSeleted2 = false
                }
            },
            // 选择第四级的分类
            checkType: function (e) {
                if(!this.noSeleted2) {
                    this.auto_show_params.on_type_three_ids = []
                }
                var id = e.target.getAttribute('dataId');
                let node = e.target,
                    html = e.target.innerText;
                if (node.nodeName != 'BUTTON') {
                    return;
                }
                if (html == '全部') {
                    if (e.target.className.indexOf('checked') == -1) {
                        for (let i = 0; i < e.target.parentNode.children.length; i++) {
                            if (e.target.parentNode.children[i].innerText != '全部') {
                                e.target.parentNode.children[i].className = 'type-btn';
                            }
                            e.target.className = 'type-btn checked';
                        }
                    } else {
                        return;
                    }
                } else {
                    for (let i = 0; i < e.target.parentNode.children.length; i++) {
                        if (e.target.parentNode.children[i].innerText == '全部') {
                            e.target.parentNode.children[i].className = 'type-btn';
                        }
                    }
                    if (e.target.className.indexOf('checked') == -1) {
                        e.target.className = 'type-btn checked';
                        this.auto_show_params.on_type_three_ids.push(id);
                        this.noSeleted2 = true;
                    } else {
                        for(let index in this.auto_show_params.on_type_three_ids) {
                            if(this.auto_show_params.on_type_three_ids[index] == id) this.auto_show_params.on_type_three_ids.splice(index, 1)
                        }
                        e.target.className = 'type-btn';
                    }
                }
                this.adjustParams.info.ids = [];
                this.adjustParams.info.three_ids=this.auto_show_params.on_type_three_ids
            },
            auto_show () { //自动上架已选分类商品
                this.auto_show_params.off_type_three_ids = [];
                if(this.noSeleted) {this.requestWarn('请选择自动上架分类')}
                else{
                    window.req.autoPutPrividersGoods(this, this.auto_show_params, res => {
                        if(res.code === 0) this.requestSuccess('自动上架分类商品成功')
                        else this.requestError('自动上架新商品', res.message)
                    })
                }
            }
        },
        created: function () {
            this.getGoodsType2({is_sale: 0});
            this.adjustParams.info.type = 2; //2分类
            this.adjustParams.info.three_ids = []
        },
        computed: {
            getShowPutaway () {
                return this.$store.state.showPutaway;
            }
        },
        watch: {
            getShowPutaway (val) {
                this.showPutaway = val;
            }
        }
    };
</script>

<style lang="less" scoped>
.txt{padding-left: 20px;margin-right: 60px;}
    .ivu-modal-content{
        height: auto !important;
    }
    .ivu-modal-confirm{
        padding: 0 30px !important;
    }
    .ivu-btn-primary{
        background-color: #45c8dc !important;
        border-color: #45c8dc !important;
    }
    .stick-mask{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10086;
        background: rgba(0, 0, 0, .5);
    }
    .stick-mask .stick{
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        transform: translate(-50%, -50%);
        width: 824px;
        height: 690px;

    }
    .stick-mask .stick header{ height:50px; position: relative; border: 1px solid #f5f5f5; }
    .stick-mask .stick header h1{ text-align: center; font-weight: normal; line-height: 50px; color: #666666; font-size: 18px; }
    .stick-mask .stick header span{ position: absolute; width: 34px; height: 32px; line-height: 32px; text-align: center; right: 0; top: 0; background: #f5f5f5; color: #45c8dc; font-size: 16px; }

    .stick-mask .stick main{  height: 574px;  padding: 0 20px; }


    .stick-mask .stick footer { padding: 15px 20px; height: 36px; display: flex; justify-content: flex-end; }
    .stick-mask .stick footer .stick-btn { cursor: pointer; width: 100px; height: 36px; background: #45c8dc; color: #ffffff; border-radius: 4px; text-align: center; line-height: 36px; font-size: 16px; }
    .stick-mask .stick footer .stick-btn:not(:last-child){ margin-right: 20px; }
    .stick-mask .stick footer .stick-btn:active { background: #00CCCC; }

    .stick main{
        display: flex;
        flex-flow: column wrap;
    }
    .stick main .stick-item{  width: 387px;  height: 106px;  border: 1px solid #e5e7e6; position: relative; margin-bottom: 7px; }
    .stick main .stick-item .item-img{ float: left;  width: 100px;  height: 90px;  margin: 8px; border: 1px solid #eeefee  }
    .stick main .stick-item .item-img img{  width: 100%; height: 100%  }
    .stick main .stick-item .item-info{ float: left; margin: 10px 0 10px 10px; width: 200px; }
    .stick main .stick-item .item-info p{ line-height: 25px; font-size: 14px; color: #333333; }
    .stick main .stick-item .item-info .price{ line-height: 50px; }
    .stick main .stick-item .item-info .price input{ width: 50px; height: 22px; text-align: center; border: 1                                                                                                                                                                                                                                                                                                                                                                         px solid #666666; margin: 0 5px; }
    .stick main .stick-item .item-info .price s { font-size: 14px; color: #999999; }
    .stick main .stick-item .item-index {position: absolute; background: #ff7676; color: #ffffff; font-size: 14px; text-align: center; line-height: 20px; width: 30px; height: 20px; right: 0; top: 0; }
    .stick main .stick-item .item-index:before { position: absolute; content: ''; border-top: 10px solid #ff7676;  border-right: 15px solid transparent; bottom: -10px; right: 0 }
    .stick main .stick-item .item-index:after { position: absolute; content: ''; border-top: 10px solid #ff7676;  border-left: 15px solid transparent; bottom: -10px; left: 0 }
    .stick main .stick-item .item-btn { background: #45c8dc; position: absolute; right: 0; bottom: 10px; width: 60px; height: 24px; border-radius: 12px 0 0 12px; line-height: 24px; text-align: center; font-size: 14px; color: #ffffff}
    #onsort {
        margin-left: 30px;
        .typing{overflow: hidden;}
        .ivu-tree-children .ivu-checkbox-wrapper{
            position: static !important;
        }
        .type-ul{
            display: flex;
            flex-wrap: wrap;
        }
        .type-btn{
            width: 100px;
            height: 40px;
        }
        .type-btn.checked:before{
            font-size: 20px;
            bottom: -5px;
        }
        .search{margin-bottom: 10px;}
        .putaway-btn{
            width: 49%;
            display: inline-block;
        }
        .last_sort{
            position: relative;
            margin-right: 40px;
            margin-top: 30px;
            width: 101px;
            height: 80px;
            label{
                top: 60px;
            }
        }
    }
</style>