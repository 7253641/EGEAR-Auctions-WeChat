// pages/index/index.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/api/`;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		fix: true,
		opacity: 0,
		json: [],
		bannerJson: [],
	},
	onLoad: function (options) {
        this.getData();
        this.getBannerData();
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
			wx.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#000000',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
		} else if (ev.scrollTop <= 0) {
			this.setData({
				opacity: 0
			})
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#ffffff',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
		}
	},
	onReady: function () {

	},
	onShow: function () {
        
	},
	//获取数据
	getBannerData: function(){
		let that = this;
		comm.post(URL, {
			a: "getFilmstrip"
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
			that.setData({
				bannerJson: item,
			});
		}).catch(err => {
			console.log(err)
		}); 
	},
	getData: function(){
		let that = this;
		comm.post(URL, {
			a: "index"
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
			that.setData({ 
				json: item,
				fix: false
			});
		}).catch(err => {
			console.log(err)
		});
	},
	goAuction: function(){
		wx.reLaunch({ 
			url: '/pages/models/auction/auction/auction'
		})
	},
	goWx: function(){
		wx.navigateToMiniProgram({
			appId: 'wxb3dba707d4aced46',
			path: 'pages/index/index',
			envVersion: 'release',
			success(res) {
				// 打开成功
			}
		})
	},
	//分享
	onShareAppMessage: function (res) {
		var that = this;
		return {
			title: "易极拍卖平台",
			path: '/pages/routes/index/index',
			success: function (res) {
				
			},
			fail: function (res) {

			}
		}
	},
})