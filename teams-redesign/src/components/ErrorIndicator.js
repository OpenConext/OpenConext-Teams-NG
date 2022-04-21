import React from "react";
import "./ErrorIndicator.scss";
import critical from "../icons/critical.svg"

const ErrorIndicator = ({msg, standalone = false}) => {
    const className = `error-indication ${standalone ? "standalone" : ""}`;
    return (
        <span className={className}>
            <img src={critical} alt="critical"/>
            <span dangerouslySetInnerHTML={{__html: msg}}/>
        </span>);
}
export default ErrorIndicator