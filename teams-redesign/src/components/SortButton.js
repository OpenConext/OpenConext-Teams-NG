import React from "react";
import { ReactComponent as CaretDown } from "../icons/caret-down.svg";
import { ReactComponent as CaretUp } from "../icons/caret-up.svg";
import "./SortButton.scss";


export const SortButton = ({ onSort }) => {
    return (
        <div className="sort-button-container">
            <div className="up-caret-container" onClick={e => { onSort("ascending") }} >
                <CaretUp className="up-caret" />
            </div>
            <div className="down-caret-container" onClick={e => { onSort("descending") }} >
                <CaretDown className="down-caret" />
            </div>
        </div>
    )
}