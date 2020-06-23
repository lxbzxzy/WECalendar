//本云函数已相对原版进行修改
// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'jk83basic-nx6u3'
})
const db= cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid=wxContext.OPENID;
  try {
    return await db.collection('classmate').where({
      class:event.class,
      name:event.name
    }).update({
      data:{
        stuOpenId:openid
      }
    })
  } catch (e) {
    console.error(e)
  }
}