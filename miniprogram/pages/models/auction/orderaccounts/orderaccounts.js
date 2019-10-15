// pages/auction/orderaccounts/orderaccounts.js
const app = getApp();
const comm = require('../../../../utils/js/common.js');
const login = require('../../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/user/`;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		Token: "",
		fix: true,
		opacity: 0,
		rid: "",
		json: [],
	},
	onLoad: function (options) {
		this.setData({
			rid: options.rid
			// rid: 16
		})
		this.getToken();
	},
	onReady: function () {

	},
	onShow: function () {

	},
	//TOKEN
	getToken: function () {
		app.getStorage().then(data => {
			this.setData({
				Token: data
			});
			this.getData();
		});
	},
	//屏幕滚动监听事件
	onPageScroll: function (ev) {
		if (ev.scrollTop < 120 && ev.scrollTop > 0) {
			this.setData({
				opacity: `0.${Math.floor(ev.scrollTop / 12)}`
			})
		} else if (ev.scrollTop >= 120) {
			this.setData({
				opacity: 1
			})
		} else if (ev.scrollTop <= 0) {
			this.setData({
				opacity: 0
			})
		}
	},
	getData: function () {
		let that = this;
		comm.post(URL, {
			a: "auctionSettlement",
			token: that.data.Token,
			rid: that.data.rid,
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
			that.setData({
				json: item,
				fix: false
			});
		}).catch(err => {
			if (err.data.data.code) {
				login.wxAuth();
			}
		});
	},
})