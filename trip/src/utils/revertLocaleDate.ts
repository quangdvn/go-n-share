/* eslint-disable prefer-const */
export function revertLocaleDate(date: string) {
  if (date.includes('/')) {
    let [month, day, year] = date.split('/');
    if (parseInt(month) < 10) {
      month = '0' + month;
    }
    if (parseInt(day) < 10) {
      day = '0' + day;
    }
    return `${year}/${month}/${day}`;
  } else if (date.includes('-')) {
    let [day, month, year] = date.split('-');
    if (parseInt(month) < 10) {
      month = '0' + month;
    }
    if (parseInt(day) < 10) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  }
}
