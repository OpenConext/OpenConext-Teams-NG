import React, {useEffect, useRef, useState} from "react";
import {ReactComponent as ArrowDown} from "../icons/arrow-down-1.svg";
import {ReactComponent as ArrowUp} from "../icons/arrow-up-1.svg";
import "./ActionMenu.scss";
import {stopEvent} from "../utils/utils";

export const ActionMenu = ({title, actions}) => {

    const [droppedDown, setDroppedDown] = useState(false);
    const menuElement = useRef(null);

    useEffect(() => {
        menuElement.current.focus();
    }, []);

    const performAction = func => e => {
        stopEvent(e);
        func();
    }

    return (
        <div className="action-menu-container">
            <div className="unit-menu" onClick={() => setDroppedDown(!droppedDown)}>
                <span>{title}</span>
                {droppedDown ? <ArrowUp/> : <ArrowDown/>}
            </div>
        <div className="action-menu" ref={menuElement}
             tabIndex={1}
             onBlur={() => setTimeout(close, 250)}>
            <ul>
                {actions.map(action =>
                    <li key={action.name} onClick={performAction(action.perform)}>
                        <a href={"/" + action.name}>{action.name}</a>
                    </li>)}
            </ul>
        </div>
        </div>
    );

}
