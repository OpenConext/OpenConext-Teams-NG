import "./NewTeam.scss";
import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import "./TeamDetails.scss";
import {teamExistsByName} from "../api";
import TooltipIcon from "../components/Tooltip";

const NewTeam = ({user}) => {

    const navigate = useNavigate();
    const [team, setTeam] = useState({});
    const [errors, setErrors] = useState({});
    const [nameExist, setNameExists] = useState(false);

    useEffect(() => {
        if (user.person.guest) {
            navigate("/404");
        }
    }, [user, navigate])

    return (
        <Page>
            <SubHeader>
                <BreadCrumb paths={[
                    {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
                    {name: I18n.t("breadcrumbs.newTeam")},
                ]}/>
            </SubHeader>
            <SubHeader child={true}>
                <h1>{I18n.t("breadcrumbs.newTeam")}</h1>
            </SubHeader>
            <div className="new-team">
                <div className="field-input">
                    <label htmlFor="name">{I18n.t("newTeam.name")}</label>
                    <input type="text"
                           maxLength={255}
                           value={team.name || ""}
                           placeholder={I18n.t("newTeam.placeholders.name")}
                           onChange={e => setTeam({...team, name: e.target.value.replace(/[\W -]+/g, "")})}
                           onBlur={e => teamExistsByName(e.target.value).then(exists => setNameExists(exists))}/>
                    {nameExist && <span className="error">{I18n.t("newTeam.nameExists")}</span>}
                </div>
                <div className="field-input">
                    <label htmlFor="description">{I18n.t("newTeam.description")}</label>
                    <TooltipIcon tooltip={I18n.t("newTeam.tooltips.description")}/>
                </div>
            </div>
        </Page>

    )
        ;

}
export default NewTeam;