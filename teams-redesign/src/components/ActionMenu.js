import React, {useState} from "react";
import {ReactComponent as ArrowDown} from "../icons/arrow-down-1.svg";
import {ReactComponent as ArrowUp} from "../icons/arrow-up-1.svg";
import "./ActionMenu.scss";

export const ActionMenu = ({title, actions}) => {

    const [droppedDown, setDroppedDown] = useState(false);

    const performAction = action => {
        setDroppedDown(false);
        action();
    }

    return (
        <div className="action-menu-container">
            <div className="unit-menu"
                 onClick={() => setDroppedDown(!droppedDown)}
                 tabIndex={1}
                 onBlur={() => setTimeout(() => setDroppedDown(false), 250)}>
                <span>{title}</span>
                {droppedDown ? <ArrowUp/> : <ArrowDown/>}
            </div>
            {droppedDown && <div className="action-menu">
                <ul>
                    {actions.map(action =>
                        <li key={action.name} onClick={() => performAction(action.action)}>
                            <span>{action.name}</span>
                        </li>)}
                </ul>
            </div>}
        </div>
    );

}
