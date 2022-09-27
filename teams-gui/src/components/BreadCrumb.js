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
        <nav className="bread-crumb" aria-label="breadcrumb">
            <ol>
                {paths.map((path, index) => {
                    const last = isLast(index);
                    return <li key={index} className={`path ${isLast(index) ? "last" : ""}`}>
                        {!last && getLink(path)}
                        {!last && <img src={arrowRight} alt="" aria-hidden="true"/>}
                        {last && <span aria-current="page">{path.name}</span>}
                    </li>;
                })}
            </ol>
        </nav>
    );

}



