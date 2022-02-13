import React, { createContext, useState, useEffect } from 'react'
import { getFilteredAddressesByTimes } from '../../utils/timeFuncs';
export const AddressesContext = createContext()

export const AddressesProvider = ({children}) => {
    const [addressesObjects, setAddressesObjets] = useState(null);
    const [allAddressesObjects, setAllAddressesObjects] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
                isListHovered: false
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
              let filteredFetchedAddresses = fetchedAddresses.filter(a => {
                  if(!(a.address.location && a.address.formatted !== 'bad_address')) {
                      return false
                  }
                  const isDonationEnded = new Date(a.times[0].timestamp_end) < new Date();
                  if(isDonationEnded && a.times.length === 1) {
                      return false;
                  }
                  return true;
              });
                filteredFetchedAddresses = filteredFetchedAddresses.map(addressObj => {
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
                    }});
                setAllAddressesObjects(filteredFetchedAddresses);
                setAddressesObjets(filteredFetchedAddresses);
            } catch (e) {
              console.log(e.message);
            }
          } else if (this.status === 400) {
            setAddressesObjets([]);
            setAllAddressesObjects([]);
          }
        };
        request.send();
      }, []);

    useEffect(() => {
        if(startDate) {
            setAddressesObjets(getFilteredAddressesByTimes(allAddressesObjects, startDate, endDate));
        } else {
            setAddressesObjets(allAddressesObjects);
        }
    },[startDate, endDate, allAddressesObjects])

    return(
        <AddressesContext.Provider value = {{addressesObjects,
            setAddressesObjets,
            setAllAddressesObjects,
            onMouseAddressHover,
            onMouseAddressOut,
            startDate, endDate,
            setStartDate, setEndDate
        }}>
            {children}
        </AddressesContext.Provider>
    )
}