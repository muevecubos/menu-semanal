export function getMonday(d) {
  let date = d == undefined ? new Date() : new Date(d);
  let day = date.getDay();
  let diff = date.getDate() - day + (day == 0 ? -6:1);
  return new Date(date.setDate(diff));
}

export function formatDate(d) {
  let current_datetime = d
  let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate()
  console.log(formatted_date)
  return formatted_date;

}