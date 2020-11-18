import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
// // Initialize and add the map
// function initMap() {
//   // The location of Israel
//   const israel = new google.maps.LatLng(31.4, 35);
//   // The map, centered at Israel
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 9,
//     center: israel,
//     streetViewControl: false,
//     disableDefaultUI: true,
//   });
//   const coordInfoWindow = new google.maps.InfoWindow({
//     // minWidth: 300
//   })
//   // coordInfoWindow.setContent('<p dir="rtl">'+
//   //   'מינץ 7 נתניה, - תחנת מד"א' +
//   //   '<br />'+
//   //   'יום שישי 8:30-12:30'+
//   // '</p>')
//   coordInfoWindow.setContent(`<div class="tableDiv"><h3 dir="rtl">
//   המ"ג 7 ירושלים, ר"ח המ"ג 7 רוממה , - תחנת מד"א</h3><table dir="rtl" class="minimalistBlack">
// <thead>
// <tr>
// <th>תאריך</th>
// <th>יום</th>
// <th>שעות</th>
// </tr>
// </thead>
// <tbody>
// <tr>
// <td>12/10/20</td><td>חמישי</td><td>16:00-16:30</td></tr>
// <tr>
// <td>cell1_2</td><td>cell2_2</td><td>cell3_2</td></tr>
// <tr>
// <td>cell1_3</td><td>cell2_3</td><td>cell3_3</td></tr>
// <tr>
// <td>cell1_4</td><td>cell2_4</td><td>cell3_4</td></tr>

// </tbody>
// </tr>
// </table></div>`)
//   const marker = new google.maps.Marker({
//     position: israel,
//     map: map,
//   });
//   marker.addListener("click", () => {
//     coordInfoWindow.open(map,marker);
//   })

//   const Haifa = new google.maps.LatLng(32.786325, 35.001965);
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
