import React, { useEffect, useState, useContext } from "react";
import { getHour, getDay, getDate } from "../utils/timeFuncs";
import { AddressesContext } from "./context/AddressesProvider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Button from "@material-ui/core/Button";
function Location({ addressObj }) {
  const { onMouseAddressHover, onMouseAddressOut } = useContext(
    AddressesContext
  );
  const [showAllAdresses, setShowAllAdresses] = useState(false);

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
      <h3>{addressObj.address.city}</h3>

      <p>{addressObj.address.unformatted}</p>
      <div id="time">
        <p>{getDate(addressObj.times[0].timestamp_start)}</p>
        <p>{getDay(addressObj.times[0].timestamp_start)}</p>
        <p>
          {getHour(addressObj.times[0].timestamp_start)} -
          {getHour(addressObj.times[0].timestamp_end)}
        </p>
      </div>
      {showAllAdresses &&
        addressObj.times.map((time, idx) => {
          //first date already has been printed above
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
