
function setTime(){
  var termBegin=new Date("2020/2/17");
    var thisTime={
      nowWeek:1,//根据班级日历的周次安排，可为负数
      nowDay:1//1-7分别代表周一到周日
    };
    var endTime = -termBegin.getTime() / 1000 + parseInt(new Date().getTime() / 1000);
    //周次为正数，代表学期开始之后
    if (endTime > 0) {
      var nowTime = parseInt(endTime / 86400);
      thisTime.nowWeek = parseInt(nowTime / 7) + 1;
      //console.log(nowWeek);
      thisTime.nowDay = nowTime % 7 + 1;
      //console.log(nowDay);
    }
    //周次为负数，代表学期开始之前
    else {
      var nowTime = parseInt(endTime / 86400);
      thisTime.nowWeek = parseInt(nowTime / 7);
      //console.log(nowWeek);
      thisTime.nowDay = 7 + nowTime % 7;
      //console.log(nowDay);
    }
    return thisTime;
}

export default setTime;
