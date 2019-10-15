//app.js
//登录
const login = require('/utils/js/wxLogin.js');
App({
	data: {
		
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
	}
})