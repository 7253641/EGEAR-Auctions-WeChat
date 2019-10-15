// pages/mine/mine.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/user/`;
const phoneUrl = `${comm.config().comm}/passport/`;
const { $Toast } = require('../../../dist/base/index');
Page({
	data: {
		Token: "",
		fix: true,
        authorize: false,
		json: [],
	},
	onLoad: function (options) {
        
	},
	getToken: function () {
        wx.getStorage({
            key: 'token',
            success: msg => {
                this.setData({
                    Token: msg.data,
                    fix: false
                });
                this.getData();
            },
            fail: err => {
                this.setData({
                    fix: false
                });
            }
        });
	},
	onReady: function () {
		
	},
	onShow: function () {
        this.getToken();
	},
	//获取数据
	getData: function () {
		let that = this;
		comm.post(URL, {
			a: "getMemberInfo",
			token: that.data.Token
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
			that.setData({
				json: item,
				fix: false,
                authorize: true
			})
		}).catch(err => {
			console.log(err.data.data);
			if (err.data.data.code) {
                login.wxAuth();
			}
		});
	},
    //按钮授权后信息
    bindGetUserInfo: function (e) {
        if (e.detail.errMsg == "getUserInfo:ok") {
            login.wxLogin(e.detail.encryptedData, e.detail.iv);
        }
    },
    nologin: function(){
        if(!this.data.authorize){
            $Toast({
                content: '请先授权登录',
                type: 'error'
            });
        }
    },
    //获取手机号
    getPhoneNumber: function(e) {
        console.log(e)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        wx.login({
            success: function (res) {
                if (res.code) {
                    console.log(res.code);
                    // comm.post(phoneUrl, {
                    //     a: "getMobile",
                    //     encryptedData: e.detail.encryptedData,
                    //     iv: e.detail.iv,
                    //     type: "",
                    //     token: that.data.Token
                    // }).then(data => {
                    //     console.log(data);
                    // }).catch(err => {
                    //     console.log(err);
                    // });
                }
            }
        });
        
    }
})