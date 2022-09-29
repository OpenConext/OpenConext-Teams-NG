import React, {useRef, useState} from "react";
import DatePicker from "react-datepicker";
import {ReactComponent as CalendarIcon} from "../icons/calendar-alt.svg";
import "react-datepicker/dist/react-datepicker.css";
import "./DateField.scss"

export const DateField = ({
                              onChange,
                              value,
                              isOpen = false,
                              maxDate = null,
                              minDate = null
                          }) => {

    const component = useRef(null);
    const [initial, setInitial] = useState(true);
    const [displayValue, setDisplayValue] = useState("");

    const toggle = (open = true) => {
        component.current.setOpen(open);
    }

    const onChangeRaw = e => {
        setDisplayValue(e.target.value);
    }

    const onChangeInner = d => {
        onChange(d);
        if (d !== null) {
            setDisplayValue(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`)
        } else {
            setDisplayValue("");
        }

    }

    const validateOnBlur = (e, skipTimeOut) => {
        if (!skipTimeOut) {
            setTimeout(() => validateOnBlur(e, true), 250);
        } else if (displayValue && displayValue.length > 0) {
            const [day, month, year] = displayValue.split(/[-/]/);
            const d = new Date(+year, month - 1, +day);
            const valid = d instanceof Date && !isNaN(d);
            if (!valid || (maxDate && d > maxDate) || (minDate && d < minDate)) {
                onChange(null);
                setDisplayValue("");
            } else {
                onChange(d);
            }
        }
    }


    if (isOpen && initial) {
        setTimeout(() => {
            isOpen = false;
            setInitial(false);
            toggle();
        }, 500);
    }

    return (
        <div className="date-field">
            <label className={"date-picker-container"} htmlFor={"date-field"}>
                <DatePicker
                    ref={component}
                    name={"date-field"}
                    id={"date-field"}
                    selected={value}
                    value={displayValue}
                    preventOpenOnFocus
                    dateFormat={"dd/MM/yyyy"}
                    onChange={onChangeInner}
                    onChangeRaw={onChangeRaw}
                    showWeekNumbers
                    isClearable={true}
                    placeholderText={"dd/MM/yyyy"}
                    showYearDropdown={true}
                    onBlur={validateOnBlur}
                    weekLabel="Week"
                    todayButton={null}
                    maxDate={maxDate}
                    minDate={minDate}
                />
                <button onClick={toggle}
                        onKeyDown={e => e.key === "Escape" && toggle(false)}
                        className={"calendar-icon-container"}>
                    <CalendarIcon/>
                </button>
            </label>
        </div>
    );

}
