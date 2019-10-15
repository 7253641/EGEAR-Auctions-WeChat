// pages/video/video.js
const app = getApp();
const { $Toast } = require('../../../dist/base/index');
Page({
	data: {
		src: "",
	},
	onLoad: function (options) {
		console.log("options.src:    " + options.src);
		this.setData({
			src: options.src
		});
	},
	onReady: function () {

	},
	onShow: function () {

	},
	downLoad: function () {
		$Toast({
			content: '下载中',
			type: 'loading',
			duration: 30000
		});
		wx.downloadFile({
			url: this.data.src,
			success(res) {
				console.log(res);
				$Toast({
					content: '下载成功',
					type: 'success'
				});
				if (res.statusCode === 200) {
					wx.saveImageToPhotosAlbum({
						filePath: res.tempFilePath
					})
				}
			}
		});
	}
})