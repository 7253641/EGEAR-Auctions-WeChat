// pages/set/set.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/user/`;
const { $Toast } = require('../../../dist/base/index');
Page({
	data: {
		Token: "",
		fix: true,
		json: [],
	},
	onLoad: function (options) {
		this.getToken();
	},
	getToken: function () {
		app.getStorage().then(data => {
			this.setData({
				Token: data,
				// fix: false
			});
			this.getData();
		});
	},
	onReady: function () {

	},
	onShow: function () {

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
				fix: false
			})
		}).catch(err => {
			console.log(err.data.data);
			if (err.data.data.code) {
				login.wxAuth();
			}
		});
	},
	btnMobile: function(){
		$Toast({
			content: '手机号不可更改',
			type: 'error'
		});
	},
	btnAddress: function(){
		$Toast({
			content: '开发中',
			type: 'error'
		});
	},
    btnClear: function(){
        $Toast({
            content: '退出登录中',
            type: 'loading'
        });
        wx.clearStorage({
            success: data => {
                console.log(data);
                setTimeout(function () {
                    $Toast({
                        content: '退出成功',
                        type: 'success'
                    });
                    wx.reLaunch({ url: '/pages/routes/mine/mine' });
                }, 1000);
            },
            fail: err => {
                console.log(err);
            }
        })
    },
})