import "./SubHeader.scss";

export const SubHeader = props =>
    <div className={"sub-header-container"}>
        <div className={`sub-header ${props.child ? "child" : ""}`}>
            {props.children}
        </div>

    </div>