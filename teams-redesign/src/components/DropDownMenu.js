import React, {useState} from "react";

import {ReactComponent as ArrowDown} from "../icons/arrow-down-1.svg";
import {ReactComponent as ArrowUp} from "../icons/arrow-up-1.svg";
import "./DropDownMenu.scss";

export const DropDownMenu = ({title, actions}) => {

    const [droppedDown, setDroppedDown] = useState(false);

    const performAction = action => {
        setDroppedDown(false);
        action.action();
    }

    return (
        <div className="dropdown-menu-container">
            <div className="dropdown-control"
                 onClick={() => setDroppedDown(!droppedDown)}
                 tabIndex={1}
                 onBlur={() => setTimeout(() => setDroppedDown(false), 250)}>
                <span>{title}</span>
                {droppedDown ? <ArrowUp/> : <ArrowDown/>}
            </div>
            {droppedDown && <div className="dropwdown-menu-items">
                <ul>
                    {actions.map(action =>
                        <li key={action.name} onClick={() => performAction(action)}>
                            <span>{action.name}</span>
                        </li>)}
                </ul>
            </div>}
        </div>
    );
}
