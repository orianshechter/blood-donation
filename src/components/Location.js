import React, { useState, useContext } from "react";
import { getHour, getDay, getDate } from "../utils/timeFuncs";
import { AddressesContext } from "./context/AddressesProvider";
import { GeoLocationContext } from "./context/GeoLocationProvider"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import EventIcon from '@material-ui/icons/Event';
import Button from "@material-ui/core/Button";
import {isBrowser, isMobile} from 'react-device-detect';

function Location({ addressObj }) {
  const { onMouseAddressHover, onMouseAddressOut, setAddressesObjets } = useContext(
    AddressesContext
  );
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const {setMapCenter} = useContext(GeoLocationContext);

  const isMadaStationLocation = addressObj.address.unformatted.toString().includes(`מד"א`)
  return (
    <div
      dir='rtl'
      onMouseEnter={() => {
        onMouseAddressHover(addressObj);
      }}
      onMouseLeave={() => {
        onMouseAddressOut(addressObj);
      }}
      className={isMadaStationLocation ? "address__mada" : "address"}
    >
      <div
        id="click__to__center__map"
        onClick={() => {
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
          if(!isMobile && isBrowser) {
            setMapCenter([
              addressObj.address.location.lat,
              addressObj.address.location.lng,
            ]);
          }
        }}
      >
        <h3>{addressObj.address.city}</h3>

        <p>{addressObj.address.unformatted}</p>

        <TimePresentation addressObj={addressObj} time={addressObj.times[0]} />
      </div>
      {showAllAddresses &&
        addressObj.times.map((time, idx) => {
          //first date already has been displayed above
          if (idx === 0) {
            return;
          }
          return (
              <TimePresentation key={time.timestamp_start} addressObj={addressObj} time={time} />
          );
        })}
      <div>
        {showAllAddresses && addressObj.times.length > 1 && (
          <Button
            onClick={() => {
              setShowAllAddresses(false);
            }}
            size="small"
            color="primary"
            variant="contained"
          >
            <ExpandLessIcon
              color="secondary"
              onClick={() => setShowAllAddresses(true)}
            />
            פחות תאריכים
          </Button>
        )}
        {!showAllAddresses && addressObj.times.length > 1 && (
          <Button
            onClick={() => {
              setShowAllAddresses(true);
            }}
            size="small"
            color="primary"
            variant="contained"
          >
            <ExpandMoreIcon
              color="secondary"
              onClick={() => setShowAllAddresses(true)}
            />
            לעוד תאריכים
          </Button>
        )}
      </div>
    </div>
  );
}

const TimePresentation = ({ addressObj, time }) => {
  return (
      <div className="time">
        <ScheduleAppointment addressObj={addressObj} time={time} />
        <p>{getDate(addressObj.times[0].timestamp_start)}</p>
        <p>{getDay(addressObj.times[0].timestamp_start)}</p>
        <p>
          {getHour(addressObj.times[0].timestamp_start)}-
          {getHour(addressObj.times[0].timestamp_end)}
        </p>
      </div>
  )
}

const ScheduleAppointment = ({ time }) => {
  return (
    <div className='save-to-calendar'>
      <a target='_blank' rel='noreferrer' href={time.schedulingUrl}>
        <EventIcon />
      </a>
    </div>
  )
}
export default Location;
