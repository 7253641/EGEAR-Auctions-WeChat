module.exports = {
	post: post,
    config: configProd,
	smallPrompt: smallPrompt,
}

/*=======================
* @https请求-封装
=========================*/
function configDev() {
	//开发
	return {
		// "comm": "https://developer-comm.yijipai.com",
		// "auc": "https://developer-auc.yijipai.com",
		//"socket": 'wss://developer.yijipai.com/',
		"comm": "https://developer-comm.yiliangpai.com",
		"auc": "https://developer-auc.yiliangpai.com",
		"socket": 'wss://developer.yiliangpai.com/',
	}
	// https://auc.yiliangpai.com
	// https://comm.yiliangpai.com
	// https://developer-auc.yiliangpai.com
	// https://developer-comm.yiliangpai.com
}
function configProd() {
	//线上
	return {
		// "comm": "https://comm.yijipai.com",
		// "auc": "https://auc.yijipai.com",
		// "socket": 'wss://new.yijipai.com/',
		"comm": "https://comm.yiliangpai.com",
		"auc": "https://auc.yiliangpai.com",
		"socket": 'wss://new.yiliangpai.com/',
	}
}

/*=======================
* @post请求
=========================*/
function post(url, data) {
	return new Promise((resolve, reject) => {
		wx.request({
			url: url,
			data: data,
			method: 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success(res) {
				if (res.data.result == "ok") {
					resolve(res);
				} else {
					reject(res);
				}
			},
			fail(e) {
				reject(e);
			}
		});
	});
}

/*=======================
* @三秒提示框-xiao框-封装
=========================*/
function smallPrompt(count) {
	wx.showToast({
		title: count,
		icon: "none",
		mask: true,
		complete: function () {
			setTimeout(function () {
				wx.hideLoading()
			}, 3000);
		}
	});
}