import React from "react";
import PropTypes from "prop-types";

export default function CheckBox({name, value, readOnly = false, onChange, info = null, className = "checkbox"}) {
    return (
        <div className={className}>
            <input type="checkbox" id={name} name={name} checked={value}
                   onChange={onChange} disabled={readOnly}/>
            <label htmlFor={name}>
                <span><i className="fa fa-check"></i></span>
            </label>
            {info && <em>{info}</em>}
        </div>
    );

}

CheckBox.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    info: PropTypes.string,
    className: PropTypes.string
};


