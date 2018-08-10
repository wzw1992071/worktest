<template>
    <div class="layout">
                <div class="layout-ceiling">
                    <p class="title"><span>冻参谋</span>OA管理系统</p>
                            <div class="layout-ceiling-main">
                                <div><span><i class="iconfont icon-ic_person_px"></i><span v-cloak>{{$store.state.shopname}}</span></span></div> 
                                <div><router-link to="/settings"><i class="iconfont icon-chilun"></i></router-link></div> 
                                <div><Button style="padding-left:42px; border-left:1px solid #32A9BB" type="text" @click="quit"><i class="iconfont icon-exit"></i></Button></div>
                            </div>
                </div>
                <div class="main">
                    <div class="layout-menu-left">
                            <navMenu></navMenu>
                    </div>
                    <div class="layout-content">
                            <router-view></router-view>
                    </div>
                </div>
            <Back-top></Back-top>
    </div>
</template>

<script>
    import './less/style.less';
    import './iconfont/iconfont.css';
    import navMenu from './components/nav.vue';
    
    export default {
        name: 'app',
        components: {navMenu},
        data () {
            return {
                user: 'haha',
                username: ''
            };
        },
        methods: {
            quit () {
                window.req.quitLogin(this, {}, (res) => {
                    if(res.code == 0) {
                         window.location.href='/user/logout';
                    }
                    else this.requestError('退出', res.message);
                });
            },
             getShopInfo () {
                this.$Loading.start();
                window.req.getUserInfo(this, {}, (res) => {
                    if(res.code == 0) {
                        this.$Loading.finish();
                        this.$store.state.shopname = res.data.shop_name;
                        // this.removeCookie('username');
                    }
                    else this.$Loading.error();
                });
			},
            isopenindex () {
                window.req.openIndexFunc(this, {}, (res) => {
                    if(res.code == 0 && res.data == 0) {
                        this.$store.state.middleware.navbar = false;
                        this.$store.state.middleware.navbar = false;
                    }
                    else if (res.code == 0 && res.data == 1) {
                        this.$store.state.middleware.navbar = true;
                        this.$store.state.middleware.openbtn = false;
                    }
                });
                // var _this = this;
                // _this.$http({
                //     method: 'GET',
                //     url: '/home/status',
                //     header: 'Accept:application/json'
                // }).then(response => {
                //     if(response.body.code == 0) {
                //         if (response.body.data == 0) {
                //             _this.$store.state.middleware.navbar = false;
                //             _this.$store.state.middleware.navbar = false;
                //         }
                //         else if(response.body.data == 1) {
                //             _this.$store.state.middleware.navbar = true;
                //             _this.$store.state.middleware.openbtn = false;
                //         }
                //     }
                // });
            }
        },
        created(){
          this.getShopInfo();
        //   this.de_fun();
          this.isopenindex();
    }
    };
</script>
<style scoped lang="less">
[v-cloak] {
  display: none;
}
.layout-content{position: relative;}
.notice{
    z-index: 2;
    background: #fff;
    height: 40px;
    width: 350px;
    line-height: 40px;
    border: 1px solid #45c8dc;
    border-radius: 40px;
    font-size: 15px;
    text-align: center;
    position: absolute;
    top: 20px;
    left: 50%;
    margin-left: -175px;
    .iconfont{
        color:#45c8dc;
    }
}
.main{height: 100%;width: 100%;padding-top: 50px;margin-top: -50px;}
.ivu-col-span-20 {background: #ffffff;}
    .ivu-col-span-4{width: 265px;}
    .layout .title {display: inline-block;color: #fff;font-size: 18px;letter-spacing: 2px;width: 203px;text-align: center;background: #3FB4C6}
    .layout .title span {color: #9DD4DF;}
    .layout-ceiling div span span{letter-spacing: 3px;padding-left: 18px;}
    .layout-ceiling-main .iconfont {font-size: 18px;}
   .layout-ceiling .icon-exit {color: #228D9F; position: relative;top: -4px;font-size: 18px;}
   .layout-ceiling .layout-ceiling-main span {color: #FFFFFF;font-size: 14px;}
   .layout-ceiling-main div{float: left; padding: 0 20px;}
   .layout-ceiling .layout-ceiling-main .icon-chilun {color: #228D9F;font-size: 18px;}
</style>
