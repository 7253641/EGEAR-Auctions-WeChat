// pages/us/us.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
const URL = `${comm.config().auc}/api/`;
Page({
	data: {
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