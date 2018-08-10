<template>
  <div id="goodsmanage">
        <Tabs value="goodsmanage">
        <Tab-pane label="商品管理" name="goodsmanage">
            <div id="goodsmanagecontent">
                <div class="top">
                    <div class="left">
                        <ul>
                        <li  :class="{'active':$index ==qwer}"     @click="liclick($index, item.id)" v-for="(item, $index) in oneLevel" :key="$index"><p>{{item.name}} <i class="iconfont icon-xiangyou"></i></p></li>
                        </ul>
                    </div>
                    <div class="right">
                        <div v-for="(item, $index) in secondLevel" :key="$index" class="flexbox">
                            <div class="secondLevel">{{item.type_name}}</div>
                            <span class="thirdLeve" :class="{'active': it.type_id==second}" @click="spanclick($index, it.type_id)" v-for="(it, $index) in item" :key="$index">{{it.type_name}}</span>
                        </div> 
                    </div>
                </div>
                <div class="bottom">
                    <div class="soso">
                         <Input v-model="xiangsiparams.search" v-on:input ="soso" placeholder="          请输入要搜索的品牌名" type="primary" style="width: 314px"></Input>
                         <Button icon="ios-search" @click="sobrands"></Button>
                         <span>上架状态</span>
                         <Select  style="width:156px;margin-left:30px;" v-model="mask" @on-change="pingbiChange">
                                <Option v-for="item in maskList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <div class="xiangsi" v-if="xiangsishow">
                            <div @click="xiangsiclick(item)" v-for="item in xiangsidata" :value="item" :key="item">{{item}}</div>
                        </div>
                    </div>
                    <p class="nowbrand">当前品牌：{{brandsdata.total}}种</p>
                    <div class="brandtable">
                        <Table  :columns="columns" border :data="brandsdata.brands" @on-selection-change="selected"></Table>
                    </div>
                    <div class="btns">
                        <Button type="primary" @click="changePrice('noid')">改价</Button>
                        <Button type="primary" @click="lockedbrands(0)">下架</Button>
                        <!-- 后面加的 -->
                        <Button type="primary" @click="unlockedbrands(0)">上架</Button>
                        <Button type="primary"  @click="anto_show">自动上架已选品牌商品</Button>
                    </div>
                </div>
                
            </div>
        </Tab-pane>
    </Tabs>
    <!--恢复销售弹出框-->
    <Modal
        v-model="modal"
        title="恢复销售"
        ok-text="保留加价"
        cancel-text = "不加价"
        @on-cancel="cancelSavePirce(saveAddId)"
        :closable="false"
        :width=500
       >
       <p><Icon type="ios-checkmark-outline"></Icon></p>
        <p style="font-size:16px;line-height:50px;color:#525661;">品牌恢复销售成功</p>
        <p>该品牌上次改价{{gaijiaprice}},是否保留加价？</p>
        <p>若不改价，则按照找冻品网原价销售。</p>
    </Modal>
    <!--改价弹出框-->
    <!-- <Modal
        v-model="changePrincemodal"
        title="确认改价"
        ok-text="确认改价"
        cancel-text = "关闭"
        @on-ok="sureChangePrice"
        :closable="false"
        :width=500
       >
       <Row>
        <Col span="12" style="    text-align: right;"> <Select v-model="changePricemodel" style="width:155px;margin-right:13px;margin-bottom:27px;">
        <Option v-for="item in changePriceList" :value="item.value" :key="item">{{ item.label }}</Option>
        </Select></Col>
        <Col span="12"><Input v-model="changePricevalue" placeholder="请输入加价比例" style="width: 140px;margin-left:13px;"><span slot="append">%</span></Input></Col>
    </Row>
        <p>按件卖商品，改价后，向上取整，精确到元。如加价后2.16元，则实际</p>
        <p>显示金额为3.00元。</p>
        <p>按公斤、超码件、袋卖商品，改价后，向上取整，精确到角。如加价后</p>
        <p>2.12元，则实际显示金额为2.20</p>
    </Modal> -->
    <dcm-footer></dcm-footer>
    <!-- 改价内容 -->
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
</template>
<script>
import dcmFooter from "./../../components/footer.vue";
export default {
  components: { dcmFooter },
  data() {
    return {
      allbrands: 0,
      changePricemodel2: "add",
      changePriceModel: false,
      changePriceList: [
        { value: "add", label: "加价" },
        { value: "des", label: "降价" }
      ],
      changePricevalue: "",
      gaijiaprice: 0, //改价百分比
      mask: "all",
      saveAddId: null,
      modal: false, //恢复销售弹出框
      changePrincemodal: false, //改价弹出框
      xiangsishow: true,
      firstLi: true,
      sureChangePriceparams: {
        //确认改价参数
        sort_id: 5
      },
      zhidingparams: {
        sort_id: 5,
        brand_ids: []
      },
      maskList: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: 1,
          label: "上架"
        },
        {
          value: 3,
          label: "下架"
        }
      ],
      xiangsidata: [],
      somodel: "",
      active: false,
      sortdata: [],
      oneLevel: [],
      secondLevel: [],
      thirdLevel: [],
      params: { status: 0 },
      columns: [
        {
          type: "selection",
          title: "全选",
          width: 90,
          align: "center"
        },
        {
          title: "品牌名",
          width: 217,
          key: "brand_name",
          align: "center"
        },
        {
          title: "状态操作",
          key: "pingbi",
          width: 160,
          align: "center",
          render: (h, params) => {
            if (params.row.is_sale === 1 || params.row.is_sale === 3) {
              //1,3表示品牌已上架，只能进行下架操作
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.lockedbrands(params.row.brand_id);
                      }
                    }
                  },
                  "下架"
                )
              ]);
            } else {
              return h("div", [
                // 品牌未上架，只进行下架操作
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.unlockedbrands(params.row.brand_id);
                      }
                    }
                  },
                  "上架"
                )
              ]);
            }
          }
        },
        {
          title: "改价",
          key: "gaijia",
          width: 160,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.changePrice(params.row.brand_id);
                    }
                  }
                },
                "改价"
              )
            ]);
          }
        },
        {
          title: "自动上架品牌商品",
          align: "center",
          key: "auto_on_sale",
          render: (h, params) => {
            return h("div", [
              h("i-switch", {
                props: {
                  value: params.row.auto_on_sale,
                  size: "default"
                },
                on: {
                  "on-change": () => {
                    this.switchChange(
                      params.row.auto_on_sale,
                      params.index,
                      params.row.brand_id
                    );
                  }
                }
              })
            ]);
          }
        },
        {
          title: "置顶",
          key: "top",
          width: 160,
          align: "center",
          render: (h, params) => {
            if (params.row.brand_serial) {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.quxiaozhiding(params.row.brand_id);
                      }
                    }
                  },
                  "取消置顶"
                )
              ]);
            } else {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.zhiding(params.row.brand_id);
                      }
                    }
                  },
                  "置顶"
                )
              ]);
            }
          }
        },
        {
          title: "排序",
          width: 160,
          align: "left",
          render: (h, params) => {
            if (params.row.brand_serial) {
              if (params.row.order > 1) {
                return h("div", [
                  h("span", params.row.order),
                  h("Icon", {
                    props: {
                      type: "arrow-up-c"
                    }
                  }),
                  h("Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.rowUp(params.row.order);
                      }
                    }
                  })
                ]);
              } else {
                return h("div", [
                  h(
                    "span",
                    {
                      style: {
                        marginRight: "50px"
                      }
                    },
                    params.row.order
                  )
                ]);
              }
            }
          }
        }
      ],
      xiangsiparams: {
        sort_id: 5
      },
      pingbiparams: {
        sort_id: 5,
        brand_ids: []
      },
      unlockparams: {
        sort_id: 5,
        brand_ids: [],
        clear_increase: false
      },
      topParams: {
        type: 1, //1品牌，2商品
        serial_arr: [], //排序数组（索引为1代表排最后一个，至多10个）
        sort_id: 5
      },
      brandsdata: [],
      qwer: "0",
      second: 5,
      selections: [],
      zhidingbrands: [],
      brand_params: {
        info: {
          type: 3, //品牌
          range: 0,
          ids: [],
          end_type_id: 5 //品牌上下架和改价需传入
        }
      },
      auto_show_params: {
        type: 3,
        range: 0,
        on_ids: [],
        off_ids: []
      }
    };
  },
  methods: {
    getSort() {
      var _this = this;
      window.req.goodsMange_getSort(this, { is_sale: 2 }, res => {
        if (res.code == 0) {
          this.sortdata = res.data[1];
          delete this.sortdata.type_name;
          delete this.sortdata.type_id;
          delete this.sortdata.type_pic_url;
          for (var i in _this.sortdata) {
            var obj = {
              name: _this.sortdata[i].type_name,
              id: _this.sortdata[i].type_id
            };
            _this.oneLevel.push(obj);
          }
          delete _this.sortdata[2].type_name;
          delete _this.sortdata[2].type_pic_url;
          delete _this.sortdata[2].type_id;
          _this.secondLevel = _this.sortdata[2];
        }
      });
    },
    getBrand() {
      var _this = this;
      _this.zhidingbrands = [];
      this.$Loading.start();
      window.req.goodsMange_getBrands(this, this.xiangsiparams, res => {
        if (res.code == 0) {
          this.$Loading.error();
          this.brandsdata = res.data;
          for (var index in this.brandsdata.brands) {
            var obj = { order: 1 };
            if (this.brandsdata.brands[index].brand_serial) {
              console.log(index);
              obj.order = parseInt(index) + 1;
              this.brandsdata.brands[index] = Object.assign(
                obj,
                this.brandsdata.brands[index]
              );
            }
          }
        }
      });
    },
    liclick(index, id) {
      this.qwer = index;
      this.secondLevel = this.sortdata[id];
    },
    spanclick(index, id) {
      console.log("末级id", id);
      this.brand_params.info.end_type_id = id;
      delete this.xiangsiparams.search;
      this.second = id;
      this.xiangsiparams.sort_id = id;
      this.pingbiparams.sort_id = id;
      this.unlockparams.sort_id = id;
      this.sureChangePriceparams.sort_id = id;
      this.zhidingparams.sort_id = id;
      this.topParams.sort_id = id;
      this.changePrice_params.info.end_type_id = id;
      this.getBrand();
    },
    pingbiChange(e) {
      if (e == "all") {
        delete this.xiangsiparams.in_blacklist;
        this.getBrand();
        return;
      } else {
        this.xiangsiparams.in_blacklist = e;
        this.getBrand();
      }
    },
    rowUp(num) {
      var updata = this.brandsdata.brands[num - 1];
      updata.order--;
      this.brandsdata.brands[num - 2].order++;
      this.brandsdata.brands.splice(num - 1, 1);
      this.brandsdata.brands.splice(num - 2, 0, updata);
      this.topParams.serial_arr = [];
      for (var item of this.brandsdata.brands) {
        if (item.brand_serial) this.topParams.serial_arr.unshift(item.brand_id);
      }
      this.setTopOrder();
    },
    zhiding(id) {
      this.topParams.switch = 1;
      this.topParams.ids = [];
      this.topParams.ids.push(id);
      this.zhidingAjax();
    },
    quxiaozhiding(id) {
      //取消置顶
      this.topParams.switch = 2;
      this.topParams.ids = [];
      this.topParams.ids.push(id);
      this.zhidingAjax();
    },
    zhidingAjax() {
      //置顶或者取消置顶数据交互
      window.req.setTopOrNot(this, this.topParams, res => {
        if (res.code === 0) {
          if (this.topParams.switch === 1) {
            this.requestSuccess("品牌置顶成功");
            this.getBrand();
          } else {
            this.requestSuccess("品牌取消置顶成功");
            this.getBrand();
          }
        } else this.requestError("置顶操作", res.message);
      });
    },
    sobrands() {
      //搜索品牌按钮
      if (this.xiangsiparams.search.length == 0) {
        delete this.xiangsiparams.search;
      }
      this.xiangsishow = false;
      this.getBrand();
    },
    lockedbrands(id) {
      //屏蔽分类品牌
      if (id) {
        this.brand_params.info.ids = [];
        this.brand_params.info.ids.push(id);
        this.putdown();
      } else {
        if (this.brand_params.info.ids.length === 0)
          this.requestWarn("请选择下架的品牌");
        else {
          this.putdown();
        }
      }
    },
    putdown() {
      //确认下架品牌，请求数据
      this.$http({
        method: "POST",
        body: this.brand_params,
        url: "/operation/down-sale",
        header: "Accept:application/json"
      }).then(response => {
        if (response.body.code == 0) {
          this.$Message.success("品牌下架成功");
          this.selections = [];
          this.getBrand();
        } else {
          var mes =
            response.body.message.length > 0
              ? response.body.message
              : "操作未完成，请重试！";
          this.$Message.error(mes);
        }
      });
    },
    changePrice(id) {
      //改价
      this.changePrice_params.info.type = 3;
      var _this = this;
      if (id == "noid") {
        if (this.selections.length > 0) {
          _this.changePriceModel = true;
          return;
        } else this.requestWarn("请选择改价品牌");
      } else {
        this.changePriceModel = true;
        this.changePrice_params.info.ids = [];
        this.changePrice_params.info.ids.push(id);
      }
    },
    unlockedbrands(id, increase) {
      //恢复销售
      var _this = this;
      _this.gaijiaprice = increase * 100 + "%";
      _this.unlockparams.brand_ids = [];
      _this.unlockparams.brand_ids.push(id);
      _this.saveAddId = id;
      if (id) {
        console.log("id", id);
        this.brand_params.info.ids = [];
        this.brand_params.info.ids.push(id);
        this.putOn();
      } else {
        if (this.brand_params.info.ids.length === 0)
          this.requestWarn("请选择上架的品牌");
        else {
          this.putOn();
        }
      }
    },
    anto_show() {
      this.brand_params.info.search_info = [];
      this.brand_params.info.on_ids = this.brand_params.info.ids;
      if (this.brand_params.info.ids.length === 0)
        this.requestWarn("请选择自动上架品牌");
      else {
        this.$Loading.start();
        this.$http({
          method: "POST",
          url: "/operation/sale_new",
          body: this.brand_params.info,
          header: "Accept:application/json"
        }).then(response => {
          if (response.body.code == 0) {
            this.$Loading.error();
            this.requestSuccess("自动上架品牌商品成功");
            this.getBrand();
            this.parseInt.info.ids = [];
          } else this.requestError("自动上架品牌", res.message);
        });
      }
    },
    putOn() {
      // 上架，数据交互
      this.$Loading.start();
      this.$http({
        method: "POST",
        url: "/operation/on-sale",
        body: this.brand_params,
        header: "Accept:application/json"
      }).then(response => {
        if (response.body.code == 0) {
          this.$Loading.error();
          this.requestSuccess("品牌上架成功");
          this.getBrand();
          this.parseInt.info.ids = [];
        }
      });
    },
    saveAdd(id) {
      //恢复销售之后保留加价
      this.unlockparams.clear_increase = false;
      this.unlockedbrands(id);
    },
    cancelSavePirce(id) {
      this.sureChangePriceparams.brand_ids = [];
      this.sureChangePriceparams.brand_ids.push(id);
      this.sureChangePriceparams.percentage = 0;
      this.sureChangePrice();
      this.getBrand();
    },
    selected(selection) {
      //多选
      this.selections = [];
      for (var i in selection) {
        this.selections.push(selection[i].brand_id);
      }
      this.changePrice_params.info.ids = this.selections;
      this.brand_params.info.on_ids = this.selections;
      this.brand_params.info.ids = this.selections;
    },
    xiangsiclick(e) {
      //点击相似商品之后，相似商品消失
      this.xiangsiparams.search = e;
      this.xiangsishow = false;
    },
    sureChangePrice() {
      //确认改价
      var _this = this;
      if (_this.changePricevalue < 0) {
        _this.$Message.warning("价格的改变不能小于0");
        return;
      }
      if (_this.selections.length > 0) {
        _this.sureChangePriceparams.brand_ids = _this.selections;
      }
      if (_this.changePricemodel2 == "des") {
        _this.sureChangePriceparams.percentage = -_this.changePricevalue / 100;
      } else {
        _this.sureChangePriceparams.percentage = _this.changePricevalue / 100;
      }
      _this
        .$http({
          method: "POST",
          url: "/goods/category/markup",
          body: _this.sureChangePriceparams,
          header: "Accept:application/json"
        })
        .then(response => {
          if (response.body.code == 0) {
            _this.$Message.success("品牌改价成功");
            _this.selections = [];
            _this.getBrand();
          } else _this.requestError("品牌改价", res.message);
        });
    },
    soso() {
      //input相似搜索延迟执行1S
      this.xiangsiparams.search = this.xiangsiparams.search.replace(
        /(^\s*)|(\s*$)/g,
        ""
      );
      if (this.xiangsiparams.search.length <= 0) {
        return;
      }
      var _this = this;
      clearTimeout(set);
      var set = setTimeout(function() {
        //延迟两秒获得input值
        _this.xiangsidata = [];
        _this.xiangsishow = true;
        _this
          .$http({
            method: "GET",
            url: "/goods/category/brands/hint",
            params: _this.xiangsiparams,
            header: "Accept:application/json"
          })
          .then(response => {
            if (response.body.code == 0) {
              _this.xiangsidata = response.body.data;
            }
            clearTimeout(set);
          });
      }, 2000);
    },
    switchChange(status, index, id) {
      if (status) {
        //已自动上架，变为不自动上架
        this.auto_show_params.on_ids = [];
        this.auto_show_params.off_ids = [];
        this.auto_show_params.off_ids.push(id);
        window.req.autoPutPrividersGoods(this, this.auto_show_params, res => {
          if (res.code === 0) {
            this.requestSuccess("取消自动上架新商品成功");
            this.brandsdata.brands[index].auto_on_sale = 0;
            this.getBrand();
          } else this.requestError("取消自动上架新商品", res.message);
        });
      } else {
        //未自动上架，变为自动上架
        this.auto_show_params.on_ids = [];
        this.auto_show_params.off_ids = [];
        this.auto_show_params.on_ids.push(id);
        window.req.autoPutPrividersGoods(this, this.auto_show_params, res => {
          if (res.code === 0) {
            this.requestSuccess("自动上架新商品成功");
            this.getBrand();
          } else this.requestError("自动上架新商品", res.message);
        });
      }
    }
  },
  created() {
    this.changePrice_params.info.end_type_id = 5;
    this.getSort();
    this.getBrand();
  }
};
</script>
<style lang="less">
    @border: 1px solid #e5e7e6;
    @40:40px;
 #goodsmanage{
    height: 100%;
    .layout-copy{
    width: 100%;
    position: inherit;
    margin-left: 0;.copy-inner{margin-right: 0px !important;}}
    //  .ivu-input{height: 40px;}
    .ivu-table-column-center .ivu-btn-small span {font-size: 14px;}
     font-size: 14px;
     position: relative;
     .left{border: @border;float: left;height: 320px;overflow-y: scroll;
     li {line-height: 40px;border-bottom: @border;padding-left: 30px;padding-right: 24px;
        p{display: inline-block;width: 96px;height: 40px; i {float: right;}}
        }
     }
     
     .top{width: 1119px;height: 320px;}
     .ivu-tabs-bar{margin-bottom: 20px;}
     .ivu-tabs-nav .ivu-tabs-tab{margin-left: 29px;}
     .ivu-tabs-nav .ivu-tabs-ink-bar{left: 32px;}
    #goodsmanagecontent{margin-left: 29px;}
        ::-webkit-scrollbar {height: 100px; width: 6px;background-color: #ffffff; }
        ::-webkit-scrollbar-thumb{height: 100px; border-radius: 6px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); background-color: #999; }
    .right{
        overflow-y: scroll;height: 320px;width: 950px;float: left;border: @border;line-height: 40px;
        padding-left: 40px;
        .flexbox {display: flex;justify-content:flex-start;overflow: hidden; flex-wrap:wrap;}
        .secondLevel{width: 160px;font-weight: bold;}
        .thirdLeve{padding-right: 40px;}
    }
    .active{color:#45c8dc;}
    .bottom{
        .soso{position: relative;padding-top: 20px;
        .xiangsi {position: absolute;top: 60px;left: 0px;z-index: 1000;width: 275px;background: #fff;text-align: center;}
        .ivu-select-single .ivu-select-selection{height:40px;}
        .ivu-select-selected-value{font-size: 14px;padding-left: 30px;line-height: @40;}
        .ivu-input{height: @40;line-height: @40;}
        .ivu-input:hover{border: @border}
        .ivu-input{outline: none!important;}
        .ivu-btn-icon-only { background-color: #f0f0f0;border: none;width: @40;height: @40;color: #45c8dc;font-size: 14px;position: relative;left: -40px;}
        }
    .nowbrand{line-height: 50px;}
    .brandtable {
        width:1120px;
        .ivu-checkbox-checked .ivu-checkbox-inner{border-color: #45c8dc;color: #45c8dc;background-color: #45c8dc;}
        .ivu-table{font-size: 14px;}
        .ivu-table th{background-color: #f0f0f0;}
        .ivu-table-wrapper{border: 1px solid #f0f0f0;border-bottom: 0;border-right: 0;}
        .ivu-icon-arrow-up-c {margin-left: 30px;display: inline-block;width: 18px;height: 18px;border-radius: 18px;background-color: #45c8dc;color: #fff;text-align: center;line-height: 18px;}
        .ivu-table-column-left {padding-left: 50px;
        .ivu-btn-small {
            height: 18px;width: 18px;position: relative;left: -18px;opacity: 0;filter:alpha(opacity=0);
        }
        }
        
    }
    .btns {
        margin-top: 16px;
        margin-bottom: 33px;
            .ivu-btn-primary{width: 160px;margin-right: 30px;height: 44px;border-radius: 22px;font-size: 16px;color: #fff;background-color:#45c8dc;border: 0; }
        }
       .ivu-btn-primary:last-child {
           width: 190px
       }
    }
    #dcanmou_modal_shade{
        .ivu-tabs-tab{margin-left: 0px;}
    }
    .ivu-table-cell{
        padding: 0;
    }
 }
</style>

