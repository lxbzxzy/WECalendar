//新来的云函数 搜索ddl王中王
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jk83basic-nx6u3',
  traceUser:true
})

const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
  var openid=wxContext.OPENID;
	const tasks = [];
  for (let i = 0; i < event.classes.length; i++) {
    var promise = db.collection('ddl').where({
			direction:event.classes[i]
		}).get()
    tasks.push(promise)
	}
	var promise = db.collection('ddl').where({
		direction:openid
	}).get()
	tasks.push(promise)
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
		}
	})
}