import React from "react";
import "./ErrorIndicator.scss";
import critical from "../icons/critical.svg";

const ErrorIndicator = ({msg, describedBy, standalone = false}) => {
    const className = `error-indication ${standalone ? "standalone" : ""}`;
    return (
        <span id={describedBy} className={className} aria-live="polite">
            <img src={critical} alt="" aria-hidden="true"/>
            <span dangerouslySetInnerHTML={{__html: msg}}/>
        </span>);
}
export default ErrorIndicator