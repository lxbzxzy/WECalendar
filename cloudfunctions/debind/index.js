//新版云函数已进行修改
// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'jk83basic-nx6u3'
})
const db= cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('classmate').doc(event.id).update({
      data:{
        stuOpenId:''
      }
    })
  } catch (e) {
    console.error(e)
  }
}