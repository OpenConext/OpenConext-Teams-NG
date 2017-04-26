import React from "react";
import PropTypes from "prop-types";

export default function CheckBox({name, value, readOnly = false, onChange, info = null}) {
    return (
        <div className="checkbox">
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
    readOnly: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    info: PropTypes.string,
};


