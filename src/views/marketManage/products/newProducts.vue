<template>
<div id="new">
    <div class="search">
      <Input  placeholder="请输入商品名" v-model="params.search" style="width: 256px; height: 38px;"></Input>
      <Button type="primary" style="position: relative; left: -16px; background: #45c8dc; border-color: #45c8dc; height: 38px; width: 62px;" @click="searchGoods">搜索</Button>
    </div>
    <div class="products-page">
        <div class="page-oper">
            <Button type="primary" @click="putOnMoreGoods" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">上架</Button>
            <Checkbox @on-change="checkAll">全选</Checkbox>
        </div>
        <ul v-if="data.goods.length !=0" class="product-list" style="margin-top: 20px;overflow:hidden">
            <li class="product-item" v-for="(item, $index) in data.goods" :key="$index" >
                <div class="item-info">
                    <div class="item-img"><img :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+item.pic" @mouseover="productsMouseover($event,item)" @mouseout="MouseOut"></div>
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
        <h3 v-if="data.goods.length ===0">暂无最新上传商品</h3>
        <div class="pageBar">
                    <Page :current="data.page"   :total="data.total" simple @on-change="produactPageChange"></Page>
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
                        <button class="dcm_so_btn" @click="percentChange">确定</button>
                        <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
                    </p>
                </div>
            </TabPane>
            <TabPane label="按区间改价" icon="checkmark-circled" name=3>
                <div class="section">
                    <p>价格修改为</p>
                    <div class="changePriceActionArea">
                        <p class="actionInfo" v-for="item in changeRules" :key="item.value">
                            <input/> <span class="jian">-</span><input/>
                            <Select style="width:60px">
                                <Option v-for="item in plusOrminus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select style="width:60px">
                                <Option v-for="item in yuanOrpercent" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <input/>
                            <span>元</span>
                            <Button  icon="ios-trash-outline" @click="rangeDelete"></Button >
                        </p>
                        <p class="btns" style="margin-bottom:20px;">
                        <button class="dcm_so_btn add" @click="addRuler"><Icon type="plus-circled"></Icon>添加</button>
                        <button class="dcm_so_btn">确定</button>
                        <button class="dcm_so_btn">取消</button>
                    </p>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div> 
    </div>
     <div class="dcm_price_info" id="dcm_price_info">
        <div class="sanjiao"></div>
        <p>上传时间：</p>
        <p>{{updataTime.time}}</p>
    </div>
    </div>
    <goodsDetail v-if="$store.state.goodsDetailModal" />
</div>
</template>

<script>
import goodsDetail from './../../../components/goodsDetail.vue';
import Model from './../../../components/model.vue';

    export default {
        components: {Model, goodsDetail},
        data: function () {
            return {
                params: {
                    on_sale: 3,
                    page: 1,
                    size: 10
                },
                autoPutaway:false,
                showPutaway: false,
                showType: false,
                changePriceModel: false,
                changePriceType: '',
                typeBtnData: [],
                typeBtn: [], 
                index: null
            };
        },
        methods: {
            whichName (name) { // 选择改价方式
                this.changePrice_params.markup_info[0].markup_type = name;
            },
            // 上架
            putOnMoreGoods () { // 上架多个
                if (this.adjustParams.info.ids.length === 0) {
                    this.requestWarn('请选择上架商品')
                }
                else {
                    this.changePrice_params.info = this.adjustParams.info;
                    this.$store.state.showPutaway = true;
                    }
            },
            // 直接上架
            justPutaway: function () {
                this.adjustParams.info.type = 5;
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
            // 是否自动上架已选分类商品
            changeAutoPutaway: function (status) {
                this.autoPutaway = status;
                // 这里发起请求
            },
            // 选择第四级的分类
            checkType: function (e) {
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
                    } else {
                        e.target.className = 'type-btn';
                    }
                }
                // 需要获取所选择dom

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
            singlePutOn (item, index) { // 单个商品上架
                this.$store.state.showPutaway = true;
                this.index = index;
                this.adjustParams.info.ids = [];
                this.adjustParams.info.type = 5;
                this.adjustParams.info.ids.push(item.id);
                this.changePrice_params.info = this.adjustParams.info;
            },
            searchGoods() {
                this.params.page = 1;
                this.getProducts();
            }
        },
        created: function () {
            // console.log(123 ,this.$store.state)
            this.getProducts();
            // console.log(this.data)
            // this.$store.state.new_num = this.data.total;
            // this.$store.state.new_time = this.data.new_put_time;
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
.products-page {
    .dcm_price_info {
        width: 150px;
        height: 60px;
        padding-left: 10px;
    }
}
#new {
    .search{margin-bottom: 10px;}
}
</style>
