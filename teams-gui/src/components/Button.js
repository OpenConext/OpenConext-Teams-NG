import React from "react";
import {stopEvent} from "../utils/utils";
import "./Button.scss";
import {ReactComponent as BinIcon} from "../icons/bin-1.svg";

export const Button = ({
                           onClick,
                           txt,
                           disabled = false,
                            deleteButton = false,
                           cancelButton = false,
                           className = ""
                       }) => {
    const cn = `button ${disabled ? "disabled" : ""} ${deleteButton ? "delete" : ""} ${cancelButton ? "cancel" : "green"} ${className}`;

    const onClickInternal = e => {
        stopEvent(e);
        if (!disabled) {
            onClick && onClick();
        }
    }

    return disabled ? <label className={cn}
           disabled={true}>
            {!deleteButton && txt}
            {deleteButton && <BinIcon/>}
        </label> :
        <a className={cn}
           href={`/${encodeURIComponent(txt)}`}
           onClick={onClickInternal}>
            {!deleteButton && txt}
            {deleteButton && <BinIcon/>}
        </a>

}