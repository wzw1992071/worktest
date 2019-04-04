angular.module('bw.services')
    .factory('appointmentService', ['$resource', function($resource) {
        var resource = $resource(ENV.api, {}, {
            //输入航班信息获取航班列表
            getTripsList: {
                method: 'GET',
                url: ENV.api + "Trips/GetAirlineInfo"
            },
            //乘客最近的订单
            getRecentBooking: {
                method: 'GET',
                url: ENV.api + "Booking/GetRecentBooking"
            },
            getActivity: {
                method: 'POST',
                url: ENV.api + "activity/getActivity",
                isLoading: false
            },
            //获取支付状态
            GetBookingStatus: {
                method: 'GET',
                url: ENV.api + "Booking/GetBookingStatus"
            },
            //获取用户订单
            GetBookings: {
                method: 'POST',
                url: ENV.api + "Booking/GetBookings"
            },
            //获取取消订单详情
            getCancelBooking: {
                method: 'GET',
                url: ENV.api + "Booking/CancelBooking"
            },
            //取消订单
            CancelBooking: {
                method: 'POST',
                url: ENV.api + "Booking/CancelBooking"
            },
            //订单详情
            GetDetail: {
                method: 'GET',
                url: ENV.api + "Booking/GetDetail"
            },
            //订单详情
            GetDetailNoLoading: {
                method: 'GET',
                url: ENV.api + "Booking/GetDetail",
                isLoading: false
            },
             //获取接机拼车二维码
            GetPickupCode: {
                method: 'GET',
                url: ENV.api + "Booking/GetPickupCode",
                isLoading: false
            },
            //获取评论标签
            GetCommentTags: {
                method: 'GET',
                url: ENV.api + "Booking/GetCommentTags"
            },
            //提交评论
            AddComments: {
                method: 'POST',
                url: ENV.api + "Booking/AddComments"
            },
            //支付订单
            PayBooking: {
                method: 'GET',
                url: ENV.api + "Booking/PayBooking"
            },
            //获取用户常用地址
            GetUserAddressBook: {
                method: 'GET',
                url: ENV.api + "Users/GetUserAddressBook",
                isLoading: false
            },
            //获取验证码
            SendValidSMS: {
                method: 'POST',
                url: ENV.api + "Users/SendValidSMS"
            },
            //绑定手机
            LoginWithSMS: {
                method: 'POST',
                url: ENV.api + "Users/LoginWithSMS"
            },
            //实名认证
            ValidRealIDCard: {
                method: 'POST',
                url: ENV.api + "Users/ValidRealIDCard"
            },
            //确认到达
            ConfirmArrive: {
                method: 'POST',
                url: ENV.api + "Booking/ConfirmArrive"
            },
            //确认上车
            ConfirmPickup: {
                method: 'POST',
                url: ENV.api + "Booking/ConfirmPickup"
            },
            //退出
            SignOut: {
                method: 'POST',
                url: ENV.api + "Users/SignOut"
            },
            //获取其他乘客信息
            GetOtherPassengersStatus: {
                method: 'GET',
                url: ENV.api + 'Booking/GetOtherPassengersStatus'
            },
            getWxSign: {
                method: 'GET', //获取微信sign
                url: ENV.api + "Weixin/GetSignature?url=" + encodeURIComponent(location.href.split('#')[0])
            },
            IsPositionValidate: {
                method: 'POST', //验证上下车地址是否超出范围
                url: ENV.api + "MapLimit/IsLocationValidate"
            },

            GetCarTypes: {
                method: 'GET', //获取专车类型
                url: ENV.api + "CarType/GetCarTypes"
            },
            GetUnitPrices: {
                method: 'GET', //拼车计价规则
                url: ENV.api + "SystemConfig/GetUnitPrices"
            },
            PreviewBooking: {
                method: 'POST', //验证预览订单（新）
                url: ENV.api + "Booking/PreviewBooking"
            },
            ValidatePassenger: {
                method: 'POST', //验证用户免费资格（新）
                url: ENV.api + "Booking/ValidatePassenger"
            },
            AddBooking: {
                method: 'POST', //开始下单（新）
                url: ENV.api + "Booking/AddBooking",
                isTips: false
            },
            GetWalletInfo: {
                method: 'POST', //获取钱包信息（新）
                url: ENV.api + "Users/GetWalletInfo"
            },
            GetWalletFlowList: {
                method: 'POST', //获取钱包流水（新）
                url: ENV.api + "Users/GetWalletFlowList"
            },
            PrivateCarConfirmArrive: {
                method: 'POST', //专车确认到达（新）
                url: ENV.api + "Booking/PrivateCarConfirmArrive"
            },
            BindReferralDriver: {
                method: 'POST', //专车确认到达（新）
                url: ENV.api + "Users/BindReferralDriver"
            },
            WalletRecharge: {
                method: 'GET', //钱包充值（新）
                url: ENV.api + "Booking/WalletRecharge"
            },
            GetDicts: {
                method: 'GET', //获取所有字典（新）
                url: ENV.api + "SystemConfig/GetDicts"
            },
            GetPassengerSubsidyPrice: {
                method: 'GET',
                url: ENV.api + "SystemConfig/GetPassengerSubsidyPrice"
            },
            GetUserInfo: {
                method: 'GET',
                url: ENV.api + "Weixin/GetUserInfo"
            },
            IsCompleteAllOder: {
                method: 'POST', //是否完成所有订单
                url: ENV.api + "Passenger/BookingMgr/IsCompleteAllOder"
            },
            ValidateModifyPhone: {
                method: 'POST', //验证手机号修改
                url: ENV.api + "Users/ValidateModifyPhone"
            },
            ModifyCustomPhone: {
                method: 'POST', //手机号修改
                url: ENV.api + "Users/ModifyCustomPhone"
            },
            UpdateAddressBook: {
                method: 'POST',
                url: ENV.api + "Users/UpdateAddressBook"
            },
            DeleteAddressBook: {
                method: 'POST',
                url: ENV.api + "Users/DeleteAddressBook"
            },
            AddVerification: {
                method: 'POST',
                url: ENV.api + "ValidPassenger/AddVerification"
            },
            GetDriverInfoByLicense: {
                method: 'GET',
                url: ENV.api + "Drivers/GetDriverInfoByLicense"
            },
            //获取城市列表
            GetOpenCity: {
                method: 'GET',
                url: ENV.api + "setting/GetOpenCity"
            },
            //获取航站楼
            getCityTerminal: {
                method: 'POST',
                url: ENV.api + "CityTerminal/GetList",
                isLoading: false
            },
            //获取详细地址
            getBaiDuDetailAddress: {
                method: 'POST',
                url: ENV.api + "BaiduMap/MapDetailAddr",
                isLoading: false
            },
        });
        return {
            //获取详细地址
            getBaiDuDetailAddress: function(params, callback) {
                return resource.getBaiDuDetailAddress(null, param(params), function(response) {
                    callback && callback(response);
                });
            },

            //获取开通城市列表
            GetOpenCity: function(params, callback) {
                return resource.GetOpenCity(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetBookingStatus: function(params, callback) {
                return resource.GetBookingStatus(params, null, function(response) {
                    callback && callback(response);
                });
            },
            //获取航站楼
            getCityTerminal: function(params, callback) {
                return resource.getCityTerminal(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            getTripsList: function(params, callback) {
                return resource.getTripsList(params, null, function(response) {
                    callback && callback(response);
                });
            },
            getRecentBooking: function(params, callback) {
                return resource.getRecentBooking(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetWalletInfo: function(params, callback) {
                return resource.GetWalletInfo(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            GetWalletFlowList: function(params, callback) {
                return resource.GetWalletFlowList(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            WalletRecharge: function(params, callback) {
                return resource.WalletRecharge(params, null, function(response) {
                    callback && callback(response);
                });
            },
            AddBooking: function(params, callback) {
                return resource.AddBooking(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            GetBookings: function(params, callback) {
                return resource.GetBookings(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            getActivity: function(params, callback) {
                return resource.getActivity(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            getCancelBooking: function(params, callback) {
                return resource.getCancelBooking(params, null, function(response) {
                    callback && callback(response);
                });
            },
            PayBooking: function(params, callback) {
                return resource.PayBooking(params, null, function(response) {
                    callback && callback(response);
                });
            },
            CancelBooking: function(params, callback) {
                return resource.CancelBooking(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            GetDetail: function(params, callback) {
                return resource.GetDetail(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetDetailNoLoading: function(params, callback) {
                return resource.GetDetailNoLoading(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetPickupCode: function(params, callback) {
                return resource.GetPickupCode(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetCommentTags: function(params, callback) {
                return resource.GetCommentTags(params, null, function(response) {
                    callback && callback(response);
                });
            },
            AddComments: function(params, callback) {
                return resource.AddComments(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            GetUserAddressBook: function(params, callback) {
                return resource.GetUserAddressBook(params, null, function(response) {
                    callback && callback(response);
                });
            },
            SendValidSMS: function(params, callback) {
                return resource.SendValidSMS(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            LoginWithSMS: function(params, callback) {
                return resource.LoginWithSMS(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            ValidRealIDCard: function(params, callback) {
                return resource.ValidRealIDCard(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            ConfirmArrive: function(params, callback) {
                return resource.ConfirmArrive(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            ConfirmPickup: function(params, callback) {
                return resource.ConfirmPickup(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            SignOut: function(params, callback) {
                return resource.SignOut(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            GetUnitPrices: function(params, callback) {
                return resource.GetUnitPrices(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetOtherPassengersStatus: function(params, callback) {
                return resource.GetOtherPassengersStatus(params, null, function(response) {
                    callback && callback(response);
                });
            },
            getWxSign: function(params, callback) {
                return resource.getWxSign(params, null, function(response) {
                    callback && callback(response);
                });
            },
            IsPositionValidate: function(params, callback) {
                return resource.IsPositionValidate(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            GetCarTypes: function(params, callback) {
                return resource.GetCarTypes(params, null, function(response) {
                    callback && callback(response);
                });
            },
            PreviewBooking: function(params, callback) {
                return resource.PreviewBooking(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            ValidatePassenger: function(params, callback) {
                return resource.ValidatePassenger(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            BindReferralDriver: function(params, callback) {
                return resource.BindReferralDriver(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            PrivateCarConfirmArrive: function(params, callback) {
                return resource.PrivateCarConfirmArrive(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            GetDicts: function(params, callback) {
                return resource.GetDicts(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetPassengerSubsidyPrice: function(params, callback) {
                return resource.GetPassengerSubsidyPrice(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetUserInfo: function(params, callback) {
                return resource.GetUserInfo(params, null, function(response) {
                    callback && callback(response);
                });
            },
            IsCompleteAllOder: function(params, callback) {
                return resource.IsCompleteAllOder(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            ValidateModifyPhone: function(params, callback) {
                return resource.ValidateModifyPhone(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            ModifyCustomPhone: function(params, callback) {
                return resource.ModifyCustomPhone(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            UpdateAddressBook: function(params, callback) {
                return resource.UpdateAddressBook(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            DeleteAddressBook: function(params, callback) {
                return resource.DeleteAddressBook(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            AddVerification: function(params, callback) {
                return resource.AddVerification(null, param(params), function(response) {
                    callback && callback(response);
                });
            },
            GetDriverInfoByLicense: function(params, callback) {
                return resource.GetDriverInfoByLicense(params, null, function(response) {
                    callback && callback(response);
                });
            },
            GetSupplierList: function(params, callback) {
                return resource.GetSupplierList(null, param(params), function(response) {
                    callback && callback(response);
                });
            }
            
        }   
    }]);