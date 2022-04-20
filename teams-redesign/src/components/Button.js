import React from "react";
import {stopEvent} from "../utils/utils";
import "./Button.scss";

export const Button = ({
                           onClick,
                           txt,
                           disabled = false,
                           cancelButton = false,
                           className = ""
                       }) => {
    const cn = `button ${disabled ? "disabled" : ""} ${cancelButton ? "cancel" : "green"} ${className}`;
    const onClickInternal = e => {
        stopEvent(e);
        if (!disabled) {
            onClick && onClick();
        }
    }
    return (
        <a className={cn} href={`/${encodeURIComponent(txt)}`} onClick={onClickInternal}>
            {txt}
        </a>
    );
}