import React, {useRef} from "react";
import DatePicker from "react-datepicker";
import {ReactComponent as CalendarIcon} from "../icons/calendar-alt.svg";
import "react-datepicker/dist/react-datepicker.css";
import "./DateField.scss"

import {stopEvent} from "../utils/utils";

export const DateField = ({
                              onChange,
                              value,
                              maxDate = null,
                              minDate = null,
                              performValidateOnBlur = true
                          }) => {

    const component = useRef(null);

    const toggle = () => {
        component.current.setOpen(true);
    }

    const validateOnBlur = e => {
        if (!performValidateOnBlur) {
            stopEvent(e);
            return;
        }
        if (e && e.target) {
            const value = e.target.value;
            if (value) {
                const [day, month, year] = value.split('/');
                const d = new Date(+year, month - 1, +day);
                const valid = d instanceof Date && !isNaN(d);
                if (!valid || (maxDate && d > maxDate) || (minDate && d < minDate)) {
                    setTimeout(() => onChange(null), 250);
                }
            } else {
                setTimeout(() => onChange(null), 250);
            }
        }
    }

    return (
        <div className="date-field">
            <label className={"date-picker-container"} htmlFor={"date-field"}>
                <DatePicker
                    ref={component}
                    name={"date-field"}
                    id={"date-field"}
                    selected={value}
                    preventOpenOnFocus
                    dateFormat={"dd/MM/yyyy"}
                    onChange={onChange}
                    showWeekNumbers
                    isClearable={true}
                    showYearDropdown={true}
                    onBlur={validateOnBlur}
                    weekLabel="Week"
                    todayButton={null}
                    maxDate={maxDate}
                    minDate={minDate}
                />
                <CalendarIcon onClick={toggle}/>
            </label>
        </div>
    );

}
