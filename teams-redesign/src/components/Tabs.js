import React, {useState} from "react";
import "./Tabs.scss";

export const Tab = ({title, children}) => {
    return (
        {children}
    );
};


export const Tabs = ({children}) => {
    const [activeTab, setActiveTab] = useState(0);
    return (
        <div className="tabs">
            <div className={"tabs-nav-wrapper"}>
                <ul className="nav">
                    {children.map((tab, index) => {
                        return <TabNavItem key={index}
                                           id={index}
                                           title={tab.props.title}
                                           activeTab={activeTab}
                                           setActiveTab={setActiveTab}/>
                    })}
                </ul>
            </div>

            <div className="tab-display">
                {children.map((tab, index) => {
                    return <TabContent key={index} id={index} activeTab={activeTab}>
                        {tab.props.children}
                    </TabContent>
                })}
            </div>
        </div>
    );
};

const TabNavItem = ({id, title, activeTab, setActiveTab}) => {

    const handleClick = () => {
        setActiveTab(id);
    };

    return (
        <li onClick={handleClick} className={activeTab === id ? "active" : ""}>
            <h3>{title}</h3>
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
