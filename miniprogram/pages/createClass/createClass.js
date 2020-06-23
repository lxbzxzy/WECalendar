// miniprogram/pages/createClass/createClass.js
const app = getApp();
const db = wx.cloud.database();

function formatDate(date) {  
	var y = date.getFullYear();  
	var m = date.getMonth() + 1;   
	var d = date.getDate(); 
	return y + '-' + m + '-' + d;  
};

Page({

	data: { 
		inputName:'',
		std:true,
		date:'',
		inputTitle:'',
		inputTerm:'',
		//timeZone:'',
		classPicSrc:'',
	},
	
	term:'',
	timeZone:0,

	onLoad: function () {
		var nowDate=new Date()
		this.setData({date:formatDate(nowDate)})
		var that=this;
		db.collection('basicSet').get().then(res=>{
			//console.log(res.data)
			that.setData({
				inputTerm:res.data[0].termName,
			})
			that.term=res.data[0].termName;
			that.timeZone=res.data[0].timeZone
		})
	},

	checkboxChange:function(){
		if(this.data.std) this.setData({std:false})
		else this.setData({std:true,inputTerm:this.term})
	},

	inputTitle:function(e){this.setData({ inputTitle: e.detail.value })},
	inputTerm:function(e){this.setData({ inputTerm: e.detail.value })},
	inputName:function(e){this.setData({ inputName: e.detail.value })},
	bindDateChange: function(e) {this.setData({date: e.detail.value})},

	submit:function(){
		var that=this;
		wx.showModal({
			title:'提示',
			content:'确定要创建班级吗？',
			success:function(res){
				if(res.confirm){
					that.submit2()
				}
			}
		})
	},
	submit2:function(){
		if(this.data.inputTerm.length==0||this.data.inputName.length==0||this.data.inputTitle.length==0){
			wx.showModal({
				showCancel:false,
				title:'提示',
				content:'请补充完整信息'
			})
			return;
		}
		var timeZone=this.timeZone;
		if(!this.data.std){
			var termBegin=new Date("2020/2/17");
			var endTime = -termBegin.getTime() / 1000 + parseInt(new Date(this.data.date).getTime() / 1000);
			var nowTime = parseInt(endTime / 86400);
			timeZone = parseInt(nowTime / 7);
			//nowWeek即是timeZone
		}
		wx.showToast({
			title: '创建班级中',
			icon:'loading',
			duration:1000
		})
		var that=this;
		db.collection('class').where({
			className:that.data.inputTitle
		}).get().then(res=>{
			console.log(res);
			if(res.data.length>0){
				wx.showModal({
					showCancel:false,
					title:'提示',
					content:'该班级名已经被注册'
				})
				return;
			}
			else{
				wx.cloud.callFunction({
					name:'addClass',
					data:{
						className:that.data.inputTitle,
						classPic:that.data.classPicSrc,
						std:that.data.std,
						term:that.data.inputTerm,
						timeZone:timeZone
					},
					success:function(){
						wx.cloud.callFunction({
							name:'addStudent',
							data:{
								canAdmin:true,
								name:that.data.inputName,
								class:that.data.inputTitle
							},
							success:function(){
								wx.cloud.callFunction({
									name:'register',
									data:{
										name:that.data.inputName,
										class:that.data.inputTitle
									},
									success:function(){
										wx.showModal({
											showCancel:false,
											title:'提示',
											content:'创建班级成功，请在首页登录',
											success:function(res){
												if(res.confirm){
													wx.reLaunch({
														url: '/pages/login/login',
													})
												}
											}
										})
									}
								})
							}
						})
					}
				})
			}
		})
	},

	upload:function(){
		var that=this;
		wx.chooseImage({//选择图片
			count : 1, //规定选择图片的数量，默认9
			success : (chooseres)=>{ //接口调用成功的时候执行的函数
				wx.showToast({
					title: '上传中',
					icon:'loading',
					duration:500
				})
				wx.cloud.uploadFile({
					filePath: chooseres.tempFilePaths[0],
					cloudPath: "img/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),
					success:function(res){
						console.log(res)
						that.setData({classPicSrc:res.fileID})
						wx.showModal({
							showCancel:false,
							title:'提示',
							content:'班徽上传成功'
						})
					}
				})
			}
		})
	}

	
})