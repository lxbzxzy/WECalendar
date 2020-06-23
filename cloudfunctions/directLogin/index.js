//这个函数和旧版保持一致
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
      stuOpenId: openid
    }).get()
  } catch (e) {
    console.error(e)
  }
}