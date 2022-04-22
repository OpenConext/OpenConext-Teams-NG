import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getTeamDetail} from "../api";
import I18n from "i18n-js";
import {ActionMenu} from "../components/ActionMenu";
import {actionDropDownTitle, getRole, ROLES} from "../utils/roles";
import {SpinnerField} from "../components/SpinnerField";
import "./TeamDetails.scss";
import ConfirmationDialog from "../components/ConfirmationDialog";

const TeamDetail = ({user}) => {

    const params = useParams();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [team, setTeam] = useState({});

    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);


    useEffect(() => {
        getTeamDetail(params.teamId)
            .then(res => {
                if (res.memberships) {
                    setTeam(res);
                    setLoaded(true);
                } else {
                    navigate(`/join-request/${params.teamId}`)
                }

            }).catch(() => navigate("/404"));
    }, [params.teamId, navigate])


    const leaveTeam = showConfirmation => () => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: leaveTeam(false),
                warning: false,
                question: I18n.t("details.confirmations.leave")
            });
            setConfirmationOpen(true);
        } else {
            alert("Leave team");
        }
    }

    const deleteTeam = () => {
        //TODO - show confirmation
        alert("Leave team");
    }

    const getActions = () => {
        const actions = [{
            name: I18n.t("details.leave"),
            action: leaveTeam(true)
        }];
        const role = getRole(team, user);
        if (role === ROLES.ADMIN || role === ROLES.OWNER) {
            actions.push({
                name: I18n.t("details.delete"),
                action: deleteTeam
            })
        }
        return actions;
    }

    if (!loaded) {
        return <SpinnerField/>;
    }

    return (
        <Page>
            <SubHeader>
                <BreadCrumb paths={[
                    {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
                    {name: team.name},
                ]}/>
            </SubHeader>
            <SubHeader>
                <div className="team-actions">
                    <div>
                        <h1>{team.name}</h1>
                        <p>{team.description}</p>
                    </div>
                    <ActionMenu title={actionDropDownTitle(team, user)}
                                actions={getActions()}/>
                </div>
            </SubHeader>
            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}
            <div className="team-details">
                TDOO
            </div>
        </Page>

    );

}
export default TeamDetail;