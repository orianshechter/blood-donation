import React, { useEffect, useState, useContext } from "react";
import { getHour, getDay, getDate } from "../utils/timeFuncs";
import { AddressesContext } from "./context/AddressesProvider";
import { GeoLocationContext } from "./context/GeoLocationProvider"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Button from "@material-ui/core/Button";
import {isBrowser, isMobile} from 'react-device-detect'

function Location({ addressObj }) {
  const { onMouseAddressHover, onMouseAddressOut, setAddressesObjets } = useContext(
    AddressesContext
  );
  const [showAllAdresses, setShowAllAdresses] = useState(false);
  const {setMapCenter} = useContext(GeoLocationContext)
  return (
    <div
      onMouseEnter={() => {
        onMouseAddressHover(addressObj);
      }}
      onMouseLeave={() => {
        onMouseAddressOut(addressObj);
      }}
      id="address"
    >
      <div
        id="click__to__center__map"
        onClick={() => {
          if(isBrowser && !isMobile){
            // onMouseAddressOut(addressObj);
            setAddressesObjets((addressesObjects) => {
              return addressesObjects.map(addressObject => {
                if(addressObject === addressObj){
                  return {
                    ...addressObj,
                    isLocationClicked: true
                  };
                }
                else{
                  return {
                    ...addressObject,
                    isLocationClicked: false
                  }
                }
              })
            })
            setMapCenter([
              addressObj.address.location.lat,
              addressObj.address.location.lng,
            ]);
          }
        }}
      >
        <h3>{addressObj.address.city}</h3>

        <p>{addressObj.address.unformatted}</p>
        <div id="time">
          <p>{getDate(addressObj.times[0].timestamp_start)}</p>
          <p>{getDay(addressObj.times[0].timestamp_start)}</p>
          <p>
            {getHour(addressObj.times[0].timestamp_start)}-
            {getHour(addressObj.times[0].timestamp_end)}
          </p>
        </div>
      </div>
      {showAllAdresses &&
        addressObj.times.map((time, idx) => {
          //first date already has been displayed above
          if (idx === 0) {
            return;
          }
          return (
            <div key={time.timestamp_start} id="time">
              <p>{getDate(time.timestamp_start)}</p>
              <p>{getDay(time.timestamp_start)}</p>
              <p>
                {`${getHour(time.timestamp_start)}-${getHour(
                  time.timestamp_end
                )}`}
              </p>
            </div>
          );
        })}
      <div>
        {showAllAdresses && addressObj.times.length > 1 && (
          <Button
            onClick={() => {
              setShowAllAdresses(false);
            }}
            size="small"
            color="primary"
            variant="contained"
          >
            <ExpandLessIcon
              color="secondary"
              onClick={() => setShowAllAdresses(true)}
            />
            פחות תאריכים
          </Button>
        )}
        {!showAllAdresses && addressObj.times.length > 1 && (
          <Button
            onClick={() => {
              setShowAllAdresses(true);
            }}
            size="small"
            color="primary"
            variant="contained"
          >
            <ExpandMoreIcon
              color="secondary"
              onClick={() => setShowAllAdresses(true)}
            />
            לעוד תאריכים
          </Button>
        )}
      </div>
    </div>
  );
}

export default Location;
