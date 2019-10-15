// pages/auction/auctionHall/auctionHall.js
const app = getApp();
const path = `../../../../`;
const comm = require(`${path}utils/js/common.js`);
const login = require(`${path}utils/js/wxLogin.js`);
const ws = require(`${ path }utils/js/webSocket.js`);
const { $Toast } = require(`${path}dist/base/index`);
const md = require(`${ path }utils/js/mudu.js`);
const Mudu = require(`${path}utils/js/wechat-mudu.min.js`);
const dataUrl = `${comm.config().auc}/auc/`;
const bidUrl = `${comm.config().auc}/bid/`;
let page = 1;
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		Custom: app.globalData.Custom,
		PageHeight: wx.getSystemInfoSync().windowHeight - 150,
		tabsIndex: 0,
		priceIndex: 0,
		json: [],
		listJson: [],
		fix: true,
		rid: "",
		Token: "",
		// 上拉加载
		loading: false,
		loadingTest: false,
		//拍卖会状态 0 未开始  1 正在拍  2 已结束
		status: null,
		///加价幅度
		addPriceScope: "",
		///当前拍品信息
		nowJson: [],
		///出价列表
		bidJson: [],
		///我的预出价
		myFuturePrice: null,
		///我的出价
		myPrice: null,
		///出价按钮
		bidBtn: true,
		///prompt
		promptJson: {
			pro01: true,
			pro02: true,
			pro03: true
		},
		shoutJson: [],
		//mudu
		muduJson: {
			name: "",
			url: "",
			hit: "",
			state: "",
		},
	},
	onLoad: function (options) {
		page = 1;
		this.setData({
			rid: options.rid
		});
	},
    //按钮授权后信息
    bindGetUserInfo: function (e) {
        if (e.detail.errMsg == "getUserInfo:ok") {
            login.wxLogin(e.detail.encryptedData, e.detail.iv);
        }
    },
	//TOKEN
	getToken: function () {
		app.getStorage().then(data => {
            // console.log('token:  ', data);
			this.setData({
				Token: data
			});
            this.getData();
            this.getListData();
		}).catch(err => {
            // console.log('token:  ', err);
            this.setData({
                Token: ""
            });
            this.getData();
            this.getListData();
        });
        
	},
	onReady: function () {
        
	},
	onShow: function () {
        this.getToken();
        if (this.data.status == 1) {
            try {
                if ('function' === typeof Mudu.Room.reconnectSocket) {
                    Mudu.Room.reconnectSocket() // 该方法在Mudu.Init成功后，才会挂载在Mudu.Room上
                    console.log("已重新连接reconnectSocket");
                }
            } catch (e) {
                console.warn('reconnect mudu socket error: ', e)
            }
        }
	},
	onHide: function() {
        if (this.data.status == 1) {
            wx.closeSocket();
            console.log("关闭websocket")
            try {
                if ('function' === typeof Mudu.Room.closeSocket) {
                    Mudu.Room.closeSocket() // 该方法在Mudu.Init成功后，才会挂载在Mudu.Room上
                    console.log("已关闭closeSocket");
                }
            } catch (e) {
                console.warn('close mudu socket error: ', e)
            }
        }
	},
	onUnload: function() {
		
	},
/*==============================
* tabs导航
================================*/ 
	clickTabs: function (e) {
		this.setData({
			tabsIndex: e.currentTarget.dataset.index,
		});
	},
/*==============================
* 选择价格
================================*/
	clickPrice: function (e) {
		this.setData({
			priceIndex: e.currentTarget.dataset.index,
			addPriceScope: e.currentTarget.dataset.price,
			myFuturePrice: parseInt(this.data.nowJson.price) + parseInt(e.currentTarget.dataset.price)
		})
	},
/*==============================
* 获取数据
================================*/
	getData: function(){
		let that = this;
		//信息
        // console.log("that.data.Token: ", that.data.Token);
		comm.post(dataUrl, {
			a: "auction",
			rid: that.data.rid,
            token: that.data.Token
		}).then(data => {
			let item = data.data.data.data;
			console.log("✨拍卖大厅success信息： ", item);
			that.setData({
				json: item,
				fix: false,
				//拍卖会状态
				status: item.auctionInfo.status,
				nowJson: item.carsInfo,
				//加价幅度第一个
				addPriceScope: item.carsInfo != null ? item.carsInfo.ladder[0] : null,
				bidJson: item.carsInfo != null ? item.carsInfo.bidList : null,
				// toView: item.carsInfo != null ? `list${item.carsInfo.a_id}` : null,
			});
			that.setData({
				//我的预出价
				myFuturePrice: item.carsInfo != null ? parseInt(item.carsInfo.price) + parseInt(that.data.addPriceScope) : null
			})

			if(that.data.status == 1){
				that.linkWs();
                if (item.liveParame.live_id){
                    console.log(1)
                    md.init( item.liveParame.live_id, item.liveParame.user_name, item.liveParame.user_logo, item.liveParame.user_id, that);
                }
			}
		}).catch(err => {
			// console.log(err);
		});
	},
	getListData: function(){
		let that = this;
		let list = this.data.listJson;
		comm.post(dataUrl, {
			a: "carsList",
			rid: that.data.rid,
			p: page,
            token: that.data.Token
		}).then(data => {
			let item = data.data.data.data;
            // console.log("✨拍卖大厅success列表信息： ", item);
			for (var i = 0; i < item.length; i++) {
				list.push(item[i]);
			}
			page ++;
			that.setData({
				listJson: list,
				fix: false,
				loading: false,
				loadingTest: false
			})
		}).catch(err => {
			// console.log(err);
			that.setData({
				fix: false,
				loading: false,
				loadingTest: true
			});
		});
	},
/* ==============================
* 连接webSocket
================================= */
	linkWs: function(){
		///接收消息
		wx.onSocketMessage(data => {
            if (data.data[0] == "{"){
                let newdata = JSON.parse(data.data);
                console.log(newdata);
                if (newdata.type == "bid") {
                    //有用户出价了
                    this.nowBid(newdata);
                } else if (newdata.type == "login") {
                    //有用户进来了
                    this.nowComingin(newdata);
                } else if (newdata.type == "logout") {
                    //有用户退出了
                    this.nowComingout(newdata);
                } else if (newdata.type == "end") {
                    //设备结束
                    this.endBid(newdata);
                } else if (newdata.type == "start") {
                    //设备开始
                    this.startBid(newdata);
                } else if (newdata.type == "notice") {
                    //讲话
                    this.showShout(newdata);
                } else {

                }
            }
		});
		let login_data = `{"type":"login","client_name":"用户${Math.floor(Math.random() * 400)}","room_id":"a${this.data.rid}"}`;
		//连接webSocket
		ws.connect().then(data => {
			//打开webSocket
			ws.open().then(data => {
				//发送第一个webSocket
				ws.sendMessage(login_data);
			});
		});
	},
/* ==============================
* webSocket接收操作
================================= */
	showShoutTest: function(){
		this.showShout(JSON.parse(`{"thisS": {"notice": "大傻子！！！！"}}`));
	},
	showShout: function(data){
		let json = this.data.shoutJson;
		let that = this;
		json.push(data.thisS.notice);
		this.setData({
			shoutJson: json
		});
	},
	endBid: function(data){
		let that = this;
		that.setData({
			listJson: []
		})
		page = 1;
		this.getListData();
		if(data.thisS.is_bid == 0){
			that.setData({
				bidBtn: true
			})
		}else{
			that.setData({
				bidBtn: false
			});
			// for (let i = 0; i < that.data.listJson.length; i++) {
			// 	if (that.data.listJson[i].a_id == that.data.nowJson.a_id) {
			// 		let newListJson = "listJson[i].status";
			// 		that.setData({
			// 			[newListJson]: 2,//处理中
			// 			toView: that.data.nowJson.a_id,
			// 		})
			// 	}
			// }
		}
	},
	startBid: function(data){
		let that = this;
		that.setData({
			listJson: []
		})
		page = 1;
		this.getListData();
		// for (let i = 0; i < that.data.listJson.length; i++) {
		// 	if (that.data.listJson[i].a_id == that.data.nowJson.a_id) {
		// 		let newListJson = "listJson[i].status";
		// 		that.setData({
		// 			[newListJson]: 3,//已结束
		// 		})
		// 	}
		// }
		that.setData({
			nowJson: data.thisS,
			//加价幅度第一个
			addPriceScope: data.thisS.ladder[0],
			myFuturePrice: parseInt(data.thisS.price) + parseInt(data.thisS.ladder[that.data.priceIndex]),
			bidJson: data.thisS.bidList,
			bidBtn: true,
			myPrice: "",
		});
		
		// for (let i = 0; i < that.data.listJson.length; i ++){
		// 	if (that.data.listJson[i].a_id == data.thisS.a_id){
		// 		let newListJson = "listJson[i].status";
		// 		that.setData({
		// 			[newListJson]: 1,//正在拍
		// 			toView: that.data.nowJson.a_id,
		// 		})
		// 	}
		// }
	},
	nowBid: function(data){
		let bidJson = this.data.bidJson;
		let nowJson_price = "nowJson.price";
		let nowJson_bidCount = "nowJson.bidCount";
		let nowJson_mainpic = "nowJson.mainpic";
		let nowJson_tid = "nowJson.tid";
		let nowJson_car_name = "nowJson.car_name";
		let nowJson_message = "nowJson.message";
		let nowJson_a_id = "nowJson.a_id";
		let nowJson_ladder = "nowJson.ladder";
		// console.log("出价成功🇨🇳🇨🇳🇨🇳 ", JSON.stringify(data.thisS));
		//出价列表
		bidJson.unshift({
			come_from: data.thisS.bidList[0].come_from,
			price: data.thisS.bidList[0].price,
			create_time: data.thisS.bidList[0].create_time
		});
		//公共
		this.setData({
			bidJson: bidJson,
			[nowJson_price]: data.thisS.price,
			[nowJson_bidCount]: data.thisS.bidCount,
			[nowJson_mainpic]: data.thisS.mainpic,
			[nowJson_tid]: data.thisS.tid,
			[nowJson_car_name]: data.thisS.car_name,
			[nowJson_message]: data.thisS.message,
			[nowJson_a_id]: data.thisS.a_id,
			[nowJson_ladder]: data.thisS.ladder,
		});
		this.setData({
			myFuturePrice: parseInt(data.thisS.price) + parseInt(this.data.addPriceScope),
		})
		
	},
	nowComingin: function(data){
		// console.log(`欢迎 🍺   ${data.client_name}   🍺 进入直播间`);
	},
	nowComingout: function(data){
		// console.log(`🏃🏃🏃🏃🏃   ${data.from_client_name}退出直播间`);
	},
/* ==============================
* 出价
================================= */
	bid: function(e){
		$Toast({
			content: '出价中',
			type: 'loading'
		});
		let that = this;
		//信息
		comm.post(bidUrl, {
			a: "aucBid",
			token: that.data.Token,
			a_id: that.data.nowJson.a_id,
			rid: that.data.rid,
			price: parseInt(that.data.nowJson.price) + parseInt(that.data.addPriceScope),
			type: "online",
			bidprice: that.data.addPriceScope,
		}).then(data => {
			$Toast({
				content: '出价成功',
				type: 'success'
			});
			let item = data.data.data.data;
            // console.log("✨出价success信息： ", item);
			let login_data = JSON.stringify({ "type": "bid", "thisS": item });
			//个人
			that.setData({
				myPrice: item.price,
				myFuturePrice: parseInt(item.price) + parseInt(that.data.addPriceScope),
			});
			//发送消息
			ws.sendMessage(login_data);
		}).catch(err => {
			// console.log(err);
			$Toast({
				content: err.data.data.msg,
				type: 'error'
			});
			if (err.data.data.code) {
				login.wxAuth();
			}
		});
	},
/* ==============================
* 上拉加载
* 附
* loading: false,
* loadingTest: false,
================================= */
	onReachBottom: function () {
		if (this.data.tabsIndex == 1){
			this.setData({
				loading: true,
				loadingTest: false,
			});
			setTimeout(() => {
				this.getListData();
			}, 500);
		}
	},
/* ==============================
* header
================================= */
	backpage: function () {
		page = 1;
		if (this.data.status == 1) {
			wx.closeSocket();
		}
		wx.navigateBack({
			delta: 1
		});
	},
	backindex: function () {
		page = 1;
		if (this.data.status == 1) {
			wx.closeSocket();
		}
		wx.reLaunch({
			url: '/pages/routes/index/index'
		});
	},
/* ==============================
* prompt
================================= */
	delPrompt: function(e){
		this.setData({
			[e.currentTarget.dataset.x]: false
		})
	},
/* ==============================
* 分享
================================= */
	onShareAppMessage: function (res) {
		var that = this;
		return {
			title: that.data.json.auctionInfo.roomname,
			path: '/pages/models/auction/auctionHall/auctionHall?rid=' + that.data.json.auctionInfo.rid,
			success: function (res) {

			},
			fail: function (res) {

			}
		}
	},
})