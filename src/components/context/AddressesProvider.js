import React, { createContext, useState, useEffect } from 'react'

export const AddressesContext = createContext()

export const AddressesProvider = ({children}) => {
    const [addressesObjects,setAddressesObjets] = useState(undefined)
    
    function onMouseAddressHover(addressObj) {
        setAddressesObjets((addressesObjects) => {
          return addressesObjects.map(addressObject => {
            if(addressObject === addressObj){
              return {
                ...addressObj,
                isListHovered: true,
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
      }
      function onMouseAddressOut(addressObj) {
        setAddressesObjets((addressesObjects) => {
          return addressesObjects.map(addressObject => {
            if(addressObject === addressObj){
              return {
                ...addressObj,
                isListHovered: false,
              };
            }
            else{
              return addressObject
            }
          })
        })
      }
    useEffect(() => {
        var url =
          "https://orianshechter.github.io/blood-donation-addresses/addresses.json";
        let request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onload = function () {
          if (this.status === 200) {
            try {
              const fetchedAddresses = JSON.parse(this.response)
              const filteredFetchedAddresses = fetchedAddresses.filter(a => {
                  if(!(a.address.location && a.address.formatted !== 'bad_address')) {
                      return false
                  }
                  const isDonationEnded = new Date(a.times[0].timestamp_end) < new Date();
                  if(isDonationEnded && a.times.length === 1) {
                      return false;
                  }
                  return true;
              });
              setAddressesObjets(filteredFetchedAddresses.map(addressObj => {
                if(addressObj.address.location) {
                  const isDonationEnded = new Date(addressObj.times[0].timestamp_end) < new Date();
                  if(isDonationEnded){
                      addressObj.times.shift();
                  }
                  return {
                      ...addressObj,
                      isPopupOpen: false,
                      isListHovered: false,
                  }
              }}));
            } catch (e) {
              console.log(e.message);
            }
          } else if (this.status === 400) {
            setAddressesObjets([])
          }
        };
        request.send();
      }, []);
    
      
    return(
        <AddressesContext.Provider value = {{addressesObjects, setAddressesObjets,onMouseAddressHover,onMouseAddressOut}}>
            {children}
        </AddressesContext.Provider>
    )
}