function parseDate(date) {
  let year = date.getFullYear();
  let dateArr = [
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  for (let i = 0; i < dateArr.length; i++) {
    if (dateArr[i] >= 1 && dateArr[i] <= 9) {
      dateArr[i] = '0' + dateArr[i];
    }
  }
  let strDate =
    year +
    '-' +
    dateArr[0] +
    '-' +
    dateArr[1] +
    ' ' +
    dateArr[2] +
    ':' +
    dateArr[3] +
    ':' +
    dateArr[4];
  return strDate;
}

module.exports = parseDate
