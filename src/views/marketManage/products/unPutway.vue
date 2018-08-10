<template>
<div id="unput">
    <div class="search">
      <Input  placeholder="请输入商品名" v-model="params.search" style="width: 256px; height: 38px;"></Input>
      <Button type="primary" style="position: relative; left: -16px; background: #45c8dc; border-color: #45c8dc; height: 38px; width: 62px;" @click="searchGoods">搜索</Button>
    </div>
    <div class="products-page putaway">
        <div class="type-list">
            <div class="page-oper">
                <Button type="primary" @click="putOnMoreGoods" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">上架</Button>
            </div>
            <div class="typing">
                <!-- <Checkbox>全选</Checkbox> -->
                <Tree :data="typeData" @on-select-change="choiceTree" v-cloak></Tree>
            </div>
        </div>
        <div class="products-list">
            <div class="list-type">
                <div class="type-ul" @click="checkType"> 
                    <button v-for="btn in this.typeBtn" class="type-btn" :key="btn.type_id" :dataId="btn.type_id">{{btn.type_name}}</button>
                </div>
                <Checkbox @on-change="checkAll">全选</Checkbox>
            </div>
            <ul v-if="data.goods.length !=0" class="product-list" style="overflow: hidden">
                <li class="product-item" v-for="(item, $index) in data.goods" :key="$index">
                    <div class="item-info">
                        <div class="item-img"><img :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+item.pic"></div>
                        <div class="item-des">
                            <p @click="showGoodsDetail(item.id)">{{item.title}}</p>
                            <div class="putaway-price"><span>￥<span>{{item.price}}</span>/{{item.unit}} <del>￥{{item.origin_price}}</del></span></div>
                            <div class="putaway-price"><span><span>{{item.shop_name}}</span><span style="float:right">{{item.market_name}}</span></span></div>
                            <div class="putaway-btn" data-type="once" @click="singlePutOn(item, $index)">上架</div>
                        </div>
                    </div>
                    <div name="btnChecked" class="checked"><i class="icon icon-checked" @click="checkGood($event,item, $index)"></i></div>
                </li>
            </ul>
             <h3 v-if="data.goods.length ===0">暂无未上架商品</h3>
            <div class="pageBar">
                <Page :current="params.page"   :total="data.total" simple @on-change="produactPageChange"></Page>
            </div>
        </div>
        <Model title="改价提醒" v-if="showPutaway">
            <div slot="body">
                <p>亲，您要上架的商品还未进行加价，为了避免您的损失，请及时改价。</p>
            </div>
            <div slot="footer">
                <div class="btn-group">
                    <div class="model-btn ok" @click="toChangePrice">去改价</div>
                    <div class="model-btn ok" @click="justPutaway">直接上架</div>
                </div>
            </div>
        </Model>
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
                                <button class="dcm_so_btn" @click="percentChange">确定</button>
                                <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
                            </p>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </div>
    <goodsDetail v-if="$store.state.goodsDetailModal" />
</div>
</template>

<script>

import Model from './../../../components/model.vue';
import goodsDetail from './../../../components/goodsDetail.vue';
    export default {
        components: {Model, goodsDetail},
        data: function () {
            return {
                
                params: {
                    on_sale: 2,
                    page: 1,
                    size: 10
                },
                add: [1, 2],
                autoPutaway:false,
                showPutaway: false,
                showType: false,
                changePriceModel: false,
                changePriceType: '',
                typeTree: {},
                typeData: [],
                typeBtnData: [],
                typeBtn: [],
                 treeid: 0,
                goods_sort_auto: []     // 自动上架分类的ids
            };
        },
        methods: {
            whichName (name) { // 选择改价方式
                this.changePrice_params.markup_info[0].markup_type = name;
            },
            putOnMoreGoods () { // 上架多个
                if (this.adjustParams.info.ids.length === 0) {
                    this.requestWarn('请选择上架商品')
                }
                else {
                    this.changePrice_params.info = this.adjustParams.info;
                    this.$store.state.showPutaway = true;
                    }
            },
            singlePutOn (item, index) { // 单个商品上架
                this.$store.state.showPutaway = true;
                this.index = index;
                this.adjustParams.info.ids = [];
                this.adjustParams.info.type = 5;
                this.adjustParams.info.ids.push(item.id);
                this.changePrice_params.info = this.adjustParams.info;
            },
            toPutaway: function (e) {
                let type = e.target.dataset.type;
                if(type) this.changePriceType = type;

                this.$store.state.showPutaway = true;
            },
            // 直接上架
            justPutaway: function () {
                this.adjustParams.info.type =5;
                if(this.adjustParams.info.ids.length === 0) this.requestWarn('请选择上架商品')
                // else this.requestSuccess('商品上架成功')
                this.$store.state.showPutaway = false;
                this.putGoods();
            },
            // 去改价
            toChangePrice: function () {
                this.change_putOn = 1;
                this.adjustParams.info.putaway = 3; // 上架类型：1=>上架 2=>下架 3.新商品
                this.adjustParams.info.type = 5; //新商品商品为5
                this.$store.state.showPutaway = false;
                this.changePriceModel = true;
            },
            // 选择树形结构
            choiceTree: function (nodes) {
                this.params.type_ids = []
                console.log('初始',nodes)
                if(nodes.length<=0){
                    this.typeBtn = [];
                    return;
                }
                let id = nodes[0].title.split('>')[2].split('<')[0];
                this.trans = id;
                this.treeid = id;
                this.params.type_ids.push(id); this.params.page = 1;this.getProducts();
                console.log(id)
                let typeBtn = [];
                if(!nodes[0].children || nodes[0].children.length<=0){
                    // 第一种情况：第三级别菜单
                    this.typeBtnData.map((data)=>{
                        if(id == data.pid){
                            typeBtn.push(data);
                        }
                    });
                } else {
                    // 第二种情况是有子节点的
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
                                    this.typeBtnData.map((data)=>{
                                        if(this.typeTree[fIndex][id][sIndex].type_id == data.pid){
                                            typeBtn.push(data);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                this.typeBtn = typeBtn;
                // this.params.type_ids = []
            },
            // 选择第四级的分类
            checkType: function (e) {
                let node = e.target,
                    html = e.target.innerText;
                if (node.nodeName != 'BUTTON') {
                    return;
                }

                // if (html == '全部') {
                //     if (e.target.className.indexOf('checked') == -1) {
                //         for (let i = 0; i < e.target.parentNode.children.length; i++) {
                //             if (e.target.parentNode.children[i].innerText != '全部') {
                //                 e.target.parentNode.children[i].className = 'type-btn';
                //             }
                //             e.target.className = 'type-btn checked';
                //         }
                //         this.params.type_ids=[];this.params.type_ids.push(this.treeid);
                //         this.params.page = 1;
                //         this.getProducts()
                //     } else {
                //         return;
                //     }
                // } else {
                        this.params.type_ids = [];
                        // if(this.params.type_ids[0] == this.treeid) this.params.type_ids.splice(0, 1)
                        // for (let i = 0; i < e.target.parentNode.children.length; i++) {
                        //     if (e.target.parentNode.children[i].innerText == '全部') {
                        //         e.target.parentNode.children[i].className = 'type-btn';
                        //     }
                        // }
                        if (e.target.className.indexOf('checked') == -1) { // 选中
                            var threeId = e.target.getAttribute('dataId')
                            console.log('选中', e.target.getAttribute('dataId'));
                            this.goods_sort_auto = []
                            this.goods_sort_auto.push(threeId);
                            this.params.type_ids = JSON.parse(JSON.stringify(this.goods_sort_auto));
                            this.params.page = 1;
                            this.getProducts();
                            for (let i = 0; i < e.target.parentNode.children.length; i++) {
                                e.target.parentNode.children[i].className = 'type-btn';
                            }
                            e.target.className = 'type-btn checked';
                        } else {
                            this.params.type_ids = [];
                            this.params.type_ids.push(this.treeid)
                            this.params.page = 1;this.getProducts();
                            // var threeId2 = e.target.getAttribute('dataId')
                            // for(var index in this.goods_sort_auto) {
                            //     if (threeId2 == this.goods_sort_auto[index]) this.goods_sort_auto.splice(index, 1)
                            // }
                            // this.params.type_ids = JSON.parse(JSON.stringify(this.goods_sort_auto));
                            // if (this.params.type_ids.length === 0) {
                            //     this.params.type_ids.push(this.trans); this.params.page = 1;this.getProducts()
                            // }
                            // else  {this.params.page = 1;this.getProducts();}
                            e.target.className = 'type-btn';
                        }
                // }
                // 需要获取所选择dom
                this.adjustParams2.on_type_three_ids = this.goods_sort_auto;

                this.adjustParams2.on_type_three_ids.length != 0 ? this.show_mask = false : this.show_mask = true
                console.log('分类',  this.goods_sort_auto)
            },
            // 选择商品
            checkGood: function (e, item ,index) {
                let target = e.target.parentNode;
                this.index = index;
                if (target.className.indexOf('active') != -1) { //取消选中
                    target.className = 'checked';
                    e.target.className = 'icon icon-checked';
                    for(var i in this.adjustParams.info.ids) {
                        if(this.adjustParams.info.ids[i] === item.id) {
                            this.adjustParams.info.ids.splice(i, 1);
                        }
                    }
                } else { //选中
                    this.adjustParams.info.ids.push(item.id);
                    target.className = 'checked active';
                    e.target.className = 'icon icon-checked active';
                }
            },
            // 全选
            checkAll: function (status) {
                let nodes = document.getElementsByName('btnChecked');
                this.adjustParams.info.ids = [];
                if(status){
                    for(let i = 0; i<nodes.length; i++){
                        nodes[i].className = 'checked active';
                        nodes[i].children[0].className = 'icon icon-checked active';
                    }
                    for(var item of this.data.goods) {
                        this.adjustParams.info.ids.push(item.id)
                    }
                }else{
                    for(let i = 0; i<nodes.length; i++){
                        nodes[i].className = 'checked';
                        nodes[i].children[0].className = 'icon icon-checked';
                    }
                    this.adjustParams.info.ids = [];
                }
            },
            searchGoods() {
                this.params.type_ids = [];
                this.params.page = 1;
                this.getProducts();
            }
        },
        created: function () {
            this.getGoodsType();
            this.getProducts();
            // this.choiceTree([{checked:false, expand: true, selected: true, title: '<p>鸡胸<span style="display: none">4</span></p>'}])
            this.adjustParams2.type = 2; //2：分类(只有分类才传no_type_three_ids，off_type_three_ids这两个字段，no_ids，off_ids传二级分类)
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
#unput {
    .search{margin-bottom: 10px;}
}
</style>

