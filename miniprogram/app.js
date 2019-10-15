//app.js
//登录
const login = require('/utils/js/wxLogin.js');

// const packageOther = require('packageName/other')
App({
	data: {
		
	},
	onLaunch: function (options) {
		// 获取屏幕高度
		wx.getSystemInfo({
			success: e => {
				this.globalData.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				this.globalData.Custom = custom;
				this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
			}
		}); 
		
	},
	getStorage: function(){
		//获取本地存储
		return new Promise((resolve, reject) => {
			wx.getStorage({
				key: 'token',
				success: msg => {
					resolve(msg.data)
				},
				fail: err => {
					//login.wxAuth();
                    reject(err);
				}
			});
		});
	},
	globalData: {
		
	},
})