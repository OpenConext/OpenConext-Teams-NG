import React from "react";
import "./SearchBar.scss";
import {ReactComponent as SearchIcon} from "../icons/search.svg";
import I18n from "i18n-js";

export const SearchBar = ({searchQuery, setSearchQuery, searchInputRef}) => {
    return (
        <span className="search-bar">
            <input placeholder={I18n.t("forms.search")}
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   ref={searchInputRef}
            />
            <SearchIcon/>
        </span>
    )
}