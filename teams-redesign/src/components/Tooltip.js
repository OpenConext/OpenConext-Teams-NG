import React from "react";
import informational from "../icons/alert-information-circle.svg";
import "./Tooltip.scss";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const TooltipIcon = ({tooltip}) =>
    <>
            <span className="tool-tip-section">
                 <Tippy interactive={true} content={<span dangerouslySetInnerHTML={{
                     __html: tooltip
                 }}/>}>
                    <img src={informational} alt="info"/>
                </Tippy>
            </span>
    </>

export default TooltipIcon;
