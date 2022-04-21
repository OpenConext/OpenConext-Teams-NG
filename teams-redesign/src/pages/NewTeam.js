import "./NewTeam.scss";
import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import "./TeamDetails.scss";
import MDEditor from '@uiw/react-md-editor';
import {teamExistsByName} from "../api";
import TooltipIcon from "../components/Tooltip";
import InputField from "../components/InputField";
import ErrorIndicator from "../components/ErrorIndicator";
import {isEmpty} from "../utils/utils";
import {ReactComponent as privateTeam} from "../icons/allowances-no-talking.svg";
import {ReactComponent as publicTeam} from "../icons/human-resources-offer-employee-1.svg";
import {ButtonContainer} from "../components/ButtonContainer";
import {Button} from "../components/Button";

const visibilities = [
    {name: "public", icon: publicTeam},
    {name: "private", icon: privateTeam}
];

const NewTeam = ({user}) => {

    const navigate = useNavigate();
    const [team, setTeam] = useState({viewable: true});
    const [errors, setErrors] = useState({});
    const [nameExist, setNameExists] = useState(false);
    const [initial, setInitial] = useState(true);

    useEffect(() => {
        if (user.person.guest) {
            navigate("/404");
        }
    }, [user, navigate])

    const viewableActive = name => (name === "public" && team.viewable) || (name === "private" && !team.viewable)

    return (
        <>
            <SubHeader>
                <BreadCrumb paths={[
                    {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
                    {name: I18n.t("breadcrumbs.newTeam")},
                ]}/>
            </SubHeader>
            <SubHeader child={true}>
                <h1>{I18n.t("breadcrumbs.newTeam")}</h1>
            </SubHeader>
            <Page>
                <div className="new-team">
                    <InputField value={team.name || ""}
                                onChange={e => {
                                    setTeam({...team, name: e.target.value.replace(/[\W -]+/g, "")});
                                    setNameExists(false)
                                }}
                                placeholder={I18n.t("newTeam.placeholders.name")}
                                onBlur={e => teamExistsByName(e.target.value).then(exists => setNameExists(exists))}
                                error={nameExist || (!initial && isEmpty(team.name))}
                                name={I18n.t("newTeam.name")}/>
                    {(!initial && isEmpty(team.name)) &&
                    <ErrorIndicator msg={I18n.t("forms.required", {
                        attribute: I18n.t("newTeam.name")
                    })}/>}

                    {nameExist &&
                    <ErrorIndicator msg={I18n.t("forms.alreadyExists", {
                        object: I18n.t("newTeam.object").toLowerCase(),
                        attribute: I18n.t("newTeam.name").toLowerCase(),
                        value: team.name
                    })}/>}

                    <div className="input-field">
                        <TooltipIcon tooltip={I18n.t("newTeam.tooltips.description")} name="description"
                                     label={I18n.t("newTeam.description")}/>
                        <MDEditor
                            value={team.description || ""}
                            onChange={val => setTeam({...team, description: val})}
                        />
                    </div>

                    <div className="input-field ">
                        <label>{I18n.t("newTeam.visibility")}</label>
                        <div className="team-visibilities">
                            {visibilities.map((visibility, i) =>
                                <div key={i} className={`visibility ${viewableActive(visibility.name) ? "active" : ""}`}
                                     onClick={() => !viewableActive(visibility.name) && setTeam({...team, viewable: !team.viewable})}>
                                    <section className="header">
                                        <visibility.icon/>
                                        <h2>{I18n.t(`newTeam.${visibility.name}`)}</h2>
                                    </section>
                                    <p>{I18n.t(`newTeam.${visibility.name}Info`)}</p>
                                </div>)}
                        </div>
                    </div>

                    <ButtonContainer>
                        <Button cancelButton={true}
                                onClick={() => navigate("/my-teams")}
                                txt={I18n.t("forms.cancel")}/>
                        <Button
                            onClick={() => alert("create")}
                            txt={I18n.t("newTeam.create")}/>
                    </ButtonContainer>

                </div>
            </Page>
        </>
    )
        ;

}
export default NewTeam;