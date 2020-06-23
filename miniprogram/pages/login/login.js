import setMytime from '../../component/timeManage.js'
const app = getApp()
const db = wx.cloud.database()

Page({
  onShareAppMessage: function () {
    return {
      title: 'WE班团登录页面',
      path: '/pages/login/login'
    }
  },

  onPullDownRefresh:function(){
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },

  data:{ 
    state:0,
    //state表示程序运行状态 
    //0表示查询信息中 
    //1表示只有一个结果正在直接登录中 
    //2表示没有查询到相关信息
    //3表示有多个查询结果
    //4正在登录中，请稍后

    //index:0,

    inputName:"",
    inputClass:"",

    loginInfo:[],

    logo:"https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UcfZ9hJW5TGICUfXYE5w4IsaylYXibsgc56nib5h0x79FtxulMb7icdUfD6yWksaJNIVaaWlEnMUaHQ/0?wx_fmt=png",
    
    loadingPic:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOmF1dG87YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LDApO2Rpc3BsYXk6YmxvY2s7IiB3aWR0aD0iMTc3cHgiIGhlaWdodD0iMTc3cHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+DQo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC44ODg4ODg4ODg4ODg4ODg4cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDQwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2Y0N2U2MCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC43Nzc3Nzc3Nzc3Nzc3Nzc4cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDgwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2Y4YjI2YSI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC42NjY2NjY2NjY2NjY2NjY2cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDEyMCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjciIHJ4PSIzIiByeT0iMy40OCIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiNhYmJkODEiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuNTU1NTU1NTU1NTU1NTU1NnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgxNjAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI3IiByeD0iMyIgcnk9IjMuNDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjODQ5Yjg3Ij4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjQ0NDQ0NDQ0NDQ0NDQ0NDRzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMjAwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iIzY0OTJhYyI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC4zMzMzMzMzMzMzMzMzMzMzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDI0MCA1MCA1MCkiPg0KICA8cmVjdCB4PSI0NyIgeT0iMjciIHJ4PSIzIiByeT0iMy40OCIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiM2MzdjYjUiPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuMjIyMjIyMjIyMjIyMjIyMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+DQogIDwvcmVjdD4NCjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgyODAgNTAgNTApIj4NCiAgPHJlY3QgeD0iNDciIHk9IjI3IiByeD0iMyIgcnk9IjMuNDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjNmE2M2I2Ij4NCiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjExMTExMTExMTExMTExMTFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPg0KICA8L3JlY3Q+DQo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMzIwIDUwIDUwKSI+DQogIDxyZWN0IHg9IjQ3IiB5PSIyNyIgcng9IjMiIHJ5PSIzLjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZlNzE4ZCI+DQogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4NCiAgPC9yZWN0Pg0KPC9nPg0KPC9zdmc+",
    //end
  },

  inputClass:function(e){this.setData({inputClass: e.detail.value})},
  inputName:function(e){this.setData({inputName: e.detail.value})},

  //设置时区，这样之后的程序都基于这个时区，然后直接跳转页面
  //这样设置的班级全为single班级
  setWeek:function(){
    db.collection('class').where({
      className:app.globalData.userInfo.class
    }).get().then(res=>{
      //console.log(res.data)
      var thistime=setMytime();
      //console.log(thistime);
      getApp().globalData.timeZone = res.data[0].timeZone;
      getApp().globalData.term = res.data[0].term;
      getApp().globalData.week = thistime.nowWeek;
      getApp().globalData.day = thistime.nowDay;
      getApp().globalData.classInfo=res.data[0];
      getApp().globalData.mode=0;
      getApp().globalData.canAdmin=app.globalData.userInfo.canAdmin;
      //console.log(getApp().globalData.canAdmin);
      wx.redirectTo({
        url: '/pages/mainpage/mainpage',
      })
    })
  },
  
  //先确认微信登录
  onLoad:function(e){
    if(JSON.stringify(e) == "{}"){
      //console.log(111);
      this.searchInfo();
    }
    else if(e.mode=="relogin")
      this.setData({ state:2 })
    else
      this.searchInfo();
  },

  //查询登录信息并且根据情况调整程序内容
  searchInfo:function(){
    var that=this;
    wx.cloud.callFunction({
      name: 'directLogin',
      success: function (res) {
        console.log(res.result.data);
        if (res.result.data.length == 0) {
          that.setData({ state:2 })
          return;
        }
        else if(res.result.data.length > 1){
          that.setData({
            state: 3,
            loginInfo:res.result.data
          })
          app.globalData.loginInfo=res.result.data;
          return;
        }
        else{
          that.setData({state:1,loginInfo:res.result.data})
        }
        app.globalData.loginInfo=res.result.data;
        app.globalData.userInfo = res.result.data[0];
        that.setData({state:1})//开始直接登录
        that.setWeek();//设置好后就直接登录了
      }
    })
  },

  login:function(){
    wx.showToast({
      title: '登录中',
      icon: 'loading',
      duration: 400
    })
    var that = this;
    if(app.globalData.loginInfo.length>5){
      wx.showModal({
        title: '提示',
        content: '为保证用户体验，同一用户最多只能加入6个班级，请合理安排',
        showCancel:false,
      })
      return;
    }
    for(let i in app.globalData.loginInfo){
      if(this.data.inputClass==app.globalData.loginInfo[i].class){
        wx.showModal({
          title: '提示',
          content: '你已在这个班级进行过登记，请重新输入',
          showCancel:false,
        })
        return;
      }
    }
    wx.cloud.callFunction({
      name:'register',
      data:{
        name:that.data.inputName,
        class:that.data.inputClass
      },
      success:function(res){
        console.log(res.result.stats.updated);
        if (res.result.stats.updated==0){
          wx.showModal({
            title: '提示',
            content: '你似乎还不在这个团体中，请联系管理员将你拉入',
            showCancel:false
          })
        }
        //else if(that.data.loginInfo.length==0){
        //  console.log(res.result)
        //  that.searchInfo();
        //}
        else{
          db.collection('classmate').where({
            name:that.data.inputName,
            class:that.data.inputClass
          }).get().then(res=>{
            app.globalData.userInfo=res.data[0];
            that.setWeek();
          })
        }
        
      }
    })
  },

  visitorLogin:function(mode){
    var userInfo={
      _id: "", name: "用户", canAdmin: false, class: "游客模式"
    }
    this.setData({state:0})
    db.collection('basicSet').get().then(res=>{
      //console.log(res.data)
      var thistime=setMytime();
      //console.log(thistime);
      if(mode=='all'){
        userInfo.class="全班级模式"
      }
      getApp().globalData.timeZone = res.data[0].timeZone;
      getApp().globalData.week = thistime.nowWeek-res.data[0].timeZone;
      getApp().globalData.day = thistime.nowDay;
      getApp().globalData.term = res.data[0].termName;
      getApp().globalData.userInfo=userInfo;
      getApp().globalData.classInfo.classPic="https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UcfZ9hJW5TGICUfXYE5w4IsaylYXibsgc56nib5h0x79FtxulMb7icdUfD6yWksaJNIVaaWlEnMUaHQ/0?wx_fmt=png";
      if(mode=='all'){
        getApp().globalData.mode=2;
        getApp().globalData.canAdmin=false;
        wx.redirectTo({
          url: '/pages/mainpage/mainpage',
        })
      }
      else{
        getApp().globalData.mode=1;
        getApp().globalData.canAdmin=false;
        wx.redirectTo({
          url: '/pages/mainpage/mainpage',
        })
      }
    })
  },

  allLogin:function(){
    this.visitorLogin('all');
  },

  chooseClass1:function(){app.globalData.userInfo=this.data.loginInfo[0];this.setWeek();},
  chooseClass2:function(){app.globalData.userInfo=this.data.loginInfo[1];this.setWeek();},
  chooseClass3:function(){app.globalData.userInfo=this.data.loginInfo[2];this.setWeek();},
  chooseClass4:function(){app.globalData.userInfo=this.data.loginInfo[3];this.setWeek();},
  chooseClass5:function(){app.globalData.userInfo=this.data.loginInfo[4];this.setWeek();},
  chooseClass6:function(){app.globalData.userInfo=this.data.loginInfo[5];this.setWeek();},

  //跳转到详细信息页面
  checkInfo:function(){
    wx.navigateTo({
      url: '/pages/introduction/introduction',
    })
  },

  //创建一个新的班级
  createClass:function(){
    wx.navigateTo({
      url: '/pages/createClass/createClass',
    })
  },
  
  chooseState2:function(){this.setData({state:2})},
  chooseState3:function(){
    wx.reLaunch({
      url: '/pages/login/login',
    })
  }

})
