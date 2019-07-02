module.exports = function (date, format) {
  date = date || '';
  date = parseInt(date);
  format = format || 'yyyy-MM-dd hh:mm:ss';
  if (!date) return '';
  // console.log(date)
  try {
    date = new Date(date);
  } catch (e) {
    return '';
  }
  var arr = '日一二三四五六'.split('');
  var map = {
    M: date.getMonth() + 1, // 月份
    d: date.getDate(), // 日
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
    z: arr[date.getDay()]
  };
  format = format.replace(/([yMdhmsqSz])+/g, function (all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });
  return format;
};
