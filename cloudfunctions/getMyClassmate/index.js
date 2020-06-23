//新版云函数进行了修改
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jk83basic-nx6u3',
  traceUser:true
})

const db=cloud.database()
//const id = event.selectedID;
// 云函数入口函数
const _=db.command;
exports.main = async (event, context) => {
  try{
    const wxContext = cloud.getWXContext()
    var openid=wxContext.OPENID;
    return await db.collection('classmate').where({
      class:event.class
    }).orderBy('name','asc').get()
  }catch(e){
    console.error(e)
  }
}