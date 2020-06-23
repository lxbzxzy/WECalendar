const app = getApp()
const db = wx.cloud.database()

function transferDay(num) {
  if (num == 1) return '一'; if (num == 2) return '二';
  if (num == 3) return '三'; if (num == 4) return '四';
  if (num == 5) return '五'; if (num == 6) return '六';
  if (num == 7) return '日';
}

Page({
  data: {
    //intro:'',

    direction:'me',
    mode:'add',
    weekArray: ['第1周','第2周','第3周','第4周','第5周','第6周','第7周','第8周','第9周','第10周','第11周','第12周','第13周','第14周','第15周','第16周','第17周','第18周','第19周','第20周'],
    weekIndex:0,//必须渲染一下这个要不渲染不出来
    //这里最后还需要加1
  
    dayArray: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    dayIndex: 0,//必须渲染一下这个要不渲染不出来
    //这个也是从0开始的，要有所区别
  
    timeArray: ['上午', '下午', '晚上'],
    timeIndex: 0,//必须渲染一下这个要不渲染不出来
    //这个也是从0开始的

    modeArray: ['作业', '活动', '考试','其他'],
    modeIndex: 0,//必须渲染一下这个要不渲染不出来
    modeContent: '作业',

    inputTitle:'标题',
    inputContent:'内容'
  },
  inputTitle: function (e) {this.setData({ inputTitle: e.detail.value })},
  inputContent: function (e) {this.setData({ inputContent: e.detail.value })},

  bindModeChange:function(e){
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(this.data.modeArray[e.detail.value])
    this.setData({
      modeIndex: parseInt(e.detail.value),
      modeContent: this.data.modeArray[e.detail.value]
    })
  },
  bindWeekChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(this.data.weekArray[e.detail.value])
    this.setData({
      weekIndex: parseInt(e.detail.value)
    })
  },
  bindDayChange: function (e) {
    console.log(this.data.dayArray[e.detail.value])
    this.setData({
      dayIndex: parseInt(e.detail.value)
    })
  },
  bindTimeChange: function (e) {
    console.log(this.data.timeArray[e.detail.value])
    this.setData({
      timeIndex: parseInt(e.detail.value)
    })
  },

  generateIntro:function(){
    var dayTrans=transferDay(app.globalData.day)
    var intro='今天是'+app.globalData.term+'第'+(app.globalData.week-app.globalData.timeZone)+'周星期'+dayTrans;
    this.setData({
      intro:intro
    })
  },

  onLoad:function(options){
    console.log(options);
    this.setData({
      mode:options.mode,
      direction:options.direction, 
    })
    if(options.mode!="modify"){
      this.setData({
        weekIndex:Math.min(app.globalData.week-app.globalData.timeZone-1,19),
        dayIndex:app.globalData.day-1
      })
    }
    else if(options.mode=="modify"){

    }
    this.generateIntro(options);
  },

  submit:function(){
    var that=this;
    var time = parseInt((this.data.weekIndex+app.globalData.timeZone+1) * 100 + (this.data.dayIndex+1) * 10 + this.data.timeIndex+1);
    console.log(time);
    //var towhom = this.data.direction == "all" ? '班级' : '个人';
    var chosenMode=this.data.modeContent
    //var chosen
    wx.showModal({
      title: '提示',
      content: '确认要添加活动吗？',
      success:function(re){
        if(re.confirm){
          if(that.data.direction=='me'){
            wx.cloud.callFunction({
              name:'addMyDDL',
              data:{
                time:time,
                mode:chosenMode,
                name:that.data.inputTitle,
                detail:that.data.inputContent,
              },
              success:function(res){
                console.log(res);
                wx.showModal({
                  title: '提示',
                  content: '添加成功',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/mainpage/mainpage',
                      })
                    }
                  }
                })
              }
            })
          }
          else{
            wx.cloud.callFunction({
              name:'addDDL',
              data:{
                time:time,
                mode:chosenMode,
                name:that.data.inputTitle,
                detail:that.data.inputContent,
                direction:that.data.direction,
              },
              success:function(res){
                console.log(res);
                wx.showModal({
                  title: '提示',
                  content: '添加成功',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/mainpage/mainpage',
                      })
                    }
                  }
                })
              }
            })
          }
        }
      }
    }) 
  },

})
