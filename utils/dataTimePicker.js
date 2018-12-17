var AllDate = [];

function getDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tMonth + "月" + tDate + "日";
}
function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}

function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}
function isNull(object) {
  if (object == null || typeof object == "undefined") {
    return true;
  }
  return false;
};
function getWeek(dateString) {
  var date;
  if (isNull(dateString)) {
    date = new Date();
  } else {
    var dateArray = dateString.split("-");
    date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
  }
  return "星期" + "日一二三四五六".charAt(date.getDay());
};

function getMonthDay(year, month, day, weekday) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确'
  }
  array = array.slice(day - 1);
  var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  for (var i = 0; i < array.length; i++) {
    array[i] = month + '月' + array[i] + '日' + ' ' + getWeek(year + '-' + month + '-' + array[i])
  }
  AllDate = AllDate.concat(array);
}
function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds()),
    weekday = newDate.getDay();

  return [year, mont, date, hour, minu, seco, weekday];
}
function dateTimePicker(startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [], dateTimeArray = [[], [], []];
  var start = startYear || 1978;
  var end = endYear || 2100;
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();

  for (var i = 1; i <= 12; i++) {
    var year = 2018;
    var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
    switch (i) {
      case 1:
        getMonthDay('2018', '01', '01', '1');
        break;
      case 3:
        getMonthDay('2018', '03', '01', '4');
        break;
      case 5:
        getMonthDay('2018', '05', '01', '2');
        break;
      case 7:
        getMonthDay('2018', '07', '01', '7');
        break;
      case 8:
        getMonthDay('2018', '08', '01', '3');
        break;
      case 10:
        getMonthDay('2018', '10', '01', '1');
        break;
      case 12:
        getMonthDay('2018', '12', '01', '6');
        break;
      case 4:
        getMonthDay('2018', '04', '01', '7');
        break;
      case 6:
        getMonthDay('2018', '06', '01', '5');
        break;
      case 9:
        getMonthDay('2018', '09', '01', '6');
        break;
      case 11:
        getMonthDay('2018', '11', '01', '4');
        break;
      case 2:
        getMonthDay('2018', '02', '01', '4');
        break;
      default:
        array = '月份格式不正确'
    }
  }

  var _tempDate = defaultDate[1] + '月' + defaultDate[2] + '日' + ' ' + getWeek(defaultDate[0] + '-' + defaultDate[1] + '-' + defaultDate[2]);
  var _tempDateNum = AllDate.indexOf(_tempDate);
  AllDate = AllDate.slice(_tempDateNum);
  dateTime.push(AllDate.indexOf(_tempDate));
  AllDate[0] = '今天';
  AllDate[1] = '明天';
  AllDate[2] = '后天';

  dateTimeArray[0] = AllDate;
  dateTimeArray[1] = getLoopArray(0, 23);
  dateTimeArray[2] = getLoopArray(0, 59);

  dateTime.push(dateTimeArray[1].indexOf(defaultDate[3]));
  dateTime.push(dateTimeArray[2].indexOf(defaultDate[4]));

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  getDay: getDay,
  getNewDateArry: getNewDateArry
}