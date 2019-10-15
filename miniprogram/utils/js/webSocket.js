//工具类
const util = require('./common.js');
module.exports = {
	connect: connect,
	open: open,
	sendMessage: sendMessage,
	onMessage: onMessage
}

//连接聊天室
function connect() {
	return new Promise((resolve, reject) => {
		wx.connectSocket({
			url: util.config().socket + "wss",
			header: {
				'content-type': 'application/json'
			},
			protocols: [],
			method: 'GET',
			success: function (msg) {
				resolve(msg);
				//console.log("connectSocket连接成功回调:    ", msg);
			},
			fail: function (err) {
				//console.log("connectSocket连接失败回调:     ", err);
			}
		});
	});
}

//打开聊天室
function open() {
	return new Promise((resolve, reject) => {
		wx.onSocketOpen(function (res) {
			//console.log('WebSocket连接已打开！')
			resolve(res);
		});
	});
}

//发送信息
function sendMessage() {
	return new Promise((resolve, reject) => {
		//console.log("发送的信息内容:    ", arguments[0]);
		wx.sendSocketMessage({
			data: arguments[0],
			success: function (res) {
				resolve(res);
				//console.log("发送WebSocket成功回调:         ", res);
			},
			fail: function (fail) {
				reject(fail);
				//console.log("发送WebSocket失败回调:           ", fail);
			}
		})
	});
}

//接收信息
function onMessage() {
	return new Promise((resolve, reject) => {
		wx.onSocketMessage(data => {
			resolve(data);
		});
	});
}

//监听错误事件
function onError() {
	wx.onSocketError(err => {
		console.log("监听错误事件: " + err);
	});
}