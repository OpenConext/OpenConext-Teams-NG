import React from "react";
import informational from "../icons/alert-information-circle.svg";
import "./Tooltip.scss";
import Tippy from '@tippyjs/react';
// import 'tippy.js/dist/tippy.css';

const TooltipIcon = ({tooltip, name, label}) => {
    return <>
            <span className="tool-tip-section">
                <label htmlFor={name}>{label}</label>
                 <Tippy interactive={true} content={<span dangerouslySetInnerHTML={{
                     __html: tooltip
                 }}/>}>
                    <img src={informational} alt="info"/>
                </Tippy>
            </span>
    </>

}

export default TooltipIcon;
