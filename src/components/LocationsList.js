import React, { useEffect, useState, useContext } from "react";
import "./LocationsList.css";
import {getDistanceFromLatLonInKm} from '../utils/geoPointsFuncs'
import {AddressesContext} from './context/AddressesProvider'
import {GeoLocationContext} from './context/GeoLocationProvider'
import Location from './Location'

const CIRCLES_DISTANCES_KM = [0,10,20,30,40,50,60]
function AddressesList() {
  const {addressesObjects, setAddressesObjets} = useContext(AddressesContext);
  const { mapCenter, mapZoom, locationsCenter } = useContext(GeoLocationContext)

  useEffect(() => {
    sortAddresses()
  },[mapCenter, mapZoom, locationsCenter])

  function sortAddresses() {
    if(addressesObjects) {
      setAddressesObjets(addressesObjects => {
        let newAddresses = [].concat(addressesObjects)
        newAddresses.sort((addressObj1, addressObj2) => {
          if(! (addressObj1.address.location && addressObj2.address.location)) {
            return 1
          }
          const address1DistanceFromLoc = getDistanceFromLatLonInKm(
            addressObj1.address.location.lat,
            addressObj1.address.location.lng,
            locationsCenter[0],
            locationsCenter[1]
          );
          const address2DistanceFromLoc = getDistanceFromLatLonInKm(
            addressObj2.address.location.lat,
            addressObj2.address.location.lng,
            locationsCenter[0],
            locationsCenter[1]
          );
          let address1Radius = 0
          let address2Radius = 0
          
          for(let i=0;i<CIRCLES_DISTANCES_KM.length-1;i++) {
            if(address1DistanceFromLoc > CIRCLES_DISTANCES_KM[i] && address1DistanceFromLoc < CIRCLES_DISTANCES_KM[i+1]){
              address1Radius = i
            }
            if(address2DistanceFromLoc > CIRCLES_DISTANCES_KM[i] && address2DistanceFromLoc < CIRCLES_DISTANCES_KM[i+1]){
              address2Radius = i
            }
          }
          if(address1DistanceFromLoc > CIRCLES_DISTANCES_KM[CIRCLES_DISTANCES_KM.length-1]){
            address1Radius = CIRCLES_DISTANCES_KM.length-1
          }
          if(address2DistanceFromLoc > CIRCLES_DISTANCES_KM[CIRCLES_DISTANCES_KM.length-1]){
            address2Radius = CIRCLES_DISTANCES_KM.length-1
          }

          // when locations are close, we sort them by the timestamp
          if(address1Radius === address2Radius && address1Radius !== CIRCLES_DISTANCES_KM.length-1) {
            if(addressObj1.times[0].timestamp_start < addressObj2.times[0].timestamp_start){
              return -1
            }
            return 1
          }
          else if(address1DistanceFromLoc < address2DistanceFromLoc){
            return -1
          }
          else {
            return 1
          }
        });
        return newAddresses
      })
    }
  }

  if (!addressesObjects) {
    return <div>Loading Locations...</div>;
  }

  return (
    <div id="addresses">
      {addressesObjects.map((addressObj, idx) => {
        if(idx > 20) {
          return
        }
        if (addressObj) {
          return (
            <Location key = {idx} 
            addressObj={addressObj} />
          );
        }
      })}
    </div>
  );
}

export default AddressesList;
