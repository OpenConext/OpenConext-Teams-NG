import React from "react";
import "./SearchBar.scss";
import {ReactComponent as SearchIcon} from "../icons/search.svg";

export const SearchBar = ({searchQuery, setSearchQuery, searchInputRef}) => {
    return (
        <span className="search-bar">
            <input placeholder="Search"
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   ref={searchInputRef}
            />
            <SearchIcon/>
        </span>
    )
}