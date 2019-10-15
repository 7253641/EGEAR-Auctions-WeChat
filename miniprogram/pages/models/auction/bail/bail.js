// pages/bail/bail.js
const app = getApp();
const comm = require('../../../../utils/js/common.js');
const login = require('../../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/user/`;
let page = 1;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		Token: "",
		fix: true,
		json: [],
		// 上拉加载
		loading: false,
		loadingTest: false,
	},
	onLoad: function (options) {
		page = 1;
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
	/* ==============================
	* 上拉加载
	* 附
	* loading: false,
	* loadingTest: false,
	================================= */
	onReachBottom: function () {
		this.setData({
			loading: true,
			loadingTest: false,
		});
		setTimeout(() => {
			this.getListData();
		}, 500);
	},
	//获取数据
	getData: function () {
		let that = this;
		let list = this.data.json;
		comm.post(URL, {
			a: "auctionBond",
			token: that.data.Token,
			p: page
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
			for (var i = 0; i < item.length; i++) {
				list.push(item[i]);
			}
			page++;
			that.setData({
				json: list,
				fix: false,
				loading: false,
				loadingTest: false
			})
		}).catch(err => {
			console.log(err.data.data);
			that.setData({
				fix: false,
				loading: false,
				loadingTest: true
			});
			if (err.data.data.code) {
				login.wxAuth();
			}
		});
	},
})