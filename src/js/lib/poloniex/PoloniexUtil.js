import leftPad from './../util/LeftPad'

/**
 * Format a Poloniex API event timestamp
 * @param {Number} timestamp  - The timestamp in seconds from epoch
 * @returns {String} The formatted date
 */
export function timestampToDate(timestamp) {
  let rDate = new Date(parseInt(timestamp) * 1000);
  let date = rDate.getUTCFullYear() + "-" + leftPad(rDate.getUTCMonth() + 1, 2) + "-" + leftPad(rDate.getUTCDate(), 2);
  let time = leftPad(rDate.getUTCHours(), 2) + ":" + leftPad(rDate.getMinutes(), 2) + ":" + leftPad(rDate.getSeconds(), 2);
  return date + " " + time;
}