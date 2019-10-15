//login
module.exports = {
	wxAuth: wxAuth,
	wxLogin: wxLogin,
}
const app = getApp();
const comm = require('./common.js');
const loginUrl = comm.config().comm + '/passport/?a=login';
//全局
const { $Toast } = require('../../dist/base/index');

//判断是否授权
function wxAuth() {
    $Toast({
        content: '登录中',
        type: 'loading'
    });
	wx.getUserInfo({
		withCredentials: true,
		success: res => {
			wxLogin(res.encryptedData, res.iv);
			// console.log("success；   ", res)
		},
		fail: err => {
			wx.reLaunch({ 
				url: "/pages/auth/auth"
			})
		}
	});
}
//微信登陆
function wxLogin() {
    $Toast({
        content: '登录中',
        type: 'loading'
    });
	let [encryptedData, iv] = arguments;
	wx.login({
		success: function (res) {
			if (res.code) {
				serverLogin(res.code, encryptedData, iv);
			}
		}
	});
}
//服务器登陆
function serverLogin() {
	let [code, encryptedData, iv] = arguments;
	// console.log(loginUrl, code, encryptedData, iv);
	comm.post(loginUrl, {
		code: code,
		encryptedData: encryptedData,
		iv: iv,
		type: 4,
	}).then(data => {
		console.log("服务器登录成功结果:   ", data);
		let item = data.data.data;
		if (item.token){
			wx.setStorage({
				key: 'token', 
				data: item.token,
				success: success => {
					item.isMobile == 1 ? loginSuccess() : loginError(item.token);
				},
				fail: err => {
					console.log("注册token失败--:  " , err);
				}
			});
		}
	}).catch(err => {
		console.log(err);
		$Toast({
			content: err.data.data.msg,
			type: 'error'
		});
	});
}

function getPhoneNumber(){
    
}

const loginSuccess = function(){
	$Toast({
		content: '登陆成功',
		type: 'success'
	});
	// wx.reLaunch({
	// 	url: '/pages/index/index'
	// });
    let page = getCurrentPages().pop();
    if (page == undefined || page == null) return;
    page.onShow();
}
const loginError = function(token){
	wx.reLaunch({ 
		url: '/pages/public/login/login?token=' + token 
	});
}