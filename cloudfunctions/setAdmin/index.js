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
    return await db.collection('classmate').where({
      name: event.name,
      class:event.class
    }).update({
			data:{
				canAdmin:true
      }
		})
  }catch(e){
    console.error(e);
  }
}