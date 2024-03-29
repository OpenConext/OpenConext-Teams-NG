import React from "react";
import "./CheckBox.scss";
import {ReactComponent as CheckIcon} from "../icons/check.svg";
import Tooltip from "./Tooltip";

export const CheckBox = ({name, value, info, onChange, toolTip = null, readOnly = false}) => {

    const innerOnChange = e => {
        e.cancelBubble = true;
        e.stopPropagation();
        onChange && onChange(e);
        return false;
    }

    return (
        <div className="checkbox">
            <input type="checkbox"
                   id={name}
                   name={name}
                   checked={value}
                   onChange={innerOnChange}
                   disabled={readOnly}/>
            <label htmlFor={name}>
                <button disabled={readOnly} onClick={innerOnChange}><CheckIcon/></button>
            </label>
            {info && <span>
                    <label htmlFor={name} className={`info ${readOnly ? "disabled" : ""}`}
                           dangerouslySetInnerHTML={{__html: info}}/>
                    {toolTip && <Tooltip tooltip={toolTip} name={name} label={""}/>}
                </span>}
        </div>
    );
}
