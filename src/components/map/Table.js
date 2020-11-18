import React from 'react'
import './Table.css'
function Table() {
    return (
        <div className="table__container">
            <h3 dir="rtl">המ"ג 7 ירושלים, ר"ח המ"ג 7 רוממה , - תחנת מד"א</h3>
            <table dir="rtl" class="minimalistBlack">
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>יום</th>
                  <th>שעות</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12/10/20</td>
                  <td>חמישי</td>
                  <td>16:00-16:30</td>
                </tr>
                <tr>
                  <td>cell1_2</td>
                  <td>cell2_2</td>
                  <td>cell3_2</td>
                </tr>
                <tr>
                  <td>cell1_3</td>
                  <td>cell2_3</td>
                  <td>cell3_3</td>
                </tr>
                <tr>
                  <td>cell1_4</td>
                  <td>cell2_4</td>
                  <td>cell3_4</td>
                </tr>
              </tbody>
            </table>
          </div>
    )
}

export default Table
