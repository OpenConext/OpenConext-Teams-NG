import "./NewTeam.scss";
import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import "./JoinRequest.scss";
import {createJoinRequest, getJoinRequest, getTeamDetail} from "../api";
import InputField from "../components/InputField";
import {getDateString, isEmpty} from "../utils/utils";
import {ButtonContainer} from "../components/ButtonContainer";
import {Button} from "../components/Button";
import {setFlash} from "../flash/events";
import {SpinnerField} from "../components/SpinnerField";
import {MarkDown} from "../components/MarkDown";
import {EmailField} from "../components/EmailField";

export const JoinRequest = ({user}) => {
    const params = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState({});
    const [joinRequest, setJoinRequest] = useState({});
    const [message, setMessage] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const {teamId, joinRequestId} = params;
        if (joinRequestId) {
            Promise.all([getJoinRequest(joinRequestId, false), getTeamDetail(teamId, false)])
                .then(res => {
                    setJoinRequest(res[0]);
                    setTeam(res[1]);
                    setLoaded(true);
                }).catch(() => navigate("/404"));
        } else {
            getTeamDetail(teamId, false).then(res => {
                if (!isEmpty(res.memberships)) {
                    const member = res.memberships.find(membership => membership.urnPerson === user.urn);
                    if (member) {
                        navigate(`/team-details/${res.id}`);
                    }
                }
                setTeam(res);
                setLoaded(true);
            }).catch(() => navigate("/404"));
        }
    }, [navigate, params, user])

    const submit = () => {
        createJoinRequest({
            teamId: team.id,
            message: message
        }).then(() => {
            setFlash(I18n.t("joinRequest.flash", {name: team.name}));
            navigate("/my-teams")
        });
    }

    if (!loaded) {
        return <SpinnerField/>;
    }

    const emails = (team.admins || []).map((admin, index) =>
        `${admin.name} <${admin.email}>`);
    return (
        <>
            <SubHeader>
                <BreadCrumb paths={[
                    {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
                    {name: I18n.t("breadcrumbs.userJoinRequest")},
                ]}/>
            </SubHeader>
            <SubHeader child={true}>
                <h1>{I18n.t("breadcrumbs.userJoinRequest")}</h1>
            </SubHeader>
            <Page>
                <div className="join-request">
                    <InputField value={team.name}
                                disabled={true}
                                name={I18n.t("newTeam.name")}/>

                    <div className="input-field">
                        <label htmlFor={I18n.t("newTeam.name")}>{I18n.t("newTeam.description")}</label>
                        <MarkDown markdown={team.description}/>
                    </div>

                    <section className="input-field">
                        <label>{I18n.t("joinRequest.teamAdmins")}</label>
                        <EmailField emails={emails}
                                    marginTop={false}
                                    disabled={true}
                                    pinnedEmails={emails}/>

                    </section>
                    {joinRequest.id && <section className="input-field">
                        <label>{I18n.t("joinRequest.existingJoinRequest")}</label>
                        <span>{I18n.t("joinRequest.existingJoinRequestDetails", {date: getDateString(joinRequest.created)})}</span>
                    </section>}
                    <InputField value={message}
                                onChange={e => setMessage(e.target.value)}
                                multiline={true}
                                placeholder={I18n.t("joinRequest.invitationMessagePlaceholder")}
                                name={I18n.t("joinRequest.invitationMessage")}/>
                    <ButtonContainer>
                        <Button cancelButton={true}
                                onClick={() => navigate("/my-teams")}
                                txt={I18n.t("forms.cancel")}/>
                        <Button
                            onClick={submit}
                            disabled={isEmpty(message)}
                            txt={joinRequest.id ? I18n.t("forms.resend") : I18n.t("forms.submit")}/>
                    </ButtonContainer>

                </div>
            </Page>
        </>
    );

}
