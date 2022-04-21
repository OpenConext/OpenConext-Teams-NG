import React from 'react';
import './index.scss';
import ReactDOM from "react-dom/client";
import App from './App';
import Cookies from "js-cookie";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./locale/en";
import "./locale/nl";

import I18n from "i18n-js";


const urlSearchParams = new URLSearchParams(window.location.search);
let parameterByName = urlSearchParams.get("lang");

if (!parameterByName) {
    parameterByName = Cookies.get("lang");
}

if (!parameterByName) {
    parameterByName = navigator.language.toLowerCase().substring(0, 2);
}
if (["nl", "en"].indexOf(parameterByName) === -1) {
    parameterByName = "en";
}
I18n.locale = parameterByName;
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/*" element={<App/>}/>
        </Routes>
    </BrowserRouter>
);
