import React, {useEffect} from 'react'
import MapComponent from './components/map/Map'
// import Example from './Example'
import './App.css'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {BrowserView, MobileView} from 'react-device-detect';
import AddressesList from './components/AddressesList'

function App() {
  
  return (
    <div id="app">
      <div id="search__bar">
        <input placeholder="ישוב" dir="rtl" type="text" text="ישוב" />
      </div>
      <div id="page__body">

        <MobileView>
          <MapComponent
            style={{ height: "90vh", width: "100%" }}
          />
        </MobileView>

        <BrowserView>
          <MapComponent
            style={{ height: "85vh", width: "65vw" }}
          />
        </BrowserView>

        <AddressesList />
      </div>
    </div>
  );
}

export default App;
