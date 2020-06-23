function transferMonth(num){
  if (num==1) return 'Jan.';else if (num==2) return 'Feb.';
  else if (num == 3) return 'Mar.'; else if (num == 4) return 'Apr.';
  else if (num == 5) return 'May.'; else if (num == 6) return 'Jun.';
  else if (num == 7) return 'Jul.'; else if (num == 8) return 'Aug.';
  else if (num == 9) return 'Sept.'; else if (num == 10) return 'Oct.';
  else if (num == 11) return 'Nov.'; else if (num == 12) return 'Dec.';
}

function transferMonthChinese(num){
  if (num==1) return '一';else if (num==2) return '二';
  else if (num == 3) return '三'; else if (num == 4) return '四';
  else if (num == 5) return '五'; else if (num == 6) return '六';
  else if (num == 7) return '七'; else if (num == 8) return '八';
  else if (num == 9) return '九'; else if (num == 10) return '十';
  else if (num == 11) return '十一'; else if (num == 12) return '十二';
}


function weekday2monthdate(week,day){
  let oldDate=new Date('2020/2/17').valueOf();
  let newDate=oldDate+(7*week+day-8)*24*3600*1000;
  var nDate=new Date(newDate);
  var result={
    month:nDate.getMonth()+1,
    monthCh:'',monthEn:'',
    date:nDate.getDate()
  }
  result.monthCh=transferMonthChinese(result.month);
  result.monthEn=transferMonth(result.month);
  return result;
}

export default weekday2monthdate;
