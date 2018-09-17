// 首页相关接口

// let indexApi;

// indexApi = {
//   getdata(thisObj, sendParam) {
//     return thisObj.$axios.get("/api/customer/home", {
//       params: sendParam
//     });
//   }
// };

// export default indexApi;

import axios from "src/api/http"
// 首页店铺类型推荐
export function typeRecommend(sendParam) {
    return axios.get("/api/v2/customer/goods/type_recommend", {
        params: sendParam
    });
}

// 获取首页数据
export function getIndexData() {
    return axios.get("/api/v2/customer/home");
}

// 获取猜你喜欢模块数据
export function getGuessLikeData(sendParam) {
    return axios.get("/api/v2/customer/goods/history", {
        params: sendParam
    });
}

// 获取掌柜推荐模块数据
export function getBossRecommendData(sendParam) {
    return axios.get("/api/v2/customer/goods/recommend", {
        params: sendParam
    });
}
// 这人设值相关接口
// 添加收货地址
export function AddAddress(sendParam) {
    return axios.post("/api/customer/address", sendParam);
}

// 修改收货地址
export function updateAddress(sendParam) {
    return axios.post("/api/customer/address/update", sendParam);
}

// 删除收货地址
export function delAddress(sendParam) {
    return axios.post("/api/customer/address/del", sendParam);
}

// 通用接口
// 关注
export function collections(sendParam) {
    return axios.put("/api/v2/customer/goods/collections",sendParam );
}
// 取消关注
export function LossCollections(sendParam) {
    return axios.delete("/api/v2/customer/goods/collections", {
        params: sendParam
    });
}

// 联系商家
export function contactShop() {
    return axios.get("/api/customer/contact");
}

// 加入购物车
export function addCar(sendParam) {
    return axios.post("/api/customer/shopping-cart/add" ,sendParam);
}

// 获取个人信息
export function getUserInfo() {
    return axios.get("/api/customer/profile");
}

// 获取省
export function getProvinces() {
    return axios.get("/api/other/provinces");
}
// 获取市/区
export function getChildArea(paramID) {
    return axios.get(`/api/other/children/${paramID}`);
}
