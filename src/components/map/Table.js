import React,{useEffect} from 'react'
import {getHour, getDay,getDate} from '../../utils/timeFuncs'
import './Table.css'
function Table({address, times}) {
    return (
      <div className="table__container">
        <h3 dir="rtl">{address}</h3>
        <br />
        <table dir="rtl" className="minimalistBlack">
          <thead>
            <tr>
              <th>תאריך</th>
              <th>יום</th>
              <th>שעות</th>
            </tr>
          </thead>
          <tbody>
            {times.map((time) => {
              // const timeDate = (new Date(time.timestamp_start)).toLocaleString('he-il').split(',')[0].replace(',','/') 
              const timeDate = getDate(time.timestamp_start)
              const timeDay = getDay(time.timestamp_start)
              const hourStart = getHour(time.timestamp_start)
              const hourEnd = getHour(time.timestamp_end)
              return (
                <tr key={time.timestamp_start}>
                  <td>{timeDate}</td>
                  <td>{timeDay}</td>
                  <td>{`${hourStart}-${hourEnd}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}

export default Table
