import React, { useEffect, useState, useContext } from "react";
import "./LocationsList.css";
import {getDistanceFromLatLonInKm} from '../utils/geoPointsFuncs'
import {AddressesContext} from './context/AddressesProvider'
import {GeoLocationContext} from './context/GeoLocationProvider'
import Location from './Location'

function AddressesList() {
  const {addressesObjects, setAddressesObjets} = useContext(AddressesContext);
  const { mapCenter, mapZoom, locationsCenter } = useContext(GeoLocationContext)

  useEffect(() => {
    // console.log({addressesObjects})
    console.log("sorting")
    console.log({addressesObjects})
    sortAdresses()
    
  },[locationsCenter])
  // useEffect(() => {
  //   sortAdresses()
  // },[])
  function sortAdresses() {
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
          if(address1DistanceFromLoc < address2DistanceFromLoc){
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
    <div id="adrresses">
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
