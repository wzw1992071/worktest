<template>
  <div id="memberManage">
        <Tabs value="memberManage">
        <Tab-pane label="成员管理" name="memberManage">
            <div id="memberMange">
                <Button type="primary" class="addBtn" icon="plus" @click="addNewMember">添加成员</Button>
                <Table border :columns="columns" :data="data"></Table>
            </div>
        </Tab-pane>
    </Tabs>
    <!-- 撤销提示 -->
    <dcm-model title="提示" v-if="chexiaoModel" :close=false :modelFooter="nobottom">
        <div slot="body">
                <p style="text-align: center;line-height: 100px">确认要撤销该业务员么</p>
            </div>
        <div slot="footer">
                <div class="btn-group">
                    <div class="model-btn cancel" @click="chexiaoModel=!chexiaoModel">取消</div>
                    <div class="model-btn ok" @click="revocation">确定</div>
                </div>
            </div>
    </dcm-model>
    <!-- 删除成员 -->
    <dcm-model title="提示" v-if="deleteModel" :close=false :modelFooter="nobottom">
        <div slot="body">
                <p style="text-align: center;line-height: 100px">确认要删除该成员么</p>
            </div>
        <div slot="footer">
                <div class="btn-group">
                    <div class="model-btn cancel" @click="deleteModel=!deleteModel">取消</div>
                    <div class="model-btn ok" @click="deleteIt">确定</div>
                </div>
            </div>
    </dcm-model>
    <!-- 添加成员 -->
    <dcm-model title="添加新成员" v-if="addModel" :close=false :modelFooter="nobottom">
        <div slot="body">
                 <Input v-model="Iptvalue"  placeholder="" style="width: 100%"></Input>
                <p style="text-align: center;" >点击复制此链接给要添加的新成员，如果复制失效，也可以手动进行复制</p>
            </div>
        <div slot="footer">
                <div class="btn-group">
                    <div class="model-btn cancel" @click="addModel=!addModel">取消</div>
                    <div class="model-btn ok" @click="copyUrl(Iptvalue)">复制</div>
                </div>
            </div>
    </dcm-model>
    <!-- 添加为业务员 -->
    <dcm-model title="请选择业务员负责区域" v-if="addSaleModel" :close=false :modelFooter="nobottom" :modelBody="modelBodyadd">
        <div slot="body">
                <Select v-model="addrParams.province" size="small" style="width:90px" @on-change="provinceChange">
                    <Option v-for="item in provinceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span class="area">省</span>
                <Select v-model="addrParams.city" size="small" style="width:90px" @on-change="cityChange">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span class="area">市</span>
                <Select v-model="addrParams.conty" size="small" style="width:90px" @on-change="contyChange">
                    <Option v-for="item in contyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
        <div slot="footer">
                <div class="btn-group">
                    <div class="model-btn cancel" @click="addSaleModel=!addSaleModel">取消</div>
                    <div class="model-btn ok" @click="add">确定</div>
                </div>
            </div>
    </dcm-model>
    <!-- 权限设置 -->
    <dcm-model :title="settingTitle" v-if="settingModel" :close=false :modelFooter="nobottom" :modelBody="modelBody">
        <div slot="body">
               <p><span class="partInner">功能模块</span><span class="partInner">操作</span></p>
               <p><span class="partInner">进货</span><span class="partInner">
                    <RadioGroup v-model="settingParams.goodsIn">
                        <Radio label=1>开启权限</Radio>
                        <Radio label=0>关闭权限</Radio>
                    </RadioGroup></span></p>
                <p><span class="partInner">客户管理</span><span class="partInner">
                        <RadioGroup v-model="settingParams.customMange">
                            <Radio label=1>全部权限</Radio>
                            <Radio label=0>关闭权限</Radio>
                        </RadioGroup></span></p>
                <div class="part" :class="{noselect: noselect}">
                    <p><span class="partInner">客户名单</span><span class="partInner">
                        <RadioGroup v-model="settingParams.customList" v-if="noselect">
                            <Radio label=1 disabled>全部权限</Radio>
                            <Radio label=0 disabled>关闭权限</Radio>
                        </RadioGroup>
                        <RadioGroup v-model="settingParams.customList" v-else>
                            <Radio label=1 >全部权限</Radio>
                            <Radio label=0 >关闭权限</Radio>
                        </RadioGroup>
                        </span></p>
                    <p><span class="partInner">业务员客户</span><span class="partInner">
                        <RadioGroup v-model="settingParams.yewuyuanCustom" v-if="noselect">
                            <Radio label=1 disabled>开启权限</Radio>
                            <Radio label=2 disabled>业务员权限</Radio>
                            <Radio label=0 disabled>关闭权限</Radio>
                        </RadioGroup>
                        <RadioGroup v-model="settingParams.yewuyuanCustom" v-else>
                            <Radio label=1>开启权限</Radio>
                            <Radio label=2>业务员权限</Radio>
                            <Radio label=0>关闭权限</Radio>
                        </RadioGroup>
                        </span></p>
                    <p><span class="partInner">客户分配</span><span class="partInner">
                        <RadioGroup v-model="settingParams.customDelivery" v-if="noselect">
                            <Radio label=1 disabled>开启权限</Radio>
                            <Radio label=0 disabled>关闭权限</Radio>
                        </RadioGroup>
                        <RadioGroup v-model="settingParams.customDelivery" v-else>
                            <Radio label=1>开启权限</Radio>
                            <Radio label=0>关闭权限</Radio>
                        </RadioGroup>
                        </span></p>
                </div>
                <p><span class="partInner">商品管理</span><span class="partInner">
                        <RadioGroup v-model="settingParams.goodsMange">
                            <Radio label=1>开启权限</Radio>
                            <Radio label=0>关闭权限</Radio>
                        </RadioGroup></span></p>
                <p><span class="partInner">业务管理</span><span class="partInner">
                        <RadioGroup v-model="settingParams.businessMange">
                            <Radio label=1>开启权限</Radio>
                            <Radio label=0>关闭权限</Radio>
                        </RadioGroup></span></p>
                <div class="part" :class="{noselect: noselect}">
                    <p><span class="partInner">订单数据</span><span class="partInner">
                            <RadioGroup v-model="settingParams.data" v-if="noselect">
                                <Radio label=1 disabled>开启权限</Radio>
                                <Radio label=0 disabled>关闭权限</Radio>
                            </RadioGroup>
                            <RadioGroup v-model="settingParams.data" v-else>
                                <Radio label=1>开启权限</Radio>
                                <Radio label=0>关闭权限</Radio>
                            </RadioGroup>
                        </span></p>
                    <p><span class="partInner">订单查询</span><span class="partInner">
                            <RadioGroup v-model="settingParams.orderSearch" v-if="noselect">
                                <Radio label=1 disabled>开启权限</Radio>
                                <Radio label=0 disabled>关闭权限</Radio>
                            </RadioGroup>
                            <RadioGroup v-model="settingParams.orderSearch" v-else>
                                <Radio label=1>开启权限</Radio>
                                <Radio label=0>关闭权限</Radio>
                            </RadioGroup>
                        </span></p>
                </div>
                <p><span class="partInner">功能</span><span class="partInner">
                        <RadioGroup v-model="settingParams.func">
                            <Radio label=1>开启权限</Radio>
                            <Radio label=0>关闭权限</Radio>
                        </RadioGroup></span></p>
                <p><span class="partInner">设置</span><span class="partInner">
                        <RadioGroup v-model="settingParams.setting">
                            <Radio label=1>开启权限</Radio>
                            <Radio label=0>关闭权限</Radio>
                        </RadioGroup></span></p>
            </div>
        <div slot="footer">
                <div class="btn-group">
                    <div class="model-btn cancel" @click="settingModel=!settingModel">取消</div>
                    <div class="model-btn ok" @click="setting">确定</div>
                </div>
            </div>
    </dcm-model>
    <dcm-footer></dcm-footer>
  </div>
</template>
<script>
import dcmFooter from './../../components/footer.vue';
import dcmModel from './../../components/model.vue';
export default {
  components: {dcmFooter, dcmModel},
  name: 'memberManage',
  data () {
      return {
          noselect: true, // 控制是否可选
          settingModel: false,
          settingTitle: '',
          Iptvalue: 'www.somehow.com',
          transferData: null, // 中间数据暂时存储
          nobottom: 'nobottom',
          modelBodyadd: 'model-body-new',
          modelBody: 'model-body-setting',
          addSaleModel: false, //添加为业务员
          addModel: false, // 添加新成员
          chexiaoModel: false, //撤销
          deleteModel: false, //删除
          columns: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '身份',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '区域',
                        align: 'center',
                        key: 'address'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.isSaleMan) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '40px'
                                        },
                                        on: {
                                            click: () => {
                                                this.chexiaoModel = !this.chexiaoModel;
                                                this.transferData =  params.row;
                                            }
                                        }
                                    }, '撤销该业务员'),
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '40px'
                                        },
                                        on: {
                                            click: () => {
                                                this.settingModel = true;
                                                this.transferData = params.row;
                                                this.settingTitle = params.row.name;
                                            }
                                        }
                                    }, '权限设置'),
                                    h('Button', {
                                        props: {
                                            icon: 'trash-a',
                                            type: 'text'
                                        },
                                        style: {
                                            color: '#45c8dc',
                                        fontSize: '20px'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteModel = !this.deleteModel;
                                                this.transferData = params.row;
                                            }
                                        }
                                    })
                                ]);
                            }
                            else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '40px',
                                            color: '#45c8dc',
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click: () => {
                                                this.addSaleModel = true;
                                                this.transferData = params;
                                            }
                                        }
                                    }, '添加为业务员'),
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '40px'
                                        },
                                        on: {
                                            click: () => {
                                                this.settingModel = true;
                                                this.transferData = params.row;
                                                this.settingTitle = params.row.name;
                                            }
                                        }
                                    }, '权限设置'),
                                    h('Button', {
                                        props: {
                                            icon: 'trash-a',
                                            type: 'text'
                                        },
                                        style: {
                                            color: '#45c8dc',
                                            fontSize: '20px'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteModel = !this.deleteModel;
                                                this.transferData = params;
                                            }
                                        }
                                    })
                                ]);
                            }
                        }
                    }
                ],
                data: [
                    {
                        id: 1,
                        isSaleMan: 1, //判断是否是业务员
                        name: '小王',
                        age: 18,
                        status: '接单员',
                        address: '武侯区创业'
                       
                    },
                    {
                        id: 2,
                        isSaleMan: 0,
                        name: '小巴丹',
                        age: 28,
                        status: '配送员',
                        address: ''
                    }
                ],
        provinceList: [],
        cityList: [],
        contyList: [],
        addrParams: {
            province: 1,
            city: 2,
            conty: 3
        },
        addrReqParams: {
        },
        choseAddr: '',
        settingParams: {
            goodsIn: 0, //进货
            customMange: 0, // 客户管理
            customList: 0, // 客户名单
            yewuyuanCustom:0, // 业务员客户
            customDelivery: 0, // 客户分配
            goodsMange: 0, // 商品管理
            businessMange: 0, //  业务管理
            data: 0, // 数据统计
            orderSearch: 0, // 订单查询
            func: 0, // 功能
            setting: 0 // 设置
        }
      };
  },
  methods: {
    revocation () { // 撤销该业务员
        this.transferData.isSaleMan = !this.transferData.isSaleMan;
        this.transferData.address = '';
        this.chexiaoModel = ! this.chexiaoModel;
    },
    setting () { // 权限设置
       
    },
    deleteIt () { //删除
        this.data.splice(this.transferData.index, 1);
        this.deleteModel = !this.deleteModel;
    },
    add () { // 添加为业务员
        this.data[this.transferData.index].isSaleMan = 1;
        this.data[this.transferData.index].address = this.choseAddr;
        this.addSaleModel = false;
    },
    addNewMember () {
        //请求，得到Iptvalue
        this.addModel = true;
    },
    copyUrl (url) { //复制地址
        var vm = this;
         if (window.clipboardData) { // IE
                  window.clipboardData.clearData();
                  window.clipboardData.setData('Text', url);
                  this.requestSuccess('复制成功');
                  setTimeout(function (){
                       vm.addModel = false;
                  }, 2010);
              } 
        else {
            const range = document.createRange();
            range.selectNode(document.getElementsByClassName('ivu-input')[0]);
            const selection = window.getSelection();
            if(selection.rangeCount > 0) selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            this.requestSuccess('复制成功');
            setTimeout(function(){
                 vm.addModel = false;
            }, 2010);
        }
    },
    // 默认值改变
    provinceChange (id) {
        this.addrReqParams.pid = id;
        this.choseAddr = this.provinceList[id].label;
        this.cityList = [];
        this.getCity();
    },
    cityChange (id) {
        this.addrReqParams.cid = id;
        this.choseAddr = this.choseAddr + this.cityList[id].label; 
        this.contyList = [];
        this.getConty();
    },
    contyChange (id) {
        this.choseAddr = this.choseAddr + this.contyList[id].label; 
    },
    // 数据获取
    getProvince () {
        this.provinceList = [];
        window.req.getProvince (this, this.addrReqParams, (res) => {
            if(res.code == 0) {
                for(var key in res.data) {
                    var objProvince = {value: key, label: res.data[key]};
                    this.provinceList.push(objProvince);
                }
            }
        });
    },
    getCity () {
        delete this.addrReqParams.cid;
        this.cityList = [];
        window.req.getProvince(this, this.addrReqParams, (res) => {
            if (res.code == 0) {
                for (var k in res.data) {
                    var objCity = {value:k, label: res.data[k]};
                    this.cityList.push(objCity);
                }
            }
        });
    },
    getConty () {
        this.contyList = [];
        window.req.getProvince(this, this.addrReqParams, (res) => {
            if (res.code == 0) {
                for (var i in res.data) {
                    var objConty = {value: i, label: res.data[i]};
                    this.contyList.push(objConty);
                }
            }
        });
    }
  },
  created () {
      this.getProvince();
      this.getCity();
      this.getConty();
  }
};
</script>
<style lang="less">
@boderStyle: 1px solid #f5f5f5;
#memberManage {
    padding-right: 40px;
    .ivu-tabs-nav .ivu-tabs-tab {
        margin-left:0px;
        font-size: 16px;
    }
    .ivu-tabs-nav .ivu-tabs-ink-bar {
        left: 0;
        height: 8px;
        width: 120px;
    }
    .ivu-tabs-nav{
        margin-left: 30px;
    }
    .ivu-tabs-bar{
        margin-bottom: 10px;
    }
    #memberMange{
        font-size: 14px;
        padding-left: 30px;
        .addBtn{
            width: 100px;
            font-size: 14px;
            height: 40px;
            margin-bottom: 10px;
        }
    }
}
// 弹框中
.model-body-new {//普通对话框
    .area{
        padding-right: 15px;
    }
    margin: 65px 0;
    font-size: 14px;
    .ivu-select-small.ivu-select-single .ivu-select-selection{
            height: 40px;

        }
    .ivu-select-small.ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-small.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }
    .ivu-select-single .ivu-select-selection .ivu-select-selected-value{font-size: 14px;}
    .ivu-select-small.ivu-select-single .ivu-select-selection .ivu-select-placeholder:focus {
        outline: #45c8dc auto 5px;
    }
}
.model-body-setting { // 权限设置弹窗
    margin-top: 10px;
    p{
        margin: 0 17px;
        border-top: @boderStyle;
        .partInner {
            text-align: center;
            line-height: 50px;
            display: inline-block;
            &:first-child {
                width: 140px;
                height: 50px;
                border-left: @boderStyle;
                border-right: @boderStyle;
            }
            &:last-child {
                width: 242px;
                height: 50px;
                border-right: @boderStyle;
            }
        }
    }
    .part {
        p {
            .partInner {
                height: 30px;
                line-height: 30px;
            }
            &:nth-child(2) {
                    border-top: none;
                }
            &:last-child{
                border-top: none;
            }
        }
        
    }
    // 不可选
    .noselect {
        color: #cccccc;
    }
}
</style>

