// pages/parameters/parameters.js
const app = getApp();
const comm = require('../../../utils/js/common.js');
const login = require('../../../utils/js/wxLogin.js');
const dataUrl = `${comm.config().auc}/auc/`;
const { $Toast } = require('../../../dist/base/index');
Page({
	data: {
		fix: true,
		tabsIndex: 0,
		a_id: "",
		json: [],
	},
	onLoad: function (options) {
		console.log(options.a_id);
		this.setData({
			a_id: options.a_id
		});
        this.getData();
	},
	onReady: function () {

	},
	onShow: function () {

	},
	//tabs
	onTabs: function(e){
		this.setData({ tabsIndex: e.currentTarget.dataset.index });
	},
	//获取数据
	getData: function(){
		let that = this;
		comm.post(dataUrl, {
			a: "carsInfo",
			a_id: that.data.a_id
		}).then(data => {
			let item = data.data.data.data;
			console.log(item);
			that.setData({ 
				json: item,
				fix: false
			});
		}).catch(err => {
			console.log(err);
			that.setData({
				fix: false
			});
			if (err.data.data.code) {
				login.wxAuth();
			}
		});
	},
	previewImage: function(e){
		wx.previewImage({
			current: e.currentTarget.dataset.url, 
			urls: this.data.json.carInfo.img_all
		})
	},
	down: function(){
		$Toast({
			content: '下载中',
			type: 'loading',
			duration: 30000
		});
		let that = this;
		for (let i = 0; i < that.data.json.carInfo.img_all.length; i ++){
			wx.downloadFile({
				url: that.data.json.carInfo.img_all[i],
				success(res) {
					console.log(res);
					if (i == that.data.json.carInfo.img_all.length - 1) {
						$Toast({
							content: '下载成功',
							type: 'success'
						});
					}
					if (res.statusCode === 200) {
						wx.saveImageToPhotosAlbum({
							filePath: res.tempFilePath
						})
					}
				}
			});
		}
	}
})