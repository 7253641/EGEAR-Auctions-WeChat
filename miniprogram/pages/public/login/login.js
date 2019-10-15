// pages/login/login.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
const { $Toast } = require('../../../dist/base/index');
//全局
let interval = null;
const URL = `${comm.config().comm}/passport/`;
Page({
	data: {
		time: '获取验证码',
		btnState: "getVerificationCode",
		currentTime: 61,
		phoneVal: '',
		codeVal: '',
		token: '',
	},
	onLoad: function (options) {
		options.token ? this.setData({
			token: options.token
		}) : wx.reLaunch({
			url: "/pages/auth/auth"
		});
	},
	onReady: function () {

	},
	onShow: function () {
		
	},
	//获取电话号
	getPhoneVal: function (event) {
		this.setData({
			phoneVal: event.detail.value
		});
	},
	//手机号验证
	checkPhone: function () {
		let that = this;
		let tel = that.data.phoneVal;
		if (tel) {
			let flag = tel.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
			if (flag) {
				//TODO手机号输入正确
				return tel;
			} else {
				//TODO请输入正确的手机号
				comm.smallPrompt("请输入正确的手机号");
				return false;
			}
		} else {
			//TODO请输入手机号。。。。。手机号为null
			comm.smallPrompt("手机号不能未空");
			return false;
		}
	},
	//点击获取验证码
	getVerificationCode: function () {
		let that = this;
        console.log(that.data.token);
        console.log(that.checkPhone());
		if (that.checkPhone()) {
			comm.post(URL, {
				a: "getMobileCode",
				mobile: that.checkPhone(),
				token: that.data.token,
				type: 4,
			}).then(data => {
				console.log(data);
				that.getCode();
				comm.smallPrompt("验证码已发送");
			}).catch(err => {
				console.log(err);
				comm.smallPrompt(err.data.data.msg);
			});
		}
	},
	//计时器
	getCode: function () {
		let that = this;
		let currentTime = that.data.currentTime;
		interval = setInterval(function () {
			currentTime--;
			that.setData({
				time: currentTime + '秒',
				btnState: ""
			});
			if (currentTime <= 0) {
				clearInterval(interval)
				that.setData({
					time: '重新发送',
					currentTime: 61,
					btnState: "getVerificationCode"
				});
			}
		}, 1000);
	},
	//获取验证码
	getCodeVal: function (event) {
		this.setData({
			codeVal: event.detail.value
		});
	},
	submitBtn: function () {
		$Toast({
			content: '绑定中',
			type: 'loading'
		});
		let that = this;
		console.log(that.data.codeVal);
		console.log(that.data.token);
		if (that.data.phoneVal && that.data.codeVal) {
			comm.post(URL, {
				a: "bindMobile",
				mobile: that.checkPhone(),
				authcode: that.data.codeVal,
				token: that.data.token,
				type: 4,
			}).then(data => {
				//操作isMobile
				console.log(data)
				wx.setStorage({ key: 'token', data: data.data.data.token });
				$Toast({
					content: '绑定成功',
					type: 'success'
				});
				setTimeout(function () {
					wx.reLaunch({ url: '/pages/routes/index/index' });
				}, 1000);
			}).catch(err => {
				console.log(err)
				comm.smallPrompt(err.data.data.msg);
			});
		} else {
			//TODO没有输入验证码
			comm.smallPrompt("请输入验证码");
		}
	}
})