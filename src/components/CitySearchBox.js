import React, { useContext } from "react";
import { GeoLocationContext } from "../components/context/GeoLocationProvider";
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
            let locationsDiv = document.getElementById("adrresses");
            if (locationsDiv) {
              locationsDiv.scrollTop = 0;
            }
            console.log({setMapZoom})
            setLocationsCenter([value.Y_GEO, value.X_GEO]);
            setMapCenter([value.Y_GEO, value.X_GEO]);
            // setMapZoom(mapZoom => {
            //   // setMapZoom(11) won't fire a useEffect(func,[mapZoom]) function if the previous mapZoom was 11.
            //   // temporary solution to that. #TODO think about a better solution.
            //   if(mapZoom === 11) {
            //     return 10
            //   }
            //   return 11
            // });
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