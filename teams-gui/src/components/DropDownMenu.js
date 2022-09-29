import React, {useRef, useState} from "react";

import {ReactComponent as ArrowDown} from "../icons/arrow-down-1.svg";
import {ReactComponent as ArrowUp} from "../icons/arrow-up-1.svg";
import "./DropDownMenu.scss";
import {stopEvent} from "../utils/utils";

export const DropDownMenu = ({title, actions}) => {
    const [droppedDown, setDroppedDown] = useState(false);
    const [activeItem, setActiveItem] = useState(-1);
    const component = useRef(null);

    const performAction = (action) => {
        setDroppedDown(false);
        setActiveItem(-1);
        action.action();
        // component.current.focus();
    };

    const buttonKeyDown = e => {
        if (e.key === "ArrowDown") {
            setDroppedDown(true);
            setActiveItem(Math.min(activeItem + 1, actions.length - 1));
        } else if (e.key === "ArrowUp") {
            setDroppedDown(true);
            setActiveItem(Math.max(activeItem - 1, 0));
        } else if (e.key === "Escape") {
            setDroppedDown(false);
            setActiveItem(-1);
        } else if ((e.key === "Enter" || e.key === " ") && activeItem !== -1 && droppedDown) {
            performAction(actions[activeItem]);
            stopEvent(e);
            return false;
        }
    }

    return (
        <div className="dropdown-menu-container">
            <button
                ref={component}
                className={`dropdown-control ${droppedDown ? "focus" : ""}`}
                aria-expanded={droppedDown}
                onClick={() => {
                    if (droppedDown) {
                        setActiveItem(-1);
                    }
                    setDroppedDown(!droppedDown);
                }}
                onKeyDown={buttonKeyDown}
                onBlur={() => setTimeout(() => setDroppedDown(false), 250)}
            >
                <span>{title}</span>
                {droppedDown ? <ArrowUp/> : <ArrowDown/>}
            </button>
            {droppedDown && (
                <div className="dropwdown-menu-items">
                    <ul className="dropdown-list">
                        {actions.map((action, index) => (
                            <li
                                className={`dropdown-list-items ${index === activeItem ? "active" : ""}`}
                                key={action.name}
                                onClick={() => performAction(action)}>
                                <span>{action.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
