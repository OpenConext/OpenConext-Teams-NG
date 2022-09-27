import React, {useState} from "react";
import "./SearchBar.scss";
import {ReactComponent as SearchIcon} from "../icons/search.svg";
import I18n from "i18n-js";

export const SearchBar = ({searchQuery, setSearchQuery, searchInputRef}) => {
    const [hasFocus, setFocus] = useState(false);

    return (
        <span className={`search-bar ${hasFocus ? "focus" : ""}`}>
            <label htmlFor={"search"} className="visually-hidden">Search</label>
            <input id={"search"}
                   placeholder={I18n.t("forms.search")}
                   value={searchQuery}
                   type="search"
                   onBlur={() => setFocus(false)}
                   onFocus={() => setFocus(true)}
                   onChange={e => setSearchQuery(e.target.value)}
                   ref={searchInputRef}
            />
            <SearchIcon/>
        </span>
    )
}