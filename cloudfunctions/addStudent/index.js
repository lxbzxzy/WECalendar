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
  const wxContext = cloud.getWXContext()
	var openid=wxContext.OPENID;
  try{
    return await db.collection('classmate').add({
      data:{
        canAdmin:event.canAdmin,
        name:event.name,
        class:event.class,
        stuOpenId:''
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