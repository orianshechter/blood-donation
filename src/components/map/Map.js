import React, { useEffect, useContext, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Pane,
  useMap,
  useMapEvent,
  CircleMarker,
} from "react-leaflet";
import Table from "./Table";
import { AddressesContext } from "../context/AddressesProvider";
import { GeoLocationContext } from "../context/GeoLocationProvider";
import "./Map.css";

function MapUpdateViewHandler() {
  const map = useMap();
  const { mapCenter, locationsCenter, mapZoom } = useContext(
    GeoLocationContext
  );
  useEffect(() => {
    map.closePopup();
    console.log("setting center to " + mapCenter);
    map.setView(mapCenter);
  }, [locationsCenter, mapCenter]);
  
  useEffect(() => {
    map.setView(locationsCenter, mapZoom);
  }, [locationsCenter, mapZoom]);
  // it's an empty component, only here to manage the map's zoom when user makes new search
  return <></>;
}

function Map() {
  const { addressesObjects, setAddressesObjets } = useContext(AddressesContext);
  const { mapCenter, mapZoom } = useContext(GeoLocationContext);

  function onPopupOpen(addressObj) {
    setAddressesObjets((addressesObjects) => {
      return addressesObjects.map((addressObject) => {
        if (addressObject === addressObj) {
          return {
            ...addressObj,
            isPopupOpen: true,
            isLocationClicked: false,
          };
        } else {
          return {
            ...addressObject,
            isLocationClicked: false,
          };
        }
      });
    });
  }

  function onPopupClose(addressObj) {
    setAddressesObjets((addressesObjects) => {
      return addressesObjects.map((addressObject) => {
        if (addressObject === addressObj) {
          return {
            ...addressObj,
            isPopupOpen: false,
          };
        } else {
          return addressObject;
        }
      });
    });
  }

  if (!addressesObjects) {
    return <div>Loading Map...</div>;
  }

  return (
    <div>
      <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
        <MapUpdateViewHandler />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {addressesObjects.map((addressObj, idx) => {
          const id = addressObj.address.unformatted;
          const position = addressObj.address.location;
          if (position) {
            return (
              <div key={idx}>
                <Pane>
                  <CircleMarker
                    pathOptions={
                      addressObj.isPopupOpen ||
                      addressObj.isListHovered ||
                      addressObj.isLocationClicked
                        ? { color: "red", opacity: "1" }
                        : { color: "green", opacity: 0.2 }
                    }
                    key={idx + "circle"}
                    radius={20}
                    center={[position.lat, position.lng]}
                  />
                </Pane>

                <Marker
                  key={idx}
                  position={position}
                  riseOnHover={true}
                  riseOffset={250}
                  autoPan={true}
                >
                  <Popup
                    onOpen={() => {
                      onPopupOpen(addressObj);
                    }}
                    onClose={() => {
                      onPopupClose(addressObj);
                    }}
                  >
                    <Table
                      address={addressObj.address.unformatted}
                      times={addressObj.times}
                    />
                  </Popup>
                </Marker>
              </div>
            );
          } else {
            // handle undefined positions(in future updates)
            return;
          }
        })}
      </MapContainer>
    </div>
  );
}

export default Map;
