//获取与DDL列表版相关的信息
import transferCode from './transferCode.js';

function dealWithDDLSheet(ddlInfo,nowWeek,nowDay){
  var dealtData = [];
  for (let i in ddlInfo) {
    var dealingItem = {
      _id:'',
      week:1,
      day:1,
      time:1,
      timeCode:'',
      //0已过期、1今日ddl、2七日内ddl、3七日以上ddl
      pastTimeCode:0,
      //1作业2活动3考试4其他
      modeCode:1,
      name:ddlInfo[i].name,
      detail:ddlInfo[i].detail,
      //0班级1个人
      directionCode:0,
      classDetail:''
    }
    dealingItem._id=ddlInfo[i]._id;
    var transTime=transferCode(parseInt(ddlInfo[i].time));
    //console.log(transTime)
    dealingItem.timeCode='星期'+transTime.dayTrans+transTime.timeTrans;
    switch(ddlInfo[i].mode){
      case "作业": dealingItem.modeCode=1;break;
      case "活动": dealingItem.modeCode=2;break;
      case "考试": dealingItem.modeCode=3;break;
      case "其他": dealingItem.modeCode=4;break;
      default: dealingItem.modeCode=4;break;
    }
    if(ddlInfo[i].direction.length>10) dealingItem.directionCode=1;
    else {dealingItem.directionCode=0;dealingItem.classDetail=ddlInfo[i].direction;}
    dealingItem.week=transTime.week;
    dealingItem.day=transTime.day;
    dealingItem.time=transTime.time;
    if(nowWeek>dealingItem.week||
      (nowWeek==dealingItem.week&&nowDay>dealingItem.day)){
      dealingItem.pastTimeCode=0;
    }
    else if(nowWeek==dealingItem.week&&nowDay==dealingItem.day){
      dealingItem.pastTimeCode=1;
    }
    else if(nowWeek==dealingItem.week||
      (nowWeek==(dealingItem.week-1)&&nowDay>=dealingItem.day)){
      dealingItem.pastTimeCode=2;
    }
    else  {dealingItem.pastTimeCode=3;}
    dealtData.push(dealingItem);
  }
  return dealtData;
}

export default dealWithDDLSheet;
