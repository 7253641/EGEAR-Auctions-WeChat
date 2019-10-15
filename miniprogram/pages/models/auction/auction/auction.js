// pages/auction/auction/auction.js
const app = getApp();
const comm = require('../../../../utils/js/common.js');
const login = require('../../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/auc/`;
let page = 1;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		fix: true,
		//数据
		bannerJson: [],
		listJson: [],
		// 上拉加载
		loading: false,
		loadingTest: false,
	},
	onLoad: function (options) {
		
	},
	onReady: function () {

	},
	onShow: function () {
		page = 1;
		this.setData({
			listJson: []
		})
        this.getBannerData();
        this.getListData();
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
	getBannerData: function () {
		let that = this;
		comm.post(URL, {
			a: "getFilmstrip"
		}).then(data => {
			let item = data.data.data.data.list;
			console.log(item);
			that.setData({ bannerJson: item });
		}).catch(err => {
			console.log(err);
		});
	},
	getListData: function () {
		let that = this;
		let list = this.data.listJson;
		comm.post(URL, {
			a: "getIndexList",
			auction_type: that.data.tabsIndex,
			p: page,
			k: ""
		}).then(data => {
			let item = data.data.data.data.aucList;
			console.log(item);
			for (var i = 0; i < item.length; i++) {
				list.push(item[i]);
			}
			page ++;
			that.setData({
				listJson: list,
				fix: false,
				loading: false,
				loadingTest: false
			})
		}).catch(err => {
			console.log(err);
			that.setData({
				fix: false,
				loading: false,
				loadingTest: true
			});
		});
	},
})