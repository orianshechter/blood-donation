import React, { useContext } from "react";
import { GeoLocationContext } from "./context/GeoLocationProvider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { cities } from "../database/cities";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import CurrentLocationButton from "./CurrentLocationButton";

function CitySearchBox() {
  const { setMapCenter, setMapZoom, setLocationsCenter } = useContext(
    GeoLocationContext
  );
  const filterSearchOptions = createFilterOptions({
    limit: 10,
  });
  return (
    <div dir="rtl" id="search__bar">
      <Autocomplete
        options={cities}
        getOptionLabel={(city) => city.SettlementName}
        filterOptions={filterSearchOptions}
        onChange={(event, value) => {
          if (value) {
            let locationsDiv = document.getElementById("addresses");
            if (locationsDiv) {
              //scroll the addresses list to top
              locationsDiv.scrollTop = 0;
            }
            setMapCenter([value.Y_GEO, value.X_GEO]);
            setLocationsCenter([value.Y_GEO, value.X_GEO])
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
