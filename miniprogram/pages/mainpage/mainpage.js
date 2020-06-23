const app = getApp();
const db = wx.cloud.database();
import dealWithDDLSheet from '../../component/dealWithDDLSheet.js'
import dealWithDDLCalendar from '../../component/dealWithDDLCalendar.js'
import weekday2monthdate from '../../component/weekday2monthdate.js'

function transferDay(num) {
  if (num == 1) return '一'; if (num == 2) return '二';
  if (num == 3) return '三'; if (num == 4) return '四';
  if (num == 5) return '五'; if (num == 6) return '六';
  if (num == 7) return '日';
}

function sortDate(a,b){
	if(a.week!=b.week) return a.week-b.week;
	else if(a.day!=b.day) return a.day-b.day;
	else return a.time-b.time;
}

Page({
	data:{ 
		globalData:{},
		state:0,
		//0表示正在加载中
		//1表示日历与表单已经处理完毕
		//2表示班级图片也加载好了

		mode:0,//0表示单班级模式，1表示全班级模式

		dayTrans:'',

		dealtSheet:[],
		dealtCalendar:[[]],

		colorSet:['rgba(0,0,0,0)','rgba(204,236,255,0.7)','rgba(255,204,204,0.7)','rgba(204,204,255,0.7)'],
		colorSet2:['grey','#ba55d3','black'],
		colorSet3:['rgba(0,0,0,0)','rgba(204,236,255,0.3)','rgba(255,204,204,0.3)','rgba(204,204,255,0.3)'],
		colorSet4:['#dd6633','#7733dd'],//各种模式的颜色不同
		modeSet:['作业','活动','考试','其他'],
		//directionSet:['班级','个人'],
		colorSet5:['grey','red','orange','balck'],
		pastTimeSet:['已过期','少于1天','7天以内','多于7天'],

		selectedDay:-1,
		selectedWeek:-1,

		//图片信息
		classPic:'',
		loadingPic:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOmF1dG87YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LDApO2Rpc3BsYXk6YmxvY2s7IiB3aWR0aD0iMTc3cHgiIGhlaWdodD0iMTc3cHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+DQo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC44ODg4ODg4ODg4ODg4ODg4cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDQwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2Y0N2U2MCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC43Nzc3Nzc3Nzc3Nzc3Nzc4cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDgwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2Y4YjI2YSI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC42NjY2NjY2NjY2NjY2NjY2cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDEyMCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjciIHJ4PSIzIiByeT0iMy40OCIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNhYmJkODEiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuNTU1NTU1NTU1NTU1NTU1NnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgxNjAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI3IiByeD0iMyIgcnk9IjMuNDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjODQ5Yjg3Ij4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjQ0NDQ0NDQ0NDQ0NDQ0NDRzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMjAwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iIzY0OTJhYyI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC4zMzMzMzMzMzMzMzMzMzMzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDI0MCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjciIHJ4PSIzIiByeT0iMy40OCIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiM2MzdjYjUiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuMjIyMjIyMjIyMjIyMjIyMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgyODAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI3IiByeD0iMyIgcnk9IjMuNDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjNmE2M2I2Ij4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjExMTExMTExMTExMTExMTFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMzIwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPg0KPC9zdmc+"
	},

	onShareAppMessage:function(){
		return {
      title: 'WE班团活动信息',
      path: '/pages/login/login'
    }
	},

	ddlInfo:[],

	onLoad:function(){
		this.setData({globalData:app.globalData});
		this.setData({dayTrans:transferDay(this.data.globalData.day)})
		var that=this;
		if(app.globalData.mode==2){
			//console.log('allclasses')
			this.setData({mode:1,classPic:'https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UcfZ9hJW5TGICUfXYE5w4IsaylYXibsgc56nib5h0x79FtxulMb7icdUfD6yWksaJNIVaaWlEnMUaHQ/0?wx_fmt=png'})
			var inputData=[];
			for(let i in app.globalData.loginInfo){
				inputData.push(app.globalData.loginInfo[i].class)
			}
			//console.log(inputData);
			wx.cloud.callFunction({
				name:'allDDLall',
				data:{
					classes:inputData,
				},
				success:function(res){
					//console.log(res);
					that.ddlInfo=res.result.data;
					that.dealWithDDL();
				}
			})
		}
		else{
			if(app.globalData.mode==1){this.setData({mode:1})}
			//console.log(that.data.globalData.userInfo.class)
			wx.cloud.callFunction({
				name:'allDDL',
				data:{
					class:that.data.globalData.userInfo.class,
				},
				success:function(res){
					console.log(res.result.data);
					that.ddlInfo=res.result.data;
					that.dealWithDDL();
				}
			})
		}
	},

	dealWithDDL:function(){
		var dealtData=dealWithDDLSheet(this.ddlInfo,this.data.globalData.week,this.data.globalData.day);
		dealtData.sort(sortDate)
		console.log(dealtData);
		var dealtCalendar=dealWithDDLCalendar(dealtData,this.data.globalData.week,this.data.globalData.day);
		console.log(dealtCalendar);
		this.setData({
			dealtSheet:dealtData,
			dealtCalendar:dealtCalendar,
			state:1
		})
		this.downloadClassPic();
	},

	downloadClassPic:function(){
		var classPicPos=this.data.globalData.classInfo.classPic;
		if(classPicPos==null||this.data.mode!=0){
			this.setData({classPic:'https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UcfZ9hJW5TGICUfXYE5w4IsaylYXibsgc56nib5h0x79FtxulMb7icdUfD6yWksaJNIVaaWlEnMUaHQ/0?wx_fmt=png',state:2})
			return;
		} 
		console.log(classPicPos)
		wx.cloud.downloadFile({
			fileID: classPicPos,
			success:res=>{
				console.log(res.tempFilePath)
				this.setData({classPic:res.tempFilePath,
					state:2
				})
			},
			fail:res=>{
				this.setData({classPic:'https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UcfZ9hJW5TGICUfXYE5w4IsaylYXibsgc56nib5h0x79FtxulMb7icdUfD6yWksaJNIVaaWlEnMUaHQ/0?wx_fmt=png',state:2})
			}
		})
	},

	changeDayShown:function(e){
		//console.log(e.currentTarget.dataset.index)
		this.setData({selectedDay:parseInt(e.currentTarget.dataset.index)+1})
	},
	changeWeekShown:function(e){
		//console.log(e.currentTarget.dataset.index)
		this.setData({selectedWeek:parseInt(e.currentTarget.dataset.index)+this.data.globalData.week-1})
	},

	//组件部分
	relogin:function(){
		wx.redirectTo({
			url: '/pages/login/login?mode=relogin',
		})
	},

	debind:function(){
		var that=this;
		//console.log(that.data.globalData.userInfo._id)
		wx.cloud.callFunction({
			name:"debind",
			data: {
				id: that.data.globalData.userInfo._id
			},
			success:function(){
				wx.showModal({
					title: '提示',
					content: '解除绑定成功',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							wx.redirectTo({
								url: '/pages/login/login'
							})
						}
					}
				})
			}
		})
	},

	addMyCalendar:function(){
		wx.navigateTo({
			url: '/pages/addDDL/addDDL?direction=me&mode=add',
		})
	},

	manageClass:function(){
		wx.navigateTo({
			url: '/pages/manage/manage?classPic='+this.data.classPic,
		})
	},

	generatePoster:function(e){
		var num=e.currentTarget.dataset.index;
		var transferWord1;
		var item=this.data.dealtSheet[num];
		if(item.directionCode==0) transferWord1=item.classDetail+this.data.modeSet[item.modeCode-1];
		else transferWord1='个人'+this.data.modeSet[item.modeCode-1];
		var transferedTime=weekday2monthdate(this.data.dealtSheet[num].week,this.data.dealtSheet[num].day)
		var transferWord2='学期：'+this.data.globalData.term
		var transferWord3='时间：第'+(this.data.dealtSheet[num].week-this.data.globalData.timeZone)+'周'+this.data.dealtSheet[num].timeCode
		var transferWord4='日期：'+transferedTime.month+"月"+transferedTime.date+'日';
		var transferWord5='',transferWord6='',transferWord7='';
		if(item.detail.length>19){
			transferWord7=item.detail.substring(19,item.detail.length)
			transferWord6=item.detail.substring(8,19)
			transferWord5='内容：'+item.detail.substring(0,8)
		}
		else if(item.detail.length>8){
			transferWord6=item.detail.substring(8,item.detail.length)
			transferWord5='内容：'+item.detail.substring(0,8)
		}
		else transferWord5='内容：'+item.detail.substring(0,item.detail.length)
		wx.navigateTo({
			url: '/pages/poster/poster?parta='+transferWord1+'&partb='+'标题：'+this.data.dealtSheet[num].name+'&partc='+transferWord2+'&partd='+transferWord3+'&parte='+transferWord4+'&partf='+transferWord5+'&partg='+transferWord6+'&parth='+transferWord7,
		})
	},

	deleteActivity:function(e){
		var num=e.currentTarget.dataset.index;
		var that=this;
		wx.showModal({
			title:'提示',
			content:'确定要删除这一项活动吗',
			success:function(res){
				if(res.confirm){
					wx.cloud.callFunction({
						name:'deleteDDL',
						data:{_id:that.data.dealtSheet[num]._id},
						success:function(){
							wx.showModal({
								title:'提示',
								content:'删除活动成功',
								showCancel:false,
								success:function(){
								that.setData({state:0})
								that.onLoad();}
							})
						}
					})
				}
			}
		})
	},

	returnBack:function(){
		this.setData({selectedWeek:-1,selectedDay:-1})
	},

	checkboxChange:function(){
		if(this.data.selectedWeek==-1){
			this.setData({
				selectedWeek:this.data.globalData.week,
				selectedDay:this.data.globalData.day
			})
		}
		else this.setData({selectedWeek:-1,selectedDay:-1})
	}

	
})