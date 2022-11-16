import "./NewTeam.scss";
import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import "./TeamDetails.scss";
import {getTeamDetail, saveTeam, teamExistsByName} from "../api";
import TooltipIcon from "../components/Tooltip";
import InputField from "../components/InputField";
import ErrorIndicator from "../components/ErrorIndicator";
import {isEmpty, stopEvent} from "../utils/utils";
import {ReactComponent as privateTeam} from "../icons/allowances-no-talking.svg";
import {ReactComponent as publicTeam} from "../icons/human-resources-offer-employee-1.svg";
import {ButtonContainer} from "../components/ButtonContainer";
import {Button} from "../components/Button";
import {EmailField} from "../components/EmailField";
import {setFlash} from "../flash/events";
import {ROLES} from "../utils/roles";
import {SpinnerField} from "../components/SpinnerField";
import {MarkDown} from "../components/MarkDown";
import {CheckBox} from "../components/CheckBox";

const visibilities = [
    {name: "public", icon: publicTeam},
    {name: "private", icon: privateTeam}
];

const NewTeam = ({user}) => {
    const params = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState({viewable: true, publicLinkDisabled: true});
    const [loaded, setLoaded] = useState(false);
    const [backupEmails, setBackupEmails] = useState([]);
    const [errors, setErrors] = useState({});
    const [nameExist, setNameExists] = useState(false);
    const [initial, setInitial] = useState(true);

    useEffect(() => {
        if (user.person.guest) {
            navigate("/404");
        }
        const {teamId} = params;
        if (teamId) {
            getTeamDetail(teamId).then(res => {
                setTeam(res);
                setLoaded(true);
            })
        } else {
            setLoaded(true);
        }
    }, [params, user, navigate])

    const viewableActive = name => (name === "public" && team.viewable) || (name === "private" && !team.viewable)

    const isValid = () => {
        const hasErrors = Object.keys(errors).some(attr => errors[attr]);
        return !hasErrors && !nameExist && !isEmpty(team.name);
    }

    const submit = () => {
        setInitial(false);
        setErrors([]);
        if (isValid()) {
            const emailMap = backupEmails.reduce((acc, val) => {
                acc[val] = ROLES.ADMIN;
                return acc;
            }, {});
            saveTeam({...team, emails: emailMap}).then(res => {
                setFlash(I18n.t(`newTeam.flash.${team.id ? "updated" : "created"}`, {name: team.name}));
                navigate(`/team-details/${res.id}${team.id ? "" : "/members?initial=true"}`);
            })
        }
    }

    const addEmail = emails => {
        setBackupEmails(backupEmails.concat(emails));
        setTimeout(() => document.getElementById("invitation-messsage").focus(), 75);
    }

    const removeMail = email => e => {
        stopEvent(e);
        const newBackupEmails = backupEmails.filter(mail => mail !== email);
        setBackupEmails(newBackupEmails);
    };

    if (!loaded) {
        return <SpinnerField/>;
    }
    const breadCrumbs = [{name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"}];
    if (team.id) {
        breadCrumbs.push({name: team.name, to: `/team-details/${team.id}`});
    }
    breadCrumbs.push({name: I18n.t(`breadcrumbs.${team.id ? "editTeam" : "newTeam"}`, {name: ""})});

    return (
        <>
            <SubHeader>
                <BreadCrumb paths={breadCrumbs}/>
            </SubHeader>
            <SubHeader child={true}>
                <h1>{I18n.t(`breadcrumbs.${team.id ? "editTeam" : "newTeam"}`, {name: team.name})}</h1>
            </SubHeader>
            <Page>
                <form className="new-team" method={"POST"} onSubmit={stopEvent}>
                    <InputField value={team.name || ""}
                                onChange={e => {
                                    setTeam({...team, name: e.target.value.replace(/[^\w\s-]/gi, "")});
                                    setNameExists(false)
                                }}
                                toolTip={team.id ? I18n.t("newTeam.tooltips.immutableName") : ""}
                                aria-describedby={"team-name"}
                                disabled={team.id}
                                placeholder={I18n.t("newTeam.placeholders.name")}
                                onBlur={e => teamExistsByName(e.target.value).then(exists => setNameExists(exists))}
                                error={nameExist || (!initial && isEmpty(team.name))}
                                name={I18n.t("newTeam.name")}/>
                    {(!initial && isEmpty(team.name)) &&
                    <ErrorIndicator describedBy={"team-name"} msg={I18n.t("forms.required", {
                        attribute: I18n.t("newTeam.name")
                    })}/>}

                    {nameExist &&
                    <ErrorIndicator describedBy={"team-name"} msg={I18n.t("forms.alreadyExists", {
                        object: I18n.t("newTeam.object").toLowerCase(),
                        attribute: I18n.t("newTeam.name").toLowerCase(),
                        value: team.name
                    })}/>}

                    <div className="input-field">
                        <TooltipIcon tooltip={I18n.t("newTeam.tooltips.description")} name="description"
                                     label={I18n.t("newTeam.description")}/>
                        <MarkDown markdown={team.description || ""}
                                  onChange={val => setTeam({...team, description: val})}/>
                    </div>

                    <InputField value={team.personalNote || ""}
                                onChange={e => {
                                    setTeam({...team, personalNote: e.target.value});
                                }}
                                placeholder={I18n.t("teamDetails.personalNotesPlaceholder")}
                                multiline={true}
                                toolTip={I18n.t("newTeam.tooltips.personalNote")}
                                name={I18n.t("newTeam.personalNote")}/>

                    <div className="input-field ">
                        <CheckBox name={"public-link"}
                                  onChange={() => setTeam({...team, publicLinkDisabled: !team.publicLinkDisabled})}
                                  readOnly={!team.viewable}
                                  info={I18n.t("newTeam.publicLinkDisabled")}
                                  toolTip={I18n.t("newTeam.tooltips.publicLinkDisabled")}
                                  value={!team.publicLinkDisabled}/>
                    </div>

                    <div className="input-field ">
                        <CheckBox name={"hide-members"}
                                  onChange={() => setTeam({...team, hideMembers: !team.hideMembers})}
                                  info={I18n.t("newTeam.hideMembers")}
                                  toolTip={I18n.t("newTeam.tooltips.hideMembers")}
                                  value={team.hideMembers || false}/>
                    </div>

                    <div className="input-field ">
                        <label>{I18n.t("newTeam.visibility")}</label>
                        <div className="team-visibilities">
                            {visibilities.map((visibility, i) =>
                                <button key={i}
                                        className={`visibility ${viewableActive(visibility.name) ? "active" : ""}`}
                                        onClick={() => !viewableActive(visibility.name) && setTeam({
                                            ...team,
                                            viewable: !team.viewable,
                                            publicLinkDisabled: team.viewable || team.publicLinkDisabled
                                        })}>
                                    <section className="header">
                                        <visibility.icon/>
                                        <span className={"visibility"}>{I18n.t(`newTeam.${visibility.name}`)}</span>
                                    </section>
                                    <p>{I18n.t(`newTeam.${visibility.name}Info`)}</p>
                                </button>)}
                        </div>
                    </div>
                    {!team.id && <EmailField emails={backupEmails}
                                             addEmail={addEmail}
                                             singleEmail={true}
                                             removeMail={removeMail}
                                             name={I18n.t("newTeam.backupEmail")}
                                             placeHolder={I18n.t("newTeam.placeholders.backupEmail")}
                                             pinnedEmails={[user.person.email]}
                    />}

                    {!team.id && <InputField value={team.invitationMessage || ""}
                                             onChange={e => {
                                                 setTeam({...team, invitationMessage: e.target.value});
                                             }}
                                             id={"invitation-messsage"}
                                             multiline={true}
                                             placeholder={I18n.t("newTeam.placeholders.invitationMessage")}
                                             name={I18n.t("newTeam.invitationMessage")}/>}

                    <ButtonContainer>
                        <Button cancelButton={true}
                                onClick={() => navigate(team.id ? `/team-details/${team.id}` : "/my-teams")}
                                txt={I18n.t("forms.cancel")}/>
                        <Button
                            onClick={submit}
                            disabled={!initial && !isValid()}
                            txt={I18n.t(`${team.id ? "forms.save" : "newTeam.create"}`)}/>
                    </ButtonContainer>

                </form>
            </Page>
        </>
    );

}
export default NewTeam;