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
} from "react-leaflet";
import Table from "./Table";
import { AddressesContext } from "../context/AddressesProvider";
import { GeoLocationContext } from "../context/GeoLocationProvider";
import "./Map.css";

function MapUpdateViewHandler({setCircleRadius}) {
  const map = useMap();
  const [circlePixels,setCirclePixels] = useState(15.625)
  const mapEvents = useMapEvent({
    'zoom': (prevZoom) => {
      console.log({prevZoom})
      console.log("zoom change!")
      console.log(map.getZoom())
      const metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
      console.log({metresPerPixel})
      setCircleRadius(20*metresPerPixel)

    }
  })
  const { mapCenter, locationsCenter, mapZoom } = useContext(GeoLocationContext);
  useEffect(() => {
    console.log(map.getZoom())
  },[map.getZoom()])
  useEffect(() => {
    map.closePopup()
    console.log("setting center to "+mapCenter)
    map.setView(mapCenter); 
  }, [locationsCenter, mapCenter]);
  useEffect(() => {
    map.setView(locationsCenter, mapZoom)
  },[locationsCenter,mapZoom])
  // useEffect(() => {
  //   console.log("setting zoom to "+mapZoom)
  //   map.setZoom(mapZoom)
  // }, [mapZoom]);
  // it's an empty component, only here to manage the map's zoom when user makes new search
  return <></>;
}

function Map() {
  const { addressesObjects, setAddressesObjets } = useContext(AddressesContext);
  const { mapCenter, mapZoom } = useContext(GeoLocationContext);

  const [circleRadius,setCircleRadius] = useState(1000)
  function onPopupOpen(addressObj) {
    setAddressesObjets((addressesObjects) => {
      return addressesObjects.map((addressObject) => {
        if (addressObject === addressObj) {
          return {
            ...addressObj,
            isPopupOpen: true,
            isLocationClicked: false
          };
        } else {
          return {
            ...addressObject,
             isLocationClicked: false
          }
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
  function handleZoomChange() {
    console.log("zoom change!")
  }

  if (!addressesObjects) {
    return <div>Loading Map...</div>;
  }

  return (
    <div>
      <MapContainer
       center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
        <MapUpdateViewHandler setCircleRadius = {setCircleRadius} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {addressesObjects.map((addressObj, idx) => {
          const id = addressObj.address.unformatted;
          const position = addressObj.address.location;
          if (position ) {
            return (
              <div key={idx}>
                <Pane>
                  <Circle
                    pathOptions={
                      addressObj.isPopupOpen || addressObj.isListHovered || addressObj.isLocationClicked
                        ? { color: "red", opacity: "1" }
                        : { color: "green", opacity: 0.2 }
                    }
                    key={idx + "circle"}
                    radius={circleRadius}
                    center={[position.lat, position.lng]}
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
