// pages/sale/sale/sale.js
const app = getApp();
const comm = require('../../../../utils/js/common.js');
const login = require('../../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/online/`;
let page = 1;
Page({
	data: {
		Token: "",
		fix: true,
		tabsIndex: 0,
		opacity: 0,
		//数据
		bannerJson: [],
		listJson: [],
		// 上拉加载
		loading: false,
		loadingTest: false,
	},
	onLoad: function (options) {
		page = 1;
		this.getToken();
	},
	getToken: function(){
		app.getStorage().then(data => {
			this.setData({
				Token: data,
				fix: false
			});
			this.getBannerData();
			this.getListData();
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
	//tabs
	onTabs: function(e){
		page = 1;
		this.setData({
			fix: true,
			listJson: [],
			tabsIndex: e.currentTarget.dataset.index
		});
		this.getListData();
	},
	//屏幕滚动监听事件
	onPageScroll: function (ev) {
		// console.log(ev.scrollTop);
		//180
		if (ev.scrollTop < 180 && ev.scrollTop > 0) {
			this.setData({
				// opacity: `0.${Math.floor(ev.scrollTop / 180)}`
				opacity: 0
			})
		} else if (ev.scrollTop >= 180) {
			this.setData({
				opacity: 1
			})
		} else if (ev.scrollTop <= 0) {
			this.setData({
				opacity: 0
			})
		}
	},
	//获取数据
	getBannerData: function(){
		let that = this;
		comm.post(URL, {
			a: "getFilmstrip",
			token: that.data.Token
		}).then(data => {
			let item = data.data.data.data.list;
			console.log(item);
			that.setData({ bannerJson: item });
		}).catch(err => {
			if (err.data.data.code){
				login.wxAuth();
			}
		});
	},
	getListData: function(){
		let that = this;
		let list = this.data.listJson;
		comm.post(URL, {
			a: "getIndexCarsList",
			token: that.data.Token,
			auction_type: that.data.tabsIndex,
			p: page,
			k: ""
		}).then(data => {
			let item = data.data.data.data;
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
			console.log(err.data.data);
			that.setData({ 
				fix: false,
				loading: false,
				loadingTest: true
			});
		});
	},
	
})