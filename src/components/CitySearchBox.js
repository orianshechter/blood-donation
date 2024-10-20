import React, {useContext, useEffect, useState} from "react";
import { GeoLocationContext } from "./context/GeoLocationProvider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import CurrentLocationButton from "./CurrentLocationButton";
import './CitySearchBox.css';

function CitySearchBox() {
  const [cities, setCities]= useState([]);
  const { setMapCenter, setMapZoom, setLocationsCenter } = useContext(
    GeoLocationContext
  );
  const filterSearchOptions = createFilterOptions({
    limit: 10,
  });
  useEffect(() => {
      const fetchCities = async () => {
          const response = await fetch('https://raw.githubusercontent.com/orianshechter/blood-donation-addresses/main/cities.json');
          if (!response.ok) {
              console.log('failed to fetch cities');
              return;
          }
          const data = await response.json();
          console.log({data});
          setCities(data);
      };

      fetchCities();
  }, []);
  return (
    <div dir="rtl" id="search__bar">
      <Autocomplete
        options={cities}
        getOptionLabel={(city) => city.name}
        filterOptions={filterSearchOptions}
        onChange={(event, value) => {
          if (value) {
            let locationsDiv = document.getElementById("addresses");
            if (locationsDiv) {
              //scroll the addresses list to top
              locationsDiv.scrollTop = 0;
            }
            setMapCenter([value.lat, value.long]);
            setLocationsCenter([value.lat, value.long])
            setMapZoom(11)
          }
        }}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input
              style={{
                border: "10px",
                outlineWidth: "0",
                borderRadius: "99px",
                width: "100%",
                fontSize: "20px",
              }}
              placeholder="אני רוצה לתרום דם ב.."
              type="text"
              {...params.inputProps}
            />
          </div>
        )}
      />
      <CurrentLocationButton />
    </div>
  );
}

export default CitySearchBox;
