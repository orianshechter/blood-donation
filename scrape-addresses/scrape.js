function get_address_from_line(line) {
  var date = document.querySelector(
    `#panel1 > div > div > div.mainContent > section > div > table > tbody:nth-child(${line}) > tr > td:nth-child(1) > time > span`
  );
  var address = document.querySelector(
    `#panel1 > div > div > div.mainContent > section > div > table > tbody:nth-child(${line}) > tr > td.large`
  );
  var time_start = document.querySelector(
    `#panel1 > div > div > div.mainContent > section > div > table > tbody:nth-child(${line}) > tr > td:nth-child(3)`
  );
  var time_end = document.querySelector(
    `#panel1 > div > div > div.mainContent > section > div > table > tbody:nth-child(${line}) > tr > td:nth-child(4)`
  );
  if (!(date && address && time_start && time_end)) {
    return undefined;
  }
  let day = date.textContent.split(".")[0];
  let month = date.textContent.split(".")[1] - 1;
  let year = date.textContent.split(".")[2];
//   console.log({ day, month, year });
  let hour_start = time_start.textContent.split(":")[0];
  let minutes_start = time_start.textContent.split(":")[1];
  let hour_end = time_end.textContent.split(":")[0];
  let minutes_end = time_end.textContent.split(":")[1];

  let timestamp_start = new Date(year, month, day, hour_start, minutes_start);
  let timestamp_end = new Date(year, month, day, hour_end, minutes_end);

  const lineObj = {
    address: address.textContent.trim(),
    timestamp_start: timestamp_start,
    timestamp_end: timestamp_end,
  };
  return lineObj;
}

function date_to_day_selector(date) {
  let currentDayInTheMonth = date.getDate();
  let firstDayInCurrentMonth = new Date(date);
  firstDayInCurrentMonth.setDate(1);
  let firstLineAdd = 7; // first line is "א"-"ב"-...-"ש"

  let queryChild =
    currentDayInTheMonth + firstDayInCurrentMonth.getDay() + firstLineAdd;
  return document.querySelector(
    `#panel1 > div > div > div.mainContent > section > div >
               div > div.input-unit.calanderStyle > div > div:nth-child(2) > div > span:nth-child(${queryChild})`
  );
}

function organize_duplicate_addresses(data) {
  for (let i = 0; i < data.length; i++) {
    if (!data[i]) {
      continue;
    }
    data[i] = {
      address: data[i].address,
      times: [
        {
          timestamp_start: data[i].timestamp_start,
          timestamp_end: data[i].timestamp_end,
        },
      ],
    };
    for (let j = i + 1; j < data.length; j++) {
      if (data[j] && data[j].address === data[i].address) {
        data[i].times.push({
          timestamp_start: data[j].timestamp_start,
          timestamp_end: data[j].timestamp_end,
        });
        data[j] = undefined;
      }
    }
  }
  let new_data = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i]) {
      new_data.push(data[i]);
    }
  }
//   console.log(data);
  return new_data;
}

async function collect_data(daysToCollect) {
  let data = [];
  var dateBoxSelector = document.querySelector(
    "#panel1 > div > div > div.mainContent > section > div > div > div.input-unit.calanderStyle > div > div.input-group > span > span > i"
  );
  dateBoxSelector.click();
  await setTimeout(() => {}, 20);
  let currentDate = new Date();

//   console.log({ currentDate });
  while (daysToCollect > 0) {
    await setTimeout(() => {}, 1000);
    var daySelector = date_to_day_selector(currentDate);
    daySelector.click();
    await setTimeout(() => {}, 20);
    let currentLine = 3; // starts at 3. not 0 or 1, due to html's stuff
    let lineObj = get_address_from_line(currentLine);
    while (lineObj) {
      data.push({
        address: lineObj.address,
        timestamp_start: lineObj.timestamp_start,
        timestamp_end: lineObj.timestamp_end,
      });
      currentLine++;
      lineObj = get_address_from_line(currentLine);
    }
    //fetch next day
    currentDate.setDate(currentDate.getDate() + 1);

    // if next day is in new month
    if (currentDate.getDate() === 1) {
      let nextMonthSelector = document.querySelector(`#panel1 > div > div > div.mainContent > section > 
              div > div > div.input-unit.calanderStyle > div > div:nth-child(2) > header > span.prev`);
      nextMonthSelector.click();
      await setTimeout(() => {}, 20);
    }
    daysToCollect--;
  }
//   console.log(data);
  return data;
}

// https://stackoverflow.com/a/9458996
function arrayBufferToBase64(buffer) {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

async function write_data_to_github(addresses) {
//   console.log(addresses);
  var today = new Date(Date.now()).toLocaleString().split(",")[0];
  //TODO add your token and URL
  var url =
    "https://api.github.com/repos/orianshechter/blood-donation-addresses/contents/" +
    today +
    "/addresses.json";
  var token = undefined; //
  var dataToPush = new TextEncoder().encode(JSON.stringify(addresses, null, 3))
    .buffer;
  let data = {
    message: today + " update",
    content: arrayBufferToBase64(dataToPush),
  };
//   console.log(JSON.stringify(data));
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "token " + token,
    },
    body: JSON.stringify(data),
  });
  const content = await response.json();
//   console.log(content);

  if (response.status === 200) {
    return "updated";
  } else if (response.status === 201) {
    return "created";
  } else {
    throw new Error("Put file API returned " + response.status);
  }
}

async function add_geo_points(data) {
  var url =
    "https://orianshechter.github.io/blood-donation-addresses/addresses-geo-points/Locations.json";

  let addressesFromGitHub = undefined;
  let request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function () {
    if (this.status === 200) {
      try {
        // console.log(this.response)
        addressesFromGitHub = JSON.parse(this.response);
      } catch (e) {
        // console.log(e.message);
      }
    } else if (this.status === 400) {
      addressesFromGitHub = {};
    }
    // console.log({ addressesFromGitHub });
    // console.log(data);
    let adresses_not_in_github = [];
    for (let i = 0; i < data.length; i++) {
      let addressObj = addressesFromGitHub.content.find(
        (a) => a.address.unformatted === data[i].address
      );
    //   console.log(addressObj);
      if (addressObj) {
        data[i].address = addressObj.address;
      } else {
        adresses_not_in_github.push(data[i]);
      }
    }
    // console.log(data);
  };
  return request.send();
}

//currently not used, need to be used only to recieve addresses that are not in github.
// fetches the addresses from GoogleGeoLocation API.
// needs an API key.
async function fetchLitLngAllAddresses(data) {
  addressesWithLocations = [];
  for (let i = 0; i < data.length; i++) {
    let line = data[i];
    if (!line.address) {
      continue;
    }
    address = encodeURIComponent(line.address);
    GOOGLE_API_KEY = "my key"; // TODO insert google key
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=iw&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const googleAddressData = await response.json();

    if (googleAddressData.status === "OK") {
      let results = googleAddressData.results;
      line = {
        address: {
          unformatted: line.address,
          location: googleAddressData.results[0].geometry.location,
          formatted: googleAddressData.results[0].formatted_address,
          city: googleAddressData.results[0].address_components[1]?.long_name,
        },
      };
      addressesWithLocations.push(line);
    }
  }
  return addressesWithLocations;
}

async function main() {
  setTimeout(async () => {
    let daysToCollect = 15;
    let data = await collect_data(daysToCollect);
    data = await organize_duplicate_addresses(data);
    add_geo_points(data);

    //add_geo_points might take some time, so timeout is neccesary
    setTimeout(() => {
      write_data_to_github(data);
    }, 5000);
  }, 10000);
}
main();
