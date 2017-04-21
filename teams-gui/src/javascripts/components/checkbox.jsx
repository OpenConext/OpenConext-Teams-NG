import React from "react";
import PropTypes from "prop-types";

export default function CheckBox({value, readOnly, onChange}) {
    return (
        <div className="checkbox">
            <input type="checkbox" id="viewable" name="viewable" checked={value}
                   onChange={onChange} disabled={readOnly}/>
            <label htmlFor="viewable">
                <span><i className="fa fa-check"></i></span>
            </label>
        </div>
    );

}

CheckBox.propTypes = {
    value: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};


