//这个云函数没有什么问题

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jk83basic-nx6u3',
})

const db=cloud.database()
const wxContext = cloud.getWXContext()
//const id = event.selectedID;
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection('ddl').add({
      data:{
        mode:event.mode,
        time:event.time,
        name:event.name,
        detail:event.detail,
        direction:event.direction
      }
    })
  }catch(e){
    console.error(e)
  }
}

  /*return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }*/