import React, {useState} from "react";
import "./Tabs.scss";
import {useNavigate} from "react-router-dom";
import {stopEvent} from "../utils/utils";

export const Tab = ({children}) => {
    return (
        {children}
    );
};


export const Tabs = ({children, selectTab = 0}) => {
    const [activeTab, setActiveTab] = useState(selectTab);
    return (
        <div className="tabs">
            <div className={"tabs-nav-wrapper"}>
                <ul className="nav">
                    {children.map((tab, index) => {
                        return <TabNavItem key={index}
                                           id={index}
                                           title={tab.props.title}
                                           path={tab.props.path}
                                           activeTab={activeTab}
                                           setActiveTab={setActiveTab}/>
                    })}
                </ul>
            </div>

            <div className="tab-display">
                {children.map((tab, index) =>
                    <TabContent key={index} id={index} activeTab={activeTab}>
                        {tab.props.children}
                    </TabContent>
                )}
            </div>
        </div>
    );
};

const TabNavItem = ({id, title, path, activeTab, setActiveTab, moveFocus}) => {
    const navigate = useNavigate();

    const handleClick = (e, nextId = id) => {
        stopEvent(e);
        setActiveTab(id);
        if (path) {
            navigate(path);
        }
    };

    return (
        <li onClick={handleClick} className={activeTab === id ? "active" : ""}>
            <a className={"tab-link"}
               href={`/${title}`}
               onKeyDown={e => e.key === " " && handleClick()}
               onClick={handleClick}>{title}</a>
        </li>
    );
};

const TabContent = ({id, activeTab, children}) => {
    return (
        activeTab === id && <div className="tab-content">
            {children}
        </div>
    )
}
