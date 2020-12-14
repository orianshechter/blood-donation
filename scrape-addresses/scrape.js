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
  let day = date.innerText.split(".")[0];
  let month = date.innerText.split(".")[1] - 1;
  let year = date.innerText.split(".")[2];
  //   console.log({ day, month, year });
  let hour_start = time_start.innerText.split(":")[0];
  let minutes_start = time_start.innerText.split(":")[1];
  let hour_end = time_end.innerText.split(":")[0];
  let minutes_end = time_end.innerText.split(":")[1];

  let timestamp_start = new Date(year, month, day, hour_start, minutes_start);
  let timestamp_end = new Date(year, month, day, hour_end, minutes_end);

  let cityOptions = document.querySelector("#address")._vOptions;
  //     console.log({cityOptions})
  let addressCity = undefined;
  cityOptions.forEach((city) => {
    cityInAdrdress = address.innerText.trim().indexOf(city) !== -1;
    if (cityInAdrdress) {
      addressCity = city;
    }
  });
  if (!addressCity || addressCity === "") {
    addressCity = address.innerText.trim();
    //   console.log(address.innerText.trim())
  }
  //   console.log(address.innerText.trim()+ " and:")
  //   console.log({addressCity})

  const lineObj = {
    address: address.innerText.trim(),
    city: addressCity,
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
      city: data[i].city,
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
  //   console.log(data)
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
  let nextDate = undefined;

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
        city: lineObj.city,
        timestamp_start: lineObj.timestamp_start,
        timestamp_end: lineObj.timestamp_end,
      });
      currentLine++;
      lineObj = get_address_from_line(currentLine);
    }
    //fetch next day
    currentDate.setDate(currentDate.getDate() + 1);

    // if next day in new month
    if (currentDate.getDate() === 1) {
      let nextMonthSelector = document.querySelector(`#panel1 > div > div > div.mainContent > section > 
            div > div > div.input-unit.calanderStyle > div > div:nth-child(2) > header > span.prev`);
      nextMonthSelector.click();
      await setTimeout(() => {}, 20);
    }
    daysToCollect--;
  }
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
async function get_git_file_sha(token, filename) {
  const url =
    "https://api.github.com/repos/orianshechter/blood-donation-addresses/git/trees/main:" +
    "?t=" +
    Date.now();

  const response = await fetch(url, {
    headers: {
      // Rate limiting: Authenticated requests get a higher rate limit.
      // https://developer.github.com/v3/#rate-limiting
      Authorization: "token " + token,
    },
  });
  if (response.status === 200) {
    const data = await response.json();
    const item = data.tree.find(function (item) {
      return item.path === filename;
    });
    return item ? item.sha : null;
  } else if (response.status === 404) {
    // No such folder.
    // console.log({response})
    return null;
  } else {
    throw new Error("Get tree API returned " + response.status);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// fetches the addresses from Google geo location API. needs an API key.
async function fetchGeoLocations(data) {
  addressesWithLocations = [];
  for (let i = 0; i < data.length; i++) {
    if (!data[i].address) {
      continue;
    }
    address = encodeURIComponent(data[i].address);
    //TODO insert api key
    const GOOGLE_API_KEY = undefined

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=iw&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const googleAddressData = await response.json();

    if (googleAddressData.status === "OK") {
      city = data[i].city;
      data[i] = {
        ...data[i],
        address: {
          unformatted: data[i].address,
          location: googleAddressData.results[0].geometry.location,
          formatted: googleAddressData.results[0].formatted_address,
          city: data[i].city,
        },
      };
      delete data[i].city;
      let addressToAdd = data[i].address;
      //       console.log(line)
      addressesWithLocations.push(addressToAdd);
    } else {
      const badAddress = data[i].address;
      // console.log({badAddress})
      data[i] = {
        ...data[i],
        address: {
          unformatted: badAddress,
          location: {
            lat: 33.44852903890945,
            lng: 32.05693494134149,
          },
          formatted: "bad_address",
          city: data[i].city,
        },
      };
      delete data[i].city;
      let addressToAdd = data[i].address;
      addressesWithLocations.push(addressToAdd);
    }
  }
  return addressesWithLocations;
}

async function write_data_to_github({ data, url, filename }) {
  console.log({ data });
  var nowDate = new Date(Date.now()).toLocaleString("he-IL");
  //TODO insert github token
  var token = undefined;
  var dataToPush = new TextEncoder().encode(JSON.stringify(data, null, 3))
    .buffer;
  const serverSha = await get_git_file_sha(token, filename);
  console.log({ serverSha });
  let commit = {
    message: nowDate + " update",
    content: arrayBufferToBase64(dataToPush),
    sha: serverSha,
  };
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "token " + token,
    },
    body: JSON.stringify(commit),
  });
  const content = await response.json();
  console.log(content);
}
async function main() {
  await sleep(15000);
  let daysToCollect = 15;
  let data = await collect_data(daysToCollect);
  data = await organize_duplicate_addresses(data);
  console.log({ data });

  //fetch saved locations from Github
  let url =
    "https://raw.githubusercontent.com/orianshechter/blood-donation-addresses/main/addressesGeoPoints.json";
  let addressesFromGitHub = await fetch(url).then((response) =>
    response.json()
  );
  console.log(addressesFromGitHub);

  for (let i = 0; i < data.length; i++) {
    let addressObj = addressesFromGitHub.find(
      (address) => address.unformatted === data[i].address
    );

    // if address geolocation is already saved in Github.
    if (addressObj) {
      console.log({ addressObj });
      let city = data[i].city ? data[i].city : addressObj.city;
      data[i].address = { ...addressObj, city: city };
      delete data[i].city;
    }
  }
  console.log({ data });
  let addressesInGitHub = data.filter(
    (addressObj) => typeof addressObj.address !== "string"
  );
  let addressesNotInGitHub = data.filter(
    (addressObj) => typeof addressObj.address === "string"
  );
  console.log({ addressesNotInGitHub });
  console.log({ addressesInGitHub });

  // in case of new addresses, needs to fetch their locations from google geocode and update in Github.
  if (addressesNotInGitHub.length > 0) {
    let newAddresses = await fetchGeoLocations(addressesNotInGitHub);
    console.log({ addressesNotInGitHub });
    console.log({ newAddresses });
    await write_data_to_github({
      data: addressesFromGitHub.concat(newAddresses),
      url:
        "https://api.github.com/repos/orianshechter/blood-donation-addresses/contents/addressesGeoPoints.json",
      filename: "addressesGeoPoints.json",
    });
  }

  // update scraped addresses
  await write_data_to_github({
    data: addressesInGitHub.concat(addressesNotInGitHub),
    url:
      "https://api.github.com/repos/orianshechter/blood-donation-addresses/contents/addresses.json",
    filename: "addresses.json",
  });
}

main();
