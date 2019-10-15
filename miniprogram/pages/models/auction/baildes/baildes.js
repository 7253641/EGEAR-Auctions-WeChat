// pages/baildes/baildes.js
const app = getApp();
const comm = require('../../../../utils/js/common.js');
const login = require('../../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/user/`;
Page({
	data: {
		Token: "",
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
			a: "auctionBondInfo",
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
})