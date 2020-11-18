import React, { Component, useState, useMemo } from 'react';
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@material-ui/icons/Room';
import { IconButton } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MarkerAndInfoWindow from './MarkerAndInfoWindow'
// import './Map.css'

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 32.800052,
      lng:  35.005105,
    },
    zoom: 11
  };
 
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={this.props.style}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyCQoy9Y1JWeTrJSByTcVPvibsHApnLs3II",
            language: "he",
            region: "il",
          }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <MarkerAndInfoWindow lat={32.807} lng={35.005105} text="My Marker" />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default Map;