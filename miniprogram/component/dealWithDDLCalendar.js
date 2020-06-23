//获取与DDL日历版相关的信息
import weekday2monthdate from './weekday2monthdate.js';

//这里所有日期都是按照绝对日期进行排序的
function dealWithDDLCalendar(ddlSheet,nowWeek,nowDay){
  //一共是4*7天，分别是上周，本周，下周和下下周
  //周次用绝对周次表示
  var dealtWeek = [];
  var i,j;
  for(j=0;j<4;j++){
    var singleWeek=[];
    for(i=0;i<7;i++){
      var singleDay={
        week:1, day:1,
        month:'Jan.', date:1,
        pastTimeCode:0,//0表示这一天已经过去，1表示这一天正在进行，2表示这一天未到
        activityCode:0,//0表示什么都没有，1表示个人活动，2表示只有班级活动，3表示都有
      }
      singleWeek.push(singleDay);
    }
    dealtWeek.push(singleWeek);
  }
  for (let k in ddlSheet) {
    if(ddlSheet[k].week>=nowWeek-1&&ddlSheet[k].week<=nowWeek+2){
      var relaWeek=ddlSheet[k].week-nowWeek+1;
      var relaDay=ddlSheet[k].day-1;
      if(ddlSheet[k].directionCode==1){
        if(dealtWeek[relaWeek][relaDay].activityCode==0) dealtWeek[relaWeek][relaDay].activityCode=1;
        else if(dealtWeek[relaWeek][relaDay].activityCode==2) dealtWeek[relaWeek][relaDay].activityCode=3;
      }
      else{
        if(dealtWeek[relaWeek][relaDay].activityCode==0) dealtWeek[relaWeek][relaDay].activityCode=2;
        else if(dealtWeek[relaWeek][relaDay].activityCode==1) dealtWeek[relaWeek][relaDay].activityCode=3;
      }
    }
  }
  //设置week和day
  for(i=0;i<4;i++){
    for(j=0;j<7;j++){
      dealtWeek[i][j].week=nowWeek-1+i;
      dealtWeek[i][j].day=j+1;
    }
  }
  var wd2md;
  for(i=0;i<4;i++){
    for(j=0;j<7;j++){
      wd2md=weekday2monthdate(dealtWeek[i][j].week,dealtWeek[i][j].day)
      dealtWeek[i][j].month=wd2md.monthEn;
      dealtWeek[i][j].date=wd2md.date;
    }
  }
  for(i=2;i<4;i++){
    for(j=0;j<7;j++){
      dealtWeek[i][j].pastTimeCode=2;
    }
  }
  for(j=0;j<7;j++){
    if(j+1==nowDay) dealtWeek[1][j].pastTimeCode=1;
    else if(j+1>nowDay) dealtWeek[1][j].pastTimeCode=2;
  }
  
  return dealtWeek;
}

export default dealWithDDLCalendar;
