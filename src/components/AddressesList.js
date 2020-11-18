import React,{useEffect, useState} from 'react'
import './AddressesList.css'
import {db} from '../database/firebase'
const timestamp_start = new Date(Date.UTC(2020,11,6,12,10))
const timestamp_end = new Date(Date.UTC(2020,11,6,15,0))

function AddressesList() {
    const [addresses,setAdresses] = useState([])
    useEffect(() => {
      db
      .collection("Addresses")
      .onSnapshot(snapshot => (
          // setMessages(snapshot.docs.map(doc => doc.data()))
          setAdresses(snapshot.docs.map(doc => doc.data()))
      ))
      
    },[])
  useEffect(() => {
    console.log(addresses)
  },[addresses])
    return (
      <div id="adrresses">
        {addresses.map((address) => {
          return (
            <div key = {address} id="address">
              <h3>{address.city}</h3>
              <br />
              <p>{address.title}</p>
              <br />


              <div id="time">
                <p>{new Date(address.times[0]?.toDate()).toLocaleString().split(',')[0]}</p>
                <p>{new Date(address.times[0]?.toDate()).getDay()}</p>
                <p>
                  {new Date(address.times[0]?.toDate()).toLocaleString().split(',')[1].slice(0,6)} - 
                  { new Date(address.times[1]?.toDate()).toLocaleString().split(',')[1].slice(0,6)}
                </p>
              </div>
              {/* <div id="time">
                <p>{Date().getDate()}</p>
                <p>{Date().getDay()}</p>
                <p>
                  {Date().getHours()} - {Date().getHours()}
                </p>
              </div> */}
            </div>
          )
        })}
      </div>
    );
}

export default AddressesList
