// pages/auction/money/money.js
// pages/iwantBuy/iwantBuy.js
const app = getApp();
const comm = require('../../../../utils/js/common.js');
const login = require('../../../../utils/js/wxLogin.js');
const { $Toast } = require('../../../../dist/base/index');
const URL = `${comm.config().auc}/api/`;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		fix: true,
		Token: "",
		json: [],
		rid: "",
	},
	onLoad: function (options) {
		this.setData({ rid: options.rid });
		this.getToken();
	},
	getToken: function () {
		app.getStorage().then(data => {
			this.setData({
				Token: data,
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
			a: "bankConfig",
			token: that.data.Token,
			rid: that.data.rid
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
})