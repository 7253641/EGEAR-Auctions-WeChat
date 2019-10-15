// pages/auction/orderdes/orderdes.js
const app = getApp();
const comm = require('../../../../utils/js/common.js');
const login = require('../../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/user/`;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		Token: "",
		opacity: 0,
		tabsIndex: 0,
		fix: true,
		json: [],
		id: "",
	},
	onLoad: function (options) {
		this.setData({
			id: options.id
		})
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
			a: "auctionOrderInfo",
			token: that.data.Token,
			id: that.data.id
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
	//屏幕滚动监听事件
	onPageScroll: function (ev) {
		if (ev.scrollTop < 160 && ev.scrollTop > 0) {
			this.setData({
				opacity: `0.${Math.floor(ev.scrollTop / 16)}`
			})
		} else if (ev.scrollTop >= 160) {
			this.setData({
				opacity: 1
			})
		} else if (ev.scrollTop <= 0) {
			this.setData({
				opacity: 0
			})
		}
	},
})