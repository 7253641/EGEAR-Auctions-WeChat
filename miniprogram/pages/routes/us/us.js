// pages/us/us.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/api/`;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		fix: true,
		json: [],
		opacity: 0,
	},
	onLoad: function (options) {
        this.getData();
	},
	onReady: function () {

	},
	onShow: function () {

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
	//获取数据
	getData: function () {
		let that = this;
		comm.post(URL, {
			a: "about"
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
			that.setData({
				json: item,
				fix: false
			})
		}).catch(err => {
			console.log(err.data.data);
		});
	}
})