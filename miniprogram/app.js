//app.js
import setMytime from '/component/timeManage.js'

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'jk83basic-nx6u3',
        traceUser: true,
      })
    }
  },

  globalData: {
    timeZone:0,//与标准周次的偏差
    term:'',
    week: 1,
    day: 1,
    canAdmin:false,
    mode:0,//0single,1visitor,2allclasses
    userInfo: {},
    classInfo:{},
    
    loginInfo:[],//我的所有登录信息
    //myOpenid:''其实和openid相关的操作都在后端
  }

})
