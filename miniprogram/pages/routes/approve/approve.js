// pages/approve/approve.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
const { $Toast } = require('../../../dist/base/index');
const URL = `${comm.config().auc}/user/`;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		Token: "",
		json: [],
		state: 0,
		legalname: "",
		idcard: "",
	},
	onLoad: function (options) {
		this.getToken();
	},
	getToken: function () {
		app.getStorage().then(data => {
			this.setData({
				Token: data
			});
			this.getData();
		});
	},
	onReady: function () {

	},
	onShow: function () {

	},
	getData: function(){
		let that = this;
		comm.post(URL, {
			a: "checkRealName",
			token: that.data.Token
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
			that.setData({
				json: item,
				fix: false
			})
		}).catch(err => {
			console.log(err.data.data.data);
			that.setData({
				json: err.data.data.data,
				fix: false
			})
			if (err.data.data.code) {
				login.wxAuth();
			}
		});
	},
	getValue: function(e){
		this.setData({
			[e.currentTarget.dataset.text]: e.detail.value
		})
	},
	check: function(res){
		$Toast({
			content: res,
			type: 'error'
		});
	},
	btn: function(){
		let flag = false;
		(this.data.idcard).match(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/) ? flag = true : this.check("请输入正确的身份证号");
		this.data.legalname ? flag = true : this.check("请输入姓名");
		if(flag){
			this.getPost();
		}
	},
	getPost: function(){
		$Toast({
			content: "审核中",
			type: 'loading'
		});
		let that = this;
		comm.post(URL, {
			a: "setRealName",
			token: that.data.Token,
			legalname: that.data.legalname,
			idcard: that.data.idcard
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
            $Toast({
                content: "审核通过",
                type: 'success'
            });
			setTimeout(function () {
                wx.navigateBack({
                    delta: 1
                })
			}, 500);
		}).catch(err => {
			$Toast({
				content: err.data.data.msg,
				type: 'error'
			});
			if (err.data.data.code) {
				login.wxAuth();
			}
		});
	},
})