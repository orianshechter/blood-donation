import React, { useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import MyLocationOutlinedIcon from "@material-ui/icons/MyLocationOutlined";
import { GeoLocationContext } from "./context/GeoLocationProvider";

function CurrentLocationButton() {
  const { setCenterToCurrentLocation } = useContext(GeoLocationContext);
  return (
    <IconButton
      onClick={() => {
        setCenterToCurrentLocation();
        let locationsDiv = document.getElementById("addresses");
        if (locationsDiv) {
            //scroll the addresses list to top
            locationsDiv.scrollTop = 0;
        }
      }}
      size="small"
      color="primary"
      variant="contained"
    >
      <MyLocationOutlinedIcon color="primary" size="small" />
    </IconButton>
  );
}

export default CurrentLocationButton;
