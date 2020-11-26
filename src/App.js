import React, {useEffect, useState} from 'react'
import './App.css'

import {BrowserView, MobileView} from 'react-device-detect';
import AddressesList from './components/LocationsList'
import MapFree from './components/map/Map'
import {AddressesProvider} from './components/context/AddressesProvider'
import {GeoLocationProvider} from './components/context/GeoLocationProvider'

import CitySearchBox from './components/CitySearchBox'

import SelectDisplayType from './components/SelectDisplayType'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [mainBodyDisplay, setMainBodyDisplay] = useState("map")
  return (
    <GeoLocationProvider>
      <AddressesProvider>
        <BrowserView>
          <div id="app">
              <CitySearchBox />
            <div dir="ltr" id="page__body">
              <MapFree />
              <AddressesList />
            </div>
          </div>
        </BrowserView>

        <MobileView>
          <div id="app">
            <CitySearchBox />
            {/* <CurrentLocationButton /> */}
            <SelectDisplayType setMainBodyDisplay={setMainBodyDisplay} />

            <div dir="ltr" id="page__body">
              {mainBodyDisplay === "map" && <MapFree />}
              {mainBodyDisplay === "locations" && <AddressesList />}
            </div>
          </div>
        </MobileView>
      </AddressesProvider>
    </GeoLocationProvider>
  );
}

export default App;
