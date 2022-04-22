import React from "react";
import {SortButton} from "./SortButton";
import "./SortableTable.scss";


const renderHeader = (header, setSort) => {
    const handleSort = (direction) => {
        setSort({field: header.sortField, direction: direction})
    }
    return (
        <th className={header.name} key={header.name}>
            <div className={"header-wrapper"}>
                {header.displayedName}
                {header.sortable ? <SortButton onSort={handleSort}/> : null}
            </div>
        </th>)
}

export const SortableTable = ({setSort, columns, children, customClassame}) => {

    return (
        <table className="sortable-table">
            <thead>
            <tr>
                {columns.map(column => renderHeader(column, setSort))}
            </tr>
            </thead>
            <tbody>
            {children}
            </tbody>
        </table>
    )
}