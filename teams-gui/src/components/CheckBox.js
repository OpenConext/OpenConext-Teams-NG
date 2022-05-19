import React from "react";
import "./CheckBox.scss";
import {ReactComponent as CheckIcon} from "../icons/check.svg";

export const CheckBox = ({name, value, info, onChange, readOnly = false}) => {

    const innerOnChange = e => {
        e.cancelBubble = true;
        e.stopPropagation();
        onChange && onChange(e);
        return false;
    }

    return (
        <div className="checkbox">
            <input type="checkbox" id={name} name={name} checked={value}
                   onChange={innerOnChange} disabled={readOnly}/>
            <label htmlFor={name}>
                <span tabIndex="0"><CheckIcon/></span>
            </label>
            {info && <span>
                    <label htmlFor={name} className={`info ${readOnly ? "disabled" : ""}`}
                           dangerouslySetInnerHTML={{__html: info}}/>
                </span>}
        </div>
    );
}
