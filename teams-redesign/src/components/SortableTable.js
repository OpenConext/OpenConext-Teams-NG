import React from "react";
import {SortButton} from "./SortButton";
import "./SortableTable.scss";


const renderHeader = (column, currentSort, setSort) => {

    const handleSort = () => {
        if (column.sortable) {
            const direction = currentSort.field === column.sortField ?
                (currentSort.direction === "ascending" ? "descending" : "ascending") : "ascending";
            setSort({field: column.sortField, direction: direction})
        }
    }

    return (
        <th className={column.name} key={column.name} onClick={handleSort}>
            <div className={`header-wrapper ${column.sortable ? "sortable" : ""}`}>
                {column.displayedName}
                {column.sortable ? <SortButton header={column} currentSort={currentSort}/> : null}
            </div>
        </th>)
}

export const SortableTable = ({currentSort, setSort, columns, children, customClassname}) => {

    return (
        <table className={`sortable-table ${customClassname}`}>
            <thead>
            <tr>
                {columns.map(column => renderHeader(column, currentSort, setSort))}
            </tr>
            </thead>
            <tbody>
            {children}
            </tbody>
        </table>
    )
}