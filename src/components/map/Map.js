import React, { useEffect, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Pane,
  useMap,
} from "react-leaflet";
import Table from "./Table";
import { AddressesContext } from "../context/AddressesProvider";
import { GeoLocationContext } from "../context/GeoLocationProvider";
import "./Map.css";

function MapUpdateViewHandler() {
  const map = useMap();
  const { mapCenter, mapZoom } = useContext(GeoLocationContext);

  useEffect(() => {
    map.setView(mapCenter, mapZoom);
  }, [mapCenter, mapZoom]);

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
          };
        } else {
          return addressObject;
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
                  <Circle
                    pathOptions={
                      addressObj.isPopupOpen || addressObj.isListHovered
                        ? { color: "red", opacity: "1" }
                        : { color: "green", opacity: 0.2 }
                    }
                    key={idx + "circle"}
                    radius={1500}
                    center={[position.lat + 0.007, position.lng]}
                    opacity={addressObj.isPopupOpen ? 1 : 0}
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
