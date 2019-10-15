// pages/service/service.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
	},
	onLoad: function (options) {
		
	},
	onReady: function () {

	},
	onShow: function () {

	},
	//拨打电话
	calling: function () {
		wx.makePhoneCall({
			phoneNumber: '400-018-5799',
			success: function () {
				console.log("拨打电话成功！")
			},
			fail: function () {
				console.log("拨打电话失败！")
			}
		})
	},
	handleContact: function(e) {
		console.log(e.path)
		console.log(e.query)
	}
})