import {Link} from "react-router-dom";
import arrowRight from "./../icons/arrow-right-1.svg";
import "./BreadCrumb.scss";
import {stopEvent} from "../utils/utils";

export const BreadCrumb = ({paths}) => {

    const isLast = index => paths.length === (index + 1);
    const doAction = action => e => {
        stopEvent(e);
        action();
    }
    const getLink = path => {
        return path.action ? <a href={path.to} onClick={doAction(path.action)}>{path.name}</a>
            : <Link to={path.to}>{path.name}</Link>
    }

    return (
        <div className="bread-crumb">
            {paths.map((path, index) => {
                const last = isLast(index);
                return <div key={index} className={`path ${isLast(index) ? "last" : ""}`}>
                    {!last && getLink(path)}
                    {!last && <img src={arrowRight} alt={`/${path.tp}`}/>}
                    {last && <span>{path.name}</span>}
                </div>;
            })}
        </div>
    );

}



