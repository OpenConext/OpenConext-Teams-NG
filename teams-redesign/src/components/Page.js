import "./Page.scss";

export const Page = props =>
    <div className="page-container">
        <div className="page">
            {props.children}
        </div>
    </div>