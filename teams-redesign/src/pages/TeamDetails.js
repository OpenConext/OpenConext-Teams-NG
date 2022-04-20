import "./Home.scss";
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

const TeamDetail = ({user}) => {

    const params = useParams();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [team, setTeam] = useState({});

    useEffect(() => {
        getTeamDetail(params.teamId).then(res => {
            if (res.memberships) {
                setTeam(res);
                setLoaded(true);
            } else {
                navigate(`/join-request/${params.teamId}`)
            }

        });
    }, [params.teamId, navigate])

    const leaveTeam = () => {
        //TODO - show confirmation
        debugger;
        alert("Leave team");
    }

    const deleteTeam = () => {
        //TODO - show confirmation
        debugger;
        alert("Leave team");
    }

    const getActions = () => {
        const actions = [{
            name: I18n.t("details.leave"),
            action: leaveTeam
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
            <div className="team-details">
                TDOO
            </div>
        </Page>

    );

}
export default TeamDetail;