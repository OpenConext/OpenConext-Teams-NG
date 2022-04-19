import {Link} from "react-router-dom";
import arrowRight from "./../icons/arrow-right-1.svg";
import "./BreadCrumb.scss";

export const BreadCrumb = ({paths}) => {

    const isLast = index => paths.length === (index + 1);

    return (
        <div className="bread-crumb">
            {paths.map((path, index) => {
                const last = isLast(index);
                return <div key={index} className={`path ${isLast(index) ? "last" : ""}`}>
                    {!last && <Link to={path.to}>{path.name}</Link>}
                    {!last && <img src={arrowRight} alt={`/${path.tp}`}/>}
                    {last && <span>{path.name}</span>}
                </div>;
            })}
        </div>
    );

}



