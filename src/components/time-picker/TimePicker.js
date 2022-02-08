import React, {useState, forwardRef, useContext} from 'react';
import DatePicker, {CalendarContainer} from 'react-datepicker';
import {he} from 'date-fns/locale';
import { HighlightOff } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import 'react-datepicker/dist/react-datepicker.css';
import './TimePicker.css';
import { AddressesContext } from '../context/AddressesProvider';

function TimePicker() {
    const { startDate, setStartDate, endDate, setEndDate } = useContext(AddressesContext);
    const [headerText, setHeaderText] = useState("בחר תאריך התחלה");
    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if(end) {
            setHeaderText("בחר תאריך התחלה");
        } else {
            setHeaderText("בחר תאריך סיום");
        }
    };
    const headerContainer = ({ className, children }) => {
        return (
            <CalendarContainer className={className}>
                <div className="datepicker__header">
                    {headerText}
                </div>
                <div style={{ position: "relative" }}>{children}</div>
            </CalendarContainer>
        );
    };
    const DatePickerInput = forwardRef(({ value, onClick }, ref) => (
        <div className="datepicker__input" onClick={onClick} ref={ref}>
            {value || "ובתאריכים..."}
        </div>
    ));
    return (
        <div id="datepicker">
            <DatePicker
                dateFormat="dd/MM/yyyy"
                locale={he}
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                calendarContainer={headerContainer}
                customInput={<DatePickerInput />}
            />
            {startDate || endDate ?
                <IconButton
                    onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                    }}
                    size="small"
                    color="primary"
                    variant="contained"
                >
                    <HighlightOff color="primary" size="small" />
                </IconButton>
            : <></>}
        </div>
    );
}

export default TimePicker;