import React from "react";
import {ReactComponent as CaretDown} from "../icons/caret-down.svg";
import {ReactComponent as CaretUp} from "../icons/caret-up.svg";
import "./SortButton.scss";


export const SortButton = ({header, currentSort}) => {
    const passive = currentSort.field !== header.sortField;

    const isAscending = currentSort.direction === "ascending";
    return (
        <button className={`sort-button-container ${passive ? "passive" : ""}`}>
            <span className="visually-hidden">{`Sort ${header.sortField} ${isAscending ? "Down": "Up"}`}</span>
            <div className="up-caret-container" aria-hidden="true">
                {!isAscending && <CaretUp className="up-caret"/>}
            </div>
            <div className="down-caret-container" aria-hidden="true">
                {isAscending && <CaretDown className="down-caret"/>}
            </div>
        </button>
    )
}