//returns hour in "hh:mm" format
function getHour(time) {
  let timeHour = new Date(time).getHours();
  let timeMinutes = new Date(time).getMinutes();
  if (timeMinutes === 0) {
    timeMinutes = "00";
  }
  return timeHour + ":" + timeMinutes;
}

//return day in hebrew
function getDay(time) {
  const daysInTheWeek = [
    "יום ראשון",
    "יום שני",
    "יום שלישי",
    "יום רביעי",
    "יום חמישי",
    "יום שישי",
    "יום שבת",
  ];
  const dayNumber = new Date(time).getDay();
  return daysInTheWeek[dayNumber];
}

//return date in "dd/mm/yyyy" format
function getDate(time) {
    return (new Date(time)).toLocaleString('he-il').split(',')[0].replaceAll('.','/')
}

export {getDate,getDay,getHour}