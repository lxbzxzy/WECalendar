function transferDay(num) {
  if (num == 1) return '一'; if (num == 2) return '二';
  if (num == 3) return '三'; if (num == 4) return '四';
  if (num == 5) return '五'; if (num == 6) return '六';
  if (num == 7) return '日';
}

function transferTime(num){
  if (num == 1) return '上午';
  if (num == 2) return '下午';
  if (num == 3) return '晚上';
}

//将时间代码解析并转换为汉字
function transferCode(code){
  var numcode=parseInt(code);
  var result={
    week:parseInt(numcode/100),
    day:parseInt((numcode%100)/10),
    dayTrans:'',
    time:numcode%10,
    timeTrans:''
  };
  result.dayTrans=transferDay(result.day);
  result.timeTrans=transferTime(result.time);
  return result;
}

export default transferCode;
