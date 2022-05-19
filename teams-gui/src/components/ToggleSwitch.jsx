import React from "react";
import "./ToggleSwitch.scss";

export default function ToggleSwitch({value, onChange}) {
    return (
        <label className="switch">
            <input type="checkbox" checked={value} disabled={true}/>
            <span className={`slider round ${value ? "checked" : ""}`}
                  onClick={() => onChange(!value)}/>
        </label>
    )

}
