import React, {useEffect, useState} from "react";
import {emitter} from "./events";
import {isEmpty} from "../utils/utils";
import "./Flash.scss";
import success from "../icons/success.svg";

const Flash = () => {

    const [flash, setFlash] = useState({msg: "", className: "hide", type: "info"});

    const callback = flashCtx => {
        if (isEmpty(flashCtx)) {
            setFlash({msg: "", className: "hide", type: "info"});
            setTimeout(() => setFlash({msg: "", className: "hide", type: "info"}), 500);
        } else {
            setFlash({msg: flashCtx.msg, className: "", type: flashCtx.type || "info"});
            if (flashCtx && (flashCtx.type || "info") === "info") {
               setTimeout(() => callback({}), 6000);
            }
        }
    }

    useEffect(() => {
        emitter.addListener("flash", callback);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={`flash-container ${flash.className} ${flash.type}`}>
            <img src={success} alt="" aria-hidden="true"/>
            <p className={`${flash.type}`}>{flash.msg}</p>
        </div>
    );
}
export default Flash;