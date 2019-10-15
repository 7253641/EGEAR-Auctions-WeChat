const Mudu = require('./wechat-mudu.min.js');
module.exports = {
	init: init
}
function init(actId, name, avatar, assign_id, that) {
	return new Promise(function (resolve, reject) {
		Mudu.Init(actId, function (s) {
			Mudu.Room.User.Assign({
				name: name,
				avatar: avatar,
				assignId: assign_id
			}, function (e) {
				resolve(e)
			});
			Mudu.MsgBus.On("Barrage.New", function (barrage) {
				barrage = JSON.parse(barrage)
				console.log('收到新的弹幕，内容为: ', barrage.text)
			});
			Mudu.MsgBus.On('Room.StreamEvent', function (data) {
				data = JSON.parse(data);
				let msg = data.event == 1 ? '开始直播' : '停止直播';
				console.log(msg);
                let status = "muduJson.state";
                that.setData({
                    [status]: data.event
                });
			});
		});
		Mudu.MsgBus.On('Room.Init.Over', function () {
			console.log('初始化完成');
            that.setData({
                muduJson: {
                    name: Mudu.Room.GetName(),
                    url: Mudu.Room.GetPlayAddr(),
                    hit: Mudu.Room.GetViewNum(),
                    state: Mudu.Room.GetLiveStatus(),
                }
            });
            console.log("视频地址： ", that.data.muduJson)
		});
		Mudu.MsgBus.On('Room.Init.Error', function (e) {
			reject(e)
		});
	})
}