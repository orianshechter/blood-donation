import React, {useEffect, useState} from 'react'
import './App.css'

import {BrowserView, MobileView} from 'react-device-detect';

import AddressesList from './components/LocationsList'
import Map from './components/map/Map'
import {AddressesProvider} from './components/context/AddressesProvider'
import {GeoLocationProvider} from './components/context/GeoLocationProvider'
import TimePicker from './components/time-picker/TimePicker';
import CitySearchBox from './components/CitySearchBox'

import SelectDisplayType from './components/SelectDisplayType'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [mainBodyDisplay, setMainBodyDisplay] = useState("locations")
  return (
    <GeoLocationProvider>
      <AddressesProvider>
        <BrowserView>
          <div id="app">
            <div id="page__header">
              <CitySearchBox />
              <TimePicker />
            </div>
            <div dir="ltr" id="page__body">
              <Map />
              <AddressesList />
            </div>
          </div>
        </BrowserView>

        <MobileView>
          <div id="app">
            <CitySearchBox />
            <TimePicker />
            <SelectDisplayType setMainBodyDisplay={setMainBodyDisplay} />

            <div dir="ltr" id="page__body">
              {mainBodyDisplay === "map" && <Map />}
              {mainBodyDisplay === "locations" && <AddressesList />}
            </div>
          </div>
        </MobileView>
      </AddressesProvider>
    </GeoLocationProvider>
  );
}

export default App;
