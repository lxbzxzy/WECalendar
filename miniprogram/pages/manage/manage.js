const app = getApp()
const db = wx.cloud.database()

function formatDate(date) {  
	var y = date.getFullYear();  
	var m = date.getMonth() + 1;   
	var d = date.getDate(); 
	return y + '-' + m + '-' + d;  
};

Page({
  data:{
    classMate:[],

    state:0,
    classPic:'',
    className:'',
    inputName:'',
    canAdmin:false,

    std:true,
    inputTerm:'',
    //timeZone:0,

    date:'',

    loadingPic:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOmF1dG87YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LDApO2Rpc3BsYXk6YmxvY2s7IiB3aWR0aD0iMTc3cHgiIGhlaWdodD0iMTc3cHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+DQo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC44ODg4ODg4ODg4ODg4ODg4cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDQwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2Y0N2U2MCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC43Nzc3Nzc3Nzc3Nzc3Nzc4cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDgwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2Y4YjI2YSI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC42NjY2NjY2NjY2NjY2NjY2cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDEyMCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjciIHJ4PSIzIiByeT0iMy40OCIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNhYmJkODEiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuNTU1NTU1NTU1NTU1NTU1NnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgxNjAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI3IiByeD0iMyIgcnk9IjMuNDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjODQ5Yjg3Ij4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjQ0NDQ0NDQ0NDQ0NDQ0NDRzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMjAwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iIzY0OTJhYyI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC4zMzMzMzMzMzMzMzMzMzMzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDI0MCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjciIHJ4PSIzIiByeT0iMy40OCIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiM2MzdjYjUiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuMjIyMjIyMjIyMjIyMjIyMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgyODAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI3IiByeD0iMyIgcnk9IjMuNDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjNmE2M2I2Ij4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjExMTExMTExMTExMTExMTFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMzIwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPg0KPC9zdmc+'
  },

  timeZone:0,

  inputName:function(e){this.setData({ inputName: e.detail.value })},
  bindDateChange: function(e) {this.setData({date: e.detail.value})},
  inputTerm:function(e){this.setData({ inputTerm: e.detail.value })},
  checkboxChange:function(){
		if(this.data.canAdmin) this.setData({canAdmin:false})
		else this.setData({canAdmin:true})
  },
  checkboxChange2:function(){
		if(this.data.std) this.setData({std:false})
		else this.setData({std:true,inputTerm:app.globalData.classInfo.term})
	},

  onLoad:function(options){
    var nowDate=new Date()
		this.setData({date:formatDate(nowDate)})
    console.log(options)
    this.setData({
      classPic:options.classPic,
      className:app.globalData.classInfo.className,
      std:app.globalData.classInfo.std,
      inputTerm:app.globalData.classInfo.term,
      timeZone:app.globalData.classInfo.timeZone
    })
    this.getClassMate();
  },

  getClassMate:function(){
    var that=this;
    wx.cloud.callFunction({
      name:'getMyClassmate',
      data:{
        class:this.data.className
      },
      success:function(res){
        console.log(res);
        that.setData({state:1,classMate:res.result.data})
      }
    })
  },

  addActivity:function(){
    wx.navigateTo({
      url: '/pages/addDDL/addDDL?mode=add&direction='+this.data.className,
    })
  },
  
  modifyClassPic:function(){
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
            //that.setData({classPicSrc:res.fileID})
            wx.cloud.callFunction({
              name:'modifyClassPic',
              data:{
                classPic:res.fileID,
                className:that.data.className
              },
              success:function(){
                wx.showModal({
                  showCancel:false,
                  title:'提示',
                  content:'班徽上传成功',
                  success:function(ret){
                    if(ret.confirm){
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
  },

  addStudent:function(){
    var that=this;
    wx.showModal({
      title:'提示',
      content:'确定要添加这位学生吗？',
      success:function(res){
        if(res.confirm){
          if(that.data.inputName.length==0){
            wx.showModal({
              showCancel:false,
              title:'提示',
              content:'请输入姓名'
            })
            return;
          }
          for(let i in that.data.classMate){
            if(that.data.classMate[i].name==that.data.inputName){
              wx.showModal({
                showCancel:false,
                title:'提示',
                content:'这位同学已经登记过了'
              })
              return;
            }
          }
          wx.cloud.callFunction({
            name:'addStudent',
            data:{
              canAdmin:that.data.canAdmin,
              name:that.data.inputName,
              class:that.data.className,
            },
            success:function(){
              wx.showModal({
                showCancel:false,
                title:'提示',
                content:'添加学生成功',
                success:function(res){
                  if(res.confirm){
                    that.getClassMate();
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  updateCalendar:function(){
    var that=this;
    wx.showModal({
      title:'提示',
      content:'确定要修改班级周历吗？',
      success:function(res){
        if(res.confirm){
          if(!that.data.std){
            var timeZone=that.timeZone;
            var termBegin=new Date("2020/2/17");
            var endTime = -termBegin.getTime() / 1000 + parseInt(new Date(that.data.date).getTime() / 1000);
            var nowTime = parseInt(endTime / 86400);
            timeZone = parseInt(nowTime / 7) ;
            //nowWeek即是timeZone
            wx.showToast({
              title: '重置周历中',
              icon:'loading',
              duration:1000
            })
            wx.cloud.callFunction({
              name:'updateCalendar',
              data:{
                className:that.data.className,
                std:that.data.std,
                term:that.data.inputTerm,
                timeZone:timeZone
              },
              success:function(){
                wx.showModal({
                  showCancel:false,
                  title:'提示',
                  content:'修改成功，请在首页登录',
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
          else{
            db.collection('basicSet').get().then(res=>{
              //res.data[0].timeZone;
              wx.showToast({
                title: '重置周历中',
                icon:'loading',
                duration:1000
              })
              wx.cloud.callFunction({
                name:'updateCalendar',
                data:{
                  className:that.data.className,
                  std:true,
                  term:res.data[0].termName,
                  timeZone:res.data[0].timeZone
                },
                success:function(){
                  wx.showModal({
                    showCancel:false,
                    title:'提示',
                    content:'修改成功，请在首页登录',
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
            })
          }
        }
      }
    })
  },

  deleteStudent:function(e){
    var that=this;
    var num=e.currentTarget.dataset.index;
    wx.showModal({
      title:'提示',
      content:'确定要删除这位学生吗？',
      success:function(res){
        if(res.confirm){
          wx.cloud.callFunction({
            name:'deleteStudent',
            data:{
              name: that.data.classMate[num].name,
              class:that.data.className
            },
            success:function(){
              wx.showModal({
                showCancel:false,
                title:'提示',
                content:'删除学生成功',
                success:function(res){
                  if(res.confirm){
                    that.getClassMate();
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  setAdmin:function(e){
    var that=this;
    var num=e.currentTarget.dataset.index;
    wx.showModal({
      title:'提示',
      content:'确定要添加这位学生为管理员吗？',
      success:function(res){
        if(res.confirm){
          wx.cloud.callFunction({
            name:'setAdmin',
            data:{
              name: that.data.classMate[num].name,
              class:that.data.className
            },
            success:function(){
              wx.showModal({
                showCancel:false,
                title:'提示',
                content:'添加管理员成功',
                success:function(res){
                  if(res.confirm){
                    that.getClassMate();
                  }
                }
              })
            }
          })
        }
      }
    })
  }
})
