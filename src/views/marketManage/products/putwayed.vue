<template>
<div id="putway">
    <div class="search">
      <Input  placeholder="请输入商品名" v-model="params.search" style="width: 256px; height: 38px;"></Input>
      <Button type="primary" style="position: relative; left: -16px; background: #45c8dc; border-color: #45c8dc; height: 38px; width: 62px;" @click="searchGoods">搜索</Button>
    </div>
    <div class="products-page putaway">
        <div class="type-list">
            <div class="page-oper">
                <Button type="primary" @click="unPutaway" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">下架</Button>
                <Button type="primary" @click="toChangePrice" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">改价</Button>
            </div>
            <div class="typing">
                <!-- <Checkbox>全选</Checkbox> -->
                <Tree :data="typeData" @on-select-change="choiceTree" v-cloak></Tree>
            </div>
        </div>
        <div  class="products-list">
            <div v-if="topParams.sort_id!=0" class="list-oper">
                <Button type="primary" @click="getTopGoods" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">置顶排序</Button>
            </div>
            <div class="list-type">
                <div class="type-ul" @click="checkType">
                    <!-- <button class="type-btn checked" dataId="0">全部</button> -->
                    <button v-for="btn in this.typeBtn"  class="type-btn" :key="btn.type_id" :dataId="btn.type_id">{{btn.type_name}}</button>
                </div>
                <Checkbox class="label" @on-change="checkAll">全选</Checkbox>
            </div>
            <ul  v-if="data.goods.length !=0" class="product-list" style="overflow: hidden">
                <li class="product-item" v-for="(item, $index) in data.goods" :key="$index">
                    <div class="item-info">
                        <div class="item-img"><img :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+item.pic"></div>
                        <div class="item-des">
                            <p @click="showGoodsDetail(item.id)">{{item.title}}</p>
                            <div class="putaway-price"><span>￥<span>{{item.price}}</span>/{{item.unit}} <del>￥{{item.origin_price}}</del></span></div>
                            <div class="putaway-price"><span><span>{{item.shop_name}}</span><span style="float:right">{{item.market_name}}</span></span></div>
                            <div v-if="item.serial" class="putaway-btn" data-type="once" @click="cancelTop($index,item.sort_id,item.id)">取消置顶</div>
                            <div v-else class="putaway-btn" data-type="once" @click="setTopGoods($index,item.sort_id, item.id)">置顶</div>
                            <div class="putaway-btn" data-type="once" @click="unPutaway(item.id)">下架</div>
                        </div>
                    </div>
                    <div name="btnChecked" class="checked"><i class="icon icon-checked" @click="checkGood($event,item, $index)"></i></div>
                </li>
            </ul>
            <h3 v-if="data.goods.length ===0">暂无已上架商品</h3>
            <div class="pageBar">
                <Page :current="params.page"   :total="data.total" simple @on-change="produactPageChange"></Page>
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
                        <button class="dcm_so_btn" @click="closeChangeModal">取消</button>
                    </p>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div> 
    </div>
        <!-- 改价开始 -->
        <div class="stick-mask" v-if="stickModel">
            <div class="stick">
                <header><h1>置顶排序</h1><span @click="stickModel=!stickModel" class="icon icon-cha"></span></header>
                <main>
                    <div class="stick-item" v-for="(item,$index) in topData" :key="$index">
                        <div class="item-img"><img :src="'http://idongpin.img-cn-qingdao.aliyuncs.com/'+item.pic"></div>
                        <div class="item-info"><p class="name">{{item.name}}</p><div class="price">￥<input type="text" v-model="item.new_price">/{{item.unit}} <s>￥{{item.old_price}}</s></div></div>
                        <div class="item-index">{{$index+1}}</div>
                        <div class="item-btn" @click="orderTop(item, $index)">Top</div>
                    </div>
                    
                </main>
                <footer><div class="stick-btn" @click="sureOrder">确认</div><div class="stick-btn" @click="stickModel=!stickModel">取消</div></footer>
            </div>
        </div>
    </div>
    <goodsDetail v-if="$store.state.goodsDetailModal" />
    </div>
</template>

<script>
import goodsDetail from './../../../components/goodsDetail.vue';
    export default {
        components: {goodsDetail},
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
        methods: {
            whichName (name) { // 选择改价方式
                this.changePrice_params.markup_info[0].markup_type = name;
            },
            // 下架
            unPutaway: function (id) {
                console.log('123', typeof id,this.adjustParams, this.adjustParams.info.ids.length)
                if(typeof id === 'number') {
                    this.adjustParams.info.ids.push(id)
                    this.suerPutDown()
                }
                else {
                    if (this.adjustParams.info.ids.length === 0) this.requestWarn('请选择下架商品')
                    else this.suerPutDown()
                }
                // else if (this.adjustParams.info.ids.length === 0) this.requestWarn('请选择下架商品')
                // else this.suerPutDown()
            },
            // 去改价
            toChangePrice: function () {
                // this.change_putOn = 1;
                if (this.adjustParams.info.ids.length === 0) this.requestWarn('请选择改价商品')
                else {
                    this.adjustParams.info.type = 5;
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
                }

                let id = nodes[0].title.split('>')[2].split('<')[0];
                this.treeid = id;
                this.adjustParams.info.on_type_three_ids = [];
                this.adjustParams.info.on_type_three_ids.push(id)
                this.trans = id;
                this.params.type_ids.push(id);this.params.page=1;this.getProducts();
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
                // this.params.type_ids.splice(0, 1);

                this.typeBtn = typeBtn;
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
                //         this.params.type_ids=[];this.params.type_ids.push(this.treeid)
                //         this.params.page = 1;
                //         this.getProducts()
                //     } else {
                //         return;
                //     }
                // } else {
                    this.params.type_ids = [];
                    // for (let i = 0; i < e.target.parentNode.children.length; i++) {
                    //     if (e.target.parentNode.children[i].innerText == '全部') {
                    //         e.target.parentNode.children[i].className = 'type-btn';
                    //     }
                    // }
                    if (e.target.className.indexOf('checked') == -1) {
                        var threeId = e.target.getAttribute('dataId');
                        this.topParams.sort_id = threeId;
                        this.params.type_ids.push(threeId);
                        this.adjustParams.info.on_type_three_ids = [];
                        this.adjustParams.info.on_type_three_ids.push(threeId)
                        this.params.page = 1;
                        this.getProducts();
                        for (let i = 0; i < e.target.parentNode.children.length; i++) {
                        // if (e.target.parentNode.children[i].innerText == '全部') {
                            e.target.parentNode.children[i].className = 'type-btn';
                        // }
                        }
                        e.target.className = 'type-btn checked';
                        
                        // e.target.parentNode.children[i].className = 'type-btn';
                    } else {
                        this.params.type_ids = [];
                        this.params.type_ids.push(this.treeid);
                        this.topParams.sort_id = 0;
                        this.params.page = 1;this.getProducts();
                        e.target.className = 'type-btn';
                        // var threeId2 = e.target.getAttribute('dataId')
                        // this.topParams.sort_id = 0;
                        // for(var index in this.params.type_ids) {
                        //         if (threeId2 == this.params.type_ids[index]) 
                        //         {
                        //             this.params.type_ids.splice(index, 1);
                        //             if(this.params.type_ids.length ==0) {
                        //                 this.adjustParams.info.on_type_three_ids = [];
                        //                 this.adjustParams.info.on_type_three_ids.push(this.trans)
                        //                 this.params.type_ids.push(this.trans); this.params.page = 1;this.getProducts()
                        //                 }
                        //             else  {this.params.page = 1;this.getProducts();}
                        //         }
                        //     }
                        // e.target.className = 'type-btn';
                    }
                // }
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
            orderTop (item, index) { // 置顶排序
                if(index === 0) this.requestWarn('当前商品已处于第一位');
                else this.topData[index] = this.topData.splice(index-1, 1, this.topData[index])[0];
            },
            sureOrder () { // 确认排序的结果 req.setTopOrder
                this.stickModel = false;
                this.topParams.serial_arr = [];
                for(var goods of this.topData) {
                    this.topParams.serial_arr.unshift(goods.id)
                }
                window.req.setTopOrder(this, this.topParams, res => {
                    if(res.code ===0 ) this.requestSuccess('商品排序成功')
                    else this.requestError('商品排序', res.message)
                });
            },
            suerPutDown () {
                window.req.putProvidersDown(this, this.adjustParams, res => {
					if (res.code === 0) {
                        this.requestSuccess('商品下架成功');
                        var leftNodes = document.getElementsByName('btnChecked');
                        for(let i = 0; i<leftNodes.length; i++){
                            leftNodes[i].className = 'checked';
                            leftNodes[i].children[0].className = 'icon icon-checked';
                        }
						for (var id of this.adjustParams.info.ids) {
							for (var index in this.data.goods) {
								if (id ===  this.data.goods[index].id) this.data.goods.splice(index, 1)
							}
                        }
                        this.adjustParams.info.ids = [];
                    }
					else this.requestError('商品下架', res.message);
				});
            },
            getTopGoods () { //获得置顶排序列表的商品
                console.log(this.topParams)
                window.req.getToplist(this, this.topParams, res =>{
                    if(res.code === 0) {
                        if (res.data.length === 0) this.requestWarn('暂无置顶商品')
                        else {
                            this.topData = res.data; this.stickModel=!this.stickModel
                        }
                    }
                    else this.requestError('获取置顶商品', res.message)
                })
            },
            cancelTop(index , sort, id) { //取消置顶 req.setTopOrNot
                this.adjust_params.sort_id = sort;
                this.adjust_params.switch = 2;
                this.adjust_params.ids = [];
                this.adjust_params.ids.push(id);
                window.req.setTopOrNot(this, this.adjust_params, res => {
                    if(res.code ===0) {this.requestSuccess('商品取消置顶成功');this.data.goods[index].serial= false}
                    else this.requestError('商品取消置顶', res.message)
                })
            },
            setTopGoods(index, sort, id) { //置顶商品 req.setTopOrNot
                this.adjust_params.sort_id = sort;
                this.adjust_params.switch = 1;
                this.adjust_params.ids = [];
                this.adjust_params.ids.push(id);
                window.req.setTopOrNot(this, this.adjust_params, res => {
                    if(res.code ===0) {this.requestSuccess('商品置顶成功');this.data.goods[index].serial= true}
                    else this.requestError('商品置顶', res.message)
                })
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
            this.adjustParams.info.type = 5;
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
    #putway {
        .search{margin-bottom: 10px;}
        .putaway-btn{
            width: 49%;
            display: inline-block;
        }
    }
</style>