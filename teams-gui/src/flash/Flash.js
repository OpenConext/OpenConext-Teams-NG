import React, {useEffect, useState} from "react";
import {clearFlash, emitter} from "./events";
import {isEmpty} from "../utils/utils";
import "./Flash.scss";
import {ReactComponent as TimesIcon} from "../icons/times.svg";

const Flash = () => {

    const [flash, setFlash] = useState({msg: "", className: "hide", type: "info"});

    const callback = flashCtx => {
        if (isEmpty(flashCtx)) {
            setFlash({msg: "", className: "hide", type: "info"});
        } else {
            setFlash({msg: flashCtx.msg, className: "", type: flashCtx.type || "info"});
            if (flashCtx && (flashCtx.type || "info") === "info") {
                setTimeout(() => callback({}), 3500);
            }
        }
    }

    useEffect(() => {
        emitter.addListener("flash", callback);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={`flash-container ${flash.className} ${flash.type}`}>
            <div className={`flash ${flash.className} ${flash.type}`}>
                <div className="message-container">
                    <p className={`${flash.type}`}>{flash.msg}</p>
                </div>
                <a className="close" href="/close" onClick={clearFlash}>
                    <TimesIcon/>
                </a>
            </div>
        </div>
    );
}
export default Flash;