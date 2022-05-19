import React from "react";
import {ReactComponent as CaretDown} from "../icons/caret-down.svg";
import {ReactComponent as CaretUp} from "../icons/caret-up.svg";
import "./SortButton.scss";


export const SortButton = ({header, currentSort}) => {
    if (currentSort.field !== header.sortField) {
        return null;
    }
    const isAscending = currentSort.direction === "ascending";
    return (
        <div className="sort-button-container">
            <div className="up-caret-container">
                {!isAscending && <CaretUp className="up-caret"/>}
            </div>
            <div className="down-caret-container">
                {isAscending && <CaretDown className="down-caret"/>}
            </div>
        </div>
    )
}