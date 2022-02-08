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

function getFilteredAddressesByTimes(addressesObj, startTime, endTime) {
  if(!endTime) {
    endTime = new Date();

    //In case endTime is null, we filter with default 30 days ahead of startTime
    endTime.setDate(startTime.getDate() + 30)
  }

  // To include donations from the endTime's day
  const realEndTime = new Date();
  realEndTime.setDate(endTime.getDate() + 1);

  let filteredAddressesObj = addressesObj.map(addressObj => {
    let times = addressObj.times.filter(t =>
        startTime <= new Date(t.timestamp_start)
      && realEndTime >= new Date(t.timestamp_end));
    return {
      ...addressObj,
      times
    }
  })

  filteredAddressesObj = filteredAddressesObj.filter(addressesObj => addressesObj.times.length > 0);
  return filteredAddressesObj;
}

export { getDate,getDay,getHour, getFilteredAddressesByTimes }