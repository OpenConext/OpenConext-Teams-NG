import React from "react";
import "./InputField.scss";
import Tooltip from "./Tooltip";


export default function InputField({
                                       onChange,
                                       name,
                                       value,
                                       className = "",
                                       placeholder = "",
                                       disabled = false,
                                       toolTip = null,
                                       onBlur = () => true,
                                       onEnter = null,
                                       multiline = false,
                                       error = false,
                                       cols = 5,
                                       maxLength = 255,
                                       displayLabel = true,
                                       isNumeric = false,
    id=null
                                   }) {
    placeholder = disabled ? "" : placeholder;
    if (error) {
        className += "error ";
    }
    return (
        <div className="input-field">
            {(name && displayLabel && !toolTip) && <label htmlFor={id || name}>{name}
            </label>}
            {toolTip && <Tooltip tooltip={toolTip} name={name} label={name}/>}
            <div className="inner-input-field">
                {!multiline &&
                <input type={isNumeric ? "number" :"text"}
                       disabled={disabled}
                       value={value || ""}
                       id={id || name}
                       onChange={onChange}
                       onBlur={onBlur}
                       maxLength={maxLength}
                       placeholder={placeholder}
                       className={className}
                       onKeyDown={e => {
                           if (onEnter && e.keyCode === 13) {//enter
                               onEnter(e);
                           }
                       }}/>}
                {multiline &&
                <textarea disabled={disabled}
                          value={value}
                          id={id || name}
                          onChange={onChange}
                          onBlur={onBlur}
                          className={className}
                          onKeyDown={e => {
                              if (onEnter && e.keyCode === 13) {//enter
                                  onEnter(e);
                              }
                          }}
                          placeholder={placeholder}
                          cols={cols}/>}
            </div>
        </div>
    );
}
